const MAX_DIMENSION = 10_000;

/** @typedef {{ status: "invalid", message: string }} InvalidResult */
/** @typedef {{ fabricWidth: number, panels: number, yardage: number, cost: number | null }} BackingOption */
/** @typedef {{ status: "ready", backingWidth: number, backingLength: number, options: BackingOption[], cheapest: BackingOption | null }} BackingResult */
/** @typedef {{ status: "ready", perimeter: number, bindingLength: number, strips: number, yardage: number }} BindingResult */
/** @typedef {{ status: "ready", finishedWidth: number, finishedLength: number, perimeter: number, lengthwise: { cuts: number, yardage: number }, crosswise: { strips: number, yardage: number } }} BorderResult */
/** @typedef {{ name: string, width: number, length: number }} BattingSize */
/** @typedef {{ status: "ready", requiredWidth: number, requiredLength: number, packaged: BattingSize | null, rollYardage: number | null }} BattingResult */

/** @param {...number} values */
function valid(...values) {
  return values.every((value) => Number.isFinite(value) && value > 0 && value <= MAX_DIMENSION);
}

function quarterUp(value) {
  return Math.ceil(value * 4) / 4;
}

/** @param {string} [message] @returns {InvalidResult} */
function invalid(message = "Enter positive measurements no greater than 10,000 inches.") {
  return { status: "invalid", message };
}

/** @param {{ width: number, length: number, overhang: number, prices?: Record<number, number> }} input @returns {InvalidResult | BackingResult} */
export function calculateBacking({ width, length, overhang, prices = {} }) {
  if (!valid(width, length, overhang)) return invalid();
  const backingWidth = width + 2 * overhang;
  const backingLength = length + 2 * overhang;
  if (!valid(backingWidth, backingLength)) return invalid();
  const options = [44, 90, 108].map((fabricWidth) => {
    const panels = Math.ceil(backingWidth / (fabricWidth - 2));
    const yardage = quarterUp((panels * backingLength) / 36);
    const price = prices[fabricWidth];
    return { fabricWidth, panels, yardage, cost: valid(price) ? yardage * price : null };
  });
  const priced = options.filter((option) => option.cost !== null);
  const cheapest = priced.length ? priced.reduce((best, option) => option.cost < best.cost ? option : best) : null;
  return { status: "ready", backingWidth, backingLength, options, cheapest };
}

/** @param {{ width: number, length: number, stripWidth: number, fabricWidth: number }} input @returns {InvalidResult | BindingResult} */
export function calculateBinding({ width, length, stripWidth, fabricWidth }) {
  if (!valid(width, length, stripWidth, fabricWidth) || fabricWidth <= 2) return invalid();
  const perimeter = 2 * (width + length);
  const bindingLength = perimeter + 10;
  const strips = Math.ceil(bindingLength / (fabricWidth - 2));
  return { status: "ready", perimeter, bindingLength, strips, yardage: quarterUp((strips * stripWidth) / 36) };
}

/** @param {{ width: number, length: number, borderWidth: number, fabricWidth: number }} input @returns {InvalidResult | BorderResult} */
export function calculateBorder({ width, length, borderWidth, fabricWidth }) {
  if (!valid(width, length, borderWidth, fabricWidth) || fabricWidth <= 2) return invalid();
  const finishedWidth = width + 2 * borderWidth;
  const finishedLength = length + 2 * borderWidth;
  if (!valid(finishedWidth, finishedLength)) return invalid();
  const usableWidth = fabricWidth - 2;
  const perimeter = 2 * (finishedWidth + finishedLength);
  const longestStrip = Math.max(finishedWidth, finishedLength);
  const stripsPerCut = Math.floor(usableWidth / borderWidth);
  if (stripsPerCut < 1) return invalid("Border width is wider than the usable fabric width; choose a wider fabric.");
  const lengthwiseCuts = Math.ceil(4 / stripsPerCut);
  const crosswiseStrips = Math.ceil(perimeter / usableWidth);
  return {
    status: "ready", finishedWidth, finishedLength, perimeter,
    lengthwise: { cuts: lengthwiseCuts, yardage: quarterUp((lengthwiseCuts * longestStrip) / 36) },
    crosswise: { strips: crosswiseStrips, yardage: quarterUp((crosswiseStrips * borderWidth) / 36) },
  };
}

/** @param {{ width: number, length: number, overhang: number, rollWidth?: number | null }} input @returns {InvalidResult | BattingResult} */
export function calculateBatting({ width, length, overhang, rollWidth = null }) {
  if (!valid(width, length, overhang)) return invalid();
  if (rollWidth !== null && !valid(rollWidth)) return invalid();
  const requiredWidth = width + 2 * overhang;
  const requiredLength = length + 2 * overhang;
  if (!valid(requiredWidth, requiredLength)) return invalid();
  // The manufacturer size-chart fetch was unavailable on 2026-10-23; these are common packaged sizes, not verified specifications.
  const sizes = [
    { name: "Crib", width: 45, length: 60 }, { name: "Twin", width: 72, length: 90 },
    { name: "Queen", width: 90, length: 108 }, { name: "King", width: 120, length: 120 },
  ];
  const packaged = sizes.find((size) => (size.width >= requiredWidth && size.length >= requiredLength) || (size.length >= requiredWidth && size.width >= requiredLength)) || null;
  const rollYardage = rollWidth === null ? null : valid(rollWidth) && rollWidth >= requiredWidth
    ? quarterUp(requiredLength / 36) : null;
  return { status: "ready", requiredWidth, requiredLength, packaged, rollYardage };
}
