import { createHash, randomUUID } from "node:crypto";
import {
  STITCHPROOF_AMOUNT_CENTS, STITCHPROOF_CREATE_RETRY_MS, STITCHPROOF_OFFER_VERSION,
  STITCHPROOF_MANAGED_OFFER_VERSION, STITCHPROOF_SERVICE, STITCHPROOF_STRIPE_ACCOUNT_ID,
  getStitchProofConfiguration, validStitchProofProductTaxCode, validStitchProofTaxContract,
} from "./stitchproof-purchase-config.mjs";
import { STITCHPROOF_MARKET_POLICY_VERSION, isStitchProofPurchaseCountry } from "./stitchproof-markets.mjs";

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

export async function readStitchProofClaim(request, configuration, { checkout = false } = {}) {
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
  const hasCountry = payload && Object.hasOwn(payload, "country");
  if (!payload || typeof payload !== "object" || Array.isArray(payload)
    || Object.keys(payload).length !== (checkout && hasCountry ? 3 : 2)
    || (hasCountry && (!checkout || !isStitchProofPurchaseCountry(payload.country)))
    || !Object.hasOwn(payload, "projectId")
    || !Object.hasOwn(payload, "claimSecret") || typeof payload.projectId !== "string"
    || typeof payload.claimSecret !== "string" || !UUID_V4.test(payload.projectId)
    || !HASH.test(payload.claimSecret)) return null;
  return { projectId: payload.projectId, claimSha256: createHash("sha256").update(payload.claimSecret, "utf8").digest("hex"),
    ...(hasCountry ? { country: payload.country } : {}) };
}

function contractFor(configuration) {
  return {
    stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID,
    productId: configuration.productId, priceId: configuration.priceId,
    offerVersion: configuration.taxMode === "managed" ? STITCHPROOF_MANAGED_OFFER_VERSION : STITCHPROOF_OFFER_VERSION,
    amountCents: STITCHPROOF_AMOUNT_CENTS, currency: "usd",
    taxMode: configuration.taxMode, taxBehavior: configuration.taxBehavior,
    ...(configuration.taxMode === "managed" ? { purchaseCountry: configuration.purchaseCountry,
      marketPolicyVersion: configuration.marketPolicyVersion, productTaxCode: configuration.managedProductTaxCode } : {}),
  };
}

function currentSalesContractMatches(purchase, configuration) {
  return Object.entries(contractFor(configuration)).every(([key, value]) => purchase.attempt[key] === value);
}

/** Managed Payments owns tax, FX and method selection. Unsupported options must
 * be omitted, not sent with false values. The legacy card-only path is separate. */
export function buildStitchProofCheckoutParameters({ purchase, successUrl, cancelUrl }) {
  const managed = purchase.attempt.taxMode === "managed";
  const metadata = {
    service: STITCHPROOF_SERVICE, offer_version: purchase.attempt.offerVersion,
    project_id: purchase.projectId, attempt_id: purchase.attempt.id, claim_sha256: purchase.claimSha256,
    ...(managed ? { purchase_country: purchase.attempt.purchaseCountry,
      market_policy_version: purchase.attempt.marketPolicyVersion, product_tax_code: purchase.attempt.productTaxCode } : {}),
  };
  return {
    mode: "payment", ui_mode: managed ? "hosted_page" : "hosted", submit_type: "pay",
    line_items: [{ price: purchase.attempt.priceId, quantity: 1, adjustable_quantity: { enabled: false } }],
    ...(managed ? { managed_payments: { enabled: true } } : {
      payment_method_types: ["card"], automatic_tax: { enabled: purchase.attempt.taxMode === "automatic" },
      adaptive_pricing: { enabled: false },
    }),
    allow_promotion_codes: false, after_expiration: { recovery: { enabled: false } },
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
    && attempt.amountCents === STITCHPROOF_AMOUNT_CENTS && attempt.currency === "usd"
    && validStitchProofTaxContract(attempt.taxMode, attempt.taxBehavior)
    && (attempt.taxMode === "managed"
      ? attempt.offerVersion === STITCHPROOF_MANAGED_OFFER_VERSION
        && isStitchProofPurchaseCountry(attempt.purchaseCountry)
        && attempt.marketPolicyVersion === STITCHPROOF_MARKET_POLICY_VERSION
        && validStitchProofProductTaxCode(attempt.productTaxCode)
      : attempt.offerVersion === STITCHPROOF_OFFER_VERSION
        && attempt.purchaseCountry == null && attempt.marketPolicyVersion == null && attempt.productTaxCode == null));
}

