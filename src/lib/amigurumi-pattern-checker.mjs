export const MAX_FREE_ROUNDS = 20;

const STITCH_NAMES = "sc|hdc|dc";

class PatternEvaluationError extends Error {
  constructor(message, failureKind) {
    super(message);
    this.failureKind = failureKind;
  }
}

function stitchCountLabel(value) {
  return `${value} ${value === 1 ? "stitch" : "stitches"}`;
}

function safeCount(value, label, { positive = false } = {}) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < (positive ? 1 : 0)) {
    throw new PatternEvaluationError(`${label} is outside the supported whole-number range`, "invalid-number");
  }
  return parsed;
}

function safeAdd(left, right, label = "Stitch count") {
  return safeCount(left + right, label);
}

function safeMultiply(left, right, label = "Stitch count") {
  return safeCount(left * right, label);
}

function operation(consumed, created, label, note, classification = "even") {
  return { consumed, created, label, note, classification };
}

function parseToken(token) {
  const value = token.trim().replace(/[.;]+$/g, "");
  if (!value) return operation(0, 0, "", null);

  if (/^(?:sl\s*st|slst)\s+to\s+join$/i.test(value)) {
    return operation(0, 0, "sl st to join", "Joining slip stitch excluded from the round total", "joining");
  }

  let match = value.match(new RegExp(`^(\\d+)\\s*(${STITCH_NAMES})\\s+in\\s+(?:the\\s+)?next\\s+st(?:itch)?$`, "i"));
  if (match) {
    const created = safeCount(match[1], "Stitch count");
    return operation(1, created, value, null, created === 1 ? "even" : "increase");
  }

  match = value.match(new RegExp(`^(${STITCH_NAMES})\\s+in\\s+(?:the\\s+)?next\\s+(\\d+)\\s+st(?:s|itches)?$`, "i"));
  if (match) {
    const count = safeCount(match[2], "Stitch count");
    return operation(count, count, value, null);
  }

  if (/^(?:inc|increase)(?:\s+in\s+(?:the\s+)?next\s+st(?:itch)?)?$/i.test(value)) {
    return operation(1, 2, value, null, "increase");
  }

  match = value.match(/^(\d+)\s+(?:inc|increase)s?$/i);
  if (match) {
    const count = safeCount(match[1], "Increase count");
    return operation(count, safeMultiply(count, 2), value, null, "increase");
  }

  if (/^(?:dec|decrease|sc2tog|hdc2tog|dc2tog)$/i.test(value)) {
    return operation(2, 1, value, null, "decrease");
  }

  match = value.match(/^(\d+)\s+(?:dec|decrease)s?$/i);
  if (match) {
    const count = safeCount(match[1], "Decrease count");
    return operation(safeMultiply(count, 2), count, value, null, "decrease");
  }

  match = value.match(/^(?:ch|chain)\s*(\d+)$/i) || value.match(/^(\d+)\s*(?:ch|chains?)$/i);
  if (match) {
    return operation(0, 0, value, "Chains are treated as setup stitches and excluded from amigurumi totals", "setup");
  }

  match = value.match(/^(\d+)\s*(?:sl\s*st|slst)$/i) || value.match(/^(?:sl\s*st|slst)\s*(\d+)$/i);
  if (match) {
    const count = safeCount(match[1], "Slip-stitch count");
    return operation(count, count, value, null);
  }

  match = value.match(new RegExp(`^(\\d+)\\s*(${STITCH_NAMES})$`, "i"));
  if (match) {
    const count = safeCount(match[1], "Stitch count");
    return operation(count, count, value, null);
  }

  match = value.match(new RegExp(`^(${STITCH_NAMES})\\s*(\\d+)$`, "i"));
  if (match) {
    const count = safeCount(match[2], "Stitch count");
    return operation(count, count, value, null);
  }

  if (new RegExp(`^(${STITCH_NAMES})$`, "i").test(value)) {
    return operation(1, 1, value, null);
  }

  throw new Error(`Unsupported instruction: "${token.trim()}"`);
}

