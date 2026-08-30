"use client";

import { useMemo, useState } from "react";
import ResultShareButton from "@/components/ResultShareButton";
import StickyResult from "@/components/StickyResult";
import useToolCompletion from "@/lib/useToolCompletion";
import { SOCK_PLAN_LIMITS, buildSockCircumferencePlan } from "@/lib/sock-plan.mjs";

interface SockPlanSuccess {
  ok: true;
  stitchesPerInch: number;
  targetCircumference: number;
  rawStitches: number;
  adjustedStitches: number;
  stitchMultiple: number;
  modeledCircumference: number;
  effectiveEasePercent: number;
  halfRoundStitches: number | null;
}

interface SockPlanFailure { ok: false; error: string }
type SockPlanOutcome = SockPlanSuccess | SockPlanFailure;

export default function SockCalculatorTool() {
  const [footCircumference, setFootCircumference] = useState("");
  const [easePercent, setEasePercent] = useState("10");
  const [gaugeStitches, setGaugeStitches] = useState("");
  const [gaugeSpan, setGaugeSpan] = useState("4");
  const [stitchMultiple, setStitchMultiple] = useState("4");

  const outcome = useMemo<SockPlanOutcome>(() => buildSockCircumferencePlan({
    footCircumference: Number(footCircumference),
    easePercent: Number(easePercent),
    gaugeStitches: Number(gaugeStitches),
    gaugeSpan: Number(gaugeSpan),
    stitchMultiple: Number(stitchMultiple),
  }) as SockPlanOutcome, [easePercent, footCircumference, gaugeSpan, gaugeStitches, stitchMultiple]);
  const hasRequiredInput = footCircumference !== "" || gaugeStitches !== "";
  const result = outcome.ok ? outcome : null;
  const error = hasRequiredInput && !outcome.ok ? outcome.error : "";
  useToolCompletion("sock-calculator", result);

  return (
    <div className="space-y-6">
      <p className="text-sm text-bark-500 dark:text-bark-400">
        This bounded worksheet calculates only a circular stitch-count checkpoint. It does not infer a cuff,
        heel, gusset, toe, foot length, or pull-on fit.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="sock-foot-circumference" className="label">Foot circumference (in)</label>
          <input id="sock-foot-circumference" aria-label="Foot circumference in inches" type="number" className="input"
            value={footCircumference} onChange={(event) => setFootCircumference(event.target.value)}
            min={SOCK_PLAN_LIMITS.minimumCircumference} max={SOCK_PLAN_LIMITS.maximumCircumference}
            step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sock-ease-percent" className="label">Negative ease assumption (%)</label>
          <input id="sock-ease-percent" type="number" className="input" value={easePercent}
            onChange={(event) => setEasePercent(event.target.value)} min="0"
            max={SOCK_PLAN_LIMITS.maximumEasePercent} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sock-gauge-stitches" className="label">Gauge stitches</label>
          <input id="sock-gauge-stitches" type="number" className="input" value={gaugeStitches}
            onChange={(event) => setGaugeStitches(event.target.value)} min="0.01"
            max={SOCK_PLAN_LIMITS.maximumGaugeStitches} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sock-gauge-span" className="label">Measured over (in)</label>
          <input id="sock-gauge-span" type="number" className="input" value={gaugeSpan}
            onChange={(event) => setGaugeSpan(event.target.value)} min="0.01"
            max={SOCK_PLAN_LIMITS.maximumGaugeSpan} step="any" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sock-stitch-multiple" className="label">Required stitch multiple</label>
          <input id="sock-stitch-multiple" type="number" className="input" value={stitchMultiple}
            onChange={(event) => setStitchMultiple(event.target.value)} min="1"
            max={SOCK_PLAN_LIMITS.maximumMultiple} step="1" inputMode="numeric" />
        </div>
      </div>
      {error ? <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}
      <StickyResult summary={result ? `${result.adjustedStitches} stitches` : ""} visible={Boolean(result)}>
        {result ? (
          <div className="result-card space-y-4" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">Sock circumference checkpoint</h3>
                <p className="text-3xl font-bold text-bark-800 dark:text-cream-100">{result.adjustedStitches} stitches</p>
              </div>
              <ResultShareButton toolSlug="sock-calculator" toolName="Sock circumference checkpoint" />
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-bark-500">Unrounded count</dt><dd className="font-semibold">{result.rawStitches.toFixed(2)}</dd></div>
              <div><dt className="text-bark-500">Target after entered ease</dt><dd className="font-semibold">{result.targetCircumference.toFixed(2)} in</dd></div>
              <div><dt className="text-bark-500">Modeled circumference</dt><dd className="font-semibold">{result.modeledCircumference.toFixed(2)} in</dd></div>
              <div><dt className="text-bark-500">Effective ease after rounding</dt><dd className="font-semibold">{result.effectiveEasePercent.toFixed(1)}%</dd></div>
              {result.halfRoundStitches !== null ? (
                <div><dt className="text-bark-500">Half-round checkpoint</dt><dd className="font-semibold">{result.halfRoundStitches} stitches</dd></div>
              ) : null}
            </dl>
            <p className="text-xs text-bark-500 dark:text-bark-400">
              The count is rounded to the nearest entered multiple; exact halfway cases round upward. Compare the
              modeled circumference and effective ease with a tested sock pattern and representative finished swatch.
            </p>
          </div>
        ) : null}
      </StickyResult>
    </div>
  );
}
