function isPositiveNumber(value) {
  return Number.isFinite(value) && value > 0;
}

function distribute(total, slots) {
  return Array.from(
    { length: slots },
    (_, index) => Math.floor(((index + 1) * total) / slots) - Math.floor((index * total) / slots),
  );
}

function formatPlain(prefix, count) {
  return count > 0 ? `${prefix}${count}` : "";
}

function formatChangeInstructions(gaps, plainPrefix, operation, target, shape) {
  if (shape === "round" && gaps.every((gap) => gap === gaps[0])) {
    const step = [formatPlain(plainPrefix, gaps[0]), operation].filter(Boolean).join(", ");
    return `*${step}* repeat ${gaps.length} times. (${target} sts)`;
  }

  const parts = [];
  for (let index = 0; index < gaps.length; index += 1) {
    const plain = formatPlain(plainPrefix, gaps[index]);
    if (plain) parts.push(plain);
    if (index < gaps.length - (shape === "row" ? 1 : 0)) parts.push(operation);
  }
  return `${parts.join(", ")}. (${target} sts)`;
}

export function calculateIncDec({ mode, shape, current, target }) {
  if (!Number.isInteger(current) || !Number.isInteger(target) || current <= 0 || target <= 0) {
    return { error: "Enter positive whole-number stitch counts." };
  }
  if (current === target) return { error: "Current and target stitch counts must be different." };
  if (mode === "increase" && target < current) {
    return { error: "Increase mode requires a target larger than the current count." };
  }
  if (mode === "decrease" && target > current) {
    return { error: "Decrease mode requires a target smaller than the current count." };
  }
  if (shape !== "row" && shape !== "round") return { error: "Choose flat-row or in-the-round shaping." };

  const isInc = mode === "increase";
  const changes = Math.abs(target - current);
  if (isInc && changes > current) {
    return { error: "This increase needs more than one new stitch per source stitch; work it over multiple passes." };
  }
  if (!isInc && changes * 2 > current) {
    return { error: "This decrease would consume more stitches than are available; work it over multiple passes." };
  }

  const gapCount = shape === "row" ? changes + 1 : changes;
  const knitPlain = isInc ? current : current - changes * 2;
  const crochetPlain = isInc ? current - changes : current - changes * 2;
  const knitGaps = distribute(knitPlain, gapCount);
  const crochetGaps = distribute(crochetPlain, gapCount);

  if (shape === "row" && (knitGaps[0] === 0 || knitGaps.at(-1) === 0 || crochetGaps[0] === 0 || crochetGaps.at(-1) === 0)) {
    return { error: "This flat-row change leaves no plain edge stitch; use an edge-specific method or multiple passes." };
  }

  const knitConsumed = knitGaps.reduce((sum, value) => sum + value, 0) + (isInc ? 0 : changes * 2);
  const crochetConsumed = crochetGaps.reduce((sum, value) => sum + value, 0) + (isInc ? changes : changes * 2);
  const knitProduced = knitConsumed + (isInc ? changes : -changes);
  const crochetProduced = crochetConsumed + (isInc ? changes : -changes);
  if (knitConsumed !== current || crochetConsumed !== current || knitProduced !== target || crochetProduced !== target) {
    return { error: "The requested shaping could not be balanced exactly." };
  }

  const allGaps = [...knitGaps, ...crochetGaps];
  return {
    isInc,
    changes,
    current,
    target,
    spacingMin: Math.min(...allGaps),
    spacingMax: Math.max(...allGaps),
    segments: knitGaps,
    knitGaps,
    crochetGaps,
    knitConsumed,
    crochetConsumed,
    knitProduced,
    crochetProduced,
    knitInstructions: formatChangeInstructions(
      knitGaps,
      "K",
      isInc ? "M1" : "k2tog",
      target,
      shape,
    ),
    crochetInstructions: formatChangeInstructions(
      crochetGaps,
      "SC ",
      isInc ? "2 SC in next st" : "SC2tog",
      target,
      shape,
    ),
  };
}

function nearestModulo(value, modulo, remainder, minimum = 1) {
  const normalizedRemainder = ((remainder % modulo) + modulo) % modulo;
  const lower = Math.floor((value - normalizedRemainder) / modulo) * modulo + normalizedRemainder;
  const upper = lower + modulo;
  const candidates = [lower, upper].filter((candidate) => candidate >= minimum);
  return candidates.sort((a, b) => Math.abs(a - value) - Math.abs(b - value) || a - b)[0];
}

export function resizePatternCount({ originalCount, originalGauge, actualGauge }) {
  if (![originalCount, originalGauge, actualGauge].every(isPositiveNumber)) return 0;
  return Math.round(originalCount * (actualGauge / originalGauge));
}

