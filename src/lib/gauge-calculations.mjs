const CENTIMETERS_PER_INCH = 2.54;

export const GAUGE_LIMITS = Object.freeze({
  maximumMeasurement: 1_000,
  maximumMeasurementInches: 1_000,
  maximumMeasurementCentimeters: 2_540,
  maximumGaugeCount: 1_000,
  maximumStandardGaugeCountPer4Inches: 1_000,
  maximumStandardGaugeCountPer10Centimeters: 984.252,
  maximumPatternCount: 10_000,
  maximumMultiple: 1_000,
  maximumExtra: 1_000,
});

export function getGaugeDisplayLimits(unitSystem) {
  if (unitSystem === "imperial") {
    return {
      maximumMeasurement: GAUGE_LIMITS.maximumMeasurementInches,
      maximumStandardGaugeCount: GAUGE_LIMITS.maximumStandardGaugeCountPer4Inches,
    };
  }
  if (unitSystem === "metric") {
    return {
      maximumMeasurement: GAUGE_LIMITS.maximumMeasurementCentimeters,
      maximumStandardGaugeCount: GAUGE_LIMITS.maximumStandardGaugeCountPer10Centimeters,
    };
  }
  return null;
}

function invalid(error) {
  return { ok: /** @type {false} */ (false), error };
}

