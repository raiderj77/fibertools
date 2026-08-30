const AXES = [
  ["width", "Width", "currentWidth", "targetWidth"],
  ["length", "Length", "currentLength", "targetLength"],
];

/**
 * Calculate requested signed dimension changes without predicting what a
 * fabric or finishing method will achieve.
 *
 * Blank axes must be represented by null. A partly completed axis is invalid.
 *
 * @param {{
 *   currentWidth: number | null,
 *   targetWidth: number | null,
 *   currentLength: number | null,
 *   targetLength: number | null,
 * }} inputs
 * @returns {{
 *   status: "ready",
 *   changes: Array<{
 *     axis: "width" | "length",
 *     label: string,
 *     current: number,
 *     target: number,
 *     percentChange: number,
 *     direction: "increase" | "decrease" | "no change",
 *   }>,
 * } | { status: "invalid", message: string }}
 */
export function calculateBlockingDimensions(inputs) {
  const changes = [];

  for (const [axis, label, currentKey, targetKey] of AXES) {
    const current = inputs[currentKey];
    const target = inputs[targetKey];
    const currentMissing = current === null;
    const targetMissing = target === null;

    if (currentMissing && targetMissing) continue;

    if (currentMissing || targetMissing) {
      return {
        status: "invalid",
        message: `Enter both the current and target ${axis}, or leave both ${axis} fields blank.`,
      };
    }

    if (!Number.isFinite(current) || !Number.isFinite(target) || current <= 0 || target <= 0) {
      return {
        status: "invalid",
        message: `${label} measurements must be finite numbers greater than zero.`,
      };
    }

    const percentChange = ((target - current) / current) * 100;
    changes.push({
      axis,
      label,
      current,
      target,
      percentChange,
      direction: percentChange > 0 ? "increase" : percentChange < 0 ? "decrease" : "no change",
    });
  }

  if (changes.length === 0) {
    return {
      status: "invalid",
      message: "Enter a current and target width, length, or both.",
    };
  }

  return { status: "ready", changes };
}
