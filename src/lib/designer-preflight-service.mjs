import { validatePreflightSubmission } from "./designer-preflight-validation.mjs";

export const PREFLIGHT_AMOUNT_CENTS = 3900;
export const PREFLIGHT_SERVICE_KEY = "designer_pattern_preflight";
export const PREFLIGHT_ORPHAN_RETRY_MAX_AGE_MS = 60 * 60 * 1000;

export function stripeSecretKeyLivemode(secretKey) {
  if (typeof secretKey !== "string") throw new Error("Stripe key is required.");
  if (secretKey.startsWith("sk_test_") || secretKey.startsWith("rk_test_")) return false;
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) return true;
  throw new Error("Stripe key must be a supported secret or restricted key.");
}

const SUBMISSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SESSION_EVENT_TYPES = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);
const FINANCIAL_EVENT_TYPES = new Set([
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.updated",
  "charge.dispute.closed",
]);
const DISPUTE_STATUSES = new Set([
  "lost",
  "needs_response",
  "prevented",
  "under_review",
  "warning_closed",
  "warning_needs_response",
  "warning_under_review",
  "won",
]);
const MAX_FUTURE_CLOCK_SKEW_MS = 5 * 60 * 1000;

function stripeObjectId(value) {
  if (typeof value === "string") return value;
  return value && typeof value.id === "string" ? value.id : null;
}

function nonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function inspectServiceMetadata(metadata) {
  if (metadata?.service !== PREFLIGHT_SERVICE_KEY) return { owned: false };
  if (typeof metadata?.submission_id !== "string" || !SUBMISSION_ID_PATTERN.test(metadata.submission_id)) {
    return { owned: true, valid: false };
  }
  return { owned: true, valid: true, submissionId: metadata.submission_id };
}

function validateEventMode(event, expectedLivemode) {
  if (typeof event?.livemode !== "boolean") {
    return { ok: false, status: 400, error: "Stripe event did not declare test/live mode." };
  }
  if (event.livemode !== expectedLivemode) {
    return { ok: false, status: 400, error: "Stripe event mode does not match this endpoint." };
  }
  return { ok: true };
}

async function resolvePaymentIntentContext(financialObject, dependencies, eventLivemode) {
  let paymentIntentId = stripeObjectId(financialObject?.payment_intent);

  if (!paymentIntentId && financialObject?.charge) {
    if (typeof dependencies.retrieveCharge !== "function") {
      throw new Error("Charge lookup is unavailable for this dispute event.");
    }
    const charge = await dependencies.retrieveCharge(stripeObjectId(financialObject.charge));
    if (!charge || charge.livemode !== eventLivemode) {
      return { ok: false, status: 400, error: "Stripe charge mode mismatch." };
    }
    paymentIntentId = stripeObjectId(charge.payment_intent);
  }

  if (!paymentIntentId || typeof dependencies.retrievePaymentIntent !== "function") {
    return { ok: false, status: 400, error: "Stripe payment reference is missing." };
  }

  const paymentIntent = await dependencies.retrievePaymentIntent(paymentIntentId);
  if (!paymentIntent || paymentIntent.livemode !== eventLivemode) {
    return { ok: false, status: 400, error: "Stripe payment mode mismatch." };
  }

  const ownership = inspectServiceMetadata(paymentIntent.metadata);
  if (!ownership.owned) return { ok: true, handled: false };
  if (!ownership.valid) return { ok: false, status: 400, error: "Invalid preflight payment metadata." };

  return {
    ok: true,
    handled: true,
    paymentIntentId,
    submissionId: ownership.submissionId,
  };
}

/**
 * Create one pending submission and one Stripe Checkout Session.
 * Provider dependencies are injected so retries and error behavior can be tested without credentials.
 */
