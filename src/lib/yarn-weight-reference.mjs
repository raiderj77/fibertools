// Numeric guidelines checked against CYC on 2026-08-26. Common regional names
// are approximate references, not a separate CYC equivalence standard.
// https://www.craftyarncouncil.com/standards/yarn-weight-system
// https://www.craftyarncouncil.com/standards/faqs
export const YARN_WEIGHTS = [
  {
    number: "0",
    usName: "Lace",
    ukName: "Lace / Cobweb",
    auPly: "1–2 ply",
    altNames: ["thread", "cobweb", "light fingering"],
    needleMm: "1.5–2.25 mm",
    needleUS: "000–1",
    hookMm: "Steel 1.4–1.6 mm; regular 2.25 mm",
    hookUS: "Steel 6, 7, 8; regular B/1",
    knitGaugeStPer4in: "33–40",
  },
  {
    number: "1",
    usName: "Fingering / Sock",
    ukName: "4-ply",
    auPly: "3–4 ply",
    altNames: ["super fine", "sock", "baby", "fingering"],
    needleMm: "2.25–3.25 mm",
    needleUS: "1–3",
    hookMm: "2.25–3.5 mm",
    hookUS: "B/1–E/4",
    knitGaugeStPer4in: "27–32",
  },
  {
    number: "2",
    usName: "Sport / Baby",
    ukName: "5-ply",
    auPly: "5 ply",
    altNames: ["fine", "sport", "baby"],
    needleMm: "3.25–3.75 mm",
    needleUS: "3–5",
    hookMm: "3.5–4.5 mm",
    hookUS: "E/4–7",
    knitGaugeStPer4in: "23–26",
  },
  {
    number: "3",
    usName: "DK / Light Worsted",
    ukName: "DK",
    auPly: "8 ply",
    altNames: ["light", "DK", "double knitting", "light worsted"],
    needleMm: "3.75–4.5 mm",
    needleUS: "5–7",
    hookMm: "4.5–5.5 mm",
    hookUS: "7–I/9",
    knitGaugeStPer4in: "21–24",
  },
  {
    number: "4",
    usName: "Worsted / Aran",
    ukName: "Aran",
    auPly: "10 ply",
    altNames: ["worsted", "aran", "afghan", "medium"],
    needleMm: "4.5–5.5 mm",
    needleUS: "7–9",
    hookMm: "5.5–6.5 mm",
    hookUS: "I/9–K/10½",
    knitGaugeStPer4in: "16–20",
  },
  {
    number: "5",
    usName: "Bulky / Chunky",
    ukName: "Chunky",
    auPly: "12 ply",
    altNames: ["bulky", "chunky", "craft", "rug"],
    needleMm: "5.5–8 mm",
    needleUS: "9–11",
    hookMm: "6.5–9 mm",
    hookUS: "K/10½–M/13",
    knitGaugeStPer4in: "12–15",
  },
  {
    number: "6",
    usName: "Super Bulky",
    ukName: "Super Chunky",
    auPly: "14+ ply",
    altNames: ["super bulky", "super chunky", "roving"],
    needleMm: "8–12.75 mm",
    needleUS: "11–17",
    hookMm: "9–15 mm",
    hookUS: "M/13–Q",
    knitGaugeStPer4in: "7–11",
  },
  {
    number: "7",
    usName: "Jumbo",
    ukName: "Jumbo",
    auPly: "–",
    altNames: ["jumbo", "roving", "arm knitting"],
    needleMm: "12.75 mm and larger",
    needleUS: "17 and larger",
    hookMm: "15 mm and larger",
    hookUS: "Q and larger",
    knitGaugeStPer4in: "6 or fewer",
  },
];

function normalizeName(value) {
  return value.toLowerCase().replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesPlyName(name, count) {
  const range = name.match(/^(\d+)\s*[–-]\s*(\d+)\s*ply$/i);
  if (range) return count >= Number(range[1]) && count <= Number(range[2]);
  const single = name.match(/^(\d+)(\+)?[-\s]*ply$/i);
  if (!single) return false;
  return single[2] ? count >= Number(single[1]) : count === Number(single[1]);
}

export function filterYarnWeights(query) {
  const normalized = normalizeName(query);
  if (!normalized) return YARN_WEIGHTS;
  // A CYC category number is not a regional ply count.
  if (/^\d+$/.test(normalized)) {
    return YARN_WEIGHTS.filter((weight) => weight.number === normalized);
  }
  const plyQuery = normalized.match(/^(?:(\d+)\s*ply|ply\s*(\d+))$/);
  if (plyQuery) {
    const count = Number(plyQuery[1] || plyQuery[2]);
    if (!Number.isSafeInteger(count)) return [];
    return YARN_WEIGHTS.filter((weight) =>
      [weight.ukName, weight.auPly].some((name) => matchesPlyName(name, count)),
    );
  }
  return YARN_WEIGHTS.filter((weight) =>
    [weight.usName, weight.ukName, weight.auPly, ...weight.altNames]
      .some((name) => normalizeName(name).includes(normalized)),
  );
}

/** Compare supplied labels only; neither category nor length/weight predicts gauge. */
export function compareYarnLabels(
  patternCategory,
  substituteCategory,
  patternYardsPerGram = "",
  substituteYardsPerGram = "",
) {
  const pattern = YARN_WEIGHTS.find((weight) => weight.number === patternCategory);
  const substitute = YARN_WEIGHTS.find((weight) => weight.number === substituteCategory);
  if (!pattern || !substitute) return null;

  const categoryDifference = Math.abs(Number(pattern.number) - Number(substitute.number));
  const title = categoryDifference === 0
    ? "Same category — swatch required"
    : categoryDifference === 1
      ? "Adjacent categories — swatch required"
      : "Different categories — swatch required";
  const notes = [categoryDifference === 0
    ? "Matching categories do not establish interchangeable gauge or fabric."
    : `The selected categories are ${categoryDifference} ${categoryDifference === 1 ? "step" : "steps"} apart. This is not a measured gauge difference or a needle-size adjustment.`,
  ];

  const yardageInputs = [patternYardsPerGram, substituteYardsPerGram]
    .map((value) => String(value).trim());
  let yardageError = "";
  if (yardageInputs.some(Boolean)) {
    const yardages = yardageInputs.map(Number);
    if (yardageInputs.some((value) => !value) || !yardages.every((value) => Number.isFinite(value) && value > 0)) {
      yardageError = "Enter positive, finite yards per gram for both yarns, or leave both values blank.";
    } else {
      notes.push(`Label length per gram: ${yardages[0]} yd/g for the pattern yarn and ${yardages[1]} yd/g for the substitute. Matching values do not establish matching gauge, thickness, or drape.`);
    }
  }

  return { title, categoryDifference, notes, yardageError, requiresSwatch: true };
}
