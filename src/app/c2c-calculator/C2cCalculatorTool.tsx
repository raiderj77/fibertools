"use client";

import { useMemo, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { buildC2cPlan, C2C_LIMITS } from "@/lib/c2c-plan.mjs";

const BLANKET_SIZES = [
  { name: "Baby", width: 30, height: 36 },
  { name: "Throw", width: 50, height: 60 },
  { name: "Twin", width: 66, height: 90 },
  { name: "Full", width: 80, height: 90 },
  { name: "Queen", width: 90, height: 100 },
];

function format(value: number) {
  return Number(value.toFixed(1)).toLocaleString();
}

export default function C2cCalculatorTool() {
  const [swatchBlocksWide, setSwatchBlocksWide] = useState("");
  const [swatchBlocksTall, setSwatchBlocksTall] = useState("");
  const [swatchWidth, setSwatchWidth] = useState("");
  const [swatchHeight, setSwatchHeight] = useState("");
  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");
  const [yarnPerBlock, setYarnPerBlock] = useState("");
  const [allowancePercent, setAllowancePercent] = useState("10");
  const [hasInteracted, setHasInteracted] = useState(false);

  const fieldsComplete = [
    swatchBlocksWide,
    swatchBlocksTall,
    swatchWidth,
    swatchHeight,
    targetWidth,
    targetHeight,
    allowancePercent,
  ].every((value) => value.trim() !== "");

  const calculation = useMemo(() => {
    if (!fieldsComplete) return null;
    return buildC2cPlan({
      swatchBlocksWide,
      swatchBlocksTall,
      swatchWidth,
      swatchHeight,
      targetWidth,
      targetHeight,
      yarnPerBlock,
      allowancePercent,
    });
  }, [
    allowancePercent,
    fieldsComplete,
    swatchBlocksTall,
    swatchBlocksWide,
    swatchHeight,
    swatchWidth,
    targetHeight,
    targetWidth,
    yarnPerBlock,
  ]);
  const result = calculation && "totalBlocks" in calculation ? calculation : null;
  const validationMessage = calculation && "error" in calculation ? String(calculation.error) : "";

  const applyPreset = (width: number, height: number) => {
    setHasInteracted(true);
    setTargetWidth(String(width));
    setTargetHeight(String(height));
  };

  return (
    <div className="space-y-6" onChangeCapture={() => setHasInteracted(true)}>
      <p className="text-sm text-bark-500 dark:text-bark-400">
        Measure a representative C2C swatch in both block directions. This worksheet rounds each target axis
        to the nearest whole block and reports nominal dimensions; it does not guarantee finished size.
      </p>

      <section className="space-y-3 rounded-xl bg-cream-100 p-4 dark:bg-bark-800" aria-labelledby="c2c-swatch-heading">
        <h2 id="c2c-swatch-heading" className="font-medium text-bark-700 text-sm dark:text-cream-200">Measured swatch</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="c2c-swatch-blocks-wide" className="label text-xs">
              Blocks wide
              <Tooltip text="Whole C2C blocks measured across the swatch." />
            </label>
            <input id="c2c-swatch-blocks-wide" type="number" value={swatchBlocksWide} onChange={(event) => setSwatchBlocksWide(event.target.value)} placeholder="5" className="input" min="1" max={C2C_LIMITS.maxSwatchBlocks} step="1" inputMode="numeric" />
          </div>
          <div>
            <label htmlFor="c2c-swatch-blocks-tall" className="label text-xs">
              Blocks tall
              <Tooltip text="Whole C2C blocks measured down the swatch." />
            </label>
            <input id="c2c-swatch-blocks-tall" type="number" value={swatchBlocksTall} onChange={(event) => setSwatchBlocksTall(event.target.value)} placeholder="5" className="input" min="1" max={C2C_LIMITS.maxSwatchBlocks} step="1" inputMode="numeric" />
          </div>
          <div>
            <label htmlFor="c2c-swatch-width" className="label text-xs">Swatch width (in)</label>
            <input id="c2c-swatch-width" type="number" value={swatchWidth} onChange={(event) => setSwatchWidth(event.target.value)} placeholder="4" className="input" min="0.01" max={C2C_LIMITS.maxDimension} step="any" inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="c2c-swatch-height" className="label text-xs">Swatch height (in)</label>
            <input id="c2c-swatch-height" type="number" value={swatchHeight} onChange={(event) => setSwatchHeight(event.target.value)} placeholder="4" className="input" min="0.01" max={C2C_LIMITS.maxDimension} step="any" inputMode="decimal" />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl bg-sage-50 p-4 dark:bg-sage-900/10" aria-labelledby="c2c-target-heading">
        <h2 id="c2c-target-heading" className="font-medium text-sage-700 text-sm dark:text-sage-300">Target and optional measured yarn</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="c2c-target-width" className="label text-xs">Target width (in)</label>
            <input id="c2c-target-width" type="number" value={targetWidth} onChange={(event) => setTargetWidth(event.target.value)} placeholder="50" className="input" min="0.01" max={C2C_LIMITS.maxDimension} step="any" inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="c2c-target-height" className="label text-xs">Target height (in)</label>
            <input id="c2c-target-height" type="number" value={targetHeight} onChange={(event) => setTargetHeight(event.target.value)} placeholder="60" className="input" min="0.01" max={C2C_LIMITS.maxDimension} step="any" inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="c2c-yarn-per-block" className="label text-xs">
              Measured yarn per block (in), optional
              <Tooltip text="Measure yarn used by representative blocks from the same fabric. Leave blank to omit yarn planning." />
            </label>
            <input id="c2c-yarn-per-block" type="number" value={yarnPerBlock} onChange={(event) => setYarnPerBlock(event.target.value)} placeholder="24" className="input" min="0.01" max={C2C_LIMITS.maxYarnPerBlock} step="any" inputMode="decimal" />
          </div>
          <div>
            <label htmlFor="c2c-allowance" className="label text-xs">Yarn allowance (%)</label>
            <input id="c2c-allowance" type="number" value={allowancePercent} onChange={(event) => setAllowancePercent(event.target.value)} className="input" min="0" max={C2C_LIMITS.maxAllowancePercent} step="any" inputMode="decimal" aria-describedby="c2c-allowance-help" />
            <p id="c2c-allowance-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">Shown separately; it is not measured consumption.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1" aria-label="Nominal target presets">
          {BLANKET_SIZES.map((size) => (
            <button key={size.name} type="button" onClick={() => applyPreset(size.width, size.height)} className="min-h-11 rounded-lg bg-cream-200 px-3 text-xs font-medium text-bark-600 transition-colors hover:bg-cream-300 dark:bg-bark-700 dark:text-cream-300 dark:hover:bg-bark-600">
              {size.name} ({size.width}&times;{size.height})
            </button>
          ))}
        </div>
      </section>

      {validationMessage && hasInteracted ? (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">{validationMessage}</p>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {result ? `${result.blocksWide} by ${result.blocksTall} block plan updated, ${result.totalBlocks} total blocks, nominal ${format(result.nominalWidth)} by ${format(result.nominalHeight)} inches${result.plannedYards === null ? ", no optional yarn total" : `, ${format(result.baseYards ?? 0)} measured-input base yards plus ${format(result.allowancePercent)} percent allowance equals ${format(result.plannedYards)} planned yards`}.` : ""}
      </p>

      {result ? (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Nominal C2C block plan</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div><p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.totalBlocks.toLocaleString()}</p><p className="text-sm text-bark-500 dark:text-bark-400">total blocks</p></div>
            <div><p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.blocksWide} &times; {result.blocksTall}</p><p className="text-sm text-bark-500 dark:text-bark-400">blocks wide &times; tall</p></div>
            <div><p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.totalDiagonalRows}</p><p className="text-sm text-bark-500 dark:text-bark-400">diagonal rows</p></div>
          </div>
          <div className="space-y-2 border-t border-cream-300 pt-4 dark:border-bark-600">
            <p className="text-sm text-bark-600 dark:text-cream-300"><strong>Nominal grid dimensions:</strong> {format(result.nominalWidth)}&Prime; &times; {format(result.nominalHeight)}&Prime;</p>
            <p className="text-sm text-bark-600 dark:text-cream-300"><strong>Measured block size:</strong> {format(result.blockWidth)}&Prime; wide &times; {format(result.blockHeight)}&Prime; tall</p>
            {result.plannedYards !== null ? (
              <>
                <p className="text-sm text-bark-600 dark:text-cream-300"><strong>Measured-input base:</strong> {format(result.baseYards ?? 0)} yards</p>
                <p className="text-sm text-bark-600 dark:text-cream-300"><strong>Planning total:</strong> {format(result.plannedYards)} yards ({format(result.allowancePercent)}% allowance)</p>
              </>
            ) : null}
          </div>
          <p className="text-xs italic text-bark-400 dark:text-bark-500">Nearest-block rounding can finish above or below either requested dimension. Borders, joins, gauge changes, and nonrepresentative block measurements are not modeled.</p>
          <button type="button" onClick={() => navigator.clipboard.writeText(`C2C plan: ${result.blocksWide} × ${result.blocksTall} blocks (${result.totalBlocks} total), ${result.totalDiagonalRows} diagonal rows, nominal ${format(result.nominalWidth)}″ × ${format(result.nominalHeight)}″${result.plannedYards === null ? "" : `, ${format(result.plannedYards)} planned yards`}`)} className="btn-secondary text-sm" aria-label="Copy C2C planning result">Copy result</button>
        </div>
      ) : null}

      <div className="result-card">
        <h3 className="mb-2 font-semibold text-bark-700 dark:text-cream-200">Interpretation limits</h3>
        <ul className="space-y-1 text-sm text-bark-500 dark:text-bark-400">
          <li><strong>Measure both axes.</strong> C2C blocks need not be square.</li>
          <li><strong>Rounded counts are nominal.</strong> The final fabric still depends on the representative gauge and finishing.</li>
          <li><strong>Measure yarn use.</strong> The optional yarn total scales only the per-block amount you enter.</li>
          <li><strong>Plan borders separately.</strong> Border construction and yarn are not included.</li>
        </ul>
      </div>
    </div>
  );
}
