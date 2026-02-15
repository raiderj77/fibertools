"use client";

import { useState, useMemo } from "react";

// ── DATA ──────────────────────────────────────────────────────────

interface Abbreviation {
  abbr: string;
  full: string;
  craft: "knit" | "crochet" | "both";
  category: string;
  desc: string;
  ukEquiv?: string; // UK term if different
}

const ABBREVIATIONS: Abbreviation[] = [
  // Knitting basics
  { abbr: "K", full: "Knit", craft: "knit", category: "basic", desc: "Insert needle knitwise, wrap yarn, pull through." },
  { abbr: "P", full: "Purl", craft: "knit", category: "basic", desc: "Insert needle purlwise, wrap yarn, pull through." },
  { abbr: "St(s)", full: "Stitch(es)", craft: "both", category: "basic", desc: "One or more loops on the needle/hook." },
  { abbr: "RS", full: "Right Side", craft: "both", category: "basic", desc: "The public-facing side of your work." },
  { abbr: "WS", full: "Wrong Side", craft: "both", category: "basic", desc: "The back/inside of your work." },
  { abbr: "CO", full: "Cast On", craft: "knit", category: "basic", desc: "Creating initial stitches on the needle." },
  { abbr: "BO", full: "Bind Off", craft: "knit", category: "basic", desc: "Securing stitches to prevent unraveling. Also: cast off." },
  { abbr: "YO", full: "Yarn Over", craft: "knit", category: "increase", desc: "Wrap yarn around needle to create a new stitch and decorative hole." },
  { abbr: "SL", full: "Slip", craft: "knit", category: "basic", desc: "Move a stitch from left to right needle without working it." },
  { abbr: "SLST", full: "Slip Stitch", craft: "both", category: "basic", desc: "Knit: slip without working. Crochet: insert hook, pull through loop on hook." },
  { abbr: "PM", full: "Place Marker", craft: "both", category: "basic", desc: "Put a stitch marker on the needle/in the stitch." },
  { abbr: "SM", full: "Slip Marker", craft: "both", category: "basic", desc: "Move the marker from left to right needle." },
  { abbr: "Rep", full: "Repeat", craft: "both", category: "basic", desc: "Work the instructions again as directed." },
  { abbr: "Rnd", full: "Round", craft: "both", category: "basic", desc: "One complete pass when working in the round." },
  { abbr: "BOR", full: "Beginning of Round", craft: "both", category: "basic", desc: "The starting point marker when knitting in the round." },
  { abbr: "WPI", full: "Wraps Per Inch", craft: "both", category: "basic", desc: "Method to determine yarn weight by wrapping around a ruler." },
  { abbr: "Tog", full: "Together", craft: "both", category: "decrease", desc: "Work two or more stitches as one." },

  // Knitting increases
  { abbr: "M1", full: "Make 1", craft: "knit", category: "increase", desc: "Lift bar between stitches and knit into it. Invisible increase." },
  { abbr: "M1L", full: "Make 1 Left", craft: "knit", category: "increase", desc: "Left-leaning M1. Lift bar from front, knit through back." },
  { abbr: "M1R", full: "Make 1 Right", craft: "knit", category: "increase", desc: "Right-leaning M1. Lift bar from back, knit through front." },
  { abbr: "KFB", full: "Knit Front & Back", craft: "knit", category: "increase", desc: "Knit into front then back of same stitch. Creates a small bump." },
  { abbr: "PFB", full: "Purl Front & Back", craft: "knit", category: "increase", desc: "Purl into front then back of same stitch." },
  { abbr: "Inc", full: "Increase", craft: "both", category: "increase", desc: "Add one or more stitches. Method varies by pattern." },

  // Knitting decreases
  { abbr: "K2tog", full: "Knit 2 Together", craft: "knit", category: "decrease", desc: "Knit two stitches as one. Right-leaning decrease." },
  { abbr: "P2tog", full: "Purl 2 Together", craft: "knit", category: "decrease", desc: "Purl two stitches as one. Right-leaning decrease on RS." },
  { abbr: "SSK", full: "Slip Slip Knit", craft: "knit", category: "decrease", desc: "Slip 2 knitwise, knit together through back. Left-leaning decrease." },
  { abbr: "SSP", full: "Slip Slip Purl", craft: "knit", category: "decrease", desc: "Slip 2 knitwise, return, purl together through back." },
  { abbr: "SKPO", full: "Slip, Knit, Pass Over", craft: "knit", category: "decrease", desc: "Slip 1, knit 1, pass slipped stitch over. Left-leaning decrease." },
  { abbr: "SK2P", full: "Slip 1, K2tog, Pass Over", craft: "knit", category: "decrease", desc: "Double decrease. Slip 1, K2tog, pass slipped stitch over." },
  { abbr: "S2KP", full: "Slip 2, K1, Pass 2 Over", craft: "knit", category: "decrease", desc: "Centered double decrease." },
  { abbr: "Dec", full: "Decrease", craft: "both", category: "decrease", desc: "Remove one or more stitches. Method varies." },
  { abbr: "CDD", full: "Central Double Decrease", craft: "knit", category: "decrease", desc: "Slip 2 together, K1, pass slipped stitches over." },

  // Knitting texture
  { abbr: "Tbl", full: "Through Back Loop", craft: "knit", category: "texture", desc: "Work into the back leg of the stitch instead of the front." },
  { abbr: "Wyif", full: "With Yarn in Front", craft: "knit", category: "texture", desc: "Bring working yarn to front of work before next action." },
  { abbr: "Wyib", full: "With Yarn in Back", craft: "knit", category: "texture", desc: "Keep working yarn behind work before next action." },
  { abbr: "CN", full: "Cable Needle", craft: "knit", category: "texture", desc: "Short needle used to hold stitches for cables." },
  { abbr: "C4F", full: "Cable 4 Front", craft: "knit", category: "texture", desc: "Slip 2 to CN, hold front, K2, K2 from CN. Left-leaning cable." },
  { abbr: "C4B", full: "Cable 4 Back", craft: "knit", category: "texture", desc: "Slip 2 to CN, hold back, K2, K2 from CN. Right-leaning cable." },
  { abbr: "MB", full: "Make Bobble", craft: "knit", category: "texture", desc: "Work multiple stitches into one, then decrease back. Creates a 3D bump." },

  // Crochet basics
  { abbr: "CH", full: "Chain", craft: "crochet", category: "basic", desc: "Yarn over, pull through loop on hook. Foundation of most crochet.", ukEquiv: "CH" },
  { abbr: "SC", full: "Single Crochet", craft: "crochet", category: "basic", desc: "Insert hook, pull up loop, yarn over, pull through both loops.", ukEquiv: "DC (Double Crochet)" },
  { abbr: "HDC", full: "Half Double Crochet", craft: "crochet", category: "basic", desc: "YO, insert hook, pull up loop, YO, pull through all 3 loops.", ukEquiv: "HTR (Half Treble)" },
  { abbr: "DC", full: "Double Crochet", craft: "crochet", category: "basic", desc: "YO, insert hook, pull up loop, (YO, pull through 2) twice.", ukEquiv: "TR (Treble)" },
  { abbr: "TR", full: "Treble Crochet", craft: "crochet", category: "basic", desc: "YO twice, insert hook, pull up loop, (YO, pull through 2) three times.", ukEquiv: "DTR (Double Treble)" },
  { abbr: "DTR", full: "Double Treble", craft: "crochet", category: "basic", desc: "YO 3 times, work off 2 loops at a time, 4 times.", ukEquiv: "TTR (Triple Treble)" },
  { abbr: "SK", full: "Skip", craft: "crochet", category: "basic", desc: "Miss the next stitch. Also written as 'miss' in UK patterns." },
  { abbr: "SP", full: "Space", craft: "crochet", category: "basic", desc: "The gap/hole created by chains in the previous row." },
  { abbr: "FO", full: "Fasten Off", craft: "crochet", category: "basic", desc: "Cut yarn and pull through last loop to secure." },
  { abbr: "TC", full: "Turning Chain", craft: "crochet", category: "basic", desc: "Chain(s) at row start to reach working height. SC=1, DC=3, etc." },
  { abbr: "FLO", full: "Front Loop Only", craft: "crochet", category: "texture", desc: "Work into only the front loop of the stitch for a ridged effect." },
  { abbr: "BLO", full: "Back Loop Only", craft: "crochet", category: "texture", desc: "Work into only the back loop for ribbing effect." },

  // Crochet increases/decreases
  { abbr: "SC2tog", full: "SC 2 Together", craft: "crochet", category: "decrease", desc: "Insert hook in next st, pull up loop, repeat, YO pull through all 3." },
  { abbr: "DC2tog", full: "DC 2 Together", craft: "crochet", category: "decrease", desc: "Work 2 incomplete DC, YO pull through all loops." },
  { abbr: "Inc", full: "Increase (crochet)", craft: "crochet", category: "increase", desc: "Work 2 stitches into the same stitch." },
  { abbr: "Dec", full: "Decrease (crochet)", craft: "crochet", category: "decrease", desc: "Work 2 stitches together into one. Also: invDec (invisible decrease)." },
  { abbr: "InvDec", full: "Invisible Decrease", craft: "crochet", category: "decrease", desc: "Insert hook through front loops of next 2 sts, YO, pull through, YO, pull through 2. Neater than SC2tog." },

  // Crochet texture
  { abbr: "FPdc", full: "Front Post DC", craft: "crochet", category: "texture", desc: "YO, insert hook around front of post, work DC. Creates raised texture." },
  { abbr: "BPdc", full: "Back Post DC", craft: "crochet", category: "texture", desc: "YO, insert hook around back of post, work DC. Creates recessed texture." },
  { abbr: "PC", full: "Popcorn Stitch", craft: "crochet", category: "texture", desc: "Work 5 DC in same st, remove hook, insert in first DC, pull last loop through." },
  { abbr: "CL", full: "Cluster", craft: "crochet", category: "texture", desc: "Multiple incomplete stitches joined at top. Various configurations." },
  { abbr: "SH", full: "Shell", craft: "crochet", category: "texture", desc: "Multiple stitches worked into the same stitch or space." },
  { abbr: "V-St", full: "V-Stitch", craft: "crochet", category: "texture", desc: "(DC, CH 1, DC) all in the same stitch. Creates a V shape." },
  { abbr: "Puff", full: "Puff Stitch", craft: "crochet", category: "texture", desc: "(YO, insert hook, pull up loop) multiple times, YO pull through all." },
  { abbr: "MR", full: "Magic Ring", craft: "crochet", category: "basic", desc: "Adjustable starting ring for working in the round. Also: magic circle." },

  // Colorwork
  { abbr: "MC", full: "Main Color", craft: "both", category: "colorwork", desc: "The primary/dominant color in the project." },
  { abbr: "CC", full: "Contrast Color", craft: "both", category: "colorwork", desc: "Secondary color(s). CC1, CC2, etc. for multiple contrasts." },
  { abbr: "CC1", full: "Contrast Color 1", craft: "both", category: "colorwork", desc: "First contrast color when using multiple colors." },

  // Finishing
  { abbr: "Sew", full: "Sew/Seam", craft: "both", category: "finishing", desc: "Join pieces using a yarn needle and mattress stitch or whip stitch." },
  { abbr: "Weave", full: "Weave in Ends", craft: "both", category: "finishing", desc: "Thread tail through yarn needle and work into fabric to secure." },
  { abbr: "Block", full: "Blocking", craft: "both", category: "finishing", desc: "Wet or steam the finished piece to set stitches and shape." },
  { abbr: "Gauge", full: "Gauge/Tension", craft: "both", category: "basic", desc: "Number of stitches and rows per inch/cm. UK: tension." },
];

