"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

// ── DATA ──────────────────────────────────────────────────────────

interface NeedleSize {
  mm: number;
  us: string;
  ukOld: string;
  japanese: string;
  yarnWeight: string;
}

interface HookSize {
  mm: number;
  usLetter: string;
  usNumber: string;
  ukCanadian: string;
  yarnWeight: string;
}

// Exact Japanese diameters: https://www.clover.co.jp/recipe/takumikikakus.pdf
const needleSizes: NeedleSize[] = [
  {"mm": 2, "us": "0", "ukOld": "14", "japanese": "–", "yarnWeight": "Lace"},
  {"mm": 2.1, "us": "–", "ukOld": "–", "japanese": "0", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 2.25, "us": "1", "ukOld": "13", "japanese": "–", "yarnWeight": "Lace / Fingering"},
  {"mm": 2.4, "us": "–", "ukOld": "–", "japanese": "1", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 2.5, "us": "1.5", "ukOld": "–", "japanese": "–", "yarnWeight": "Fingering"},
  {"mm": 2.7, "us": "–", "ukOld": "–", "japanese": "2", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 2.75, "us": "2", "ukOld": "12", "japanese": "–", "yarnWeight": "Fingering"},
  {"mm": 3, "us": "2.5", "ukOld": "11", "japanese": "3", "yarnWeight": "Fingering / Sport"},
  {"mm": 3.25, "us": "3", "ukOld": "10", "japanese": "–", "yarnWeight": "Sport / DK"},
  {"mm": 3.3, "us": "–", "ukOld": "–", "japanese": "4", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 3.5, "us": "4", "ukOld": "–", "japanese": "–", "yarnWeight": "DK"},
  {"mm": 3.6, "us": "–", "ukOld": "–", "japanese": "5", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 3.75, "us": "5", "ukOld": "9", "japanese": "–", "yarnWeight": "DK"},
  {"mm": 3.9, "us": "–", "ukOld": "–", "japanese": "6", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 4, "us": "6", "ukOld": "8", "japanese": "–", "yarnWeight": "DK / Worsted"},
  {"mm": 4.2, "us": "–", "ukOld": "–", "japanese": "7", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 4.5, "us": "7", "ukOld": "7", "japanese": "8", "yarnWeight": "Worsted"},
  {"mm": 4.8, "us": "–", "ukOld": "–", "japanese": "9", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 5, "us": "8", "ukOld": "6", "japanese": "–", "yarnWeight": "Worsted / Aran"},
  {"mm": 5.1, "us": "–", "ukOld": "–", "japanese": "10", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 5.4, "us": "–", "ukOld": "–", "japanese": "11", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 5.5, "us": "9", "ukOld": "5", "japanese": "–", "yarnWeight": "Aran"},
  {"mm": 5.7, "us": "–", "ukOld": "–", "japanese": "12", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 6, "us": "10", "ukOld": "4", "japanese": "13", "yarnWeight": "Aran / Bulky"},
  {"mm": 6.3, "us": "–", "ukOld": "–", "japanese": "14", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 6.5, "us": "10.5", "ukOld": "3", "japanese": "–", "yarnWeight": "Bulky"},
  {"mm": 6.6, "us": "–", "ukOld": "–", "japanese": "15", "yarnWeight": "Check yarn label and swatch"},
  {"mm": 7, "us": "–", "ukOld": "2", "japanese": "–", "yarnWeight": "Bulky"},
  {"mm": 7.5, "us": "–", "ukOld": "1", "japanese": "–", "yarnWeight": "Bulky"},
  {"mm": 8, "us": "11", "ukOld": "0", "japanese": "–", "yarnWeight": "Bulky / Super Bulky"},
  {"mm": 9, "us": "13", "ukOld": "–", "japanese": "–", "yarnWeight": "Super Bulky"},
  {"mm": 10, "us": "15", "ukOld": "–", "japanese": "–", "yarnWeight": "Super Bulky"},
  {"mm": 12.75, "us": "17", "ukOld": "–", "japanese": "–", "yarnWeight": "Jumbo"},
  {"mm": 15, "us": "19", "ukOld": "–", "japanese": "–", "yarnWeight": "Jumbo"},
  {"mm": 19, "us": "35", "ukOld": "–", "japanese": "–", "yarnWeight": "Jumbo"},
  {"mm": 25, "us": "50", "ukOld": "–", "japanese": "–", "yarnWeight": "Jumbo"},
];

