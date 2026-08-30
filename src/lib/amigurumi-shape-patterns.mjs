export const AMIGURUMI_SHAPE_LIMITS = Object.freeze({
  minTotalRounds: 6,
  maxTotalRounds: 30,
  minBaseRounds: 1,
  maxBaseRounds: 10,
  minOvalChain: 4,
  maxOvalChain: 50,
  minOvalRounds: 1,
  maxOvalRounds: 10,
  maxInstructionLines: 32,
});

function boundedInteger(value, minimum, maximum, label) {
  if (!Number.isInteger(value)) {
    throw new RangeError(`${label} must be an integer.`);
  }
  if (value < minimum || value > maximum) {
    throw new RangeError(`${label} must be at least ${minimum} and at most ${maximum}.`);
  }
  return value;
}

function verifyLength(lines) {
  if (lines.length > AMIGURUMI_SHAPE_LIMITS.maxInstructionLines) {
    throw new RangeError("The generated reference exceeds the instruction-line limit.");
  }
  return lines;
}

/** Build a symmetric six-stitch increase/decrease count schedule. */
export function generateSphere(rounds) {
  const totalRounds = boundedInteger(
    rounds,
    AMIGURUMI_SHAPE_LIMITS.minTotalRounds,
    AMIGURUMI_SHAPE_LIMITS.maxTotalRounds,
    "Sphere rounds",
  );
  const increaseCount = Math.floor(totalRounds / 2);
  const evenCount = totalRounds % 2 === 0 ? 1 : 2;
  const lines = [];

  for (let round = 1; round <= increaseCount; round += 1) {
    const total = 6 * round;
    if (round === 1) lines.push("Rnd 1: Magic ring, 6 sc. (6)");
    else if (round === 2) lines.push("Rnd 2: 2 sc in each st around. (12)");
    else lines.push(`Rnd ${round}: *sc ${round - 2}, inc* x6. (${total})`);
  }

  const maxStitches = 6 * increaseCount;
  for (let index = 0; index < evenCount; index += 1) {
    const round = increaseCount + 1 + index;
    lines.push(`Rnd ${round}: sc in each st around. (${maxStitches})`);
  }

  let outputRound = increaseCount + evenCount + 1;
  for (let sourceRound = increaseCount; sourceRound >= 2; sourceRound -= 1) {
    if (sourceRound === 2) lines.push(`Rnd ${outputRound}: dec x6. (6)`);
    else lines.push(`Rnd ${outputRound}: *sc ${sourceRound - 2}, dec* x6. (${6 * (sourceRound - 1)})`);
    outputRound += 1;
  }

  lines.push("Count reference ends with 6 stitches; choose stuffing, closure, and finishing separately.");
  return verifyLength(lines);
}

/** Increase by six on alternating rounds; this is a stepped taper count schedule. */
export function generateCone(rounds) {
  const totalRounds = boundedInteger(
    rounds,
    AMIGURUMI_SHAPE_LIMITS.minTotalRounds,
    AMIGURUMI_SHAPE_LIMITS.maxTotalRounds,
    "Cone rounds",
  );
  const lines = ["Rnd 1: Magic ring, 6 sc. (6)"];
  let totalStitches = 6;

  for (let round = 2; round <= totalRounds; round += 1) {
    if (round % 2 === 0) {
      const stitchesBeforeEachIncrease = totalStitches / 6 - 1;
      totalStitches += 6;
      if (stitchesBeforeEachIncrease === 0) {
        lines.push(`Rnd ${round}: inc in each st around. (${totalStitches})`);
      } else {
        lines.push(`Rnd ${round}: *sc ${stitchesBeforeEachIncrease}, inc* x6. (${totalStitches})`);
      }
    } else {
      lines.push(`Rnd ${round}: sc in each st around. (${totalStitches})`);
    }
  }

  lines.push("Count reference ends at the open base; assess taper and finishing in a swatch.");
  return verifyLength(lines);
}

/** Build a six-increase base followed by the requested number of even rounds. */
export function generateCylinder(rounds, baseRounds) {
  const totalRounds = boundedInteger(
    rounds,
    AMIGURUMI_SHAPE_LIMITS.minTotalRounds,
    AMIGURUMI_SHAPE_LIMITS.maxTotalRounds,
    "Cylinder rounds",
  );
  const base = boundedInteger(
    baseRounds,
    AMIGURUMI_SHAPE_LIMITS.minBaseRounds,
    AMIGURUMI_SHAPE_LIMITS.maxBaseRounds,
    "Cylinder base rounds",
  );
  if (base > totalRounds) {
    throw new RangeError("Cylinder base rounds cannot exceed total rounds.");
  }

  const lines = [];
  for (let round = 1; round <= base; round += 1) {
    const total = 6 * round;
    if (round === 1) lines.push("Rnd 1: Magic ring, 6 sc. (6)");
    else if (round === 2) lines.push("Rnd 2: inc in each st around. (12)");
    else lines.push(`Rnd ${round}: *sc ${round - 2}, inc* x6. (${total})`);
  }

  const circumferenceStitches = 6 * base;
  for (let round = base + 1; round <= totalRounds; round += 1) {
    lines.push(`Rnd ${round}: sc in each st around. (${circumferenceStitches})`);
  }

  lines.push("Count reference leaves the top open; choose stuffing and closure separately.");
  return verifyLength(lines);
}

/**
 * Build a count-consistent oval start around both sides of a foundation chain.
 * Round 1 contains exactly twice the entered chain count. Later rounds add six
 * stitches, distributed as three increases around each end curve.
 */
export function generateOval(chainLength, expansionRounds) {
  const chain = boundedInteger(
    chainLength,
    AMIGURUMI_SHAPE_LIMITS.minOvalChain,
    AMIGURUMI_SHAPE_LIMITS.maxOvalChain,
    "Oval starting chain",
  );
  const rounds = boundedInteger(
    expansionRounds,
    AMIGURUMI_SHAPE_LIMITS.minOvalRounds,
    AMIGURUMI_SHAPE_LIMITS.maxOvalRounds,
    "Oval expansion rounds",
  );

  const roundOneTotal = 2 * chain;
  const lines = [
    `Ch ${chain}.`,
    `Rnd 1: Starting in 2nd ch, sc in next ${chain - 2} ch, 3 sc in last ch; working along underside, sc in next ${chain - 3} ch, 2 sc in first worked ch. (${roundOneTotal})`,
  ];

  let totalStitches = roundOneTotal;
  for (let round = 2; round <= rounds; round += 1) {
    totalStitches += 6;
    lines.push(`Rnd ${round}: Place 3 inc around each end curve (6 inc total); sc in every other st. (${totalStitches})`);
  }

  lines.push("Count reference ends after the selected expansion rounds; verify curve placement before adding height.");
  return verifyLength(lines);
}

export function generateAmigurumiShapePlan({
  shape,
  totalRounds,
  baseRounds,
  ovalChain,
  ovalRounds,
}) {
  try {
    let lines;
    if (shape === "sphere") lines = generateSphere(totalRounds);
    else if (shape === "cone") lines = generateCone(totalRounds);
    else if (shape === "cylinder") lines = generateCylinder(totalRounds, baseRounds);
    else if (shape === "oval") lines = generateOval(ovalChain, ovalRounds);
    else return { ok: false, error: "Choose a supported basic shape." };

    return {
      ok: true,
      shape,
      lines,
      numberedRounds: lines.filter((line) => /^Rnd \d+:/.test(line)).length,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to generate the count reference.",
    };
  }
}
