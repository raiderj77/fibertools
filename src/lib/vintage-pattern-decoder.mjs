export const MAX_VINTAGE_PATTERN_TEXT_LENGTH = 20_000;

export const VINTAGE_SOURCE_CONVENTIONS = Object.freeze([
  "unknown",
  "us",
  "uk",
]);

const UK_TO_US_TERMS = Object.freeze([
  Object.freeze({
    label: "Double treble crochet",
    terms: Object.freeze(["double treble crochet", "double treble", "dtr"]),
    replacement: "treble crochet (tr)",
    note: "UK double treble crochet is US treble crochet.",
  }),
  Object.freeze({
    label: "Half treble crochet",
    terms: Object.freeze(["half treble crochet", "half treble", "htr"]),
    replacement: "half double crochet (hdc)",
    note: "UK half treble crochet is US half double crochet.",
  }),
  Object.freeze({
    label: "Treble crochet",
    terms: Object.freeze(["treble crochet", "treble", "tr"]),
    replacement: "double crochet (dc)",
    note: "UK treble crochet is US double crochet.",
  }),
  Object.freeze({
    label: "Double crochet",
    terms: Object.freeze(["double crochet", "dc"]),
    replacement: "single crochet (sc)",
    note: "UK double crochet is US single crochet.",
  }),
  Object.freeze({
    label: "Tension",
    terms: Object.freeze(["tension"]),
    replacement: "gauge",
    note: "Tension is commonly called gauge in US instructions.",
  }),
]);

export const SUPPORTED_VINTAGE_UK_TERMS = Object.freeze(
  UK_TO_US_TERMS.map(({ label, terms, replacement, note }) => Object.freeze({
    label,
    terms,
    replacement,
    note,
  })),
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ISOLATED_STITCH_TERMS = new Set([
  "double treble crochet",
  "double treble",
  "half treble crochet",
  "half treble",
  "treble crochet",
  "treble",
  "double crochet",
]);

function termMatcher(term) {
  const escaped = escapeRegex(term).replace(/ /g, "\\s+");
  if (ISOLATED_STITCH_TERMS.has(term)) {
    // A spelled-out stitch phrase is changed only when it is isolated like a
    // label or list item. This avoids rewriting a supported phrase nested in
    // an unknown compound stitch name or ordinary prose.
    return new RegExp(
      `(^\\s*|[\\n,:;/(\\[{\"'\\-]\\s*)(${escaped})(?=$|\\s*[\\n,./;:!?\\)\\]}\"'\\-])`,
      "giu",
    );
  }
  return new RegExp(`(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${escaped})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`, "giu");
}

function boundedPatternMatcher(source) {
  return new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
    "giu",
  );
}

function parenthesizedPairMatchers(entry) {
  const abbreviation = entry.terms
    .filter((term) => /^[a-z]+$/iu.test(term))
    .sort((left, right) => left.length - right.length)[0];
  if (!abbreviation) return [];

  const escapedAbbreviation = escapeRegex(abbreviation);
  return entry.terms
    .filter((term) => term !== abbreviation && ISOLATED_STITCH_TERMS.has(term))
    .flatMap((term) => {
      const escapedTerm = escapeRegex(term).replace(/ /g, "\\s+");
      return [
        boundedPatternMatcher(`${escapedTerm}\\s*\\(\\s*${escapedAbbreviation}\\s*\\)`),
        boundedPatternMatcher(`${escapedAbbreviation}\\s*\\(\\s*${escapedTerm}\\s*\\)`),
      ];
    });
}

const UNSUPPORTED_PARENTHETICAL_LEAD = new RegExp(
  String.raw`(?:\b(?:cluster|label|abbreviation|key|definition|variant|version|motif|shell|bobble|puff|popcorn|sequence|name|term|custom\s+stitch|named\s+stitch|special\s+stitch)\s*$|\b(?:half\s+double\s+crochet|single\s+crochet|triple\s+treble(?:\s+crochet)?|(?:front|back)(?:\s+|[-‐‑‒–—])post(?:\s+|[-‐‑‒–—])(?:double\s+treble(?:\s+crochet)?|half\s+treble(?:\s+crochet)?|treble(?:\s+crochet)?|double\s+crochet|dtr|htr|tr|dc)|(?:extended|linked|foundation|standing|reverse|crossed|relief|raised)(?:\s+|[-‐‑‒–—])(?:double\s+treble(?:\s+crochet)?|half\s+treble(?:\s+crochet)?|treble(?:\s+crochet)?|double\s+crochet|dtr|htr|tr|dc))\s*$)`,
  "iu",
);

function findUnsupportedParentheticalRanges(text) {
  const ranges = [];
  const stack = [];

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "(") {
      const lead = text.slice(Math.max(0, index - 100), index);
      stack.push({
        start: index,
        unsupported: stack.some((item) => item.unsupported) || UNSUPPORTED_PARENTHETICAL_LEAD.test(lead),
      });
    } else if (text[index] === ")" && stack.length > 0) {
      const item = stack.pop();
      if (item.unsupported) ranges.push({ start: item.start, end: index + 1 });
    }
  }

  for (const item of stack) {
    if (item.unsupported) ranges.push({ start: item.start, end: text.length });
  }
  return ranges;
}

