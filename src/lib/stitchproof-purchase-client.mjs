"use client";

import { createCorrection, restoreProjectJson, STITCHPROOF_PROJECT_SCHEMA } from "./stitchproof-designer.mjs";
import { STITCHPROOF_MARKET_POLICY_VERSION, isStitchProofPurchaseCountry } from "./stitchproof-markets.mjs";

export const STITCHPROOF_RECOVERY_SCHEMA = "fibertools.stitchproof-recovery";
export const STITCHPROOF_RECOVERY_VERSION = 1;
export const MAX_RECOVERY_BYTES = 2_000_000;
export const MAX_DRAFT_TEXT_LENGTH = 250_000;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const CLAIM_SECRET = /^[0-9a-f]{64}$/;
const PURCHASE_ERROR = "Purchase access could not be checked. Keep your recovery backup and try again later.";
const CORRECTION_KEYS = new Set(["roundNumber", "startingCount", "writtenTotal", "repeatCount", "consumed", "created", "classification"]);

function plainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, allowed, label) {
  if (!plainObject(value) || Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new TypeError(`Invalid ${label}.`);
  }
}

function draftString(value, maximum, label) {
  if (typeof value !== "string" || value.length > maximum) throw new TypeError(`Invalid ${label}.`);
  return value;
}

export function validatePurchaseIdentity(value) {
  exactKeys(value, ["projectId", "claimSecret"], "project recovery identity");
  if (typeof value.projectId !== "string" || typeof value.claimSecret !== "string"
    || !UUID_V4.test(value.projectId) || !CLAIM_SECRET.test(value.claimSecret)) {
    throw new TypeError("Invalid project recovery identity.");
  }
  return { projectId: value.projectId, claimSecret: value.claimSecret };
}

/** Random access identity only; never derive identifiers from pattern contents. */
export function createPurchaseIdentity(cryptoProvider = globalThis.crypto) {
  if (typeof cryptoProvider?.randomUUID !== "function" || typeof cryptoProvider?.getRandomValues !== "function") {
    throw new Error("Secure project recovery is unavailable in this browser.");
  }
  const bytes = new Uint8Array(32);
  cryptoProvider.getRandomValues(bytes);
  return validatePurchaseIdentity({
    projectId: cryptoProvider.randomUUID(),
    claimSecret: Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(""),
  });
}

/** Validate source types, not round math: a temporarily invalid draft must remain recoverable. */
export function validateRecoveryDraft(value) {
  exactKeys(value, ["metadata", "patternText", "initialStartingCount", "corrections", "previousVersion", "revisedVersion", "includeExcerpts"], "recovery draft");
  exactKeys(value.metadata, ["title", "designerNickname", "version", "reviewedAt", "sectionLabels", "designerNotes"], "draft metadata");
  const limits = { title: 300, designerNickname: 200, version: 100, reviewedAt: 40, sectionLabels: 5000, designerNotes: 5000 };
  const metadata = Object.fromEntries(Object.entries(limits).map(([key, maximum]) => [key, draftString(value.metadata[key], maximum, "draft metadata")]));
  if (!Array.isArray(value.corrections) || value.corrections.length > 2000) throw new TypeError("Invalid draft correction history.");
  const corrections = value.corrections.map((entry) => {
    if (!plainObject(entry) || !plainObject(entry.changes) || Object.keys(entry.changes).some((key) => !CORRECTION_KEYS.has(key))) {
      throw new TypeError("Invalid draft correction history.");
    }
    return createCorrection({
      lineIndex: entry.lineIndex,
      targetRoundNumber: entry.targetRoundNumber,
      targetSource: entry.targetSource,
      id: entry.id,
      note: entry.note,
      recordedAt: entry.recordedAt,
      ...entry.changes,
    });
  });
  if (typeof value.includeExcerpts !== "boolean") throw new TypeError("Invalid instruction-excerpt preference.");
  return {
    metadata,
    patternText: draftString(value.patternText, MAX_DRAFT_TEXT_LENGTH, "draft pattern text"),
    initialStartingCount: draftString(value.initialStartingCount, 100, "draft starting count"),
    corrections,
    previousVersion: draftString(value.previousVersion, MAX_DRAFT_TEXT_LENGTH, "previous draft version"),
    revisedVersion: draftString(value.revisedVersion, MAX_DRAFT_TEXT_LENGTH, "revised draft version"),
    includeExcerpts: value.includeExcerpts,
  };
}

export function createRecoveryEnvelope({ draft, identity }) {
  return {
    schema: STITCHPROOF_RECOVERY_SCHEMA,
    schemaVersion: STITCHPROOF_RECOVERY_VERSION,
    draft: validateRecoveryDraft(draft),
    identity: validatePurchaseIdentity(identity),
  };
}

export function serializeRecoveryBackup(input) {
  const serialized = `${JSON.stringify(createRecoveryEnvelope(input), null, 2)}\n`;
  if (new TextEncoder().encode(serialized).byteLength > MAX_RECOVERY_BYTES) {
    throw new TypeError("This recovery backup exceeds the supported 2 MB limit. No data was removed.");
  }
  return serialized;
}

