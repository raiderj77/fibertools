"use client";

import { useMemo, useState } from "react";
import {
  CIRCLE_ROUND_LIMITS,
  CIRCLE_ROUND_PRESETS,
  buildCircleRoundPlan,
} from "@/lib/circle-round-plan.mjs";

const STITCH_TYPES = Object.values(CIRCLE_ROUND_PRESETS);

export default function CircleCalculatorTool() {
  const [stitchKey, setStitchKey] = useState<keyof typeof CIRCLE_ROUND_PRESETS>("sc6");
  const [rows, setRows] = useState(8);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const plan = useMemo(
    () => buildCircleRoundPlan({ presetKey: stitchKey, rounds: rows }),
    [stitchKey, rows],
  );
  const selectedPreset = CIRCLE_ROUND_PRESETS[stitchKey] ?? CIRCLE_ROUND_PRESETS.sc6;

  const handleCopy = async () => {
    if (!plan.ok) return;
    const limitation = "Reference only: this selected-preset arithmetic does not guarantee flatness, roundness, diameter, fit, or a project-ready pattern.";
    try {
      await navigator.clipboard.writeText([
        `${plan.preset.name}; ${plan.rounds} rounds`,
        ...plan.schedule.map((entry) => entry.instruction),
        limitation,
      ].join("\n"));
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
    setTimeout(() => setCopyStatus("idle"), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
        Choose a common starting-count preset and a round limit. The schedule preserves that arithmetic only; it does not use gauge or target diameter, choose join or chain conventions, or guarantee a flat or round result.
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-bark-500 dark:text-bark-400">
          Common starting-count preset
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STITCH_TYPES.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStitchKey(st.key)}
              aria-pressed={stitchKey === st.key}
              className={`min-h-11 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                stitchKey === st.key
                  ? "bg-sage-600 text-white"
                  : "border border-bark-200 bg-white text-bark-700 hover:border-sage-400 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300"
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="circle-rounds" className="text-sm font-medium text-bark-500 dark:text-bark-400">
            Number of rounds
          </label>
          <span className="text-sm font-bold text-bark-700 dark:text-cream-300">{rows}</span>
        </div>
        <input
          id="circle-rounds"
          type="range"
          min={CIRCLE_ROUND_LIMITS.minimumRounds}
          max={CIRCLE_ROUND_LIMITS.maximumRounds}
          value={rows}
          onChange={(event) => setRows(Number(event.target.value))}
          className="h-11 w-full accent-sage-600"
        />
        <div className="mt-1 flex justify-between text-xs text-bark-400 dark:text-bark-500">
          <span>{CIRCLE_ROUND_LIMITS.minimumRounds} rounds</span>
          <span>{CIRCLE_ROUND_LIMITS.maximumRounds} rounds</span>
        </div>
      </div>

      {plan.ok ? (
        <div className="space-y-4">
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {plan.rounds} rounds selected; ending count {plan.endingCount}; {selectedPreset.additionsPerRound} preset additions per round.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-bark-200 bg-white p-3 text-center dark:border-bark-700 dark:bg-bark-800">
              <p className="text-xs text-bark-400 dark:text-bark-500">Rounds</p>
              <p className="text-lg font-bold text-bark-700 dark:text-cream-300">{plan.rounds}</p>
            </div>
            <div className="rounded-xl border border-bark-200 bg-white p-3 text-center dark:border-bark-700 dark:bg-bark-800">
              <p className="text-xs text-bark-400 dark:text-bark-500">Ending count</p>
              <p className="text-lg font-bold text-bark-700 dark:text-cream-300">{plan.endingCount}</p>
            </div>
            <div className="rounded-xl border border-bark-200 bg-white p-3 text-center dark:border-bark-700 dark:bg-bark-800">
              <p className="text-xs text-bark-400 dark:text-bark-500">Preset additions</p>
              <p className="text-lg font-bold text-sage-600 dark:text-sage-400">{selectedPreset.additionsPerRound}</p>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-bark-200 bg-white dark:border-bark-700 dark:bg-bark-800" aria-labelledby="circle-schedule-heading">
            <div className="flex items-center justify-between border-b border-bark-200 px-5 py-3 dark:border-bark-700">
              <h2 id="circle-schedule-heading" className="font-bold text-bark-700 dark:text-cream-300">Reference round schedule</h2>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-sage-600 hover:underline dark:text-sage-400"
              >
                Copy
              </button>
            </div>
            <div className="space-y-2 p-5">
              {plan.schedule.map((entry) => (
                <p key={entry.round} className="font-mono text-sm leading-relaxed text-bark-700 dark:text-cream-300">
                  {entry.instruction}
                </p>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300">
          {plan.error}
        </p>
      )}

      <p aria-live="polite" className="min-h-5 text-sm text-bark-500 dark:text-bark-400">
        {copyStatus === "success" ? "Schedule and limitations copied." : copyStatus === "error" ? "Copy failed. Select the text and copy it manually." : ""}
      </p>

      <div className="rounded-xl border border-bark-200 bg-cream-100 p-4 dark:border-bark-600 dark:bg-bark-700">
        <p className="mb-1 text-sm font-semibold text-bark-700 dark:text-cream-300">Check the actual fabric</p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Yarn, hook, tension, stitch dimensions, joins, and chain-counting conventions can change the shape. Compare each round with the selected pattern and adjust from observed cupping or rippling instead of treating a preset as a flatness guarantee.
        </p>
      </div>
    </div>
  );
}
