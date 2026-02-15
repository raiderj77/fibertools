"use client";

import { useState, useMemo, useCallback } from "react";

// ── TYPES ─────────────────────────────────────────────────────────

interface ColorEntry {
  id: string;
  hex: string;
  name: string;
  weight: number; // relative weight for randomizer
}

interface Stripe {
  colorId: string;
  rows: number;
}

const DEFAULT_COLORS: ColorEntry[] = [
  { id: "c1", hex: "#4A6741", name: "Sage", weight: 1 },
  { id: "c2", hex: "#D4A574", name: "Honey", weight: 1 },
  { id: "c3", hex: "#8B4513", name: "Bark", weight: 1 },
  { id: "c4", hex: "#E8D5C4", name: "Cream", weight: 1 },
];

const PRESETS = [
  { name: "🍂 Autumn", colors: [{ hex: "#8B4513", name: "Rust" }, { hex: "#DAA520", name: "Gold" }, { hex: "#556B2F", name: "Olive" }, { hex: "#CD853F", name: "Camel" }] },
  { name: "🌊 Ocean", colors: [{ hex: "#1B4F72", name: "Navy" }, { hex: "#2E86C1", name: "Marine" }, { hex: "#85C1E9", name: "Sky" }, { hex: "#F0F8FF", name: "Seafoam" }] },
  { name: "🌸 Spring", colors: [{ hex: "#FFB6C1", name: "Blush" }, { hex: "#DDA0DD", name: "Lavender" }, { hex: "#F0E68C", name: "Butter" }, { hex: "#98FB98", name: "Mint" }] },
  { name: "🖤 Neutral", colors: [{ hex: "#2C2C2C", name: "Charcoal" }, { hex: "#6B6B6B", name: "Gray" }, { hex: "#D3D3D3", name: "Silver" }, { hex: "#F5F5F5", name: "Ivory" }] },
  { name: "🌈 Rainbow", colors: [{ hex: "#E74C3C", name: "Red" }, { hex: "#F39C12", name: "Orange" }, { hex: "#F1C40F", name: "Yellow" }, { hex: "#27AE60", name: "Green" }, { hex: "#2980B9", name: "Blue" }, { hex: "#8E44AD", name: "Purple" }] },
];

function genId() { return Math.random().toString(36).substring(2, 8); }

