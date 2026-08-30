"use client";

import { useState, useMemo } from "react";
import { MAX_UK_US_TEXT_LENGTH, convertUkUsTerms } from "@/lib/uk-us-converter.mjs";

const REFERENCE_TABLE = [
  { uk: "Double crochet (dc)", us: "Single crochet (sc)" },
  { uk: "Half treble crochet (htr)", us: "Half double crochet (hdc)" },
  { uk: "Treble crochet (tr)", us: "Double crochet (dc)" },
  { uk: "Double treble (dtr)", us: "Treble crochet (tr)" },
  { uk: "Triple treble (ttr)", us: "Double treble (dtr)" },
  { uk: "Quadruple treble (qtr)", us: "Triple treble (ttr)" },
  { uk: "Tension", us: "Gauge" },
  { uk: "Tension square", us: "Gauge swatch" },
  { uk: "Miss", us: "Skip" },
  { uk: "Yarn round hook (yrh)", us: "Yarn over (yo)" },
  { uk: "Cast off", us: "Bind off" },
  { uk: "Work straight", us: "Work even" },
];

export default function UKToUSConverterTool() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"uk-to-us" | "us-to-uk">("uk-to-us");
  const [copied, setCopied] = useState(false);

  const conversion = useMemo(() => {
    if (!input.trim()) return null;
    return convertUkUsTerms(input, direction);
  }, [input, direction]);
  const output = conversion?.status === "ready" ? conversion.output : "";
  const replacementCount = conversion?.status === "ready" ? conversion.replacementCount : 0;
  const conversionError = conversion?.status === "invalid" ? conversion.message : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleUK = `Row 1: 1dc in 2nd ch from hook, 1dc in each ch to end. Turn.
Row 2: 1ch, miss first dc, 1htr in each dc to end, 1htr in turning ch. Turn.
Row 3: 2ch (counts as first tr), miss first htr, 1tr in each htr to end. Turn.
Check your tension: 15 sts x 10 rows = 10cm using a 4mm hook.`;

  return (
    <div className="space-y-6">
      {/* Direction toggle */}
      <div className="flex gap-2" role="group" aria-label="Conversion direction">
        <button
          type="button"
          onClick={() => setDirection("uk-to-us")}
          aria-pressed={direction === "uk-to-us"}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            direction === "uk-to-us"
              ? "bg-sage-600 text-white"
              : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
          }`}
        >
          🇬🇧 UK → 🇺🇸 US
        </button>
        <button
          type="button"
          onClick={() => setDirection("us-to-uk")}
          aria-pressed={direction === "us-to-uk"}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            direction === "us-to-uk"
              ? "bg-sage-600 text-white"
              : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
          }`}
        >
          🇺🇸 US → 🇬🇧 UK
        </button>
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="uk-us-source-text" className="text-sm font-medium text-bark-500 dark:text-bark-400">
            {direction === "uk-to-us" ? "UK crochet text" : "US crochet text"}
          </label>
          <button
            type="button"
            onClick={() => {
              const exampleUS = convertUkUsTerms(exampleUK, "uk-to-us");
              setInput(direction === "uk-to-us" || exampleUS.status !== "ready" ? exampleUK : exampleUS.output);
            }}
            className="text-xs text-sage-600 dark:text-sage-400 hover:underline"
          >
            Try example
          </button>
        </div>
        <textarea
          id="uk-us-source-text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_UK_US_TEXT_LENGTH}
          placeholder={
            direction === "uk-to-us"
              ? "Paste your UK pattern text here...\n\nExample: 1dc in each st, miss 1, 3tr in next st..."
              : "Paste your US pattern text here...\n\nExample: 1sc in each st, skip 1, 3dc in next st..."
          }
          className="w-full h-40 bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-4 text-sm text-bark-700 dark:text-cream-300 placeholder-bark-400 dark:placeholder-bark-500 resize-none focus:outline-none focus:ring-2 focus:ring-sage-500/40"
        />
        <p className="mt-1 text-right text-xs text-bark-400 dark:text-bark-500">
          {input.length.toLocaleString()} / {MAX_UK_US_TEXT_LENGTH.toLocaleString()} characters
        </p>
      </div>

      {conversionError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">
          {conversionError}
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {conversion?.status === "ready"
          ? `Conversion updated with ${replacementCount} mapped term${replacementCount === 1 ? "" : "s"} replaced.`
          : ""}
      </p>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-bark-500 dark:text-bark-400">
              {direction === "uk-to-us" ? "US-term output" : "UK-term output"}
              {replacementCount > 0 && (
                <span className="ml-2 text-sage-600 dark:text-sage-400">
                  ({replacementCount} mapped term{replacementCount !== 1 ? "s" : ""} replaced)
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-sage-600 dark:text-sage-400 hover:underline"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="bg-cream-100 dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-4 text-sm text-bark-700 dark:text-cream-300 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}

      {/* Reference Table */}
      <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-bark-200 dark:border-bark-700">
          <h2 className="font-bold text-bark-700 dark:text-cream-300">Quick Reference</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 dark:bg-bark-700">
                <th className="text-left px-5 py-2.5 font-semibold text-bark-700 dark:text-cream-300">
                  🇬🇧 UK Term
                </th>
                <th className="text-left px-5 py-2.5 font-semibold text-bark-700 dark:text-cream-300">
                  🇺🇸 US Term
                </th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_TABLE.map((row, i) => (
                <tr key={i} className="border-t border-bark-200 dark:border-bark-700">
                  <td className="px-5 py-2.5 text-bark-700 dark:text-cream-300">{row.uk}</td>
                  <td className="px-5 py-2.5 text-bark-700 dark:text-cream-300">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">
          Why UK and US Crochet Terms Are Different
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Some common stitch names mean different things in UK and US crochet. A UK double crochet is a
          US single crochet, while a UK treble crochet is a US double crochet. Check the source&rsquo;s
          terminology label and abbreviation key before replacing any text.
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          This tool replaces only the crochet abbreviations and listed legacy phrases in its reference
          map. It uses one pass, so replacement text is not converted again, and all non-mapped text is
          preserved. Review the source convention, stitch counts, gauge, and instructions yourself;
          this is not a complete pattern translation or validation.
        </p>
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">
          Vintage Pattern Terms
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          The mapping includes a small set of listed legacy phrases, such as &ldquo;wool over&rdquo; and
          &ldquo;wool forward.&rdquo; Other historical terms remain unchanged and need separate verification.
        </p>
      </div>
    </div>
  );
}
