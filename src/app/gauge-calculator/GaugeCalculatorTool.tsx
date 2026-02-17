"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";

// ── TYPES ─────────────────────────────────────────────────────────

type Tab = "swatch" | "resize" | "dimensions";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function GaugeCalculatorTool() {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [tab, setTab] = useState<Tab>("swatch");

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

  // ── SWATCH RESULTS ──────────────────────────────────────────────
  const swatchResult = useMemo(() => {
    const w = parseFloat(swatchWidth) || 0;
    const h = parseFloat(swatchHeight) || 0;
    const st = parseFloat(swatchStitches) || 0;
    const rows = parseFloat(swatchRows) || 0;
    if (w <= 0 || h <= 0 || st <= 0 || rows <= 0) return null;

    const stPerUnit = st / w;
    const rowPerUnit = rows / h;

    // Normalize to standard gauge display (per 4in or 10cm)
    const standard = units === "metric" ? 10 : 4;
    return {
      stPerUnit: +stPerUnit.toFixed(2),
      rowPerUnit: +rowPerUnit.toFixed(2),
      stPerStandard: +(stPerUnit * standard).toFixed(1),
      rowPerStandard: +(rowPerUnit * standard).toFixed(1),
      standard,
    };
  }, [swatchWidth, swatchHeight, swatchStitches, swatchRows, units]);

  // ── RESIZE RESULTS ──────────────────────────────────────────────
  const resizeResult = useMemo(() => {
    const oSt = parseFloat(origGaugeSt) || 0;
    const oRow = parseFloat(origGaugeRow) || 0;
    const ySt = parseFloat(yourGaugeSt) || 0;
    const yRow = parseFloat(yourGaugeRow) || 0;
    const origSt = parseFloat(origStitches) || 0;
    const origR = parseFloat(origRows) || 0;
    if (oSt <= 0 || ySt <= 0) return null;

    const stRatio = oSt / ySt;
    const rowRatio = oRow > 0 && yRow > 0 ? oRow / yRow : 1;

    const newStitches = origSt > 0 ? Math.round(origSt * stRatio) : 0;
    const newRows = origR > 0 ? Math.round(origR * rowRatio) : 0;

    // Stitch multiple rounding
    const mult = parseInt(stitchMultiple) || 0;
    const extra = parseInt(multipleExtra) || 0;
    let roundedStitches = newStitches;
    if (mult > 0 && newStitches > 0) {
      const base = newStitches - extra;
      roundedStitches = Math.round(base / mult) * mult + extra;
      if (roundedStitches <= 0) roundedStitches = mult + extra;
    }

    // What-if dimensions
    const origW = parseFloat(origWidthDim) || 0;
    const origH = parseFloat(origHeightDim) || 0;
    const yourWidth = origW > 0 ? +(origW * stRatio).toFixed(1) : 0;
    const yourHeight = origH > 0 ? +(origH * rowRatio).toFixed(1) : 0;
    const widthDiff = origW > 0 ? +(yourWidth - origW).toFixed(1) : 0;
    const heightDiff = origH > 0 ? +(yourHeight - origH).toFixed(1) : 0;

    return {
      newStitches,
      roundedStitches,
      newRows,
      stRatio: +stRatio.toFixed(3),
      rowRatio: +rowRatio.toFixed(3),
      yourWidth,
      yourHeight,
      widthDiff,
      heightDiff,
      hasMultiple: mult > 0,
      origW,
      origH,
    };
  }, [origGaugeSt, origGaugeRow, yourGaugeSt, yourGaugeRow, origStitches, origRows, stitchMultiple, multipleExtra, origWidthDim, origHeightDim]);

  // ── DIMENSIONS RESULTS ──────────────────────────────────────────
  const dimResult = useMemo(() => {
    const gSt = parseFloat(dimGaugeSt) || 0;
    const gRow = parseFloat(dimGaugeRow) || 0;
    const gOver = parseFloat(dimGaugeOver) || 4;
    const w = parseFloat(desiredWidth) || 0;
    const h = parseFloat(desiredHeight) || 0;
    if (gSt <= 0 || w <= 0) return null;

    const stPerUnit = gSt / gOver;
    const rowPerUnit = gRow > 0 ? gRow / gOver : 0;

    const stitchesNeeded = Math.round(w * stPerUnit);
    const rowsNeeded = h > 0 && rowPerUnit > 0 ? Math.round(h * rowPerUnit) : 0;

    const mult = parseInt(dimStitchMultiple) || 0;
    const extra = parseInt(dimMultipleExtra) || 0;
    let roundedStitches = stitchesNeeded;
    if (mult > 0 && stitchesNeeded > 0) {
      const base = stitchesNeeded - extra;
      roundedStitches = Math.round(base / mult) * mult + extra;
      if (roundedStitches <= 0) roundedStitches = mult + extra;
    }

    const edge = parseInt(edgeStitches) || 0;
    const chain = parseInt(turningChains) || 0;
    const totalCastOn = roundedStitches + edge;
    const foundationChain = roundedStitches + chain;

    // Actual width at rounded count
    const actualWidth = roundedStitches > 0 ? +(roundedStitches / stPerUnit).toFixed(2) : 0;

    return {
      stitchesNeeded,
      roundedStitches,
      rowsNeeded,
      totalCastOn,
      foundationChain,
      actualWidth,
      hasMultiple: mult > 0,
    };
  }, [dimGaugeSt, dimGaugeRow, dimGaugeOver, desiredWidth, desiredHeight, dimStitchMultiple, dimMultipleExtra, edgeStitches, turningChains]);

  // ── STICKY SUMMARY ──────────────────────────────────────────────
  const stickySummary = (() => {
    if (tab === "swatch" && swatchResult) {
      return `${swatchResult.stPerStandard} sts × ${swatchResult.rowPerStandard} rows per ${dimPer}`;
    }
    if (tab === "resize" && resizeResult) {
      const sts = resizeResult.hasMultiple ? resizeResult.roundedStitches : resizeResult.newStitches;
      return `${sts} stitches${resizeResult.newRows > 0 ? ` • ${resizeResult.newRows} rows` : ""}`;
    }
    if (tab === "dimensions" && dimResult) {
      const sts = dimResult.hasMultiple ? dimResult.roundedStitches : dimResult.stitchesNeeded;
      return `${sts} stitches${dimResult.rowsNeeded > 0 ? ` • ${dimResult.rowsNeeded} rows` : ""}`;
    }
    return "";
  })();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <UnitToggle value={units} onChange={setUnits} />
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:inline-flex items-stretch sm:items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 gap-1">
        {([
          ["swatch", "📏 Gauge from Swatch"],
          ["resize", "🔄 Resize Pattern"],
          ["dimensions", "📐 Width → Stitches"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
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
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Measure your swatch, count the stitches and rows, and we&apos;ll calculate your gauge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Width ({dim})</label>
              <input
                type="number" value={swatchWidth} onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder={units === "metric" ? "10" : "4"} className="input" min="0" inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">Height ({dim})</label>
              <input
                type="number" value={swatchHeight} onChange={(e) => setSwatchHeight(e.target.value)}
                placeholder={units === "metric" ? "10" : "4"} className="input" min="0" inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">Stitches</label>
              <input
                type="number" value={swatchStitches} onChange={(e) => setSwatchStitches(e.target.value)}
                placeholder="18" className="input" min="0" inputMode="decimal"
              />
            </div>
            <div>
              <label className="label">Rows</label>
              <input
                type="number" value={swatchRows} onChange={(e) => setSwatchRows(e.target.value)}
                placeholder="24" className="input" min="0" inputMode="decimal"
              />
            </div>
          </div>

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
                    navigator.clipboard.writeText(
                      `Gauge: ${swatchResult.stPerStandard} sts × ${swatchResult.rowPerStandard} rows per ${dimPer}`
                    );
                  }}
                  className="btn-secondary text-sm"
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
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Enter the pattern&apos;s gauge and your gauge. We&apos;ll recalculate stitch counts so your project comes out the right size.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pattern gauge */}
            <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Pattern Gauge (per {dimPer})</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Stitches</label>
                  <input type="number" value={origGaugeSt} onChange={(e) => setOrigGaugeSt(e.target.value)} placeholder="18" className="input" min="0" inputMode="decimal" />
                </div>
                <div>
                  <label className="label text-xs">Rows</label>
                  <input type="number" value={origGaugeRow} onChange={(e) => setOrigGaugeRow(e.target.value)} placeholder="24" className="input" min="0" inputMode="decimal" />
                </div>
              </div>
            </div>

            {/* Your gauge */}
            <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
              <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Your Gauge (per {dimPer})</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Stitches</label>
                  <input type="number" value={yourGaugeSt} onChange={(e) => setYourGaugeSt(e.target.value)} placeholder="20" className="input" min="0" inputMode="decimal" />
                </div>
                <div>
                  <label className="label text-xs">Rows</label>
                  <input type="number" value={yourGaugeRow} onChange={(e) => setYourGaugeRow(e.target.value)} placeholder="26" className="input" min="0" inputMode="decimal" />
                </div>
              </div>
            </div>
          </div>

          {/* Pattern stitch counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label">
                Pattern stitches
                <Tooltip text="The stitch count from the original pattern you want to resize." />
              </label>
              <input type="number" value={origStitches} onChange={(e) => setOrigStitches(e.target.value)} placeholder="120" className="input" min="0" inputMode="numeric" />
            </div>
            <div>
              <label className="label">Pattern rows</label>
              <input type="number" value={origRows} onChange={(e) => setOrigRows(e.target.value)} placeholder="160" className="input" min="0" inputMode="numeric" />
            </div>
            <div>
              <label className="label">
                Stitch multiple
                <Tooltip text="If your stitch pattern repeats every X stitches (e.g., a 6-stitch cable repeat), enter X. We'll round to the nearest valid count." />
              </label>
              <input type="number" value={stitchMultiple} onChange={(e) => setStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input" min="0" inputMode="numeric" />
            </div>
            <div>
              <label className="label">
                + extra
                <Tooltip text="Extra stitches after the repeat (e.g., 'multiple of 6 + 1' → enter 1 here)." />
              </label>
              <input type="number" value={multipleExtra} onChange={(e) => setMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input" min="0" inputMode="numeric" />
            </div>
          </div>

          {/* What-if dimensions */}
          <div>
            <p className="label">
              Original dimensions ({dim}) — optional &ldquo;what if&rdquo; comparison
              <Tooltip text="Enter the pattern's finished dimensions to see how your gauge changes the size." />
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <input type="number" value={origWidthDim} onChange={(e) => setOrigWidthDim(e.target.value)} placeholder="Width" className="input" min="0" inputMode="decimal" />
              <input type="number" value={origHeightDim} onChange={(e) => setOrigHeightDim(e.target.value)} placeholder="Height" className="input" min="0" inputMode="decimal" />
            </div>
          </div>

          <StickyResult summary={stickySummary} visible={!!resizeResult}>
            {resizeResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Resized Pattern
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {resizeResult.newStitches > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                        {resizeResult.hasMultiple ? resizeResult.roundedStitches : resizeResult.newStitches}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">
                        stitches
                        {resizeResult.hasMultiple && resizeResult.roundedStitches !== resizeResult.newStitches && (
                          <span className="text-xs ml-1">(rounded from {resizeResult.newStitches})</span>
                        )}
                      </p>
                    </div>
                  )}
                  {resizeResult.newRows > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                        {resizeResult.newRows}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">rows</p>
                    </div>
                  )}
                </div>

                {/* What-if comparison */}
                {(resizeResult.origW > 0 || resizeResult.origH > 0) && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                      ⚠️ &ldquo;What If&rdquo; — Size at your gauge WITHOUT resizing:
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {resizeResult.origW > 0 && (
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
                      {resizeResult.origH > 0 && (
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
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Enter your gauge and desired finished size. We&apos;ll tell you exactly how many stitches to cast on or chain.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Gauge */}
              <div>
                <p className="label">Your Gauge</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Stitches</label>
                    <input type="number" value={dimGaugeSt} onChange={(e) => setDimGaugeSt(e.target.value)} placeholder="18" className="input" min="0" inputMode="decimal" />
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Rows</label>
                    <input type="number" value={dimGaugeRow} onChange={(e) => setDimGaugeRow(e.target.value)} placeholder="24" className="input" min="0" inputMode="decimal" />
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Over ({dim})</label>
                    <input type="number" value={dimGaugeOver} onChange={(e) => setDimGaugeOver(e.target.value)} placeholder="4" className="input" min="0" inputMode="decimal" />
                  </div>
                </div>
              </div>

              {/* Desired size */}
              <div>
                <p className="label">Desired Size ({dim})</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Width</label>
                    <input type="number" value={desiredWidth} onChange={(e) => setDesiredWidth(e.target.value)} placeholder="50" className="input" min="0" inputMode="decimal" />
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Height</label>
                    <input type="number" value={desiredHeight} onChange={(e) => setDesiredHeight(e.target.value)} placeholder="60" className="input" min="0" inputMode="decimal" />
                  </div>
                </div>
              </div>

              {/* Stitch multiple */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    Stitch multiple
                    <Tooltip text="If your pattern repeats every X stitches, enter X here." />
                  </label>
                  <input type="number" value={dimStitchMultiple} onChange={(e) => setDimStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input" min="0" inputMode="numeric" />
                </div>
                <div>
                  <label className="label">+ extra</label>
                  <input type="number" value={dimMultipleExtra} onChange={(e) => setDimMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input" min="0" inputMode="numeric" />
                </div>
              </div>

              {/* Edge / chain */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    Edge stitches (knit)
                    <Tooltip text="Extra stitches for selvage edges. Usually 0–2. Added to cast-on count." />
                  </label>
                  <input type="number" value={edgeStitches} onChange={(e) => setEdgeStitches(e.target.value)} placeholder="0" className="input" min="0" inputMode="numeric" />
                </div>
                <div>
                  <label className="label">
                    Turning chains (crochet)
                    <Tooltip text="Extra chains for turning. SC = 1, HDC = 2, DC = 3, TR = 4. Added to foundation chain." />
                  </label>
                  <input type="number" value={turningChains} onChange={(e) => setTurningChains(e.target.value)} placeholder="0" className="input" min="0" inputMode="numeric" />
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              <StickyResult summary={stickySummary} visible={!!dimResult}>
                {dimResult && (
                  <div className="result-card space-y-4">
                    <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                      You Need
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                          {dimResult.hasMultiple ? dimResult.roundedStitches : dimResult.stitchesNeeded} stitches
                        </p>
                        {dimResult.hasMultiple && dimResult.roundedStitches !== dimResult.stitchesNeeded && (
                          <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                            Rounded from {dimResult.stitchesNeeded} to nearest multiple
                          </p>
                        )}
                        {dimResult.actualWidth > 0 && dimResult.hasMultiple && (
                          <p className="text-xs text-bark-400 dark:text-bark-500">
                            Actual width: {dimResult.actualWidth} {dim}
                          </p>
                        )}
                      </div>

                      {dimResult.rowsNeeded > 0 && (
                        <div>
                          <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                            {dimResult.rowsNeeded} rows
                          </p>
                        </div>
                      )}

                      <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-2">
                        {parseInt(edgeStitches) > 0 && (
                          <p className="text-sm text-bark-600 dark:text-cream-300">
                            🪡 <strong>Cast on:</strong> {dimResult.totalCastOn} stitches
                            <span className="text-xs text-bark-400 dark:text-bark-500 ml-1">
                              ({dimResult.roundedStitches} + {edgeStitches} edge)
                            </span>
                          </p>
                        )}
                        {parseInt(turningChains) > 0 && (
                          <p className="text-sm text-bark-600 dark:text-cream-300">
                            🧶 <strong>Foundation chain:</strong> {dimResult.foundationChain} chains
                            <span className="text-xs text-bark-400 dark:text-bark-500 ml-1">
                              ({dimResult.roundedStitches} + {turningChains} turning)
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const text = `${dimResult.hasMultiple ? dimResult.roundedStitches : dimResult.stitchesNeeded} stitches × ${dimResult.rowsNeeded} rows for ${desiredWidth} × ${desiredHeight} ${dim}`;
                        navigator.clipboard.writeText(text);
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

      {/* Quick reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          💡 Gauge Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Always wash your swatch</strong> before measuring — many yarns grow or shrink after washing.</li>
          <li><strong>Measure in the middle</strong> of the swatch, not at the edges, for the most accurate count.</li>
          <li><strong>Half stitches matter.</strong> A gauge of 18 vs 18.5 stitches can make a sweater 2 inches too small.</li>
          <li><strong>Row gauge changes more</strong> between knitters than stitch gauge — check both if length matters.</li>
        </ul>
      </div>
    </div>
  );
}
