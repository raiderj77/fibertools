interface Window {
  gtag: (
    command: "consent" | "config" | "event" | "js" | "set",
    targetOrAction: string | Date,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}
