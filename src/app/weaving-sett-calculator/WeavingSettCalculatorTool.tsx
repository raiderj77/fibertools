"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import UnitToggle, { type UnitSystem } from "@/components/UnitToggle";
import StickyResult from "@/components/StickyResult";
import {
  MAX_REED_SETT_EPI,
  MIN_WEAVING_DIMENSION,
  MIN_WEAVING_WPI,
  MAX_WEAVING_ALLOWANCE,
  MAX_WEAVING_DIMENSION,
  MAX_WEAVING_LENGTH_ALLOWANCE_PERCENT,
  MAX_WEAVING_WPI,
  MAX_WARP_EPI,
  MAX_YARDS_PER_UNIT,
  SUPPORTED_REED_DENTS,
  calculateReedSleying,
  calculateWarpEstimate,
  estimateSettFromWpi,
} from "@/lib/weaving-sett-plan.mjs";

// ── DATA ──────────────────────────────────────────────────────────

interface YarnWeight {
  key: string;
  label: string;
  wpi: [number, number]; // wraps per inch range
}

const YARN_WEIGHTS: YarnWeight[] = [
  { key: "lace", label: "Lace / Cobweb", wpi: [18, 30] },
  { key: "fingering", label: "Fingering / Sock", wpi: [14, 18] },
  { key: "sport", label: "Sport", wpi: [12, 14] },
  { key: "dk", label: "DK", wpi: [10, 12] },
  { key: "worsted", label: "Worsted", wpi: [8, 10] },
  { key: "bulky", label: "Bulky", wpi: [5, 8] },
  { key: "superbulky", label: "Super Bulky", wpi: [3, 5] },
];

interface WeaveStructure {
  key: string;
  label: string;
  warpThreads: number;
  interlacements: number;
  desc: string;
}

const STRUCTURES: WeaveStructure[] = [
  { key: "plain", label: "Plain Weave (Tabby)", warpThreads: 2, interlacements: 2, desc: "Two warp threads and two interlacements per repeat." },
  { key: "twill", label: "Twill (2/2)", warpThreads: 4, interlacements: 2, desc: "Four warp threads and two interlacements per repeat." },
];

type Tab = "sett" | "warp" | "reed";

interface CalculationFailure {
  ok: false;
  reason: string;
  error: string;
}

interface SettEstimateSuccess {
  ok: true;
  wpi: number;
  factor: number;
  unroundedEpi: number;
  startingEpi: number;
}

interface WarpEstimateSuccess {
  ok: true;
  totalWarpLengthIn: number;
  totalWarpLengthCm: number;
  lengthAllowancePct: number;
  totalEnds: number;
  warpYards: number;
  warpMeters: number;
  weftYards: number;
  weftMeters: number;
  weftAssumedPpi: number;
  weftAllowancePct: number;
  skeinsNeeded: number;
}

interface ReedSleyingSuccess {
  ok: true;
  sett: number;
  reedDent: number;
  ratio: number;
  sequence: number[];
  periodDents: number;
  periodEnds: number;
  actualEpi: number;
  instruction: string;
}

