"use client";

import { FormEvent, useState } from "react";
import { checkPattern, MAX_FREE_ROUNDS } from "@/lib/amigurumi-pattern-checker.mjs";

type CheckStatus = "correct" | "incorrect" | "calculated" | "unsupported";

interface RoundResult {
  round: number;
  source: string;
  status: CheckStatus;
  startingCount: number | null;
  consumed: number | null;
  created: number | null;
  writtenTotal: number | null;
  difference: number | null;
  notes: string[];
  message: string;
}

interface CheckResult {
  results: RoundResult[];
  error: string | null;
}

const EXAMPLES = {
  increase: {
    label: "Increase rounds",
    start: "30",
    pattern: "Round 7: (4 sc, inc) x 6 [36]\nRound 8: (5 sc, inc) x 6 [42]",
  },
  decrease: {
    label: "Find a wrong total",
    start: "48",
    pattern: "Round 12: (6 sc, dec) x 6 [42]\nRound 13: (5 sc, dec) x 6 [38]",
  },
  magicRing: {
    label: "Start at magic ring",
    start: "",
    pattern: "Rnd 1: 6 sc in magic ring [6]\nRnd 2: inc x 6 [12]\nRnd 3: (sc, inc) x 6 [18]",
  },
};

const STATUS_STYLES: Record<CheckStatus, string> = {
  correct: "border-sage-300 bg-sage-50 dark:border-sage-800 dark:bg-sage-950/30",
  incorrect: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30",
  calculated: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
  unsupported: "border-bark-300 bg-cream-100 dark:border-bark-600 dark:bg-bark-800",
};

const STATUS_LABELS: Record<CheckStatus, string> = {
  correct: "Correct",
  incorrect: "Needs review",
  calculated: "Calculated only",
  unsupported: "Not verified",
};

