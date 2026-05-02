"use client";

import { useState, useMemo } from "react";

// ── CYC YARN WEIGHT DATA ──────────────────────────────────────────

interface YarnWeight {
  cyc: number;
  name: string;
  altName: string;
  wpiMin: number;
  wpiMax: number;
  gaugeMin: number; // stitches per 4 inches
  gaugeMax: number;
  needles: string;
  hooks: string;
  projects: string;
}

const YARN_WEIGHTS: YarnWeight[] = [
  {
    cyc: 0,
    name: "Lace",
    altName: "Lace / Cobweb",
    wpiMin: 30,
    wpiMax: 999,
    gaugeMin: 33,
    gaugeMax: 99,
    needles: "US 000–1 (1.5–2.25 mm)",
    hooks: "B/1–E/4 (2.25–3.5 mm)",
    projects: "Shawls, doilies, lightweight wraps",
  },
  {
    cyc: 1,
    name: "Fingering",
    altName: "Fingering / Sock / Super Fine",
    wpiMin: 14,
    wpiMax: 30,
    gaugeMin: 27,
    gaugeMax: 32,
    needles: "US 1–3 (2.25–3.25 mm)",
    hooks: "B/1–E/4 (2.25–3.5 mm)",
    projects: "Socks, baby garments, lightweight shawls",
  },
  {
    cyc: 2,
    name: "Sport",
    altName: "Sport / Fine",
    wpiMin: 12,
    wpiMax: 18,
    gaugeMin: 23,
    gaugeMax: 26,
    needles: "US 3–5 (3.25–3.75 mm)",
    hooks: "E/4–7 (3.5–4.5 mm)",
    projects: "Baby items, lightweight garments, accessories",
  },
  {
    cyc: 3,
    name: "DK",
    altName: "DK / Light Worsted",
    wpiMin: 11,
    wpiMax: 15,
    gaugeMin: 21,
    gaugeMax: 24,
    needles: "US 5–7 (3.75–4.5 mm)",
    hooks: "7–I/9 (4.5–5.5 mm)",
    projects: "Garments, baby blankets, accessories",
  },
  {
    cyc: 4,
    name: "Worsted",
    altName: "Worsted / Aran / Medium",
    wpiMin: 9,
    wpiMax: 12,
    gaugeMin: 16,
    gaugeMax: 20,
    needles: "US 7–9 (4.5–5.5 mm)",
    hooks: "I/9–K/10.5 (5.5–6.5 mm)",
    projects: "Sweaters, blankets, hats, scarves",
  },
  {
    cyc: 5,
    name: "Bulky",
    altName: "Bulky / Chunky",
    wpiMin: 6,
    wpiMax: 9,
    gaugeMin: 12,
    gaugeMax: 15,
    needles: "US 9–11 (5.5–8 mm)",
    hooks: "K/10.5–M/13 (6.5–9 mm)",
    projects: "Hats, scarves, quick blankets, chunky garments",
  },
  {
    cyc: 6,
    name: "Super Bulky",
    altName: "Super Bulky",
    wpiMin: 5,
    wpiMax: 6,
    gaugeMin: 7,
    gaugeMax: 11,
    needles: "US 11–17 (8–12.75 mm)",
    hooks: "M/13–Q (9–15 mm)",
    projects: "Chunky hats, arm-knitting projects, quick accessories",
  },
  {
    cyc: 7,
    name: "Jumbo",
    altName: "Jumbo / Roving",
    wpiMin: 1,
    wpiMax: 4,
    gaugeMin: 0,
    gaugeMax: 6,
    needles: "US 17+ (12.75 mm+)",
    hooks: "Q+ (15 mm+)",
    projects: "Arm knitting, extreme knitting, rugs",
  },
];

type Mode = "wpi" | "gauge";

