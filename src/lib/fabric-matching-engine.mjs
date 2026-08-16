const SCORE_WEIGHTS = Object.freeze({
  construction: 30,
  stretch: 20,
  weight: 15,
  drape: 15,
  structure: 10,
  opacity: 5,
  recovery: 5,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value) => Math.round(value * 10) / 10;

function rangeScore(aMin, aMax, bMin, bMax, points) {
  const overlap = Math.max(0, Math.min(aMax, bMax) - Math.max(aMin, bMin));
  const union = Math.max(aMax, bMax) - Math.min(aMin, bMin);
  if (union === 0) return points;
  if (overlap > 0) {
    const narrowerSpan = Math.max(1, Math.min(aMax - aMin, bMax - bMin));
    return points * clamp(0.65 + 0.35 * (overlap / narrowerSpan), 0, 1);
  }
  const gap = Math.max(bMin - aMax, aMin - bMax, 0);
  const scale = Math.max(10, (aMax - aMin + bMax - bMin) / 2);
  return points * clamp(1 - gap / (scale * 2), 0, 0.55);
}

function ratingScore(a, b, points) {
  return points * (1 - Math.abs(a - b) / 4);
}

function constructionScore(source, candidate) {
  if (source.construction !== candidate.construction) return 0;
  if (source.constructionSubtype === candidate.constructionSubtype) return SCORE_WEIGHTS.construction;
  return 24;
}

function stretchScore(source, candidate) {
  if (source.construction !== candidate.construction) return 0;
  const horizontal = rangeScore(
    source.horizontalStretchMin,
    source.horizontalStretchMax,
    candidate.horizontalStretchMin,
    candidate.horizontalStretchMax,
    SCORE_WEIGHTS.stretch / 2,
  );
  const vertical = rangeScore(
    source.verticalStretchMin,
    source.verticalStretchMax,
    candidate.verticalStretchMin,
    candidate.verticalStretchMax,
    SCORE_WEIGHTS.stretch / 2,
  );
  return horizontal + vertical;
}

export function labelForScore(score) {
  if (score >= 82) return "Strong substitute";
  if (score >= 65) return "Reasonable substitute";
  if (score >= 45) return "Possible substitute with adjustments";
  return "Poor substitute";
}

function describeMatch(source, candidate, breakdown) {
  const reasons = [];
  const cautions = [];

  if (source.construction === candidate.construction) {
    reasons.push(`Both are ${source.construction} fabrics, so the basic pattern behavior is compatible.`);
  } else {
    cautions.push(`This changes from ${source.construction} to ${candidate.construction}; fit, ease, and seam construction may need to be redesigned.`);
  }

  if (breakdown.weight >= 11) {
    reasons.push(`Their broad weight ranges overlap (${source.weightGsmMin}–${source.weightGsmMax} vs. ${candidate.weightGsmMin}–${candidate.weightGsmMax} GSM).`);
  } else {
    cautions.push(`The weight ranges differ, which can change bulk, opacity, and how seams hang.`);
  }

  if (Math.abs(source.drapeRating - candidate.drapeRating) <= 1) {
    reasons.push("Drape is close enough to preserve much of the intended silhouette.");
  } else {
    cautions.push(candidate.drapeRating > source.drapeRating ? "The substitute hangs more softly and may lose crisp shaping." : "The substitute is firmer and may make the design stand away from the body.");
  }

  const sourceStretch = (source.horizontalStretchMin + source.horizontalStretchMax) / 2;
  const candidateStretch = (candidate.horizontalStretchMin + candidate.horizontalStretchMax) / 2;
  if (Math.abs(sourceStretch - candidateStretch) <= 15 && source.construction === candidate.construction) {
    reasons.push("Crosswise stretch is in a similar working range.");
  } else if (candidateStretch < sourceStretch) {
    cautions.push("The substitute has less crosswise stretch; check wearing ease, closures, and neckline openings.");
  } else {
    cautions.push("The substitute has more crosswise stretch; stabilize seams and verify recovery with a test swatch.");
  }

  if (Math.abs(source.opacityRating - candidate.opacityRating) >= 2) {
    cautions.push(candidate.opacityRating < source.opacityRating ? "It is more transparent, so lining or underlining may be useful." : "It is more opaque and may look heavier than the original design.");
  }

  return { reasons: reasons.slice(0, 3), cautions: cautions.slice(0, 3) };
}

export function scoreFabricPair(source, candidate) {
  const breakdown = {
    construction: constructionScore(source, candidate),
    stretch: stretchScore(source, candidate),
    weight: rangeScore(source.weightGsmMin, source.weightGsmMax, candidate.weightGsmMin, candidate.weightGsmMax, SCORE_WEIGHTS.weight),
    drape: ratingScore(source.drapeRating, candidate.drapeRating, SCORE_WEIGHTS.drape),
    structure: ratingScore(source.structureRating, candidate.structureRating, SCORE_WEIGHTS.structure),
    opacity: ratingScore(source.opacityRating, candidate.opacityRating, SCORE_WEIGHTS.opacity),
    recovery: ratingScore(source.recoveryRating, candidate.recoveryRating, SCORE_WEIGHTS.recovery),
  };

  let score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const knownPoor = (source.poorSubstitutes ?? []).includes(candidate.id) || (candidate.poorSubstitutes ?? []).includes(source.id);
  if (knownPoor) score = Math.min(score - 20, 44);
  score = round(clamp(score, 0, 100));
  const explanation = describeMatch(source, candidate, breakdown);

  return {
    fabric: candidate,
    score,
    label: labelForScore(score),
    breakdown: Object.fromEntries(Object.entries(breakdown).map(([key, value]) => [key, round(value)])),
    reasons: explanation.reasons,
    cautions: explanation.cautions,
  };
}

export function rankFabricSubstitutes(source, allFabrics) {
  return allFabrics
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => scoreFabricPair(source, candidate))
    .sort((a, b) => b.score - a.score || a.fabric.displayName.localeCompare(b.fabric.displayName));
}

