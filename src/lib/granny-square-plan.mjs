export const MAX_GRANNY_DIMENSION_INCHES = 10_000;
export const MAX_GRANNY_SQUARES_PER_AXIS = 10_000;
export const MAX_GRANNY_TOTAL_SQUARES = 1_000_000;
export const MAX_GRANNY_COLORS = 1_000;
export const MAX_GRANNY_YARDS_PER_SQUARE = 1_000_000;

export const COMMON_GRANNY_BLANKET_TARGETS = [
  { label: "Lovey", widthInches: 12, heightInches: 12 },
  { label: "Baby", widthInches: 30, heightInches: 36 },
  { label: "Stroller", widthInches: 36, heightInches: 48 },
  { label: "Throw", widthInches: 50, heightInches: 60 },
  { label: "Twin", widthInches: 66, heightInches: 90 },
  { label: "Full/Double", widthInches: 80, heightInches: 90 },
  { label: "Queen", widthInches: 90, heightInches: 100 },
  { label: "King", widthInches: 104, heightInches: 100 },
];

/**
 * Plan a rectangular grid from target dimensions and a nominal blocked square
 * size. This is arithmetic only: joining method and tension can change the
 * assembled blanket's measured dimensions.
 *
 * @param {{
 *   targetWidthInches: number,
 *   targetHeightInches: number,
 *   squareSizeInches: number,
 *   numberOfColors: number,
 *   yarnPerSquareYards: number | null,
 * }} inputs
 * @returns {{ status: "invalid", message: string } | {
 *   status: "ready",
 *   squaresWide: number,
 *   squaresTall: number,
 *   totalSquares: number,
 *   nominalGridWidthInches: number,
 *   nominalGridHeightInches: number,
 *   internalSeamSegments: number,
 *   internalSeamLengthInches: number,
 *   numberOfColors: number,
 *   totalSquareYarnYards: number | null,
 *   averageSquareYarnPerColorYards: number | null,
 * }}
 */
export function calculateGrannySquarePlan({
  targetWidthInches,
  targetHeightInches,
  squareSizeInches,
  numberOfColors,
  yarnPerSquareYards,
}) {
  const dimensions = [targetWidthInches, targetHeightInches, squareSizeInches];
  if (!dimensions.every(Number.isFinite) || dimensions.some((value) => value <= 0)) {
    return { status: "invalid", message: "Enter finite target and square measurements greater than zero." };
  }

  if (dimensions.some((value) => value > MAX_GRANNY_DIMENSION_INCHES)) {
    return {
      status: "invalid",
      message: `Measurements cannot exceed ${MAX_GRANNY_DIMENSION_INCHES.toLocaleString()} inches.`,
    };
  }

  if (!Number.isSafeInteger(numberOfColors) || numberOfColors < 1 || numberOfColors > MAX_GRANNY_COLORS) {
    return {
      status: "invalid",
      message: `Number of colors must be a whole number from 1 to ${MAX_GRANNY_COLORS.toLocaleString()}.`,
    };
  }

  if (
    yarnPerSquareYards !== null
    && (!Number.isFinite(yarnPerSquareYards)
      || yarnPerSquareYards <= 0
      || yarnPerSquareYards > MAX_GRANNY_YARDS_PER_SQUARE)
  ) {
    return {
      status: "invalid",
      message: `Yarn per square must be greater than zero and no more than ${MAX_GRANNY_YARDS_PER_SQUARE.toLocaleString()} yards.`,
    };
  }

  const squaresWide = Math.max(1, Math.ceil(targetWidthInches / squareSizeInches));
  const squaresTall = Math.max(1, Math.ceil(targetHeightInches / squareSizeInches));

  if (
    !Number.isSafeInteger(squaresWide)
    || !Number.isSafeInteger(squaresTall)
    || squaresWide > MAX_GRANNY_SQUARES_PER_AXIS
    || squaresTall > MAX_GRANNY_SQUARES_PER_AXIS
  ) {
    return {
      status: "invalid",
      message: `This combination exceeds the supported limit of ${MAX_GRANNY_SQUARES_PER_AXIS.toLocaleString()} squares per axis.`,
    };
  }

  const totalSquares = squaresWide * squaresTall;
  if (!Number.isSafeInteger(totalSquares) || totalSquares > MAX_GRANNY_TOTAL_SQUARES) {
    return {
      status: "invalid",
      message: `This combination exceeds the supported limit of ${MAX_GRANNY_TOTAL_SQUARES.toLocaleString()} total squares.`,
    };
  }

  const internalSeamSegments = (
    (squaresWide - 1) * squaresTall
    + (squaresTall - 1) * squaresWide
  );
  const internalSeamLengthInches = internalSeamSegments * squareSizeInches;
  const totalSquareYarnYards = yarnPerSquareYards === null
    ? null
    : totalSquares * yarnPerSquareYards;

  return {
    status: "ready",
    squaresWide,
    squaresTall,
    totalSquares,
    nominalGridWidthInches: squaresWide * squareSizeInches,
    nominalGridHeightInches: squaresTall * squareSizeInches,
    internalSeamSegments,
    internalSeamLengthInches,
    numberOfColors,
    totalSquareYarnYards,
    averageSquareYarnPerColorYards: totalSquareYarnYards === null
      ? null
      : totalSquareYarnYards / numberOfColors,
  };
}
