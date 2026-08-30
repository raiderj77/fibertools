"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import {
  MAX_EDGE_STITCHES_PER_SIDE,
  MAX_GAUGE_STITCHES,
  MAX_STITCH_COUNT,
  MAX_STITCH_MULTIPLE,
  MAX_STITCH_PATTERNS,
  MAX_STITCH_PLUS,
  MAX_TARGET_WIDTH,
  MAX_WIDTH_TOLERANCE,
  deriveGaugeStitchRange,
  solveStitchPatternCounts,
} from "@/lib/stitch-pattern-plan.mjs";
import {
  MAX_ROW_PLANNER_SECTIONS,
  MAX_ROW_REPEAT,
  MAX_TARGET_SECTION_ROWS,
  buildRowPatternPlan,
} from "@/lib/row-pattern-plan.mjs";

// ── TYPES ─────────────────────────────────────────────────────────

interface StitchPattern {
  name: string;
  multiple: number;
  plus: number;
  minRows: number;
  craft: "crochet" | "knitting" | "both";
  category: "textured" | "lacy" | "solid" | "cable" | "colorwork" | "ribbing";
  difficulty: 1 | 2 | 3;
  notes: string;
}

interface PatternEntry {
  id: number;
  multiple: number;
  plus: number;
  name: string;
}

interface SolverFailure {
  ok: false;
  reason: string;
  error: string;
}

interface GaugeRangeSuccess {
  ok: true;
  stitchesPerInch: number;
  minCount: number;
  maxCount: number;
  targetWidth: number;
  tolerance: number;
}

interface PatternPlanSuccess {
  ok: true;
  lcm: number;
  counts: number[];
  patterns: PatternEntry[];
  minCount: number;
  maxCount: number;
  edgeStitchesPerSide: number;
  totalEdgeStitches: number;
  totalMatches: number;
  truncated: boolean;
}

interface CalculatorResult extends PatternPlanSuccess {
  validEntries: PatternEntry[];
  gaugePerInch: number;
  effectiveMin: number;
  effectiveMax: number;
}

type GaugeRangeOutcome = GaugeRangeSuccess | SolverFailure;
type PatternPlanOutcome = PatternPlanSuccess | SolverFailure;

interface RowPlanSection {
  id: number;
  stitch: string;
  rowRepeat: number;
  targetRows: number;
  fullRepeats: number;
  actualRows: number;
  addedRows: number;
}

interface RowPlanSuccess {
  ok: true;
  sections: RowPlanSection[];
  totalTargetRows: number;
  totalActualRows: number;
}

type RowPlanOutcome = RowPlanSuccess | SolverFailure;

type Tab = "calculator" | "database" | "planner";

// ── STITCH DATABASE ───────────────────────────────────────────────

