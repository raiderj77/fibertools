import { createHash, randomUUID } from "node:crypto";
import {
  STITCHPROOF_AMOUNT_CENTS, STITCHPROOF_CREATE_RETRY_MS, STITCHPROOF_OFFER_VERSION,
  STITCHPROOF_SCHEMA_VERSION, STITCHPROOF_SERVICE, STITCHPROOF_STRIPE_ACCOUNT_ID,
  getStitchProofConfiguration, validStitchProofTaxContract,
} from "./stitchproof-purchase-config.mjs";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const HASH = /^[0-9a-f]{64}$/;
const HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0", Pragma: "no-cache",
  "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff", "Content-Type": "application/json; charset=utf-8",
});
const SESSION_EVENTS = new Set(["checkout.session.completed", "checkout.session.expired",
  "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed"]);
const FINANCIAL_EVENTS = new Set(["charge.refunded", "refund.created", "refund.updated", "refund.failed",
  "charge.dispute.created", "charge.dispute.updated", "charge.dispute.closed"]);
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const accessResponse = (status = "unavailable", httpStatus = 200) => response({ status }, httpStatus);
const checkoutFailure = (status = 503) => response({ error: "Checkout unavailable. Do not pay again while a previous payment is being checked." }, status);
const resourceId = (value) => typeof value === "string" ? value : value?.id;
const nonnegative = (value) => Number.isSafeInteger(value) && value >= 0;
const sessionIdValid = (value, live) => typeof value === "string"
  && new RegExp(`^cs_${live ? "live" : "test"}_[A-Za-z0-9]+$`).test(value) && value.length <= 255;
const nowDate = (now) => now instanceof Date && Number.isFinite(now.getTime()) ? now : new Date();

async function readBoundedBody(request, limit) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return body + decoder.decode();
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); return null; }
      body += decoder.decode(value, { stream: true });
    }
  } finally { reader.releaseLock(); }
}

function purchaseMatchesClaim(purchase, claim, live) {
  return purchase?.projectId === claim.projectId && purchase.claimSha256 === claim.claimSha256
    && purchase.stripeLivemode === live;
}

export async function readStitchProofClaim(request, configuration) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return null;
  const origin = request.headers.get("origin");
  if (origin && origin !== configuration.siteOrigin) return null;
  if (request.headers.get("sec-fetch-site") === "cross-site") return null;
  const declared = Number(request.headers.get("content-length") || "0");
  if (!Number.isSafeInteger(declared) || declared < 0 || declared > 1024) return null;
  let payload;
  try {
    const body = await readBoundedBody(request, 1024);
    if (body === null) return null;
    payload = JSON.parse(body);
  } catch { return null; }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)
    || Object.keys(payload).length !== 2 || !Object.hasOwn(payload, "projectId")
    || !Object.hasOwn(payload, "claimSecret") || typeof payload.projectId !== "string"
    || typeof payload.claimSecret !== "string" || !UUID_V4.test(payload.projectId)
    || !HASH.test(payload.claimSecret)) return null;
  return { projectId: payload.projectId, claimSha256: createHash("sha256").update(payload.claimSecret, "utf8").digest("hex") };
}

function contractFor(configuration) {
  return {
    stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID,
    productId: configuration.productId, priceId: configuration.priceId,
    offerVersion: STITCHPROOF_OFFER_VERSION, amountCents: STITCHPROOF_AMOUNT_CENTS, currency: "usd",
    taxMode: configuration.taxMode, taxBehavior: configuration.taxBehavior,
  };
}

/** Explicit provider parameters keep dashboard defaults and recovery links from
 * changing the USD/card-only offer or creating a checkout outside our ledger. */
