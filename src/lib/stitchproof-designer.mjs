import { evaluatePatternRound } from "./amigurumi-pattern-checker.mjs";

export const MAX_DESIGNER_ROUNDS = 200;
export const STITCHPROOF_PROJECT_SCHEMA = "fibertools.stitchproof-designer-project";
export const STITCHPROOF_PROJECT_SCHEMA_VERSION = 1;

export const ISSUE_CODES = Object.freeze({
  COUNT_MISMATCH: "COUNT_MISMATCH",
  CONSUMPTION_MISMATCH: "CONSUMPTION_MISMATCH",
  MISSING_WRITTEN_TOTAL: "MISSING_WRITTEN_TOTAL",
  DUPLICATE_ROUND_NUMBER: "DUPLICATE_ROUND_NUMBER",
  MISSING_ROUND_NUMBER: "MISSING_ROUND_NUMBER",
  ROUND_NUMBER_INFERRED: "ROUND_NUMBER_INFERRED",
  ROUND_NUMBER_OUT_OF_ORDER: "ROUND_NUMBER_OUT_OF_ORDER",
  UNSUPPORTED_NOTATION: "UNSUPPORTED_NOTATION",
  INVALID_REPEAT_CORRECTION: "INVALID_REPEAT_CORRECTION",
  USER_CORRECTION_APPLIED: "USER_CORRECTION_APPLIED",
  UNRESOLVED_ROUND: "UNRESOLVED_ROUND",
});

export const VERSION_CHANGE_CODES = Object.freeze({
  ROUND_ADDED: "ROUND_ADDED",
  ROUND_REMOVED: "ROUND_REMOVED",
  TEXT_CHANGED: "TEXT_CHANGED",
  WRITTEN_TOTAL_CHANGED: "WRITTEN_TOTAL_CHANGED",
  CALCULATED_TOTAL_CHANGED: "CALCULATED_TOTAL_CHANGED",
  STARTING_COUNT_CHANGED: "STARTING_COUNT_CHANGED",
  CONSUMED_COUNT_CHANGED: "CONSUMED_COUNT_CHANGED",
  ISSUE_RESOLVED: "ISSUE_RESOLVED",
  NEW_ISSUE_INTRODUCED: "NEW_ISSUE_INTRODUCED",
  MISSING_ROUND_RESOLVED: "MISSING_ROUND_RESOLVED",
  NEW_MISSING_ROUND: "NEW_MISSING_ROUND",
  UNSUPPORTED_PREVIOUS: "UNSUPPORTED_PREVIOUS",
  UNSUPPORTED_REVISED: "UNSUPPORTED_REVISED",
  UNSUPPORTED_BOTH: "UNSUPPORTED_BOTH",
});

const CORRECTION_FIELDS = Object.freeze({
  roundNumber: "roundNumber",
  startingCount: "startingCount",
  writtenTotal: "writtenTotal",
  repeatCount: "repeatCount",
  consumed: "consumed",
  created: "created",
  classification: "classification",
});

const CLASSIFICATIONS = new Set([
  "supported",
  "unsupported",
  "setup",
  "manual-review",
  "even",
  "increase",
  "decrease",
  "mixed",
  "magic-ring",
  "joining",
]);

const ISSUE_LABELS = Object.freeze({
  COUNT_MISMATCH: "Written total mismatch",
  CONSUMPTION_MISMATCH: "Starting-count consumption mismatch",
  MISSING_WRITTEN_TOTAL: "Missing written total",
  DUPLICATE_ROUND_NUMBER: "Duplicate round number",
  MISSING_ROUND_NUMBER: "Missing round number",
  ROUND_NUMBER_INFERRED: "Round number inferred",
  ROUND_NUMBER_OUT_OF_ORDER: "Round number out of order",
  UNSUPPORTED_NOTATION: "Unsupported notation",
  INVALID_REPEAT_CORRECTION: "Repeat correction could not be applied",
  USER_CORRECTION_APPLIED: "User correction applied",
  UNRESOLVED_ROUND: "Unresolved round",
});

const REPORT_METHODOLOGY = Object.freeze([
  "StitchProof applies deterministic rules to supported US-terminology amigurumi round instructions.",
  "It compares consumed stitches with the available starting count and calculated stitches with any written total.",
  "Version Compare groups entries by effective round number, matches duplicate entries first by identical deterministic results and then by normalized instruction text, and compares any remaining entries by position.",
  "User corrections are shown separately from the original parser output and do not alter the pasted pattern text.",
]);

