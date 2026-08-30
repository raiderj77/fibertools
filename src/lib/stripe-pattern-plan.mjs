export const STRIPE_PATTERN_LIMITS = Object.freeze({
  minimumColors: 2,
  maximumColors: 12,
  maximumStripes: 200,
  maximumRowsPerStripe: 100,
  maximumRelativeWeight: 100,
});

/** @returns {{ status: "invalid", field: string, message: string }} */
function invalid(field, message) {
  return { status: "invalid", field, message };
}

/** @param {unknown} value @param {number} minimum @param {number} maximum */
function boundedWholeNumber(value, minimum, maximum) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) return null;
  return parsed;
}

/** @param {number} seed */
function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/**
 * @param {Array<{ id: string, weight: number }>} colors
 * @param {() => number} random
 * @param {string | undefined} previousId
 */
function pickWeightedColor(colors, random, previousId) {
  let eligibleWeight = 0;
  for (const color of colors) {
    if (color.id !== previousId) eligibleWeight += color.weight;
  }

  let threshold = random() * eligibleWeight;
  let fallback = colors[0].id;
  for (const color of colors) {
    if (color.id === previousId) continue;
    fallback = color.id;
    threshold -= color.weight;
    if (threshold < 0) return color.id;
  }
  return fallback;
}

/**
 * Build a bounded stripe-row plan. Random modes avoid an immediate color
 * repeat and interpret each validated weight as relative frequency among the
 * currently eligible colors. Sequence mode follows palette order and ignores
 * weight values. Only row counts are modeled; yarn use is not estimated.
 *
 * @param {{
 *   mode: "random" | "fixed" | "sequence",
 *   colors: Array<{ id: unknown, weight?: unknown }>,
 *   totalStripes: unknown,
 *   fixedRows?: unknown,
 *   minRows?: unknown,
 *   maxRows?: unknown,
 *   seed: unknown,
 * }} inputs
 * @returns {
 *   | { status: "ready", mode: "random" | "fixed" | "sequence", normalizedSeed: number,
 *       weightsApplied: boolean, stripes: Array<{ colorId: string, rows: number }>,
 *       totalRows: number, perColorRows: Record<string, number> }
 *   | { status: "invalid", field: string, message: string }
 * }
 */
export function planStripePattern({
  mode,
  colors,
  totalStripes,
  fixedRows,
  minRows,
  maxRows,
  seed,
}) {
  if (mode !== "random" && mode !== "fixed" && mode !== "sequence") {
    return invalid("mode", "Choose a supported stripe mode.");
  }

  const stripeCount = boundedWholeNumber(totalStripes, 1, STRIPE_PATTERN_LIMITS.maximumStripes);
  if (stripeCount === null) {
    return invalid(
      "totalStripes",
      `Number of stripes must be a whole number from 1 to ${STRIPE_PATTERN_LIMITS.maximumStripes}.`,
    );
  }

  let parsedFixedRows = null;
  let parsedMinRows = null;
  let parsedMaxRows = null;
  if (mode === "random") {
    parsedMinRows = boundedWholeNumber(minRows, 1, STRIPE_PATTERN_LIMITS.maximumRowsPerStripe);
    parsedMaxRows = boundedWholeNumber(maxRows, 1, STRIPE_PATTERN_LIMITS.maximumRowsPerStripe);
    if (parsedMinRows === null || parsedMaxRows === null) {
      return invalid(
        "rowRange",
        `Minimum and maximum rows must be whole numbers from 1 to ${STRIPE_PATTERN_LIMITS.maximumRowsPerStripe}.`,
      );
    }
    if (parsedMinRows > parsedMaxRows) {
      return invalid("rowRange", "Minimum rows cannot be greater than maximum rows.");
    }
  } else {
    parsedFixedRows = boundedWholeNumber(fixedRows, 1, STRIPE_PATTERN_LIMITS.maximumRowsPerStripe);
    if (parsedFixedRows === null) {
      return invalid(
        "fixedRows",
        `Rows per stripe must be a whole number from 1 to ${STRIPE_PATTERN_LIMITS.maximumRowsPerStripe}.`,
      );
    }
  }

  if (!Number.isSafeInteger(seed)) {
    return invalid("seed", "The pattern seed must be a safe whole number.");
  }

  if (
    !Array.isArray(colors)
    || colors.length < STRIPE_PATTERN_LIMITS.minimumColors
    || colors.length > STRIPE_PATTERN_LIMITS.maximumColors
  ) {
    return invalid(
      "colors",
      `Use ${STRIPE_PATTERN_LIMITS.minimumColors} to ${STRIPE_PATTERN_LIMITS.maximumColors} colors.`,
    );
  }

  const usesWeights = mode !== "sequence";
  for (let index = 0; index < colors.length; index += 1) {
    const color = colors[index];
    if (!color || typeof color !== "object") {
      return invalid("colors", `Color ${index + 1} is invalid.`);
    }
    if (typeof color.id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(color.id)) {
      return invalid("colors", `Color ${index + 1} needs a valid internal identifier.`);
    }
    for (let prior = 0; prior < index; prior += 1) {
      if (colors[prior].id === color.id) {
        return invalid("colors", "Each color must have a unique identifier.");
      }
    }
    if (
      usesWeights
      && boundedWholeNumber(color.weight, 1, STRIPE_PATTERN_LIMITS.maximumRelativeWeight) === null
    ) {
      return invalid(
        "weights",
        `Each relative weight must be a whole number from 1 to ${STRIPE_PATTERN_LIMITS.maximumRelativeWeight}.`,
      );
    }
  }

  const normalizedColors = colors.map((color) => ({
    id: /** @type {string} */ (color.id),
    weight: usesWeights ? Number(color.weight) : 1,
  }));
  const normalizedSeed = seed >>> 0;
  const random = createSeededRandom(normalizedSeed);
  /** @type {Array<{ colorId: string, rows: number }>} */
  const stripes = [];
  /** @type {Record<string, number>} */
  const perColorRows = Object.fromEntries(normalizedColors.map((color) => [color.id, 0]));
  let totalRows = 0;
  let previousId;

  for (let index = 0; index < stripeCount; index += 1) {
    const colorId = mode === "sequence"
      ? normalizedColors[index % normalizedColors.length].id
      : pickWeightedColor(normalizedColors, random, previousId);
    const rows = mode === "random"
      ? /** @type {number} */ (parsedMinRows)
        + Math.floor(random() * (/** @type {number} */ (parsedMaxRows) - /** @type {number} */ (parsedMinRows) + 1))
      : /** @type {number} */ (parsedFixedRows);

    stripes.push({ colorId, rows });
    perColorRows[colorId] += rows;
    totalRows += rows;
    previousId = colorId;
  }

  return {
    status: "ready",
    mode,
    normalizedSeed,
    weightsApplied: usesWeights,
    stripes,
    totalRows,
    perColorRows,
  };
}
