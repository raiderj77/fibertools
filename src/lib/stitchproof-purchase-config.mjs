import { STITCHPROOF_MARKET_POLICY_VERSION } from "./stitchproof-markets.mjs";

export const STITCHPROOF_STRIPE_ACCOUNT_ID = "acct_1U5HWnD2Of3MIt94";
export const STITCHPROOF_SERVICE = "stitchproof_designer_project";
export const STITCHPROOF_OFFER_VERSION = "STITCHPROOF-PROJECT-V1";
export const STITCHPROOF_MANAGED_OFFER_VERSION = "STITCHPROOF-PROJECT-MANAGED-V1";
export const STITCHPROOF_AMOUNT_CENTS = 900;
export const STITCHPROOF_SCHEMA_VERSION = "20260826_stitchproof_project_entitlements";
export const STITCHPROOF_MANAGED_SCHEMA_VERSION = "20260827_stitchproof_managed_payments";
export const STITCHPROOF_CREATE_RETRY_MS = 60 * 60 * 1000;

export const STITCHPROOF_PURCHASE_ENV_NAMES = Object.freeze([
  "STITCHPROOF_CHECKOUT_ENABLED", "STITCHPROOF_STRIPE_PRODUCT_ID",
  "STITCHPROOF_STRIPE_PRICE_ID", "STITCHPROOF_STRIPE_WEBHOOK_SECRET",
  "STITCHPROOF_APPLIED_MIGRATION_VERSION", "STITCHPROOF_SCHEMA_CONFIRMED",
  "STITCHPROOF_WEBHOOK_CONFIRMED", "STITCHPROOF_ABUSE_PROTECTION_PROVIDER",
  "STITCHPROOF_ABUSE_PROTECTION_CONFIRMED", "STITCHPROOF_TAX_MODE",
  "STITCHPROOF_TAX_BEHAVIOR", "STITCHPROOF_TAX_CONFIGURATION_CONFIRMED",
  "STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED", "STITCHPROOF_MANAGED_TAX_CODE",
  "STITCHPROOF_MANAGED_COUNTRY_POLICY", "STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED",
  "STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED", "STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED",
  "FIBERTOOLS_STRIPE_ACCOUNT_ID", "STRIPE_MODE", "STRIPE_SECRET_KEY",
  "SUPABASE_URL", "SUPABASE_SECRET_KEY", "NEXT_PUBLIC_SITE_URL",
  "NODE_ENV", "VERCEL_ENV",
]);

const text = (value) => typeof value === "string" ? value.trim() : "";
const placeholder = (value) => /replace[_-]?me|placeholder|example-project/i.test(value);

function httpsOrigin(value) {
  try {
    const url = new URL(text(value));
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/"
      || url.search || url.hash || placeholder(url.hostname)
      || /(?:^|\.)(?:example|invalid|test|localhost)$/.test(url.hostname)
      || /^(?:example\.com|example\.net|example\.org)$/.test(url.hostname)) return null;
    return url.origin;
  } catch { return null; }
}

