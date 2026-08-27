export function correctEvenPattern(roundCount) {
  return Array.from(
    { length: roundCount },
    (_, index) => `Round ${index + 1}: 1 sc [1]`,
  ).join("\n");
}

export const duplicateAndMissingPattern = [
  "Round 1: 1 sc [1]",
  "Round 1: 1 sc [1]",
  "Round 3: 1 sc [1]",
].join("\n");

export const unsupportedNestedRepeatPattern = [
  "Round 1: 6 sc in magic ring [6]",
  "Round 2: ((sc, inc) x 2, sc) x 3 [15]",
].join("\n");

export const previousVersionPattern = [
  "Round 1: 6 sc in magic ring [6]",
  "Round 2: inc x 6 [12]",
  "Round 4: 12 sc [12]",
  "Round 5: 12 sc [12]",
].join("\n");

export const revisedVersionPattern = [
  "Round 1: 6 sc in magic ring [6]",
  "Round 2: inc x 6 [12]",
  "Round 3: 12 sc [12]",
  "Round 4: (sc, inc) x 6 [18]",
].join("\n");
