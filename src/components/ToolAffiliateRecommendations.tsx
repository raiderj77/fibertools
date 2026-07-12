import AffiliateRecommendations, {
  type AffiliateRecommendation,
} from "@/components/AffiliateRecommendations";

interface RecommendationSet {
  intro: string;
  items: AffiliateRecommendation[];
}

const TOOL_RECOMMENDATIONS: Record<string, RecommendationSet> = {
  "circle-calculator": {
    intro: "Match the finished circle plan with yarn and a hook suited to the weight you intend to use.",
    items: [
      { label: "Smooth worsted yarn", description: "A practical weight for testing circle increases and stitch definition.", query: "smooth worsted weight yarn crochet", category: "yarn" },
      { label: "Ergonomic crochet hook set", description: "A range of sizes helps when you need to adjust fabric density.", query: "ergonomic crochet hook set", category: "crochet-hooks" },
      { label: "Locking stitch markers", description: "Mark round starts and increase points without splitting the yarn.", query: "locking stitch markers crochet", category: "notions" },
    ],
  },
  "blanket-calculator": {
    intro: "Use your calculated yardage and chosen yarn weight to compare materials before ordering a full dye lot.",
    items: [
      { label: "Blanket yarn", description: "Compare washable blanket yarn by weight, fiber, yardage, and color range.", query: "blanket yarn crochet knitting", category: "yarn" },
      { label: "Large crochet hooks", description: "Useful for bulky and super-bulky blanket yarns.", query: "large ergonomic crochet hooks bulky yarn", category: "crochet-hooks" },
      { label: "Long circular needles", description: "A flexible cable holds wide knitted blanket rows comfortably.", query: "long circular knitting needles blanket", category: "knitting-needles" },
    ],
  },
  "amigurumi-shapes": {
    intro: "For firm, clearly defined shapes, compare tightly spun yarn, a comfortable small hook, and washable filling.",
    items: [
      { label: "Cotton amigurumi yarn", description: "Smooth, tightly spun yarn makes shaping stitches easy to see.", query: "cotton yarn amigurumi color pack", category: "yarn" },
      { label: "Small ergonomic hooks", description: "Comfortable handles help when working the tight gauge toys require.", query: "ergonomic crochet hooks amigurumi small sizes", category: "crochet-hooks" },
      { label: "Washable stuffing", description: "Polyester filling is easy to shape and practical for washable toys.", query: "washable polyester fiber fill amigurumi", category: "stuffing" },
    ],
  },
  "color-pooling-calculator": {
    intro: "Planned pooling depends on a repeatable color sequence, so start with clearly repeating yarn and tools that help maintain tension.",
    items: [
      { label: "Planned-pooling yarn", description: "Compare variegated yarns with distinct, repeating color sections.", query: "planned pooling yarn crochet", category: "yarn" },
      { label: "Ergonomic crochet hooks", description: "Trying an adjacent hook size can help align the color repeat.", query: "ergonomic crochet hook set", category: "crochet-hooks" },
      { label: "Locking stitch markers", description: "Mark repeat boundaries while you tune stitch count and tension.", query: "locking stitch markers crochet", category: "notions" },
    ],
  },
  "sock-calculator": {
    intro: "Use the calculated stitch count with durable sock yarn and the needle style you prefer for small circumferences.",
    items: [
      { label: "Wool-nylon sock yarn", description: "A nylon blend adds abrasion resistance at heels and toes.", query: "sock yarn wool nylon fingering weight", category: "yarn" },
      { label: "Sock knitting needles", description: "Compare double-pointed, short circular, and magic-loop options.", query: "sock knitting needles set", category: "knitting-needles" },
      { label: "Sock blockers", description: "Useful for shaping, drying, and checking a finished pair.", query: "adjustable sock blockers", category: "blocking-tools" },
    ],
  },
  "yarn-calculator": {
    intro: "Take the calculator's yarn weight and skein total with you when comparing project materials.",
    items: [
      { label: "Project yarn", description: "Compare yarn by weight, fiber, yardage per skein, and care instructions.", query: "knitting crochet project yarn", category: "yarn" },
      { label: "Digital yarn scale", description: "Weigh partial skeins to estimate how much yardage remains.", query: "digital yarn scale grams", category: "measuring-tools" },
      { label: "Yarn swift and winder", description: "Turn hanks into tidy center-pull cakes before starting.", query: "yarn swift ball winder set", category: "yarn-tools" },
    ],
  },
  "sleeve-calculator": {
    intro: "Keep sleeve shaping organized with circular needles, removable markers, and enough matching yarn to finish both sleeves.",
    items: [
      { label: "Circular knitting needles", description: "Short circular or magic-loop needles handle sleeve circumferences.", query: "circular knitting needles sleeves magic loop", category: "knitting-needles" },
      { label: "Removable stitch markers", description: "Mark decrease rounds and compare shaping on both sleeves.", query: "removable stitch markers knitting", category: "notions" },
      { label: "Sweater yarn", description: "Compare garment yarn by fiber, weight, yardage, and dye lot.", query: "sweater yarn knitting", category: "yarn" },
    ],
  },
  "weaving-sett-calculator": {
    intro: "Use the calculated sett to compare weaving yarn and the tools needed to measure and load a consistent warp.",
    items: [
      { label: "Weaving yarn", description: "Compare cones and skeins by fiber, wraps per inch, and project use.", query: "weaving yarn cone cotton wool", category: "yarn" },
      { label: "Weaving shuttles", description: "Choose a shuttle sized for your loom width and weft yarn.", query: "weaving shuttle rigid heddle loom", category: "weaving-tools" },
      { label: "Yarn wraps gauge", description: "A WPI gauge helps verify mystery yarn before choosing sett.", query: "yarn wraps per inch gauge", category: "measuring-tools" },
    ],
  },
  "cast-on-calculator": {
    intro: "Pair the calculated stitch count with needles, markers, and yarn that match the pattern gauge.",
    items: [
      { label: "Knitting needle set", description: "Multiple sizes make it easier to swatch and correct gauge.", query: "knitting needle set circular interchangeable", category: "knitting-needles" },
      { label: "Stitch markers", description: "Separate repeats and sections in long cast-on rows.", query: "stitch markers knitting", category: "notions" },
      { label: "Project yarn", description: "Compare yarn by the pattern's weight, fiber, and yardage requirements.", query: "knitting yarn by weight", category: "yarn" },
    ],
  },
  "raglan-calculator": {
    intro: "Raglan construction is easier to manage with a flexible circular needle, clear section markers, and a consistent dye lot.",
    items: [
      { label: "Interchangeable circular needles", description: "Change cable length as the yoke grows without moving the work.", query: "interchangeable circular knitting needles set", category: "knitting-needles" },
      { label: "Distinct stitch markers", description: "Use contrasting markers at each raglan line and round start.", query: "color coded stitch markers knitting", category: "notions" },
      { label: "Sweater yarn", description: "Compare garment yarn by gauge, fiber, yardage, and dye lot.", query: "sweater yarn knitting worsted dk", category: "yarn" },
    ],
  },
};

export default function ToolAffiliateRecommendations({ slug }: { slug: string }) {
  const recommendations = TOOL_RECOMMENDATIONS[slug];
  if (!recommendations) return null;

  return (
    <AffiliateRecommendations
      page={`/${slug}`}
      contentType="calculator"
      intro={recommendations.intro}
      items={recommendations.items}
      placement="tool-project-supplies"
    />
  );
}
