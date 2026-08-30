"use client";

import { useMemo, useRef, useState } from "react";
import {
  buildColorPoolingPreview,
  COLOR_POOLING_LIMITS,
} from "@/lib/color-pooling-preview.mjs";
import useToolCompletion from "@/lib/useToolCompletion";

interface ColorSection {
  id: string;
  hex: string;
  stitches: string;
}

type RowMode = "turned" | "same-direction";

const DEFAULT_COLORS = [
  "#2E4057",
  "#D4A574",
  "#8B4513",
  "#E8D5C4",
  "#5F7A61",
  "#8B6F9C",
  "#C96F53",
  "#4C7A8B",
  "#B89B5E",
  "#6E5A4D",
];

const INITIAL_SECTIONS: ColorSection[] = DEFAULT_COLORS.slice(0, 4).map((hex, index) => ({
  id: `color-${index + 1}`,
  hex,
  stitches: "4",
}));

export default function ColorPoolingCalculatorTool() {
  const nextId = useRef(INITIAL_SECTIONS.length + 1);
  const [sections, setSections] = useState<ColorSection[]>(INITIAL_SECTIONS);
  const [rowMode, setRowMode] = useState<RowMode>("turned");
  const [rowAdjustment, setRowAdjustment] = useState("-1");
  const [previewRows, setPreviewRows] = useState("20");
  const [hasInteracted, setHasInteracted] = useState(false);

  const preview = useMemo(() => buildColorPoolingPreview({
    sections,
    rowAdjustment,
    previewRows,
    rowMode,
  }), [sections, rowAdjustment, previewRows, rowMode]);
  const result = "grid" in preview ? preview : null;

  useToolCompletion("color-pooling-calculator", result);

  const addSection = () => {
    setHasInteracted(true);
    setSections((current) => {
      if (current.length >= COLOR_POOLING_LIMITS.maxColors) return current;
      const id = `color-${nextId.current}`;
      nextId.current += 1;
      return [
        ...current,
        {
          id,
          hex: DEFAULT_COLORS[current.length % DEFAULT_COLORS.length],
          stitches: "4",
        },
      ];
    });
  };

  const removeSection = (id: string) => {
    setHasInteracted(true);
    setSections((current) => {
      if (current.length <= COLOR_POOLING_LIMITS.minColors) return current;
      return current.filter((section) => section.id !== id);
    });
  };

  const updateSection = (id: string, field: Partial<ColorSection>) => {
    setHasInteracted(true);
    setSections((current) => current.map((section) =>
      section.id === id ? { ...section, ...field } : section,
    ));
  };

  const nudgeAdjustment = (amount: number) => {
    setHasInteracted(true);
    setRowAdjustment((current) => {
      const parsed = Number(current);
      const startingValue = Number.isSafeInteger(parsed) ? parsed : 0;
      return String(Math.min(
        COLOR_POOLING_LIMITS.maxAdjustment,
        Math.max(COLOR_POOLING_LIMITS.minAdjustment, startingValue + amount),
      ));
    });
  };

  return (
    <div className="space-y-7" onChangeCapture={() => setHasInteracted(true)}>
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Idealized color-sequence preview</p>
        <p className="mt-1">
          Enter the whole-stitch count measured for each color section in one repeat. The preview assumes
          those counts stay constant, starts at the first listed color, and consumes no extra yarn for a
          foundation or turning chain. It is a swatching aid, not a guaranteed argyle or plaid pattern.
        </p>
      </div>

      <section aria-labelledby="pooling-colors-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="pooling-colors-heading" className="label mb-0">Measured color sections</h2>
            <p className="mt-1 text-xs text-bark-500 dark:text-bark-400">
              Enter 2–{COLOR_POOLING_LIMITS.maxColors} colors in yarn order; each may span 1–{COLOR_POOLING_LIMITS.maxStitchesPerColor} stitches.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            disabled={sections.length >= COLOR_POOLING_LIMITS.maxColors}
            className="min-h-11 rounded-lg px-3 text-sm font-medium text-sage-600 hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sage-400 dark:hover:bg-sage-950/20"
          >
            Add color
          </button>
        </div>

        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-3 rounded-lg border border-cream-300 p-3 dark:border-bark-700">
              <div>
                <label htmlFor={`${section.id}-hex`} className="label text-xs">Color {index + 1}</label>
                <input
                  id={`${section.id}-hex`}
                  type="color"
                  value={section.hex}
                  onChange={(event) => updateSection(section.id, { hex: event.target.value })}
                  className="h-11 w-11 cursor-pointer rounded-lg border-2 border-cream-300 p-0.5 dark:border-bark-600"
                />
              </div>
              <div>
                <label htmlFor={`${section.id}-stitches`} className="label text-xs">Whole stitches in color {index + 1}</label>
                <input
                  id={`${section.id}-stitches`}
                  type="number"
                  value={section.stitches}
                  onChange={(event) => updateSection(section.id, { stitches: event.target.value })}
                  className="input text-sm"
                  min="1"
                  max={COLOR_POOLING_LIMITS.maxStitchesPerColor}
                  step="1"
                  inputMode="numeric"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                disabled={sections.length <= COLOR_POOLING_LIMITS.minColors}
                className="min-h-11 min-w-11 rounded-lg text-bark-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-rose-950/20"
                aria-label={`Remove color ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="pooling-row-mode" className="label">Row placement</label>
          <select
            id="pooling-row-mode"
            value={rowMode}
            onChange={(event) => setRowMode(event.target.value as RowMode)}
            className="select"
            aria-describedby="pooling-row-mode-help"
          >
            <option value="turned">Turn after every row</option>
            <option value="same-direction">Start every row on the left</option>
          </select>
          <p id="pooling-row-mode-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">
            Turned rows place every even-numbered displayed return row from right to left in the preview.
          </p>
        </div>

        <div>
          <label htmlFor="pooling-row-adjustment" className="label">Stitches per row adjustment</label>
          <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] gap-2">
            <button
              type="button"
              onClick={() => nudgeAdjustment(-1)}
              className="min-h-11 rounded-lg bg-cream-200 text-lg font-bold text-bark-600 hover:bg-cream-300 dark:bg-bark-700 dark:text-bark-300 dark:hover:bg-bark-600"
              aria-label="Subtract one worked stitch per row"
            >
              −
            </button>
            <input
              id="pooling-row-adjustment"
              type="number"
              value={rowAdjustment}
              onChange={(event) => setRowAdjustment(event.target.value)}
              className="input text-center"
              min={COLOR_POOLING_LIMITS.minAdjustment}
              max={COLOR_POOLING_LIMITS.maxAdjustment}
              step="1"
              inputMode="numeric"
              aria-describedby="pooling-adjustment-help"
            />
            <button
              type="button"
              onClick={() => nudgeAdjustment(1)}
              className="min-h-11 rounded-lg bg-cream-200 text-lg font-bold text-bark-600 hover:bg-cream-300 dark:bg-bark-700 dark:text-bark-300 dark:hover:bg-bark-600"
              aria-label="Add one worked stitch per row"
            >
              +
            </button>
          </div>
          <p id="pooling-adjustment-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">
            Added to one measured color repeat; allowed range {COLOR_POOLING_LIMITS.minAdjustment} to +{COLOR_POOLING_LIMITS.maxAdjustment}.
          </p>
        </div>

        <div>
          <label htmlFor="pooling-preview-rows" className="label">Preview rows</label>
          <input
            id="pooling-preview-rows"
            type="number"
            value={previewRows}
            onChange={(event) => setPreviewRows(event.target.value)}
            className="input"
            min={COLOR_POOLING_LIMITS.minRows}
            max={COLOR_POOLING_LIMITS.maxRows}
            step="1"
            inputMode="numeric"
          />
        </div>
      </div>

      {!result && hasInteracted ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
          {"error" in preview ? preview.error : "Enter values within the supported limits."}
        </p>
      ) : null}

      {result ? (
        <>
          <div className="result-card space-y-3" aria-live="polite">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Trial row width</h3>
            <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.rowWidth} worked stitches</p>
            <p className="text-sm text-bark-500 dark:text-bark-400">
              Measured color repeat: {result.totalRepeat} stitches. Adjustment: {result.rowAdjustment >= 0 ? "+" : ""}{result.rowAdjustment}.
              The next row begins {result.repeatShiftPerRow} stitches farther through the idealized repeat before row-direction placement.
            </p>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              This is not a foundation-chain count. Add any setup or turning chains required by your stitch instructions,
              then swatch and adjust tension or row width from the actual fabric.
            </p>
          </div>

          <section aria-labelledby="pooling-preview-heading">
            <h3 id="pooling-preview-heading" className="label">Idealized placement preview</h3>
            <div className="max-w-full overflow-x-auto rounded-xl border border-cream-300 dark:border-bark-600" tabIndex={0}>
              <div
                className="min-w-max p-2"
                role="img"
                aria-label={`${result.previewRows}-row idealized color placement preview with ${result.rowWidth} stitches per row. A text sequence for every row follows.`}
              >
                {result.grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-right text-[10px] text-bark-500 dark:text-bark-400" aria-hidden="true">
                      {result.rowDirections[rowIndex] === "left-to-right" ? "L → R" : "R → L"}
                    </span>
                    <div className="flex" aria-hidden="true">
                      {row.map((color, columnIndex) => (
                        <span
                          key={columnIndex}
                          style={{ backgroundColor: color, width: "12px", height: "9px" }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-bark-500 dark:text-bark-400">
              Each colored cell is one worked stitch. The preview assumes every measured segment repeats exactly;
              real yarn, tension, joins, setup chains, and turning chains can shift placement.
            </p>
            <details className="mt-3 rounded-lg border border-cream-300 p-3 text-sm dark:border-bark-600">
              <summary className="cursor-pointer font-medium text-bark-700 dark:text-cream-300">
                Text version of the placement preview
              </summary>
              <ol className="mt-3 space-y-2 text-xs text-bark-600 dark:text-bark-300">
                {result.grid.map((row, rowIndex) => (
                  <li key={rowIndex}>
                    <strong>Row {rowIndex + 1}, {result.rowDirections[rowIndex] === "left-to-right" ? "left to right" : "right to left"}:</strong>{" "}
                    {row.map((color, columnIndex) => `stitch ${columnIndex + 1} ${color}`).join(", ")}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        </>
      ) : null}

      <div className="result-card">
        <h3 className="mb-2 font-semibold text-bark-700 dark:text-cream-200">How to use this preview</h3>
        <ul className="space-y-1 text-sm text-bark-500 dark:text-bark-400">
          <li><strong>Measure the intended stitch.</strong> A hook, needle, stitch, or tension change alters the stitch count within each color.</li>
          <li><strong>Measure more than one repeat.</strong> If the section counts vary, treat the grid as an idealized comparison rather than a prediction.</li>
          <li><strong>Match row placement.</strong> Choose turned rows only when the actual work reverses direction after every row.</li>
          <li><strong>Swatch the trial width.</strong> Small row-width or tension changes can move color transitions.</li>
          <li><strong>Inspect knots and joins.</strong> A sequence break can invalidate the assumed repeat.</li>
        </ul>
      </div>
    </div>
  );
}