const COMPOUND_DASH = "[-‐‑‒–—]";
const COMPOUND_DASH_CHARACTER = /[-‐‑‒–—]/u;
const UNSUPPORTED_PREFIX_MODIFIERS = new RegExp(
  `(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:half|single|triple|front(?:\\s+|${COMPOUND_DASH})post|back(?:\\s+|${COMPOUND_DASH})post|extended|linked|foundation|standing|reverse|crossed|relief|raised)(?:\\s+|${COMPOUND_DASH}\\s*)$`,
  "iu",
);

const ALLOWED_PRECEDING_INSTRUCTION_WORDS = new Set([
  "a", "above", "across", "add", "after", "along", "an", "and", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "between", "ch", "chain", "continue",
  "center", "centre", "corresponding", "dc", "dtr", "each", "every", "fifth", "first", "followed", "four", "fourth", "from",
  "htr", "in", "into", "join", "last", "make", "miss", "next", "of",
  "marked", "one", "or", "over", "place", "previous", "remaining", "repeat", "rnd", "round", "row", "same", "second", "sixth", "skip", "space",
  "spaces", "st", "stitch", "stitches", "then", "third", "three", "through", "times", "to", "toward", "towards", "tr",
  "the", "turn", "twice", "two", "under", "upon", "using", "with", "work",
]);

function hasUnsupportedWhitespacePrefix(text, start) {
  const precedingToken = text.slice(0, start).match(/([\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+)[\t\p{Zs}]+$/u)?.[1];
  if (!precedingToken || /^\p{N}+$/u.test(precedingToken)) return false;
  return !ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(precedingToken.toLocaleLowerCase("en-US"));
}
const UNSUPPORTED_SUFFIX_MODIFIERS = new RegExp(
  `^(?:\\s+|${COMPOUND_DASH}\\s*)(?:crochet(?:\\s+|${COMPOUND_DASH}\\s*))?(?:(?:two|three|four|\\d+)(?:\\s+|${COMPOUND_DASH}\\s*)together|cluster|decrease|increase|through(?:\\s+|${COMPOUND_DASH}\\s*)(?:the(?:\\s+|${COMPOUND_DASH}\\s*))?(?:front|back)(?:\\s+|${COMPOUND_DASH}\\s*)loop)\\b`,
  "iu",
);

function isUnsupportedCompoundContext(text, start, end) {
  return (
    COMPOUND_DASH_CHARACTER.test(text[start - 1] ?? "")
    || COMPOUND_DASH_CHARACTER.test(text[end] ?? "")
    || hasUnsupportedWhitespacePrefix(text, start)
    || UNSUPPORTED_PREFIX_MODIFIERS.test(text.slice(0, start))
    || UNSUPPORTED_SUFFIX_MODIFIERS.test(text.slice(end))
  );
}

function isTensionGaugeContext(text, start, end) {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const isGaugeSquare = /^\s+square\b/iu.test(after);
  const isMeasurement = /^\s*(?:(?:is|of)\s+|:\s*)?\d+(?:\.\d+)?\s*(?:st(?:s|itch(?:es)?)?|rows?|double\s+treble(?:\s+crochet)?|dtr|half\s+treble(?:\s+crochet)?|htr|treble(?:\s+crochet)?|tr|double\s+crochet|dc)\b/iu.test(after);
  const isHeading = /(?:^|\n)\s*$/u.test(before) && /^\s*:/u.test(after);
  return isGaugeSquare || isMeasurement || isHeading;
}

function collectMatches(text) {
  const matches = [];
  const blockedMatches = [];
  const unsupportedParentheticalRanges = findUnsupportedParentheticalRanges(text);

  for (const entry of UK_TO_US_TERMS) {
    const variants = [
      ...parenthesizedPairMatchers(entry),
      ...entry.terms.map((term) => termMatcher(term)),
    ];

    for (const matcher of variants) {
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const prefixLength = match[1].length;
        const matchedText = match[2];
        const start = match.index + prefixLength;
        const end = start + matchedText.length;
        if (unsupportedParentheticalRanges.some((range) => range.start < start && range.end >= end)) continue;
        if (entry.label === "Tension" && !isTensionGaugeContext(text, start, end)) continue;
        if (isUnsupportedCompoundContext(text, start, end)) {
          blockedMatches.push({ start, end });
          continue;
        }
        matches.push({
          start,
          end,
          matchedText,
          entry,
        });
      }
    }
  }

  const eligibleMatches = matches.filter((match) => !blockedMatches.some((blocked) => (
    blocked.start <= match.start && blocked.end >= match.end
  )));

  eligibleMatches.sort((left, right) => (
    left.start - right.start
      || (right.end - right.start) - (left.end - left.start)
      || left.entry.label.localeCompare(right.entry.label)
  ));

  const chosen = [];
  let cursor = 0;
  for (const match of eligibleMatches) {
    if (match.start >= cursor) {
      chosen.push(match);
      cursor = match.end;
    }
  }
  return chosen;
}

