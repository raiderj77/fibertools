export const MIN_WEAVING_WPI = 0.1;
export const MAX_WEAVING_WPI = 240;
export const MIN_WEAVING_DIMENSION = 0.1;
export const MAX_STRUCTURE_REPEAT = 64;
export const MAX_WEAVING_DIMENSION = 10000;
export const MAX_WEAVING_ALLOWANCE = 10000;
export const MAX_WEAVING_LENGTH_ALLOWANCE_PERCENT = 100;
export const MAX_WARP_EPI = 1000;
export const MAX_YARDS_PER_UNIT = 10000000;
export const MAX_REED_SETT_EPI = 120;
export const SUPPORTED_REED_DENTS = Object.freeze([6, 8, 10, 12, 15, 16, 20]);

function failure(reason, error) {
  return { ok: false, reason, error };
}

function isFiniteWithin(value, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

/**
 * WPI-based sett values are only starting estimates. The structure factor
 * adjusts the WPI midpoint; yarn, twist, desired hand, beat, and finishing
 * still require a woven and wet-finished sample.
 */
export function estimateSettFromWpi({ wpi, warpThreads, interlacements }) {
  if (!isFiniteWithin(wpi, MIN_WEAVING_WPI, MAX_WEAVING_WPI)) {
    return failure(
      "invalid-wpi",
      `WPI must be greater than 0 and no more than ${MAX_WEAVING_WPI}.`,
    );
  }
  if (
    !Number.isSafeInteger(warpThreads)
    || warpThreads < 1
    || warpThreads > MAX_STRUCTURE_REPEAT
    || !Number.isSafeInteger(interlacements)
    || interlacements < 1
    || interlacements > MAX_STRUCTURE_REPEAT
  ) {
    return failure("invalid-structure", "The selected weave structure does not have a supported repeat formula.");
  }

  const factor = warpThreads / (interlacements + warpThreads);
  const unroundedEpi = wpi * factor;
  if (!Number.isFinite(unroundedEpi)) {
    return failure("unsafe-sett", "The sett estimate could not be calculated safely.");
  }

  return {
    ok: true,
    wpi,
    factor,
    unroundedEpi,
    startingEpi: Math.max(1, Math.round(unroundedEpi)),
  };
}

/**
 * Preserve the existing warp-estimate model while enforcing finite bounds.
 * The result remains a planning estimate, not a purchase or finished-size
 * guarantee.
 */
export function calculateWarpEstimate({
  projectLength,
  projectWidth,
  loomWaste,
  sampling,
  epi,
  yardsPerUnit,
  lengthAllowancePercent,
  units,
}) {
  if (units !== "imperial" && units !== "metric") {
    return failure("invalid-units", "Choose inches or centimeters.");
  }
  const maximumDimension = units === "metric" ? MAX_WEAVING_DIMENSION * 2.54 : MAX_WEAVING_DIMENSION;
  const maximumAllowance = units === "metric" ? MAX_WEAVING_ALLOWANCE * 2.54 : MAX_WEAVING_ALLOWANCE;
  if (!isFiniteWithin(projectLength, MIN_WEAVING_DIMENSION, maximumDimension)) {
    return failure(
      "invalid-length",
      `Project length must be greater than 0 and no more than ${maximumDimension.toLocaleString()} ${units === "metric" ? "centimeters" : "inches"}.`,
    );
  }
  if (!isFiniteWithin(projectWidth, MIN_WEAVING_DIMENSION, maximumDimension)) {
    return failure(
      "invalid-width",
      `Project width must be greater than 0 and no more than ${maximumDimension.toLocaleString()} ${units === "metric" ? "centimeters" : "inches"}.`,
    );
  }
  if (!isFiniteWithin(loomWaste, 0, maximumAllowance)) {
    return failure("invalid-waste", `Loom waste must be from 0 through ${maximumAllowance.toLocaleString()}.`);
  }
  if (!isFiniteWithin(sampling, 0, maximumAllowance)) {
    return failure("invalid-sampling", `Sampling allowance must be from 0 through ${maximumAllowance.toLocaleString()}.`);
  }
  if (!isFiniteWithin(epi, 0, MAX_WARP_EPI)) {
    return failure("invalid-epi", `EPI must be from 0 through ${MAX_WARP_EPI.toLocaleString()}.`);
  }
  if (!isFiniteWithin(yardsPerUnit, 0, MAX_YARDS_PER_UNIT)) {
    return failure("invalid-yardage", `Yards per skein must be from 0 through ${MAX_YARDS_PER_UNIT.toLocaleString()}.`);
  }
  if (!isFiniteWithin(lengthAllowancePercent, 0, MAX_WEAVING_LENGTH_ALLOWANCE_PERCENT)) {
    return failure(
      "invalid-length-allowance",
      `Length allowance must be from 0 through ${MAX_WEAVING_LENGTH_ALLOWANCE_PERCENT} percent.`,
    );
  }

  const lengthInches = units === "metric" ? projectLength / 2.54 : projectLength;
  const widthInches = units === "metric" ? projectWidth / 2.54 : projectWidth;
  const wasteInches = units === "metric" ? loomWaste / 2.54 : loomWaste;
  const samplingInches = units === "metric" ? sampling / 2.54 : sampling;
  const lengthAllowance = lengthInches * (lengthAllowancePercent / 100);
  const totalWarpLength = lengthInches + wasteInches + samplingInches + lengthAllowance;
  const totalEnds = epi > 0 ? Math.round(widthInches * epi) : 0;
  if (epi > 0 && totalEnds < 1) {
    return failure("insufficient-ends", "Width and EPI must produce at least one whole warp end.");
  }
  const totalWarpYards = totalEnds > 0 ? (totalEnds * totalWarpLength) / 36 : 0;
  const totalWeftYards = epi > 0 ? widthInches * (lengthInches / 36) * epi * 1.1 : 0;
  const values = [
    lengthInches,
    widthInches,
    totalWarpLength,
    totalEnds,
    totalWarpYards,
    totalWeftYards,
  ];
  if (!values.every(Number.isFinite) || !Number.isSafeInteger(totalEnds)) {
    return failure("unsafe-plan", "These inputs produce an unsafe warp estimate. Use smaller values.");
  }

  return {
    ok: true,
    totalWarpLengthIn: Number(totalWarpLength.toFixed(1)),
    totalWarpLengthCm: Number((totalWarpLength * 2.54).toFixed(1)),
    lengthAllowancePct: lengthAllowancePercent,
    totalEnds,
    warpYards: Math.round(totalWarpYards),
    warpMeters: Math.round(totalWarpYards * 0.9144),
    weftYards: Math.round(totalWeftYards),
    weftMeters: Math.round(totalWeftYards * 0.9144),
    weftAssumedPpi: epi,
    weftAllowancePct: 10,
    skeinsNeeded: yardsPerUnit > 0
      ? Math.ceil((totalWarpYards + totalWeftYards) / yardsPerUnit)
      : 0,
  };
}

function greatestCommonDivisor(first, second) {
  let a = first;
  let b = second;
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function formatDentCount(value) {
  if (value === 0) return "skip";
  if (value === 1) return "1 end";
  return `${value} ends`;
}

/**
 * Produce one exact, evenly distributed repeating sleying sequence. Reducing
 * sett/reed by their GCD bounds the sequence to at most one inch of dents.
 */
export function calculateReedSleying({ sett, reedDent }) {
  if (!Number.isSafeInteger(sett) || sett < 1 || sett > MAX_REED_SETT_EPI) {
    return failure(
      "invalid-sett",
      `Desired sett must be a whole number from 1 through ${MAX_REED_SETT_EPI} EPI.`,
    );
  }
  if (!Number.isSafeInteger(reedDent) || !SUPPORTED_REED_DENTS.includes(reedDent)) {
    return failure(
      "unsupported-reed",
      `Choose a supported reed: ${SUPPORTED_REED_DENTS.join(", ")} dents per inch.`,
    );
  }

  const divisor = greatestCommonDivisor(sett, reedDent);
  const periodEnds = sett / divisor;
  const periodDents = reedDent / divisor;
  const sequence = Array.from({ length: periodDents }, (_, index) => (
    Math.floor(((index + 1) * periodEnds) / periodDents)
      - Math.floor((index * periodEnds) / periodDents)
  ));
  const sequenceTotal = sequence.reduce((sum, ends) => sum + ends, 0);
  const exactEpiNumerator = sequenceTotal * reedDent;
  const exactEpiDenominator = periodDents;

  if (
    sequence.length < 1
    || sequence.length > Math.max(...SUPPORTED_REED_DENTS)
    || sequenceTotal !== periodEnds
    || exactEpiNumerator !== sett * exactEpiDenominator
  ) {
    return failure("unsafe-sleying", "An exact bounded sleying sequence could not be generated.");
  }

  const instruction = periodDents === 1
    ? `${formatDentCount(periodEnds)} in every dent.`
    : `Repeat across ${periodDents} dents: ${sequence.map(formatDentCount).join(", ")} (${periodEnds} ends total).`;

  return {
    ok: true,
    sett,
    reedDent,
    ratio: sett / reedDent,
    sequence,
    periodDents,
    periodEnds,
    actualEpi: sett,
    instruction,
  };
}
