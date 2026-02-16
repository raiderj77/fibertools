"use client";

import { useState, useMemo } from "react";

interface StitchType {
  key: string;
  name: string;
  abbr: string;
  startingInc: number;
  chainHeight: number;
  startNote: string;
}

const STITCH_TYPES: StitchType[] = [
  {
    key: "sc",
    name: "Single Crochet",
    abbr: "sc",
    startingInc: 6,
    chainHeight: 1,
    startNote: "Magic ring, 6 sc into ring. Pull tight.",
  },
  {
    key: "hdc",
    name: "Half Double Crochet",
    abbr: "hdc",
    startingInc: 8,
    chainHeight: 2,
    startNote:
      "Magic ring, ch 2, 7 hdc into ring. Pull tight. (ch 2 counts as first hdc = 8 total)",
  },
  {
    key: "dc",
    name: "Double Crochet",
    abbr: "dc",
    startingInc: 12,
    chainHeight: 3,
    startNote:
      "Magic ring, ch 3, 11 dc into ring. Pull tight. (ch 3 counts as first dc = 12 total)",
  },
  {
    key: "tr",
    name: "Treble Crochet",
    abbr: "tr",
    startingInc: 16,
    chainHeight: 4,
    startNote:
      "Magic ring, ch 4, 15 tr into ring. Pull tight. (ch 4 counts as first tr = 16 total)",
  },
];

function generatePattern(stitch: StitchType, rows: number): string[] {
  const inc = stitch.startingInc;
  const abbr = stitch.abbr;
  const lines: string[] = [];

  for (let r = 1; r <= rows; r++) {
    const totalSt = inc * r;

    if (r === 1) {
      lines.push(`Round 1: ${stitch.startNote} (${totalSt} ${abbr})`);
    } else if (r === 2) {
      lines.push(`Round ${r}: 2 ${abbr} in each st around. (${totalSt} ${abbr})`);
    } else {
      const normalBetween = r - 2;
      const stagger = r % 2 === 0;
      if (stagger) {
        lines.push(
          `Round ${r}: *${abbr} ${normalBetween}, 2 ${abbr} in next st* repeat ${inc} times. (${totalSt} ${abbr})`
        );
      } else {
        lines.push(
          `Round ${r}: *2 ${abbr} in next st, ${abbr} ${normalBetween}* repeat ${inc} times. (${totalSt} ${abbr})`
        );
      }
    }
  }

  return lines;
}

export default function CircleCalculatorTool() {
  const [stitchKey, setStitchKey] = useState("sc");
  const [rows, setRows] = useState(8);
  const [copied, setCopied] = useState(false);

  const stitch = STITCH_TYPES.find((s) => s.key === stitchKey)!;

  const pattern = useMemo(() => {
    return generatePattern(stitch, rows);
  }, [stitch, rows]);

  const totalStitches = stitch.startingInc * rows;

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Stitch Type */}
      <div>
        <label className="text-sm font-medium text-bark-500 dark:text-bark-400 mb-2 block">
          Stitch Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STITCH_TYPES.map((st) => (
            <button
              key={st.key}
              onClick={() => setStitchKey(st.key)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                stitchKey === st.key
                  ? "bg-sage-600 text-white"
                  : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rounds Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
            Number of Rounds
          </label>
          <span className="text-sm font-bold text-bark-700 dark:text-cream-300">{rows}</span>
        </div>
        <input
          type="range"
          min={3}
          max={30}
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="w-full accent-sage-600"
        />
        <div className="flex justify-between text-xs text-bark-400 dark:text-bark-500 mt-1">
          <span>3 rounds</span>
          <span>30 rounds</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-3 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">Rounds</p>
          <p className="text-lg font-bold text-bark-700 dark:text-cream-300">{rows}</p>
        </div>
        <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-3 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">Final Count</p>
          <p className="text-lg font-bold text-bark-700 dark:text-cream-300">{totalStitches}</p>
        </div>
        <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-3 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">Inc/Round</p>
          <p className="text-lg font-bold text-sage-600 dark:text-sage-400">{stitch.startingInc}</p>
        </div>
      </div>

      {/* Pattern Output */}
      <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-bark-200 dark:border-bark-700 flex items-center justify-between">
          <h2 className="font-bold text-bark-700 dark:text-cream-300">Pattern Instructions</h2>
          <button
            onClick={handleCopy}
            className="text-xs text-sage-600 dark:text-sage-400 hover:underline"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="p-5 space-y-2">
          {pattern.map((line, i) => (
            <p
              key={`${stitchKey}-${rows}-${i}`}
              className="text-sm text-bark-700 dark:text-cream-300 font-mono leading-relaxed"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-cream-100 dark:bg-bark-700 border border-bark-200 dark:border-bark-600 rounded-xl p-4">
        <p className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-1">
          Tips for flat circles
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          If your circle cups or bowls, you need more increases — try going up one hook size. If it
          ruffles or waves, you have too many increases — go down a hook size. This pattern staggers
          increases automatically to avoid visible lines that create a hexagonal shape.
        </p>
      </div>

      {/* SEO Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">
          How Crochet Circle Increases Work
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          A flat circle needs a consistent number of increases per round based on the stitch height.
          Single crochet uses 6 increases per round, half double uses 8, double crochet uses 12, and
          treble uses 16. Taller stitches take up more vertical space, requiring more stitches to
          keep the circle flat.
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          The magic ring start gives you a tight, clean center. Each subsequent round adds the same
          number of increases, distributed evenly. Staggering the increase positions between rounds
          prevents visible lines and creates a truly round shape instead of a hexagon.
        </p>
      </div>
    </div>
  );
}
