export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tier: 1 | 2 | 3;
  ready: boolean;
  keywords: string[];
}
export type ToolCategory = 
  | "knitting" 
  | "crochet" 
  | "both" 
  | "weaving" 
  | "spinning" 
  | "embroidery" 
  | "cross-stitch";
export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  knitting: "Knitting",
  crochet: "Crochet",
  both: "Knitting & Crochet",
  weaving: "Weaving",
  spinning: "Spinning",
  embroidery: "Embroidery",
  "cross-stitch": "Cross Stitch",
};
export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  knitting: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  crochet: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  both: "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300",
  weaving: "bg-bark-100 text-bark-700 dark:bg-bark-700 dark:text-bark-200",
  spinning: "bg-cream-300 text-bark-700 dark:bg-bark-700 dark:text-cream-300",
  embroidery: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "cross-stitch": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};
export const tools: Tool[] = [
  {
    slug: "yarn-calculator",
    name: "Yarn Yardage Calculator",
    shortName: "Yarn Calculator",
    description: "Calculate exactly how much yarn you need for any project — blankets, sweaters, scarves, and more.",
    category: "both",
    icon: "🧶",
    tier: 1,
    ready: true,
    keywords: ["yarn calculator", "how much yarn do I need", "yarn yardage calculator"],
  },
  {
    slug: "needle-converter",
    name: "Needle & Hook Size Converter",
    shortName: "Needle Converter",
    description: "Instantly convert knitting needle and crochet hook sizes between US, UK, metric, and Japanese systems.",
    category: "both",
    icon: "🪡",
    tier: 1,
    ready: true,
    keywords: ["knitting needle size chart", "crochet hook conversion", "needle size converter"],
  },
  {
    slug: "gauge-calculator",
    name: "Gauge Calculator & Pattern Resizer",
    shortName: "Gauge Calculator",
    description: "Calculate your gauge from a swatch, resize patterns to a new gauge, and get exact stitch counts.",
    category: "both",
    icon: "📐",
    tier: 1,
    ready: true,
    keywords: ["gauge calculator", "pattern resizer", "stitch calculator"],
  },
  {
    slug: "yarn-weight-chart",
    name: "Yarn Weight & Substitution Guide",
    shortName: "Yarn Weights",
    description: "Interactive yarn weight chart with US, UK, and Australian names — plus a substitution compatibility checker.",
    category: "both",
    icon: "⚖️",
    tier: 1,
    ready: true,
    keywords: ["yarn weight chart", "yarn substitution", "DK vs worsted"],
  },
  {
    slug: "stitch-counter",
    name: "Stitch & Row Counter",
    shortName: "Stitch Counter",
    description: "Free online stitch counter with multiple counters, row reminders, and offline support. No login needed.",
    category: "both",
    icon: "🔢",
    tier: 1,
    ready: true,
    keywords: ["stitch counter online", "row counter", "knitting counter"],
  },
  {
    slug: "blanket-calculator",
    name: "Blanket Size Calculator",
    shortName: "Blanket Calculator",
    description: "Find the right stitch count, row count, and yarn yardage for any blanket size from baby to king.",
    category: "both",
    icon: "🛏️",
    tier: 2,
    ready: true,
    keywords: ["blanket size chart", "crochet blanket sizes", "blanket calculator"],
  },
  {
    slug: "increase-decrease-calculator",
    name: "Increase & Decrease Calculator",
    shortName: "Inc/Dec Calculator",
    description: "Get stitch-by-stitch instructions for distributing increases or decreases evenly across a row or round.",
    category: "both",
    icon: "↕️",
    tier: 2,
    ready: true,
    keywords: ["increase evenly calculator", "decrease evenly knitting"],
  },
  {
    slug: "stripe-generator",
    name: "Stripe Pattern Generator",
    shortName: "Stripe Generator",
    description: "Generate random or structured stripe patterns with per-color yardage estimates for stash-busting projects.",
    category: "both",
    icon: "🌈",
    tier: 2,
    ready: true,
    keywords: ["random stripe generator", "stripe pattern creator"],
  },
  {
    slug: "abbreviation-glossary",
    name: "Abbreviation & Stitch Glossary",
    shortName: "Abbreviations",
    description: "Searchable glossary of knitting and crochet abbreviations with US/UK toggle, stitch descriptions, and step-by-step diagrams.",
    category: "both",
    icon: "📖",
    tier: 2,
    ready: true,
    keywords: ["crochet abbreviations", "knitting abbreviations chart"],
  },
  {
    slug: "spinning-ratio-calculator",
    name: "Spinning Wheel Ratio Calculator",
    shortName: "Spinning Calculator",
    description: "Calculate drive ratios, twists per inch, and plying ratios for handspinning — the only online tool for spinners.",
    category: "spinning",
    icon: "🌀",
    tier: 2,
    ready: true,
    keywords: ["spinning wheel ratio", "TPI calculator"],
  },
  {
    slug: "stitch-pattern-calculator",
    name: "Stitch Pattern Calculator",
    shortName: "Stitch Calculator",
    description: "Find compatible stitch counts for sampler blankets. Combine multiples, browse 50+ stitches, and plan rows.",
    category: "both",
    icon: "🧮",
    tier: 2,
    ready: true,
    keywords: ["stitch pattern calculator", "crochet stitch multiple calculator", "sampler blanket planner"],
  },
  {
    slug: "stitch-quick-reference",
    name: "Stitch Quick Reference",
    shortName: "Stitch Reference",
    description: "Visual step-by-step for every basic stitch. Yarn overs, pull-throughs, loop counts, and turning chains at a glance.",
    category: "both",
    icon: "🃏",
    tier: 2,
    ready: true,
    keywords: ["crochet stitch diagram", "how to double crochet", "stitch quick reference", "crochet stitch steps"],
  },
  {
    slug: "cross-stitch-calculator",
    name: "Cross Stitch Size & Thread Calculator",
    shortName: "Cross Stitch Calc",
    description: "Calculate finished dimensions for any fabric count and estimate thread amounts per color.",
    category: "cross-stitch",
    icon: "✂️",
    tier: 3,
    ready: true,
    keywords: ["cross stitch size calculator", "aida cloth calculator"],
  },
  {
    slug: "weaving-sett-calculator",
    name: "Weaving Sett Calculator",
    shortName: "Sett Calculator",
    description: "Find the right sett (EPI) for your yarn and weave structure, plus warp length and reed substitution.",
    category: "weaving",
    icon: "🏗️",
    tier: 3,
    ready: true,
    keywords: ["weaving sett calculator", "ends per inch calculator"],
  },
  {
    slug: "project-cost-calculator",
    name: "Project Cost Calculator",
    shortName: "Cost Calculator",
    description: "Calculate the total cost of your project, including yarn, notions, and an estimate of your time.",
    category: "both",
    icon: "💰",
    tier: 3,
    ready: true,
    keywords: ["crochet cost calculator", "knitting cost calculator"],
  },
  {
    slug: "color-pooling-calculator",
    name: "Color Pooling Calculator",
    shortName: "Color Pooling",
    description: "Calculate the exact stitch count to make variegated yarn pool into argyle and plaid patterns.",
    category: "both",
    icon: "🎨",
    tier: 3,
    ready: true,
    keywords: ["color pooling calculator", "planned pooling crochet"],
  },
  {
    slug: "thread-converter",
    name: "Embroidery Thread Converter",
    shortName: "Thread Converter",
    description: "Instantly convert between DMC, Anchor, Cosmo, and Sulky embroidery thread numbers.",
    category: "embroidery",
    icon: "🧵",
    tier: 3,
    ready: true,
    keywords: ["DMC to anchor conversion", "embroidery thread converter"],
  },
  {
    slug: "uk-to-us-converter",
    name: "UK to US Crochet Terms Converter",
    shortName: "UK/US Converter",
    description: "Instantly convert UK crochet patterns to US terminology and vice versa. Handles abbreviations, vintage terms, and full stitch names.",
    category: "crochet",
    icon: "🇬🇧",
    tier: 2,
    ready: true,
    keywords: ["uk to us crochet terms", "crochet term converter", "british crochet terms"],
  },
  {
    slug: "circle-calculator",
    name: "Perfect Circle Calculator",
    shortName: "Circle Calculator",
    description: "Generate a flat circle crochet pattern for any stitch type with staggered increases. Enter your stitch and rounds to get the full pattern.",
    category: "crochet",
    icon: "⭕",
    tier: 2,
    ready: true,
    keywords: ["crochet circle pattern", "flat circle calculator", "crochet circle increases"],
  },
  {
    slug: "needle-guide",
    name: "Sewing \& Craft Needle Guide",
    shortName: "Needle Guide",
    description: "Visual guide to needle types: tapestry, chenille, embroidery, sharps, beading, and more. Know which needle to use for every project.",
    category: "both",
    icon: "🪡",
    tier: 2,
    ready: true,
    keywords: ["sewing needle types", "tapestry vs chenille", "needle guide"],
  },
  {
    slug: "amigurumi-shapes",
    name: "Amigurumi Shapes Guide",
    shortName: "Amigurumi Shapes",
    description: "Basic crochet shapes for amigurumi: sphere, cone, cylinder, and oval. Get round-by-round instructions for each shape.",
    category: "crochet",
    icon: "🧸",
    tier: 2,
    ready: true,
    keywords: ["amigurumi shapes", "crochet sphere pattern", "amigurumi basic shapes"],
  },
];

