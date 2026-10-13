interface Window {
  // Current-page denial takes precedence over a stale record when storage writes fail.
  fibertoolsAnalyticsAllowed?: boolean;
  gtag: (
    command: "consent" | "config" | "event" | "js" | "set",
    targetOrAction: string | Date,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}
