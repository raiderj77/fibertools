"use client";

import { useCallback, useMemo, useState } from "react";
import {
  STRIPE_PATTERN_LIMITS,
  planStripePattern,
} from "@/lib/stripe-pattern-plan.mjs";

interface ColorEntry {
  id: string;
  hex: string;
  name: string;
  weight: string;
}

interface Stripe {
  colorId: string;
  rows: number;
}

type StripeMode = "random" | "fixed" | "sequence";

const DEFAULT_COLORS: ColorEntry[] = [
  { id: "c1", hex: "#4A6741", name: "Sage", weight: "1" },
  { id: "c2", hex: "#D4A574", name: "Honey", weight: "1" },
  { id: "c3", hex: "#8B4513", name: "Bark", weight: "1" },
  { id: "c4", hex: "#E8D5C4", name: "Cream", weight: "1" },
];

const PRESETS = [
  { name: "🍂 Autumn", colors: [{ hex: "#8B4513", name: "Rust" }, { hex: "#DAA520", name: "Gold" }, { hex: "#556B2F", name: "Olive" }, { hex: "#CD853F", name: "Camel" }] },
  { name: "🌊 Ocean", colors: [{ hex: "#1B4F72", name: "Navy" }, { hex: "#2E86C1", name: "Marine" }, { hex: "#85C1E9", name: "Sky" }, { hex: "#F0F8FF", name: "Seafoam" }] },
  { name: "🌸 Spring", colors: [{ hex: "#FFB6C1", name: "Blush" }, { hex: "#DDA0DD", name: "Lavender" }, { hex: "#F0E68C", name: "Butter" }, { hex: "#98FB98", name: "Mint" }] },
  { name: "🖤 Neutral", colors: [{ hex: "#2C2C2C", name: "Charcoal" }, { hex: "#6B6B6B", name: "Gray" }, { hex: "#D3D3D3", name: "Silver" }, { hex: "#F5F5F5", name: "Ivory" }] },
  { name: "🌈 Rainbow", colors: [{ hex: "#E74C3C", name: "Red" }, { hex: "#F39C12", name: "Orange" }, { hex: "#F1C40F", name: "Yellow" }, { hex: "#27AE60", name: "Green" }, { hex: "#2980B9", name: "Blue" }, { hex: "#8E44AD", name: "Purple" }] },
] as const;

const MODES: Array<{ id: StripeMode; label: string; description: string }> = [
  {
    id: "random",
    label: "Random widths",
    description: "Weighted color selection without immediate repeats, plus a uniformly selected whole-number width in the entered range.",
  },
  {
    id: "fixed",
    label: "Fixed width",
    description: "Weighted color selection without immediate repeats; every stripe uses the same entered row count.",
  },
  {
    id: "sequence",
    label: "Palette sequence",
    description: "Repeats the displayed palette order at one fixed row count. Relative color weights and the re-roll seed are ignored.",
  },
];

const EMPTY_STRIPES: Stripe[] = [];
const EMPTY_TOTALS: Record<string, number> = {};

