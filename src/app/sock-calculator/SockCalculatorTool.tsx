"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

// ── TYPES ─────────────────────────────────────────────────────────

type Tab = "top-down" | "toe-up";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function SockCalculatorTool() {
  const [tab, setTab] = useState<Tab>("top-down");

  // Common inputs
  const [footCirc, setFootCirc] = useState("");
  const [footLength, setFootLength] = useState("");
  const [gaugeSts, setGaugeSts] = useState("");
  const [rowGauge, setRowGauge] = useState("");

  // ── TOP-DOWN RESULTS ──────────────────────────────────────────────
  const topDownResult = useMemo(() => {
    const circ = parseFloat(footCirc) || 0;
    const length = parseFloat(footLength) || 0;
    const gSt = parseFloat(gaugeSts) || 0;
    const rGauge = parseFloat(rowGauge) || 0;
    if (circ <= 0 || length <= 0 || gSt <= 0 || rGauge <= 0) return null;

    const targetCirc = circ * 0.9;
    const stsPerInch = gSt / 4;
    let castOn = Math.round(targetCirc * stsPerInch);
    castOn = Math.round(castOn / 4) * 4;
    const heelStitches = castOn / 2;
    const heelFlapRows = heelStitches;
    const gussetPickup = Math.floor(heelFlapRows / 2);
    const footRows = Math.round((length - 2) * (rGauge / 4));

    return {
      castOn,
      heelStitches,
      heelFlapRows,
      gussetPickup,
      footRows,
      targetCirc: +targetCirc.toFixed(1),
    };
  }, [footCirc, footLength, gaugeSts, rowGauge]);

  // ── TOE-UP RESULTS ────────────────────────────────────────────────
  const toeUpResult = useMemo(() => {
    const circ = parseFloat(footCirc) || 0;
    const length = parseFloat(footLength) || 0;
    const gSt = parseFloat(gaugeSts) || 0;
    const rGauge = parseFloat(rowGauge) || 0;
    if (circ <= 0 || length <= 0 || gSt <= 0 || rGauge <= 0) return null;

    const targetCirc = circ * 0.9;
    const stsPerInch = gSt / 4;
    let totalSts = Math.round(targetCirc * stsPerInch);
    totalSts = Math.round(totalSts / 4) * 4;

    let toeStartPerNeedle = Math.max(8, Math.round(totalSts * 0.15));
    toeStartPerNeedle = Math.round(toeStartPerNeedle / 2) * 2;

    const toeIncreaseRounds = (totalSts - toeStartPerNeedle * 2) / 4;
    const heelStitches = totalSts / 2;
    const heelCenterSts = Math.round(heelStitches / 3);
    const shortRowsEachSide = Math.floor((heelStitches - heelCenterSts) / 2);

    const rowsPerInch = rGauge / 4;
    const heelDepth = heelStitches / rowsPerInch / 2;
    const footRows = Math.round((length - heelDepth) * rowsPerInch);

    return {
      totalSts,
      toeStartPerNeedle,
      toeIncreaseRounds: Math.round(toeIncreaseRounds),
      footRows,
      heelStitches,
      heelCenterSts,
      shortRowsEachSide,
      heelDepth: +heelDepth.toFixed(1),
      targetCirc: +targetCirc.toFixed(1),
    };
  }, [footCirc, footLength, gaugeSts, rowGauge]);

  // ── STICKY SUMMARY ────────────────────────────────────────────────
  const stickySummary = (() => {
    if (tab === "top-down" && topDownResult) {
      return `Cast on ${topDownResult.castOn} sts \u2022 ${topDownResult.heelStitches} heel sts`;
    }
    if (tab === "toe-up" && toeUpResult) {
      return `${toeUpResult.totalSts} total sts \u2022 ${toeUpResult.toeStartPerNeedle} sts/needle start`;
    }
    return "";
  })();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:inline-flex items-stretch sm:items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 gap-1">
        {([
          ["top-down", "Top-Down (Cuff Down)"],
          ["toe-up", "Toe-Up"],
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

      {/* Common inputs */}
      <div className="space-y-6">
        <p className="text-sm text-bark-400 dark:text-bark-500">
          {tab === "top-down"
            ? "Calculate cast-on count, heel flap, gusset pickup, and foot length for top-down socks."
            : "Calculate toe cast-on, increase rounds, foot length, and short-row heel for toe-up socks."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label">
              Foot circumference (in)
              <Tooltip text="Measure around the ball of the foot. The calculator applies 10% negative ease for a snug fit." />
            </label>
            <input
              type="number"
              value={footCirc}
              onChange={(e) => setFootCirc(e.target.value)}
              placeholder="8"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label">
              Foot length (in)
              <Tooltip text="Measure from back of heel to tip of longest toe." />
            </label>
            <input
              type="number"
              value={footLength}
              onChange={(e) => setFootLength(e.target.value)}
              placeholder="9.5"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label">
              Gauge stitches per 4&quot;
              <Tooltip text="Stitch gauge from your sock yarn swatch over 4 inches." />
            </label>
            <input
              type="number"
              value={gaugeSts}
              onChange={(e) => setGaugeSts(e.target.value)}
              placeholder="32"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label">
              Row gauge per 4&quot;
              <Tooltip text="Row gauge from your swatch over 4 inches." />
            </label>
            <input
              type="number"
              value={rowGauge}
              onChange={(e) => setRowGauge(e.target.value)}
              placeholder="44"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* ─── TOP-DOWN RESULTS ─────────────────────────────────────── */}
        {tab === "top-down" && (
          <StickyResult summary={stickySummary} visible={!!topDownResult}>
            {topDownResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Top-Down Sock Instructions
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {topDownResult.castOn}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      cast on stitches
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      Target circumference: {topDownResult.targetCirc}&quot;
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {topDownResult.heelStitches}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      heel stitches
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {topDownResult.heelFlapRows}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      heel flap rows
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      Square heel flap
                    </p>
                  </div>
                </div>

                <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
                        Gusset Pickup
                      </p>
                      <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                        {topDownResult.gussetPickup}
                      </p>
                      <p className="text-xs text-bark-400 dark:text-bark-500">
                        stitches each side
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
                        Foot Length
                      </p>
                      <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                        {topDownResult.footRows}
                      </p>
                      <p className="text-xs text-bark-400 dark:text-bark-500">
                        rows before toe shaping
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
                    <p className="text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                      Toe Shaping
                    </p>
                    <p className="text-sm text-bark-600 dark:text-cream-300">
                      Decrease 4 stitches every other round until approximately 20&ndash;25% of stitches remain, then graft closed with Kitchener stitch.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-bark-400 dark:text-bark-500 italic">
                  Always swatch to confirm gauge before starting your socks.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Top-Down Sock: Cast on ${topDownResult.castOn}, Heel: ${topDownResult.heelStitches} sts / ${topDownResult.heelFlapRows} rows, Gusset pickup: ${topDownResult.gussetPickup} each side, Foot: ${topDownResult.footRows} rows`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="btn-secondary text-sm"
                  aria-label="Copy results to clipboard"
                >
                  Copy results
                </button>
              </div>
            )}
          </StickyResult>
        )}

        {/* ─── TOE-UP RESULTS ──────────────────────────────────────── */}
        {tab === "toe-up" && (
          <StickyResult summary={stickySummary} visible={!!toeUpResult}>
            {toeUpResult && (
              <div className="result-card space-y-4">
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                  Toe-Up Sock Instructions
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {toeUpResult.toeStartPerNeedle}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      toe cast on per needle
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      {toeUpResult.toeStartPerNeedle * 2} total starting stitches
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {toeUpResult.toeIncreaseRounds}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      toe increase rounds
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      4 increases per round
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                      {toeUpResult.totalSts}
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">
                      total stitches
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
                      Target circumference: {toeUpResult.targetCirc}&quot;
                    </p>
                  </div>
                </div>

                <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
                      Foot Length
                    </p>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {toeUpResult.footRows}
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500">
                      rows before heel (accounts for {toeUpResult.heelDepth}&quot; heel depth)
                    </p>
                  </div>

                  <div className="p-3 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
                    <p className="text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                      Short-Row Heel
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div>
                        <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
                          {toeUpResult.heelStitches}
                        </p>
                        <p className="text-xs text-bark-500 dark:text-bark-400">
                          heel stitches
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
                          {toeUpResult.heelCenterSts}
                        </p>
                        <p className="text-xs text-bark-500 dark:text-bark-400">
                          center stitches
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
                          {toeUpResult.shortRowsEachSide}
                        </p>
                        <p className="text-xs text-bark-500 dark:text-bark-400">
                          short rows each side
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-bark-600 dark:text-cream-300 mt-2">
                      Work short rows on the {toeUpResult.heelStitches} heel stitches, leaving {toeUpResult.shortRowsEachSide} unworked on each side, then pick up wraps on the return rows.
                    </p>
                  </div>

                  <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                    <p className="text-sm font-medium text-bark-700 dark:text-cream-200 mb-1">
                      Leg &amp; Cuff
                    </p>
                    <p className="text-sm text-bark-600 dark:text-cream-300">
                      After the heel, continue in pattern on all {toeUpResult.totalSts} stitches for desired leg length. Finish with 1&ndash;2&quot; of ribbing (K2P2 or K1P1) and bind off loosely.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-bark-400 dark:text-bark-500 italic">
                  Always swatch to confirm gauge before starting your socks.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Toe-Up Sock: ${toeUpResult.toeStartPerNeedle} sts/needle start, ${toeUpResult.toeIncreaseRounds} inc rounds to ${toeUpResult.totalSts} sts, Foot: ${toeUpResult.footRows} rows, Heel: ${toeUpResult.heelCenterSts} center / ${toeUpResult.shortRowsEachSide} short rows each side`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="btn-secondary text-sm"
                  aria-label="Copy results to clipboard"
                >
                  Copy results
                </button>
              </div>
            )}
          </StickyResult>
        )}
      </div>

      {/* Quick reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Common Foot Sizes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-bark-600 dark:text-cream-300">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="text-left py-2 pr-4 font-medium text-bark-700 dark:text-cream-200">Size</th>
                <th className="text-left py-2 pr-4 font-medium text-bark-700 dark:text-cream-200">Circumference</th>
                <th className="text-left py-2 font-medium text-bark-700 dark:text-cream-200">Foot Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
              <tr><td className="py-1.5 pr-4">Child (3&ndash;5)</td><td className="py-1.5 pr-4">5.5&ndash;6&quot;</td><td className="py-1.5">6&ndash;7&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Child (6&ndash;10)</td><td className="py-1.5 pr-4">6&ndash;7&quot;</td><td className="py-1.5">7&ndash;8&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Women S (5&ndash;7)</td><td className="py-1.5 pr-4">7.5&ndash;8&quot;</td><td className="py-1.5">9&ndash;9.5&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Women M (7.5&ndash;9)</td><td className="py-1.5 pr-4">8&ndash;8.5&quot;</td><td className="py-1.5">9.5&ndash;10&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Women L (9.5&ndash;11)</td><td className="py-1.5 pr-4">8.5&ndash;9.5&quot;</td><td className="py-1.5">10&ndash;10.75&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Men S (7&ndash;9)</td><td className="py-1.5 pr-4">9&ndash;9.5&quot;</td><td className="py-1.5">10&ndash;10.5&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Men M (9.5&ndash;11)</td><td className="py-1.5 pr-4">9.5&ndash;10.5&quot;</td><td className="py-1.5">10.5&ndash;11.25&quot;</td></tr>
              <tr><td className="py-1.5 pr-4">Men L (11.5&ndash;13)</td><td className="py-1.5 pr-4">10.5&ndash;11.5&quot;</td><td className="py-1.5">11.25&ndash;12&quot;</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Sock Knitting Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>10% negative ease</strong> is standard for socks so they fit snugly without sagging.</li>
          <li><strong>Cast on must be divisible by 4</strong> for even distribution across double-pointed needles or magic loop halves.</li>
          <li><strong>Heel flap stitch:</strong> Alternating slip-stitch and knit rows creates a reinforced, stretchy heel.</li>
          <li><strong>Sock yarn:</strong> Look for yarn with nylon content (10&ndash;25%) for durability in high-wear areas.</li>
        </ul>
      </div>
    </div>
  );
}
