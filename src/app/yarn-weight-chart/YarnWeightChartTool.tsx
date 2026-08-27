"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import { YARN_WEIGHTS as WEIGHTS, compareYarnLabels, filterYarnWeights } from "@/lib/yarn-weight-reference.mjs";

// ── FIBER GUIDE ───────────────────────────────────────────────────

interface Fiber {
  name: string;
  emoji: string;
  warmth: number; // 1-5
  drape: number; // 1-5 (1=stiff, 5=very drapey)
  care: string;
  notes: string;
}

const FIBERS: Fiber[] = [
  { name: "Wool (Merino)", emoji: "🐑", warmth: 5, drape: 3, care: "Hand wash", notes: "Elastic, warm, great stitch definition. Can felt if agitated." },
  { name: "Cotton", emoji: "🌿", warmth: 1, drape: 4, care: "Machine wash", notes: "Cool, heavy, no stretch. Great for summer and dishcloths. Grows with wear." },
  { name: "Acrylic", emoji: "🧪", warmth: 3, drape: 3, care: "Machine wash/dry", notes: "Budget-friendly, easy care, wide color range. Less breathable than natural fibers." },
  { name: "Alpaca", emoji: "🦙", warmth: 5, drape: 5, care: "Hand wash", notes: "Incredibly soft and warm. Very drapey, size down on needles. No memory (stretches)." },
  { name: "Silk", emoji: "✨", warmth: 2, drape: 5, care: "Hand wash", notes: "Beautiful sheen and drape. Strong but no elasticity. Often blended with wool." },
  { name: "Linen", emoji: "🌾", warmth: 1, drape: 4, care: "Machine wash", notes: "Stiff at first, softens beautifully with washing. Cool for summer. Crisp stitch definition." },
  { name: "Bamboo", emoji: "🎋", warmth: 2, drape: 5, care: "Machine wash gentle", notes: "Silky feel, good drape. Eco-friendly. Similar properties to rayon." },
  { name: "Cashmere", emoji: "🐐", warmth: 5, drape: 4, care: "Hand wash", notes: "Ultra-soft luxury fiber. Lightweight warmth. Delicate, pills with wear." },
  { name: "Nylon", emoji: "💪", warmth: 2, drape: 2, care: "Machine wash", notes: "Added to sock yarn for durability. Very strong, adds structure and memory." },
];

// ── COMPONENT ─────────────────────────────────────────────────────

type Tab = "chart" | "substitution" | "fibers";

