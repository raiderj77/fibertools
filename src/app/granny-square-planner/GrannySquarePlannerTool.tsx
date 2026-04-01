"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function GrannySquarePlannerTool() {
  const [blanketWidth, setBlanketWidth] = useState("");
  const [blanketHeight, setBlanketHeight] = useState("");
  const [squareSize, setSquareSize] = useState("");
  const [numColors, setNumColors] = useState("1");
  const [yarnPerSquare, setYarnPerSquare] = useState("");

  // ── RESULTS ───────────────────────────────────────────────────────
  const result = useMemo(() => {
    const w = parseFloat(blanketWidth) || 0;
    const h = parseFloat(blanketHeight) || 0;
    const sq = parseFloat(squareSize) || 0;
    if (w <= 0 || h <= 0 || sq <= 0) return null;

    const squaresWide = Math.round(w / sq);
    const squaresTall = Math.round(h / sq);
    const totalSquares = squaresWide * squaresTall;
    const actualWidth = squaresWide * sq;
    const actualHeight = squaresTall * sq;

    const colors = Math.max(1, parseInt(numColors) || 1);
    const yps = parseFloat(yarnPerSquare) || 0;

    let totalYarn = 0;
    let yarnPerColor = 0;
    if (yps > 0) {
      totalYarn = totalSquares * yps * 1.1;
      yarnPerColor = totalYarn / colors;
    }

    // Joining estimate: 1.5x perimeter of one square per square joined, convert inches to yards
    const joiningYards = +(
      (totalSquares * 1.5 * sq * 4) / 36 * 1.1
    ).toFixed(0);

    const grandTotal = yps > 0 ? Math.round(totalYarn + joiningYards) : 0;

    return {
      squaresWide,
      squaresTall,
      totalSquares,
      actualWidth,
      actualHeight,
      totalYarn: Math.round(totalYarn),
      yarnPerColor: Math.round(yarnPerColor),
      joiningYards,
      grandTotal,
      hasYardage: yps > 0,
      colors,
    };
  }, [blanketWidth, blanketHeight, squareSize, numColors, yarnPerSquare]);

  // ── STICKY SUMMARY ────────────────────────────────────────────────
  const stickySummary = (() => {
    if (!result) return "";
    return `${result.squaresWide} \u00D7 ${result.squaresTall} = ${result.totalSquares} squares`;
  })();

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter your desired blanket size and square dimensions. We&apos;ll calculate the grid layout, total squares, and yardage estimates.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Blanket width (inches)</label>
          <input
            type="number"
            value={blanketWidth}
            onChange={(e) => setBlanketWidth(e.target.value)}
            placeholder="50"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label">Blanket height (inches)</label>
          <input
            type="number"
            value={blanketHeight}
            onChange={(e) => setBlanketHeight(e.target.value)}
            placeholder="60"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label">
            Square size (inches)
            <Tooltip text="The finished size of each granny square after blocking. Common sizes: 4&quot;, 6&quot;, 8&quot;, 12&quot;." />
          </label>
          <input
            type="number"
            value={squareSize}
            onChange={(e) => setSquareSize(e.target.value)}
            placeholder="6"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">
            Number of colors
            <Tooltip text="How many yarn colors you plan to use. Yardage will be split evenly across colors." />
          </label>
          <input
            type="number"
            value={numColors}
            onChange={(e) => setNumColors(e.target.value)}
            placeholder="1"
            className="input"
            min="1"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="label">
            Yarn per square (yards, optional)
            <Tooltip text="Yards of yarn used per square. Make one test square and measure the yarn to get this number." />
          </label>
          <input
            type="number"
            value={yarnPerSquare}
            onChange={(e) => setYarnPerSquare(e.target.value)}
            placeholder="e.g. 18"
            className="input"
            min="0"
            inputMode="decimal"
          />
        </div>
      </div>

      {/* Results */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Your Blanket Plan
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.squaresWide} &times; {result.squaresTall}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  grid layout
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.totalSquares}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  total squares
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.actualWidth}&quot; &times; {result.actualHeight}&quot;
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  finished size
                </p>
              </div>
            </div>

            {result.hasYardage && (
              <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-3">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
                  Yardage Estimates
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {result.colors > 1 && (
                    <div>
                      <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                        {result.yarnPerColor}
                      </p>
                      <p className="text-xs text-bark-500 dark:text-bark-400">
                        yards per color ({result.colors} colors)
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {result.totalYarn}
                    </p>
                    <p className="text-xs text-bark-500 dark:text-bark-400">
                      yards for squares (incl. 10% buffer)
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {result.joiningYards}
                    </p>
                    <p className="text-xs text-bark-500 dark:text-bark-400">
                      yards for joining
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
                  <p className="text-sm text-bark-600 dark:text-cream-300">
                    <strong>Total yardage:</strong> {result.grandTotal} yards (squares + joining)
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your square size before committing to a full blanket.
            </p>

            <button
              type="button"
              onClick={() => {
                let text = `Granny Square Blanket: ${result.squaresWide} x ${result.squaresTall} = ${result.totalSquares} squares, Finished size: ${result.actualWidth}" x ${result.actualHeight}"`;
                if (result.hasYardage) {
                  text += `, Total yarn: ${result.grandTotal} yards`;
                }
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

      {/* Common Square Sizes Reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Common Square Sizes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-bark-500 dark:text-bark-400">
          <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
            <p className="font-medium text-bark-700 dark:text-cream-200">4&quot; Mini Squares</p>
            <p>Quick to make, more joining required. Great for scrap yarn projects.</p>
          </div>
          <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
            <p className="font-medium text-bark-700 dark:text-cream-200">6&quot; Classic Granny</p>
            <p>Most popular size. Good balance of detail and manageable joining.</p>
          </div>
          <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
            <p className="font-medium text-bark-700 dark:text-cream-200">8&quot; Large Granny</p>
            <p>Good balance of detail and speed. Fewer squares to join than smaller sizes.</p>
          </div>
          <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
            <p className="font-medium text-bark-700 dark:text-cream-200">12&quot; Afghan Squares</p>
            <p>Fewer squares, less joining. Great for samplers with different stitch patterns.</p>
          </div>
        </div>
      </div>

      {/* Common Blanket Sizes Reference */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Common Blanket Sizes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-bark-600 dark:text-cream-300">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="text-left py-2 pr-4 font-medium text-bark-700 dark:text-cream-200">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-bark-700 dark:text-cream-200">Size</th>
                <th className="text-left py-2 font-medium text-bark-700 dark:text-cream-200">6&quot; Squares</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
              <tr><td className="py-1.5 pr-4">Lovey</td><td className="py-1.5 pr-4">12&quot; &times; 12&quot;</td><td className="py-1.5">2 &times; 2 = 4</td></tr>
              <tr><td className="py-1.5 pr-4">Baby</td><td className="py-1.5 pr-4">30&quot; &times; 36&quot;</td><td className="py-1.5">5 &times; 6 = 30</td></tr>
              <tr><td className="py-1.5 pr-4">Stroller</td><td className="py-1.5 pr-4">36&quot; &times; 48&quot;</td><td className="py-1.5">6 &times; 8 = 48</td></tr>
              <tr><td className="py-1.5 pr-4">Throw</td><td className="py-1.5 pr-4">50&quot; &times; 60&quot;</td><td className="py-1.5">8 &times; 10 = 80</td></tr>
              <tr><td className="py-1.5 pr-4">Twin</td><td className="py-1.5 pr-4">66&quot; &times; 90&quot;</td><td className="py-1.5">11 &times; 15 = 165</td></tr>
              <tr><td className="py-1.5 pr-4">Full/Double</td><td className="py-1.5 pr-4">80&quot; &times; 90&quot;</td><td className="py-1.5">13 &times; 15 = 195</td></tr>
              <tr><td className="py-1.5 pr-4">Queen</td><td className="py-1.5 pr-4">90&quot; &times; 100&quot;</td><td className="py-1.5">15 &times; 17 = 255</td></tr>
              <tr><td className="py-1.5 pr-4">King</td><td className="py-1.5 pr-4">104&quot; &times; 100&quot;</td><td className="py-1.5">17 &times; 17 = 289</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
