"use client";

import { useMemo, useState } from "react";
import ResultShareButton from "@/components/ResultShareButton";
import StickyResult from "@/components/StickyResult";
import useToolCompletion from "@/lib/useToolCompletion";
import { RAGLAN_CHECKPOINT_LIMITS, buildRaglanBodyCheckpoint } from "@/lib/raglan-plan.mjs";

interface RaglanCheckpointSuccess {
  ok: true;
  stitchesPerInch: number;
  rawBodyStitches: number;
  bodyStitches: number;
  stitchMultiple: number;
  modeledBodyCircumference: number;
}

interface RaglanCheckpointFailure { ok: false; error: string }
type RaglanCheckpointOutcome = RaglanCheckpointSuccess | RaglanCheckpointFailure;

export default function RaglanCalculatorTool() {
  const [finishedBodyCircumference, setFinishedBodyCircumference] = useState("");
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeSpan, setGaugeSpan] = useState("4");
  const [stitchMultiple, setStitchMultiple] = useState("1");

  const outcome = useMemo<RaglanCheckpointOutcome>(() => buildRaglanBodyCheckpoint({
    finishedBodyCircumference: Number(finishedBodyCircumference),
    gaugeStitches: Number(gaugeStitches),
    gaugeSpan: Number(gaugeSpan),
    stitchMultiple: Number(stitchMultiple),
  }) as RaglanCheckpointOutcome, [finishedBodyCircumference, gaugeSpan, gaugeStitches, stitchMultiple]);
  const hasRequiredInput = finishedBodyCircumference !== "" || gaugeStitches !== "";
  const result = outcome.ok ? outcome : null;
  const error = hasRequiredInput && !outcome.ok ? outcome.error : "";
  useToolCompletion("raglan-calculator", result);

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-500 dark:text-bark-400">
        The available inputs support a finished-body stitch-count checkpoint only. They cannot determine a
        neckline cast-on, section distribution, increase schedule, yoke depth, underarm split, or garment fit.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="raglan-body-circumference" className="label">Finished body circumference (in)</label>
          <input id="raglan-body-circumference" type="number" className="input"
            value={finishedBodyCircumference} onChange={(event) => setFinishedBodyCircumference(event.target.value)}
            min={RAGLAN_CHECKPOINT_LIMITS.minimumCircumference}
            max={RAGLAN_CHECKPOINT_LIMITS.maximumCircumference} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="raglan-gauge-stitches" className="label">Gauge stitches</label>
          <input id="raglan-gauge-stitches" type="number" className="input" value={gaugeStitches}
            onChange={(event) => setGaugeStitches(event.target.value)} min="0.01"
            max={RAGLAN_CHECKPOINT_LIMITS.maximumGaugeStitches} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="raglan-gauge-span" className="label">Measured over (in)</label>
          <input id="raglan-gauge-span" type="number" className="input" value={gaugeSpan}
            onChange={(event) => setGaugeSpan(event.target.value)} min="0.01"
            max={RAGLAN_CHECKPOINT_LIMITS.maximumGaugeSpan} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="raglan-stitch-multiple" className="label">Required body multiple</label>
          <input id="raglan-stitch-multiple" type="number" className="input" value={stitchMultiple}
            onChange={(event) => setStitchMultiple(event.target.value)} min="1"
            max={RAGLAN_CHECKPOINT_LIMITS.maximumMultiple} step="1" inputMode="numeric" />
        </div>
      </div>
      {error ? <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}
      <StickyResult summary={result ? `${result.bodyStitches} body stitches` : ""} visible={Boolean(result)}>
        {result ? (
          <div className="result-card space-y-4" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Finished-body checkpoint</h3>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.bodyStitches} stitches</p>
              </div>
              <ResultShareButton toolSlug="raglan-calculator" toolName="Raglan finished-body checkpoint" />
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-bark-500">Unrounded count</dt><dd className="font-semibold">{result.rawBodyStitches.toFixed(2)}</dd></div>
              <div><dt className="text-bark-500">Rounded to multiple</dt><dd className="font-semibold">{result.stitchMultiple}</dd></div>
              <div><dt className="text-bark-500">Modeled body circumference</dt><dd className="font-semibold">{result.modeledBodyCircumference.toFixed(2)} in</dd></div>
              <div><dt className="text-bark-500">Entered stitch gauge</dt><dd className="font-semibold">{result.stitchesPerInch.toFixed(2)} sts/in</dd></div>
            </dl>
            <p className="text-xs text-bark-500 dark:text-bark-400">
              This is not a neck cast-on, yoke schedule, split calculation, or fit recommendation. Use a tested
              raglan pattern and a representative blocked swatch for the construction and fitting decisions.
            </p>
          </div>
        ) : null}
      </StickyResult>
    </div>
  );
}
