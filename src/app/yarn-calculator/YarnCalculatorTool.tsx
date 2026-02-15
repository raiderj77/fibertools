"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";

// ── DATA ──────────────────────────────────────────────────────────

type ProjectType =
  | "blanket"
  | "sweater"
  | "hat"
  | "scarf"
  | "socks"
  | "amigurumi"
  | "shawl"
  | "mittens"
  | "custom";

interface SizePreset {
  label: string;
  widthIn: number;
  lengthIn: number;
}

const PROJECT_LABELS: Record<ProjectType, string> = {
  blanket: "🛏️ Blanket",
  sweater: "🧥 Sweater",
  hat: "🧢 Hat",
  scarf: "🧣 Scarf",
  socks: "🧦 Socks (pair)",
  amigurumi: "🧸 Amigurumi",
  shawl: "🔺 Shawl",
  mittens: "🧤 Mittens (pair)",
  custom: "📐 Custom Dimensions",
};

const SIZE_PRESETS: Record<ProjectType, SizePreset[]> = {
  blanket: [
    { label: "Lovey (12×12″)", widthIn: 12, lengthIn: 12 },
    { label: "Baby (30×36″)", widthIn: 30, lengthIn: 36 },
    { label: "Stroller (30×40″)", widthIn: 30, lengthIn: 40 },
    { label: "Crib (36×52″)", widthIn: 36, lengthIn: 52 },
    { label: "Lap (36×48″)", widthIn: 36, lengthIn: 48 },
    { label: "Throw (50×60″)", widthIn: 50, lengthIn: 60 },
    { label: "Twin (66×90″)", widthIn: 66, lengthIn: 90 },
    { label: "Full/Double (80×90″)", widthIn: 80, lengthIn: 90 },
    { label: "Queen (90×100″)", widthIn: 90, lengthIn: 100 },
    { label: "King (108×100″)", widthIn: 108, lengthIn: 100 },
  ],
  sweater: [
    { label: "XS (32″ bust)", widthIn: 32, lengthIn: 24 },
    { label: "S (34–36″ bust)", widthIn: 35, lengthIn: 25 },
    { label: "M (38–40″ bust)", widthIn: 39, lengthIn: 26 },
    { label: "L (42–44″ bust)", widthIn: 43, lengthIn: 27 },
    { label: "XL (46–48″ bust)", widthIn: 47, lengthIn: 28 },
    { label: "2XL (50–52″ bust)", widthIn: 51, lengthIn: 29 },
    { label: "3XL (54–56″ bust)", widthIn: 55, lengthIn: 30 },
  ],
  hat: [
    { label: "Baby (14–16″)", widthIn: 15, lengthIn: 6 },
    { label: "Toddler (17–18″)", widthIn: 17.5, lengthIn: 7 },
    { label: "Child (19–20″)", widthIn: 19.5, lengthIn: 7.5 },
    { label: "Adult S/M (21–22″)", widthIn: 21.5, lengthIn: 8 },
    { label: "Adult L/XL (23–24″)", widthIn: 23.5, lengthIn: 9 },
  ],
  scarf: [
    { label: 'Narrow (6×60″)', widthIn: 6, lengthIn: 60 },
    { label: 'Standard (8×70″)', widthIn: 8, lengthIn: 70 },
    { label: 'Wide (10×72″)', widthIn: 10, lengthIn: 72 },
    { label: 'Infinity (8×60″ loop)', widthIn: 8, lengthIn: 60 },
    { label: 'Cowl (10×26″)', widthIn: 10, lengthIn: 26 },
  ],
  socks: [
    { label: "Women S (8″ foot)", widthIn: 7, lengthIn: 8 },
    { label: "Women M (9″ foot)", widthIn: 7.5, lengthIn: 9 },
    { label: "Women L (9.5″ foot)", widthIn: 8, lengthIn: 9.5 },
    { label: "Men M (10″ foot)", widthIn: 8.5, lengthIn: 10 },
    { label: "Men L (11″ foot)", widthIn: 9, lengthIn: 11 },
  ],
  amigurumi: [
    { label: 'Small (4–5″ tall)', widthIn: 4, lengthIn: 5 },
    { label: 'Medium (8–10″ tall)', widthIn: 8, lengthIn: 10 },
    { label: 'Large (14–16″ tall)', widthIn: 14, lengthIn: 16 },
  ],
  shawl: [
    { label: 'Small triangle (48×24″)', widthIn: 48, lengthIn: 24 },
    { label: 'Medium triangle (60×30″)', widthIn: 60, lengthIn: 30 },
    { label: 'Large wrap (72×36″)', widthIn: 72, lengthIn: 36 },
  ],
  mittens: [
    { label: "Child (5.5″ hand)", widthIn: 6, lengthIn: 7 },
    { label: "Women S/M (7″ hand)", widthIn: 7, lengthIn: 9 },
    { label: "Women L / Men S (8″ hand)", widthIn: 8, lengthIn: 10 },
    { label: "Men M/L (9″ hand)", widthIn: 9, lengthIn: 11 },
  ],
  custom: [],
};

