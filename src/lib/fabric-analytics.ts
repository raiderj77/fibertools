import { detectGPCClient } from "@/lib/gpc";

type FabricAnalyticsEvent =
  | "fabric_tool_viewed"
  | "fabric_flow_selected"
  | "fabric_selected"
  | "substitution_results_viewed"
  | "project_suggestions_viewed"
  | "result_expanded"
  | "result_helpful"
  | "result_not_helpful"
  | "source_information_viewed";

type SafeEventProperties = {
  flow?: "substitutes" | "projects";
  fabric_id?: string;
  result_fabric_id?: string;
  result_rank?: number;
  score_band?: string;
  source_group?: string;
};

function analyticsAllowed(): boolean {
  try {
    if (detectGPCClient()) return false;
    const state = JSON.parse(localStorage.getItem("cookie_consent") || "null") as { analytics?: string } | null;
    return state?.analytics === "granted";
  } catch {
    return false;
  }
}

export function trackFabricEvent(event: FabricAnalyticsEvent, _properties: SafeEventProperties = {}): void {
  void _properties;
  if (typeof window === "undefined" || !analyticsAllowed() || typeof window.gtag !== "function") return;
  window.gtag("event", event, {
    tool_slug: "fabric-substitute",
  });
}
