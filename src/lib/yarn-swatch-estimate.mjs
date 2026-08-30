const METERS_PER_YARD = 0.9144;
const GRAMS_PER_OUNCE = 28.3495;

export const YARN_ESTIMATE_LIMITS = Object.freeze({
  dimension: 10_000,
  yarnLength: 1_000_000,
  skeinWeight: 100_000,
  allowancePercent: 100,
  resultLength: 10_000_000,
});

function boundedPositive(value, maximum) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > maximum) return null;
  return parsed;
}

function boundedNonNegative(value, maximum) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > maximum) return null;
  return parsed;
}

/**
 * Scale yarn consumed by a representative swatch to a flat rectangular target.
 * Target and swatch dimensions must use the same unit. Yarn length can be yards
 * or meters, provided the same unit is used for any later skein calculation.
 */
export function calculateMeasuredSwatchYarn({
  targetWidth,
  targetLength,
  swatchWidth,
  swatchLength,
  swatchYarnLength,
  allowancePercent = 10,
}) {
  const width = boundedPositive(targetWidth, YARN_ESTIMATE_LIMITS.dimension);
  const length = boundedPositive(targetLength, YARN_ESTIMATE_LIMITS.dimension);
  const sampleWidth = boundedPositive(swatchWidth, YARN_ESTIMATE_LIMITS.dimension);
  const sampleLength = boundedPositive(swatchLength, YARN_ESTIMATE_LIMITS.dimension);
  const sampleYarn = boundedPositive(swatchYarnLength, YARN_ESTIMATE_LIMITS.yarnLength);
  const allowance = boundedNonNegative(
    allowancePercent,
    YARN_ESTIMATE_LIMITS.allowancePercent,
  );

  if (
    width === null ||
    length === null ||
    sampleWidth === null ||
    sampleLength === null ||
    sampleYarn === null ||
    allowance === null
  ) {
    return null;
  }

  const targetArea = width * length;
  const swatchArea = sampleWidth * sampleLength;
  const areaRatio = targetArea / swatchArea;
  const baseLength = sampleYarn * areaRatio;
  const plannedLength = baseLength * (1 + allowance / 100);

  if (
    !Number.isFinite(baseLength) ||
    !Number.isFinite(plannedLength) ||
    plannedLength <= 0 ||
    plannedLength > YARN_ESTIMATE_LIMITS.resultLength
  ) {
    return null;
  }

  return {
    targetArea,
    swatchArea,
    areaRatio,
    baseLength,
    plannedLength,
    allowancePercent: allowance,
  };
}

/** Convert a measured yarn requirement into whole skeins from label values. */
export function calculateMeasuredSkeinPurchase({
  lengthNeeded,
  skeinLength,
  skeinWeight,
  units,
}) {
  const needed = boundedPositive(lengthNeeded, YARN_ESTIMATE_LIMITS.resultLength);
  const labelLength = boundedPositive(skeinLength, YARN_ESTIMATE_LIMITS.yarnLength);
  const labelWeight = boundedPositive(skeinWeight, YARN_ESTIMATE_LIMITS.skeinWeight);

  if (
    needed === null ||
    labelLength === null ||
    labelWeight === null ||
    (units !== "imperial" && units !== "metric")
  ) {
    return null;
  }

  const skeins = Math.ceil(needed / labelLength);
  if (!Number.isSafeInteger(skeins) || skeins <= 0 || skeins > 1_000_000) return null;

  const purchaseWeight = skeins * labelWeight;
  if (!Number.isFinite(purchaseWeight)) return null;

  const grams = units === "metric" ? purchaseWeight : purchaseWeight * GRAMS_PER_OUNCE;

  return {
    skeins,
    displayLength: labelLength,
    grams: Math.round(grams),
    ounces: Number((grams / GRAMS_PER_OUNCE).toFixed(1)),
  };
}

/** Estimate the yarn remaining only when the remnant cannot exceed a full skein. */
export function calculatePartialSkeinLength({ partialWeight, fullWeight, fullLength, units }) {
  const partial = boundedPositive(partialWeight, YARN_ESTIMATE_LIMITS.skeinWeight);
  const full = boundedPositive(fullWeight, YARN_ESTIMATE_LIMITS.skeinWeight);
  const length = boundedPositive(fullLength, YARN_ESTIMATE_LIMITS.yarnLength);

  if (
    partial === null ||
    full === null ||
    length === null ||
    partial > full ||
    (units !== "imperial" && units !== "metric")
  ) {
    return null;
  }

  const remainingDisplayLength = (partial / full) * length;
  const yards = units === "metric"
    ? remainingDisplayLength / METERS_PER_YARD
    : remainingDisplayLength;
  const meters = units === "metric"
    ? remainingDisplayLength
    : remainingDisplayLength * METERS_PER_YARD;

  return {
    remainingDisplayLength,
    yards,
    meters,
    percentRemaining: (partial / full) * 100,
  };
}
