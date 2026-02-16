"use client";

import { useState, useMemo } from "react";

interface NeedleType {
  name: string;
  aka: string[];
  eye: string;
  point: string;
  sizes: string;
  bestFor: string;
  howToRemember: string;
  category: "yarn" | "sewing" | "specialty";
}

const CATEGORY_LABELS: Record<string, string> = {
  yarn: "Yarn & Knit/Crochet",
  sewing: "Sewing & Embroidery",
  specialty: "Specialty",
};

const NEEDLES: NeedleType[] = [
  {
    name: "Tapestry Needle",
    aka: ["Yarn needle", "Darning needle"],
    eye: "Very large, elongated",
    point: "Blunt / rounded",
    sizes: "13–28 (lower = larger)",
    bestFor:
      "Weaving in ends, sewing crochet/knit pieces together, cross stitch on aida cloth",
    howToRemember:
      "Blunt tip + big eye = yarn-friendly. Won't split your stitches.",
    category: "yarn",
  },
  {
    name: "Chenille Needle",
    aka: [],
    eye: "Large, elongated",
    point: "Sharp",
    sizes: "13–28",
    bestFor:
      "Ribbon embroidery, crewel work, embroidery with thick threads, sewing through tightly woven fabric with heavy thread",
    howToRemember:
      'Same big eye as tapestry, but sharp. Think "chenille = sharp channel through fabric."',
    category: "specialty",
  },
  {
    name: "Embroidery Needle",
    aka: ["Crewel needle"],
    eye: "Medium-large, elongated",
    point: "Sharp",
    sizes: "1–12 (lower = larger)",
    bestFor:
      "Surface embroidery, crewel work, embroidery with stranded floss (DMC, Anchor)",
    howToRemember:
      "Slightly smaller eye than chenille. The go-to for embroidery floss.",
    category: "sewing",
  },
  {
    name: "Sharps",
    aka: ["General sewing needle"],
    eye: "Small, round",
    point: "Sharp",
    sizes: "1–12",
    bestFor:
      "General hand sewing, hemming, mending, buttons, basic stitching",
    howToRemember:
      "The default. Short, sharp, small eye. If you're just sewing fabric, grab a sharp.",
    category: "sewing",
  },
  {
    name: "Betweens",
    aka: ["Quilting needle"],
    eye: "Small, round",
    point: "Sharp",
    sizes: "1–12",
    bestFor:
      "Quilting, detailed hand stitching through multiple fabric layers",
    howToRemember:
      "Shorter than sharps. Quilters love them because shorter = more control through thick layers.",
    category: "sewing",
  },
  {
    name: "Beading Needle",
    aka: [],
    eye: "Tiny, nearly invisible",
    point: "Sharp, very thin",
    sizes: "10–16",
    bestFor:
      "Stringing seed beads, bead embroidery, adding beads to crochet/knit",
    howToRemember:
      "So thin it fits through a seed bead hole. Flexes and bends easily.",
    category: "specialty",
  },
  {
    name: "Leather Needle",
    aka: ["Glover's needle"],
    eye: "Small-medium",
    point: "Triangular/wedge (cutting point)",
    sizes: "1–8",
    bestFor: "Leather, suede, vinyl, faux leather",
    howToRemember:
      "The wedge tip cuts through leather instead of pushing fibers apart.",
    category: "specialty",
  },
  {
    name: "Bodkin",
    aka: ["Ribbon threader"],
    eye: "Very large or has a ball tip",
    point: "Blunt, ball-shaped",
    sizes: "One size / various",
    bestFor:
      "Threading elastic, ribbon, or cord through casings and channels",
    howToRemember:
      "Fat and blunt like a tiny wand. Grabs elastic and pulls it through.",
    category: "specialty",
  },
  {
    name: "Cable Needle",
    aka: [],
    eye: "None (no eye)",
    point: "Both ends pointed or hooked",
    sizes: "Small, medium, large",
    bestFor:
      "Holding stitches while crossing cables in knitting",
    howToRemember:
      "Not really a needle — more like a tiny bent stick. It holds stitches, not thread.",
    category: "yarn",
  },
  {
    name: "Double-Pointed Needles (DPNs)",
    aka: [],
    eye: "None",
    point: "Sharp on both ends",
    sizes: "US 0–15 / 2mm–10mm",
    bestFor:
      "Knitting in the round (socks, hat crowns, mittens), i-cord",
    howToRemember:
      "Pointy on both ends. Come in sets of 4 or 5. For small circular knitting.",
    category: "yarn",
  },
];

