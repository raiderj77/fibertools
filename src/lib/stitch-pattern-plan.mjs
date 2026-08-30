export const MAX_STITCH_PATTERNS = 8;
export const MAX_STITCH_MULTIPLE = 1000;
export const MAX_STITCH_PLUS = 10000;
export const MAX_STITCH_COUNT = 10000;
export const MAX_EDGE_STITCHES_PER_SIDE = Math.floor(MAX_STITCH_COUNT / 2);
export const MAX_STITCH_LCM = 1000000000;
export const MAX_STITCH_RESULTS = 500;
export const MAX_GAUGE_STITCHES = 1000;
export const MAX_GAUGE_SPAN = 100;
export const MAX_TARGET_WIDTH = 1000;
export const MAX_WIDTH_TOLERANCE = 1000;
const BIG_ZERO = BigInt(0);
const BIG_ONE = BigInt(1);

function failure(reason, error) {
  return { ok: false, reason, error };
}
function positiveMod(value, modulus) {
  const remainder = value % modulus;
  return remainder >= BIG_ZERO ? remainder : remainder + modulus;
}

function gcdBigInt(a, b) {
  while (b !== BIG_ZERO) {
    [a, b] = [b, a % b];
  }
  return a;
}

function extendedGcd(a, b) {
  let oldR = a;
  let r = b;
  let oldS = BIG_ONE;
  let s = BIG_ZERO;

  while (r !== BIG_ZERO) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  return { gcd: oldR, coefficient: oldS };
}

function modularInverse(value, modulus) {
  if (modulus === BIG_ONE) return BIG_ZERO;
  const result = extendedGcd(positiveMod(value, modulus), modulus);
  if (result.gcd !== BIG_ONE) return null;
  return positiveMod(result.coefficient, modulus);
}

function combineCongruences(currentResidue, currentModulus, nextResidue, nextModulus) {
  const divisor = gcdBigInt(currentModulus, nextModulus);
  const difference = nextResidue - currentResidue;
  if (difference % divisor !== BIG_ZERO) return failure("conflict", "The entered plus offsets have no shared arithmetic solution.");

  const reducedCurrent = currentModulus / divisor;
  const reducedNext = nextModulus / divisor;
  const combinedModulus = currentModulus * reducedNext;
  if (combinedModulus > BigInt(MAX_STITCH_LCM)) {
    return failure(
      "unsafe-lcm",
      `The combined repeat spacing exceeds the ${MAX_STITCH_LCM.toLocaleString()}-stitch safety limit. Use fewer or smaller multiples.`,
    );
  }

  const inverse = modularInverse(reducedCurrent, reducedNext);
  if (inverse === null) return failure("unsafe-lcm", "The entered multiples could not be combined safely.");
  const adjustment = positiveMod((difference / divisor) * inverse, reducedNext);
  const residue = positiveMod(currentResidue + currentModulus * adjustment, combinedModulus);
  return { ok: true, residue, modulus: combinedModulus };
}

function roundedCeiling(value) {
  const epsilon = Number.EPSILON * Math.max(1, Math.abs(value)) * 8;
  return Math.ceil(value - epsilon);
}

function roundedFloor(value) {
  const epsilon = Number.EPSILON * Math.max(1, Math.abs(value)) * 8;
  return Math.floor(value + epsilon);
}

/**
 * Convert a measured gauge and physical-width interval to the whole stitch
 * counts that actually fall inside it. A zero tolerance remains exactly zero;
 * it is never replaced with a default allowance.
 */
export function deriveGaugeStitchRange({ gaugeStitches, gaugeSpan, targetWidth, tolerance }) {
  if (!Number.isFinite(gaugeStitches) || gaugeStitches <= 0 || gaugeStitches > MAX_GAUGE_STITCHES) {
    return failure("invalid-gauge", `Gauge stitches must be greater than 0 and no more than ${MAX_GAUGE_STITCHES.toLocaleString()}.`);
  }
  if (!Number.isFinite(gaugeSpan) || gaugeSpan <= 0 || gaugeSpan > MAX_GAUGE_SPAN) {
    return failure("invalid-gauge", `Gauge span must be greater than 0 and no more than ${MAX_GAUGE_SPAN.toLocaleString()} inches.`);
  }
  if (!Number.isFinite(targetWidth) || targetWidth <= 0 || targetWidth > MAX_TARGET_WIDTH) {
    return failure("invalid-width", `Target width must be greater than 0 and no more than ${MAX_TARGET_WIDTH.toLocaleString()} inches.`);
  }
  if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > MAX_WIDTH_TOLERANCE) {
    return failure("invalid-tolerance", `Tolerance must be from 0 through ${MAX_WIDTH_TOLERANCE.toLocaleString()} inches.`);
  }
  if (tolerance > targetWidth) {
    return failure("invalid-tolerance", "Tolerance cannot be greater than the target width.");
  }

  const stitchesPerInch = gaugeStitches / gaugeSpan;
  const minCount = Math.max(1, roundedCeiling(stitchesPerInch * (targetWidth - tolerance)));
  const maxCount = roundedFloor(stitchesPerInch * (targetWidth + tolerance));
  if (![stitchesPerInch, minCount, maxCount].every(Number.isFinite) || maxCount > MAX_STITCH_COUNT) {
    return failure("range-out-of-bounds", `The gauge-derived range must stay within 1 through ${MAX_STITCH_COUNT.toLocaleString()} stitches.`);
  }
  if (minCount > maxCount) {
    return failure("empty-range", "No whole stitch count falls inside that exact gauge and width interval. Increase the tolerance or revise an input.");
  }

  return {
    ok: true,
    stitchesPerInch,
    minCount,
    maxCount,
    targetWidth,
    tolerance,
  };
}

