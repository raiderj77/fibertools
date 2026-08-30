export const C2C_LIMITS = Object.freeze({
  maxSwatchBlocks: 1_000,
  maxDimension: 10_000,
  maxBlocksPerAxis: 10_000,
  maxTotalBlocks: 1_000_000,
  maxYarnPerBlock: 100_000,
  maxAllowancePercent: 100,
});

function number(value) {
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function whole(value) {
  const parsed = number(value);
  return parsed !== null && Number.isSafeInteger(parsed) ? parsed : null;
}

function invalid(error) {
  return { ok: false, error };
}

/**
 * Round a measured C2C block size to the nearest whole block on each axis.
 * Returned dimensions are nominal arithmetic, not a finished-size guarantee.
 */
export function buildC2cPlan({
  swatchBlocksWide,
  swatchBlocksTall,
  swatchWidth,
  swatchHeight,
  targetWidth,
  targetHeight,
  yarnPerBlock,
  allowancePercent,
}) {
  const blocksInSwatchWide = whole(swatchBlocksWide);
  const blocksInSwatchTall = whole(swatchBlocksTall);
  if (
    blocksInSwatchWide === null
    || blocksInSwatchTall === null
    || blocksInSwatchWide < 1
    || blocksInSwatchTall < 1
    || blocksInSwatchWide > C2C_LIMITS.maxSwatchBlocks
    || blocksInSwatchTall > C2C_LIMITS.maxSwatchBlocks
  ) {
    return invalid(`Swatch block counts must be whole numbers from 1 to ${C2C_LIMITS.maxSwatchBlocks.toLocaleString()}.`);
  }

  const measuredWidth = number(swatchWidth);
  const measuredHeight = number(swatchHeight);
  const requestedWidth = number(targetWidth);
  const requestedHeight = number(targetHeight);
  if (
    [measuredWidth, measuredHeight, requestedWidth, requestedHeight]
      .some((value) => value === null || value <= 0 || value > C2C_LIMITS.maxDimension)
  ) {
    return invalid(`Swatch and target dimensions must be greater than zero and at most ${C2C_LIMITS.maxDimension.toLocaleString()}.`);
  }

  const blockWidth = measuredWidth / blocksInSwatchWide;
  const blockHeight = measuredHeight / blocksInSwatchTall;
  const blocksWide = Math.max(1, Math.round(requestedWidth / blockWidth));
  const blocksTall = Math.max(1, Math.round(requestedHeight / blockHeight));
  if (
    blocksWide > C2C_LIMITS.maxBlocksPerAxis
    || blocksTall > C2C_LIMITS.maxBlocksPerAxis
    || blocksWide * blocksTall > C2C_LIMITS.maxTotalBlocks
  ) {
    return invalid(`The rounded plan must stay within ${C2C_LIMITS.maxBlocksPerAxis.toLocaleString()} blocks per axis and ${C2C_LIMITS.maxTotalBlocks.toLocaleString()} total blocks.`);
  }

  const totalBlocks = blocksWide * blocksTall;
  const totalDiagonalRows = blocksWide + blocksTall - 1;
  const optionalYarn = typeof yarnPerBlock === "string" && yarnPerBlock.trim() === ""
    ? null
    : number(yarnPerBlock);
  const allowance = number(allowancePercent);
  if (
    allowance === null
    || allowance < 0
    || allowance > C2C_LIMITS.maxAllowancePercent
  ) {
    return invalid(`Yarn allowance must be from 0 to ${C2C_LIMITS.maxAllowancePercent} percent.`);
  }
  if (optionalYarn !== null && (optionalYarn <= 0 || optionalYarn > C2C_LIMITS.maxYarnPerBlock)) {
    return invalid(`Measured yarn per block must be greater than zero and at most ${C2C_LIMITS.maxYarnPerBlock.toLocaleString()} inches.`);
  }

  const baseYards = optionalYarn === null ? null : (totalBlocks * optionalYarn) / 36;
  const plannedYards = baseYards === null ? null : baseYards * (1 + allowance / 100);

  return {
    ok: true,
    blockWidth,
    blockHeight,
    blocksWide,
    blocksTall,
    totalBlocks,
    totalDiagonalRows,
    nominalWidth: blocksWide * blockWidth,
    nominalHeight: blocksTall * blockHeight,
    baseYards,
    allowancePercent: allowance,
    plannedYards,
  };
}
