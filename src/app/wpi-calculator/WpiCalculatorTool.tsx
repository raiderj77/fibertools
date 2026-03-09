"use client";

import { useState, useMemo } from "react";

// ── WPI DATA ──────────────────────────────────────────────────────

interface YarnWeight {
  cyc: number;
  name: string;
  wpiMin: number;
  wpiMax: number;
  needles: string;
  hooks: string;
  gaugeRange: string;
  yardagePer100g: string;
  typicalYardage: string;
  projects: string;
}

const YARN_WEIGHTS: YarnWeight[] = [
  {
    cyc: 0,
    name: "Lace",
    wpiMin: 30,
    wpiMax: Infinity,
    needles: "US 000\u20131",
    hooks: "B/1\u2013E/4",
    gaugeRange: "33\u201340 sts/4\u2033",
    yardagePer100g: "~800 yds",
    typicalYardage: "700\u20131,200+",
    projects: "Shawls, doilies, lightweight wraps",
  },
  {
    cyc: 1,
    name: "Super Fine",
    wpiMin: 14,
    wpiMax: 30,
    needles: "US 1\u20133",
    hooks: "B/1\u2013E/4",
    gaugeRange: "27\u201332 sts/4\u2033",
    yardagePer100g: "~400 yds",
    typicalYardage: "350\u2013500",
    projects: "Socks, baby clothes, lightweight shawls",
  },
  {
    cyc: 2,
    name: "Fine / Sport",
    wpiMin: 12,
    wpiMax: 18,
    needles: "US 3\u20135",
    hooks: "E/4\u20137",
    gaugeRange: "23\u201326 sts/4\u2033",
    yardagePer100g: "~300 yds",
    typicalYardage: "270\u2013350",
    projects: "Baby items, lightweight garments, accessories",
  },
  {
    cyc: 3,
    name: "Light / DK",
    wpiMin: 11,
    wpiMax: 15,
    needles: "US 5\u20137",
    hooks: "7\u2013I/9",
    gaugeRange: "21\u201324 sts/4\u2033",
    yardagePer100g: "~250 yds",
    typicalYardage: "225\u2013280",
    projects: "Garments, baby blankets, accessories",
  },
  {
    cyc: 4,
    name: "Medium / Worsted",
    wpiMin: 9,
    wpiMax: 12,
    needles: "US 7\u20139",
    hooks: "I/9\u2013K/10.5",
    gaugeRange: "16\u201320 sts/4\u2033",
    yardagePer100g: "~200 yds",
    typicalYardage: "180\u2013240",
    projects: "Sweaters, blankets, hats, scarves",
  },
  {
    cyc: 5,
    name: "Bulky",
    wpiMin: 6,
    wpiMax: 9,
    needles: "US 9\u201311",
    hooks: "K/10.5\u2013M/13",
    gaugeRange: "12\u201315 sts/4\u2033",
    yardagePer100g: "~130 yds",
    typicalYardage: "120\u2013160",
    projects: "Hats, scarves, chunky blankets, quick garments",
  },
  {
    cyc: 6,
    name: "Super Bulky",
    wpiMin: 5,
    wpiMax: 6,
    needles: "US 11\u201317",
    hooks: "M/13\u2013Q",
    gaugeRange: "7\u201311 sts/4\u2033",
    yardagePer100g: "~80 yds",
    typicalYardage: "60\u2013120",
    projects: "Chunky hats, arm knitting, quick accessories",
  },
  {
    cyc: 7,
    name: "Jumbo",
    wpiMin: 1,
    wpiMax: 4,
    needles: "US 17+",
    hooks: "Q+",
    gaugeRange: "6 and fewer sts/4\u2033",
    yardagePer100g: "~40 yds",
    typicalYardage: "under 60",
    projects: "Arm knitting, rugs, extreme knitting",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────

export default function WpiCalculatorTool() {
  const [wpi, setWpi] = useState("");

  const results = useMemo(() => {
    const val = parseInt(wpi);
    if (!val || val <= 0) return null;

    const matches = YARN_WEIGHTS.filter(
      (w) => val >= w.wpiMin && val <= w.wpiMax
    );
    if (matches.length === 0) return null;

    return {
      matches,
      isOverlap: matches.length > 1,
    };
  }, [wpi]);

  const stickySummary = results
    ? results.matches.map((m) => m.name).join(" / ")
    : "";

  return (
    <div className="space-y-6">
      {/* Input */}
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Wrap your yarn around a ruler for one inch without stretching or
        overlapping. Count the wraps to find your WPI.
      </p>

      <div className="max-w-xs">
        <label className="label">Wraps Per Inch (WPI)</label>
        <input
          type="number"
          value={wpi}
          onChange={(e) => setWpi(e.target.value)}
          placeholder="e.g. 12"
          className="input"
          min="1"
          max="50"
          inputMode="numeric"
        />
      </div>

      {/* Results */}
      {results && (
        <div aria-live="polite" aria-atomic="true">
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              {results.isOverlap
                ? "Possible Yarn Weights"
                : "Your Yarn Weight"}
            </h3>

            {results.isOverlap && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your WPI falls in an overlap zone — swatch to confirm.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {results.matches.map((match) => (
                <div
                  key={match.cyc}
                  className="p-4 bg-cream-50 dark:bg-bark-800 rounded-xl border border-cream-200 dark:border-bark-600"
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {match.name}
                    </p>
                    <span className="text-sm text-bark-400 dark:text-bark-500">
                      CYC #{match.cyc}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Needles:
                        </strong>{" "}
                        {match.needles}
                      </p>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Hooks:
                        </strong>{" "}
                        {match.hooks}
                      </p>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Gauge:
                        </strong>{" "}
                        {match.gaugeRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Yardage/100g:
                        </strong>{" "}
                        {match.yardagePer100g}
                      </p>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Typical range:
                        </strong>{" "}
                        {match.typicalYardage} yds
                      </p>
                      <p className="text-bark-500 dark:text-bark-400">
                        <strong className="text-bark-700 dark:text-cream-200">
                          Projects:
                        </strong>{" "}
                        {match.projects}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your measurements.
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `WPI: ${wpi} — ${stickySummary}`
                );
              }}
              className="btn-secondary text-sm"
              aria-label="Copy result to clipboard"
            >
              Copy result
            </button>
          </div>
        </div>
      )}

      {/* Full reference table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          WPI Reference Chart
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-3 text-bark-600 dark:text-cream-300 font-medium">
                  Weight
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  CYC
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  WPI
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  Needles
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  Hooks
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  Gauge
                </th>
                <th className="py-2 pl-3 text-bark-600 dark:text-cream-300 font-medium">
                  Yds/100g
                </th>
              </tr>
            </thead>
            <tbody>
              {YARN_WEIGHTS.map((w) => (
                <tr
                  key={w.cyc}
                  className={`border-b border-cream-200 dark:border-bark-700 ${
                    results?.matches.some((m) => m.cyc === w.cyc)
                      ? "bg-sage-50 dark:bg-sage-900/10 font-medium"
                      : ""
                  }`}
                >
                  <td className="py-2 pr-3 text-bark-700 dark:text-cream-200">
                    {w.name}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {w.cyc}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {w.wpiMax === Infinity
                      ? `${w.wpiMin}+`
                      : `${w.wpiMin}\u2013${w.wpiMax}`}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {w.needles}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {w.hooks}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {w.gaugeRange}
                  </td>
                  <td className="py-2 pl-3 text-bark-500 dark:text-bark-400">
                    {w.yardagePer100g}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-bark-400 dark:text-bark-500 mt-3 italic">
          WPI ranges overlap between adjacent weights. Swatching is the most
          reliable way to confirm yarn weight.
        </p>
      </div>

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          How to Measure WPI
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li>
            <strong>Use a ruler or WPI tool.</strong> Wrap yarn snugly around it
            for exactly one inch.
          </li>
          <li>
            <strong>Don&apos;t stretch the yarn.</strong> Let the wraps sit
            naturally side by side without gaps or overlapping.
          </li>
          <li>
            <strong>Measure in multiple spots.</strong> Yarn thickness can vary
            along the skein — average 2\u20133 readings for accuracy.
          </li>
          <li>
            <strong>Plied yarn can be tricky.</strong> Highly textured or
            boucl\u00E9 yarns may not wrap evenly — swatch for the best results.
          </li>
        </ul>
      </div>
    </div>
  );
}