export function effectiveFabricCount({ fabricCount, overTwo, supportsOverTwo }) {
  if (!isPositiveNumber(fabricCount)) return 0;
  return overTwo && supportsOverTwo ? fabricCount / 2 : fabricCount;
}

export function calculateCrossStitchFloss({
  stitches,
  strands,
  inchesPerStitch = 1.1,
}) {
  if (
    !Number.isInteger(stitches) || stitches <= 0 ||
    !Number.isInteger(strands) || strands <= 0 || strands > 6 ||
    !isPositiveNumber(inchesPerStitch)
  ) {
    return null;
  }

  const totalStrandInches = stitches * inchesPerStitch * strands;
  const totalStrandMeters = totalStrandInches * 0.0254;
  const strandMetersPerSkein = 8 * 6;
  const skeins = totalStrandMeters / strandMetersPerSkein;

  return {
    totalStrandInches: Math.round(totalStrandInches),
    totalStrandMeters: Number(totalStrandMeters.toFixed(1)),
    skeins: Number(skeins.toFixed(2)),
    skeinsRounded: Math.ceil(skeins),
  };
}

export function calculateRaglan({
  finishedChest,
  neckCircumference,
  targetYokeDepth,
  underarmEach,
  gaugeStitches,
  gaugeRows,
  gaugeOver,
  raglanLineStitches = 1,
  increaseInterval = 2,
}) {
  const values = [finishedChest, neckCircumference, targetYokeDepth, gaugeStitches, gaugeRows, gaugeOver];
  if (!values.every(isPositiveNumber) || !Number.isInteger(underarmEach) || underarmEach < 0) {
    return { error: "Enter positive measurements and gauge, plus a non-negative whole underarm stitch count." };
  }
  if (!Number.isInteger(raglanLineStitches) || raglanLineStitches < 1 || !Number.isInteger(increaseInterval) || increaseInterval < 1) {
    return { error: "Raglan line stitches and increase interval must be positive whole numbers." };
  }

  const stitchesPerInch = gaugeStitches / gaugeOver;
  const rowsPerInch = gaugeRows / gaugeOver;
  const raglanSeamSts = raglanLineStitches * 4;
  const neckRaw = neckCircumference * stitchesPerInch;
  const castOn = nearestModulo(neckRaw, 4, raglanSeamSts, raglanSeamSts + 4);
  const available = castOn - raglanSeamSts;
  const sleeveStsEach = Math.round(available / 6);
  const frontSts = (available - sleeveStsEach * 2) / 2;
  const backSts = frontSts;
  if (![frontSts, backSts, sleeveStsEach].every(Number.isInteger)) {
    return { error: "The neck cast-on could not be split symmetrically; adjust the neck measurement slightly." };
  }

  const bodyBase = frontSts + backSts + raglanLineStitches * 2;
  const rawBodyTarget = finishedChest * stitchesPerInch;
  const targetRemainder = bodyBase + underarmEach * 2;
  const bodyTarget = nearestModulo(rawBodyTarget, 4, targetRemainder, targetRemainder + 4);
  const numerator = bodyTarget - bodyBase - underarmEach * 2;
  if (numerator <= 0 || numerator % 4 !== 0) {
    return { error: "The entered neck and chest measurements do not leave room for standard raglan increases." };
  }

  const increaseRounds = numerator / 4;
  const yokeRows = increaseRounds * increaseInterval;
  const yokeDepth = yokeRows / rowsPerInch;
  const bodyAtSplit = bodyBase + increaseRounds * 4 + underarmEach * 2;
  const depthDifference = Math.abs(yokeDepth - targetYokeDepth);

  return {
    chestSts: bodyTarget,
    backSts,
    frontSts,
    sleeveStsEach,
    raglanSeamSts,
    castOn,
    increaseRounds,
    yokeRows,
    yokeDepth: Number(yokeDepth.toFixed(1)),
    targetYokeDepth,
    underarmEach,
    bodyAtSplit,
    stitchesPerInch: Number(stitchesPerInch.toFixed(2)),
    warning: depthDifference > 0.5
      ? `The calculated yoke depth is ${yokeDepth.toFixed(1)} inches, which differs from your target by ${depthDifference.toFixed(1)} inches. Adjust neck, chest, gauge, or increase spacing before casting on.`
      : null,
  };
}

