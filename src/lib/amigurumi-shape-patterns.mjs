/**
 * Build a symmetric single-crochet sphere with exactly the requested number
 * of numbered rounds. Even totals use one center round; odd totals use two.
 *
 * @param {number} rounds
 * @returns {string[]}
 */
export function generateSphere(rounds) {
  if (!Number.isInteger(rounds) || rounds < 6) {
    throw new RangeError("Sphere rounds must be an integer of at least 6.");
  }

  const increaseCount = Math.floor(rounds / 2);
  const evenCount = rounds % 2 === 0 ? 1 : 2;
  const lines = [];

  for (let round = 1; round <= increaseCount; round++) {
    const total = 6 * round;
    if (round === 1) {
      lines.push("Rnd 1: Magic ring, 6 sc. (6)");
    } else if (round === 2) {
      lines.push("Rnd 2: 2 sc in each st around. (12)");
    } else {
      lines.push(`Rnd ${round}: *sc ${round - 2}, 2 sc in next st* x6. (${total})`);
    }
  }

  const maxStitches = 6 * increaseCount;
  for (let index = 0; index < evenCount; index++) {
    const round = increaseCount + 1 + index;
    lines.push(`Rnd ${round}: sc in each st around. (${maxStitches})`);
  }

  let decreaseRound = increaseCount + evenCount + 1;
  for (let round = increaseCount; round >= 2; round--) {
    const total = 6 * round;
    if (round === 2) {
      lines.push(`Rnd ${decreaseRound}: *sc2tog* x6. (6)`);
    } else {
      lines.push(`Rnd ${decreaseRound}: *sc ${round - 2}, sc2tog* x6. (${total - 6})`);
    }
    decreaseRound++;
  }

  lines.push("Stuff firmly before closing. Fasten off, sew hole closed.");
  return lines;
}