function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `color-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function StripeGeneratorTool() {
  const [colors, setColors] = useState<ColorEntry[]>(DEFAULT_COLORS);
  const [stripeMode, setStripeMode] = useState<StripeMode>("random");
  const [fixedRows, setFixedRows] = useState("4");
  const [minRows, setMinRows] = useState("2");
  const [maxRows, setMaxRows] = useState("8");
  const [totalStripes, setTotalStripes] = useState("20");
  const [seed, setSeed] = useState(1);
  const [copyStatus, setCopyStatus] = useState("");

  const addColor = () => {
    if (colors.length >= STRIPE_PATTERN_LIMITS.maximumColors) return;
    const hue = Math.floor(Math.random() * 360);
    const hsl = `hsl(${hue}, 60%, 50%)`;
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    let hex = "#888888";
    if (canvas) {
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = hsl;
        context.fillRect(0, 0, 1, 1);
        const data = context.getImageData(0, 0, 1, 1).data;
        hex = `#${data[0].toString(16).padStart(2, "0")}${data[1].toString(16).padStart(2, "0")}${data[2].toString(16).padStart(2, "0")}`;
      }
    }
    setColors((previous) => [
      ...previous,
      { id: genId(), hex, name: `Color ${previous.length + 1}`, weight: "1" },
    ]);
  };

  const removeColor = (id: string) => {
    if (colors.length <= STRIPE_PATTERN_LIMITS.minimumColors) return;
    setColors((previous) => previous.filter((color) => color.id !== id));
  };

  const updateColor = (id: string, fields: Partial<ColorEntry>) => {
    setColors((previous) => previous.map((color) => (
      color.id === id ? { ...color, ...fields } : color
    )));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setColors(preset.colors.map((color) => ({ ...color, id: genId(), weight: "1" })));
    setSeed((value) => (value + 1) >>> 0);
  };

  const calculation = useMemo(() => planStripePattern({
    mode: stripeMode,
    colors,
    totalStripes,
    fixedRows,
    minRows,
    maxRows,
    seed,
  }), [colors, fixedRows, maxRows, minRows, seed, stripeMode, totalStripes]);

  const result = calculation.status === "ready" ? calculation : null;
  const validationMessage = calculation.status === "invalid" ? calculation.message : "";
  const stripes = result?.stripes ?? EMPTY_STRIPES;
  const perColorRows = result?.perColorRows ?? EMPTY_TOTALS;
  const totalRows = result?.totalRows ?? 0;
  const activeMode = MODES.find((mode) => mode.id === stripeMode) ?? MODES[0];

  const reroll = useCallback(() => {
    setSeed((value) => (value + 1) >>> 0);
    setCopyStatus("");
  }, []);

  const copyPattern = async () => {
    if (!result) return;
    const lines = result.stripes.map((stripe: Stripe, index: number) => {
      const color = colors.find((candidate) => candidate.id === stripe.colorId);
      return `Stripe ${index + 1}: ${color?.name || "Unnamed color"}, ${stripe.rows} rows`;
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyStatus("Pattern copied.");
    } catch {
      setCopyStatus("Copy failed. Select and copy the pattern manually.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Row-sequence planner only</p>
        <p className="mt-1">
          This tool assigns colors and row counts to stripes. Row shares are not yarn consumption,
          yardage, or per-color purchasing quantities.
        </p>
      </div>

      <fieldset>
        <legend className="label mb-2">Pattern mode</legend>
        <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Stripe pattern mode">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => { setStripeMode(mode.id); setCopyStatus(""); }}
              aria-pressed={stripeMode === mode.id}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                stripeMode === mode.id
                  ? "border-sage-600 bg-sage-600 text-white"
                  : "border-bark-200 bg-white text-bark-700 hover:border-sage-400 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-bark-400 dark:text-bark-500">{activeMode.description}</p>
      </fieldset>

      <fieldset>
        <legend className="label mb-2">Color palette ({colors.length})</legend>
        <div className="mb-3 flex justify-end">
          {colors.length < STRIPE_PATTERN_LIMITS.maximumColors && (
            <button type="button" onClick={addColor} className="text-sm text-sage-600 hover:underline dark:text-sage-400">
              + Add color
            </button>
          )}
        </div>

        <p className="mb-3 text-xs text-bark-400 dark:text-bark-500">
          In randomized modes, relative weight is a whole number from 1 to {STRIPE_PATTERN_LIMITS.maximumRelativeWeight}
          and changes the odds among colors eligible for the next stripe. It does not represent yarn on hand.
          With two colors, avoiding an immediate repeat means the plan alternates after the first pick.
          Palette sequence mode ignores weights.
        </p>

        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Color palette presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-lg bg-cream-200 px-3 py-1.5 text-xs font-medium text-bark-600 transition-colors hover:bg-cream-300 dark:bg-bark-700 dark:text-bark-300 dark:hover:bg-bark-600"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {colors.map((color, index) => {
            const colorInputId = `stripe-color-${color.id}`;
            const nameInputId = `stripe-name-${color.id}`;
            const weightInputId = `stripe-weight-${color.id}`;
            return (
              <div key={color.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-3 sm:grid-cols-[auto_minmax(0,1fr)_8rem_auto]">
                <div>
                  <label htmlFor={colorInputId} className="sr-only">Color {index + 1} swatch</label>
                  <input
                    id={colorInputId}
                    type="color"
                    value={color.hex}
                    onChange={(event) => updateColor(color.id, { hex: event.target.value })}
                    className="h-11 w-11 cursor-pointer rounded-lg border-2 border-cream-300 p-0.5 dark:border-bark-600"
                  />
                </div>
                <div>
                  <label htmlFor={nameInputId} className="label text-xs">Color {index + 1} name</label>
                  <input
                    id={nameInputId}
                    type="text"
                    value={color.name}
                    onChange={(event) => updateColor(color.id, { name: event.target.value })}
                    className="input text-sm"
                    maxLength={20}
                  />
                </div>
                <div className="col-start-2 sm:col-start-auto">
                  <label htmlFor={weightInputId} className="label text-xs">Relative weight</label>
                  <input
                    id={weightInputId}
                    type="number"
                    value={color.weight}
                    onChange={(event) => updateColor(color.id, { weight: event.target.value })}
                    className="input text-center text-sm"
                    min="1"
                    max={STRIPE_PATTERN_LIMITS.maximumRelativeWeight}
                    step="1"
                    inputMode="numeric"
                    disabled={stripeMode === "sequence"}
                  />
                </div>
                {colors.length > STRIPE_PATTERN_LIMITS.minimumColors && (
                  <button
                    type="button"
                    onClick={() => removeColor(color.id)}
                    className="min-h-11 text-sm text-bark-400 hover:text-rose-500"
                    aria-label={`Remove ${color.name || `color ${index + 1}`}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stripeMode === "random" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="stripe-min-rows" className="label text-sm">Minimum rows</label>
              <input
                id="stripe-min-rows"
                type="number"
                value={minRows}
                onChange={(event) => setMinRows(event.target.value)}
                className="input"
                min="1"
                max={STRIPE_PATTERN_LIMITS.maximumRowsPerStripe}
                step="1"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="stripe-max-rows" className="label text-sm">Maximum rows</label>
              <input
                id="stripe-max-rows"
                type="number"
                value={maxRows}
                onChange={(event) => setMaxRows(event.target.value)}
                className="input"
                min="1"
                max={STRIPE_PATTERN_LIMITS.maximumRowsPerStripe}
                step="1"
                inputMode="numeric"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="stripe-fixed-rows" className="label text-sm">Rows per stripe</label>
            <input
              id="stripe-fixed-rows"
              type="number"
              value={fixedRows}
              onChange={(event) => setFixedRows(event.target.value)}
              className="input"
              min="1"
              max={STRIPE_PATTERN_LIMITS.maximumRowsPerStripe}
              step="1"
              inputMode="numeric"
            />
          </div>
        )}

        <div>
          <label htmlFor="stripe-count" className="label text-sm">Number of stripes</label>
          <input
            id="stripe-count"
            type="number"
            value={totalStripes}
            onChange={(event) => setTotalStripes(event.target.value)}
            className="input"
            min="1"
            max={STRIPE_PATTERN_LIMITS.maximumStripes}
            step="1"
            inputMode="numeric"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="button"
            onClick={reroll}
            disabled={stripeMode === "sequence" || !result}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            Re-roll weighted color plan
          </button>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {validationMessage ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">
            {validationMessage}
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div>
              <p className="label">Preview ({result.totalRows} planned rows)</p>
              <p className="mb-2 text-xs text-bark-400 dark:text-bark-500">
                Visual stripe height is capped for readability; the accessible label and copied plan retain each exact row count.
              </p>
              <div
                className="max-h-[400px] overflow-y-auto rounded-xl border border-cream-300 dark:border-bark-600"
                role="list"
                aria-label="Generated stripe row plan"
              >
                {stripes.map((stripe: Stripe, index: number) => {
                  const color = colors.find((candidate) => candidate.id === stripe.colorId);
                  const name = color?.name || "Unnamed color";
                  return (
                    <div
                      key={`${index}-${stripe.colorId}`}
                      role="listitem"
                      aria-label={`Stripe ${index + 1}: ${name}, ${stripe.rows} rows`}
                      style={{
                        backgroundColor: color?.hex || "#cccccc",
                        height: `${Math.max(4, Math.min(80, stripe.rows * 4))}px`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="result-card">
              <h3 className="mb-3 font-semibold text-bark-700 dark:text-cream-200">Planned Row Share by Color</h3>
              <div className="space-y-2">
                {colors.map((color) => {
                  const rows = perColorRows[color.id] || 0;
                  const percent = totalRows > 0 ? Math.round((rows / totalRows) * 100) : 0;
                  return (
                    <div key={color.id} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                      <span className="w-24 truncate text-sm text-bark-700 dark:text-cream-200">{color.name || "Unnamed"}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-200 dark:bg-bark-700" aria-hidden="true">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color.hex }} />
                      </div>
                      <span className="w-24 text-right text-xs text-bark-500 dark:text-bark-400">{rows} rows ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-bark-400 dark:text-bark-500">
                Percentages describe planned rows only. Different stitches, widths, gauges, and tensions can use different amounts of yarn per row.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void copyPattern()} disabled={!result} className="btn-secondary text-sm disabled:opacity-50">
          Copy row plan
        </button>
        <button type="button" onClick={() => window.print()} disabled={!result} className="btn-secondary text-sm disabled:opacity-50">
          Print
        </button>
        <span className="self-center text-xs text-bark-500 dark:text-bark-400" role="status" aria-live="polite">
          {copyStatus}
        </span>
      </div>
    </div>
  );
}
