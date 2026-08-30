"use client";

import { useMemo, useState } from "react";
import StickyResult from "@/components/StickyResult";
import Tooltip from "@/components/Tooltip";
import {
  calculateGrannySquarePlan,
  COMMON_GRANNY_BLANKET_TARGETS,
  MAX_GRANNY_COLORS,
  MAX_GRANNY_DIMENSION_INCHES,
  MAX_GRANNY_YARDS_PER_SQUARE,
} from "@/lib/granny-square-plan.mjs";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function formatNumber(value: number) {
  return NUMBER_FORMAT.format(value);
}

export default function GrannySquarePlannerTool() {
  const [blanketWidth, setBlanketWidth] = useState("");
  const [blanketHeight, setBlanketHeight] = useState("");
  const [squareSize, setSquareSize] = useState("");
  const [numColors, setNumColors] = useState("1");
  const [yarnPerSquare, setYarnPerSquare] = useState("");

  const calculation = useMemo(() => {
    if (![blanketWidth, blanketHeight, squareSize].some((value) => value.trim() !== "")) {
      return { status: "empty" as const };
    }

    return calculateGrannySquarePlan({
      targetWidthInches: Number(blanketWidth),
      targetHeightInches: Number(blanketHeight),
      squareSizeInches: Number(squareSize),
      numberOfColors: Number(numColors),
      yarnPerSquareYards: yarnPerSquare.trim() === "" ? null : Number(yarnPerSquare),
    });
  }, [blanketWidth, blanketHeight, squareSize, numColors, yarnPerSquare]);

  const result = calculation.status === "ready" ? calculation : null;
  const stickySummary = result
    ? `${result.squaresWide} × ${result.squaresTall} = ${result.totalSquares} squares`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Enter target blanket dimensions and the blocked size of one test square. The planner rounds each axis up so the nominal grid is not smaller than the target.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="granny-blanket-width">Target width (inches)</label>
          <input
            id="granny-blanket-width"
            type="number"
            value={blanketWidth}
            onChange={(event) => setBlanketWidth(event.target.value)}
            placeholder="50"
            className="input"
            min="0.01"
            max={MAX_GRANNY_DIMENSION_INCHES}
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="label" htmlFor="granny-blanket-height">Target height (inches)</label>
          <input
            id="granny-blanket-height"
            type="number"
            value={blanketHeight}
            onChange={(event) => setBlanketHeight(event.target.value)}
            placeholder="60"
            className="input"
            min="0.01"
            max={MAX_GRANNY_DIMENSION_INCHES}
            step="any"
            inputMode="decimal"
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="granny-square-size">Blocked square size (inches)</label>
            <Tooltip text="Measure a completed, blocked test square. Joining method and tension can still change the assembled blanket size." />
          </div>
          <input
            id="granny-square-size"
            type="number"
            value={squareSize}
            onChange={(event) => setSquareSize(event.target.value)}
            placeholder="6"
            className="input"
            min="0.01"
            max={MAX_GRANNY_DIMENSION_INCHES}
            step="any"
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="granny-number-colors">Number of colors</label>
            <Tooltip text="If you enter measured yarn per square, the per-color figure is only an equal-use planning average. Actual color use depends on your layout." />
          </div>
          <input
            id="granny-number-colors"
            type="number"
            value={numColors}
            onChange={(event) => setNumColors(event.target.value)}
            placeholder="1"
            className="input"
            min="1"
            max={MAX_GRANNY_COLORS}
            step="1"
            inputMode="numeric"
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="granny-yarn-per-square">Measured yarn per square (yards, optional)</label>
            <Tooltip text="Make a representative square, unravel it, and measure the yarn used. This input covers squares only, not joining or borders." />
          </div>
          <input
            id="granny-yarn-per-square"
            type="number"
            value={yarnPerSquare}
            onChange={(event) => setYarnPerSquare(event.target.value)}
            placeholder="e.g. 18"
            className="input"
            min="0.01"
            max={MAX_GRANNY_YARDS_PER_SQUARE}
            step="any"
            inputMode="decimal"
          />
        </div>
      </div>

      {calculation.status === "invalid" && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {calculation.message}
        </p>
      )}

      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-4">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Your nominal grid plan
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.squaresWide} &times; {result.squaresTall}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">grid layout</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {result.totalSquares}
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">total squares</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
                  {formatNumber(result.nominalGridWidthInches)}&quot; &times; {formatNumber(result.nominalGridHeightInches)}&quot;
                </p>
                <p className="text-sm text-bark-500 dark:text-bark-400">nominal grid span before joining effects</p>
              </div>
            </div>

            <div className="border-t border-cream-300 pt-4 dark:border-bark-600">
              <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                {formatNumber(result.internalSeamLengthInches)} inches
              </p>
              <p className="text-xs text-bark-500 dark:text-bark-400">
                unique internal seam length ({result.internalSeamSegments} square-edge segments). This is seam distance, not joining-yarn yardage.
              </p>
            </div>

            {result.totalSquareYarnYards !== null && (
              <div className="space-y-3 border-t border-cream-300 pt-4 dark:border-bark-600">
                <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
                  Measured-input yarn plan for squares
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {formatNumber(result.totalSquareYarnYards)} yards
                    </p>
                    <p className="text-xs text-bark-500 dark:text-bark-400">
                      squares only; add your own allowance for variation, tails, borders, and joining
                    </p>
                  </div>
                  {result.numberOfColors > 1 && result.averageSquareYarnPerColorYards !== null && (
                    <div>
                      <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                        {formatNumber(result.averageSquareYarnPerColorYards)} yards
                      </p>
                      <p className="text-xs text-bark-500 dark:text-bark-400">
                        planning average per color if use is divided equally across {result.numberOfColors} colors
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs italic text-bark-400 dark:text-bark-500">
              The grid uses your blocked test-square measurement. Joining tension and technique can change the assembled dimensions, so check a joined sample before committing.
            </p>

            <button
              type="button"
              onClick={() => {
                let text = `Granny-square plan: ${result.squaresWide} x ${result.squaresTall} = ${result.totalSquares} squares; nominal grid span: ${formatNumber(result.nominalGridWidthInches)}\" x ${formatNumber(result.nominalGridHeightInches)}\"; unique internal seam length: ${formatNumber(result.internalSeamLengthInches)} inches`;
                if (result.totalSquareYarnYards !== null) {
                  text += `; measured-input yarn for squares: ${formatNumber(result.totalSquareYarnYards)} yards`;
                }
                navigator.clipboard.writeText(text);
              }}
              className="btn-secondary text-sm"
              aria-label="Copy granny-square grid results to clipboard"
            >
              Copy results
            </button>
          </div>
        )}
      </StickyResult>

      <div className="result-card mt-8">
        <h3 className="mb-3 font-semibold text-bark-700 dark:text-cream-200">Example blocked square sizes</h3>
        <div className="grid grid-cols-1 gap-3 text-sm text-bark-500 dark:text-bark-400 sm:grid-cols-2">
          <div className="rounded-xl bg-cream-100 p-3 dark:bg-bark-800">
            <p className="font-medium text-bark-700 dark:text-cream-200">4&quot; squares</p>
            <p>Creates more pieces and internal seams for a given target size.</p>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 dark:bg-bark-800">
            <p className="font-medium text-bark-700 dark:text-cream-200">6&quot; squares</p>
            <p>A middle-size example for comparing grid counts.</p>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 dark:bg-bark-800">
            <p className="font-medium text-bark-700 dark:text-cream-200">8&quot; squares</p>
            <p>Creates fewer pieces and internal seams than smaller squares.</p>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 dark:bg-bark-800">
            <p className="font-medium text-bark-700 dark:text-cream-200">12&quot; squares</p>
            <p>Useful as a large-square planning example or sampler unit.</p>
          </div>
        </div>
      </div>

      <div className="result-card">
        <h3 className="mb-1 font-semibold text-bark-700 dark:text-cream-200">Example blanket targets</h3>
        <p className="mb-3 text-xs text-bark-500 dark:text-bark-400">
          Names and target dimensions are planning examples, not fit standards. The grid counts round up using 6-inch squares.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-bark-600 dark:text-cream-300">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="py-2 pr-4 text-left font-medium text-bark-700 dark:text-cream-200">Example</th>
                <th className="py-2 pr-4 text-left font-medium text-bark-700 dark:text-cream-200">Target</th>
                <th className="py-2 text-left font-medium text-bark-700 dark:text-cream-200">6&quot; square grid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
              {COMMON_GRANNY_BLANKET_TARGETS.map((target) => {
                const plan = calculateGrannySquarePlan({
                  targetWidthInches: target.widthInches,
                  targetHeightInches: target.heightInches,
                  squareSizeInches: 6,
                  numberOfColors: 1,
                  yarnPerSquareYards: null,
                });
                if (plan.status !== "ready") return null;

                return (
                  <tr key={target.label}>
                    <td className="py-1.5 pr-4">{target.label}</td>
                    <td className="py-1.5 pr-4">{target.widthInches}&quot; &times; {target.heightInches}&quot;</td>
                    <td className="py-1.5">{plan.squaresWide} &times; {plan.squaresTall} = {plan.totalSquares}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
