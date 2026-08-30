/**
 * @typedef {Object} SleevePlanInputs
 * @property {number} upperArmCircumference
 * @property {number} wristCircumference
 * @property {number} sleeveLength
 * @property {number} cuffLength
 * @property {number} stitchesPerInch
 * @property {number} rowsPerInch
 */

/**
 * @typedef {Object} ReadySleevePlan
 * @property {"ready"} status
 * @property {number} upperArmSts
 * @property {number} cuffSts
 * @property {number} stsToDecrease
 * @property {number} decreaseEvents
 * @property {number} shapingRows
 * @property {number} everyNRows
 * @property {number} remainder
 * @property {string} instruction
 */

/**
 * @typedef {Object} UnsupportedSleevePlan
 * @property {"unsupported"} status
 * @property {string} message
 * @property {number} [upperArmSts]
 * @property {number} [cuffSts]
 * @property {number} [stsToDecrease]
 * @property {number} [decreaseEvents]
 * @property {number} [shapingRows]
 */

/**
 * @typedef {Object} InvalidSleevePlan
 * @property {"invalid"} status
 * @property {string} message
 */

/**
 * @param {SleevePlanInputs} inputs
 * @returns {ReadySleevePlan | UnsupportedSleevePlan | InvalidSleevePlan}
 */
export function planSleeveTaper({
  upperArmCircumference,
  wristCircumference,
  sleeveLength,
  cuffLength,
  stitchesPerInch,
  rowsPerInch,
}) {
  const inputs = [
    upperArmCircumference,
    wristCircumference,
    sleeveLength,
    cuffLength,
    stitchesPerInch,
    rowsPerInch,
  ];

  if (!inputs.every(Number.isFinite)) {
    return { status: "invalid", message: "Enter finite numeric values for every field." };
  }

  if (
    upperArmCircumference <= 0
    || wristCircumference <= 0
    || sleeveLength <= 0
    || cuffLength < 0
    || stitchesPerInch <= 0
    || rowsPerInch <= 0
  ) {
    return {
      status: "invalid",
      message: "Enter positive measurements and gauge. Cuff length may be zero but cannot be negative.",
    };
  }

  if (upperArmCircumference <= wristCircumference) {
    return {
      status: "invalid",
      message: "The upper-arm circumference must be larger than the wrist circumference for this taper model.",
    };
  }

  const upperArmSts = Math.round(upperArmCircumference * stitchesPerInch);
  const cuffSts = Math.round(wristCircumference * stitchesPerInch);
  const stsToDecrease = upperArmSts - cuffSts;

  if (!Number.isSafeInteger(upperArmSts) || !Number.isSafeInteger(cuffSts)) {
    return {
      status: "invalid",
      message: "The derived stitch counts are outside the calculator's supported whole-number range.",
    };
  }

  if (upperArmSts <= cuffSts) {
    return {
      status: "invalid",
      message: "These measurements do not produce a larger upper-arm stitch count than cuff stitch count.",
    };
  }

  if (stsToDecrease % 2 !== 0) {
    return {
      status: "unsupported",
      upperArmSts,
      cuffSts,
      stsToDecrease,
      message: `The rounded counts differ by ${stsToDecrease} stitches. Paired decreases remove two stitches per event and cannot reach the displayed cuff count exactly. Compare a same-parity cuff count with the selected pattern instead of silently changing the target.`,
    };
  }

  const decreaseEvents = stsToDecrease / 2;

  const shapingInches = sleeveLength - cuffLength - 2;
  if (shapingInches <= 0) {
    return {
      status: "invalid",
      message: "Sleeve length must exceed the entered cuff plus this model's two fixed one-inch exclusions.",
    };
  }

  const shapingRows = Math.round(shapingInches * rowsPerInch);
  if (!Number.isSafeInteger(shapingRows) || shapingRows <= 0) {
    return {
      status: "invalid",
      message: "The available shaping zone and row gauge must produce a supported positive whole-row count.",
    };
  }

  const shared = {
    upperArmSts,
    cuffSts,
    stsToDecrease,
    decreaseEvents,
    shapingRows,
  };

  if (decreaseEvents > shapingRows) {
    return {
      status: "unsupported",
      ...shared,
      message: `This paired-decrease model needs ${decreaseEvents} decrease rows but only ${shapingRows} shaping rows are available. Use a tested pattern or revise the inputs; the calculator will not generate a zero-row interval.`,
    };
  }

  const everyNRows = Math.floor(shapingRows / decreaseEvents);
  const remainder = shapingRows % decreaseEvents;
  const shorterIntervalEvents = decreaseEvents - remainder;
  const shorterIntervalUnit = everyNRows === 1 ? "row" : "rows";

  const instruction = remainder === 0
    ? `Allocate the modeled shaping span as ${decreaseEvents} blocks of ${everyNRows} ${shorterIntervalUnit} for ${decreaseEvents} paired-decrease events.`
    : `Allocate the modeled shaping span as ${shorterIntervalEvents} blocks of ${everyNRows} ${shorterIntervalUnit} and ${remainder} blocks of ${everyNRows + 1} rows for ${decreaseEvents} paired-decrease events.`;

  return {
    status: "ready",
    ...shared,
    everyNRows,
    remainder,
    instruction,
  };
}