const REPORT_LIMITATIONS = Object.freeze([
  "StitchProof checks only supported round math; it does not judge construction, wording quality, fit, safety, or whether a finished pattern is error-free.",
  "Nested repeats, custom stitches, charts, rows worked flat, knitting, garments, and image interpretation may require manual review.",
  "A passing result is not certification and does not replace a sample, technical edit, or human test crochet.",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}

function own(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function integerOrNull(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function nonNegativeInteger(value, field, { nullable = false, positive = false } = {}) {
  if (nullable && value === null) return null;
  if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) {
    throw new TypeError(`${field} must be ${nullable ? "null or " : ""}a ${positive ? "positive" : "non-negative"} integer.`);
  }
  return value;
}

function boundedString(value, maxLength, field) {
  const normalized = value == null ? "" : String(value);
  if (normalized.length > maxLength) throw new TypeError(`${field} exceeds ${maxLength} characters.`);
  return normalized;
}

function stableHash(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function stitchCountLabel(value) {
  return `${value} ${value === 1 ? "stitch" : "stitches"}`;
}

function patternLines(patternText) {
  return String(patternText ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function snapshotFromEvaluation(evaluated) {
  const snapshot = {
    roundNumber: evaluated.round,
    startingCount: evaluated.startingCount,
    writtenTotal: evaluated.writtenTotal,
    repeatCount: evaluated.parsedRepeatCount,
    consumed: evaluated.consumed,
    created: evaluated.created,
    classification: evaluated.instructionClassification,
    status: evaluated.status,
  };
  snapshot.status = statusForSnapshot(snapshot, evaluated.hasMagicRing, evaluated.failureKind);
  return snapshot;
}

function publicMessage(snapshot, hasMagicRing, fallbackMessage) {
  if (snapshot.classification === "manual-review") {
    return "This round was marked for manual review by the user.";
  }
  if (
    snapshot.classification === "unsupported"
    || snapshot.startingCount == null
    || snapshot.consumed == null
    || snapshot.created == null
  ) {
    if (fallbackMessage?.includes("outside the supported whole-number range")) return fallbackMessage;
    return fallbackMessage?.startsWith("Enter ")
      ? fallbackMessage
      : "This round uses notation the deterministic parser does not support yet.";
  }
  if (!hasMagicRing && snapshot.consumed !== snapshot.startingCount) {
    const difference = Math.abs(snapshot.consumed - snapshot.startingCount);
    return snapshot.consumed < snapshot.startingCount
      ? `${stitchCountLabel(difference)} from the starting count ${difference === 1 ? "is" : "are"} not used by this instruction.`
      : `This instruction consumes ${stitchCountLabel(difference)} more than are available.`;
  }
  if (snapshot.writtenTotal == null) {
    return "Calculated successfully, but there is no written total to compare.";
  }
  if (snapshot.created !== snapshot.writtenTotal) {
    const difference = snapshot.created - snapshot.writtenTotal;
    return difference > 0
      ? `The written total is ${stitchCountLabel(difference)} too low.`
      : `The written total is ${stitchCountLabel(Math.abs(difference))} too high.`;
  }
  return "The stitch math is consistent.";
}

function statusForSnapshot(snapshot, hasMagicRing, failureKind = null) {
  if (snapshot.classification === "manual-review") return "unresolved";
  if (snapshot.startingCount == null || snapshot.consumed == null || snapshot.created == null) {
    return failureKind === "unsupported-notation" ? "unsupported" : "unresolved";
  }
  if (snapshot.classification === "unsupported") return "unsupported";
  if (!hasMagicRing && snapshot.consumed !== snapshot.startingCount) return "incorrect";
  if (snapshot.writtenTotal == null) return "calculated";
  return snapshot.created === snapshot.writtenTotal ? "correct" : "incorrect";
}

function correctionEffect(original, effective, correctionCount) {
  if (correctionCount === 0) return null;
  if (original.status !== "correct" && effective.status === "correct") return "resolved";
  if (original.status === "correct" && effective.status !== "correct") return "introduced";
  return JSON.stringify(original) === JSON.stringify(effective) ? "unchanged" : "changed";
}

function issue(code, severity, message, resultKey, roundNumber, extra = {}) {
  return { code, severity, message, resultKey, roundNumber, ...extra };
}

function issuesForResult(result, invalidRepeatCorrection) {
  const issues = [];
  const { effective } = result;
  if (result.corrections.length > 0) {
    issues.push(issue(
      ISSUE_CODES.USER_CORRECTION_APPLIED,
      "info",
      `${result.corrections.length} user correction record${result.corrections.length === 1 ? " was" : "s were"} applied.`,
      result.key,
      result.round,
    ));
  }
  if (invalidRepeatCorrection) {
    issues.push(issue(
      ISSUE_CODES.INVALID_REPEAT_CORRECTION,
      "warning",
      "The repeat count could not be recalculated because the original repeat unit was not parsed.",
      result.key,
      result.round,
    ));
  }
  if (result.status === "unsupported") {
    issues.push(issue(
      ISSUE_CODES.UNSUPPORTED_NOTATION,
      "warning",
      result.message,
      result.key,
      result.round,
    ));
  } else if (result.status !== "unresolved") {
    if (!result.hasMagicRing && effective.consumed !== effective.startingCount) {
      issues.push(issue(
        ISSUE_CODES.CONSUMPTION_MISMATCH,
        "error",
        result.message,
        result.key,
        result.round,
      ));
    }
    if (effective.writtenTotal == null) {
      issues.push(issue(
        ISSUE_CODES.MISSING_WRITTEN_TOTAL,
        "warning",
        "There is no written total to compare with the calculated total.",
        result.key,
        result.round,
      ));
    } else if (effective.created !== effective.writtenTotal) {
      issues.push(issue(
        ISSUE_CODES.COUNT_MISMATCH,
        "error",
        `The calculated total ${effective.created} does not match the written total ${effective.writtenTotal}.`,
        result.key,
        result.round,
      ));
    }
  }
  if (result.status === "unresolved") {
    issues.push(issue(
      ISSUE_CODES.UNRESOLVED_ROUND,
      "warning",
      result.message,
      result.key,
      result.round,
    ));
  }
  return issues;
}

function normalizeCorrectionRecord(value) {
  if (!isPlainObject(value)) throw new TypeError("Each correction must be an object.");
  if (isPlainObject(value.changes)) {
    return createCorrection({
      lineIndex: value.lineIndex,
      targetRoundNumber: value.targetRoundNumber,
      targetSource: value.targetSource,
      ...value.changes,
      id: value.id,
      note: value.note,
      recordedAt: value.recordedAt,
    });
  }
  return createCorrection(value);
}

/**
 * Create one deterministic correction-history item. No timestamp or random ID
 * is invented; callers may supply recordedAt/id when those labels are useful.
 */
export function createCorrection(input) {
  if (!isPlainObject(input)) throw new TypeError("Correction input must be an object.");
  const lineIndex = nonNegativeInteger(input.lineIndex, "lineIndex");
  const targetRoundNumber = input.targetRoundNumber == null
    ? null
    : nonNegativeInteger(input.targetRoundNumber, "targetRoundNumber", { positive: true });
  const targetSource = input.targetSource == null
    ? ""
    : boundedString(input.targetSource, 10000, "targetSource").trim();
  const changes = {};

  for (const [inputField, outputField] of Object.entries(CORRECTION_FIELDS)) {
    if (!own(input, inputField)) continue;
    const value = input[inputField];
    if (value === undefined) continue;
    if (inputField === "roundNumber") changes[outputField] = nonNegativeInteger(value, inputField, { positive: true });
    else if (inputField === "writtenTotal") changes[outputField] = nonNegativeInteger(value, inputField, { nullable: true });
    else if (["startingCount", "consumed", "created"].includes(inputField)) {
      changes[outputField] = nonNegativeInteger(value, inputField);
    } else if (inputField === "repeatCount") {
      changes[outputField] = nonNegativeInteger(value, inputField, { positive: true });
    } else if (inputField === "classification") {
      if (!CLASSIFICATIONS.has(value)) throw new TypeError(`Unsupported instruction classification: ${value}`);
      changes[outputField] = value;
    }
  }

  if (Object.keys(changes).length === 0) throw new TypeError("A correction must change at least one supported field.");
  const note = boundedString(input.note, 2000, "correction note");
  const recordedAt = boundedString(input.recordedAt, 64, "recordedAt");
  const identityPayload = JSON.stringify({ lineIndex, targetRoundNumber, targetSource, changes, note, recordedAt });
  const id = boundedString(input.id, 120, "correction id") || `correction-${lineIndex + 1}-${stableHash(identityPayload)}`;

  return deepFreeze({
    id,
    lineIndex,
    targetRoundNumber,
    targetSource,
    changes,
    note,
    recordedAt,
    original: null,
    effective: null,
  });
}

function resolveCorrectionLineIndex(correction, lines, evaluations) {
  const hasRoundAnchor = correction.targetRoundNumber != null;
  const hasSourceAnchor = correction.targetSource !== "";
  if (!hasRoundAnchor && !hasSourceAnchor) return correction.lineIndex;

  const candidates = lines
    .map((source, index) => ({ source, index, round: evaluations[index].round }))
    .filter((candidate) => (
      (!hasRoundAnchor || candidate.round === correction.targetRoundNumber)
      && (!hasSourceAnchor || candidate.source === correction.targetSource)
    ));
  if (candidates.length === 1) return candidates[0].index;

  if (hasRoundAnchor && hasSourceAnchor) {
    const normalizedTarget = normalizeCorrectionAnchor(correction.targetSource);
    const instructionCandidates = lines
      .map((source, index) => ({ source, index }))
      .filter((candidate) => normalizeCorrectionAnchor(candidate.source) === normalizedTarget);
    if (instructionCandidates.length === 1) return instructionCandidates[0].index;
    const bodyTarget = normalizePatternInstruction(correction.targetSource);
    const bodyCandidates = lines
      .map((source, index) => ({ source, index }))
      .filter((candidate) => normalizePatternInstruction(candidate.source) === bodyTarget);
    return bodyCandidates.length === 1 ? bodyCandidates[0].index : null;
  }

  if (hasRoundAnchor) {
    const roundCandidates = evaluations
      .map((evaluation, index) => ({ index, round: evaluation.round }))
      .filter((candidate) => candidate.round === correction.targetRoundNumber);
    if (roundCandidates.length === 1) return roundCandidates[0].index;
  }
  if (hasSourceAnchor) {
    const sourceCandidates = lines
      .map((source, index) => ({ source, index }))
      .filter((candidate) => candidate.source === correction.targetSource);
    if (sourceCandidates.length === 1) return sourceCandidates[0].index;
  }
  return null;
}

function normalizeCorrectionAnchor(source) {
  return String(source ?? "")
    .normalize("NFKC")
    .replace(/^(?:round|rnd|r)\s*#?\s*\d+\s*[:.)-]?\s*/i, "")
    .replace(/[\[(]\s*(\d+)\s*(?:st(?:s|itches)?)?\s*[\])]\s*[.!]?$/i, " [$1]")
    .replace(/[×✕]/g, "x")
    .toLowerCase()
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s*([,;:])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function applyCorrectionChanges(snapshot, changes, evaluation) {
  const next = { ...snapshot };
  let invalidRepeatCorrection = false;
  if (own(changes, "roundNumber")) next.roundNumber = changes.roundNumber;
  if (own(changes, "startingCount")) next.startingCount = changes.startingCount;
  if (own(changes, "writtenTotal")) next.writtenTotal = changes.writtenTotal;
  if (own(changes, "repeatCount")) {
    next.repeatCount = changes.repeatCount;
    if (evaluation.repeatUnitConsumed == null || evaluation.repeatUnitCreated == null) {
      invalidRepeatCorrection = true;
    } else {
      const consumed = evaluation.hasMagicRing
        ? 0
        : evaluation.repeatUnitConsumed * changes.repeatCount;
      const created = evaluation.repeatUnitCreated * changes.repeatCount;
      if (!Number.isSafeInteger(consumed) || !Number.isSafeInteger(created)) {
        invalidRepeatCorrection = true;
      } else {
        next.consumed = consumed;
        next.created = created;
      }
    }
  }
  if (own(changes, "consumed")) next.consumed = changes.consumed;
  if (own(changes, "created")) next.created = changes.created;
  if (own(changes, "classification")) next.classification = changes.classification;
  next.status = statusForSnapshot(next, evaluation.hasMagicRing, evaluation.failureKind);
  return { snapshot: next, invalidRepeatCorrection };
}

function evaluateCorrectionStage(line, defaultStartingCount, fallbackRound, corrections) {
  let parserStartingCount = defaultStartingCount;
  for (const correction of corrections) {
    if (own(correction.changes, "startingCount")) parserStartingCount = correction.changes.startingCount;
  }
  const evaluation = evaluatePatternRound(line, parserStartingCount, fallbackRound);
  let snapshot = snapshotFromEvaluation(evaluation);
  let invalidRepeatCorrection = false;
  for (const correction of corrections) {
    const applied = applyCorrectionChanges(snapshot, correction.changes, evaluation);
    snapshot = applied.snapshot;
    if (own(correction.changes, "repeatCount")) {
      invalidRepeatCorrection = applied.invalidRepeatCorrection;
    }
  }
  snapshot.status = invalidRepeatCorrection
    ? "unresolved"
    : statusForSnapshot(snapshot, evaluation.hasMagicRing, evaluation.failureKind);
  return { evaluation, snapshot, invalidRepeatCorrection };
}

function numberingDiagnostics(results) {
  const diagnostics = [];
  const byNumber = new Map();

  for (const result of results) {
    if (!byNumber.has(result.round)) byNumber.set(result.round, []);
    byNumber.get(result.round).push(result.key);
    if (!result.explicitRoundNumber) {
      diagnostics.push(issue(
        ISSUE_CODES.ROUND_NUMBER_INFERRED,
        "warning",
        `Round ${result.round} was inferred from its line position because no explicit number was found.`,
        result.key,
        result.round,
        { resultKeys: [result.key] },
      ));
    }
  }

  for (const [roundNumber, resultKeys] of byNumber) {
    if (resultKeys.length < 2) continue;
    diagnostics.push(issue(
      ISSUE_CODES.DUPLICATE_ROUND_NUMBER,
      "error",
      `Round ${roundNumber} appears ${resultKeys.length} times.`,
      resultKeys[0],
      roundNumber,
      { resultKeys },
    ));
  }

  const uniqueNumbers = [...byNumber.keys()].sort((left, right) => left - right);
  for (let index = 1; index < uniqueNumbers.length; index += 1) {
    const previous = uniqueNumbers[index - 1];
    const current = uniqueNumbers[index];
    const missingCount = current - previous - 1;
    if (missingCount > MAX_DESIGNER_ROUNDS) {
      const beforeKey = byNumber.get(previous).at(-1);
      const afterKey = byNumber.get(current)[0];
      diagnostics.push(issue(
        ISSUE_CODES.MISSING_ROUND_NUMBER,
        "error",
        `Rounds ${previous + 1} through ${current - 1} are missing between rounds ${previous} and ${current}.`,
        afterKey,
        previous + 1,
        {
          missingRound: previous + 1,
          missingRoundStart: previous + 1,
          missingRoundEnd: current - 1,
          missingRoundCount: missingCount,
          beforeRound: previous,
          afterRound: current,
          resultKeys: [beforeKey, afterKey],
        },
      ));
      continue;
    }
    for (let missingRound = previous + 1; missingRound < current; missingRound += 1) {
      const beforeKey = byNumber.get(previous).at(-1);
      const afterKey = byNumber.get(current)[0];
      diagnostics.push(issue(
        ISSUE_CODES.MISSING_ROUND_NUMBER,
        "error",
        `Round ${missingRound} is missing between rounds ${previous} and ${current}.`,
        afterKey,
        missingRound,
        { missingRound, beforeRound: previous, afterRound: current, resultKeys: [beforeKey, afterKey] },
      ));
    }
  }

  for (let index = 1; index < results.length; index += 1) {
    if (results[index].round >= results[index - 1].round) continue;
    diagnostics.push(issue(
      ISSUE_CODES.ROUND_NUMBER_OUT_OF_ORDER,
      "error",
      `Round ${results[index].round} appears after round ${results[index - 1].round}.`,
      results[index].key,
      results[index].round,
      { resultKeys: [results[index - 1].key, results[index].key] },
    ));
  }

  return diagnostics;
}

function emptySummary() {
  return {
    totalRounds: 0,
    passedRounds: 0,
    correctRounds: 0,
    mismatches: 0,
    countMismatches: 0,
    consumptionMismatches: 0,
    missingTotals: 0,
    numberingIssues: 0,
    unsupportedNotation: 0,
    correctedRounds: 0,
    unresolvedRounds: 0,
  };
}

function summarizeAnalysis(results, numberingIssues) {
  const summary = emptySummary();
  summary.totalRounds = results.length;
  summary.correctRounds = results.filter((result) => result.status === "correct").length;
  summary.passedRounds = summary.correctRounds;
  summary.countMismatches = results.filter((result) => result.issueCodes.includes(ISSUE_CODES.COUNT_MISMATCH)).length;
  summary.consumptionMismatches = results.filter((result) => result.issueCodes.includes(ISSUE_CODES.CONSUMPTION_MISMATCH)).length;
  summary.mismatches = results.filter((result) => result.status === "incorrect").length;
  summary.missingTotals = results.filter((result) => result.issueCodes.includes(ISSUE_CODES.MISSING_WRITTEN_TOTAL)).length;
  summary.numberingIssues = numberingIssues.length;
  summary.unsupportedNotation = results.filter((result) => result.issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION)).length;
  summary.correctedRounds = results.filter((result) => result.corrections.length > 0).length;
  summary.unresolvedRounds = results.filter((result) => result.status === "unresolved").length;
  return summary;
}

/**
 * Analyze up to 200 rounds locally. Original parser values and effective values
 * are separate frozen snapshots; the source string is never modified.
 *
 * @param {string} patternText
 * @param {number | null} [initialStartingCount]
 * @param {Array<Record<string, unknown>>} [corrections]
 */
export function analyzeDesignerPattern(patternText, initialStartingCount = null, corrections = []) {
  const lines = patternLines(patternText);
  const normalizedCorrections = Array.isArray(corrections)
    ? corrections.map(normalizeCorrectionRecord)
    : [];

  if (lines.length === 0) {
    return deepFreeze({
      results: [],
      error: "Paste at least one pattern round.",
      numberingIssues: [],
      corrections: normalizedCorrections,
      summary: emptySummary(),
    });
  }
  if (lines.length > MAX_DESIGNER_ROUNDS) {
    return deepFreeze({
      results: [],
      error: `Designer mode checks up to ${MAX_DESIGNER_ROUNDS} rounds at a time.`,
      numberingIssues: [],
      corrections: normalizedCorrections,
      summary: emptySummary(),
    });
  }
  let originalNextStartingCount = integerOrNull(initialStartingCount);
  const originalEvaluations = lines.map((line, index) => {
    const evaluated = evaluatePatternRound(line, originalNextStartingCount, index + 1);
    originalNextStartingCount = evaluated.created != null ? evaluated.created : null;
    return evaluated;
  });
  const invalidRoundIndex = originalEvaluations.findIndex(
    (evaluation) => !Number.isSafeInteger(evaluation.round) || evaluation.round < 1,
  );
  if (invalidRoundIndex !== -1) {
    return deepFreeze({
      results: [],
      error: `Line ${invalidRoundIndex + 1}: ${originalEvaluations[invalidRoundIndex].message}`,
      numberingIssues: [],
      corrections: normalizedCorrections,
      summary: emptySummary(),
    });
  }

  const correctionsByLine = new Map();
  const correctionOrder = new Map();
  const unmatchedCorrections = [];
  for (let index = 0; index < normalizedCorrections.length; index += 1) {
    const correction = normalizedCorrections[index];
    correctionOrder.set(correction, index);
    const resolvedLineIndex = resolveCorrectionLineIndex(correction, lines, originalEvaluations);
    if (resolvedLineIndex == null || resolvedLineIndex >= lines.length) {
      unmatchedCorrections.push(correction);
      continue;
    }
    if (!correctionsByLine.has(resolvedLineIndex)) correctionsByLine.set(resolvedLineIndex, []);
    correctionsByLine.get(resolvedLineIndex).push(correction);
  }
  if (unmatchedCorrections.length > 0) {
    return deepFreeze({
      results: [],
      error: "A saved correction no longer matches a unique pattern round. Remove it or restore the matching round before reviewing again.",
      numberingIssues: [],
      corrections: normalizedCorrections,
      summary: emptySummary(),
    });
  }

  let effectiveNextStartingCount = integerOrNull(initialStartingCount);
  const hydratedCorrectionOrder = new Map();
  const mutableResults = lines.map((line, index) => {
    const originalEvaluation = originalEvaluations[index];
    const lineCorrections = correctionsByLine.get(index) ?? [];
    const original = snapshotFromEvaluation(originalEvaluation);
    let stage = evaluateCorrectionStage(line, effectiveNextStartingCount, index + 1, []);
    let effective = stage.snapshot;
    let invalidRepeatCorrection = stage.invalidRepeatCorrection;
    const hydratedCorrections = [];
    for (let correctionIndex = 0; correctionIndex < lineCorrections.length; correctionIndex += 1) {
      const correction = lineCorrections[correctionIndex];
      const before = deepFreeze({ ...effective });
      stage = evaluateCorrectionStage(
        line,
        effectiveNextStartingCount,
        index + 1,
        lineCorrections.slice(0, correctionIndex + 1),
      );
      effective = stage.snapshot;
      invalidRepeatCorrection = stage.invalidRepeatCorrection;
      const after = deepFreeze({ ...effective });
      const hydratedCorrection = deepFreeze({
        ...correction,
        lineIndex: index,
        original: before,
        effective: after,
        effect: correctionEffect(before, after, 1),
      });
      hydratedCorrectionOrder.set(hydratedCorrection, correctionOrder.get(correction));
      hydratedCorrections.push(hydratedCorrection);
    }
    const effectiveEvaluation = stage.evaluation;
    effective.status = invalidRepeatCorrection
      ? "unresolved"
      : statusForSnapshot(effective, effectiveEvaluation.hasMagicRing, effectiveEvaluation.failureKind);
    const message = invalidRepeatCorrection
      ? "The repeat correction could not be applied to this instruction, so the round remains unresolved."
      : effectiveEvaluation.failureKind === "missing-starting-count" && index > 0
        ? "No verified stitch count is available from the prior round, so this round could not be evaluated."
        : publicMessage(effective, effectiveEvaluation.hasMagicRing, effectiveEvaluation.message);
    const frozenOriginal = deepFreeze({ ...original });
    const frozenEffective = deepFreeze({ ...effective });
    const effect = correctionEffect(frozenOriginal, frozenEffective, lineCorrections.length);
    const result = {
      key: `line-${index + 1}`,
      index,
      round: effective.roundNumber,
      source: line,
      status: effective.status,
      startingCount: effective.startingCount,
      consumed: effective.consumed,
      created: effective.created,
      writtenTotal: effective.writtenTotal,
      repeatCount: effective.repeatCount,
      classification: effective.classification,
      difference: effective.writtenTotal == null || effective.created == null
        ? null
        : effective.created - effective.writtenTotal,
      notes: effectiveEvaluation.notes,
      message,
      original: frozenOriginal,
      effective: frozenEffective,
      corrections: hydratedCorrections,
      correctionEffect: effect,
      issues: [],
      issueCodes: [],
      explicitRoundNumber: originalEvaluation.explicitRoundNumber
        || lineCorrections.some((correction) => own(correction.changes, "roundNumber")),
      hasMagicRing: effectiveEvaluation.hasMagicRing,
      normalizedInstruction: normalizePatternInstruction(line),
    };
    result.issues = issuesForResult(result, invalidRepeatCorrection);
    result.issueCodes = [...new Set(result.issues.map((entry) => entry.code))];
    if (!invalidRepeatCorrection
      && effective.created != null
      && effective.classification !== "unsupported"
      && effective.classification !== "manual-review") {
      effectiveNextStartingCount = effective.created;
    } else {
      effectiveNextStartingCount = null;
    }
    return result;
  });

  const numberingIssues = numberingDiagnostics(mutableResults);
  for (const diagnostic of numberingIssues) {
    const resultKeys = diagnostic.resultKeys ?? [diagnostic.resultKey];
    for (const result of mutableResults) {
      if (!resultKeys.includes(result.key)) continue;
      result.issues.push(diagnostic);
      if (!result.issueCodes.includes(diagnostic.code)) result.issueCodes.push(diagnostic.code);
    }
  }

  const results = mutableResults.map((result) => deepFreeze(result));
  const hydratedCorrections = results
    .flatMap((result) => result.corrections)
    .sort((left, right) => hydratedCorrectionOrder.get(left) - hydratedCorrectionOrder.get(right));
  const summary = summarizeAnalysis(results, numberingIssues);
  return deepFreeze({
    results,
    error: null,
    numberingIssues,
    corrections: hydratedCorrections,
    summary,
  });
}

/** Normalize only formatting; do not infer semantic equivalence. */
export function normalizePatternInstruction(source) {
  return String(source ?? "")
    .normalize("NFKC")
    .replace(/^(?:round|rnd|r)\s*#?\s*\d+\s*[:.)-]?\s*/i, "")
    .replace(/[\[(]\s*\d+\s*(?:st(?:s|itches)?)?\s*[\])]\s*[.!]?$/i, "")
    .replace(/[×✕]/g, "x")
    .toLowerCase()
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s*([,;:])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function substantiveIssueCodes(result) {
  return new Set(result.issueCodes.filter((code) => ![
    ISSUE_CODES.USER_CORRECTION_APPLIED,
    ISSUE_CODES.UNRESOLVED_ROUND,
    // Missing round numbers are compared once through missingRoundRanges rather
    // than once for every result the global diagnostic touches.
    ISSUE_CODES.MISSING_ROUND_NUMBER,
  ].includes(code)));
}

function missingRoundRanges(analysis) {
  return analysis.numberingIssues
    .filter((entry) => entry.code === ISSUE_CODES.MISSING_ROUND_NUMBER)
    .map((entry) => ({
      start: entry.missingRoundStart ?? entry.missingRound,
      end: entry.missingRoundEnd ?? entry.missingRound,
    }));
}

function containsMissingRound(ranges, roundNumber) {
  return ranges.some((range) => roundNumber >= range.start && roundNumber <= range.end);
}

function groupedByRound(results) {
  const grouped = new Map();
  for (const result of results) {
    if (!grouped.has(result.round)) grouped.set(result.round, []);
    grouped.get(result.round).push(result);
  }
  return grouped;
}

function versionSemanticKey(result) {
  return JSON.stringify({
    normalizedInstruction: result.normalizedInstruction,
    startingCount: result.startingCount,
    consumed: result.consumed,
    created: result.created,
    writtenTotal: result.writtenTotal,
    status: result.status,
    issueCodes: [...substantiveIssueCodes(result)]
      .filter((code) => !SHARED_NUMBERING_ISSUE_CODES.has(code))
      .sort(),
  });
}

function alignRoundResults(previousResults, revisedResults) {
  const revisedUsed = new Set();
  const pairs = [];
  const unmatchedPrevious = [];
  for (const previous of previousResults) {
    const semanticKey = versionSemanticKey(previous);
    const revisedIndex = revisedResults.findIndex(
      (candidate, index) => !revisedUsed.has(index) && versionSemanticKey(candidate) === semanticKey,
    );
    if (revisedIndex === -1) {
      unmatchedPrevious.push(previous);
      continue;
    }
    revisedUsed.add(revisedIndex);
    pairs.push({ previous, revised: revisedResults[revisedIndex] });
  }
  const stillUnmatchedPrevious = [];
  for (const previous of unmatchedPrevious) {
    const revisedIndex = revisedResults.findIndex(
      (candidate, index) => !revisedUsed.has(index)
        && candidate.normalizedInstruction === previous.normalizedInstruction,
    );
    if (revisedIndex === -1) {
      stillUnmatchedPrevious.push(previous);
      continue;
    }
    revisedUsed.add(revisedIndex);
    pairs.push({ previous, revised: revisedResults[revisedIndex] });
  }
  const unmatchedRevised = revisedResults.filter((_, index) => !revisedUsed.has(index));
  const unmatchedCount = Math.max(stillUnmatchedPrevious.length, unmatchedRevised.length);
  for (let index = 0; index < unmatchedCount; index += 1) {
    pairs.push({
      previous: stillUnmatchedPrevious[index] ?? null,
      revised: unmatchedRevised[index] ?? null,
    });
  }
  return pairs;
}

const SHARED_NUMBERING_ISSUE_CODES = new Set([
  ISSUE_CODES.DUPLICATE_ROUND_NUMBER,
  ISSUE_CODES.ROUND_NUMBER_OUT_OF_ORDER,
]);

function sharedNumberingIssueDelta(fromAnalysis, toAnalysis) {
  const counts = (analysis) => {
    const result = new Map();
    for (const diagnostic of analysis.numberingIssues) {
      if (!SHARED_NUMBERING_ISSUE_CODES.has(diagnostic.code)) continue;
      const key = `${diagnostic.code}:${diagnostic.roundNumber}`;
      result.set(key, (result.get(key) ?? 0) + 1);
    }
    return result;
  };
  const fromCounts = counts(fromAnalysis);
  const toCounts = counts(toAnalysis);
  const keys = new Set([...fromCounts.keys(), ...toCounts.keys()]);
  let resolved = 0;
  let introduced = 0;
  for (const key of keys) {
    const before = fromCounts.get(key) ?? 0;
    const after = toCounts.get(key) ?? 0;
    resolved += Math.max(before - after, 0);
    introduced += Math.max(after - before, 0);
  }
  return { resolved, introduced };
}

/**
 * Compare normalized local inputs and deterministic results without AI.
 *
 * @param {string} previousText
 * @param {string} revisedText
 * @param {number | null} [initialStartingCount]
 */
export function comparePatternVersions(previousText, revisedText, initialStartingCount = null) {
  const previousAnalysis = analyzeDesignerPattern(previousText, initialStartingCount);
  const revisedAnalysis = analyzeDesignerPattern(revisedText, initialStartingCount);
  if (previousAnalysis.error || revisedAnalysis.error) {
    return deepFreeze({
      error: previousAnalysis.error || revisedAnalysis.error,
      rounds: [],
      summary: {
        roundsChanged: 0,
        addedRounds: 0,
        removedRounds: 0,
        changedRounds: 0,
        unchangedRounds: 0,
        textChangedRounds: 0,
        writtenTotalChangedRounds: 0,
        calculatedTotalChangedRounds: 0,
        startingCountChangedRounds: 0,
        consumedCountChangedRounds: 0,
        countCorrections: 0,
        issuesResolved: 0,
        newIssuesIntroduced: 0,
        newUnresolvedInstructions: 0,
        missingRoundsAdded: 0,
        unsupportedOneOrBoth: 0,
      },
      previousAnalysis,
      revisedAnalysis,
    });
  }

  const previousByRound = groupedByRound(previousAnalysis.results);
  const revisedByRound = groupedByRound(revisedAnalysis.results);
  const previousMissing = missingRoundRanges(previousAnalysis);
  const revisedMissing = missingRoundRanges(revisedAnalysis);
  const sharedNumberingDelta = sharedNumberingIssueDelta(previousAnalysis, revisedAnalysis);
  const roundNumbers = [...new Set([...previousByRound.keys(), ...revisedByRound.keys()])].sort((a, b) => a - b);
  const rounds = [];

  for (const roundNumber of roundNumbers) {
    const previousResults = previousByRound.get(roundNumber) ?? [];
    const revisedResults = revisedByRound.get(roundNumber) ?? [];
    const alignedResults = alignRoundResults(previousResults, revisedResults);
    for (let occurrence = 0; occurrence < alignedResults.length; occurrence += 1) {
      const { previous, revised } = alignedResults[occurrence];
      const changes = [];
      let status = "unchanged";
      let resolvedIssueCodes = [];
      let introducedIssueCodes = [];

      if (!previous) {
        status = "added";
        changes.push(VERSION_CHANGE_CODES.ROUND_ADDED);
        if (occurrence === 0 && containsMissingRound(previousMissing, roundNumber)) {
          changes.push(VERSION_CHANGE_CODES.MISSING_ROUND_RESOLVED);
        }
        introducedIssueCodes = [...substantiveIssueCodes(revised)].sort();
        if (introducedIssueCodes.length > 0) changes.push(VERSION_CHANGE_CODES.NEW_ISSUE_INTRODUCED);
      } else if (!revised) {
        status = "removed";
        changes.push(VERSION_CHANGE_CODES.ROUND_REMOVED);
        if (occurrence === 0 && containsMissingRound(revisedMissing, roundNumber)) {
          changes.push(VERSION_CHANGE_CODES.NEW_MISSING_ROUND);
        }
        resolvedIssueCodes = [...substantiveIssueCodes(previous)].sort();
        if (resolvedIssueCodes.length > 0) changes.push(VERSION_CHANGE_CODES.ISSUE_RESOLVED);
      } else {
        if (previous.normalizedInstruction !== revised.normalizedInstruction) {
          changes.push(VERSION_CHANGE_CODES.TEXT_CHANGED);
        }
        if (previous.writtenTotal !== revised.writtenTotal) {
          changes.push(VERSION_CHANGE_CODES.WRITTEN_TOTAL_CHANGED);
        }
        if (previous.created !== revised.created) {
          changes.push(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED);
        }
        if (previous.startingCount !== revised.startingCount) {
          changes.push(VERSION_CHANGE_CODES.STARTING_COUNT_CHANGED);
        }
        if (previous.consumed !== revised.consumed) {
          changes.push(VERSION_CHANGE_CODES.CONSUMED_COUNT_CHANGED);
        }
        const previousIssues = substantiveIssueCodes(previous);
        const revisedIssues = substantiveIssueCodes(revised);
        resolvedIssueCodes = [...previousIssues].filter((code) => !revisedIssues.has(code)).sort();
        introducedIssueCodes = [...revisedIssues].filter((code) => !previousIssues.has(code)).sort();
        if (resolvedIssueCodes.length > 0) changes.push(VERSION_CHANGE_CODES.ISSUE_RESOLVED);
        if (introducedIssueCodes.length > 0) changes.push(VERSION_CHANGE_CODES.NEW_ISSUE_INTRODUCED);
        status = changes.length > 0 ? "changed" : "unchanged";
      }

      const previousUnsupported = previous?.status === "unsupported";
      const revisedUnsupported = revised?.status === "unsupported";
      if (previousUnsupported && revisedUnsupported) changes.push(VERSION_CHANGE_CODES.UNSUPPORTED_BOTH);
      else if (previousUnsupported) changes.push(VERSION_CHANGE_CODES.UNSUPPORTED_PREVIOUS);
      else if (revisedUnsupported) changes.push(VERSION_CHANGE_CODES.UNSUPPORTED_REVISED);

      rounds.push(deepFreeze({
        key: `round-${roundNumber}-${occurrence + 1}`,
        round: roundNumber,
        occurrence: occurrence + 1,
        status,
        changes: [...new Set(changes)],
        resolvedIssueCodes,
        introducedIssueCodes,
        previous,
        revised,
      }));
    }
  }

  const summary = {
    roundsChanged: rounds.filter((round) => round.status !== "unchanged").length,
    addedRounds: rounds.filter((round) => round.status === "added").length,
    removedRounds: rounds.filter((round) => round.status === "removed").length,
    changedRounds: rounds.filter((round) => round.status === "changed").length,
    unchangedRounds: rounds.filter((round) => round.status === "unchanged").length,
    textChangedRounds: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.TEXT_CHANGED)).length,
    writtenTotalChangedRounds: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.WRITTEN_TOTAL_CHANGED)).length,
    calculatedTotalChangedRounds: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED)).length,
    startingCountChangedRounds: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.STARTING_COUNT_CHANGED)).length,
    consumedCountChangedRounds: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.CONSUMED_COUNT_CHANGED)).length,
    countCorrections: rounds.filter((round) => round.resolvedIssueCodes.some((code) => [
      ISSUE_CODES.COUNT_MISMATCH,
      ISSUE_CODES.CONSUMPTION_MISMATCH,
    ].includes(code))).length,
    issuesResolved: rounds.reduce(
      (count, round) => count + round.resolvedIssueCodes.filter(
        (code) => !SHARED_NUMBERING_ISSUE_CODES.has(code),
      ).length
        + (round.changes.includes(VERSION_CHANGE_CODES.MISSING_ROUND_RESOLVED) ? 1 : 0),
      sharedNumberingDelta.resolved,
    ),
    newIssuesIntroduced: rounds.reduce(
      (count, round) => count + round.introducedIssueCodes.filter(
        (code) => !SHARED_NUMBERING_ISSUE_CODES.has(code),
      ).length
        + (round.changes.includes(VERSION_CHANGE_CODES.NEW_MISSING_ROUND) ? 1 : 0),
      sharedNumberingDelta.introduced,
    ),
    newUnresolvedInstructions: rounds.filter((round) => (
      ["unsupported", "unresolved"].includes(round.revised?.status)
      && !["unsupported", "unresolved"].includes(round.previous?.status)
    )).length,
    missingRoundsAdded: rounds.filter((round) => round.changes.includes(VERSION_CHANGE_CODES.MISSING_ROUND_RESOLVED)).length,
    unsupportedOneOrBoth: rounds.filter((round) => round.changes.some((change) => [
      VERSION_CHANGE_CODES.UNSUPPORTED_PREVIOUS,
      VERSION_CHANGE_CODES.UNSUPPORTED_REVISED,
      VERSION_CHANGE_CODES.UNSUPPORTED_BOTH,
    ].includes(change))).length,
  };

  return deepFreeze({ error: null, rounds, summary, previousAnalysis, revisedAnalysis });
}

