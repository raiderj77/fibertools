"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

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

type Tab = "calculator" | "database" | "planner";

// ── STITCH DATABASE ───────────────────────────────────────────────

const STITCH_DATABASE: StitchPattern[] = [
  // Crochet — Solid
  { name: "Single Crochet (SC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count works." },
  { name: "Half Double Crochet (HDC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count. Add 2 ch for turning." },
  { name: "Double Crochet (DC)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "solid", difficulty: 1, notes: "Any stitch count. Add 3 ch for turning." },

  // Crochet — Textured
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

  // Crochet — Lacy
  { name: "Shell Stitch", multiple: 6, plus: 1, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "5-DC shells with SC between. Classic blanket stitch." },
  { name: "V-Stitch", multiple: 2, plus: 1, minRows: 1, craft: "crochet", category: "lacy", difficulty: 1, notes: "DC + ch1 + DC in same stitch. Light and airy." },
  { name: "Granny Stripe", multiple: 3, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 1, notes: "3-DC clusters. Perfect for color changes." },
  { name: "Catherine Wheel", multiple: 10, plus: 6, minRows: 4, craft: "crochet", category: "lacy", difficulty: 3, notes: "Pinwheel fans. Stunning in two colors." },
  { name: "Fan Stitch", multiple: 8, plus: 1, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Large fans with chain arches." },
  { name: "Arcade Stitch", multiple: 6, plus: 1, minRows: 4, craft: "crochet", category: "lacy", difficulty: 2, notes: "Arching shells. Great drape." },
  { name: "Offset Shell", multiple: 3, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Staggered 3-DC clusters." },
  { name: "Iris Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "lacy", difficulty: 2, notes: "Puff stitch + chain. Creates flower-like texture." },

  // Crochet — Colorwork
  { name: "Spike Stitch", multiple: 2, plus: 0, minRows: 2, craft: "crochet", category: "colorwork", difficulty: 2, notes: "Insert hook into row(s) below. Great for stripes." },
  { name: "Plaid / Tartan", multiple: 4, plus: 0, minRows: 4, craft: "crochet", category: "colorwork", difficulty: 3, notes: "Interlocking SC blocks with surface chains." },
  { name: "C2C (Corner to Corner)", multiple: 1, plus: 0, minRows: 1, craft: "crochet", category: "colorwork", difficulty: 2, notes: "Diagonal squares. Multiple is per block, not per stitch." },

  // Knitting — Ribbing
  { name: "1×1 Rib", multiple: 2, plus: 0, minRows: 1, craft: "knitting", category: "ribbing", difficulty: 1, notes: "K1, P1 repeat. Stretchy." },
  { name: "2×2 Rib", multiple: 4, plus: 0, minRows: 1, craft: "knitting", category: "ribbing", difficulty: 1, notes: "K2, P2 repeat." },
  { name: "Broken Rib", multiple: 2, plus: 0, minRows: 2, craft: "knitting", category: "ribbing", difficulty: 1, notes: "Rib on RS, knit on WS. Lies flat." },
  { name: "Fisherman's Rib", multiple: 2, plus: 1, minRows: 2, craft: "knitting", category: "ribbing", difficulty: 2, notes: "Knit-below creates thick, squishy fabric." },

  // Knitting — Textured
  { name: "Seed / Moss Stitch", multiple: 2, plus: 0, minRows: 2, craft: "knitting", category: "textured", difficulty: 1, notes: "K1, P1 offset every row. Lies flat." },
  { name: "Double Seed Stitch", multiple: 4, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 1, notes: "2 rows of 2×2 blocks. Chunkier seed stitch." },
  { name: "Basketweave", multiple: 8, plus: 5, minRows: 8, craft: "knitting", category: "textured", difficulty: 2, notes: "Blocks of stockinette and reverse stockinette." },
  { name: "Garter Rib", multiple: 4, plus: 2, minRows: 2, craft: "knitting", category: "textured", difficulty: 1, notes: "Knit columns with garter between." },
  { name: "Honeycomb", multiple: 8, plus: 0, minRows: 8, craft: "knitting", category: "textured", difficulty: 3, notes: "Cable-based honeycomb pattern." },
  { name: "Waffle Stitch (knit)", multiple: 3, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 2, notes: "K + sl wyif pattern. Creates waffle grid." },
  { name: "Hurdle Stitch", multiple: 2, plus: 0, minRows: 4, craft: "knitting", category: "textured", difficulty: 1, notes: "2 rows garter, 2 rows stockinette." },

  // Knitting — Lacy
  { name: "Feather and Fan", multiple: 18, plus: 0, minRows: 4, craft: "knitting", category: "lacy", difficulty: 2, notes: "Classic Old Shale. Wavy edges." },
  { name: "Simple Lace Chevron", multiple: 12, plus: 1, minRows: 2, craft: "knitting", category: "lacy", difficulty: 2, notes: "YO + K2tog creates zigzag lace." },
  { name: "Eyelet Rows", multiple: 2, plus: 0, minRows: 4, craft: "knitting", category: "lacy", difficulty: 1, notes: "YO, K2tog across one row. Subtle lace." },

  // Knitting — Cable
  { name: "Simple 4-st Cable", multiple: 6, plus: 2, minRows: 6, craft: "knitting", category: "cable", difficulty: 2, notes: "C4F or C4B with purl background." },
  { name: "Cable & Rib Panel", multiple: 10, plus: 0, minRows: 8, craft: "knitting", category: "cable", difficulty: 2, notes: "Cable columns separated by ribbing." },
  { name: "Braided Cable", multiple: 12, plus: 2, minRows: 8, craft: "knitting", category: "cable", difficulty: 3, notes: "Three-strand braid effect." },

  // Both crafts
  { name: "Stockinette / SC rows", multiple: 1, plus: 0, minRows: 1, craft: "both", category: "solid", difficulty: 1, notes: "Basic flat fabric. Any count works." },
];

// ── MATH UTILITIES ────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function lcmArray(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n), 1);
}

/**
 * Given multiples with plus values and a width range,
 * find stitch counts that satisfy ALL patterns:
 *   count ≡ plus_i (mod multiple_i) for every i
 * Also adds edge stitches on top.
 */
function findCompatibleCounts(
  patterns: PatternEntry[],
  minWidth: number,
  maxWidth: number,
  edgeStitches: number
): number[] {
  if (patterns.length === 0) return [];

  const multOnly = patterns.map((p) => p.multiple);
  const step = lcmArray(multOnly);

  // Find a starting base that satisfies all plus conditions
  // Brute force within one LCM cycle — fine since LCMs are small
  let base = -1;
  for (let candidate = 0; candidate < step; candidate++) {
    const allMatch = patterns.every(
      (p) => (candidate - p.plus + 1000 * p.multiple) % p.multiple === 0
    );
    if (allMatch) {
      base = candidate;
      break;
    }
  }

  if (base === -1) return []; // No solution (conflicting plus values)

  const results: number[] = [];
  const searchMin = Math.max(1, minWidth - edgeStitches);
  const searchMax = maxWidth - edgeStitches;

  // Start from nearest candidate at or above searchMin
  let start = base;
  while (start < searchMin) start += step;

  for (let c = start; c <= searchMax; c += step) {
    if (c > 0) results.push(c + edgeStitches);
  }

  return results;
}

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

  // Database tab
  const [craftFilter, setCraftFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [maxMultiple, setMaxMultiple] = useState("");
  const [maxRows, setMaxRows] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Planner tab
  const [plannerSections, setPlannerSections] = useState<
    { id: number; stitch: string; rowRepeat: number; targetRows: number }[]
  >([
    { id: 1, stitch: "Waffle Stitch", rowRepeat: 4, targetRows: 20 },
    { id: 2, stitch: "Moss Stitch", rowRepeat: 2, targetRows: 16 },
    { id: 3, stitch: "Shell Stitch", rowRepeat: 2, targetRows: 12 },
  ]);
  const [plannerNextId, setPlannerNextId] = useState(4);

  // ── Calculator results ────────────────────────────────────────

  const calcResults = useMemo(() => {
    const validEntries = entries.filter((e) => e.multiple > 0);
    if (validEntries.length === 0) return null;

    const multiples = validEntries.map((e) => e.multiple);
    const lcmVal = lcmArray(multiples);
    const min = parseInt(minWidth) || 100;
    const max = parseInt(maxWidth) || 200;
    const edge = parseInt(edgeStitches) || 0;

    const counts = findCompatibleCounts(validEntries, min, max, edge);

    return { lcm: lcmVal, counts, validEntries, edge };
  }, [entries, minWidth, maxWidth, edgeStitches]);

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

  const plannerResults = useMemo(() => {
    return plannerSections.map((s) => {
      const fullRepeats = Math.round(s.targetRows / s.rowRepeat);
      const actualRows = fullRepeats * s.rowRepeat;
      return { ...s, fullRepeats, actualRows };
    });
  }, [plannerSections]);

  const totalPlannerRows = plannerResults.reduce((sum, r) => sum + r.actualRows, 0);

  // ── Handlers ──────────────────────────────────────────────────

  const addEntry = () => {
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
    setEntries([
      ...entries,
      { id: nextId, multiple: stitch.multiple, plus: stitch.plus, name: stitch.name },
    ]);
    setNextId(nextId + 1);
    setTab("calculator");
  };

  const addPlannerSection = () => {
    setPlannerSections([
      ...plannerSections,
      { id: plannerNextId, stitch: "", rowRepeat: 2, targetRows: 12 },
    ]);
    setPlannerNextId(plannerNextId + 1);
  };

  const removePlannerSection = (id: number) => {
    if (plannerSections.length <= 1) return;
    setPlannerSections(plannerSections.filter((s) => s.id !== id));
  };

  const updatePlannerSection = (
    id: number,
    field: keyof (typeof plannerSections)[0],
    value: string | number
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
      `Edge stitches: ${calcResults.edge}`,
      ``,
      `Compatible stitch counts (${minWidth}–${maxWidth} range):`,
      ...(calcResults.counts.length > 0
        ? calcResults.counts.map((c) => `  ${c} stitches`)
        : ["  No compatible counts in this range."]),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  };

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-cream-200/60 dark:bg-bark-700/60 rounded-lg">
        {(
          [
            { key: "calculator", label: "🧮 Multiple Calculator" },
            { key: "database", label: "📖 Stitch Library" },
            { key: "planner", label: "📐 Row Planner" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
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
              <button onClick={addEntry} className="btn-secondary text-sm">
                + Add Pattern
              </button>
            </div>

            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 p-3 bg-cream-100/50 dark:bg-bark-700/50 rounded-lg"
              >
                <span className="text-xs font-bold text-bark-400 dark:text-bark-500 w-5 text-center">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
                  placeholder="Pattern name (optional)"
                  className="input flex-1 min-w-0"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                    Multiple of
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={entry.multiple || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, "multiple", parseInt(e.target.value) || 0)
                    }
                    className="input w-16 text-center"
                  />
                  <span className="text-xs text-bark-400 dark:text-bark-500">+</span>
                  <input
                    type="number"
                    min={0}
                    value={entry.plus || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, "plus", parseInt(e.target.value) || 0)
                    }
                    className="input w-14 text-center"
                    placeholder="0"
                  />
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-bark-400 hover:text-rose-500 transition-colors p-1"
                  disabled={entries.length <= 1}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
            <p className="text-xs text-bark-400 dark:text-bark-500">
              💡 Not sure about your stitch multiples? Check the{" "}
              <button onClick={() => setTab("database")} className="underline text-sage-600 dark:text-sage-400">
                Stitch Library
              </button>{" "}
              and add patterns directly.
            </p>
          </div>

          {/* Width range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">
                Min Stitch Count
                <Tooltip text="Lower bound of your desired stitch count range." />
              </label>
              <input
                type="number"
                min={1}
                value={minWidth}
                onChange={(e) => setMinWidth(e.target.value)}
                className="input"
                placeholder="120"
              />
            </div>
            <div>
              <label className="label">
                Max Stitch Count
                <Tooltip text="Upper bound of your desired stitch count range." />
              </label>
              <input
                type="number"
                min={1}
                value={maxWidth}
                onChange={(e) => setMaxWidth(e.target.value)}
                className="input"
                placeholder="180"
              />
            </div>
            <div>
              <label className="label">
                Edge Stitches
                <Tooltip text="Extra stitches added to each side for borders or selvedge. This number is added on top of the pattern repeat count." />
              </label>
              <input
                type="number"
                min={0}
                value={edgeStitches}
                onChange={(e) => setEdgeStitches(e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          {/* Results */}
          {calcResults && (
            <div className="rounded-xl border-2 border-sage-200 dark:border-sage-800 bg-sage-50/50 dark:bg-sage-900/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-bark-800 dark:text-cream-100 text-lg">
                  Results
                </h3>
                <button onClick={copyResults} className="btn-secondary text-sm">
                  📋 Copy
                </button>
              </div>

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
                    Pattern repeats every {calcResults.lcm} stitches
                  </div>
                </div>
                <div className="bg-white dark:bg-bark-700 rounded-lg px-4 py-3 shadow-sm">
                  <div className="text-xs text-bark-400 dark:text-bark-500 uppercase tracking-wider">
                    Compatible Counts
                  </div>
                  <div className="text-2xl font-bold font-mono text-sage-700 dark:text-sage-300">
                    {calcResults.counts.length}
                  </div>
                  <div className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                    in {minWidth}–{maxWidth} range
                  </div>
                </div>
              </div>

              {/* Compatible stitch counts */}
              {calcResults.counts.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-bark-600 dark:text-cream-300 mb-2">
                    Use any of these stitch counts:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {calcResults.counts.map((count) => (
                      <button
                        key={count}
                        onClick={() => navigator.clipboard.writeText(String(count))}
                        className="px-3 py-1.5 bg-white dark:bg-bark-600 border border-cream-300 dark:border-bark-500 rounded-lg font-mono font-bold text-bark-700 dark:text-cream-200 hover:border-sage-400 dark:hover:border-sage-500 transition-colors text-sm cursor-pointer"
                        title="Click to copy"
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  {calcResults.edge > 0 && (
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-2">
                      Includes {calcResults.edge} edge stitch{calcResults.edge !== 1 ? "es" : ""}. Pattern
                      stitches: {calcResults.counts.map((c) => c - calcResults.edge).join(", ")}.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-bark-400 dark:text-bark-500">
                  <p className="text-lg mb-1">No compatible counts found</p>
                  <p className="text-sm">
                    Try widening your range or adjusting the &ldquo;plus&rdquo; values. Some combinations of plus
                    values have no shared solution.
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
                          const patternSt = calcResults.counts[0] - calcResults.edge;
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
                                    ✓ Perfect
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
              <label className="label text-xs">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Stitch name…"
                className="input"
              />
            </div>
            <div>
              <label className="label text-xs">Craft</label>
              <select
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
              <label className="label text-xs">Category</label>
              <select
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
              <label className="label text-xs">Max Multiple</label>
              <input
                type="number"
                min={1}
                value={maxMultiple}
                onChange={(e) => setMaxMultiple(e.target.value)}
                placeholder="Any"
                className="input"
              />
            </div>
            <div>
              <label className="label text-xs">Max Row Repeat</label>
              <input
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
            Showing {filteredStitches.length} of {STITCH_DATABASE.length} stitches. Click{" "}
            <strong>+ Add</strong> to send a stitch to the calculator.
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
                  onClick={() => addFromDatabase(stitch)}
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
              <button onClick={addPlannerSection} className="btn-secondary text-sm">
                + Add Section
              </button>
            </div>

            <div className="space-y-2">
              {plannerSections.map((section, i) => (
                <div
                  key={section.id}
                  className="flex items-center gap-2 p-3 bg-cream-100/50 dark:bg-bark-700/50 rounded-lg"
                >
                  <span className="text-xs font-bold text-bark-400 dark:text-bark-500 w-5 text-center">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={section.stitch}
                    onChange={(e) =>
                      updatePlannerSection(section.id, "stitch", e.target.value)
                    }
                    placeholder="Stitch name"
                    className="input flex-1 min-w-0"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                      Row repeat
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={section.rowRepeat || ""}
                      onChange={(e) =>
                        updatePlannerSection(
                          section.id,
                          "rowRepeat",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="input w-14 text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-bark-400 dark:text-bark-500 whitespace-nowrap">
                      Target rows
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={section.targetRows || ""}
                      onChange={(e) =>
                        updatePlannerSection(
                          section.id,
                          "targetRows",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="input w-16 text-center"
                    />
                  </div>
                  <button
                    onClick={() => removePlannerSection(section.id)}
                    className="text-bark-400 hover:text-rose-500 transition-colors p-1"
                    disabled={plannerSections.length <= 1}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Planner results */}
          <div className="rounded-xl border-2 border-sage-200 dark:border-sage-800 bg-sage-50/50 dark:bg-sage-900/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-bark-800 dark:text-cream-100 text-lg">
                Row Plan
              </h3>
              <button
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
                      {plannerSections.reduce((s, sec) => s + sec.targetRows, 0)}
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
        </div>
      )}
    </div>
  );
}
