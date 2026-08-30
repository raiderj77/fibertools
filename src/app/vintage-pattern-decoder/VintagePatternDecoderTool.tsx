"use client";

import { useState } from "react";
import {
  MAX_VINTAGE_PATTERN_TEXT_LENGTH,
  decodeVintagePattern,
} from "@/lib/vintage-pattern-decoder.mjs";

type SourceConvention = "unknown" | "us" | "uk";
interface ReadyResult {
  status: "ready";
  convention: SourceConvention;
  output: string;
  segments: Array<{
    type: "text" | "sub";
    content: string;
    original?: string;
  }>;
  substitutions: Array<{
    label: string;
    replacement: string;
    note: string;
    count: number;
    examples: string[];
  }>;
  substitutionCount: number;
  signals: Array<{ title: string; note: string }>;
}
type CopyStatus = "idle" | "success" | "error";

const CONVENTION_OPTIONS: Array<{
  value: SourceConvention;
  label: string;
  description: string;
}> = [
  {
    value: "unknown",
    label: "Unknown / not established",
    description: "Review possible signals without changing the text.",
  },
  {
    value: "us",
    label: "US terms",
    description: "Preserve the pattern exactly as entered.",
  },
  {
    value: "uk",
    label: "UK terms",
    description: "Map the supported UK terms to US wording.",
  },
];

