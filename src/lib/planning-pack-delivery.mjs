import { createHash } from "node:crypto";

import {
  CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
  getPlanningPackDeliveryEnvironmentConfiguration,
  getPlanningPackDeliveryEnvironmentReadiness,
  PLANNING_PACK_DELIVERY_ENV_NAMES,
} from "./planning-pack-delivery-config.mjs";
import {
  getPlanningPackCheckoutUrl,
  isPlanningPackFulfillmentReady,
  PLANNING_PACK_CHECKOUT_ROUTE,
} from "./planning-pack-availability.mjs";

export {
  CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
  getPlanningPackDeliveryEnvironmentReadiness,
  PLANNING_PACK_DELIVERY_ENV_NAMES,
};

const EXPECTED_AMOUNT_CENTS = 1700;
const DOWNLOAD_FILENAME = "FiberTools-Fiber-Project-Planning-Pack.pdf";
const EXPECTED_SERVICE = "fiber_project_planning_pack";
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

const RESPONSE_HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
});

function normalized(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidCheckoutSessionId(value, stripeMode) {
  const sessionId = normalized(value);
  const match = SESSION_ID_PATTERN.exec(sessionId);
  return Boolean(match && match[1] === stripeMode && sessionId.length <= 255);
}

function getBoundDeliveryConfiguration({ manifest, env }) {
  const configuration =
    getPlanningPackDeliveryEnvironmentConfiguration(env).configuration;
  const artifactSha256 = manifest?.privateArtifact?.sha256;
  const artifactByteSize = manifest?.privateArtifact?.byteSize;
  const editionId = manifest?.edition?.id;
  if (
    !configuration ||
    !/^[a-f0-9]{64}$/.test(artifactSha256) ||
    !Number.isSafeInteger(artifactByteSize) ||
    artifactByteSize <= 0 ||
    typeof editionId !== "string" ||
    !editionId
  ) {
    return null;
  }

  return {
    ...configuration,
    artifactSha256,
    artifactByteSize,
    editionId,
  };
}

function getCheckoutConfiguration({ manifest, env, now }) {
  if (getPlanningPackCheckoutUrl({ manifest, env, now }) !== PLANNING_PACK_CHECKOUT_ROUTE) {
    return null;
  }

  return getBoundDeliveryConfiguration({ manifest, env });
}

function getFulfillmentConfiguration({ manifest, env }) {
  if (!isPlanningPackFulfillmentReady({ manifest, env })) return null;
  return getBoundDeliveryConfiguration({ manifest, env });
}

function stripeResourceId(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value.id === "string") return value.id;
  return null;
}

function metadataMatchesOffer(metadata, configuration) {
  return Boolean(
    metadata &&
      metadata.service === EXPECTED_SERVICE &&
      metadata.edition_id === configuration.editionId &&
      metadata.artifact_sha256 === configuration.artifactSha256
  );
}

function priceMatchesOffer(price, configuration) {
  return Boolean(
    stripeResourceId(price) === configuration.priceId &&
      normalized(price?.currency).toLowerCase() === "usd" &&
      price?.unit_amount === EXPECTED_AMOUNT_CENTS &&
      price?.type === "one_time" &&
      !price?.recurring
  );
}

function hasOnlyImmediateCardPayments(value) {
  return Array.isArray(value) && value.length === 1 && value[0] === "card";
}

function paymentLinkMatchesOffer(paymentLink, configuration) {
  const lineItems = paymentLink?.line_items;
  const items = Array.isArray(lineItems?.data) ? lineItems.data : [];
  const lineItem = items[0];
  const adjustableQuantityDisabled =
    lineItem?.adjustable_quantity === null ||
    lineItem?.adjustable_quantity?.enabled === false;

  return Boolean(
    paymentLink?.id === configuration.paymentLinkId &&
      paymentLink?.object === "payment_link" &&
      paymentLink?.active === true &&
      paymentLink?.livemode === (configuration.stripeMode === "live") &&
      paymentLink?.url === configuration.paymentLinkUrl &&
      normalized(paymentLink?.currency).toLowerCase() === "usd" &&
      hasOnlyImmediateCardPayments(paymentLink?.payment_method_types) &&
      paymentLink?.allow_promotion_codes === false &&
      paymentLink?.after_completion?.type === "redirect" &&
      paymentLink?.after_completion?.redirect?.url ===
        configuration.expectedAfterCompletionUrl &&
      metadataMatchesOffer(paymentLink?.metadata, configuration) &&
      metadataMatchesOffer(paymentLink?.payment_intent_data?.metadata, configuration) &&
      (!Array.isArray(paymentLink?.optional_items) || paymentLink.optional_items.length === 0) &&
      Array.isArray(paymentLink?.shipping_options) &&
      paymentLink.shipping_options.length === 0 &&
      lineItems?.has_more === false &&
      items.length === 1 &&
      lineItem?.quantity === 1 &&
      adjustableQuantityDisabled &&
      priceMatchesOffer(lineItem?.price, configuration)
  );
}

