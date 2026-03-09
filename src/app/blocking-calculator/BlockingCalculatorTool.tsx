"use client";

import { useState, useMemo } from "react";
import StickyResult from "@/components/StickyResult";

// ── FIBER DATA ────────────────────────────────────────────────────

interface FiberInfo {
  label: string;
  methods: string[];
  warning: string;
  instructions: string[];
}

const FIBERS: Record<string, FiberInfo> = {
  "wool-superwash": {
    label: "Wool (superwash)",
    methods: ["Wet block"],
    warning: "",
    instructions: ["wet"],
  },
  "wool-nonsuperwash": {
    label: "Wool (non-superwash)",
    methods: ["Wet block", "Spray block"],
    warning: "Use COOL water only — hot water felts non-superwash wool.",
    instructions: ["wet", "spray"],
  },
  alpaca: {
    label: "Alpaca",
    methods: ["Spray block"],
    warning: "Avoid wet blocking — alpaca stretches significantly when saturated and may not spring back.",
    instructions: ["spray"],
  },
  cashmere: {
    label: "Cashmere",
    methods: ["Spray block"],
    warning: "Handle gently — cashmere is delicate when wet.",
    instructions: ["spray"],
  },
  mohair: {
    label: "Mohair",
    methods: ["Spray block"],
    warning: "Spray blocking preserves mohair's signature halo. Wet blocking can flatten it.",
    instructions: ["spray"],
  },
  silk: {
    label: "Silk",
    methods: ["Spray block", "Careful wet block"],
    warning: "Silk can water-spot. Test on a swatch first.",
    instructions: ["spray", "wet"],
  },
  cotton: {
    label: "Cotton",
    methods: ["Wet block", "Steam block"],
    warning: "",
    instructions: ["wet", "steam"],
  },
  linen: {
    label: "Linen",
    methods: ["Wet block", "Steam block"],
    warning: "Linen softens beautifully with repeated wet blocking.",
    instructions: ["wet", "steam"],
  },
  bamboo: {
    label: "Bamboo",
    methods: ["Wet block"],
    warning: "Check yarn label — some bamboo blends have special care requirements.",
    instructions: ["wet"],
  },
  acrylic: {
    label: "Acrylic",
    methods: ["Spray block", "Wet block"],
    warning: "NEVER steam acrylic — heat permanently damages the fibers (\"kills\" them). The change is irreversible.",
    instructions: ["spray", "wet"],
  },
  nylon: {
    label: "Nylon",
    methods: ["Spray block", "Cold wet block"],
    warning: "Use cold water only for wet blocking nylon.",
    instructions: ["spray", "wet"],
  },
  "acrylic-wool": {
    label: "Acrylic/wool blend",
    methods: ["Spray block", "Wet block"],
    warning: "Treat as acrylic — NEVER steam. The acrylic content will be permanently damaged by heat.",
    instructions: ["spray", "wet"],
  },
};

const METHOD_STEPS: Record<string, { title: string; steps: string[] }> = {
  wet: {
    title: "Wet Blocking",
    steps: [
      "Fill a basin with cool/lukewarm water and a small amount of wool wash.",
      "Submerge your piece and gently press to saturate (do not agitate).",
      "Soak for 20\u201330 minutes.",
      "Drain and gently press water out (never wring).",
      "Roll in a clean towel to remove excess moisture.",
      "Pin to blocking mats at your target dimensions.",
      "Let dry completely (12\u201348 hours).",
    ],
  },
  spray: {
    title: "Spray Blocking",
    steps: [
      "Pin your piece to blocking mats at your target dimensions.",
      "Spray thoroughly with water until damp (not soaked).",
      "Let dry completely.",
    ],
  },
  steam: {
    title: "Steam Blocking",
    steps: [
      "Pin your piece to blocking mats at your target dimensions.",
      "Hold a steam iron 1\u20132 inches above the fabric.",
      "Steam evenly \u2014 never touch the iron directly to the fabric.",
      "Let cool and dry completely.",
    ],
  },
};

// ── FEASIBILITY ───────────────────────────────────────────────────

function getFeasibility(pct: number): { label: string; color: string; note: string } {
  const abs = Math.abs(pct);
  if (abs < 5) {
    return {
      label: "Easy",
      color: "text-sage-600 dark:text-sage-400",
      note: "Most fibers will hold this with no issues.",
    };
  }
  if (abs <= 15) {
    return {
      label: "Moderate",
      color: "text-amber-600 dark:text-amber-400",
      note: "Natural fibers yes, synthetics unlikely to hold.",
    };
  }
  if (abs <= 30) {
    return {
      label: "Significant",
      color: "text-orange-600 dark:text-orange-400",
      note: "Wool lace yes, most others no.",
    };
  }
  return {
    label: "Very Aggressive",
    color: "text-rose-600 dark:text-rose-400",
    note: "May not be achievable \u2014 consider reknitting/recrocheting to size.",
  };
}

// ── COMPONENT ─────────────────────────────────────────────────────