export default function VintagePatternDecoderTool() {
  const [input, setInput] = useState("");
  const [convention, setConvention] = useState<SourceConvention>("unknown");
  const [result, setResult] = useState<ReadyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  function resetResult() {
    setResult(null);
    setError(null);
    setCopyStatus("idle");
  }

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextInput = event.currentTarget.value.slice(
      0,
      MAX_VINTAGE_PATTERN_TEXT_LENGTH + 1,
    );
    setInput(nextInput);
    resetResult();
    if (nextInput.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH) {
      setError(
        `Pattern text must be ${MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()} characters or fewer. Shorten the text before reviewing it.`,
      );
    }
  }

  function handleConventionChange(nextConvention: SourceConvention) {
    setConvention(nextConvention);
    resetResult();
  }

  function handleReview() {
    const reviewed = decodeVintagePattern(input, convention);
    setCopyStatus("idle");

    if (reviewed.status === "invalid") {
      setResult(null);
      setError(reviewed.message);
      return;
    }

    setError(null);
    setResult(reviewed as ReadyResult);
  }

  function handleClear() {
    setInput("");
    setConvention("unknown");
    resetResult();
  }

  async function handleCopy() {
    if (!result) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(result.output);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "reviewed-pattern.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const remainingCharacters = MAX_VINTAGE_PATTERN_TEXT_LENGTH - input.length;
  const inputTooLong = input.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH;
  const resultSummary = result
    ? result.convention === "unknown"
      ? "No substitutions were made because the source convention is not established."
      : result.convention === "us"
        ? "No substitutions were made. US mode preserves the pattern text."
        : result.substitutionCount > 0
          ? `${result.substitutionCount} supported UK term${result.substitutionCount === 1 ? " was" : "s were"} mapped to US wording. Verify each change against the pattern key.`
          : "No supported UK terms were found. The pattern text was preserved."
    : null;

  return (
    <>
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          .vintage-print-output,
          .vintage-print-output * { visibility: visible !important; }
          .vintage-print-output {
            position: fixed;
            inset: 0;
            padding: 24px;
            background: #fff;
            color: #000;
            font-family: Georgia, serif;
          }
          .vintage-print-output mark {
            background: #fef3c7 !important;
            color: #78350f !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .vintage-print-hide { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        <fieldset>
          <legend className="label">Source terminology</legend>
          <p id="source-convention-help" className="mb-3 text-xs leading-relaxed text-bark-500 dark:text-bark-400">
            Choose UK only when the pattern key, publisher, or another reliable source establishes that convention.
          </p>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            aria-describedby="source-convention-help"
          >
            {CONVENTION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                  convention === option.value
                    ? "border-plum-400 bg-plum-50 dark:border-plum-600 dark:bg-plum-900/20"
                    : "border-cream-300 bg-white hover:border-plum-300 dark:border-bark-600 dark:bg-bark-800 dark:hover:border-plum-700"
                }`}
              >
                <span className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="source-convention"
                    value={option.value}
                    checked={convention === option.value}
                    onChange={() => handleConventionChange(option.value)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-bark-500 dark:text-bark-400">
                      {option.description}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="vintage-pattern-input">
            Pattern text
          </label>
          <textarea
            id="vintage-pattern-input"
            value={input}
            onChange={handleInputChange}
            rows={10}
            placeholder="Paste a pattern excerpt here. Do not include account details, purchase records, or other private information."
            className="w-full resize-y rounded-xl border border-cream-300 bg-white px-3 py-2.5 font-mono text-sm leading-relaxed text-bark-800 placeholder:text-bark-300 focus:outline-none focus:ring-2 focus:ring-plum-300 dark:border-bark-600 dark:bg-bark-800 dark:text-cream-100 dark:placeholder:text-bark-500 dark:focus:ring-plum-700"
            aria-describedby="vintage-input-help vintage-character-count vintage-input-error"
            aria-invalid={inputTooLong}
          />
          <div className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-bark-400 dark:text-bark-500">
            <p id="vintage-input-help">Text only. Files and scanned images are not accepted.</p>
            <p id="vintage-character-count" aria-live="polite">
              {inputTooLong
                ? `Over the ${MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()}-character limit`
                : `${remainingCharacters.toLocaleString()} characters remaining`}
            </p>
          </div>
        </div>

        {error && (
          <p
            id="vintage-input-error"
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/10 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReview}
            disabled={!input.trim() || inputTooLong}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 active:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Review Pattern Text
          </button>
          {(input || result) && (
            <button type="button" onClick={handleClear} className="btn-secondary text-sm">
              Clear
            </button>
          )}
        </div>

        {result && (
          <div className="vintage-print-output space-y-6">
            <div>
              <h2 className="section-heading">
                {result.convention === "uk" ? "UK-to-US Review Output" : "Reviewed Pattern Text"}
              </h2>
              <p
                role="status"
                aria-live="polite"
                className="mb-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300"
              >
                {resultSummary}
              </p>
              <div
                className="whitespace-pre-wrap rounded-xl border border-cream-300 bg-cream-50 p-4 font-mono text-sm leading-relaxed text-bark-800 dark:border-bark-600 dark:bg-bark-800 dark:text-cream-100"
                role="region"
                aria-label="Reviewed pattern output"
              >
                {result.segments.map((segment, index) => (
                  segment.type === "sub" ? (
                    <mark
                      key={index}
                      className="rounded bg-amber-100 px-0.5 not-italic text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                      title={`Original: ${segment.original}`}
                    >
                      {segment.content}
                    </mark>
                  ) : (
                    <span key={index}>{segment.content}</span>
                  )
                ))}
              </div>
              {result.substitutionCount > 0 && (
                <p className="vintage-print-hide mt-1.5 text-xs text-bark-400 dark:text-bark-500">
                  Mapped terms are highlighted. Hover over a highlight to see the original text.
                </p>
              )}
            </div>

            {result.substitutions.length > 0 && (
              <div>
                <h2 className="section-heading">Mapped Terms ({result.substitutions.length})</h2>
                <div className="overflow-x-auto rounded-xl border border-cream-300 dark:border-bark-600">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-cream-300 bg-cream-100 dark:border-bark-600 dark:bg-bark-700">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-bark-400">Original</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-bark-400">US wording</th>
                        <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-bark-400 sm:table-cell">Review note</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-bark-400">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.substitutions.map((term) => (
                        <tr
                          key={term.label}
                          className="border-b border-cream-200 last:border-b-0 hover:bg-cream-50 dark:border-bark-700 dark:hover:bg-bark-800/50"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-medium text-bark-700 dark:text-cream-200">{term.examples.join(" / ")}</td>
                          <td className="px-4 py-3">
                            <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{term.replacement}</span>
                          </td>
                          <td className="hidden px-4 py-3 text-xs leading-snug text-bark-500 dark:text-bark-400 sm:table-cell">{term.note}</td>
                          <td className="px-4 py-3 text-right text-xs text-bark-500 dark:text-bark-400">{term.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <h2 className="section-heading">Possible Source Signals</h2>
              <p className="mb-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300">
                These clues can guide manual research, but they do not establish a pattern&apos;s age, country, or terminology convention.
              </p>
              {result.signals.length > 0 ? (
                <div className="space-y-3">
                  {result.signals.map((signal) => (
                    <div
                      key={signal.title}
                      className="rounded-xl border border-plum-200 bg-plum-50 p-4 dark:border-plum-800 dark:bg-plum-900/10"
                    >
                      <p className="mb-1 text-sm font-semibold text-plum-700 dark:text-plum-300">{signal.title}</p>
                      <p className="text-sm leading-relaxed text-plum-700 dark:text-plum-400">{signal.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-cream-300 bg-cream-50 p-4 text-sm text-bark-600 dark:border-bark-600 dark:bg-bark-800 dark:text-bark-300">
                  No supported source signals were found in this excerpt. This is not proof of a source convention or date.
                </p>
              )}
            </div>

            <div className="vintage-print-hide flex flex-wrap items-center gap-2">
              <button type="button" onClick={handleCopy} className="btn-secondary text-sm" aria-label="Copy reviewed pattern text to clipboard">
                Copy text
              </button>
              <button type="button" onClick={handleDownload} className="btn-secondary text-sm" aria-label="Download reviewed pattern as a text file">
                Download .txt
              </button>
              <button type="button" onClick={() => window.print()} className="btn-secondary text-sm" aria-label="Print reviewed pattern">
                Print
              </button>
              {copyStatus === "success" && (
                <span role="status" aria-live="polite" className="text-sm font-medium text-sage-700 dark:text-sage-300">Copied.</span>
              )}
              {copyStatus === "error" && (
                <span role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
                  Could not copy. Select the output text and copy it manually.
                </span>
              )}
            </div>
          </div>
        )}

        <div className="result-card vintage-print-hide">
          <h3 className="mb-3 font-semibold text-bark-700 dark:text-cream-200">What this review does</h3>
          <ul className="space-y-2 text-sm leading-relaxed text-bark-500 dark:text-bark-400">
            <li>Preserves every character when the source convention is unknown or US.</li>
            <li>Maps the supported CYC-documented UK crochet terms only when UK is selected.</li>
            <li>Flags possible wording, size, and yarn-weight clues without guessing an origin or era.</li>
            <li>Leaves pattern structure, stitch counts, sizing, and technique validation to manual review.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
