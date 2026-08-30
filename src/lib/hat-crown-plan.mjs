export const HAT_CROWN_SECTIONS = 8;
export const MIN_HAT_CROWN_STITCHES = HAT_CROWN_SECTIONS * 2;
export const MAX_HAT_CROWN_STITCHES = 2048;

export function roundHatCastOnToSections(rawCastOn) {
  if (!Number.isFinite(rawCastOn) || rawCastOn <= 0) {
    return { status: "invalid", message: "The raw cast-on must be a positive finite number." };
  }

  const castOn = Math.round(rawCastOn / HAT_CROWN_SECTIONS) * HAT_CROWN_SECTIONS;
  if (!Number.isSafeInteger(castOn)) {
    return { status: "invalid", message: "The rounded cast-on is outside the supported range." };
  }

  return { status: "ready", rawCastOn, castOn };
}

/**
 * Build one bounded, eight-section, bottom-up knitted crown reference.
 * Each modeled decrease consumes every current stitch exactly once and removes
 * one stitch from each of the eight sections.
 *
 * @param {number} castOn
 * @returns {
 *   | { status: "ready", castOn: number, finalStitches: number, decreaseRoundCount: number,
 *       decreaseSteps: Array<{ roundNumber: number, beforeStitches: number, afterStitches: number,
 *         knitBeforeDecrease: number, instruction: string }>, schedule: string[] }
 *   | { status: "invalid", message: string }
 * }
 */
export function planEightSectionHatCrown(castOn) {
  if (!Number.isSafeInteger(castOn)) {
    return { status: "invalid", message: "The rounded cast-on must be a safe whole-number stitch count." };
  }

  if (castOn < MIN_HAT_CROWN_STITCHES || castOn > MAX_HAT_CROWN_STITCHES) {
    return {
      status: "invalid",
      message: `This eight-section reference supports ${MIN_HAT_CROWN_STITCHES} to ${MAX_HAT_CROWN_STITCHES} cast-on stitches.`,
    };
  }

  if (castOn % HAT_CROWN_SECTIONS !== 0) {
    return {
      status: "invalid",
      message: `The rounded cast-on must be divisible by ${HAT_CROWN_SECTIONS} for this eight-section reference.`,
    };
  }

  /** @type {Array<{ roundNumber: number, beforeStitches: number, afterStitches: number, knitBeforeDecrease: number, instruction: string }>} */
  const decreaseSteps = [];
  /** @type {string[]} */
  const schedule = [];
  let currentStitches = castOn;
  let roundNumber = 1;

  while (currentStitches > HAT_CROWN_SECTIONS) {
    const stitchesPerSection = currentStitches / HAT_CROWN_SECTIONS;
    const knitBeforeDecrease = stitchesPerSection - 2;
    const afterStitches = currentStitches - HAT_CROWN_SECTIONS;
    const repeat = knitBeforeDecrease > 0 ? `K${knitBeforeDecrease}, K2tog` : "K2tog";
    const instruction = `Round ${roundNumber}: *${repeat}* repeat ${HAT_CROWN_SECTIONS} times (${afterStitches} sts remain)`;

    decreaseSteps.push({
      roundNumber,
      beforeStitches: currentStitches,
      afterStitches,
      knitBeforeDecrease,
      instruction,
    });
    schedule.push(instruction);
    currentStitches = afterStitches;
    roundNumber += 1;

    if (currentStitches > HAT_CROWN_SECTIONS) {
      schedule.push(`Round ${roundNumber}: Knit even`);
      roundNumber += 1;
    }
  }

  schedule.push(
    `Cut yarn with the pattern-specified tail, thread through the remaining ${HAT_CROWN_SECTIONS} stitches, and finish as directed.`,
  );

  return {
    status: "ready",
    castOn,
    finalStitches: currentStitches,
    decreaseRoundCount: decreaseSteps.length,
    decreaseSteps,
    schedule,
  };
}
