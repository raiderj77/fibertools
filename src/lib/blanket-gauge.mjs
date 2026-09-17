const CENTIMETERS_PER_INCH = 2.54;

/** Additional explanations only: never recompute or replace the baseline count. */
export function planBlanketStitchWidths({ raw, stitchesPerInch, nearest, multiple, extra }) {
  if (![raw, stitchesPerInch].every((v) => Number.isFinite(v) && v > 0)
    || !Number.isSafeInteger(nearest) || nearest < 1 || nearest > 1_000_000
    || ![multiple, extra].every((v) => Number.isSafeInteger(v) && v >= 0 && v <= 1_000_000)
    || (multiple === 0 && extra !== 0)) return null;
  // Only absorb machine roundoff, not display rounding or a user-sized epsilon.
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(raw)) * 8;
  let atOrAbove = null;
  if (multiple > 0) {
    const repeats = Math.max(1, Math.ceil((raw - extra - tolerance) / multiple));
    const candidate = repeats * multiple + extra;
    if (Number.isSafeInteger(candidate) && candidate <= 1_000_000 && candidate >= raw - tolerance) atOrAbove = candidate;
  }
  return { nearest, atOrAbove, nearestWidthIn: nearest / stitchesPerInch,
    aboveWidthIn: atOrAbove === null ? null : atOrAbove / stitchesPerInch,
    belowTarget: nearest < raw - tolerance, raw };
}

export function formatBlanketDimension(inches, units) {
  return String(Number((inches * (units === "metric" ? 2.54 : 1)).toFixed(4)));
}

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

  const result = {
    stitches: Math.round(widthIn * (gaugeStitches / gaugeOverIn)),
    rows: Math.round(lengthIn * (gaugeRows / gaugeOverIn)),
  };
  return Object.values(result).every((count) => Number.isSafeInteger(count) && count > 0 && count <= 1_000_000)
    ? result : null;
}

/** Preserve the calculator's nearest-repeat behavior for stitch patterns. */
export function roundBlanketStitchesToMultiple(stitches, multiple, extra) {
  if (![stitches, multiple, extra].every((value) => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000)
    || (multiple === 0 && extra > 0)) return null;
  let roundedStitches = stitches;

  if (multiple > 0 && stitches > 0) {
    const base = stitches - extra;
    roundedStitches = Math.max(1, Math.round(base / multiple)) * multiple + extra;
    if (roundedStitches <= 0) roundedStitches = multiple + extra;
  }

  return roundedStitches <= 1_000_000 ? roundedStitches : null;
}
