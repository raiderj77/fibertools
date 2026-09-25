export interface Guide {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  date: string;
  modifiedDate?: string;
  sources?: { title: string; url: string }[];
  keywords: string[];
  editorialNote?: string;
  sections: { heading: string; content: string; markdown?: boolean; image?: { src: string; preview: string; alt: string; caption: string; width: number; height: number } }[];
}

export const guides: Guide[] = [
  {
    slug: "reading-yarn-labels",
    title: "How to Read a Yarn Label: Weight, Gauge & Care",
    description: "Read yarn weight, length, gauge, fiber and care details without confusing category, mass and yardage. Includes a measured-skein example.",
    toolSlug: "yarn-calculator",
    date: "2026-02-23",
    modifiedDate: "2026-09-05",
    keywords: ["how to read yarn labels", "yarn label symbols", "yarn weight chart", "yarn care instructions", "knitting yarn labels", "crochet yarn labels"],
    sections: [
      {
        heading: "Keep the exact product information",
        content: "Save the manufacturer, product name, color, dye lot when supplied, fiber composition, and full care instructions. A photograph can preserve the original label. Do not infer fiber composition from an unfamiliar abbreviation or assume that a missing dye-lot number means every ball will match. Ask the maker when an important field is unclear."
      },
      {
        heading: "Distinguish category, mass, and length",
        content: "The Craft Yarn Council system runs from Lace (0) through Jumbo (7). The category is thickness guidance, not the mass of a ball or a universal length per gram. Labels may separately state grams or ounces and yards or meters. Needle diameters shown beside a category are tool recommendations, not the diameter of the yarn.\n\nFor unit conversion, one yard equals 0.9144 meters. A label stating 200 yards therefore represents 182.88 meters before label rounding. Two products with the same mass or category can contain different lengths."
      },
      {
        heading: "Compare with the pattern gauge",
        content: "Read both the measurement span and the stitch type used for label gauge. Knitting stockinette and single crochet have different reference ranges. Four inches is 10.16 centimeters, so keep the actual stated span when calculating.\n\nThe pattern gauge is the target for that pattern, and label gauge is a starting reference. Make a representative swatch in the intended stitch pattern, construction, and permitted finishing treatment. Compare stitch and row gauge separately; matching a category or needle number does not establish finished fit."
      },
      {
        heading: "Read the complete care instruction",
        content: "Care symbols cover washing, bleaching, drying, ironing, and professional textile care. Their additional marks, numbers, and text matter: do not identify a treatment from the outer shape alone. Check the temperature unit and use the linked CYC chart or the manufacturer's explanation for the exact symbol.\n\nThe word superwash does not replace the care label. Check permitted washing temperature, cycle, and drying method separately. Machine washing permission does not automatically mean tumble drying is permitted. For an item combining yarns, fabric, and other components, check the applicable instructions for the whole combination and test a representative sample."
      },
      {
        heading: "Treat unfamiliar logos as a verification task",
        content: "An unfamiliar pictogram does not establish resistance to moths or flame, recycled content, or a certification. Verify it with the manufacturer or the named certification scheme. OEKO-TEX STANDARD 100 concerns testing for harmful substances against its criteria; check the certificate or QR code using the scheme's Label Check. Do not turn a logo into an unrestricted safety or organic-content claim."
      },
      {
        heading: "Use quantity calculations as planning arithmetic",
        content: "Compare the actual pattern requirement or measured swatch use with the label length. For example, a planning requirement of 500 yards divided by 220 yards per skein is about 2.27, so rounding upward gives three whole skeins before any additional allowance. This does not establish that 500 yards is sufficient for a particular project. Joins, finishing, gauge changes, and waste need their own allowance.\n\nFor a partial skein, estimate length as remaining yarn mass divided by full label mass, multiplied by full label length. Exclude packaging and assume consistent length per gram within that same yarn. WPI or a weight category cannot supply a missing label ratio."
      },
      {
        heading: "When information is missing",
        content: "Keep unknown fiber content and care requirements unresolved. Ask the seller or maker for the exact product information; do not use an open flame to identify mystery yarn. Appearance, feel, or WPI alone cannot prove fiber composition or a safe care method. If identification affects safety or the intended use, obtain qualified textile identification before committing the yarn to that use."
      }
    ],
    sources: [
      { title: "Craft Yarn Council: Standard Yarn Weight System", url: "https://www.craftyarncouncil.com/standards/yarn-weight-system" },
      { title: "Craft Yarn Council: Care Symbols", url: "https://www.craftyarncouncil.com/standards/care-symbols" },
      { title: "Woolmark: Tumble Drying Wool", url: "https://www.woolmark.com/care/tumble-drying-wool/" },
      { title: "OEKO-TEX: STANDARD 100 and Label Check", url: "https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100" }
    ]
  },
  {
  slug: "knitting-gauge-guide",
  title: "Knitting Gauge Guide: Swatches, Stitches & Rows",
  description: "See how stitch and row gauge change dimensions when counts stay fixed, with checked 200-stitch and 120-row examples and clear limits.",
  toolSlug: "gauge-calculator",
  date: "2026-03-06",
  modifiedDate: "2026-09-16",
  keywords: [
    "knitting gauge",
    "gauge swatch",
    "stitch gauge",
    "row gauge",
    "knitting tension",
    "gauge calculator"
  ],
  sections: [
    {
      heading: "Why Does Tighter Knitting Gauge Make the Same Stitch Count Smaller?",
      content: "When more stitches fit into the same measured width, each stitch occupies less width on average. If you keep the total stitch count unchanged, the modeled piece is narrower. Calculate that width by dividing the total stitches by the measured stitches per inch.\n\nThis explains a size difference; it does not prove that changing one count will correctly resize a whole knitting pattern.",
      markdown: true
    },
    {
      heading: "Compare equal measurement spans first",
      content: "A pattern gauge of 20 stitches over 4 inches means 5 stitches per inch. A swatch measuring 25 stitches over 4 inches means 6.25 stitches per inch. Comparing 20 with 25 is meaningful because both counts cover the same distance.\n\nUse a sample representative of the intended fabric. The [Craft Yarn Council's gauge instructions](https://media.craftyarncouncil.com/read_instructions.html) recommend swatching with the specified yarn, tools and pattern stitch. Follow the selected pattern and yarn care instructions for the swatch's treatment, and measure the stated area. Do not compare a pattern's stitch gauge with your row count.\n\nThe [FiberTools gauge calculator](https://fibertools.app/gauge-calculator) can convert the measured width, height, stitch count and row count into gauge. Enter the actual measurement span instead of assuming every sample is exactly four inches.",
      markdown: true
    },
    {
      heading: "Keep 200 stitches and compare the modeled widths",
      content: "Suppose a hypothetical flat panel uses 200 stitches. At 20 stitches per 4 inches:\n\n**200 ÷ (20 ÷ 4) = 40 inches.**\n\nIf your representative swatch instead measures 25 stitches per 4 inches, the same count gives:\n\n**200 ÷ (25 ÷ 4) = 32 inches.**\n\nThat is an 8-inch difference. These figures are illustrative arithmetic, not measurements of a knitted panel we made.\n\nNotice that a 25 percent increase in stitches per inch does not mean a 25 percent decrease in width. Gauge rises from 5 to 6.25 stitches per inch, but width falls from 40 to 32 inches: a 20 percent decrease. Width is divided by gauge, so the relationship is reciprocal.\n\n| Hypothetical measurement | Pattern reference | Your swatch |\n| --- | --- | --- |\n| Stitches over 4 inches | 20 | 25 |\n| Stitches per inch | 5 | 6.25 |\n| Width at 200 stitches | 40 inches | 32 inches |\n\nThis comparison assumes the swatch density applies across the planned fabric. Edges, shaping and other sections need their own consideration.",
      markdown: true,
      image: {
        src: "/images/guides/gauge-width-comparison.svg",
        preview: "/images/guides/gauge-width-comparison.png",
        alt: "At a fixed 200 stitches, 20 stitches per 4 inches models a 40-inch width, while 25 stitches per 4 inches models 32 inches; bars use the same scale.",
        caption: "Original comparison diagram. Bars represent modeled widths at the same scale; they do not depict stitch structure, fabric stretch or a tested garment.",
        width: 1200,
        height: 760
      }
    },
    {
      heading: "Row gauge changes a different dimension",
      content: "Now suppose the pattern reference is 24 rows per 4 inches and your swatch measures 28 rows per 4 inches. That means 6 rows per inch versus 7.\n\nFor a fixed 120-row section, the modeled heights are 120 ÷ 6 = **20 inches** and 120 ÷ 7 ≈ **17.14 inches**. The row-gauge difference is separate from the stitch-gauge difference above; one cannot be inferred from the other.\n\nRead whether the pattern tells you to work a fixed number of rows or to continue to a stated measurement. Do not automatically replace a row count when the instructions also schedule shaping or depend on a repeat. The calculator's arithmetic does not resolve those design requirements.",
      markdown: true
    },
    {
      heading: "What would preserving the width require mathematically?",
      content: "At 6.25 stitches per inch, a 40-inch width corresponds to **40 × 6.25 = 250 stitches**. The same result comes from scaling the original count: 200 × 25 ÷ 20 = 250.\n\nThat 250 is one arithmetic checkpoint. It is not an approved replacement cast-on for a sweater, and it does not update increases, decreases, edges, stitch repeats, seams, armholes or yarn requirements. The [gauge calculator's count-scaling explanation](https://fibertools.app/gauge-calculator) explicitly limits its result to the counts supplied.\n\nFor the row example, preserving a 20-inch height at 7 rows per inch would require 140 rows mathematically. Whether those rows belong in the pattern requires reviewing its actual instructions.",
      markdown: true
    },
    {
      heading: "Choose a next step with the pattern in front of you",
      content: "If you are following a tested pattern, first check that your swatch uses the specified stitch pattern and construction and that you measured it correctly. Compare both stitch and row gauge. Where appropriate, make another swatch with a different needle size and measure again; the Craft Yarn Council describes changing needle size when a swatch's dimensions differ from the target. No specific needle-size change guarantees a particular correction.\n\nIf you deliberately choose a different gauge, review every affected instruction before proceeding. Save the pattern gauge, your measured gauge, counts, resulting modeled dimensions and any unresolved design questions. This makes a useful planning record without presenting a partial calculation as a complete redesign.\n\n### Can matching stitch gauge alone guarantee fit?\n\nNo. This calculation only models dimensions from density and count. Row gauge, the pattern's construction and sizing instructions, and the finished fabric still matter. Neither the diagram nor a calculator result verifies a garment's fit.\n\n### Can I use measurements in centimeters?\n\nYes, provided you use matching units throughout the calculation. Divide stitches by measured centimeters to obtain stitches per centimeter, then divide the total stitch count by that density for a width in centimeters. Select the corresponding unit mode when using the calculator; do not mix a centimeter span with an inch-based density.",
      markdown: true
    }
  ],
  editorialNote: "AI-assisted explanation prepared with Codex. Numerical examples are hypothetical and checked mathematically; no physical project or yarn product was tested. Published by FiberTools.",
  sources: [
    {
      title: "Craft Yarn Council: Reading instructions and gauge",
      url: "https://media.craftyarncouncil.com/read_instructions.html"
    },
    {
      title: "FiberTools: Calculator inputs and model",
      url: "https://fibertools.app/gauge-calculator"
    }
  ]
},
  {
  slug: "blanket-yarn-guide",
  title: "How Much Yarn for a Blanket? Swatch-Based Guide",
  description: "Estimate blanket yarn from a measured swatch, keep allowance separate, and convert yards to whole skeins with a checked 50×60-inch example.",
  toolSlug: "yarn-calculator",
  date: "2026-03-06",
  modifiedDate: "2026-09-16",
  keywords: [
    "blanket yarn yardage",
    "how much yarn for a blanket",
    "blanket size chart",
    "yarn for baby blanket",
    "throw blanket yarn",
    "blanket calculator"
  ],
  sections: [
    {
      heading: "How Much Yarn Do You Need for a Blanket? A Swatch-Based Estimate",
      content: "For a flat rectangular blanket, estimate yarn by dividing the planned blanket area by the area of a representative swatch, then multiplying by the yarn used in that swatch. Add a separate planning allowance and divide by the length on your yarn label to estimate whole skeins. The answer depends on your measurements; a blanket size alone cannot determine a reliable shopping quantity.",
      markdown: true
    },
    {
      heading: "Measure the fabric you actually plan to make",
      content: "Make a sample using your intended yarn, stitch pattern, hook or needles, and working tension. Follow the pattern and yarn care instructions for any finishing before recording its dimensions. The [Craft Yarn Council's gauge guidance](https://media.craftyarncouncil.com/read_instructions.html) recommends swatching with the specified materials and stitch pattern before starting a project.\n\nFor a consumption estimate, record both the sample's area and the yarn length used to make that same area. Do not measure the center of a larger sample and pair that smaller area with the yarn used by the entire sample: that would inflate the estimate. Keep a note of whether tails are included. If substantial tails or sample-only edges are included, the area calculation would multiply those extras as though they occurred throughout the blanket.\n\nYou need five measurements: blanket width and length, swatch width and length, and swatch yarn consumption. Use one unit for all four dimensions. Use yards for both yarn consumption and label length, or meters for both. If a swatch is not representative of the planned fabric, improve the measurement before relying on the result.",
      markdown: true
    },
    {
      heading: "Work through a hypothetical 50 by 60 inch example",
      content: "Suppose the blanket's main rectangle will measure 50 by 60 inches. Suppose a representative 4 by 4 inch sample uses 20 yards. These are illustrative inputs, not measurements from a blanket we made or a universal estimate for a throw.\n\n| Step | Calculation | Result |\n| --- | --- | --- |\n| Main blanket area | 50 × 60 | 3,000 square inches |\n| Sample area | 4 × 4 | 16 square inches |\n| Area ratio | 3,000 ÷ 16 | 187.5 |\n| Base yarn estimate | 187.5 × 20 yards | 3,750 yards |\n| Chosen extra allowance | 3,750 × 0.10 | 375 yards |\n| Planned yarn total | 3,750 + 375 | 4,125 yards |\n\nThe 10 percent allowance is a choice for this example, not a tested waste rate or a promise that it covers your project. In the [FiberTools yarn calculator](https://fibertools.app/yarn-calculator), enter these dimensions, 20 yards of sample consumption, and an allowance of 10 to reproduce the planned total. The calculator shows the allowance separately from its measured-input base.",
      markdown: true,
      image: {
        src: "/images/guides/blanket-yarn-example.svg",
        preview: "/images/guides/blanket-yarn-example.png",
        alt: "Hypothetical blanket estimate: a 4 by 4 inch swatch using 20 yards scales to 3,750 yards for 50 by 60 inches, or 4,125 yards with 10 percent extra.",
        caption: "Original calculation diagram. Hypothetical inputs; drawings are not at a shared scale and do not depict stitches or a finished project.",
        width: 1200,
        height: 800
      }
    },
    {
      heading: "Convert the total into skeins without rounding down",
      content: "If your chosen yarn label lists 220 yards per skein, divide 4,125 by 220. That is 18.75 skeins, so the whole-skein plan is **19 skeins**.\n\nCheck the rounding against the actual lengths: 18 skeins contain 3,960 labeled yards, which is 165 yards short of this plan. Nineteen contain 4,180 labeled yards, which is 55 yards above it. That final 55 yards comes from buying whole skeins; it is separate from the earlier 375-yard allowance.\n\nBefore buying, check the seller's current return policy; do not assume unused skeins can be returned. Use your own label values. The 220-yard value is hypothetical and does not identify a product. To use the calculator's “Yarn length + skeins” option, also enter the actual weight per skein: that field supports the displayed purchase weight, rather than changing the area-based yarn requirement.",
      markdown: true
    },
    {
      heading: "Keep borders and other construction separate",
      content: "The main-rectangle estimate does not calculate a border, fringe, joining method, or a shaped design. Adding border width to the rectangle while using a swatch of a different body stitch would assume both fabrics consume yarn at the same rate. That assumption may not fit your plan.\n\nUse construction-specific pattern quantities or a separate representative sample for those parts. Record their requirements explicitly. If you add them separately, make clear what your percentage allowance still covers so you do not accidentally count the same extra twice. Decide whether swatch yarn will be reused or needs its own allocation.\n\nFor multiple colors, plan each color's requirement separately before rounding to skeins. A combined total cannot tell you how many skeins of each color to buy.",
      markdown: true
    },
    {
      heading: "Check how sensitive the estimate is",
      content: "Holding this example's dimensions constant, a sample measurement of 19 yards instead of 20 gives 3,562.5 base yards. At the same 10 percent allowance, that becomes 3,918.75 yards: 18 whole skeins at 220 yards each. A measurement of 21 yards gives 4,331.25 planned yards: 20 skeins.\n\nThose are arithmetic comparisons, not an observed error range. They show why a small change in the sample's measured consumption can change the shopping list. Record your measurements rather than treating the example's 19 skeins as a recommendation for every blanket.",
      markdown: true
    },
    {
      heading: "Common questions",
      content: "### Can I use yarn weight alone to choose a quantity?\n\nA category such as Medium (4) is not a measurement of your blanket's yarn consumption. The [Craft Yarn Council yarn-weight system](https://www.craftyarncouncil.com/standards/yarn-weight-system) provides categories and guideline gauge ranges. For this calculation, use a representative sample and the actual yarn label rather than turning a category into a fixed yards-per-blanket number.\n\n### Can I use this method for knitting and crochet?\n\nThe arithmetic can scale a representative flat sample of either craft. It assumes the planned fabric has the same consumption per area as that sample. It does not supply a universal conversion between knitted and crocheted fabrics.\n\n### Is the result a guarantee that I will have enough yarn?\n\nNo. It is a planning result based on the measurements and allowances you entered. Changes in fabric, dimensions or construction need their own assessment. Save those assumptions with your project notes, then use the [yarn calculator](https://fibertools.app/yarn-calculator) to recalculate when the plan changes.",
      markdown: true
    }
  ],
  editorialNote: "AI-assisted explanation prepared with Codex. Numerical examples are hypothetical and checked mathematically; no physical project or yarn product was tested. Published by FiberTools.",
  sources: [
    {
      title: "Craft Yarn Council: Reading instructions and gauge",
      url: "https://media.craftyarncouncil.com/read_instructions.html"
    },
    {
      title: "Craft Yarn Council: Standard Yarn Weight System",
      url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
    },
    {
      title: "FiberTools: Calculator inputs and model",
      url: "https://fibertools.app/yarn-calculator"
    }
  ]
},
  {
    slug: "needle-sizes-guide",
    title: "Knitting Needle Sizes: US, UK & Metric Chart",
    description: "Compare metric diameter with US, UK and Japanese needle labels, then verify the exact product and make a gauge swatch.",
    toolSlug: "needle-converter",
    date: "2026-03-06",
    keywords: [
      "knitting needle sizes",
      "needle size chart",
      "US UK metric needles",
      "needle conversion",
      "knitting needle guide",
      "crochet hook sizes"
    ],
    sections: [
      {
        heading: "Compare diameter, not the number alone",
        content: "Needle numbering systems are not interchangeable or linear. Metric labels describe diameter in millimeters. A number such as 8 can identify different diameters in US and Japanese systems."
      },
      {
        heading: "A concrete example",
        content: "The included reference lists US 8 knitting needles as 5.0 mm. Clover Japanese size 8 is 4.5 mm, size 0 is 2.1 mm, and size 15 is 6.6 mm. Japanese patterns can use numbered sizes; they do not exclusively use metric labels."
      },
      {
        heading: "Check manufacturer conventions",
        content: "Some legacy UK and hook-size conventions differ or have uncertain equivalents. FiberTools leaves unsupported cells empty rather than guessing. Check the actual manufacturer label and diameter instead of treating every row as a universal standard."
      },
      {
        heading: "Use the converter",
        content: "Choose knitting needles or crochet hooks and search a supplied label or a metric value such as 5mm. Read the complete matching row and its source limitations. A search match is a table entry, not a recommendation for the project."
      },
      {
        heading: "Make a representative swatch",
        content: "Begin with the pattern and exact yarn guidance, then measure a swatch in the intended stitch pattern, construction, and finishing. The same nominal diameter can produce different fabric with different tools, yarn, or tension. Matching the label alone does not guarantee gauge or fit."
      }
    ],
    modifiedDate: "2026-09-05",
    sources: [
      {
        title: "Clover: Japanese knitting-needle specifications (2026)",
        url: "https://www.clover.co.jp/recipe/takumikikakus.pdf"
      },
      {
        title: "Craft Yarn Council: Hooks and Needles",
        url: "https://www.craftyarncouncil.com/standards/hooks-and-needles"
      },
      {
        title: "Craft Yarn Council: Standard Yarn Weight System",
        url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
      }
    ]
  },
  {
    slug: "uk-us-crochet-terms-guide",
    title: "UK vs US Crochet Terms: Conversion Guide",
    description: "Compare common UK and US crochet terms, including double crochet and treble, and learn how to identify a pattern's terminology system.",
    toolSlug: "uk-to-us-converter",
    date: "2026-03-06",
    keywords: ["UK US crochet terms", "crochet conversion", "double crochet UK US", "treble crochet", "crochet abbreviations", "crochet terminology"],
    sections: [
      {
        heading: "Why Two Systems Exist",
        content: "UK and US crochet sources can use the same words or abbreviations for different stitch actions. Several common pairs follow a familiar height shift: UK double crochet maps to US single crochet, UK half treble maps to US half double crochet, and UK treble maps to US double crochet.\n\nThat pattern is a useful warning, not a universal rule for every modern, regional, designer-specific, or historical term. Identify the source convention and check its abbreviation key, diagrams, gauge, and stitch counts. The converter changes only terms in its displayed deterministic map and leaves unsupported wording unchanged."
      },
      {
        heading: "The Most Confusing Conversions",
        content: "Three stitch pairs cause the most errors. First: UK double crochet (dc) is US single crochet (sc). This is the most common crochet stitch, a simple pull-through with no yarn-over before insertion. If a UK pattern says \"dc across,\" an American crocheter who works a US double crochet (yarn over, insert, pull through, work off in pairs) will produce fabric twice as tall as intended.\n\nSecond: UK treble (tr) is US double crochet (dc). This stitch involves one yarn-over before inserting the hook. Since \"dc\" and \"tr\" are both common abbreviations, and both appear in both systems with different meanings, this is where most cross-system mistakes happen.\n\nThird: UK half treble (htr) is US half double crochet (hdc). The stitch uses one yarn-over but pulls through all three loops at once instead of working them off in pairs. The abbreviation shift from \"htr\" to \"hdc\" is a reliable clue about which system a pattern uses, if you see \"htr,\" the pattern is almost certainly UK."
      },
      {
        heading: "Included Common-Term Chart",
        content: "The included map covers a bounded set of common modern terms and abbreviations, including chain, slip stitch, UK double crochet to US single crochet, UK half treble to US half double crochet, UK treble to US double crochet, and selected taller stitches.\n\nThis is not a complete map of every regional, designer-specific, or historical term. Abbreviations such as dc and tr are ambiguous without the source convention because the same letters can refer to different stitch actions.\n\nIdentify the source terminology first and review the pattern's own key, diagrams, gauge, and stitch counts after conversion."
      },
      {
        heading: "Vintage UK Patterns Have Additional Quirks",
        content: "Historical terms can vary by era, region, publisher, and designer and may not map cleanly to a modern convention. An unfamiliar term must be checked against the source's definitions, diagrams, counts, and publication context instead of guessed from one word.\n\nVintage hook or needle numbers also require a dated, source-specific table. A modern term converter does not identify the sizing system or validate the fabric. Match the stated gauge with a representative swatch and verify the exact tool diameter independently.\n\nThe UK/US Converter performs one pass over only the terms in its displayed map after you identify the source convention. Other text stays unchanged; it does not identify, translate, or validate a whole pattern."
      },
      {
        heading: "How to Spot Which System a Pattern Uses",
        content: "Start with an explicit declaration such as \"written in US terms\" or \"UK terminology.\" Then check the pattern's own abbreviation key, stitch instructions, diagrams, gauge, and expected counts. Terms such as sc or hdc can support a US reading and htr can support a UK reading, but one token is not enough to validate an entire source.\n\nTurning-chain instructions can be pattern-specific and may or may not count as a stitch, so do not identify the convention from a fixed chain number alone. Compare the named stitch with its written action or diagram.\n\nA marketplace, publisher, brand, or publication country is context, not proof of the terminology used by an individual pattern. If the source remains ambiguous, leave the wording unchanged and seek a pattern-specific key or authoritative clarification before converting it."
      },
      {
        heading: "Tips for Switching Between Systems",
        content: "Record the source convention and annotate only terms you have verified against the pattern's key or an authoritative reference. Recheck counts and construction after any substitution.\n\nRecognizing stitch structure can help review a term, but the name alone does not validate an instruction. Diagrams and worked examples remain important when wording is ambiguous.\n\nThe UK/US Converter applies its displayed map in one pass. The Abbreviation Glossary and Stitch Quick Reference contain selected definitions and notes, while the Needle Converter only looks up entries in its included tables. None of them validates an entire pattern."
      }
    ]
  },
  {
    slug: "wpi-guide",
    title: "WPI Guide: How to Measure Wraps Per Inch",
    description: "Measure wraps per inch, interpret overlapping CYC yarn-weight ranges, and verify the actual yarn with its label and a swatch.",
    toolSlug: "yarn-weight-chart",
    date: "2026-03-06",
    keywords: [
      "wraps per inch",
      "WPI yarn",
      "yarn weight measurement",
      "how to measure WPI",
      "yarn substitution",
      "handspun yarn weight"
    ],
    sections: [
      {
        heading: "What WPI measures",
        content: "Wraps per inch measures how many adjacent wraps of a yarn occupy one inch. It is an approximate thickness reference, not a measure of fiber content, length per gram, or finished project size."
      },
      {
        heading: "How to measure",
        content: "Wrap the yarn around an object with a consistent circumference, such as a pencil. Lay the wraps beside each other without overlap or large gaps, and do not stretch the yarn. Count the wraps within an inch at several places. Repeat the measurement when wrapping tension is uncertain."
      },
      {
        heading: "Read overlapping ranges",
        content: "The cited CYC guide gives Lace 30–40+, Super Fine 14–30, Fine 12–18, Light 11–15, Medium 9–12, Bulky 6–9, Super Bulky 5–6, and Jumbo 1–4 WPI. These are subjective guidance ranges, not mutually exclusive bins. A fractional value in a gap should remain unresolved rather than being forced into a category."
      },
      {
        heading: "Worked comparison: 12 WPI",
        content: "A reading of 12 WPI falls in Fine, Light, and Medium ranges. The result therefore suggests several candidates. It does not prove that a yarn is DK or worsted. Compare the actual label, pattern gauge, and representative swatch."
      },
      {
        heading: "Use the right gauge comparison",
        content: "CYC distinguishes stockinette knitting gauge from single-crochet gauge. Do not compare a crochet swatch to knitting stitch ranges. Follow the pattern stitch and row gauge and check the resulting fabric."
      },
      {
        heading: "What to do next",
        content: "Use the WPI calculator to compare ranges, then swatch the actual yarn. If you need remaining yardage, use its label or measured length-to-weight ratio; WPI alone cannot supply that ratio."
      }
    ],
    modifiedDate: "2026-09-05",
    sources: [
      {
        title: "Craft Yarn Council: How to Measure Wraps Per Inch",
        url: "https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi"
      },
      {
        title: "Craft Yarn Council: Standard Yarn Weight System",
        url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
      }
    ]
  },
  {
    slug: "pricing-handmade-guide",
    title: "How to Price Handmade Knitting & Crochet",
    description: "Work through materials, time and overhead when pricing handmade knitting or crochet, with clear limits on what the cost calculator includes.",
    toolSlug: "project-cost-calculator",
    date: "2026-03-06",
    modifiedDate: "2026-09-05",
    keywords: ["pricing handmade crochet", "how to price knitting", "handmade pricing formula", "crochet business pricing", "knitting commission price", "craft pricing guide"],
    sections: [
      {
        heading: "The Real Cost of Handmade vs Retail",
        content: "A hand-knit sweater takes 40–80 hours to complete. At even a modest hourly rate, that puts the labor cost alone at hundreds of dollars, before materials. This is why handmade items can never compete with mass-produced retail on price. Factory-made garments benefit from industrial-speed machines, bulk fiber purchasing, and labor markets with lower wages. Handmade operates in a completely different economy.\n\nUnderstanding this gap is the first step to pricing sanely. Many makers set prices by comparing to retail (\"a store sweater costs $60, so I'll charge $80\") and end up earning less than minimum wage for their time. The correct approach is to calculate costs from the ground up: materials plus labor plus overhead equals your minimum viable price.\n\nThis doesn't mean every handmade item needs to cost $500. It means you need to be realistic about which items are viable to sell, which make better gifts, and which are personal projects you make for the joy of the craft. Not everything needs to be monetized, but when you do sell, price it properly."
      },
      {
        heading: "How to Calculate Materials Cost",
        content: "Materials cost includes every physical input: yarn, buttons, zippers, stuffing, stitch markers consumed, and any supplies used up during the project (like blocking wires that eventually wear out). For yarn, multiply the number of skeins used by the price per skein. Include partial skeins, if you use three-quarters of a skein, count three-quarters of its cost.\n\nDon't forget shipping costs for online yarn purchases, sales tax, and any duties if you imported yarn internationally. These are real costs that eat into your margin if you ignore them. Keep receipts or a spreadsheet tracking what you paid for each yarn in your stash.\n\nIf you buy yarn on sale specifically for selling finished items, use the sale price. If you're using stash yarn you bought years ago at full price, use the replacement cost, what it would cost to buy that yarn today. This ensures your pricing stays consistent regardless of when you acquired materials."
      },
      {
        heading: "How to Value Your Time",
        content: "Choose an hourly rate that reflects both your skill level and your local market. Some makers use minimum wage as a floor; others set rates between $15 and $30 per hour depending on the complexity of the work and their experience. Track your time honestly, include not just active stitching but also swatching, pattern reading, assembly, blocking, weaving in ends, and any time spent communicating with the customer.\n\nA common formula is: (Materials cost) + (Hours × Hourly rate) + (10–20% overhead for tools, electricity, workspace) = Wholesale price. Double the wholesale price to get the retail price. This doubling accounts for selling costs: marketplace fees, packaging, shipping materials, payment processing, and the time spent listing, photographing, and marketing.\n\nIf the retail price feels uncomfortably high, resist the urge to lower your hourly rate. Instead, consider whether the item is the right product for your market. Small accessories, hats, cowls, dishcloths, take fewer hours and price more accessibly than sweaters or blankets. Many successful sellers focus on items with a high perceived value relative to their production time."
      },
      {
        heading: "Pricing for Gifts vs Commissions vs Selling",
        content: "Gifts have no pricing pressure, you spend what you want and donate your time freely. But it's still useful to calculate the full cost so you understand the value of what you're giving. This prevents resentment when someone asks you to \"just whip up\" a queen-size blanket.\n\nCommissions, custom orders from a specific person, should be priced at full retail or higher. Custom work involves back-and-forth communication, pattern modifications, color consultations, and the pressure of meeting someone else's expectations. Charge a 20–30% premium over your standard retail price for custom work, and require a non-refundable deposit (typically 50%) before starting.\n\nSelling through marketplaces like Etsy or at craft fairs introduces platform fees, transaction fees, and competition. Etsy takes roughly 10–12% between listing fees, transaction fees, and payment processing. Craft fair booth fees might run $50–$200 per event. Build these costs into your prices rather than absorbing them from your profit."
      },
      {
        heading: "Common Pricing Mistakes",
        content: "The biggest mistake is undercharging out of guilt or imposter syndrome. Many makers feel uncomfortable charging \"so much\" for something they enjoy doing. But enjoyment doesn't eliminate cost, a chef who loves cooking still charges for meals.\n\nAnother common error is failing to account for unsold inventory. If you make ten hats and sell seven, the three unsold hats represent lost materials and labor. Your pricing on the seven that sold needs to cover the full cost of all ten. Build a small margin for unsold stock into your per-item price.\n\nIgnoring overhead is a third pitfall. Needles, hooks, blocking mats, pattern purchases, yarn winder, swift, storage bins, electricity for lighting, these costs are real and ongoing. A flat 10–15% overhead markup on top of materials and labor is a reasonable way to account for them without tracking every small expense individually."
      },
      {
        heading: "Tools That Help You Calculate Before You Start",
        content: "Running the numbers before you buy yarn or cast on makes assumptions visible. The Project Cost Calculator totals the yarn, notions, and extras you enter and can model time from an entered stitch count and rate. An optional selling price shows the amount left after entered materials; the tool does not calculate overhead, taxes, selling fees, or a labor charge. Its output is a scenario, not a guarantee that an item will sell or be profitable.\n\nFor flat rectangular knitting or crochet, the Yarn Calculator can scale measured swatch use and convert the estimate to whole skeins from a label. Other constructions need a pattern-specific or measured method. The Blanket Calculator is a rough model with displayed assumptions, while the Gauge Calculator compares measured and target gauge; neither verifies a finished project's fit, quantity, or market value.\n\nRecord the source of every input, add only the contingency you intend, and revisit the estimate when the design or material changes."
      }
    ]
  },
  {
    slug: "amigurumi-beginners-guide",
    title: "Amigurumi for Beginners: Shapes, Counts & Math",
    description: "Review amigurumi starts, shape count schedules, increases, decreases and joining, plus the limits of a basic arithmetic reference.",
    toolSlug: "amigurumi-shapes",
    date: "2026-03-06",
    keywords: ["amigurumi for beginners", "amigurumi crochet", "magic ring crochet", "amigurumi shapes", "crochet sphere", "amigurumi increase decrease"],
    sections: [
      {
        heading: "What Amigurumi Is",
        content: "Amigurumi commonly refers to crocheted or knitted stuffed figures and forms. Individual patterns may use continuous spirals, joined rounds, turned work, or other construction methods, so follow the method defined by the selected pattern rather than assuming one universal technique.\n\nWhen a pattern uses continuous rounds, mark the round boundary and count every completed round. Joined or turned constructions need their own setup and joining instructions.\n\nYarn, hook, gauge, stitch, stuffing, and intended use determine whether the fabric and finished piece are suitable. Make and assess a sample instead of choosing a hook from a fixed offset from the yarn label."
      },
      {
        heading: "The Magic Ring Start",
        content: "A magic ring, chain ring, or another foundation may be specified for a round start. Each method has different handling and finishing requirements; use the start defined by the pattern and secure it as instructed.\n\nThe included shape tool models a six-stitch magic-ring start for its sphere, cone, and cylinder count references. That is a scope choice for the arithmetic, not a claim that every amigurumi pattern begins the same way.\n\nPractice the selected start with the actual material, recount the first round, and leave a tail appropriate for the pattern's finishing method."
      },
      {
        heading: "How Sphere Size Is Determined by Stitch Count and Gauge",
        content: "One basic sphere count model increases from six stitches, holds a widest count, and then decreases back toward a closing opening. Adding or removing six stitches per shaping round keeps that model's stated totals internally consistent.\n\nThe site's bounded reference uses one center round for an even requested total or two for an odd total; it does not calculate a requested diameter. Other tested patterns may hold the widest count for a different number of rounds or distribute shaping differently.\n\nGauge, materials, placement, joining method, and stuffing affect the physical result. Measure a sample if size or shape matters, and use a tested pattern for a specified finished object."
      },
      {
        heading: "Understanding Increase and Decrease Rounds",
        content: "An increase adds stitches and a decrease removes them. The exact placement affects the surface and must consume the previous round's stitches consistently with the stated new count.\n\nSome patterns shift increase or decrease positions between rounds to change where shaping lines appear. That placement is deliberate, not random, and the site's basic reference does not claim to optimize the visible surface.\n\nUse the decrease, stuffing sequence, and finishing method specified for the project. Recount before continuing whenever the real round total differs from the written total."
      },
      {
        heading: "Connecting Shapes Cleanly",
        content: "Most amigurumi figures are assembled from separate pieces: a head sphere, a body oval, cylindrical limbs, and ears or other features. The joining method affects both appearance and durability. The most common approach is sewing pieces together with a yarn needle and matching yarn, using a whip stitch or mattress stitch through the outer loops of the stitches.\n\nFor strong, invisible joins, pin pieces in position before sewing. Use the same yarn as the piece being attached, and sew through both layers of fabric along the edge. Pull firmly enough to create a snug connection without puckering the fabric. Weave the tail through the body interior to hide it, then trim.\n\nSome shapes can be crocheted directly onto the body instead of sewn on separately. Ears, muzzles, and small bumps are often worked this way, pick up stitches from the surface of the body and crochet outward. This creates a seamless connection that's stronger than sewing and looks cleaner. It requires more experience to execute well, but it's worth learning for frequently used shapes like round ears and small limb nubs."
      },
      {
        heading: "Common Beginner Mistakes",
        content: "Common arithmetic errors include losing the round boundary, skipping a stitch, adding an unintended stitch at a join, or continuing after the real count differs from the stated count. Mark and recount each round.\n\nFabric gaps, firmness, stuffing behavior, closure, attachments, and safety depend on the actual materials and intended use. Test those decisions against the selected pattern and project-specific guidance.\n\nThe Amigurumi Shapes tool generates bounded count references for its included sphere, stepped-cone, circular-base cylinder, and foundation-chain oval models. It does not accept desired dimensions or guarantee a finished shape. The Circle Calculator supplies a separate basic round-count schedule, and the Stitch Counter can help record progress."
      }
    ]
  },
  {
    slug: "flat-circle-crochet-guide",
    title: "Crochet Flat Circle Guide: Increases & Shape Fixes",
    description: "Review flat-circle increase presets, what to check when fabric cups or ruffles, and the limits of the round-count calculator.",
    toolSlug: "circle-calculator",
    date: "2026-03-11",
    keywords: ["crochet flat circle", "crochet circle increases", "magic ring crochet", "crochet circle cupping", "crochet circle ruffling", "flat circle stitch count"],
    sections: [
      {
        heading: "Why One Preset Cannot Guarantee Flatness",
        content: "A circular fabric's shape depends on the actual stitch dimensions, yarn, hook, tension, joins, chain-counting convention, and technique. A fixed increase count can be a useful starting assumption, but it cannot prove that every material combination will lie flat.\n\nThe calculator includes four common arithmetic presets: 6, 8, 12, and 16. Their stitch labels help identify the intended reference, but they are not universal standards for single crochet, half double crochet, double crochet, or treble crochet.\n\nUse the center start and round convention stated by the selected pattern. The planner deliberately does not choose between an adjustable ring and chain start or decide whether a turning chain counts as a stitch."
      },
      {
        heading: "Round-by-Round Stitch Counts",
        content: "For a selected preset p, round 1 ends with p stitches and round r ends with p × r stitches. Every later round therefore adds p stitches.\n\nAt round r, each of p repeats consumes r − 1 stitches from the prior round: one receives an increase and r − 2 remain plain. That makes the consumption check explicit: p × (r − 1) equals the prior-round count.\n\nThe planner alternates the displayed placement as a counting arrangement. That does not establish that increases will be visually hidden or that the edge will be geometrically round. Compare the arrangement with the selected pattern."
      },
      {
        heading: "How to Respond to Cupping or Rippling",
        content: "Cupping or rippling is evidence that the current combination of counts and real fabric is not producing the intended shape. It does not identify one cause by itself. Recount the round and confirm the center, join, and chain convention before changing the plan.\n\nThen compare the work with the selected pattern and a representative swatch. Hook size, yarn, tension, stitch dimensions, and increase placement can interact, so a deterministic instruction such as always changing one hook size is not justified by the calculator's inputs.\n\nMake one deliberate change at a time, record it, and reassess the next round. Use a tested construction method for a hat, bowl, sphere, oval, or other three-dimensional shape."
      },
      {
        heading: "Common Uses for Crochet Circles",
        content: "Flat circles are starting shapes for projects such as coasters, mandalas, bag bottoms, cushion covers, and some amigurumi. The actual diameter and whether the fabric lies flat depend on stitch dimensions, yarn, tool, tension, joins, and technique.\n\nThe Circle Calculator generates a bounded arithmetic schedule from one of its included stitch presets and an entered round limit. It does not accept a target diameter or gauge and cannot guarantee flatness. Treat the preset as a swatchable starting point, count every round, and adjust with the selected pattern when the real fabric cups or ruffles."
      },
      {
        heading: "Frequently Asked Questions",
        content: "What do the four presets mean?\nThey are included arithmetic starting points of 6, 8, 12, and 16, associated with common crochet stitch labels. They are not flatness guarantees.\n\nWhat should I do if the fabric cups or ripples?\nFirst recount and confirm the pattern's center, join, and chain convention. Then compare the actual fabric with the selected pattern before making one recorded adjustment.\n\nDoes the calculator accept gauge or target diameter?\nNo. It accepts only a selected preset and a round limit, so it cannot predict finished diameter or project size.\n\nCan I use it for knitting or a complete hat pattern?\nNo. This is a crochet-only arithmetic reference and does not generate knitting, hat, bowl, sphere, or fit instructions."
      }
    ]
  },
  {
    slug: "sewing-craft-needle-guide",
    title: "Sewing Needle Types & Sizes: Craft Guide",
    description: "Compare tapestry, chenille, sharps, betweens and other hand-sewing needles by point, eye, size and intended use.",
    toolSlug: "needle-guide",
    date: "2026-03-11",
    keywords: ["sewing needle types", "tapestry needle", "chenille needle", "hand sewing needles", "yarn needle", "embroidery needle", "craft needle guide"],
    sections: [
      {
        heading: "Hand Sewing Needle Types Overview",
        content: "Hand sewing needles come in over a dozen specialized types, each designed for specific fabrics and techniques. Sharps are the general-purpose sewing needle, medium length, small round eye, sharp point, used for most garment sewing and mending. Betweens (also called quilting needles) are shorter than sharps with a small eye, designed for fine stitching through multiple fabric layers.\n\nTapestry needles have a blunt tip and a large elongated eye. They are the go-to needle for knitters and crocheters who need to seam pieces together or weave in yarn ends without splitting the yarn. Chenille needles look similar to tapestry needles with a large eye, but they have a sharp point for piercing woven fabric, use them for crewel embroidery or when attaching knitted pieces to woven fabric.\n\nDarning needles are long with a large eye, designed for weaving repair threads through fabric. Beading needles are extremely thin and flexible, narrow enough to pass through seed beads. Embroidery needles (also called crewel needles) have a sharp point and a slightly larger eye than sharps to accommodate embroidery floss."
      },
      {
        heading: "Choosing the Right Needle Size",
        content: "Needle size should match your fabric weight and thread thickness. The rule is simple: thicker fabric and thicker thread require larger needles. A needle that is too small for the fabric forces you to push hard, risking bent or broken needles and sore fingers. A needle that is too large leaves visible holes in delicate fabric.\n\nHere is a reference for matching needle type to use case:\n\nSharps (sizes 1-12), small round eye, sharp point, general hand sewing\nBetweens (sizes 1-12), small round eye, sharp point, shorter, quilting, fine stitching\nTapestry (sizes 13-28), large elongated eye, blunt tip, yarn seaming, cross stitch on evenweave\nChenille (sizes 13-26), large elongated eye, sharp point, crewel embroidery, piercing woven fabric\nDarning (sizes 1-18), large eye, blunt or sharp point, mending, weaving repairs\nBeading (sizes 10-16), very thin, tiny eye, seed bead and bugle bead work\nEmbroidery/Crewel (sizes 1-10), medium eye, sharp point, embroidery floss work\n\nFor all numbered needle types, higher numbers mean smaller needles (the opposite of US knitting needle sizing). A tapestry size 18 is much larger than a tapestry size 26."
      },
      {
        heading: "Needles for Fiber Arts: Tapestry vs Chenille",
        content: "If you knit or crochet, the two needles you will use most often are tapestry needles and chenille needles. Understanding when to reach for each saves time and produces cleaner finishes.\n\nTapestry needles are blunt-tipped, which means they slide between stitches without splitting the yarn. Use them for seaming knitted or crocheted pieces together (mattress stitch, whip stitch), weaving in ends, and working duplicate stitch embellishment. Sizes 16-18 work for bulky and worsted yarn, sizes 18-20 for DK and sport, and sizes 22-26 for fingering and lace weight.\n\nChenille needles have sharp tips and large eyes. Use them when you need to pierce through fabric, attaching a knitted patch to a woven garment, sewing a crocheted appliqué onto a tote bag, or working surface embroidery on knitted fabric. The sharp point goes through the fabric cleanly where a blunt tapestry needle would snag and distort the weave.\n\nFor cross stitch on Aida cloth or evenweave linen, use a tapestry needle, the blunt tip passes through the fabric holes without splitting the ground threads. For embroidery on plain-weave fabric, switch to an embroidery or chenille needle with a sharp point."
      },
      {
        heading: "Needle Eye Size and Threading Tips",
        content: "The needle eye must be large enough for your thread or yarn to pass through without shredding. Tapestry and chenille needles have elongated eyes specifically designed for yarn, even bulky weight yarn threads through a size 13 tapestry needle easily. Sharps and betweens have small round eyes sized for sewing thread only.\n\nThreading thick yarn through a needle can be frustrating. The easiest method is the fold-and-push technique: fold a short loop of yarn tightly, pinch it flat between your fingers, and push the folded end through the eye. The compressed fold slides through more easily than a frayed cut end. Wire needle threaders designed for yarn (wider than standard sewing threaders) are also very effective.\n\nFor embroidery floss, separate the strands before threading. Standard embroidery floss is 6 strands twisted together. Most embroidery uses 2-3 strands. Cut the length you need, then pull the individual strands apart one at a time, recombine the desired number, and thread them through together. This prevents knotting and tangling that happens when you try to thread unseparated floss."
      },
      {
        heading: "Frequently Asked Questions",
        content: "What is the difference between tapestry and chenille needles?\nBoth have large eyes for yarn, but tapestry needles have blunt tips (safe for seaming knit fabric without splitting yarn) while chenille needles have sharp tips for piercing woven fabric. Choose based on whether you need to go between stitches or through fabric.\n\nWhat needle do I use to sew in yarn ends?\nA tapestry needle (also called a yarn needle) with a blunt tip is best for weaving in ends on knitting and crochet. Size 16-18 works for worsted and bulky yarn, size 20-22 for DK and sport, and size 24-26 for fingering weight.\n\nHow do I thread a needle with thick yarn?\nFold a small loop of yarn and push the fold through the eye rather than the cut end. The compressed fold is thinner and smoother than a frayed yarn tip. A yarn needle threader (wider than standard sewing threaders) also works well.\n\nDo needle sizes matter for hand sewing?\nYes. Too small a needle damages fabric by forcing threads apart under pressure; too large leaves visible holes. Match needle size to fabric weight, fine fabrics like silk need smaller needles (sharps size 10-12), heavy fabrics like denim need larger ones (sharps size 1-4)."
      }
    ]
  },
  {
    slug: "knit-crochet-hat-sizing-guide",
    title: "Knit Hat Sizing Guide: Gauge, Ease & Crown Shaping",
    description: "Measure head circumference, review ease and crown choices, and use the eight-section hat calculator alongside a tested pattern.",
    toolSlug: "hat-calculator",
    date: "2026-03-11",
    keywords: ["hat size chart", "knit hat sizing", "crochet hat sizing", "head circumference chart", "crown shaping", "hat negative ease", "beanie size guide"],
    sections: [
      {
        heading: "Head Circumference by Age Group",
        content: "Accurate head measurement is the foundation of a well-fitting hat. Wrap a flexible tape measure around the widest part of the head, just above the ears and eyebrows. This circumference is your base measurement before applying ease.\n\nHere are standard head circumference ranges by age group:\n\nPreemie: 9-12 inches\nNewborn (0-3 months): 13-14 inches\nBaby (3-12 months): 15-17 inches\nToddler (1-3 years): 17-19 inches\nChild (3-10 years): 19-20.5 inches\nTween/Teen: 20.5-22 inches\nAdult Small: 21-22 inches\nAdult Medium: 22-23 inches\nAdult Large: 23-24 inches\nAdult XL: 24-25 inches\n\nThese are averages, individual heads vary. When making a hat as a gift, ask for a measurement or use the middle of the range for the recipient's age group. When making a hat for yourself, always measure rather than guessing."
      },
      {
        heading: "Negative Ease: Why Hats Are Smaller Than Your Head",
        content: "Negative ease means the hat's unstretched circumference is intentionally smaller than the head it fits. Knit and crochet fabrics stretch, and a hat that measures the same as your head will slide off. Most hats are worked 1-2 inches (5-10%) smaller than actual head circumference.\n\nThe amount of negative ease depends on the stitch pattern. Ribbed brims stretch significantly, a k2p2 rib can stretch 25-30% beyond its relaxed width, so ribbed hats can use more negative ease (up to 15%). Stockinette and single crochet have moderate stretch (10-15%). Colorwork, cables, and textured patterns have minimal stretch, work these hats with only 5% negative ease or they will feel too tight.\n\nFiber content also matters. Wool and wool blends have natural elasticity and hold their stretched shape well. Cotton has almost no memory, a cotton hat with too much negative ease will feel constrictive and uncomfortable. Acrylic falls in between. When in doubt, swatch your yarn in the hat's stitch pattern, stretch the swatch to simulate wearing, and check that the stretch feels comfortable."
      },
      {
        heading: "Crown Shaping Methods",
        content: "Crown shaping closes the top of a hat by decreasing stitches, and the chosen construction affects appearance and fit. Different patterns use different numbers, positions, and frequencies of decreases.\n\nThe FiberTools Hat Calculator models one bounded bottom-up knitted reference: eight equal sections, one K2tog in each section on each modeled decrease round, and a plain round between decrease rounds. It reports the remaining stitch count after every decrease. It does not calculate when to begin the crown, crown depth, crochet shaping, or another decrease method; use the construction and length measurements from a tested pattern."
      },
      {
        heading: "Brim Options and Their Effect on Fit",
        content: "The brim is the bottom edge of the hat and dramatically affects both the look and the fit. A ribbed brim (k1p1 or k2p2 ribbing) is the most popular choice because it is extremely stretchy, grips the head without pins or elastic, and transitions cleanly into the hat body. Work the brim on needles one or two sizes smaller than the body for a snug fit.\n\nA rolled brim happens naturally when stockinette is left without a border, the fabric curls toward the knit side. This is a deliberate design choice for some beanies, adding a thick rolled edge. The roll adds about an inch to the visual brim depth, so account for that in your length calculations.\n\nA folded brim is worked double-length and folded up, creating a warm double-thick band around the ears. This adds warmth but uses more yarn, typically 15-20% more than a single-layer brim. Measure the folded height carefully so the fold sits where you want it.\n\nNo-brim beanies start directly in the main stitch pattern with no special edging. These work best with stitches that don't curl (garter stitch, seed stitch, single crochet) since stockinette will roll without a border."
      },
      {
        heading: "Frequently Asked Questions",
        content: "How much negative ease should a hat have?\nThere is no universal percentage. Measure a representative finished swatch and follow the pattern's construction guidance because fiber, stitch pattern, recovery, and wearer preference change the usable stretch. The calculator's presets are explicit starting assumptions, not measured fit.\n\nHow do I measure head circumference for a hat?\nWrap a flexible tape measure around the widest part of the head, just above the ears and eyebrows. Keep the tape level, not tilted. This is the base measurement before applying a chosen ease assumption.\n\nHow many stitches do I cast on?\nEnter a measured gauge and circumference to get a rounded arithmetic checkpoint. Compare the modeled circumference after rounding with a tested pattern and the finished swatch; the calculator does not guarantee fit."
      }
    ]
  },
  {
    slug: "knitting-socks-sizing-guide",
    title: "Knitting Socks: Sizing, Fit & Construction",
    description: "Review sock anatomy, measurements, heel and construction options, and use the circumference checkpoint with a tested pattern.",
    toolSlug: "sock-calculator",
    date: "2026-03-11",
    keywords: ["sock knitting guide", "sock sizing chart", "heel flap knitting", "toe-up socks", "top-down socks", "sock yarn weight", "sock knitting for beginners"],
    sections: [
      {
        heading: "Sock Anatomy: Cuff to Toe",
        content: "A knitted sock has six distinct sections, each serving a structural purpose. The cuff is the top edge, usually worked in ribbing for stretch so the sock stays up. The leg extends from the cuff down to the ankle, it can be short (ankle sock), medium (crew), or tall (knee-high). The heel is the most complex section, shaped to wrap around the back and bottom of the heel bone.\n\nThe gusset is a triangular panel on each side of the foot that provides extra width at the instep where the foot is tallest. Not all heel constructions include a gusset, short row heels skip it entirely. The foot runs from the heel to the toe, worked as a plain tube in most patterns. The toe closes the end of the sock, shaped with symmetrical decreases on both sides.\n\nUnderstanding this anatomy helps you read sock patterns confidently. When a pattern says \"work the foot until 2 inches shorter than desired length,\" it means work the foot tube until you need to start toe decreases. When it says \"pick up gusset stitches,\" it means picking up stitches along the heel flap edge to create those triangular side panels."
      },
      {
        heading: "How to Measure for Socks",
        content: "Foot length and one or more circumference landmarks are common starting measurements, but fit can also depend on instep depth, ankle and leg circumference, heel shape, fabric elasticity, construction, and the ability to pull the sock over the heel. Use the measurement locations named by the selected pattern and measure the intended wearer when possible.\n\nNegative ease is a pattern- and fabric-specific assumption, not a universal 10 percent rule or a fit guarantee. Compare the pattern's guidance with a representative finished swatch, and review the modeled circumference after whole-stitch rounding. Shoe size alone is not enough to establish a custom stitch count."
      },
      {
        heading: "Heel Construction Options",
        content: "The heel flap and gusset is the most traditional and durable construction. A rectangular flap is worked back and forth over half the stitches, then the heel turn shapes the bottom cup with short rows and decreases. Stitches are picked up along the flap edges to form the gusset, which is decreased back to the original stitch count over several rounds. Heel flaps are often worked in slipped-stitch patterns (slip 1, knit 1 across) for extra thickness and durability.\n\nThe short row heel (also called a boomerang, German, or wrap-and-turn heel) creates a smooth cup without a flap or gusset. It uses short rows to shape the heel in a single section, then continues directly into the foot. Short row heels have a cleaner look and fit well in shoes, but they lack the reinforced fabric of a slipped-stitch heel flap.\n\nThe afterthought heel is worked after the sock is complete, you work a waste yarn placeholder where the heel should go, finish the sock, then return to remove the waste yarn and knit the heel downward. This construction makes it easy to replace worn-out heels without reknitting the entire sock."
      },
      {
        heading: "Top-Down vs Toe-Up Construction",
        content: "Top-down construction begins at the cuff; toe-up construction begins at the toe. Both families contain many heel, toe, cuff, and fitting variations, so follow a tested pattern rather than assuming one universal sequence.\n\nThe FiberTools Sock Circumference Stitch Calculator does not select either construction or provide section counts. It calculates one circular stitch-count checkpoint from the circumference, ease assumption, measured gauge, and multiple you enter. Take that checkpoint back to the selected pattern for every construction, shaping, length, and fit decision."
      },
      {
        heading: "Frequently Asked Questions",
        content: "How do I choose the circumference and ease?\nUse the measurement landmark and ease assumption specified by the selected pattern. The calculator's 10 percent default is editable and is not a fit guarantee. Compare the modeled circumference with a representative finished swatch.\n\nDoes the calculator plan heels or toes?\nNo. It does not calculate a cuff, heel, gusset, toe, foot length, yarn quantity, or pull-on fit. Use a tested pattern for those decisions.\n\nHow does rounding work?\nThe calculator rounds the raw count to the nearest whole multiple you enter and shows the resulting modeled circumference and effective ease so you can review the consequence."
      }
    ]
  },
  {
    slug: "knitting-sleeve-shaping-guide",
    title: "Knitting Sleeve Shaping: Tapers & Decreases",
    description: "Calculate one supported sleeve taper, review decrease spacing and understand why sleeve caps and fit still need a tested pattern.",
    toolSlug: "sleeve-calculator",
    date: "2026-03-11",
    modifiedDate: "2026-09-05",
    keywords: ["sleeve shaping knitting", "sleeve taper calculator", "knitting sleeve decreases", "sleeve cap shaping", "set-in sleeve knitting", "sleeve length chart"],
    sections: [
      {
        heading: "Sleeve Anatomy: Cast-On to Cap",
        content: "A standard tapered sleeve has three distinct sections. The cast-on edge is the widest point at the upper arm (for top-down sleeves) or the cuff (for bottom-up sleeves). The taper section gradually narrows through evenly spaced decreases. The sleeve cap, used only in set-in sleeve construction, is shaped with bind-offs and decreases to fit into a curved armhole.\n\nFor a bottom-up sleeve, you cast on at the cuff width, increase gradually through the taper section to the upper arm width, and then shape the sleeve cap. For a top-down sleeve worked in the round (common in raglan and yoke sweaters), you pick up stitches at the underarm and decrease down to the cuff, no cap shaping needed.\n\nThe relationship between upper arm width, cuff width, and sleeve length determines how many decreases you need and how frequently they occur. A longer sleeve with a small difference between upper arm and cuff needs fewer decreases spaced farther apart. A short sleeve with a dramatic taper needs more frequent decreases."
      },
      {
        heading: "How to Calculate a Sleeve Taper",
        content: "The Sleeve Calculator models paired decreases from rounded upper-arm and cuff stitch counts. A difference of 60 minus 40 stitches requires 10 events removing two stitches each. Odd differences and schedules requiring more than one event per shaping row are declined.\n\nIts shaping span subtracts the entered cuff length and two fixed one-inch exclusions from the entered sleeve length, then multiplies by row gauge and rounds to whole rows. For an 18-inch sleeve, 2-inch cuff, and 6 rows per inch, the modeled span is 84 rows. Ten events can occupy six 8-row intervals and four 9-row intervals: 6 × 8 + 4 × 9 = 84.\n\nThe calculator reports how many intervals have each length; it does not prescribe their order. Use the selected pattern to determine placement, first event, row counting, construction, and whether the fixed exclusions are appropriate. The result is not a sleeve-cap or fit plan."
      },
      {
        heading: "Standard Sleeve Lengths by Size",
        content: "Standard sleeve lengths are measured from the underarm to the cuff (or wrist). These measurements give you a starting point, always adjust for the wearer's actual arm length when possible.\n\nAdult sleeve length chart (underarm to cuff):\n\nSize XS: Short 6\", Three-quarter 12\", Full length 16.5\"\nSize S: Short 6.5\", Three-quarter 12.5\", Full length 17\"\nSize M: Short 7\", Three-quarter 13\", Full length 17.5\"\nSize L: Short 7.5\", Three-quarter 13.5\", Full length 18\"\nSize XL: Short 8\", Three-quarter 14\", Full length 18.5\"\n\nShort sleeves typically end above the elbow and use minimal or no tapering, the sleeve is nearly the same width throughout. Three-quarter sleeves end between the elbow and wrist and have a moderate taper. Full-length sleeves run to the wrist bone and have the most pronounced taper from upper arm to cuff.\n\nChildren's sleeve lengths are proportionally shorter. The best approach for children is to measure the actual arm rather than relying on size charts, since children of the same age vary dramatically in arm length."
      },
      {
        heading: "Sleeve Cap Shaping for Set-In Sleeves",
        content: "Sleeve cap shaping is required only for set-in sleeves, where the sleeve fits into a curved armhole cut into the body of the garment. Raglan, yoke, and drop-shoulder constructions skip cap shaping entirely.\n\nA basic sleeve cap starts by binding off the same number of stitches as the body's underarm bind-off (usually 3-5 stitches on each side). Then you decrease on both sides every other row, starting with larger decreases (2 stitches at a time) and tapering to single decreases. The cap height should equal the armhole depth minus about 1 inch. The remaining stitches at the top of the cap are bound off flat.\n\nThe cap must match the armhole curve exactly in circumference. If the cap is too small, the seam pulls and restricts movement. If it is too large, the fabric bunches at the shoulder. This matching is why sleeve caps are considered advanced, getting the curve right requires either following a well-graded pattern exactly or doing careful measurements.\n\nFor beginners, raglan or top-down set-in constructions avoid cap-shaping math entirely. The Sleeve Calculator provides only a paired-decrease interval model; it does not provide sleeve-cap shaping instructions. Follow a tested pattern for the cap and armhole."
      },
      {
        heading: "Frequently Asked Questions",
        content: "How do I calculate even decreases for a sleeve?\nFor the supported paired-decrease model, divide the even rounded stitch difference by two to obtain the event count. Use the modeled shaping rows after the cuff and fixed exclusions, not total sleeve rows. The calculator reports interval counts for uneven remainders without prescribing their order.\n\nHow long should a full-length sleeve be?\nA full-length adult sleeve is typically 16.5-18.5 inches from underarm to cuff, depending on the size. Measure your own arm from underarm to wrist bone for a custom fit, arm lengths vary more than most people expect.\n\nWhat is the difference between a set-in sleeve and a drop shoulder?\nA set-in sleeve has a shaped cap that fits into a curved armhole for a tailored look. A drop shoulder has no cap shaping, the sleeve attaches straight across the body at a point below the natural shoulder, creating a relaxed, boxy silhouette.\n\nShould I work sleeves flat or in the round?\nIn the round is more common for modern patterns and avoids seaming. Flat sleeves are seamed and produce a slightly more structured sleeve. Either method works, the stitch counts and decreases are the same regardless."
      }
    ]
  },
  {
    slug: "raglan-sweater-guide",
    title: "Top-Down Raglan Sweater Construction Guide",
    description: "Review neckline, yoke, increase and fit decisions, then use the calculator as one finished-body stitch-count checkpoint.",
    toolSlug: "raglan-calculator",
    date: "2026-03-11",
    keywords: ["raglan sweater construction", "top-down raglan", "raglan increase math", "raglan calculator", "knit raglan sweater", "crochet raglan", "raglan stitch distribution"],
    sections: [
      {
        heading: "What Is a Raglan Sweater",
        content: "Raglan garments use diagonal lines between neckline and underarm, but their construction can be top-down, bottom-up, flat, in the round, knit, crochet, seamed, or seamless. Neckline shaping, short rows, section allocations, increase or decrease placement, underarm additions, and sleeve/body ease vary among designs.\n\nA top-down pattern may allow intermediate try-ons, but that does not make fit automatic. Follow a tested pattern or validated design method and compare its checkpoints with body measurements and representative finished fabric."
      },
      {
        heading: "Raglan Increase Math",
        content: "One common top-down construction adds one stitch on each side of four raglan lines, for eight added stitches on an increase round. That is an example, not a universal schedule: patterns vary the number of lines, line width, front-neck shaping, increase rate, section allocation, and timing.\n\nA body-size label or generic percentage cannot establish a neckline cast-on or sleeve allocation. Use the counts and checkpoints from a tested pattern or a validated grading method, then verify the fabric and fit as directed."
      },
      {
        heading: "Neckline Options",
        content: "Neckline style changes the cast-on, front/back balance, shaping sequence, and relationship between neckline and yoke. Those construction decisions cannot be inferred from finished-body circumference and stitch gauge alone.\n\nThe FiberTools Raglan Body Stitch Checkpoint does not offer neckline choices or calculate a starting distribution, increase frequency, yoke depth, or separation point. Use a tested raglan pattern or a validated garment-design method for those decisions; use the calculator only to compare one rounded finished-body count with your entered circumference and measured gauge."
      },
      {
        heading: "Sizing a Raglan from Body Measurements",
        content: "Designing a raglan from scratch requires more than four values. Neckline shape and opening, shoulder and upper-body geometry, front/back balance, sleeve circumference, underarm depth and additions, body and sleeve ease, row and stitch gauge, stitch-pattern constraints, construction direction, and finishing can all affect the plan.\n\nThe FiberTools checkpoint handles only the bounded body arithmetic: finished-body circumference multiplied by measured stitches per inch, rounded to the entered multiple. It does not turn that body total into a neckline, yoke, sleeve, or increase schedule. Use a tested pattern or validated garment-design method for the rest."
      },
      {
        heading: "Frequently Asked Questions",
        content: "What does the Raglan Body Stitch Checkpoint calculate?\nIt multiplies an entered finished-body circumference by measured stitches per inch and rounds to the whole stitch multiple you enter. It also shows the modeled circumference after rounding.\n\nDoes it calculate a neck cast-on, increases, yoke, or split?\nNo. Those require construction, neckline, section, row-gauge, depth, sleeve, underarm, and fit decisions that are not among the inputs.\n\nCan it guarantee sweater fit?\nNo. Use a tested pattern, intended ease, body measurements, and a representative blocked swatch. The checkpoint is one arithmetic comparison, not a complete raglan design."
      }
    ]
  },
  {
    slug: "blocking-fiber-guide",
    title: "Blocking Knitting & Crochet: Swatch Test Guide",
    description: "Use care instructions, a representative swatch and measured dimension changes to plan finishing without guessing from fiber name alone.",
    toolSlug: "blocking-calculator",
    date: "2026-03-11",
    keywords: ["blocking knitting", "blocking crochet", "blocking swatch", "fiber care instructions", "blocking dimensions"],
    sections: [
      {
        heading: "Start with Item-Specific Instructions",
        content: "Finishing can change dimensions, texture, color, and drape, but the safe process depends on the actual item. Begin with the project pattern and the yarn, fabric, or garment care instructions. A broad fiber label does not capture blends, dyes, finishes, stitch construction, prior treatment, or manufacturer-specific limits.\n\nIf instructions conflict, are missing, or apply to a valuable item, stop and ask the maker or a qualified textile-care professional. Do not treat a generic online method as a substitute for product-specific guidance.\n\nThe Blocking Dimension Change Calculator only compares measurements. It does not choose wet, spray, steam, pinning, or any other treatment."
      },
      {
        heading: "Run a Representative Swatch Test",
        content: "Make a swatch that represents the project yarn, stitch pattern, gauge, color treatment, and construction as closely as practical. Measure it before treatment without stretching it.\n\nTreat the swatch exactly as the pattern and care instructions specify, including water temperature, handling, products, equipment, drying position, and the complete drying or cooling cycle. Then measure the same landmarks again.\n\nCalculate each observed percentage change as (after minus before) divided by before, times 100. That result is evidence for this swatch under this treatment; it is still not a guarantee for a much larger, heavier, seamed, or differently constructed item."
      },
      {
        heading: "Treat Heat as a Separate Safety Decision",
        content: "Steam, irons, dryers, and other heat sources can irreversibly alter some fibers, blends, dyes, finishes, adhesives, embellishments, and textured constructions. Use heat only when both the item instructions and the appliance instructions permit it.\n\nDo not infer a safe temperature, distance, duration, or result from the calculator or from a generic fiber name. Test the approved process on the representative swatch first and stop if the swatch changes in an unwanted way.\n\nKeep the measured size decision separate from the treatment decision: knowing that a project requests a 4 percent change does not establish that any particular method can produce it safely."
      },
      {
        heading: "Compare the Requested and Observed Changes",
        content: "Enter the project's current and requested width or length in the calculator. Positive output means a requested increase; negative output means a requested decrease. Width and length are independent.\n\nCompare that request with the swatch's observed change in the same direction. A mismatch is a reason to revisit gauge, construction, target dimensions, or qualified guidance, not a reason to force the finished piece.\n\nScale matters. A full item can respond differently because of its weight, seams, edging, colorwork, cables, openwork, or mixed materials. Recheck measurements during the pattern's approved process when the instructions allow it."
      },
      {
        heading: "Frequently Asked Questions",
        content: "Does the calculator recommend a blocking method?\nNo. It calculates requested dimension changes only. Use the pattern and product care instructions to choose a treatment.\n\nDoes a small percentage mean the change is safe?\nNo. Percentage magnitude is not a safety or feasibility rating. Even a small change may be unsuitable for a particular item or treatment.\n\nCan a swatch guarantee the full project's result?\nNo. A representative swatch is better evidence than a generic fiber rule, but scale, seams, weight, and construction can still change the response.\n\nWhat if the care instructions are unclear?\nDo not improvise on a valuable item. Ask the yarn or garment maker, or a qualified textile-care professional, before treatment."
      }
    ]
  },
  {
  slug: "yarn-stash-management-guide",
  title: "Yarn Stash Guide: Estimate Partial-Skein Yardage",
  description: "Estimate leftover yarn from measured weight and the original label, with a checked 42-gram example and clear limits.",
  toolSlug: "stash-estimator",
  date: "2026-03-11",
  keywords: [
    "yarn stash organization",
    "estimate yarn yardage",
    "partial skein yardage",
    "yarn storage tips",
    "leftover yarn projects",
    "dye lot yarn",
    "stash busting"
  ],
  sections: [
    {
      heading: "How Much Yarn Is Left? Estimate Partial-Skein Yardage by Weight",
      content: "Divide the weight of your remaining yarn by the full-skein weight on its original label, then multiply by that label's yardage. For example, **42 grams ÷ 100 grams × 220 yards = 92.4 yards**. This estimates length from a weight ratio; it does not directly measure how many yards are on the ball.\n\nUse information for the **same yarn**. A different yarn's label or a yarn-weight category is not a substitute for its actual length-to-weight ratio.",
      markdown: true
    },
    {
      heading: "Gather three numbers that belong together",
      content: "You need the remaining yarn weight, the original full-skein label weight, and the original full-skein label length. In the [FiberTools stash estimator](https://fibertools.app/stash-estimator), both weight fields are grams and the label-length field is yards.\n\nWeigh the yarn alone. Exclude its paper band, storage bag, cone, needles and other objects. If you need a container, zero the scale with the empty container in place before adding the yarn, following the scale's instructions. Otherwise its weight would be treated as yarn in the calculation.\n\nRead the labels on the scale and the yarn band rather than assuming their units. The two weights must use the same unit for their ratio to make sense; the current estimator expects grams. Do not put a meter value into a field labeled yards.",
      markdown: true
    },
    {
      heading: "A worked example: 42 grams from a 100-gram skein",
      content: "Suppose the original label says 100 grams and 220 yards, and the yarn you have left weighs 42 grams. These are hypothetical values, not a tested product or an actual scale reading from our work.\n\n| Step | Calculation | Meaning |\n| --- | --- | --- |\n| Find the remaining fraction | 42 ÷ 100 = 0.42 | 42 percent of the labeled mass |\n| Apply that fraction to length | 0.42 × 220 = 92.4 | Estimated yards remaining |\n| Check by a second route | 220 ÷ 100 = 2.2; 42 × 2.2 = 92.4 | Same result using yards per gram |\n\nThe calculator displays **92.4 yards / 84.5 meters** for these inputs. The meter value is rounded for display. Save the original measurements with the result so you can tell later which yarn and label produced it.",
      markdown: true,
      image: {
        src: "/images/guides/remaining-yarn-ratio.svg",
        preview: "/images/guides/remaining-yarn-ratio.png",
        alt: "Hypothetical same-yarn ratio: 42 grams remaining from a 100-gram, 220-yard skein gives an estimated 92.4 yards, or 42 percent of the labeled length.",
        caption: "Original arithmetic diagram. The filled bar shows a 42 percent proportion, not yarn thickness, a photographed skein or a measured length of real yarn.",
        width: 1200,
        height: 760
      }
    },
    {
      heading: "Why a small weight difference can matter",
      content: "At this hypothetical label ratio, each gram corresponds to 2.2 yards. A reading of 41 grams gives 90.2 yards; 43 grams gives 94.6 yards. Those are arithmetic comparisons, not a tested accuracy range for a scale.\n\nSimilarly, if a non-yarn object added a hypothetical 3 grams to the measurement, it would add 6.6 estimated yards. That does not mean a paper band weighs 3 grams. It shows why you should remove unrelated objects rather than assume their weight is negligible.\n\nThe method assumes that the remaining yarn has the same length per gram as the reference on the label. Measurement precision, label tolerances, moisture and uneven construction can affect that assumption or the inputs. The [estimator's model and limitations](https://fibertools.app/stash-estimator) describe the result as an estimate. More decimal places in the arithmetic do not make the original measurements more certain.",
      markdown: true
    },
    {
      heading: "What if the original label is missing?",
      content: "First try to identify the exact yarn and obtain its weight and length specifications from the manufacturer. Do not choose another yarn merely because it looks similar or has the same category name.\n\nThe [Craft Yarn Council's yarn-weight system](https://www.craftyarncouncil.com/standards/yarn-weight-system) gives categories and guideline gauge ranges. It does not supply the specific length per gram of your leftover yarn. A label such as Medium (4), by itself, is not enough to calculate its remaining yardage.\n\nIf you establish a ratio by measuring a known length and weighing that same sample, record it as your own sample measurement rather than a manufacturer's label specification. Its usefulness depends on whether the sample represents the rest of the yarn and whether its weight is measurable reliably. Do not enter sample values as full-skein label values in this estimator: the tool checks that the remaining weight does not exceed the full labeled skein weight.\n\nIf you cannot establish a trustworthy ratio, record the measured grams and leave yardage unknown. An honest unknown is more useful than a confident number borrowed from an unrelated yarn.",
      markdown: true
    },
    {
      heading: "Does that mean I have enough for a project?",
      content: "Compare the estimate with a requirement established for your actual pattern, size, yarn and gauge, including the extra you plan to allow. A remaining length cannot establish a project's requirements on its own.\n\nFor a hypothetical requirement of 80 yards with a separately chosen 10 percent allowance, the planning total is 88 yards. The example's 92.4-yard estimate is 4.4 yards above that plan. This comparison does not prove the project will finish successfully: both the requirement and the remaining-length estimate have assumptions.\n\nFor a flat rectangular project, the [measured-swatch yarn calculator](https://fibertools.app/yarn-calculator) can help estimate a requirement from representative consumption. Its area model does not calculate borders, joins, shaping or every kind of project. Keep requirements for different colors separate; a combined total does not show whether each color is sufficient.",
      markdown: true
    },
    {
      heading: "Keep a useful stash record",
      content: "Record the exact yarn identity if known, a label photo or specification source, the original weight and length, the remaining grams, the weighing date, the calculated yardage, and any uncertainty. Update the record after using more yarn. Keep estimates clearly separate from directly measured lengths.\n\n### What if the remaining weight is higher than the label weight?\n\nCheck units, attached objects, and whether you have combined several skeins. The estimator rejects that input for a single partial-skein calculation. Do not change the label value merely to force a result; investigate the mismatch or calculate separate partial skeins using their own references.\n\n### Can I claim 92.4 yards is enough for a hat or socks?\n\nNot from that number alone. You still need the specific project's yarn requirement and assumptions. This example deliberately makes no claim about which finished object 92.4 yards will produce.",
      markdown: true
    },
    {
      heading: "Keep an identifiable stash record",
      content: "Keep the exact yarn name, product line, color, dye lot when supplied, fiber content, care instructions, and original label weight and length with each remaining ball. A label photograph can preserve those details. Record the date and mass of each new measurement, and mark the calculated length as estimated.\n\nKeep balls with different product identities separate in the record even when their colors or categories look similar. Compare the available estimate with the actual pattern or representative sample requirement before reserving the yarn for another project."
    }
  ],
  modifiedDate: "2026-09-16",
  sources: [
    {
      title: "FiberTools: Calculator inputs and model",
      url: "https://fibertools.app/stash-estimator"
    },
    {
      title: "Craft Yarn Council: Standard Yarn Weight System",
      url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
    }
  ],
  editorialNote: "AI-assisted explanation prepared with Codex. Numerical examples are hypothetical and checked mathematically; no physical project or yarn product was tested. Published by FiberTools."
},
  {
    slug: "c2c-crochet-guide",
    title: "Corner-to-Corner Crochet Guide: C2C Blocks & Gauge",
    description: "Learn C2C block construction and turn a measured two-axis swatch into a nominal grid. The calculator does not create graph art or row instructions.",
    toolSlug: "c2c-calculator",
    date: "2026-03-11",
    keywords: ["C2C crochet", "corner to corner crochet", "C2C blanket", "C2C graphghan", "C2C increase rows", "C2C decrease rows", "C2C crochet tutorial"],
    sections: [
      {
        heading: "What Is C2C Crochet",
        content: "Corner-to-corner (C2C) crochet builds a fabric diagonally, you start at one corner, increase one tile per row until the piece reaches its widest point, then decrease one tile per row back down to the opposite corner. The result is a rectangular (or square) fabric made entirely of small square tiles.\n\nEach tile is a cluster of 3 double crochet stitches worked into a chain-3 space. Tiles stack next to each other in rows that run diagonally across the piece. This creates a grid-like fabric with a distinctive texture that is different from traditional row-by-row crochet.\n\nC2C is enormously popular for graphghans, blankets with pixel-art designs worked in multiple colors. Each tile acts as one pixel, making it straightforward to translate any grid-based image into a crochet pattern. The technique is also used for solid-color blankets, baby blankets, scarves, and cushion covers. It works up relatively quickly because double crochet stitches are tall, and the tile structure means you are always working in chain spaces rather than individual stitches."
      },
      {
        heading: "How C2C Increases Work",
        content: "Many C2C constructions build a diagonal grid by changing the tile count across successive rows, but the exact increase, turn, even-row, and decrease instructions belong to the selected pattern.\n\nThe FiberTools C2C Calculator does not generate row-by-row construction instructions or tell you when to change phases. It rounds entered target dimensions to a nominal two-axis block grid using the measured block width and height you enter. Use that grid with a tested pattern and verify the real fabric as it grows."
      },
      {
        heading: "How C2C Decreases Work",
        content: "The decrease phase tapers the fabric back to a single corner tile. Each row starts one tile in from the previous row's edge, effectively removing one tile at the beginning of every row.\n\nTo decrease, do not chain 6 at the start of the row. Instead, slip stitch across the top of the first tile (across the 3 double crochets and into the chain-3 space), then chain 3 and work 3 double crochet into that space. This positions you one tile in from the edge. Continue across the row normally. The result is a row with one fewer tile than the previous row.\n\nThe last row of the decrease phase is a single tile, the opposite corner from where you started. Fasten off and weave in the end. The finished piece should be a clean rectangle (or square) with pointed corners formed by the diagonal construction.\n\nCommon mistakes during decreases include accidentally slip-stitching into the wrong space (skipping the chain-3 space and going into the double crochets) or forgetting to slip stitch far enough across. Count your tiles at the end of each decrease row to catch errors early."
      },
      {
        heading: "Calculating Size and Gauge",
        content: "Measure a representative C2C swatch along both project axes because a block's horizontal and vertical spans can differ. Enter those two measured block dimensions with the target width and height. The calculator rounds each axis to the nearest bounded whole-block count and reports the nominal grid span, total blocks, and total diagonal-row count.\n\nThose outputs are not an increase/even/decrease schedule or a finished-size guarantee. Borders, handling, joining, stitch choice, and later treatment can change the result. Optional yarn arithmetic is shown only when you enter yarn measured per representative block and an explicit allowance; it is not an automatic total-yarn estimate."
      },
      {
        heading: "Frequently Asked Questions",
        content: "Does every C2C pattern use the same tile?\nNo. Tile stitch, chain, joining, turning, and phase instructions belong to the selected pattern. Measure the actual block construction you intend to use.\n\nDoes the calculator create graphghan art or row instructions?\nNo. It returns a bounded nominal two-axis block grid from measured block spans and target dimensions. Use separate graph design and a tested construction pattern.\n\nHow do I estimate project time?\nTime your own representative blocks, color changes, and finishing work, then multiply from the planned grid and add only the contingency you intend. The calculator does not predict working speed or hours.\n\nDoes the yarn result apply automatically?\nNo. Yarn arithmetic appears only when you enter measured yarn per representative block and an explicit allowance."
      }
    ]
  },
  {
    slug: "granny-square-blanket-guide",
    title: "Granny Square Blanket Guide: Squares, Yarn & Joining",
    description: "How many squares and how much yarn for a granny square blanket? Sizes, joining methods and yardage math — with a free planner.",
    toolSlug: "granny-square-planner",
    date: "2026-08-29",
    modifiedDate: "2026-09-25",
    keywords: ["granny square blanket", "joining granny squares", "granny square layout", "how many granny squares", "granny square seam length", "crochet blanket planning"],
    sections: [
      {
        heading: "Start With One Square You Can Trust",
        content: "A blanket plan is only as good as the square you measure. Make one square with the yarn, hook, pattern, tension, and color changes you actually intend to use. Finish the ends the same way you plan to finish the project, follow the yarn and pattern care instructions, block the sample, let it dry completely, and then measure one edge without stretching it.\n\nDo not assume that every five-round granny square is six inches. Round count alone does not set size. Stitch height, center construction, chain spaces, border rounds, yarn, hook, tension, and finishing all change the measurement. If the project uses more than one motif, make and measure each motif. They need compatible finished edge counts and dimensions before you commit to a layout.\n\nMy rule for this planner is simple: measure first, then let the math be boring. Boring math is useful math. Enter that blocked edge measurement in the [free granny square planner](https://fibertools.app/granny-square-planner), along with your target width and length. The planner rounds each axis up to a whole square so the nominal grid meets or exceeds the target. It does not predict what seams, borders, or another wash will do to the finished blanket.",
        markdown: true
      },
      {
        heading: "How Many Granny Squares Make a Blanket?",
        content: "For each direction, divide the target blanket dimension by the blocked square size and round up. Multiply squares across by squares down to get the total. For example, a 50 by 60 inch throw made from blocked 6-inch squares needs 9 across and 10 down: **90 squares**. The nominal motif span is 54 by 60 inches before joining or a border.\n\nThe table below uses common planning dimensions, not universal blanket standards. Baby is modeled at 30 by 36 inches, throw at 50 by 60, twin at 66 by 90, queen at 90 by 100, and king at 108 by 100. Each cell shows **across × down = total squares** after rounding up.\n\n| Planning size | 4-inch squares | 6-inch squares | 8-inch squares |\n| --- | ---: | ---: | ---: |\n| Baby, 30 × 36 in | 8 × 9 = 72 | 5 × 6 = 30 | 4 × 5 = 20 |\n| Throw, 50 × 60 in | 13 × 15 = 195 | 9 × 10 = 90 | 7 × 8 = 56 |\n| Twin, 66 × 90 in | 17 × 23 = 391 | 11 × 15 = 165 | 9 × 12 = 108 |\n| Queen, 90 × 100 in | 23 × 25 = 575 | 15 × 17 = 255 | 12 × 13 = 156 |\n| King, 108 × 100 in | 27 × 25 = 675 | 18 × 17 = 306 | 14 × 13 = 182 |\n\nThese are grid counts, not promises of finished dimensions. An 8-inch-square throw in this table has a nominal motif span of 56 by 64 inches because seven and eight whole squares are needed. If that is too large, do not quietly round down. Decide whether to change the target, change the square, add a planned border to a smaller grid, or accept the larger blanket. Lay the squares out before joining so you can catch color-placement and orientation mistakes while they are still easy to fix.",
        markdown: true
      },
      {
        heading: "Compare Three Joining Methods Honestly",
        content: "The best join is the one that gives the look, flexibility, strength, and workload your blanket needs. The planner can calculate shared-edge distance, but it cannot pick a join for you. Test two or four sample squares before making a decision. That tiny test is much cheaper than discovering 150 squares later that the seam is stiff, bulky, or facing the wrong way.\n\n**Whipstitch** is sewn with a yarn needle. It can be discreet when worked in a matching color and through consistent loops. It is useful when you want to arrange every square before assembly or when you prefer sewing to crocheting seams. Its appearance changes with loop choice, stitch spacing, and tension. Pulling too tightly can shorten the seam and make the blanket pucker; working too loosely can leave gaps.\n\n**Slip-stitch join** is crocheted. It makes a visible ridge when worked on the right side and a less prominent line when worked from the back, depending on the loops used. It is quick, sturdy, and easy to undo, but it can be less flexible than the squares if the hook is too small or the tension is tight. Use the tested hook and loop placement consistently.\n\n**Join-as-you-go** connects a new square during its final round. It reduces the separate assembly stage and can create an open, integrated look. The tradeoff is sequencing: color layout and orientation must be decided before the final round, and correcting a misplaced square can mean undoing neighboring joins. It also depends on a motif pattern designed or adapted for that join.\n\nNo method is automatically invisible, flat, fastest, or lowest in yarn use. Make the same length of sample seam with each method you are considering. Compare the front, back, stretch, drape, and washed result, then choose from evidence instead of a cheerful internet promise.",
        markdown: true
      },
      {
        heading: "Estimate Square, Joining, and Border Yarn Separately",
        content: "Start with yarn used by one representative square. You can measure length by carefully unraveling a sample, or weigh the finished sample and use the same yarn's verified label length-to-weight ratio. Multiply that measured amount by the total square count. If one blocked 6-inch square uses a measured 18 yards and the throw plan needs 90 squares, the square total is **1,620 yards before any allowance**. That is example arithmetic, not a universal granny-square yardage rate.\n\nPlan colors separately. If each square has unequal color rounds, do not divide the total evenly by the number of colors. Measure a representative square's use of each color or record the yarn used across a complete motif repeat. Tails, rejected squares, repairs, and measurement variation can justify a separate allowance, but choose and label that allowance instead of hiding it in the base figure.\n\nJoining yarn needs its own sample. For a grid W squares wide by H squares tall, unique internal seam segments are **((W − 1) × H) + ((H − 1) × W)**. Multiply that count by the blocked square edge to get seam distance. The [granny square planner](https://fibertools.app/granny-square-planner) calculates this distance once per shared edge. It does not turn seam inches into yarn yards because whipstitch, slip stitch, single crochet, and join-as-you-go consume yarn differently.\n\nMake a sample seam with the chosen method. Measure a known seam length and the yarn it uses, then scale that rate to the planner's seam distance. If 12 inches of sample seam uses 24 inches of yarn, the measured rate is 2 inches of yarn per inch of seam. Multiply by the project seam distance, convert units, and add only the allowance you intend.\n\nTreat the border separately too. Join a test group, work the planned border along a measured edge, and record that yarn. Scale from the measured border edge to the assembled perimeter. A border with corners, multiple rounds, texture, or changing stitch counts needs a sample that represents those features. For a single-piece blanket rather than motifs, use the [blanket yarn calculator](https://fibertools.app/blanket-calculator) with a representative swatch; do not substitute its flat-area result for granny-square joins and borders.",
        markdown: true
      },
      {
        heading: "Block Squares Before Final Assembly",
        content: "Blocking helps bring squares to consistent dimensions, opens the stitch pattern, and makes layout and joining easier. It does not rescue every gauge mismatch or force different motifs to become identical. Check the yarn label and pattern care instructions before choosing water, steam, heat, pins, mats, or another method. Heat can permanently change some fibers and finishes.\n\nA practical workflow is to test the entire process on the representative square first. Measure before treatment, follow the allowed care process, shape it to the intended dimensions without overstretching, let it dry or cool completely, and measure again. Record that blocked size for the grid calculation. If the sample will not hold the planned size or the fabric changes in an unwanted way, fix the plan before producing a stack of squares.\n\nFor the full batch, use a consistent measuring template or marked mat. Pin or place squares to the same dimensions and keep edge stitch counts aligned. Stack only fully dry squares. If several motifs still differ materially after the approved treatment, sort them and test how the chosen join behaves rather than forcing the seams.\n\nI would rather spend a little time on this checkpoint than argue with a wavy seam later. Yarn has never been impressed by confidence alone.",
        markdown: true
      },
      {
        heading: "Plan the Layout and Assembly Order",
        content: "Before joining, place every square in its intended position or build a labeled layout chart. Check color balance, motif orientation, right and wrong sides, and any intentional repeats. Photograph the layout and number rows or stacks so the plan survives being moved.\n\nFor whipstitch or slip-stitch assembly, many makers join squares into rows and then join the rows. Others make long vertical seams first and cross them with horizontal seams. Either can work if shared edges are counted once and corners align. Keep the same loop choice, yarn, hook or needle, and tension through the project. Stop after the first few joins and compare the assembled measurement with the nominal grid.\n\nWith join-as-you-go, plan the sequence before the final rounds. A diagram matters because each new square may connect to one or more existing sides. Keep the unjoined final-round yarn and square orientation organized. If the layout includes an irregular edge or partial motif, use pattern-specific instructions; the rectangular planner assumes whole equal squares in a complete grid.\n\nMeasure the assembled panel before starting the border. The real perimeter, not the target perimeter from the original idea, controls the next step. A border can add size and structure, but it should not be treated as a mystery correction for a grid that was never checked.",
        markdown: true
      },
      {
        heading: "Granny Square Blanket Questions",
        content: "### How many granny squares do I need for a throw blanket?\n\nFor a 50 by 60 inch planning target, the table above gives 195 four-inch squares, 90 six-inch squares, or 56 eight-inch squares. Those totals round each axis up. Use your own blocked square measurement in the planner because a nominal six-inch square may not actually finish at six inches.\n\n### How much yarn do I need for a granny square blanket?\n\nMeasure the yarn used by one representative square and multiply by the planned square count. Estimate each color separately when color use is uneven. Then measure and add joining yarn and border yarn as separate components. Blanket size or yarn weight alone cannot supply a reliable total.\n\n### What is the best yarn for granny squares?\n\nThere is no single best fiber or weight for every blanket. Follow the motif pattern, compare the exact yarn's label, care instructions, availability, and color needs, and make a sample. The best choice is one that produces the fabric and care routine needed for the intended blanket.\n\n### How do I join granny squares so the seams lie flat?\n\nMatch edge stitch counts, use a consistent loop placement, and keep the joining tension compatible with the squares. Test and wash a small joined group. Slip-stitch seams can become stiff when worked tightly; sewn seams can pucker when pulled too hard. No method stays flat without consistent execution and compatible pieces.\n\n### Should I block granny squares before or after joining?\n\nBlocking the representative square before planning gives a useful measurement, and blocking individual squares can make assembly more consistent. The complete blanket may still need the finishing treatment allowed by its yarn and pattern. Test the process first and follow item-specific care instructions.\n\n### Does the planner include the border?\n\nNo. It reports a whole-square grid, nominal motif span, total squares, and unique internal seam distance. Measure the joined panel and sample the intended border separately before estimating border yarn.",
        markdown: true
      }
    ]
  },
  {
  slug: "cast-on-methods-guide",
  title: "Knitting Cast-On Guide: Gauge, Width & Repeats",
  description: "Calculate a cast-on count from measured gauge, check repeat rounding, and keep edge stitches and pattern offsets separate.",
  toolSlug: "cast-on-calculator",
  date: "2026-03-11",
  modifiedDate: "2026-09-16",
  keywords: [
    "knitting cast on methods",
    "long tail cast on",
    "cable cast on",
    "tubular cast on",
    "cast on comparison",
    "stretchy cast on knitting",
    "cast on for ribbing"
  ],
  sections: [
    {
      heading: "How Many Stitches Should I Cast On? Gauge, Repeats and Width",
      content: "Multiply your desired width by your measured stitches per inch to get a starting count. Then check the stitch pattern's repeat requirements and calculate the width of the adjusted count. A whole number that fits the repeat may produce a wider piece than you intended, so the count and the resulting width belong together.",
      markdown: true
    },
    {
      heading: "Start with measured stitch gauge",
      content: "Gauge describes stitches and rows over a measured distance. For a width calculation, use the stitch count across the swatch, not its row count. The [Craft Yarn Council recommends making a gauge swatch](https://media.craftyarncouncil.com/read_instructions.html) with the yarn, tools and stitch pattern specified for the project.\n\nRecord both parts of your measurement. “18 stitches over 4 inches” means 18 ÷ 4 = **4.5 stitches per inch**. It does not mean 18 stitches per inch. Use a representative swatch and follow the pattern and yarn care instructions for its finishing before relying on the measurement.\n\nFor a hypothetical target width of 10 inches at that gauge:\n\n**10 inches × 4.5 stitches per inch = 45 stitches.**\n\nThis is a mathematical planning result, not a measurement from a finished project. It assumes the gauge represented by the swatch also represents the fabric being planned.",
      markdown: true
    },
    {
      heading: "Decide how the pattern constrains the count",
      content: "The [FiberTools cast-on calculator](https://fibertools.app/cast-on-calculator) accepts desired width in inches, gauge stitches, gauge span in inches, and an optional whole-number stitch multiple. With the multiple blank, it rounds to the nearest whole stitch. With a multiple entered, it rounds the raw count upward to a complete multiple.\n\nFor the 10-inch example, entering a multiple of 6 changes 45 stitches to 48. Eight groups of six fit; seven groups total only 42. Dividing the adjusted 48 by 4.5 gives a modeled width of about **10.67 inches**, roughly two-thirds of an inch wider than the target.\n\nThis upward rule is a calculator planning choice. It does not mean that every knitting pattern should be rounded up. Check the actual pattern and the width you can accept before using the count.",
      markdown: true
    },
    {
      heading: "Why you should not round twice",
      content: "Consider a deliberately simplified example: a target width of 12.2 inches and a measured gauge of 4 stitches over 4 inches. That is one stitch per inch, so the unrounded requirement is 12.2 stitches.\n\nIf the repeat is six stitches, 12 falls below 12.2. The next complete multiple is **18**. Rounding 12.2 to 12 first would discard the fraction that determines which repeat meets the upward rule.\n\nAt this example's one-stitch-per-inch gauge, 18 stitches model an 18-inch width. That is 5.8 inches wider than the target. The correct arithmetic therefore exposes a design decision: a repeat may be too large for the width you want. Do not hide that difference by reporting the count alone.\n\n| Hypothetical inputs | Raw count | Multiple | Planned count | Modeled width |\n| --- | --- | --- | --- | --- |\n| 10 in; 18 stitches over 4 in | 45 | None | 45 | 10 in |\n| 10 in; 18 stitches over 4 in | 45 | 6 | 48 | About 10.67 in |\n| 12.2 in; 4 stitches over 4 in | 12.2 | None | 12 | 12 in |\n| 12.2 in; 4 stitches over 4 in | 12.2 | 6 | 18 | 18 in |",
      markdown: true,
      image: {
        src: "/images/guides/cast-on-repeat-count.svg",
        preview: "/images/guides/cast-on-repeat-count.png",
        alt: "Three groups of six numbered stitch symbols make 18 stitches; two groups make only 12, below the hypothetical raw requirement of 12.2.",
        caption: "Original count diagram with hypothetical inputs. Each circle represents one stitch for counting only; it does not depict a knitted loop, a cast-on technique or physical fabric.",
        width: 1200,
        height: 760
      }
    },
    {
      heading: "A multiple is not the same as “multiple plus”",
      content: "A hypothetical instruction such as “multiple of 6 plus 2” describes totals of the form 6n + 2, where n is the number of repeats. Its extra two stitches are not part of a pure multiple of six.\n\nThe cast-on calculator's multiple field does not automatically add that offset or any edge stitches. For example, a pattern-defined total of three six-stitch repeats plus two is **20 stitches**, not 18. This only explains the notation; it is not a recommendation to use three repeats for a particular garment.\n\nRead the full pattern to determine whether its offset already includes the edges. Do not add a second pair of edge stitches simply because another example uses them. If different parts of the edge and body behave differently, dividing the entire count by body gauge remains only an approximation.",
      markdown: true
    },
    {
      heading: "Check the plan before casting on",
      content: "Write down the target width, measured stitch gauge, repeat, any pattern-defined extras, and the resulting count. Keep the desired width separate from the modeled width so a rounding change stays visible.\n\nFor a fitted item, follow the pattern's sizing and ease instructions rather than assuming a body measurement is the finished width. This count calculation does not choose ease, a cast-on technique or an edge's stretch. Use it alongside the pattern, then recheck your working gauge.\n\n### Does a cast-on count tell me which method to use?\n\nNo. The number of stitches and the way you create them are separate decisions. Use the pattern's method instructions alongside this calculation; the arithmetic does not replace technique instructions.\n\n### Can I enter centimeters in the inch fields?\n\nUse the units printed on the form. This calculator labels its dimensions in inches. Convert your dimensions consistently before entering them rather than mixing centimeters and inches.\n\n### Does the result guarantee the finished width?\n\nNo. The displayed width is count divided by measured stitches per inch. It assumes the planned fabric matches that gauge; it does not verify a finished object. Keep the assumptions with your project notes and revisit the count when the pattern or measurements change.",
      markdown: true
    },
    {
      heading: "Choose the method specified by your pattern",
      content: "Stitch count does not determine the cast-on method. Check whether your pattern specifies long-tail, cable, tubular, or another setup, and follow instructions for that exact variation. Make a sample edge using the planned yarn and tools before deciding whether its appearance and stretch suit the project. Do not infer those properties from a stitch-count calculation.\n\nA method comparison should answer a separate question from the count: what setup does this pattern require, and how does your sample edge behave? Keep the method, needle size and any pattern-specific setup rows in the same notes as the count. This guide does not provide step-by-step technique instructions."
    }
  ],
  editorialNote: "AI-assisted explanation prepared with Codex. Numerical examples are hypothetical and checked mathematically; no physical project or yarn product was tested. Published by FiberTools.",
  sources: [
    {
      title: "Craft Yarn Council: Reading instructions and gauge",
      url: "https://media.craftyarncouncil.com/read_instructions.html"
    },
    {
      title: "FiberTools: Calculator inputs and model",
      url: "https://fibertools.app/cast-on-calculator"
    }
  ]
},
  {
    slug: "crochet-stitch-reference-guide",
    title: "Crochet Stitch Reference: Basic Stitches & Terms",
    description: "Review chain, slip stitch, single crochet through treble, common chart symbols and selected stitch combinations in US terms.",
    toolSlug: "stitch-quick-reference",
    date: "2026-03-11",
    modifiedDate: "2026-09-05",
    keywords: ["crochet stitches for beginners", "basic crochet stitches", "crochet stitch chart", "single crochet", "double crochet", "crochet stitch height", "crochet abbreviations"],
    sections: [
      {
        heading: "Basic Crochet Stitches Overview",
        content: "Crochet uses a small set of fundamental stitches that combine to create every fabric texture and pattern. Each stitch is built by wrapping yarn around the hook (yarn overs) and pulling loops through other loops. The number of yarn overs before inserting the hook determines the stitch height.\n\nThe chain (ch) is the foundation, a series of interlocking loops that forms the base row or creates spaces within a pattern. The slip stitch (sl st) is the shortest stitch, used mainly for joining rounds and moving across stitches without adding height. Single crochet (sc) is a common fabric-forming stitch, short, dense, and the most commonly used stitch in amigurumi and structured projects.\n\nHalf double crochet (hdc) is a step taller, producing a slightly looser fabric. Double crochet (dc) is the workhorse of blankets, garments, and granny squares, tall enough to work up quickly but dense enough for warmth. Treble crochet (tr) is taller still, creating an open, airy fabric used in lace and decorative edgings.\n\nHere is a reference chart for US crochet stitches:\n\nChain (ch): 0 chains height, abbreviation ch, beginner level, foundation/spacing\nSlip stitch (sl st): 0 chains height, abbreviation sl st, beginner level, joining/moving\nSingle crochet (sc): 1 chain height, abbreviation sc, beginner level, dense fabric/amigurumi\nHalf double crochet (hdc): 2 chains height, abbreviation hdc, beginner level, medium density\nDouble crochet (dc): 3 chains height, abbreviation dc, beginner level, blankets/garments\nTreble crochet (tr): 4 chains height, abbreviation tr, intermediate level, lace/openwork"
      },
      {
        heading: "How Stitch Height Affects Your Fabric",
        content: "Stitch height directly controls fabric density, drape, and warmth. Shorter stitches produce denser, stiffer fabric. Taller stitches produce more open, drapey fabric. Choosing the right stitch height for your project is one of the most important decisions in crochet.\n\nSingle crochet creates the densest fabric, stitches are compact, the fabric is thick, and very little light passes through. This makes it ideal for amigurumi (stuffing must not show through), washcloths, bags, and any project that needs structure. The tradeoff is speed: single crochet works up slowly because each row adds very little height.\n\nDouble crochet is roughly twice as tall as single crochet, so your project grows twice as fast. The fabric is lighter and more flexible, with small gaps between stitches that provide breathability. This makes double crochet the default choice for blankets, scarves, and garments where drape matters.\n\nTreble crochet and taller stitches create very open fabric with visible holes between stitches. They are used primarily in lace patterns, decorative edgings, and lightweight summer garments. The fabric has significant drape but minimal warmth, it is too open to trap air effectively."
      },
      {
        heading: "Reading Crochet Stitch Diagrams",
        content: "Crochet stitch diagrams (also called charts or symbol charts) represent each stitch as a symbol. Learning to read these diagrams is a valuable skill because they are universal, the symbols are the same regardless of the language the pattern is written in.\n\nThe most common symbols: a small oval or dot represents a chain. A short dash represents a slip stitch. A plus sign or X represents a single crochet. A T-shape represents a half double crochet. A T with a diagonal line represents a double crochet. A T with two diagonal lines represents a treble crochet.\n\nDiagrams are read from the bottom up (like crochet itself). Right-side rows are read right to left; wrong-side rows are read left to right. For patterns worked in the round, all rounds are read counterclockwise (right to left).\n\nImportant: all standard crochet terminology on fibertools.app uses US terms. The US and UK systems use the same stitch names for different stitches, US single crochet equals UK double crochet. If you are following a UK pattern, use the UK to US Converter to translate the terminology before starting."
      },
      {
        heading: "Common Stitch Combinations",
        content: "Once you master the basic stitches, combining them creates textured patterns with unique visual effects.\n\nMoss stitch (also called linen stitch or granite stitch) alternates single crochet and chain-1 spaces across the row, offsetting the placement each row. This creates a woven-looking fabric with excellent drape, popular for scarves, blankets, and market bags.\n\nShell stitch groups multiple tall stitches (usually 5 double crochet) into a single stitch, creating a fan or shell shape. Shells are used for blanket borders, baby blankets, and shawls. The V-stitch is a simpler version: 2 double crochet with a chain-1 space between them, worked into a single stitch.\n\nSpike stitch (also called long stitch) inserts the hook into a row below the current row instead of the current row's stitches. This pulls the yarn down to create elongated stitches that span multiple rows, used for color effects and textured stripes.\n\nBobble stitch works 4-5 incomplete double crochets into the same stitch and joins them at the top, creating a raised bump on the fabric surface. Bobbles add three-dimensional texture to blankets, pillows, and decorative items.\n\nThe Stitch Quick Reference tool on fibertools.app provides step-by-step notes for its included stitches, with text search and a craft filter. It does not provide instructions for every combination described here or filter by skill level."
      },
      {
        heading: "Frequently Asked Questions",
        content: "Which stitch should a beginner learn first?\nChoose a beginner pattern with clear written or charted instructions and practice the exact stitch it requires. Difficulty and fabric behavior depend on the project, yarn, hook, and individual learner.\n\nWhat is the difference between US and UK crochet terms?\nSeveral common names refer to different stitch actions. For example, US single crochet maps to UK double crochet, and US double crochet maps to UK treble. Identify the source convention and check the pattern's own key. The UK/US Converter covers only its displayed map.\n\nHow do I know which stitch to use for a project?\nFollow a tested pattern and evaluate a representative swatch for the intended density, drape, strength, and appearance. A short reference cannot select one stitch for every project.\n\nWhat does turning chain mean?\nIt is a chain used at a row or round transition. Its count and whether it represents a stitch are pattern-specific; follow the selected instructions."
      }
    ]
  },
  {
    slug: "yarn-stripe-patterns-guide",
    title: "Yarn Stripe Pattern Guide: Rows, Color & Yardage",
    description: "Plan knitting and crochet stripe sequences, compare carrying versus cutting, manage ends and measure per-color yarn use.",
    toolSlug: "stripe-generator",
    date: "2026-03-11",
    keywords: ["yarn stripe patterns", "knitting stripes", "crochet stripes", "stripe color planning", "carrying yarn stripes", "stripe yardage calculation", "jogless stripes"],
    sections: [
      {
        heading: "Planning Stripe Sequences",
        content: "A stripe plan needs an ordered list of colors and a whole row count for each stripe. Equal, varied, or randomly selected row widths are different planning rules; none is universally better, and the appearance must be judged in the actual fabric and project context.\n\nBefore committing, make a sample with the intended yarns, stitch, gauge, working direction, and finishing. Contrast and apparent stripe width can differ from a screen preview, and accessibility or visibility needs may change the palette decision.\n\nThe Stripe Generator creates bounded fixed-row, random-width, or palette-order sequences. In randomized modes, relative whole-number weights influence selection frequency and a seed makes the result repeatable. The output reports rows and row share only; it does not know the yarn available or estimate per-color yardage."
      },
      {
        heading: "Carrying Yarn vs Cutting",
        content: "When changing colors for stripes, you either carry the unused color up the side of the work or cut it and rejoin later. The right choice depends on stripe width.\n\nFor stripes of 1-2 rows, carry the yarn. Simply drop the current color at the end of the row, pick up the next color, and continue. The carried yarn runs up the side edge in neat floats. Twist the carried yarn around the working yarn every 2 rows to prevent loose loops.\n\nFor stripes of 3-4 rows, carrying is still possible but the floats on the side edge become longer and can catch on things. Twist the carried yarn around the working yarn at the beginning of every row to keep it secure.\n\nFor stripes of 5+ rows, cut the yarn and rejoin when that color returns. Long floats up the side are unsightly, difficult to manage, and can snag. Cutting means more ends to weave in, but the edges look much cleaner.\n\nReference for stripe width decisions:\n\n1-2 rows per stripe: Carry yarn, twist every row, 0 extra ends per color change, best for narrow alternating stripes\n3-4 rows per stripe: Carry or cut (your preference), 0 or 2 ends per change, transitional zone\n5-8 rows per stripe: Cut and rejoin, 2 ends per color change, best for medium stripes\n9+ rows per stripe: Always cut and rejoin, 2 ends per color change, best for wide color blocks"
      },
      {
        heading: "Weaving In Ends Efficiently",
        content: "Stripes generate a lot of yarn ends, every color change creates two tails (one from the old color, one from the new). A striped blanket with 30 color changes produces 60 tails to weave in. Efficient end-management saves hours of finishing work.\n\nThe duplicate stitch method is the most secure way to weave in ends on knitted fabric. Thread the tail on a tapestry needle and follow the path of existing stitches for 1-2 inches, mimicking the V-shapes of stockinette. The woven tail disappears into the fabric and will not pull out with washing.\n\nFor crochet, weave the tail along the top of the previous row's stitches for 6-8 stitches, then reverse direction for 2-3 stitches. The direction change prevents the tail from working its way out. Always weave along a same-color stripe boundary so the carried tail does not show through on the right side.\n\nThe Russian join eliminates ends entirely by splicing the new yarn into the old yarn's plied structure. Untwist the last 2 inches of each yarn, thread each through the other's core using a tapestry needle, and pull snug. The join is invisible and produces zero tails. This method works best with plied wool and wool-blend yarns, it does not hold well with slippery fibers like cotton or acrylic."
      },
      {
        heading: "Yarn Quantity Planning for Stripes",
        content: "A row-count share can approximate a color's share only when every row has essentially the same width and stitch consumption. Shaping, texture, carried floats, borders, joins, and different yarns break that assumption.\n\nFor a constant-width flat swatch, measure the yarn used by each color across a complete repeat. Scale those measured color amounts by the number of planned repeats, then choose and document any allowance separately. This is stronger evidence than assigning a universal percentage or buffer.\n\nThe Stripe Generator helps arrange a color sequence; it does not prove per-color yardage. The Yarn Calculator can scale total measured swatch use to a flat rectangle, but it does not split that total by color. The Project Cost Calculator only combines the quantities and prices you enter."
      },
      {
        heading: "Frequently Asked Questions",
        content: "How do I carry yarn up the side for stripes?\nFor stripes of 1-2 rows, drop the current color and pick up the next at the edge. Twist the carried yarn around the working yarn at the start of each row to prevent long loose loops on the side edge. For stripes wider than 4 rows, cut and rejoin instead.\n\nHow much extra yarn do I need for weaving in ends?\nLeave a 6-inch tail when joining or cutting yarn, this is the minimum needed to weave in securely with a tapestry needle. For very thick or bulky yarn, leave 8 inches. For fine yarn (fingering/lace weight), 5 inches is sufficient.\n\nCan I crochet stripes in the round without a visible jog?\nThe jogless jog technique minimizes but does not completely eliminate the color shift. At the first stitch of each new color round, slip stitch into the first stitch of the previous color's last round instead of working a normal stitch. Planning stripes in even-row multiples also helps make the jog less visible.\n\nHow do I plan a gradient stripe sequence?\nOrder your colors from lightest to darkest (or vice versa) and graduate stripe widths, wider stripes at the center color and narrowing toward the edges. A 5-color gradient might use 2-4-6-4-2 row widths. The visual effect is a smooth color fade that suggests continuous color change."
      }
    ]
  },
  {
    slug: "vintage-knitting-patterns",
    title: "Vintage Knitting Patterns: Terms, Gauge & Sizing",
    description: "Review vintage terms, needle systems, yarn labels, measurements and gauge without assuming a modern one-to-one conversion.",
    toolSlug: "uk-to-us-converter",
    date: "2026-03-14",
    modifiedDate: "2026-09-05",
    keywords: ["vintage knitting patterns", "old knitting patterns", "retro knitting", "vintage pattern decoder", "antique knitting instructions", "1950s knitting patterns"],
    sections: [
      {
        heading: "The Patterns and Information on This Page",
        content: "The patterns and information on this page are for informational and creative purposes only. Yarn weights, needle sizes, and gauge recommendations may vary. Always swatch before starting a project."
      },
      {
        heading: "Why Vintage Knitting Patterns Need Decoding",
        content: "Vintage knitting patterns from before the 1980s use terminology, abbreviations, and sizing systems that differ significantly from modern standards. A pattern from the 1950s might call for \"3-ply wool\" on \"No. 10 needles\", terms that map to completely different yarn weights and needle sizes than a modern crafter would assume.\n\nThese patterns were written for an audience that shared specific cultural knowledge about yarn brands, needle numbering, and standard gauge expectations that no longer apply. The wool industry has changed, needle sizing systems have been revised, and the yarn weight classification system used today did not exist until the Craft Yarn Council standardized it in the 2000s.\n\nDecoding a vintage pattern is not just about translating old terms, it requires understanding the era's assumptions about gauge, fit, and construction so you can produce a garment that matches the original designer's intent with modern materials."
      },
      {
        heading: "Vintage Needle Size Systems",
        content: "Historical needle numbering can differ by country, era, manufacturer, and table. A number without its source system is not enough to establish a metric diameter.\n\nUse a dated source or the original publisher's key when available. Even familiar US or UK labels can be ambiguous in older material, so record the evidence used for each conversion.\n\nThe FiberTools Needle Converter looks up entries in its included modern reference tables; it does not map every historical sizing system. Verify the exact tool diameter independently and use a representative swatch to compare with the pattern's stated gauge."
      },
      {
        heading: "Vintage Yarn Weight Terminology",
        content: "Historical ply labels and trade names are not universal conversions to modern yarn-weight categories. Their meaning depends on the exact manufacturer, product, country, and publication. Look for the original yarn specification and pattern gauge; if the yarn is discontinued, compare a candidate using a representative swatch and actual construction requirements. WPI can suggest overlapping categories but cannot confirm a substitution."
      },
      {
        heading: "Converting Imperial Measurements",
        content: "Most vintage patterns use imperial measurements exclusively, inches for lengths and ounces for yarn quantities. Converting to metric is straightforward (1 inch = 2.54cm, 1 oz = 28.35g), but the real challenge is that vintage sizing ran smaller than modern sizing.\n\nA vintage \"bust 34\" pattern from the 1950s was designed with minimal or even negative ease, the garment was meant to fit close to the body. A modern knitter with a 34-inch bust measurement expecting a comfortable fit with 2-4 inches of positive ease would need to knit a larger size from the vintage pattern.\n\nVintage length measurements also assumed different proportions. Skirts were longer, sleeves were set higher, and necklines were closer to the throat. When adapting a vintage pattern, compare the finished measurements against a modern garment you like and adjust the length calculations accordingly."
      },
      {
        heading: "Common Vintage Abbreviations and Their Modern Equivalents",
        content: "Some vintage abbreviations resemble modern ones, while others vary by era, region, publisher, and pattern. Never infer the source convention from one token alone; consult the pattern's key, diagrams, stitch counts, publication context, and authoritative references.\n\nThe FiberTools UK/US Converter replaces only the modern and selected legacy terms in its displayed deterministic map. Unsupported or ambiguous wording stays unchanged. It does not identify a pattern's source convention or decode every vintage term."
      },
      {
        heading: "Tips for Adapting Vintage Patterns Successfully",
        content: "First, photocopy or photograph the pattern before marking it up. Vintage patterns are often irreplaceable. Second, convert all needle sizes to metric millimeters and all yarn weights to CYC categories before beginning. Third, swatch extensively, vintage patterns assumed tighter gauge than most modern knitters produce, and the fabric was expected to be firmer and less drapey than contemporary taste prefers.\n\nFourth, check the finished measurements against your body and add ease if needed. Fifth, consider substituting modern construction techniques for outdated methods, seaming techniques, increases, and decreases have improved significantly since the mid-20th century. A modern M1 increase produces a neater result than the \"knit into the back and front\" that many vintage patterns specify.\n\nFinally, embrace the charm of vintage design while adapting the technical execution. The silhouettes, stitch patterns, and design sensibility of vintage patterns are often stunning, they just need modern technical translation to produce a wearable result."
      },
      {
        heading: "Frequently Asked Questions About Vintage Patterns",
        content: "Q: How do I tell if a pattern uses UK or US terms?\nA: Check the publication origin. British publishers (Patons UK, Sirdar, Hayfield) use UK terms. If the pattern lists needle sizes as \"No. 8\" or \"No. 10\" with higher numbers for smaller needles, it is using the old UK SWG system.\n\nQ: Can I use modern yarn in a vintage pattern?\nA: Yes, but match the gauge, not the yarn name. Swatch with a modern yarn in the same weight category until your stitch and row counts match the pattern specification.\n\nQ: Why are vintage pattern sizes so small?\nA: Vintage patterns were designed with less ease than modern patterns. A vintage \"size 36\" is often equivalent to a modern small or extra-small. Always check finished measurements and choose the size based on desired fit, not the labeled size.\n\nQ: Where can I find vintage patterns?\nA: Estate sales, charity shops, online archives, and Ravelry's vintage pattern section are all good sources. Many out-of-copyright patterns have been digitized and are available free online."
      }
    ]
  },
  {
    slug: "fiber-content-guide",
    title: "Yarn Fiber Types: Wool, Cotton, Acrylic & Blends",
    description: "Compare wool, cotton, acrylic, silk, alpaca, linen and blends, then verify the exact yarn label, care instructions and swatch.",
    toolSlug: "yarn-weight-chart",
    date: "2026-03-14",
    keywords: ["fiber content guide", "yarn fiber types", "wool vs acrylic", "cotton yarn properties", "alpaca yarn", "silk yarn", "yarn fiber comparison"],
    sections: [
      {
        heading: "Why Fiber Content Matters",
        content: "The fiber content of your yarn determines everything about your finished project beyond stitch pattern and color: how it drapes, how warm it is, how it washes, whether it pills, how it ages, and how it feels against skin. Two yarns with identical weight and gauge but different fiber content will produce strikingly different fabrics.\n\nChoosing the right fiber for your project is as important as choosing the right pattern. A wool sweater will keep you warm but may felt in the washing machine. A cotton blanket will be cool and heavy but machine-washable. An acrylic baby hat will survive dozens of washes but lacks the stitch definition of natural fibers.\n\nUnderstanding fiber properties helps you make informed substitutions, set realistic care expectations, and choose yarns that match both the performance requirements and the aesthetic goals of each project."
      },
      {
        heading: "Wool: The Gold Standard of Knitting Fibers",
        content: "Wool yarns vary by breed, preparation, spin, ply, dye, finish, and blend. Those differences affect elasticity, stitch definition, warmth, drape, and care, so a broad wool label is not a complete performance specification.\n\nChoose a wool yarn by comparing the selected pattern's gauge and use with the actual yarn label, then make and treat a representative swatch. Do not assume that every wool behaves the same under wear or finishing.\n\nSuperwash is a treatment category, not a universal laundering promise. Follow the specific yarn or garment care label; machine settings, drying limits, and dimension changes vary by product."
      },
      {
        heading: "Cotton: Cool, Heavy, and Inelastic",
        content: "Cotton is a plant fiber that produces a cool, breathable fabric with no stretch. It is heavier than wool per yard, which means cotton garments drape under their own weight, beautiful for summer tops but potentially problematic for large items like blankets that may stretch and sag.\n\nCotton has excellent stitch definition for crochet and shows textured stitch patterns clearly. It is the preferred fiber for amigurumi because it holds its shape firmly when stuffed. Dishcloths and washcloths are almost always cotton because it is absorbent and machine-washable.\n\nCotton yarn lacks elasticity, which makes it harder to work with for new knitters, dropped stitches are more difficult to recover, and tension tends to be uneven. Mercerized cotton has been treated with sodium hydroxide to add sheen and strength, producing a smoother, more lustrous yarn that is easier to work with."
      },
      {
        heading: "Acrylic: Affordable, Durable, and Machine-Washable",
        content: "Acrylic yarns vary in softness, construction, finish, heat tolerance, pilling, and laundering instructions. Price and availability also vary by brand and region, so compare the actual yarn rather than assuming one performance profile for the category.\n\nDo not assume every acrylic is machine-washable, dryable, allergen-free, or suitable for a particular recipient. Follow the product care label and any safety requirements for the intended use.\n\nHeat can irreversibly alter some synthetic fibers and finishes. Use steam, irons, dryers, or heat-applied embellishments only when the yarn or garment label and equipment instructions permit it, after testing a representative swatch."
      },
      {
        heading: "Luxury Fibers: Silk, Alpaca, Cashmere, and Mohair",
        content: "Silk adds drape and sheen to yarn blends. Pure silk yarn is slippery and heavy, making it challenging to knit but producing a luminous fabric. Silk blends (silk-merino, silk-cashmere) combine the best properties of both fibers.\n\nAlpaca fiber is warmer than wool, lighter, and hypoallergenic. It lacks elasticity, so pure alpaca garments tend to stretch and grow over time. Alpaca works best in blends (alpaca-wool, alpaca-silk) or in accessories like scarves and shawls where stretch is less critical.\n\nCashmere is the finest animal fiber commonly available, producing an extraordinarily soft fabric. It is expensive, delicate, and prone to pilling. Reserve cashmere for small luxury projects, a cashmere cowl or hat is a better investment than a cashmere sweater.\n\nMohair comes from Angora goats and produces a fuzzy, halo-effect fabric. It is warm, lightweight, and adds a soft blur to stitch patterns. Mohair is typically held together with a thinner companion yarn and works beautifully in lace shawls."
      },
      {
        heading: "Plant Fibers Beyond Cotton: Linen, Bamboo, and Hemp",
        content: "Linen is spun from flax plants and produces a cool, crisp fabric that softens dramatically with washing. New linen yarn feels stiff and papery, but after several washes it becomes soft and drapey. Linen is extremely durable, linen garments can last decades. It is the ideal summer fiber.\n\nBamboo yarn is made from bamboo pulp processed into viscose or rayon. Despite eco-friendly marketing, the manufacturing process is chemical-intensive. The resulting yarn is silky, cool, and drapey with a subtle sheen. It works well for warm-weather garments but lacks elasticity.\n\nHemp is strong, naturally antimicrobial, and environmentally sustainable. Like linen, it starts stiff and softens with use. Hemp yarn is less widely available than cotton or linen but produces durable bags, home goods, and summer accessories."
      },
      {
        heading: "How to Choose the Right Fiber for Your Project",
        content: "Match fiber to the project's requirements rather than treating a fiber name as a guarantee. Consider warmth, elasticity, abrasion, moisture behavior, care instructions, allergies or sensitivities, and the fabric produced by the intended stitch pattern. Confirm those properties from the exact yarn label and a washed swatch.\n\nFor gifts, ask about fiber sensitivities and realistic care preferences when you can. Baby items require special attention to the exact product's care, construction, and safety guidance; a broad fiber category is not enough evidence.\n\nBudget from the exact label price and the quantity supported by your pattern or measurements. The Yarn Weight Chart is a category reference, not a fiber-performance specification. The Yarn Calculator can scale measured swatch use for a flat rectangle and report whole skeins from label data; it does not calculate cost or shaped-garment quantity."
      },
      {
        heading: "Frequently Asked Questions About Fiber Content",
        content: "Q: Is wool always warmer than acrylic?\nA: No single category comparison covers yarn construction, fabric density, moisture, wind, garment design, and individual comfort. Compare the actual fabric and intended conditions.\n\nQ: Can I mix different fibers in one project?\nA: Yes, when their gauge, performance, and care requirements are compatible. Treat the complete item within the most restrictive applicable product instructions.\n\nQ: What does \"superwash\" mean?\nA: It identifies wool treated to reduce felting under specified conditions. It does not replace the product care label or guarantee a particular machine cycle, drying method, or dimension change.\n\nQ: How do I identify unknown fiber content?\nA: Do not use an open-flame test as casual project guidance. Ask the seller or maker, retain labels, or use a qualified textile-identification service when the answer affects safety or care."
      }
    ]
  },
];

export function getGuideByToolSlug(toolSlug: string): Guide | undefined {
  return guides.find((g) => g.toolSlug === toolSlug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getAllGuides(): Guide[] {
  return guides;
}
