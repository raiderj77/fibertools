"use client";

import React, { useCallback, useMemo, useState } from "react";
import UnitToggle, { type UnitSystem, useSavedUnits } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";
import RavelryPatterns from "@/components/RavelryPatterns";
import ResultShareButton from "@/components/ResultShareButton";
import PlanningPackResultCta from "@/components/PlanningPackResultCta";
import {
  calculateMeasuredSkeinPurchase,
  calculateMeasuredSwatchYarn,
  calculatePartialSkeinLength,
  YARN_ESTIMATE_LIMITS,
} from "@/lib/yarn-swatch-estimate.mjs";
import useToolCompletion from "@/lib/useToolCompletion";

type Mode = "quick" | "precise";
type ProjectType = "blanket" | "scarf" | "wrap" | "other";
type Craft = "knit" | "crochet";

const PROJECT_LABELS: Record<ProjectType, string> = {
  blanket: "Blanket or flat panel",
  scarf: "Scarf",
  wrap: "Rectangular wrap",
  other: "Other flat rectangle",
};

const SIZE_PRESETS = [
  { label: "Custom dimensions", widthIn: null, lengthIn: null },
  { label: "Baby blanket (30 × 36 in)", widthIn: 30, lengthIn: 36 },
  { label: "Throw (50 × 60 in)", widthIn: 50, lengthIn: 60 },
  { label: "Scarf (8 × 70 in)", widthIn: 8, lengthIn: 70 },
] as const;

const YARN_WEIGHTS = [
  ["lace", "0 – Lace"],
  ["fingering", "1 – Fingering / Sock"],
  ["sport", "2 – Sport / Baby"],
  ["dk", "3 – DK / Light Worsted"],
  ["worsted", "4 – Worsted / Aran"],
  ["bulky", "5 – Bulky / Chunky"],
  ["superbulky", "6 – Super Bulky"],
  ["jumbo", "7 – Jumbo"],
] as const;

const METERS_PER_YARD = 0.9144;

function convertInput(value: string, factor: number) {
  if (!value.trim()) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  return String(Number((parsed * factor).toFixed(2)));
}

function complete(values: string[]) {
  return values.every((value) => value.trim() !== "");
}

function format(value: number) {
  return Number(value.toFixed(1)).toLocaleString();
}