export function buildStitchProofCheckoutParameters({ purchase, successUrl, cancelUrl }) {
  const metadata = {
    service: STITCHPROOF_SERVICE, offer_version: purchase.attempt.offerVersion,
    project_id: purchase.projectId, attempt_id: purchase.attempt.id, claim_sha256: purchase.claimSha256,
  };
  return {
    mode: "payment", ui_mode: "hosted", submit_type: "pay",
    line_items: [{ price: purchase.attempt.priceId, quantity: 1, adjustable_quantity: { enabled: false } }],
    payment_method_types: ["card"], allow_promotion_codes: false,
    automatic_tax: { enabled: purchase.attempt.taxMode === "automatic" },
    adaptive_pricing: { enabled: false }, after_expiration: { recovery: { enabled: false } },
    phone_number_collection: { enabled: false },
    client_reference_id: purchase.projectId, metadata,
    payment_intent_data: { metadata, capture_method: "automatic" },
    success_url: successUrl, cancel_url: cancelUrl, expand: ["line_items.data.price.product"],
  };
}

function validAttempt(purchase, configuration) {
  const attempt = purchase?.attempt;
  return Boolean(attempt && typeof purchase.projectId === "string" && UUID_V4.test(purchase.projectId)
    && typeof purchase.claimSha256 === "string" && HASH.test(purchase.claimSha256)
    && purchase.stripeLivemode === configuration.stripeLivemode
    && typeof attempt.id === "string" && UUID_V4.test(attempt.id)
    && attempt.stripeAccountId === STITCHPROOF_STRIPE_ACCOUNT_ID
    && typeof attempt.productId === "string" && /^prod_[A-Za-z0-9]+$/.test(attempt.productId)
    && typeof attempt.priceId === "string" && /^price_[A-Za-z0-9]+$/.test(attempt.priceId)
    && attempt.offerVersion === STITCHPROOF_OFFER_VERSION && attempt.amountCents === STITCHPROOF_AMOUNT_CENTS
    && attempt.currency === "usd" && validStitchProofTaxContract(attempt.taxMode, attempt.taxBehavior));
}

function metadataMatches(metadata, purchase) {
  return metadata?.service === STITCHPROOF_SERVICE && metadata.offer_version === STITCHPROOF_OFFER_VERSION
    && metadata.project_id === purchase.projectId && metadata.attempt_id === purchase.attempt.id
    && metadata.claim_sha256 === purchase.claimSha256;
}

function priceMatches(price, contract, { sale = false, live } = {}) {
  const product = price?.product;
  return Boolean(price?.id === contract.priceId && price.object === "price"
    && price.currency === "usd" && price.unit_amount === STITCHPROOF_AMOUNT_CENTS
    && price.type === "one_time" && !price.recurring && price.livemode === live
    && resourceId(product) === contract.productId
    && (contract.taxMode !== "automatic" || price.tax_behavior === contract.taxBehavior)
    && (!sale || (price.active === true && product && typeof product === "object"
      && product.object === "product" && product.active === true && product.livemode === live
      && product.metadata?.service === STITCHPROOF_SERVICE
      && product.metadata?.offer_version === STITCHPROOF_OFFER_VERSION)));
}

