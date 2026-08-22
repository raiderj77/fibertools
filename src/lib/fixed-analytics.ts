import { detectGPCClient } from "@/lib/gpc";

export type FixedAnalyticsEvent =
  | "planning_pack_page_view"
  | "planning_pack_purchase_click"
  | "planning_pack_interest_click"
  | "designer_preflight_inquiry_click"
  | "embed_code_copy"
  | "partner_interest_click"
  | "pattern_check_run"
  | "ravelry_patterns_shown"
  | "ravelry_pattern_click"
  | "stitchproof_interest_click";

export type FixedAnalyticsSlug =
  | "fiber-project-planning-pack"
  | "designer-pattern-preflight"
  | "blanket-calculator"
  | "yarn-calculator"
  | "gauge-calculator"
  | "embed-program"
  | "amigurumi-pattern-checker";

const ALLOWED_EVENT_SLUGS: Readonly<Record<FixedAnalyticsEvent, readonly FixedAnalyticsSlug[]>> = {
  planning_pack_page_view: ["fiber-project-planning-pack"],
  planning_pack_purchase_click: ["fiber-project-planning-pack"],
  planning_pack_interest_click: ["fiber-project-planning-pack"],
  designer_preflight_inquiry_click: ["designer-pattern-preflight"],
  embed_code_copy: ["blanket-calculator", "yarn-calculator", "gauge-calculator"],
  partner_interest_click: ["embed-program"],
  pattern_check_run: ["amigurumi-pattern-checker"],
  ravelry_patterns_shown: ["yarn-calculator"],
  ravelry_pattern_click: ["yarn-calculator"],
  stitchproof_interest_click: ["amigurumi-pattern-checker"],
};

export function hasCurrentAnalyticsConsent(): boolean {
  if (detectGPCClient()) return false;

  try {
    const stored = window.localStorage.getItem("cookie_consent");
    return stored ? JSON.parse(stored)?.analytics === "granted" : false;
  } catch {
    return false;
  }
}

export function trackFixedEvent(
  event: FixedAnalyticsEvent,
  payload: Readonly<{ slug: FixedAnalyticsSlug }>,
): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  if (Object.keys(payload).length !== 1 || !ALLOWED_EVENT_SLUGS[event]?.includes(payload.slug)) return false;
  if (!hasCurrentAnalyticsConsent()) return false;

  window.gtag("event", event, { content_slug: payload.slug });
  return true;
}
