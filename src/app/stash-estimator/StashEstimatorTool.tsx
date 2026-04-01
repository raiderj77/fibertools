"use client";

import { useState, useMemo } from "react";
import StickyResult from "@/components/StickyResult";
import Tooltip from "@/components/Tooltip";

// ── YARN WEIGHT DATA ──────────────────────────────────────────────

interface YarnWeightInfo {
  label: string;
  number: string;
  typicalPer100g: number;
  rangeLow: number;
  rangeHigh: string;
}

const YARN_WEIGHTS: YarnWeightInfo[] = [
  { label: "Lace", number: "0", typicalPer100g: 800, rangeLow: 700, rangeHigh: "1200+" },
  { label: "Super Fine / Fingering", number: "1", typicalPer100g: 400, rangeLow: 350, rangeHigh: "500" },
  { label: "Fine / Sport", number: "2", typicalPer100g: 300, rangeLow: 270, rangeHigh: "350" },
  { label: "Light / DK", number: "3", typicalPer100g: 250, rangeLow: 225, rangeHigh: "280" },
  { label: "Medium / Worsted", number: "4", typicalPer100g: 200, rangeLow: 180, rangeHigh: "240" },
  { label: "Bulky", number: "5", typicalPer100g: 130, rangeLow: 120, rangeHigh: "160" },
  { label: "Super Bulky", number: "6", typicalPer100g: 80, rangeLow: 60, rangeHigh: "120" },
  { label: "Jumbo", number: "7", typicalPer100g: 40, rangeLow: 0, rangeHigh: "60" },
];

// ── COMPONENT ─────────────────────────────────────────────────────

type Mode = "partial" | "reference";

