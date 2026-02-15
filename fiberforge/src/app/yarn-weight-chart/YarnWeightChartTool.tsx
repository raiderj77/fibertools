"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

// ── DATA ──────────────────────────────────────────────────────────

interface YarnWeight {
  number: string;
  usName: string;
  ukName: string;
  auPly: string;
  altNames: string[];
  ydsPerGram: [number, number]; // range
  needleMm: [number, number];
  needleUS: string;
  hookMm: [number, number];
  hookUS: string;
  gaugeStPer4in: [number, number];
}

const WEIGHTS: YarnWeight[] = [
  {
    number: "0",
    usName: "Lace",
    ukName: "Lace / Cobweb",
    auPly: "1–2 ply",
    altNames: ["thread", "cobweb", "light fingering"],
    ydsPerGram: [5.0, 8.0],
    needleMm: [1.5, 2.25],
    needleUS: "000–1",
    hookMm: [1.5, 2.25],
    hookUS: "6 steel–B",
    gaugeStPer4in: [32, 40],
  },
  {
    number: "1",
    usName: "Fingering / Sock",
    ukName: "4-ply",
    auPly: "3–4 ply",
    altNames: ["sock", "baby", "fingering"],
    ydsPerGram: [3.5, 5.5],
    needleMm: [2.25, 3.25],
    needleUS: "1–3",
    hookMm: [2.25, 3.5],
    hookUS: "B–E",
    gaugeStPer4in: [27, 32],
  },
  {
    number: "2",
    usName: "Sport / Baby",
    ukName: "5-ply",
    auPly: "5 ply",
    altNames: ["sport", "baby", "light DK"],
    ydsPerGram: [3.0, 4.5],
    needleMm: [3.25, 3.75],
    needleUS: "3–5",
    hookMm: [3.5, 4.5],
    hookUS: "E–7",
    gaugeStPer4in: [23, 26],
  },
  {
    number: "3",
    usName: "DK / Light Worsted",
    ukName: "DK",
    auPly: "8 ply",
    altNames: ["DK", "double knitting", "light worsted"],
    ydsPerGram: [2.5, 3.8],
    needleMm: [3.75, 4.5],
    needleUS: "5–7",
    hookMm: [4.5, 5.5],
    hookUS: "7–I",
    gaugeStPer4in: [21, 24],
  },
  {
    number: "4",
    usName: "Worsted / Aran",
    ukName: "Aran",
    auPly: "10 ply",
    altNames: ["worsted", "aran", "afghan", "medium"],
    ydsPerGram: [1.8, 3.0],
    needleMm: [4.5, 5.5],
    needleUS: "7–9",
    hookMm: [5.5, 6.5],
    hookUS: "I–K",
    gaugeStPer4in: [16, 20],
  },
  {
    number: "5",
    usName: "Bulky / Chunky",
    ukName: "Chunky",
    auPly: "12 ply",
    altNames: ["bulky", "chunky", "craft", "rug"],
    ydsPerGram: [1.2, 2.0],
    needleMm: [5.5, 8.0],
    needleUS: "9–11",
    hookMm: [6.5, 9.0],
    hookUS: "K–M/N",
    gaugeStPer4in: [12, 15],
  },
  {
    number: "6",
    usName: "Super Bulky",
    ukName: "Super Chunky",
    auPly: "14+ ply",
    altNames: ["super bulky", "super chunky", "roving"],
    ydsPerGram: [0.7, 1.3],
    needleMm: [8.0, 12.0],
    needleUS: "11–17",
    hookMm: [9.0, 16.0],
    hookUS: "M/N–Q",
    gaugeStPer4in: [7, 11],
  },
  {
    number: "7",
    usName: "Jumbo",
    ukName: "Jumbo",
    auPly: "–",
    altNames: ["jumbo", "roving", "arm knitting"],
    ydsPerGram: [0.3, 0.7],
    needleMm: [12.0, 25.0],
    needleUS: "17–50",
    hookMm: [15.0, 25.0],
    hookUS: "Q–S+",
    gaugeStPer4in: [1, 6],
  },
];

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
  { name: "Alpaca", emoji: "🦙", warmth: 5, drape: 5, care: "Hand wash", notes: "Incredibly soft and warm. Very drapey — size down on needles. No memory (stretches)." },
  { name: "Silk", emoji: "✨", warmth: 2, drape: 5, care: "Hand wash", notes: "Beautiful sheen and drape. Strong but no elasticity. Often blended with wool." },
  { name: "Linen", emoji: "🌾", warmth: 1, drape: 4, care: "Machine wash", notes: "Stiff at first, softens beautifully with washing. Cool for summer. Crisp stitch definition." },
  { name: "Bamboo", emoji: "🎋", warmth: 2, drape: 5, care: "Machine wash gentle", notes: "Silky feel, good drape. Eco-friendly. Similar properties to rayon." },
  { name: "Cashmere", emoji: "🐐", warmth: 5, drape: 4, care: "Hand wash", notes: "Ultra-soft luxury fiber. Lightweight warmth. Delicate — pills with wear." },
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
  const [yarn1Mpg, setYarn1Mpg] = useState(""); // meters per gram (or yds per gram)
  const [yarn2Weight, setYarn2Weight] = useState("");
  const [yarn2Mpg, setYarn2Mpg] = useState("");

  // Chart filtering
  const filteredWeights = useMemo(() => {
    if (!search.trim()) return WEIGHTS;
    const q = search.trim().toLowerCase();
    return WEIGHTS.filter((w) =>
      w.usName.toLowerCase().includes(q) ||
      w.ukName.toLowerCase().includes(q) ||
      w.auPly.toLowerCase().includes(q) ||
      w.altNames.some((n) => n.includes(q)) ||
      w.number === q ||
      `${w.number} ply` === q ||
      `ply ${w.number}` === q
    );
  }, [search]);

  // Substitution result
  const subResult = useMemo(() => {
    if (!yarn1Weight || !yarn2Weight) return null;
    const w1 = WEIGHTS.find((w) => w.number === yarn1Weight);
    const w2 = WEIGHTS.find((w) => w.number === yarn2Weight);
    if (!w1 || !w2) return null;

    const weightDiff = Math.abs(parseInt(w1.number) - parseInt(w2.number));
    let score = 100;
    const notes: string[] = [];

    // Weight category difference
    if (weightDiff === 0) {
      notes.push("Same weight category — great starting point.");
    } else if (weightDiff === 1) {
      score -= 25;
      notes.push("One weight category apart — may work with needle size adjustment.");
    } else {
      score -= weightDiff * 20;
      notes.push(`${weightDiff} weight categories apart — significant gauge difference expected.`);
    }

    // Meters per gram comparison (if provided)
    const mpg1 = parseFloat(yarn1Mpg);
    const mpg2 = parseFloat(yarn2Mpg);
    if (mpg1 > 0 && mpg2 > 0) {
      const ratio = Math.min(mpg1, mpg2) / Math.max(mpg1, mpg2);
      if (ratio >= 0.85) {
        score = Math.max(score, 85);
        notes.push(`Yardage per gram is very close (${Math.round(ratio * 100)}% match) — excellent substitute.`);
      } else if (ratio >= 0.7) {
        score = Math.min(score, 70);
        notes.push(`Yardage differs by ${Math.round((1 - ratio) * 100)}% — swatch carefully.`);
      } else {
        score = Math.min(score, 40);
        notes.push(`Yardage differs significantly (${Math.round((1 - ratio) * 100)}%) — likely needs needle change and will produce different gauge.`);
      }
    }

    score = Math.max(0, Math.min(100, score));

    let rating: string;
    let color: string;
    if (score >= 80) { rating = "Excellent match"; color = "text-sage-600 dark:text-sage-400"; }
    else if (score >= 60) { rating = "Possible with adjustments"; color = "text-amber-600 dark:text-amber-400"; }
    else { rating = "Not recommended"; color = "text-rose-600 dark:text-rose-400"; }

    return { score, rating, color, notes, w1, w2 };
  }, [yarn1Weight, yarn2Weight, yarn1Mpg, yarn2Mpg]);

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
              placeholder='Search: "DK", "8 ply", "worsted"…'
              className="input pl-10"
            />
          </div>

          <p className="text-sm text-bark-400 dark:text-bark-500">
            Tap a row to highlight it. Use the substitution tab to check if two specific yarns are compatible.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full text-sm">
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
                      Gauge
                      <Tooltip text="Typical stitches per 4 inches (10 cm) in stockinette or single crochet." />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {filteredWeights.map((w) => (
                    <tr
                      key={w.number}
                      onClick={() => setHighlightWeight(highlightWeight === w.number ? null : w.number)}
                      className={`cursor-pointer transition-colors ${
                        highlightWeight === w.number
                          ? "bg-sage-100 dark:bg-sage-900/20"
                          : "hover:bg-sage-50/50 dark:hover:bg-sage-900/10"
                      }`}
                    >
                      <td className="py-3 px-2 font-bold text-sage-600 dark:text-sage-400">{w.number}</td>
                      <td className="py-3 px-2 font-medium text-bark-800 dark:text-cream-100">{w.usName}</td>
                      <td className="py-3 px-2 text-bark-600 dark:text-cream-300">{w.ukName}</td>
                      <td className="py-3 px-2 text-bark-600 dark:text-cream-300">{w.auPly}</td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400 text-xs">
                        {w.needleMm[0]}–{w.needleMm[1]}mm
                        <br />US {w.needleUS}
                      </td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400 text-xs">
                        {w.hookMm[0]}–{w.hookMm[1]}mm
                        <br />US {w.hookUS}
                      </td>
                      <td className="py-3 px-2 text-bark-500 dark:text-bark-400">
                        {w.gaugeStPer4in[0]}–{w.gaugeStPer4in[1]} st
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
                  {w.number} — {w.usName}
                </h3>
                <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
                  Also known as: {w.altNames.join(", ")}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  Typical yardage: {w.ydsPerGram[0]}–{w.ydsPerGram[1]} yards per gram
                </p>
              </div>
            );
          })()}

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
            Compare two yarns to see if they&apos;re compatible substitutes. For the best result, check the label for yards (or meters) per gram.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yarn 1 */}
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-3">
              <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">🧶 Pattern Yarn</p>
              <div>
                <label className="label text-xs">Weight category</label>
                <select value={yarn1Weight} onChange={(e) => setYarn1Weight(e.target.value)} className="select">
                  <option value="">Select…</option>
                  {WEIGHTS.map((w) => (
                    <option key={w.number} value={w.number}>{w.number} — {w.usName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">
                  Yards per gram (optional)
                  <Tooltip text="Divide the skein's total yardage by its weight in grams. E.g., 220 yds ÷ 100g = 2.2 yd/g" />
                </label>
                <input type="number" value={yarn1Mpg} onChange={(e) => setYarn1Mpg(e.target.value)} placeholder="e.g. 2.2" className="input" min="0" inputMode="decimal" />
              </div>
            </div>

            {/* Yarn 2 */}
            <div className="p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl space-y-3">
              <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">🧶 Substitute Yarn</p>
              <div>
                <label className="label text-xs">Weight category</label>
                <select value={yarn2Weight} onChange={(e) => setYarn2Weight(e.target.value)} className="select">
                  <option value="">Select…</option>
                  {WEIGHTS.map((w) => (
                    <option key={w.number} value={w.number}>{w.number} — {w.usName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">Yards per gram (optional)</label>
                <input type="number" value={yarn2Mpg} onChange={(e) => setYarn2Mpg(e.target.value)} placeholder="e.g. 2.5" className="input" min="0" inputMode="decimal" />
              </div>
            </div>
          </div>

          {subResult && (
            <div className="result-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${subResult.color}`}>
                    {subResult.rating}
                  </h3>
                  <p className="text-sm text-bark-500 dark:text-bark-400 mt-1">
                    Compatibility: {subResult.score}%
                  </p>
                </div>
                {/* Score bar */}
                <div className="w-20 h-20 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-cream-300 dark:text-bark-600" strokeWidth="3" />
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                      className={subResult.score >= 80 ? "text-sage-500" : subResult.score >= 60 ? "text-amber-500" : "text-rose-500"}
                      stroke="currentColor" strokeWidth="3"
                      strokeDasharray={`${subResult.score}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-bark-700 dark:text-cream-200">
                    {subResult.score}
                  </span>
                </div>
              </div>

              <ul className="space-y-1">
                {subResult.notes.map((note, i) => (
                  <li key={i} className="text-sm text-bark-600 dark:text-cream-300">• {note}</li>
                ))}
              </ul>

              <p className="text-xs text-bark-400 dark:text-bark-500">
                Always swatch with your substitute yarn before starting your project.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── FIBER GUIDE ─────────────────────────────────────────── */}
      {tab === "fibers" && (
        <div className="space-y-4">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            How each fiber behaves — warmth, drape, and care. Hover or tap for details.
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
          <li><strong>Yards per gram</strong> is the most reliable way to compare yarns — more accurate than weight category alone.</li>
          <li><strong>Fiber content matters.</strong> Swapping cotton for wool changes drape, stretch, and warmth even at the same weight.</li>
          <li><strong>Always swatch</strong> with your substitute yarn. Even yarns in the same weight category can knit up differently.</li>
          <li>The <strong>same yarn in different colors</strong> can have slightly different gauges — dark dyes especially.</li>
        </ul>
      </div>
    </div>
  );
}
