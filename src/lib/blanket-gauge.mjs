const CENTIMETERS_PER_INCH = 2.54;

/** Convert a populated form value while preserving blank or invalid input. */
export function convertBlanketMeasurementInput(value, factor) {
  if (!value.trim()) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  return String(Number((parsed * factor).toFixed(2)));
}

/**
 * Calculate blanket stitch and row counts from a gauge span.
 * Target dimensions stay in inches; metric gauge spans are normalized here.
 */
export function calculateBlanketGaugeCounts({
  widthIn,
  lengthIn,
  gaugeStitches,
  gaugeRows,
  gaugeOver,
  units,
}) {
  const values = [widthIn, lengthIn, gaugeStitches, gaugeRows, gaugeOver];
  const hasValidValues = values.every((value) => Number.isFinite(value) && value > 0);
  const hasValidUnits = units === "imperial" || units === "metric";

  if (!hasValidValues || !hasValidUnits) return null;

  const gaugeOverIn = units === "metric"
    ? gaugeOver / CENTIMETERS_PER_INCH
    : gaugeOver;

  return {
    stitches: Math.round(widthIn * (gaugeStitches / gaugeOverIn)),
    rows: Math.round(lengthIn * (gaugeRows / gaugeOverIn)),
  };
}

/** Preserve the calculator's nearest-repeat behavior for stitch patterns. */
export function roundBlanketStitchesToMultiple(stitches, multiple, extra) {
  let roundedStitches = stitches;

  if (multiple > 0 && stitches > 0) {
    const base = stitches - extra;
    roundedStitches = Math.round(base / multiple) * multiple + extra;
    if (roundedStitches <= 0) roundedStitches = multiple + extra;
  }

  return roundedStitches;
}
