import "server-only";

const CHECKOUT_REQUIREMENTS = [
  "STRIPE_MODE",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const DEFAULT_INQUIRY_URL =
  "mailto:hello@fibertools.app?subject=Designer%20Pattern%20Preflight%20inquiry";

export type DesignerPreflightAction =
  | { mode: "checkout" }
  | { mode: "inquiry"; inquiryUrl: string };

function hasValue(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function isHttpsUrl(value: string | undefined, allowLocalHttp = false): boolean {
  if (!hasValue(value)) return false;
  try {
    const url = new URL(value!.trim());
    if (url.username || url.password) return false;
    if (url.protocol === "https:") return true;
    return Boolean(
      allowLocalHttp &&
        url.protocol === "http:" &&
        (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function checkoutConfigurationReady(): boolean {
  if (!CHECKOUT_REQUIREMENTS.every((name) => hasValue(process.env[name]))) return false;

  const stripeMode = process.env.STRIPE_MODE!.trim().toLowerCase();
  const stripeKey = process.env.STRIPE_SECRET_KEY!.trim();
  const keyMatchesMode =
    stripeMode === "test"
      ? /^(sk|rk)_test_/.test(stripeKey)
      : stripeMode === "live" && /^(sk|rk)_live_/.test(stripeKey);

  return Boolean(
    keyMatchesMode &&
      process.env.STRIPE_WEBHOOK_SECRET!.trim().startsWith("whsec_") &&
      isHttpsUrl(process.env.SUPABASE_URL) &&
      isHttpsUrl(process.env.NEXT_PUBLIC_SITE_URL, true)
  );
}

function safeInquiryUrl(value: string | undefined): string {
  if (!hasValue(value)) return DEFAULT_INQUIRY_URL;

  try {
    const url = new URL(value!.trim());
    if (url.username || url.password) return DEFAULT_INQUIRY_URL;
    return url.protocol === "https:" || url.protocol === "mailto:"
      ? url.toString()
      : DEFAULT_INQUIRY_URL;
  } catch {
    return DEFAULT_INQUIRY_URL;
  }
}

export function getDesignerPreflightAction(): DesignerPreflightAction {
  const checkoutRequested =
    process.env.DESIGNER_PREFLIGHT_ACTION_MODE?.trim().toLowerCase() === "checkout";
  const checkoutReady = checkoutRequested && checkoutConfigurationReady();

  if (checkoutReady) return { mode: "checkout" };

  return {
    mode: "inquiry",
    inquiryUrl: safeInquiryUrl(process.env.DESIGNER_PREFLIGHT_INQUIRY_URL),
  };
}

export function canAcceptDesignerPreflightCheckout(): boolean {
  return getDesignerPreflightAction().mode === "checkout";
}
