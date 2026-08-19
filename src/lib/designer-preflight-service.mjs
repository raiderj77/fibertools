import { validatePreflightSubmission } from "./designer-preflight-validation.mjs";

export const PREFLIGHT_AMOUNT_CENTS = 900;
export const PREFLIGHT_SERVICE_KEY = "designer_pattern_preflight";
const SUBMISSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Create one pending submission and one Stripe Checkout Session.
 * Provider dependencies are injected so retries and error behavior can be tested without credentials.
 */
export async function createPreflightCheckout(payload, dependencies) {
  const validation = validatePreflightSubmission(payload);
  if (!validation.success) return { ok: false, kind: "validation", errors: validation.errors };

  const existing = await dependencies.repository.findByRequestId(validation.data.requestId);
  if (existing?.checkoutUrl) {
    return { ok: true, duplicate: true, submissionId: existing.id, checkoutUrl: existing.checkoutUrl };
  }

  let submission = existing;
  if (!submission) {
    try {
      submission = await dependencies.repository.create(validation.data);
    } catch (error) {
      if (!dependencies.repository.isDuplicateRequestError(error)) throw error;
      submission = await dependencies.repository.findByRequestId(validation.data.requestId);
      if (!submission) throw error;
      if (submission.checkoutUrl) {
        return { ok: true, duplicate: true, submissionId: submission.id, checkoutUrl: submission.checkoutUrl };
      }
    }
  }

  const checkout = await dependencies.checkout.createSession(
    {
      submissionId: submission.id,
      customerEmail: validation.data.email,
      amountCents: PREFLIGHT_AMOUNT_CENTS,
      serviceKey: PREFLIGHT_SERVICE_KEY,
    },
    `designer-preflight-${validation.data.requestId}`
  );

  if (!checkout?.id || !checkout?.url) throw new Error("Checkout provider returned no usable session.");
  await dependencies.repository.saveCheckout(submission.id, checkout.id, checkout.url);

  return { ok: true, duplicate: false, submissionId: submission.id, checkoutUrl: checkout.url };
}

export async function handlePreflightWebhook(rawBody, signature, dependencies) {
  if (!signature) return { ok: false, status: 400, error: "Missing Stripe signature." };

  let event;
  try {
    event = dependencies.constructEvent(rawBody, signature);
  } catch {
    return { ok: false, status: 400, error: "Invalid Stripe signature." };
  }

  const session = event?.data?.object;
  const supportedPaymentEvent =
    event?.type === "checkout.session.completed" || event?.type === "checkout.session.async_payment_succeeded";
  const supportedLifecycleEvent = supportedPaymentEvent || event?.type === "checkout.session.expired";

  if (!supportedLifecycleEvent) return { ok: true, handled: false, duplicate: false };
  if (
    !session ||
    session.metadata?.service !== PREFLIGHT_SERVICE_KEY ||
    typeof session.metadata?.submission_id !== "string" ||
    !SUBMISSION_ID_PATTERN.test(session.metadata.submission_id)
  ) {
    return { ok: false, status: 400, error: "Invalid preflight event metadata." };
  }

  if (supportedPaymentEvent && session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return { ok: true, handled: false, duplicate: false };
  }

  const processed = await dependencies.repository.recordStripeEvent({
    eventId: event.id,
    eventType: event.type,
    submissionId: session.metadata.submission_id,
    checkoutSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    paymentStatus: supportedPaymentEvent ? "paid" : "expired",
  });

  return { ok: true, handled: true, duplicate: !processed };
}