function metadataMatches(metadata, purchase) {
  return metadata?.service === STITCHPROOF_SERVICE && metadata.offer_version === purchase.attempt.offerVersion
    && metadata.project_id === purchase.projectId && metadata.attempt_id === purchase.attempt.id
    && metadata.claim_sha256 === purchase.claimSha256
    && (purchase.attempt.taxMode !== "managed" || (metadata.purchase_country === purchase.attempt.purchaseCountry
      && metadata.market_policy_version === purchase.attempt.marketPolicyVersion
      && metadata.product_tax_code === purchase.attempt.productTaxCode));
}

function priceMatches(price, contract, { sale = false, live } = {}) {
  const product = price?.product;
  return Boolean(price?.id === contract.priceId && price.object === "price"
    && price.currency === "usd" && price.unit_amount === STITCHPROOF_AMOUNT_CENTS
    && price.type === "one_time" && !price.recurring && price.livemode === live
    && resourceId(product) === contract.productId
    && (contract.taxMode === "none" || price.tax_behavior === contract.taxBehavior)
    && (!sale || (price.active === true && product && typeof product === "object"
      && product.object === "product" && product.active === true && product.livemode === live
      && product.metadata?.service === STITCHPROOF_SERVICE
      && product.metadata?.offer_version === contract.offerVersion
      && (contract.taxMode !== "managed" || (resourceId(product.tax_code) === contract.productTaxCode
        // Manually localized Prices change the integration-currency contract.
        // The adapter explicitly expands this optional field for sales checks.
        && price.currency_options && typeof price.currency_options === "object"
        && !Array.isArray(price.currency_options)
        && Object.keys(price.currency_options).every((currency) => currency === "usd"))))));
}

function managedMethodsMatch(methods) {
  // Stripe Support must configure this subset; the API cannot request it.
  // This is not proof that Radar covers every Link funding source.
  return Array.isArray(methods) && methods.includes("card") && new Set(methods).size === methods.length
    && methods.every((method) => method === "card" || method === "link");
}

function validPresentment(details, amount) {
  return details == null || (typeof details === "object" && !Array.isArray(details)
    && Number.isSafeInteger(details.presentment_amount) && details.presentment_amount > 0
    && typeof details.presentment_currency === "string" && /^[a-z]{3}$/.test(details.presentment_currency)
    && (details.presentment_currency !== "usd" || details.presentment_amount === amount));
}

function samePresentment(left, right, amount) {
  if (!validPresentment(left, amount) || !validPresentment(right, amount)) return false;
  return left == null || right == null ? left == null && right == null
    : left.presentment_amount === right.presentment_amount && left.presentment_currency === right.presentment_currency;
}

function sessionMatches(session, purchase, configuration) {
  const attempt = purchase.attempt;
  const items = session?.line_items;
  const line = items?.data?.[0];
  const details = session?.total_details;
  const managed = attempt.taxMode === "managed";
  if (!sessionIdValid(session?.id, configuration.stripeLivemode)
    || (attempt.checkoutSessionId && session.id !== attempt.checkoutSessionId)
    || session.object !== "checkout.session" || session.mode !== "payment"
    || session.livemode !== configuration.stripeLivemode || !metadataMatches(session.metadata, purchase)
    || session.client_reference_id !== purchase.projectId
    || (managed ? !managedMethodsMatch(session.payment_method_types)
      : !Array.isArray(session.payment_method_types) || session.payment_method_types.length !== 1 || session.payment_method_types[0] !== "card")
    || session.allow_promotion_codes !== false
    || session.currency !== "usd" || !nonnegative(session.amount_subtotal)
    || (!managed && session.amount_subtotal !== STITCHPROOF_AMOUNT_CENTS)
    || !nonnegative(session.amount_total) || !details || details.amount_discount !== 0
    || details.amount_shipping !== 0 || !nonnegative(details.amount_tax)
    || !items || items.has_more !== false || !Array.isArray(items.data) || items.data.length !== 1
    || line.quantity !== 1 || line.currency !== "usd" || line.amount_subtotal !== session.amount_subtotal
    || line.amount_discount !== 0 || line.amount_tax !== details.amount_tax || line.amount_total !== session.amount_total
    || !priceMatches(line.price, attempt, { live: configuration.stripeLivemode })) return false;
  if (managed) {
    if (session.managed_payments?.enabled !== true || !validPresentment(session.presentment_details, session.amount_total)
      || (session.status === "complete" && session.automatic_tax?.status != null && session.automatic_tax.status !== "complete")) return false;
    // Documented subtotal is before tax. Real inclusive-tax and localized-charge
    // fixtures remain a release gate; no estimated rate or FX conversion is used.
    return attempt.taxBehavior === "inclusive"
      ? session.amount_total === STITCHPROOF_AMOUNT_CENTS && details.amount_tax <= STITCHPROOF_AMOUNT_CENTS
        && session.amount_subtotal + details.amount_tax === STITCHPROOF_AMOUNT_CENTS
      : session.amount_subtotal === STITCHPROOF_AMOUNT_CENTS && session.amount_total === STITCHPROOF_AMOUNT_CENTS + details.amount_tax;
  }
  if (session.managed_payments?.enabled === true || session.automatic_tax?.enabled !== (attempt.taxMode === "automatic")) return false;
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
    && await dependencies.repository.verifySchema(configuration) === configuration.schemaVersion
    && priceMatches(await dependencies.stripe.retrievePrice(configuration), contractFor(configuration), {
      sale: true, live: configuration.stripeLivemode,
    });
}

