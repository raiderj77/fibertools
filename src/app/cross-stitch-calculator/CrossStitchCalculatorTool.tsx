"use client";

import { type KeyboardEvent, type ReactNode, useCallback, useMemo, useState } from "react";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";
import {
  calculateCrossStitchFabricCut,
  calculateCrossStitchFlossPlan,
  calculateCrossStitchSize,
  CROSS_STITCH_LIMITS,
} from "@/lib/cross-stitch-planning.mjs";

const FABRIC_COUNTS = [
  { count: 11, name: "Aida 11", basis: "11 squares per inch" },
  { count: 14, name: "Aida 14", basis: "14 squares per inch" },
  { count: 16, name: "Aida 16", basis: "16 squares per inch" },
  { count: 18, name: "Aida 18", basis: "18 squares per inch" },
  { count: 22, name: "Hardanger 22", basis: "22 threads per inch" },
  { count: 25, name: "Evenweave 25", basis: "25 threads per inch" },
  { count: 28, name: "Evenweave 28", basis: "28 threads per inch" },
  { count: 32, name: "Linen 32", basis: "32 threads per inch" },
  { count: 36, name: "Linen 36", basis: "36 threads per inch" },
  { count: 40, name: "Linen 40", basis: "40 threads per inch" },
] as const;

const TABS = [
  { key: "size", label: "Finished size" },
  { key: "thread", label: "Floss planning" },
  { key: "fabric", label: "Fabric cut" },
] as const;

type Tab = (typeof TABS)[number]["key"];
type StitchSpan = 1 | 2;

function convertInput(value: string, factor: number) {
  if (!value.trim()) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  return String(Number((parsed * factor).toFixed(2)));
}

function complete(values: string[]) {
  return values.every((value) => value.trim() !== "");
}

function oneDecimal(value: number) {
  return Number(value.toFixed(1));
}

