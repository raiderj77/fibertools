const METERS_PER_INCH = 0.0254;

export const CROSS_STITCH_LIMITS = Object.freeze({
  patternStitches: 1_000_000,
  threadStitches: 10_000_000,
  fabricCount: 100,
  marginInches: 100,
  allowancePercent: 200,
  skeinLengthMeters: 1_000,
  strands: 12,
});

function finiteNumber(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function boundedPositive(value, maximum) {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed > 0 && parsed <= maximum ? parsed : null;
}

function boundedPositiveInteger(value, maximum) {
  const parsed = boundedPositive(value, maximum);
  return parsed !== null && Number.isSafeInteger(parsed) ? parsed : null;
}

function boundedNonNegative(value, maximum) {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= 0 && parsed <= maximum ? parsed : null;
}

export function getEffectiveFabricCount({ fabricCount, stitchSpan }) {
  const count = boundedPositive(fabricCount, CROSS_STITCH_LIMITS.fabricCount);
  const span = finiteNumber(stitchSpan);
  if (count === null || (span !== 1 && span !== 2)) return null;
  return count / span;
}

/** Finished design size before any margin. */
export function calculateCrossStitchSize({
  widthStitches,
  heightStitches,
  fabricCount,
  stitchSpan,
}) {
  const width = boundedPositiveInteger(widthStitches, CROSS_STITCH_LIMITS.patternStitches);
  const height = boundedPositiveInteger(heightStitches, CROSS_STITCH_LIMITS.patternStitches);
  const effectiveCount = getEffectiveFabricCount({ fabricCount, stitchSpan });
  if (width === null || height === null || effectiveCount === null) return null;

  const widthInches = width / effectiveCount;
  const heightInches = height / effectiveCount;
  if (!Number.isFinite(widthInches) || !Number.isFinite(heightInches)) return null;

  return {
    effectiveCount,
    widthInches,
    heightInches,
    widthCentimeters: widthInches * 2.54,
    heightCentimeters: heightInches * 2.54,
  };
}

/** Fabric cut size with a strictly positive user-selected margin on every side. */
export function calculateCrossStitchFabricCut({
  widthStitches,
  heightStitches,
  fabricCount,
  stitchSpan,
  margin,
  units,
}) {
  const design = calculateCrossStitchSize({
    widthStitches,
    heightStitches,
    fabricCount,
    stitchSpan,
  });
  const enteredMargin = finiteNumber(margin);
  if (!design || enteredMargin === null || enteredMargin <= 0) return null;
  if (units !== "imperial" && units !== "metric") return null;

  const marginInches = units === "metric" ? enteredMargin / 2.54 : enteredMargin;
  if (marginInches > CROSS_STITCH_LIMITS.marginInches) return null;

  const totalWidthInches = design.widthInches + 2 * marginInches;
  const totalHeightInches = design.heightInches + 2 * marginInches;
  if (!Number.isFinite(totalWidthInches) || !Number.isFinite(totalHeightInches)) return null;

  return {
    ...design,
    marginInches,
    totalWidthInches,
    totalHeightInches,
    totalWidthCentimeters: totalWidthInches * 2.54,
    totalHeightCentimeters: totalHeightInches * 2.54,
  };
}

/**
 * Planning model for full crosses only. Each ideal front cross contains two
 * diagonals of a square whose side is 1/effectiveCount inches. The user-entered
 * allowance represents back travel, starts, stops, tails, and other waste.
 */
export function calculateCrossStitchFlossPlan({
  fullCrosses,
  fabricCount,
  stitchSpan,
  workingStrands,
  allowancePercent,
  skeinLengthMeters,
  skeinBundleStrands,
}) {
  const crosses = boundedPositiveInteger(fullCrosses, CROSS_STITCH_LIMITS.threadStitches);
  const effectiveCount = getEffectiveFabricCount({ fabricCount, stitchSpan });
  const strands = boundedPositiveInteger(workingStrands, CROSS_STITCH_LIMITS.strands);
  const allowance = boundedNonNegative(
    allowancePercent,
    CROSS_STITCH_LIMITS.allowancePercent,
  );
  const labelLength = boundedPositive(
    skeinLengthMeters,
    CROSS_STITCH_LIMITS.skeinLengthMeters,
  );
  const bundleStrands = boundedPositiveInteger(
    skeinBundleStrands,
    CROSS_STITCH_LIMITS.strands,
  );

  if (
    crosses === null ||
    effectiveCount === null ||
    strands === null ||
    allowance === null ||
    labelLength === null ||
    bundleStrands === null
  ) {
    return null;
  }

  const frontPathInchesPerCross = (2 * Math.SQRT2) / effectiveCount;
  const frontWorkingPathMeters = crosses * frontPathInchesPerCross * METERS_PER_INCH;
  const plannedWorkingPathMeters = frontWorkingPathMeters * (1 + allowance / 100);
  const constituentStrandMeters = plannedWorkingPathMeters * strands;
  const availableConstituentStrandMetersPerSkein = labelLength * bundleStrands;
  const skeinEquivalent = constituentStrandMeters / availableConstituentStrandMetersPerSkein;
  const wholeSkeins = Math.ceil(skeinEquivalent);

  if (
    !Number.isFinite(frontWorkingPathMeters) ||
    !Number.isFinite(plannedWorkingPathMeters) ||
    !Number.isFinite(constituentStrandMeters) ||
    !Number.isFinite(skeinEquivalent) ||
    !Number.isSafeInteger(wholeSkeins) ||
    wholeSkeins <= 0
  ) {
    return null;
  }

  return {
    effectiveCount,
    frontPathInchesPerCross,
    frontWorkingPathMeters,
    plannedWorkingPathMeters,
    constituentStrandMeters,
    availableConstituentStrandMetersPerSkein,
    skeinEquivalent,
    wholeSkeins,
    allowancePercent: allowance,
  };
}
