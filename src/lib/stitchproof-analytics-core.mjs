import { hasAnalyticsConsent } from "./tool-completion-tracker.mjs";

export const STITCHPROOF_EVENTS = Object.freeze([
  "free_check_started",
  "free_check_completed",
  "unsupported_result_shown",
  "designer_mode_opened",
  "version_comparison_started",
  "version_comparison_completed",
  "correction_recorded",
  "report_previewed",
  "json_backup_downloaded",
  "csv_downloaded",
  "paid_report_interest_submitted",
  "checkout_started",
  "purchase_completed",
  "manual_preflight_clicked",
]);

export const STITCHPROOF_UNSUPPORTED_CATEGORIES = Object.freeze([
  "nested_repeat",
  "bobble_popcorn",
  "custom_stitch",
  "color_change",
  "loop_variation",
  "chain_count_rule",
  "row_worked_flat",
  "other",
]);

export const STITCHPROOF_PARSER_RULE_IDS = Object.freeze([
  "starting_count_required",
  "round_structure",
  "supported_stitch_token",
  "fixed_repeat",
  "repeat_around",
  "supported_sequence",
]);

export const STITCHPROOF_UNSUPPORTED_SCOPES = Object.freeze([
  "one",
  "two_to_five",
  "six_to_twenty",
  "twenty_one_to_two_hundred",
]);

const EVENT_SET = new Set(STITCHPROOF_EVENTS);
const CATEGORY_SET = new Set(STITCHPROOF_UNSUPPORTED_CATEGORIES);
const PARSER_RULE_SET = new Set(STITCHPROOF_PARSER_RULE_IDS);
const UNSUPPORTED_SCOPE_SET = new Set(STITCHPROOF_UNSUPPORTED_SCOPES);
const UNSUPPORTED_PROPERTY_KEYS = new Set([
  "unsupported_category",
  "parser_rule_id",
  "unsupported_scope",
]);

export function getUnsupportedRoundScope(value) {
  if (!Number.isInteger(value) || value < 1 || value > 200) return null;
  if (value === 1) return "one";
  if (value <= 5) return "two_to_five";
  if (value <= 20) return "six_to_twenty";
  return "twenty_one_to_two_hundred";
}

function sanitizeProperties(event, properties) {
  if (
    properties === null ||
    typeof properties !== "object" ||
    Array.isArray(properties)
  ) {
    return null;
  }

  const keys = Object.keys(properties);
  if (event !== "unsupported_result_shown") {
    return keys.length === 0 ? {} : null;
  }

  if (keys.some((key) => !UNSUPPORTED_PROPERTY_KEYS.has(key))) return null;

  const safe = {};
  if (Object.hasOwn(properties, "unsupported_category")) {
    if (!CATEGORY_SET.has(properties.unsupported_category)) return null;
    safe.unsupported_category = properties.unsupported_category;
  }
  if (Object.hasOwn(properties, "parser_rule_id")) {
    if (!PARSER_RULE_SET.has(properties.parser_rule_id)) return null;
    safe.parser_rule_id = properties.parser_rule_id;
  }
  if (Object.hasOwn(properties, "unsupported_scope")) {
    if (!UNSUPPORTED_SCOPE_SET.has(properties.unsupported_scope)) return null;
    safe.unsupported_scope = properties.unsupported_scope;
  }
  return safe;
}

export function recordStitchProofEvent({
  event,
  properties = {},
  storage,
  gpcActive,
  getGtag,
}) {
  if (!EVENT_SET.has(event)) return false;

  const safeProperties = sanitizeProperties(event, properties);
  if (safeProperties === null || gpcActive || !hasAnalyticsConsent(storage)) {
    return false;
  }

  let gtag;
  try {
    gtag = getGtag();
  } catch {
    return false;
  }
  if (typeof gtag !== "function") return false;

  try {
    gtag("event", event, {
      feature_slug: "stitchproof-designer-report",
      ...safeProperties,
    });
    return true;
  } catch {
    return false;
  }
}

export function recordStitchProofBrowserEvent({
  event,
  properties = {},
  getStorage,
  getGpcActive,
  getGtag,
}) {
  let storage;
  let gpcActive;
  try {
    storage = getStorage();
    gpcActive = getGpcActive();
  } catch {
    return false;
  }
  return recordStitchProofEvent({ event, properties, storage, gpcActive, getGtag });
}
