export const UK_US_TERM_PAIRS = Object.freeze([
  { uk: "double treble crochet", us: "treble crochet" },
  { uk: "double treble", us: "treble crochet" },
  { uk: "half treble crochet", us: "half double crochet" },
  { uk: "treble crochet", us: "double crochet" },
  { uk: "double crochet", us: "single crochet" },
  { uk: "triple treble", us: "double treble" },
  { uk: "quadruple treble", us: "triple treble" },
  { uk: "dtr", us: "tr" },
  { uk: "htr", us: "hdc" },
  { uk: "tr", us: "dc" },
  { uk: "dc", us: "sc" },
  { uk: "ttr", us: "dtr" },
  { uk: "qtr", us: "ttr" },
  { uk: "tension", us: "gauge" },
  { uk: "tension square", us: "gauge swatch" },
  { uk: "miss", us: "skip" },
  { uk: "yarn round hook", us: "yarn over" },
  { uk: "yrh", us: "yo" },
  { uk: "yoh", us: "yo" },
  { uk: "wool over hook", us: "yarn over" },
  { uk: "cast off", us: "bind off" },
  { uk: "work straight", us: "work even" },
  { uk: "wool over", us: "yarn over" },
  { uk: "wool forward", us: "yarn forward" },
  { uk: "wool round needle", us: "yarn over" },
].map(Object.freeze));

export const MAX_UK_US_TEXT_LENGTH = 100_000;

export const UK_TO_US_MAPPINGS = Object.freeze(
  UK_US_TERM_PAIRS.map(({ uk, us }) => Object.freeze({ from: uk, to: us })),
);

const reverseCanonical = new Map();
for (const { uk, us } of UK_US_TERM_PAIRS) {
  if (!reverseCanonical.has(us)) reverseCanonical.set(us, uk);
}

export const US_TO_UK_MAPPINGS = Object.freeze(
  [...reverseCanonical].map(([from, to]) => Object.freeze({ from, to })),
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function preserveCase(source, replacement) {
  const sourceLetters = source.replace(/[^A-Za-z]/g, "");
  if (sourceLetters && sourceLetters === sourceLetters.toUpperCase()) {
    return replacement.toUpperCase();
  }

  const sourceWords = source.split(/\s+/);
  const isTitleCase = sourceWords.length > 1
    && sourceWords.every((word) => word[0] === word[0]?.toUpperCase());
  if (isTitleCase) {
    return replacement.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  }

  if (source[0] === source[0]?.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function mappingsFor(direction) {
  if (direction === "uk-to-us") return UK_TO_US_MAPPINGS;
  if (direction === "us-to-uk") return US_TO_UK_MAPPINGS;
  return null;
}

/**
 * Replace mapped crochet/vintage terms in one regex pass. Matching is longest
 * token first and does not feed replacement text back through the converter.
 * Non-mapped text, punctuation, and whitespace are preserved.
 *
 * @param {string} text
 * @param {"uk-to-us" | "us-to-uk"} direction
 * @returns {
 *   | { status: "ready", output: string, replacementCount: number }
 *   | { status: "invalid", message: string }
 * }
 */
export function convertUkUsTerms(text, direction) {
  if (typeof text !== "string") {
    return { status: "invalid", message: "Pattern text must be a string." };
  }
  if (text.length > MAX_UK_US_TEXT_LENGTH) {
    return {
      status: "invalid",
      message: `Pattern text must be ${MAX_UK_US_TEXT_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  const mappings = mappingsFor(direction);
  if (!mappings) {
    return { status: "invalid", message: "Choose UK-to-US or US-to-UK conversion." };
  }

  const ordered = [...mappings].sort((left, right) => (
    right.from.length - left.from.length || left.from.localeCompare(right.from)
  ));
  const replacements = new Map(ordered.map(({ from, to }) => [from.toLowerCase(), to]));
  const alternatives = ordered.map(({ from }) => escapeRegex(from)).join("|");
  const matcher = new RegExp(`(^|[^A-Za-z])(${alternatives})(?=$|[^A-Za-z])`, "gi");
  let replacementCount = 0;

  const output = text.replace(matcher, (whole, prefix, matchedTerm) => {
    const replacement = replacements.get(matchedTerm.toLowerCase());
    if (!replacement) return whole;
    replacementCount += 1;
    return prefix + preserveCase(matchedTerm, replacement);
  });

  return { status: "ready", output, replacementCount };
}