function normalizeMetadata(metadata = {}) {
  if (!isPlainObject(metadata)) throw new TypeError("Project metadata must be an object.");
  const sectionLabels = Array.isArray(metadata.sectionLabels)
    ? metadata.sectionLabels.map((label) => boundedString(label, 200, "section label")).join("\n")
    : boundedString(metadata.sectionLabels, 5000, "section labels");
  return {
    title: boundedString(metadata.title ?? metadata.patternTitle, 300, "pattern title"),
    designerNickname: boundedString(metadata.designerNickname ?? metadata.designer, 200, "designer nickname"),
    version: boundedString(metadata.version ?? metadata.patternVersion, 100, "pattern version"),
    reviewedAt: boundedString(metadata.reviewedAt ?? metadata.reviewDate ?? metadata.dateReviewed, 40, "review date"),
    sectionLabels,
    designerNotes: boundedString(metadata.designerNotes ?? metadata.notes, 5000, "designer notes"),
  };
}

function normalizeVersionInput(value) {
  if (value == null) return "";
  let patternText;
  if (typeof value === "string") patternText = boundedString(value, 250000, "previous pattern text");
  else if (isPlainObject(value)) patternText = boundedString(value.patternText, 250000, "previous pattern text");
  else throw new TypeError("Previous version must be pattern text or an object containing patternText.");
  if (patternLines(patternText).length > MAX_DESIGNER_ROUNDS) {
    throw new TypeError(`A previous StitchProof version may contain at most ${MAX_DESIGNER_ROUNDS} rounds.`);
  }
  return patternText;
}

