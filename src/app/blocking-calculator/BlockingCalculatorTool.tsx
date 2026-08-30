"use client";

import { useMemo, useState } from "react";
import StickyResult from "@/components/StickyResult";
import { calculateBlockingDimensions } from "@/lib/blocking-dimensions.mjs";

function optionalNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function formatPercent(value: number) {
  const rounded = value.toFixed(1);
  return value > 0 ? "+" + rounded + "%" : rounded + "%";
}

export default function BlockingCalculatorTool() {
  const [currentWidth, setCurrentWidth] = useState("");
  const [currentLength, setCurrentLength] = useState("");
  const [targetWidth, setTargetWidth] = useState("");
  const [targetLength, setTargetLength] = useState("");
  const hasAnyInput = [currentWidth, currentLength, targetWidth, targetLength]
    .some((value) => value.trim() !== "");

  const result = useMemo(() => calculateBlockingDimensions({
    currentWidth: optionalNumber(currentWidth),
    targetWidth: optionalNumber(targetWidth),
    currentLength: optionalNumber(currentLength),
    targetLength: optionalNumber(targetLength),
  }), [currentLength, currentWidth, targetLength, targetWidth]);

  const readyResult = result.status === "ready" ? result : null;
  const stickySummary = readyResult
    ? readyResult.changes.map((change) => change.label + ": " + formatPercent(change.percentChange)).join(" • ")
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-500 dark:text-bark-400">
        Compare current and requested dimensions. You may complete width, length, or both; use the same
        measurement unit within each pair.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
          <legend className="font-medium text-bark-700 dark:text-cream-200 text-sm px-1">Current dimensions</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs" htmlFor="blocking-current-width">Width</label>
              <input id="blocking-current-width" type="number" value={currentWidth}
                onChange={(event) => setCurrentWidth(event.target.value)} placeholder="e.g. 48"
                className="input" min="0" step="any" inputMode="decimal" />
            </div>
            <div>
              <label className="label text-xs" htmlFor="blocking-current-length">Length</label>
              <input id="blocking-current-length" type="number" value={currentLength}
                onChange={(event) => setCurrentLength(event.target.value)} placeholder="e.g. 60"
                className="input" min="0" step="any" inputMode="decimal" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
          <legend className="font-medium text-sage-700 dark:text-sage-300 text-sm px-1">Requested dimensions</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs" htmlFor="blocking-target-width">Width</label>
              <input id="blocking-target-width" type="number" value={targetWidth}
                onChange={(event) => setTargetWidth(event.target.value)} placeholder="e.g. 50"
                className="input" min="0" step="any" inputMode="decimal" />
            </div>
            <div>
              <label className="label text-xs" htmlFor="blocking-target-length">Length</label>
              <input id="blocking-target-length" type="number" value={targetLength}
                onChange={(event) => setTargetLength(event.target.value)} placeholder="e.g. 57"
                className="input" min="0" step="any" inputMode="decimal" />
            </div>
          </div>
        </fieldset>
      </div>

      {hasAnyInput && result.status === "invalid" && (
        <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">{result.message}</p>
      )}

      <StickyResult summary={stickySummary} visible={!!readyResult}>
        {readyResult && (
          <div className="result-card space-y-4" aria-live="polite">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Requested dimension change
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {readyResult.changes.map((change) => (
                <div key={change.axis} className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                  <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                    {formatPercent(change.percentChange)}
                  </p>
                  <p className="text-sm text-bark-600 dark:text-cream-300">
                    {change.label}: {change.current} → {change.target}
                  </p>
                  <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                    Requested {change.direction} from the current measurement.
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              This is arithmetic, not a prediction that blocking can safely or permanently reach the requested size.
            </p>
          </div>
        )}
      </StickyResult>

      <div className="result-card space-y-3">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200">Choose and test a finishing method</h3>
        <ol className="list-decimal pl-5 text-sm text-bark-500 dark:text-bark-400 space-y-2">
          <li>Follow the project pattern and the yarn, fabric, or garment care instructions.</li>
          <li>Treat a representative swatch using the same method you intend for the finished item.</li>
          <li>Measure the swatch before and after treatment; use that evidence to judge the requested change.</li>
          <li>Use steam or other heat only when the product and appliance instructions permit it. Heat can irreversibly alter some materials.</li>
          <li>If the instructions conflict or the item is valuable, stop and ask the maker or a qualified textile-care professional.</li>
        </ol>
      </div>
    </div>
  );
}