export default function YarnCalculatorTool({ embedded = false }: { embedded?: boolean }) {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mode, setMode] = useState<Mode>("precise");
  const [projectType, setProjectType] = useState<ProjectType>("blanket");
  const [sizePreset, setSizePreset] = useState("2");
  const [targetWidth, setTargetWidth] = useState("50");
  const [targetLength, setTargetLength] = useState("60");
  const [swatchWidth, setSwatchWidth] = useState("");
  const [swatchLength, setSwatchLength] = useState("");
  const [swatchYarnLength, setSwatchYarnLength] = useState("");
  const [allowancePercent, setAllowancePercent] = useState("10");
  const [skeinLength, setSkeinLength] = useState("");
  const [skeinWeight, setSkeinWeight] = useState("");
  const [craft, setCraft] = useState<Craft>("knit");
  const [yarnWeight, setYarnWeight] = useState("worsted");
  const [showPartial, setShowPartial] = useState(false);
  const [partialWeight, setPartialWeight] = useState("");
  const [partialSkeinWeight, setPartialSkeinWeight] = useState("");
  const [partialSkeinLength, setPartialSkeinLength] = useState("");

  const handleUnitsChange = useCallback((nextUnits: UnitSystem) => {
    if (nextUnits === units) return;
    const toMetric = nextUnits === "metric";
    const dimensionFactor = toMetric ? 2.54 : 1 / 2.54;
    const yarnFactor = toMetric ? METERS_PER_YARD : 1 / METERS_PER_YARD;
    const weightFactor = toMetric ? 28.3495 : 1 / 28.3495;
    setTargetWidth((value) => convertInput(value, dimensionFactor));
    setTargetLength((value) => convertInput(value, dimensionFactor));
    setSwatchWidth((value) => convertInput(value, dimensionFactor));
    setSwatchLength((value) => convertInput(value, dimensionFactor));
    setSwatchYarnLength((value) => convertInput(value, yarnFactor));
    setSkeinLength((value) => convertInput(value, yarnFactor));
    setSkeinWeight((value) => convertInput(value, weightFactor));
    setPartialWeight((value) => convertInput(value, weightFactor));
    setPartialSkeinWeight((value) => convertInput(value, weightFactor));
    setPartialSkeinLength((value) => convertInput(value, yarnFactor));
    setUnits(nextUnits);
  }, [units]);

  useSavedUnits(handleUnitsChange, !embedded);

  const estimate = useMemo(() => calculateMeasuredSwatchYarn({
    targetWidth,
    targetLength,
    swatchWidth,
    swatchLength,
    swatchYarnLength,
    allowancePercent: allowancePercent.trim() === "" ? Number.NaN : Number(allowancePercent),
  }), [targetWidth, targetLength, swatchWidth, swatchLength, swatchYarnLength, allowancePercent]);

  const result = useMemo(() => {
    if (!estimate) return null;
    const purchase = mode === "precise"
      ? calculateMeasuredSkeinPurchase({
          lengthNeeded: estimate.plannedLength,
          skeinLength,
          skeinWeight,
          units,
        })
      : null;
    if (mode === "precise" && !purchase) return null;
    return { ...estimate, purchase };
  }, [estimate, mode, skeinLength, skeinWeight, units]);

  useToolCompletion("yarn-calculator", result, !embedded && hasInteracted && Boolean(result));

  const partialResult = useMemo(() => calculatePartialSkeinLength({
    partialWeight,
    fullWeight: partialSkeinWeight,
    fullLength: partialSkeinLength,
    units,
  }), [partialWeight, partialSkeinWeight, partialSkeinLength, units]);

  const dimensionLabel = units === "metric" ? "cm" : "in";
  const yarnLengthLabel = units === "metric" ? "meters" : "yards";
  const yarnLengthShort = units === "metric" ? "m" : "yd";
  const weightLabel = units === "metric" ? "g" : "oz";
  const estimateFieldsComplete = complete([targetWidth, targetLength, swatchWidth, swatchLength, swatchYarnLength, allowancePercent]);
  const purchaseFieldsComplete = complete([skeinLength, skeinWeight]);
  const showEstimateError = hasInteracted && estimateFieldsComplete && !estimate;
  const showPurchaseError = hasInteracted && mode === "precise" && estimate !== null && purchaseFieldsComplete && !result;
  const partialFieldsComplete = complete([partialWeight, partialSkeinWeight, partialSkeinLength]);
  const partialWeightTooHigh = Number.isFinite(Number(partialWeight))
    && Number(partialWeight) > Number(partialSkeinWeight)
    && Number(partialSkeinWeight) > 0;
  const stickySummary = result
    ? `${format(result.plannedLength)} ${yarnLengthLabel}${result.purchase ? ` • ${result.purchase.skeins} ${result.purchase.skeins === 1 ? "skein" : "skeins"}` : ""}`
    : "";

  const selectPreset = (value: string) => {
    setSizePreset(value);
    const preset = SIZE_PRESETS[Number(value)];
    if (!preset || preset.widthIn === null || preset.lengthIn === null) return;
    const factor = units === "metric" ? 2.54 : 1;
    setTargetWidth(String(Number((preset.widthIn * factor).toFixed(2))));
    setTargetLength(String(Number((preset.lengthIn * factor).toFixed(2))));
  };

  return (
    <div className="space-y-8" onChangeCapture={() => setHasInteracted(true)}>
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Measured-swatch estimate for flat rectangular fabric</p>
        <p className="mt-1">
          Make a representative swatch with the same yarn, stitch pattern, tools, and tension as the project.
          Measure how much yarn the swatch consumed, then scale that amount by area. This does not model shaping,
          sleeves, seams, borders, three-dimensional pieces, or a change of stitch pattern.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div onClickCapture={() => setHasInteracted(true)}>
          <UnitToggle value={units} onChange={handleUnitsChange} persist={!embedded} />
        </div>
        <div className="flex flex-col gap-1 rounded-xl bg-cream-200 p-1 dark:bg-bark-700 sm:inline-flex sm:flex-row" role="group" aria-label="Calculation method">
          <button type="button" onClick={() => { setHasInteracted(true); setMode("quick"); }} aria-pressed={mode === "quick"} className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium ${mode === "quick" ? "bg-white text-bark-800 shadow-sm dark:bg-bark-600 dark:text-cream-100" : "text-bark-500 dark:text-bark-400"}`}>
            Yarn length only
          </button>
          <button type="button" onClick={() => { setHasInteracted(true); setMode("precise"); }} aria-pressed={mode === "precise"} className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium ${mode === "precise" ? "bg-white text-bark-800 shadow-sm dark:bg-bark-600 dark:text-cream-100" : "text-bark-500 dark:text-bark-400"}`}>
            Yarn length + skeins
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="yarn-project-type" className="label">Project kind</label>
            <select id="yarn-project-type" value={projectType} onChange={(event) => setProjectType(event.target.value as ProjectType)} className="select" aria-describedby="yarn-project-type-help">
              {Object.entries(PROJECT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <p id="yarn-project-type-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">
              This labels pattern suggestions only; the calculation always uses the dimensions below as a flat rectangle.
            </p>
          </div>
          <div>
            <label htmlFor="yarn-project-size" className="label">Starting dimensions</label>
            <select id="yarn-project-size" value={sizePreset} onChange={(event) => selectPreset(event.target.value)} className="select">
              {SIZE_PRESETS.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
            </select>
          </div>

          <fieldset className="space-y-3">
            <legend className="label">Finished flat dimensions</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="yarn-custom-width" className="label text-xs">Width ({dimensionLabel})</label>
                <input id="yarn-custom-width" type="number" value={targetWidth} onChange={(event) => { setTargetWidth(event.target.value); setSizePreset("0"); }} className="input" min="0" max={YARN_ESTIMATE_LIMITS.dimension} step="any" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="yarn-custom-length" className="label text-xs">Length ({dimensionLabel})</label>
                <input id="yarn-custom-length" type="number" value={targetLength} onChange={(event) => { setTargetLength(event.target.value); setSizePreset("0"); }} className="input" min="0" max={YARN_ESTIMATE_LIMITS.dimension} step="any" inputMode="decimal" />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
            <legend className="px-1 text-sm font-semibold text-amber-800 dark:text-amber-200">Measured swatch consumption</legend>
            <p className="text-xs text-bark-600 dark:text-bark-400">Unravel the measured swatch and measure its yarn, or use a separate reliable length measurement.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="yarn-gauge-stitches" className="label text-xs">Swatch width ({dimensionLabel})</label>
                <input id="yarn-gauge-stitches" type="number" value={swatchWidth} onChange={(event) => setSwatchWidth(event.target.value)} className="input text-sm" min="0" max={YARN_ESTIMATE_LIMITS.dimension} step="any" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="yarn-gauge-rows" className="label text-xs">Swatch length ({dimensionLabel})</label>
                <input id="yarn-gauge-rows" type="number" value={swatchLength} onChange={(event) => setSwatchLength(event.target.value)} className="input text-sm" min="0" max={YARN_ESTIMATE_LIMITS.dimension} step="any" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="yarn-gauge-over" className="label text-xs">Yarn used ({yarnLengthShort})</label>
                <input id="yarn-gauge-over" type="number" value={swatchYarnLength} onChange={(event) => setSwatchYarnLength(event.target.value)} className="input text-sm" min="0" max={YARN_ESTIMATE_LIMITS.yarnLength} step="any" inputMode="decimal" />
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="yarn-allowance" className="label">Planning allowance (%)</label>
            <input id="yarn-allowance" type="number" value={allowancePercent} onChange={(event) => setAllowancePercent(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.allowancePercent} step="any" inputMode="decimal" aria-describedby="yarn-allowance-help" />
            <p id="yarn-allowance-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">Optional extra for your own planning. The default 10% is shown separately from the measured base amount.</p>
          </div>
        </div>

        <div className="space-y-5">
          {mode === "precise" ? (
            <fieldset className="space-y-3">
              <legend className="label">Yarn-label values for whole skeins</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="yarn-skein-length" className="label text-xs">{yarnLengthLabel} per skein</label>
                  <input id="yarn-skein-length" type="number" value={skeinLength} onChange={(event) => setSkeinLength(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.yarnLength} step="any" inputMode="decimal" />
                </div>
                <div>
                  <label htmlFor="yarn-skein-weight" className="label text-xs">{weightLabel} per skein</label>
                  <input id="yarn-skein-weight" type="number" value={skeinWeight} onChange={(event) => setSkeinWeight(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.skeinWeight} step="any" inputMode="decimal" />
                </div>
              </div>
            </fieldset>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="yarn-weight" className="label">Yarn weight</label>
              <select id="yarn-weight" value={yarnWeight} onChange={(event) => setYarnWeight(event.target.value)} className="select" aria-describedby="yarn-suggestion-filter-help">
                {YARN_WEIGHTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="yarn-stitch-pattern" className="label">Craft</label>
              <select id="yarn-stitch-pattern" value={craft} onChange={(event) => setCraft(event.target.value as Craft)} className="select" aria-describedby="yarn-suggestion-filter-help">
                <option value="knit">Knitting</option>
                <option value="crochet">Crochet</option>
              </select>
            </div>
          </div>
          <p id="yarn-suggestion-filter-help" className="text-xs text-bark-500 dark:text-bark-400">Yarn weight and craft filter optional pattern suggestions. They do not change the measured-swatch math.</p>

          {showEstimateError || showPurchaseError ? (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
              Enter finite positive measurements within the shown limits. Planning allowance may be 0–100%, and yarn-label values must be positive.
            </p>
          ) : null}

          <StickyResult summary={stickySummary} visible={Boolean(result)}>
            {result ? (
              <div className="result-card space-y-4" aria-live="polite">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Measured-swatch estimate</h3>
                <div>
                  <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{format(result.plannedLength)}</p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">planned {yarnLengthLabel}, including {result.allowancePercent}% allowance</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">{format(result.baseLength)} {yarnLengthShort}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">scaled from measured use, before allowance</p>
                  </div>
                  {result.purchase ? (
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.purchase.skeins}</p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">whole {result.purchase.skeins === 1 ? "skein" : "skeins"} at {result.purchase.displayLength} {yarnLengthShort} each</p>
                    </div>
                  ) : null}
                  {result.purchase ? (
                    <div>
                      <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">{units === "metric" ? `${result.purchase.grams.toLocaleString()} g` : `${result.purchase.ounces} oz`}</p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">weight of the whole skeins, from the label</p>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-bark-500 dark:text-bark-400">Area ratio: {Number(result.areaRatio.toFixed(2))}×. Re-swatch if the yarn, stitch pattern, tools, tension, or finishing changes. Add borders, seams, shaping, and other pieces separately.</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button type="button" onClick={() => navigator.clipboard.writeText(`Measured-swatch yarn estimate: ${format(result.plannedLength)} ${yarnLengthLabel}${result.purchase ? ` / ${result.purchase.skeins} whole skeins` : ""}`)} className="btn-secondary min-h-11 text-sm" aria-label="Copy yarn estimate to clipboard">Copy</button>
                  <button type="button" onClick={() => window.print()} className="btn-secondary min-h-11 text-sm" aria-label="Print yarn estimate">Print</button>
                  {!embedded ? (
                    <ResultShareButton toolName="Yarn Calculator" toolSlug="yarn-calculator" />
                  ) : null}
                </div>
                {!embedded ? <PlanningPackResultCta /> : null}
              </div>
            ) : null}
          </StickyResult>
        </div>
      </div>

      {!embedded ? (
        <>
          <RavelryPatterns weight={yarnWeight} craft={craft} query={projectType === "other" ? "" : projectType} visible={Boolean(result)} />
          <div className="border-t border-cream-300 pt-8 dark:border-bark-700">
            <button type="button" onClick={() => setShowPartial((current) => !current)} className="flex min-h-11 items-center gap-2 text-left font-medium text-sage-600 hover:underline dark:text-sage-400" aria-expanded={showPartial} aria-controls="yarn-partial-panel">
              <span aria-hidden="true">{showPartial ? "▾" : "▸"}</span> Leftover yarn calculator
            </button>
            {showPartial ? (
              <div id="yarn-partial-panel" className="mt-4 space-y-4 rounded-xl bg-cream-100 p-5 dark:bg-bark-800">
                <p className="text-sm text-bark-500 dark:text-bark-400">Weigh the yarn alone, excluding its label, cone, or core. Use the original full-skein weight and length from the same yarn label.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="yarn-partial-weight" className="label text-xs">Partial weight ({weightLabel})</label>
                    <input id="yarn-partial-weight" type="number" value={partialWeight} onChange={(event) => setPartialWeight(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.skeinWeight} step="any" inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="yarn-partial-full-weight" className="label text-xs">Full skein ({weightLabel})</label>
                    <input id="yarn-partial-full-weight" type="number" value={partialSkeinWeight} onChange={(event) => setPartialSkeinWeight(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.skeinWeight} step="any" inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="yarn-partial-full-length" className="label text-xs">Full skein ({yarnLengthShort})</label>
                    <input id="yarn-partial-full-length" type="number" value={partialSkeinLength} onChange={(event) => setPartialSkeinLength(event.target.value)} className="input" min="0" max={YARN_ESTIMATE_LIMITS.yarnLength} step="any" inputMode="decimal" />
                  </div>
                </div>
                {partialFieldsComplete && !partialResult ? (
                  <p role="alert" className="text-sm text-red-700 dark:text-red-300">{partialWeightTooHigh ? "Partial weight cannot be greater than the full-skein weight." : "Enter finite positive values within the shown limits."}</p>
                ) : null}
                {partialResult ? (
                  <div className="result-card" aria-live="polite">
                    <p className="text-lg font-bold text-bark-800 dark:text-cream-100">Approximately {format(partialResult.remainingDisplayLength)} {yarnLengthLabel} remaining</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">{Number(partialResult.percentRemaining.toFixed(1))}% of the labeled skein length by weight</p>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream-300 dark:bg-bark-600" aria-hidden="true">
                      <div className="h-full rounded-full bg-sage-500" style={{ width: `${partialResult.percentRemaining}%` }} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
