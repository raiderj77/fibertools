"use client";

import { useMemo, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { calculateDriveRatio } from "@/lib/spinning-ratio.mjs";

export default function SpinningCalculatorTool() {
  const [driveWheel, setDriveWheel] = useState("");
  const [drivenPulley, setDrivenPulley] = useState("");
  const hasCompleteInputs = driveWheel.trim() !== "" && drivenPulley.trim() !== "";

  const result = useMemo(() => hasCompleteInputs ? calculateDriveRatio({
    driveWheelDiameter: Number(driveWheel),
    drivenPulleyDiameter: Number(drivenPulley),
  }) : null, [driveWheel, drivenPulley, hasCompleteInputs]);

  const ratio = result?.status === "ready" ? result.ratio : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-500 dark:text-bark-400">
        Prefer the wheel maker&apos;s documented ratio or effective band-path diameters. If you measure,
        use the drive-band contact path on both wheels in the same unit, not an outer flange.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <div>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="drive-wheel-diameter">Drive wheel band-path diameter</label>
            <Tooltip text="Prefer the maker's effective or pitch diameter. Otherwise measure at the center of the drive band's contact path, using the same unit for both inputs." />
          </div>
          <input
            id="drive-wheel-diameter"
            type="number"
            value={driveWheel}
            onChange={(event) => setDriveWheel(event.target.value)}
            placeholder="e.g. 22"
            className="input"
            min="0"
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="driven-pulley-diameter">Driven pulley band-path diameter</label>
            <Tooltip text="Prefer the maker's effective or pitch diameter for the selected groove. An outer flange can differ from the drive band's contact path. The pulley may drive the flyer or bobbin." />
          </div>
          <input
            id="driven-pulley-diameter"
            type="number"
            value={drivenPulley}
            onChange={(event) => setDrivenPulley(event.target.value)}
            placeholder="e.g. 2.5"
            className="input"
            min="0"
            step="any"
            inputMode="decimal"
          />
        </div>
      </div>

      {result?.status === "invalid" && (
        <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
          {result.message}
        </p>
      )}

      {ratio !== null && (
        <div className="result-card" aria-live="polite">
          <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
            {Number(ratio.toFixed(2))}:1
          </p>
          <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
            Estimated driven-component rotations per full drive-wheel revolution.
          </p>
        </div>
      )}

      <div className="result-card space-y-3">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200">What this result does and does not show</h3>
        <ul className="list-disc pl-5 text-sm text-bark-500 dark:text-bark-400 space-y-2">
          <li>A smaller driven pulley raises the geometric ratio; a larger driven pulley lowers it.</li>
          <li>Published ratios or effective band-path diameters are more reliable than outside-edge measurements, especially with deep or multiple grooves.</li>
          <li>Use your wheel manual to identify the driven component and compatible pulley or whorl settings, especially for bobbin-led or double-drive systems.</li>
          <li>The pulley ratio alone does not determine twists per inch, yarn weight, strength, drafting speed, take-up, or plying balance.</li>
          <li>Compare actual yarn samples made under recorded settings before committing valuable fiber to a project.</li>
        </ul>
      </div>
    </div>
  );
}
