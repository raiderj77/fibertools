"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";

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
  { key: "lace", label: "0 – Lace", ydsPerSqIn: 3.2, ydsPerGram: 6.5 },
  { key: "fingering", label: "1 – Fingering", ydsPerSqIn: 2.5, ydsPerGram: 5.0 },
  { key: "sport", label: "2 – Sport", ydsPerSqIn: 2.0, ydsPerGram: 4.2 },
  { key: "dk", label: "3 – DK", ydsPerSqIn: 1.6, ydsPerGram: 3.5 },
  { key: "worsted", label: "4 – Worsted", ydsPerSqIn: 1.3, ydsPerGram: 2.8 },
  { key: "bulky", label: "5 – Bulky", ydsPerSqIn: 0.95, ydsPerGram: 1.8 },
  { key: "superbulky", label: "6 – Super Bulky", ydsPerSqIn: 0.7, ydsPerGram: 1.2 },
  { key: "jumbo", label: "7 – Jumbo", ydsPerSqIn: 0.45, ydsPerGram: 0.7 },
];

function inToCm(i: number) { return +(i * 2.54).toFixed(1); }
function ydsToM(y: number) { return +(y * 0.9144).toFixed(0); }

// ── COMPONENT ─────────────────────────────────────────────────────

export default function BlanketCalculatorTool() {
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

  // Stitch multiple
  const [stitchMultiple, setStitchMultiple] = useState("");
  const [multipleExtra, setMultipleExtra] = useState("");

  // Skein info
  const [skeinYards, setSkeinYards] = useState("220");
  const [skeinGrams, setSkeinGrams] = useState("100");

  const dim = units === "metric" ? "cm" : "in";
  const yw = YARN_WEIGHTS.find((w) => w.key === yarnWeight) || YARN_WEIGHTS[4];

  const result = useMemo(() => {
    // Get dimensions in inches
    let widthIn: number, lengthIn: number;
    if (useCustom) {
      const w = parseFloat(customW) || 0;
      const l = parseFloat(customL) || 0;
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
    const oh = parseFloat(overhang) || 0;
    const ohIn = units === "metric" ? oh / 2.54 : oh;
    widthIn += ohIn * 2;
    lengthIn += ohIn;

    if (widthIn <= 0 || lengthIn <= 0) return null;

    // Gauge
    const gOver = parseFloat(gaugeOver) || 4;
    const gSt = parseFloat(gaugeStitches) || 0;
    const gRow = parseFloat(gaugeRows) || 0;
    const hasGauge = gSt > 0 && gRow > 0;

    let stitchesNeeded: number;
    let rowsNeeded: number;
    let ydsNeeded: number;

    if (hasGauge) {
      const stPerIn = gSt / gOver;
      const rowPerIn = gRow / gOver;
      stitchesNeeded = Math.round(widthIn * stPerIn);
      rowsNeeded = Math.round(lengthIn * rowPerIn);
      // Estimate yardage from gauge
      const sqIn = widthIn * lengthIn;
      const gaugeRatio = (stPerIn * rowPerIn) / (4.5 * 6);
      ydsNeeded = sqIn * 1.3 * gaugeRatio;
    } else {
      stitchesNeeded = 0;
      rowsNeeded = 0;
      ydsNeeded = widthIn * lengthIn * yw.ydsPerSqIn;
    }

    // Stitch multiple rounding
    const mult = parseInt(stitchMultiple) || 0;
    const extra = parseInt(multipleExtra) || 0;
    let roundedStitches = stitchesNeeded;
    if (mult > 0 && stitchesNeeded > 0) {
      const base = stitchesNeeded - extra;
      roundedStitches = Math.round(base / mult) * mult + extra;
      if (roundedStitches <= 0) roundedStitches = mult + extra;
    }

    const withBuffer = ydsNeeded * 1.1;
    const totalGrams = withBuffer / yw.ydsPerGram;
    const skeinYds = parseFloat(skeinYards) || 220;
    const skeins = Math.ceil(withBuffer / skeinYds);

    return {
      widthIn,
      lengthIn,
      stitches: hasGauge ? roundedStitches : 0,
      stitchesRaw: stitchesNeeded,
      rows: rowsNeeded,
      yards: Math.round(withBuffer),
      meters: ydsToM(withBuffer),
      grams: Math.round(totalGrams),
      skeins,
      hasGauge,
      hasMultiple: mult > 0 && roundedStitches !== stitchesNeeded,
    };
  }, [units, sizeIdx, useCustom, customW, customL, yarnWeight, pillowTuck, overhang, gaugeStitches, gaugeRows, gaugeOver, stitchMultiple, multipleExtra, skeinYards, yw]);

  const stickySummary = result
    ? `${units === "metric" ? result.meters.toLocaleString() + " m" : result.yards.toLocaleString() + " yds"} • ${result.skeins} skein${result.skeins !== 1 ? "s" : ""}`
    : "";

  return (
    <div className="space-y-8">
      <UnitToggle value={units} onChange={setUnits} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-5">
          {/* Size selector */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="label mb-0">Blanket Size</label>
              <label className="flex items-center gap-1.5 text-sm text-bark-500 dark:text-bark-400 cursor-pointer">
                <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="rounded border-bark-300" />
                Custom
              </label>
            </div>

            {useCustom ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Width ({dim})</label>
                  <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="50" className="input" min="0" inputMode="decimal" />
                </div>
                <div>
                  <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Length ({dim})</label>
                  <input type="number" value={customL} onChange={(e) => setCustomL(e.target.value)} placeholder="60" className="input" min="0" inputMode="decimal" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BLANKET_SIZES.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSizeIdx(i)}
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
              Pillow tuck (+20″/50cm)
              <Tooltip text="Adds extra length at the top to fold over pillows." />
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-bark-600 dark:text-cream-300">Overhang ({dim}):</label>
              <input type="number" value={overhang} onChange={(e) => setOverhang(e.target.value)} className="input w-20 text-sm" min="0" inputMode="decimal" />
              <Tooltip text="How far the blanket drapes off each side of the bed. Typical: 10-15 inches / 25-38 cm." />
            </div>
          </div>

          {/* Yarn weight */}
          <div>
            <label className="label">Yarn Weight</label>
            <select value={yarnWeight} onChange={(e) => setYarnWeight(e.target.value)} className="select">
              {YARN_WEIGHTS.map((w) => (
                <option key={w.key} value={w.key}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Gauge (optional) */}
          <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
              Your Gauge (optional — for stitch counts)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Stitches</label>
                <input type="number" value={gaugeStitches} onChange={(e) => setGaugeStitches(e.target.value)} placeholder="18" className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Rows</label>
                <input type="number" value={gaugeRows} onChange={(e) => setGaugeRows(e.target.value)} placeholder="24" className="input text-sm" min="0" inputMode="decimal" />
              </div>
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">Over ({dim})</label>
                <input type="number" value={gaugeOver} onChange={(e) => setGaugeOver(e.target.value)} placeholder="4" className="input text-sm" min="0" inputMode="decimal" />
              </div>
            </div>
            {/* Stitch multiple */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Stitch multiple
                  <Tooltip text="If your stitch pattern repeats every X stitches, enter X." />
                </label>
                <input type="number" value={stitchMultiple} onChange={(e) => setStitchMultiple(e.target.value)} placeholder="e.g. 6" className="input text-sm" min="0" inputMode="numeric" />
              </div>
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">+ extra</label>
                <input type="number" value={multipleExtra} onChange={(e) => setMultipleExtra(e.target.value)} placeholder="e.g. 1" className="input text-sm" min="0" inputMode="numeric" />
              </div>
            </div>
          </div>

          {/* Skein info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm">{units === "metric" ? "Meters" : "Yards"} per skein</label>
              <input type="number" value={skeinYards} onChange={(e) => setSkeinYards(e.target.value)} placeholder="220" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label text-sm">Grams per skein</label>
              <input type="number" value={skeinGrams} onChange={(e) => setSkeinGrams(e.target.value)} placeholder="100" className="input" min="0" inputMode="decimal" />
            </div>
          </div>
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
                  Final size: {units === "metric"
                    ? `${inToCm(result.widthIn)} × ${inToCm(result.lengthIn)} cm`
                    : `${Math.round(result.widthIn)} × ${Math.round(result.lengthIn)}″`}
                  {pillowTuck && " (incl. pillow tuck)"}
                </p>

                {result.hasGauge && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.stitches}</p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">
                        stitches wide
                        {result.hasMultiple && <span className="text-xs ml-1">(rounded from {result.stitchesRaw})</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.rows}</p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">rows long</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <p className="text-sm text-bark-500 dark:text-bark-400">
                  Total weight: ≈ {result.grams.toLocaleString()}g ({(result.grams / 1000).toFixed(1)} kg)
                </p>

                {!result.hasGauge && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    💡 Enter your gauge above to get exact stitch and row counts.
                  </p>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={() => {
                    const text = `${useCustom ? "Custom" : BLANKET_SIZES[sizeIdx].label} blanket: ${result.hasGauge ? `${result.stitches} sts × ${result.rows} rows, ` : ""}${result.yards} yds (${result.meters} m), ${result.skeins} skeins`;
                    navigator.clipboard.writeText(text);
                  }} className="btn-secondary text-sm">📋 Copy</button>
                  <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print</button>
                </div>
              </div>
            )}
          </StickyResult>
        </div>
      </div>
    </div>
  );
}