/** Create the serializable, browser-local project source model. */
export function createDesignerProject(input) {
  if (!isPlainObject(input)) throw new TypeError("Project input must be an object.");
  const patternText = boundedString(input.patternText, 250000, "pattern text");
  if (patternLines(patternText).length > MAX_DESIGNER_ROUNDS) {
    throw new TypeError(`A StitchProof project may contain at most ${MAX_DESIGNER_ROUNDS} rounds.`);
  }
  let corrections = Array.isArray(input.corrections) ? input.corrections.map(normalizeCorrectionRecord) : [];
  if (input.initialStartingCount != null) {
    nonNegativeInteger(input.initialStartingCount, "initialStartingCount");
  }
  if (corrections.length > 0) {
    const resolved = analyzeDesignerPattern(patternText, input.initialStartingCount ?? null, corrections);
    if (resolved.error) throw new TypeError(resolved.error);
    corrections = resolved.corrections.map(normalizeCorrectionRecord);
  }
  const preferences = input.preferences == null ? {} : input.preferences;
  if (!isPlainObject(preferences)) throw new TypeError("Project preferences must be an object.");
  const includeInstructionExcerpts = own(input, "includeExcerpts")
    ? input.includeExcerpts
    : preferences.includeInstructionExcerpts;
  if (includeInstructionExcerpts != null && typeof includeInstructionExcerpts !== "boolean") {
    throw new TypeError("includeInstructionExcerpts must be a boolean.");
  }
  const project = {
    schema: STITCHPROOF_PROJECT_SCHEMA,
    schemaVersion: STITCHPROOF_PROJECT_SCHEMA_VERSION,
    projectId: boundedString(input.projectId, 120, "project id"),
    metadata: normalizeMetadata(input.metadata),
    patternText,
    initialStartingCount: input.initialStartingCount ?? null,
    corrections,
    previousVersion: normalizeVersionInput(input.previousVersion),
    revisedVersion: normalizeVersionInput(input.revisedVersion),
    preferences: {
      includeInstructionExcerpts: includeInstructionExcerpts === true,
    },
  };
  return deepFreeze(project);
}

