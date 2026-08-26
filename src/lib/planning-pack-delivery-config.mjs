const CANONICAL_SITE_ORIGIN = "https://fibertools.app";
export const CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID = "acct_1U5HWnD2Of3MIt94";
const STRIPE_ACCOUNT_ID_PATTERN = /^acct_[A-Za-z0-9]+$/;
const PAYMENT_LINK_ID_PATTERN = /^plink_[A-Za-z0-9]+$/;
const PRICE_ID_PATTERN = /^price_[A-Za-z0-9]+$/;
const STORAGE_BUCKET_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;

export const PLANNING_PACK_DELIVERY_ENV_NAMES = Object.freeze([
  "FIBERTOOLS_STRIPE_ACCOUNT_ID",
  "PLANNING_PACK_STRIPE_PAYMENT_LINK_ID",
  "PLANNING_PACK_STRIPE_PAYMENT_LINK_URL",
  "PLANNING_PACK_STRIPE_PRICE_ID",
  "PLANNING_PACK_STORAGE_BUCKET",
  "PLANNING_PACK_STORAGE_OBJECT_PATH",
  "STRIPE_MODE",
  "STRIPE_SECRET_KEY",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
]);

function normalized(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholder(value) {
  return /replace[_-]?me|placeholder|nonsecret[_-]?fixture|example-project/i.test(
    normalized(value)
  );
}

function parseHttpsOrigin(value, { exactOrigin } = {}) {
  const candidate = normalized(value);
  if (!candidate || isPlaceholder(candidate)) return null;

  try {
    const url = new URL(candidate);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      /(?:^|\.)(?:example|invalid|test|localhost)$/.test(url.hostname.toLowerCase()) ||
      (exactOrigin && url.origin !== exactOrigin)
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function parseStripePaymentLinkUrl(value) {
  const candidate = normalized(value);
  if (!candidate || isPlaceholder(candidate)) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      url.hostname.toLowerCase() === "buy.stripe.com" &&
      !url.port &&
      !url.search &&
      !url.hash &&
      /^\/[A-Za-z0-9_-]+$/.test(url.pathname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function parseStorageObjectPath(value) {
  const objectPath = normalized(value);
  if (
    !objectPath ||
    objectPath.length > 1024 ||
    objectPath.startsWith("/") ||
    objectPath.includes("\\") ||
    /[?#\u0000-\u001f\u007f]/.test(objectPath) ||
    objectPath.split("/").some((segment) => !segment || segment === "." || segment === "..") ||
    !/\.pdf$/i.test(objectPath) ||
    isPlaceholder(objectPath)
  ) {
    return null;
  }
  return objectPath;
}

export function getPlanningPackDeliveryEnvironmentConfiguration(env = process.env) {
  const stripeMode = normalized(env.STRIPE_MODE);
  const stripeSecretKey = normalized(env.STRIPE_SECRET_KEY);
  const stripeAccountId = normalized(env.FIBERTOOLS_STRIPE_ACCOUNT_ID);
  const paymentLinkId = normalized(env.PLANNING_PACK_STRIPE_PAYMENT_LINK_ID);
  const paymentLinkUrl = parseStripePaymentLinkUrl(
    env.PLANNING_PACK_STRIPE_PAYMENT_LINK_URL
  );
  const priceId = normalized(env.PLANNING_PACK_STRIPE_PRICE_ID);
  const storageBucket = normalized(env.PLANNING_PACK_STORAGE_BUCKET);
  const storageObjectPath = parseStorageObjectPath(
    env.PLANNING_PACK_STORAGE_OBJECT_PATH
  );
  const siteOrigin = parseHttpsOrigin(env.NEXT_PUBLIC_SITE_URL, {
    exactOrigin: CANONICAL_SITE_ORIGIN,
  });
  const supabaseOrigin = parseHttpsOrigin(env.SUPABASE_URL);
  const supabaseSecretKey = normalized(env.SUPABASE_SECRET_KEY);
  const keyModeMatches =
    (stripeMode === "test" && /^(?:sk|rk)_test_/.test(stripeSecretKey)) ||
    (stripeMode === "live" && /^(?:sk|rk)_live_/.test(stripeSecretKey));

  const checks = {
    stripeProviderIdentity:
      keyModeMatches &&
      !isPlaceholder(stripeSecretKey) &&
      STRIPE_ACCOUNT_ID_PATTERN.test(stripeAccountId) &&
      stripeAccountId === CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
    stripeOfferBinding:
      PAYMENT_LINK_ID_PATTERN.test(paymentLinkId) &&
      !isPlaceholder(paymentLinkId) &&
      Boolean(paymentLinkUrl) &&
      PRICE_ID_PATTERN.test(priceId) &&
      !isPlaceholder(priceId) &&
      Boolean(siteOrigin),
    privateStorage:
      STORAGE_BUCKET_PATTERN.test(storageBucket) &&
      !isPlaceholder(storageBucket) &&
      Boolean(storageObjectPath) &&
      Boolean(supabaseOrigin) &&
      Boolean(supabaseSecretKey) &&
      !isPlaceholder(supabaseSecretKey),
  };

  if (!Object.values(checks).every(Boolean)) return { checks, configuration: null };

  return {
    checks,
    configuration: {
      stripeMode,
      stripeSecretKey,
      stripeAccountId,
      paymentLinkId,
      paymentLinkUrl,
      priceId,
      storageBucket,
      storageObjectPath,
      siteOrigin,
      supabaseOrigin,
      supabaseSecretKey,
      expectedAfterCompletionUrl:
        `${siteOrigin}/api/planning-pack/download?session_id={CHECKOUT_SESSION_ID}`,
    },
  };
}

export function getPlanningPackDeliveryEnvironmentReadiness(env = process.env) {
  const parsed = getPlanningPackDeliveryEnvironmentConfiguration(env);
  return { ready: Boolean(parsed.configuration), checks: parsed.checks };
}