function sessionMatchesPurchase(session, sessionId, configuration) {
  const lineItems = session?.line_items;
  const items = Array.isArray(lineItems?.data) ? lineItems.data : [];
  const lineItem = items[0];
  const totalDetails = session?.total_details;

  return Boolean(
    session?.id === sessionId &&
      session?.object === "checkout.session" &&
      session?.status === "complete" &&
      session?.payment_status === "paid" &&
      session?.mode === "payment" &&
      session?.livemode === (configuration.stripeMode === "live") &&
      stripeResourceId(session?.payment_link) === configuration.paymentLinkId &&
      hasOnlyImmediateCardPayments(session?.payment_method_types) &&
      metadataMatchesOffer(session?.metadata, configuration) &&
      normalized(session?.currency).toLowerCase() === "usd" &&
      session?.amount_subtotal === EXPECTED_AMOUNT_CENTS &&
      Number.isSafeInteger(session?.amount_total) &&
      session.amount_total >= EXPECTED_AMOUNT_CENTS &&
      totalDetails?.amount_discount === 0 &&
      totalDetails?.amount_shipping === 0 &&
      Number.isSafeInteger(totalDetails?.amount_tax) &&
      totalDetails.amount_tax >= 0 &&
      lineItems?.has_more === false &&
      items.length === 1 &&
      lineItem?.quantity === 1 &&
      normalized(lineItem?.currency).toLowerCase() === "usd" &&
      lineItem?.amount_subtotal === EXPECTED_AMOUNT_CENTS &&
      lineItem?.amount_discount === 0 &&
      Number.isSafeInteger(lineItem?.amount_tax) &&
      lineItem.amount_tax >= 0 &&
      Number.isSafeInteger(lineItem?.amount_total) &&
      lineItem.amount_total >= EXPECTED_AMOUNT_CENTS &&
      priceMatchesOffer(lineItem?.price, configuration)
  );
}

function unavailableResponse(status = 404) {
  return new Response("Download unavailable.", {
    status,
    headers: {
      ...RESPONSE_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function checkoutUnavailableResponse(status = 404) {
  return new Response("Checkout unavailable.", {
    status,
    headers: {
      ...RESPONSE_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function redirectResponse(location) {
  return new Response(null, {
    status: 303,
    headers: {
      ...RESPONSE_HEADERS,
      Location: location,
    },
  });
}

function downloadResponse(bytes) {
  return new Response(bytes, {
    status: 200,
    headers: {
      ...RESPONSE_HEADERS,
      "Content-Type": "application/pdf",
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
    },
  });
}

export async function handlePlanningPackCheckoutRequest({
  manifest,
  env = process.env,
  now = new Date(),
  dependencies,
}) {
  const configuration = getCheckoutConfiguration({ manifest, env, now });
  if (!configuration) return checkoutUnavailableResponse();

  try {
    const account = await dependencies.retrieveStripeAccount(configuration);
    if (account?.id !== CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID) {
      return checkoutUnavailableResponse(403);
    }

    const paymentLink = await dependencies.retrievePaymentLink(configuration);
    if (!paymentLinkMatchesOffer(paymentLink, configuration)) {
      return checkoutUnavailableResponse(403);
    }

    return redirectResponse(configuration.paymentLinkUrl);
  } catch {
    return checkoutUnavailableResponse(503);
  }
}

export async function handlePlanningPackDownloadRequest({
  request,
  manifest,
  env = process.env,
  dependencies,
}) {
  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch {
    return unavailableResponse(400);
  }

  const configuration = getFulfillmentConfiguration({ manifest, env });
  const sessionId = requestUrl.searchParams.get("session_id");
  if (!configuration) return unavailableResponse();
  if (!isValidCheckoutSessionId(sessionId, configuration.stripeMode)) {
    return unavailableResponse(400);
  }

  try {
    const account = await dependencies.retrieveStripeAccount(configuration);
    if (account?.id !== CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID) {
      return unavailableResponse(403);
    }

    const session = await dependencies.retrieveCheckoutSession(sessionId, configuration);
    if (!sessionMatchesPurchase(session, sessionId, configuration)) {
      return unavailableResponse(403);
    }

    const bytes = await dependencies.downloadPrivateObject(configuration);
    if (!(bytes instanceof Uint8Array) || bytes.byteLength !== configuration.artifactByteSize) {
      return unavailableResponse(502);
    }

    const checksum = createHash("sha256").update(bytes).digest("hex");
    if (checksum !== configuration.artifactSha256) {
      return unavailableResponse(502);
    }

    return downloadResponse(bytes);
  } catch {
    return unavailableResponse(503);
  }
}
