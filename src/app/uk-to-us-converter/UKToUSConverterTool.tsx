"use client";

import { useState, useMemo } from "react";

interface TermPair {
  uk: string;
  us: string;
  note?: string;
}

// Order matters: longer phrases first to avoid partial replacements
const TERM_MAP: TermPair[] = [
  { uk: "double treble crochet", us: "treble crochet", note: "dtr → tr" },
  { uk: "half treble crochet", us: "half double crochet", note: "htr → hdc" },
  { uk: "treble crochet", us: "double crochet", note: "tr → dc" },
  { uk: "double crochet", us: "single crochet", note: "dc → sc" },
  { uk: "triple treble", us: "double treble", note: "ttr → dtr" },
  { uk: "quadruple treble", us: "triple treble", note: "qtr → ttr" },
  // Abbreviations
  { uk: "dtr", us: "tr" },
  { uk: "htr", us: "hdc" },
  { uk: "tr", us: "dc" },
  { uk: "dc", us: "sc" },
  { uk: "ttr", us: "dtr" },
  { uk: "qtr", us: "ttr" },
  // Other terms
  { uk: "tension", us: "gauge" },
  { uk: "tension square", us: "gauge swatch" },
  { uk: "miss", us: "skip" },
  { uk: "yarn round hook", us: "yarn over", note: "yrh → yo" },
  { uk: "yrh", us: "yo" },
  { uk: "yoh", us: "yo" },
  { uk: "wool over hook", us: "yarn over" },
  { uk: "cast off", us: "bind off" },
  { uk: "work straight", us: "work even" },
  // Vintage terms
  { uk: "wool over", us: "yarn over", note: "Vintage term" },
  { uk: "wool forward", us: "yarn forward", note: "Vintage term" },
  { uk: "wool round needle", us: "yarn over", note: "Vintage knitting" },
];

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

function convertPattern(text: string, direction: "uk-to-us" | "us-to-uk"): string {
  let result = text;
  const pairs = TERM_MAP.map((t) =>
    direction === "uk-to-us" ? { from: t.uk, to: t.us } : { from: t.us, to: t.uk }
  );

  for (const pair of pairs) {
    const escaped = pair.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    result = result.replace(regex, (match) => {
      if (match === match.toUpperCase()) return pair.to.toUpperCase();
      if (match[0] === match[0].toUpperCase())
        return pair.to.charAt(0).toUpperCase() + pair.to.slice(1);
      return pair.to;
    });
  }

  return result;
}

export default function UKToUSConverterTool() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"uk-to-us" | "us-to-uk">("uk-to-us");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return convertPattern(input, direction);
  }, [input, direction]);

  const changesCount = useMemo(() => {
    if (!input.trim() || !output) return 0;
    let count = 0;
    const words1 = input.split(/\s+/);
    const words2 = output.split(/\s+/);
    for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
      if (words1[i] !== words2[i]) count++;
    }
    return count;
  }, [input, output]);

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
      <div className="flex gap-2">
        <button
          onClick={() => setDirection("uk-to-us")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            direction === "uk-to-us"
              ? "bg-sage-600 text-white"
              : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
          }`}
        >
          🇬🇧 UK → 🇺🇸 US
        </button>
        <button
          onClick={() => setDirection("us-to-uk")}
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
          <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
            {direction === "uk-to-us" ? "Paste UK pattern" : "Paste US pattern"}
          </label>
          <button
            onClick={() =>
              setInput(direction === "uk-to-us" ? exampleUK : convertPattern(exampleUK, "uk-to-us"))
            }
            className="text-xs text-sage-600 dark:text-sage-400 hover:underline"
          >
            Try example
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "uk-to-us"
              ? "Paste your UK pattern text here...\n\nExample: 1dc in each st, miss 1, 3tr in next st..."
              : "Paste your US pattern text here...\n\nExample: 1sc in each st, skip 1, 3dc in next st..."
          }
          className="w-full h-40 bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-4 text-sm text-bark-700 dark:text-cream-300 placeholder-bark-400 dark:placeholder-bark-500 resize-none focus:outline-none focus:ring-2 focus:ring-sage-500/40"
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
              {direction === "uk-to-us" ? "US version" : "UK version"}
              {changesCount > 0 && (
                <span className="ml-2 text-sage-600 dark:text-sage-400">
                  ({changesCount} term{changesCount !== 1 ? "s" : ""} converted)
                </span>
              )}
            </label>
            <button
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
          The same stitch names mean different things in UK and US crochet. A UK double crochet is a
          US single crochet. A UK treble is a US double crochet. Every stitch name is shifted by one
          position, which makes following foreign patterns confusing without a reference.
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          This converter handles the full chain of conversions automatically. Paste an entire pattern
          and every term gets swapped — including abbreviations like dc, htr, tr, and dtr. It also
          catches non-stitch differences like &ldquo;tension&rdquo; vs &ldquo;gauge&rdquo; and
          &ldquo;miss&rdquo; vs &ldquo;skip.&rdquo;
        </p>
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">
          Vintage Pattern Terms
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Older patterns from books like the Reader&apos;s Digest Complete Guide to Needlework use
          terms like &ldquo;wool over&rdquo; instead of &ldquo;yarn over,&rdquo; &ldquo;wool
          forward&rdquo; instead of &ldquo;yarn forward,&rdquo; and &ldquo;wool round needle&rdquo;
          for yarn over in knitting. This converter handles those too.
        </p>
      </div>
    </div>
  );
}
