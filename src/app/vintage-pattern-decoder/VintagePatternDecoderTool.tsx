"use client";

import { useState, useRef, useEffect } from "react";

// ── PDF.JS CDN ─────────────────────────────────────────────────────
const PDFJS_VERSION = "3.11.174";
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

// ── TYPES ─────────────────────────────────────────────────────────

interface LookupEntry {
  label: string;
  patterns: string[];
  modern: string;
  note: string;
  category: string;
}

interface TextSegment {
  type: "text" | "sub";
  content: string;
  original?: string;
}

interface TermMatch {
  label: string;
  modern: string;
  note: string;
  category: string;
  count: number;
  examples: string[];
}

interface Warning {
  text: string;
  note: string;
}

interface DecodeResult {
  segments: TextSegment[];
  terms: TermMatch[];
  warnings: Warning[];
  era: string | null;
}

type UploadMsg = { kind: "ok" | "warn" | "err"; text: string };

type PdfjsLib = {
  getDocument: (opts: { data: ArrayBuffer }) => {
    promise: Promise<{
      numPages: number;
      getPage: (n: number) => Promise<{
        getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
      }>;
    }>;
  };
  GlobalWorkerOptions: { workerSrc: string };
};

type PdfjsWindow = Window & { pdfjsLib?: PdfjsLib };

// ── LOOKUP TABLE ──────────────────────────────────────────────────
// Longest / most-specific patterns listed first within each group
// so that "double treble crochet" matches before "treble crochet".

