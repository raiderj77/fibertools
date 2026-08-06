const METERS_PER_YARD = 0.9144;
const GRAMS_PER_OUNCE = 28.3495;

/**
 * Convert yarn-label values into a purchase quantity. Length determines the
 * number of whole skeins; label weight determines the weight purchased.
 */
export function calculateSkeinPurchase({ yardsNeeded, skeinLength, skeinWeight, units }) {
  const needed = Number(yardsNeeded);
  const length = Number(skeinLength);
  const weight = Number(skeinWeight);

  if (
    !Number.isFinite(needed) || needed <= 0 ||
    !Number.isFinite(length) || length <= 0 ||
    !Number.isFinite(weight) || weight <= 0 ||
    (units !== "imperial" && units !== "metric")
  ) {
    return null;
  }

  const yardsPerSkein = units === "metric" ? length / METERS_PER_YARD : length;
  const gramsPerSkein = units === "metric" ? weight : weight * GRAMS_PER_OUNCE;
  const skeins = Math.ceil(needed / yardsPerSkein);
  const grams = skeins * gramsPerSkein;

  return {
    skeins,
    grams: Math.round(grams),
    ounces: Number((grams / GRAMS_PER_OUNCE).toFixed(1)),
    displayLength: length,
  };
}