export default function BlockingCalculatorTool() {
  const [fiberType, setFiberType] = useState("");
  const [currentWidth, setCurrentWidth] = useState("");
  const [currentLength, setCurrentLength] = useState("");
  const [targetWidth, setTargetWidth] = useState("");
  const [targetLength, setTargetLength] = useState("");

  const result = useMemo(() => {
    if (!fiberType) return null;
    const cw = parseFloat(currentWidth) || 0;
    const cl = parseFloat(currentLength) || 0;
    const tw = parseFloat(targetWidth) || 0;
    const tl = parseFloat(targetLength) || 0;

    const fiber = FIBERS[fiberType];
    if (!fiber) return null;

    const hasStretch = cw > 0 && tw > 0 && cl > 0 && tl > 0;

    let widthStretchPct = 0;
    let lengthStretchPct = 0;
    if (hasStretch) {
      widthStretchPct = ((tw - cw) / cw) * 100;
      lengthStretchPct = ((tl - cl) / cl) * 100;
    }

    return {
      fiber,
      hasStretch,
      widthStretchPct,
      lengthStretchPct,
      widthFeasibility: getFeasibility(widthStretchPct),
      lengthFeasibility: getFeasibility(lengthStretchPct),
    };
  }, [fiberType, currentWidth, currentLength, targetWidth, targetLength]);

  const stickySummary = result
    ? result.hasStretch
      ? `${result.fiber.methods[0]} \u2022 W: ${result.widthStretchPct >= 0 ? "+" : ""}${result.widthStretchPct.toFixed(1)}% \u2022 L: ${result.lengthStretchPct >= 0 ? "+" : ""}${result.lengthStretchPct.toFixed(1)}%`
      : result.fiber.methods[0]
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-400 dark:text-bark-500">
        Select your fiber type and enter your current and target dimensions to get blocking recommendations with stretch feasibility ratings.
      </p>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="label">Fiber Type</label>
          <select
            value={fiberType}
            onChange={(e) => setFiberType(e.target.value)}
            className="input"
          >
            <option value="">Select fiber type...</option>
            {Object.entries(FIBERS).map(([key, fiber]) => (
              <option key={key} value={key}>
                {fiber.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
            <p className="font-medium text-bark-700 dark:text-cream-200 text-sm">Current Dimensions (inches)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Width</label>
                <input
                  type="number"
                  value={currentWidth}
                  onChange={(e) => setCurrentWidth(e.target.value)}
                  placeholder="e.g. 48"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label text-xs">Length</label>
                <input
                  type="number"
                  value={currentLength}
                  onChange={(e) => setCurrentLength(e.target.value)}
                  placeholder="e.g. 58"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-sage-50 dark:bg-sage-900/10 rounded-xl">
            <p className="font-medium text-sage-700 dark:text-sage-300 text-sm">Target Dimensions (inches)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Width</label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(e.target.value)}
                  placeholder="e.g. 50"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="label text-xs">Length</label>
                <input
                  type="number"
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value)}
                  placeholder="e.g. 60"
                  className="input"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <StickyResult summary={stickySummary} visible={!!result}>
        {result && (
          <div className="result-card space-y-5">
            <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              Blocking Recommendation
            </h3>

            {/* Recommended methods */}
            <div>
              <p className="text-sm font-medium text-bark-600 dark:text-cream-300 mb-1">
                Recommended method{result.fiber.methods.length > 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.fiber.methods.map((method) => (
                  <span
                    key={method}
                    className="inline-block px-3 py-1.5 bg-sage-100 dark:bg-sage-900/20 text-sage-700 dark:text-sage-300 rounded-lg text-sm font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Fiber warning */}
            {result.fiber.warning && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Warning:</strong> {result.fiber.warning}
                </p>
              </div>
            )}

            {/* Stretch feasibility */}
            {result.hasStretch && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-bark-600 dark:text-cream-300">Stretch Analysis:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {result.widthStretchPct >= 0 ? "+" : ""}{result.widthStretchPct.toFixed(1)}%
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">Width stretch</p>
                    <p className={`text-sm font-medium mt-1 ${result.widthFeasibility.color}`}>
                      {result.widthFeasibility.label}
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                      {result.widthFeasibility.note}
                    </p>
                  </div>
                  <div className="p-3 bg-cream-100 dark:bg-bark-800 rounded-xl">
                    <p className="text-2xl font-bold text-bark-800 dark:text-cream-100">
                      {result.lengthStretchPct >= 0 ? "+" : ""}{result.lengthStretchPct.toFixed(1)}%
                    </p>
                    <p className="text-sm text-bark-500 dark:text-bark-400">Length stretch</p>
                    <p className={`text-sm font-medium mt-1 ${result.lengthFeasibility.color}`}>
                      {result.lengthFeasibility.label}
                    </p>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">
                      {result.lengthFeasibility.note}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step-by-step instructions */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-bark-600 dark:text-cream-300">Step-by-Step Instructions:</p>
              {result.fiber.instructions.map((methodKey) => {
                const method = METHOD_STEPS[methodKey];
                if (!method) return null;
                return (
                  <div key={methodKey} className="p-4 bg-cream-50 dark:bg-bark-800/50 rounded-xl">
                    <p className="font-medium text-bark-700 dark:text-cream-200 text-sm mb-2">
                      {method.title}
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-sm text-bark-600 dark:text-cream-300">
                      {method.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-bark-400 dark:text-bark-500 italic">
              Always swatch to confirm blocking results before blocking your full project.
            </p>
          </div>
        )}
      </StickyResult>

      {/* Fiber Reference Table */}
      <div className="result-card mt-8">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-3">
          Fiber Blocking Reference
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-300 dark:border-bark-600">
                <th className="text-left py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Fiber</th>
                <th className="text-left py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Recommended Method</th>
                <th className="text-left py-2 px-3 text-bark-600 dark:text-cream-300 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
              {Object.values(FIBERS).map((fiber) => (
                <tr key={fiber.label}>
                  <td className="py-2 px-3 text-bark-700 dark:text-cream-200 font-medium whitespace-nowrap">
                    {fiber.label}
                  </td>
                  <td className="py-2 px-3 text-bark-600 dark:text-cream-300">
                    {fiber.methods.join(", ")}
                  </td>
                  <td className="py-2 px-3 text-bark-500 dark:text-bark-400 text-xs">
                    {fiber.warning || "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