/** Hand-curated related tool mappings for targeted internal linking. */
const relatedToolMap: Record<string, string[]> = {
  "yarn-calculator": ["yarn-weight-chart", "blanket-calculator", "project-cost-calculator", "gauge-calculator"],
  "needle-converter": ["needle-guide", "uk-to-us-converter", "gauge-calculator"],
  "gauge-calculator": ["yarn-calculator", "stitch-pattern-calculator", "blanket-calculator"],
  "yarn-weight-chart": ["yarn-calculator", "needle-converter", "project-cost-calculator"],
  "stitch-counter": ["increase-decrease-calculator", "stitch-pattern-calculator", "stitch-quick-reference"],
  "blanket-calculator": ["yarn-calculator", "stripe-generator", "gauge-calculator", "stitch-pattern-calculator"],
  "increase-decrease-calculator": ["gauge-calculator", "stitch-counter", "circle-calculator"],
  "stripe-generator": ["color-pooling-calculator", "blanket-calculator", "yarn-calculator"],
  "abbreviation-glossary": ["uk-to-us-converter", "stitch-quick-reference", "needle-converter"],
  "spinning-ratio-calculator": ["yarn-weight-chart", "yarn-calculator", "weaving-sett-calculator"],
  "stitch-pattern-calculator": ["blanket-calculator", "gauge-calculator", "stitch-quick-reference"],
  "stitch-quick-reference": ["abbreviation-glossary", "stitch-counter", "stitch-pattern-calculator"],
  "uk-to-us-converter": ["abbreviation-glossary", "stitch-quick-reference", "needle-converter"],
  "circle-calculator": ["amigurumi-shapes", "increase-decrease-calculator", "blanket-calculator"],
  "needle-guide": ["needle-converter", "cross-stitch-calculator", "thread-converter"],
  "amigurumi-shapes": ["circle-calculator", "yarn-calculator", "increase-decrease-calculator"],
  "cross-stitch-calculator": ["thread-converter", "needle-guide", "gauge-calculator"],
  "weaving-sett-calculator": ["spinning-ratio-calculator", "yarn-weight-chart", "stripe-generator"],
  "project-cost-calculator": ["yarn-calculator", "blanket-calculator", "yarn-weight-chart"],
  "color-pooling-calculator": ["stripe-generator", "yarn-calculator", "gauge-calculator"],
  "thread-converter": ["cross-stitch-calculator", "needle-guide", "abbreviation-glossary"],
};

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(slug: string, count = 4): Tool[] {
  const mapped = relatedToolMap[slug];
  if (mapped) {
    const result = mapped
      .map((s) => tools.find((t) => t.slug === s))
      .filter((t): t is Tool => t !== undefined)
      .slice(0, count);
    if (result.length > 0) return result;
  }
  // Fallback: score by category and tier
  const current = getToolBySlug(slug);
  if (!current) return tools.slice(0, count);
  return tools
    .filter((t) => t.slug !== slug)
    .sort((a, b) => {
      const aScore =
        (a.category === current.category ? 10 : 0) +
        (a.tier === current.tier ? 5 : 0) +
        (a.ready ? 3 : 0);
      const bScore =
        (b.category === current.category ? 10 : 0) +
        (b.tier === current.tier ? 5 : 0) +
        (b.ready ? 3 : 0);
      return bScore - aScore;
    })
    .slice(0, count);
}