export function searchFabrics(query, allFabrics) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return allFabrics;
  return allFabrics.filter((fabric) =>
    [fabric.displayName, ...(fabric.aliases ?? [])].some((value) => value.toLocaleLowerCase().includes(normalized)),
  );
}

const STRETCH_PROJECTS = new Set(["T-shirts", "Leggings", "Sweatshirts", "Fitted dresses", "Activewear"]);

export function projectSuggestionsFor(fabric) {
  return (fabric.commonUses ?? []).slice(0, 7).map((name, index) => {
    const stretchImportant = STRETCH_PROJECTS.has(name);
    const liningUseful = fabric.opacityRating <= 2 || ["Chiffon overlays", "Sheer blouses", "Formal dresses"].includes(name);
    const beginnerDifficulty = fabric.sewingDifficultyRating <= 2
      ? "Beginner-friendly"
      : fabric.sewingDifficultyRating <= 3
        ? "Manageable"
        : "Advanced handling";
    const behavior = fabric.drapeRating >= 4
      ? "Hangs softly and follows the body."
      : fabric.structureRating >= 4
        ? "Holds a crisp, structured shape."
        : "Balances movement with moderate body.";
    const limitations = [
      stretchImportant && fabric.horizontalStretchMax < 20 ? "The project usually needs more stretch than this fabric provides." : null,
      liningUseful ? "Plan for lining, underlining, or deliberate transparency." : null,
      fabric.poorUses?.[0] ? `Avoid treating it like ${fabric.poorUses[0].toLowerCase()}.` : null,
    ].filter(Boolean).join(" ") || "Test the fabric after washing before committing yardage.";

    return {
      name,
      suitability: index < 3 ? "Strong" : index < 6 ? "Reasonable" : "Possible with adjustments",
      why: `${fabric.displayName} is commonly used for ${name.toLowerCase()} because its ${fabric.weightLabel} weight and ${fabric.drapeRating >= 4 ? "fluid drape" : fabric.structureRating >= 4 ? "firm structure" : "balanced hand"} support the shape.`,
      limitations,
      beginnerDifficulty,
      liningUseful,
      stretchImportant,
      behavior,
    };
  });
}

export { SCORE_WEIGHTS };
