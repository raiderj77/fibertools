import { hasAnalyticsConsent } from "./tool-completion-tracker.mjs";

export function recordNewsletterSignupSuccess({
  source,
  storage,
  gpcActive,
  getGtag,
}) {
  if (gpcActive || !hasAnalyticsConsent(storage)) return false;

  const gtag = getGtag();
  if (typeof gtag !== "function") return false;

  gtag("event", "newsletter_signup_success", {
    signup_source: source,
  });
  return true;
}