type StripeMode = "random" | "fixed" | "sequence";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function StripeGeneratorTool() {
  const [colors, setColors] = useState<ColorEntry[]>(DEFAULT_COLORS);
  const [stripeMode, setStripeMode] = useState<StripeMode>("random");
  const [fixedRows, setFixedRows] = useState("4");
  const [minRows, setMinRows] = useState("2");
  const [maxRows, setMaxRows] = useState("8");
  const [totalStripes, setTotalStripes] = useState("20");
  const [seed, setSeed] = useState(Date.now());

  // Add color
  const addColor = () => {
    if (colors.length >= 12) return;
    const hue = Math.floor(Math.random() * 360);
    const hex = `hsl(${hue}, 60%, 50%)`;
    // Convert HSL to hex roughly
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    let hexVal = "#888888";
    if (canvas) {
      canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.fillStyle = hex; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; hexVal = `#${d[0].toString(16).padStart(2, "0")}${d[1].toString(16).padStart(2, "0")}${d[2].toString(16).padStart(2, "0")}`; }
    }
    setColors((prev) => [...prev, { id: genId(), hex: hexVal, name: `Color ${prev.length + 1}`, weight: 1 }]);
  };

  const removeColor = (id: string) => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  const updateColor = (id: string, field: Partial<ColorEntry>) => {
    setColors((prev) => prev.map((c) => c.id === id ? { ...c, ...field } : c));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setColors(preset.colors.map((c) => ({ ...c, id: genId(), weight: 1 })));
    setSeed(Date.now());
  };

  // Generate stripe pattern
  const stripes = useMemo(() => {
    const count = parseInt(totalStripes) || 20;
    const result: Stripe[] = [];

    if (colors.length === 0) return result;

    // Weighted random selection
    const pickColor = (rng: () => number, lastId?: string) => {
      const available = colors.filter((c) => c.id !== lastId || colors.length === 1);
      const availWeight = available.reduce((s, c) => s + c.weight, 0);
      let r = rng() * availWeight;
      for (const c of available) {
        r -= c.weight;
        if (r <= 0) return c.id;
      }
      return available[available.length - 1].id;
    };

    // Simple seeded RNG
    let s = seed;
    const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };

    if (stripeMode === "sequence") {
      const rows = parseInt(fixedRows) || 4;
      for (let i = 0; i < count; i++) {
        result.push({ colorId: colors[i % colors.length].id, rows });
      }
    } else if (stripeMode === "fixed") {
      const rows = parseInt(fixedRows) || 4;
      let lastId: string | undefined;
      for (let i = 0; i < count; i++) {
        const colorId = pickColor(rng, lastId);
        result.push({ colorId, rows });
        lastId = colorId;
      }
    } else {
      const min = parseInt(minRows) || 2;
      const max = parseInt(maxRows) || 8;
      let lastId: string | undefined;
      for (let i = 0; i < count; i++) {
        const colorId = pickColor(rng, lastId);
        const rows = min + Math.floor(rng() * (max - min + 1));
        result.push({ colorId, rows });
        lastId = colorId;
      }
    }

    return result;
  }, [colors, stripeMode, fixedRows, minRows, maxRows, totalStripes, seed]);

  // Stats
  const stats = useMemo(() => {
    const perColor: Record<string, number> = {};
    let totalRows = 0;
    for (const s of stripes) {
      perColor[s.colorId] = (perColor[s.colorId] || 0) + s.rows;
      totalRows += s.rows;
    }
    return { perColor, totalRows };
  }, [stripes]);

  const reroll = useCallback(() => setSeed(Date.now()), []);

  return (
    <div className="space-y-6">
      {/* Color palette */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Colors ({colors.length})</label>
          <div className="flex gap-2">
            {colors.length < 12 && (
              <button type="button" onClick={addColor} className="text-sage-600 dark:text-sage-400 text-sm hover:underline">+ Add color</button>
            )}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-600 dark:text-bark-300 hover:bg-cream-300 dark:hover:bg-bark-600 transition-colors">
              {p.name}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {colors.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <input type="color" value={c.hex} onChange={(e) => updateColor(c.id, { hex: e.target.value })}
                className="w-10 h-10 rounded-lg border-2 border-cream-300 dark:border-bark-600 cursor-pointer p-0.5" />
              <input type="text" value={c.name} onChange={(e) => updateColor(c.id, { name: e.target.value })}
                className="input flex-1 text-sm" maxLength={20} />
              <div className="flex items-center gap-1">
                <label className="text-xs text-bark-400 dark:text-bark-500">Wt:</label>
                <input type="number" value={c.weight} onChange={(e) => updateColor(c.id, { weight: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                  className="input w-16 text-sm text-center" min="0.1" step="0.5" inputMode="decimal" />
              </div>
              {colors.length > 2 && (
                <button type="button" onClick={() => removeColor(c.id)} className="text-bark-400 hover:text-rose-500 text-sm">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stripe settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Pattern Mode</label>
          <select value={stripeMode} onChange={(e) => setStripeMode(e.target.value as StripeMode)} className="select">
            <option value="random">Random widths (weighted)</option>
            <option value="fixed">Fixed width (random colors)</option>
            <option value="sequence">Sequence (A-B-C-A-B-C…)</option>
          </select>
        </div>

        {stripeMode === "random" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm">Min rows</label>
              <input type="number" value={minRows} onChange={(e) => setMinRows(e.target.value)} className="input" min="1" inputMode="numeric" />
            </div>
            <div>
              <label className="label text-sm">Max rows</label>
              <input type="number" value={maxRows} onChange={(e) => setMaxRows(e.target.value)} className="input" min="1" inputMode="numeric" />
            </div>
          </div>
        ) : (
          <div>
            <label className="label text-sm">Rows per stripe</label>
            <input type="number" value={fixedRows} onChange={(e) => setFixedRows(e.target.value)} className="input" min="1" inputMode="numeric" />
          </div>
        )}

        <div>
          <label className="label text-sm">Number of stripes</label>
          <input type="number" value={totalStripes} onChange={(e) => setTotalStripes(e.target.value)} className="input" min="1" max="200" inputMode="numeric" />
        </div>

        <div className="flex items-end">
          <button type="button" onClick={reroll} className="btn-primary w-full">
            🎲 Re-roll Pattern
          </button>
        </div>
      </div>

      {/* Visual preview */}
      <div>
        <p className="label">Preview ({stats.totalRows} rows total)</p>
        <div className="rounded-xl overflow-hidden border border-cream-300 dark:border-bark-600" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {stripes.map((s, i) => {
            const color = colors.find((c) => c.id === s.colorId);
            return (
              <div
                key={i}
                style={{
                  backgroundColor: color?.hex || "#ccc",
                  height: `${Math.max(4, s.rows * 4)}px`,
                  minHeight: "4px",
                }}
                title={`${color?.name}: ${s.rows} rows`}
              />
            );
          })}
        </div>
      </div>

      {/* Per-color breakdown */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">Per-Color Breakdown</h3>
        <div className="space-y-2">
          {colors.map((c) => {
            const rows = stats.perColor[c.id] || 0;
            const pct = stats.totalRows > 0 ? Math.round((rows / stats.totalRows) * 100) : 0;
            return (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: c.hex }} />
                <span className="text-sm text-bark-700 dark:text-cream-200 w-24 truncate">{c.name}</span>
                <div className="flex-1 h-3 bg-cream-200 dark:bg-bark-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.hex }} />
                </div>
                <span className="text-xs text-bark-500 dark:text-bark-400 w-20 text-right">{rows} rows ({pct}%)</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-bark-400 dark:text-bark-500 mt-3">
          💡 Adjust the &ldquo;Wt&rdquo; (weight) slider to use more of colors you have extra yarn for.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button type="button" onClick={() => {
          const lines = stripes.map((s, i) => {
            const c = colors.find((cl) => cl.id === s.colorId);
            return `Stripe ${i + 1}: ${c?.name} — ${s.rows} rows`;
          });
          navigator.clipboard.writeText(lines.join("\n"));
        }} className="btn-secondary text-sm">📋 Copy pattern</button>
        <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print</button>
      </div>
    </div>
  );
}
