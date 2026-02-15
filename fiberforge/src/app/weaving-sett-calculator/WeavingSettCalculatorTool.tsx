"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";

// ── DATA ──────────────────────────────────────────────────────────

interface YarnWeight {
  key: string;
  label: string;
  wpi: [number, number]; // wraps per inch range
  maxEpi: [number, number]; // maximum sett range for plain weave
}

const YARN_WEIGHTS: YarnWeight[] = [
  { key: "lace", label: "Lace / Cobweb", wpi: [18, 30], maxEpi: [24, 40] },
  { key: "fingering", label: "Fingering / Sock", wpi: [14, 18], maxEpi: [18, 24] },
  { key: "sport", label: "Sport", wpi: [12, 14], maxEpi: [15, 18] },
  { key: "dk", label: "DK", wpi: [10, 12], maxEpi: [12, 16] },
  { key: "worsted", label: "Worsted", wpi: [8, 10], maxEpi: [10, 14] },
  { key: "bulky", label: "Bulky", wpi: [5, 8], maxEpi: [6, 10] },
  { key: "superbulky", label: "Super Bulky", wpi: [3, 5], maxEpi: [4, 6] },
];

interface WeaveStructure {
  key: string;
  label: string;
  settFactor: number; // multiply max EPI by this
  desc: string;
}

const STRUCTURES: WeaveStructure[] = [
  { key: "plain", label: "Plain Weave (Tabby)", settFactor: 0.5, desc: "Over one, under one. Firmest structure." },
  { key: "twill", label: "Twill (2/2)", settFactor: 0.6, desc: "Diagonal pattern. Denser than plain weave." },
  { key: "twill31", label: "Twill (3/1)", settFactor: 0.65, desc: "Warp-dominant twill. Very dense." },
  { key: "basket", label: "Basket Weave", settFactor: 0.5, desc: "Pairs of threads over and under." },
  { key: "satin", label: "Satin (5-shaft)", settFactor: 0.7, desc: "Long floats. Drapey, dense sett." },
  { key: "lace", label: "Lace Weave", settFactor: 0.35, desc: "Open structure. Lower sett for holes." },
  { key: "waffle", label: "Waffle", settFactor: 0.55, desc: "Textured, thick. Medium-high sett." },
];

const SHRINKAGE: Record<string, number> = {
  cotton: 0.10,
  wool: 0.12,
  linen: 0.05,
  silk: 0.08,
  synthetic: 0.03,
  blend: 0.08,
};

