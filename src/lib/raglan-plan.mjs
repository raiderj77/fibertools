export const RAGLAN_CHECKPOINT_LIMITS = Object.freeze({
  minimumCircumference: 5,
  maximumCircumference: 150,
  maximumGaugeStitches: 1_000,
  maximumGaugeSpan: 100,
  maximumMultiple: 100,
  maximumStitches: 10_000,
});

function invalid(error) {
  return { ok: false, error };
}

function finiteInRange(value, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

export function buildRaglanBodyCheckpoint({
  finishedBodyCircumference,
  gaugeStitches,
  gaugeSpan,
  stitchMultiple,
}) {
  if (!finiteInRange(
    finishedBodyCircumference,
    RAGLAN_CHECKPOINT_LIMITS.minimumCircumference,
    RAGLAN_CHECKPOINT_LIMITS.maximumCircumference,
  )) return invalid("Enter a supported positive finished-body circumference.");
  if (!finiteInRange(gaugeStitches, 0.01, RAGLAN_CHECKPOINT_LIMITS.maximumGaugeStitches)) {
    return invalid("Enter a supported positive stitch-gauge count.");
  }
  if (!finiteInRange(gaugeSpan, 0.01, RAGLAN_CHECKPOINT_LIMITS.maximumGaugeSpan)) {
    return invalid("Enter a supported positive gauge span.");
  }
  if (!Number.isSafeInteger(stitchMultiple) || stitchMultiple < 1 || stitchMultiple > RAGLAN_CHECKPOINT_LIMITS.maximumMultiple) {
    return invalid(`Stitch multiple must be a whole number from 1 through ${RAGLAN_CHECKPOINT_LIMITS.maximumMultiple}.`);
  }

  const stitchesPerInch = gaugeStitches / gaugeSpan;
  const rawBodyStitches = finishedBodyCircumference * stitchesPerInch;
  const bodyStitches = Math.round(rawBodyStitches / stitchMultiple) * stitchMultiple;
  if (
    !Number.isFinite(rawBodyStitches)
    || !Number.isSafeInteger(bodyStitches)
    || bodyStitches < stitchMultiple
    || bodyStitches > RAGLAN_CHECKPOINT_LIMITS.maximumStitches
  ) return invalid("These inputs do not produce a supported whole-stitch checkpoint.");

  return {
    ok: true,
    stitchesPerInch,
    rawBodyStitches,
    bodyStitches,
    stitchMultiple,
    modeledBodyCircumference: bodyStitches / stitchesPerInch,
  };
}