function sessionMatches(session, purchase, configuration) {
  const attempt = purchase.attempt;
  const items = session?.line_items;
  const line = items?.data?.[0];
  const details = session?.total_details;
  if (!sessionIdValid(session?.id, configuration.stripeLivemode)
    || (attempt.checkoutSessionId && session.id !== attempt.checkoutSessionId)
    || session.object !== "checkout.session" || session.mode !== "payment"
    || session.livemode !== configuration.stripeLivemode || !metadataMatches(session.metadata, purchase)
    || session.client_reference_id !== purchase.projectId
    || !Array.isArray(session.payment_method_types) || session.payment_method_types.length !== 1
    || session.payment_method_types[0] !== "card" || session.allow_promotion_codes !== false
    || session.currency !== "usd" || session.amount_subtotal !== STITCHPROOF_AMOUNT_CENTS
    || !nonnegative(session.amount_total) || !details || details.amount_discount !== 0
    || details.amount_shipping !== 0 || !nonnegative(details.amount_tax)
    || !items || items.has_more !== false || !Array.isArray(items.data) || items.data.length !== 1
    || line.quantity !== 1 || line.currency !== "usd" || line.amount_subtotal !== STITCHPROOF_AMOUNT_CENTS
    || line.amount_discount !== 0 || line.amount_tax !== details.amount_tax || line.amount_total !== session.amount_total
    || !priceMatches(line.price, attempt, { live: configuration.stripeLivemode })
    || session.automatic_tax?.enabled !== (attempt.taxMode === "automatic")) return false;
  if (attempt.taxMode === "none") return details.amount_tax === 0 && session.amount_total === STITCHPROOF_AMOUNT_CENTS;
  if (session.status === "complete" && session.automatic_tax?.status !== "complete") return false;
  return attempt.taxBehavior === "inclusive"
    ? details.amount_tax <= STITCHPROOF_AMOUNT_CENTS && session.amount_total === STITCHPROOF_AMOUNT_CENTS
    : session.amount_total === STITCHPROOF_AMOUNT_CENTS + details.amount_tax;
}

export function validatedStitchProofCheckoutUrl(session, configuration) {
  if (!sessionIdValid(session?.id, configuration.stripeLivemode) || typeof session.url !== "string" || session.url.length > 8192) return null;
  try {
    const url = new URL(session.url);
    if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com" || url.port
      || url.username || url.password || ![ `/c/pay/${session.id}`, `/pay/${session.id}` ].includes(url.pathname)) return null;
    return url.toString();
  } catch { return null; }
}

async function verifyAccount(configuration, dependencies) {
  return (await dependencies.stripe.retrieveAccount(configuration))?.id === STITCHPROOF_STRIPE_ACCOUNT_ID;
}

async function verifySales(configuration, dependencies) {
  const account = await dependencies.stripe.retrieveAccount(configuration);
  return account?.id === STITCHPROOF_STRIPE_ACCOUNT_ID && account.charges_enabled === true
    && await dependencies.repository.verifySchema(configuration) === STITCHPROOF_SCHEMA_VERSION
    && priceMatches(await dependencies.stripe.retrievePrice(configuration), contractFor(configuration), {
      sale: true, live: configuration.stripeLivemode,
    });
}

export async function getStitchProofCheckoutAvailability({ env = process.env, dependencies }) {
  const configuration = getStitchProofConfiguration(env, { checkout: true });
  if (!configuration) return { available: false };
  try { return { available: Boolean(await verifySales(configuration, dependencies)) }; }
  catch { return { available: false }; }
}

