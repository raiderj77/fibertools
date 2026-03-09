"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

// ── REFERENCE DATA ──────────────────────────────────────────────────

const PROJECT_WIDTHS = [
  { project: "Scarf", range: "6\u20138", inches: "6\u20138 inches" },
  { project: "Cowl (circumference)", range: "24\u201330", inches: "24\u201330 inches" },
  { project: "Baby Blanket", range: "30\u201336", inches: "30\u201336 inches" },
  { project: "Throw Blanket", range: "50", inches: "50 inches" },
  { project: "Dishcloth", range: "8\u20139", inches: "8\u20139 inches" },
  { project: "Pillow Cover", range: "16\u201320", inches: "16\u201320 inches" },
];

// ── COMPONENT ───────────────────────────────────────────────────────

export default function CastOnCalculatorTool() {
  const [desiredWidth, setDesiredWidth] = useState("");
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeInches, setGaugeInches] = useState("4");
  const [stitchMultiple, setStitchMultiple] = useState("");

  // ── RESULTS ─────────────────────────────────────────────────────
  const result = useMemo(() => {
    const width = parseFloat(desiredWidth) || 0;
    const gSt = parseFloat(gaugeStitches) || 0;
    const gIn = parseFloat(gaugeInches) || 0;
    if (width <= 0 || gSt <= 0 || gIn <= 0) return null;

    const stsPerInch = gSt / gIn;
    const rawCastOn = Math.round(width * stsPerInch);

    const mult = parseInt(stitchMultiple) || 0;
    let roundedCastOn = rawCastOn;
    if (mult > 0 && rawCastOn > 0) {
      roundedCastOn = Math.ceil(rawCastOn / mult) * mult;
    }

    const actualWidth = +(roundedCastOn / stsPerInch).toFixed(2);

    return {
      stsPerInch: +stsPerInch.toFixed(2),
      rawCastOn,
      roundedCastOn,
      hasMultiple: mult > 0,
      actualWidth,
    };
  }, [desiredWidth, gaugeStitches, gaugeInches, stitchMultiple]);

  // ── STICKY SUMMARY ────────────────────────────────────────────
  const stickySummary = result
    ? `Cast on ${result.hasMultiple ? result.roundedCastOn : result.rawCastOn} stitches`
    : "";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter your desired width and gauge to find out exactly how many stitches to cast on.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="label">Desired Width (in)</label>
          <input
            type="number"
            value={desiredWidth}
            onChange={(e) => setDesiredWidth(e.target.value)}
            placeholder="e.g. 50"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label">
            Gauge Stitches
            <Tooltip text="The number of stitches in your gauge swatch measurement." />
          </label>
          <input
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
          <label className="label">
            Gauge Over (in)
            <Tooltip text="The width your gauge stitches are measured over. Usually 4 inches." />
          </label>
          <input
            type="number"
            value={gaugeInches}
            onChange={(e) => setGaugeInches(e.target.value)}
            placeholder="4"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label">
            Stitch Multiple (optional)
            <Tooltip text="If your stitch pattern repeats every X stitches, enter X here. The cast-on count will round UP to the nearest multiple." />
          </label>
          <input
            type="number"
            value={stitchMultiple}
            onChange={(e) => setStitchMultiple(e.target.value)}
            placeholder="e.g. 6"
            className="input"
            min="0"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Results */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Cast On Count
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.hasMultiple ? result.roundedCastOn : result.rawCastOn}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  stitches to cast on
                  {result.hasMultiple && result.roundedCastOn !== result.rawCastOn && (
                    <span className="text-xs ml-1">
                      (rounded up from {result.rawCastOn})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.stsPerInch}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  stitches per inch
                </p>
              </div>
            </div>

            {result.hasMultiple && result.roundedCastOn !== result.rawCastOn && (
              <p className="text-xs text-bark-400 dark:text-bark-500">
                Actual width at rounded count: {result.actualWidth} in
              </p>
            )}

            <div className="border-t border-cream-300 dark:border-bark-600 pt-4">
              <p className="text-sm text-bark-600 dark:text-cream-300">
                Many knitters add 2 edge/selvedge stitches for seaming &mdash; adjust as needed for your pattern.
              </p>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your gauge before casting on.
            </p>

            <button
              type="button"
              onClick={() => {
                const count = result.hasMultiple ? result.roundedCastOn : result.rawCastOn;
                navigator.clipboard.writeText(
                  `Cast on ${count} stitches for ${desiredWidth}" width at ${gaugeStitches} sts / ${gaugeInches}"`
                );
              }}
              className="btn-secondary text-sm"
              aria-label="Copy cast on count to clipboard"
            >
              Copy result
            </button>
          </div>
        )}
      </StickyResult>

      {/* Reference Table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Common Project Widths
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Project</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Typical Width</th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_WIDTHS.map((row) => (
                <tr
                  key={row.project}
                  className="border-b border-cream-200 dark:border-bark-700 last:border-0"
                >
                  <td className="py-2 pr-4 text-bark-700 dark:text-cream-200">{row.project}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{row.inches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Cast On Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Always swatch first.</strong> Your actual gauge may differ from the yarn label recommendation.</li>
          <li><strong>Edge stitches</strong> are extra stitches (usually 1 or 2 per side) that create a neat selvedge for seaming or picking up stitches.</li>
          <li><strong>Stitch multiples</strong> ensure your pattern repeat fits evenly. For example, a 4-stitch rib needs a multiple of 4.</li>
          <li><strong>Blocking can change width.</strong> If you plan to block aggressively, consider casting on slightly fewer stitches.</li>
        </ul>
      </div>
    </div>
  );
}