export function calculateSleeve({ upperArm, wrist, length, cuffRibbing, stitchesPerInch, rowsPerInch }) {
  const values = [upperArm, wrist, length, stitchesPerInch, rowsPerInch];
  if (!values.every(isPositiveNumber) || !Number.isFinite(cuffRibbing) || cuffRibbing < 0) {
    return { error: "Enter positive sleeve measurements and gauge." };
  }
  if (upperArm <= wrist) return { error: "Upper-arm circumference must be larger than wrist circumference." };

  const upperArmSts = Math.round((upperArm * stitchesPerInch) / 2) * 2;
  const cuffSts = Math.round((wrist * stitchesPerInch) / 2) * 2;
  const stsToDecrease = upperArmSts - cuffSts;
  const decreaseEvents = stsToDecrease / 2;
  const shapingInches = length - cuffRibbing - 2;
  const shapingRows = Math.round(shapingInches * rowsPerInch);

  if (decreaseEvents < 1 || shapingInches <= 0 || shapingRows < 1) {
    return { error: "The measurements do not leave a positive sleeve-shaping section." };
  }
  const rightSideRows = Math.ceil(shapingRows / 2);
  if (decreaseEvents > rightSideRows) {
    return { error: "This taper needs more paired decrease events than available right-side shaping rows. Increase sleeve length or reduce the stitch difference." };
  }

  const schedule = Array.from({ length: decreaseEvents }, (_, index) => {
    const slotIndex = Math.max(
      0,
      Math.round(((index + 1) * rightSideRows) / decreaseEvents) - 1,
    );
    return slotIndex * 2 + 1;
  });
  const intervals = schedule.map((row, index) => row - (schedule[index - 1] || 0));

  return {
    upperArmSts,
    cuffSts,
    stsToDecrease,
    decreaseEvents,
    shapingRows,
    intervals,
    schedule,
    everyNRows: Math.min(...intervals),
    instruction: `Decrease 1 stitch at each edge on right-side shaping rows ${schedule.join(", ")}.`,
  };
}

function nearestMultipleOfFour(value) {
  return Math.round(value / 4) * 4;
}

export function calculateSock({ footCircumference, footLength, gaugeStitches, gaugeRows, gaugeOver = 4 }) {
  const values = [footCircumference, footLength, gaugeStitches, gaugeRows, gaugeOver];
  if (!values.every(isPositiveNumber)) return { error: "Enter positive foot measurements and gauge." };

  const stitchesPerInch = gaugeStitches / gaugeOver;
  const rowsPerInch = gaugeRows / gaugeOver;
  const targetCirc = footCircumference * 0.9;
  const totalSts = nearestMultipleOfFour(targetCirc * stitchesPerInch);
  if (totalSts < 8) return { error: "These inputs produce fewer than 8 sock stitches; check the measurement and gauge." };

  const toeEndSts = Math.max(4, nearestMultipleOfFour(totalSts / 3));
  if (toeEndSts >= totalSts || (totalSts - toeEndSts) % 4 !== 0) {
    return { error: "These inputs do not leave room for a standard four-stitch wedge-toe shaping round." };
  }

  const toeShapeRounds = (totalSts - toeEndSts) / 4;
  const toePlainRounds = Math.max(0, toeShapeRounds - 1);
  const toeRows = toeShapeRounds + toePlainRounds;
  const toeLength = toeRows / rowsPerInch;
  if (footLength <= toeLength) return { error: "Foot length must be greater than the calculated toe length." };

  const heelStitches = totalSts / 2;
  const heelFlapRows = heelStitches;
  const gussetPickup = Math.floor(heelFlapRows / 2);
  const shortRowsEachSide = Math.floor(heelStitches / 3);
  const heelCenterSts = heelStitches - shortRowsEachSide * 2;
  const heelDepth = heelStitches / (2 * rowsPerInch);
  const footRowsBeforeToe = Math.round((footLength - heelDepth - toeLength) * rowsPerInch);
  if (footRowsBeforeToe < 0) {
    return { error: "Foot length is too short for the calculated toe and heel at this gauge." };
  }
  const plainRowsAfterToe = footRowsBeforeToe;
  const heelStartTotalRows = toeRows + plainRowsAfterToe;

  return {
    totalSts,
    castOn: totalSts,
    targetCirc: Number(targetCirc.toFixed(1)),
    heelStitches,
    heelFlapRows,
    gussetPickup,
    toeEndSts,
    toeStartPerNeedle: toeEndSts / 2,
    toeShapeRounds,
    toeIncreaseRounds: toeShapeRounds,
    toePlainRounds,
    toeRows,
    toeLength: Number(toeLength.toFixed(2)),
    footRowsBeforeToe,
    footRows: footRowsBeforeToe,
    heelCenterSts,
    shortRowsEachSide,
    heelDepth: Number(heelDepth.toFixed(1)),
    heelStartTotalRows,
    plainRowsAfterToe,
  };
}
