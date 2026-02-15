"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

// ── DATA ──────────────────────────────────────────────────────────

interface FiberInfo {
  name: string;
  cpi: [number, number]; // crimps per inch range
  suggestedTpi: [number, number];
  notes: string;
}

const FIBERS: FiberInfo[] = [
  { name: "Merino (fine)", cpi: [14, 25], suggestedTpi: [6, 12], notes: "Versatile, soft. Medium twist." },
  { name: "Corriedale", cpi: [10, 16], suggestedTpi: [4, 8], notes: "Good beginner fiber. Medium twist." },
  { name: "BFL (Bluefaced Leicester)", cpi: [8, 14], suggestedTpi: [4, 8], notes: "Lustrous, bouncy. Medium-low twist." },
  { name: "Romney", cpi: [6, 10], suggestedTpi: [3, 6], notes: "Long staple, outerwear. Low twist." },
  { name: "Alpaca", cpi: [0, 4], suggestedTpi: [2, 5], notes: "No crimp/memory. Needs less twist. Slippery." },
  { name: "Silk (cultivated)", cpi: [0, 0], suggestedTpi: [4, 8], notes: "No crimp. Needs twist for structure. Very slippery." },
  { name: "Cotton", cpi: [0, 0], suggestedTpi: [8, 15], notes: "No crimp. Needs high twist. Spin worsted for strength." },
  { name: "Flax / Linen", cpi: [0, 0], suggestedTpi: [6, 12], notes: "Spin wet for smoothness. High twist." },
  { name: "Angora", cpi: [12, 20], suggestedTpi: [3, 6], notes: "Very fine, halo. Low twist to preserve loft." },
  { name: "Cashmere", cpi: [14, 20], suggestedTpi: [5, 10], notes: "Fine and soft. Medium twist." },
];

const YARN_TARGETS = [
  { name: "Lace (0)", wpi: [18, 30], ratio: [12, 20], tpi: [8, 14] },
  { name: "Fingering (1)", wpi: [14, 18], ratio: [8, 14], tpi: [5, 10] },
  { name: "Sport (2)", wpi: [12, 14], ratio: [6, 10], tpi: [4, 8] },
  { name: "DK (3)", wpi: [10, 12], ratio: [5, 8], tpi: [3, 6] },
  { name: "Worsted (4)", wpi: [8, 10], ratio: [4, 7], tpi: [3, 5] },
  { name: "Bulky (5)", wpi: [5, 8], ratio: [3, 5], tpi: [2, 4] },
  { name: "Super Bulky (6)", wpi: [3, 5], ratio: [2, 4], tpi: [1, 3] },
];

type Tab = "ratio" | "tpi" | "plying" | "fiber";

