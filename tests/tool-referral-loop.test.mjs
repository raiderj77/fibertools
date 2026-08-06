import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildToolShareUrl } from "../src/lib/tool-share.mjs";
import {
  CONSENT_CHANGED_EVENT,
  createToolCompletionTracker,
  hasAnalyticsConsent,
} from "../src/lib/tool-completion-tracker.mjs";

const read = (path) => fs.readFileSync(path, "utf8");

const trackedTools = new Map([
  ["src/app/blanket-calculator/BlanketCalculatorTool.tsx", "blanket-calculator"],
  ["src/app/yarn-calculator/YarnCalculatorTool.tsx", "yarn-calculator"],
  ["src/app/cast-on-calculator/CastOnCalculatorTool.tsx", "cast-on-calculator"],
  ["src/app/sock-calculator/SockCalculatorTool.tsx", "sock-calculator"],
  ["src/app/yarn-weight-calculator/YarnWeightCalculatorTool.tsx", "yarn-weight-calculator"],
]);

test("builds an attributable share URL without carrying visitor or result data", () => {
  const shared = new URL(
    buildToolShareUrl(
      "https://fibertools.app/yarn-calculator?email=private%40example.com&yards=1200#result",
      "yarn-calculator",
    ),
  );

  assert.equal(shared.origin, "https://fibertools.app");
  assert.equal(shared.pathname, "/yarn-calculator");
  assert.equal(shared.hash, "");
  assert.deepEqual([...shared.searchParams.entries()], [
    ["utm_source", "tool_share"],
    ["utm_medium", "referral"],
    ["utm_campaign", "calculator_result"],
    ["utm_content", "yarn-calculator"],
  ]);
});

test("tracks one privacy-minimized completion and exposes result sharing on selected tools", () => {
  const tracker = read("src/lib/tool-completion-tracker.mjs");
  assert.match(
    tracker,
    /gtag\("event", "tool_completion", \{\s*tool_slug: toolSlug,\s*\}\)/,
  );
  assert.match(tracker, /hasAnalyticsConsent\(storage\)/);

  for (const [path, slug] of trackedTools) {
    const source = read(path);
    assert.match(source, new RegExp(`useToolCompletion\\("${slug}"`));
    assert.match(source, new RegExp(`toolSlug="${slug}"`));
    assert.match(source, /<ResultShareButton/);
  }

  const yarnCalculator = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
  assert.match(
    yarnCalculator,
    /useToolCompletion\("yarn-calculator", result, hasInteracted && Boolean\(result\)\)/,
  );
});

test("keeps the protected StitchProof checker outside the generic traffic loop", () => {
  const checker = read("src/app/amigurumi-pattern-checker/AmigurumiPatternCheckerTool.tsx");
  assert.doesNotMatch(checker, /useToolCompletion|ResultShareButton/);
});

function consentStorage(status) {
  return {
    getItem() {
      return status.current === null
        ? null
        : JSON.stringify({ analytics: status.current, ads: status.current });
    },
  };
}

function trackerHarness(initialConsent, initialGtag) {
  const status = { current: initialConsent };
  const listeners = new Map();
  const timers = new Map();
  const calls = [];
  let timerSequence = 0;
  let gtag = initialGtag
    ? (...args) => calls.push(args)
    : undefined;

  const tracker = createToolCompletionTracker({
    toolSlug: "cast-on-calculator",
    storage: consentStorage(status),
    getGtag: () => gtag,
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
    setIntervalFn: (callback) => {
      timerSequence += 1;
      timers.set(timerSequence, callback);
      return timerSequence;
    },
    clearIntervalFn: (timerId) => timers.delete(timerId),
    onSent: () => {},
  });

  return {
    calls,
    dispose: () => tracker.dispose(),
    grant() {
      status.current = "granted";
      listeners.get(CONSENT_CHANGED_EVENT)?.({ detail: { analytics: "granted" } });
    },
    revoke() {
      status.current = "denied";
      listeners.get(CONSENT_CHANGED_EVENT)?.({ detail: { analytics: "denied" } });
    },
    loadGtag() {
      gtag = (...args) => calls.push(args);
    },
    runTimers() {
      for (const callback of [...timers.values()]) callback();
    },
    status,
  };
}

test("requires an explicit current analytics grant", () => {
  const denied = { current: "denied" };
  assert.equal(hasAnalyticsConsent(consentStorage(denied)), false);
  denied.current = "granted";
  assert.equal(hasAnalyticsConsent(consentStorage(denied)), true);
  denied.current = null;
  assert.equal(hasAnalyticsConsent(consentStorage(denied)), false);
});

test("does not send after consent is revoked while analytics loads", () => {
  const harness = trackerHarness("granted", false);
  harness.revoke();
  harness.loadGtag();
  harness.runTimers();
  assert.deepEqual(harness.calls, []);
  harness.dispose();
});

test("sends once when consent is granted and analytics finishes loading", () => {
  const harness = trackerHarness("denied", false);
  harness.grant();
  harness.loadGtag();
  harness.runTimers();
  harness.runTimers();
  assert.deepEqual(harness.calls, [
    ["event", "tool_completion", { tool_slug: "cast-on-calculator" }],
  ]);
  harness.dispose();
});