/**
 * Solve count = multiple * repeat + plus for every entered pattern. Edge
 * stitches are entered per side and added twice to each returned total.
 * Results are arithmetic references only; they do not validate a pattern,
 * construction, gauge, fit, or yarn requirement.
 */
export function solveStitchPatternCounts({ patterns, minCount, maxCount, edgeStitchesPerSide = 0 }) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return failure("no-patterns", "Add at least one stitch pattern.");
  }
  if (patterns.length > MAX_STITCH_PATTERNS) {
    return failure("too-many-patterns", `Use no more than ${MAX_STITCH_PATTERNS} stitch patterns at once.`);
  }
  if (!Number.isSafeInteger(minCount) || !Number.isSafeInteger(maxCount)
    || minCount < 1 || maxCount < minCount || maxCount > MAX_STITCH_COUNT) {
    return failure("invalid-range", `Use a whole stitch-count range from 1 through ${MAX_STITCH_COUNT.toLocaleString()}, with the minimum no greater than the maximum.`);
  }
  if (!Number.isSafeInteger(edgeStitchesPerSide) || edgeStitchesPerSide < 0
    || edgeStitchesPerSide > MAX_EDGE_STITCHES_PER_SIDE) {
    return failure("invalid-edges", `Edge stitches per side must be a whole number from 0 through ${MAX_EDGE_STITCHES_PER_SIDE.toLocaleString()}.`);
  }

  const normalizedPatterns = [];
  for (const [index, pattern] of patterns.entries()) {
    if (!Number.isSafeInteger(pattern?.multiple) || pattern.multiple < 1 || pattern.multiple > MAX_STITCH_MULTIPLE) {
      return failure("invalid-pattern", `Pattern ${index + 1} multiple must be a whole number from 1 through ${MAX_STITCH_MULTIPLE.toLocaleString()}.`);
    }
    if (!Number.isSafeInteger(pattern?.plus) || pattern.plus < 0 || pattern.plus > MAX_STITCH_PLUS) {
      return failure("invalid-pattern", `Pattern ${index + 1} plus value must be a whole number from 0 through ${MAX_STITCH_PLUS.toLocaleString()}.`);
    }
    normalizedPatterns.push({
      id: pattern.id,
      name: typeof pattern.name === "string" ? pattern.name : "",
      multiple: pattern.multiple,
      plus: pattern.plus,
    });
  }

  let residue = BIG_ZERO;
  let modulus = BIG_ONE;
  for (const pattern of normalizedPatterns) {
    const nextModulus = BigInt(pattern.multiple);
    const nextResidue = BigInt(pattern.plus % pattern.multiple);
    const combined = combineCongruences(residue, modulus, nextResidue, nextModulus);
    if (!combined.ok) return combined;
    residue = combined.residue;
    modulus = combined.modulus;
  }

  const totalEdgeStitches = edgeStitchesPerSide * 2;
  const minimumPatternCount = Math.max(
    1,
    minCount - totalEdgeStitches,
    ...normalizedPatterns.map((pattern) => pattern.plus + pattern.multiple),
  );
  const maximumPatternCount = maxCount - totalEdgeStitches;
  const lcm = Number(modulus);
  const base = Number(residue);
  const counts = [];
  let availableCount = 0;

  if (minimumPatternCount <= maximumPatternCount) {
    const firstPatternCount = base >= minimumPatternCount
      ? base
      : base + Math.ceil((minimumPatternCount - base) / lcm) * lcm;
    if (firstPatternCount <= maximumPatternCount) {
      availableCount = Math.floor((maximumPatternCount - firstPatternCount) / lcm) + 1;
      const resultCount = Math.min(availableCount, MAX_STITCH_RESULTS);
      for (let index = 0; index < resultCount; index += 1) {
        counts.push(firstPatternCount + index * lcm + totalEdgeStitches);
      }
    }
  }

  return {
    ok: true,
    lcm,
    counts,
    patterns: normalizedPatterns,
    minCount,
    maxCount,
    edgeStitchesPerSide,
    totalEdgeStitches,
    totalMatches: availableCount,
    truncated: availableCount > MAX_STITCH_RESULTS,
  };
}