export default function YarnWeightChartTool() {
  const [tab, setTab] = useState<Tab>("chart");
  const [search, setSearch] = useState("");
  const [highlightWeight, setHighlightWeight] = useState<string | null>(null);

  // Substitution checker
  const [yarn1Weight, setYarn1Weight] = useState("");
  const [yarn1Ypg, setYarn1Ypg] = useState("");
  const [yarn2Weight, setYarn2Weight] = useState("");
  const [yarn2Ypg, setYarn2Ypg] = useState("");

  // Chart filtering
  const filteredWeights = useMemo(() => filterYarnWeights(search), [search]);

  // Substitution result
  const subResult = useMemo(
    () => compareYarnLabels(yarn1Weight, yarn2Weight, yarn1Ypg, yarn2Ypg),
    [yarn1Weight, yarn2Weight, yarn1Ypg, yarn2Ypg],
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap">
        {([
          ["chart", "⚖️ Weight Chart"],
          ["substitution", "🔄 Substitution Checker"],
          ["fibers", "🧬 Fiber Guide"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              tab === key
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── WEIGHT CHART ────────────────────────────────────────── */}
      {tab === "chart" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              aria-label="Search yarn weights"
              placeholder='Search: "DK", "8 ply", "worsted"…'
              className="input pl-10"
            />
          </div>

          <p className="text-sm text-bark-400 dark:text-bark-500">
            Select a category number for notes. Regional names are approximate; use the yarn label and a swatch to check a substitution.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0" tabIndex={0} role="region" aria-label="Yarn weight reference table">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full text-sm">
                <caption className="text-left text-sm text-bark-600 dark:text-cream-300 pb-3">
                  CYC knitting gauge guidelines: stockinette stitches per 4 inches. These are not crochet gauge ranges. Follow your pattern, especially for lace and openwork.
                </caption>
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">#</th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">US Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">UK Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">AU Ply</th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">
                      Needles
                      <Tooltip text="Recommended knitting needle sizes." />
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">
                      Hooks
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-bark-700 dark:text-cream-200">
                      Knitting gauge
                      <Tooltip text="Stockinette stitches per 4 inches. Crochet gauges differ; use the CYC reference and your pattern." />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {filteredWeights.map((w) => (
                    <tr
                      key={w.number}
                      className={`transition-colors ${
                        highlightWeight === w.number
                          ? "bg-sage-100 dark:bg-sage-900/20"
                          : "hover:bg-sage-50/50 dark:hover:bg-sage-900/10"
                      }`}
                    >
                      <td className="py-3 px-2 font-bold text-sage-600 dark:text-sage-400">
                        <button
                          type="button"
                          aria-label={`Notes for category ${w.number}, ${w.usName}`}
                          aria-expanded={highlightWeight === w.number}
                          onClick={() => setHighlightWeight((current) => current === w.number ? null : w.number)}
                          className="min-h-11 min-w-11 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
                        >
                          {w.number}
                        </button>
                      </td>
                      <td className="py-3 px-2 font-medium text-bark-800 dark:text-cream-100">{w.usName}</td>
                      <td className="py-3 px-2 text-bark-600 dark:text-cream-300">{w.ukName}</td>
                      <td className="py-3 px-2 text-bark-600 dark:text-cream-300">{w.auPly}</td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400 text-xs">
                        {w.needleMm}
                        <br />US {w.needleUS}
                      </td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400 text-xs">
                        {w.hookMm}
                        <br />US {w.hookUS}
                      </td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400">
                        {w.knitGaugeStPer4in} st
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded detail */}
          {highlightWeight && (() => {
            const w = WEIGHTS.find((x) => x.number === highlightWeight);
            if (!w) return null;
            return (
              <div className="result-card">
                <h3 className="font-semibold text-bark-700 dark:text-cream-200">
                  {w.number}, {w.usName}
                </h3>
                <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
                  Also known as: {w.altNames.join(", ")}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">Names and category numbers do not guarantee matching gauge or fabric. Check the label and make a swatch.</p>
              </div>
            );
          })()}

          <p className="text-sm text-bark-500 dark:text-bark-400">
            Source: <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system" className="underline">Craft Yarn Council yarn weight guidelines</a>.
            {" "}Steel and regular lace hooks use different sizing systems. US hook labels vary by manufacturer; check the metric diameter.
          </p>

          <div className="text-center pt-2">
            <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">
              🖨️ Print chart
            </button>
          </div>
        </div>
      )}

      {/* ─── SUBSTITUTION CHECKER ────────────────────────────────── */}
      {tab === "substitution" && (
        <div className="space-y-6">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Compare two yarn labels as a starting point, not a compatibility verdict. Optional length values must both use yards per gram; do not mix yards and meters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yarn 1 */}
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-3">
              <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🧶 Pattern Yarn</p>
              <div>
                <label htmlFor="pattern-yarn-category" className="label text-xs">Weight category</label>
                <select id="pattern-yarn-category" aria-label="First yarn weight category" value={yarn1Weight} onChange={(e) => setYarn1Weight(e.target.value)} className="select">
                  <option value="">Select…</option>
                  {WEIGHTS.map((w) => (
                    <option key={w.number} value={w.number}>{w.number}, {w.usName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pattern-yarn-yardage" className="label text-xs">
                  Yards per gram (optional)
                  <Tooltip text="Divide the skein's total yardage by its weight in grams. E.g., 220 yds ÷ 100g = 2.2 yd/g" />
                </label>
                <input id="pattern-yarn-yardage" aria-label="First yarn yards per gram" type="number" value={yarn1Ypg} onChange={(e) => setYarn1Ypg(e.target.value)} placeholder="e.g. 2.2" className="input" min="0" step="any" inputMode="decimal" aria-invalid={Boolean(subResult?.yardageError)} aria-describedby={subResult?.yardageError ? "yarn-yardage-error" : undefined} />
              </div>
            </div>

            {/* Yarn 2 */}
            <div className="p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl space-y-3">
              <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">🧶 Substitute Yarn</p>
              <div>
                <label htmlFor="substitute-yarn-category" className="label text-xs">Weight category</label>
                <select id="substitute-yarn-category" aria-label="Second yarn weight category" value={yarn2Weight} onChange={(e) => setYarn2Weight(e.target.value)} className="select">
                  <option value="">Select…</option>
                  {WEIGHTS.map((w) => (
                    <option key={w.number} value={w.number}>{w.number}, {w.usName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="substitute-yarn-yardage" className="label text-xs">Yards per gram (optional)</label>
                <input id="substitute-yarn-yardage" aria-label="Second yarn yards per gram" type="number" value={yarn2Ypg} onChange={(e) => setYarn2Ypg(e.target.value)} placeholder="e.g. 2.5" className="input" min="0" step="any" inputMode="decimal" aria-invalid={Boolean(subResult?.yardageError)} aria-describedby={subResult?.yardageError ? "yarn-yardage-error" : undefined} />
              </div>
            </div>
          </div>

          {subResult && (
            <div className="result-card space-y-4" aria-live="polite">
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">{subResult.title}</h3>
              {subResult.yardageError && <p id="yarn-yardage-error" role="alert" className="text-sm text-rose-700 dark:text-rose-400">{subResult.yardageError}</p>}

              <ul className="space-y-1">
                {subResult.notes.map((note, i) => (
                  <li key={i} className="text-sm text-bark-600 dark:text-cream-300">• {note}</li>
                ))}
              </ul>

              <p className="text-xs text-bark-400 dark:text-bark-500">
                Swatch in the pattern&apos;s stitch pattern, wash and dry as directed by the yarn label, then compare stitch and row gauge and the finished fabric. Matching gauge alone does not guarantee the same feel or drape.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── FIBER GUIDE ─────────────────────────────────────────── */}
      {tab === "fibers" && (
        <div className="space-y-4">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            How each fiber behaves, warmth, drape, and care. Hover or tap for details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIBERS.map((f) => (
              <div
                key={f.name}
                className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl border border-cream-200 dark:border-bark-700 hover:border-sage-300 dark:hover:border-sage-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{f.emoji}</span>
                  <h3 className="font-semibold text-bark-700 dark:text-cream-200 text-sm">{f.name}</h3>
                </div>

                {/* Bars */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-14 text-bark-500 dark:text-bark-400">Warmth</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-2 rounded-sm ${
                            i < f.warmth
                              ? "bg-amber-400 dark:bg-amber-500"
                              : "bg-cream-300 dark:bg-bark-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-14 text-bark-500 dark:text-bark-400">Drape</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-2 rounded-sm ${
                            i < f.drape
                              ? "bg-sage-400 dark:bg-sage-500"
                              : "bg-cream-300 dark:bg-bark-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-bark-500 dark:text-bark-400">{f.notes}</p>
                <p className="text-xs text-sage-600 dark:text-sage-400 mt-1 font-medium">{f.care}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          💡 Substitution Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Yards per gram</strong> compares label length and weight, not gauge. Matching values do not prove that yarns are interchangeable.</li>
          <li><strong>Fiber content matters.</strong> Swapping cotton for wool changes drape, stretch, and warmth even at the same weight.</li>
          <li><strong>Always swatch</strong> with your substitute yarn. Even yarns in the same weight category can knit up differently.</li>
          <li><strong>Check the actual yarn label</strong> for fiber content and care instructions before buying or substituting.</li>
        </ul>
        <p className="text-sm text-bark-500 dark:text-bark-400 mt-3">
          The <a href="https://www.craftyarncouncil.com/standards/faqs" className="underline">CYC substitution guidance</a> requires swatching, even within one category.
        </p>
      </div>
    </div>
  );
}
