// This banner authorizes analytics only. No saved record from it authorizes ads.
export const ANALYTICS_CONSENT_VERSION = 2;

export function normalizeAnalyticsConsent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (value.version !== undefined && value.version !== ANALYTICS_CONSENT_VERSION) return null;
  if (value.analytics !== "granted" && value.analytics !== "denied") return null;
  if (value.ads !== "granted" && value.ads !== "denied") return null;
  return {
    version: ANALYTICS_CONSENT_VERSION,
    analytics: value.analytics,
    ads: "denied",
    timestamp: typeof value.timestamp === "string" ? value.timestamp : "",
  };
}