function reportSafeMessage(issueEntry, includeExcerpts) {
  if (!includeExcerpts && issueEntry.code === ISSUE_CODES.UNSUPPORTED_NOTATION) {
    return "This round uses notation the deterministic parser does not support.";
  }
  return issueEntry.message;
}

/** Build a print-friendly view model without full instructions by default. */
export function buildDesignerReportModel(input) {
  if (!isPlainObject(input)) throw new TypeError("Report input must be an object.");
  const includeInstructionExcerpts = (
    input.includeExcerpts
    ?? input.preferences?.includeInstructionExcerpts
  ) === true;
  const normalizedMetadata = normalizeMetadata(input.metadata);
  const metadata = {
    title: normalizedMetadata.title,
    designerNickname: normalizedMetadata.designerNickname,
    version: normalizedMetadata.version,
    reviewedAt: normalizedMetadata.reviewedAt,
    sectionLabels: normalizedMetadata.sectionLabels,
  };
  const analysis = input.analysis ?? analyzeDesignerPattern(
    input.patternText,
    input.initialStartingCount,
    input.corrections,
  );
  if (analysis.error) throw new TypeError(analysis.error);

  const numberingCodes = new Set([
    ISSUE_CODES.DUPLICATE_ROUND_NUMBER,
    ISSUE_CODES.MISSING_ROUND_NUMBER,
    ISSUE_CODES.ROUND_NUMBER_INFERRED,
    ISSUE_CODES.ROUND_NUMBER_OUT_OF_ORDER,
  ]);
  const roundIssueRows = analysis.results.flatMap((result) => result.issues
    .filter((entry) => entry.code !== ISSUE_CODES.USER_CORRECTION_APPLIED && !numberingCodes.has(entry.code))
    .map((entry) => ({
      round: result.round,
      resultKey: result.key,
      code: entry.code,
      label: ISSUE_LABELS[entry.code] ?? entry.code,
      severity: entry.severity,
      status: result.status,
      message: reportSafeMessage(entry, includeInstructionExcerpts),
      ...(includeInstructionExcerpts ? { instructionExcerpt: result.source } : {}),
    })));
  const numberingIssueRows = analysis.numberingIssues.map((entry) => ({
    round: entry.roundNumber,
    resultKey: entry.resultKey,
    code: entry.code,
    label: ISSUE_LABELS[entry.code] ?? entry.code,
    severity: entry.severity,
    status: "numbering",
    message: entry.message,
    ...(includeInstructionExcerpts ? {
      instructionExcerpt: analysis.results.find((result) => result.key === entry.resultKey)?.source ?? "",
    } : {}),
  }));
  const issueRows = [...roundIssueRows, ...numberingIssueRows];

  const correctionRows = analysis.corrections.map((correction) => ({
    id: correction.id,
    line: correction.lineIndex + 1,
    round: correction.effective.roundNumber,
    changes: Object.keys(correction.changes),
    original: Object.fromEntries(Object.keys(correction.changes).map((field) => [field, correction.original[field]])),
    effective: Object.fromEntries(Object.keys(correction.changes).map((field) => [field, correction.effective[field]])),
    effect: correction.effect,
    recordedAt: correction.recordedAt,
    ...(includeInstructionExcerpts && correction.note ? { note: correction.note } : {}),
  }));

  const versionChanges = input.comparison?.rounds?.map((round) => ({
    round: round.round,
    occurrence: round.occurrence,
    status: round.status,
    changes: round.changes,
    resolvedIssueCodes: round.resolvedIssueCodes,
    introducedIssueCodes: round.introducedIssueCodes,
    ...(includeInstructionExcerpts ? {
      previousExcerpt: round.previous?.source ?? null,
      revisedExcerpt: round.revised?.source ?? null,
    } : {}),
  })) ?? [];

  return deepFreeze({
    reportType: "StitchProof Designer QA Report",
    metadata,
    summary: analysis.summary,
    issueRows,
    correctionRows,
    versionSummary: input.comparison?.summary ?? null,
    versionChanges,
    methodology: [...REPORT_METHODOLOGY],
    limitations: [...REPORT_LIMITATIONS],
    privacyStatement: "Pattern analysis and report generation run in this browser. FiberTools does not receive or store the pattern text.",
    includeInstructionExcerpts,
  });
}