export async function createPreflightCheckout(payload, dependencies) {
  const validation = validatePreflightSubmission(payload);
  if (!validation.success) return { ok: false, kind: "validation", errors: validation.errors };
  if (typeof dependencies.expectedLivemode !== "boolean") {
    throw new Error("Expected Stripe mode is required.");
  }
  if (dependencies.checkout?.configuredLivemode !== dependencies.expectedLivemode) {
    throw new Error("Checkout provider configuration does not match the expected Stripe mode.");
  }

  const assertMatchingRequestMode = (submission) => {
    if (!submission) return;
    if (submission.stripeLivemode === null) {
      throw new Error("This request ID belongs to a legacy submission whose Stripe mode requires owner reconciliation.");
    }
    if (submission.stripeLivemode !== dependencies.expectedLivemode) {
      throw new Error("This request ID is already bound to the other Stripe mode.");
    }
  };

  const outcomeForExistingSubmission = (submission) => {
    assertMatchingRequestMode(submission);
    if (submission.paymentStatus !== "pending") {
      return {
        ok: false,
        kind: "terminal",
        code: submission.paymentStatus === "expired" || submission.paymentStatus === "failed"
          ? "fresh_request_required"
          : "request_already_processed",
      };
    }

    const expiresAt = submission.checkoutExpiresAt ? Date.parse(submission.checkoutExpiresAt) : Number.NaN;
    if (
      submission.checkoutSessionId &&
      submission.checkoutUrl &&
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now() + 30_000
    ) {
      return { ok: true, duplicate: true, submissionId: submission.id, checkoutUrl: submission.checkoutUrl };
    }

    const createdAt = submission.createdAt ? Date.parse(submission.createdAt) : Number.NaN;
    const ageMs = Date.now() - createdAt;
    if (
      submission.checkoutSessionId == null &&
      submission.checkoutUrl == null &&
      Number.isFinite(createdAt) &&
      ageMs >= -MAX_FUTURE_CLOCK_SKEW_MS &&
      ageMs <= PREFLIGHT_ORPHAN_RETRY_MAX_AGE_MS
    ) {
      return { ok: false, kind: "retryable_orphan" };
    }
    return { ok: false, kind: "reconciliation", code: "checkout_reconciliation_required" };
  };

  const existing = await dependencies.repository.findByRequestId(validation.data.requestId);
  let submission;
  let recoveredOrphan = false;
  if (existing) {
    const outcome = outcomeForExistingSubmission(existing);
    if (outcome.kind !== "retryable_orphan") return outcome;
    submission = existing;
    recoveredOrphan = true;
  } else {
    try {
      submission = await dependencies.repository.create(validation.data, dependencies.expectedLivemode);
    } catch (error) {
      if (!dependencies.repository.isDuplicateRequestError(error)) throw error;
      const racedSubmission = await dependencies.repository.findByRequestId(validation.data.requestId);
      if (!racedSubmission) throw error;
      const outcome = outcomeForExistingSubmission(racedSubmission);
      if (outcome.kind !== "retryable_orphan") return outcome;
      submission = racedSubmission;
      recoveredOrphan = true;
    }
  }

  const checkout = await dependencies.checkout.createSession(
    {
      submissionId: submission.id,
      customerEmail: validation.data.email,
      amountCents: PREFLIGHT_AMOUNT_CENTS,
      serviceKey: PREFLIGHT_SERVICE_KEY,
    },
    `designer-preflight-${dependencies.expectedLivemode ? "live" : "test"}-${validation.data.requestId}-initial`
  );

  if (!checkout?.id || !checkout?.url) throw new Error("Checkout provider returned no usable session.");
  if (checkout.liveMode !== dependencies.expectedLivemode) {
    throw new Error("Checkout provider returned a session in the wrong Stripe mode.");
  }
  const checkoutExpiry = checkout.expiresAt ? Date.parse(checkout.expiresAt) : Number.NaN;
  if (!Number.isFinite(checkoutExpiry) || checkoutExpiry <= Date.now()) {
    throw new Error("Checkout provider returned an invalid expiration.");
  }
  await dependencies.repository.saveCheckout(
    submission.id,
    checkout.id,
    checkout.url,
    checkout.liveMode,
    checkout.expiresAt
  );

  return { ok: true, duplicate: recoveredOrphan, submissionId: submission.id, checkoutUrl: checkout.url };
}

