"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";
import ResultShareButton from "@/components/ResultShareButton";
import { buildCastOnPlan } from "@/lib/cast-on-plan.mjs";
import useToolCompletion from "@/lib/useToolCompletion";

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
  const calculation = useMemo(() => buildCastOnPlan({
    desiredWidth, gaugeStitches, gaugeInches, stitchMultiple,
  }), [desiredWidth, gaugeStitches, gaugeInches, stitchMultiple]);
  const result = calculation.ok ? calculation : null;
  const hasInput = [desiredWidth, gaugeStitches, stitchMultiple].some((value) => value.trim() !== "");


  useToolCompletion("cast-on-calculator", result);

  // ── STICKY SUMMARY ────────────────────────────────────────────
  const stickySummary = result
    ? `Cast on ${result.roundedCastOn} stitches`
    : "";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter your desired width and measured gauge for a planning stitch count. Without a multiple, the count rounds to the nearest whole stitch; with a multiple, it rounds up from the unrounded count.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="label" htmlFor="cast-on-width">Desired Width (in)</label>
          <input
            type="number"
            id="cast-on-width"
            aria-label="Desired width in inches"
            value={desiredWidth}
            onChange={(e) => setDesiredWidth(e.target.value)}
            placeholder="e.g. 50"
            className="input"
            min="0.01"
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label" htmlFor="cast-on-gauge">
            Gauge Stitches
            <Tooltip text="The number of stitches in your gauge swatch measurement." />
          </label>
          <input
            type="number"
            id="cast-on-gauge"
            aria-label="Gauge stitches"
            value={gaugeStitches}
            onChange={(e) => setGaugeStitches(e.target.value)}
            placeholder="e.g. 18"
            className="input"
            min="0.01"
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label" htmlFor="cast-on-span">
            Gauge Over (in)
            <Tooltip text="The width your gauge stitches are measured over. Usually 4 inches." />
          </label>
          <input
            type="number"
            id="cast-on-span"
            aria-label="Gauge measurement in inches"
            value={gaugeInches}
            onChange={(e) => setGaugeInches(e.target.value)}
            placeholder="4"
            className="input"
            min="0.01"
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label" htmlFor="cast-on-multiple">
            Stitch Multiple (optional)
            <Tooltip text="If your stitch pattern repeats every X stitches, enter X here. The cast-on count will round UP to the nearest multiple." />
          </label>
          <input
            type="number"
            id="cast-on-multiple"
            aria-label="Stitch multiple"
            value={stitchMultiple}
            onChange={(e) => setStitchMultiple(e.target.value)}
            placeholder="e.g. 6"
            className="input"
            min="1"
            max="1000"
            step="1"
            inputMode="numeric"
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {hasInput && !calculation.ok && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{calculation.error}</p>}
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
                  {result.roundedCastOn}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  stitches to cast on
                  {result.hasMultiple && result.roundedCastOn !== result.rawCastOn && (
                    <span className="text-xs ml-1">
                      (rounded up from {result.rawCastOn.toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {Number(result.stsPerInch.toPrecision(6))}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  stitches per inch
                </p>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500">
              Modeled width at rounded count: {Number(result.actualWidth.toPrecision(6))} in
            </p>

            <div className="border-t border-cream-300 dark:border-bark-600 pt-4">
              <p className="text-sm text-bark-600 dark:text-cream-300">
                Pattern offsets and edge/selvedge stitches are not included. Add only the extras specified by your pattern and recalculate the resulting width. This planning count does not guarantee finished size.
              </p>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your gauge before casting on.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const count = result.roundedCastOn;
                  navigator.clipboard.writeText(
                    `Cast-on planning count: ${count} stitches. Target width: ${desiredWidth}"; modeled width: ${Number(result.actualWidth.toPrecision(6))}" at ${gaugeStitches} sts / ${gaugeInches}". Pattern offsets and edge stitches are not included.`
                  );
                }}
                className="btn-secondary text-sm"
                aria-label="Copy cast on count to clipboard"
              >
                Copy result
              </button>
              <ResultShareButton toolName="Cast On Calculator" toolSlug="cast-on-calculator" />
            </div>
          </div>
        )}
      </StickyResult>

      {/* Reference Table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Example Project Widths
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Project</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Illustrative Target Width</th>
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
          <li><strong>Finishing can change width.</strong> Base the cast-on on a representative swatch treated under the pattern and product care instructions.</li>
        </ul>
      </div>
    </div>
  );
}