function csvValue(value) {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Neutralize spreadsheet formulas before RFC-4180-style CSV quoting. */
export function safeCsvCell(value) {
  let normalized = csvValue(value).replace(/\0/g, "");
  if (/^[\u0001-\u0020\uFEFF]*[=+\-@]/.test(normalized) || /^[\t\r]/.test(normalized)) {
    normalized = `'${normalized}`;
  }
  return `"${normalized.replace(/"/g, '""')}"`;
}

/** Export report issues only; instruction excerpts require explicit opt-in. */
export function exportIssuesCsv(input) {
  if (!isPlainObject(input)) throw new TypeError("CSV export input must be an object.");
  const report = buildDesignerReportModel(input);
  const includeExcerpts = report.includeInstructionExcerpts === true;
  const headers = ["Round", "Issue code", "Severity", "Status", "Message"];
  if (includeExcerpts) headers.push("Instruction excerpt");
  const rows = report.issueRows.map((entry) => {
    const values = [entry.round, entry.code, entry.severity, entry.status, entry.message];
    if (includeExcerpts) values.push(entry.instructionExcerpt ?? "");
    return values.map(safeCsvCell).join(",");
  });
  return [headers.map(safeCsvCell).join(","), ...rows].join("\r\n");
}

/** JSON backup is an explicit local export and intentionally includes inputs. */
export function exportProjectJson(projectInput) {
  const project = projectInput?.schema === STITCHPROOF_PROJECT_SCHEMA
    ? createDesignerProject(projectInput)
    : createDesignerProject(projectInput);
  return `${JSON.stringify(project, null, 2)}\n`;
}

function validateRestoredProjectShape(project) {
  if (typeof project.patternText !== "string") throw new TypeError("Project patternText must be a string.");
  if (own(project, "projectId") && typeof project.projectId !== "string") {
    throw new TypeError("Project projectId must be a string.");
  }
  if (project.initialStartingCount !== null
    && (!Number.isSafeInteger(project.initialStartingCount) || project.initialStartingCount < 0)) {
    throw new TypeError("Project initialStartingCount must be null or a non-negative integer.");
  }
  if (!isPlainObject(project.metadata)) throw new TypeError("Project metadata must be an object.");
  for (const field of ["title", "designerNickname", "version", "reviewedAt", "sectionLabels", "designerNotes"]) {
    if (own(project.metadata, field) && typeof project.metadata[field] !== "string") {
      throw new TypeError(`Project metadata.${field} must be a string.`);
    }
  }
  if (!Array.isArray(project.corrections)) throw new TypeError("Project corrections must be an array.");
  for (const correction of project.corrections) {
    if (!isPlainObject(correction)) throw new TypeError("Each project correction must be an object.");
    for (const field of ["id", "note", "recordedAt", "targetSource"]) {
      if (own(correction, field) && correction[field] != null && typeof correction[field] !== "string") {
        throw new TypeError(`Project correction ${field} must be a string.`);
      }
    }
    if (own(correction, "targetRoundNumber")
      && correction.targetRoundNumber !== null
      && (!Number.isSafeInteger(correction.targetRoundNumber) || correction.targetRoundNumber < 1)) {
      throw new TypeError("Project correction targetRoundNumber must be null or a positive integer.");
    }
    if (own(correction, "original") && correction.original !== null) {
      throw new TypeError("Project corrections cannot restore calculated original snapshots.");
    }
    if (own(correction, "effective") && correction.effective !== null) {
      throw new TypeError("Project corrections cannot restore calculated effective snapshots.");
    }
  }
  for (const field of ["previousVersion", "revisedVersion"]) {
    if (typeof project[field] !== "string") {
      throw new TypeError(`Project ${field} must be a string.`);
    }
  }
  if (!isPlainObject(project.preferences)) throw new TypeError("Project preferences must be an object.");
  if (typeof project.preferences.includeInstructionExcerpts !== "boolean") {
    throw new TypeError("Project preferences.includeInstructionExcerpts must be a boolean.");
  }
  if (own(project, "includeExcerpts")) {
    throw new TypeError("Project backups must store excerpt consent in preferences.");
  }
}

/** Parse and validate a local JSON backup without executing or trusting fields. */
export function restoreProjectJson(serialized) {
  if (typeof serialized !== "string") throw new TypeError("Project backup must be JSON text.");
  if (serialized.length > 2_000_000) throw new TypeError("Project backup exceeds the supported size.");
  let parsed;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new TypeError("Project backup is not valid JSON.");
  }
  if (!isPlainObject(parsed)) throw new TypeError("Project backup must contain one project object.");
  if (parsed.schema !== STITCHPROOF_PROJECT_SCHEMA) throw new TypeError("Project backup has an unsupported schema.");
  if (parsed.schemaVersion !== STITCHPROOF_PROJECT_SCHEMA_VERSION) {
    throw new TypeError(`Project backup version ${parsed.schemaVersion ?? "unknown"} is not supported.`);
  }
  validateRestoredProjectShape(parsed);
  return createDesignerProject(parsed);
}
