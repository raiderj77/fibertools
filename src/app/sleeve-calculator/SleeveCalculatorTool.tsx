"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

export default function SleeveCalculatorTool() {
  const [upperArmCirc, setUpperArmCirc] = useState("");
  const [wristCirc, setWristCirc] = useState("");
  const [sleeveLength, setSleeveLength] = useState("");
  const [cuffRibbing, setCuffRibbing] = useState("2");
  const [stsPerInch, setStsPerInch] = useState("");
  const [rowsPerInch, setRowsPerInch] = useState("");

  const result = useMemo(() => {
    const upperArm = parseFloat(upperArmCirc) || 0;
    const wrist = parseFloat(wristCirc) || 0;
    const length = parseFloat(sleeveLength) || 0;
    const ribbing = parseFloat(cuffRibbing) || 0;
    const stGauge = parseFloat(stsPerInch) || 0;
    const rowGauge = parseFloat(rowsPerInch) || 0;

    if (upperArm <= 0 || wrist <= 0 || length <= 0 || stGauge <= 0 || rowGauge <= 0) return null;
    if (upperArm <= wrist) return null;

    // Round to even
    let upperArmSts = Math.round(upperArm * stGauge);
    upperArmSts = Math.round(upperArmSts / 2) * 2;

    let cuffSts = Math.round(wrist * stGauge);
    cuffSts = Math.round(cuffSts / 2) * 2;

    const stsToDecrease = upperArmSts - cuffSts;
    const decreaseEvents = stsToDecrease / 2; // 1 decrease each end = 2 sts per event

    if (decreaseEvents <= 0) return null;

    const shapingInches = length - 1 - ribbing - 1; // 1" buffer each end
    if (shapingInches <= 0) return null;

    let shapingRows = Math.round(shapingInches * rowGauge);
    shapingRows = Math.round(shapingRows / 2) * 2; // Make even

    if (shapingRows <= 0 || decreaseEvents <= 0) return null;

    const everyNRows = Math.floor(shapingRows / decreaseEvents);
    const remainder = shapingRows - everyNRows * decreaseEvents;

    let instruction = "";
    if (remainder === 0) {
      instruction = `Decrease 1 st each end every ${everyNRows} rows, ${decreaseEvents} times.`;
    } else {
      instruction = `Decrease 1 st each end every ${everyNRows} rows ${decreaseEvents - remainder} times, then every ${everyNRows + 1} rows ${remainder} times.`;
    }

    return {
      upperArmSts,
      cuffSts,
      stsToDecrease,
      decreaseEvents,
      shapingRows,
      everyNRows,
      remainder,
      instruction,
    };
  }, [upperArmCirc, wristCirc, sleeveLength, cuffRibbing, stsPerInch, rowsPerInch]);

  const stickySummary = result
    ? `${result.upperArmSts} sts to ${result.cuffSts} sts over ${result.shapingRows} rows`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter your measurements and gauge to get row-by-row decrease instructions for tapered sleeves.
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
                <Tooltip text="Measure the widest part of your upper arm, or where you want the sleeve to start." />
              </label>
              <input
                type="number"
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
                <Tooltip text="Measure around your wrist where the cuff will sit." />
              </label>
              <input
                type="number"
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
                <Tooltip text="Total sleeve length from underarm to cuff edge, in inches." />
              </label>
              <input
                type="number"
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

      {/* ── RESULTS ───────────────────────────────────────────── */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-5">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Sleeve Shaping Instructions
            </h3>

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

            {/* Main instruction */}
            <div className="p-4 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
              <p className="font-medium text-bark-800 dark:text-cream-100">
                {result.instruction}
              </p>
              <p className="text-xs text-bark-400 dark:text-bark-500 mt-2">
                ({result.decreaseEvents} decrease events = {result.stsToDecrease} stitches removed, 2 per event)
              </p>
            </div>

            {/* Technique notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-1">
                  Knitting notation
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  SSK at beginning, K2tog at end of RS rows
                </p>
              </div>
              <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-1">
                  Crochet notation
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  SC2tog at beginning and end of rows
                </p>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your gauge before starting your sleeve.
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Sleeve shaping: ${result.upperArmSts} sts to ${result.cuffSts} sts.\n${result.instruction}\nKnit: SSK at beg, K2tog at end of RS rows.\nCrochet: SC2tog at beg and end of rows.`
                );
              }}
              className="btn-secondary text-sm"
              aria-label="Copy shaping instructions to clipboard"
            >
              Copy instructions
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
          <li><strong>Work decreases 1&ndash;2 stitches in from the edge</strong> for a cleaner seam when joining to the body.</li>
          <li><strong>Ease matters:</strong> Add 1&ndash;2 inches to your body measurements for comfort, or subtract for a fitted look.</li>
          <li><strong>Cuff ribbing is worked after shaping.</strong> The calculator accounts for cuff length separately from the shaping zone.</li>
          <li><strong>Check your row gauge carefully.</strong> Small differences in row gauge change how often you decrease and can affect the overall sleeve shape.</li>
        </ul>
      </div>
    </div>
  );
}