function hasUnicodeBoundedMatch(text, source) {
  return new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
    "iu",
  ).test(text);
}

function buildSignals(text, convention) {
  const signals = [];

  if (
    convention === "unknown"
    && hasUnicodeBoundedMatch(text, "double\\s+crochet|treble(?:\\s+crochet)?|half\\s+treble|dtr|htr|dc|tr")
  ) {
    signals.push({
      title: "Crochet convention not established",
      note: "These stitch names can mean different stitches in UK and US instructions. The text was preserved; confirm the pattern key or publisher before choosing a conversion.",
    });
  }

  if (hasUnicodeBoundedMatch(text, "tension|miss|cast\\s+off|work\\s+straight")) {
    signals.push({
      title: "Wording that may follow UK conventions",
      note: "These terms can appear in UK sources, but wording alone does not establish a pattern's country or publication date.",
    });
  }

  if (hasUnicodeBoundedMatch(text, "wool\\s+(?:over|forward|back|round\\s+needle)|wl\\.?\\s*(?:fwd|bk)\\.?|wf\\.?|wb\\.?")) {
    signals.push({
      title: "Older yarn-position wording",
      note: "This language may describe yarn placement or a yarn over. Confirm the source abbreviation key and the next stitch before changing the technique.",
    });
  }

  if (
    hasUnicodeBoundedMatch(
      text,
      "(?:(?:needles?|hooks?)\\s+(?:(?:no\\.?|size)\\s*)\\d+|(?:no\\.?|size)\\s*\\d+(?:\\s+[\\p{L}\\p{M}-]+){0,3}\\s+(?:needles?|hooks?))",
    )
  ) {
    signals.push({
      title: "Numbered needle or hook size",
      note: "A bare size number does not identify the sizing system or diameter. Verify the source system and millimeter size before selecting a tool.",
    });
  }

  if (hasUnicodeBoundedMatch(text, "\\d+(?:\\.\\d+)?\\s*oz(?:s|\\.)?")) {
    signals.push({
      title: "Yarn amount stated by weight",
      note: "Weight alone does not establish modern yardage. Match the original yarn construction and verify length per unit weight before substituting.",
    });
  }

  return signals;
}

function unchangedResult(text, convention) {
  return {
    status: "ready",
    convention,
    output: text,
    segments: [{ type: "text", content: text }],
    substitutions: [],
    substitutionCount: 0,
    signals: buildSignals(text, convention),
  };
}

/**
 * Review bounded pattern text under an explicit source convention. Unknown and
 * US modes never rewrite the input. Only explicit UK mode applies the finite
 * UK-to-US term map; everything else is preserved byte-for-byte.
 *
 * @param {string} text
 * @param {"unknown" | "us" | "uk"} convention
 * @returns {
 *   | {
 *       status: "ready",
 *       convention: "unknown" | "us" | "uk",
 *       output: string,
 *       segments: Array<{type: "text" | "sub", content: string, original?: string}>,
 *       substitutions: Array<{label: string, replacement: string, note: string, count: number, examples: string[]}>,
 *       substitutionCount: number,
 *       signals: Array<{title: string, note: string}>
 *     }
 *   | { status: "invalid", message: string }
 * }
 */
export function decodeVintagePattern(text, convention) {
  if (typeof text !== "string") {
    return { status: "invalid", message: "Pattern text must be a string." };
  }
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH) {
    return {
      status: "invalid",
      message: `Pattern text must be ${MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }
  if (!text.trim()) {
    return { status: "invalid", message: "Enter some pattern text to review." };
  }
  if (!VINTAGE_SOURCE_CONVENTIONS.includes(convention)) {
    return {
      status: "invalid",
      message: "Choose Unknown, US terms, or UK terms as the source convention.",
    };
  }

  if (convention !== "uk") {
    return unchangedResult(text, convention);
  }

  const matches = collectMatches(text);
  const segments = [];
  const substitutionMap = new Map();
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ type: "text", content: text.slice(cursor, match.start) });
    }
    segments.push({
      type: "sub",
      content: match.entry.replacement,
      original: match.matchedText,
    });
    cursor = match.end;

    const existing = substitutionMap.get(match.entry.label);
    if (existing) {
      existing.count += 1;
      const example = match.matchedText.toLowerCase();
      if (!existing.examples.includes(example)) existing.examples.push(example);
    } else {
      substitutionMap.set(match.entry.label, {
        label: match.entry.label,
        replacement: match.entry.replacement,
        note: match.entry.note,
        count: 1,
        examples: [match.matchedText.toLowerCase()],
      });
    }
  }

  if (cursor < text.length) {
    segments.push({ type: "text", content: text.slice(cursor) });
  }

  if (segments.length === 0) {
    segments.push({ type: "text", content: text });
  }

  return {
    status: "ready",
    convention,
    output: segments.map((segment) => segment.content).join(""),
    segments,
    substitutions: [...substitutionMap.values()],
    substitutionCount: matches.length,
    signals: buildSignals(text, convention),
  };
}
