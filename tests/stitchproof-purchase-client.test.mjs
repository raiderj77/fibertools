import test from "node:test";
import assert from "node:assert/strict";
import {
  createProjectRequestGuard,
  createPurchaseIdentity,
  createRecoveryEnvelope,
  getCheckoutAvailability,
  MAX_DRAFT_TEXT_LENGTH,
  MAX_RECOVERY_BYTES,
  parseRecoveryBackup,
  prepareStitchProofCheckout,
  serializeRecoveryBackup,
  validatePurchaseIdentity,
  validateRecoveryDraft,
  verifyStitchProofAccess,
} from "../src/lib/stitchproof-purchase-client.mjs";
import { createCorrection, createDesignerProject, exportProjectJson } from "../src/lib/stitchproof-designer.mjs";

const identity = { projectId: "00000000-0000-4000-8000-000000000001", claimSecret: "a".repeat(64) };
const otherIdentity = { projectId: "00000000-0000-4000-8000-000000000002", claimSecret: "b".repeat(64) };
const example = "Round 1: 6 sc in magic ring [6]";

function draft(overrides = {}) {
  return {
    metadata: { title: "Private draft", designerNickname: "Local nickname", version: "draft 1", reviewedAt: "", sectionLabels: "Head, Body", designerNotes: "Private notes" },
    patternText: example,
    initialStartingCount: "",
    corrections: [],
    previousVersion: "",
    revisedVersion: "",
    includeExcerpts: false,
    ...overrides,
  };
}

function response(value, ok = true) { return { ok, json: async () => value }; }

test("purchase identity uses independent secure random values and no draft-derived data", () => {
  let randomBytesRequested = 0;
  const actual = createPurchaseIdentity({
    randomUUID: () => identity.projectId,
    getRandomValues: (bytes) => { randomBytesRequested = bytes.length; bytes.fill(0xaa); return bytes; },
  });
  assert.equal(randomBytesRequested, 32);
  assert.deepEqual(actual, identity);
  assert.throws(() => createPurchaseIdentity({}), /Secure project recovery is unavailable/);
  assert.deepEqual(Object.keys(actual).sort(), ["claimSecret", "projectId"]);
});

test("identity validation rejects coercible arrays, numbers, missing fields, and imported access flags", () => {
  for (const malformed of [null, [], {}, { ...identity, projectId: [identity.projectId] }, { ...identity, claimSecret: [identity.claimSecret] }, { ...identity, claimSecret: 2 }, { ...identity, projectId: "00000000-0000-1000-8000-000000000001" }, { ...identity, paid: true }, { ...identity, claimSecret: "x".repeat(64) }]) {
    assert.throws(() => validatePurchaseIdentity(malformed), /Invalid project recovery identity/);
  }
});

test("raw recovery preserves unfinished math and unmatched corrections without analysis", () => {
  const corrections = [createCorrection({ lineIndex: 300, targetRoundNumber: 301, targetSource: "A previous unmatched instruction", writtenTotal: 10, note: "Keep this correction for recovery", id: "local-correction", recordedAt: "2026-08-26T00:00:00.000Z" })];
  const unfinished = draft({
    patternText: Array.from({ length: 250 }, (_, index) => `Round ${index + 1}: unfinished custom draft`).join("\n"),
    initialStartingCount: "1e309",
    previousVersion: "  unfinished text\n\n",
    revisedVersion: "unsupported draft text\n",
    corrections,
    includeExcerpts: true,
  });
  const restored = parseRecoveryBackup(serializeRecoveryBackup({ draft: unfinished, identity }));
  assert.deepEqual(restored, { draft: unfinished, identity, legacy: false });
  const edited = { ...restored.draft, patternText: "Revised later" };
  assert.deepEqual(parseRecoveryBackup(serializeRecoveryBackup({ draft: edited, identity: restored.identity })).identity, identity);
});

test("legacy JSON remains importable but cannot supply a payment credential", () => {
  const legacy = createDesignerProject({ patternText: example, projectId: identity.projectId, metadata: { sectionLabels: ["Head", "Body"] } });
  const restored = parseRecoveryBackup(exportProjectJson(legacy), { createIdentity: () => otherIdentity });
  assert.equal(restored.legacy, true);
  assert.deepEqual(restored.identity, otherIdentity);
  assert.equal(restored.draft.metadata.sectionLabels, "Head, Body");
  assert.equal(restored.draft.patternText, example);
  assert.equal(restored.draft.includeExcerpts, false);
});

