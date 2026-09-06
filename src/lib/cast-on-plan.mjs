export const CAST_ON_LIMITS = Object.freeze({ maximumWidth: 1000, maximumGaugeStitches: 1000, maximumGaugeSpan: 100, maximumMultiple: 1000, maximumStitches: 10000 });

/** Inches throughout. No pattern offsets or selvedges are added. */
export function buildCastOnPlan({ desiredWidth, gaugeStitches, gaugeInches, stitchMultiple }) {
  const fields = [desiredWidth, gaugeStitches, gaugeInches];
  if (fields.some((value) => (typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && value.trim() === ''))) return { ok: /** @type {false} */ (false), error: 'Enter width and both gauge measurements.' };
  const [width, gauge, span] = fields.map(Number);
  if (![width, gauge, span].every(Number.isFinite) || width <= 0 || width > CAST_ON_LIMITS.maximumWidth || gauge <= 0 || gauge > CAST_ON_LIMITS.maximumGaugeStitches || span <= 0 || span > CAST_ON_LIMITS.maximumGaugeSpan) return { ok: /** @type {false} */ (false), error: 'Enter positive finite measurements: width up to 1,000 inches, gauge up to 1,000 stitches over at most 100 inches.' };
  if (typeof stitchMultiple !== 'string' && typeof stitchMultiple !== 'number') return { ok: /** @type {false} */ (false), error: 'Leave the multiple blank or enter a supported whole number.' };
  const hasMultiple = !(typeof stitchMultiple === 'string' && stitchMultiple.trim() === '');
  const multiple = hasMultiple ? Number(stitchMultiple) : 1;
  if (!Number.isSafeInteger(multiple) || multiple < 1 || multiple > CAST_ON_LIMITS.maximumMultiple) return { ok: /** @type {false} */ (false), error: 'Leave the multiple blank or enter a whole number from 1 through 1,000.' };
  const stsPerInch = gauge / span;
  const rawCastOn = width * stsPerInch;
  // Absorb binary roundoff at exact whole-repeat boundaries only.
  const repeats = rawCastOn / multiple;
  const epsilon = Number.EPSILON * Math.max(1, Math.abs(repeats)) * 8;
  const roundedCastOn = hasMultiple ? Math.ceil(repeats - epsilon) * multiple : Math.round(rawCastOn);
  if (!Number.isSafeInteger(roundedCastOn) || roundedCastOn < 1 || roundedCastOn > CAST_ON_LIMITS.maximumStitches) return { ok: /** @type {false} */ (false), error: 'These inputs must produce from 1 through 10,000 cast-on stitches.' };
  return { ok: /** @type {true} */ (true), stsPerInch, rawCastOn, roundedCastOn, hasMultiple, actualWidth: roundedCastOn / stsPerInch };
}
