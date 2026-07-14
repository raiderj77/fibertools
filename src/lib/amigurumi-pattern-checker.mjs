export const MAX_FREE_ROUNDS = 20;

const STITCH_NAMES = "sc|hdc|dc";

function operation(consumed, created, label, note) {
  return { consumed, created, label, note };
}

function parseToken(token) {
  const value = token.trim().replace(/[.;]+$/g, "");
  if (!value) return operation(0, 0, "", null);

  if (/^(?:sl\s*st|slst)\s+to\s+join$/i.test(value)) {
    return operation(0, 0, "sl st to join", "Joining slip stitch excluded from the round total");
  }

  let match = value.match(new RegExp(`^(\\d+)\\s*(${STITCH_NAMES})\\s+in\\s+(?:the\\s+)?next\\s+st(?:itch)?$`, "i"));
  if (match) return operation(1, Number(match[1]), value, null);

  match = value.match(new RegExp(`^(${STITCH_NAMES})\\s+in\\s+(?:the\\s+)?next\\s+(\\d+)\\s+st(?:s|itches)?$`, "i"));
  if (match) return operation(Number(match[2]), Number(match[2]), value, null);

  if (/^(?:inc|increase)(?:\s+in\s+(?:the\s+)?next\s+st(?:itch)?)?$/i.test(value)) {
    return operation(1, 2, value, null);
  }

  match = value.match(/^(\d+)\s+(?:inc|increase)s?$/i);
  if (match) return operation(Number(match[1]), Number(match[1]) * 2, value, null);

  if (/^(?:dec|decrease|sc2tog|hdc2tog|dc2tog)$/i.test(value)) {
    return operation(2, 1, value, null);
  }

  match = value.match(/^(\d+)\s+(?:dec|decrease)s?$/i);
  if (match) return operation(Number(match[1]) * 2, Number(match[1]), value, null);

  match = value.match(/^(?:ch|chain)\s*(\d+)$/i) || value.match(/^(\d+)\s*(?:ch|chains?)$/i);
  if (match) {
    return operation(0, 0, value, "Chains are treated as setup stitches and excluded from amigurumi totals");
  }

  match = value.match(/^(\d+)\s*(sl\s*st|slst)$/i) || value.match(/^(sl\s*st|slst)\s*(\d+)$/i);
  if (match) {
    const count = Number(match[1]) || Number(match[2]);
    return operation(count, count, value, null);
  }

  match = value.match(new RegExp(`^(\\d+)\\s*(${STITCH_NAMES})$`, "i"));
  if (match) return operation(Number(match[1]), Number(match[1]), value, null);

  match = value.match(new RegExp(`^(${STITCH_NAMES})\\s*(\\d+)$`, "i"));
  if (match) return operation(Number(match[2]), Number(match[2]), value, null);

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
      total.consumed += parsed.consumed;
      total.created += parsed.created;
      if (parsed.note) total.notes.push(parsed.note);
      return total;
    },
    { consumed: 0, created: 0, notes: [] },
  );
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
    return { consumed: startingCount, created: startingCount * 2, notes: [] };
  }

  const aroundEven = normalized.match(new RegExp(`^(${STITCH_NAMES})\\s+in\\s+each\\s+st(?:itch)?\\s+around$`, "i"));
  if (aroundEven) {
    if (startingCount == null) throw new Error("Enter a starting stitch count for an 'around' instruction");
    return { consumed: startingCount, created: startingCount, notes: [] };
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
    const repeats = Number(repeatMatch[2]);
    return {
      consumed: hasMagicRing ? 0 : unit.consumed * repeats,
      created: unit.created * repeats,
      notes: unit.notes,
    };
  }

  const aroundMatch = normalized.match(/^\((.+)\)\s+around$/i) || normalized.match(/^\*(.+)\*\s+around$/i);
  if (aroundMatch) {
    if (startingCount == null) throw new Error("Enter a starting stitch count for an 'around' repeat");
    const unit = parseSequence(aroundMatch[1]);
    if (unit.consumed === 0 || startingCount % unit.consumed !== 0) {
      throw new Error(`The ${unit.consumed}-stitch repeat does not fit evenly into ${startingCount} starting stitches`);
    }
    const repeats = startingCount / unit.consumed;
    return { consumed: startingCount, created: unit.created * repeats, notes: unit.notes };
  }

  const sequence = parseSequence(normalized);
  return { ...sequence, consumed: hasMagicRing ? 0 : sequence.consumed };
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

  let nextStartingCount = Number.isInteger(initialStartingCount) && initialStartingCount >= 0
    ? initialStartingCount
    : null;

  const results = lines.map((line, index) => {
    const roundMatch = line.match(/^(?:round|rnd|r)\s*#?\s*(\d+)\s*[:.)-]?\s*/i);
    const round = roundMatch ? Number(roundMatch[1]) : index + 1;
    let body = roundMatch ? line.slice(roundMatch[0].length) : line;
    const totalMatch = body.match(/[\[(]\s*(\d+)\s*(?:st(?:s|itches)?)?\s*[\])]\s*[.!]?$/i);
    const writtenTotal = totalMatch ? Number(totalMatch[1]) : null;
    if (totalMatch) body = body.slice(0, totalMatch.index).trim().replace(/[.;]+$/g, "");

    const hasMagicRing = /\b(?:magic ring|magic circle|mr)\b/i.test(body);
    const startingCount = hasMagicRing ? 0 : nextStartingCount;

    if (startingCount == null) {
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
      };
    }

    try {
      const math = parseBody(body, startingCount, hasMagicRing);
      const consumptionMatches = hasMagicRing || math.consumed === startingCount;
      const totalMatches = writtenTotal == null || math.created === writtenTotal;
      const status = consumptionMatches && totalMatches
        ? writtenTotal == null ? "calculated" : "correct"
        : "incorrect";

      let message = "The stitch math is consistent.";
      if (!consumptionMatches) {
        message = math.consumed < startingCount
          ? `${startingCount - math.consumed} starting stitches are not used by this instruction.`
          : `This instruction consumes ${math.consumed - startingCount} more stitches than are available.`;
      } else if (!totalMatches) {
        const difference = math.created - writtenTotal;
        message = difference > 0
          ? `The written total is ${difference} stitches too low.`
          : `The written total is ${Math.abs(difference)} stitches too high.`;
      } else if (writtenTotal == null) {
        message = "Calculated successfully, but there is no written total to compare.";
      }

      nextStartingCount = math.created;
      return {
        round,
        source: line,
        status,
        startingCount,
        consumed: math.consumed,
        created: math.created,
        writtenTotal,
        difference: writtenTotal == null ? null : math.created - writtenTotal,
        notes: [...new Set(math.notes)],
        message,
      };
    } catch (error) {
      return {
        round,
        source: line,
        status: "unsupported",
        startingCount,
        consumed: null,
        created: null,
        writtenTotal,
        difference: null,
        notes: [],
        message: error instanceof Error ? error.message : "This notation is not supported yet.",
      };
    }
  });

  return { results, error: null };
}
