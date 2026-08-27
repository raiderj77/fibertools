import assert from "node:assert/strict";
import test from "node:test";

import {
  getUnsupportedRoundScope,
  recordStitchProofBrowserEvent,
  recordStitchProofEvent,
  STITCHPROOF_EVENTS,
  STITCHPROOF_PARSER_RULE_IDS,
  STITCHPROOF_UNSUPPORTED_CATEGORIES,
  STITCHPROOF_UNSUPPORTED_SCOPES,
} from "../src/lib/stitchproof-analytics-core.mjs";

const REQUESTED_EVENTS = [
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
];

function consentStorage(analytics = "granted") {
  return {
    getItem() {
      return JSON.stringify({ analytics });
    },
  };
}

function record({
  event = "designer_mode_opened",
  properties = {},
  analytics = "granted",
  gpcActive = false,
  calls = [],
} = {}) {
  return recordStitchProofEvent({
    event,
    properties,
    storage: consentStorage(analytics),
    gpcActive,
    getGtag: () => (...args) => calls.push(args),
  });
}

test("exposes exactly the requested StitchProof conversion events", () => {
  assert.deepEqual(STITCHPROOF_EVENTS, REQUESTED_EVENTS);
});

test("every requested event can send only after an explicit analytics grant", () => {
  const calls = [];
  for (const event of REQUESTED_EVENTS) {
    assert.equal(record({ event, calls }), true, event);
  }
  assert.deepEqual(
    calls.map((call) => call[1]),
    REQUESTED_EVENTS,
  );
  assert.ok(calls.every((call) => call[0] === "event"));
  assert.ok(calls.every((call) => call[2].feature_slug === "stitchproof-designer-report"));
});

test("denied, missing, malformed, or GPC-overridden consent prevents sends", () => {
  for (const analytics of ["denied", null, "loading"]) {
    const calls = [];
    assert.equal(record({ analytics, calls }), false);
    assert.deepEqual(calls, []);
  }

  const calls = [];
  assert.equal(record({ analytics: "granted", gpcActive: true, calls }), false);
  assert.deepEqual(calls, []);

  assert.equal(recordStitchProofEvent({
    event: "designer_mode_opened",
    properties: {},
    storage: { getItem: () => "not-json" },
    gpcActive: false,
    getGtag: () => () => assert.fail("gtag must not be called"),
  }), false);
  assert.equal(recordStitchProofEvent({
    event: "designer_mode_opened",
    properties: {},
    storage: { getItem: () => null },
    gpcActive: false,
    getGtag: () => () => assert.fail("gtag must not be called"),
  }), false);
});

test("browser analytics fail closed when storage access throws", () => {
  assert.equal(recordStitchProofBrowserEvent({
    event: "free_check_started",
    getStorage() {
      throw new DOMException("Blocked", "SecurityError");
    },
    getGpcActive: () => false,
    getGtag: () => () => assert.fail("gtag must not be called"),
  }), false);
});

test("rejects unknown events and every arbitrary or pattern-derived property", () => {
  assert.equal(record({ event: "made_up_event" }), false);

  for (const key of [
    "pattern_text",
    "instruction_excerpt",
    "pattern_title",
    "designer_name",
    "designer_nickname",
    "designer_notes",
    "correction_text",
    "calculated_stitch_value",
    "email",
  ]) {
    assert.equal(
      record({ event: "unsupported_result_shown", properties: { [key]: "private value" } }),
      false,
      key,
    );
  }

  assert.equal(
    record({ event: "report_previewed", properties: { unsupported_category: "other" } }),
    false,
  );
});

test("allows only the closed unsupported category and parser-rule enums", () => {
  const calls = [];
  for (const unsupported_category of STITCHPROOF_UNSUPPORTED_CATEGORIES) {
    assert.equal(record({
      event: "unsupported_result_shown",
      properties: { unsupported_category },
      calls,
    }), true);
  }
  for (const parser_rule_id of STITCHPROOF_PARSER_RULE_IDS) {
    assert.equal(record({
      event: "unsupported_result_shown",
      properties: { parser_rule_id },
      calls,
    }), true);
  }

  assert.equal(record({
    event: "unsupported_result_shown",
    properties: { unsupported_category: "free form" },
  }), false);
  assert.equal(record({
    event: "unsupported_result_shown",
    properties: { parser_rule_id: "raw parser error" },
  }), false);
});

test("converts unsupported totals to a closed scope instead of sending exact counts", () => {
  assert.equal(getUnsupportedRoundScope(1), "one");
  assert.equal(getUnsupportedRoundScope(2), "two_to_five");
  assert.equal(getUnsupportedRoundScope(5), "two_to_five");
  assert.equal(getUnsupportedRoundScope(6), "six_to_twenty");
  assert.equal(getUnsupportedRoundScope(20), "six_to_twenty");
  assert.equal(getUnsupportedRoundScope(21), "twenty_one_to_two_hundred");
  assert.equal(getUnsupportedRoundScope(200), "twenty_one_to_two_hundred");
  for (const rejected of [0, -1, 1.5, 201, "2"]) assert.equal(getUnsupportedRoundScope(rejected), null);

  for (const unsupported_scope of STITCHPROOF_UNSUPPORTED_SCOPES) {
    assert.equal(record({
      event: "unsupported_result_shown",
      properties: { unsupported_scope },
    }), true);
  }
  assert.equal(record({
    event: "unsupported_result_shown",
    properties: { unsupported_scope: "exactly_17" },
  }), false);
  assert.equal(record({
    event: "unsupported_result_shown",
    properties: { unsupported_round_count: 2 },
  }), false);
});

test("sends only reconstructed safe fields rather than spreading caller data", () => {
  const calls = [];
  assert.equal(record({
    event: "unsupported_result_shown",
    properties: {
      unsupported_category: "nested_repeat",
      parser_rule_id: "fixed_repeat",
      unsupported_scope: "two_to_five",
    },
    calls,
  }), true);
  assert.deepEqual(calls, [[
    "event",
    "unsupported_result_shown",
    {
      feature_slug: "stitchproof-designer-report",
      unsupported_category: "nested_repeat",
      parser_rule_id: "fixed_repeat",
      unsupported_scope: "two_to_five",
    },
  ]]);
});