export default function AmigurumiPatternCheckerTool() {
  const [pattern, setPattern] = useState(EXAMPLES.increase.pattern);
  const [startingCount, setStartingCount] = useState(EXAMPLES.increase.start);
  const [checked, setChecked] = useState<CheckResult>(() =>
    checkPattern(EXAMPLES.increase.pattern, Number(EXAMPLES.increase.start)) as CheckResult,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedStart = startingCount.trim() === "" ? null : Number(startingCount);
    const validStart = typeof parsedStart === "number" && Number.isInteger(parsedStart) && parsedStart >= 0
      ? parsedStart
      : null;
    const result = checkPattern(pattern, validStart) as CheckResult;
    setChecked(result);
    if (typeof window.gtag === "function" && !result.error) {
      const resultCounts = result.results.reduce(
        (summary, round) => {
          summary[round.status] += 1;
          return summary;
        },
        { correct: 0, incorrect: 0, calculated: 0, unsupported: 0 },
      );
      window.gtag("event", "pattern_check_run", {
        round_count: result.results.length,
        correct_rounds: resultCounts.correct,
        incorrect_rounds: resultCounts.incorrect,
        calculated_rounds: resultCounts.calculated,
        unsupported_rounds: resultCounts.unsupported,
      });
    }
  }

  function loadExample(example: (typeof EXAMPLES)[keyof typeof EXAMPLES]) {
    setPattern(example.pattern);
    setStartingCount(example.start);
    const start = example.start === "" ? null : Number(example.start);
    setChecked(checkPattern(example.pattern, start) as CheckResult);
  }

  const counts = checked.results.reduce(
    (summary, result) => {
      summary[result.status] += 1;
      return summary;
    },
    { correct: 0, incorrect: 0, calculated: 0, unsupported: 0 },
  );

  return (
    <section className="space-y-6" aria-labelledby="checker-heading">
      <div className="rounded-2xl border border-bark-200 bg-white p-5 shadow-sm dark:border-bark-700 dark:bg-bark-800 sm:p-6">
        <div className="mb-5">
          <h2 id="checker-heading" className="text-xl font-bold text-bark-800 dark:text-cream-100">
            Check your round math
          </h2>
          <span className="mt-2 inline-flex rounded-full bg-plum-100 px-2.5 py-1 text-xs font-semibold text-plum-700">
            StitchProof preview
          </span>
          <p className="mt-2 text-sm leading-relaxed text-bark-500 dark:text-bark-400">
            Paste up to {MAX_FREE_ROUNDS} US-terminology rounds. The checker analyzes text in this browser only;
            it does not upload or save your pattern.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2" aria-label="Pattern examples">
          {Object.values(EXAMPLES).map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => loadExample(example)}
              className="min-h-11 rounded-lg border border-bark-200 px-3 py-2 text-sm font-medium text-bark-600 transition hover:border-sage-500 hover:text-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 dark:border-bark-600 dark:text-cream-300"
            >
              {example.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="starting-count" className="mb-2 block text-sm font-semibold text-bark-700 dark:text-cream-200">
              Stitches available before the first pasted round
            </label>
            <input
              id="starting-count"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={startingCount}
              onChange={(event) => setStartingCount(event.target.value)}
              placeholder="Not needed when the pattern starts with a magic ring"
              className="min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100"
              aria-describedby="starting-count-help"
            />
            <p id="starting-count-help" className="mt-2 text-xs leading-relaxed text-bark-500 dark:text-bark-400">
              Leave blank only when the first line creates its stitches in a magic ring.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="pattern-rounds" className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                Pattern rounds
              </label>
              <span className="text-xs text-bark-400">
                {pattern.split(/\r?\n/).filter((line) => line.trim()).length}/{MAX_FREE_ROUNDS} rounds
              </span>
            </div>
            <textarea
              id="pattern-rounds"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              rows={7}
              spellCheck={false}
              className="w-full rounded-xl border border-bark-300 bg-cream-50 px-4 py-3 font-mono text-sm leading-7 text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100"
              aria-describedby="pattern-help"
            />
            <p id="pattern-help" className="mt-2 text-xs leading-relaxed text-bark-500 dark:text-bark-400">
              One round per line. Example: <code>(5 sc, inc) x 6 [42]</code>. Include the written total in brackets or parentheses when available.
            </p>
          </div>

          <button type="submit" className="btn-primary min-h-12 w-full sm:w-auto">
            Check pattern math
          </button>
        </form>
      </div>

      <div aria-live="polite" aria-atomic="false" className="space-y-4">
        {checked.error ? (
          <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
            {checked.error}
          </div>
        ) : checked.results.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 text-xs font-semibold" aria-label="Check summary">
              <span className="rounded-full bg-sage-100 px-3 py-1.5 text-sage-800">{counts.correct} correct</span>
              <span className="rounded-full bg-rose-100 px-3 py-1.5 text-rose-800">{counts.incorrect} need review</span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-800">{counts.calculated} calculated only</span>
              <span className="rounded-full bg-bark-100 px-3 py-1.5 text-bark-700">{counts.unsupported} not verified</span>
            </div>

            {checked.results.map((result, index) => (
              <article key={`${result.round}-${index}`} className={`rounded-xl border p-4 sm:p-5 ${STATUS_STYLES[result.status]}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-bark-500">Round {result.round}</p>
                    <p className="mt-1 break-words font-mono text-sm text-bark-800 dark:text-cream-100">{result.source}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-bark-700 shadow-sm dark:bg-bark-900 dark:text-cream-200">
                    {STATUS_LABELS[result.status]}
                  </span>
                </div>

                {result.created != null ? (
                  <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div><dt className="text-xs text-bark-500">Starting count</dt><dd className="text-lg font-bold text-bark-800 dark:text-cream-100">{result.startingCount}</dd></div>
                    <div><dt className="text-xs text-bark-500">Consumed</dt><dd className="text-lg font-bold text-bark-800 dark:text-cream-100">{result.consumed}</dd></div>
                    <div><dt className="text-xs text-bark-500">Math total</dt><dd className="text-lg font-bold text-bark-800 dark:text-cream-100">{result.created}</dd></div>
                    <div><dt className="text-xs text-bark-500">Written total</dt><dd className="text-lg font-bold text-bark-800 dark:text-cream-100">{result.writtenTotal ?? "—"}</dd></div>
                  </dl>
                ) : null}

                <p className="mt-4 text-sm font-medium leading-relaxed text-bark-700 dark:text-cream-200">{result.message}</p>
                {result.notes.map((note) => (
                  <p key={note} className="mt-2 text-xs leading-relaxed text-bark-500 dark:text-bark-400">Note: {note}.</p>
                ))}
              </article>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}