// US hook labels: https://media.craftyarncouncil.com/standards/hooks-and-needles
const hookSizes: HookSize[] = [
  {"mm": 2, "usLetter": "–", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Lace / Thread"},
  {"mm": 2.25, "usLetter": "B", "usNumber": "1", "ukCanadian": "–", "yarnWeight": "Lace / Fingering"},
  {"mm": 2.5, "usLetter": "–", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Fingering"},
  {"mm": 2.75, "usLetter": "C", "usNumber": "2", "ukCanadian": "–", "yarnWeight": "Fingering"},
  {"mm": 3, "usLetter": "–", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Fingering / Sport"},
  {"mm": 3.25, "usLetter": "D", "usNumber": "3", "ukCanadian": "–", "yarnWeight": "Sport"},
  {"mm": 3.5, "usLetter": "E", "usNumber": "4", "ukCanadian": "–", "yarnWeight": "Sport / DK"},
  {"mm": 3.75, "usLetter": "F", "usNumber": "5", "ukCanadian": "–", "yarnWeight": "DK"},
  {"mm": 4, "usLetter": "G", "usNumber": "6", "ukCanadian": "–", "yarnWeight": "DK / Worsted"},
  {"mm": 4.5, "usLetter": "–", "usNumber": "7", "ukCanadian": "–", "yarnWeight": "Worsted"},
  {"mm": 5, "usLetter": "H", "usNumber": "8", "ukCanadian": "–", "yarnWeight": "Worsted / Aran"},
  {"mm": 5.5, "usLetter": "I", "usNumber": "9", "ukCanadian": "–", "yarnWeight": "Aran"},
  {"mm": 6, "usLetter": "J", "usNumber": "10", "ukCanadian": "–", "yarnWeight": "Aran / Bulky"},
  {"mm": 6.5, "usLetter": "K", "usNumber": "10.5", "ukCanadian": "–", "yarnWeight": "Bulky"},
  {"mm": 7, "usLetter": "–", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Bulky"},
  {"mm": 8, "usLetter": "L", "usNumber": "11", "ukCanadian": "–", "yarnWeight": "Super Bulky"},
  {"mm": 9, "usLetter": "M/N", "usNumber": "13", "ukCanadian": "–", "yarnWeight": "Super Bulky"},
  {"mm": 10, "usLetter": "N/P", "usNumber": "15", "ukCanadian": "–", "yarnWeight": "Super Bulky"},
  {"mm": 11.5, "usLetter": "P", "usNumber": "16", "ukCanadian": "–", "yarnWeight": "Jumbo"},
  {"mm": 12, "usLetter": "–", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Jumbo"},
  {"mm": 15, "usLetter": "P/Q", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Jumbo"},
  {"mm": 16, "usLetter": "Q", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Jumbo"},
  {"mm": 19, "usLetter": "S", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Jumbo"},
  {"mm": 25, "usLetter": "T/U/X", "usNumber": "–", "ukCanadian": "–", "yarnWeight": "Jumbo"},
];

// ── COMPONENT ─────────────────────────────────────────────────────

type Tab = "needles" | "hooks";

export default function NeedleConverterTool() {
  const [tab, setTab] = useState<Tab>("needles");
  const [search, setSearch] = useState("");

  const filteredNeedles = useMemo(() => {
    if (!search.trim()) return needleSizes;
    const q = search.trim().toLowerCase();
    const metric = q.match(/^(\d+(?:\.\d+)?)\s*mm$/);
    if (metric) return needleSizes.filter((n) => n.mm === Number(metric[1]));
    const jp = q.match(/^(?:jp|japanese)\s*(\d+)$/);
    if (jp) return needleSizes.filter((n) => n.japanese === jp[1]);
    return needleSizes.filter(
      (n) =>
        n.mm.toString().includes(q) ||
        n.us.toLowerCase() === q ||
        `us ${n.us}`.toLowerCase() === q ||
        `us${n.us}`.toLowerCase() === q ||
        n.ukOld === q ||
        n.japanese === q ||
        n.yarnWeight.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredHooks = useMemo(() => {
    if (!search.trim()) return hookSizes;
    const q = search.trim().toLowerCase();
    const metric = q.match(/^(\d+(?:\.\d+)?)\s*mm$/);
    if (metric) return hookSizes.filter((h) => h.mm === Number(metric[1]));
    return hookSizes.filter(
      (h) =>
        h.mm.toString().includes(q) ||
        h.usLetter.toLowerCase() === q ||
        h.usNumber.toLowerCase() === q ||
        `us ${h.usNumber}`.toLowerCase() === q ||
        h.ukCanadian === q ||
        h.yarnWeight.toLowerCase().includes(q)
    );
  }, [search]);

  const data = tab === "needles" ? filteredNeedles : filteredHooks;
  const noResults = data.length === 0;

  return (
    <div className="space-y-6">
      {/* Tab toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
          <button
            type="button"
            onClick={() => { setTab("needles"); setSearch(""); }}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              tab === "needles"
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
            }`}
          >
            🪡 Knitting Needles
          </button>
          <button
            type="button"
            onClick={() => { setTab("hooks"); setSearch(""); }}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              tab === "hooks"
                ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
                : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
            }`}
          >
            🧶 Crochet Hooks
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "needles" ? 'Search: "8", "5mm", "worsted"…' : 'Search: "H", "5mm", "DK"…'}
            className="input pl-10"
            aria-label={tab === "needles" ? "Search needle sizes" : "Search hook sizes"}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-400 hover:text-bark-600 dark:hover:text-cream-300"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tip */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        {tab === "needles"
          ? 'Type any size, metric, US number, UK, or Japanese, to find all equivalents. Try "8" or "5mm".'
          : 'Type a letter, number, or mm size. Try "H", "6mm", or "worsted".'}
      </p>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          {tab === "needles" ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    Metric (mm)
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    US
                    <Tooltip text="Standard US needle sizing used in most American patterns." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    UK (old)
                    <Tooltip text="Old British sizing system. Still found in vintage patterns. Runs opposite to metric, smaller number = bigger needle." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    Japanese
                    <Tooltip text="Japanese sizes with exact metric diameters from Clover. A dash means no exact listed equivalent." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    Yarn Weight
                    <Tooltip text="Approximate. Manufacturers vary, specialty yarns may need a very different size than their weight suggests." />
                    <Tooltip text="Yarn weights are approximate. Manufacturers vary, and some specialty yarns (like eyelash or boucle) may recommend a very different hook/needle size than their weight category suggests." />
                  </th>
                  <th className="text-center py-3 px-3 font-semibold text-bark-700 dark:text-cream-200 hidden sm:table-cell">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                {filteredNeedles.map((n, i) => (
                  <tr
                    key={i}
                    className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-bark-800 dark:text-cream-100">
                      {n.mm} mm
                    </td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">
                      {n.us !== "–" ? `US ${n.us}` : "–"}
                    </td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">{n.ukOld}</td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">
                      {n.japanese !== "–" ? `JP ${n.japanese}` : "–"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300">
                        {n.yarnWeight}
                      </span>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <div
                          className="rounded-full bg-bark-300 dark:bg-bark-500"
                          style={{
                            width: `${Math.max(6, n.mm * 3.5)}px`,
                            height: `${Math.max(6, n.mm * 3.5)}px`,
                          }}
                          title={`${n.mm}mm diameter`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    Metric (mm)
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    US Letter
                    <Tooltip text="Letter labels vary by manufacturer. This reference includes labels such as B and T/U/X; compare the marked metric diameter." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    US Number
                    <Tooltip text="Number-based US sizing. Some hooks use letters, some numbers, some both." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    UK / Canadian (not supplied)
                    <Tooltip text="UK and Canadian hook labels are not supplied because this chart has no verified source for those mappings." />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">
                    Yarn Weight
                    <Tooltip text="Approximate. Manufacturers vary, specialty yarns may need a very different size than their weight suggests." />
                    <Tooltip text="Yarn weights are approximate. Manufacturers vary, and some specialty yarns (like eyelash or boucle) may recommend a very different hook/needle size than their weight category suggests." />
                  </th>
                  <th className="text-center py-3 px-3 font-semibold text-bark-700 dark:text-cream-200 hidden sm:table-cell">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                {filteredHooks.map((h, i) => (
                  <tr
                    key={i}
                    className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-bark-800 dark:text-cream-100">
                      {h.mm} mm
                    </td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">{h.usLetter}</td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">
                      {h.usNumber !== "–" ? `US ${h.usNumber}` : "–"}
                    </td>
                    <td className="py-3 px-3 text-bark-600 dark:text-cream-300">{h.ukCanadian}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        {h.yarnWeight}
                      </span>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <div
                          className="rounded-full bg-bark-300 dark:bg-bark-500"
                          style={{
                            width: `${Math.max(6, h.mm * 3.5)}px`,
                            height: `${Math.max(6, h.mm * 3.5)}px`,
                          }}
                          title={`${h.mm}mm diameter`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {noResults && (
            <div className="text-center py-10">
              <p className="text-bark-400 dark:text-bark-500">
                No {tab === "needles" ? "needle" : "hook"} sizes match
                &ldquo;{search}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-2 text-sage-600 dark:text-sage-400 text-sm font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-bark-500">US sizes: <a className="underline" href="https://media.craftyarncouncil.com/standards/hooks-and-needles">Craft Yarn Council</a>. Old UK needles through 8mm: <a className="underline" href="https://www.knitpro.eu/en/blog/knitting-needle-sizes">KnitPro</a>. Japanese diameters: <a href="https://www.clover.co.jp/recipe/takumikikakus.pdf" className="underline">Clover needle chart</a>. Size labels vary by manufacturer; use the marked millimetres. A dash means no verified exact equivalent in this table. UK/Canadian hook mappings and conflicting large old-UK needle labels are not supplied.</p>
      {/* Quick reference note */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          💡 Quick Reference
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li>
            <strong>Metric (mm)</strong> is the universal standard, when in doubt, go by mm.
          </li>
          <li>
            <strong>UK old sizes</strong> run backwards, UK 14 is 2mm. Conflicting legacy entries are not supplied.
          </li>
          <li>
            <strong>Japanese sizes</strong> start at 0 (2.1mm); size 15 is 6.6mm. Common in Japanese knitting books.
          </li>
          <li>
            Crochet hooks use <strong>both letters and numbers</strong> in the US, patterns may use either.
          </li>
        </ul>
      </div>

      {/* Print-friendly message */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-secondary text-sm"
        >
          🖨️ Print this chart
        </button>
      </div>
    </div>
  );
}