/** Stripe, not a cached database or browser flag, is the financial source of truth. */
export async function verifyStitchProofPurchase(purchase, configuration, dependencies) {
  if (!validAttempt(purchase, configuration) || !purchase.attempt.checkoutSessionId) return { status: "unavailable" };
  const session = await dependencies.stripe.retrieveCheckoutSession(purchase.attempt.checkoutSessionId, configuration);
  if (!sessionMatches(session, purchase, configuration)) return { status: "unavailable" };
  if (session.status === "expired" && session.payment_status === "unpaid") return { status: "expired", session };
  if (session.status === "open" && session.payment_status === "unpaid") return { status: "pending", session };
  if (session.status !== "complete") return { status: "unavailable", session };
  if (session.payment_status !== "paid") return { status: "pending", session };
  const paymentIntentId = resourceId(session.payment_intent);
  if (typeof paymentIntentId !== "string" || !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)
    || (purchase.attempt.paymentIntentId && purchase.attempt.paymentIntentId !== paymentIntentId)) return { status: "unavailable", session };
  const payment = await dependencies.stripe.retrievePaymentIntent(paymentIntentId, configuration);
  if (payment?.id !== paymentIntentId || payment.object !== "payment_intent"
    || payment.livemode !== configuration.stripeLivemode || payment.status !== "succeeded"
    || payment.currency !== "usd" || payment.amount !== session.amount_total
    || payment.amount_received !== session.amount_total || !metadataMatches(payment.metadata, purchase)) return { status: "unavailable", session };
  const chargeId = resourceId(payment.latest_charge);
  if (typeof chargeId !== "string" || !/^ch_[A-Za-z0-9]+$/.test(chargeId)) return { status: "unavailable", session };
  const charge = await dependencies.stripe.retrieveCharge(chargeId, configuration);
  if (charge?.id !== chargeId || charge.object !== "charge" || charge.livemode !== configuration.stripeLivemode
    || resourceId(charge.payment_intent) !== paymentIntentId || charge.paid !== true || charge.captured !== true
    || charge.status !== "succeeded" || charge.currency !== "usd" || charge.amount !== session.amount_total
    || charge.payment_method_details?.type !== "card"
    || !nonnegative(charge.amount_refunded) || charge.amount_refunded > charge.amount
    || typeof charge.refunded !== "boolean" || typeof charge.disputed !== "boolean") return { status: "unavailable", session };
  const [refunds, disputes] = await Promise.all([
    dependencies.stripe.listRefunds(chargeId, configuration),
    dependencies.stripe.listDisputes(chargeId, configuration),
  ]);
  if (!refunds || refunds.has_more !== false || !Array.isArray(refunds.data)
    || !disputes || disputes.has_more !== false || !Array.isArray(disputes.data)) return { status: "unavailable", session };
  for (const refund of refunds.data) {
    if (typeof refund.id !== "string" || !/^re_[A-Za-z0-9]+$/.test(refund.id) || refund.object !== "refund"
      || resourceId(refund.charge) !== chargeId || resourceId(refund.payment_intent) !== paymentIntentId
      || refund.currency !== "usd" || (typeof refund.livemode === "boolean" && refund.livemode !== configuration.stripeLivemode)
      || !nonnegative(refund.amount) || refund.amount > charge.amount
      || !["pending", "requires_action", "succeeded", "failed", "canceled"].includes(refund.status)) return { status: "unavailable", session };
  }
  if (charge.refunded || charge.amount_refunded > 0 || refunds.data.some((refund) => refund.amount > 0
    && ["pending", "requires_action", "succeeded"].includes(refund.status))) return { status: "refunded", session, paymentIntentId };
  for (const dispute of disputes.data) {
    if (typeof dispute.id !== "string" || !/^dp_[A-Za-z0-9]+$/.test(dispute.id) || dispute.object !== "dispute"
      || resourceId(dispute.charge) !== chargeId || resourceId(dispute.payment_intent) !== paymentIntentId
      || dispute.livemode !== configuration.stripeLivemode || dispute.currency !== "usd"
      || !nonnegative(dispute.amount) || typeof dispute.status !== "string") return { status: "unavailable", session };
  }
  if ((charge.disputed && disputes.data.length === 0)
    || disputes.data.some((dispute) => !["won", "warning_closed", "prevented"].includes(dispute.status))) return { status: "disputed", session, paymentIntentId };
  return { status: "paid", session, paymentIntentId };
}

async function recordVerification(purchase, result, dependencies, verifiedAt) {
  if (!result.session) return;
  const saved = await dependencies.repository.recordVerification({
    attemptId: purchase.attempt.id, projectId: purchase.projectId, stripeLivemode: purchase.stripeLivemode,
    sessionId: result.session.id, paymentIntentId: result.paymentIntentId ?? resourceId(result.session.payment_intent) ?? null,
    status: result.status, verifiedAt,
  });
  if (saved !== true) throw new Error("Purchase verification could not be recorded.");
}