export default function SpinningCalculatorTool() {
  const [tab, setTab] = useState<Tab>("ratio");

  // Ratio tab
  const [driveWheel, setDriveWheel] = useState("");
  const [whorl, setWhorl] = useState("");

  // TPI tab
  const [tpiRatio, setTpiRatio] = useState("");
  const [draftLength, setDraftLength] = useState("");

  // Plying tab
  const [singlesTpi, setSinglesTpi] = useState("");
  const [plies, setPlies] = useState("2");

  // Ratio result
  const ratioResult = useMemo(() => {
    const dw = parseFloat(driveWheel) || 0;
    const wh = parseFloat(whorl) || 0;
    if (dw <= 0 || wh <= 0) return null;
    const ratio = dw / wh;
    const matchingWeight = YARN_TARGETS.find((y) => ratio >= y.ratio[0] && ratio <= y.ratio[1]);
    return { ratio: +ratio.toFixed(2), matchingWeight };
  }, [driveWheel, whorl]);

  // TPI result
  const tpiResult = useMemo(() => {
    const ratio = parseFloat(tpiRatio) || 0;
    const draft = parseFloat(draftLength) || 0;
    if (ratio <= 0 || draft <= 0) return null;
    const tpi = ratio / draft;
    const matchingWeight = YARN_TARGETS.find((y) => tpi >= y.tpi[0] && tpi <= y.tpi[1]);
    return { tpi: +tpi.toFixed(1), matchingWeight };
  }, [tpiRatio, draftLength]);

  // Plying result
  const plyResult = useMemo(() => {
    const tpi = parseFloat(singlesTpi) || 0;
    const p = parseInt(plies) || 2;
    if (tpi <= 0) return null;
    const plyTpi = tpi / Math.sqrt(p);
    const plyAngle = Math.atan(1 / plyTpi) * (180 / Math.PI);
    return {
      plyTpi: +plyTpi.toFixed(1),
      balancedTwist: +(tpi * 0.6).toFixed(1),
      plyAngle: +plyAngle.toFixed(0),
      plies: p,
    };
  }, [singlesTpi, plies]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap">
        {([
          ["ratio", "⚙️ Drive Ratio"],
          ["tpi", "🌀 TPI Calculator"],
          ["plying", "🧵 Plying"],
          ["fiber", "🐑 Fiber Guide"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === key ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── RATIO TAB ──────────────────────────────────────────── */}
      {tab === "ratio" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Measure your drive wheel and whorl diameters to calculate the drive ratio.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">
                Drive wheel diameter
                <Tooltip text="The large wheel. Measure across the widest point in inches or cm — units don't matter as long as both match." />
              </label>
              <input type="number" value={driveWheel} onChange={(e) => setDriveWheel(e.target.value)}
                placeholder="e.g. 22" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">
                Whorl diameter
                <Tooltip text="The small pulley that the flyer/bobbin spins on. Measure the same units as the drive wheel." />
              </label>
              <input type="number" value={whorl} onChange={(e) => setWhorl(e.target.value)}
                placeholder="e.g. 2.5" className="input" min="0" inputMode="decimal" />
            </div>
          </div>

          {ratioResult && (
            <div className="result-card">
              <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{ratioResult.ratio}:1</p>
              <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
                For every treadle, the flyer spins {ratioResult.ratio} times.
              </p>
              {ratioResult.matchingWeight && (
                <p className="text-sm text-sage-600 dark:text-sage-400 mt-2">
                  This ratio is typically used for <strong>{ratioResult.matchingWeight.name}</strong> weight yarn.
                </p>
              )}
            </div>
          )}

          {/* Reference table */}
          <div>
            <p className="label">Ratio → Yarn Weight Reference</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Yarn Weight</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Ratio Range</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">WPI</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">TPI Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {YARN_TARGETS.map((y) => (
                    <tr key={y.name} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10">
                      <td className="py-2 px-3 font-medium text-bark-700 dark:text-cream-200">{y.name}</td>
                      <td className="py-2 px-3 text-bark-600 dark:text-cream-300">{y.ratio[0]}–{y.ratio[1]}:1</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">{y.wpi[0]}–{y.wpi[1]}</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">{y.tpi[0]}–{y.tpi[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TPI TAB ────────────────────────────────────────────── */}
      {tab === "tpi" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Calculate twists per inch from your drive ratio and drafting length.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">
                Drive ratio
                <Tooltip text="Your wheel's drive ratio (e.g. 8.8). Calculate it in the Drive Ratio tab if you don't know it." />
              </label>
              <input type="number" value={tpiRatio} onChange={(e) => setTpiRatio(e.target.value)}
                placeholder="e.g. 8.8" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">
                Draft length (inches)
                <Tooltip text="How many inches of fiber you draft per treadle. Typically 1-4 inches. Shorter draft = more twist." />
              </label>
              <input type="number" value={draftLength} onChange={(e) => setDraftLength(e.target.value)}
                placeholder="e.g. 2" className="input" min="0" inputMode="decimal" />
            </div>
          </div>

          {tpiResult && (
            <div className="result-card">
              <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{tpiResult.tpi} TPI</p>
              <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">twists per inch</p>
              {tpiResult.matchingWeight && (
                <p className="text-sm text-sage-600 dark:text-sage-400 mt-2">
                  This TPI is typical for <strong>{tpiResult.matchingWeight.name}</strong> weight singles.
                </p>
              )}
            </div>
          )}

          <div className="result-card">
            <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">💡 TPI Tips</h3>
            <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
              <li><strong>Fewer TPI</strong> = softer, loftier yarn (good for next-to-skin garments).</li>
              <li><strong>More TPI</strong> = stronger, more durable yarn (good for socks, weaving warp).</li>
              <li>To measure TPI: let a length of singles relax, then count twists in one inch.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── PLYING TAB ─────────────────────────────────────────── */}
      {tab === "plying" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Calculate how much plying twist you need for balanced yarn.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">Singles TPI</label>
              <input type="number" value={singlesTpi} onChange={(e) => setSinglesTpi(e.target.value)}
                placeholder="e.g. 8" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">Number of plies</label>
              <select value={plies} onChange={(e) => setPlies(e.target.value)} className="select">
                <option value="2">2-ply</option>
                <option value="3">3-ply</option>
                <option value="4">4-ply (cable)</option>
              </select>
            </div>
          </div>

          {plyResult && (
            <div className="result-card space-y-3">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{plyResult.plyTpi} TPI</p>
                <p className="text-sm text-bark-500 dark:text-bark-400">theoretical plying twist ({plyResult.plies}-ply)</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">{plyResult.balancedTwist} TPI</p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  suggested plying twist (≈60% of singles for balance)
                </p>
              </div>
              <p className="text-xs text-bark-400 dark:text-bark-500">
                Ply in the <strong>opposite direction</strong> of your spinning (usually ply clockwise / S-twist if you spun counter-clockwise / Z-twist).
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── FIBER TAB ──────────────────────────────────────────── */}
      {tab === "fiber" && (
        <div className="space-y-4">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Suggested starting twist for common spinning fibers. Adjust based on your prep and intended use.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                  <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Fiber</th>
                  <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    CPI
                    <Tooltip text="Crimps per inch — a measure of the fiber's natural wave. More crimps = needs more twist." />
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Suggested TPI</th>
                  <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200 hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                {FIBERS.map((f) => (
                  <tr key={f.name} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10">
                    <td className="py-3 px-3 font-medium text-bark-700 dark:text-cream-200">{f.name}</td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">
                      {f.cpi[0] === 0 && f.cpi[1] === 0 ? "None" : `${f.cpi[0]}–${f.cpi[1]}`}
                    </td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">{f.suggestedTpi[0]}–{f.suggestedTpi[1]}</td>
                    <td className="py-3 px-3 text-bark-500 dark:text-bark-400 text-xs hidden sm:table-cell">{f.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
