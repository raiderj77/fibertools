export const DESIGNER_PREFLIGHT_REQUIRED_MIGRATION_VERSION =
  "20260818_designer_pattern_preflight_ops_hardening";

export const DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS = Object.freeze([
  "SUPABASE_DURABLE_LIMIT",
  "VERCEL_WAF",
  "OTHER_VERIFIED_PROVIDER",
  "UNVERIFIED",
]);

export const DESIGNER_PREFLIGHT_WEBHOOK_EVENTS = Object.freeze([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.updated",
  "charge.dispute.closed",
]);

export const DESIGNER_PREFLIGHT_ENV_NAMES = [
  "DESIGNER_PREFLIGHT_ACTION_MODE",
  "STRIPE_MODE",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION",
  "DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED",
  "DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED",
  "DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED",
  "DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED",
  "DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED",
  "DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED",
  "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER",
  "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED",
  "DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED",
];
Object.freeze(DESIGNER_PREFLIGHT_ENV_NAMES);

const VERIFIED_ABUSE_PROVIDERS = new Set(
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS.filter(
    (provider) => provider !== "UNVERIFIED"
  )
);

const DOCUMENTED_PLACEHOLDERS = Object.freeze({
  STRIPE_SECRET_KEY: "sk_test_replace_me_server_only",
  STRIPE_WEBHOOK_SECRET: "whsec_replace_me_server_only",
  SUPABASE_URL: "https://example-project.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_replace_me_server_only",
});

const RESERVED_EXAMPLE_HOSTS = new Set([
  "example.com",
  "example.net",
  "example.org",
]);

function normalized(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function isDocumentedDesignerPreflightPlaceholder(name, value) {
  return normalized(value) === DOCUMENTED_PLACEHOLDERS[name];
}

export function isReservedExampleDestination(hostname) {
  const normalizedHostname = normalized(hostname).toLowerCase().replace(/\.$/, "");
  if (!normalizedHostname) return false;

  return Boolean(
    RESERVED_EXAMPLE_HOSTS.has(normalizedHostname) ||
      [...RESERVED_EXAMPLE_HOSTS].some((host) =>
        normalizedHostname.endsWith(`.${host}`)
      ) ||
      normalizedHostname.endsWith(".example") ||
      normalizedHostname === "example" ||
      normalizedHostname.endsWith(".invalid") ||
      normalizedHostname === "invalid" ||
      normalizedHostname.endsWith(".test") ||
      normalizedHostname === "test" ||
      normalizedHostname.endsWith(".localhost") ||
      normalizedHostname === "localhost"
  );
}

export function isDesignerPreflightOrigin(value, { allowLocalHttp = false } = {}) {
  const candidate = normalized(value);
  if (!candidate) return false;

  try {
    const url = new URL(candidate);
    const localHostname = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const allowedProtocol =
      url.protocol === "https:" ||
      (allowLocalHttp && localHostname && url.protocol === "http:");

    return Boolean(
      allowedProtocol &&
        !url.username &&
        !url.password &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash &&
        (localHostname || !isReservedExampleDestination(url.hostname))
    );
  } catch {
    return false;
  }
}

export function designerPreflightWebhookEventsConfirmed(value) {
  if (typeof value !== "string") return false;
  const configured = new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  return (
    configured.size === DESIGNER_PREFLIGHT_WEBHOOK_EVENTS.length &&
    DESIGNER_PREFLIGHT_WEBHOOK_EVENTS.every((event) => configured.has(event))
  );
}

export function getDesignerPreflightEnvironmentReadiness(env = process.env) {
  const stripeMode = normalized(env.STRIPE_MODE);
  const stripeKey = normalized(env.STRIPE_SECRET_KEY);
  const webhookSecret = normalized(env.STRIPE_WEBHOOK_SECRET);
  const supabaseSecret = normalized(env.SUPABASE_SECRET_KEY);
  const abuseProvider = DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS.includes(
    env.DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER
  )
    ? env.DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER
    : "UNVERIFIED";

  const checks = {
    actionMode: env.DESIGNER_PREFLIGHT_ACTION_MODE === "checkout",
    stripeMode: stripeMode === "test" || stripeMode === "live",
    stripeKeyMode:
      !isDocumentedDesignerPreflightPlaceholder("STRIPE_SECRET_KEY", stripeKey) &&
      ((stripeMode === "test" && /^(sk|rk)_test_/.test(stripeKey)) ||
        (stripeMode === "live" && /^(sk|rk)_live_/.test(stripeKey))),
    webhookSecretFormat:
      !isDocumentedDesignerPreflightPlaceholder("STRIPE_WEBHOOK_SECRET", webhookSecret) &&
      webhookSecret.startsWith("whsec_") &&
      webhookSecret.length > "whsec_".length,
    supabaseOrigin:
      !isDocumentedDesignerPreflightPlaceholder("SUPABASE_URL", env.SUPABASE_URL) &&
      isDesignerPreflightOrigin(env.SUPABASE_URL) &&
      Boolean(supabaseSecret) &&
      !isDocumentedDesignerPreflightPlaceholder("SUPABASE_SECRET_KEY", supabaseSecret),
    siteOrigin: isDesignerPreflightOrigin(env.NEXT_PUBLIC_SITE_URL, {
      allowLocalHttp: true,
    }),
    migrationVersion:
      env.DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION ===
      DESIGNER_PREFLIGHT_REQUIRED_MIGRATION_VERSION,
    dbFunctions: env.DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED === "true",
    dbTables: env.DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED === "true",
    retentionSchema: env.DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED === "true",
    outboxSchema: env.DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED === "true",
    webhookEvents: designerPreflightWebhookEventsConfirmed(
      env.DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED
    ),
    notificationDelivery:
      env.DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED === "true",
    durableAbuseProtection:
      VERIFIED_ABUSE_PROVIDERS.has(abuseProvider) &&
      env.DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED === "true",
    fulfillmentCapacity:
      env.DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED === "true",
  };

  return {
    ready: Object.values(checks).every(Boolean),
    abuseProtectionProvider: abuseProvider,
    checks,
  };
}

export function isDesignerPreflightCheckoutEnvironmentReady(env = process.env) {
  return getDesignerPreflightEnvironmentReadiness(env).ready;
}