export default function CrossStitchCalculatorTool() {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [tab, setTab] = useState<Tab>("size");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [patternWidth, setPatternWidth] = useState("");
  const [patternHeight, setPatternHeight] = useState("");
  const [fabricCount, setFabricCount] = useState(14);
  const [stitchSpan, setStitchSpan] = useState<StitchSpan>(1);
  const [margin, setMargin] = useState("3");
  const [fullCrosses, setFullCrosses] = useState("");
  const [workingStrands, setWorkingStrands] = useState("2");
  const [allowancePercent, setAllowancePercent] = useState("40");
  const [skeinLengthMeters, setSkeinLengthMeters] = useState("8");
  const [skeinBundleStrands, setSkeinBundleStrands] = useState("6");

  const handleUnitsChange = useCallback((nextUnits: UnitSystem) => {
    if (nextUnits === units) return;
    setMargin((current) => convertInput(current, nextUnits === "metric" ? 2.54 : 1 / 2.54));
    setUnits(nextUnits);
  }, [units]);

  const sizeResult = useMemo(() => {
    const results = FABRIC_COUNTS.map((fabric) => ({
      ...fabric,
      result: calculateCrossStitchSize({
        widthStitches: patternWidth,
        heightStitches: patternHeight,
        fabricCount: fabric.count,
        stitchSpan,
      }),
    }));
    const primary = results.find((entry) => entry.count === fabricCount)?.result ?? null;
    return primary ? { primary, results } : null;
  }, [patternWidth, patternHeight, fabricCount, stitchSpan]);

  const fabricResult = useMemo(() => calculateCrossStitchFabricCut({
    widthStitches: patternWidth,
    heightStitches: patternHeight,
    fabricCount,
    stitchSpan,
    margin,
    units,
  }), [patternWidth, patternHeight, fabricCount, stitchSpan, margin, units]);

  const threadResult = useMemo(() => calculateCrossStitchFlossPlan({
    fullCrosses,
    fabricCount,
    stitchSpan,
    workingStrands,
    allowancePercent: allowancePercent.trim() === "" ? Number.NaN : Number(allowancePercent),
    skeinLengthMeters,
    skeinBundleStrands,
  }), [
    fullCrosses,
    fabricCount,
    stitchSpan,
    workingStrands,
    allowancePercent,
    skeinLengthMeters,
    skeinBundleStrands,
  ]);

  const dimensionInputsComplete = complete([patternWidth, patternHeight]);
  const threadInputsComplete = complete([
    fullCrosses,
    workingStrands,
    allowancePercent,
    skeinLengthMeters,
    skeinBundleStrands,
  ]);
  const marginInputComplete = margin.trim() !== "";
  const dimensionError = hasInteracted && dimensionInputsComplete && !sizeResult;
  const fabricError = hasInteracted && dimensionInputsComplete && marginInputComplete && !fabricResult;
  const threadError = hasInteracted && threadInputsComplete && !threadResult;
  const selectedFabric = FABRIC_COUNTS.find((fabric) => fabric.count === fabricCount) ?? FABRIC_COUNTS[1];
  const dimensionUnit = units === "metric" ? "cm" : "in";

  const stickySummary = (() => {
    if (tab === "size" && sizeResult) {
      return units === "metric"
        ? `${oneDecimal(sizeResult.primary.widthCentimeters)} × ${oneDecimal(sizeResult.primary.heightCentimeters)} cm`
        : `${oneDecimal(sizeResult.primary.widthInches)} × ${oneDecimal(sizeResult.primary.heightInches)} in`;
    }
    if (tab === "thread" && threadResult) {
      return `${threadResult.wholeSkeins} whole ${threadResult.wholeSkeins === 1 ? "skein" : "skeins"} in this model`;
    }
    if (tab === "fabric" && fabricResult) {
      return units === "metric"
        ? `${oneDecimal(fabricResult.totalWidthCentimeters)} × ${oneDecimal(fabricResult.totalHeightCentimeters)} cm fabric`
        : `${oneDecimal(fabricResult.totalWidthInches)} × ${oneDecimal(fabricResult.totalHeightInches)} in fabric`;
    }
    return "";
  })();

  const changeTab = (nextTab: Tab) => {
    setTab(nextTab);
    setHasInteracted(false);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTab: Tab) => {
    const currentIndex = TABS.findIndex((item) => item.key === currentTab);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;

    event.preventDefault();
    const nextTab = TABS[nextIndex].key;
    changeTab(nextTab);
    document.getElementById(`cross-stitch-tab-${nextTab}`)?.focus();
  };

  return (
    <div className="space-y-6" onChangeCapture={() => setHasInteracted(true)}>
      <UnitToggle value={units} onChange={handleUnitsChange} />

      <div className="flex flex-wrap gap-1 rounded-xl bg-cream-200 p-1 dark:bg-bark-700" role="tablist" aria-label="Cross stitch calculation mode">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            id={`cross-stitch-tab-${key}`}
            type="button"
            role="tab"
            aria-selected={tab === key}
            aria-controls={`cross-stitch-panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => changeTab(key)}
            onKeyDown={(event) => handleTabKeyDown(event, key)}
            className={`min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium ${tab === key ? "bg-white text-bark-800 shadow-sm dark:bg-bark-600 dark:text-cream-100" : "text-bark-500 dark:text-bark-400"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cross-stitch-fabric-count" className="label">Fabric count</label>
          <select
            id="cross-stitch-fabric-count"
            value={fabricCount}
            onChange={(event) => setFabricCount(Number(event.target.value))}
            className="select"
            aria-describedby="cross-stitch-fabric-count-help"
          >
            {FABRIC_COUNTS.map((fabric) => (
              <option key={fabric.count} value={fabric.count}>{fabric.name} — {fabric.basis}</option>
            ))}
          </select>
          <p id="cross-stitch-fabric-count-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">
            Base grid intervals per inch. The stitch span below determines effective stitches per inch.
          </p>
        </div>

        <fieldset>
          <legend className="label">Each full cross spans</legend>
          <div className="space-y-2 rounded-xl border border-cream-300 p-3 dark:border-bark-700">
            <label htmlFor="cross-stitch-span-one" className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-bark-700 dark:text-cream-300">
              <input
                id="cross-stitch-span-one"
                type="radio"
                name="cross-stitch-span"
                value="1"
                checked={stitchSpan === 1}
                onChange={() => setStitchSpan(1)}
              />
              One grid interval (over one)
            </label>
            <label htmlFor="cross-stitch-span-two" className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-bark-700 dark:text-cream-300">
              <input
                id="cross-stitch-span-two"
                type="radio"
                name="cross-stitch-span"
                value="2"
                checked={stitchSpan === 2}
                onChange={() => setStitchSpan(2)}
              />
              Two grid intervals (over two)
            </label>
          </div>
          <p className="mt-1 text-xs text-bark-500 dark:text-bark-400">
            {selectedFabric.name} over {stitchSpan === 1 ? "one" : "two"}: {fabricCount / stitchSpan} full crosses per inch.
          </p>
        </fieldset>
      </div>

      {tab === "size" ? (
        <section id="cross-stitch-panel-size" role="tabpanel" aria-labelledby="cross-stitch-tab-size" className="space-y-6">
          <PatternDimensions
            patternWidth={patternWidth}
            patternHeight={patternHeight}
            setPatternWidth={setPatternWidth}
            setPatternHeight={setPatternHeight}
          />
          {dimensionError ? <InputError>Use whole pattern dimensions from 1 to {CROSS_STITCH_LIMITS.patternStitches.toLocaleString()} stitches.</InputError> : null}

          <StickyResult summary={stickySummary} visible={Boolean(sizeResult)}>
            {sizeResult ? (
              <div className="result-card" aria-live="polite">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Finished design on {selectedFabric.name}, over {stitchSpan === 1 ? "one" : "two"}
                </h3>
                <p className="mt-2 text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {units === "metric"
                    ? `${oneDecimal(sizeResult.primary.widthCentimeters)} × ${oneDecimal(sizeResult.primary.heightCentimeters)} cm`
                    : `${oneDecimal(sizeResult.primary.widthInches)} × ${oneDecimal(sizeResult.primary.heightInches)} in`}
                </p>
                <p className="mt-1 text-sm text-bark-500 dark:text-bark-400">Before any margin or finishing allowance.</p>
              </div>
            ) : null}
          </StickyResult>

          {sizeResult ? (
            <div>
              <h3 className="label">Same stitch span across fabric counts</h3>
              <div className="overflow-x-auto" tabIndex={0} aria-label="Cross stitch finished-size comparison table">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                      <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Fabric</th>
                      <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Effective count</th>
                      <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Width</th>
                      <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Height</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                    {sizeResult.results.map((entry) => entry.result ? (
                      <tr key={entry.count} className={entry.count === fabricCount ? "bg-sage-50 font-medium dark:bg-sage-900/20" : ""}>
                        <td className="px-3 py-2 text-bark-700 dark:text-cream-200">{entry.name}</td>
                        <td className="px-3 py-2 text-bark-500 dark:text-bark-400">{entry.result.effectiveCount} stitches/in</td>
                        <td className="px-3 py-2 text-bark-600 dark:text-cream-300">
                          {units === "metric" ? `${oneDecimal(entry.result.widthCentimeters)} cm` : `${oneDecimal(entry.result.widthInches)} in`}
                        </td>
                        <td className="px-3 py-2 text-bark-600 dark:text-cream-300">
                          {units === "metric" ? `${oneDecimal(entry.result.heightCentimeters)} cm` : `${oneDecimal(entry.result.heightInches)} in`}
                        </td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "thread" ? (
        <section id="cross-stitch-panel-thread" role="tabpanel" aria-labelledby="cross-stitch-tab-thread" className="space-y-6">
          <p className="text-sm text-bark-600 dark:text-bark-400">
            This planning model covers full crosses of one color. It calculates the two visible diagonals,
            then applies your allowance for back travel, starts, stops, tails, and waste. It excludes partial
            crosses, backstitch, knots, beads, and other specialty stitches.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="cross-stitch-full-crosses" className="label">Full crosses in one color</label>
              <input id="cross-stitch-full-crosses" type="number" value={fullCrosses} onChange={(event) => setFullCrosses(event.target.value)} className="input" min="1" max={CROSS_STITCH_LIMITS.threadStitches} step="1" inputMode="numeric" />
            </div>
            <div>
              <label htmlFor="cross-stitch-working-strands" className="label">Strands held together</label>
              <input id="cross-stitch-working-strands" type="number" value={workingStrands} onChange={(event) => setWorkingStrands(event.target.value)} className="input" min="1" max={CROSS_STITCH_LIMITS.strands} step="1" inputMode="numeric" />
            </div>
            <div>
              <label htmlFor="cross-stitch-allowance" className="label">Back-path and finishing allowance (%)</label>
              <input id="cross-stitch-allowance" type="number" value={allowancePercent} onChange={(event) => setAllowancePercent(event.target.value)} className="input" min="0" max={CROSS_STITCH_LIMITS.allowancePercent} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="cross-stitch-skein-length" className="label">Labeled skein length (m)</label>
              <input id="cross-stitch-skein-length" type="number" value={skeinLengthMeters} onChange={(event) => setSkeinLengthMeters(event.target.value)} className="input" min="0.01" max={CROSS_STITCH_LIMITS.skeinLengthMeters} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="cross-stitch-skein-strands" className="label">Strands in the full bundle</label>
              <input id="cross-stitch-skein-strands" type="number" value={skeinBundleStrands} onChange={(event) => setSkeinBundleStrands(event.target.value)} className="input" min="1" max={CROSS_STITCH_LIMITS.strands} step="1" inputMode="numeric" />
            </div>
          </div>

          {threadError ? <InputError>Use finite values within the displayed limits; full crosses and strand counts must be whole positive numbers.</InputError> : null}

          <StickyResult summary={stickySummary} visible={Boolean(threadResult)}>
            {threadResult ? (
              <div className="result-card space-y-4" aria-live="polite">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Floss planning result</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{threadResult.wholeSkeins}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">whole {threadResult.wholeSkeins === 1 ? "skein" : "skeins"} under the entered model</p>
                    <p className="text-xs text-bark-400 dark:text-bark-500">Planning equivalent: {threadResult.skeinEquivalent.toFixed(2)} skeins before rounding up</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">{oneDecimal(threadResult.plannedWorkingPathMeters)} m</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">working-path length with {threadResult.allowancePercent}% allowance</p>
                    <p className="text-xs text-bark-400 dark:text-bark-500">{oneDecimal(threadResult.constituentStrandMeters)} constituent-strand metres</p>
                  </div>
                </div>
                <div className="rounded-lg bg-cream-100 p-3 text-xs text-bark-600 dark:bg-bark-800 dark:text-bark-400">
                  <p>Front path per full cross: {threadResult.frontPathInchesPerCross.toFixed(3)} in at {threadResult.effectiveCount} stitches/in.</p>
                  <p>One entered skein supplies {oneDecimal(threadResult.availableConstituentStrandMetersPerSkein)} constituent-strand metres ({skeinLengthMeters} m × {skeinBundleStrands} strands).</p>
                  <p>The allowance is your planning input, not a measured or universal waste rate. Actual use depends on stitch path, tension, cut lengths, starts, stops, and unused strand remnants.</p>
                </div>
              </div>
            ) : null}
          </StickyResult>
        </section>
      ) : null}

      {tab === "fabric" ? (
        <section id="cross-stitch-panel-fabric" role="tabpanel" aria-labelledby="cross-stitch-tab-fabric" className="space-y-6">
          <PatternDimensions
            patternWidth={patternWidth}
            patternHeight={patternHeight}
            setPatternWidth={setPatternWidth}
            setPatternHeight={setPatternHeight}
          />
          <div className="max-w-sm">
            <label htmlFor="cross-stitch-margin" className="label">Your margin on each side ({dimensionUnit})</label>
            <input id="cross-stitch-margin" type="number" value={margin} onChange={(event) => setMargin(event.target.value)} className="input" min="0.1" max={units === "metric" ? CROSS_STITCH_LIMITS.marginInches * 2.54 : CROSS_STITCH_LIMITS.marginInches} step="any" inputMode="decimal" />
            <p className="mt-1 text-xs text-bark-500 dark:text-bark-400">Enter the positive margin required by your own hoop, frame, or finishing plan.</p>
          </div>

          {fabricError ? <InputError>Use whole positive pattern dimensions and a finite margin greater than zero within the displayed limits.</InputError> : null}

          <StickyResult summary={stickySummary} visible={Boolean(fabricResult)}>
            {fabricResult ? (
              <div className="result-card space-y-3" aria-live="polite">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Fabric cut arithmetic</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-bark-500 dark:text-bark-400">Finished design</p>
                    <p className="text-lg font-semibold text-bark-700 dark:text-cream-200">
                      {units === "metric"
                        ? `${oneDecimal(fabricResult.widthCentimeters)} × ${oneDecimal(fabricResult.heightCentimeters)} cm`
                        : `${oneDecimal(fabricResult.widthInches)} × ${oneDecimal(fabricResult.heightInches)} in`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-bark-500 dark:text-bark-400">Design plus your margin on all sides</p>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {units === "metric"
                        ? `${oneDecimal(fabricResult.totalWidthCentimeters)} × ${oneDecimal(fabricResult.totalHeightCentimeters)} cm`
                        : `${oneDecimal(fabricResult.totalWidthInches)} × ${oneDecimal(fabricResult.totalHeightInches)} in`}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </StickyResult>
        </section>
      ) : null}
    </div>
  );
}

function PatternDimensions({
  patternWidth,
  patternHeight,
  setPatternWidth,
  setPatternHeight,
}: {
  patternWidth: string;
  patternHeight: string;
  setPatternWidth: (value: string) => void;
  setPatternHeight: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label">Pattern dimensions in full crosses</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cross-stitch-pattern-width" className="label text-xs">Width (stitches)</label>
          <input id="cross-stitch-pattern-width" type="number" value={patternWidth} onChange={(event) => setPatternWidth(event.target.value)} className="input" min="1" max={CROSS_STITCH_LIMITS.patternStitches} step="1" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="cross-stitch-pattern-height" className="label text-xs">Height (stitches)</label>
          <input id="cross-stitch-pattern-height" type="number" value={patternHeight} onChange={(event) => setPatternHeight(event.target.value)} className="input" min="1" max={CROSS_STITCH_LIMITS.patternStitches} step="1" inputMode="numeric" />
        </div>
      </div>
    </fieldset>
  );
}

function InputError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
      {children}
    </p>
  );
}
