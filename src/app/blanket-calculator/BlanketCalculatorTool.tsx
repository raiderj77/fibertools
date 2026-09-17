"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem, useSavedUnits } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";
import ResultShareButton from "@/components/ResultShareButton";
import PlanningPackResultCta from "@/components/PlanningPackResultCta";
import {
  calculateBlanketGaugeCounts,
  convertBlanketMeasurementInput,
  roundBlanketStitchesToMultiple,
  planBlanketStitchWidths,
  formatBlanketDimension,
} from "@/lib/blanket-gauge.mjs";
import useToolCompletion from "@/lib/useToolCompletion";

// ── DATA ──────────────────────────────────────────────────────────

interface BlanketSize {
  label: string;
  widthIn: number;
  lengthIn: number;
  icon: string;
  desc: string;
}

const BLANKET_SIZES: BlanketSize[] = [
  { label: "Lovey", widthIn: 12, lengthIn: 12, icon: "💕", desc: "Security blanket for baby" },
  { label: "Receiving", widthIn: 30, lengthIn: 30, icon: "👶", desc: "Swaddling / hospital" },
  { label: "Stroller", widthIn: 30, lengthIn: 40, icon: "🍼", desc: "Pram / car seat cover" },
  { label: "Baby / Crib", widthIn: 36, lengthIn: 52, icon: "🛏️", desc: "Standard US crib" },
  { label: "Toddler", widthIn: 42, lengthIn: 52, icon: "🧸", desc: "Small child bed" },
  { label: "Lap", widthIn: 36, lengthIn: 48, icon: "🛋️", desc: "Couch / reading" },
  { label: "Throw", widthIn: 50, lengthIn: 60, icon: "🎬", desc: "Sofa throw" },
  { label: "Twin", widthIn: 66, lengthIn: 90, icon: "🛏️", desc: "39×75″ mattress" },
  { label: "Full / Double", widthIn: 80, lengthIn: 90, icon: "🛏️", desc: "54×75″ mattress" },
  { label: "Queen", widthIn: 90, lengthIn: 100, icon: "🛏️", desc: "60×80″ mattress" },
  { label: "King", widthIn: 108, lengthIn: 100, icon: "🛏️", desc: "76×80″ mattress" },
  { label: "California King", widthIn: 104, lengthIn: 104, icon: "🛏️", desc: "72×84″ mattress" },
];

const YARN_WEIGHTS = [
  { key: "lace", label: "0 – Lace" },
  { key: "fingering", label: "1 – Fingering" },
  { key: "sport", label: "2 – Sport" },
  { key: "dk", label: "3 – DK" },
  { key: "worsted", label: "4 – Worsted" },
  { key: "bulky", label: "5 – Bulky" },
  { key: "superbulky", label: "6 – Super Bulky" },
  { key: "jumbo", label: "7 – Jumbo" },
];

function inToCm(i: number) { return +(i * 2.54).toFixed(1); }
function ydsToM(y: number) { return +(y * 0.9144).toFixed(0); }

// ── COMPONENT ─────────────────────────────────────────────────────

