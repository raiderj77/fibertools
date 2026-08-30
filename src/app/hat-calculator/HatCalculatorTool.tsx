"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";
import { planEightSectionHatCrown, roundHatCastOnToSections } from "@/lib/hat-crown-plan.mjs";

// ── TYPES ───────────────────────────────────────────────────────────

type StitchType = "stockinette" | "ribbing" | "colorwork";

interface SizeEntry {
  label: string;
  circ: number;
  range: string;
  height: string;
}

// ── REFERENCE DATA ──────────────────────────────────────────────────

const SIZES: SizeEntry[] = [
  { label: "Preemie", circ: 11.5, range: "11\u201312\u2033", height: "4\u20134.5\u2033" },
  { label: "Newborn", circ: 13.5, range: "13\u201314\u2033", height: "5\u20135.5\u2033" },
  { label: "Baby 3\u20136 mo", circ: 14.5, range: "14\u201315\u2033", height: "5.5\u20136\u2033" },
  { label: "Baby 6\u201312 mo", circ: 16.5, range: "16\u201317\u2033", height: "6\u20136.5\u2033" },
  { label: "Toddler", circ: 17.5, range: "17\u201318\u2033", height: "7\u20137.5\u2033" },
  { label: "Child", circ: 19, range: "18\u201320\u2033", height: "7.5\u20138\u2033" },
  { label: "Teen / Small Adult", circ: 20.5, range: "20\u201321\u2033", height: "8\u20138.5\u2033" },
  { label: "Average Adult", circ: 22, range: "21\u201323\u2033", height: "8.5\u20139\u2033" },
  { label: "Large Adult", circ: 23.5, range: "23\u201324\u2033", height: "9\u20139.5\u2033" },
];

const EASE: Record<StitchType, { label: string; pct: number }> = {
  stockinette: { label: "Stockinette", pct: 10 },
  ribbing: { label: "Ribbing", pct: 15 },
  colorwork: { label: "Colorwork", pct: 5 },
};

// ── COMPONENT ───────────────────────────────────────────────────────

