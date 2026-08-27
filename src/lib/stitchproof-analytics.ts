import { detectGPCClient } from "@/lib/gpc";
import {
  getUnsupportedRoundScope as getUnsupportedRoundScopeCore,
  recordStitchProofBrowserEvent,
} from "@/lib/stitchproof-analytics-core.mjs";

export type StitchProofEvent =
  | "free_check_started"
  | "free_check_completed"
  | "unsupported_result_shown"
  | "designer_mode_opened"
  | "version_comparison_started"
  | "version_comparison_completed"
  | "correction_recorded"
  | "report_previewed"
  | "json_backup_downloaded"
  | "csv_downloaded"
  | "paid_report_interest_submitted"
  | "checkout_started"
  | "purchase_completed"
  | "manual_preflight_clicked";

export type StitchProofUnsupportedCategory =
  | "nested_repeat"
  | "bobble_popcorn"
  | "custom_stitch"
  | "color_change"
  | "loop_variation"
  | "chain_count_rule"
  | "row_worked_flat"
  | "other";

export type StitchProofParserRuleId =
  | "starting_count_required"
  | "round_structure"
  | "supported_stitch_token"
  | "fixed_repeat"
  | "repeat_around"
  | "supported_sequence";

export type StitchProofUnsupportedScope =
  | "one"
  | "two_to_five"
  | "six_to_twenty"
  | "twenty_one_to_two_hundred";

export type StitchProofUnsupportedProperties = Readonly<{
  unsupported_category?: StitchProofUnsupportedCategory;
  parser_rule_id?: StitchProofParserRuleId;
  unsupported_scope?: StitchProofUnsupportedScope;
}>;

export function getUnsupportedRoundScope(count: number): StitchProofUnsupportedScope | null {
  return getUnsupportedRoundScopeCore(count) as StitchProofUnsupportedScope | null;
}

type StitchProofEventWithoutProperties = Exclude<
  StitchProofEvent,
  "unsupported_result_shown"
>;

export function trackStitchProofEvent(
  event: "unsupported_result_shown",
  properties?: StitchProofUnsupportedCategory | StitchProofUnsupportedProperties,
): boolean;
export function trackStitchProofEvent(
  event: StitchProofEventWithoutProperties,
  properties?: Readonly<Record<string, never>>,
): boolean;
export function trackStitchProofEvent(
  event: StitchProofEvent,
  properties: StitchProofUnsupportedCategory | StitchProofUnsupportedProperties = {},
): boolean {
  if (typeof window === "undefined") return false;

  const normalizedProperties = typeof properties === "string"
    ? { unsupported_category: properties }
    : properties;

  return recordStitchProofBrowserEvent({
    event,
    properties: normalizedProperties,
    getStorage: () => window.localStorage,
    getGpcActive: () => detectGPCClient(),
    getGtag: () => window.gtag,
  });
}
