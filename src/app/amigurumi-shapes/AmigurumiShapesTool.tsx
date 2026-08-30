"use client";

import { useMemo, useState } from "react";
import {
  AMIGURUMI_SHAPE_LIMITS,
  generateAmigurumiShapePlan,
} from "@/lib/amigurumi-shape-patterns.mjs";

type Shape = "sphere" | "cone" | "cylinder" | "oval";

const SHAPES: Array<{ key: Shape; name: string; description: string }> = [
  {
    key: "sphere",
    name: "Sphere count schedule",
    description: "Six-stitch increase rounds, a short widest section, then mirrored decrease counts.",
  },
  {
    key: "cone",
    name: "Stepped cone schedule",
    description: "Six increases on alternating rounds, with even rounds between them.",
  },
  {
    key: "cylinder",
    name: "Base and tube schedule",
    description: "A six-increase circular base followed by even rounds at the base stitch count.",
  },
  {
    key: "oval",
    name: "Oval-start schedule",
    description: "A foundation-chain start followed by six increases per expansion round across two end curves.",
  },
];

export default function AmigurumiShapesTool() {
  const [shape, setShape] = useState<Shape>("sphere");
  const [totalRounds, setTotalRounds] = useState(12);
  const [baseRounds, setBaseRounds] = useState(4);
  const [ovalChain, setOvalChain] = useState(6);
  const [ovalRounds, setOvalRounds] = useState(4);
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const plan = useMemo(() => generateAmigurumiShapePlan({
    shape,
    totalRounds,
    baseRounds,
    ovalChain,
    ovalRounds,
  }), [shape, totalRounds, baseRounds, ovalChain, ovalRounds]);
  const result = "lines" in plan ? plan : null;
  const selectedShape = SHAPES.find((item) => item.key === shape) ?? SHAPES[0];

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" onChangeCapture={() => setHasInteracted(true)}>
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Basic single-crochet count references</p>
        <p className="mt-1">
          These bounded schedules keep their written stitch totals arithmetically consistent. They do not
          determine a guaranteed sphere, cone, cylinder, or oval: yarn, hook, gauge, stitch height, increase
          placement, stuffing, joining, and finishing all affect the fabric.
        </p>
      </div>

      <fieldset>
        <legend className="label">Choose a basic count schedule</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SHAPES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { setShape(s.key); setHasInteracted(true); }}
              aria-pressed={shape === s.key}
              className={`min-h-11 rounded-xl border px-3 py-3 text-center text-sm font-medium ${shape === s.key ? "border-sage-600 bg-sage-600 text-white" : "border-bark-200 bg-white text-bark-700 hover:border-sage-400 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="text-sm text-bark-500 dark:text-bark-400">{selectedShape.description}</p>

      {shape === "oval" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <RangeControl
            id="shape-oval-chain"
            htmlFor="shape-oval-chain"
            label="Foundation chain"
            value={ovalChain}
            minimum={AMIGURUMI_SHAPE_LIMITS.minOvalChain}
            maximum={AMIGURUMI_SHAPE_LIMITS.maxOvalChain}
            onChange={setOvalChain}
          />
          <RangeControl
            id="shape-oval-rounds"
            htmlFor="shape-oval-rounds"
            label="Oval expansion rounds"
            value={ovalRounds}
            minimum={AMIGURUMI_SHAPE_LIMITS.minOvalRounds}
            maximum={AMIGURUMI_SHAPE_LIMITS.maxOvalRounds}
            onChange={setOvalRounds}
          />
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-5 ${shape === "cylinder" ? "sm:grid-cols-2" : ""}`}>
          <RangeControl
            id="shape-total-rounds"
            htmlFor="shape-total-rounds"
            label="Total numbered rounds"
            value={totalRounds}
            minimum={AMIGURUMI_SHAPE_LIMITS.minTotalRounds}
            maximum={AMIGURUMI_SHAPE_LIMITS.maxTotalRounds}
            onChange={setTotalRounds}
          />
          {shape === "cylinder" ? (
            <RangeControl
              id="shape-base-rounds"
              htmlFor="shape-base-rounds"
              label="Rounds used for the circular base"
              value={baseRounds}
              minimum={AMIGURUMI_SHAPE_LIMITS.minBaseRounds}
              maximum={AMIGURUMI_SHAPE_LIMITS.maxBaseRounds}
              onChange={setBaseRounds}
            />
          ) : null}
        </div>
      )}

      {!result && hasInteracted ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
          {"error" in plan ? plan.error : "Enter values within the supported limits."}
        </p>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {result ? `${shape} count reference updated${shape === "cylinder" ? ` with ${baseRounds} base rounds` : ""}: ${result.numberedRounds} numbered rounds. First: ${result.lines[0]}. Last: ${result.lines[result.lines.length - 1]}.` : ""}
      </p>

      {result ? (
        <section className="overflow-hidden rounded-xl border border-bark-200 bg-white dark:border-bark-700 dark:bg-bark-800" aria-labelledby="amigurumi-count-reference-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bark-200 px-5 py-3 dark:border-bark-700">
            <div>
              <h2 id="amigurumi-count-reference-heading" className="font-bold text-bark-700 dark:text-cream-300">Basic stitch-count reference</h2>
              <p className="text-xs text-bark-500 dark:text-bark-400">{result.numberedRounds} numbered {result.numberedRounds === 1 ? "round" : "rounds"}; US single-crochet abbreviations.</p>
            </div>
            <button type="button" onClick={handleCopy} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-sage-600 hover:bg-sage-50 dark:text-sage-400 dark:hover:bg-sage-950/20">
              Copy reference
            </button>
            <span className="sr-only" role="status" aria-live="polite">{copied ? "Count reference copied." : ""}</span>
          </div>
          <div className="space-y-1.5 p-5">
            {result.lines.map((line: string, index: number) => (
              <p key={`${shape}-${index}`} className="font-mono text-sm leading-relaxed text-bark-700 dark:text-cream-300">
                {line}
              </p>
            ))}
          </div>
          <div className="border-t border-bark-200 px-5 py-3 text-xs text-bark-500 dark:border-bark-700 dark:text-bark-400">
            inc = two single crochets in one stitch; dec = one single crochet worked across two stitches.
            Verify placement, gauge, structure, stuffing, and closure before treating the reference as project instructions.
          </div>
        </section>
      ) : null}
    </div>
  );
}

function RangeControl({
  id,
  htmlFor,
  label,
  value,
  minimum,
  maximum,
  onChange,
}: {
  id: string;
  htmlFor: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-bark-500 dark:text-bark-400">{label}</label>
        <output htmlFor={id} className="text-sm font-bold text-bark-700 dark:text-cream-300">{value}</output>
      </div>
      <input
        id={id}
        type="range"
        min={minimum}
        max={maximum}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full accent-sage-600"
      />
      <p className="mt-1 text-xs text-bark-400 dark:text-bark-500">Supported range: {minimum}–{maximum}.</p>
    </div>
  );
}