export async function handlePreflightWebhook(rawBody, signature, dependencies) {
  if (!signature) return { ok: false, status: 400, error: "Missing Stripe signature." };
  if (typeof dependencies.expectedLivemode !== "boolean") {
    throw new Error("Expected Stripe mode is required.");
  }

  let event;
  try {
    event = dependencies.constructEvent(rawBody, signature);
  } catch {
    return { ok: false, status: 400, error: "Invalid Stripe signature." };
  }

  if (!SESSION_EVENT_TYPES.has(event?.type) && !FINANCIAL_EVENT_TYPES.has(event?.type)) {
    return { ok: true, handled: false, duplicate: false };
  }

  const mode = validateEventMode(event, dependencies.expectedLivemode);
  if (!mode.ok) return mode;

  const stripeObject = event?.data?.object;
  if (typeof event?.id !== "string" || !stripeObject || typeof stripeObject.id !== "string") {
    return { ok: false, status: 400, error: "Stripe event object is missing." };
  }
  if (typeof stripeObject.livemode === "boolean" && stripeObject.livemode !== event.livemode) {
    return { ok: false, status: 400, error: "Stripe object mode mismatch." };
  }

  let record;

  if (SESSION_EVENT_TYPES.has(event.type)) {
    const ownership = inspectServiceMetadata(stripeObject.metadata);
    if (!ownership.owned) return { ok: true, handled: false, duplicate: false };
    if (!ownership.valid) {
      return { ok: false, status: 400, error: "Invalid preflight event metadata." };
    }

    const paidEvent =
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded";
    if (
      paidEvent &&
      stripeObject.payment_status !== "paid"
    ) {
      return { ok: true, handled: false, duplicate: false };
    }

    const paidAmount = paidEvent ? nonNegativeInteger(stripeObject.amount_total) : null;
    if (paidEvent && paidAmount !== PREFLIGHT_AMOUNT_CENTS) {
      return { ok: false, status: 400, error: "Stripe paid amount is invalid." };
    }

    const paymentState = paidEvent
      ? "paid"
      : event.type === "checkout.session.async_payment_failed"
        ? "failed"
        : "expired";
    record = {
      eventId: event.id,
      eventType: event.type,
      submissionId: ownership.submissionId,
      checkoutSessionId: stripeObject.id,
      paymentIntentId: stripeObjectId(stripeObject.payment_intent),
      stripeObjectId: stripeObject.id,
      stripeLivemode: event.livemode,
      paymentState,
      amountPaidCents: paymentState === "paid" ? paidAmount : null,
      amountRefundedCents: null,
      disputeId: null,
      disputeStatus: null,
      failureCode: paymentState === "failed" ? "async_payment_failed" : null,
    };
  } else {
    const paymentContext = await resolvePaymentIntentContext(stripeObject, dependencies, event.livemode);
    if (!paymentContext.ok) return paymentContext;
    if (!paymentContext.handled) return { ok: true, handled: false, duplicate: false };

    if (event.type === "charge.refunded") {
      const amountPaidCents = nonNegativeInteger(stripeObject.amount);
      const amountRefundedCents = nonNegativeInteger(stripeObject.amount_refunded);
      if (
        amountPaidCents === null ||
        amountPaidCents <= 0 ||
        amountRefundedCents === null ||
        amountRefundedCents <= 0 ||
        amountRefundedCents > amountPaidCents
      ) {
        return { ok: false, status: 400, error: "Stripe refund amounts are invalid." };
      }
      const fullyRefunded = stripeObject.refunded === true || amountRefundedCents >= amountPaidCents;
      record = {
        eventId: event.id,
        eventType: event.type,
        submissionId: paymentContext.submissionId,
        checkoutSessionId: null,
        paymentIntentId: paymentContext.paymentIntentId,
        stripeObjectId: stripeObject.id,
        stripeLivemode: event.livemode,
        paymentState: fullyRefunded ? "refunded" : "partially_refunded",
        amountPaidCents,
        amountRefundedCents,
        disputeId: null,
        disputeStatus: null,
        failureCode: null,
      };
    } else {
      const disputeStatus = typeof stripeObject.status === "string" && DISPUTE_STATUSES.has(stripeObject.status)
        ? stripeObject.status
        : null;
      if (!disputeStatus) {
        return { ok: false, status: 400, error: "Stripe dispute status is unsupported." };
      }
      const paymentState = event.type === "charge.dispute.created"
        ? "disputed"
        : disputeStatus === "won"
          ? "dispute_won"
          : disputeStatus === "lost"
            ? "dispute_lost"
            : "disputed";
      record = {
        eventId: event.id,
        eventType: event.type,
        submissionId: paymentContext.submissionId,
        checkoutSessionId: null,
        paymentIntentId: paymentContext.paymentIntentId,
        stripeObjectId: stripeObject.id,
        stripeLivemode: event.livemode,
        paymentState,
        amountPaidCents: nonNegativeInteger(stripeObject.amount),
        amountRefundedCents: null,
        disputeId: stripeObject.id,
        disputeStatus,
        failureCode: null,
      };
    }
  }

  const processed = await dependencies.repository.recordStripeEvent(record);
  return { ok: true, handled: true, duplicate: !processed };
}
