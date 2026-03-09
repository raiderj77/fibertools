"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

const SIZE_CHART = [
  { label: "Child 2\u20134", range: "21\u201323\"" },
  { label: "Child 6\u20138", range: "25\u201327\"" },
  { label: "Child 10\u201312", range: "28.5\u201330\"" },
  { label: "Adult XS", range: "28\u201330\"" },
  { label: "Adult S", range: "32\u201334\"" },
  { label: "Adult M", range: "36\u201338\"" },
  { label: "Adult L", range: "40\u201342\"" },
  { label: "Adult XL", range: "44\u201346\"" },
  { label: "Adult 2XL", range: "48\u201350\"" },
];

export default function RaglanCalculatorTool() {
  const [chestCirc, setChestCirc] = useState("");
  const [gaugeSts, setGaugeSts] = useState("");
  const [gaugeRows, setGaugeRows] = useState("");
  const [gaugeOver, setGaugeOver] = useState("4");

  const result = useMemo(() => {
    const chest = parseFloat(chestCirc) || 0;
    const gSts = parseFloat(gaugeSts) || 0;
    const gRows = parseFloat(gaugeRows) || 0;
    const gOver = parseFloat(gaugeOver) || 4;

    if (chest <= 0 || gSts <= 0 || gRows <= 0 || gOver <= 0) return null;

    const stsPerInch = gSts / gOver;
    const rowsPerInch = gRows / gOver;

    const chestSts = Math.round(chest * stsPerInch);
    const backSts = Math.round(chestSts * 0.30);
    const frontSts = Math.round(chestSts * 0.30);
    const sleeveStsEach = Math.round(chestSts * 0.15);
    const raglanSeamSts = 4; // 1 each raglan line

    const castOn = frontSts + backSts + sleeveStsEach * 2 + raglanSeamSts;

    // Each increase round adds 8 sts (2 at each of 4 raglan points)
    const increaseRounds = Math.ceil((chestSts - castOn) / 8);
    const yokeRows = increaseRounds * 2; // increase every other round
    const yokeDepth = yokeRows / rowsPerInch;

    return {
      chestSts,
      backSts,
      frontSts,
      sleeveStsEach,
      raglanSeamSts,
      castOn,
      increaseRounds,
      yokeRows,
      yokeDepth: +yokeDepth.toFixed(1),
      stsPerInch: +stsPerInch.toFixed(2),
    };
  }, [chestCirc, gaugeSts, gaugeRows, gaugeOver]);

  const stickySummary = result
    ? `Cast on ${result.castOn} sts \u2022 ${result.increaseRounds} increase rounds`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter your chest measurement and gauge to calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater.
      </p>

      {/* ── INPUTS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Measurement */}
        <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
          <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Body Measurement</p>
          <div>
            <label className="label">
              Chest circumference (inches)
              <Tooltip text="Measure the fullest part of the chest. See the size chart below for standard measurements." />
            </label>
            <input
              type="number"
              value={chestCirc}
              onChange={(e) => setChestCirc(e.target.value)}
              placeholder="36"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* Gauge */}
        <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
          <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Your Gauge</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Stitches</label>
              <input
                type="number"
                value={gaugeSts}
                onChange={(e) => setGaugeSts(e.target.value)}
                placeholder="18"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label text-xs">Rows</label>
              <input
                type="number"
                value={gaugeRows}
                onChange={(e) => setGaugeRows(e.target.value)}
                placeholder="24"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label text-xs">
                Over (inches)
                <Tooltip text="How many inches your gauge swatch covers. Usually 4 inches." />
              </label>
              <input
                type="number"
                value={gaugeOver}
                onChange={(e) => setGaugeOver(e.target.value)}
                placeholder="4"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── RESULTS ───────────────────────────────────────────── */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-5">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Raglan Construction
            </h3>

            {/* Cast on */}
            <div>
              <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                {result.castOn}
              </p>
              <p className="text-sm text-bark-500 dark:text-bark-400">total neck cast on</p>
            </div>

            {/* Stitch distribution */}
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-3">
                Stitch Distribution
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-white dark:bg-bark-700 rounded-lg">
                  <p className="text-xl font-bold text-bark-800 dark:text-cream-100">{result.backSts}</p>
                  <p className="text-xs text-bark-500 dark:text-bark-400">Back</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-bark-700 rounded-lg">
                  <p className="text-xl font-bold text-bark-800 dark:text-cream-100">{result.frontSts}</p>
                  <p className="text-xs text-bark-500 dark:text-bark-400">Front</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-bark-700 rounded-lg">
                  <p className="text-xl font-bold text-bark-800 dark:text-cream-100">{result.sleeveStsEach}</p>
                  <p className="text-xs text-bark-500 dark:text-bark-400">Each Sleeve</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-bark-700 rounded-lg">
                  <p className="text-xl font-bold text-bark-800 dark:text-cream-100">{result.raglanSeamSts}</p>
                  <p className="text-xs text-bark-500 dark:text-bark-400">Raglan Seams</p>
                </div>
              </div>
            </div>

            {/* Yoke details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.increaseRounds}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">increase rounds</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.yokeRows}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">total yoke rows</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.yokeDepth}&Prime;
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">est. yoke depth</p>
              </div>
            </div>

            {/* Construction notes */}
            <div className="space-y-3">
              <div className="p-3 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
                <p className="text-sm text-bark-600 dark:text-cream-300">
                  <strong>Increase every other round:</strong> Work 1 increase on each side of all 4 raglan lines (8 stitches added per increase round).
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Separate body and sleeves at the underarm. Place sleeve stitches on waste yarn or stitch holders. Cast on 2&ndash;6 underarm stitches for each gap.
                </p>
              </div>
              <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  This calculates a standard raglan construction. Custom adjustments for bust darts, short rows, or modified raglan lines are your responsibility.
                </p>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your gauge before casting on.
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Raglan: Cast on ${result.castOn} sts.\nBack: ${result.backSts} | Front: ${result.frontSts} | Each Sleeve: ${result.sleeveStsEach} | 4 raglan seam sts.\n${result.increaseRounds} increase rounds, ${result.yokeRows} total yoke rows, ~${result.yokeDepth}" yoke depth.`
                );
              }}
              className="btn-secondary text-sm"
              aria-label="Copy raglan calculations to clipboard"
            >
              Copy calculations
            </button>
          </div>
        )}
      </StickyResult>

      {/* ── SIZE CHART ────────────────────────────────────────── */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Standard Chest Measurements
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="text-left py-2 pr-4 text-bark-600 dark:text-cream-300 font-medium">Size</th>
                <th className="text-left py-2 text-bark-600 dark:text-cream-300 font-medium">Chest</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.label} className="border-b border-cream-200 dark:border-bark-700 last:border-0">
                  <td className="py-2 pr-4 text-bark-700 dark:text-cream-200">{row.label}</td>
                  <td className="py-2 text-bark-500 dark:text-bark-400">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-bark-400 dark:text-bark-500 mt-3">
          Add 2&ndash;4 inches of positive ease to body measurements for a standard fit. Add more ease for an oversized look.
        </p>
      </div>
    </div>
  );
}
