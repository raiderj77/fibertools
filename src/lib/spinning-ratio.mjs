/**
 * Calculate the ideal geometric ratio between a drive wheel and the pulley
 * connected to it by the drive band.
 *
 * @param {{ driveWheelDiameter: number, drivenPulleyDiameter: number }} inputs
 * @returns {{ status: "ready", ratio: number } | { status: "invalid", message: string }}
 */
export function calculateDriveRatio({ driveWheelDiameter, drivenPulleyDiameter }) {
  if (![driveWheelDiameter, drivenPulleyDiameter].every(Number.isFinite)) {
    return { status: "invalid", message: "Enter finite numeric diameters for both wheels." };
  }

  if (driveWheelDiameter <= 0 || drivenPulleyDiameter <= 0) {
    return { status: "invalid", message: "Both diameters must be greater than zero." };
  }

  const ratio = driveWheelDiameter / drivenPulleyDiameter;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return { status: "invalid", message: "These measurements do not produce a supported ratio." };
  }

  return { status: "ready", ratio };
}