const STITCH_DATABASE: StitchPattern[] = [
  // Crochet, Solid
  { name: "Single Crochet (SC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count works." },
  { name: "Half Double Crochet (HDC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count. Add 2 ch for turning." },
  { name: "Double Crochet (DC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count. Add 3 ch for turning." },

  // Crochet, Textured
  { name: "Waffle Stitch", multiple: 3, plus: 0, minRows: 4, craft: "crochet", category: "textured", difficulty: 2, notes: "Front-post and back-post DC. Repeat shows after 4 rows." },
  { name: "Moss / Linen Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "textured", difficulty: 1, notes: "SC + ch1 skip. Also called Granite stitch." },
  { name: "Basket Weave", multiple: 6, plus: 2, minRows: 8, craft: "crochet", category: "textured", difficulty: 2, notes: "Front-post and back-post DC blocks." },
  { name: "Puff Stitch (rows)", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "textured", difficulty: 2, notes: "Alternating puff + chain. Very squishy texture." },
  { name: "Bobble Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "textured", difficulty: 2, notes: "5-dc bobble alternating with SC." },
  { name: "Alpine Stitch", multiple: 2, plus: 1, minRows: 4, craft: "crochet", category: "textured", difficulty: 2, notes: "Front-post DC on every other row creates ridges." },
  { name: "Suzette Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "textured", difficulty: 1, notes: "SC + DC in same stitch, skip 1. Quick and elegant." },
  { name: "Grit Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "textured", difficulty: 1, notes: "SC + DC alternating. Creates nice ridges." },
  { name: "Harlequin Stitch", multiple: 5, plus: 2, minRows: 2, craft: "crochet", category: "textured", difficulty: 2, notes: "Fan-like shells and V-stitches." },
  { name: "Sedge Stitch", multiple: 3, plus: 0, minRows: 1, craft: "crochet", category: "textured", difficulty: 1, notes: "SC + HDC + DC in one stitch, skip 2." },
  { name: "Blanket Stitch", multiple: 2, plus: 1, minRows: 2, craft: "crochet", category: "textured", difficulty: 1, notes: "DC clusters with chain spaces." },
  { name: "Celtic Weave", multiple: 4, plus: 0, minRows: 4, craft: "crochet", category: "textured", difficulty: 3, notes: "Interlocking front-post stitches. Thick and warm." },
  { name: "Crocodile Stitch", multiple: 5, plus: 0, minRows: 4, craft: "crochet", category: "textured", difficulty: 3, notes: "Overlapping scales. Very yarn-hungry." },

  // Crochet, Lacy
  { name: "Shell Stitch", multiple: 6, plus: 1, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "5-DC shells with SC between. Classic blanket stitch." },
  { name: "V-Stitch", multiple: 2, plus: 1, minRows: 1, craft: "crochet", category: "lacy", difficulty: 1, notes: "DC + ch1 + DC in same stitch. Light and airy." },
  { name: "Granny Stripe", multiple: 3, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 1, notes: "3-DC clusters. Perfect for color changes." },
  { name: "Catherine Wheel", multiple: 10, plus: 6, minRows: 4, craft: "crochet", category: "lacy", difficulty: 3, notes: "Pinwheel fans. Stunning in two colors." },
  { name: "Fan Stitch", multiple: 8, plus: 1, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Large fans with chain arches." },
  { name: "Arcade Stitch", multiple: 6, plus: 1, minRows: 4, craft: "crochet", category: "lacy", difficulty: 2, notes: "Arching shells. Great drape." },
  { name: "Offset Shell", multiple: 3, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Staggered 3-DC clusters." },
  { name: "Iris Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Puff stitch + chain. Creates flower-like texture." },

  // Crochet, Colorwork
  { name: "Spike Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "colorwork", difficulty: 2, notes: "Insert hook into row(s) below. Great for stripes." },
  { name: "Plaid / Tartan", multiple: 4, plus: 0, minRows: 4, craft: "crochet", category: "colorwork", difficulty: 3, notes: "Interlocking SC blocks with surface chains." },
  { name: "C2C (Corner to Corner)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "colorwork", difficulty: 2, notes: "Diagonal squares. Multiple is per block, not per stitch." },

  // Knitting, Ribbing
  { name: "1×1 Rib", multiple: 2, plus: 0, minRows: 1, craft: "knitting", category: "ribbing", difficulty: 1, notes: "K1, P1 repeat. Stretchy." },
  { name: "2×2 Rib", multiple: 4, plus: 0, minRows: 1, craft: "knitting", category: "ribbing", difficulty: 1, notes: "K2, P2 repeat." },
  { name: "Broken Rib", multiple: 2, plus: 0, minRows: 2, craft: "knitting", category: "ribbing", difficulty: 1, notes: "Rib on RS, knit on WS. Lies flat." },
  { name: "Fisherman's Rib", multiple: 2, plus: 1, minRows: 2, craft: "knitting", category: "ribbing", difficulty: 2, notes: "Knit-below creates thick, squishy fabric." },

  // Knitting, Textured
  { name: "Seed / Moss Stitch", multiple: 2, plus: 0, minRows: 2, craft: "knitting", category: "textured", difficulty: 1, notes: "K1, P1 offset every row. Lies flat." },
  { name: "Double Seed Stitch", multiple: 4, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 1, notes: "2 rows of 2×2 blocks. Chunkier seed stitch." },
  { name: "Basketweave", multiple: 8, plus: 5, minRows: 8, craft: "knitting", category: "textured", difficulty: 2, notes: "Blocks of stockinette and reverse stockinette." },
  { name: "Garter Rib", multiple: 4, plus: 2, minRows: 2, craft: "knitting", category: "textured", difficulty: 1, notes: "Knit columns with garter between." },
  { name: "Honeycomb", multiple: 8, plus: 0, minRows: 8, craft: "knitting", category: "textured", difficulty: 3, notes: "Cable-based honeycomb pattern." },
  { name: "Waffle Stitch (knit)", multiple: 3, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 2, notes: "K + sl wyif pattern. Creates waffle grid." },
  { name: "Hurdle Stitch", multiple: 2, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 1, notes: "2 rows garter, 2 rows stockinette." },

  // Knitting, Lacy
  { name: "Feather and Fan", multiple: 18, plus: 0, minRows: 4, craft: "knitting", category: "lacy", difficulty: 2, notes: "Classic Old Shale. Wavy edges." },
  { name: "Simple Lace Chevron", multiple: 12, plus: 1, minRows: 2, craft: "knitting", category: "lacy", difficulty: 2, notes: "YO + K2tog creates zigzag lace." },
  { name: "Eyelet Rows", multiple: 2, plus: 0, minRows: 4, craft: "knitting", category: "lacy", difficulty: 1, notes: "YO, K2tog across one row. Subtle lace." },

  // Knitting, Cable
  { name: "Simple 4-st Cable", multiple: 6, plus: 2, minRows: 6, craft: "knitting", category: "cable", difficulty: 2, notes: "C4F or C4B with purl background." },
  { name: "Cable & Rib Panel", multiple: 10, plus: 0, minRows: 8, craft: "knitting", category: "cable", difficulty: 2, notes: "Cable columns separated by ribbing." },
  { name: "Braided Cable", multiple: 12, plus: 2, minRows: 8, craft: "knitting", category: "cable", difficulty: 3, notes: "Three-strand braid effect." },

  // Both crafts
  { name: "Stockinette / SC rows", multiple: 1, plus: 0, minRows: 1, craft: "both", category: "solid", difficulty: 1, notes: "Basic flat fabric. Any count works." },
];

// ── CATEGORY META ─────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  textured: { label: "Textured", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  lacy: { label: "Lacy", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
  solid: { label: "Solid", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  cable: { label: "Cable", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  colorwork: { label: "Colorwork", color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300" },
  ribbing: { label: "Ribbing", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300" },
};

const CRAFT_META: Record<string, { label: string; icon: string }> = {
  crochet: { label: "Crochet", icon: "🧶" },
  knitting: { label: "Knitting", icon: "🪡" },
  both: { label: "Both", icon: "✨" },
};

const DIFFICULTY_LABELS = ["", "Beginner", "Intermediate", "Advanced"];

// ── COMPONENT ─────────────────────────────────────────────────────

export default function StitchPatternCalculatorTool() {
  const [tab, setTab] = useState<Tab>("calculator");

  // Calculator tab
  const [entries, setEntries] = useState<PatternEntry[]>([
    { id: 1, multiple: 3, plus: 0, name: "Waffle Stitch" },
    { id: 2, multiple: 2, plus: 0, name: "Puff Stitch" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [minWidth, setMinWidth] = useState("120");
  const [maxWidth, setMaxWidth] = useState("180");
  const [edgeStitches, setEdgeStitches] = useState("0");

  // Gauge integration
  const [useGauge, setUseGauge] = useState(false);
  const [gaugeStitches, setGaugeStitches] = useState("18");
  const [gaugeOver, setGaugeOver] = useState<"4" | "1">("4");
  const [targetWidthIn, setTargetWidthIn] = useState("50");
  const [widthTolerance, setWidthTolerance] = useState("2");

  // Database tab
  const [craftFilter, setCraftFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [maxMultiple, setMaxMultiple] = useState("");
  const [maxRows, setMaxRows] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Planner tab
  const [plannerSections, setPlannerSections] = useState<
    { id: number; stitch: string; rowRepeat: string; targetRows: string }[]
  >([
    { id: 1, stitch: "Waffle Stitch", rowRepeat: "4", targetRows: "20" },
    { id: 2, stitch: "Moss Stitch", rowRepeat: "2", targetRows: "16" },
    { id: 3, stitch: "Shell Stitch", rowRepeat: "2", targetRows: "12" },
  ]);
  const [plannerNextId, setPlannerNextId] = useState(4);

  // ── Gauge-derived range ──────────────────────────────────────
  const gaugeRange = useMemo<GaugeRangeOutcome | null>(() => {
    if (!useGauge) return null;
    return deriveGaugeStitchRange({
      gaugeStitches: Number(gaugeStitches),
      gaugeSpan: Number(gaugeOver),
      targetWidth: Number(targetWidthIn),
      tolerance: Number(widthTolerance),
    }) as GaugeRangeOutcome;
  }, [gaugeOver, gaugeStitches, targetWidthIn, useGauge, widthTolerance]);

  const effectiveMin = useGauge
    ? (gaugeRange?.ok ? gaugeRange.minCount : 0)
    : Number(minWidth);
  const effectiveMax = useGauge
    ? (gaugeRange?.ok ? gaugeRange.maxCount : 0)
    : Number(maxWidth);

  // ── Calculator results ────────────────────────────────────────

  const calcOutcome = useMemo<PatternPlanOutcome>(() => {
    if (useGauge && gaugeRange && !gaugeRange.ok) return gaugeRange;
    if (useGauge && !gaugeRange) {
      return { ok: false, reason: "invalid-gauge", error: "Enter a valid gauge range." };
    }
    return solveStitchPatternCounts({
      patterns: entries,
      minCount: effectiveMin,
      maxCount: effectiveMax,
      edgeStitchesPerSide: Number(edgeStitches),
    }) as PatternPlanOutcome;
  }, [edgeStitches, effectiveMax, effectiveMin, entries, gaugeRange, useGauge]);

  const calcResults: CalculatorResult | null = calcOutcome.ok
    ? {
        ...calcOutcome,
        validEntries: calcOutcome.patterns,
        gaugePerInch: useGauge && gaugeRange?.ok ? gaugeRange.stitchesPerInch : 0,
        effectiveMin: calcOutcome.minCount,
        effectiveMax: calcOutcome.maxCount,
      }
    : null;
  const calcError = !calcOutcome.ok ? calcOutcome.error : "";

  // ── Database filtering ────────────────────────────────────────

  const filteredStitches = useMemo(() => {
    return STITCH_DATABASE.filter((s) => {
      if (craftFilter !== "all" && s.craft !== craftFilter && s.craft !== "both") return false;
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (maxMultiple && s.multiple > parseInt(maxMultiple)) return false;
      if (maxRows && s.minRows > parseInt(maxRows)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q);
      }
      return true;
    });
  }, [craftFilter, categoryFilter, maxMultiple, maxRows, searchQuery]);

  // ── Planner calculations ──────────────────────────────────────

  const plannerOutcome = useMemo<RowPlanOutcome>(() => (
    buildRowPatternPlan(plannerSections) as RowPlanOutcome
  ), [plannerSections]);
  const plannerPlan = plannerOutcome.ok ? plannerOutcome : null;
  const plannerResults = plannerPlan?.sections ?? [];
  const totalPlannerRows = plannerPlan?.totalActualRows ?? 0;
  const plannerError = !plannerOutcome.ok ? plannerOutcome.error : "";

  // ── Handlers ──────────────────────────────────────────────────

  const addEntry = () => {
    if (entries.length >= MAX_STITCH_PATTERNS) return;
    setEntries([...entries, { id: nextId, multiple: 2, plus: 0, name: "" }]);
    setNextId(nextId + 1);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: number, field: keyof PatternEntry, value: string | number) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const addFromDatabase = (stitch: StitchPattern) => {
    if (entries.length >= MAX_STITCH_PATTERNS) return;
    setEntries([
      ...entries,
      { id: nextId, multiple: stitch.multiple, plus: stitch.plus, name: stitch.name },
    ]);
    setNextId(nextId + 1);
    setTab("calculator");
  };

  const addPlannerSection = () => {
    if (plannerSections.length >= MAX_ROW_PLANNER_SECTIONS) return;
    setPlannerSections([
      ...plannerSections,
      { id: plannerNextId, stitch: "", rowRepeat: "2", targetRows: "12" },
    ]);
    setPlannerNextId(plannerNextId + 1);
  };

  const removePlannerSection = (id: number) => {
    if (plannerSections.length <= 1) return;
    setPlannerSections(plannerSections.filter((s) => s.id !== id));
  };

  const updatePlannerSection = (
    id: number,
    field: "stitch" | "rowRepeat" | "targetRows",
    value: string
  ) => {
    setPlannerSections(plannerSections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const copyResults = () => {
    if (!calcResults) return;
    const lines = [
      `Stitch Pattern Calculator Results`,
      `─────────────────────────────────`,
      `Patterns:`,
      ...calcResults.validEntries.map(
        (e) => `  • ${e.name || "Pattern"}: multiple of ${e.multiple}${e.plus ? ` + ${e.plus}` : ""}`
      ),
      ``,
      `LCM of multiples: ${calcResults.lcm}`,
      `Edge stitches: ${calcResults.edgeStitchesPerSide} per side (${calcResults.totalEdgeStitches} total)`,
      `Arithmetic reference only: confirm the pattern, construction, gauge, fit, and yarn separately.`,
    ];
    if (calcResults.gaugePerInch > 0) {
      lines.push(`Gauge: ${gaugeStitches} sts / ${gaugeOver === "4" ? "4 in" : "1 in"} (${calcResults.gaugePerInch.toFixed(2)} per inch)`);
      lines.push(`Target width: ${targetWidthIn}" ± ${widthTolerance}"`);
    }
    lines.push(
      ``,
      `Compatible stitch counts (${calcResults.effectiveMin}–${calcResults.effectiveMax} range):`,
      ...(calcResults.counts.length > 0
        ? calcResults.counts.map((c) => {
            const widthStr = calcResults.gaugePerInch > 0 ? ` → ${(c / calcResults.gaugePerInch).toFixed(1)}"` : "";
            return `  ${c} stitches${widthStr}`;
          })
        : ["  No compatible counts in this range."]),
    );
    if (calcResults.truncated) {
      lines.push(`Showing the first ${calcResults.counts.length.toLocaleString()} of ${calcResults.totalMatches.toLocaleString()} arithmetic matches.`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
  };

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-cream-200/60 dark:bg-bark-700/60 rounded-lg" role="group" aria-label="Stitch pattern tool view">
        {(
          [
            { key: "calculator", label: "🧮 Multiple Calculator" },
            { key: "database", label: "📖 Stitch Library" },
            { key: "planner", label: "📐 Row Planner" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              tab === key
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══ CALCULATOR TAB ══════════════════════════════════════════ */}
      {tab === "calculator" && (
        <div className="space-y-6">
          {/* Pattern entries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="label">
                Stitch Patterns
                <Tooltip text="Enter the stitch multiple for each pattern you want to combine. Add the '+' value if the pattern is 'multiple of X plus Y'." />
              </label>
              <button
                type="button"
                onClick={addEntry}
                className="btn-secondary text-sm"
                disabled={entries.length >= MAX_STITCH_PATTERNS}
              >
                + Add Pattern
              </button>
            </div>

            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-cream-100/50 p-3 dark:bg-bark-700/50 sm:flex"
              >
                <span className="text-xs font-bold text-bark-400 dark:text-bark-500 w-5 text-center">
                  {i + 1}
                </span>
                <input
                  id={`pattern-name-${entry.id}`}
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
                  placeholder="Pattern name (optional)"
                  className="input flex-1 min-w-0"
                  aria-label={`Pattern ${i + 1} name`}
                />
                <div className="col-span-2 flex flex-wrap items-center gap-1 sm:col-auto sm:flex-nowrap">
                  <label htmlFor={`pattern-multiple-${entry.id}`} className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                    Multiple of
                  </label>
                  <input
                    id={`pattern-multiple-${entry.id}`}
                    type="number"
                    min={1}
                    max={MAX_STITCH_MULTIPLE}
                    step={1}
                    value={entry.multiple || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, "multiple", Number(e.target.value))
                    }
                    className="input w-16 text-center"
                  />
                  <span className="text-xs text-bark-400 dark:text-bark-500">+</span>
                  <input
                    id={`pattern-plus-${entry.id}`}
                    type="number"
                    min={0}
                    max={MAX_STITCH_PLUS}
                    step={1}
                    value={entry.plus || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, "plus", Number(e.target.value))
                    }
                    className="input w-14 text-center"
                    placeholder="0"
                    aria-label={`Pattern ${i + 1} additional stitches`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="text-bark-400 hover:text-rose-500 transition-colors p-1"
                  disabled={entries.length <= 1}
                  aria-label={`Remove pattern ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
            <p className="text-xs text-bark-400 dark:text-bark-500">
              Use no more than {MAX_STITCH_PATTERNS} patterns; multiples are limited to {MAX_STITCH_MULTIPLE.toLocaleString()}.
              {" "}
              💡 Not sure about your stitch multiples? Check the{" "}
              <button type="button" onClick={() => setTab("database")} className="underline text-sage-600 dark:text-sage-400">
                Stitch Library
              </button>{" "}
              and add patterns directly.
            </p>
          </div>

          {/* Gauge toggle */}
          <div className="rounded-xl border border-cream-200 dark:border-bark-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setUseGauge(!useGauge)}
              aria-expanded={useGauge}
              aria-controls="stitch-pattern-gauge-controls"
              className="w-full flex items-center justify-between p-4 hover:bg-cream-50 dark:hover:bg-bark-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📐</span>
                <span className="font-medium text-bark-700 dark:text-cream-200 text-sm">
                  Use my gauge to set width
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 rounded-full font-medium">
                  NEW
                </span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative ${useGauge ? "bg-sage-500" : "bg-cream-300 dark:bg-bark-600"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useGauge ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>

            {useGauge && (
              <div id="stitch-pattern-gauge-controls" className="border-t border-cream-200 dark:border-bark-700 p-4 bg-cream-50/50 dark:bg-bark-800/50 space-y-4">
                <p className="text-xs text-bark-400 dark:text-bark-500">
                  Enter your gauge swatch measurement. We&apos;ll calculate the stitch count range from your desired blanket width.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label htmlFor="pattern-gauge-stitches" className="label text-xs">
                      Gauge Stitches
                      <Tooltip text="How many stitches in your swatch measurement? Count the stitches across your gauge swatch." />
                    </label>
                    <input
                      id="pattern-gauge-stitches"
                      type="number"
                      min={1}
                      max={MAX_GAUGE_STITCHES}
                      step="0.5"
                      value={gaugeStitches}
                      onChange={(e) => setGaugeStitches(e.target.value)}
                      className="input"
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <label htmlFor="pattern-gauge-over" className="label text-xs">Measured Over</label>
                    <select
                      id="pattern-gauge-over"
                      value={gaugeOver}
                      onChange={(e) => setGaugeOver(e.target.value as "4" | "1")}
                      className="input"
                    >
                      <option value="4">4 inches</option>
                      <option value="1">1 inch</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pattern-target-width" className="label text-xs">
                      Target Width
                      <Tooltip text="Desired blanket width in inches." />
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="pattern-target-width"
                        type="number"
                        min={1}
                        max={MAX_TARGET_WIDTH}
                        value={targetWidthIn}
                        onChange={(e) => setTargetWidthIn(e.target.value)}
                        className="input flex-1"
                        placeholder="50"
                      />
                      <span className="text-xs text-bark-400 dark:text-bark-500">in</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pattern-width-tolerance" className="label text-xs">
                      Tolerance
                      <Tooltip text="How many inches wider or narrower is acceptable? A ±2 inch tolerance gives more compatible stitch counts." />
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-bark-400 dark:text-bark-500">±</span>
                      <input
                        id="pattern-width-tolerance"
                        type="number"
                        min={0}
                        max={MAX_WIDTH_TOLERANCE}
                        step="0.5"
                        value={widthTolerance}
                        onChange={(e) => setWidthTolerance(e.target.value)}
                        className="input flex-1"
                        placeholder="2"
                      />
                      <span className="text-xs text-bark-400 dark:text-bark-500">in</span>
                    </div>
                  </div>
                </div>
                {gaugeRange?.ok && (
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="bg-cream-200 dark:bg-bark-600 px-2 py-1 rounded text-bark-600 dark:text-cream-300">
                      {gaugeRange.stitchesPerInch.toFixed(2)} sts/inch
                    </span>
                    <span className="bg-cream-200 dark:bg-bark-600 px-2 py-1 rounded text-bark-600 dark:text-cream-300">
                      Range: {effectiveMin}–{effectiveMax} stitches
                    </span>
                    <span className="bg-cream-200 dark:bg-bark-600 px-2 py-1 rounded text-bark-600 dark:text-cream-300">
                      ({(gaugeRange.targetWidth - gaugeRange.tolerance).toFixed(1)}&quot;–{(gaugeRange.targetWidth + gaugeRange.tolerance).toFixed(1)}&quot;)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Width range (manual, hidden when using gauge) */}
          {!useGauge && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pattern-min-stitches" className="label">
                Min Stitch Count
                <Tooltip text="Lower bound of your desired stitch count range." />
              </label>
              <input
                id="pattern-min-stitches"
                type="number"
                min={1}
                max={MAX_STITCH_COUNT}
                step={1}
                value={minWidth}
                onChange={(e) => setMinWidth(e.target.value)}
                className="input"
                placeholder="120"
              />
            </div>
            <div>
              <label htmlFor="pattern-max-stitches" className="label">
                Max Stitch Count
                <Tooltip text="Upper bound of your desired stitch count range." />
              </label>
              <input
                id="pattern-max-stitches"
                type="number"
                min={1}
                max={MAX_STITCH_COUNT}
                step={1}
                value={maxWidth}
                onChange={(e) => setMaxWidth(e.target.value)}
                className="input"
                placeholder="180"
              />
            </div>
            <div>
              <label htmlFor="pattern-edge-stitches" className="label">
                Edge Stitches per Side
                <Tooltip text="Extra stitches added independently to each side for borders or selvedges. The returned total includes twice this number." />
              </label>
              <input
                id="pattern-edge-stitches"
                type="number"
                min={0}
                max={MAX_EDGE_STITCHES_PER_SIDE}
                step={1}
                value={edgeStitches}
                onChange={(e) => setEdgeStitches(e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          </div>
          )}

          {/* Edge stitches (show separately when gauge is on) */}
          {useGauge && (
            <div className="w-full sm:w-48">
              <label htmlFor="pattern-edge-stitches" className="label">
                Edge Stitches per Side
                <Tooltip text="Extra stitches added independently to each side for borders or selvedges. The returned total includes twice this number." />
              </label>
              <input
                id="pattern-edge-stitches"
                type="number"
                min={0}
                max={MAX_EDGE_STITCHES_PER_SIDE}
                step={1}
                value={edgeStitches}
                onChange={(e) => setEdgeStitches(e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          )}

          {calcError && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">
              {calcError}
            </p>
          )}

          {/* Results */}
          {calcResults && (
            <div className="rounded-xl border-2 border-sage-200 dark:border-sage-800 bg-sage-50/50 dark:bg-sage-900/20 p-5 space-y-4" aria-live="polite">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-bark-800 dark:text-cream-100 text-lg">
                  Arithmetic Results
                </h3>
                <button type="button" onClick={copyResults} className="btn-secondary text-sm">
                  📋 Copy
                </button>
              </div>
              <p className="text-xs text-bark-500 dark:text-bark-400">
                These results only check the entered stitch-count arithmetic. They do not validate a pattern,
                construction, gauge, fit, or yarn requirement.
              </p>

              {/* LCM display */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white dark:bg-bark-700 rounded-lg px-4 py-3 shadow-sm">
                  <div className="text-xs text-bark-400 dark:text-bark-500 uppercase tracking-wider">
                    LCM of Multiples
                  </div>
                  <div className="text-2xl font-bold font-mono text-sage-700 dark:text-sage-300">
                    {calcResults.lcm}
                  </div>
                  <div className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                    Spacing between simultaneous solutions, when offsets are compatible
                  </div>
                </div>
                {calcResults.gaugePerInch > 0 && (
                  <div className="bg-white dark:bg-bark-700 rounded-lg px-4 py-3 shadow-sm">
                    <div className="text-xs text-bark-400 dark:text-bark-500 uppercase tracking-wider">
                      Your Gauge
                    </div>
                    <div className="text-2xl font-bold font-mono text-sage-700 dark:text-sage-300">
                      {calcResults.gaugePerInch.toFixed(2)}
                    </div>
                    <div className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                      stitches per inch
                    </div>
                  </div>
                )}
                <div className="bg-white dark:bg-bark-700 rounded-lg px-4 py-3 shadow-sm">
                  <div className="text-xs text-bark-400 dark:text-bark-500 uppercase tracking-wider">
                    Compatible Counts
                  </div>
                  <div className="text-2xl font-bold font-mono text-sage-700 dark:text-sage-300">
                    {calcResults.totalMatches}
                  </div>
                  <div className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                    in {calcResults.effectiveMin}–{calcResults.effectiveMax} range
                    {calcResults.gaugePerInch > 0 && (
                      <span> ({(calcResults.effectiveMin / calcResults.gaugePerInch).toFixed(1)}&quot;–{(calcResults.effectiveMax / calcResults.gaugePerInch).toFixed(1)}&quot;)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compatible stitch counts */}
              {calcResults.counts.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-bark-600 dark:text-cream-300 mb-2">
                    Arithmetic matches in the selected range:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {calcResults.counts.map((count) => (
                      <button
                        key={count}
                        type="button"
                        aria-label={`Copy ${count} stitch arithmetic match`}
                        onClick={() => navigator.clipboard.writeText(String(count))}
                        className="px-3 py-1.5 bg-white dark:bg-bark-600 border border-cream-300 dark:border-bark-500 rounded-lg hover:border-sage-400 dark:hover:border-sage-500 transition-colors cursor-pointer text-left"
                        title="Click to copy"
                      >
                        <span className="font-mono font-bold text-bark-700 dark:text-cream-200 text-sm">
                          {count}
                        </span>
                        {calcResults.gaugePerInch > 0 && (
                          <span className="block text-[10px] text-bark-400 dark:text-bark-500 font-mono">
                            nominal {(count / calcResults.gaugePerInch).toFixed(1)}&quot; at entered gauge
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {calcResults.truncated && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                      Showing the first {calcResults.counts.length.toLocaleString()} of {calcResults.totalMatches.toLocaleString()} arithmetic matches.
                    </p>
                  )}
                  {calcResults.totalEdgeStitches > 0 && (
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-2">
                      Includes {calcResults.edgeStitchesPerSide} edge stitch{calcResults.edgeStitchesPerSide !== 1 ? "es" : ""} per side
                      {" "}({calcResults.totalEdgeStitches} total). Pattern stitches:{" "}
                      {calcResults.counts.map((c) => c - calcResults.totalEdgeStitches).join(", ")}.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-bark-400 dark:text-bark-500">
                  <p className="text-lg mb-1">No compatible counts found</p>
                  <p className="text-sm">
                    The repeat offsets are compatible, but no whole total falls in this range after adding both edge allowances.
                  </p>
                </div>
              )}

              {/* Per-pattern breakdown */}
              {calcResults.counts.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-bark-600 dark:text-cream-300 mb-2">
                    Breakdown per pattern (using {calcResults.counts[0]} stitches):
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                          <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                            Pattern
                          </th>
                          <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                            Multiple
                          </th>
                          <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                            Full Repeats
                          </th>
                          <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                            Remainder
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                        {calcResults.validEntries.map((entry) => {
                          const patternSt = calcResults.counts[0] - calcResults.totalEdgeStitches;
                          const baseSt = patternSt - entry.plus;
                          const repeats = Math.floor(baseSt / entry.multiple);
                          const remainder = baseSt % entry.multiple;
                          return (
                            <tr key={entry.id}>
                              <td className="py-2 px-3 font-medium text-bark-700 dark:text-cream-200">
                                {entry.name || `Pattern ${entry.id}`}
                              </td>
                              <td className="py-2 px-3 text-center font-mono">
                                {entry.multiple}
                                {entry.plus > 0 && (
                                  <span className="text-bark-400">+{entry.plus}</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center font-mono font-bold text-sage-700 dark:text-sage-300">
                                {repeats}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {remainder === 0 ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    Arithmetic match
                                  </span>
                                ) : (
                                  <span className="text-amber-600 dark:text-amber-400 font-mono">
                                    {remainder} left
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ DATABASE TAB ════════════════════════════════════════════ */}
      {tab === "database" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label htmlFor="stitch-library-search" className="label text-xs">Search</label>
              <input
                id="stitch-library-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Stitch name…"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="stitch-library-craft" className="label text-xs">Craft</label>
              <select
                id="stitch-library-craft"
                value={craftFilter}
                onChange={(e) => setCraftFilter(e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                <option value="crochet">Crochet</option>
                <option value="knitting">Knitting</option>
              </select>
            </div>
            <div>
              <label htmlFor="stitch-library-category" className="label text-xs">Category</label>
              <select
                id="stitch-library-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                {Object.entries(CATEGORY_META).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stitch-library-max-multiple" className="label text-xs">Max Multiple</label>
              <input
                id="stitch-library-max-multiple"
                type="number"
                min={1}
                value={maxMultiple}
                onChange={(e) => setMaxMultiple(e.target.value)}
                placeholder="Any"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="stitch-library-max-rows" className="label text-xs">Max Row Repeat</label>
              <input
                id="stitch-library-max-rows"
                type="number"
                min={1}
                value={maxRows}
                onChange={(e) => setMaxRows(e.target.value)}
                placeholder="Any"
                className="input"
              />
            </div>
          </div>

          <p className="text-xs text-bark-400 dark:text-bark-500">
            Showing {filteredStitches.length} of {STITCH_DATABASE.length} named example variants. Multiples and row repeats can vary by source;
            verify the exact instructions you plan to use. Choose <strong>+ Add</strong> to send an example to the calculator.
          </p>

          {/* Stitch cards */}
          <div className="space-y-2">
            {filteredStitches.map((stitch, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-cream-100/50 dark:bg-bark-700/50 rounded-lg hover:bg-cream-200/50 dark:hover:bg-bark-600/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-bark-700 dark:text-cream-200 text-sm">
                      {stitch.name}
                    </h4>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                        CATEGORY_META[stitch.category]?.color
                      }`}
                    >
                      {CATEGORY_META[stitch.category]?.label}
                    </span>
                    <span className="text-[10px] text-bark-400 dark:text-bark-500">
                      {CRAFT_META[stitch.craft]?.icon} {CRAFT_META[stitch.craft]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-mono bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded">
                      ×{stitch.multiple}
                      {stitch.plus > 0 && <span className="text-bark-400">+{stitch.plus}</span>}
                    </span>
                    <span className="text-xs text-bark-400 dark:text-bark-500">
                      {stitch.minRows} row{stitch.minRows !== 1 ? "s" : ""} per repeat
                    </span>
                    <span className="text-xs text-bark-400 dark:text-bark-500">
                      {DIFFICULTY_LABELS[stitch.difficulty]}
                    </span>
                  </div>
                  <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">{stitch.notes}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addFromDatabase(stitch)}
                  disabled={entries.length >= MAX_STITCH_PATTERNS}
                  className="btn-secondary text-xs whitespace-nowrap flex-shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

          {filteredStitches.length === 0 && (
            <div className="text-center py-8 text-bark-400 dark:text-bark-500">
              <p className="text-lg mb-1">No stitches match your filters</p>
              <p className="text-sm">Try broadening your search or clearing filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ PLANNER TAB ═════════════════════════════════════════════ */}
      {tab === "planner" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label">
                Blanket Sections
                <Tooltip text="Plan each section of a sampler blanket. Enter the stitch name, its row repeat, and roughly how many rows you want. The planner rounds each section to complete full repeats." />
              </label>
              <button type="button" onClick={addPlannerSection} disabled={plannerSections.length >= MAX_ROW_PLANNER_SECTIONS} className="btn-secondary text-sm">
                + Add Section
              </button>
            </div>

            <div className="space-y-2">
              {plannerSections.map((section, i) => (
                <div
                  key={section.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-cream-100/50 p-3 dark:bg-bark-700/50 sm:flex"
                >
                  <span className="text-xs font-bold text-bark-400 dark:text-bark-500 w-5 text-center">
                    {i + 1}
                  </span>
                  <input
                    id={`planner-section-name-${section.id}`}
                    type="text"
                    value={section.stitch}
                    onChange={(e) =>
                      updatePlannerSection(section.id, "stitch", e.target.value)
                    }
                    placeholder="Stitch name"
                    className="input flex-1 min-w-0"
                    maxLength={80}
                    aria-label={`Section ${i + 1} name`}
                  />
                  <div className="col-span-2 flex flex-wrap items-center gap-1 sm:col-auto sm:flex-nowrap">
                    <label htmlFor={`planner-row-repeat-${section.id}`} className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                      Row repeat
                    </label>
                    <input
                      id={`planner-row-repeat-${section.id}`}
                      type="number"
                      min={1}
                      max={MAX_ROW_REPEAT}
                      step="1"
                      value={section.rowRepeat}
                      onChange={(e) => updatePlannerSection(section.id, "rowRepeat", e.target.value)}
                      className="input w-14 text-center"
                    />
                  </div>
                  <div className="col-span-2 flex flex-wrap items-center gap-1 sm:col-auto sm:flex-nowrap">
                    <label htmlFor={`planner-target-rows-${section.id}`} className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                      Target rows
                    </label>
                    <input
                      id={`planner-target-rows-${section.id}`}
                      type="number"
                      min={1}
                      max={MAX_TARGET_SECTION_ROWS}
                      step="1"
                      value={section.targetRows}
                      onChange={(e) => updatePlannerSection(section.id, "targetRows", e.target.value)}
                      className="input w-16 text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlannerSection(section.id)}
                    className="text-bark-400 hover:text-rose-500 transition-colors p-1"
                    disabled={plannerSections.length <= 1}
                    aria-label={`Remove section ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {plannerError && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{plannerError}</p>
          )}

          {/* Planner results */}
          {plannerPlan && (
          <div className="rounded-xl border-2 border-sage-200 dark:border-sage-800 bg-sage-50/50 dark:bg-sage-900/20 p-5 space-y-4" aria-live="polite">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-bark-800 dark:text-cream-100 text-lg">
                Row Plan
              </h3>
              <button
                type="button"
                onClick={() => {
                  const lines = [
                    "Sampler Blanket Row Plan",
                    "═══════════════════════",
                    ...plannerResults.map(
                      (r, i) =>
                        `${i + 1}. ${r.stitch || "Section"}: ${r.actualRows} rows (${r.fullRepeats} full repeats of ${r.rowRepeat})`
                    ),
                    "",
                    `Total: ${totalPlannerRows} rows`,
                  ];
                  navigator.clipboard.writeText(lines.join("\n"));
                }}
                className="btn-secondary text-sm"
              >
                📋 Copy Plan
              </button>
            </div>

            {/* Visual row diagram */}
            <div className="space-y-1">
              {plannerResults.map((r, i) => {
                const pct = totalPlannerRows > 0 ? (r.actualRows / totalPlannerRows) * 100 : 0;
                const colors = [
                  "bg-sage-400 dark:bg-sage-600",
                  "bg-amber-400 dark:bg-amber-600",
                  "bg-pink-400 dark:bg-pink-600",
                  "bg-sky-400 dark:bg-sky-600",
                  "bg-violet-400 dark:bg-violet-600",
                  "bg-emerald-400 dark:bg-emerald-600",
                  "bg-rose-400 dark:bg-rose-600",
                  "bg-indigo-400 dark:bg-indigo-600",
                ];
                return (
                  <div key={r.id} className="flex items-center gap-2">
                    <span className="text-xs text-bark-500 dark:text-bark-400 w-24 truncate text-right">
                      {r.stitch || `Section ${i + 1}`}
                    </span>
                    <div className="flex-1 h-6 bg-cream-200 dark:bg-bark-700 rounded overflow-hidden">
                      <div
                        className={`h-full ${colors[i % colors.length]} rounded transition-all duration-500 flex items-center justify-center`}
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {r.actualRows}r
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-bark-500 dark:text-bark-400 w-20">
                      {r.fullRepeats} × {r.rowRepeat}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Section
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Target
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Actual
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Full Repeats
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Adjusted?
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {plannerResults.map((r, i) => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-medium text-bark-700 dark:text-cream-200">
                        {r.stitch || `Section ${i + 1}`}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">{r.targetRows}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-sage-700 dark:text-sage-300">
                        {r.actualRows}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        {r.fullRepeats} × {r.rowRepeat}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {r.actualRows === r.targetRows ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Exact ✓</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">
                            {r.actualRows > r.targetRows ? "+" : ""}
                            {r.actualRows - r.targetRows} rows
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-cream-300 dark:border-bark-600">
                    <td className="py-2 px-3 font-bold text-bark-800 dark:text-cream-100">
                      Total
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-bark-400">
                      {plannerPlan.totalTargetRows}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-sage-700 dark:text-sage-300 text-lg">
                      {totalPlannerRows}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