// Average yardage per square inch by yarn weight (for quick estimate)
// These account for average gauge in stockinette/SC
interface YarnWeightInfo {
  label: string;
  ydsPerSqIn: number; // average yards consumed per square inch
  ydsPerGram: number; // typical yards per gram
  gaugeStPerIn: number; // average stitches per inch
  gaugeRowPerIn: number; // average rows per inch
}

const YARN_WEIGHTS: Record<string, YarnWeightInfo> = {
  lace: { label: "0 – Lace", ydsPerSqIn: 3.2, ydsPerGram: 6.5, gaugeStPerIn: 8, gaugeRowPerIn: 10 },
  fingering: { label: "1 – Fingering / Sock", ydsPerSqIn: 2.5, ydsPerGram: 5.0, gaugeStPerIn: 7, gaugeRowPerIn: 9 },
  sport: { label: "2 – Sport / Baby", ydsPerSqIn: 2.0, ydsPerGram: 4.2, gaugeStPerIn: 6, gaugeRowPerIn: 8 },
  dk: { label: "3 – DK / Light Worsted", ydsPerSqIn: 1.6, ydsPerGram: 3.5, gaugeStPerIn: 5.5, gaugeRowPerIn: 7 },
  worsted: { label: "4 – Worsted / Aran", ydsPerSqIn: 1.3, ydsPerGram: 2.8, gaugeStPerIn: 4.5, gaugeRowPerIn: 6 },
  bulky: { label: "5 – Bulky / Chunky", ydsPerSqIn: 0.95, ydsPerGram: 1.8, gaugeStPerIn: 3.5, gaugeRowPerIn: 5 },
  superbulky: { label: "6 – Super Bulky", ydsPerSqIn: 0.7, ydsPerGram: 1.2, gaugeStPerIn: 2.5, gaugeRowPerIn: 3.5 },
  jumbo: { label: "7 – Jumbo", ydsPerSqIn: 0.45, ydsPerGram: 0.7, gaugeStPerIn: 1.5, gaugeRowPerIn: 2.5 },
};

// Stitch pattern multipliers relative to stockinette/single crochet
interface StitchPattern {
  label: string;
  multiplier: number;
  craft: "both" | "knit" | "crochet";
}

const STITCH_PATTERNS: StitchPattern[] = [
  { label: "Stockinette / Jersey", multiplier: 1.0, craft: "knit" },
  { label: "Garter stitch", multiplier: 1.08, craft: "knit" },
  { label: "Seed / Moss stitch", multiplier: 1.12, craft: "knit" },
  { label: "Ribbing (1×1 or 2×2)", multiplier: 1.1, craft: "knit" },
  { label: "Cables (light)", multiplier: 1.2, craft: "knit" },
  { label: "Cables (heavy / Aran)", multiplier: 1.35, craft: "knit" },
  { label: "Brioche", multiplier: 1.5, craft: "knit" },
  { label: "Fair Isle / Stranded", multiplier: 1.3, craft: "knit" },
  { label: "Lace", multiplier: 0.85, craft: "knit" },
  { label: "Single Crochet (SC)", multiplier: 1.0, craft: "crochet" },
  { label: "Half Double Crochet (HDC)", multiplier: 0.92, craft: "crochet" },
  { label: "Double Crochet (DC)", multiplier: 0.85, craft: "crochet" },
  { label: "Treble Crochet (TR)", multiplier: 0.8, craft: "crochet" },
  { label: "Granny stitch", multiplier: 0.9, craft: "crochet" },
  { label: "Moss / Linen stitch", multiplier: 1.05, craft: "crochet" },
  { label: "C2C (Corner to Corner)", multiplier: 0.95, craft: "crochet" },
  { label: "Tunisian Simple Stitch", multiplier: 1.1, craft: "crochet" },
];

// ── HELPERS ───────────────────────────────────────────────────────