const LOOKUP: LookupEntry[] = [
  // ── UK → US Crochet ─────────────────────────────────────────────
  {
    label: "Double Treble Crochet",
    patterns: ["\\bdouble\\s+treble\\s+crochet\\b", "\\bdtr\\b"],
    modern: "treble crochet (tr)",
    note: "UK 'double treble crochet' = US 'treble crochet'",
    category: "UK → US Crochet",
  },
  {
    label: "Half Treble Crochet",
    patterns: [
      "\\bhalf\\s+treble\\s+crochet\\b",
      "\\bhalf\\s+treble\\b",
      "\\bhtr\\b",
    ],
    modern: "half double crochet (hdc)",
    note: "UK 'half treble' = US 'half double crochet'",
    category: "UK → US Crochet",
  },
  {
    label: "Treble Crochet",
    patterns: ["\\btreble\\s+crochet\\b"],
    modern: "double crochet (dc)",
    note: "UK 'treble crochet' = US 'double crochet'",
    category: "UK → US Crochet",
  },
  {
    label: "Treble",
    patterns: ["\\btreble\\b"],
    modern: "double crochet (dc)",
    note: "UK 'treble' = US 'double crochet'",
    category: "UK → US Crochet",
  },
  {
    label: "Double Crochet",
    patterns: ["\\bdouble\\s+crochet\\b"],
    modern: "single crochet (sc)",
    note: "UK 'double crochet' = US 'single crochet'",
    category: "UK → US Crochet",
  },
  {
    label: "Miss (skip stitch)",
    patterns: ["\\bmiss\\b"],
    modern: "skip",
    note: "UK/vintage 'miss' = US 'skip'",
    category: "UK → US Crochet",
  },

  // ── UK → US Knitting / General ──────────────────────────────────
  {
    label: "Wool Round Needle",
    patterns: ["\\bwool\\s+round\\s+needle\\b"],
    modern: "yarn over (yo)",
    note: "Vintage UK term for yarn over",
    category: "UK → US Knitting",
  },
  {
    label: "Wool Forward",
    patterns: ["\\bwool\\s+forward\\b"],
    modern: "yarn over (yo)",
    note: "Vintage UK term for yarn over before a knit stitch",
    category: "UK → US Knitting",
  },
  {
    label: "Wool Over",
    patterns: ["\\bwool\\s+over\\b"],
    modern: "yarn over (yo)",
    note: "Vintage UK term for yarn over",
    category: "UK → US Knitting",
  },
  {
    label: "Work Straight",
    patterns: ["\\bwork\\s+straight\\b"],
    modern: "work even",
    note: "UK 'work straight' = US 'work even' (no shaping)",
    category: "UK → US",
  },
  {
    label: "Cast Off",
    patterns: ["\\bcast\\s+off\\b"],
    modern: "bind off",
    note: "UK 'cast off' = US 'bind off'",
    category: "UK → US Knitting",
  },
  {
    label: "Tension",
    patterns: ["\\btension\\b"],
    modern: "gauge",
    note: "UK 'tension' = US 'gauge'",
    category: "UK → US",
  },

  // ── Vintage Abbreviations ────────────────────────────────────────
  {
    label: "Wl Fwd / Wf (Yarn Forward)",
    patterns: ["\\bwl\\.?\\s*fwd\\.?\\b", "\\bwf\\.?\\b"],
    modern: "yarn forward (yf)",
    note: "Bring yarn to front between needles; used before a purl or decorative slip",
    category: "Vintage Abbreviation",
  },
  {
    label: "Wl Bk / Wb (Yarn Back)",
    patterns: ["\\bwl\\.?\\s*bk\\.?\\b", "\\bwb\\.?\\b"],
    modern: "yarn back (yb)",
    note: "Take yarn to back between needles; used before a knit stitch",
    category: "Vintage Abbreviation",
  },
  {
    label: "PSSO",
    patterns: ["\\bpsso\\.?\\b"],
    modern: "pass slipped stitch over (psso)",
    note: "After slipping a stitch and working a decrease, pass the slipped stitch over",
    category: "Vintage Abbreviation",
  },
  {
    label: "TBL (Through Back Loop)",
    patterns: ["\\btbl\\.?\\b"],
    modern: "through back loop (tbl)",
    note: "Insert needle or hook through the back loop only, twisting the stitch",
    category: "Vintage Abbreviation",
  },
  {
    label: "M1 (Make 1 Increase)",
    patterns: ["\\bm\\.?1\\b"],
    modern: "make 1 (m1)",
    note: "Lift the horizontal bar between stitches and work into it to add a stitch",
    category: "Vintage Abbreviation",
  },
  {
    label: "Sl1 (Slip 1)",
    patterns: ["\\bsl\\.?1\\b"],
    modern: "slip 1 (sl1)",
    note: "Slip one stitch from left to right needle or hook without working it",
    category: "Vintage Abbreviation",
  },
  {
    label: "Rep from *",
    patterns: ["\\brep\\.?\\s+from\\s*\\*", "\\brepeat\\s+from\\s*\\*"],
    modern: "repeat from *",
    note: "Work the instructions between asterisk markers again",
    category: "Vintage Abbreviation",
  },
  {
    label: "Inc (Increase)",
    patterns: ["\\binc\\.?\\b"],
    modern: "increase (inc)",
    note: "Work into front and back of same stitch to add one stitch",
    category: "Vintage Abbreviation",
  },
  {
    label: "Dec (Decrease)",
    patterns: ["\\bdec\\.?\\b"],
    modern: "decrease (dec)",
    note: "Work two stitches together to remove one stitch",
    category: "Vintage Abbreviation",
  },
  {
    label: "Alt (Alternate)",
    patterns: ["\\balt\\.?\\b"],
    modern: "alternate",
    note: "Work on alternate (every other) rows or rounds",
    category: "Vintage Abbreviation",
  },
  {
    label: "Cont (Continue)",
    patterns: ["\\bcont\\.?\\b"],
    modern: "continue",
    note: "Continue working in the established pattern",
    category: "Vintage Abbreviation",
  },
  {
    label: "Rem (Remaining)",
    patterns: ["\\brem\\.?\\b"],
    modern: "remaining",
    note: "Stitches left after completing the current instruction",
    category: "Vintage Abbreviation",
  },
  {
    label: "Beg (Beginning)",
    patterns: ["\\bbeg\\.?\\b"],
    modern: "beginning",
    note: "Start of the row, round, or pattern section",
    category: "Vintage Abbreviation",
  },
  {
    label: "Approx (Approximately)",
    patterns: ["\\bapprox\\.?\\b"],
    modern: "approximately",
    note: "Not an exact measurement; use as a guide",
    category: "Vintage Abbreviation",
  },
];

// ── ERA DETECTION ─────────────────────────────────────────────────

