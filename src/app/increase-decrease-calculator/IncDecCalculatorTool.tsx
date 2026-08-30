"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import {
  MAX_DISTRIBUTION_STITCHES,
  planStitchDistribution,
} from "@/lib/stitch-distribution.mjs";

type Mode = "increase" | "decrease";
type Shape = "row" | "round";

export default function IncDecCalculatorTool() {
  const [mode, setMode] = useState<Mode>("increase");
  const [shape, setShape] = useState<Shape>("row");
  const [currentCount, setCurrentCount] = useState("");
  const [targetCount, setTargetCount] = useState("");

  const fieldsComplete = currentCount.trim() !== "" && targetCount.trim() !== "";
  const calculation = useMemo(() => {
    if (!fieldsComplete) return null;
    return planStitchDistribution({
      mode,
      shape,
      current: Number(currentCount),
      target: Number(targetCount),
    });
  }, [currentCount, fieldsComplete, mode, shape, targetCount]);

  const result = calculation?.status === "ready" ? calculation : null;
  const validationMessage = calculation && calculation.status !== "ready" ? calculation.message : "";
  const previewSegments = result?.segments.slice(0, 48) ?? [];

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex flex-wrap gap-4">
        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1" role="group" aria-label="Change direction">
          <button type="button" onClick={() => setMode("increase")}
            aria-pressed={mode === "increase"}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "increase" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            📈 Increase
          </button>
          <button type="button" onClick={() => setMode("decrease")}
            aria-pressed={mode === "decrease"}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "decrease" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            📉 Decrease
          </button>
        </div>

        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1" role="group" aria-label="Row or round">
          <button type="button" onClick={() => setShape("row")}
            aria-pressed={shape === "row"}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${shape === "row" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            ↔️ Flat Row
          </button>
          <button type="button" onClick={() => setShape("round")}
            aria-pressed={shape === "round"}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${shape === "round" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            ⭕ In the Round
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label htmlFor="inc-dec-current" className="label">
            Starting stitch count
            <Tooltip text="How many stitches you have right now on the needle or hook." />
          </label>
          <input id="inc-dec-current" type="number" value={currentCount} onChange={(e) => setCurrentCount(e.target.value)}
            placeholder="84" className="input" min="1" max={MAX_DISTRIBUTION_STITCHES} step="1" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="inc-dec-target" className="label">
            Target count after one row or round
            <Tooltip text="How many stitches the selected single shaping row or round must produce." />
          </label>
          <input id="inc-dec-target" type="number" value={targetCount} onChange={(e) => setTargetCount(e.target.value)}
            placeholder={mode === "increase" ? "96" : "72"} className="input" min="1" max={MAX_DISTRIBUTION_STITCHES} step="1" inputMode="numeric" />
        </div>
      </div>

      {/* Results */}
      <div aria-live="polite" aria-atomic="true">
      {validationMessage ? (
        <div role="alert" className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
          {validationMessage}
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="result-card">
            <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
              {result.mode === "increase" ? "Increase" : "Decrease"} {result.changes} stitches:
              {result.current} → {result.target}
            </p>
            <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
              {shape === "round"
                ? `Use ${result.changes} circular gaps with ${result.minimumPlainSpacing}–${result.maximumPlainSpacing} unchanged stitches before each change.`
                : `Use ${result.gapCount} balanced edge and inter-change gaps with ${result.minimumPlainSpacing}–${result.maximumPlainSpacing} unchanged stitches around ${result.changes} changes.`}
            </p>
          </div>

          {/* Written instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🪡 Knitting</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.knitInstructions)}
                  className="text-sage-600 dark:text-sage-400 text-xs hover:underline" aria-label="Copy knitting instructions">Copy</button>
              </div>
              <p className="text-sm text-bark-600 dark:text-cream-300 font-mono leading-relaxed">
                {result.knitInstructions}
              </p>
            </div>
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🧶 Crochet</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.crochetInstructions)}
                  className="text-sage-600 dark:text-sage-400 text-xs hover:underline" aria-label="Copy crochet instructions">Copy</button>
              </div>
              <p className="text-sm text-bark-600 dark:text-cream-300 font-mono leading-relaxed">
                {result.crochetInstructions}
              </p>
            </div>
          </div>

          {/* Visual diagram */}
          <div>
            <p className="label">Visual Diagram</p>
            <p className="text-xs text-bark-400 dark:text-bark-500 mb-2">
               Green dots show unchanged source stitches; red dots show change events. A flat row includes a final edge gap after its last red dot. Preview is capped at 48 gaps.
            </p>
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl overflow-x-auto">
              <div className="flex flex-wrap gap-0.5" style={{ maxWidth: "100%" }}>
                {previewSegments.map((seg: number, segIdx: number) => (
                  <span key={segIdx} className="inline-flex items-center gap-0.5">
                    {Array.from({ length: Math.min(seg, 20) }).map((_, i) => (
                      <span
                        key={i}
                        className="inline-block w-2.5 h-2.5 rounded-full bg-sage-300 dark:bg-sage-700"
                      />
                    ))}
                    {seg > 20 && <span className="text-xs text-bark-400">…{seg}</span>}
                     {!(shape === "row" && segIdx === result.segments.length - 1) && (
                       <span className="inline-block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mx-0.5" />
                     )}
                  </span>
                ))}
                {result.segments.length > previewSegments.length && (
                   <span className="text-xs text-bark-400">… {result.segments.length - previewSegments.length} more gaps</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-bark-400 dark:text-bark-500">
          Enter your current and target stitch counts above to get instructions.
        </p>
      )}
      </div>

      {/* Tips */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">💡 Tips</h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>KFB is the modeled knitting increase.</strong> Use the increase your pattern specifies if it calls for a different appearance or lean.</li>
          <li><strong>K2tog and SSK have different leans.</strong> Use the decrease and pairing specified by your pattern.</li>
          <li><strong>Flat rows include two edge gaps.</strong> Rounds distribute the same unchanged stitches through circular gaps with no separate start or finish edge.</li>
          <li><strong>Crochet examples</strong> use &ldquo;2 SC in next st&rdquo; and &ldquo;SC2tog.&rdquo; Follow your pattern when it specifies another stitch or placement.</li>
        </ul>
      </div>
    </div>
  );
}