test("recovery schema ignores no arbitrary access claim and rejects malformed sensitive draft values", () => {
  const envelope = createRecoveryEnvelope({ draft: draft(), identity });
  for (const malformed of [
    { ...envelope, paid: true },
    { ...envelope, schemaVersion: 2 },
    { ...envelope, identity: { ...identity, status: "paid" } },
    { ...envelope, draft: { ...envelope.draft, includeExcerpts: "true" } },
    { ...envelope, draft: { ...envelope.draft, initialStartingCount: 6 } },
    { ...envelope, draft: { ...envelope.draft, metadata: { ...envelope.draft.metadata, email: "must-not-be-accepted" } } },
    { ...envelope, draft: { ...envelope.draft, corrections: [{ lineIndex: 0, changes: { paid: true } }] } },
  ]) assert.throws(() => parseRecoveryBackup(JSON.stringify(malformed)));
  assert.throws(() => parseRecoveryBackup("not json"), /not a valid JSON recovery backup/);
  assert.throws(() => validateRecoveryDraft(draft({ patternText: "x".repeat(MAX_DRAFT_TEXT_LENGTH + 1) })), /Invalid draft pattern text/);
  assert.throws(() => parseRecoveryBackup("x".repeat(MAX_RECOVERY_BYTES + 1)), /2 MB/);
});

test("backup size is bounded in bytes without silently truncating a draft", () => {
  const input = draft({ patternText: "漢".repeat(MAX_DRAFT_TEXT_LENGTH), previousVersion: "漢".repeat(MAX_DRAFT_TEXT_LENGTH), revisedVersion: "漢".repeat(MAX_DRAFT_TEXT_LENGTH) });
  assert.throws(() => serializeRecoveryBackup({ draft: input, identity }), /2 MB.*No data was removed/);
  assert.equal(input.patternText.length, MAX_DRAFT_TEXT_LENGTH);
});

test("generation guard invalidates pending replies after restore, including A to B to A", () => {
  const guard = createProjectRequestGuard();
  assert.equal(guard.capture(), null);
  guard.activate(identity);
  const before = guard.capture();
  assert.equal(guard.isCurrent(before), true);
  guard.activate(otherIdentity);
  assert.equal(guard.isCurrent(before), false);
  const second = guard.capture();
  guard.activate(identity);
  assert.equal(guard.isCurrent(before), false);
  assert.equal(guard.isCurrent(second), false);
  assert.equal(guard.isCurrent(guard.capture()), true);
});

test("checkout and access requests send only the strict random project identity with no caching or redirects", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return response(url.endsWith("/access") ? { status: "paid" } : options.method === "GET" ? { available: true } : { checkoutUrl: "https://checkout.stripe.com/c/pay/synthetic" });
  };
  assert.equal(await getCheckoutAvailability(fetchImpl), true);
  assert.deepEqual(await prepareStitchProofCheckout(identity, fetchImpl), { checkoutUrl: "https://checkout.stripe.com/c/pay/synthetic" });
  assert.deepEqual(await verifyStitchProofAccess(identity, fetchImpl), { status: "paid" });
  assert.deepEqual(calls.map(({ url }) => url), ["/api/stitchproof/checkout", "/api/stitchproof/checkout", "/api/stitchproof/access"]);
  for (const { options } of calls) {
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.equal(options.credentials, "same-origin");
  }
  assert.equal(calls[0].options.body, undefined);
  for (const { options } of calls.slice(1)) assert.deepEqual(JSON.parse(options.body), identity);
  await assert.rejects(() => prepareStitchProofCheckout({ ...identity, patternText: example }, fetchImpl), /Purchase access could not be checked/);
  assert.equal(calls.length, 3);
});

test("availability fails closed and existing paid access is a distinct backend result", async () => {
  for (const value of [{ available: false }, { available: "true" }, {}, null]) assert.equal(await getCheckoutAvailability(async () => response(value)), false);
  assert.deepEqual(await prepareStitchProofCheckout(identity, async () => response({ status: "paid" })), { status: "paid" });
  for (const status of ["paid", "pending", "unavailable"]) assert.deepEqual(await verifyStitchProofAccess(identity, async () => response({ status })), { status });
});

test("checkout accepts only exact HTTPS Stripe Checkout origin and rejects credentials, ports and lookalikes", async () => {
  for (const checkoutUrl of ["https://checkout.stripe.com:444/c/pay/x", "https://buy.stripe.com/x", "http://checkout.stripe.com/c/pay/x", "https://checkout.stripe.com.attacker.test/x", "https://checkout.stripe.com@attacker.test/x", "https://username:password@checkout.stripe.com/x", "javascript:alert(1)", "/relative", null]) {
    await assert.rejects(() => prepareStitchProofCheckout(identity, async () => response({ checkoutUrl })), /Purchase access could not be checked/);
  }
});

test("provider failures and malformed replies never echo credentials or provider body details", async () => {
  const failures = [async () => response({ message: identity.claimSecret }, false), async () => { throw new Error(identity.claimSecret); }, async () => ({ ok: true, json: async () => { throw new Error(identity.claimSecret); } })];
  for (const fetchImpl of failures) {
    await assert.rejects(() => verifyStitchProofAccess(identity, fetchImpl), (error) => error.message === "Purchase access could not be checked. Keep your recovery backup and try again later." && !error.message.includes(identity.claimSecret));
  }
  await assert.rejects(() => verifyStitchProofAccess(identity, async () => response({ status: "something-untrusted", message: identity.claimSecret })), /Purchase access could not be checked/);
});
