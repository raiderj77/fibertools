function nonNegativeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function roundCurrency(value) {
  return Number(value.toFixed(2));
}

/**
 * Calculates only the values represented by the project-cost form.
 * Currency subtotals are rounded before dependent scenario math. Time-based
 * arithmetic keeps the unrounded stitch-count division; the UI labels its
 * formatted time as approximate.
 *
 * @param {{ skeins: string | number, pricePerSkein: string | number }[]} yarns
 * @param {{ price: string | number }[]} notions
 * @param {string | number} totalStitches
 * @param {string | number} stitchesPerMinute
 * @param {string | number} sellingPrice
 */
export function calculateProjectCostSummary(
  yarns,
  notions,
  totalStitches,
  stitchesPerMinute,
  sellingPrice,
) {
  const yarnCost = roundCurrency(yarns.reduce(
    (sum, yarn) => sum + nonNegativeNumber(yarn.skeins) * nonNegativeNumber(yarn.pricePerSkein),
    0,
  ));
  const notionCost = roundCurrency(notions.reduce(
    (sum, notion) => sum + nonNegativeNumber(notion.price),
    0,
  ));
  const totalCost = roundCurrency(yarnCost + notionCost);

  const stitches = nonNegativeNumber(totalStitches);
  const rate = nonNegativeNumber(stitchesPerMinute);
  const rawMinutes = stitches > 0 && rate > 0 ? stitches / rate : 0;
  const hours = rawMinutes / 60;
  const sell = roundCurrency(nonNegativeNumber(sellingPrice));
  const remainder = sell > 0 ? roundCurrency(sell - totalCost) : 0;
  const hourlyRemainder = hours > 0 && sell > 0
    ? roundCurrency(remainder / hours)
    : 0;

  return {
    yarnCost,
    notionCost,
    totalCost,
    hours,
    minutes: rawMinutes,
    sell,
    remainder,
    hourlyRemainder,
  };
}