function parseSequence(sequence) {
  const tokens = sequence
    .replace(/\b(?:flo|blo|front loop only|back loop only)\b/gi, "")
    .replace(/\bthen\b/gi, ",")
    .split(/,|;/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) throw new Error("No supported stitch instructions found");

  return tokens.reduce(
    (total, token) => {
      const parsed = parseToken(token);
      total.consumed = safeAdd(total.consumed, parsed.consumed);
      total.created = safeAdd(total.created, parsed.created);
      if (parsed.note) total.notes.push(parsed.note);
      total.classifications.add(parsed.classification);
      return total;
    },
    { consumed: 0, created: 0, notes: [], classifications: new Set() },
  );
}

function summarizeClassification(classifications, hasMagicRing = false) {
  if (hasMagicRing) return "magic-ring";
  const stitchClassifications = [...classifications].filter((value) => value !== "setup" && value !== "joining");
  if (stitchClassifications.length === 0) return classifications.has("setup") ? "setup" : "joining";
  return new Set(stitchClassifications).size === 1 ? stitchClassifications[0] : "mixed";
}

function parseBody(body, startingCount, hasMagicRing) {
  let normalized = body
    .replace(/[×]/g, "x")
    .replace(/\b(?:into|in)\s+(?:a\s+)?(?:magic ring|magic circle|mr)\b/gi, "")
    .replace(/\b(?:magic ring|magic circle|mr)\b\s*,?/gi, "")
    .replace(/\bjoin(?:ed)?\s+with\s+(?:a\s+)?slip\s+stitch\b/gi, "sl st to join")
    .replace(/\b(?:flo|blo|front loop only|back loop only)\b/gi, "")
    .trim();

  const aroundIncrease = normalized.match(new RegExp(`^2\\s*(${STITCH_NAMES})\\s+in\\s+each\\s+st(?:itch)?\\s+around$`, "i"));
  if (aroundIncrease) {
    if (startingCount == null) throw new Error("Enter a starting stitch count for an 'around' instruction");
    return {
      consumed: startingCount,
      created: safeMultiply(startingCount, 2),
      notes: [],
      classification: "increase",
      repeatCount: startingCount,
      repeatUnitConsumed: 1,
      repeatUnitCreated: 2,
    };
  }

  const aroundEven = normalized.match(new RegExp(`^(${STITCH_NAMES})\\s+in\\s+each\\s+st(?:itch)?\\s+around$`, "i"));
  if (aroundEven) {
    if (startingCount == null) throw new Error("Enter a starting stitch count for an 'around' instruction");
    return {
      consumed: startingCount,
      created: startingCount,
      notes: [],
      classification: "even",
      repeatCount: startingCount,
      repeatUnitConsumed: 1,
      repeatUnitCreated: 1,
    };
  }

  if (startingCount != null) {
    normalized = normalized
      .replace(new RegExp(`2\\s*(${STITCH_NAMES})\\s+in\\s+each\\s+st(?:itch)?\\s+around`, "gi"), `${startingCount} inc`)
      .replace(new RegExp(`(${STITCH_NAMES})\\s+in\\s+each\\s+st(?:itch)?\\s+around`, "gi"), `${startingCount} $1`);
  }

  let repeatMatch = normalized.match(/^\((.+)\)\s*(?:x|repeat(?:ed)?\s*)\s*(\d+)\s*(?:times?)?$/i);
  if (!repeatMatch) repeatMatch = normalized.match(/^\*(.+)\*\s*(?:x|repeat(?:ed)?\s*)\s*(\d+)\s*(?:times?)?$/i);
  if (!repeatMatch) repeatMatch = normalized.match(/^(.+?)\s+x\s*(\d+)$/i);

  if (repeatMatch) {
    const unit = parseSequence(repeatMatch[1]);
    const repeats = safeCount(repeatMatch[2], "Repeat count", { positive: true });
    return {
      consumed: hasMagicRing ? 0 : safeMultiply(unit.consumed, repeats),
      created: safeMultiply(unit.created, repeats),
      notes: unit.notes,
      classification: summarizeClassification(unit.classifications, hasMagicRing),
      repeatCount: repeats,
      repeatUnitConsumed: unit.consumed,
      repeatUnitCreated: unit.created,
    };
  }

  const aroundMatch = normalized.match(/^\((.+)\)\s+around$/i) || normalized.match(/^\*(.+)\*\s+around$/i);
  if (aroundMatch) {
    if (startingCount == null) throw new Error("Enter a starting stitch count for an 'around' repeat");
    const unit = parseSequence(aroundMatch[1]);
    if (unit.consumed === 0 || startingCount % unit.consumed !== 0) {
      throw new PatternEvaluationError(
        `The ${unit.consumed}-stitch repeat does not fit evenly into ${stitchCountLabel(startingCount)} available`,
        "invalid-repeat-fit",
      );
    }
    const repeats = startingCount / unit.consumed;
    return {
      consumed: startingCount,
      created: safeMultiply(unit.created, repeats),
      notes: unit.notes,
      classification: summarizeClassification(unit.classifications, hasMagicRing),
      repeatCount: repeats,
      repeatUnitConsumed: unit.consumed,
      repeatUnitCreated: unit.created,
    };
  }

  const sequence = parseSequence(normalized);
  return {
    consumed: hasMagicRing ? 0 : sequence.consumed,
    created: sequence.created,
    notes: sequence.notes,
    classification: summarizeClassification(sequence.classifications, hasMagicRing),
    repeatCount: null,
    repeatUnitConsumed: null,
    repeatUnitCreated: null,
  };
}

