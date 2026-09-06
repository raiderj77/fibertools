/** Exact decimal material arithmetic, with up to six entered decimal places.
 * Monetary subtotals round half away from zero to cents before scenario math.
 * No fees, taxes, labor charges, or exchange-rate conversion are inferred.
 */
const emptySummary = { yarnCost: 0, notionCost: 0, totalCost: 0, hours: 0,
  minutes: 0, sell: 0, remainder: 0, hourlyRemainder: 0 };
function supportedInput(value) {
  const n = Number(value);
  return (typeof value === "number" || typeof value === "string") && Number.isFinite(n)
    && n >= 0 && n <= 1_000_000_000 && n === Number(n.toFixed(6));
}
function micros(value) { return BigInt(Number(value).toFixed(6).replace(".", "")); }
function roundedDivision(numerator, denominator) {
  const sign = numerator < 0n ? -1n : 1n;
  return sign * ((sign * numerator + denominator / 2n) / denominator);
}
/**
 * @param {{ skeins: string | number, pricePerSkein: string | number }[]} yarns
 * @param {{ price: string | number }[]} notions
 * @param {string | number} totalStitches
 * @param {string | number} stitchesPerMinute
 * @param {string | number} sellingPrice
 */
export function calculateProjectCostSummary(yarns, notions, totalStitches, stitchesPerMinute, sellingPrice) {
  const values = [...yarns.flatMap(y => [y.skeins, y.pricePerSkein]), ...notions.map(n => n.price), totalStitches, stitchesPerMinute, sellingPrice];
  if (!values.every(supportedInput)) return { ...emptySummary, valid: false,
    error: "Enter finite non-negative values no greater than 1,000,000,000, with at most six decimal places. Invalid entries are not counted as zero." };
  const yarnCents = roundedDivision(yarns.reduce((sum,y) => sum + micros(y.skeins) * micros(y.pricePerSkein), 0n), 10_000_000_000n);
  const notionCents = roundedDivision(notions.reduce((sum,n) => sum + micros(n.price), 0n), 10_000n);
  const totalCents = yarnCents + notionCents;
  const sellCents = roundedDivision(micros(sellingPrice), 10_000n);
  const remainderCents = sellCents > 0n ? sellCents - totalCents : 0n;
  const stitches = micros(totalStitches), rate = micros(stitchesPerMinute);
  const minutes = stitches > 0n && rate > 0n ? Number(totalStitches) / Number(stitchesPerMinute) : 0;
  const hourlyCents = stitches > 0n && rate > 0n && sellCents > 0n
    ? roundedDivision(remainderCents * rate * 60n, stitches) : 0n;
  const summary = { yarnCost: Number(yarnCents)/100, notionCost:Number(notionCents)/100,
    totalCost:Number(totalCents)/100, hours:minutes/60, minutes, sell:Number(sellCents)/100,
    remainder:Number(remainderCents)/100, hourlyRemainder:Number(hourlyCents)/100 };
  if (!Object.values(summary).every(value => Number.isFinite(value) && Math.abs(value) <= 1_000_000_000_000)) {
    return {...emptySummary, valid:false, error:"The calculated total or time exceeds the supported range. Check the inputs."};
  }
  return {...summary,valid:true,error:""};
}
