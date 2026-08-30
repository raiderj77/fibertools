export const MAX_DISTRIBUTION_STITCHES = 4096;

/** @returns {{ status: "invalid", message: string }} */
function invalid(message) {
  return { status: "invalid", message };
}

/** @returns {{ status: "unsupported", message: string }} */
function unsupported(message) {
  return { status: "unsupported", message };
}

/** @param {number} total @param {number} buckets @returns {number[]} */
function spreadWholeNumber(total, buckets) {
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }, (_, index) => {
    const extrasThroughThisBucket = Math.floor(((index + 1) * remainder) / buckets);
    const extrasBeforeThisBucket = Math.floor((index * remainder) / buckets);
    return base + extrasThroughThisBucket - extrasBeforeThisBucket;
  });
}

/** @param {number[]} values @returns {Array<{ value: number, count: number }>} */
function runLengthEncode(values) {
  /** @type {Array<{ value: number, count: number }>} */
  const runs = [];
  for (const value of values) {
    const previous = runs.at(-1);
    if (previous?.value === value) previous.count += 1;
    else runs.push({ value, count: 1 });
  }
  return runs;
}

/** @param {number} plainStitches @param {string} plainLabel @param {string} changeLabel */
function formatStep(plainStitches, plainLabel, changeLabel) {
  return plainStitches > 0 ? `${plainLabel}${plainStitches}, ${changeLabel}` : changeLabel;
}

/**
 * @param {{ segments: number[], plainLabel: string, changeLabel: string, shape: "row" | "round", target: number }} inputs
 */
function formatInstruction({ segments, plainLabel, changeLabel, shape, target }) {
  const changeSegments = shape === "row" ? segments.slice(0, -1) : segments;
  const sequence = runLengthEncode(changeSegments)
    .map(({ value, count }) => {
      const step = formatStep(value, plainLabel, changeLabel);
      return count === 1 ? step : `*${step}* repeat ${count} times`;
    })
    .join("; ");
  const prefix = shape === "round" ? "From the round marker" : "Across the flat row";
  if (shape === "round") return `${prefix}, work ${sequence}. (${target} sts)`;

  const trailingPlainStitches = segments.at(-1) ?? 0;
  const finish = trailingPlainStitches > 0
    ? `; finish ${plainLabel}${trailingPlainStitches}`
    : "";
  return `${prefix}, work ${sequence}${finish}. (${target} sts)`;
}

/**
 * Plan one row or round of single-stitch increases or pairwise decreases.
 * For a round, segments are circular gaps immediately before each change.
 * For a flat row, segments include both edge gaps and all inter-change gaps,
 * so the final segment is worked after the last change event.
 *
 * @param {{ mode: "increase" | "decrease", shape: "row" | "round", current: number, target: number }} inputs
 * @returns {
 *   | { status: "ready", mode: "increase" | "decrease", shape: "row" | "round",
 *       current: number, target: number, changes: number, unchangedStitches: number,
 *       changeConsumes: number, changeProduces: number, consumedStitches: number,
 *       producedStitches: number, segments: number[], gapCount: number,
 *       trailingPlainStitches: number, minimumPlainSpacing: number,
 *       maximumPlainSpacing: number, knitInstructions: string, crochetInstructions: string }
 *   | { status: "invalid" | "unsupported", message: string }
 * }
 */
export function planStitchDistribution({ mode, shape, current, target }) {
  if (mode !== "increase" && mode !== "decrease") {
    return invalid("Choose increase or decrease mode.");
  }
  if (shape !== "row" && shape !== "round") {
    return invalid("Choose a flat row or an in-the-round plan.");
  }
  if (![current, target].every(Number.isSafeInteger)) {
    return invalid("Current and target counts must be safe whole numbers.");
  }
  if (
    current < 1
    || target < 1
    || current > MAX_DISTRIBUTION_STITCHES
    || target > MAX_DISTRIBUTION_STITCHES
  ) {
    return invalid(`Enter stitch counts from 1 to ${MAX_DISTRIBUTION_STITCHES}.`);
  }
  if (current === target) {
    return invalid("Current and target counts must differ.");
  }
  if (mode === "increase" && target < current) {
    return invalid("Increase mode requires a target larger than the current count.");
  }
  if (mode === "decrease" && target > current) {
    return invalid("Decrease mode requires a target smaller than the current count.");
  }

  const changes = Math.abs(target - current);
  const changeConsumes = mode === "increase" ? 1 : 2;
  const changeProduces = mode === "increase" ? 2 : 1;

  if (changes * changeConsumes > current) {
    const message = mode === "increase"
      ? "This one-pass model can add at most one stitch per current stitch. Use a tested multi-row plan for a larger increase."
      : "This one-pass model cannot remove more than half the current stitches with pairwise decreases.";
    return unsupported(message);
  }

  const unchangedStitches = current - changes * changeConsumes;
  const gapCount = shape === "row" ? changes + 1 : changes;
  const segments = spreadWholeNumber(unchangedStitches, gapCount);
  const consumedStitches = segments.reduce((sum, count) => sum + count, 0) + changes * changeConsumes;
  const producedStitches = segments.reduce((sum, count) => sum + count, 0) + changes * changeProduces;

  if (consumedStitches !== current || producedStitches !== target) {
    return invalid("The requested counts do not produce an exact bounded distribution.");
  }

  const knitChange = mode === "increase" ? "KFB" : "K2tog";
  const crochetChange = mode === "increase" ? "2 SC in next st" : "SC2tog";

  return {
    status: "ready",
    mode,
    shape,
    current,
    target,
    changes,
    unchangedStitches,
    changeConsumes,
    changeProduces,
    consumedStitches,
    producedStitches,
    segments,
    gapCount,
    trailingPlainStitches: shape === "row" ? segments.at(-1) ?? 0 : 0,
    minimumPlainSpacing: Math.min(...segments),
    maximumPlainSpacing: Math.max(...segments),
    knitInstructions: formatInstruction({
      segments,
      plainLabel: "K",
      changeLabel: knitChange,
      shape,
      target,
    }),
    crochetInstructions: formatInstruction({
      segments,
      plainLabel: "SC ",
      changeLabel: crochetChange,
      shape,
      target,
    }),
  };
}