function siteOrigin(value, live, production) {
  const origin = httpsOrigin(value);
  if (origin === "https://fibertools.app") return live ? origin : null;
  if (live || production) return null;
  try {
    const url = new URL(text(value));
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    if (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return url.origin;
    if (url.protocol === "https:" && url.hostname.endsWith(".vercel.app")) return url.origin;
  } catch { /* Invalid origins fail closed. */ }
  return null;
}

export function validStitchProofTaxContract(mode, behavior) {
  return (mode === "none" && behavior === "not_applicable")
    || (["automatic", "managed"].includes(mode) && (behavior === "inclusive" || behavior === "exclusive"));
}

export const validStitchProofProductTaxCode = (value) => typeof value === "string" && /^txcd_[0-9]{8}$/.test(value);

/** Readiness booleans are configuration evidence, never provider verification. */
export function getStitchProofEnvironmentReadiness(env = process.env) {
  const stripeMode = text(env.STRIPE_MODE);
  const live = stripeMode === "live";
  // Next also sets NODE_ENV=production for protected preview builds. Only the
  // production deployment/canonical origin must reject Stripe test mode.
  const production = env.VERCEL_ENV === "production" || text(env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "") === "https://fibertools.app";
  const stripeSecretKey = text(env.STRIPE_SECRET_KEY);
  const supabaseSecretKey = text(env.SUPABASE_SECRET_KEY);
  const site = siteOrigin(env.NEXT_PUBLIC_SITE_URL, live, production);
  const supabaseOrigin = httpsOrigin(env.SUPABASE_URL);
  const productId = text(env.STITCHPROOF_STRIPE_PRODUCT_ID);
  const priceId = text(env.STITCHPROOF_STRIPE_PRICE_ID);
  const webhookSecret = text(env.STITCHPROOF_STRIPE_WEBHOOK_SECRET);
  const managed = env.STITCHPROOF_TAX_MODE === "managed";
  const schemaVersion = env.STITCHPROOF_APPLIED_MIGRATION_VERSION;
  const checks = {
    providerIdentity: env.FIBERTOOLS_STRIPE_ACCOUNT_ID === STITCHPROOF_STRIPE_ACCOUNT_ID,
    stripeMode: (stripeMode === "live" || stripeMode === "test") && (!production || live),
    stripeKeyMode: !placeholder(stripeSecretKey)
      && (live ? /^(?:sk|rk)_live_/.test(stripeSecretKey) : /^(?:sk|rk)_test_/.test(stripeSecretKey)),
    siteOrigin: Boolean(site),
    privateDatabase: Boolean(supabaseOrigin && supabaseSecretKey && !placeholder(supabaseSecretKey)),
    checkoutEnabled: env.STITCHPROOF_CHECKOUT_ENABLED === "true",
    offerBinding: /^prod_[A-Za-z0-9]+$/.test(productId) && !placeholder(productId)
      && /^price_[A-Za-z0-9]+$/.test(priceId) && !placeholder(priceId),
    schema: (managed ? schemaVersion === STITCHPROOF_MANAGED_SCHEMA_VERSION
      : [STITCHPROOF_SCHEMA_VERSION, STITCHPROOF_MANAGED_SCHEMA_VERSION].includes(schemaVersion))
      && env.STITCHPROOF_SCHEMA_CONFIRMED === "true",
    webhook: /^whsec_.+/.test(webhookSecret) && !placeholder(webhookSecret)
      && env.STITCHPROOF_WEBHOOK_CONFIRMED === "true",
    abuseProtection: ["VERCEL_WAF", "OTHER_VERIFIED_PROVIDER"].includes(env.STITCHPROOF_ABUSE_PROTECTION_PROVIDER)
      && env.STITCHPROOF_ABUSE_PROTECTION_CONFIRMED === "true",
    taxConfiguration: env.STITCHPROOF_TAX_CONFIGURATION_CONFIRMED === "true"
      && validStitchProofTaxContract(env.STITCHPROOF_TAX_MODE, env.STITCHPROOF_TAX_BEHAVIOR),
    managedPayments: !managed || env.STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED === "true",
    managedProductTaxCode: !managed || validStitchProofProductTaxCode(env.STITCHPROOF_MANAGED_TAX_CODE),
    managedCountryPolicy: !managed || env.STITCHPROOF_MANAGED_COUNTRY_POLICY === STITCHPROOF_MARKET_POLICY_VERSION,
    // Protected Stripe test-mode exercises must precede these live release attestations.
    // A client country selector is not provider-side pre-payment enforcement.
    managedCountryEnforcement: !managed || !live || env.STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED === "true",
    managedPaymentMethods: !managed || !live || env.STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED === "true",
    managedDeliveryTest: !managed || !live || env.STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED === "true",
  };
  return { ready: Object.values(checks).every(Boolean), checks };
}

/** Existing purchases need their immutable attempt contract, not today's sales flags. */
export function getStitchProofConfiguration(env = process.env, { checkout = false, webhook = false } = {}) {
  const readiness = getStitchProofEnvironmentReadiness(env);
  for (const name of ["providerIdentity", "stripeMode", "stripeKeyMode", "siteOrigin", "privateDatabase"]) {
    if (!readiness.checks[name]) return null;
  }
  if (checkout && !readiness.ready) return null;
  const webhookSecret = text(env.STITCHPROOF_STRIPE_WEBHOOK_SECRET);
  if (webhook && (!/^whsec_.+/.test(webhookSecret) || placeholder(webhookSecret))) return null;
  const stripeLivemode = env.STRIPE_MODE === "live";
  const origin = siteOrigin(env.NEXT_PUBLIC_SITE_URL, stripeLivemode,
    env.VERCEL_ENV === "production");
  return {
    stripeLivemode,
    stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID,
    stripeSecretKey: text(env.STRIPE_SECRET_KEY),
    webhookSecret,
    supabaseOrigin: httpsOrigin(env.SUPABASE_URL),
    supabaseSecretKey: text(env.SUPABASE_SECRET_KEY),
    siteOrigin: origin,
    successUrl: `${origin}/amigurumi-pattern-checker/designer?stitchproof=return`,
    cancelUrl: `${origin}/amigurumi-pattern-checker/designer?stitchproof=cancel`,
    productId: text(env.STITCHPROOF_STRIPE_PRODUCT_ID),
    priceId: text(env.STITCHPROOF_STRIPE_PRICE_ID),
    taxMode: env.STITCHPROOF_TAX_MODE,
    taxBehavior: env.STITCHPROOF_TAX_BEHAVIOR,
    schemaVersion: env.STITCHPROOF_APPLIED_MIGRATION_VERSION === STITCHPROOF_MANAGED_SCHEMA_VERSION
      ? STITCHPROOF_MANAGED_SCHEMA_VERSION : STITCHPROOF_SCHEMA_VERSION,
    managedProductTaxCode: text(env.STITCHPROOF_MANAGED_TAX_CODE),
    marketPolicyVersion: text(env.STITCHPROOF_MANAGED_COUNTRY_POLICY),
  };
}