export async function getStitchProofCheckoutAvailability({ env = process.env, dependencies }) {
  const configuration = getStitchProofConfiguration(env, { checkout: true });
  if (!configuration) return { available: false };
  try {
    if (!await verifySales(configuration, dependencies)) return { available: false };
    return configuration.taxMode === "managed"
      ? { available: true, checkoutMode: "managed", marketPolicyVersion: STITCHPROOF_MARKET_POLICY_VERSION }
      : { available: true };
  }
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
  const managed = purchase.attempt.taxMode === "managed";
  if (payment?.id !== paymentIntentId || payment.object !== "payment_intent"
    || payment.livemode !== configuration.stripeLivemode || payment.status !== "succeeded"
    || payment.currency !== "usd" || payment.amount !== session.amount_total
    || payment.amount_received !== session.amount_total || !metadataMatches(payment.metadata, purchase)
    || (managed ? payment.managed_payments?.enabled !== true
      || !samePresentment(session.presentment_details, payment.presentment_details, session.amount_total)
      : payment.managed_payments?.enabled === true)) return { status: "unavailable", session };
  const chargeId = resourceId(payment.latest_charge);
  if (typeof chargeId !== "string" || !/^ch_[A-Za-z0-9]+$/.test(chargeId)) return { status: "unavailable", session };
  const charge = await dependencies.stripe.retrieveCharge(chargeId, configuration);
  if (charge?.id !== chargeId || charge.object !== "charge" || charge.livemode !== configuration.stripeLivemode
    || resourceId(charge.payment_intent) !== paymentIntentId || charge.paid !== true || charge.captured !== true
    || charge.status !== "succeeded" || charge.currency !== "usd" || charge.amount !== session.amount_total
    || (managed ? !session.payment_method_types.includes(charge.payment_method_details?.type)
      || charge.amount_captured !== session.amount_total || !metadataMatches(charge.metadata, purchase)
      || !samePresentment(session.presentment_details, charge.presentment_details, session.amount_total)
      : charge.payment_method_details?.type !== "card")
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
      if (!currentSalesContractMatches(purchase, configuration)) return checkoutFailure(409);
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
  if (!currentSalesContractMatches(purchase, configuration)) return checkoutFailure(409);
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
  const checkoutClaim = await readStitchProofClaim(request, core, { checkout: true });
  if (!checkoutClaim) return checkoutFailure(400);
  const { country, ...claim } = checkoutClaim;
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
    const salesConfiguration = getStitchProofConfiguration(env, { checkout: true });
    if (!salesConfiguration) return checkoutFailure();
    if (salesConfiguration.taxMode === "managed" ? !isStitchProofPurchaseCountry(country) : country !== undefined) return checkoutFailure(400);
    const configuration = { ...salesConfiguration, ...(salesConfiguration.taxMode === "managed" ? { purchaseCountry: country } : {}) };
    if (!await verifySales(configuration, dependencies)) return checkoutFailure();
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
  if (![STITCHPROOF_OFFER_VERSION, STITCHPROOF_MANAGED_OFFER_VERSION].includes(metadata.offer_version) || typeof metadata.project_id !== "string"
    || typeof metadata.attempt_id !== "string" || typeof metadata.claim_sha256 !== "string"
    || !UUID_V4.test(metadata.project_id) || !UUID_V4.test(metadata.attempt_id) || !HASH.test(metadata.claim_sha256)
    || (metadata.offer_version === STITCHPROOF_MANAGED_OFFER_VERSION
      && (!isStitchProofPurchaseCountry(metadata.purchase_country) || metadata.market_policy_version !== STITCHPROOF_MARKET_POLICY_VERSION
        || !validStitchProofProductTaxCode(metadata.product_tax_code)))) throw new Error("Invalid purchase binding.");
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
