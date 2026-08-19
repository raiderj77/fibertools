import { detectGPCClient } from "@/lib/gpc";

export type DesignerPreflightEvent =
  | "designer_preflight_page_viewed"
  | "designer_preflight_cta_clicked"
  | "designer_preflight_submission_started"
  | "designer_preflight_submission_completed"
  | "designer_preflight_checkout_started"
  | "designer_preflight_payment_completed"
  | "designer_preflight_repeat_purchase";

function analyticsAllowed(): boolean {
  try {
    if (detectGPCClient()) return false;
    const consent = JSON.parse(localStorage.getItem("cookie_consent") || "null") as { analytics?: string } | null;
    return consent?.analytics === "granted";
  } catch {
    return false;
  }
}

export function trackDesignerPreflightEvent(event: DesignerPreflightEvent): boolean {
  if (typeof window === "undefined" || !analyticsAllowed() || typeof window.gtag !== "function") return false;
  window.gtag("event", event, { service_slug: "designer-pattern-preflight" });
  return true;
}
