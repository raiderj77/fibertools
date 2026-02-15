"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

type Mode = "increase" | "decrease";
type Shape = "row" | "round";

export default function IncDecCalculatorTool() {
  const [mode, setMode] = useState<Mode>("increase");
  const [shape, setShape] = useState<Shape>("row");
  const [currentCount, setCurrentCount] = useState("");
  const [targetCount, setTargetCount] = useState("");

  const result = useMemo(() => {
    const current = parseInt(currentCount) || 0;
    const target = parseInt(targetCount) || 0;
    if (current <= 0 || target <= 0 || current === target) return null;

    const isInc = target > current;
    const changes = Math.abs(target - current);
    const sections = changes;

    if (changes >= current && !isInc) return { error: "Cannot decrease more stitches than you have." };
    if (changes >= target && isInc) {
      // Every stitch gets an increase — unusual but valid
    }

    const base = isInc ? current : current;
    // Distribute changes evenly across the row/round
    const spacing = Math.floor(base / sections);
    const remainder = base - spacing * sections;

    // Build stitch-by-stitch pattern
    const segments: number[] = [];
    for (let i = 0; i < sections; i++) {
      segments.push(spacing + (i < remainder ? 1 : 0));
    }

    // For rows: first and last segments may differ (edge stitches)
    // For rounds: uniform distribution
    const incAbbrev = isInc ? "M1" : "k2tog";
    const crochetAbbrev = isInc ? "2sc in next st" : "sc2tog";

    // Generate written instructions (knitting)
    let knitInstructions: string;
    if (shape === "round") {
      // In the round: evenly distributed
      const uniqueSpacings = Array.from(new Set(segments));
      if (uniqueSpacings.length === 1) {
        knitInstructions = `*K${spacing}, ${incAbbrev}* repeat ${sections} times. (${target} sts)`;
      } else {
        const longCount = remainder;
        const shortCount = sections - remainder;
        knitInstructions = `*K${spacing + 1}, ${incAbbrev}* ${longCount} times, *K${spacing}, ${incAbbrev}* ${shortCount} times. (${target} sts)`;
      }
    } else {
      // Flat row: may have edge stitches
      const uniqueSpacings = Array.from(new Set(segments));
      if (uniqueSpacings.length === 1) {
        knitInstructions = `K${spacing}, ${incAbbrev}, *K${spacing}, ${incAbbrev}* repeat ${sections - 1} more times, K to end. (${target} sts)`;
      } else {
        const longCount = remainder;
        const shortCount = sections - remainder;
        knitInstructions = `*K${spacing + 1}, ${incAbbrev}* ${longCount} times, *K${spacing}, ${incAbbrev}* ${shortCount} times, K to end. (${target} sts)`;
      }
    }

    // Crochet version
    let crochetInstructions: string;
    if (shape === "round") {
      const uniqueSpacings = Array.from(new Set(segments));
      if (uniqueSpacings.length === 1) {
        crochetInstructions = `*SC ${spacing}, ${crochetAbbrev}* repeat ${sections} times. (${target} sts)`;
      } else {
        const longCount = remainder;
        const shortCount = sections - remainder;
        crochetInstructions = `*SC ${spacing + 1}, ${crochetAbbrev}* ${longCount} times, *SC ${spacing}, ${crochetAbbrev}* ${shortCount} times. (${target} sts)`;
      }
    } else {
      const uniqueSpacings = Array.from(new Set(segments));
      if (uniqueSpacings.length === 1) {
        crochetInstructions = `SC ${spacing}, ${crochetAbbrev}, *SC ${spacing}, ${crochetAbbrev}* repeat ${sections - 1} more times, SC to end. (${target} sts)`;
      } else {
        const longCount = remainder;
        const shortCount = sections - remainder;
        crochetInstructions = `*SC ${spacing + 1}, ${crochetAbbrev}* ${longCount} times, *SC ${spacing}, ${crochetAbbrev}* ${shortCount} times, SC to end. (${target} sts)`;
      }
    }

    return {
      isInc,
      changes,
      current,
      target,
      spacing,
      segments,
      knitInstructions,
      crochetInstructions,
    };
  }, [currentCount, targetCount, shape, mode]);

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex flex-wrap gap-4">
        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
          <button type="button" onClick={() => setMode("increase")}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "increase" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            📈 Increase
          </button>
          <button type="button" onClick={() => setMode("decrease")}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "decrease" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            📉 Decrease
          </button>
        </div>

        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
          <button type="button" onClick={() => setShape("row")}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${shape === "row" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            ↔️ Flat Row
          </button>
          <button type="button" onClick={() => setShape("round")}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${shape === "round" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
            ⭕ In the Round
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="label">
            Current stitches
            <Tooltip text="How many stitches you have right now on the needle or hook." />
          </label>
          <input type="number" value={currentCount} onChange={(e) => setCurrentCount(e.target.value)}
            placeholder="84" className="input" min="1" inputMode="numeric" />
        </div>
        <div>
          <label className="label">
            Target stitches
            <Tooltip text="How many stitches you need after the increase/decrease row." />
          </label>
          <input type="number" value={targetCount} onChange={(e) => setTargetCount(e.target.value)}
            placeholder={mode === "increase" ? "96" : "72"} className="input" min="1" inputMode="numeric" />
        </div>
      </div>

      {/* Results */}
      {result && "error" in result ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
          {result.error}
        </div>
      ) : result ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="result-card">
            <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
              {result.isInc ? "Increase" : "Decrease"} {result.changes} stitches:
              {result.current} → {result.target}
            </p>
            <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
              {result.isInc ? "Make 1" : "Work 2 together"} every {result.spacing}–{result.spacing + 1} stitches
              ({shape === "round" ? "in the round" : "flat row"})
            </p>
          </div>

          {/* Written instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🪡 Knitting</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.knitInstructions)}
                  className="text-sage-600 dark:text-sage-400 text-xs hover:underline">Copy</button>
              </div>
              <p className="text-sm text-bark-600 dark:text-cream-300 font-mono leading-relaxed">
                {result.knitInstructions}
              </p>
            </div>
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🧶 Crochet</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.crochetInstructions)}
                  className="text-sage-600 dark:text-sage-400 text-xs hover:underline">Copy</button>
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
              Each dot = a stitch. {result.isInc ? "🔴 = increase" : "🔴 = decrease"} position.
            </p>
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl overflow-x-auto">
              <div className="flex flex-wrap gap-0.5" style={{ maxWidth: "100%" }}>
                {result.segments.map((seg, segIdx) => (
                  <span key={segIdx} className="inline-flex items-center gap-0.5">
                    {Array.from({ length: Math.min(seg, 20) }).map((_, i) => (
                      <span
                        key={i}
                        className="inline-block w-2.5 h-2.5 rounded-full bg-sage-300 dark:bg-sage-700"
                      />
                    ))}
                    {seg > 20 && <span className="text-xs text-bark-400">…{seg}</span>}
                    {segIdx < result.segments.length - 1 && (
                      <span className="inline-block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mx-0.5" />
                    )}
                  </span>
                ))}
                {/* Last change marker */}
                <span className="inline-block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mx-0.5" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-bark-400 dark:text-bark-500">
          Enter your current and target stitch counts above to get instructions.
        </p>
      )}

      {/* Tips */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">💡 Tips</h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>M1 (Make 1)</strong> is the most invisible increase. Lift the bar between stitches and knit through the back loop.</li>
          <li><strong>K2tog vs SSK:</strong> K2tog leans right, SSK leans left. Alternate for symmetrical shaping.</li>
          <li><strong>In the round</strong> distributes changes evenly with no edges. For flat rows, changes are offset from the edges.</li>
          <li><strong>Crochet tip:</strong> &ldquo;2 SC in next st&rdquo; for increases, &ldquo;SC2tog&rdquo; for decreases are the most common methods.</li>
        </ul>
      </div>
    </div>
  );
}
