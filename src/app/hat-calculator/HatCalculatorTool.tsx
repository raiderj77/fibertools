"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

// ── TYPES ───────────────────────────────────────────────────────────

type StitchType = "stockinette" | "ribbing" | "colorwork";

interface SizeEntry {
  label: string;
  circ: number;
  range: string;
  height: string;
  yardage: string;
}

// ── REFERENCE DATA ──────────────────────────────────────────────────

const SIZES: SizeEntry[] = [
  { label: "Preemie", circ: 11.5, range: "11\u201312\u2033", height: "4\u20134.5\u2033", yardage: "50\u2013100 yds" },
  { label: "Newborn", circ: 13.5, range: "13\u201314\u2033", height: "5\u20135.5\u2033", yardage: "50\u2013100 yds" },
  { label: "Baby 3\u20136 mo", circ: 14.5, range: "14\u201315\u2033", height: "5.5\u20136\u2033", yardage: "50\u2013100 yds" },
  { label: "Baby 6\u201312 mo", circ: 16.5, range: "16\u201317\u2033", height: "6\u20136.5\u2033", yardage: "50\u2013100 yds" },
  { label: "Toddler", circ: 17.5, range: "17\u201318\u2033", height: "7\u20137.5\u2033", yardage: "100\u2013150 yds" },
  { label: "Child", circ: 19, range: "18\u201320\u2033", height: "7.5\u20138\u2033", yardage: "100\u2013150 yds" },
  { label: "Teen / Small Adult", circ: 20.5, range: "20\u201321\u2033", height: "8\u20138.5\u2033", yardage: "150\u2013250 yds" },
  { label: "Average Adult", circ: 22, range: "21\u201323\u2033", height: "8.5\u20139\u2033", yardage: "150\u2013250 yds" },
  { label: "Large Adult", circ: 23.5, range: "23\u201324\u2033", height: "9\u20139.5\u2033", yardage: "150\u2013250 yds" },
];

const EASE: Record<StitchType, { label: string; pct: number }> = {
  stockinette: { label: "Stockinette", pct: 10 },
  ribbing: { label: "Ribbing", pct: 15 },
  colorwork: { label: "Colorwork", pct: 5 },
};

// ── COMPONENT ───────────────────────────────────────────────────────

