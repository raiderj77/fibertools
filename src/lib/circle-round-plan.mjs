export const CIRCLE_ROUND_LIMITS = Object.freeze({ minimumRounds: 3, maximumRounds: 30 });

export const CIRCLE_ROUND_PRESETS = Object.freeze({
  sc6: Object.freeze({
    key: "sc6",
    name: "Single crochet — 6",
    abbreviation: "sc",
    additionsPerRound: 6,
    start: "Place 6 sc in the selected center start.",
  }),
  hdc8: Object.freeze({
    key: "hdc8",
    name: "Half double crochet — 8",
    abbreviation: "hdc",
    additionsPerRound: 8,
    start: "Place 8 hdc in the selected center start, counting chains only as directed by the pattern.",
  }),
  dc12: Object.freeze({
    key: "dc12",
    name: "Double crochet — 12",
    abbreviation: "dc",
    additionsPerRound: 12,
    start: "Place 12 dc in the selected center start, counting chains only as directed by the pattern.",
  }),
  tr16: Object.freeze({
    key: "tr16",
    name: "Treble crochet — 16",
    abbreviation: "tr",
    additionsPerRound: 16,
    start: "Place 16 tr in the selected center start, counting chains only as directed by the pattern.",
  }),
});

function invalid(error) {
  return { ok: /** @type {false} */ (false), error };
}

function plainInstruction(abbreviation, count) {
  return `${abbreviation} in next ${count} ${count === 1 ? "st" : "sts"}`;
}

function arrangementForRound(preset, round) {
  if (round === 2) return `2 ${preset.abbreviation} in each st around`;

  const plainPerRepeat = round - 2;
  if (plainPerRepeat % 2 === 0) {
    const half = plainPerRepeat / 2;
    return `*${plainInstruction(preset.abbreviation, half)}, 2 ${preset.abbreviation} in next st, ${plainInstruction(preset.abbreviation, half)}* repeat ${preset.additionsPerRound} times`;
  }

  const increaseFirst = round % 4 === 3;
  const plain = plainInstruction(preset.abbreviation, plainPerRepeat);
  return increaseFirst
    ? `*2 ${preset.abbreviation} in next st, ${plain}* repeat ${preset.additionsPerRound} times`
    : `*${plain}, 2 ${preset.abbreviation} in next st* repeat ${preset.additionsPerRound} times`;
}

export function buildCircleRoundPlan({ presetKey, rounds }) {
  const preset = CIRCLE_ROUND_PRESETS[presetKey];
  if (!preset) return invalid("Choose one of the included starting-count presets.");
  if (!Number.isSafeInteger(rounds)
    || rounds < CIRCLE_ROUND_LIMITS.minimumRounds
    || rounds > CIRCLE_ROUND_LIMITS.maximumRounds) {
    return invalid(`Rounds must be a whole number from ${CIRCLE_ROUND_LIMITS.minimumRounds} through ${CIRCLE_ROUND_LIMITS.maximumRounds}.`);
  }

  const schedule = [];
  for (let round = 1; round <= rounds; round += 1) {
    const previousCount = round === 1 ? 0 : preset.additionsPerRound * (round - 1);
    const endingCount = preset.additionsPerRound * round;
    const plainStitchesPerRepeat = Math.max(0, round - 2);
    const consumedPerRepeat = round === 1 ? 0 : plainStitchesPerRepeat + 1;
    const instruction = round === 1
      ? `Round 1: ${preset.start} (${endingCount} ${preset.abbreviation})`
      : `Round ${round}: ${arrangementForRound(preset, round)}. (${endingCount} ${preset.abbreviation})`;

    schedule.push({
      round,
      previousCount,
      additions: preset.additionsPerRound,
      endingCount,
      plainStitchesPerRepeat,
      consumedPerRepeat,
      instruction,
    });
  }

  return {
    ok: /** @type {true} */ (true),
    preset,
    rounds,
    endingCount: preset.additionsPerRound * rounds,
    schedule,
  };
}