type SettEstimateOutcome = SettEstimateSuccess | CalculationFailure;
type WarpEstimateOutcome = WarpEstimateSuccess | CalculationFailure;
type ReedSleyingOutcome = ReedSleyingSuccess | CalculationFailure;

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
  const [lengthAllowancePercent, setLengthAllowancePercent] = useState("0");
  const [epiInput, setEpiInput] = useState("");
  const [ydsPerUnit, setYdsPerUnit] = useState("");

  // Reed tab
  const [desiredSett, setDesiredSett] = useState("");
  const [reedDent, setReedDent] = useState("12");

  const dim = units === "metric" ? "cm" : "in";
  const maximumDimension = units === "metric" ? MAX_WEAVING_DIMENSION * 2.54 : MAX_WEAVING_DIMENSION;
  const maximumAllowance = units === "metric" ? MAX_WEAVING_ALLOWANCE * 2.54 : MAX_WEAVING_ALLOWANCE;

  // Sett result
  const settOutcome = useMemo<SettEstimateOutcome>(() => {
    const yw = YARN_WEIGHTS.find((w) => w.key === yarnWeight);
    const st = STRUCTURES.find((s) => s.key === structure);
    if (!yw || !st) {
      return { ok: false, reason: "unsupported-selection", error: "Choose a supported yarn weight and weave structure." };
    }

    const wpi = useCustomWpi ? Number(customWpi) : (yw.wpi[0] + yw.wpi[1]) / 2;
    return estimateSettFromWpi({
      wpi,
      warpThreads: st.warpThreads,
      interlacements: st.interlacements,
    }) as SettEstimateOutcome;
  }, [yarnWeight, structure, customWpi, useCustomWpi]);
  const settResult = settOutcome.ok
    ? {
        ...settOutcome,
        structure: STRUCTURES.find((item) => item.key === structure)?.label ?? structure,
      }
    : null;
  const settError = !settOutcome.ok ? settOutcome.error : "";

  // Warp length result
  const warpOutcome = useMemo<WarpEstimateOutcome>(() => (
    calculateWarpEstimate({
      projectLength: Number(projectLength),
      projectWidth: Number(projectWidth),
      loomWaste: Number(loomWaste),
      sampling: Number(sampling),
      epi: Number(epiInput),
      yardsPerUnit: Number(ydsPerUnit),
      lengthAllowancePercent: Number(lengthAllowancePercent),
      units,
    }) as WarpEstimateOutcome
  ), [projectLength, projectWidth, loomWaste, sampling, lengthAllowancePercent, epiInput, units, ydsPerUnit]);
  const warpResult = warpOutcome.ok ? warpOutcome : null;
  const hasWarpInput = projectLength !== "" || projectWidth !== "";
  const warpError = hasWarpInput && !warpOutcome.ok ? warpOutcome.error : "";

  // Reed result
  const reedOutcome = useMemo<ReedSleyingOutcome>(() => (
    calculateReedSleying({
      sett: Number(desiredSett),
      reedDent: Number(reedDent),
    }) as ReedSleyingOutcome
  ), [desiredSett, reedDent]);
  const reedResult = reedOutcome.ok ? reedOutcome : null;
  const reedError = desiredSett !== "" && !reedOutcome.ok ? reedOutcome.error : "";

  // Sticky summary
  const stickySummary = (() => {
    if (tab === "sett" && settResult) {
      return `${settResult.startingEpi} EPI starting estimate`;
    }
    if (tab === "warp" && warpResult) {
      return `${units === "metric" ? warpResult.totalWarpLengthCm + " cm" : warpResult.totalWarpLengthIn + "″"} warp${warpResult.totalEnds > 0 ? ` • ${warpResult.totalEnds} ends` : ""}`;
    }
    if (tab === "reed" && reedResult) {
      return `${reedResult.ratio.toFixed(2)} ends/dent average`;
    }
    return "";
  })();

  const changeUnits = (nextUnits: UnitSystem) => {
    if (nextUnits === units) return;
    const factor = nextUnits === "metric" ? 2.54 : 1 / 2.54;
    const convert = (value: string) => {
      if (value.trim() === "") return value;
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return value;
      return String(Number((numeric * factor).toFixed(4)));
    };

    setProjectLength(convert);
    setProjectWidth(convert);
    setLoomWaste(convert);
    setSampling(convert);
    setUnits(nextUnits);
  };

  return (
    <div className="space-y-6">
      <UnitToggle value={units} onChange={changeUnits} />

      <div
        className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap"
        role="group"
        aria-label="Weaving calculator view"
      >
        {([
          ["sett", "⚙️ Sett (EPI)"],
          ["warp", "📏 Warp Length"],
          ["reed", "🔧 Reed Sub"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            aria-pressed={tab === key}
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
              <label htmlFor="weaving-yarn-weight" className="label">Yarn Weight</label>
              <select id="weaving-yarn-weight" value={yarnWeight} onChange={(e) => setYarnWeight(e.target.value)} className="select">
                {YARN_WEIGHTS.map((w) => (
                  <option key={w.key} value={w.key}>{w.label} ({w.wpi[0]}&ndash;{w.wpi[1]} WPI)</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="weaving-structure" className="label">Weave Structure</label>
              <select id="weaving-structure" value={structure} onChange={(e) => setStructure(e.target.value)} className="select">
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
            <div className="max-w-[180px]">
              <label htmlFor="weaving-custom-wpi" className="label">Measured WPI</label>
              <input id="weaving-custom-wpi" type="number" value={customWpi} onChange={(e) => setCustomWpi(e.target.value)}
                placeholder="e.g. 12" className="input" min={MIN_WEAVING_WPI} max={MAX_WEAVING_WPI} step="0.1" inputMode="decimal" />
            </div>
          )}

          {settError && useCustomWpi && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{settError}</p>
          )}

          <StickyResult summary={stickySummary} visible={!!settResult}>
            {settResult && (
              <div className="result-card space-y-3">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Starting Sett Estimate
                </h3>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {settResult.startingEpi} EPI
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  {settResult.wpi.toFixed(1)} WPI &times; {Math.round(settResult.factor * 100)}% starting factor for {settResult.structure}
                </p>
                <p className="text-xs text-bark-400 dark:text-bark-500">
                  This is a planning midpoint, not a finished-fabric prediction. Weave and wet-finish a sample; yarn, twist, beat, desired hand, and finishing can change the useful sett.
                </p>
              </div>
            )}
          </StickyResult>

          {/* Reference table */}
          <div>
            <p className="label">Starting WPI Factor by Structure</p>
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
                      <td className="py-2 px-3 text-bark-600 dark:text-cream-300">
                        {Math.round((s.warpThreads / (s.interlacements + s.warpThreads)) * 100)}% of WPI
                      </td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400 text-xs hidden sm:table-cell">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-bark-400 dark:text-bark-500">
              Starting formula: WPI &times; warp threads in one repeat &divide; (interlacements + warp threads).
              Generic lace and waffle structures need the counts from a specific draft, so they are not assigned a universal factor here.
            </p>
          </div>
        </div>
      )}

      {/* ── WARP TAB ───────────────────────────────────────────── */}
      {tab === "warp" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Build a bounded planning worksheet from entered dimensions, allowances, EPI, and optional label yardage.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="weaving-project-width" className="label">Width at reed ({dim})</label>
              <input id="weaving-project-width" type="number" value={projectWidth} onChange={(e) => setProjectWidth(e.target.value)}
                placeholder="20" className="input" min={MIN_WEAVING_DIMENSION} max={maximumDimension} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-project-length" className="label">Planned woven length ({dim})</label>
              <input id="weaving-project-length" type="number" value={projectLength} onChange={(e) => setProjectLength(e.target.value)}
                placeholder="72" className="input" min={MIN_WEAVING_DIMENSION} max={maximumDimension} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-warp-epi" className="label">
                EPI (optional)
                <Tooltip text="Ends per inch. Use the Sett tab to calculate this." />
              </label>
              <input id="weaving-warp-epi" type="number" value={epiInput} onChange={(e) => setEpiInput(e.target.value)}
                placeholder="12" className="input" min="0" max={MAX_WARP_EPI} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-loom-waste" className="label">Loom waste ({dim})</label>
              <input id="weaving-loom-waste" type="number" value={loomWaste} onChange={(e) => setLoomWaste(e.target.value)}
                placeholder="27" className="input" min="0" max={maximumAllowance} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-sampling" className="label">Sampling ({dim})</label>
              <input id="weaving-sampling" type="number" value={sampling} onChange={(e) => setSampling(e.target.value)}
                placeholder="6" className="input" min="0" max={maximumAllowance} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-length-allowance" className="label">
                Warp length allowance (%)
                <Tooltip text="Optional allowance applied only to planned warp length. Enter a project-specific measured value for warp take-up or finishing length change; width change is not modeled." />
              </label>
              <input id="weaving-length-allowance" type="number" value={lengthAllowancePercent}
                onChange={(e) => setLengthAllowancePercent(e.target.value)} className="input" min="0"
                max={MAX_WEAVING_LENGTH_ALLOWANCE_PERCENT} step="any" inputMode="decimal" />
            </div>
            <div>
              <label htmlFor="weaving-yards-per-skein" className="label">
                Yards per skein, same yarn only (optional)
                <Tooltip text="Enter label yardage only when warp and weft use the same yarn and put-up. Different yarns need separate purchase calculations." />
              </label>
              <input id="weaving-yards-per-skein" type="number" value={ydsPerUnit} onChange={(e) => setYdsPerUnit(e.target.value)}
                placeholder="220" className="input" min="0" max={MAX_YARDS_PER_UNIT} step="any" inputMode="decimal" />
            </div>
          </div>

          {warpError && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{warpError}</p>
          )}

          <StickyResult summary={stickySummary} visible={!!warpResult}>
            {warpResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Starting Warp Estimate</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {units === "metric" ? `${warpResult.totalWarpLengthCm} cm` : `${warpResult.totalWarpLengthIn}″`}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">length per end (incl. {warpResult.lengthAllowancePct}% entered allowance)</p>
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
                        <p className="text-sm text-bark-500 dark:text-bark-400">
                          provisional weft ({warpResult.weftAssumedPpi} PPI + {warpResult.weftAllowancePct}% path allowance)
                        </p>
                      </div>
                    </>
                  )}
                  {warpResult.skeinsNeeded > 0 && (
                    <div>
                      <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">{warpResult.skeinsNeeded}</p>
                      <p className="text-sm text-bark-500 dark:text-bark-400">combined skeins, same yarn and put-up only</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-bark-400 dark:text-bark-500">
                  The entered percentage applies to warp length only. Width finishing change is not modeled. The provisional weft value uses planned woven length, assumes PPI equals the entered EPI, and adds a separate 10% path allowance. Sample and replace every allowance with measured project evidence before winding or purchasing.
                </p>
              </div>
            )}
          </StickyResult>
        </div>
      )}

      {/* ── REED TAB ───────────────────────────────────────────── */}
      {tab === "reed" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Generate one exact repeating sleying sequence for the entered whole-number sett and supported reed.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label htmlFor="weaving-desired-sett" className="label">
                Desired sett (EPI)
                <Tooltip text="How many ends per inch you want." />
              </label>
              <input id="weaving-desired-sett" type="number" value={desiredSett} onChange={(e) => setDesiredSett(e.target.value)}
                placeholder="15" className="input" min="1" max={MAX_REED_SETT_EPI} step="1" inputMode="numeric" />
            </div>
            <div>
              <label htmlFor="weaving-reed-dent" className="label">
                Reed dent
                <Tooltip text="Your reed&apos;s dents per inch. Common sizes: 8, 10, 12, 15." />
              </label>
              <select id="weaving-reed-dent" value={reedDent} onChange={(e) => setReedDent(e.target.value)} className="select">
                {SUPPORTED_REED_DENTS.map((d) => (
                  <option key={d} value={d}>{d}-dent</option>
                ))}
              </select>
            </div>
          </div>

          {reedError && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{reedError}</p>
          )}

          <StickyResult summary={stickySummary} visible={!!reedResult}>
            {reedResult && (
              <div className="result-card space-y-3">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Exact Sleying Arithmetic
                </h3>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  {reedResult.sett} EPI in a {reedResult.reedDent}-dent reed ({reedResult.ratio.toFixed(2)} ends per dent average)
                </p>
                <p className="text-bark-700 dark:text-cream-200 font-medium">
                  {reedResult.instruction}
                </p>
                <p className="text-xs text-bark-400 dark:text-bark-500">
                  This sequence averages exactly {reedResult.actualEpi} EPI. It is a starting sleying plan, not confirmation that the chosen yarn fits the dents or that reed marks will wet-finish out; sample first.
                </p>
              </div>
            )}
          </StickyResult>
        </div>
      )}
    </div>
  );
}
