export const ANALYTICS_CONSENT_VERSION: 2;
export interface AnalyticsConsent {
  version: 2;
  analytics: "granted" | "denied";
  ads: "denied";
  timestamp: string;
}
export function normalizeAnalyticsConsent(value: unknown): AnalyticsConsent | null;
