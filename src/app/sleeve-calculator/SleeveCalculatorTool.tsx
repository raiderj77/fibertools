"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";
import { planSleeveTaper } from "@/lib/sleeve-plan.mjs";

export default function SleeveCalculatorTool() {
  const [upperArmCirc, setUpperArmCirc] = useState("");
  const [wristCirc, setWristCirc] = useState("");
  const [sleeveLength, setSleeveLength] = useState("");
  const [cuffRibbing, setCuffRibbing] = useState("");
  const [stsPerInch, setStsPerInch] = useState("");
  const [rowsPerInch, setRowsPerInch] = useState("");

  const hasCompleteInputs = [upperArmCirc, wristCirc, sleeveLength, cuffRibbing, stsPerInch, rowsPerInch]
    .every((value) => value.trim() !== "");

  const plan = useMemo(() => hasCompleteInputs ? planSleeveTaper({
    upperArmCircumference: Number(upperArmCirc),
    wristCircumference: Number(wristCirc),
    sleeveLength: Number(sleeveLength),
    cuffLength: Number(cuffRibbing),
    stitchesPerInch: Number(stsPerInch),
    rowsPerInch: Number(rowsPerInch),
  }) : null, [hasCompleteInputs, upperArmCirc, wristCirc, sleeveLength, cuffRibbing, stsPerInch, rowsPerInch]);

  const result = plan?.status === "ready" ? plan : null;
  const planMessage = plan && plan.status !== "ready" ? plan.message : "";

  const stickySummary = result
    ? `${result.upperArmSts} sts to ${result.cuffSts} sts over ${result.shapingRows} rows`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter pattern-defined dimensions and gauge to compare one paired-decrease interval model for a straight taper.
      </p>

      {/* ── INPUTS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Measurements */}
        <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
          <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Measurements (inches)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">
                Upper arm circ.
                <Tooltip text="Use the finished circumference and measurement landmark defined by the selected pattern; the tool does not add ease." />
              </label>
              <input
                type="number"
                aria-label="Upper arm circumference in inches"
                value={upperArmCirc}
                onChange={(e) => setUpperArmCirc(e.target.value)}
                placeholder="13"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">
                Wrist/cuff circ.
                <Tooltip text="Use the finished cuff circumference and landmark defined by the selected pattern; the tool does not add ease." />
              </label>
              <input
                type="number"
                aria-label="Wrist or cuff circumference in inches"
                value={wristCirc}
                onChange={(e) => setWristCirc(e.target.value)}
                placeholder="8"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">
                Sleeve length
                <Tooltip text="Use the exact length definition from the selected pattern. The model later subtracts the entered cuff plus two fixed one-inch exclusions." />
              </label>
              <input
                type="number"
                aria-label="Sleeve length in inches"
                value={sleeveLength}
                onChange={(e) => setSleeveLength(e.target.value)}
                placeholder="18"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">
                Cuff ribbing
                <Tooltip text="Length of ribbing or cuff pattern at the bottom of the sleeve, in inches." />
              </label>
              <input
                type="number"
                aria-label="Cuff ribbing length in inches"
                value={cuffRibbing}
                onChange={(e) => setCuffRibbing(e.target.value)}
                placeholder="2"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
          <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Your Gauge (per inch)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Stitches/inch</label>
              <input
                type="number"
                aria-label="Stitches per inch"
                value={stsPerInch}
                onChange={(e) => setStsPerInch(e.target.value)}
                placeholder="4.5"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">Rows/inch</label>
              <input
                type="number"
                aria-label="Rows per inch"
                value={rowsPerInch}
                onChange={(e) => setRowsPerInch(e.target.value)}
                placeholder="6"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>
      </div>

      {planMessage && (
        <div id="sleeve-plan-feedback" role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
          {planMessage}
        </div>
      )}

      {/* ── RESULTS ───────────────────────────────────────────── */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-5">
            <h2 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Paired-Decrease Interval Model
            </h2>

            {/* Key numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.upperArmSts}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">upper arm stitches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.cuffSts}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">cuff stitches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.stsToDecrease}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">total sts to decrease</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                  {result.shapingRows}
                </p>
                <p className="text-xs text-bark-500 dark:text-bark-400">shaping rows</p>
              </div>
            </div>

            {/* Interval counts */}
            <div className="p-4 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
              <p className="font-medium text-bark-800 dark:text-cream-100">
                {result.instruction}
              </p>
              <p className="text-xs text-bark-400 dark:text-bark-500 mt-2">
                ({result.decreaseEvents} decrease events = {result.stsToDecrease} stitches removed, 2 per event)
              </p>
              <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                The displayed intervals add to {result.shapingRows} shaping rows. The calculator does not prescribe their order. Confirm the first event, interval order, and row-count convention with the selected pattern.
              </p>
            </div>

            {/* Technique notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-1">
                  Knitting notation example
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  Pattern must define placement, lean, side, and row counting
                </p>
              </div>
              <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-1">
                  Crochet notation example
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  Pattern must define stitch, placement, edges or round, and row counting
                </p>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              This output does not model ease, a sleeve cap, armhole, pickups, compound shaping, construction, or fit. Compare it with the exact pattern and a representative sample.
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Sleeve paired-decrease interval model: ${result.upperArmSts} sts to ${result.cuffSts} sts.\n${result.instruction}\nVerify measurement definitions, fixed one-inch exclusions, technique, placement, row counting, construction, and fit with the exact pattern.`
                );
              }}
              className="btn-secondary text-sm"
              aria-label="Copy paired-decrease interval model to clipboard"
            >
              Copy model
            </button>
          </div>
        )}
      </StickyResult>

      {/* Quick reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Sleeve Shaping Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Use the pattern&apos;s decrease placement.</strong> Moving an event can change a seam, motif, edge, or visible line.</li>
          <li><strong>Enter pattern-supported finished dimensions.</strong> The calculator does not choose or add ease.</li>
          <li><strong>Check the shaping-zone assumption.</strong> The model subtracts the entered cuff and two fixed one-inch exclusions.</li>
          <li><strong>Check your row gauge carefully.</strong> Small differences in row gauge change how often you decrease and can affect the overall sleeve shape.</li>
        </ul>
      </div>
    </div>
  );
}
