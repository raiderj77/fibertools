"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

// ── COMMON BLANKET SIZES ──────────────────────────────────────────

const BLANKET_SIZES = [
  { name: "Baby", width: 30, height: 36 },
  { name: "Throw", width: 50, height: 60 },
  { name: "Twin", width: 66, height: 90 },
  { name: "Full", width: 80, height: 90 },
  { name: "Queen", width: 90, height: 100 },
];

// ── COMPONENT ─────────────────────────────────────────────────────

export default function C2cCalculatorTool() {
  const [swatchBlocksWide, setSwatchBlocksWide] = useState("");
  const [swatchBlocksTall, setSwatchBlocksTall] = useState("");
  const [swatchWidth, setSwatchWidth] = useState("");
  const [swatchHeight, setSwatchHeight] = useState("");
  const [desiredWidth, setDesiredWidth] = useState("");
  const [desiredHeight, setDesiredHeight] = useState("");
  const [yarnPerBlock, setYarnPerBlock] = useState("");

  const result = useMemo(() => {
    const sbw = parseFloat(swatchBlocksWide) || 0;
    const sbt = parseFloat(swatchBlocksTall) || 0;
    const sw = parseFloat(swatchWidth) || 0;
    const sh = parseFloat(swatchHeight) || 0;
    const dw = parseFloat(desiredWidth) || 0;
    const dh = parseFloat(desiredHeight) || 0;

    if (sbw <= 0 || sbt <= 0 || sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0)
      return null;

    const blockWidth = sw / sbw;
    const blockHeight = sh / sbt;
    const blocksWide = Math.round(dw / blockWidth);
    const blocksTall = Math.round(dh / blockHeight);
    const totalBlocks = blocksWide * blocksTall;
    const totalDiagonalRows = blocksWide + blocksTall - 1;
    const actualWidth = +(blocksWide * blockWidth).toFixed(1);
    const actualHeight = +(blocksTall * blockHeight).toFixed(1);

    const ypb = parseFloat(yarnPerBlock) || 0;
    let totalYards: number | null = null;
    if (ypb > 0) {
      totalYards = Math.ceil((totalBlocks * ypb) / 36 * 1.1);
    }

    return {
      blockWidth: +blockWidth.toFixed(2),
      blockHeight: +blockHeight.toFixed(2),
      blocksWide,
      blocksTall,
      totalBlocks,
      totalDiagonalRows,
      actualWidth,
      actualHeight,
      totalYards,
    };
  }, [
    swatchBlocksWide,
    swatchBlocksTall,
    swatchWidth,
    swatchHeight,
    desiredWidth,
    desiredHeight,
    yarnPerBlock,
  ]);

  const applyPreset = (width: number, height: number) => {
    setDesiredWidth(String(width));
    setDesiredHeight(String(height));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Measure a C2C gauge swatch in blocks, then enter your desired blanket
        size. We&apos;ll calculate block counts, diagonal rows, and yardage.
      </p>

      {/* Swatch inputs */}
      <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
        <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">
          Gauge Swatch
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="label text-xs">
              Blocks wide
              <Tooltip text="How many C2C blocks across your swatch." />
            </label>
            <input
              type="number"
              value={swatchBlocksWide}
              onChange={(e) => setSwatchBlocksWide(e.target.value)}
              placeholder="e.g. 5"
              className="input"
              min="1"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="label text-xs">
              Blocks tall
              <Tooltip text="How many C2C blocks down your swatch." />
            </label>
            <input
              type="number"
              value={swatchBlocksTall}
              onChange={(e) => setSwatchBlocksTall(e.target.value)}
              placeholder="e.g. 5"
              className="input"
              min="1"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="label text-xs">Swatch width (in)</label>
            <input
              type="number"
              value={swatchWidth}
              onChange={(e) => setSwatchWidth(e.target.value)}
              placeholder="e.g. 4"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label text-xs">Swatch height (in)</label>
            <input
              type="number"
              value={swatchHeight}
              onChange={(e) => setSwatchHeight(e.target.value)}
              placeholder="e.g. 4"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Blanket size inputs */}
      <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
        <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">
          Desired Blanket Size
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="label text-xs">Width (in)</label>
            <input
              type="number"
              value={desiredWidth}
              onChange={(e) => setDesiredWidth(e.target.value)}
              placeholder="e.g. 50"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label text-xs">Height (in)</label>
            <input
              type="number"
              value={desiredHeight}
              onChange={(e) => setDesiredHeight(e.target.value)}
              placeholder="e.g. 60"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="label text-xs">
              Yarn per block (in) — optional
              <Tooltip text="Measure how many inches of yarn one C2C block uses. Unravel a block and measure the strand." />
            </label>
            <input
              type="number"
              value={yarnPerBlock}
              onChange={(e) => setYarnPerBlock(e.target.value)}
              placeholder="e.g. 24"
              className="input"
              min="0"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* Quick-fill presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {BLANKET_SIZES.map((size) => (
            <button
              key={size.name}
              type="button"
              onClick={() => applyPreset(size.width, size.height)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-600 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-bark-600 transition-colors"
            >
              {size.name} ({size.width}&times;{size.height})
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div aria-live="polite" aria-atomic="true">
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Your C2C Blanket
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.totalBlocks.toLocaleString()}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  total blocks
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.blocksWide} &times; {result.blocksTall}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  blocks wide &times; tall
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.totalDiagonalRows}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">
                  diagonal rows
                </p>
              </div>
            </div>

            <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-2">
              <p className="text-sm text-bark-600 dark:text-cream-300">
                <strong>Actual dimensions:</strong> {result.actualWidth}&Prime;
                &times; {result.actualHeight}&Prime;
              </p>
              <p className="text-sm text-bark-600 dark:text-cream-300">
                <strong>Block size:</strong> {result.blockWidth}&Prime; wide
                &times; {result.blockHeight}&Prime; tall
              </p>
              {result.totalYards !== null && (
                <p className="text-sm text-bark-600 dark:text-cream-300">
                  <strong>Estimated yardage:</strong>{" "}
                  {result.totalYards.toLocaleString()} yards
                  <span className="text-xs text-bark-400 dark:text-bark-500 ml-1">
                    (includes 10% buffer)
                  </span>
                </p>
              )}
            </div>

            {result.totalYards !== null && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Yardage is an estimate based on your yarn-per-block
                  measurement. Actual usage may vary with tension and color
                  changes.
                </p>
              </div>
            )}

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm your measurements.
            </p>

            <button
              type="button"
              onClick={() => {
                const text = `C2C Blanket: ${result.blocksWide} \u00D7 ${result.blocksTall} blocks (${result.totalBlocks} total), ${result.totalDiagonalRows} diagonal rows, ${result.actualWidth}\u2033 \u00D7 ${result.actualHeight}\u2033${result.totalYards !== null ? `, ~${result.totalYards} yards` : ""}`;
                navigator.clipboard.writeText(text);
              }}
              className="btn-secondary text-sm"
              aria-label="Copy result to clipboard"
            >
              Copy result
            </button>
          </div>
        </div>
      )}

      {/* Common blanket sizes reference */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Common Blanket Sizes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-3 text-bark-600 dark:text-cream-300 font-medium">
                  Size
                </th>
                <th className="py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">
                  Dimensions
                </th>
                <th className="py-2 pl-3 text-bark-600 dark:text-cream-300 font-medium">
                  Use
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Baby", dims: "30\u2033 \u00D7 36\u2033", use: "Stroller, crib" },
                { name: "Throw", dims: "50\u2033 \u00D7 60\u2033", use: "Sofa, lap blanket" },
                { name: "Twin", dims: "66\u2033 \u00D7 90\u2033", use: "Twin bed" },
                { name: "Full", dims: "80\u2033 \u00D7 90\u2033", use: "Full / double bed" },
                { name: "Queen", dims: "90\u2033 \u00D7 100\u2033", use: "Queen bed" },
              ].map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-cream-200 dark:border-bark-700"
                >
                  <td className="py-2 pr-3 text-bark-700 dark:text-cream-200 font-medium">
                    {row.name}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                    {row.dims}
                  </td>
                  <td className="py-2 pl-3 text-bark-500 dark:text-bark-400">
                    {row.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          C2C Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li>
            <strong>Swatch at least 5&times;5 blocks</strong> for an accurate
            gauge. Smaller swatches magnify measurement errors.
          </li>
          <li>
            <strong>C2C blocks are not always square.</strong> Measure both width
            and height separately — they often differ.
          </li>
          <li>
            <strong>The diagonal grows fast,</strong> then shrinks. The widest
            diagonal row has as many blocks as the shorter side of your blanket.
          </li>
          <li>
            <strong>Border adds size.</strong> If you plan to add a border,
            subtract its width from your target dimensions before calculating.
          </li>
        </ul>
      </div>
    </div>
  );
}