export default function StashEstimatorTool() {
  const [mode, setMode] = useState<Mode>("partial");

  // Mode 1: Partial skein
  const [partialWeight, setPartialWeight] = useState("");
  const [fullWeight, setFullWeight] = useState("");
  const [fullYardage, setFullYardage] = useState("");

  // Mode 2: Quick estimate
  const [quickWeight, setQuickWeight] = useState("");
  const [quickCategory, setQuickCategory] = useState("");

  // ── PARTIAL SKEIN RESULT ──────────────────────────────────────
  const partialResult = useMemo(() => {
    const pw = parseFloat(partialWeight) || 0;
    const fw = parseFloat(fullWeight) || 0;
    const fy = parseFloat(fullYardage) || 0;
    if (pw <= 0 || fw <= 0 || fy <= 0) return null;

    const remainingYards = (pw / fw) * fy;
    const pctRemaining = (pw / fw) * 100;

    return {
      remainingYards: +remainingYards.toFixed(1),
      pctRemaining: +pctRemaining.toFixed(1),
    };
  }, [partialWeight, fullWeight, fullYardage]);

  // ── QUICK ESTIMATE RESULT ─────────────────────────────────────
  const quickResult = useMemo(() => {
    const wg = parseFloat(quickWeight) || 0;
    if (wg <= 0 || !quickCategory) return null;

    const yarn = YARN_WEIGHTS.find((y) => y.number === quickCategory);
    if (!yarn) return null;

    const estimatedYards = (wg / 100) * yarn.typicalPer100g;

    return {
      estimatedYards: +estimatedYards.toFixed(1),
      yarn,
    };
  }, [quickWeight, quickCategory]);

  const stickySummary = (() => {
    if (mode === "partial" && partialResult) {
      return `~${partialResult.remainingYards} yards remaining (${partialResult.pctRemaining}%)`;
    }
    if (mode === "reference" && quickResult) {
      return `~${quickResult.estimatedYards} yards (${quickResult.yarn.label})`;
    }
    return "";
  })();

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:inline-flex items-stretch sm:items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 gap-1">
        {([
          ["partial", "Partial Skein Yardage"],
          ["reference", "Yardage Reference"],
        ] as [Mode, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              mode === key
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── PARTIAL SKEIN TAB ─────────────────────────────────── */}
      {mode === "partial" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Weigh your partial skein and enter the original skein details from the label to estimate remaining yardage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">
                Partial skein weight (g)
                <Tooltip text="Weigh your partial skein on a kitchen or postal scale. Subtract the weight of any ball band if included." />
              </label>
              <input
                type="number"
                value={partialWeight}
                onChange={(e) => setPartialWeight(e.target.value)}
                placeholder="e.g. 35"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">
                Full skein weight (g)
                <Tooltip text="The total weight of a full skein, found on the yarn label (e.g., 50g, 100g)." />
              </label>
              <input
                type="number"
                value={fullWeight}
                onChange={(e) => setFullWeight(e.target.value)}
                placeholder="e.g. 100"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">
                Full skein yardage (yds)
                <Tooltip text="The total yardage of a full skein, found on the yarn label." />
              </label>
              <input
                type="number"
                value={fullYardage}
                onChange={(e) => setFullYardage(e.target.value)}
                placeholder="e.g. 220"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>

          <StickyResult summary={stickySummary} visible={!!partialResult}>
            {partialResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Estimated Remaining Yardage
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      ~{partialResult.remainingYards}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">yards remaining</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {partialResult.pctRemaining}%
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">of skein remaining</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Fiber content affects weight-to-yardage ratio — cotton is heavier per yard than wool. Always treat as an estimate.
                  </p>
                </div>

                <p className="text-xs text-bark-400 dark:text-bark-500 italic">
                  Always swatch to confirm you have enough yardage for your project.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `~${partialResult.remainingYards} yards remaining (${partialResult.pctRemaining}% of skein)`
                    );
                  }}
                  className="btn-secondary text-sm"
                  aria-label="Copy result to clipboard"
                >
                  Copy result
                </button>
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* ─── REFERENCE TAB ─────────────────────────────────────── */}
      {mode === "reference" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Use this reference table to estimate yardage for unlabeled yarn, or enter a weight and category below for a quick calculation.
          </p>

          {/* Yardage Reference Table */}
          <div className="result-card">
            <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
              Yardage by Yarn Weight Category
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Weight</th>
                    <th className="text-left py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Category</th>
                    <th className="text-right py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Typical yds/100g</th>
                    <th className="text-right py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {YARN_WEIGHTS.map((yarn) => (
                    <tr key={yarn.number}>
                      <td className="py-2 px-3 text-bark-700 dark:text-cream-200 font-medium whitespace-nowrap">
                        {yarn.label}
                      </td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">#{yarn.number}</td>
                      <td className="py-2 px-3 text-bark-700 dark:text-cream-200 text-right font-medium">
                        ~{yarn.typicalPer100g}
                      </td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400 text-right text-xs">
                        {yarn.rangeLow > 0 ? `${yarn.rangeLow}\u2013${yarn.rangeHigh}` : `under ${yarn.rangeHigh}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Estimate Calculator */}
          <div className="space-y-4">
            <h3 className="font-semibold text-bark-700 dark:text-cream-200">
              Quick Estimate
            </h3>
            <p className="text-sm text-bark-400 dark:text-bark-500">
              Enter the weight of your unlabeled yarn and select a yarn weight category.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Yarn weight (g)
                  <Tooltip text="Weigh your yarn on a kitchen or postal scale." />
                </label>
                <input
                  type="number"
                  value={quickWeight}
                  onChange={(e) => setQuickWeight(e.target.value)}
                  placeholder="e.g. 75"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label">Yarn weight category</label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="input"
                >
                  <option value="">Select category...</option>
                  {YARN_WEIGHTS.map((yarn) => (
                    <option key={yarn.number} value={yarn.number}>
                      {yarn.label} (#{yarn.number})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <StickyResult summary={stickySummary} visible={!!quickResult}>
            {quickResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Quick Yardage Estimate
                </h3>

                <div>
                  <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                    ~{quickResult.estimatedYards} yards
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">
                    estimated for {quickWeight}g of {quickResult.yarn.label} weight yarn
                  </p>
                  <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                    Based on ~{quickResult.yarn.typicalPer100g} yds/100g (range: {quickResult.yarn.rangeLow > 0 ? `${quickResult.yarn.rangeLow}\u2013${quickResult.yarn.rangeHigh}` : `under ${quickResult.yarn.rangeHigh}`} yds/100g)
                  </p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    This is a rough estimate based on typical yardage. Actual yardage varies by fiber content, spin, and brand. Cotton and silk are heavier per yard than wool and acrylic.
                  </p>
                </div>

                <p className="text-xs text-bark-400 dark:text-bark-500 italic">
                  Always swatch to confirm you have enough yardage for your project.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `~${quickResult.estimatedYards} yards (${quickWeight}g, ${quickResult.yarn.label} weight)`
                    );
                  }}
                  className="btn-secondary text-sm"
                  aria-label="Copy result to clipboard"
                >
                  Copy result
                </button>
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* Tips */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Stash Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Weigh without the label</strong> — yarn ball bands can add 2-5g, which skews small skein estimates.</li>
          <li><strong>Kitchen scales work great</strong> — accuracy to 1g is plenty for yarn estimation.</li>
          <li><strong>Cotton is heavier than wool</strong> — 50g of cotton yields fewer yards than 50g of wool at the same thickness.</li>
          <li><strong>When in doubt, buy more</strong> — running out mid-project with a discontinued dye lot is every crafter&apos;s nightmare.</li>
        </ul>
      </div>
    </div>
  );
}