async function checkoutForPurchase(purchase, configuration, dependencies, now) {
  if (!validAttempt(purchase, configuration)) return checkoutFailure();
  const attempt = purchase.attempt;
  if (attempt.checkoutSessionId) {
    const result = await verifyStitchProofPurchase(purchase, configuration, dependencies);
    await recordVerification(purchase, result, dependencies, now.toISOString());
    if (result.status === "paid") return response({ status: "paid" });
    if (result.status === "pending" && result.session?.status === "open") {
      const url = validatedStitchProofCheckoutUrl(result.session, configuration);
      return url ? response({ checkoutUrl: url }) : checkoutFailure();
    }
    if (result.status !== "expired") return checkoutFailure(409);
    const next = await dependencies.repository.reserveAttempt({
      projectId: purchase.projectId, claimSha256: purchase.claimSha256, stripeLivemode: purchase.stripeLivemode,
      attemptId: randomUUID(), expectedAttemptId: attempt.id, contract: contractFor(configuration),
    });
    if (!next || !purchaseMatchesClaim(next, purchase, purchase.stripeLivemode) || next.attempt?.id === attempt.id) return checkoutFailure(409);
    return createReservedCheckout(next, configuration, dependencies, now);
  }
  return createReservedCheckout(purchase, configuration, dependencies, now);
}

async function createReservedCheckout(purchase, configuration, dependencies, now) {
  if (!validAttempt(purchase, configuration)) return checkoutFailure();
  if (purchase.attempt.checkoutSessionId) return checkoutForPurchase(purchase, configuration, dependencies, now);
  const age = now.getTime() - Date.parse(purchase.attempt.createdAt);
  if (purchase.attempt.status !== "creating" || !Number.isFinite(age) || age < -300_000 || age > STITCHPROOF_CREATE_RETRY_MS) return checkoutFailure(409);
  const session = await dependencies.stripe.createCheckoutSession({ purchase,
    successUrl: configuration.successUrl, cancelUrl: configuration.cancelUrl },
  `stitchproof-${configuration.stripeLivemode ? "live" : "test"}-${purchase.attempt.id}`, configuration);
  const bound = { ...purchase, attempt: { ...purchase.attempt, checkoutSessionId: session?.id } };
  if (!sessionMatches(session, bound, configuration)
    || session.success_url !== configuration.successUrl || session.cancel_url !== configuration.cancelUrl
    || !Number.isSafeInteger(session.expires_at)) return checkoutFailure();
  const attached = await dependencies.repository.attachCheckout({ projectId: purchase.projectId,
    stripeLivemode: purchase.stripeLivemode, attemptId: purchase.attempt.id,
    sessionId: session.id, paymentIntentId: resourceId(session.payment_intent) ?? null,
    expiresAt: new Date(session.expires_at * 1000).toISOString() });
  if (attached !== true) return checkoutFailure();
  // A bounded retry can recover the same already-paid session after a save
  // timeout. Never create a replacement just because the first save failed.
  if (session.status === "complete") {
    const result = await verifyStitchProofPurchase(bound, configuration, dependencies);
    await recordVerification(bound, result, dependencies, now.toISOString());
    return result.status === "paid" ? response({ status: "paid" }) : checkoutFailure(409);
  }
  if (session.status !== "open" || session.payment_status !== "unpaid"
    || session.expires_at * 1000 <= now.getTime()) return checkoutFailure(409);
  const url = validatedStitchProofCheckoutUrl(session, configuration);
  if (!url) return checkoutFailure();
  return response({ checkoutUrl: url });
}