function finiteInRange(value, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

function optionalPositiveGroup(values) {
  const populated = values.map((value) => value !== null && value !== undefined);
  return {
    complete: populated.every(Boolean),
    empty: populated.every((value) => !value),
  };
}

function validWholeNumber(value, maximum) {
  return Number.isSafeInteger(value) && value >= 0 && value <= maximum;
}

/** Convert a populated length field when the displayed measurement unit changes. */
export function convertGaugeMeasurementInput(value, fromUnits, toUnits) {
  if (fromUnits === toUnits || !value.trim()) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  const factor = fromUnits === "imperial" && toUnits === "metric"
    ? CENTIMETERS_PER_INCH
    : 1 / CENTIMETERS_PER_INCH;
  return String(Number((parsed * factor).toFixed(3)));
}

/** Convert a count stated per 4 inches to the equivalent count per 10 cm, or back. */
export function convertStandardGaugeInput(value, fromUnits, toUnits) {
  if (fromUnits === toUnits || !value.trim()) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  const fourInchesInCentimeters = 4 * CENTIMETERS_PER_INCH;
  const factor = fromUnits === "imperial" && toUnits === "metric"
    ? 10 / fourInchesInCentimeters
    : fourInchesInCentimeters / 10;
  return String(Number((parsed * factor).toFixed(3)));
}

export function calculateSwatchGauge({ width, height, stitches, rows, standardSpan, unitSystem = "imperial" }) {
  const displayLimits = getGaugeDisplayLimits(unitSystem);
  if (!displayLimits) return invalid("The selected measurement unit is not supported.");
  if (!finiteInRange(width, 0.01, displayLimits.maximumMeasurement)
    || !finiteInRange(height, 0.01, displayLimits.maximumMeasurement)) {
    return invalid("Enter supported positive swatch dimensions.");
  }
  if (!finiteInRange(stitches, 0.01, GAUGE_LIMITS.maximumGaugeCount)
    || !finiteInRange(rows, 0.01, GAUGE_LIMITS.maximumGaugeCount)) {
    return invalid("Enter supported positive stitch and row counts.");
  }
  if (!finiteInRange(standardSpan, 0.01, 100)) {
    return invalid("The standard gauge span is not supported.");
  }

  const stitchesPerUnit = stitches / width;
  const rowsPerUnit = rows / height;
  return {
    ok: /** @type {true} */ (true),
    stitchesPerUnit,
    rowsPerUnit,
    stitchesPerStandard: stitchesPerUnit * standardSpan,
    rowsPerStandard: rowsPerUnit * standardSpan,
    standardSpan,
  };
}

/** Return a whole count of the form multiple * n + extra. */
export function roundGaugeCountToRepeat({ count, multiple, extra, direction = "nearest" }) {
  if (!finiteInRange(count, 0.01, GAUGE_LIMITS.maximumPatternCount)) {
    return invalid("The calculated stitch count is outside the supported range.");
  }
  if (!validWholeNumber(multiple, GAUGE_LIMITS.maximumMultiple)
    || !validWholeNumber(extra, GAUGE_LIMITS.maximumExtra)) {
    return invalid("Repeat and extra values must be supported whole numbers.");
  }
  if (multiple === 0 && extra > 0) {
    return invalid("Enter a stitch multiple before entering extra stitches.");
  }
  if (!["nearest", "up"].includes(direction)) {
    return invalid("The repeat-rounding direction is not supported.");
  }

  if (multiple === 0) {
    const rounded = direction === "up" ? Math.ceil(count) : Math.round(count);
    return Number.isSafeInteger(rounded) && rounded > 0
      ? { ok: /** @type {true} */ (true), count: rounded, usedRepeat: false }
      : invalid("The stitch count does not produce a supported whole number.");
  }

  const minimumRepeats = 1;
  const rawRepeats = (count - extra) / multiple;
  const roundedRepeats = direction === "up"
    ? Math.ceil(rawRepeats)
    : Math.floor(rawRepeats + 0.5);
  const repeats = Math.max(minimumRepeats, roundedRepeats);
  const adjusted = repeats * multiple + extra;
  if (!Number.isSafeInteger(adjusted) || adjusted <= 0 || adjusted > GAUGE_LIMITS.maximumPatternCount) {
    return invalid("The repeat-adjusted count is outside the supported range.");
  }
  return { ok: /** @type {true} */ (true), count: adjusted, usedRepeat: true, repeats };
}

export function calculateGaugeResize({
  originalGaugeStitches,
  originalGaugeRows,
  actualGaugeStitches,
  actualGaugeRows,
  originalStitches,
  originalRows,
  originalWidth,
  originalHeight,
  stitchMultiple = 0,
  multipleExtra = 0,
  unitSystem = "imperial",
}) {
  const displayLimits = getGaugeDisplayLimits(unitSystem);
  if (!displayLimits) return invalid("The selected measurement unit is not supported.");
  const stitchGroup = optionalPositiveGroup([
    originalGaugeStitches,
    actualGaugeStitches,
    originalStitches,
  ]);
  const rowGroup = optionalPositiveGroup([
    originalGaugeRows,
    actualGaugeRows,
    originalRows,
  ]);

  if (!stitchGroup.complete && !stitchGroup.empty) {
    return invalid("Complete the pattern gauge, your gauge, and pattern count for stitches.");
  }
  if (!rowGroup.complete && !rowGroup.empty) {
    return invalid("Complete the pattern gauge, your gauge, and pattern count for rows.");
  }
  if (stitchGroup.empty && rowGroup.empty) {
    return invalid("Complete at least one stitch or row resize group.");
  }

  const hasOriginalWidth = originalWidth !== null && originalWidth !== undefined;
  const hasOriginalHeight = originalHeight !== null && originalHeight !== undefined;
  if (hasOriginalWidth && !finiteInRange(originalWidth, 0.01, displayLimits.maximumMeasurement)) {
    return invalid("Original width must be a supported positive measurement.");
  }
  if (hasOriginalHeight && !finiteInRange(originalHeight, 0.01, displayLimits.maximumMeasurement)) {
    return invalid("Original height must be a supported positive measurement.");
  }
  if (hasOriginalWidth && !stitchGroup.complete) {
    return invalid("Original width requires a complete stitch resize group.");
  }
  if (hasOriginalHeight && !rowGroup.complete) {
    return invalid("Original height requires a complete row resize group.");
  }

  if (stitchGroup.complete
    && (!finiteInRange(originalGaugeStitches, 0.01, displayLimits.maximumStandardGaugeCount)
      || !finiteInRange(actualGaugeStitches, 0.01, displayLimits.maximumStandardGaugeCount)
      || !Number.isSafeInteger(originalStitches)
      || originalStitches < 1
      || originalStitches > GAUGE_LIMITS.maximumPatternCount)) {
    return invalid("Stitch gauge and pattern count must be supported positive values, with a whole-number pattern count.");
  }
  if (rowGroup.complete
    && (!finiteInRange(originalGaugeRows, 0.01, displayLimits.maximumStandardGaugeCount)
      || !finiteInRange(actualGaugeRows, 0.01, displayLimits.maximumStandardGaugeCount)
      || !Number.isSafeInteger(originalRows)
      || originalRows < 1
      || originalRows > GAUGE_LIMITS.maximumPatternCount)) {
    return invalid("Row gauge and pattern count must be supported positive values, with a whole-number pattern count.");
  }

  if (!validWholeNumber(stitchMultiple, GAUGE_LIMITS.maximumMultiple)
    || !validWholeNumber(multipleExtra, GAUGE_LIMITS.maximumExtra)) {
    return invalid("Repeat and extra values must be supported whole numbers.");
  }
  if (stitchGroup.empty && (stitchMultiple !== 0 || multipleExtra !== 0)) {
    return invalid("Repeat rounding requires a complete stitch resize group.");
  }

  const stitchRatio = stitchGroup.complete
    ? actualGaugeStitches / originalGaugeStitches
    : null;
  const rowRatio = rowGroup.complete
    ? actualGaugeRows / originalGaugeRows
    : null;
  const proportionalStitches = stitchGroup.complete
    ? originalStitches * stitchRatio
    : null;
  const unadjustedStitches = proportionalStitches !== null
    ? Math.round(proportionalStitches)
    : null;
  const resizedRows = rowGroup.complete
    ? Math.round(originalRows * rowRatio)
    : null;
  const modeledWidth = hasOriginalWidth ? originalWidth / stitchRatio : null;
  const modeledHeight = hasOriginalHeight ? originalHeight / rowRatio : null;

  let resizedStitches = null;
  let repeatCount = null;
  if (proportionalStitches !== null) {
    const repeated = roundGaugeCountToRepeat({
      count: proportionalStitches,
      multiple: stitchMultiple,
      extra: multipleExtra,
      direction: "nearest",
    });
    if (!repeated.ok) return repeated;
    resizedStitches = repeated.count;
    repeatCount = repeated.usedRepeat ? repeated.repeats : null;
  } else if (stitchMultiple > 0 || multipleExtra > 0) {
    return invalid("Repeat rounding requires a complete stitch resize group.");
  }

  if ((resizedStitches !== null && resizedStitches > GAUGE_LIMITS.maximumPatternCount)
    || (resizedRows !== null && (!Number.isSafeInteger(resizedRows) || resizedRows < 1 || resizedRows > GAUGE_LIMITS.maximumPatternCount))) {
    return invalid("The resized count is outside the supported range.");
  }
  if ((modeledWidth !== null && !finiteInRange(modeledWidth, 0.01, displayLimits.maximumMeasurement))
    || (modeledHeight !== null && !finiteInRange(modeledHeight, 0.01, displayLimits.maximumMeasurement))) {
    return invalid("The modeled dimension is outside the supported range.");
  }

  return {
    ok: /** @type {true} */ (true),
    stitchRatio,
    rowRatio,
    proportionalStitches,
    unadjustedStitches,
    resizedStitches,
    resizedRows,
    repeatCount,
    originalWidth: hasOriginalWidth ? originalWidth : null,
    originalHeight: hasOriginalHeight ? originalHeight : null,
    modeledWidth,
    modeledHeight,
  };
}

export function calculateGaugeDimensionPlan({
  gaugeStitches,
  gaugeRows,
  gaugeSpan,
  targetWidth,
  targetHeight,
  stitchMultiple = 0,
  multipleExtra = 0,
  edgeStitches = 0,
  turningChains = 0,
  unitSystem = "imperial",
}) {
  const displayLimits = getGaugeDisplayLimits(unitSystem);
  if (!displayLimits) return invalid("The selected measurement unit is not supported.");
  if (!finiteInRange(gaugeStitches, 0.01, GAUGE_LIMITS.maximumGaugeCount)
    || !finiteInRange(gaugeSpan, 0.01, displayLimits.maximumMeasurement)
    || !finiteInRange(targetWidth, 0.01, displayLimits.maximumMeasurement)) {
    return invalid("Enter a supported stitch gauge, gauge span, and target width.");
  }

  const rowGroup = optionalPositiveGroup([gaugeRows, targetHeight]);
  if (!rowGroup.complete && !rowGroup.empty) {
    return invalid("Enter both row gauge and target height, or leave both blank.");
  }
  if (rowGroup.complete
    && (!finiteInRange(gaugeRows, 0.01, GAUGE_LIMITS.maximumGaugeCount)
      || !finiteInRange(targetHeight, 0.01, displayLimits.maximumMeasurement))) {
    return invalid("Row gauge or target height is outside the supported range.");
  }
  if (!validWholeNumber(edgeStitches, GAUGE_LIMITS.maximumExtra)
    || !validWholeNumber(turningChains, GAUGE_LIMITS.maximumExtra)) {
    return invalid("Edge stitches and turning chains must be supported whole numbers.");
  }

  const stitchesPerUnit = gaugeStitches / gaugeSpan;
  const rawStitches = targetWidth * stitchesPerUnit;
  const repeated = roundGaugeCountToRepeat({
    count: rawStitches,
    multiple: stitchMultiple,
    extra: multipleExtra,
    direction: "up",
  });
  if (!repeated.ok) return repeated;

  const rowsPerUnit = rowGroup.complete ? gaugeRows / gaugeSpan : null;
  const rows = rowGroup.complete ? Math.ceil(targetHeight * rowsPerUnit) : null;
  const totalCastOn = repeated.count + edgeStitches;
  const foundationChain = repeated.count + turningChains;
  if (![totalCastOn, foundationChain].every(Number.isSafeInteger)
    || totalCastOn > GAUGE_LIMITS.maximumPatternCount
    || foundationChain > GAUGE_LIMITS.maximumPatternCount
    || (rows !== null && (!Number.isSafeInteger(rows) || rows > GAUGE_LIMITS.maximumPatternCount))) {
    return invalid("The planned count is outside the supported range.");
  }

  return {
    ok: /** @type {true} */ (true),
    stitchesPerUnit,
    rowsPerUnit,
    rawStitches,
    stitches: repeated.count,
    rows,
    repeatCount: repeated.usedRepeat ? repeated.repeats : null,
    modeledWidth: repeated.count / stitchesPerUnit,
    totalCastOn,
    foundationChain,
  };
}