export default function YarnWeightCalculatorTool() {
  const [mode, setMode] = useState<Mode>("wpi");
  const [wpiValue, setWpiValue] = useState("");
  const [gaugeValue, setGaugeValue] = useState("");

  const results = useMemo(() => {
    if (mode === "wpi") {
      const val = parseInt(wpiValue);
      if (!val || val <= 0) return null;
      const matches = YARN_WEIGHTS.filter(
        (w) => val >= w.wpiMin && val <= w.wpiMax
      );
      return matches.length ? { matches, isOverlap: matches.length > 1 } : null;
    } else {
      const val = parseInt(gaugeValue);
      if (!val || val <= 0) return null;
      const matches = YARN_WEIGHTS.filter(
        (w) => val >= w.gaugeMin && val <= w.gaugeMax
      );
      return matches.length ? { matches, isOverlap: matches.length > 1 } : null;
    }
  }, [mode, wpiValue, gaugeValue]);

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex gap-2 border-b border-cream-300 dark:border-bark-600">
        {(["wpi", "gauge"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              mode === m
                ? "bg-plum-500 text-white"
                : "text-bark-500 hover:text-plum-500"
            }`}
          >
            {m === "wpi" ? "Wraps Per Inch (WPI)" : "Stitch Gauge"}
          </button>
        ))}
      </div>

      {/* WPI input */}
      {mode === "wpi" && (
        <div className="space-y-3">
          <p className="text-sm text-bark-500 dark:text-bark-400">
            Wrap your yarn snugly around a ruler for one inch without stretching.
            Count the wraps and enter the number below.
          </p>
          <div className="max-w-xs">
            <label className="label" htmlFor="wpi-input">
              Wraps Per Inch (WPI)
            </label>
            <input
              id="wpi-input"
              type="number"
              value={wpiValue}
              onChange={(e) => setWpiValue(e.target.value)}
              placeholder="e.g. 10"
              className="input"
              min="1"
              max="60"
              inputMode="numeric"
            />
          </div>
        </div>
      )}

      {/* Gauge input */}
      {mode === "gauge" && (
        <div className="space-y-3">
          <p className="text-sm text-bark-500 dark:text-bark-400">
            Knit or crochet a 4-inch swatch with your yarn. Count the number of
            stitches across 4 inches and enter the total below.
          </p>
          <div className="max-w-xs">
            <label className="label" htmlFor="gauge-input">
              Stitches per 4 inches
            </label>
            <input
              id="gauge-input"
              type="number"
              value={gaugeValue}
              onChange={(e) => setGaugeValue(e.target.value)}
              placeholder="e.g. 18"
              className="input"
              min="1"
              max="60"
              inputMode="numeric"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div aria-live="polite" aria-atomic="true">
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              {results.isOverlap ? "Possible Yarn Weights" : "Your Yarn Weight"}
            </h3>

            {results.isOverlap && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your measurement falls in an overlap zone between two
                  categories. Swatch with needles for both to confirm.
                </p>
              </div>
            )}

            {results.matches.map((match) => (
              <div
                key={match.cyc}
                className="p-4 bg-cream-50 dark:bg-bark-800 rounded-xl border border-cream-200 dark:border-bark-600"
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                    {match.altName}
                  </p>
                  <span className="text-sm text-bark-400 dark:text-bark-500">
                    CYC #{match.cyc}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-bark-600 dark:text-bark-300">
                    <strong className="text-bark-700 dark:text-cream-200">Needles:</strong>{" "}
                    {match.needles}
                  </p>
                  <p className="text-bark-600 dark:text-bark-300">
                    <strong className="text-bark-700 dark:text-cream-200">Hooks:</strong>{" "}
                    {match.hooks}
                  </p>
                  <p className="text-bark-600 dark:text-bark-300 sm:col-span-2">
                    <strong className="text-bark-700 dark:text-cream-200">Projects:</strong>{" "}
                    {match.projects}
                  </p>
                </div>
              </div>
            ))}

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm weight before starting a project.
            </p>
          </div>
        </div>
      )}

      {/* Quick reference table */}
      <div className="result-card mt-4">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          CYC Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-3 text-bark-600 dark:text-cream-300 font-medium">#</th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Name</th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">WPI</th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Gauge/4″</th>
                <th className="py-2 pl-3 text-bark-600 dark:text-cream-300 font-medium">Needles (US)</th>
              </tr>
            </thead>
            <tbody>
              {YARN_WEIGHTS.map((w) => (
                <tr
                  key={w.cyc}
                  className={`border-b border-cream-200 dark:border-bark-700 ${
                    results?.matches.some((m) => m.cyc === w.cyc)
                      ? "bg-sage-50 dark:bg-sage-900/10 font-semibold"
                      : ""
                  }`}
                >
                  <td className="py-1.5 pr-3 text-bark-500">{w.cyc}</td>
                  <td className="py-1.5 px-3 text-bark-700 dark:text-cream-200">{w.name}</td>
                  <td className="py-1.5 px-3 text-bark-500">
                    {w.wpiMax === 999 ? `${w.wpiMin}+` : `${w.wpiMin}–${w.wpiMax}`}
                  </td>
                  <td className="py-1.5 px-3 text-bark-500">
                    {w.gaugeMin === 0 ? `≤${w.gaugeMax}` : `${w.gaugeMin}–${w.gaugeMax}`}
                  </td>
                  <td className="py-1.5 pl-3 text-bark-500">{w.needles.split(" (")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
