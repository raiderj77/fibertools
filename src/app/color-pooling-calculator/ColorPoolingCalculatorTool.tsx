"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";

// ── TYPES ─────────────────────────────────────────────────────────

interface ColorSection {
  id: string;
  hex: string;
  stitches: string;
}

const STITCH_TYPES = [
  { key: "sc", label: "Single Crochet / Moss Stitch", offset: 0 },
  { key: "linen", label: "Linen Stitch", offset: 0 },
  { key: "hdc", label: "Half Double Crochet", offset: 0 },
  { key: "garter", label: "Garter Stitch (knit)", offset: 0 },
];

function genId() { return Math.random().toString(36).substring(2, 8); }

// ── COMPONENT ─────────────────────────────────────────────────────

export default function ColorPoolingCalculatorTool() {
  const [sections, setSections] = useState<ColorSection[]>([
    { id: genId(), hex: "#2E4057", stitches: "4" },
    { id: genId(), hex: "#D4A574", stitches: "4" },
    { id: genId(), hex: "#8B4513", stitches: "4" },
    { id: genId(), hex: "#E8D5C4", stitches: "4" },
  ]);
  const [stitchType, setStitchType] = useState("sc");
  const [chainAdjust, setChainAdjust] = useState(0);
  const [previewRows, setPreviewRows] = useState(20);

  const addSection = () => {
    if (sections.length >= 10) return;
    const hue = Math.floor(Math.random() * 360);
    setSections((prev) => [...prev, { id: genId(), hex: `hsl(${hue}, 50%, 50%)`, stitches: "4" }]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 2) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: Partial<ColorSection>) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, ...field } : s));
  };

  // Calculate pooling
  const result = useMemo(() => {
    const colorStitches = sections.map((s) => parseInt(s.stitches) || 0);
    const totalRepeat = colorStitches.reduce((a, b) => a + b, 0);
    if (totalRepeat <= 0) return null;

    // For pooling to align: chain count should equal the color repeat length
    // The foundation chain = totalRepeat + chainAdjust
    const chainCount = totalRepeat + chainAdjust;
    if (chainCount <= 0) return null;

    // Generate preview grid
    const grid: string[][] = [];
    let colorIdx = 0;
    let stitchInColor = 0;
    const totalColors = sections.length;

    for (let row = 0; row < previewRows; row++) {
      const rowData: string[] = [];
      for (let col = 0; col < chainCount; col++) {
        rowData.push(sections[colorIdx].hex);
        stitchInColor++;
        if (stitchInColor >= colorStitches[colorIdx]) {
          stitchInColor = 0;
          colorIdx = (colorIdx + 1) % totalColors;
        }
      }
      grid.push(rowData);
    }

    // Check if pooling is aligned (column colors should be consistent)
    let isAligned = true;
    if (grid.length >= 3) {
      for (let col = 0; col < chainCount && col < 5; col++) {
        if (grid[0][col] !== grid[2][col]) {
          isAligned = false;
          break;
        }
      }
    }

    return {
      chainCount,
      totalRepeat,
      grid,
      isAligned,
    };
  }, [sections, chainAdjust, previewRows]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Measure the color sections in your variegated yarn (in stitches), and we&apos;ll calculate the exact chain count to make the colors pool into columns.
      </p>

      {/* Color sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="label mb-0">
            Color Sections in Yarn
            <Tooltip text="Work a swatch and count how many stitches each color lasts before changing. Enter them in order." />
          </p>
          {sections.length < 10 && (
            <button type="button" onClick={addSection} className="text-sage-600 dark:text-sage-400 text-sm hover:underline">+ Add color</button>
          )}
        </div>
        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-xs text-bark-400 dark:text-bark-500 w-4">{i + 1}</span>
              <input type="color" value={s.hex} onChange={(e) => updateSection(s.id, { hex: e.target.value })}
                className="w-10 h-10 rounded-lg border-2 border-cream-300 dark:border-bark-600 cursor-pointer p-0.5" />
              <div className="flex-1">
                <label className="text-xs text-bark-400 dark:text-bark-500">Stitches in this color</label>
                <input type="number" value={s.stitches} onChange={(e) => updateSection(s.id, { stitches: e.target.value })}
                  placeholder="4" className="input text-sm" min="1" inputMode="numeric" />
              </div>
              {sections.length > 2 && (
                <button type="button" onClick={() => removeSection(s.id)} className="text-bark-400 hover:text-rose-500">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Stitch Type</label>
          <select value={stitchType} onChange={(e) => setStitchType(e.target.value)} className="select">
            {STITCH_TYPES.map((st) => (
              <option key={st.key} value={st.key}>{st.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            Chain Adjust
            <Tooltip text="Add or subtract stitches from the calculated chain to shift the pooling pattern. Try +1 or -1 to fine-tune." />
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setChainAdjust((v) => v - 1)}
              className="w-10 h-10 rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-600 dark:text-bark-300 font-bold text-lg hover:bg-cream-300 dark:hover:bg-bark-600 active:scale-95 transition-all">
              −
            </button>
            <span className="text-lg font-bold text-bark-800 dark:text-cream-100 w-10 text-center">{chainAdjust >= 0 ? `+${chainAdjust}` : chainAdjust}</span>
            <button type="button" onClick={() => setChainAdjust((v) => v + 1)}
              className="w-10 h-10 rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-600 dark:text-bark-300 font-bold text-lg hover:bg-cream-300 dark:hover:bg-bark-600 active:scale-95 transition-all">
              +
            </button>
          </div>
        </div>
        <div>
          <label className="label">Preview rows</label>
          <input type="number" value={previewRows} onChange={(e) => setPreviewRows(Math.min(50, Math.max(4, parseInt(e.target.value) || 20)))}
            className="input" min="4" max="50" inputMode="numeric" />
        </div>
      </div>

      {/* Result */}
      {result && (
        <>
          <div className="result-card space-y-3">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Foundation Chain
            </h3>
            <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">
              {result.chainCount} chains
            </p>
            <p className="text-sm text-bark-500 dark:text-bark-400">
              Color repeat: {result.totalRepeat} stitches
              {chainAdjust !== 0 && ` (${chainAdjust >= 0 ? "+" : ""}${chainAdjust} adjustment)`}
            </p>
            {result.isAligned ? (
              <p className="text-sm text-sage-600 dark:text-sage-400 font-medium">
                ✅ Colors should pool into vertical columns!
              </p>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Colors may not align perfectly. Try adjusting +1 or -1.
              </p>
            )}
          </div>

          {/* Visual grid preview */}
          <div>
            <p className="label">Pooling Preview</p>
            <div className="rounded-xl overflow-hidden border border-cream-300 dark:border-bark-600 inline-block max-w-full overflow-x-auto">
              {result.grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex">
                  {row.map((color, colIdx) => (
                    <div
                      key={colIdx}
                      style={{ backgroundColor: color, width: "12px", height: "8px" }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-bark-400 dark:text-bark-500 mt-1">
              Each cell = 1 stitch. Columns of the same color = successful pooling.
            </p>
          </div>
        </>
      )}

      {/* Tips */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">💡 Color Pooling Tips</h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Measure carefully.</strong> Work 10+ stitches in each color section and count. Consistency matters.</li>
          <li><strong>Gauge affects pooling.</strong> Changing hook size shifts stitch count per color, which changes the pattern.</li>
          <li><strong>Moss stitch (SC, CH1, skip 1)</strong> is the most popular pooling stitch because it creates clean columns.</li>
          <li><strong>Use the adjust buttons</strong> to try ±1 or ±2 chains — small changes make a big difference.</li>
          <li><strong>Every skein is slightly different.</strong> Even the same dye lot may have slight color length variations.</li>
        </ul>
      </div>
    </div>
  );
}