export default function HatCalculatorTool() {
  const [sizePreset, setSizePreset] = useState("");
  const [customCirc, setCustomCirc] = useState("");
  const [stitchType, setStitchType] = useState<StitchType>("stockinette");
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeInches, setGaugeInches] = useState("4");

  // Resolve head circumference from preset or custom
  const headCirc = useMemo(() => {
    if (sizePreset) {
      const found = SIZES.find((s) => s.label === sizePreset);
      return found ? found.circ : 0;
    }
    return parseFloat(customCirc) || 0;
  }, [sizePreset, customCirc]);

  // Look up a nominal size entry for the reference height range.
  const sizeEntry = useMemo(() => {
    if (sizePreset) return SIZES.find((s) => s.label === sizePreset) ?? null;
    return null;
  }, [sizePreset]);

  // ── RESULTS ─────────────────────────────────────────────────────
  const calculation = useMemo(() => {
    const gSt = parseFloat(gaugeStitches) || 0;
    const gIn = parseFloat(gaugeInches) || 0;
    if (headCirc <= 0 || gSt <= 0 || gIn <= 0) return null;

    const easePct = EASE[stitchType].pct;
    const targetCirc = headCirc * (1 - easePct / 100);
    const stsPerInch = gSt / gIn;
    const castOnPlan = roundHatCastOnToSections(targetCirc * stsPerInch);
    if (
      castOnPlan.status !== "ready"
      || typeof castOnPlan.castOn !== "number"
      || typeof castOnPlan.rawCastOn !== "number"
    ) return castOnPlan;
    const { rawCastOn, castOn } = castOnPlan;
    const crownPlan = planEightSectionHatCrown(castOn);
    if (crownPlan.status !== "ready") return crownPlan;

    const stsPerSection = castOn / 8;

    return {
      status: "ready" as const,
      easePct,
      targetCirc: +targetCirc.toFixed(1),
      stsPerInch: +stsPerInch.toFixed(2),
      rawCastOn: +rawCastOn.toFixed(2),
      castOn,
      actualCirc: +(castOn / stsPerInch).toFixed(1),
      stsPerSection,
      decreaseRounds: crownPlan.decreaseRoundCount,
      schedule: crownPlan.schedule,
    };
  }, [headCirc, stitchType, gaugeStitches, gaugeInches]);

  const result = calculation?.status === "ready" ? calculation : null;
  const validationMessage = calculation && calculation.status !== "ready" ? calculation.message : "";
  const stickySummary = result ? `Cast on ${result.castOn} stitches` : "";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Select a size or enter a head circumference, choose your stitch type, and enter your gauge.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size selection */}
        <div className="space-y-4 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
          <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Head Size</p>
          <div>
            <label htmlFor="hat-size-preset" className="label text-xs">Size Preset</label>
            <select
              id="hat-size-preset"
              value={sizePreset}
              onChange={(e) => {
                setSizePreset(e.target.value);
                if (e.target.value) setCustomCirc("");
              }}
              className="input"
            >
              <option value="">Custom measurement</option>
              {SIZES.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}, {s.range}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hat-head-circumference" className="label text-xs">
              Head Circumference (in)
              <Tooltip text="Measure around the widest part of the head, just above the ears. If using a preset, this fills automatically." />
            </label>
            <input
              id="hat-head-circumference"
              type="number"
              value={sizePreset ? (headCirc || "") : customCirc}
              onChange={(e) => {
                setSizePreset("");
                setCustomCirc(e.target.value);
              }}
              placeholder="e.g. 22"
              className="input"
              min="0"
              inputMode="decimal"
              disabled={!!sizePreset}
            />
          </div>
        </div>

        {/* Gauge & stitch type */}
        <div className="space-y-4 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
          <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Gauge &amp; Stitch Type</p>
          <div>
            <label htmlFor="hat-stitch-type" className="label text-xs">Stitch Type</label>
            <select
              id="hat-stitch-type"
              value={stitchType}
              onChange={(e) => setStitchType(e.target.value as StitchType)}
              className="input"
            >
              {Object.entries(EASE).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} ({val.pct}% negative ease)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="hat-gauge-stitches" className="label text-xs">Gauge Stitches</label>
              <input
                id="hat-gauge-stitches"
                type="number"
                value={gaugeStitches}
                onChange={(e) => setGaugeStitches(e.target.value)}
                placeholder="e.g. 18"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label htmlFor="hat-gauge-inches" className="label text-xs">
                Over (in)
                <Tooltip text="The width your gauge swatch was measured over. Usually 4 inches." />
              </label>
              <input
                id="hat-gauge-inches"
                type="number"
                value={gaugeInches}
                onChange={(e) => setGaugeInches(e.target.value)}
                placeholder="4"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>
      </div>

      {validationMessage && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">
          {validationMessage}
        </div>
      )}

      {/* Results */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Calculated Hat Reference
            </h3>

            {/* Key numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.castOn}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  cast on
                  {result.castOn !== result.rawCastOn && (
                    <span className="text-xs ml-1">(from {result.rawCastOn})</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.targetCirc}&Prime;
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  calculated target circumference
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.actualCirc}&Prime;
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  modeled circumference after rounding
                </p>
              </div>
              {sizeEntry && (
                <div>
                  <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                    {sizeEntry.height}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">nominal height range</p>
                </div>
              )}
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500">
              {result.easePct}% negative ease applied &bull; rounded to nearest multiple of 8 for crown decreases
            </p>

            {/* Crown decrease schedule */}
            <div className="border-t border-cream-300 dark:border-bark-600 pt-4">
              <h4 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
                Eight-Section Crown Decrease Reference
              </h4>
              <div className="bg-cream-100 dark:bg-bark-800 rounded-xl p-4 max-h-64 overflow-y-auto">
                <ol className="text-sm text-bark-600 dark:text-cream-300 space-y-1 list-none">
                  {result.schedule.map((line: string, i: number) => (
                    <li key={i}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              This is a bottom-up knitted K2tog reference. Swatch and follow your pattern for fit, crown depth, and finishing.
            </p>

            <button
              type="button"
              onClick={() => {
                const text = [
                  `Hat: Cast on ${result.castOn} stitches`,
                  `Head circ: ${headCirc}" → target: ${result.targetCirc}" (${result.easePct}% neg. ease)`,
                  `Modeled circumference after rounding: ${result.actualCirc}"`,
                  sizeEntry ? `Nominal height reference: ${sizeEntry.height}` : "",
                  "",
                  "Crown decreases:",
                  ...result.schedule,
                ]
                  .filter(Boolean)
                  .join("\n");
                navigator.clipboard.writeText(text);
              }}
              className="btn-secondary text-sm"
              aria-label="Copy hat reference to clipboard"
            >
              Copy result
            </button>
          </div>
        )}
      </StickyResult>

      {/* Size Reference Table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Nominal Hat Size Reference
        </h3>
        <p className="mb-3 text-xs text-bark-400 dark:text-bark-500">
          These broad ranges are orientation only; measurements, desired fit, construction, and pattern guidance take priority.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Size</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Head Circ.</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Nominal Height</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr
                  key={s.label}
                  className="border-b border-cream-200 dark:border-bark-700 last:border-0"
                >
                  <td className="py-2 pr-4 text-bark-700 dark:text-cream-200">{s.label}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{s.range}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{s.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Hat Knitting Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Ease is an input assumption.</strong> The preset percentages are starting references, not fit guarantees.</li>
          <li><strong>Use a representative washed swatch.</strong> Fiber, stitch pattern, and finishing can change width and recovery.</li>
          <li><strong>Check the construction.</strong> This schedule models a bottom-up knitted crown with eight K2tog sections.</li>
          <li><strong>Confirm crown depth.</strong> Follow your pattern or try on the work when the construction safely allows it.</li>
          <li><strong>Plan yarn separately.</strong> This calculator does not estimate yarn use for the finished hat.</li>
        </ul>
      </div>
    </div>
  );
}
