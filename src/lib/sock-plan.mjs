export const SOCK_PLAN_LIMITS = Object.freeze({
  minimumCircumference: 1,
  maximumCircumference: 100,
  maximumGaugeStitches: 1_000,
  maximumGaugeSpan: 100,
  maximumEasePercent: 30,
  maximumMultiple: 100,
  maximumStitches: 10_000,
});

function invalid(error) {
  return { ok: false, error };
}

function finiteInRange(value, minimum, maximum) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

export function buildSockCircumferencePlan({
  footCircumference,
  easePercent,
  gaugeStitches,
  gaugeSpan,
  stitchMultiple,
}) {
  if (!finiteInRange(
    footCircumference,
    SOCK_PLAN_LIMITS.minimumCircumference,
    SOCK_PLAN_LIMITS.maximumCircumference,
  )) return invalid("Enter a supported positive foot circumference.");
  if (!finiteInRange(easePercent, 0, SOCK_PLAN_LIMITS.maximumEasePercent)) {
    return invalid(`Ease must be from 0 through ${SOCK_PLAN_LIMITS.maximumEasePercent} percent.`);
  }
  if (!finiteInRange(gaugeStitches, 0.01, SOCK_PLAN_LIMITS.maximumGaugeStitches)) {
    return invalid("Enter a supported positive stitch-gauge count.");
  }
  if (!finiteInRange(gaugeSpan, 0.01, SOCK_PLAN_LIMITS.maximumGaugeSpan)) {
    return invalid("Enter a supported positive gauge span.");
  }
  if (!Number.isSafeInteger(stitchMultiple) || stitchMultiple < 1 || stitchMultiple > SOCK_PLAN_LIMITS.maximumMultiple) {
    return invalid(`Stitch multiple must be a whole number from 1 through ${SOCK_PLAN_LIMITS.maximumMultiple}.`);
  }

  const stitchesPerInch = gaugeStitches / gaugeSpan;
  const targetCircumference = footCircumference * (1 - easePercent / 100);
  const rawStitches = targetCircumference * stitchesPerInch;
  const adjustedStitches = Math.round(rawStitches / stitchMultiple) * stitchMultiple;
  if (
    !Number.isFinite(rawStitches)
    || !Number.isSafeInteger(adjustedStitches)
    || adjustedStitches < stitchMultiple
    || adjustedStitches > SOCK_PLAN_LIMITS.maximumStitches
  ) return invalid("These inputs do not produce a supported whole-stitch checkpoint.");

  const modeledCircumference = adjustedStitches / stitchesPerInch;
  const effectiveEasePercent = (1 - modeledCircumference / footCircumference) * 100;
  return {
    ok: true,
    stitchesPerInch,
    targetCircumference,
    rawStitches,
    adjustedStitches,
    stitchMultiple,
    modeledCircumference,
    effectiveEasePercent,
    halfRoundStitches: adjustedStitches % 2 === 0 ? adjustedStitches / 2 : null,
  };
}
