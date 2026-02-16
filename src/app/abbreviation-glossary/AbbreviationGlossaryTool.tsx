"use client";

import { useState, useMemo } from "react";

// ── DATA ──────────────────────────────────────────────────────────

interface Abbreviation {
  abbr: string;
  full: string;
  craft: "knit" | "crochet" | "both";
  category: string;
  desc: string;
  ukEquiv?: string;
  steps?: string[]; // Quick step-by-step for actual stitches
  yarnOvers?: number;
  pullThrus?: number;
  height?: string; // e.g. "1 chain tall", "3 chains tall"
}

const ABBREVIATIONS: Abbreviation[] = [
  // ── Knitting basics ───────────────────────────────────────────
  { abbr: "K", full: "Knit", craft: "knit", category: "basic", desc: "Insert needle knitwise, wrap yarn, pull through.",
    steps: ["Insert right needle into stitch front-to-back (knitwise)", "Wrap yarn counter-clockwise around right needle", "Pull new loop through stitch", "Slip old stitch off left needle"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "P", full: "Purl", craft: "knit", category: "basic", desc: "Insert needle purlwise, wrap yarn, pull through.",
    steps: ["Bring yarn to front of work", "Insert right needle into stitch back-to-front (purlwise)", "Wrap yarn counter-clockwise around right needle", "Pull new loop through stitch", "Slip old stitch off left needle"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "St(s)", full: "Stitch(es)", craft: "both", category: "basic", desc: "One or more loops on the needle/hook." },
  { abbr: "RS", full: "Right Side", craft: "both", category: "basic", desc: "The public-facing side of your work." },
  { abbr: "WS", full: "Wrong Side", craft: "both", category: "basic", desc: "The back/inside of your work." },
  { abbr: "CO", full: "Cast On", craft: "knit", category: "basic", desc: "Creating initial stitches on the needle.",
    steps: ["Make a slip knot on needle", "Insert right needle into slip knot knitwise", "Wrap yarn and pull through", "Place new loop on left needle", "Repeat from step 2"] },
  { abbr: "BO", full: "Bind Off", craft: "knit", category: "basic", desc: "Securing stitches to prevent unraveling. Also: cast off.",
    steps: ["Knit 2 stitches", "Insert left needle into first stitch on right needle", "Lift first stitch over second and off needle", "Knit 1 more stitch", "Repeat from step 2"] },
  { abbr: "YO", full: "Yarn Over", craft: "knit", category: "increase", desc: "Wrap yarn around needle to create a new stitch and decorative hole.",
    steps: ["Bring yarn to front between needles", "Wrap yarn over right needle from front to back", "Continue with next stitch — the wrap counts as a new stitch"],
    yarnOvers: 1, pullThrus: 0 },
  { abbr: "SL", full: "Slip", craft: "knit", category: "basic", desc: "Move a stitch from left to right needle without working it.",
    steps: ["Insert right needle into next stitch (knitwise or purlwise as directed)", "Slide stitch to right needle without wrapping yarn"] },
  { abbr: "SLST", full: "Slip Stitch", craft: "both", category: "basic", desc: "Knit: slip without working. Crochet: insert hook, pull through loop on hook.",
    steps: ["Insert hook into stitch", "Yarn over", "Pull through stitch AND loop on hook in one motion"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "PM", full: "Place Marker", craft: "both", category: "basic", desc: "Put a stitch marker on the needle/in the stitch." },
  { abbr: "SM", full: "Slip Marker", craft: "both", category: "basic", desc: "Move the marker from left to right needle." },

  // ── Knitting increases ────────────────────────────────────────
  { abbr: "KFB", full: "Knit Front & Back", craft: "knit", category: "increase", desc: "Knit into front then back of same stitch. Creates 2 stitches from 1.",
    steps: ["Knit into front of stitch as normal — don't drop old stitch", "Swing right needle around to back of same stitch", "Knit into the back loop", "Now drop old stitch off left needle — 2 new stitches made"],
    yarnOvers: 2, pullThrus: 2 },
  { abbr: "M1", full: "Make 1", craft: "knit", category: "increase", desc: "Lift the bar between stitches and knit into it. Nearly invisible increase.",
    steps: ["With left needle, pick up the horizontal bar between stitches front-to-back", "Knit into the back of this lifted bar (twists it closed)", "1 new stitch created between existing stitches"] },
  { abbr: "M1L", full: "Make 1 Left", craft: "knit", category: "increase", desc: "Left-leaning lifted increase. Pick up bar front-to-back, knit through back.",
    steps: ["With left needle, lift bar between stitches from front to back", "Knit through the back loop", "New stitch leans to the left"] },
  { abbr: "M1R", full: "Make 1 Right", craft: "knit", category: "increase", desc: "Right-leaning lifted increase. Pick up bar back-to-front, knit through front.",
    steps: ["With left needle, lift bar between stitches from back to front", "Knit through the front loop", "New stitch leans to the right"] },
  { abbr: "Inc", full: "Increase", craft: "both", category: "increase", desc: "Add one or more stitches. Method varies by pattern." },

  // ── Knitting decreases ────────────────────────────────────────
  { abbr: "K2tog", full: "Knit 2 Together", craft: "knit", category: "decrease", desc: "Insert needle through 2 stitches at once, knit as one. Right-leaning decrease.",
    steps: ["Insert right needle knitwise through 2 stitches at once (2nd stitch first, then 1st)", "Wrap yarn and knit as if they were one stitch", "Both old stitches drop off — 2 become 1"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "P2tog", full: "Purl 2 Together", craft: "knit", category: "decrease", desc: "Insert needle through 2 stitches purlwise, purl as one.",
    steps: ["Insert right needle purlwise through 2 stitches at once", "Wrap yarn and purl as if they were one stitch", "Both old stitches drop off — 2 become 1"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "SSK", full: "Slip Slip Knit", craft: "knit", category: "decrease", desc: "Slip 2 knitwise, knit together through back. Left-leaning decrease.",
    steps: ["Slip 1st stitch knitwise to right needle", "Slip 2nd stitch knitwise to right needle", "Insert left needle into fronts of both slipped stitches (left to right)", "Knit them together through the back loops"],
    yarnOvers: 1, pullThrus: 1 },
  { abbr: "SSP", full: "Slip Slip Purl", craft: "knit", category: "decrease", desc: "Slip 2 knitwise, return, purl together through back.",
    steps: ["Slip 1st stitch knitwise", "Slip 2nd stitch knitwise", "Return both stitches to left needle", "Purl together through back loops"] },
  { abbr: "SKPO", full: "Slip, Knit, Pass Over", craft: "knit", category: "decrease", desc: "Slip 1, knit 1, pass slipped stitch over. Left-leaning decrease.",
    steps: ["Slip 1 stitch knitwise", "Knit the next stitch", "Use left needle to lift slipped stitch over the knit stitch and off the needle"] },
  { abbr: "SK2P", full: "Slip 1, K2tog, Pass Over", craft: "knit", category: "decrease", desc: "Double decrease. Slip 1, K2tog, pass slipped stitch over.",
    steps: ["Slip 1 stitch knitwise", "Knit next 2 stitches together (K2tog)", "Pass slipped stitch over the K2tog stitch", "3 stitches become 1 (centered)"] },
  { abbr: "S2KP", full: "Slip 2, K1, Pass 2 Over", craft: "knit", category: "decrease", desc: "Centered double decrease.",
    steps: ["Slip 2 stitches together knitwise (as if to K2tog)", "Knit 1", "Pass both slipped stitches over the knit stitch", "3 stitches become 1 (centered)"] },
  { abbr: "Dec", full: "Decrease", craft: "both", category: "decrease", desc: "Remove one or more stitches. Method varies." },
  { abbr: "CDD", full: "Central Double Decrease", craft: "knit", category: "decrease", desc: "Slip 2 together, K1, pass slipped stitches over.",
    steps: ["Slip 2 stitches together knitwise", "Knit 1", "Pass both slipped stitches over", "3 stitches become 1 — center stitch is on top"] },

  // ── Knitting texture ──────────────────────────────────────────
  { abbr: "Tbl", full: "Through Back Loop", craft: "knit", category: "texture", desc: "Work into the back leg of the stitch instead of the front.",
    steps: ["Insert needle into the back leg of the stitch (the leg behind the needle)", "Wrap and work as normal (knit or purl)", "Twists the stitch, making it tighter"] },
  { abbr: "Wyif", full: "With Yarn in Front", craft: "knit", category: "texture", desc: "Bring working yarn to front of work before next action.",
    steps: ["Move working yarn between needles to the front (toward you)", "Complete the next instruction with yarn in this position"] },
  { abbr: "Wyib", full: "With Yarn in Back", craft: "knit", category: "texture", desc: "Keep working yarn behind work before next action.",
    steps: ["Move working yarn between needles to the back (away from you)", "Complete the next instruction with yarn in this position"] },
  { abbr: "CN", full: "Cable Needle", craft: "knit", category: "texture", desc: "Short needle used to hold stitches for cables." },
  { abbr: "C4F", full: "Cable 4 Front", craft: "knit", category: "texture", desc: "Slip 2 to CN, hold front, K2, K2 from CN. Left-leaning cable.",
    steps: ["Slip 2 stitches to cable needle, hold at front of work", "Knit 2 stitches from left needle", "Knit 2 stitches from cable needle", "Creates a left-twisting cable cross"] },
  { abbr: "C4B", full: "Cable 4 Back", craft: "knit", category: "texture", desc: "Slip 2 to CN, hold back, K2, K2 from CN. Right-leaning cable.",
    steps: ["Slip 2 stitches to cable needle, hold at back of work", "Knit 2 stitches from left needle", "Knit 2 stitches from cable needle", "Creates a right-twisting cable cross"] },
  { abbr: "MB", full: "Make Bobble", craft: "knit", category: "texture", desc: "Work multiple stitches into one, then decrease back. Creates a 3D bump.",
    steps: ["Into 1 stitch: (K1, YO, K1, YO, K1) — 5 stitches from 1", "Turn work. Purl 5.", "Turn work. Knit 5.", "Slip 4 stitches over the first stitch", "1 bobble complete — back to 1 stitch"] },

  // ── Vintage / archaic terms ──────────────────────────────────
  { abbr: "YRN", full: "Yarn Round Needle", craft: "knit", category: "vintage", desc: "Vintage term for yarn over (YO) in knitting. Wrap yarn completely around the right needle. Found in Reader's Digest and similar mid-century references.",
    steps: ["Bring yarn to front", "Wrap completely around the right needle", "Continue with next stitch"] },
  { abbr: "YON", full: "Yarn Over Needle", craft: "knit", category: "vintage", desc: "Vintage knitting term equivalent to yarn over (YO). Take yarn over the top of the right needle." },
  { abbr: "YFwd", full: "Yarn Forward", craft: "knit", category: "vintage", desc: "Vintage term. Bring the yarn to the front between needles. In modern patterns this is part of a yarn over." },
  { abbr: "WO", full: "Wool Over", craft: "knit", category: "vintage", desc: "Old British term for yarn over. Identical to YO — wrap the yarn over the needle. Common in pre-1980s UK patterns." },
  { abbr: "WF", full: "Wool Forward", craft: "knit", category: "vintage", desc: "Old British term for yarn forward. Bring the wool to the front of the work between the needles." },
  { abbr: "WRN", full: "Wool Round Needle", craft: "knit", category: "vintage", desc: "Old British term for yarn round needle. Wrap the wool completely around the needle. Same as YRN/YO." },
  { abbr: "WON", full: "Wool Over Needle", craft: "knit", category: "vintage", desc: "Old British equivalent of yarn over needle. Take the wool over the top of the right needle." },
  { abbr: "WBK", full: "Wool Back", craft: "knit", category: "vintage", desc: "Vintage term meaning take the yarn to the back of the work. Modern equivalent: yarn back (yb)." },

  // ── Crochet basics ────────────────────────────────────────────
  { abbr: "CH", full: "Chain", craft: "crochet", category: "basic", desc: "Yarn over, pull through loop on hook. Foundation of most crochet.", ukEquiv: "CH",
    steps: ["Yarn over (wrap yarn over hook from back to front)", "Pull through the loop on hook", "1 chain made"],
    yarnOvers: 1, pullThrus: 1, height: "Does not count as a stitch row" },
  { abbr: "SC", full: "Single Crochet", craft: "crochet", category: "basic", desc: "Insert hook, pull up loop, yarn over, pull through both loops.", ukEquiv: "DC (Double Crochet)",
    steps: ["Insert hook into stitch", "Yarn over, pull up a loop (2 loops on hook)", "Yarn over, pull through both loops"],
    yarnOvers: 2, pullThrus: 2, height: "1 chain tall" },
  { abbr: "HDC", full: "Half Double Crochet", craft: "crochet", category: "basic", desc: "YO, insert hook, pull up loop, YO, pull through all 3 loops.", ukEquiv: "HTR (Half Treble)",
    steps: ["Yarn over", "Insert hook into stitch", "Yarn over, pull up a loop (3 loops on hook)", "Yarn over, pull through all 3 loops at once"],
    yarnOvers: 3, pullThrus: 1, height: "2 chains tall" },
  { abbr: "DC", full: "Double Crochet", craft: "crochet", category: "basic", desc: "YO, insert hook, pull up loop, (YO, pull through 2) twice.", ukEquiv: "TR (Treble)",
    steps: ["Yarn over", "Insert hook into stitch", "Yarn over, pull up a loop (3 loops on hook)", "Yarn over, pull through 2 loops (2 loops remain)", "Yarn over, pull through last 2 loops"],
    yarnOvers: 4, pullThrus: 3, height: "3 chains tall" },
  { abbr: "TR", full: "Treble Crochet", craft: "crochet", category: "basic", desc: "YO twice, insert hook, pull up loop, (YO, pull through 2) three times.", ukEquiv: "DTR (Double Treble)",
    steps: ["Yarn over twice", "Insert hook into stitch", "Yarn over, pull up a loop (4 loops on hook)", "Yarn over, pull through 2 loops (3 loops remain)", "Yarn over, pull through 2 loops (2 loops remain)", "Yarn over, pull through last 2 loops"],
    yarnOvers: 5, pullThrus: 4, height: "4 chains tall" },
  { abbr: "DTR", full: "Double Treble Crochet", craft: "crochet", category: "basic", desc: "YO three times, insert hook, (YO, pull through 2) four times.", ukEquiv: "TPTR (Triple Treble)",
    steps: ["Yarn over 3 times", "Insert hook into stitch", "Yarn over, pull up a loop (5 loops on hook)", "Yarn over, pull through 2 loops — repeat 4 times total"],
    yarnOvers: 6, pullThrus: 5, height: "5 chains tall" },
  { abbr: "FDC", full: "Foundation Double Crochet", craft: "crochet", category: "basic", desc: "Creates foundation chain and first row of DC simultaneously.",
    steps: ["Chain 3, yarn over, insert hook into 1st chain", "Yarn over, pull up loop (3 loops)", "Yarn over, pull through 1 loop (the chain — 3 loops remain)", "Yarn over, pull through 2 loops", "Yarn over, pull through 2 loops", "For next stitch: YO, insert into the chain portion of previous stitch"] },
  { abbr: "FSC", full: "Foundation Single Crochet", craft: "crochet", category: "basic", desc: "Creates foundation chain and first row of SC simultaneously.",
    steps: ["Chain 2, insert hook into 1st chain", "Yarn over, pull up loop (2 loops)", "Yarn over, pull through 1 loop (the chain — 2 loops remain)", "Yarn over, pull through both loops", "For next stitch: insert into the chain portion of previous stitch"] },

  // ── Crochet increases ─────────────────────────────────────────
  { abbr: "2SC", full: "2 SC in One Stitch", craft: "crochet", category: "increase", desc: "Work 2 single crochets into the same stitch. Adds 1 stitch.",
    steps: ["Single crochet into the stitch as normal", "Insert hook into the SAME stitch again", "Complete a second single crochet", "2 stitches now occupy 1 stitch space"] },
  { abbr: "2DC", full: "2 DC in One Stitch", craft: "crochet", category: "increase", desc: "Work 2 double crochets into the same stitch.",
    steps: ["Double crochet into the stitch as normal", "Insert hook into the SAME stitch again", "Complete a second double crochet"] },
  { abbr: "Shell", full: "Shell Stitch", craft: "crochet", category: "increase", desc: "Multiple stitches (usually 5 DC) worked into one stitch. Creates a fan shape.",
    steps: ["Work 5 DC (or as directed) all into the same stitch", "Skip stitches on either side as pattern directs", "The fan shape emerges from the single insertion point"] },

  // ── Crochet decreases ─────────────────────────────────────────
  { abbr: "SC2tog", full: "Single Crochet 2 Together", craft: "crochet", category: "decrease", desc: "Invisible decrease for SC. Insert, pull up, insert next, pull up, YO, pull through all.",
    steps: ["Insert hook into 1st stitch, yarn over, pull up loop (2 loops)", "Insert hook into 2nd stitch, yarn over, pull up loop (3 loops)", "Yarn over, pull through all 3 loops", "2 stitches become 1"],
    yarnOvers: 3, pullThrus: 1 },
  { abbr: "DC2tog", full: "Double Crochet 2 Together", craft: "crochet", category: "decrease", desc: "Work 2 incomplete DC, then join at the top.",
    steps: ["YO, insert hook into 1st stitch, YO, pull up loop, YO, pull through 2 (2 loops remain)", "YO, insert hook into 2nd stitch, YO, pull up loop, YO, pull through 2 (3 loops remain)", "YO, pull through all 3 loops", "2 stitches become 1"] },
  { abbr: "InvDec", full: "Invisible Decrease", craft: "crochet", category: "decrease", desc: "Insert through front loops only of 2 stitches. Tighter than SC2tog — preferred for amigurumi.",
    steps: ["Insert hook under front loop only of 1st stitch", "Insert hook under front loop only of 2nd stitch (3 loops on hook)", "Yarn over, pull through first 2 loops (2 loops on hook)", "Yarn over, pull through last 2 loops"] },

  // ── Crochet texture ───────────────────────────────────────────
  { abbr: "FPdc", full: "Front Post Double Crochet", craft: "crochet", category: "texture", desc: "YO, insert hook around the post from the front. Creates raised texture.",
    steps: ["Yarn over", "Insert hook from front to back to front AROUND the post of the stitch below", "Yarn over, pull up loop (3 loops on hook)", "Complete as normal DC: (YO, pull through 2) twice"],
    yarnOvers: 4, pullThrus: 3 },
  { abbr: "BPdc", full: "Back Post Double Crochet", craft: "crochet", category: "texture", desc: "YO, insert hook around the post from the back. Creates indented texture.",
    steps: ["Yarn over", "Insert hook from back to front to back AROUND the post of the stitch below", "Yarn over, pull up loop (3 loops on hook)", "Complete as normal DC: (YO, pull through 2) twice"],
    yarnOvers: 4, pullThrus: 3 },
  { abbr: "FPsc", full: "Front Post Single Crochet", craft: "crochet", category: "texture", desc: "Insert hook around the post from front. Subtle raised texture.",
    steps: ["Insert hook from front to back to front around post of stitch below", "Yarn over, pull up loop (2 loops)", "Yarn over, pull through both loops"] },
  { abbr: "Puff", full: "Puff Stitch", craft: "crochet", category: "texture", desc: "Multiple half-finished HDC in one stitch, joined at top. Puffy and squishy.",
    steps: ["(YO, insert hook, pull up loop) 3-5 times in same stitch — many loops on hook", "Yarn over, pull through ALL loops on hook at once", "Chain 1 to close and secure the puff"] },
  { abbr: "Bobble", full: "Bobble Stitch", craft: "crochet", category: "texture", desc: "Multiple incomplete DC in one stitch, joined at top. Protrudes from RS.",
    steps: ["(YO, insert hook, pull up loop, YO, pull through 2) 5 times in same stitch — 6 loops on hook", "Yarn over, pull through all 6 loops", "Chain 1 to close (optional)"] },
  { abbr: "Popcorn", full: "Popcorn Stitch", craft: "crochet", category: "texture", desc: "5 complete DC in one stitch, then fold and join first to last.",
    steps: ["Work 5 DC in the same stitch", "Remove hook from loop", "Insert hook through top of first DC", "Pick up the dropped loop", "Pull dropped loop through the first DC to close the popcorn"] },
  { abbr: "V-St", full: "V-Stitch", craft: "crochet", category: "texture", desc: "(DC, CH1, DC) in same stitch. Creates a V shape.",
    steps: ["DC into the stitch", "Chain 1", "DC into the SAME stitch", "The CH1 space in between creates the V opening"] },

  // ── Crochet colorwork ─────────────────────────────────────────
  { abbr: "CC", full: "Contrast Color", craft: "both", category: "colorwork", desc: "The secondary color(s) in a colorwork pattern." },
  { abbr: "MC", full: "Main Color", craft: "both", category: "colorwork", desc: "The primary/background color in a colorwork pattern." },

  // ── General / Finishing ───────────────────────────────────────
  { abbr: "Rep", full: "Repeat", craft: "both", category: "basic", desc: "Work the bracketed or asterisked section again." },
  { abbr: "Rnd", full: "Round", craft: "both", category: "basic", desc: "One complete circuit when working in the round." },
  { abbr: "Sk", full: "Skip", craft: "crochet", category: "basic", desc: "Miss the next stitch. Do not work into it.",
    steps: ["Simply pass over the next stitch without inserting your hook", "Work into the following stitch instead"] },
  { abbr: "Sp", full: "Space", craft: "crochet", category: "basic", desc: "The gap created by chain stitches in the previous row." },
  { abbr: "Tog", full: "Together", craft: "both", category: "basic", desc: "Work two or more stitches as one. Usually a decrease." },
  { abbr: "BLO", full: "Back Loop Only", craft: "crochet", category: "texture", desc: "Insert hook under back loop only. Creates a ridged texture.",
    steps: ["Identify the two loops at the top of the stitch", "Insert hook under the BACK loop only (the one farther from you)", "Complete the stitch as normal"] },
  { abbr: "FLO", full: "Front Loop Only", craft: "crochet", category: "texture", desc: "Insert hook under front loop only. Creates a ridged texture.",
    steps: ["Identify the two loops at the top of the stitch", "Insert hook under the FRONT loop only (the one closer to you)", "Complete the stitch as normal"] },
  { abbr: "Tch", full: "Turning Chain", craft: "crochet", category: "basic", desc: "Chain(s) at the start of a row to match the height of the first stitch.",
    steps: ["SC row: chain 1, turn", "HDC row: chain 2, turn", "DC row: chain 3, turn", "TR row: chain 4, turn"] },
  { abbr: "MR", full: "Magic Ring", craft: "crochet", category: "basic", desc: "Adjustable starting ring for working in the round. Closes completely with no hole.",
    steps: ["Wrap yarn around finger twice to form a ring", "Insert hook through ring, pull up loop", "Chain 1 (does not count as stitch)", "Work stitches into the ring as directed", "Pull tail to close the ring tight"] },
  { abbr: "FO", full: "Fasten Off", craft: "crochet", category: "finishing", desc: "Cut yarn, pull through last loop to secure.",
    steps: ["Cut yarn leaving a 6-inch tail", "Yarn over, pull tail completely through last loop", "Pull tight to secure"] },
  { abbr: "Weave", full: "Weave in Ends", craft: "both", category: "finishing", desc: "Thread tail through yarn needle and work into fabric to secure." },
  { abbr: "Block", full: "Blocking", craft: "both", category: "finishing", desc: "Wet or steam the finished piece to set stitches and shape." },
  { abbr: "Gauge", full: "Gauge/Tension", craft: "both", category: "basic", desc: "Number of stitches and rows per inch/cm. UK: tension." },
];

const CATEGORIES = ["all", "basic", "increase", "decrease", "texture", "colorwork", "finishing"];
// const CRAFTS = ["all", "knit", "crochet"] as const;

// ── COMPONENT ─────────────────────────────────────────────────────

type ViewMode = "glossary" | "translator";

export default function AbbreviationGlossaryTool() {
  const [search, setSearch] = useState("");
  const [craft, setCraft] = useState<"all" | "knit" | "crochet">("all");
  const [category, setCategory] = useState("all");
  const [showUK, setShowUK] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("glossary");
  const [patternText, setPatternText] = useState("");
  const [expandedAbbr, setExpandedAbbr] = useState<string | null>(null);

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

      {viewMode === "glossary" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search abbreviations…"
                className="input"
              />
            </div>
            <select value={craft} onChange={(e) => setCraft(e.target.value as typeof craft)} className="input">
              <option value="all">All Crafts</option>
              <option value="knit">Knitting</option>
              <option value="crochet">Crochet</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* UK toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showUK} onChange={() => setShowUK(!showUK)}
              className="w-4 h-4 rounded border-cream-400 text-sage-600 focus:ring-sage-500" />
            <span className="text-bark-600 dark:text-cream-300">Show UK equivalents</span>
          </label>

          {/* Results count */}
          <p className="text-xs text-bark-400 dark:text-bark-500">
            Showing {filtered.length} of {ABBREVIATIONS.length} entries.
            {filtered.some((a) => a.steps) && (
              <> Click any stitch with a <span className="text-sage-600 dark:text-sage-400">▶ steps</span> badge to see a quick diagram.</>
            )}
          </p>

          {/* Glossary entries */}
          <div className="space-y-1">
            {filtered.map((a) => (
              <div key={a.abbr + a.craft} className="rounded-lg border border-cream-200 dark:border-bark-700 overflow-hidden">
                <div
                  className={`flex items-start gap-3 p-3 ${a.steps ? "cursor-pointer hover:bg-cream-100/50 dark:hover:bg-bark-700/50" : ""} transition-colors`}
                  onClick={() => a.steps && setExpandedAbbr(expandedAbbr === a.abbr ? null : a.abbr)}
                >
                  <div className="w-16 flex-shrink-0">
                    <span className="font-mono font-bold text-sage-700 dark:text-sage-400 text-sm">
                      {a.abbr}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-bark-700 dark:text-cream-200 text-sm">{a.full}</span>
                      {showUK && a.ukEquiv && (
                        <span className="text-xs px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded">
                          UK: {a.ukEquiv}
                        </span>
                      )}
                      {a.steps && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 rounded-full font-medium">
                          ▶ {a.steps.length} steps
                        </span>
                      )}
                      {a.height && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                          {a.height}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-bark-400 dark:text-bark-500 mt-0.5">{a.desc}</p>
                  </div>
                  {a.steps && (
                    <span className="text-bark-300 dark:text-bark-600 text-xs flex-shrink-0 mt-1">
                      {expandedAbbr === a.abbr ? "▲" : "▼"}
                    </span>
                  )}
                </div>

                {/* Expanded step-by-step */}
                {a.steps && expandedAbbr === a.abbr && (
                  <div className="px-3 pb-3 pt-1 border-t border-cream-200 dark:border-bark-700 bg-cream-50/50 dark:bg-bark-800/50">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-xs font-semibold text-bark-600 dark:text-cream-300 uppercase tracking-wider">
                        Step-by-Step
                      </h4>
                      {a.yarnOvers !== undefined && (
                        <span className="text-[10px] font-mono bg-cream-200 dark:bg-bark-600 px-2 py-0.5 rounded text-bark-600 dark:text-cream-300">
                          {a.yarnOvers} YO · {a.pullThrus} pull-thru{a.pullThrus !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <ol className="space-y-1.5">
                      {a.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-bark-600 dark:text-cream-300">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PATTERN TRANSLATOR ─────────────────────────────────────── */}
      {viewMode === "translator" && (
        <div className="space-y-4">
          <div>
            <label className="label">Paste a line from your pattern</label>
            <textarea
              value={patternText}
              onChange={(e) => setPatternText(e.target.value)}
              placeholder="e.g. Ch 3, 2 DC in next st, sk 2, (SC, CH 1, SC) in ch-sp, rep from * to end"
              className="input min-h-[80px] resize-y"
            />
          </div>

          {translatedWords.length > 0 && (
            <div className="space-y-3">
              {/* Highlighted text */}
              <div className="p-3 bg-cream-100 dark:bg-bark-700 rounded-lg flex flex-wrap gap-1">
                {translatedWords.map((tw, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded text-sm ${
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
                    <div key={tw.match!.abbr} className="p-2 rounded-lg bg-cream-50 dark:bg-bark-800/50">
                      <div className="text-sm">
                        <span className="font-mono font-bold text-sage-700 dark:text-sage-400">{tw.match!.abbr}</span>
                        <span className="text-bark-400 dark:text-bark-500 mx-1">=</span>
                        <span className="font-medium text-bark-700 dark:text-cream-200">{tw.match!.full}</span>
                        <span className="text-bark-400 dark:text-bark-500 ml-1">— {tw.match!.desc}</span>
                      </div>
                      {tw.match!.steps && (
                        <div className="mt-1.5 ml-4">
                          <ol className="space-y-0.5">
                            {tw.match!.steps.map((step, j) => (
                              <li key={j} className="text-xs text-bark-500 dark:text-bark-400 flex items-start gap-1.5">
                                <span className="text-sage-500 font-bold">{j + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
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