export default function NeedleGuideTool() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return NEEDLES.filter((n) => {
      const matchSearch =
        !search ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.aka.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        n.bestFor.toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || n.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search needles..."
        className="w-full px-4 py-2.5 bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl text-sm text-bark-700 dark:text-cream-300 placeholder-bark-400 dark:placeholder-bark-500 focus:outline-none focus:ring-2 focus:ring-sage-500/40"
      />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !activeCategory
              ? "bg-sage-600 text-white"
              : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === key
                ? "bg-sage-600 text-white"
                : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((needle) => (
          <div
            key={needle.name}
            className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-bark-700 dark:text-cream-300">{needle.name}</h3>
                {needle.aka.length > 0 && (
                  <p className="text-xs text-bark-400 dark:text-bark-500">
                    Also called: {needle.aka.join(", ")}
                  </p>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cream-200 dark:bg-bark-700 text-[10px] font-medium text-bark-500 dark:text-bark-400 uppercase tracking-wider whitespace-nowrap">
                {CATEGORY_LABELS[needle.category]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
              <div>
                <span className="text-xs text-bark-400 dark:text-bark-500">Eye</span>
                <p className="text-bark-700 dark:text-cream-300">{needle.eye}</p>
              </div>
              <div>
                <span className="text-xs text-bark-400 dark:text-bark-500">Point</span>
                <p className="text-bark-700 dark:text-cream-300">{needle.point}</p>
              </div>
              <div>
                <span className="text-xs text-bark-400 dark:text-bark-500">Sizes</span>
                <p className="text-bark-700 dark:text-cream-300">{needle.sizes}</p>
              </div>
              <div>
                <span className="text-xs text-bark-400 dark:text-bark-500">Best For</span>
                <p className="text-bark-700 dark:text-cream-300">{needle.bestFor}</p>
              </div>
            </div>

            <div className="bg-cream-100 dark:bg-bark-700 border border-bark-200 dark:border-bark-600 rounded-lg p-3">
              <p className="text-xs text-bark-500 dark:text-bark-400">
                <span className="font-semibold text-sage-600 dark:text-sage-400">
                  How to remember:
                </span>{" "}
                {needle.howToRemember}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Key confusion callout */}
      <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl p-5">
        <h2 className="font-bold text-bark-700 dark:text-cream-300 mb-3">
          Tapestry vs Chenille — The #1 Confusion
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-3">
          They look almost identical. Same large eye, same size range. The only difference is the
          tip:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream-100 dark:bg-bark-700 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-bark-700 dark:text-cream-300">Tapestry</p>
            <p className="text-xs text-bark-400 dark:text-bark-500">Blunt tip</p>
            <p className="text-xs text-sage-600 dark:text-sage-400 mt-1">
              For yarn &amp; counted thread
            </p>
          </div>
          <div className="bg-cream-100 dark:bg-bark-700 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-bark-700 dark:text-cream-300">Chenille</p>
            <p className="text-xs text-bark-400 dark:text-bark-500">Sharp tip</p>
            <p className="text-xs text-sage-600 dark:text-sage-400 mt-1">
              For ribbon embroidery &amp; thick thread
            </p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">
          Choosing the Right Needle
        </h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          The right needle makes every project easier. Using a sharp sewing needle to weave in
          crochet ends splits your yarn and creates a mess. Using a blunt tapestry needle on tightly
          woven fabric means you can&apos;t pierce through. Match the needle to the job: blunt for
          yarn work, sharp for fabric, and specialty needles for everything in between.
        </p>
      </div>
    </div>
  );
}
