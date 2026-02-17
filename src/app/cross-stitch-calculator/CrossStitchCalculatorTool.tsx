"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";

// ── DATA ──────────────────────────────────────────────────────────

const FABRIC_COUNTS = [
  { count: 11, name: "Aida 11", desc: "Large, beginner-friendly" },
  { count: 14, name: "Aida 14", desc: "Most popular count" },
  { count: 16, name: "Aida 16", desc: "Slightly finer detail" },
  { count: 18, name: "Aida 18", desc: "Fine detail, smaller finish" },
  { count: 22, name: "Hardanger 22", desc: "Very fine work" },
  { count: 25, name: "Evenweave 25", desc: "Over-two = 12.5 ct effective" },
  { count: 28, name: "Evenweave 28", desc: "Over-two = 14 ct effective" },
  { count: 32, name: "Linen 32", desc: "Over-two = 16 ct effective" },
  { count: 36, name: "Linen 36", desc: "Over-two = 18 ct effective" },
  { count: 40, name: "Linen 40", desc: "Very fine, over-two = 20 ct" },
];

// Approximate inches of 6-strand floss per stitch (full cross)
const INCHES_PER_STITCH = 1.1;
const FLOSS_SKEIN_INCHES = 472; // 8 meters ≈ 472 inches per DMC skein