function detectEra(text: string): string | null {
  const hasVeryOldUK =
    /\b(wool\s+over|wool\s+forward|wool\s+round\s+needle)\b/i.test(text);
  const hasOldUKAbbrev =
    /\b(wl\.?\s*fwd\.?|wl\.?\s*bk\.?|wf\.?|wb\.?)\b/i.test(text);
  const hasUKTerms =
    /\b(tension|treble|cast\s+off|work\s+straight|miss|double\s+crochet)\b/i.test(
      text
    );
  const hasOldNeedles = /\bno\.?\s*\d+\b/i.test(text);
  const hasOunces = /\b\d+\s*oz(s)?\b/i.test(text);
  const hasPsso = /\bpsso\b/i.test(text);

  if (hasVeryOldUK) {
    return "Likely a UK pattern from the 1940s–1960s. 'Wool over / wool forward / wool round needle' was the standard term before 'yarn over' was adopted by UK publishers in the late 1960s.";
  }
  if (hasOldUKAbbrev && hasUKTerms) {
    return "Likely a UK pattern from the 1960s–1970s. The abbreviations 'wl.fwd' and 'wl.bk' were common in UK leaflets and booklets of this era.";
  }
  if (hasUKTerms && (hasOldNeedles || hasOunces)) {
    return "Likely a UK pattern, possibly 1960s–1980s, based on UK terminology and vintage measurements (needle numbers / yarn in ounces).";
  }
  if (hasUKTerms) {
    return "UK knitting or crochet terminology detected. This appears to be a UK-origin pattern.";
  }
  if ((hasPsso || hasOldUKAbbrev) && (hasOldNeedles || hasOunces)) {
    return "Likely a vintage US or UK knitting pattern from the 1950s–1970s based on abbreviation style and measurements.";
  }
  return null;
}

// ── CORE DECODE LOGIC ─────────────────────────────────────────────

function runDecode(text: string): DecodeResult {
  const allMatches: {
    start: number;
    end: number;
    entry: LookupEntry;
    matchedText: string;
  }[] = [];

  for (const entry of LOOKUP) {
    for (const pat of entry.patterns) {
      const re = new RegExp(pat, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        allMatches.push({
          start: m.index,
          end: m.index + m[0].length,
          entry,
          matchedText: m[0],
        });
      }
    }
  }

  allMatches.sort(
    (a, b) =>
      a.start - b.start || b.end - b.start - (a.end - a.start)
  );

  const chosen: typeof allMatches = [];
  let cursor = 0;
  for (const m of allMatches) {
    if (m.start >= cursor) {
      chosen.push(m);
      cursor = m.end;
    }
  }

  const segments: TextSegment[] = [];
  let pos = 0;
  for (const m of chosen) {
    if (m.start > pos) {
      segments.push({ type: "text", content: text.slice(pos, m.start) });
    }
    segments.push({
      type: "sub",
      content: m.entry.modern,
      original: m.matchedText,
    });
    pos = m.end;
  }
  if (pos < text.length) {
    segments.push({ type: "text", content: text.slice(pos) });
  }

  const termMap = new Map<string, TermMatch>();
  for (const m of chosen) {
    const key = m.entry.label;
    const existing = termMap.get(key);
    if (existing) {
      existing.count++;
      const ex = m.matchedText.toLowerCase();
      if (!existing.examples.includes(ex)) existing.examples.push(ex);
    } else {
      termMap.set(key, {
        label: m.entry.label,
        modern: m.entry.modern,
        note: m.entry.note,
        category: m.entry.category,
        count: 1,
        examples: [m.matchedText.toLowerCase()],
      });
    }
  }
  const terms = Array.from(termMap.values());

  const warnings: Warning[] = [];

  const needleRe = /\bno\.?\s*(\d+)\b/gi;
  let nm: RegExpExecArray | null;
  const seenNeedles = new Set<string>();
  while ((nm = needleRe.exec(text)) !== null) {
    const key = nm[0].toLowerCase().replace(/\s+/g, " ");
    if (!seenNeedles.has(key)) {
      seenNeedles.add(key);
      warnings.push({
        text: `Needle/hook size: "${nm[0]}"`,
        note: `Old UK needle numbers run in reverse of US sizes — UK No. 14 = 2.0 mm (very fine), UK No. 1 = 7.5 mm (large). Cross-reference with a UK vintage needle conversion chart before starting.`,
      });
    }
  }

  if (
    /\bsize\s+\d+\b/i.test(text) &&
    /\b(needle|hook)\b/i.test(text) &&
    seenNeedles.size === 0
  ) {
    warnings.push({
      text: "Size number near 'needle' or 'hook'",
      note: "Needle and hook size numbering differs between vintage UK, US, and metric systems. Cross-reference with a full conversion table before buying needles.",
    });
  }

  if (/\b\d+\s*oz(s)?\b/i.test(text)) {
    warnings.push({
      text: "Yarn amount listed in ounces",
      note: "Vintage patterns specify yarn in ounces of period-specific brands. Modern yarns vary in yardage per ounce. Verify the total yardage required before purchasing.",
    });
  }

  const hasUKSignals =
    /\b(tension|treble|cast\s+off|work\s+straight|miss)\b/i.test(text);
  if (hasUKSignals && /\bdc\b/i.test(text)) {
    warnings.push({
      text: "Abbreviation 'dc' in a likely UK pattern",
      note: "In UK patterns, 'dc' = double crochet = US single crochet (sc). In US patterns, 'dc' = double crochet. This decoder converts full-word terms automatically but leaves short abbreviations like 'dc' and 'tr' unchanged — verify which system the pattern uses.",
    });
  }
  if (hasUKSignals && /\btr\b/i.test(text)) {
    warnings.push({
      text: "Abbreviation 'tr' in a likely UK pattern",
      note: "In UK patterns, 'tr' = treble = US double crochet (dc). In US patterns, 'tr' = treble crochet. Verify which terminology system the abbreviation follows.",
    });
  }

  const era = detectEra(text);
  return { segments, terms, warnings, era };
}