export default function HatCalculatorTool() {
  const [sizePreset, setSizePreset] = useState("");
  const [customCirc, setCustomCirc] = useState("");
  const [stitchType, setStitchType] = useState<StitchType>("stockinette");
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeInches, setGaugeInches] = useState("4");

  // Resolve head circumference from preset or custom
  const headCirc = useMemo(() => {
    if (sizePreset) {
      const found = SIZES.find((s) => s.label === sizePreset);
      return found ? found.circ : 0;
    }
    return parseFloat(customCirc) || 0;
  }, [sizePreset, customCirc]);

  // Look up size entry for height/yardage
  const sizeEntry = useMemo(() => {
    if (sizePreset) return SIZES.find((s) => s.label === sizePreset) ?? null;
    // Match custom circ to closest size
    if (headCirc <= 0) return null;
    let best: SizeEntry | null = null;
    let bestDist = Infinity;
    for (const s of SIZES) {
      const dist = Math.abs(s.circ - headCirc);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    return best;
  }, [sizePreset, headCirc]);

  // ── RESULTS ─────────────────────────────────────────────────────
  const result = useMemo(() => {
    const gSt = parseFloat(gaugeStitches) || 0;
    const gIn = parseFloat(gaugeInches) || 0;
    if (headCirc <= 0 || gSt <= 0 || gIn <= 0) return null;

    const easePct = EASE[stitchType].pct;
    const targetCirc = headCirc * (1 - easePct / 100);
    const stsPerInch = gSt / gIn;
    const rawCastOn = Math.round(targetCirc * stsPerInch);

    // Round to nearest multiple of 8
    const castOn = Math.round(rawCastOn / 8) * 8;
    const stsPerSection = castOn / 8;
    const decreaseRounds = stsPerSection - 1;

    // Build crown decrease schedule
    const schedule: string[] = [];
    let roundNum = 1;
    for (let i = decreaseRounds; i >= 1; i--) {
      schedule.push(
        `Round ${roundNum}: *K${i}, K2tog* repeat 8 times (${(i + 1) * 8 - 8} sts remain)`
      );
      roundNum++;
      if (i > 1) {
        schedule.push(`Round ${roundNum}: Knit even`);
        roundNum++;
      }
    }
    schedule.push(`Cut yarn, thread through remaining 8 stitches, pull tight.`);

    return {
      easePct,
      targetCirc: +targetCirc.toFixed(1),
      stsPerInch: +stsPerInch.toFixed(2),
      rawCastOn,
      castOn,
      stsPerSection,
      decreaseRounds,
      schedule,
    };
  }, [headCirc, stitchType, gaugeStitches, gaugeInches]);

  const stickySummary = result ? `Cast on ${result.castOn} stitches` : "";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Select a size or enter a head circumference, choose your stitch type, and enter your gauge.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size selection */}
        <div className="space-y-4 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
          <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Head Size</p>
          <div>
            <label className="label text-xs">Size Preset</label>
            <select
              value={sizePreset}
              onChange={(e) => {
                setSizePreset(e.target.value);
                if (e.target.value) setCustomCirc("");
              }}
              className="input"
            >
              <option value="">Custom measurement</option>
              {SIZES.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label} &mdash; {s.range}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">
              Head Circumference (in)
              <Tooltip text="Measure around the widest part of the head, just above the ears. If using a preset, this fills automatically." />
            </label>
            <input
              type="number"
              value={sizePreset ? (headCirc || "") : customCirc}
              onChange={(e) => {
                setSizePreset("");
                setCustomCirc(e.target.value);
              }}
              placeholder="e.g. 22"
              className="input"
              min="0"
              inputMode="decimal"
              disabled={!!sizePreset}
            />
          </div>
        </div>

        {/* Gauge & stitch type */}
        <div className="space-y-4 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
          <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Gauge &amp; Stitch Type</p>
          <div>
            <label className="label text-xs">Stitch Type</label>
            <select
              value={stitchType}
              onChange={(e) => setStitchType(e.target.value as StitchType)}
              className="input"
            >
              {Object.entries(EASE).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} ({val.pct}% negative ease)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Gauge Stitches</label>
              <input
                type="number"
                value={gaugeStitches}
                onChange={(e) => setGaugeStitches(e.target.value)}
                placeholder="e.g. 18"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="label text-xs">
                Over (in)
                <Tooltip text="The width your gauge swatch was measured over. Usually 4 inches." />
              </label>
              <input
                type="number"
                value={gaugeInches}
                onChange={(e) => setGaugeInches(e.target.value)}
                placeholder="4"
                className="input"
                min="0"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Hat Specifications
            </h3>

            {/* Key numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.castOn}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  cast on
                  {result.castOn !== result.rawCastOn && (
                    <span className="text-xs ml-1">(from {result.rawCastOn})</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.targetCirc}&Prime;
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  target circumference
                </p>
              </div>
              {sizeEntry && (
                <>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {sizeEntry.height}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">hat height</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {sizeEntry.yardage}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      est. yardage (worsted)
                    </p>
                  </div>
                </>
              )}
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500">
              {result.easePct}% negative ease applied &bull; rounded to nearest multiple of 8 for crown decreases
            </p>

            {/* Crown decrease schedule */}
            <div className="border-t border-cream-300 dark:border-bark-600 pt-4">
              <h4 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
                Crown Decrease Schedule (8-point)
              </h4>
              <div className="bg-cream-100 dark:bg-bark-800 rounded-xl p-4 max-h-64 overflow-y-auto">
                <ol className="text-sm text-bark-600 dark:text-cream-300 space-y-1 list-none">
                  {result.schedule.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your gauge before casting on.
            </p>

            <button
              type="button"
              onClick={() => {
                const text = [
                  `Hat: Cast on ${result.castOn} stitches`,
                  `Head circ: ${headCirc}" → target: ${result.targetCirc}" (${result.easePct}% neg. ease)`,
                  sizeEntry ? `Height: ${sizeEntry.height} | Yardage: ${sizeEntry.yardage}` : "",
                  "",
                  "Crown decreases:",
                  ...result.schedule,
                ]
                  .filter(Boolean)
                  .join("\n");
                navigator.clipboard.writeText(text);
              }}
              className="btn-secondary text-sm"
              aria-label="Copy hat specs to clipboard"
            >
              Copy result
            </button>
          </div>
        )}
      </StickyResult>

      {/* Size Reference Table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Hat Size Reference Chart
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Size</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Head Circ.</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Hat Height</th>
                <th className="py-2 pr-4 font-medium text-bark-600 dark:text-cream-300">Yardage (worsted)</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr
                  key={s.label}
                  className="border-b border-cream-200 dark:border-bark-700 last:border-0"
                >
                  <td className="py-2 pr-4 text-bark-700 dark:text-cream-200">{s.label}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{s.range}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{s.height}</td>
                  <td className="py-2 pr-4 text-bark-500 dark:text-bark-400">{s.yardage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Hat Knitting Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Negative ease is essential.</strong> Knitted fabric stretches, so the hat should be smaller than the head circumference to stay snug.</li>
          <li><strong>Ribbing stretches more</strong> than stockinette, which is why it gets 15% negative ease vs 10%.</li>
          <li><strong>Colorwork has less give,</strong> so only 5% negative ease is applied to prevent a too-tight fit.</li>
          <li><strong>Try the hat on</strong> before starting crown decreases. Work even rounds until the hat reaches the top of the ears.</li>
          <li><strong>Yardage estimates are for worsted weight.</strong> Bulky yarn uses more yardage per area; fingering weight uses less.</li>
        </ul>
      </div>
    </div>
  );
}
