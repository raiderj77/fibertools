export function calculateGaugeResize({
  originalGaugeStitches,
  originalGaugeRows,
  actualGaugeStitches,
  actualGaugeRows,
  originalStitches,
  originalRows,
}) {
  const stitchRatio = actualGaugeStitches / originalGaugeStitches;
  const rowRatio =
    originalGaugeRows > 0 && actualGaugeRows > 0
      ? actualGaugeRows / originalGaugeRows
      : 1;

  return {
    stitchRatio,
    rowRatio,
    resizedStitches:
      originalStitches > 0 ? Math.round(originalStitches * stitchRatio) : 0,
    resizedRows: originalRows > 0 ? Math.round(originalRows * rowRatio) : 0,
  };
}