export async function handleStitchProofCheckoutRequest({ request, env = process.env, dependencies, now }) {
  if (request.method === "GET") return response(await getStitchProofCheckoutAvailability({ env, dependencies }));
  if (request.method !== "POST") return checkoutFailure(405);
  const core = getStitchProofConfiguration(env);
  if (!core) return checkoutFailure();
  const claim = await readStitchProofClaim(request, core);
  if (!claim) return checkoutFailure(400);
  try {
    if (!await verifyAccount(core, dependencies)) return checkoutFailure();
    const purchase = await dependencies.repository.loadPurchase({ ...claim, stripeLivemode: core.stripeLivemode });
    if (purchase && !purchaseMatchesClaim(purchase, claim, core.stripeLivemode)) return checkoutFailure();
    // A paid project remains usable when new sales are disabled or today's price changes.
    if (purchase?.attempt?.checkoutSessionId) {
      const result = await verifyStitchProofPurchase(purchase, core, dependencies);
      await recordVerification(purchase, result, dependencies, nowDate(now).toISOString());
      if (result.status === "paid") return response({ status: "paid" });
      if (["refunded", "disputed", "unavailable"].includes(result.status)) return checkoutFailure(409);
    }
    const configuration = getStitchProofConfiguration(env, { checkout: true });
    if (!configuration || !await verifySales(configuration, dependencies)) return checkoutFailure();
    const reserved = purchase ?? await dependencies.repository.reserveAttempt({ ...claim,
      stripeLivemode: configuration.stripeLivemode, attemptId: randomUUID(), expectedAttemptId: null,
      contract: contractFor(configuration) });
    if (!reserved || !purchaseMatchesClaim(reserved, claim, configuration.stripeLivemode)) return checkoutFailure(409);
    return await checkoutForPurchase(reserved, configuration, dependencies, nowDate(now));
  } catch { return checkoutFailure(); }
}

export async function handleStitchProofAccessRequest({ request, env = process.env, dependencies, now }) {
  if (request.method !== "POST") return accessResponse("unavailable", 405);
  const configuration = getStitchProofConfiguration(env);
  if (!configuration) return accessResponse();
  const claim = await readStitchProofClaim(request, configuration);
  if (!claim) return accessResponse("unavailable", 400);
  try {
    if (!await verifyAccount(configuration, dependencies)) return accessResponse();
    const purchase = await dependencies.repository.loadPurchase({ ...claim, stripeLivemode: configuration.stripeLivemode });
    if (!purchase || !purchaseMatchesClaim(purchase, claim, configuration.stripeLivemode)
      || !validAttempt(purchase, configuration)) return accessResponse();
    if (!purchase.attempt?.checkoutSessionId) return accessResponse("pending");
    const result = await verifyStitchProofPurchase(purchase, configuration, dependencies);
    await recordVerification(purchase, result, dependencies, nowDate(now).toISOString());
    return accessResponse(result.status === "paid" ? "paid" : result.status === "pending" ? "pending" : "unavailable");
  } catch { return accessResponse(); }
}

function ownedMetadata(metadata) {
  if (metadata?.service !== STITCHPROOF_SERVICE) return null;
  if (metadata.offer_version !== STITCHPROOF_OFFER_VERSION || typeof metadata.project_id !== "string"
    || typeof metadata.attempt_id !== "string" || typeof metadata.claim_sha256 !== "string"
    || !UUID_V4.test(metadata.project_id) || !UUID_V4.test(metadata.attempt_id) || !HASH.test(metadata.claim_sha256)) throw new Error("Invalid purchase binding.");
  return { projectId: metadata.project_id, attemptId: metadata.attempt_id, claimSha256: metadata.claim_sha256 };
}