// ── COMPONENT ─────────────────────────────────────────────────────

export default function VintagePatternDecoderTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [uploadMsg, setUploadMsg] = useState<UploadMsg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load pdf.js from CDN once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as PdfjsWindow).pdfjsLib) return;
    const script = document.createElement("script");
    script.src = PDFJS_CDN;
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as PdfjsWindow).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
      }
    };
    document.head.appendChild(script);
  }, []);

  function handleDecode() {
    if (!input.trim()) return;
    setResult(runDecode(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setUploadMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting same file

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = () => {
        setInput(reader.result as string);
        setResult(null);
        setUploadMsg({ kind: "ok", text: `Loaded: ${file.name}` });
      };
      reader.onerror = () => {
        setUploadMsg({ kind: "err", text: "Could not read the file. Please try again." });
      };
      reader.readAsText(file);
      return;
    }

    if (ext === "pdf") {
      const pdfjs = (window as PdfjsWindow).pdfjsLib;
      if (!pdfjs) {
        setUploadMsg({ kind: "err", text: "PDF support is still loading — please wait a moment and try again." });
        return;
      }
      setUploadMsg({ kind: "ok", text: "Extracting text from PDF…" });
      try {
        const buffer = await file.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        let text = "";
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const pageText = (content.items as Array<{ str?: string }>)
            .map((item) => item.str ?? "")
            .join(" ");
          text += pageText + "\n\n";
        }
        const extracted = text.trim();
        setInput(extracted);
        setResult(null);
        setUploadMsg({
          kind: "ok",
          text: `Loaded: ${file.name} (${doc.numPages} page${doc.numPages > 1 ? "s" : ""})`,
        });
      } catch {
        setUploadMsg({
          kind: "err",
          text: "Could not extract text from this PDF. The file may be image-based or password-protected. Copy the text manually.",
        });
      }
      return;
    }

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      setUploadMsg({
        kind: "warn",
        text: "Image OCR is not supported. Please type or copy the pattern text from the image manually into the text area below.",
      });
      return;
    }

    setUploadMsg({
      kind: "err",
      text: `Unsupported file type (.${ext}). Please upload a .txt or .pdf file.`,
    });
  }

  function handleCopyDecoded() {
    if (!result) return;
    const decoded = result.segments.map((s) => s.content).join("");
    navigator.clipboard.writeText(decoded);
  }

  function handleDownload() {
    if (!result) return;
    const decoded = result.segments.map((s) => s.content).join("");
    const blob = new Blob([decoded], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decoded-pattern.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const hasOutput = result !== null;

  return (
    <>
      {/* Print styles — only the decoded output renders when printing */}
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          .vintage-print-output,
          .vintage-print-output * { visibility: visible !important; }
          .vintage-print-output {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
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

        {/* ── File upload ─────────────────────────────────────────── */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload a pattern file"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-cream-300 dark:border-bark-600 bg-cream-50 dark:bg-bark-800/50 text-sm font-medium text-bark-600 dark:text-bark-300 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
            aria-describedby="upload-hint"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Pattern File
          </button>
          <p id="upload-hint" className="text-xs text-bark-400 dark:text-bark-500 mt-1.5">
            Supports .txt and .pdf files. Images (.jpg, .png) are not supported for OCR.
          </p>

          {/* Upload status message */}
          {uploadMsg && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-2 flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
                uploadMsg.kind === "ok"
                  ? "bg-sage-50 dark:bg-sage-900/10 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800"
                  : uploadMsg.kind === "warn"
                  ? "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}
            >
              <span aria-hidden="true" className="shrink-0 mt-px">
                {uploadMsg.kind === "ok" ? "✓" : uploadMsg.kind === "warn" ? "ℹ" : "✕"}
              </span>
              <span>{uploadMsg.text}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-bark-300 dark:text-bark-600 select-none">
          <span className="flex-1 border-t border-cream-200 dark:border-bark-700" aria-hidden="true" />
          or paste text below
          <span className="flex-1 border-t border-cream-200 dark:border-bark-700" aria-hidden="true" />
        </div>

        {/* ── Textarea input ──────────────────────────────────────── */}
        <div>
          <label className="label" htmlFor="vintage-pattern-input">
            Pattern text
          </label>
          <textarea
            id="vintage-pattern-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={
              "Paste your vintage pattern text here...\n\nExample:\nCast on 48 sts. Work 4 rows in moss st.\nRow 5: K2, wl fwd, sl1, wl bk, *k6, wl fwd, sl1, wl bk; rep from * to last 2 sts, k2.\nTension: 20 sts and 28 rows = 4 in on No. 9 needles.\nMaterials: 6 oz 4-ply wool."
            }
            className="w-full rounded-xl border border-cream-300 dark:border-bark-600 bg-white dark:bg-bark-800 px-3 py-2.5 text-sm font-mono text-bark-800 dark:text-cream-100 placeholder:text-bark-300 dark:placeholder:text-bark-500 focus:outline-none focus:ring-2 focus:ring-plum-300 dark:focus:ring-plum-700 resize-y leading-relaxed"
            aria-describedby="input-hint"
          />
          <p id="input-hint" className="text-xs text-bark-400 dark:text-bark-500 mt-1">
            Best with UK vintage knitting or crochet patterns from 1940–1990. Paste a row, section, or the full pattern.
          </p>
        </div>

        {/* ── Action buttons ─────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDecode}
            disabled={!input.trim()}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
          >
            🔍 Decode Pattern
          </button>
          {(input || hasOutput) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Results ────────────────────────────────────────────── */}
        {result && (
          <div className="vintage-print-output space-y-6">

            {/* Era detection banner */}
            {result.era && (
              <div className="p-4 bg-plum-50 dark:bg-plum-900/10 border border-plum-200 dark:border-plum-800 rounded-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-plum-500 dark:text-plum-400 mb-1">
                  🕰️ Era Detection
                </p>
                <p className="text-sm text-plum-700 dark:text-plum-300 leading-relaxed">
                  {result.era}
                </p>
              </div>
            )}

            {/* Decoded Pattern */}
            <div>
              <h2 className="section-heading">Decoded Pattern</h2>
              <div
                className="font-mono text-sm p-4 bg-cream-50 dark:bg-bark-800 border border-cream-300 dark:border-bark-600 rounded-xl whitespace-pre-wrap leading-relaxed"
                role="region"
                aria-label="Decoded pattern output"
              >
                {result.segments.length > 0 &&
                  result.segments.map((seg, i) =>
                    seg.type === "text" ? (
                      <span key={i}>{seg.content}</span>
                    ) : (
                      <mark
                        key={i}
                        className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded px-0.5 not-italic"
                        title={`Original: "${seg.original}"`}
                      >
                        {seg.content}
                      </mark>
                    )
                  )}
                {result.terms.length === 0 && (
                  <span className="text-bark-400 dark:text-bark-500 not-italic">
                    No vintage or UK terms were detected in this text.
                  </span>
                )}
              </div>
              {result.terms.length > 0 && (
                <p className="text-xs text-bark-400 dark:text-bark-500 mt-1.5 vintage-print-hide">
                  Substituted terms are highlighted in amber. Hover to see the original.
                </p>
              )}
            </div>

            {/* Terms Found table */}
            {result.terms.length > 0 && (
              <div>
                <h2 className="section-heading">
                  Terms Found ({result.terms.length})
                </h2>
                <div className="overflow-x-auto rounded-xl border border-cream-300 dark:border-bark-600">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-cream-100 dark:bg-bark-700 border-b border-cream-300 dark:border-bark-600">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-400">
                          Original
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-400">
                          Modern Equivalent
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-400 hidden sm:table-cell">
                          Note
                        </th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-400 hidden md:table-cell">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.terms.map((term, i) => (
                        <tr
                          key={i}
                          className="border-b last:border-b-0 border-cream-200 dark:border-bark-700 hover:bg-cream-50 dark:hover:bg-bark-800/50"
                        >
                          <td className="px-4 py-3 text-bark-700 dark:text-cream-200 font-medium font-mono text-xs">
                            {term.examples.join(" / ")}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded text-xs font-medium">
                              {term.modern}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-bark-500 dark:text-bark-400 text-xs hidden sm:table-cell leading-snug">
                            {term.note}
                          </td>
                          <td className="px-4 py-3 text-bark-400 dark:text-bark-500 text-xs text-right hidden md:table-cell">
                            {term.count > 1 ? `×${term.count}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div>
                <h2 className="section-heading">
                  ⚠️ Manual Verification Needed ({result.warnings.length})
                </h2>
                <div className="space-y-3">
                  {result.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl"
                    >
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">
                        {w.text}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                        {w.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches at all */}
            {result.terms.length === 0 &&
              result.warnings.length === 0 &&
              !result.era && (
                <div className="p-4 bg-sage-50 dark:bg-sage-900/10 border border-sage-200 dark:border-sage-800 rounded-xl">
                  <p className="text-sm text-sage-700 dark:text-sage-300 leading-relaxed">
                    No vintage or UK terms were detected. This pattern may already use modern US terminology, or it may contain terms outside this decoder&apos;s lookup table. Try pasting a section that includes gauge, stitch instructions, or material requirements.
                  </p>
                </div>
              )}

            {/* Export / share buttons */}
            {result.terms.length > 0 && (
              <div className="flex flex-wrap gap-2 vintage-print-hide">
                <button
                  type="button"
                  onClick={handleCopyDecoded}
                  className="btn-secondary text-sm"
                  aria-label="Copy decoded pattern text to clipboard"
                >
                  📋 Copy
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-secondary text-sm"
                  aria-label="Download decoded pattern as a text file"
                >
                  ⬇ Download .txt
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary text-sm"
                  aria-label="Print decoded pattern"
                >
                  🖨 Print
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Quick reference card ────────────────────────────────── */}
        <div className="result-card vintage-print-hide">
          <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-4">
            💡 What This Decoder Handles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="font-medium text-bark-600 dark:text-bark-300 mb-2">
                UK → US Crochet
              </p>
              <ul className="space-y-1 text-xs text-bark-500 dark:text-bark-400">
                <li>double crochet → single crochet (sc)</li>
                <li>treble → double crochet (dc)</li>
                <li>half treble → half double crochet (hdc)</li>
                <li>double treble → treble crochet (tr)</li>
                <li>miss → skip</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-bark-600 dark:text-bark-300 mb-2">
                UK → US Knitting
              </p>
              <ul className="space-y-1 text-xs text-bark-500 dark:text-bark-400">
                <li>tension → gauge</li>
                <li>cast off → bind off</li>
                <li>wool over / forward → yarn over (yo)</li>
                <li>work straight → work even</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-bark-600 dark:text-bark-300 mb-2">
                Vintage Abbreviations
              </p>
              <ul className="space-y-1 text-xs text-bark-500 dark:text-bark-400">
                <li>wl fwd → yarn forward (yf)</li>
                <li>wl bk → yarn back (yb)</li>
                <li>psso → pass slipped stitch over</li>
                <li>tbl → through back loop</li>
                <li>sl1, m1, inc, dec, alt, cont, rem, beg, approx</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-bark-600 dark:text-bark-300 mb-2">
                Flagged for Manual Check
              </p>
              <ul className="space-y-1 text-xs text-bark-500 dark:text-bark-400">
                <li>Needle/hook sizes (No. X)</li>
                <li>Yarn amounts in ounces</li>
                <li>&apos;dc&apos; / &apos;tr&apos; in UK-detected context</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