type Tab = "size" | "thread" | "fabric";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function CrossStitchCalculatorTool() {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [tab, setTab] = useState<Tab>("size");

  // Size calculator
  const [patternW, setPatternW] = useState("");
  const [patternH, setPatternH] = useState("");
  const [fabricCount, setFabricCount] = useState(14);
  const [overTwo, setOverTwo] = useState(false);

  // Thread estimator
  const [threadStitches, setThreadStitches] = useState("");
  const [threadStrands, setThreadStrands] = useState("2");

  // Fabric calculator
  const [marginInches, setMarginInches] = useState("3");

  const effectiveCount = overTwo ? fabricCount / 2 : fabricCount;
  const dim = units === "metric" ? "cm" : "in";

  // Size results
  const sizeResult = useMemo(() => {
    const w = parseInt(patternW) || 0;
    const h = parseInt(patternH) || 0;
    if (w <= 0 || h <= 0) return null;

    const results = FABRIC_COUNTS.map((fc) => {
      const ec = overTwo && fc.count > 20 ? fc.count / 2 : fc.count;
      const widthIn = w / ec;
      const heightIn = h / ec;
      return {
        ...fc,
        effectiveCount: ec,
        widthIn,
        heightIn,
        widthCm: +(widthIn * 2.54).toFixed(1),
        heightCm: +(heightIn * 2.54).toFixed(1),
      };
    });

    // Primary result for selected count
    const primary = results.find((r) => r.count === fabricCount);
    return { results, primary };
  }, [patternW, patternH, fabricCount, overTwo]);

  // Thread result
  const threadResult = useMemo(() => {
    const stitches = parseInt(threadStitches) || 0;
    const strands = parseInt(threadStrands) || 2;
    if (stitches <= 0) return null;

    const strandMultiplier = strands / 2; // base calc is for 2 strands
    const totalInches = stitches * INCHES_PER_STITCH * strandMultiplier;
    const skeins = totalInches / FLOSS_SKEIN_INCHES;

    return {
      totalInches: Math.round(totalInches),
      totalMeters: +(totalInches * 0.0254).toFixed(1),
      skeins: +skeins.toFixed(2),
      skeinsRounded: Math.ceil(skeins),
    };
  }, [threadStitches, threadStrands]);

  // Fabric result
  const fabricResult = useMemo(() => {
    const w = parseInt(patternW) || 0;
    const h = parseInt(patternH) || 0;
    const margin = parseFloat(marginInches) || 3;
    if (w <= 0 || h <= 0) return null;

    const marginIn = units === "metric" ? margin / 2.54 : margin;
    const designW = w / effectiveCount;
    const designH = h / effectiveCount;
    const totalW = designW + marginIn * 2;
    const totalH = designH + marginIn * 2;

    return {
      designW: +designW.toFixed(1),
      designH: +designH.toFixed(1),
      totalW: +totalW.toFixed(1),
      totalH: +totalH.toFixed(1),
      totalWcm: +(totalW * 2.54).toFixed(1),
      totalHcm: +(totalH * 2.54).toFixed(1),
    };
  }, [patternW, patternH, effectiveCount, marginInches, units]);

  // Sticky summary
  const stickySummary = (() => {
    if (tab === "size" && sizeResult?.primary) {
      return units === "metric"
        ? `${sizeResult.primary.widthCm} × ${sizeResult.primary.heightCm} cm`
        : `${sizeResult.primary.widthIn.toFixed(1)} × ${sizeResult.primary.heightIn.toFixed(1)}″`;
    }
    if (tab === "thread" && threadResult) {
      return `${threadResult.skeinsRounded} skein${threadResult.skeinsRounded !== 1 ? "s" : ""} needed`;
    }
    if (tab === "fabric" && fabricResult) {
      return units === "metric"
        ? `${fabricResult.totalWcm} × ${fabricResult.totalHcm} cm fabric`
        : `${fabricResult.totalW} × ${fabricResult.totalH}″ fabric`;
    }
    return "";
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <UnitToggle value={units} onChange={setUnits} />
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap">
        {([
          ["size", "📏 Finished Size"],
          ["thread", "🧵 Thread Estimator"],
          ["fabric", "🪡 Fabric Amount"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === key ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Shared inputs */}
      {(tab === "size" || tab === "fabric") && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Pattern width (stitches)</label>
              <input type="number" value={patternW} onChange={(e) => setPatternW(e.target.value)}
                placeholder="150" className="input" min="1" inputMode="numeric" />
            </div>
            <div>
              <label className="label">Pattern height (stitches)</label>
              <input type="number" value={patternH} onChange={(e) => setPatternH(e.target.value)}
                placeholder="200" className="input" min="1" inputMode="numeric" />
            </div>
            <div>
              <label className="label">
                Fabric count
                <Tooltip text="The number of threads per inch in your fabric. Aida 14 is the most common." />
              </label>
              <select value={fabricCount} onChange={(e) => setFabricCount(parseInt(e.target.value))} className="select">
                {FABRIC_COUNTS.map((fc) => (
                  <option key={fc.count} value={fc.count}>{fc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-bark-600 dark:text-cream-300 cursor-pointer">
                <input type="checkbox" checked={overTwo} onChange={(e) => setOverTwo(e.target.checked)} className="rounded border-bark-300" />
                Stitch over two
                <Tooltip text="Common on evenweave and linen. Each cross stitch covers 2 threads, halving the effective count." />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── SIZE TAB ───────────────────────────────────────────── */}
      {tab === "size" && sizeResult && (
        <div className="space-y-6">
          {/* Primary result */}
          <StickyResult summary={stickySummary} visible={!!sizeResult.primary}>
            {sizeResult.primary && (
              <div className="result-card">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Finished Size on {sizeResult.primary.name}
                  {overTwo && sizeResult.primary.count > 20 ? " (over two)" : ""}
                </h3>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100 mt-2">
                  {units === "metric"
                    ? `${sizeResult.primary.widthCm} × ${sizeResult.primary.heightCm} cm`
                    : `${sizeResult.primary.widthIn.toFixed(1)} × ${sizeResult.primary.heightIn.toFixed(1)}″`}
                </p>
              </div>
            )}
          </StickyResult>

          {/* Comparison table */}
          <div>
            <p className="label">Compare across fabric counts</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Fabric</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Eff. Count</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Width</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {sizeResult.results.map((r) => (
                    <tr key={r.count}
                      className={`transition-colors ${r.count === fabricCount ? "bg-sage-50 dark:bg-sage-900/20 font-medium" : "hover:bg-sage-50/50 dark:hover:bg-sage-900/10"}`}>
                      <td className="py-2 px-3 text-bark-700 dark:text-cream-200">{r.name}</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">{r.effectiveCount}</td>
                      <td className="py-2 px-3 text-bark-600 dark:text-cream-300">
                        {units === "metric" ? `${r.widthCm} cm` : `${r.widthIn.toFixed(1)}″`}
                      </td>
                      <td className="py-2 px-3 text-bark-600 dark:text-cream-300">
                        {units === "metric" ? `${r.heightCm} cm` : `${r.heightIn.toFixed(1)}″`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── THREAD TAB ─────────────────────────────────────────── */}
      {tab === "thread" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Enter the total stitch count for one color to estimate how many skeins of floss you need.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">
                Stitches (one color)
                <Tooltip text="Total full cross stitches in this color. Check your pattern chart." />
              </label>
              <input type="number" value={threadStitches} onChange={(e) => setThreadStitches(e.target.value)}
                placeholder="500" className="input" min="1" inputMode="numeric" />
            </div>
            <div>
              <label className="label">Strands used</label>
              <select value={threadStrands} onChange={(e) => setThreadStrands(e.target.value)} className="select">
                <option value="1">1 strand</option>
                <option value="2">2 strands (standard)</option>
                <option value="3">3 strands</option>
                <option value="4">4 strands</option>
                <option value="6">6 strands (full)</option>
              </select>
            </div>
          </div>

          <StickyResult summary={stickySummary} visible={!!threadResult}>
            {threadResult && (
              <div className="result-card space-y-3">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Thread Needed
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{threadResult.skeinsRounded}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      {threadResult.skeinsRounded === 1 ? "skein" : "skeins"} (8m / 8.7yd each)
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500">
                      Exact: {threadResult.skeins} skeins
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">
                      {threadResult.totalMeters} m
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      ({threadResult.totalInches}″) total thread
                    </p>
                  </div>
                </div>
                <p className="text-xs text-bark-400 dark:text-bark-500">
                  Estimate includes waste from threading and finishing. Buy 1 extra skein for safety on large areas.
                </p>
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* ── FABRIC TAB ─────────────────────────────────────────── */}
      {tab === "fabric" && fabricResult && (
        <div className="space-y-6">
          <div className="max-w-xs">
            <label className="label">
              Margin on each side ({dim})
              <Tooltip text="Extra fabric around the design for framing or finishing. 3 inches (7.5 cm) is standard for framing." />
            </label>
            <input type="number" value={marginInches} onChange={(e) => setMarginInches(e.target.value)}
              placeholder="3" className="input" min="0" inputMode="decimal" />
          </div>

          <StickyResult summary={stickySummary} visible={!!fabricResult}>
            <div className="result-card space-y-3">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                Fabric Needed
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-bark-500 dark:text-bark-400">Design area</p>
                  <p className="text-lg font-semibold text-bark-700 dark:text-cream-200">
                    {units === "metric"
                      ? `${(fabricResult.designW * 2.54).toFixed(1)} × ${(fabricResult.designH * 2.54).toFixed(1)} cm`
                      : `${fabricResult.designW} × ${fabricResult.designH}″`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-bark-500 dark:text-bark-400">Total with margins</p>
                  <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                    {units === "metric"
                      ? `${fabricResult.totalWcm} × ${fabricResult.totalHcm} cm`
                      : `${fabricResult.totalW} × ${fabricResult.totalH}″`}
                  </p>
                </div>
              </div>
            </div>
          </StickyResult>
        </div>
      )}

      {/* Tips */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">💡 Cross Stitch Tips</h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Aida 14</strong> is the most popular fabric count — great for beginners and most patterns.</li>
          <li><strong>Over-two stitching</strong> on evenweave/linen gives a softer look than Aida at the same effective count.</li>
          <li><strong>Always add margins</strong> — 3 inches per side minimum for framing, more for scroll frames.</li>
          <li><strong>Thread estimates are per color.</strong> Repeat the calculation for each color in your pattern.</li>
        </ul>
      </div>
    </div>
  );
}