export async function handleStitchProofWebhookRequest({ request, env = process.env, dependencies, now }) {
  if (request.method !== "POST") return response({ received: false }, 405);
  const configuration = getStitchProofConfiguration(env, { webhook: true });
  if (!configuration) return response({ received: false }, 503);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return response({ received: false }, 400);
  let event;
  try {
    const rawBody = await readBoundedBody(request, 1_000_000);
    if (rawBody === null) return response({ received: false }, 413);
    event = dependencies.stripe.constructWebhookEvent(rawBody, signature, configuration);
  } catch { return response({ received: false }, 400); }
  if (typeof event?.id !== "string" || !/^evt_[A-Za-z0-9]+$/.test(event.id)
    || event.livemode !== configuration.stripeLivemode || (event.account && event.account !== STITCHPROOF_STRIPE_ACCOUNT_ID)) return response({ received: false }, 400);
  if (!SESSION_EVENTS.has(event.type) && !FINANCIAL_EVENTS.has(event.type)) return response({ received: true, handled: false });
  try {
    if (!await verifyAccount(configuration, dependencies)) return response({ received: false }, 503);
    if (await dependencies.repository.hasWebhookEvent({ eventId: event.id, stripeLivemode: configuration.stripeLivemode })) return response({ received: true, handled: true, duplicate: true });
    const object = event.data?.object;
    if (!object || typeof object.id !== "string" || (typeof object.livemode === "boolean" && object.livemode !== event.livemode)) return response({ received: false }, 400);
    let binding;
    let sessionId;
    if (SESSION_EVENTS.has(event.type)) {
      binding = ownedMetadata(object.metadata);
      sessionId = object.id;
    } else {
      let paymentIntentId = resourceId(object.payment_intent);
      if (!paymentIntentId && resourceId(object.charge)) {
        const charge = await dependencies.stripe.retrieveCharge(resourceId(object.charge), configuration);
        if (charge?.livemode !== event.livemode) throw new Error("Wrong payment mode.");
        paymentIntentId = resourceId(charge.payment_intent);
      }
      if (!paymentIntentId) return response({ received: true, handled: false });
      const payment = await dependencies.stripe.retrievePaymentIntent(paymentIntentId, configuration);
      if (payment?.livemode !== event.livemode || payment.id !== paymentIntentId) throw new Error("Wrong payment mode.");
      binding = ownedMetadata(payment.metadata);
    }
    if (!binding) return response({ received: true, handled: false });
    let purchase = await dependencies.repository.loadWebhookAttempt({ ...binding, stripeLivemode: configuration.stripeLivemode });
    if (!purchase || !purchaseMatchesClaim(purchase, binding, configuration.stripeLivemode)
      || purchase.attempt?.id !== binding.attemptId || !validAttempt(purchase, configuration)) throw new Error("Purchase binding unavailable.");
    if (sessionId && !purchase.attempt.checkoutSessionId) {
      if (!sessionIdValid(sessionId, configuration.stripeLivemode)) throw new Error("Invalid checkout reference.");
      const session = await dependencies.stripe.retrieveCheckoutSession(sessionId, configuration);
      const bound = { ...purchase, attempt: { ...purchase.attempt, checkoutSessionId: sessionId } };
      if (!sessionMatches(session, bound, configuration) || !Number.isSafeInteger(session.expires_at)) throw new Error("Wrong checkout binding.");
      if (!await dependencies.repository.attachCheckout({ projectId: purchase.projectId,
        stripeLivemode: purchase.stripeLivemode, attemptId: purchase.attempt.id, sessionId,
        paymentIntentId: resourceId(session.payment_intent) ?? null, expiresAt: new Date(session.expires_at * 1000).toISOString() })) throw new Error("Checkout binding unavailable.");
      purchase = bound;
    }
    if (sessionId && sessionId !== purchase.attempt.checkoutSessionId) throw new Error("Wrong checkout reference.");
    const result = await verifyStitchProofPurchase(purchase, configuration, dependencies);
    if (!result.session || result.status === "unavailable") throw new Error("Payment verification unavailable.");
    const processed = await dependencies.repository.recordWebhookEvent({ eventId: event.id, eventType: event.type,
      projectId: purchase.projectId, attemptId: purchase.attempt.id, stripeLivemode: purchase.stripeLivemode,
      sessionId: result.session.id, paymentIntentId: result.paymentIntentId ?? resourceId(result.session.payment_intent) ?? null,
      status: result.status, verifiedAt: nowDate(now).toISOString() });
    return response({ received: true, handled: true, duplicate: processed !== true });
  } catch { return response({ received: false }, 503); }
}