function inToCm(inches: number) { return inches * 2.54; }
function ydsToM(yards: number) { return yards * 0.9144; }
function gToOz(grams: number) { return grams / 28.3495; }

// ── COMPONENT ─────────────────────────────────────────────────────

type Mode = "quick" | "precise";

export default function YarnCalculatorTool() {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [mode, setMode] = useState<Mode>("quick");
  const [projectType, setProjectType] = useState<ProjectType>("blanket");
  const [sizeIdx, setSizeIdx] = useState(5); // default: throw
  const [customW, setCustomW] = useState("");
  const [customL, setCustomL] = useState("");
  const [yarnWeight, setYarnWeight] = useState("worsted");
  const [stitchPattern, setStitchPattern] = useState("Stockinette / Jersey");
  const [skeinYards, setSkeinYards] = useState("220");
  const [skeinGrams, setSkeinGrams] = useState("100");

  // Precise mode
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeRows, setGaugeRows] = useState("");
  const [swatchSize, setSwatchSize] = useState("4"); // inches

  // Partial skein sub-tool
  const [showPartial, setShowPartial] = useState(false);
  const [partialWeight, setPartialWeight] = useState("");
  const [partialSkeinWeight, setPartialSkeinWeight] = useState("");
  const [partialSkeinYards, setPartialSkeinYards] = useState("");

  const yw = YARN_WEIGHTS[yarnWeight];
  const sp = STITCH_PATTERNS.find((s) => s.label === stitchPattern) || STITCH_PATTERNS[0];
  const presets = SIZE_PRESETS[projectType];

  // Dimensions in inches
  const dims = useMemo(() => {
    if (projectType === "custom") {
      const w = parseFloat(customW) || 0;
      const l = parseFloat(customL) || 0;
      return {
        widthIn: units === "metric" ? w / 2.54 : w,
        lengthIn: units === "metric" ? l / 2.54 : l,
      };
    }
    if (presets.length === 0) return { widthIn: 0, lengthIn: 0 };
    const preset = presets[Math.min(sizeIdx, presets.length - 1)];
    return { widthIn: preset.widthIn, lengthIn: preset.lengthIn };
  }, [projectType, sizeIdx, customW, customL, units, presets]);

  // Calculate
  const result = useMemo(() => {
    const { widthIn, lengthIn } = dims;
    if (widthIn <= 0 || lengthIn <= 0) return null;

    let sqInches = widthIn * lengthIn;

    // Adjust for non-rectangular projects
    if (projectType === "shawl") sqInches *= 0.5; // triangle
    if (projectType === "hat") sqInches *= 0.85; // tube with decreases
    if (projectType === "socks") sqInches *= 2; // pair
    if (projectType === "mittens") sqInches *= 2; // pair
    if (projectType === "amigurumi") sqInches *= 0.6; // 3D, dense but smaller area

    let ydsPerSqIn: number;

    if (mode === "precise" && gaugeStitches && gaugeRows && swatchSize) {
      const sw = parseFloat(swatchSize) || 4;
      const stPerIn = (parseFloat(gaugeStitches) || 0) / sw;
      const rowPerIn = (parseFloat(gaugeRows) || 0) / sw;
      if (stPerIn <= 0 || rowPerIn <= 0) return null;
      // Estimate yds/sq inch from gauge: more stitches = more yarn per area
      // Base: at worsted gauge (4.5 st/in) ≈ 1.3 yds/sq.in
      const gaugeRatio = (stPerIn * rowPerIn) / (4.5 * 6);
      ydsPerSqIn = 1.3 * gaugeRatio;
    } else {
      ydsPerSqIn = yw.ydsPerSqIn;
    }

    const baseYards = sqInches * ydsPerSqIn * sp.multiplier;
    const withBuffer = baseYards * 1.1; // 10% safety buffer
    const totalGrams = withBuffer / yw.ydsPerGram;

    const skeinYds = parseFloat(skeinYards) || 220;
    const skeinG = parseFloat(skeinGrams) || 100;
    const skeinsNeeded = Math.ceil(withBuffer / skeinYds);

    return {
      yardsNoBuffer: Math.round(baseYards),
      yardsWithBuffer: Math.round(withBuffer),
      meters: Math.round(ydsToM(withBuffer)),
      grams: Math.round(totalGrams),
      ounces: +(gToOz(totalGrams)).toFixed(1),
      skeins: skeinsNeeded,
      skeinYds: skeinYds,
      skeinG: skeinG,
    };
  }, [dims, mode, yarnWeight, stitchPattern, skeinYards, skeinGrams, gaugeStitches, gaugeRows, swatchSize, sp, yw, projectType]);

  // Partial skein
  const partialResult = useMemo(() => {
    const pw = parseFloat(partialWeight) || 0;
    const sw = parseFloat(partialSkeinWeight) || 0;
    const sy = parseFloat(partialSkeinYards) || 0;
    if (pw <= 0 || sw <= 0 || sy <= 0) return null;
    const remaining = (pw / sw) * sy;
    return {
      yards: Math.round(remaining),
      meters: Math.round(ydsToM(remaining)),
      pct: Math.round((pw / sw) * 100),
    };
  }, [partialWeight, partialSkeinWeight, partialSkeinYards]);

  const dimLabel = units === "metric" ? "cm" : "inches";
  const yardLabel = units === "metric" ? "meters" : "yards";

  return (
    <div className="space-y-8">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4">
        <UnitToggle value={units} onChange={setUnits} />

        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              mode === "quick"
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400"
            }`}
          >
            ⚡ Quick Estimate
          </button>
          <button
            type="button"
            onClick={() => setMode("precise")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              mode === "precise"
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400"
            }`}
          >
            🎯 Precise (with gauge)
          </button>
        </div>
      </div>

      {/* Main form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Project type */}
          <div>
            <label className="label">
              Project Type
              <Tooltip text="Pick your project and we'll show size presets with typical dimensions." />
            </label>
            <select
              value={projectType}
              onChange={(e) => { setProjectType(e.target.value as ProjectType); setSizeIdx(0); }}
              className="select"
            >
              {Object.entries(PROJECT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Size preset or custom */}
          {projectType !== "custom" && presets.length > 0 ? (
            <div>
              <label className="label">
                Size
                <Tooltip text="Standard sizes for this project type. Dimensions are approximate." />
              </label>
              <select
                value={sizeIdx}
                onChange={(e) => setSizeIdx(parseInt(e.target.value))}
                className="select"
              >
                {presets.map((p, i) => (
                  <option key={i} value={i}>{p.label}</option>
                ))}
              </select>
              <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                {units === "metric"
                  ? `${Math.round(inToCm(presets[Math.min(sizeIdx, presets.length - 1)]?.widthIn || 0))} × ${Math.round(inToCm(presets[Math.min(sizeIdx, presets.length - 1)]?.lengthIn || 0))} cm`
                  : `${presets[Math.min(sizeIdx, presets.length - 1)]?.widthIn || 0} × ${presets[Math.min(sizeIdx, presets.length - 1)]?.lengthIn || 0} inches`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Width ({dimLabel})</label>
                <input
                  type="number"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                  placeholder="e.g. 50"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label">Length ({dimLabel})</label>
                <input
                  type="number"
                  value={customL}
                  onChange={(e) => setCustomL(e.target.value)}
                  placeholder="e.g. 60"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>
          )}

          {/* Yarn weight */}
          <div>
            <label className="label">
              Yarn Weight
              <Tooltip text="The thickness of your yarn. Check the label — it's usually printed as a number 0–7 or a name like 'Worsted'." />
            </label>
            <select
              value={yarnWeight}
              onChange={(e) => setYarnWeight(e.target.value)}
              className="select"
            >
              {Object.entries(YARN_WEIGHTS).map(([key, w]) => (
                <option key={key} value={key}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Stitch pattern */}
          <div>
            <label className="label">
              Stitch Pattern
              <Tooltip text="Different stitches use different amounts of yarn. Cables use ~20–35% more. Lace uses ~15% less. If unsure, leave as default." />
            </label>
            <select
              value={stitchPattern}
              onChange={(e) => setStitchPattern(e.target.value)}
              className="select"
            >
              <optgroup label="Knitting">
                {STITCH_PATTERNS.filter((s) => s.craft === "knit").map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label} ({s.multiplier > 1 ? "+" : ""}{Math.round((s.multiplier - 1) * 100)}%)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Crochet">
                {STITCH_PATTERNS.filter((s) => s.craft === "crochet").map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label} ({s.multiplier > 1 ? "+" : ""}{Math.round((s.multiplier - 1) * 100)}%)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Precise: gauge inputs */}
          {mode === "precise" && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl space-y-3">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                🎯 Enter your gauge swatch measurements
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Stitches</label>
                  <input
                    type="number"
                    value={gaugeStitches}
                    onChange={(e) => setGaugeStitches(e.target.value)}
                    placeholder="18"
                    className="input text-sm"
                    min="0"
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <label className="label text-xs">Rows</label>
                  <input
                    type="number"
                    value={gaugeRows}
                    onChange={(e) => setGaugeRows(e.target.value)}
                    placeholder="24"
                    className="input text-sm"
                    min="0"
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Over ({dimLabel})
                  </label>
                  <input
                    type="number"
                    value={swatchSize}
                    onChange={(e) => setSwatchSize(e.target.value)}
                    placeholder="4"
                    className="input text-sm"
                    min="0"
                    inputMode="decimal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skein info */}
          <div>
            <p className="label">
              Your Skein Info
              <Tooltip text="Check the yarn label for yards/meters per skein and skein weight. This tells us how many skeins you'll need to buy." />
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 mb-1 block">
                  {units === "metric" ? "Meters" : "Yards"} per skein
                </label>
                <input
                  type="number"
                  value={skeinYards}
                  onChange={(e) => setSkeinYards(e.target.value)}
                  placeholder="220"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 mb-1 block">
                  {units === "metric" ? "Grams" : "Ounces"} per skein
                </label>
                <input
                  type="number"
                  value={skeinGrams}
                  onChange={(e) => setSkeinGrams(e.target.value)}
                  placeholder="100"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="result-card space-y-4">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                You&apos;ll Need
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                    {units === "metric" ? result.meters.toLocaleString() : result.yardsWithBuffer.toLocaleString()}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">
                    total {yardLabel}
                    <span className="text-xs ml-1">(incl. 10% buffer)</span>
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                    {result.skeins}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">
                    {result.skeins === 1 ? "skein" : "skeins"}
                    <span className="text-xs ml-1">
                      ({units === "metric" ? result.skeinYds : result.skeinYds} {units === "metric" ? "m" : "yd"} each)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">
                    {units === "metric" ? result.grams.toLocaleString() : result.ounces} {units === "metric" ? "g" : "oz"}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">total weight</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">
                    {units === "metric" ? Math.round(ydsToM(result.yardsNoBuffer)).toLocaleString() : result.yardsNoBuffer.toLocaleString()} {units === "metric" ? "m" : "yd"}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">without buffer</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Yarn estimate: ${result.yardsWithBuffer} yards (${result.meters} m) / ${result.skeins} skeins / ${result.grams}g — ${yw.label}, ${sp.label}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="btn-secondary text-sm"
                >
                  📋 Copy
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary text-sm"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partial skein calculator */}
      <div className="border-t border-cream-300 dark:border-bark-700 pt-8">
        <button
          type="button"
          onClick={() => setShowPartial(!showPartial)}
          className="flex items-center gap-2 text-sage-600 dark:text-sage-400 font-medium hover:underline"
        >
          <span>{showPartial ? "▾" : "▸"}</span>
          🧶 Leftover Yarn Calculator
          <span className="text-xs text-bark-400 dark:text-bark-500 font-normal">
            — weigh your partial skein to find remaining yardage
          </span>
        </button>

        {showPartial && (
          <div className="mt-4 p-5 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-4">
            <p className="text-sm text-bark-500 dark:text-bark-400">
              Weigh your partial skein on a kitchen or postage scale, then enter the numbers below.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label text-xs">
                  Partial weight ({units === "metric" ? "g" : "oz"})
                </label>
                <input
                  type="number"
                  value={partialWeight}
                  onChange={(e) => setPartialWeight(e.target.value)}
                  placeholder="42"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label text-xs">
                  Full skein ({units === "metric" ? "g" : "oz"})
                </label>
                <input
                  type="number"
                  value={partialSkeinWeight}
                  onChange={(e) => setPartialSkeinWeight(e.target.value)}
                  placeholder="100"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label text-xs">
                  Full skein ({units === "metric" ? "m" : "yd"})
                </label>
                <input
                  type="number"
                  value={partialSkeinYards}
                  onChange={(e) => setPartialSkeinYards(e.target.value)}
                  placeholder="220"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>

            {partialResult && (
              <div className="result-card">
                <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
                  ≈ {units === "metric" ? partialResult.meters : partialResult.yards} {yardLabel} remaining
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  {partialResult.pct}% of the skein left
                </p>
                {/* Visual bar */}
                <div className="mt-2 h-3 bg-cream-300 dark:bg-bark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, partialResult.pct)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