type Tab = "sett" | "warp" | "reed";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function WeavingSettCalculatorTool() {
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [tab, setTab] = useState<Tab>("sett");

  // Sett tab
  const [yarnWeight, setYarnWeight] = useState("worsted");
  const [structure, setStructure] = useState("plain");
  const [customWpi, setCustomWpi] = useState("");
  const [useCustomWpi, setUseCustomWpi] = useState(false);

  // Warp tab
  const [projectLength, setProjectLength] = useState("");
  const [projectWidth, setProjectWidth] = useState("");
  const [loomWaste, setLoomWaste] = useState("27");
  const [sampling, setSampling] = useState("6");
  const [fiber, setFiber] = useState("cotton");
  const [epiInput, setEpiInput] = useState("");
  const [ydsPerUnit, setYdsPerUnit] = useState("");

  // Reed tab
  const [desiredSett, setDesiredSett] = useState("");
  const [reedDent, setReedDent] = useState("12");

  const dim = units === "metric" ? "cm" : "in";

  // Sett result
  const settResult = useMemo(() => {
    const yw = YARN_WEIGHTS.find((w) => w.key === yarnWeight);
    const st = STRUCTURES.find((s) => s.key === structure);
    if (!yw || !st) return null;

    const wpi = useCustomWpi && customWpi ? parseFloat(customWpi) : (yw.wpi[0] + yw.wpi[1]) / 2;
    if (wpi <= 0) return null;

    // Recommended sett = WPI × structure factor
    const maxEpi = wpi;
    const recEpi = Math.round(maxEpi * st.settFactor);
    const recEpiLow = Math.round(maxEpi * st.settFactor * 0.85);
    const recEpiHigh = Math.round(maxEpi * st.settFactor * 1.15);

    return {
      wpi,
      recEpi,
      recEpiLow,
      recEpiHigh,
      structure: st.label,
    };
  }, [yarnWeight, structure, customWpi, useCustomWpi]);

  // Warp length result
  const warpResult = useMemo(() => {
    const len = parseFloat(projectLength) || 0;
    const wid = parseFloat(projectWidth) || 0;
    const waste = parseFloat(loomWaste) || 0;
    const samp = parseFloat(sampling) || 0;
    const epi = parseFloat(epiInput) || 0;
    const ypg = parseFloat(ydsPerUnit) || 0;

    if (len <= 0 || wid <= 0) return null;

    const lenIn = units === "metric" ? len / 2.54 : len;
    const widIn = units === "metric" ? wid / 2.54 : wid;
    const wasteIn = units === "metric" ? waste / 2.54 : waste;
    const sampIn = units === "metric" ? samp / 2.54 : samp;

    const shrinkPct = SHRINKAGE[fiber] || 0.08;
    const shrinkAllowance = lenIn * shrinkPct;

    const totalWarpLength = lenIn + wasteIn + sampIn + shrinkAllowance;
    const totalEnds = epi > 0 ? Math.round(widIn * epi) : 0;
    const totalWarpYards = totalEnds > 0 ? (totalEnds * totalWarpLength) / 36 : 0;

    // Weft estimate: roughly same yardage as warp for balanced fabrics
    const totalWeftYards = epi > 0 ? (widIn * (lenIn / 36)) * epi * 1.1 : 0;

    return {
      totalWarpLengthIn: +totalWarpLength.toFixed(1),
      totalWarpLengthCm: +(totalWarpLength * 2.54).toFixed(1),
      shrinkPct: Math.round(shrinkPct * 100),
      totalEnds,
      warpYards: Math.round(totalWarpYards),
      warpMeters: Math.round(totalWarpYards * 0.9144),
      weftYards: Math.round(totalWeftYards),
      weftMeters: Math.round(totalWeftYards * 0.9144),
      totalYards: Math.round(totalWarpYards + totalWeftYards),
      skeinsNeeded: ypg > 0 ? Math.ceil((totalWarpYards + totalWeftYards) / ypg) : 0,
    };
  }, [projectLength, projectWidth, loomWaste, sampling, fiber, epiInput, units, ydsPerUnit]);

  // Reed result
  const reedResult = useMemo(() => {
    const sett = parseInt(desiredSett) || 0;
    const dent = parseInt(reedDent) || 0;
    if (sett <= 0 || dent <= 0) return null;

    const ratio = sett / dent;
    const patterns: string[] = [];

    if (ratio === Math.floor(ratio)) {
      patterns.push(`${Math.floor(ratio)} per dent (every dent)`);
    } else if (ratio < 1) {
      const skip = Math.round(1 / ratio);
      patterns.push(`1 per dent, skip every ${skip}th dent`);
    } else {
      const base = Math.floor(ratio);
      const extra = sett - base * dent;
      if (extra === 0) {
        patterns.push(`${base} per dent`);
      } else {
        patterns.push(`Alternate ${base} and ${base + 1} per dent`);
        patterns.push(`${base + 1} in ${extra} dents, ${base} in ${dent - extra} dents (per ${dent} dents)`);
      }
    }

    return { sett, dent, ratio: +ratio.toFixed(2), patterns };
  }, [desiredSett, reedDent]);

  return (
    <div className="space-y-6">
      <UnitToggle value={units} onChange={setUnits} />

      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap">
        {([
          ["sett", "⚙️ Sett (EPI)"],
          ["warp", "📏 Warp Length"],
          ["reed", "🔧 Reed Sub"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === key ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── SETT TAB ───────────────────────────────────────────── */}
      {tab === "sett" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="label">Yarn Weight</label>
              <select value={yarnWeight} onChange={(e) => setYarnWeight(e.target.value)} className="select">
                {YARN_WEIGHTS.map((w) => (
                  <option key={w.key} value={w.key}>{w.label} ({w.wpi[0]}&ndash;{w.wpi[1]} WPI)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Weave Structure</label>
              <select value={structure} onChange={(e) => setStructure(e.target.value)} className="select">
                {STRUCTURES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400 cursor-pointer">
            <input type="checkbox" checked={useCustomWpi} onChange={(e) => setUseCustomWpi(e.target.checked)} className="rounded border-bark-300" />
            I know my exact WPI
          </label>
          {useCustomWpi && (
            <input type="number" value={customWpi} onChange={(e) => setCustomWpi(e.target.value)}
              placeholder="e.g. 12" className="input max-w-[120px]" min="1" inputMode="numeric" />
          )}

          {settResult && (
            <div className="result-card space-y-3">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                Recommended Sett
              </h3>
              <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                {settResult.recEpiLow}&ndash;{settResult.recEpiHigh} EPI
              </p>
              <p className="text-sm text-bark-500 dark:text-bark-400">
                Target: {settResult.recEpi} ends per inch for {settResult.structure}
              </p>
              <p className="text-xs text-bark-400 dark:text-bark-500">
                Based on ~{Math.round(settResult.wpi)} WPI. Always sample first — fiber, twist, and finishing change sett.
              </p>
            </div>
          )}

          {/* Reference table */}
          <div>
            <p className="label">Sett Reference by Structure</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Structure</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Factor</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200 hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {STRUCTURES.map((s) => (
                    <tr key={s.key} className={`transition-colors ${s.key === structure ? "bg-sage-50 dark:bg-sage-900/20" : ""}`}>
                      <td className="py-2 px-3 font-medium text-bark-700 dark:text-cream-200">{s.label}</td>
                      <td className="py-2 px-3 text-bark-600 dark:text-cream-300">{Math.round(s.settFactor * 100)}% of WPI</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400 text-xs hidden sm:table-cell">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── WARP TAB ───────────────────────────────────────────── */}
      {tab === "warp" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Calculate total warp length including loom waste, sampling, and shrinkage.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Project width ({dim})</label>
              <input type="number" value={projectWidth} onChange={(e) => setProjectWidth(e.target.value)}
                placeholder="20" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">Project length ({dim})</label>
              <input type="number" value={projectLength} onChange={(e) => setProjectLength(e.target.value)}
                placeholder="72" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">
                EPI (sett)
                <Tooltip text="Ends per inch. Use the Sett tab to calculate this." />
              </label>
              <input type="number" value={epiInput} onChange={(e) => setEpiInput(e.target.value)}
                placeholder="12" className="input" min="0" inputMode="numeric" />
            </div>
            <div>
              <label className="label">Loom waste ({dim})</label>
              <input type="number" value={loomWaste} onChange={(e) => setLoomWaste(e.target.value)}
                placeholder="27" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">Sampling ({dim})</label>
              <input type="number" value={sampling} onChange={(e) => setSampling(e.target.value)}
                placeholder="6" className="input" min="0" inputMode="decimal" />
            </div>
            <div>
              <label className="label">Fiber type</label>
              <select value={fiber} onChange={(e) => setFiber(e.target.value)} className="select">
                {Object.entries(SHRINKAGE).map(([k, v]) => (
                  <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)} (~{Math.round(v * 100)}% shrink)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                Yards per skein
                <Tooltip text="Optional: enter your skein yardage to get a skein count." />
              </label>
              <input type="number" value={ydsPerUnit} onChange={(e) => setYdsPerUnit(e.target.value)}
                placeholder="220" className="input" min="0" inputMode="decimal" />
            </div>
          </div>

          {warpResult && (
            <div className="result-card space-y-4">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Warp Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                    {units === "metric" ? `${warpResult.totalWarpLengthCm} cm` : `${warpResult.totalWarpLengthIn}″`}
                  </p>
                  <p className="text-sm text-bark-500 dark:text-bark-400">total warp length (incl. {warpResult.shrinkPct}% shrinkage)</p>
                </div>
                {warpResult.totalEnds > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">{warpResult.totalEnds}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">total ends</p>
                  </div>
                )}
                {warpResult.warpYards > 0 && (
                  <>
                    <div>
                      <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">
                        {units === "metric" ? `${warpResult.warpMeters} m` : `${warpResult.warpYards} yd`}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">warp yarn</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-bark-700 dark:text-cream-200">
                        {units === "metric" ? `${warpResult.weftMeters} m` : `${warpResult.weftYards} yd`}
                      </p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">weft yarn (estimate)</p>
                    </div>
                  </>
                )}
                {warpResult.skeinsNeeded > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">{warpResult.skeinsNeeded}</p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">skeins total (warp + weft)</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REED TAB ───────────────────────────────────────────── */}
      {tab === "reed" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Figure out how to thread your reed when it doesn&apos;t exactly match your desired sett.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="label">
                Desired sett (EPI)
                <Tooltip text="How many ends per inch you want." />
              </label>
              <input type="number" value={desiredSett} onChange={(e) => setDesiredSett(e.target.value)}
                placeholder="15" className="input" min="1" inputMode="numeric" />
            </div>
            <div>
              <label className="label">
                Reed dent
                <Tooltip text="Your reed&apos;s dents per inch. Common sizes: 8, 10, 12, 15." />
              </label>
              <select value={reedDent} onChange={(e) => setReedDent(e.target.value)} className="select">
                {[6, 8, 10, 12, 15, 16, 20].map((d) => (
                  <option key={d} value={d}>{d}-dent</option>
                ))}
              </select>
            </div>
          </div>

          {reedResult && (
            <div className="result-card space-y-3">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                Threading Plan
              </h3>
              <p className="text-sm text-bark-500 dark:text-bark-400">
                {reedResult.sett} EPI in a {reedResult.dent}-dent reed ({reedResult.ratio} ends per dent average)
              </p>
              <div className="space-y-2">
                {reedResult.patterns.map((p, i) => (
                  <p key={i} className="text-bark-700 dark:text-cream-200 font-medium">{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
