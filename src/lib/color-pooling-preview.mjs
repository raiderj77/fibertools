export const COLOR_POOLING_LIMITS = Object.freeze({
  minColors: 2,
  maxColors: 10,
  maxStitchesPerColor: 100,
  maxRepeatStitches: 400,
  minRows: 2,
  maxRows: 30,
  minAdjustment: -20,
  maxAdjustment: 20,
  maxCells: 12_000,
});

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function integer(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function invalid(error) {
  return { ok: false, error };
}

/**
 * Build an idealized stitch-placement grid from measured color-section counts.
 * No chain/turning-chain consumption is assumed. A turned row consumes the yarn
 * sequence continuously but places its first worked stitch at the right edge.
 */
export function buildColorPoolingPreview({
  sections,
  rowAdjustment,
  previewRows,
  rowMode,
}) {
  if (!Array.isArray(sections)) return invalid("Color sections are required.");
  if (
    sections.length < COLOR_POOLING_LIMITS.minColors ||
    sections.length > COLOR_POOLING_LIMITS.maxColors
  ) {
    return invalid(`Use ${COLOR_POOLING_LIMITS.minColors}–${COLOR_POOLING_LIMITS.maxColors} color sections.`);
  }

  const parsedSections = [];
  for (const section of sections) {
    const stitches = integer(section?.stitches);
    if (
      stitches === null ||
      stitches < 1 ||
      stitches > COLOR_POOLING_LIMITS.maxStitchesPerColor
    ) {
      return invalid(`Each color section must contain 1–${COLOR_POOLING_LIMITS.maxStitchesPerColor} whole stitches.`);
    }
    if (typeof section?.hex !== "string" || !HEX_COLOR.test(section.hex)) {
      return invalid("Each color needs a six-digit hex color.");
    }
    parsedSections.push({ hex: section.hex.toUpperCase(), stitches });
  }

  const totalRepeat = parsedSections.reduce((sum, section) => sum + section.stitches, 0);
  if (totalRepeat > COLOR_POOLING_LIMITS.maxRepeatStitches) {
    return invalid(`The measured repeat must be ${COLOR_POOLING_LIMITS.maxRepeatStitches} stitches or fewer.`);
  }

  const adjustment = integer(rowAdjustment);
  if (
    adjustment === null ||
    adjustment < COLOR_POOLING_LIMITS.minAdjustment ||
    adjustment > COLOR_POOLING_LIMITS.maxAdjustment
  ) {
    return invalid(`Row adjustment must be a whole number from ${COLOR_POOLING_LIMITS.minAdjustment} to +${COLOR_POOLING_LIMITS.maxAdjustment}.`);
  }

  const rows = integer(previewRows);
  if (rows === null || rows < COLOR_POOLING_LIMITS.minRows || rows > COLOR_POOLING_LIMITS.maxRows) {
    return invalid(`Preview rows must be a whole number from ${COLOR_POOLING_LIMITS.minRows} to ${COLOR_POOLING_LIMITS.maxRows}.`);
  }

  if (rowMode !== "turned" && rowMode !== "same-direction") {
    return invalid("Choose a supported row direction.");
  }

  const rowWidth = totalRepeat + adjustment;
  if (rowWidth < 1 || rowWidth > COLOR_POOLING_LIMITS.maxRepeatStitches) {
    return invalid(`The adjusted row width must be 1–${COLOR_POOLING_LIMITS.maxRepeatStitches} stitches.`);
  }
  if (rowWidth * rows > COLOR_POOLING_LIMITS.maxCells) {
    return invalid(`The preview is limited to ${COLOR_POOLING_LIMITS.maxCells.toLocaleString()} cells.`);
  }

  const colorRepeat = parsedSections.flatMap((section) =>
    Array.from({ length: section.stitches }, () => section.hex),
  );
  const grid = [];
  const rowDirections = [];
  const rowStartOffsets = [];
  let consumed = 0;

  for (let row = 0; row < rows; row += 1) {
    const direction = rowMode === "turned" && row % 2 === 1 ? "right-to-left" : "left-to-right";
    const rowData = Array(rowWidth);
    rowStartOffsets.push(consumed % totalRepeat);
    rowDirections.push(direction);

    for (let workedStitch = 0; workedStitch < rowWidth; workedStitch += 1) {
      const color = colorRepeat[(consumed + workedStitch) % totalRepeat];
      const displayColumn = direction === "right-to-left"
        ? rowWidth - 1 - workedStitch
        : workedStitch;
      rowData[displayColumn] = color;
    }

    grid.push(rowData);
    consumed += rowWidth;
  }

  return {
    ok: true,
    totalRepeat,
    rowWidth,
    rowAdjustment: adjustment,
    previewRows: rows,
    rowMode,
    rowDirections,
    rowStartOffsets,
    repeatShiftPerRow: rowWidth % totalRepeat,
    grid,
  };
}