function publicRoundResult(result) {
  return {
    round: result.round,
    source: result.source,
    status: result.status,
    startingCount: result.startingCount,
    consumed: result.consumed,
    created: result.created,
    writtenTotal: result.writtenTotal,
    difference: result.difference,
    notes: result.notes,
    message: result.message,
  };
}

/**
 * Parse and evaluate one round without mutating any surrounding pattern state.
 * Designer tooling uses the additional parse metadata while the free checker
 * continues to expose its original result shape through checkPattern().
 *
 * @param {string} line
 * @param {number | null} startingCount
 * @param {number} [fallbackRound]
 */
export function evaluatePatternRound(line, startingCount, fallbackRound = 1) {
  const roundMatch = line.match(/^(?:round|rnd|r)\s*#?\s*(\d+)\s*[:.)-]?\s*/i);
  const safeFallbackRound = Number.isSafeInteger(fallbackRound) && fallbackRound >= 1 ? fallbackRound : 1;
  let round = safeFallbackRound;
  let numericError = null;
  let roundNumberError = null;
  if (roundMatch) {
    try {
      round = safeCount(roundMatch[1], "Round number", { positive: true });
    } catch (error) {
      round = null;
      roundNumberError = error;
      numericError = error;
    }
  }
  let body = roundMatch ? line.slice(roundMatch[0].length) : line;
  const totalMatch = body.match(/[\[(]\s*(\d+)\s*(?:st(?:s|itches)?)?\s*[\])]\s*[.!]?$/i);
  let writtenTotal = null;
  if (totalMatch) {
    try {
      writtenTotal = safeCount(totalMatch[1], "Written total");
    } catch (error) {
      numericError ??= error;
    }
  }
  if (totalMatch) body = body.slice(0, totalMatch.index).trim().replace(/[.;]+$/g, "");

  const hasMagicRing = /\b(?:magic ring|magic circle|mr)\b/i.test(body);
  const availableCount = hasMagicRing ? 0 : startingCount;
  const details = {
    explicitRoundNumber: Boolean(roundMatch),
    instructionBody: body,
    hasMagicRing,
    instructionClassification: "unsupported",
    parsedRepeatCount: null,
    repeatUnitConsumed: null,
    repeatUnitCreated: null,
    failureKind: null,
  };

  if (numericError || (availableCount != null && (!Number.isSafeInteger(availableCount) || availableCount < 0))) {
    return {
      round,
      source: line,
      status: "unsupported",
      startingCount: Number.isSafeInteger(availableCount) ? availableCount : null,
      consumed: null,
      created: null,
      writtenTotal,
      difference: null,
      notes: [],
      message: numericError instanceof Error
        ? numericError.message
        : "Starting stitch count is outside the supported whole-number range.",
      ...details,
      failureKind: roundNumberError ? "invalid-round-number" : "invalid-number",
    };
  }

  if (availableCount == null) {
    return {
      round,
      source: line,
      status: "unsupported",
      startingCount: null,
      consumed: null,
      created: null,
      writtenTotal,
      difference: null,
      notes: [],
      message: "Enter the stitch count available before the first pasted round.",
      ...details,
      failureKind: "missing-starting-count",
    };
  }

  try {
    const math = parseBody(body, availableCount, hasMagicRing);
    const consumptionMatches = hasMagicRing || math.consumed === availableCount;
    const totalMatches = writtenTotal == null || math.created === writtenTotal;
    const status = consumptionMatches && totalMatches
      ? writtenTotal == null ? "calculated" : "correct"
      : "incorrect";

    let message = "The stitch math is consistent.";
    if (!consumptionMatches) {
      const difference = Math.abs(math.consumed - availableCount);
      message = math.consumed < availableCount
        ? `${stitchCountLabel(difference)} from the starting count ${difference === 1 ? "is" : "are"} not used by this instruction.`
        : `This instruction consumes ${stitchCountLabel(difference)} more than are available.`;
    } else if (!totalMatches) {
      const difference = math.created - writtenTotal;
      message = difference > 0
        ? `The written total is ${stitchCountLabel(difference)} too low.`
        : `The written total is ${stitchCountLabel(Math.abs(difference))} too high.`;
    } else if (writtenTotal == null) {
      message = "Calculated successfully, but there is no written total to compare.";
    }

    return {
      round,
      source: line,
      status,
      startingCount: availableCount,
      consumed: math.consumed,
      created: math.created,
      writtenTotal,
      difference: writtenTotal == null ? null : math.created - writtenTotal,
      notes: [...new Set(math.notes)],
      message,
      ...details,
      instructionClassification: math.classification,
      parsedRepeatCount: math.repeatCount,
      repeatUnitConsumed: math.repeatUnitConsumed,
      repeatUnitCreated: math.repeatUnitCreated,
    };
  } catch (error) {
    return {
      round,
      source: line,
      status: "unsupported",
      startingCount: availableCount,
      consumed: null,
      created: null,
      writtenTotal,
      difference: null,
      notes: [],
      message: error instanceof Error ? error.message : "This notation is not supported yet.",
      ...details,
      failureKind: error instanceof PatternEvaluationError ? error.failureKind : "unsupported-notation",
    };
  }
}

/**
 * @param {string} patternText
 * @param {number | null} [initialStartingCount]
 */
export function checkPattern(patternText, initialStartingCount = null) {
  const lines = patternText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return { results: [], error: "Paste at least one pattern round." };
  if (lines.length > MAX_FREE_ROUNDS) {
    return { results: [], error: `This preview checks up to ${MAX_FREE_ROUNDS} rounds at a time.` };
  }

  let nextStartingCount = Number.isSafeInteger(initialStartingCount) && initialStartingCount >= 0
    ? initialStartingCount
    : null;

  const results = lines.map((line, index) => {
    const evaluated = evaluatePatternRound(line, nextStartingCount, index + 1);
    nextStartingCount = evaluated.created != null ? evaluated.created : null;
    return publicRoundResult(evaluated);
  });

  return { results, error: null };
}