const CATEGORIES = ["all", "basic", "increase", "decrease", "texture", "colorwork", "finishing"];
const CRAFTS = ["all", "knit", "crochet"] as const;

// ── COMPONENT ─────────────────────────────────────────────────────

type ViewMode = "glossary" | "translator";

export default function AbbreviationGlossaryTool() {
  const [search, setSearch] = useState("");
  const [craft, setCraft] = useState<"all" | "knit" | "crochet">("all");
  const [category, setCategory] = useState("all");
  const [showUK, setShowUK] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("glossary");
  const [patternText, setPatternText] = useState("");

  const filtered = useMemo(() => {
    return ABBREVIATIONS.filter((a) => {
      if (craft !== "all" && a.craft !== "both" && a.craft !== craft) return false;
      if (category !== "all" && a.category !== category) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          a.abbr.toLowerCase().includes(q) ||
          a.full.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          (a.ukEquiv && a.ukEquiv.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, craft, category]);

  // Pattern translator: find abbreviations in pasted text
  const translatedWords = useMemo(() => {
    if (!patternText.trim()) return [];
    const words = patternText.split(/[\s,.*()[\]]+/).filter(Boolean);
    return words.map((word) => {
      const clean = word.replace(/[0-9]+$/, "").toUpperCase();
      const match = ABBREVIATIONS.find(
        (a) => a.abbr.toUpperCase() === clean || a.abbr.toUpperCase().replace(/[()]/g, "") === clean
      );
      return { word, match };
    });
  }, [patternText]);

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
        <button type="button" onClick={() => setViewMode("glossary")}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${viewMode === "glossary" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
          📖 Glossary
        </button>
        <button type="button" onClick={() => setViewMode("translator")}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${viewMode === "translator" ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"}`}>
          🔍 Pattern Translator
        </button>
      </div>

      {viewMode === "glossary" ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder='Search: "SSK", "double crochet", "decrease"…'
                className="input pl-10" />
            </div>

            <select value={craft} onChange={(e) => setCraft(e.target.value as typeof craft)} className="select w-auto">
              <option value="all">All crafts</option>
              <option value="knit">🪡 Knitting</option>
              <option value="crochet">🧶 Crochet</option>
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="select w-auto">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400 cursor-pointer">
              <input type="checkbox" checked={showUK} onChange={(e) => setShowUK(e.target.checked)} className="rounded border-bark-300" />
              Show UK terms
            </label>
          </div>

          <p className="text-xs text-bark-400 dark:text-bark-500">{filtered.length} terms found</p>

          {/* Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200 w-20">Abbr.</th>
                    <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">Full Name</th>
                    {showUK && <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">UK Term</th>}
                    <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200">Craft</th>
                    <th className="text-left py-3 px-3 font-semibold text-bark-700 dark:text-cream-200 hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {filtered.map((a, i) => (
                    <tr key={i} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-sage-700 dark:text-sage-400">{a.abbr}</td>
                      <td className="py-3 px-3 font-medium text-bark-800 dark:text-cream-100">{a.full}</td>
                      {showUK && <td className="py-3 px-3 text-amber-600 dark:text-amber-400 text-xs">{a.ukEquiv || "–"}</td>}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          a.craft === "knit" ? "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300"
                          : a.craft === "crochet" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-cream-200 text-bark-600 dark:bg-bark-700 dark:text-bark-300"
                        }`}>
                          {a.craft === "both" ? "Both" : a.craft === "knit" ? "Knit" : "Crochet"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-bark-500 dark:text-bark-400 text-xs hidden sm:table-cell max-w-xs">{a.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-bark-400 dark:text-bark-500">No matching abbreviations found.</p>
              <button type="button" onClick={() => { setSearch(""); setCraft("all"); setCategory("all"); }}
                className="text-sage-600 dark:text-sage-400 text-sm mt-2 hover:underline">Clear filters</button>
            </div>
          )}

          <div className="text-center">
            <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print glossary</button>
          </div>
        </>
      ) : (
        /* Pattern Translator */
        <div className="space-y-4">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Paste a line from your pattern below. We&apos;ll highlight every abbreviation and show what it means.
          </p>
          <textarea
            value={patternText}
            onChange={(e) => setPatternText(e.target.value)}
            placeholder="e.g. K2, P1, YO, SSK, K to end. Rep from * to last 3 sts, P3."
            className="input min-h-[80px] resize-y"
          />

          {translatedWords.length > 0 && (
            <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {translatedWords.map((tw, i) => (
                  <span
                    key={i}
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      tw.match
                        ? "bg-sage-100 dark:bg-sage-900/30 text-sage-800 dark:text-sage-200 font-medium border border-sage-300 dark:border-sage-700"
                        : "text-bark-500 dark:text-bark-400"
                    }`}
                    title={tw.match ? `${tw.match.full}: ${tw.match.desc}` : ""}
                  >
                    {tw.word}
                  </span>
                ))}
              </div>

              <div className="space-y-2 border-t border-cream-300 dark:border-bark-600 pt-3">
                {translatedWords
                  .filter((tw) => tw.match)
                  .filter((tw, i, arr) => arr.findIndex((t) => t.match?.abbr === tw.match?.abbr) === i)
                  .map((tw) => (
                    <div key={tw.match!.abbr} className="text-sm">
                      <span className="font-mono font-bold text-sage-700 dark:text-sage-400">{tw.match!.abbr}</span>
                      <span className="text-bark-400 dark:text-bark-500 mx-1">=</span>
                      <span className="font-medium text-bark-700 dark:text-cream-200">{tw.match!.full}</span>
                      <span className="text-bark-400 dark:text-bark-500 ml-1">— {tw.match!.desc}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
