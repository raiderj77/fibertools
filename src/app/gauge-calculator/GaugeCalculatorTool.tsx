"use client";

import { useCallback, useMemo, useState } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem, useSavedUnits } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";
import PlanningPackResultCta from "@/components/PlanningPackResultCta";
import {
  GAUGE_LIMITS,
  calculateGaugeDimensionPlan,
  calculateGaugeResize,
  calculateSwatchGauge,
  convertGaugeMeasurementInput,
  convertStandardGaugeInput,
  getGaugeDisplayLimits,
} from "@/lib/gauge-calculations.mjs";

// ── TYPES ─────────────────────────────────────────────────────────

type Tab = "swatch" | "resize" | "dimensions";

const numberOrNull = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const anyEntered = (...values: string[]) => values.some((value) => value.trim() !== "");
const displayNumber = (value: number, places = 2) => Number(value.toFixed(places));

// ── COMPONENT ─────────────────────────────────────────────────────

export default function GaugeCalculatorTool({ embedded = false }: { embedded?: boolean }) {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [tab, setTab] = useState<Tab>("swatch");
  const [copyFeedback, setCopyFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // Swatch tab
  const [swatchWidth, setSwatchWidth] = useState("");
  const [swatchHeight, setSwatchHeight] = useState("");
  const [swatchStitches, setSwatchStitches] = useState("");
  const [swatchRows, setSwatchRows] = useState("");

  // Resize tab
  const [origGaugeSt, setOrigGaugeSt] = useState("");
  const [origGaugeRow, setOrigGaugeRow] = useState("");
  const [yourGaugeSt, setYourGaugeSt] = useState("");
  const [yourGaugeRow, setYourGaugeRow] = useState("");
  const [origStitches, setOrigStitches] = useState("");
  const [origRows, setOrigRows] = useState("");
  const [stitchMultiple, setStitchMultiple] = useState("");
  const [multipleExtra, setMultipleExtra] = useState("");
  const [origWidthDim, setOrigWidthDim] = useState("");
  const [origHeightDim, setOrigHeightDim] = useState("");

  // Dimensions tab
  const [dimGaugeSt, setDimGaugeSt] = useState("");
  const [dimGaugeRow, setDimGaugeRow] = useState("");
  const [dimGaugeOver, setDimGaugeOver] = useState("4");
  const [desiredWidth, setDesiredWidth] = useState("");
  const [desiredHeight, setDesiredHeight] = useState("");
  const [dimStitchMultiple, setDimStitchMultiple] = useState("");
  const [dimMultipleExtra, setDimMultipleExtra] = useState("");
  const [edgeStitches, setEdgeStitches] = useState("0");
  const [turningChains, setTurningChains] = useState("0");

  const dim = units === "metric" ? "cm" : "in";
  const dimPer = units === "metric" ? "10 cm" : "4 in";
  const displayLimits = getGaugeDisplayLimits(units)!;

  const handleUnitsChange = useCallback((nextUnits: UnitSystem) => {
    if (nextUnits === units) return;

    setSwatchWidth((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setSwatchHeight((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setOrigGaugeSt((value) => convertStandardGaugeInput(value, units, nextUnits));
    setOrigGaugeRow((value) => convertStandardGaugeInput(value, units, nextUnits));
    setYourGaugeSt((value) => convertStandardGaugeInput(value, units, nextUnits));
    setYourGaugeRow((value) => convertStandardGaugeInput(value, units, nextUnits));
    setOrigWidthDim((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setOrigHeightDim((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setDimGaugeOver((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setDesiredWidth((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setDesiredHeight((value) => convertGaugeMeasurementInput(value, units, nextUnits));
    setUnits(nextUnits);
  }, [units]);

  useSavedUnits(handleUnitsChange, !embedded);

  // ── SWATCH RESULTS ──────────────────────────────────────────────
  const swatchAttempted = anyEntered(swatchWidth, swatchHeight, swatchStitches, swatchRows);
  const swatchPlan = useMemo(() => {
    if (!swatchAttempted) return null;
    return calculateSwatchGauge({
      width: numberOrNull(swatchWidth),
      height: numberOrNull(swatchHeight),
      stitches: numberOrNull(swatchStitches),
      rows: numberOrNull(swatchRows),
      standardSpan: units === "metric" ? 10 : 4,
      unitSystem: units,
    });
  }, [swatchAttempted, swatchWidth, swatchHeight, swatchStitches, swatchRows, units]);
  const swatchResult = swatchPlan?.ok ? {
    stPerUnit: displayNumber(swatchPlan.stitchesPerUnit),
    rowPerUnit: displayNumber(swatchPlan.rowsPerUnit),
    stPerStandard: displayNumber(swatchPlan.stitchesPerStandard, 1),
    rowPerStandard: displayNumber(swatchPlan.rowsPerStandard, 1),
  } : null;
  const swatchError = swatchPlan && !swatchPlan.ok ? swatchPlan.error : "";

  // ── RESIZE RESULTS ──────────────────────────────────────────────
  const resizeAttempted = anyEntered(
    origGaugeSt,
    origGaugeRow,
    yourGaugeSt,
    yourGaugeRow,
    origStitches,
    origRows,
    stitchMultiple,
    multipleExtra,
    origWidthDim,
    origHeightDim,
  );
  const resizePlan = useMemo(() => {
    if (!resizeAttempted) return null;
    return calculateGaugeResize({
      originalGaugeStitches: numberOrNull(origGaugeSt),
      originalGaugeRows: numberOrNull(origGaugeRow),
      actualGaugeStitches: numberOrNull(yourGaugeSt),
      actualGaugeRows: numberOrNull(yourGaugeRow),
      originalStitches: numberOrNull(origStitches),
      originalRows: numberOrNull(origRows),
      originalWidth: numberOrNull(origWidthDim),
      originalHeight: numberOrNull(origHeightDim),
      stitchMultiple: numberOrNull(stitchMultiple) ?? 0,
      multipleExtra: numberOrNull(multipleExtra) ?? 0,
      unitSystem: units,
    });
  }, [resizeAttempted, origGaugeSt, origGaugeRow, yourGaugeSt, yourGaugeRow, origStitches, origRows, origWidthDim, origHeightDim, stitchMultiple, multipleExtra, units]);
  const resizeResult = useMemo(() => {
    if (!resizePlan?.ok) return null;
    const origW = resizePlan.originalWidth;
    const origH = resizePlan.originalHeight;
    const yourWidth = resizePlan.modeledWidth === null ? null : displayNumber(resizePlan.modeledWidth, 1);
    const yourHeight = resizePlan.modeledHeight === null ? null : displayNumber(resizePlan.modeledHeight, 1);
    return {
      newStitches: resizePlan.unadjustedStitches,
      proportionalStitches: resizePlan.proportionalStitches,
      roundedStitches: resizePlan.resizedStitches,
      newRows: resizePlan.resizedRows,
      yourWidth,
      yourHeight,
      widthDiff: origW && yourWidth !== null ? displayNumber(yourWidth - origW, 1) : null,
      heightDiff: origH && yourHeight !== null ? displayNumber(yourHeight - origH, 1) : null,
      hasMultiple: (numberOrNull(stitchMultiple) ?? 0) > 0,
      origW,
      origH,
    };
  }, [resizePlan, stitchMultiple]);
  const resizeError = resizePlan && !resizePlan.ok ? resizePlan.error : "";

  // ── DIMENSIONS RESULTS ──────────────────────────────────────────
  const dimensionsAttempted = anyEntered(
    dimGaugeSt,
    dimGaugeRow,
    dimGaugeOver,
    desiredWidth,
    desiredHeight,
    dimStitchMultiple,
    dimMultipleExtra,
    edgeStitches,
    turningChains,
  ) && anyEntered(dimGaugeSt, dimGaugeRow, desiredWidth, desiredHeight, dimStitchMultiple, dimMultipleExtra);
  const dimensionPlan = useMemo(() => {
    if (!dimensionsAttempted) return null;
    return calculateGaugeDimensionPlan({
      gaugeStitches: numberOrNull(dimGaugeSt),
      gaugeRows: numberOrNull(dimGaugeRow),
      gaugeSpan: numberOrNull(dimGaugeOver),
      targetWidth: numberOrNull(desiredWidth),
      targetHeight: numberOrNull(desiredHeight),
      stitchMultiple: numberOrNull(dimStitchMultiple) ?? 0,
      multipleExtra: numberOrNull(dimMultipleExtra) ?? 0,
      edgeStitches: numberOrNull(edgeStitches) ?? 0,
      turningChains: numberOrNull(turningChains) ?? 0,
      unitSystem: units,
    });
  }, [dimensionsAttempted, dimGaugeSt, dimGaugeRow, dimGaugeOver, desiredWidth, desiredHeight, dimStitchMultiple, dimMultipleExtra, edgeStitches, turningChains, units]);
  const dimResult = dimensionPlan?.ok ? {
    stitchesNeeded: Math.ceil(dimensionPlan.rawStitches),
    roundedStitches: dimensionPlan.stitches,
    rowsNeeded: dimensionPlan.rows,
    totalCastOn: dimensionPlan.totalCastOn,
    foundationChain: dimensionPlan.foundationChain,
    actualWidth: displayNumber(dimensionPlan.modeledWidth),
    hasMultiple: (numberOrNull(dimStitchMultiple) ?? 0) > 0,
  } : null;
  const dimensionError = dimensionPlan && !dimensionPlan.ok ? dimensionPlan.error : "";

  // ── STICKY SUMMARY ──────────────────────────────────────────────
  const stickySummary = (() => {
    if (tab === "swatch" && swatchResult) {
      return `${swatchResult.stPerStandard} sts × ${swatchResult.rowPerStandard} rows per ${dimPer}`;
    }
    if (tab === "resize" && resizeResult) {
      const sts = resizeResult.hasMultiple ? resizeResult.roundedStitches : resizeResult.newStitches;
      return `${sts ?? "No stitch result"}${sts !== null ? " stitches" : ""}${resizeResult.newRows !== null && resizeResult.newRows > 0 ? ` • ${resizeResult.newRows} rows` : ""}`;
    }
    if (tab === "dimensions" && dimResult) {
      return `${dimResult.roundedStitches} stitches${dimResult.rowsNeeded !== null && dimResult.rowsNeeded > 0 ? ` • ${dimResult.rowsNeeded} rows` : ""}`;
    }
    return "";
  })();

  const tabs: Array<[Tab, string]> = [
    ["swatch", "📏 Gauge from Swatch"],
    ["resize", "🔄 Scale Counts"],
    ["dimensions", "📐 Width → Stitches"],
  ];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, current: Tab) => {
    const currentIndex = tabs.findIndex(([key]) => key === current);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = tabs[nextIndex][0];
    setTab(nextTab);
    requestAnimationFrame(() => document.getElementById(`gauge-tab-${nextTab}`)?.focus());
  };

  const copyGaugeResult = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback({ ok: true, message: "Gauge result copied." });
    } catch {
      setCopyFeedback({ ok: false, message: "Could not copy the gauge result. Select the result text and copy it manually." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <UnitToggle value={units} onChange={handleUnitsChange} persist={!embedded} />
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:inline-flex items-stretch sm:items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 gap-1" role="tablist" aria-label="Gauge calculation mode">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            id={`gauge-tab-${key}`}
            type="button"
            role="tab"
            aria-selected={tab === key}
            aria-controls={tab === key ? `gauge-panel-${key}` : undefined}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(event) => handleTabKeyDown(event, key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              tab === key
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── SWATCH TAB ─────────────────────────────────────────── */}
      {tab === "swatch" && (
        <div id="gauge-panel-swatch" role="tabpanel" aria-labelledby="gauge-tab-swatch" className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Measure your swatch, count the stitches and rows, and we&apos;ll calculate your gauge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="gauge-swatch-width" className="label">Width ({dim})</label>
              <input
                id="gauge-swatch-width"
                type="number" value={swatchWidth} onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder={units === "metric" ? "10" : "4"} className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal"
              />
            </div>
            <div>
              <label htmlFor="gauge-swatch-height" className="label">Height ({dim})</label>
              <input
                id="gauge-swatch-height"
                type="number" value={swatchHeight} onChange={(e) => setSwatchHeight(e.target.value)}
                placeholder={units === "metric" ? "10" : "4"} className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal"
              />
            </div>
            <div>
              <label htmlFor="gauge-swatch-stitches" className="label">Stitches</label>
              <input
                id="gauge-swatch-stitches"
                type="number" value={swatchStitches} onChange={(e) => setSwatchStitches(e.target.value)}
                placeholder="18" className="input" min="0.01" max={GAUGE_LIMITS.maximumGaugeCount} step="any" inputMode="decimal"
              />
            </div>
            <div>
              <label htmlFor="gauge-swatch-rows" className="label">Rows</label>
              <input
                id="gauge-swatch-rows"
                type="number" value={swatchRows} onChange={(e) => setSwatchRows(e.target.value)}
                placeholder="24" className="input" min="0.01" max={GAUGE_LIMITS.maximumGaugeCount} step="any" inputMode="decimal"
              />
            </div>
          </div>

          {swatchError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300">
              {swatchError}
            </p>
          )}

          <StickyResult summary={stickySummary} visible={!!swatchResult}>
            {swatchResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Your Gauge
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {swatchResult.stPerStandard}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      stitches per {dimPer}
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      ({swatchResult.stPerUnit} per {dim})
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {swatchResult.rowPerStandard}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      rows per {dimPer}
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      ({swatchResult.rowPerUnit} per {dim})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void copyGaugeResult(`Gauge: ${swatchResult.stPerStandard} sts × ${swatchResult.rowPerStandard} rows per ${dimPer}`);
                  }}
                  className="btn-secondary text-sm"
                  aria-label="Copy gauge to clipboard"
                >
                  📋 Copy gauge
                </button>
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* ─── RESIZE TAB ─────────────────────────────────────────── */}
      {tab === "resize" && (
        <div id="gauge-panel-resize" role="tabpanel" aria-labelledby="gauge-tab-resize" className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Enter the pattern&apos;s stated gauge and your measured gauge to proportionally scale the entered stitch and row counts. Review every pattern repeat, shaping step, and finished measurement separately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pattern gauge */}
            <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Pattern Gauge (per {dimPer})</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="gauge-pattern-stitches" className="label text-xs">Stitches</label>
                  <input id="gauge-pattern-stitches" type="number" value={origGaugeSt} onChange={(e) => setOrigGaugeSt(e.target.value)} placeholder="18" className="input" min="0.01" max={displayLimits.maximumStandardGaugeCount} step="any" inputMode="decimal" />
                </div>
                <div>
                  <label htmlFor="gauge-pattern-rows" className="label text-xs">Rows</label>
                  <input id="gauge-pattern-rows" type="number" value={origGaugeRow} onChange={(e) => setOrigGaugeRow(e.target.value)} placeholder="24" className="input" min="0.01" max={displayLimits.maximumStandardGaugeCount} step="any" inputMode="decimal" />
                </div>
              </div>
            </div>

            {/* Your gauge */}
            <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
              <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Your Gauge (per {dimPer})</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="gauge-actual-stitches" className="label text-xs">Stitches</label>
                  <input id="gauge-actual-stitches" type="number" value={yourGaugeSt} onChange={(e) => setYourGaugeSt(e.target.value)} placeholder="20" className="input" min="0.01" max={displayLimits.maximumStandardGaugeCount} step="any" inputMode="decimal" />
                </div>
                <div>
                  <label htmlFor="gauge-actual-rows" className="label text-xs">Rows</label>
                  <input id="gauge-actual-rows" type="number" value={yourGaugeRow} onChange={(e) => setYourGaugeRow(e.target.value)} placeholder="26" className="input" min="0.01" max={displayLimits.maximumStandardGaugeCount} step="any" inputMode="decimal" />
                </div>
              </div>
            </div>
          </div>

          {/* Pattern stitch counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1">
                <label htmlFor="gauge-pattern-count" className="label">Pattern stitches</label>
                <Tooltip text="The stitch count from the original pattern you want to resize." />
              </div>
              <input id="gauge-pattern-count" type="number" value={origStitches} onChange={(e) => setOrigStitches(e.target.value)} placeholder="120" className="input" min="1" max={GAUGE_LIMITS.maximumPatternCount} step="1" inputMode="numeric" />
            </div>
            <div>
              <label htmlFor="gauge-pattern-row-count" className="label">Pattern rows</label>
              <input id="gauge-pattern-row-count" type="number" value={origRows} onChange={(e) => setOrigRows(e.target.value)} placeholder="160" className="input" min="1" max={GAUGE_LIMITS.maximumPatternCount} step="1" inputMode="numeric" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <label htmlFor="gauge-resize-multiple" className="label">Stitch multiple</label>
                <Tooltip text="If your stitch pattern repeats every X stitches (e.g., a 6-stitch cable repeat), enter X. We'll round to the nearest valid count." />
              </div>
              <input id="gauge-resize-multiple" type="number" value={stitchMultiple} onChange={(e) => setStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input" min="1" max={GAUGE_LIMITS.maximumMultiple} step="1" inputMode="numeric" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <label htmlFor="gauge-resize-extra" className="label">+ extra</label>
                <Tooltip text="Extra stitches after the repeat (e.g., 'multiple of 6 + 1' → enter 1 here)." />
              </div>
              <input id="gauge-resize-extra" type="number" value={multipleExtra} onChange={(e) => setMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input" min="0" max={GAUGE_LIMITS.maximumExtra} step="1" inputMode="numeric" />
            </div>
          </div>

          {/* What-if dimensions */}
          <div>
            <div className="flex items-center gap-1">
              <p className="label">Original dimensions ({dim}), optional &ldquo;what if&rdquo; comparison</p>
              <Tooltip text="Enter the pattern's finished dimensions to see how your gauge changes the size." />
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <div>
                <label htmlFor="gauge-original-width" className="label text-xs">Width</label>
                <input id="gauge-original-width" type="number" value={origWidthDim} onChange={(e) => setOrigWidthDim(e.target.value)} placeholder="Width" className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal" />
              </div>
              <div>
                <label htmlFor="gauge-original-height" className="label text-xs">Height</label>
                <input id="gauge-original-height" type="number" value={origHeightDim} onChange={(e) => setOrigHeightDim(e.target.value)} placeholder="Height" className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal" />
              </div>
            </div>
          </div>

          {resizeError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300">
              {resizeError}
            </p>
          )}

          <StickyResult summary={stickySummary} visible={!!resizeResult}>
            {resizeResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Proportional Count Check
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {resizeResult.newStitches !== null && resizeResult.newStitches > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                        {resizeResult.hasMultiple ? resizeResult.roundedStitches : resizeResult.newStitches}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">
                        stitches
                        {resizeResult.hasMultiple && resizeResult.proportionalStitches !== null && resizeResult.roundedStitches !== resizeResult.proportionalStitches && (
                          <span className="text-xs ml-1">(repeat-adjusted from {displayNumber(resizeResult.proportionalStitches)})</span>
                        )}
                      </p>
                    </div>
                  )}
                  {resizeResult.newRows !== null && resizeResult.newRows > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                        {resizeResult.newRows}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">rows</p>
                    </div>
                  )}
                </div>

                {/* What-if comparison */}
                {((resizeResult.origW !== null && resizeResult.origW > 0)
                  || (resizeResult.origH !== null && resizeResult.origH > 0)) && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                      ⚠️ &ldquo;What If&rdquo;, Size at your gauge WITHOUT resizing:
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {resizeResult.origW !== null && resizeResult.origW > 0 && resizeResult.yourWidth !== null && resizeResult.widthDiff !== null && (
                        <div>
                          <p className="text-bark-600 dark:text-cream-300">
                            Width: {resizeResult.yourWidth} {dim}
                            <span className={`ml-1 font-medium ${resizeResult.widthDiff > 0 ? "text-rose-500" : resizeResult.widthDiff < 0 ? "text-blue-500" : "text-sage-500"}`}>
                              ({resizeResult.widthDiff > 0 ? "+" : ""}{resizeResult.widthDiff} {dim})
                            </span>
                          </p>
                          <p className="text-xs text-bark-400 dark:text-bark-500">
                            Pattern calls for {resizeResult.origW} {dim}
                          </p>
                        </div>
                      )}
                      {resizeResult.origH !== null && resizeResult.origH > 0 && resizeResult.yourHeight !== null && resizeResult.heightDiff !== null && (
                        <div>
                          <p className="text-bark-600 dark:text-cream-300">
                            Height: {resizeResult.yourHeight} {dim}
                            <span className={`ml-1 font-medium ${resizeResult.heightDiff > 0 ? "text-rose-500" : resizeResult.heightDiff < 0 ? "text-blue-500" : "text-sage-500"}`}>
                              ({resizeResult.heightDiff > 0 ? "+" : ""}{resizeResult.heightDiff} {dim})
                            </span>
                          </p>
                          <p className="text-xs text-bark-400 dark:text-bark-500">
                            Pattern calls for {resizeResult.origH} {dim}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* ─── DIMENSIONS TAB ──────────────────────────────────────── */}
      {tab === "dimensions" && (
        <div id="gauge-panel-dimensions" role="tabpanel" aria-labelledby="gauge-tab-dimensions" className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Enter a representative gauge and target size to calculate an at-or-above width checkpoint. Pattern repeats, edge treatment, shaping, and fit still require separate review.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Gauge */}
              <div>
                <p className="label">Your Gauge</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="gauge-dimension-stitches" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Stitches</label>
                    <input id="gauge-dimension-stitches" type="number" value={dimGaugeSt} onChange={(e) => setDimGaugeSt(e.target.value)} placeholder="18" className="input" min="0.01" max={GAUGE_LIMITS.maximumGaugeCount} step="any" inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="gauge-dimension-rows" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Rows</label>
                    <input id="gauge-dimension-rows" type="number" value={dimGaugeRow} onChange={(e) => setDimGaugeRow(e.target.value)} placeholder="24" className="input" min="0.01" max={GAUGE_LIMITS.maximumGaugeCount} step="any" inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="gauge-dimension-over" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Over ({dim})</label>
                    <input id="gauge-dimension-over" type="number" value={dimGaugeOver} onChange={(e) => setDimGaugeOver(e.target.value)} placeholder={units === "metric" ? "10.16" : "4"} className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal" />
                  </div>
                </div>
              </div>

              {/* Desired size */}
              <div>
                <p className="label">Desired Size ({dim})</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gauge-desired-width" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Width</label>
                    <input id="gauge-desired-width" type="number" value={desiredWidth} onChange={(e) => setDesiredWidth(e.target.value)} placeholder="50" className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal" />
                  </div>
                  <div>
                    <label htmlFor="gauge-desired-height" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Height</label>
                    <input id="gauge-desired-height" type="number" value={desiredHeight} onChange={(e) => setDesiredHeight(e.target.value)} placeholder="60" className="input" min="0.01" max={displayLimits.maximumMeasurement} step="any" inputMode="decimal" />
                  </div>
                </div>
              </div>

              {/* Stitch multiple */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="gauge-dimension-multiple" className="label">Stitch multiple</label>
                    <Tooltip text="If your pattern repeats every X stitches, enter X here." />
                  </div>
                  <input id="gauge-dimension-multiple" type="number" value={dimStitchMultiple} onChange={(e) => setDimStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input" min="1" max={GAUGE_LIMITS.maximumMultiple} step="1" inputMode="numeric" />
                </div>
                <div>
                  <label htmlFor="gauge-dimension-extra" className="label">+ extra</label>
                  <input id="gauge-dimension-extra" type="number" value={dimMultipleExtra} onChange={(e) => setDimMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input" min="0" max={GAUGE_LIMITS.maximumExtra} step="1" inputMode="numeric" />
                </div>
              </div>

              {/* Edge / chain */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="gauge-edge-stitches" className="label">Total edge addition (knit)</label>
                    <Tooltip text="Optional total stitches you choose to add after repeat rounding. Follow the selected pattern; this tool does not choose an edge treatment." />
                  </div>
                  <input id="gauge-edge-stitches" type="number" value={edgeStitches} onChange={(e) => setEdgeStitches(e.target.value)} placeholder="0" className="input" min="0" max={GAUGE_LIMITS.maximumExtra} step="1" inputMode="numeric" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="gauge-turning-chains" className="label">User-entered chain addition</label>
                    <Tooltip text="Optional chains you choose to add after repeat rounding. Whether turning chains count as stitches depends on the selected pattern." />
                  </div>
                  <input id="gauge-turning-chains" type="number" value={turningChains} onChange={(e) => setTurningChains(e.target.value)} placeholder="0" className="input" min="0" max={GAUGE_LIMITS.maximumExtra} step="1" inputMode="numeric" />
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              {dimensionError && (
                <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300">
                  {dimensionError}
                </p>
              )}
              <StickyResult summary={stickySummary} visible={!!dimResult}>
                {dimResult && (
                  <div className="result-card space-y-4">
                    <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                      At-or-above width checkpoint
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                          {dimResult.hasMultiple ? dimResult.roundedStitches : dimResult.stitchesNeeded} stitches
                        </p>
                        {dimResult.hasMultiple && dimResult.roundedStitches !== dimResult.stitchesNeeded && (
                          <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                            Raised from {dimResult.stitchesNeeded} to the next compatible repeat count
                          </p>
                        )}
                        {dimResult.actualWidth > 0 && (
                          <p className="text-xs text-bark-400 dark:text-bark-500">
                            Modeled width at this count: {dimResult.actualWidth} {dim}
                          </p>
                        )}
                      </div>

                      {dimResult.rowsNeeded !== null && dimResult.rowsNeeded > 0 && (
                        <div>
                          <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                            {dimResult.rowsNeeded} rows
                          </p>
                        </div>
                      )}

                      <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-2">
                        {(numberOrNull(edgeStitches) ?? 0) > 0 && (
                          <p className="text-sm text-bark-600 dark:text-cream-300">
                            🪡 <strong>With your edge addition:</strong> {dimResult.totalCastOn} stitches
                            <span className="text-xs text-bark-400 dark:text-bark-500 ml-1">
                              ({dimResult.roundedStitches} + {edgeStitches} user-entered edge stitches)
                            </span>
                          </p>
                        )}
                        {(numberOrNull(turningChains) ?? 0) > 0 && (
                          <p className="text-sm text-bark-600 dark:text-cream-300">
                            🧶 <strong>With your chain addition:</strong> {dimResult.foundationChain} chains
                            <span className="text-xs text-bark-400 dark:text-bark-500 ml-1">
                              ({dimResult.roundedStitches} + {turningChains} user-entered chains)
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const parts = [
                          `${dimResult.roundedStitches} stitches for at least ${desiredWidth} ${dim} width`,
                          `modeled width ${dimResult.actualWidth} ${dim}`,
                        ];
                        if (dimResult.rowsNeeded !== null && desiredHeight) {
                          parts.push(`${dimResult.rowsNeeded} rows for at least ${desiredHeight} ${dim} height`);
                        }
                        void copyGaugeResult(parts.join("; "));
                      }}
                      className="btn-secondary text-sm"
                    >
                      📋 Copy
                    </button>
                  </div>
                )}
              </StickyResult>
            </div>
          </div>
        </div>
      )}

      {copyFeedback && (
        <p
          role={copyFeedback.ok ? "status" : "alert"}
          className={`rounded-lg p-3 text-sm ${copyFeedback.ok
            ? "bg-sage-50 text-sage-700 dark:bg-sage-900/20 dark:text-sage-300"
            : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-300"}`}
        >
          {copyFeedback.message}
        </p>
      )}

      {!embedded && (
        (tab === "swatch" && swatchResult) ||
        (tab === "resize" && resizeResult) ||
        (tab === "dimensions" && dimResult)
      ) ? <PlanningPackResultCta /> : null}

      {/* Quick reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          💡 Gauge Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Treat the swatch as directed</strong> by the selected pattern and yarn care instructions before taking the comparison measurement.</li>
          <li><strong>Use the stated measurement area.</strong> Count where the pattern directs and avoid distorted edges unless they are intentionally part of the gauge sample.</li>
          <li><strong>Small differences accumulate.</strong> Compare the resulting count and modeled measurement instead of assuming a universal size effect.</li>
          <li><strong>Check every gauge the instructions use.</strong> Stitch and row density can both affect shaping, repeats, or finished dimensions.</li>
        </ul>
      </div>
    </div>
  );
}