export function parseRecoveryBackup(serialized, { createIdentity = createPurchaseIdentity } = {}) {
  if (typeof serialized !== "string" || new TextEncoder().encode(serialized).byteLength > MAX_RECOVERY_BYTES) {
    throw new TypeError("The recovery backup exceeds the supported 2 MB limit.");
  }
  let parsed;
  try { parsed = JSON.parse(serialized); } catch { throw new TypeError("This is not a valid JSON recovery backup."); }
  if (parsed?.schema === STITCHPROOF_PROJECT_SCHEMA) {
    const legacy = restoreProjectJson(serialized);
    return {
      legacy: true,
      identity: validatePurchaseIdentity(createIdentity()),
      draft: validateRecoveryDraft({
        metadata: { ...legacy.metadata, sectionLabels: legacy.metadata.sectionLabels.replace(/\r?\n/g, ", ") },
        patternText: legacy.patternText,
        initialStartingCount: legacy.initialStartingCount == null ? "" : String(legacy.initialStartingCount),
        corrections: legacy.corrections,
        previousVersion: legacy.previousVersion,
        revisedVersion: legacy.revisedVersion,
        includeExcerpts: legacy.preferences.includeInstructionExcerpts,
      }),
    };
  }
  exactKeys(parsed, ["schema", "schemaVersion", "draft", "identity"], "recovery backup");
  if (parsed.schema !== STITCHPROOF_RECOVERY_SCHEMA || parsed.schemaVersion !== STITCHPROOF_RECOVERY_VERSION) {
    throw new TypeError("This recovery backup version is not supported.");
  }
  const envelope = createRecoveryEnvelope(parsed);
  return { draft: envelope.draft, identity: envelope.identity, legacy: false };
}

/** A response for a replaced/imported project must never unlock the current project. */
export function createProjectRequestGuard() {
  let generation = 0;
  let identity = null;
  return {
    activate(value) { identity = validatePurchaseIdentity(value); generation += 1; },
    capture() { return identity ? { generation, identity: { ...identity } } : null; },
    isCurrent(ticket) {
      return Boolean(ticket && identity && ticket.generation === generation
        && ticket.identity.projectId === identity.projectId && ticket.identity.claimSecret === identity.claimSecret);
    },
  };
}

/** Checkout country is ephemeral request state, never part of a recovery identity. */
export function createCheckoutCountryGuard() {
  let generation = 0;
  let country = "";
  return {
    select(value) {
      if (value !== "" && !isStitchProofPurchaseCountry(value)) throw new TypeError("Choose a listed checkout country.");
      country = value;
      generation += 1;
    },
    capture() { return { generation, country }; },
    isCurrent(ticket) {
      return Boolean(ticket && ticket.generation === generation && ticket.country === country);
    },
  };
}

async function purchaseRequest(path, method, payloadFactory, fetchImpl) {
  try {
    const response = await fetchImpl(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      ...(payloadFactory ? {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFactory()),
      } : {}),
    });
    if (!response.ok) throw new Error(PURCHASE_ERROR);
    return await response.json();
  } catch {
    throw new Error(PURCHASE_ERROR);
  }
}

export async function getCheckoutOffer(fetchImpl = globalThis.fetch) {
  const result = await purchaseRequest("/api/stitchproof/checkout", "GET", null, fetchImpl);
  if (!plainObject(result) || result.available !== true) return { available: false };
  const keys = Object.keys(result);
  if (keys.length === 1) return { available: true, checkoutMode: "legacy" };
  if (keys.length === 3 && keys.every((key) => ["available", "checkoutMode", "marketPolicyVersion"].includes(key))
    && result.checkoutMode === "managed" && result.marketPolicyVersion === STITCHPROOF_MARKET_POLICY_VERSION) {
    return { available: true, checkoutMode: "managed", marketPolicyVersion: STITCHPROOF_MARKET_POLICY_VERSION };
  }
  return { available: false };
}

export async function getCheckoutAvailability(fetchImpl = globalThis.fetch) {
  return (await getCheckoutOffer(fetchImpl)).available;
}

function checkoutResult(result) {
  if (result?.status === "paid") return { status: "paid" };
  try {
    const url = new URL(result?.checkoutUrl);
    if (url.origin !== "https://checkout.stripe.com" || url.username || url.password) {
      throw new Error(PURCHASE_ERROR);
    }
    return { checkoutUrl: url.toString() };
  } catch {
    throw new Error(PURCHASE_ERROR);
  }
}

export async function prepareStitchProofCheckout(identity, fetchImpl = globalThis.fetch) {
  return checkoutResult(await purchaseRequest("/api/stitchproof/checkout", "POST",
    () => validatePurchaseIdentity(identity), fetchImpl));
}

export async function prepareManagedStitchProofCheckout(identity, country, fetchImpl = globalThis.fetch) {
  return checkoutResult(await purchaseRequest("/api/stitchproof/checkout", "POST", () => {
    if (!isStitchProofPurchaseCountry(country)) throw new TypeError("Choose a listed checkout country.");
    return { ...validatePurchaseIdentity(identity), country };
  }, fetchImpl));
}

export async function verifyStitchProofAccess(identity, fetchImpl = globalThis.fetch) {
  const result = await purchaseRequest("/api/stitchproof/access", "POST", () => validatePurchaseIdentity(identity), fetchImpl);
  if (!["paid", "pending", "unavailable"].includes(result?.status)) throw new Error(PURCHASE_ERROR);
  return { status: result.status };
}