export default function BlanketCalculatorTool({ embedded = false }: { embedded?: boolean }) {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [sizeIdx, setSizeIdx] = useState(6); // throw
  const [useCustom, setUseCustom] = useState(false);
  const [customW, setCustomW] = useState("");
  const [customL, setCustomL] = useState("");
  const [yarnWeight, setYarnWeight] = useState("worsted");
  const [pillowTuck, setPillowTuck] = useState(false);
  const [overhang, setOverhang] = useState("0");

  // Gauge
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeRows, setGaugeRows] = useState("");
  const [gaugeOver, setGaugeOver] = useState("4");
  const [swatchWidth, setSwatchWidth] = useState("");
  const [swatchHeight, setSwatchHeight] = useState("");
  const [swatchGrams, setSwatchGrams] = useState("");

  // Stitch multiple
  const [stitchMultiple, setStitchMultiple] = useState("");
  const [multipleExtra, setMultipleExtra] = useState("");

  // Skein info
  const [skeinYards, setSkeinYards] = useState("220");
  const [skeinGrams, setSkeinGrams] = useState("100");
  const [outputChoice, setOutputChoice] = useState<{ key: string; above: boolean } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  const handleUnitsChange = useCallback((nextUnits: UnitSystem) => {
    if (nextUnits === units) return;

    const toMetric = nextUnits === "metric";
    const dimensionFactor = toMetric ? 2.54 : 1 / 2.54;
    setCustomW((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setCustomL((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setOverhang((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setGaugeOver((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setSwatchWidth((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setSwatchHeight((value) => convertBlanketMeasurementInput(value, dimensionFactor));
    setSkeinYards((value) => convertBlanketMeasurementInput(value, toMetric ? 0.9144 : 1 / 0.9144));
    setUnits(nextUnits);
  }, [units]);

  useSavedUnits(handleUnitsChange, !embedded);

  const dim = units === "metric" ? "cm" : "in";
  const yw = YARN_WEIGHTS.find((w) => w.key === yarnWeight) || YARN_WEIGHTS[4];

  const result = useMemo(() => {
    const entered = [overhang, gaugeStitches, gaugeRows, gaugeOver, swatchWidth, swatchHeight,
      swatchGrams, skeinYards, skeinGrams, stitchMultiple, multipleExtra, ...(useCustom ? [customW, customL] : [])];
    if (entered.some((value) => value.trim() !== "" && (!Number.isFinite(Number(value))
      || Number(value) < 0 || Number(value) > 1_000_000))) return null;
    const gaugeGroup = [gaugeStitches, gaugeRows];
    if (gaugeGroup.some((value) => value.trim() !== "") && !gaugeGroup.every((value) => Number(value) > 0)) return null;
    const swatchGroup = [swatchWidth, swatchHeight, swatchGrams];
    if (swatchGroup.some((value) => value.trim() !== "") && ![...swatchGroup, skeinYards, skeinGrams].every((value) => Number(value) > 0)) return null;
    // Get dimensions in inches
    let widthIn: number, lengthIn: number;
    if (useCustom) {
      const w = Number(customW);
      const l = Number(customL);
      if (!(w > 0 && l > 0)) return null;
      widthIn = units === "metric" ? w / 2.54 : w;
      lengthIn = units === "metric" ? l / 2.54 : l;
    } else {
      const size = BLANKET_SIZES[sizeIdx];
      widthIn = size.widthIn;
      lengthIn = size.lengthIn;
    }

    // Add pillow tuck
    if (pillowTuck) lengthIn += 20;

    // Add overhang (both sides for width, one side for length at foot)
    const oh = Number(overhang);
    const ohIn = units === "metric" ? oh / 2.54 : oh;
    widthIn += ohIn * 2;
    lengthIn += ohIn;

    if (![widthIn, lengthIn].every((value) => Number.isFinite(value) && value > 0 && value <= 10_000)) return null;

    // Gauge
    const gOver = parseFloat(gaugeOver);
    const gSt = parseFloat(gaugeStitches) || 0;
    const gRow = parseFloat(gaugeRows) || 0;
    const hasGaugeInput = gSt > 0 && gRow > 0;

    const gaugeCounts = hasGaugeInput ? calculateBlanketGaugeCounts({
      widthIn,
      lengthIn,
      gaugeStitches: gSt,
      gaugeRows: gRow,
      gaugeOver: gOver,
      units,
    }) : null;
    const hasGauge = gaugeCounts !== null;
    if (hasGaugeInput && !hasGauge) return null;

    const stitchesNeeded = gaugeCounts?.stitches ?? 0;
    const rowsNeeded = gaugeCounts?.rows ?? 0;
    let ydsNeeded: number | null = null;
    let totalGrams: number | null = null;

    // Yarn use cannot be derived reliably from gauge or yarn weight alone.
    // Scale the maker's measured swatch consumption to the finished area.
    const swatchWInput = parseFloat(swatchWidth) || 0;
    const swatchHInput = parseFloat(swatchHeight) || 0;
    const swatchWIn = units === "metric" ? swatchWInput / 2.54 : swatchWInput;
    const swatchHIn = units === "metric" ? swatchHInput / 2.54 : swatchHInput;
    const swatchWeight = parseFloat(swatchGrams) || 0;
    const skeinLengthInput = parseFloat(skeinYards) || 0;
    const skeinYds = units === "metric" ? skeinLengthInput / 0.9144 : skeinLengthInput;
    const skeinWeight = parseFloat(skeinGrams) || 0;
    const hasSwatchUsage = swatchWIn > 0 && swatchHIn > 0 && swatchWeight > 0 && skeinYds > 0 && skeinWeight > 0;

    if (hasSwatchUsage) {
      const areaRatio = (widthIn * lengthIn) / (swatchWIn * swatchHIn);
      totalGrams = swatchWeight * areaRatio * 1.1;
      ydsNeeded = totalGrams * (skeinYds / skeinWeight);
      if (![totalGrams, ydsNeeded].every((value) => Number.isFinite(value) && value > 0 && value <= 10_000_000)) return null;
    }

    // Stitch multiple rounding
    const mult = Number(stitchMultiple);
    const extra = Number(multipleExtra);
    if ((stitchMultiple.trim() !== "" && (!Number.isSafeInteger(mult) || mult <= 0))
      || (multipleExtra.trim() !== "" && (stitchMultiple.trim() === "" || mult <= 0))
      || !Number.isSafeInteger(extra)) return null;
    const roundedStitches = roundBlanketStitchesToMultiple(stitchesNeeded, mult, extra);
    if (roundedStitches === null) return null;
    const stitchesPerInch = gSt / (units === "metric" ? gOver / 2.54 : gOver);
    const widthPlan = hasGauge ? planBlanketStitchWidths({ raw: widthIn * stitchesPerInch,
      stitchesPerInch, nearest: roundedStitches, multiple: mult, extra }) : null;

    const skeinsByLength = ydsNeeded === null ? 0 : Math.ceil(ydsNeeded / skeinYds);
    const skeinsByWeight = totalGrams === null ? 0 : Math.ceil(totalGrams / skeinWeight);
    const skeins = hasSwatchUsage ? Math.max(skeinsByLength, skeinsByWeight) : null;
    if (skeins !== null && (!Number.isSafeInteger(skeins) || skeins < 1 || skeins > 1_000_000)) return null;

    return {
      widthIn,
      lengthIn,
      baseWidthIn: widthIn - ohIn * 2,
      baseLengthIn: lengthIn - ohIn - (pillowTuck ? 20 : 0),
      widthPlan,
      modeledLengthIn: hasGauge ? rowsNeeded / (gRow / (units === "metric" ? gOver / 2.54 : gOver)) : null,
      repeatApplied: mult > 0,
      stitches: hasGauge ? roundedStitches : 0,
      stitchesRaw: stitchesNeeded,
      rows: rowsNeeded,
      yards: ydsNeeded === null ? null : Math.round(ydsNeeded),
      meters: ydsNeeded === null ? null : ydsToM(ydsNeeded),
      grams: totalGrams === null ? null : Math.round(totalGrams),
      skeins,
      hasGauge,
      hasSwatchUsage,
      yarnLabel: yw.label,
      hasMultiple: mult > 0 && roundedStitches !== stitchesNeeded,
    };
  }, [units, sizeIdx, useCustom, customW, customL, pillowTuck, overhang, gaugeStitches, gaugeRows, gaugeOver, swatchWidth, swatchHeight, swatchGrams, stitchMultiple, multipleExtra, skeinYards, skeinGrams, yw.label]);

  useToolCompletion("blanket-calculator", result, !embedded && Boolean(result?.hasSwatchUsage));

  // A choice belongs to this exact input set; edits restore the original default.
  const choiceKey = JSON.stringify([units,sizeIdx,useCustom,customW,customL,yarnWeight,pillowTuck,overhang,
    gaugeStitches,gaugeRows,gaugeOver,stitchMultiple,multipleExtra,swatchWidth,swatchHeight,swatchGrams,skeinYards,skeinGrams]);
  useEffect(() => { setOutputChoice(null); setCopyFeedback(""); }, [choiceKey]);
  const plan = result?.widthPlan;
  const hasAlternative = !!plan && plan.belowTarget && plan.atOrAbove !== null && plan.atOrAbove !== plan.nearest;
  const selectAbove = hasAlternative && outputChoice?.key === choiceKey && outputChoice.above;
  const selectedCount = selectAbove ? plan?.atOrAbove : result?.stitches;
  const selectedWidth = selectAbove ? plan?.aboveWidthIn : plan?.nearestWidthIn;
  const selectedRule = selectAbove ? "Meets or exceeds target" : result?.repeatApplied ? "Nearest compatible" : "Nearest whole stitch";
  const sizeText = (width: number, length: number) => `${formatBlanketDimension(width,units)} × ${formatBlanketDimension(length,units)} ${dim}`;
  const projectText = result ? [
    `${useCustom ? "Custom" : BLANKET_SIZES[sizeIdx].label} blanket`,
    `Base size: ${sizeText(result.baseWidthIn,result.baseLengthIn)}`,
    `Calculated target: ${sizeText(result.widthIn,result.lengthIn)}`,
    ...(plan && selectedWidth != null ? [
      `Selected rounding rule: ${selectedRule}; ${selectedCount} stitches; ${result.rows} rows.`,
      `Modeled size: approximately ${sizeText(selectedWidth,result.modeledLengthIn!)}`,
      ...(!selectAbove && plan.belowTarget ? ["Warning: selected modeled width is narrower than requested."] : []),
      ...(result.repeatApplied ? ["Default rule: nearest whole stitch, then nearest compatible repeat; ties upward."] : []),
    ] : ["Stitch and row counts not calculated: enter complete valid gauge."]),
    `Yarn-estimate size basis: ${sizeText(result.widthIn,result.lengthIn)} target rectangle; not rebased to the selected modeled size.`,
    result.hasSwatchUsage ? `Yarn: ${units === "metric" ? result.meters + " m" : result.yards + " yd"}; ${result.grams} g; ${result.skeins} whole skeins; includes 10% planning allowance.` : "Yarn estimate not calculated: supply measured swatch consumption and yarn-label inputs.",
    "Pattern offsets include only your entered extra. No inferred edges, borders or ease; modeled size is not guaranteed."
  ].join("\n") : "";

  const stickySummary = result?.hasSwatchUsage && result.yards !== null && result.meters !== null && result.skeins !== null
    ? `${units === "metric" ? result.meters.toLocaleString() + " m" : result.yards.toLocaleString() + " yds"} • ${result.skeins} skein${result.skeins !== 1 ? "s" : ""}`
    : result ? "Add swatch usage for a yarn estimate" : "";

  return (
    <div className="space-y-8">
      <UnitToggle value={units} onChange={handleUnitsChange} persist={!embedded} />
      {!result && <p role="alert" className="text-rose-700 dark:text-rose-300">Check the dimensions and complete each started gauge or swatch group with positive values. Use whole stitch multiples and extras; extras require a multiple. Values and results must stay within the supported planning range.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-5">
          {/* Size selector */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span id="blanket-size-label" className="label mb-0">Blanket Size</span>
              <label className="flex items-center gap-1.5 text-sm text-bark-500 dark:text-bark-400 cursor-pointer">
                <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="rounded border-bark-300" />
                Custom
              </label>
            </div>

            {useCustom ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="blanket-custom-width" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Width ({dim})</label>
                  <input id="blanket-custom-width" type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="50" className="input" min="0" inputMode="decimal" />
                </div>
                <div>
                  <label htmlFor="blanket-custom-length" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Length ({dim})</label>
                  <input id="blanket-custom-length" type="number" value={customL} onChange={(e) => setCustomL(e.target.value)} placeholder="60" className="input" min="0" inputMode="decimal" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-labelledby="blanket-size-label">
                {BLANKET_SIZES.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    aria-pressed={i === sizeIdx}
                    className={`p-3 rounded-xl text-left text-sm transition-all ${
                      i === sizeIdx
                        ? "bg-sage-100 dark:bg-sage-900/20 border-2 border-sage-400 dark:border-sage-600"
                        : "bg-cream-100 dark:bg-bark-800 border-2 border-transparent hover:border-cream-300 dark:hover:border-bark-600"
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <p className="font-medium text-bark-700 dark:text-cream-200 mt-0.5">{s.label}</p>
                    <p className="text-xs text-bark-400 dark:text-bark-500">
                      {units === "metric"
                        ? `${inToCm(s.widthIn)} × ${inToCm(s.lengthIn)} cm`
                        : `${s.widthIn} × ${s.lengthIn}″`}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bed options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-bark-600 dark:text-cream-300 cursor-pointer">
              <input type="checkbox" checked={pillowTuck} onChange={(e) => setPillowTuck(e.target.checked)} className="rounded border-bark-300" />
              Pillow tuck (+20″/50.8cm)
              <Tooltip text="Adds extra length at the top to fold over pillows." />
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="blanket-overhang" className="text-sm text-bark-600 dark:text-cream-300">Overhang ({dim}):</label>
              <input id="blanket-overhang" type="number" value={overhang} onChange={(e) => setOverhang(e.target.value)} className="input w-20 text-sm" min="0" inputMode="decimal" />
              <Tooltip text="How far the blanket drapes off each side of the bed. Typical: 10-15 inches / 25-38 cm." />
            </div>
          </div>

          {/* Yarn weight */}
          <div>
            <label htmlFor="blanket-yarn-weight" className="label">Yarn Weight</label>
            <select id="blanket-yarn-weight" value={yarnWeight} onChange={(e) => setYarnWeight(e.target.value)} className="select">
              {YARN_WEIGHTS.map((w) => (
                <option key={w.key} value={w.key}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Gauge (optional) */}
          <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
              Your Gauge (optional, for stitch counts)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="blanket-gauge-stitches" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Stitches</label>
                <input id="blanket-gauge-stitches" type="number" value={gaugeStitches} onChange={(e) => setGaugeStitches(e.target.value)} placeholder="18" className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="blanket-gauge-rows" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Rows</label>
                <input id="blanket-gauge-rows" type="number" value={gaugeRows} onChange={(e) => setGaugeRows(e.target.value)} placeholder="24" className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="blanket-gauge-over" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Over ({dim})</label>
                <input id="blanket-gauge-over" type="number" value={gaugeOver} onChange={(e) => setGaugeOver(e.target.value)} placeholder="4" className="input text-sm" min="0" inputMode="decimal" />
              </div>
            </div>
            {/* Stitch multiple */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="blanket-stitch-multiple" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Stitch multiple
                  <Tooltip text="If your stitch pattern repeats every X stitches, enter X." />
                </label>
                <input id="blanket-stitch-multiple" type="number" value={stitchMultiple} onChange={(e) => setStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input text-sm" min="0" inputMode="numeric" />
              </div>
              <div>
                <label htmlFor="blanket-multiple-extra" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">+ extra</label>
                <input id="blanket-multiple-extra" type="number" value={multipleExtra} onChange={(e) => setMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input text-sm" min="0" inputMode="numeric" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl space-y-3">
            <div>
              <p className="text-sm font-medium text-bark-700 dark:text-cream-200">Swatch yarn used (for yardage)</p>
              <p className="text-xs text-bark-500 dark:text-bark-400 mt-1">
                Make the swatch in your actual stitch pattern, then weigh it. The calculator scales that measured use to the blanket area.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="blanket-swatch-width" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Width ({dim})</label>
                <input id="blanket-swatch-width" type="number" value={swatchWidth} onChange={(e) => setSwatchWidth(e.target.value)} placeholder={units === "metric" ? "10" : "4"} className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="blanket-swatch-height" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Height ({dim})</label>
                <input id="blanket-swatch-height" type="number" value={swatchHeight} onChange={(e) => setSwatchHeight(e.target.value)} placeholder={units === "metric" ? "10" : "4"} className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="blanket-swatch-grams" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Grams used</label>
                <input id="blanket-swatch-grams" type="number" value={swatchGrams} onChange={(e) => setSwatchGrams(e.target.value)} placeholder="e.g. 10" className="input text-sm" min="0" inputMode="decimal" />
              </div>
            </div>
          </div>

          {/* Skein info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="blanket-skein-length" className="label text-sm">{units === "metric" ? "Meters" : "Yards"} per skein</label>
              <input id="blanket-skein-length" type="number" value={skeinYards} onChange={(e) => setSkeinYards(e.target.value)} placeholder="220" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="blanket-skein-grams" className="label text-sm">Grams per skein</label>
              <input id="blanket-skein-grams" type="number" value={skeinGrams} onChange={(e) => setSkeinGrams(e.target.value)} placeholder="100" className="input" min="0" inputMode="decimal" />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-bark-400 dark:text-bark-500">
            Enter both values exactly as printed on your yarn label. The result includes a 10% planning buffer and rounds skeins up.
          </p>
        </div>

        {/* Right: results */}
        <div>
          <StickyResult summary={stickySummary} visible={!!result}>
            {result && (
              <div className="result-card space-y-5 sticky top-24">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  {useCustom ? "Custom Blanket" : BLANKET_SIZES[sizeIdx].label}
                </h3>

                <p className="text-sm text-bark-500 dark:text-bark-400">
                  Calculated target size: {sizeText(result.widthIn,result.lengthIn)}
                  {pillowTuck && " (incl. pillow tuck)"}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">Yarn weight: {result.yarnLabel}</p>

                {plan && <div className="space-y-3 print:hidden">
                  <p><strong>{result.repeatApplied ? "Nearest compatible" : "Nearest whole stitch"}:</strong> {plan.nearest} stitches; modeled width approximately {formatBlanketDimension(plan.nearestWidthIn,units)} {dim}.</p>
                  {plan.belowTarget && <p className="text-amber-800 dark:text-amber-200">Nearest result is narrower than requested by approximately {formatBlanketDimension(result.widthIn-plan.nearestWidthIn,units)} {dim}.</p>}
                  {hasAlternative && <>
                    <p><strong>Meets or exceeds target:</strong> {plan.atOrAbove} stitches; modeled width approximately {formatBlanketDimension(plan.aboveWidthIn!,units)} {dim}.</p>
                    <fieldset className="space-y-2">
                      <legend className="font-semibold">Use in copy/print project output</legend>
                      <label className="flex items-center gap-2"><input type="radio" name="blanket-output-rule" checked={!selectAbove} onChange={()=>setOutputChoice({key:choiceKey,above:false})} />Nearest compatible (default)</label>
                      <label className="flex items-center gap-2"><input type="radio" name="blanket-output-rule" checked={!!selectAbove} onChange={()=>setOutputChoice({key:choiceKey,above:true})} />Meets or exceeds target</label>
                    </fieldset>
                    <p className="text-sm">Selection changes copy/print only. Yarn remains based on the calculated target rectangle. Editing inputs restores the nearest default.</p>
                  </>}
                  {result.repeatApplied && plan.atOrAbove === null && <p>No compatible count meets the target within the supported limit of 1,000,000 stitches.</p>}
                  <p>{result.rows} rows; modeled length approximately {formatBlanketDimension(result.modeledLengthIn!,units)} {dim}.</p>
                </div>}
                <div className="rounded-lg border border-cream-300 p-3" data-testid="blanket-project-output">
                  <h4 className="font-semibold">Selected project output</h4>
                  <p className="whitespace-pre-line text-sm">{projectText}</p>
                </div>

                {result.hasSwatchUsage && result.yards !== null && result.meters !== null && result.skeins !== null && result.grams !== null ? <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {units === "metric" ? result.meters.toLocaleString() : result.yards.toLocaleString()}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">{units === "metric" ? "meters" : "yards"} (incl. 10% buffer)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.skeins}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">{result.skeins === 1 ? "skein" : "skeins"}</p>
                  </div>
                </div> : null}

                {result.grams !== null ? <p className="text-sm text-bark-500 dark:text-bark-400">
                  Total weight: ≈ {result.grams.toLocaleString()}g ({(result.grams / 1000).toFixed(1)} kg)
                </p> : null}

                {!result.hasSwatchUsage && (
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Enter the swatch dimensions and grams used to calculate yarn and skeins. Gauge alone cannot measure yarn consumption reliably.
                  </p>
                )}

                {!result.hasGauge && (
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Enter complete measured stitch and row gauge for planning counts.
                  </p>
                )}

                <div className="flex flex-wrap gap-2 no-print">
                  <button type="button" onClick={async () => {
                    try { await navigator.clipboard.writeText(projectText); setCopyFeedback("Project output copied."); }
                    catch { setCopyFeedback("Copy failed. Select and copy the project output above."); }
                  }} className="btn-secondary text-sm">📋 Copy</button>
                  <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print</button>
                  {!embedded ? (
                    <ResultShareButton toolName="Blanket Calculator" toolSlug="blanket-calculator" />
                  ) : null}
                </div>
                <p role="status" className="text-sm no-print">{copyFeedback}</p>
                {!embedded && result.hasSwatchUsage ? <PlanningPackResultCta /> : null}
              </div>
            )}
          </StickyResult>
        </div>
      </div>
    </div>
  );
}
