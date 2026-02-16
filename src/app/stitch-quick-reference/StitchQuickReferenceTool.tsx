"use client";

import { useState, useMemo } from "react";

// ── TYPES ─────────────────────────────────────────────────────────

interface StitchRef {
  name: string;
  abbr: string;
  ukName?: string;
  ukAbbr?: string;
  craft: "crochet" | "knitting";
  turningChain?: number;
  yarnOvers: number;
  pullThrus: number;
  totalSteps: number;
  steps: StitchStep[];
  tips?: string;
  loopCounts?: number[]; // loops on hook/needle after each step
}

interface StitchStep {
  action: string;
  detail: string;
  loopsAfter?: number;
}

type CraftFilter = "all" | "crochet" | "knitting";
type ViewMode = "cards" | "comparison";

// ── STITCH DATA ───────────────────────────────────────────────────

const STITCHES: StitchRef[] = [
  // ── CROCHET ───────────────────────────────────────────────────
  {
    name: "Chain",
    abbr: "CH",
    ukName: "Chain",
    ukAbbr: "CH",
    craft: "crochet",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 2,
    tips: "Keep chains loose — tight chains make the foundation row hard to work into.",
    steps: [
      { action: "Yarn over", detail: "Wrap yarn over hook from back to front", loopsAfter: 2 },
      { action: "Pull through", detail: "Pull hook through the loop on hook. 1 chain made.", loopsAfter: 1 },
    ],
  },
  {
    name: "Slip Stitch",
    abbr: "SL ST",
    ukName: "Slip Stitch",
    ukAbbr: "SS",
    craft: "crochet",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 3,
    tips: "Used for joining rounds and moving yarn without adding height. Does not count as a stitch.",
    steps: [
      { action: "Insert hook", detail: "Insert hook into the stitch", loopsAfter: 1 },
      { action: "Yarn over + pull through ALL", detail: "Yarn over and pull through the stitch AND the loop on hook in one motion", loopsAfter: 1 },
      { action: "Done", detail: "1 loop remains. No height added.", loopsAfter: 1 },
    ],
  },
  {
    name: "Single Crochet",
    abbr: "SC",
    ukName: "Double Crochet",
    ukAbbr: "DC",
    craft: "crochet",
    turningChain: 1,
    yarnOvers: 2,
    pullThrus: 2,
    totalSteps: 4,
    tips: "The shortest standard stitch. Creates a tight, dense fabric. Turning chain does NOT count as a stitch.",
    steps: [
      { action: "Insert hook", detail: "Insert hook into the next stitch", loopsAfter: 1 },
      { action: "Yarn over + pull up", detail: "Yarn over, pull up a loop through the stitch", loopsAfter: 2 },
      { action: "Yarn over", detail: "Yarn over again", loopsAfter: 3 },
      { action: "Pull through both", detail: "Pull through both loops on hook. SC complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Half Double Crochet",
    abbr: "HDC",
    ukName: "Half Treble",
    ukAbbr: "HTR",
    craft: "crochet",
    turningChain: 2,
    yarnOvers: 3,
    pullThrus: 1,
    totalSteps: 4,
    tips: "Slightly taller than SC with a nice drape. The initial YO before inserting hook is what makes it taller. Pull through all 3 at once.",
    steps: [
      { action: "Yarn over", detail: "Yarn over BEFORE inserting hook", loopsAfter: 2 },
      { action: "Insert + pull up", detail: "Insert hook into stitch, yarn over, pull up a loop", loopsAfter: 3 },
      { action: "Yarn over", detail: "Yarn over one more time", loopsAfter: 4 },
      { action: "Pull through ALL 3", detail: "Pull through all 3 loops on hook at once. HDC complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Double Crochet",
    abbr: "DC",
    ukName: "Treble",
    ukAbbr: "TR",
    craft: "crochet",
    turningChain: 3,
    yarnOvers: 4,
    pullThrus: 3,
    totalSteps: 6,
    tips: "The workhorse stitch. Turning chain usually counts as first DC. Work in pairs of 'YO, pull through 2' after the initial pull-up.",
    steps: [
      { action: "Yarn over", detail: "Yarn over BEFORE inserting hook", loopsAfter: 2 },
      { action: "Insert + pull up", detail: "Insert hook into stitch, yarn over, pull up a loop", loopsAfter: 3 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through first 2 loops on hook", loopsAfter: 2 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through last 2 loops on hook. DC complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Treble Crochet",
    abbr: "TR",
    ukName: "Double Treble",
    ukAbbr: "DTR",
    craft: "crochet",
    turningChain: 4,
    yarnOvers: 5,
    pullThrus: 4,
    totalSteps: 7,
    tips: "Very tall stitch with lots of drape. Creates an open, lacy fabric. The pattern is simple: YO twice at the start, then 'YO, pull through 2' three times.",
    steps: [
      { action: "Yarn over twice", detail: "Wrap yarn over hook TWO times", loopsAfter: 3 },
      { action: "Insert + pull up", detail: "Insert hook into stitch, yarn over, pull up a loop", loopsAfter: 4 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through first 2 loops", loopsAfter: 3 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through next 2 loops", loopsAfter: 2 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through last 2 loops. TR complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Double Treble Crochet",
    abbr: "DTR",
    ukName: "Triple Treble",
    ukAbbr: "TPTR",
    craft: "crochet",
    turningChain: 5,
    yarnOvers: 6,
    pullThrus: 5,
    totalSteps: 8,
    tips: "Very tall, very open. YO three times at the start, then 'YO, pull through 2' four times. Rarely used in blankets but common in lace and doilies.",
    steps: [
      { action: "Yarn over 3 times", detail: "Wrap yarn over hook THREE times", loopsAfter: 4 },
      { action: "Insert + pull up", detail: "Insert hook into stitch, yarn over, pull up a loop", loopsAfter: 5 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through 2 loops", loopsAfter: 4 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through 2 loops", loopsAfter: 3 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through 2 loops", loopsAfter: 2 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through last 2 loops. DTR complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Front Post Double Crochet",
    abbr: "FPdc",
    craft: "crochet",
    yarnOvers: 4,
    pullThrus: 3,
    totalSteps: 5,
    tips: "Same as DC but you go AROUND the post instead of into the top. This pushes the stitch to the front creating raised texture. Used in waffle stitch, basket weave, and ribbing.",
    steps: [
      { action: "Yarn over", detail: "Yarn over BEFORE inserting hook", loopsAfter: 2 },
      { action: "Insert around post", detail: "Insert hook from FRONT to back to front, around the POST (vertical bar) of the stitch in the row below", loopsAfter: 2 },
      { action: "YO + pull up", detail: "Yarn over, pull up a loop around the post", loopsAfter: 3 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through 2 loops", loopsAfter: 2 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through last 2 loops. FPdc complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Back Post Double Crochet",
    abbr: "BPdc",
    craft: "crochet",
    yarnOvers: 4,
    pullThrus: 3,
    totalSteps: 5,
    tips: "Same as FPdc but from the back. Pushes the stitch to the back, creating an indented look. Alternating FPdc and BPdc creates ribbing.",
    steps: [
      { action: "Yarn over", detail: "Yarn over BEFORE inserting hook", loopsAfter: 2 },
      { action: "Insert around post", detail: "Insert hook from BACK to front to back, around the POST of the stitch in the row below", loopsAfter: 2 },
      { action: "YO + pull up", detail: "Yarn over, pull up a loop around the post", loopsAfter: 3 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through 2 loops", loopsAfter: 2 },
      { action: "YO, pull through 2", detail: "Yarn over, pull through last 2 loops. BPdc complete.", loopsAfter: 1 },
    ],
  },
  {
    name: "Magic Ring",
    abbr: "MR",
    craft: "crochet",
    yarnOvers: 0,
    pullThrus: 0,
    totalSteps: 5,
    tips: "The best way to start working in the round — closes completely with no hole in the center. Takes practice but worth learning.",
    steps: [
      { action: "Form ring", detail: "Wrap yarn around index finger twice (or once) to create a loop", loopsAfter: 0 },
      { action: "Insert + pull up", detail: "Insert hook through the ring, yarn over, pull up a loop", loopsAfter: 1 },
      { action: "Chain 1", detail: "Chain 1 to secure (does NOT count as a stitch)", loopsAfter: 1 },
      { action: "Work stitches", detail: "Work the required number of stitches into the ring (usually 6 SC or 12 DC)", loopsAfter: 1 },
      { action: "Pull tail tight", detail: "Pull the starting yarn tail to close the ring completely. Join with SL ST to first stitch.", loopsAfter: 1 },
    ],
  },

  // ── KNITTING ──────────────────────────────────────────────────
  {
    name: "Knit Stitch",
    abbr: "K",
    craft: "knitting",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 4,
    tips: "The foundation of knitting. Yarn stays in back. Creates a V-shape on the facing side and a bump on the back.",
    steps: [
      { action: "Insert needle", detail: "Insert right needle into stitch from LEFT to right (knitwise), front to back", loopsAfter: 1 },
      { action: "Wrap yarn", detail: "Wrap working yarn counter-clockwise around right needle (yarn is in back)", loopsAfter: 1 },
      { action: "Pull through", detail: "Pull the new loop through the old stitch with right needle", loopsAfter: 1 },
      { action: "Slip off", detail: "Slide the old stitch off the left needle. New stitch is on right needle.", loopsAfter: 1 },
    ],
  },
  {
    name: "Purl Stitch",
    abbr: "P",
    craft: "knitting",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 5,
    tips: "The reverse of knit — creates a bump on the facing side. Yarn must be in front. A row of purls on the back = a row of knits on the front (stockinette).",
    steps: [
      { action: "Yarn to front", detail: "Bring working yarn to the FRONT of work (between the needles)", loopsAfter: 1 },
      { action: "Insert needle", detail: "Insert right needle into stitch from RIGHT to left (purlwise), back to front", loopsAfter: 1 },
      { action: "Wrap yarn", detail: "Wrap working yarn counter-clockwise around right needle", loopsAfter: 1 },
      { action: "Pull through", detail: "Pull the new loop through the old stitch (toward the back)", loopsAfter: 1 },
      { action: "Slip off", detail: "Slide old stitch off left needle.", loopsAfter: 1 },
    ],
  },
  {
    name: "Yarn Over",
    abbr: "YO",
    craft: "knitting",
    yarnOvers: 1,
    pullThrus: 0,
    totalSteps: 2,
    tips: "Creates a new stitch AND a decorative hole. Used in lace patterns and as an increase. The hole is the feature, not a mistake.",
    steps: [
      { action: "Bring yarn forward", detail: "If yarn is in back, bring it to the front between the needles", loopsAfter: 1 },
      { action: "Wrap over needle", detail: "Lay yarn over the right needle from front to back. On the next row, knit or purl this wrap as a regular stitch.", loopsAfter: 2 },
    ],
  },
  {
    name: "Knit 2 Together",
    abbr: "K2tog",
    craft: "knitting",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 3,
    tips: "The simplest decrease. Leans to the RIGHT. Pair with SSK (left-leaning) for symmetrical shaping.",
    steps: [
      { action: "Insert through 2", detail: "Insert right needle knitwise through 2 stitches at once (through 2nd stitch first, then 1st)", loopsAfter: 2 },
      { action: "Wrap + pull through", detail: "Wrap yarn and knit them as if they were a single stitch", loopsAfter: 1 },
      { action: "Slip both off", detail: "Both old stitches drop off left needle. 2 become 1.", loopsAfter: 1 },
    ],
  },
  {
    name: "Slip Slip Knit",
    abbr: "SSK",
    craft: "knitting",
    yarnOvers: 1,
    pullThrus: 1,
    totalSteps: 4,
    tips: "Left-leaning decrease. Mirror of K2tog. The slipping step reorients the stitches so the decrease leans left.",
    steps: [
      { action: "Slip 1 knitwise", detail: "Slip first stitch from left needle to right needle knitwise (this twists it)", loopsAfter: 1 },
      { action: "Slip 1 knitwise", detail: "Slip second stitch knitwise the same way", loopsAfter: 2 },
      { action: "Insert left needle", detail: "Insert left needle into the FRONTS of both slipped stitches (from left to right)", loopsAfter: 2 },
      { action: "Knit together", detail: "Wrap yarn and knit them together through the back loops. 2 become 1, leaning left.", loopsAfter: 1 },
    ],
  },
  {
    name: "Cable 4 Front",
    abbr: "C4F",
    craft: "knitting",
    yarnOvers: 0,
    pullThrus: 0,
    totalSteps: 4,
    tips: "Left-crossing cable. 'Front' means the held stitches go to the front of work, which makes the cable twist to the LEFT. For right-crossing, hold in back (C4B).",
    steps: [
      { action: "Slip 2 to CN", detail: "Slip next 2 stitches onto cable needle. Hold cable needle at FRONT of work.", loopsAfter: 2 },
      { action: "Knit 2", detail: "Knit the next 2 stitches from left needle as normal", loopsAfter: 2 },
      { action: "Knit 2 from CN", detail: "Knit the 2 stitches from the cable needle", loopsAfter: 2 },
      { action: "Done", detail: "4 stitches crossed — the first 2 now sit on top, crossing left.", loopsAfter: 0 },
    ],
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────

export default function StitchQuickReferenceTool() {
  const [craftFilter, setCraftFilter] = useState<CraftFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUK, setShowUK] = useState(false);
  const [expandedStitch, setExpandedStitch] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return STITCHES.filter((s) => {
      if (craftFilter !== "all" && s.craft !== craftFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.abbr.toLowerCase().includes(q) ||
          (s.ukName && s.ukName.toLowerCase().includes(q)) ||
          (s.ukAbbr && s.ukAbbr.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [craftFilter, searchQuery]);

  const crochetStitches = STITCHES.filter(
    (s) => s.craft === "crochet" && s.turningChain !== undefined
  ).sort((a, b) => (a.turningChain || 0) - (b.turningChain || 0));

  return (
    <div className="space-y-6">
      {/* View mode tabs */}
      <div className="flex gap-1 p-1 bg-cream-200/60 dark:bg-bark-700/60 rounded-lg">
        {(
          [
            { key: "cards", label: "🃏 Stitch Cards" },
            { key: "comparison", label: "📊 Height Comparison" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              viewMode === key
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══ STITCH CARDS VIEW ═══════════════════════════════════════ */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stitches…"
              className="input"
            />
            <select
              value={craftFilter}
              onChange={(e) => setCraftFilter(e.target.value as CraftFilter)}
              className="input"
            >
              <option value="all">All Crafts</option>
              <option value="crochet">Crochet Only</option>
              <option value="knitting">Knitting Only</option>
            </select>
            <label className="flex items-center gap-2 text-sm cursor-pointer px-3">
              <input
                type="checkbox"
                checked={showUK}
                onChange={() => setShowUK(!showUK)}
                className="w-4 h-4 rounded border-cream-400 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-bark-600 dark:text-cream-300">Show UK terms</span>
            </label>
          </div>

          <p className="text-xs text-bark-400 dark:text-bark-500">
            {filtered.length} stitch{filtered.length !== 1 ? "es" : ""}. Tap any card to expand the
            full step-by-step.
          </p>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((stitch) => {
              const isOpen = expandedStitch === stitch.abbr;
              return (
                <div
                  key={stitch.abbr}
                  className="rounded-xl border border-cream-200 dark:border-bark-700 overflow-hidden"
                >
                  {/* Card header */}
                  <button
                    onClick={() => setExpandedStitch(isOpen ? null : stitch.abbr)}
                    className="w-full text-left p-4 hover:bg-cream-50 dark:hover:bg-bark-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-bark-800 dark:text-cream-100">
                            {stitch.name}
                          </h3>
                          <span className="font-mono text-sm font-bold text-sage-700 dark:text-sage-400 bg-sage-100 dark:bg-sage-900/30 px-2 py-0.5 rounded">
                            {stitch.abbr}
                          </span>
                        </div>
                        {showUK && stitch.ukName && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                            UK: {stitch.ukName} ({stitch.ukAbbr})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            stitch.craft === "crochet"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                          }`}
                        >
                          {stitch.craft === "crochet" ? "🧶 Crochet" : "🪡 Knitting"}
                        </span>
                        <span className="text-bark-300 dark:text-bark-600 text-sm">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    {/* Quick stats bar */}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {stitch.turningChain !== undefined && (
                        <span className="bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded text-bark-600 dark:text-cream-300">
                          Turning CH: {stitch.turningChain}
                        </span>
                      )}
                      <span className="bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded text-bark-600 dark:text-cream-300">
                        {stitch.yarnOvers} YO
                      </span>
                      <span className="bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded text-bark-600 dark:text-cream-300">
                        {stitch.pullThrus} pull-thru{stitch.pullThrus !== 1 ? "s" : ""}
                      </span>
                      <span className="bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded text-bark-600 dark:text-cream-300">
                        {stitch.steps.length} steps
                      </span>
                    </div>
                  </button>

                  {/* Expanded steps */}
                  {isOpen && (
                    <div className="border-t border-cream-200 dark:border-bark-700 bg-cream-50/50 dark:bg-bark-800/50 p-4 space-y-3">
                      {/* Step-by-step */}
                      <ol className="space-y-2">
                        {stitch.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-sage-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <div className="flex-1">
                              <span className="font-semibold text-bark-700 dark:text-cream-200 text-sm">
                                {step.action}
                              </span>
                              <p className="text-xs text-bark-500 dark:text-bark-400 mt-0.5">
                                {step.detail}
                              </p>
                              {step.loopsAfter !== undefined && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-[10px] text-bark-400 dark:text-bark-500">
                                    Loops on hook:
                                  </span>
                                  <div className="flex gap-0.5">
                                    {Array.from({ length: step.loopsAfter }).map((_, j) => (
                                      <div
                                        key={j}
                                        className="w-3 h-3 rounded-full bg-sage-400 dark:bg-sage-600"
                                      />
                                    ))}
                                    {step.loopsAfter === 0 && (
                                      <span className="text-[10px] text-bark-400">none</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>

                      {/* Tips */}
                      {stitch.tips && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200">
                          <span className="font-bold">💡 Tip:</span> {stitch.tips}
                        </div>
                      )}

                      {/* Copy button */}
                      <button
                        onClick={() => {
                          const text = [
                            `${stitch.name} (${stitch.abbr})`,
                            stitch.turningChain !== undefined ? `Turning chain: ${stitch.turningChain}` : "",
                            `YO: ${stitch.yarnOvers} | Pull-thrus: ${stitch.pullThrus}`,
                            "",
                            ...stitch.steps.map((s, i) => `${i + 1}. ${s.action}: ${s.detail}`),
                            "",
                            stitch.tips ? `Tip: ${stitch.tips}` : "",
                          ]
                            .filter(Boolean)
                            .join("\n");
                          navigator.clipboard.writeText(text);
                        }}
                        className="btn-secondary text-xs"
                      >
                        📋 Copy steps
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ HEIGHT COMPARISON VIEW ══════════════════════════════════ */}
      {viewMode === "comparison" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-500 dark:text-bark-400">
            Visual comparison of crochet stitch heights, turning chains, and complexity. Each bar
            shows relative height and the number of yarn-overs and pull-throughs required.
          </p>

          {/* Height chart */}
          <div className="space-y-3">
            {crochetStitches.map((stitch) => {
              const maxHeight = 5; // DTR turning chain
              const height = stitch.turningChain || 0;
              const pct = (height / maxHeight) * 100;
              return (
                <div key={stitch.abbr} className="flex items-center gap-3">
                  <div className="w-28 text-right flex-shrink-0">
                    <span className="font-semibold text-sm text-bark-700 dark:text-cream-200">
                      {stitch.name}
                    </span>
                    <span className="block text-[10px] font-mono text-bark-400 dark:text-bark-500">
                      {stitch.abbr}
                      {showUK && stitch.ukAbbr && ` / ${stitch.ukAbbr}`}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-8 bg-cream-200 dark:bg-bark-700 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sage-400 to-sage-500 dark:from-sage-600 dark:to-sage-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(pct, 12)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow whitespace-nowrap">
                          CH {height}
                        </span>
                      </div>
                    </div>
                    <div className="w-24 flex items-center gap-2 text-[10px] font-mono text-bark-500 dark:text-bark-400 flex-shrink-0">
                      <span>{stitch.yarnOvers} YO</span>
                      <span className="text-bark-300">·</span>
                      <span>{stitch.pullThrus} PT</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pattern recognition guide */}
          <div className="rounded-xl border border-cream-200 dark:border-bark-700 bg-cream-50/50 dark:bg-bark-800/50 p-5 space-y-3">
            <h3 className="font-display font-bold text-bark-800 dark:text-cream-100">
              The Pattern to Remember
            </h3>
            <p className="text-sm text-bark-600 dark:text-cream-300">
              Crochet stitches follow a simple formula. Each stitch is one yarn-over taller than the
              previous. The number of &ldquo;YO, pull through 2&rdquo; steps at the end always equals the
              number of initial yarn-overs.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Stitch
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      YO Before Insert
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      &ldquo;YO, Pull 2&rdquo; After
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">
                      Turning CH
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {crochetStitches.map((s) => (
                    <tr key={s.abbr}>
                      <td className="py-2 px-3 font-medium text-bark-700 dark:text-cream-200">
                        {s.name}{" "}
                        <span className="font-mono text-sage-600 dark:text-sage-400 text-xs">
                          ({s.abbr})
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        {s.abbr === "SC"
                          ? "0"
                          : s.abbr === "HDC"
                            ? "1"
                            : s.abbr === "DC"
                              ? "1"
                              : s.abbr === "TR"
                                ? "2"
                                : s.abbr === "DTR"
                                  ? "3"
                                  : "—"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        {s.abbr === "SC"
                          ? "1 (both)"
                          : s.abbr === "HDC"
                            ? "1 (all 3)"
                            : s.abbr === "DC"
                              ? "2"
                              : s.abbr === "TR"
                                ? "3"
                                : s.abbr === "DTR"
                                  ? "4"
                                  : "—"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-sage-700 dark:text-sage-300">
                        {s.turningChain ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
