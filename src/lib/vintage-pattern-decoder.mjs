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
    label: "Tension square",
    terms: Object.freeze(["tension square"]),
    replacement: "gauge swatch",
    note: "Tension square is commonly called a gauge swatch in US instructions.",
  }),
  Object.freeze({
    label: "Tension",
    terms: Object.freeze(["tension"]),
    replacement: "gauge",
    note: "Tension is commonly called gauge in US instructions.",
  }),
  Object.freeze({
    label: "Miss",
    terms: Object.freeze(["miss"]),
    replacement: "skip",
    note: "UK miss is commonly written as skip in US instructions.",
  }),
  Object.freeze({
    label: "Cast off",
    terms: Object.freeze(["cast off"]),
    replacement: "bind off",
    note: "Cast off is commonly called bind off in US knitting instructions.",
  }),
  Object.freeze({
    label: "Work straight",
    terms: Object.freeze(["work straight"]),
    replacement: "work even",
    note: "Work straight is commonly written as work even in US instructions.",
  }),
  Object.freeze({
    label: "Wool round needle",
    terms: Object.freeze(["wool round needle"]),
    replacement: "yarn over (yo)",
    note: "This wording commonly describes a yarn over; verify it against the source key.",
  }),
  Object.freeze({
    label: "Wool over",
    terms: Object.freeze(["wool over"]),
    replacement: "yarn over (yo)",
    note: "This wording commonly describes a yarn over; verify it against the source key.",
  }),
  Object.freeze({
    label: "Wool forward",
    terms: Object.freeze(["wool forward", "wl fwd", "wl. fwd", "wl.fwd", "wf"]),
    replacement: "yarn forward (yf)",
    note: "This wording describes moving the working yarn forward; verify the next stitch before treating it as an increase.",
  }),
  Object.freeze({
    label: "Wool back",
    terms: Object.freeze(["wool back", "wl bk", "wl. bk", "wl.bk", "wb"]),
    replacement: "yarn back (yb)",
    note: "This wording describes moving the working yarn to the back.",
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

function termMatcher(term) {
  const escaped = escapeRegex(term).replace(/ /g, "\\s+");
  return new RegExp(`(^|[^A-Za-z])(${escaped})(?=$|[^A-Za-z])`, "gi");
}

function collectMatches(text) {
  const matches = [];

  for (const entry of UK_TO_US_TERMS) {
    for (const term of entry.terms) {
      const matcher = termMatcher(term);
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const prefixLength = match[1].length;
        const matchedText = match[2];
        matches.push({
          start: match.index + prefixLength,
          end: match.index + prefixLength + matchedText.length,
          matchedText,
          entry,
        });
      }
    }
  }

  matches.sort((left, right) => (
    left.start - right.start
      || (right.end - right.start) - (left.end - left.start)
      || left.entry.label.localeCompare(right.entry.label)
  ));

  const chosen = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start >= cursor) {
      chosen.push(match);
      cursor = match.end;
    }
  }
  return chosen;
}

function buildSignals(text, convention) {
  const signals = [];

  if (
    convention === "unknown"
    && /\b(double\s+crochet|treble(?:\s+crochet)?|half\s+treble|dtr|htr|dc|tr)\b/i.test(text)
  ) {
    signals.push({
      title: "Crochet convention not established",
      note: "These stitch names can mean different stitches in UK and US instructions. The text was preserved; confirm the pattern key or publisher before choosing a conversion.",
    });
  }

  if (/\b(tension|miss|cast\s+off|work\s+straight)\b/i.test(text)) {
    signals.push({
      title: "Wording that may follow UK conventions",
      note: "These terms can appear in UK sources, but wording alone does not establish a pattern's country or publication date.",
    });
  }

  if (/\b(wool\s+(?:over|forward|back|round\s+needle)|wl\.?\s*(?:fwd|bk)\.?|wf\.?|wb\.?)\b/i.test(text)) {
    signals.push({
      title: "Older yarn-position wording",
      note: "This language may describe yarn placement or a yarn over. Confirm the source abbreviation key and the next stitch before changing the technique.",
    });
  }

  if (/\bno\.?\s*\d+\b/i.test(text) || /\bsize\s+\d+\b[^\n]{0,24}\b(?:needle|hook)\b/i.test(text)) {
    signals.push({
      title: "Numbered needle or hook size",
      note: "A bare size number does not identify the sizing system or diameter. Verify the source system and millimeter size before selecting a tool.",
    });
  }

  if (/\b\d+(?:\.\d+)?\s*oz(?:s|\.)?\b/i.test(text)) {
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
