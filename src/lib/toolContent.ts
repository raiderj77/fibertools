export interface ToolEducationalContent {
  disclaimer?: string;
  answerCapsule?: string;
  internalLinks?: Array<{ label: string; href: string; description: string }>;
  // Archetype A, Calculator First
  commonMistakes?: string[];
  projectExample?: string;
  useCases?: string[];
  // Archetype B, Reference + Tool
  chartGuide?: string;
  industryStandards?: string;
  manufacturerNote?: string;
  // Archetype C, Pattern Generator
  designPrinciples?: string;
  patternVariations?: string[];
  // Archetype D, Technique Guide + Tool
  skillLevel?: string;
  techniqueEffect?: string;
  techniqueSteps?: string[];
  fiberNotes?: string;
  practiceProject?: string;
  introduction: {
    title: string;
    paragraphs: string[];
  };
  whatIs: {
    title: string;
    paragraphs: string[];
  };
  howCalculated: {
    title: string;
    paragraphs: string[];
  };
  howToUse: {
    title: string;
    paragraphs: string[];
  };
  understandingResults: {
    title: string;
    paragraphs: string[];
  };
  proTips: {
    title: string;
    tips: string[];
  };
  projectIdeas?: {
    title: string;
    ideas: string[];
  };
}

export const toolContent: Record<string, ToolEducationalContent> = {
  "yarn-calculator": {
    commonMistakes: [
      "Using a yarn-weight coverage factor instead of measuring the intended yarn and stitch pattern.",
      "Scaling a flat swatch to a garment, shaped piece, border, seam, or three-dimensional form that the area model does not represent.",
      "Changing yarn, tools, tension, stitch pattern, or finishing after measuring the swatch.",
      "Treating the displayed planning allowance as measured consumption or assuming it covers every project-specific source of waste.",
    ],
    projectExample: "A 4 by 4 inch representative swatch uses 20 yards, and the target flat rectangle is 50 by 60 inches. The area ratio is (50 × 60) ÷ (4 × 4) = 187.5. Multiplying 20 yards by 187.5 gives a measured base estimate of 3,750 yards. A user-entered 10 percent allowance produces 4,125 planned yards. With 220 yards on each label, the whole-skein calculation rounds 4,125 ÷ 220 up to 19 skeins.",
    useCases: [
      "Scaling measured yarn consumption from a representative swatch to a flat rectangular blanket panel, scarf, or wrap.",
      "Comparing planning totals after changing an explicit allowance while leaving the measured base visible.",
      "Converting a measured length requirement to whole skeins from the length and weight printed on one yarn label.",
      "Estimating a partial skein by weight when the remnant is no heavier than the labeled full skein.",
    ],
    introduction: {
      title: "Why This Calculator Requires Measured Yarn Use",
      paragraphs: [
        "Yarn weight, gauge, and project labels do not determine yarn consumption by themselves. Stitch structure, tension, tools, yarn construction, and finishing all affect the length used per unit of fabric.",
        "This calculator therefore scales only from yarn length measured in a representative flat swatch. It does not use generic coverage factors or hidden stitch-pattern multipliers.",
      ],
    },
    whatIs: {
      title: "A Flat-Area Scaling Worksheet",
      paragraphs: [
        "The model compares the area of a flat rectangular target with the area of a measured swatch, then multiplies that ratio by the yarn length the swatch consumed.",
        "It does not model garments, sleeves, shaping, seams, borders, fringe, three-dimensional pieces, or changes in stitch pattern. Estimate those separately or use a pattern that supplies construction-specific quantities.",
      ],
    },
    howCalculated: {
      title: "Measured-Swatch Formula",
      paragraphs: [
        "Base yarn length equals (target width × target length) ÷ (swatch width × swatch length) × measured swatch yarn length. Target and swatch dimensions must use the same unit.",
        "Planned yarn length equals the measured base multiplied by one plus the user-entered allowance percentage. The allowance is shown separately and may be zero.",
        "Whole skeins equal the planned length divided by label length per skein, rounded up. The displayed purchase weight comes from that whole-skein count multiplied by label weight.",
        "Partial-skein length equals partial weight divided by labeled full-skein weight, multiplied by labeled full-skein length. The remnant must be greater than zero and no heavier than the full skein.",
      ],
    },
    howToUse: {
      title: "How to Measure and Enter the Inputs",
      paragraphs: [
        "Make a representative swatch with the same yarn, stitch pattern, tools, tension, and finishing planned for the project. Measure its width and length without including distorted edges.",
        "Measure the yarn consumed by that swatch, enter the flat target dimensions, and choose an allowance that reflects the specific project rather than treating the default as a standard.",
        "For whole skeins, copy both length and weight from the same yarn label. Recalculate after any material or construction change.",
      ],
    },
    understandingResults: {
      title: "How to Read the Result",
      paragraphs: [
        "The base length is proportional measured-swatch arithmetic. The planned length adds only the displayed allowance.",
        "The whole-skein result is a purchasing count based on the label values entered. Dye-lot availability, knots, rejected material, color proportions, and return policies are outside the calculation.",
        "A result is not a fit, drape, durability, or completion guarantee. Compare it with the selected pattern and project-specific samples.",
      ],
    },
    proTips: {
      title: "Checks Before Buying",
      tips: [
        "Use a larger representative swatch when stitch repeat, colorwork, or texture varies across a small sample.",
        "Measure each color separately when the design does not use colors in equal proportions.",
        "Add borders, seams, fringe, shaping, and separate pieces outside this flat-area estimate.",
        "Keep the yarn label and record the exact swatch method so the estimate can be reproduced.",
      ],
    },
    manufacturerNote: "Use the length and weight printed on the exact yarn label being purchased. Nominal yarn category, fiber name, or skein count alone is not enough to establish equivalent length or fabric.",
    internalLinks: [
      { label: "Blanket Calculator", href: "/blanket-calculator", description: "Scale measured swatch use with blanket stitch and row planning" },
      { label: "Yarn Stash Estimator", href: "/stash-estimator", description: "Estimate a partial skein from its weight and label values" },
      { label: "Project Cost Calculator", href: "/project-cost-calculator", description: "Carry whole-skein quantities into a materials-cost worksheet" },
    ],
  },

  "needle-converter": {
    chartGuide: "This converter maps knitting needle sizes across four major systems: US numbered sizes, UK old-system numbered sizes (which run in reverse of US), metric millimeter measurements, and Japanese numbered sizes. Each row shows how one size appears across all four systems, for example, US 8 equals 5.0mm, UK 6, and Japanese size 8. Metric millimeters are the universal standard, so use those as your reference point when systems conflict. US sizes run from 0 to 50; UK sizes run in the opposite direction (larger numbers = smaller needles); metric sizes go from 2.0mm to 25mm; Japanese sizes use a distinct numbering system that doesn't directly correlate with US numbers despite overlapping values. For crochet hooks, separate tables cover US letter designations (B through S), metric, and UK sizes.",
    industryStandards: "Knitting needle sizing standards evolved from multiple regional systems that developed independently. ISO 4035 serves as the international standard, measuring in millimeters. The US system runs from 0 (smallest) to 50 (largest). The UK old-system, officially obsolete since metric adoption in the 1970s, runs in reverse, UK 14 is 2.0mm while US 14 is 10.0mm, the exact opposite ends of the spectrum. Japanese needles use their own numbered system that originated from US sizing but diverges enough to require conversion. ISO standardization in the 1970s–80s moved most manufacturers toward metric labeling, though US, UK, and Japanese systems persist in vintage needles and region-specific patterns.",
    manufacturerNote: "In practice, needle tolerance varies between manufacturers, a needle labeled 5.0mm may measure 4.9mm or 5.1mm depending on quality control. European manufacturers typically maintain tighter tolerances than budget-brand Asian manufacturers. Vintage UK needles can be troublesome because old UK system numbers don't map perfectly to modern metric standards. Some needle materials (bamboo, wood) vary fractionally in diameter with humidity and temperature. Japanese needles are often labeled with both Japanese and metric sizes but occasionally contain errors in the metric conversion. Always verify sizing with a physical needle gauge tool before starting any critical project.",
    answerCapsule: "Crochet hook sizes vary by country. US sizes use letters and numbers, while metric sizes use millimeters. Use this converter to find the equivalent hook size for any international standard. It also covers all knitting needle sizes across US, UK, metric, and Japanese systems.",
    internalLinks: [
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "See recommended needle and hook sizes for each yarn weight" },
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Check your gauge after selecting your needle or hook size" },
    ],
    introduction: {
      title: "Why You Need a Knitting Needle Size Converter",
      paragraphs: [
        "You find a gorgeous Japanese pattern that calls for 8号 needles, or a vintage British pattern listing No. 6, what needle do you actually grab from your case? Needle sizing systems vary dramatically by country, and using the wrong size can throw off your entire gauge and finished dimensions.",
        "With patterns now shared globally through Ravelry, YouTube, and social media, crafters regularly encounter unfamiliar sizing systems. A reliable converter eliminates confusion and ensures you start every project with exactly the right tool in hand, no matter where the pattern originated.",
      ],
    },
    whatIs: {
      title: "What Are Knitting Needle Sizing Systems?",
      paragraphs: [
        "Knitting needle sizes refer to the diameter of the needle shaft, which directly controls stitch size and fabric gauge. The metric system measures this diameter in millimeters and serves as the universal reference point. All other systems are country-specific naming conventions mapped to these millimeter values.",
        "The US system uses numbers that generally increase with size, the Japanese system uses a similar ascending numbered scale, and the old UK system uses numbers that run in reverse, a UK 14 is a tiny 2.0mm needle, while a US 14 is a hefty 10.0mm needle. This reversal catches many knitters off guard.",
        "Modern patterns increasingly list metric sizes alongside regional numbers, but older and vintage patterns often use only the local system. Understanding these mappings is essential for anyone working from international or historical pattern sources.",
      ],
    },
    howCalculated: {
      title: "How Needle Size Conversion Works",
      paragraphs: [
        "Needle conversion uses standardized lookup tables maintained by needle manufacturers and craft organizations. Each system maps its numbered or named sizes to specific millimeter diameters. For example, US 8 equals 5.0mm, which equals UK 6, which equals Japanese 棒針 8号.",
        "The critical detail to understand is that UK sizing runs backward compared to US and metric. UK 14 is 2.0mm while US 14 is 10.0mm, the exact opposite ends of the size spectrum. This reversal has caused countless gauge disasters for knitters working from British patterns with American needles.",
        "Some sizes do not have exact equivalents across all systems. For instance, US 11 is 8.0mm, but the nearest UK size jumps from 7.5mm to 8.0mm without a standard number. The converter flags these gaps so you can choose the closest available option.",
      ],
    },
    howToUse: {
      title: "How to Use the Needle & Hook Size Converter",
      paragraphs: [
        "Enter a needle or hook size in any system, US numbered, UK old-system numbered, or metric millimeters, and the converter returns the equivalent in all three systems instantly. US sizes run from 0 to 50 for knitting needles. UK sizes run in the opposite direction, with smaller numbers for larger needles. Metric sizes are measured in millimeters and range from 2.0mm through 25mm for standard needles.",
        "The converter also handles crochet hook sizes, including lettered US hooks (B through S) and their metric equivalents. Select the tool type, knitting needle or crochet hook, to see the correct conversion table for your needs."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Metric millimeter sizes are the universal standard across manufacturers worldwide. When a US size and metric size appear to conflict, trust the millimeter measurement. Some manufacturers round differently, a US 8 needle is technically 5.0mm, but you may encounter needles labeled US 8 that measure 5.1mm or 4.9mm with calipers.",
        "Vintage UK needles follow an older sizing system that was officially replaced by metric in the 1970s. Patterns from before that era may reference sizes that do not map cleanly to modern equivalents. If you are working from a vintage pattern and your gauge is off, check the actual millimeter diameter of your needle against the converter output."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always verify your needle size with a physical needle gauge tool. Manufacturer tolerances vary, and the printed size on a needle is not always accurate to the nearest 0.25mm.",
        "Japanese needle and hook sizes use their own numbering system that differs from US sizes even when the numbers look similar. A Japanese size 8 is not the same as a US size 8.",
        "Crochet hook letter designations are not standardized across all brands. A Boye H hook and a Clover H hook may differ slightly in diameter. Check the millimeter size printed on the hook itself.",
        "Interchangeable needle sets often skip half-sizes. If a pattern calls for a 4.5mm and your set jumps from 4.0mm to 5.0mm, you will need to buy that size separately."
      ],
    },
  },

  "gauge-calculator": {
    answerCapsule: "Enter measured swatch dimensions and counts to calculate gauge. The other modes proportionally scale only the stitch or row counts you enter or produce an at-or-above width checkpoint; they do not regrade a complete pattern.",
    commonMistakes: [
      "A gauge measured in a different stitch pattern, construction direction, or finishing state may not represent the intended fabric. Follow the selected pattern's swatch and care instructions.",
      "A proportional count does not verify shaping, repeats, edges, yarn behavior, construction, or fit. Review every affected instruction before changing a tested pattern.",
      "Target-width mode rounds at or above the entered width and shows the modeled result. Treat user-entered edge stitches or chains as pattern-specific additions, not calculator recommendations.",
    ],
    projectExample: "A pattern count of 200 stitches is based on 20 stitches per 4 inches. A representative swatch measures 22 stitches per 4 inches. The proportional checkpoint is 200 × (22 ÷ 20) = 220 stitches before any repeat adjustment. That arithmetic alone does not validate the pattern's shaping or fit.",
    useCases: [
      "Calculating stitches and rows per displayed unit from a representative measured swatch.",
      "Checking the proportional effect of a gauge difference on one entered stitch or row count.",
      "Producing a whole-stitch width checkpoint and reviewing the modeled width after repeat rounding.",
    ],
    internalLinks: [
      { label: "Stitch Pattern Calculator", href: "/stitch-pattern-calculator", description: "Solve the bounded repeat constraints you enter" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Review published guideline gauge ranges" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Look up entries in the included size tables" },
    ],
    introduction: {
      title: "What This Gauge Worksheet Can Check",
      paragraphs: [
        "Gauge records how many stitches and rows occupy a measured span in a particular fabric. Yarn, tools, tension, stitch pattern, construction, and finishing can all change that measurement.",
        "This worksheet performs bounded arithmetic on the values you enter. It does not decide whether a fabric is suitable or whether changing counts preserves a pattern's construction.",
      ],
    },
    whatIs: {
      title: "What Is Knitting and Crochet Gauge?",
      paragraphs: [
        "Gauge is the number of stitches and rows in a stated measurement span. A useful project comparison requires a representative swatch made and treated as directed by the selected pattern.",
        "Stitch and row gauge affect different dimensions. Which one controls a construction depends on the pattern, so the calculator does not rank one as universally more important.",
      ],
    },
    howCalculated: {
      title: "How Gauge Is Calculated",
      paragraphs: [
        "Swatch mode divides entered stitch and row counts by the entered measured dimensions. It also expresses the same density over 4 inches or 10 centimeters.",
        "Count scaling multiplies an entered pattern count by actual gauge divided by pattern gauge. Row scaling is calculated only when both row gauges and the row count are present.",
        "Target-width mode multiplies entered width by stitches per unit, rounds upward to a whole stitch, then rounds upward again when necessary to satisfy the entered multiple-plus constraint. The modeled width makes that rounding effect visible.",
      ],
    },
    howToUse: {
      title: "How to Use the Gauge Calculator",
      paragraphs: [
        "Choose swatch mode for measured density, count scaling for one entered pattern checkpoint, or target-width mode for an at-or-above whole-stitch count.",
        "Complete each optional group. In count scaling, a row result requires both row gauges and the original row count. In target-width mode, row gauge and target height must be entered together or both left blank.",
        "Changing units converts populated dimensions and standardized gauge counts instead of merely changing their labels."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The displayed proportional count is an arithmetic checkpoint. If a repeat is entered, the stitch result is the nearest compatible count and may differ from the unadjusted ratio.",
        "The target-width result is deliberately at or above the requested width. Compare its modeled width with the selected pattern before using the count."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Make the swatch in the same construction and stitch pattern required by the selected pattern.",
        "Apply the pattern- and yarn-directed treatment before recording the measurement used for planning.",
        "Record the exact span, counts, tools, yarn, and treatment so the result can be reproduced.",
        "Recheck every shaping and repeat constraint before substituting a proportional count into a pattern."
      ],
    },
  },

  "yarn-weight-chart": {
    disclaimer: "This is a reference and label comparison, not a guarantee of yarn compatibility. Categories, regional names, and yardage per gram cannot predict your gauge. Swatch with the actual yarn, follow your pattern, and check the finished fabric before substituting.",
    answerCapsule: "Compare the eight Craft Yarn Council yarn weight categories, knitting gauge guidelines, and suggested needle and hook sizes. Common US, UK, and Australian names are approximate references. Use the substitution checker to compare labels, then verify your choice with a swatch.",
    chartGuide: "Each row shows a CYC category, common regional names, and needle and hook guidelines. The gauge column is knitting only: stockinette stitches per 4 inches. Crochet gauge ranges differ and are listed separately in the linked CYC source. Jumbo sizes have no fixed upper limit, and lace hooks distinguish steel from regular hooks. Regional ply names are approximate, not exact conversions or counts of the yarn's strands.",
    industryStandards: "The Craft Yarn Council publishes categories 0 through 7 as yarn weight guidelines. The recommended gauges and tool sizes are reference ranges, not requirements for every project. Lace and openwork may use larger tools than the chart suggests. CYC also states that the categories do not establish whether two yarns are interchangeable; follow the pattern's gauge and evaluate a swatch.",
    manufacturerNote: "Two yarns with the same category or yardage per gram can differ in fiber content, construction, elasticity, and drape. Even a matching stitch gauge does not guarantee matching row gauge or fabric. Check both labels, swatch in the intended stitch pattern, and assess the fabric after the care process recommended for the yarn. Use the metric tool diameter when a manufacturer's US size designation differs.",
    internalLinks: [
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Verify your gauge after substituting yarn" },
      { label: "Yarn Yardage Calculator", href: "/yarn-calculator", description: "Calculate how much substitute yarn you need" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Find the right needle or hook size for your yarn weight" },
    ],
    introduction: {
      title: "Why You Need a Yarn Weight Reference Chart",
      paragraphs: [
        "A pattern calls for DK while a yarn label says 8-ply. Those names are commonly associated, but they do not prove that the yarn will meet the pattern's gauge. This chart helps you interpret labels before making a swatch.",
        "Compare the category, suggested tool size, fiber content, and label length and weight. Regional names can vary between manufacturers, so treat the UK and Australian columns as approximate naming references rather than exact equivalence rules.",
      ],
    },
    whatIs: {
      title: "What Are Yarn Weight Categories?",
      paragraphs: [
        "The CYC system groups yarns into eight categories, from 0 (Lace) through 7 (Jumbo). Its chart gives separate knitting and crochet gauge guidelines plus suggested needle and hook sizes.",
        "For example, category 3 includes DK and light worsted. CYC's knitting guideline is 21–24 stockinette stitches per 4 inches on 3.75–4.5 mm needles. This is a reference range, not a prediction for a particular yarn or knitter.",
        "A category is a starting point for selection. Yarn construction, the stitch pattern, the tools, and your tension all affect the fabric. A swatch is needed to assess whether a substitution meets the pattern's requirements.",
      ],
    },
    howCalculated: {
      title: "How Yarn Weight Is Determined",
      paragraphs: [
        "A practical method for estimating yarn weight is the wraps-per-inch test. Wrap yarn around a consistent tool without stretching or overlapping, then count the wraps across one inch. The Craft Yarn Council publishes overlapping WPI guideline ranges and warns that results can vary by how tightly the yarn is wrapped.",
        "Because adjacent WPI ranges overlap, one measurement can point to more than one possible category. Use WPI as a starting point, then make a gauge swatch with the intended needles or hook and follow the pattern or yarn manufacturer's guidance.",
        "This chart shows category and tool-size references; it does not measure or identify an unlabeled yarn. The substitution checker compares the categories you select and optional label yardage, without calculating a compatibility percentage.",
      ],
    },
    howToUse: {
      title: "How to Use the Yarn Weight & Substitution Guide",
      paragraphs: [
        "Search by a category number or common name, then select a category number for additional naming notes. Read the knitting gauge and needle or hook guidance alongside the actual yarn label and pattern.",
        "In the substitution checker, select the pattern yarn's category and the proposed substitute's category. You may also enter yards per gram from both labels. Divide total yards by grams and use the same unit for both yarns; do not mix meters per gram with yards per gram."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Same category, adjacent categories, and different categories describe only the selected labels. Every result requires a swatch. Matching categories or yards per gram do not establish matching gauge, thickness, or drape.",
        "The checker cannot determine a needle-size change from the labels. Swatch in the pattern's stitch pattern, follow the yarn's care instructions, then compare stitch gauge, row gauge, and the fabric. Even when gauge matches, consider whether the feel and drape suit the project."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use length per gram only to compare label information. Similar values do not prove that two yarns will make the same fabric.",
        "For colorwork, test the intended stitch pattern and assess elasticity, stitch definition, and drape with the actual substitute yarn.",
        "For lace and openwork, follow the pattern's gauge and suggested tools rather than assuming the compact stockinette range applies.",
        "Check yarn quantity using the label and a representative swatch. Equal skein weights do not necessarily contain equal lengths."
      ],
    },
  },

  "stitch-counter": {
    skillLevel: "Beginner",
    techniqueEffect: "A digital counter can reduce the mental load of tracking a pattern, but it is only as accurate as each tap. Multiple counters can help separate totals, pattern repeats, and shaping intervals. This browser attempts to save counter state locally; that state can be unavailable or cleared, so important counts still need a separate note.",
    techniqueSteps: [
      "Before beginning your project, list all rows or rounds that require special attention (decreases on rows 12, 14, 16; color changes at row 24; pattern repeats every 8 rows).",
      "Create one counter for each distinct tracking need, do not try to track everything with a single counter.",
      "Name each counter descriptively (\"Body Rows,\" \"Decrease Rows,\" \"Pattern Repeat\") before starting.",
      "Tap or click the appropriate counter at the end of each relevant row or round. A reminder can be attached to one exact count on the first counter; it does not generate a repeating schedule."
    ],
    fiberNotes: "The counter does not calculate fiber behavior. If a count is wrong, decide whether and how to undo work using the pattern, yarn care instructions, and the condition of the actual fabric rather than a generic fiber rule.",
    practiceProject: "Work a simple lace baby blanket pattern (any 8-row repeat lace) using DK weight yarn, setting up three counters: one for total rows, one for the row position within the lace repeat (1-8), and one for reminder rows when the lace chart resets. This practice establishes the habit of accurate tracking without the consequences of a garment.",
    introduction: {
      title: "Why You Need a Digital Stitch and Row Counter",
      paragraphs: [
        "A counter can help record where you are in a pattern after an interruption. It does not verify that a row was worked correctly, and a missed tap can make its total wrong.",
        "Separate counters can be useful for total rows, repeats, and shaping intervals. Compare the displayed counts with the written pattern and keep a separate checkpoint when losing the count would matter.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch and Row Counter?",
      paragraphs: [
        "A stitch and row counter is a tracking tool that records your current position within a knitting or crochet pattern. Unlike physical barrel counters that click one number at a time, a digital counter can track multiple counts simultaneously, total rows, pattern repeat position, and shaping intervals all at once.",
        "The tool attempts to store its state in the current browser profile. It does not sync to other browsers or devices, and the saved state can be unavailable or lost when local storage is blocked, cleared, or reset.",
      ],
    },
    howCalculated: {
      title: "How Stitch Counting Works",
      paragraphs: [
        "The stitch counter is a manual tracking and reminder tool, not a pattern verifier. Its display reflects the taps you record; it cannot establish that the fabric and pattern are at that same position.",
        "For example, suppose your pattern says work 12 rows even in stockinette, then decrease one stitch each side every other row for 8 rows. Set the counter to zero at the start of the section and note that row 12 triggers the first decrease. Rows 12, 14, 16, 18, 20, 22, 24, and 26 are all decrease rows.",
        "Recording selected milestones before you begin can turn part of a written instruction into a numerical checkpoint. Only an explicitly configured reminder can display its note at an exact count; ordinary counter taps do not interpret the pattern.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch & Row Counter",
      paragraphs: [
        "Tap the plus button to add a new counter. You can run multiple counters simultaneously, one for row count, one for pattern repeat tracking, one for increase intervals, or any other count you need to track. Name each counter before you start so you can tell them at a glance. Tap the counter to increment by one, or use the minus button to correct mistakes.",
        "A reminder is checked only when the first counter reaches its exact configured count. It does not repeat at an interval or attach independently to the other counters. Once the page is loaded, counter interactions happen in the browser, but a later restore depends on that browser profile's local-storage availability."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each counter displays an independent running total. The current browser attempts to save those totals locally, but a successful future restore is not guaranteed. A typical setup might use separate counters for total rows, shaping intervals, and pattern repeats.",
        "A row reminder is tied to one exact count on the first counter. Reaching that count can open its note; the tool does not automatically create later reminders at the same interval."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Name your counters descriptively before starting, \"Body Rows,\" \"Sleeve Inc,\" \"Cable Repeat\", so you do not confuse them when you pick up your project after a break.",
        "Use a dedicated counter for stitch marker positions if you tend to lose track of which marker you are at in a complex pattern.",
        "The current browser attempts a local save. Keep a separate checkpoint because browser storage can be unavailable or cleared and does not sync to another device.",
        "The reset control on one counter is recorded as one undoable count change. The Settings action that resets all counters clears the undo and redo history, so record important totals elsewhere first."
      ],
    },
  },

  "blanket-calculator": {
    commonMistakes: [
      "Forgetting to account for overhang on bed blankets. A queen mattress is 60 inches wide, but a blanket without drape looks skimpy. Standard drape is 10–15 inches on each side; leaving it out produces a blanket 20–30 inches too narrow for proper coverage.",
      "Using row gauge instead of stitch gauge to calculate blanket width. Width is determined by the number of stitches cast on (stitch gauge × width), not by row gauge. Using row gauge here produces a completely wrong starting stitch count.",
      "Calculating yardage for a single stitch pattern when the blanket uses multiple sections or a border. A granny square blanket or sampler with different stitch patterns in different sections cannot use a single consumption rate.",
    ],
    projectExample: "A crocheter plans an 84 × 100-inch blanket and makes a 4 × 4-inch swatch in the actual stitch pattern. The calculator uses the swatch's measured gram weight and the yarn label's yards per skein to scale yarn use to the finished area, then adds the displayed 10% planning buffer.",
    useCases: [
      "Planning a bed blanket that actually fits with proper drape, the calculator handles mattress dimensions, custom overhang, and stitch counts together.",
      "Estimating total yarn cost before purchasing. If you know yardage and price per skein, you can calculate budget before committing.",
      "Determining stitch counts that work with your chosen stitch pattern, verify that your width divides evenly into your pattern repeat before casting on.",
    ],
    introduction: {
      title: "Why You Need a Blanket Size Calculator",
      paragraphs: [
        "Blanket sizing involves much more than simply measuring width and height. A proper bed blanket needs mattress overhang on three sides, optional pillow tuck allowance, and a stitch count that works with your pattern repeat. Getting any of these wrong means a blanket that looks skimpy or hangs unevenly.",
        "Whether you are making a baby blanket, a lap throw, or a king-size bedspread, precise dimensions from the start save you from running out of yarn three-quarters through or finishing a blanket that does not actually cover the bed. This calculator handles all the math in one step.",
      ],
    },
    whatIs: {
      title: "What Is Blanket Size Calculation?",
      paragraphs: [
        "Blanket size calculation determines the finished fabric dimensions, stitch count, row count, and total yarn requirements for any blanket project. It accounts for mattress dimensions, desired overhang on each side, pillow tuck depth, and your personal gauge to produce exact numbers for casting on.",
        "Standard mattress sizes vary by country, and the ideal overhang depends on whether the blanket is decorative or functional. A bedspread typically needs 12 to 15 inches of drop on each side, while a coverlet needs only 8 to 10 inches. The calculator lets you customize these values precisely.",
        "Beyond dimensions, the calculator converts your target size into stitch and row counts using your gauge, then estimates total yardage so you can purchase all your yarn from the same dye lot. This end-to-end planning prevents the mid-project panic of discovering you need ten more skeins.",
      ],
    },
    howCalculated: {
      title: "How Blanket Dimensions Are Calculated",
      paragraphs: [
        "The calculation starts with mattress dimensions and adds overhang and tuck allowances. For a queen bed measuring 60 by 80 inches with 10 inches of overhang on each side, the finished blanket needs to be 80 inches wide and 90 inches long, 60 plus 10 on each side for width, 80 plus 10 for the foot.",
        "Next, multiply by your gauge to get stitch and row counts. At a gauge of 4 stitches per inch, an 80-inch width requires 320 stitches to cast on. At 5 rows per inch, 90 inches of length means 450 rows of knitting. These numbers let you verify that your pattern repeat divides evenly into the stitch count.",
        "Finally, divide the finished area by the measured swatch area and multiply by the grams used in that swatch. The calculator adds a visible 10% planning buffer, then converts grams to yarn length and whole skeins using the length and weight printed on the yarn label.",
      ],
    },
    howToUse: {
      title: "How to Use the Blanket Size Calculator",
      paragraphs: [
        "Select a blanket size preset or enter custom dimensions. Enter stitch and row gauge for cast-on and row counts. For yarn and skeins, enter the swatch dimensions, grams used, and the length and weight printed on the yarn label.",
        "The stitch count and row count are derived from your gauge multiplied by the blanket dimensions. If your gauge is 4 stitches per inch and the blanket is 50 inches wide, the calculator returns a 200-stitch cast-on. Yarn use is calculated separately from your measured swatch consumption."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The stitch and row counts are only as accurate as your gauge input. If your actual working gauge differs from what you entered, even by a quarter stitch per inch, the finished blanket dimensions will be off. For a 60-inch-wide blanket, a 0.25 st/in error produces a blanket that is 3-4 inches wider or narrower than intended. Swatch accurately.",
        "The yarn estimate includes a visible 10% planning buffer. If you are adding fringe, a border in a different stitch, seams, or embellishments, measure or budget those components separately. The estimate assumes the measured swatch represents the main blanket fabric."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Add 10-20% extra yarn beyond the estimate if you plan to add seams, fringe, tassels, or a crocheted border around a knit blanket.",
        "Baby blankets knit fastest in bulky or super-bulky yarn. A worsted-weight baby blanket is a 20+ hour project. A super-bulky version finishes in 6-8 hours.",
        "Queen and king size blankets in worsted weight require 2,000 to 4,000+ yards. Plan your budget and storage before committing, that is 15 to 30 skeins of yarn.",
        "For afghans made of joined squares, calculate yardage per square, then multiply by the number of squares plus 10% for joining."
      ],
    },
  },

  "increase-decrease-calculator": {
    skillLevel: "Intermediate",
    techniqueEffect: "The calculator verifies one narrow arithmetic contract: non-overlapping KFB or two-in-one single-crochet increases, or K2tog and SC2tog decreases, consume the entered starting count and produce the entered target after one row or round. It does not predict fit, lean, holes, edge shape, motif alignment, tension, or finished appearance.",
    techniqueSteps: [
      "Determine your starting stitch count (current stitches on needle) and target stitch count (desired final width).",
      "Calculate the difference between starting and target counts, this is the total number of stitches to increase or decrease.",
      "Choose increase or decrease mode and whether the single pass is a flat row or an in-the-round reference.",
      "For increases, subtract one consumed source stitch per change before distributing unchanged stitches. For decreases, subtract two consumed source stitches per change.",
      "Reject requests that cannot be represented by non-overlapping one-to-two increases or two-to-one decreases; use a pattern-specific multi-row plan instead."
    ],
    fiberNotes: "The appearance and durability of shaping depend on the actual yarn, stitch pattern, tension, change method, and treatment. Do not assign behavior from a broad fiber category. Work a representative swatch and follow the pattern and product care instructions.",
    practiceProject: "For a simple arithmetic check, start with 40 stitches and set a target of 30 stitches. The difference is 10 stitches, so distributing 10 single-stitch decreases leaves 30 stitches. Follow the selected pattern for the decrease method, placement, edge stitches, and whether changes are worked singly or in pairs.",
    introduction: {
      title: "Why You Need an Increase and Decrease Calculator",
      paragraphs: [
        "A request such as \"increase 12 stitches evenly across the next row\" still needs source-stitch accounting. Each modeled increase consumes one existing stitch and produces two; each modeled decrease consumes two and produces one.",
        "This calculator distributes the remaining unchanged source stitches across those change events and verifies the start and target totals. Your pattern still determines the method, lean, edge treatment, and visual placement.",
      ],
    },
    whatIs: {
      title: "What Is Even Stitch Distribution?",
      paragraphs: [
        "In this tool, distribution means assigning counts of unchanged source stitches before each modeled change event so those counts differ by no more than one.",
        "The result is a count-conserving one-row or one-round reference. It is not a garment-shaping, fit, or fabric-appearance model.",
        "When the unchanged stitches do not divide evenly, the helper spreads the remainder through the sequence while keeping every source stitch accounted for.",
      ],
    },
    howCalculated: {
      title: "How Stitch Distribution Is Calculated",
      paragraphs: [
        "For 84 to 96 stitches, 12 KFB increases consume 12 source stitches. The remaining 72 source stitches divide into 12 groups of six, so repeating K6, KFB consumes 84 stitches and produces 96.",
        "For 84 to 72 stitches, 12 K2tog decreases consume 24 source stitches. The remaining 60 source stitches divide into 12 groups of five, so repeating K5, K2tog consumes 84 stitches and produces 72.",
        "If a remainder exists, group sizes differ by at most one. The helper checks both the total source stitches consumed and target stitches produced before returning instructions.",
      ],
    },
    howToUse: {
      title: "How to Use the Increase & Decrease Calculator",
      paragraphs: [
        "Choose increase or decrease mode, then choose a flat row or in-the-round reference. Enter safe whole-number starting and target counts from 1 to 4,096.",
        "The selected direction must agree with the counts. Increase mode cannot produce more than twice the start in one pass, and decrease mode cannot remove more than half the start with non-overlapping pairwise decreases.",
        "Use the displayed knitting or single-crochet instruction only if its modeled change matches your pattern. This tool does not distribute changes across multiple rows or rounds."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "For a flat row, spacing values cover both edge gaps and every inter-change gap. For a round, they cover the circular gaps before changes. A difference of at most one is numerical balance, not a promise about visual symmetry.",
        "Flat-row and in-the-round modes change the written starting reference. They do not infer right-side rows, edge stitches, marker placement, plain rounds, or a multi-row schedule."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use the increase or decrease method specified by the pattern when it differs from KFB, K2tog, or the displayed single-crochet examples.",
        "Treat edge stitches, paired leans, markers, and motif repeats as pattern constraints outside this calculator.",
        "Verify the finished row or round count before continuing to the next instruction.",
        "For changes spanning multiple rows or rounds, use a tested construction-specific schedule rather than repeating this one-pass result automatically."
      ],
    },
  },

  "stripe-generator": {
    designPrinciples: "The generator produces a bounded list of palette identifiers and whole row counts. Random and fixed-row modes use a deterministic seed and relative color weights while excluding an immediate color repeat. Palette-sequence mode follows palette order and deliberately ignores weights and the seed. No mode calculates yarn use or aesthetic quality.",
    patternVariations: [
      "Gradient fade variation, arrange colors from light to dark across the stripe sequence to create a subtle ombré effect where colors transition smoothly rather than appearing in distinct blocks, producing an elegant, high-fashion aesthetic.",
      "Bold colorblock variation, use alternating solid colors in equal-width stripes, moving from high-contrast color pairs (black and white, navy and cream) for maximum visual impact, ideal for modern blankets and bags.",
      "Seeded weighted variation, compare repeatable sequences while remembering that relative weights influence selection frequency but do not represent measured yardage."
    ],
    introduction: {
      title: "Why You Need a Stripe Pattern Generator",
      paragraphs: [
        "Planning stripes by hand means sketching color sequences, erasing, and hoping the proportions look right once you actually start knitting or crocheting. What seems balanced on paper often reads differently in yarn, and by the time you realize a stripe is too wide or too narrow, you have already committed rows of work.",
        "This tool can create a repeatable candidate sequence from two to twelve entered colors. It does not know how much yarn you have or whether the generated order suits the project.",
      ],
    },
    whatIs: {
      title: "What Is a Stripe Pattern Generator?",
      paragraphs: [
        "A stripe pattern generator creates a row-sequence reference from entered palette colors and bounded row rules. The output includes total rows and each color's share of those rows, not yarn length or a purchase quantity.",
        "Random-width mode chooses an inclusive whole row count between the entered minimum and maximum for each stripe. Fixed-row mode uses one entered width. Both use relative weights and avoid immediate repeated colors.",
        "Palette-sequence mode cycles through colors in their displayed order and uses one fixed row count. Weights and seed do not affect that mode.",
      ],
    },
    howCalculated: {
      title: "How Stripe Sequences Are Generated",
      paragraphs: [
        "The helper validates the selected mode, two to twelve unique color identifiers, one to 200 stripes, and one to 100 rows per stripe before allocating the plan.",
        "In randomized modes, a seeded generator selects among colors other than the previous one. Entered weights are relative among currently eligible colors; they are not percentages and do not force an exact final share.",
        "The row summary adds the generated whole row counts by color. Equal row counts do not establish equal yarn use when row width, stitch construction, tension, shaping, or carried yarn differs.",
      ],
    },
    howToUse: {
      title: "How to Use the Stripe Pattern Generator",
      paragraphs: [
        "Enter two to twelve palette colors and choose random-width, fixed-row, or palette-sequence mode. Complete only the row and weight inputs used by the selected mode.",
        "Generate a bounded plan, review its visual preview and row list, and copy the text if useful. Measure yarn consumption separately from a representative project sample."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The per-color figures are row counts and shares of generated rows only. They are not yardage shares unless a separate measurement establishes equal consumption per row.",
        "A seed makes the randomized plan reproducible for the same validated inputs. It does not make the sequence objectively balanced or suitable."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Follow the pattern and yarn guidance for carrying, cutting, and securing colors; the generator does not model those techniques.",
        "Use relative weights only to influence randomized selection, not as a substitute for measuring the yarn available.",
        "Regenerate with the same seed to reproduce a plan, or change the seed intentionally to compare another candidate.",
        "If purchase accuracy matters, measure per-color use in a representative complete repeat and plan from those measurements."
      ],
    },
    projectIdeas: {
      title: "Project Ideas for Striped Patterns",
      ideas: [
        "Scrappy blanket preview, compare seeded random-width sequences while separately measuring whether the available yarn can support them.",
        "Baby blanket preview, use fixed-row mode to compare a repeating three-color palette order before swatching it.",
        "Striped market-bag preview, use fixed-row mode to arrange narrow stripes, then verify carrying and cutting in the selected pattern.",
        "Palette-order study, compare deterministic sequences without treating row shares as inventory or yardage shares.",
        "Dishcloth sampler set, save different validated seeds or fixed-row plans as visual candidates before committing yarn.",
        "Paired-project planning, reuse the same validated seed and settings when repeatability matters; inventory must be checked separately.",
      ],
    },
  },

  "abbreviation-glossary": {
    chartGuide: "This glossary contains searchable entries for over 100 standard knitting and crochet abbreviations paired with their full stitch names and execution instructions. Each entry shows the abbreviation (such as 'dc' for double crochet), the full stitch name, the complete sequence of movements to execute the stitch, the chart symbol, and any special technique variations. The US/UK toggle switches all entries between American and British terminology, selecting 'UK' remaps every crochet abbreviation, because 'dc' means double crochet in US but single crochet in UK. Categories organize by stitch family (basic stitches, increases, decreases, cables, colorwork, lace) for browsing by type. Each entry shows yarn overs before insertion, loops on hook at each stage, and turning chain counts for crochet stitches.",
    industryStandards: "The Craft Yarn Council (CYC) publishes the official standard abbreviations for North American knitting and crochet patterns, establishing the baseline set used by nearly all commercial US and Canadian patterns. In the UK, similar standards follow British fiber publications. The most significant divergence is UK crochet terminology, which systematically offsets stitch names by one step from the US system, UK 'double crochet' equals US 'single crochet,' UK 'treble' equals US 'double crochet.' This offset dates to early 20th-century pattern-writing traditions where the two countries counted hooks and loops differently. Individual designer shorthand for complex stitch sequences is common in indie patterns and vintage sources, which is why every pattern should include an abbreviation key.",
    manufacturerNote: "Although CYC publishes standard abbreviations, individual designers and publishers sometimes deviate, particularly for complex stitches or specialty techniques. Vintage patterns from the mid-20th century often use abbreviations since redefined, 'yo' (yarn over) once appeared as '* yo' with an asterisk in some older sources. Regional knitting styles also create variations, continental European patterns sometimes use completely different shorthand than UK or US sources. Some abbreviations appear in one craft but not the other, or mean different things in each, 'sl st' (slip stitch) is executed completely differently in knitting versus crochet. Published pattern abbreviation keys should always be your primary reference.",
    introduction: {
      title: "Why You Need an Abbreviation & Stitch Glossary",
      paragraphs: [
        "Halfway through a vintage pattern, you hit \u201csl1-k2tog-psso\u201d and freeze, what does that mean? Knitting and crochet patterns rely on over a hundred standard abbreviations, and designers sometimes invent their own. Without a reliable reference, one misread abbreviation can derail an entire project.",
        "The confusion doubles when you cross the Atlantic. UK and US crochet terminology uses the same words for completely different stitches, so a British pattern calling for double crochet produces a fundamentally different fabric than the American stitch of the same name. A searchable glossary with a US/UK toggle eliminates this guesswork entirely.",
      ],
    },
    whatIs: {
      title: "What Is an Abbreviation & Stitch Glossary?",
      paragraphs: [
        "An abbreviation glossary is a searchable database of knitting and crochet abbreviations paired with their full names, definitions, and step-by-step execution instructions. It covers standard abbreviations published by the Craft Yarn Council as well as widely used designer shorthand for cables, colorwork, and lace.",
        "The US/UK toggle switches the entire glossary between American and British terminology. Each entry shows the equivalent abbreviation in the other system when one exists, making it possible to work confidently from patterns published in either country.",
        "The pattern translator feature goes further, paste a full instruction line and the glossary expands every abbreviation into plain language. This is especially useful for complex stitch sequences where multiple abbreviations stack together in a single instruction.",
      ],
    },
    howCalculated: {
      title: "How UK/US Term Conversion Works",
      paragraphs: [
        "The UK/US conversion is not random, it follows a systematic offset. Every UK crochet term is one step higher than its US equivalent. UK double crochet equals US single crochet. UK treble equals US double crochet. UK double treble equals US treble. The entire naming ladder shifts by one rung.",
        "This offset exists because UK terminology counts the loops on the hook, while US terminology counts the yarn overs before insertion. A US single crochet has zero yarn overs before inserting; the UK calls it double crochet because there are two loops on the hook after pulling up. Understanding this logic makes the entire conversion table predictable rather than something to memorize.",
      ],
    },
    howToUse: {
      title: "How to Use the Abbreviation & Stitch Glossary",
      paragraphs: [
        "Type any abbreviation into the search field to find its full name, description, and step-by-step execution. The glossary covers both knitting and crochet abbreviations. Use the US/UK toggle to switch between American and British terminology, the glossary shows the equivalent abbreviation in the other system when one exists.",
        "Each entry includes a written description of how to work the stitch, the stitch symbol used in charts, and for common stitches, a step-by-step diagram. Browse by category (increases, decreases, basic stitches, cables, colorwork) or search directly."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The US/UK toggle shows the equivalent term in the other system. \"dc\" in US crochet means double crochet (yarn over, insert hook, pull up loop, yarn over, pull through two, yarn over, pull through two). \"dc\" in UK crochet means what Americans call single crochet, a completely different stitch. The toggle makes this distinction explicit so you can work from any pattern regardless of its country of origin.",
        "Some abbreviations have no direct equivalent in the other system and are flagged as such. Proprietary stitch abbreviations invented by individual designers are not included, those are defined within the pattern itself."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always check the abbreviation key printed in your specific pattern before relying on the glossary. Some designers define custom abbreviations or use standard abbreviations in non-standard ways.",
        "UK and US crochet terms are completely different for the same stitch. UK double crochet = US single crochet. UK treble = US double crochet. This single fact causes more pattern confusion than any other.",
        "When an abbreviation is ambiguous and you cannot find a pattern key, look at the stitch count for the row. The stitch count tells you what the abbreviation must mean in context.",
        "Save or bookmark the specific entries you need for your current project so you can reference them quickly without searching each time."
      ],
    },
  },

  "spinning-ratio-calculator": {
    skillLevel: "Beginner",
    techniqueEffect: "A measured pulley ratio documents one part of a spinning-wheel setup. It can help you compare compatible pulley choices on the same wheel, but it does not by itself predict finished yarn.",
    techniqueSteps: [
      "Use the wheel manual to identify the pulley connected to the drive wheel and confirm that the setup is compatible.",
      "Use maker-published ratios or measure both effective drive-band paths in the same unit, not the outside flanges.",
      "Divide the effective drive-wheel band-path diameter by the effective connected-pulley band-path diameter.",
      "Record the complete setup and compare finished yarn samples before scaling up."
    ],
    fiberNotes: "Fiber preparation, staple, drafting, take-up, operation, and finishing all affect a yarn sample. The calculator intentionally does not infer settings from a generic fiber name.",
    practiceProject: "Choose two manufacturer-approved pulley settings on one wheel. Record each measured ratio and the rest of the setup, make a small sample at each setting, finish both samples the same way, and compare the results.",
    introduction: {
      title: "Why Measure a Spinning Wheel Ratio?",
      paragraphs: [
        "The ideal geometric ratio is a useful way to document the relationship between a drive wheel and its connected pulley.",
        "It is one setup measurement, not a complete yarn specification. Reproducible sampling also requires recording how the wheel was configured and operated.",
      ],
    },
    whatIs: {
      title: "What Is a Spinning Wheel Ratio?",
      paragraphs: [
        "For this calculator, the drive ratio is the effective drive-wheel band-path diameter divided by the effective band-path diameter of the connected pulley groove.",
        "The driven component depends on the wheel design. Consult the wheel manual before describing the result as flyer or bobbin rotations.",
        "A smaller connected pulley raises the geometric ratio; a larger connected pulley lowers it.",
      ],
    },
    howCalculated: {
      title: "How Spinning Ratios Are Calculated",
      paragraphs: [
        "The formula is effective drive-wheel band-path diameter divided by effective connected-pulley band-path diameter. Values of 22 and 2.5 produce an ideal geometric ratio of 8.8 to 1.",
        "That result means about 8.8 driven-component rotations per full drive-wheel revolution in the simplified model.",
        "Maker-published ratios are preferable because outside or flange diameters can differ from the effective band path. Actual behavior can also vary with drive-band condition, tension, slip, and setup.",
      ],
    },
    howToUse: {
      title: "How to Use the Spinning Wheel Ratio Calculator",
      paragraphs: [
        "Enter maker-documented effective diameters, or measure both drive-band contact paths in the same unit. The calculator returns their approximate geometric ratio.",
        "Use your wheel manual to identify the driven component and compatible settings, particularly for bobbin-led or double-drive systems."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The displayed ratio is an ideal geometric estimate for the measured pulley pair.",
        "It does not determine twists per inch, yarn weight, strength, drafting speed, take-up, or plying balance. Evaluate a finished sample instead of assigning those properties from the ratio."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Prefer published ratios or effective diameters; do not use an outer flange when it differs from the drive-band contact path.",
        "Use only pulley or whorl combinations that the wheel manufacturer identifies as compatible.",
        "Label the output as the driven component unless the manual establishes whether the pulley drives the flyer or bobbin.",
        "Record and finish a small yarn sample before committing valuable fiber to a full project."
      ],
    },
  },

  "stitch-pattern-calculator": {
    designPrinciples: "Each entered constraint means pattern stitches equal the multiple times a positive whole repeat count plus the entered plus value. The solver combines those modular constraints without scanning an LCM-sized range, rejects incompatible offsets, and adds the entered edge count once on each side. Arithmetic compatibility does not validate the source pattern or construction.",
    patternVariations: [
      "Modular panel variation, crochet or knit multiple rectangular panels using different stitch patterns that all share the same stitch multiple, then seam them together edge-to-edge with no transition rows needed.",
      "Border transition variation, use one stitch pattern for the main body and a different pattern for a border, calculating a stitch count where the body pattern divides evenly and the border pattern also divides evenly at the join line.",
      "Central motif variation, work a centered focal pattern (cable, lace, or colorwork) and surround it with a simple filler pattern (stockinette, garter, or single crochet) that can accommodate any stitch count."
    ],
    answerCapsule: "This bounded calculator returns whole totals that satisfy up to eight entered multiple-plus constraints within a selected range. Results are arithmetic references only; verify the pattern, gauge, edges, construction, and fit separately.",
    internalLinks: [
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Compare measured gauge and proportional count arithmetic" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Check yarn weight compatibility for your project" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Find the right hook or needle size for your yarn" },
    ],
    introduction: {
      title: "Why You Need a Stitch Pattern Calculator",
      paragraphs: [
        "When two instructions state different multiple-plus constraints, a total may satisfy both, or their offsets may be mathematically incompatible. That arithmetic can be checked before swatching.",
        "A shared total alone does not prove that panels, borders, yokes, or transitions can be combined. Row repeats, edge instructions, shaping, construction, and gauge remain separate constraints.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch Pattern Calculator?",
      paragraphs: [
        "The calculator solves one or more equations of the form count = multiple × whole repeats + plus. It requires at least one full repeat for every entered pattern.",
        "The plus value is whatever extra count the source instruction states; the tool does not infer whether those stitches are edges, balancing stitches, or part of another construction. A separate edge field is explicitly per side and is added twice.",
        "Compatible constraints repeat at the displayed combined spacing. The solver returns at most the first 500 totals inside the bounded manual or gauge-derived range.",
      ],
    },
    howCalculated: {
      title: "How Stitch Compatibility Is Calculated",
      paragraphs: [
        "For multiple of 4 plus 1 and multiple of 6 plus 3, compatible pattern-stitch counts include 9, 21, 33, and 45. Their shared spacing is 12 stitches.",
        "By contrast, multiple of 2 plus 0 and multiple of 4 plus 1 cannot share a total because their remainders conflict. The solver reports that conflict instead of proposing an adjustment.",
        "The bounded congruence solver rejects a combined spacing above one billion before enumerating results. It also limits input multiples, plus values, result range, patterns, and displayed matches.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch Pattern Calculator",
      paragraphs: [
        "Copy the multiple and plus value from the source instruction into separate whole-number fields. Do not move the source plus value into the per-side edge field.",
        "Choose a bounded stitch-count range or derive one from measured gauge, target width, and tolerance. Zero tolerance remains exact and may contain no whole stitch count."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A returned total satisfies every entered congruence after subtracting twice the per-side edge allowance, and includes at least one full repeat for each pattern.",
        "The displayed combined spacing describes arithmetic recurrence only. It does not prove that the entered pattern details, row repeats, gauge, edges, or construction work together."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Verify every multiple and plus value against the exact source instruction before trusting the arithmetic.",
        "Use the per-side edge field only for additional stitches outside all entered repeat constraints.",
        "A listed preset is editable reference data, not proof that a particular published pattern uses those values.",
        "Swatch and follow the designer's construction, row-repeat, edge, and shaping instructions before casting on the project."
      ],
    },
    projectIdeas: {
      title: "Project Ideas Using the Stitch Pattern Calculator",
      ideas: [
        "Sampler blanket, combine 5–8 stitch panels (seed stitch, waffle, shell, chevron, moss) by entering all their multiples to find a single compatible cast-on count that works for every section.",
        "Cable panel sweater yoke, use the calculator to find a stitch count that accommodates both your cable repeat and the body's stockinette multiple before casting on.",
        "Striped stitch dishcloth set, pick two complementary stitch patterns and find compatible counts for a set of matching dishcloths with different texture in each half.",
        "Modular scarf, calculate compatible stitch counts across three different lace or texture patterns so each section transitions cleanly without a visible count adjustment row.",
        "Textured pillow cover, combine a cable panel (multiple of 8) with a seed stitch border (any count) using the calculator to find an exact cast-on that balances both elements.",
      ],
    },
  },

  "stitch-quick-reference": {
    chartGuide: "This visual reference breaks down every foundational knitting and crochet stitch into step-by-step mechanical movements. Each stitch card shows the action sequence: where to insert the needle or hook, when to wrap yarn, how many loops remain at each stage, and the final stitch appearance. For crochet stitches, each card marks the starting chain height, each yarn over point, loops on hook at every stage, and the turning chain requirement. For knitting stitches, the cards show whether the stitch is worked through the front or back loop, whether new loops are created or existing ones manipulated, and the resulting column appearance in stockinette. Cards are organized by stitch family, single crochet progresses logically to half-double crochet and double crochet, showing how each additional yarn over adds height.",
    industryStandards: "Stitch construction standards are maintained by craft organizations including the Craft Yarn Council and long-standing knitting and crochet publishers. The fundamental stitch definitions have remained virtually unchanged for over a century, single crochet, double crochet, and treble crochet are worked identically today as they were in 1920s instructions. These definitions are grounded in yarn mechanics: each yarn over added before hook insertion increases stitch height by a predictable amount based on how loops interact. Lace and specialty stitches (puff, popcorn, bobble) are less standardized and often have multiple accepted variations; established stitch dictionaries like Barbara Walker's provide authoritative definitions for knitting.",
    manufacturerNote: "In practice, individual knitting and crochet execution varies subtly between crafters even when following the same mechanical instruction, leading to minor gauge differences. A 'tight' crochet tension produces denser, stiffer fabric than 'loose' tension with identical stitches. Yarn texture affects how clearly stitch structure shows, fuzzy novelty yarns obscure stitch definition that would be obvious in smooth worsted. Some crocheters work tighter in the foundation chain than subsequent rows, creating visible width changes the stitch definition doesn't account for. Left-handed crafters work mirror-image movements that sometimes create subtle differences in how stitches sit. The reference shows standard execution, but your personal gauge and yarn choices will produce slightly different results.",
    introduction: {
      title: "Why You Need a Stitch Quick Reference",
      paragraphs: [
        "Mid-row you forget: does a half double crochet yarn over before or after inserting the hook? Do you pull through two loops or three? A moment of doubt leads to frogging if you guess wrong. A quick visual reference that shows the exact loop sequence saves time, yarn, and frustration every session.",
        "Even experienced crafters with decades of muscle memory occasionally switch between techniques and need a refresher. Moving from knitting to crochet, or from basic stitches to specialty ones like the puff stitch or cable cross, means recalling precise movements that differ by a single yarn over or loop count.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch Quick Reference?",
      paragraphs: [
        "A stitch quick reference is a visual step-by-step breakdown of every basic knitting and crochet stitch. Each entry shows the yarn over count, loop count on the hook or needle at each stage, turning chain height for crochet stitches, and the completed stitch anatomy.",
        "The reference covers foundation stitches, basic stitches from chain through treble, increases, decreases, and common specialty stitches. Each card is designed as a memory aid, compact enough to glance at mid-row without losing your place in the pattern.",
        "Stitch anatomy diagrams show where each part of the stitch sits: the post, the top loops, the back bump, and the turning chain. Understanding these components helps you identify where to insert your hook or needle for variations like back loop only, front post, or linked stitches.",
      ],
    },
    howCalculated: {
      title: "How Stitch Anatomy Is Determined",
      paragraphs: [
        "Stitch construction is not calculated mathematically, it is determined by the sequence of yarn overs and pull-throughs that define each stitch. Consider the double crochet: yarn over, insert hook, yarn over and pull up a loop (3 loops on hook), yarn over and pull through 2 (2 loops remain), yarn over and pull through 2 (stitch complete). That is 4 total yarn overs from start to finish.",
        "Each additional yarn over before insertion adds height to the stitch. Single crochet has zero yarn overs before inserting. Half double crochet has one. Double crochet has one. Treble crochet has two. This progression creates the predictable height ladder that determines turning chain counts and stitch gauge.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch Quick Reference",
      paragraphs: [
        "Browse stitch cards by category, basic stitches, increases, decreases, textured stitches, and specialty stitches. Each card shows a step-by-step visual breakdown of the stitch movement: where to insert, how to wrap, which loops to pull through, and the resulting loop count on your hook or needle after each step.",
        "The yarn over and loop count indicators on each card show exactly what should be on your needle or hook at each stage. This is especially helpful for complex stitches like the puff stitch, bobble, or cable cross, where keeping track of loops mid-stitch is critical."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each stitch card shows the mechanical movement sequence for one stitch execution. The cards are designed as a quick memory aid, enough to reconstruct a stitch you have done before but temporarily forgotten. They are not a substitute for learning the stitch from a video or instructor for the first time.",
        "The turning chain information on crochet stitch cards tells you how many chain stitches to work at the beginning of a row for that stitch height. Turning chain counts vary slightly between patterns, the reference shows the standard count, but your pattern may specify differently."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Bookmark the specific stitch card you are working with before starting a session. Mid-row is not the time to be scrolling through a full reference.",
        "Slip stitch in crochet is not the same movement as slip stitch in knitting. The reference distinguishes between them, make sure you are looking at the correct craft.",
        "For Tunisian crochet stitches, the forward pass and return pass are shown as separate steps. Work through the forward pass completely before starting the return.",
        "If a stitch card shows a movement you cannot replicate, check your hook or needle orientation. Left-handed and right-handed versions of the same stitch mirror each other."
      ],
    },
  },

  "uk-to-us-converter": {
    chartGuide: "This converter replaces only the modern crochet terms, abbreviations, and small set of legacy phrases listed in its map. It matches the longest source token first and performs one replacement pass, so generated output is not converted again. Numbers, punctuation, spacing, and all non-mapped text are preserved.",
    industryStandards: "UK and US crochet terminology can use different names for the same basic stitch. Confirm which convention the designer or publisher states, then compare any replacement with the source abbreviation key and stitch definitions. Publication location alone is not enough to infer a pattern's convention.",
    manufacturerNote: "This is a deterministic terminology aid, not a pattern translator. It does not interpret charts, validate counts or construction, resolve ambiguous abbreviations, or identify an unlabeled source convention. Unsupported and unfamiliar terms remain unchanged for separate verification.",
    introduction: {
      title: "Why You Need a UK to US Crochet Terms Converter",
      paragraphs: [
        "Some common UK and US crochet stitch names refer to different stitch heights. For example, UK double crochet maps to US single crochet, while UK treble crochet maps to US double crochet.",
        "The converter can replace the terms in its explicit map after you have identified the source convention. It deliberately leaves everything else unchanged, so the result still requires comparison with the original pattern and its abbreviation key.",
      ],
    },
    whatIs: {
      title: "What Is UK to US Crochet Term Conversion?",
      paragraphs: [
        "The map contains supported pairs of UK and US crochet terms, including selected abbreviations and legacy phrases. It is not a statement that every possible term follows one universal offset.",
        "The converter accepts a term, row, or longer passage, but only mapped tokens change. A longer input does not turn the output into a complete translation or validated pattern.",
      ],
    },
    howCalculated: {
      title: "How the Conversion Works",
      paragraphs: [
        "The converter sorts supported source tokens by length, matches them without consuming adjacent letters, and replaces all matches in one pass. This prevents a generated replacement such as double crochet from being converted again during the same operation.",
        "As a concrete example, a UK pattern instruction reading 3dc in next st converts to 3sc in next st in US terms. A row reading ch3, 2tr in next st, tr in each st across converts to ch3, 2dc in next st, dc in each st across. The stitch count stays the same, only the names change.",
        "The replacement counter reports mapped token matches. The converter does not flag every ambiguous or historical use, so context in the original source remains essential.",
      ],
    },
    howToUse: {
      title: "How to Use the UK to US Crochet Terms Converter",
      paragraphs: [
        "Type a UK crochet term, abbreviated or full, and the converter returns the US equivalent. You can also paste an entire pattern row, and the converter will replace all UK terms with their US counterparts in one pass. Toggle the direction to convert from US to UK instead.",
        "Review every changed term against the pattern's own key. Leave any unsupported or ambiguous term unchanged until an authoritative source confirms it."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A replacement count of zero means no mapped source token was found; it does not prove that the input already uses the target convention. A positive count means only that mapped tokens were replaced.",
        "Numbers, punctuation, whitespace, and non-mapped words pass through unchanged. Review the source convention, counts, charts, gauge, and construction before using the output."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Record the declared terminology convention with your working copy of the pattern.",
        "UK \"double crochet\" maps to US \"single crochet\" in the included map. Only mapped terms change; do not assume every stitch name follows one universal offset.",
        "Do not infer an ambiguous historical term from stitch count alone; consult the source's definitions, diagrams, or an authoritative reference.",
        "For longer passages, review one instruction at a time and confirm that counts and construction still agree with the source."
      ],
    },
  },

  "circle-calculator": {
    designPrinciples: "This planner applies transparent arithmetic to one selected starting-count preset. For preset p and round r, the ending count is p × r. That count progression does not model the actual stitch dimensions, yarn, hook, tension, joins, or chain convention that determine the fabric's shape.",
    patternVariations: [
      "Use the center start, join, and chain-counting convention stated by the selected pattern.",
      "Pause to compare the real fabric after each round; the included preset may need project-specific adjustment.",
      "Use a tested construction method for hats, bowls, spheres, ovals, and other shaped pieces rather than inferring them from this count schedule."
    ],
    introduction: {
      title: "What the Circle Round Planner Provides",
      paragraphs: [
        "The planner writes a bounded 3-to-30-round schedule from one of four included starting-count presets. Each later round adds the selected preset amount.",
        "It is a count reference, not a finished pattern. It does not accept gauge or diameter and does not guarantee a particular shape or project result.",
      ],
    },
    whatIs: {
      title: "What Is a Selected-Preset Round Schedule?",
      paragraphs: [
        "The included options associate common crochet stitch labels with arithmetic presets of 6, 8, 12, or 16. Those values are starting assumptions, not universal standards.",
        "Each generated repeat consumes every stitch in the previous round exactly once and adds the preset number of stitches. Alternating placement is a counting arrangement, not proof that increases will be visually hidden.",
      ],
    },
    howCalculated: {
      title: "How the Round Schedule Is Calculated",
      paragraphs: [
        "For selected preset p, round 1 ends with p stitches and round r ends with p × r stitches. Every later round therefore adds p stitches.",
        "At round r, each of p repeats consumes r − 1 prior stitches: one stitch receives an increase and r − 2 remain plain. The repeats consume p × (r − 1) stitches, exactly the prior-round count.",
        "The displayed arrangement alternates increase placement as a counting aid. It does not calculate physical curvature or establish a finished diameter.",
      ],
    },
    projectExample: "Choose the single-crochet 6 preset and 6 rounds. The schedule starts with 6 stitches in round 1 and adds 6 stitches per later round, so round 6 ends with 36 stitches. That verifies the selected arithmetic only; compare the actual fabric and selected pattern before continuing.",
    commonMistakes: [
      "The generated increase schedule is a starting plan, not a guarantee that every yarn, hook, and tension combination will lie flat.",
      "A circle that cups or ripples should be checked against the actual fabric before adding rounds; hook size, stitch height, and personal tension can require adjustment.",
      "The selected round count controls the written pattern length, not a fixed finished diameter. Measure the work at your own gauge.",
    ],
    howToUse: {
      title: "How to Use the Round Planner",
      paragraphs: [
        "Choose the preset required by your selected pattern or swatch plan, then choose a supported round limit. Read the ending count and count-preserving arrangement for each round.",
        "Follow the selected pattern for center start, joins, chains, and whether chains count as stitches. Compare the real fabric after each round."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Ending count is the selected preset multiplied by the round number. Preset additions report only the arithmetic increase between consecutive rounds.",
        "The schedule cannot tell whether the actual work is flat, round, the desired diameter, or suitable for a hat, basket, toy, rug, or blanket."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Mark and recount the round boundary using the convention in the selected pattern.",
        "Record whether chains count as stitches before using any generated count.",
        "If the real fabric cups or ripples, pause and compare it with the selected pattern before changing hook size or increase placement.",
        "Use a separate tested construction for non-circular shapes and three-dimensional projects."
      ],
    },
    projectIdeas: {
      title: "Where a Round Count Reference May Help",
      ideas: [
        "Checking the arithmetic in a tested circular motif that uses one of the included presets.",
        "Recording ending counts while swatching a circular construction.",
        "Comparing a written round schedule with the previous count before continuing the project.",
      ],
    },
  },

  "needle-guide": {
    chartGuide: "This guide categorizes finishing and sewing needles by three defining characteristics: tip profile (blunt for passing between fibers, sharp for piercing fabric, or ball-point for knit fabrics), eye size and shape (large round for thick yarns, tiny for beads, elongated for multiple floss strands), and intended materials. Each needle type includes its purpose, available sizes, recommended materials, and tasks it handles poorly. The guide covers tapestry needles (blunt, large eye for yarn ends), chenille needles (sharp, large eye for embellishing), embroidery crewel needles (elongated eye for multiple floss strands), sharps (traditional sewing for woven fabrics), betweens (short for fine close stitching), and beading needles (extremely thin for tiny bead holes). Size numbering is counterintuitive, larger numbers mean smaller needles.",
    industryStandards: "Needle classifications are maintained by sewing and craft supply manufacturers and standards organizations. The blunt/sharp tip distinction originated in the textile industry centuries ago, a blunt tip cannot split yarn plies, while a sharp tip must pierce woven fabric. Eye sizes are standardized by ASTM and ISO standards that define measurements across sizes. The Craft Yarn Council references standard needle types in pattern guidelines, specifying characteristics for specific materials. Tapestry needle standardization comes from historical embroidery and tapestry-making traditions where blunt needles were essential to protect fine decorative yarns.",
    manufacturerNote: "In practice, needle sizing numbers vary between manufacturers, a size 18 tapestry needle from Boye may measure fractionally different from a budget-brand size 18. Needle material affects functionality: bamboo grips yarn better than metal, reducing slippage; wooden needles are gentler on delicate threads but wear faster; metal needles are durable but can damage some fragile fibers. Needle eye filing quality varies enormously, a poorly finished eye can snag and shred delicate thread, while a premium manufacturer's eye glides smoothly. Some 'embroidery needles' and 'crewel needles' are used interchangeably in practice though technically intended for slightly different materials.",
    introduction: {
      title: "Why You Need a Sewing & Craft Needle Guide",
      paragraphs: [
        "You need to weave in ends on a chunky blanket, sew seed beads onto a doily, and finish a cross stitch piece, three projects sitting in your craft basket right now, and each one requires a completely different needle. Grabbing the wrong one means split yarn, broken beads, or damaged fabric.",
        "Needle selection is one of those skills that experienced crafters take for granted but beginners find bewildering. This guide organizes every common needle type by its purpose, tip profile, eye shape, and recommended materials so you can match the right needle to every finishing task.",
      ],
    },
    whatIs: {
      title: "What Is a Craft Needle Guide?",
      paragraphs: [
        "A craft needle guide is a visual reference that categorizes sewing and finishing needles by their design characteristics and intended use. It covers tapestry needles, chenille needles, embroidery crewel needles, sharps, betweens, beading needles, darning needles, and specialty types.",
        "Each needle type is defined by three characteristics: tip profile (blunt, sharp, or ball-point), eye shape and size (round, elongated, or tiny), and intended material (yarn, embroidery floss, sewing thread, or beading thread). These three factors determine which tasks the needle handles well and which it handles poorly.",
      ],
    },
    howCalculated: {
      title: "How to Select the Right Needle",
      paragraphs: [
        "Needle selection is not math-based, it follows a decision tree based on your task and materials. The first question is whether you need to pierce the fabric or pass between existing stitches. Piercing requires a sharp tip. Passing between stitches requires a blunt tip to avoid splitting yarn.",
        "For example, weaving in yarn ends on a knitted or crocheted project calls for a tapestry needle, blunt tip, large eye. Piercing through woven fabric to attach an applique calls for a chenille needle, sharp tip, large eye. Stringing seed beads requires a beading needle, thin, flexible shaft with a tiny eye that fits through bead holes.",
        "Needle sizing runs counterintuitively: larger numbers mean smaller needles. A size 18 tapestry needle has a wider shaft and larger eye than a size 24. Match your needle size to your thread or yarn thickness, the eye should be large enough to thread easily but small enough that the needle does not leave visible holes in the fabric.",
      ],
    },
    howToUse: {
      title: "How to Use the Sewing & Craft Needle Guide",
      paragraphs: [
        "Browse needles by type, tapestry, chenille, embroidery (crewel), sharps, betweens, beading, darning, and specialty needles. Each needle card shows the tip profile (blunt, sharp, or ball-point), eye shape and size, recommended materials, and the tasks it is best suited for.",
        "Use the guide to find the right needle for your finishing task. The difference between a tapestry needle and a chenille needle is the tip, tapestry is blunt, chenille is sharp. Both have large eyes for thick thread or yarn, but you reach for one or the other depending on whether you are weaving through existing stitches or piercing fabric."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The guide organizes needles by what they are designed to do, not by brand or arbitrary numbering. Needle size numbers run in the opposite direction from what you might expect, larger numbers mean smaller needles, just like knitting needle UK sizing. A size 18 tapestry needle is larger than a size 24.",
        "Material recommendations indicate which needle types work best with specific fibers and fabrics. Wool yarn and knitted fabric call for blunt tapestry needles. Woven fabric and cotton thread call for sharps. Beadwork requires specialty beading needles thin enough to pass through seed bead holes."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use tapestry needles (blunt tip) for weaving in ends on knitted and crocheted fabric. Sharp needles split the yarn and create a weak, messy join.",
        "Embroidery needles, also called crewel needles, have elongated eyes designed to hold multiple strands of floss. Use them for surface embroidery, not for weaving in yarn ends.",
        "Size up your needle eye before threading. Forcing thick thread through a too-small eye damages the thread fibers and weakens your stitching.",
        "Bent-tip tapestry needles are not a gimmick. They make weaving in ends on stockinette noticeably faster by following the curve of the stitch."
      ],
    },
  },

  "amigurumi-shapes": {
    designPrinciples: "The generator produces bounded single-crochet count schedules for four basic references. Six-stitch increase or decrease steps keep the arithmetic consistent, but yarn, hook, gauge, placement, joining method, stuffing, and finishing determine the physical result.",
    patternVariations: [
      "Sphere reference: build by six-stitch increase rounds, hold the widest count for one or two rounds, then decrease by six to a six-stitch opening.",
      "Stepped-cone reference: add six stitches on alternating rounds and hold the count on the intervening rounds.",
      "Cylinder and oval references: build either a six-increase circular base or a count-consistent foundation-chain oval before adapting the remaining construction."
    ],
    introduction: {
      title: "What This Basic Shape Generator Provides",
      paragraphs: [
        "Many crocheted forms begin with repeatable count schedules, but a count schedule alone does not define a tested three-dimensional pattern.",
        "This tool keeps the included sphere, stepped-cone, circular-base cylinder, and foundation-chain oval arithmetic bounded and visible so you can swatch and adapt it."
      ],
    },
    whatIs: {
      title: "A Stitch-Count Reference, Not a Finished Pattern",
      paragraphs: [
        "Each option lists single-crochet rounds and stated stitch totals for one basic construction model. It does not choose yarn, hook, gauge, joining method, stuffing, closure, attachments, or safety details.",
        "A mathematically consistent schedule can still produce a different shape in real fabric. Check every round and assess the piece at the materials and tension you intend to use."
      ],
    },
    howCalculated: {
      title: "How the Included Count Schedules Are Built",
      paragraphs: [
        "The sphere builds from six stitches, adds six per increase round, works one center round for an even requested total or two for an odd total, then removes six per decrease round until six remain.",
        "The cone adds six stitches on alternating rounds. The cylinder uses the selected number of six-increase base rounds and then holds that count. The oval starts around both sides of a foundation chain at twice the entered chain count and adds six on each selected expansion round.",
        "Inputs are restricted to the displayed whole-number ranges, and the generator caps its output before creating instruction lines."
      ],
    },
    projectExample: "With 12 total sphere rounds, the reference has six buildup rounds ending at 36 stitches, one even round at 36, and five decrease rounds ending at six stitches. That verifies the count schedule, not the finished diameter or shape.",
    commonMistakes: [
      "Treating the stated count as proof that every written placement works with a chosen joining or spiral method.",
      "Reading total rounds as a physical size without measuring gauge.",
      "Assuming the generated reference includes stuffing, closure, attachment, embroidery, hardware, or child-safety instructions.",
      "Continuing after a real round count differs from the displayed total instead of finding the mismatch."
    ],
    howToUse: {
      title: "How to Use the Reference",
      paragraphs: [
        "Choose a shape and enter only the controls shown for that shape. For a cylinder, base rounds cannot exceed total rounds; the oval uses a starting-chain value and expansion-round count.",
        "Count the completed stitches at every round, record the technique you use, and swatch before incorporating the schedule into a finished design."
      ],
    },
    understandingResults: {
      title: "How to Read the Output",
      paragraphs: [
        "Parentheses show the expected stitch total after that numbered round. A final note identifies where the arithmetic reference stops and which construction decisions remain.",
        "The widest stitch count is not a guaranteed circumference or diameter. Only a measured sample made with the actual materials can connect stitch counts to physical dimensions."
      ],
    },
    proTips: {
      title: "Checks Before Using a Schedule",
      tips: [
        "Mark the start of every round and recount before moving on.",
        "Record whether rounds are joined or continuous because placement wording may need adaptation.",
        "Test stuffing and closure on a sample instead of assuming the open reference includes them.",
        "Use project-specific safety guidance for toys, weighted pieces, hardware, or items intended for children."
      ],
    },
    projectIdeas: {
      title: "Ways to Test the Arithmetic",
      ideas: [
        "Work an unstuffed sphere sample and compare every completed round with the stated count.",
        "Make two stepped-cone samples with different gauges and compare how identical counts produce different dimensions.",
        "Test a cylinder base and an oval start as standalone swatches before designing the sides or closure."
      ],
    },
  },

  "cross-stitch-calculator": {
    skillLevel: "Beginner",
    techniqueEffect: "For dimension arithmetic, effective stitches per inch equal the entered fabric grid count divided by whether each full cross spans one or two grid intervals. Fabric type, coverage, visual appearance, tension, strand count, and finishing are project decisions outside that formula.",
    techniqueSteps: [
      "Determine your pattern dimensions in stitch count (width and height) from the pattern documentation.",
      "Enter the fabric grid count and choose whether each full cross spans one or two intervals.",
      "Divide pattern width and height by the resulting effective stitches per inch.",
      "For a fabric cut, enter a positive per-side margin confirmed for the intended hooping, framing, edge finish, and seller's cut increments."
    ],
    fiberNotes: "The size formula uses only grid count and stitch span, but real fabric construction and treatment can affect measurements and stitching behavior. Confirm the exact fabric, thread, needle, strand count, care process, and finishing requirements with the pattern and product guidance.",
    practiceProject: "Stitch a small test sampler (50 x 50 stitches) on 14-count Aida using a simple design (a small geometric or floral motif). This creates a finished piece about 3.5 x 3.5 inches, giving you experience with the medium without committing to a large project. Repeat the same design on 18-count Aida and compare how the higher count changes the appearance and finished size.",
    introduction: {
      title: "Why You Need a Cross Stitch Size Calculator",
      paragraphs: [
        "A pattern's stitch count becomes a physical size only after you specify the fabric grid count and whether each cross spans one or two intervals.",
        "The calculator keeps that dimension arithmetic, the user-selected fabric margin, and the optional floss-planning assumptions visible instead of treating one generic constant as exact consumption.",
      ],
    },
    whatIs: {
      title: "What Is a Cross Stitch Size Calculator?",
      paragraphs: [
        "A cross stitch size calculator divides pattern stitch dimensions by effective stitches per inch. In this tool, effective count equals fabric count divided by a one- or two-interval stitch span.",
        "Fabric-cut mode adds the positive margin you enter to all four sides. Floss mode models two ideal front diagonals per full cross and then applies the explicit strands, allowance, and skein-label values you enter.",
      ],
    },
    howCalculated: {
      title: "How Cross Stitch Dimensions Are Calculated",
      paragraphs: [
        "On 14-count fabric over one, 140 stitches equal 10 inches. On 28-count fabric over two, the effective count is also 14 stitches per inch, so the same 140 stitches also equal 10 inches.",
        "Fabric cut width equals design width plus twice the entered side margin; height uses the same rule. The tool does not select a universal margin or seller cut size.",
        "For each full cross, the floss model uses two ideal diagonals whose side is one divided by effective count. It scales that front path by full-cross count, working strands, the allowance you enter, and the labeled length and bundle-strand count.",
      ],
    },
    howToUse: {
      title: "How to Use the Cross Stitch Size & Thread Calculator",
      paragraphs: [
        "Enter the fabric's stated grid count, then choose over one or over two. Do not pre-divide an evenweave or linen count before also selecting over two, because that would halve the effective count twice.",
        "Use the size mode for design dimensions, fabric mode for a cut with your confirmed margin, or floss mode for a transparent full-cross planning scenario."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Size and cut results are direct arithmetic from the supplied counts, span, and margin. Check fabric treatment, orientation, finishing needs, and seller increments before buying or cutting.",
        "The floss output excludes partial crosses, backstitch, specialty stitches, tension, cut-length preferences, knots, beads, and remnant loss. Its allowance is your scenario input, not a universal waste rate."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Confirm the per-side cut margin with the intended framing, hooping, and edge-finishing method.",
        "Follow the pattern and thread or fabric guidance for strand count and coverage; the calculator does not select them.",
        "Plan non-full-cross elements separately rather than hiding them inside an unexplained constant.",
        "Compare the floss scenario with the pattern's color-specific requirements and keep useful remnants in mind before rounding a purchase."
      ],
    },
  },

  "weaving-sett-calculator": {
    skillLevel: "Intermediate",
    techniqueEffect: "Sett affects spacing, interlacement, hand, and stability, but no WPI formula can determine a finished cloth by itself. The calculator provides a starting EPI for supported repeat structures, a provisional warp worksheet, and exact arithmetic for supported reed-sleying pairs; sampling remains required.",
    techniqueSteps: [
      "Measure wraps per inch without stretching, overlapping, or packing the yarn.",
      "Choose a supported structure whose repeat counts are defined by the calculator.",
      "Compute starting EPI as WPI multiplied by warp threads in one repeat, divided by interlacements plus warp threads.",
      "Weave and wet-finish a sample, then adjust sett, beat, and allowances from the measured result."
    ],
    fiberNotes: "Fiber, yarn construction, twist, elasticity, abrasion, finishing, desired hand, and loom setup can all change a workable sett. A yarn-category midpoint or measured WPI is only an input to the displayed starting formula, not proof that the resulting cloth or reed choice is suitable.",
    practiceProject: "Measure one yarn's WPI, compare the supported plain-weave and 2/2-twill starting values, then weave and wet-finish small samples. Record the actual EPI, PPI, dimensions, hand, and shrinkage instead of treating either calculated value as final.",
    introduction: {
      title: "Why This Is a Starting-Point Calculator",
      paragraphs: [
        "A measured yarn and repeat structure can support transparent starting arithmetic, but useful sett also depends on the intended cloth and what happens during weaving and finishing.",
        "The tool therefore labels WPI and warp quantities as planning estimates. Only the supported reed-sleying ratio is exact arithmetic, and even that does not establish physical suitability."
      ],
    },
    whatIs: {
      title: "Three Bounded Weaving Worksheets",
      paragraphs: [
        "The sett tab applies one documented repeat formula to the supported plain-weave and 2/2-twill choices. It does not assign universal factors to generic lace, waffle, satin, or other undefined drafts.",
        "The warp tab combines entered dimensions, EPI, loom-waste and sampling lengths, an explicit length allowance, and optional label yardage. The reed tab produces one exact repeating distribution for supported whole-number EPI and reed-dent values."
      ],
    },
    howCalculated: {
      title: "What the Arithmetic Includes",
      paragraphs: [
        "Starting EPI equals WPI × warp threads in one repeat ÷ (interlacements plus warp threads), rounded to a whole end per inch for the displayed starting point.",
        "Total warp ends equal entered width at reed in inches × entered EPI, rounded to a whole end. Length per end adds the entered loom-waste and sampling lengths plus the explicit percentage allowance applied to planned woven length.",
        "The displayed weft quantity is a provisional balanced-cloth estimate that uses EPI as a planning PPI and adds the stated allowance. Measure the actual draft and beat before relying on it for yarn acquisition.",
        "For reed sleying, the whole-number EPI and reed dent are reduced by their greatest common divisor, and the required ends are distributed across the shortest exact repeating dent sequence."
      ],
    },
    howToUse: {
      title: "How to Use the Calculator",
      paragraphs: [
        "Enter measured WPI when possible and select only a structure that matches the modeled repeat. Treat a yarn-weight midpoint as a fallback starting assumption.",
        "For warp planning, enter the actual project dimensions and allowances you intend to use. For reed arithmetic, choose one of the listed reeds and a whole-number target from 1 through 120 EPI.",
        "Sample the yarn, draft, beat, sleying, and finishing before winding a full warp or buying from the displayed quantity."
      ],
    },
    understandingResults: {
      title: "How to Read the Results",
      paragraphs: [
        "Starting EPI is a rounded result from the displayed formula, not an ideal-sett guarantee. Warp and weft quantities are planning estimates based only on the entered assumptions.",
        "A reed sequence with exact arithmetic can still be impractical if yarn does not fit comfortably, abrasion is excessive, uneven groups remain visible, or the cloth changes undesirably after finishing."
      ],
    },
    proTips: {
      title: "Verification Before Committing Yarn",
      tips: [
        "Measure WPI more than once and record how tightly the wraps were placed.",
        "Use the actual draft's repeat counts instead of substituting a generic structure name.",
        "Measure take-up, finishing change, loom waste, and PPI from a representative sample when accuracy matters.",
        "Check yarn fit and reed marks in the proposed denting sequence before winding the full project."
      ],
    },
  },

  "project-cost-calculator": {
    commonMistakes: [
      "Treating the displayed material subtotal as a complete project or business cost. It includes only the yarn and notion amounts you enter; taxes, shipping, fees, reusable tools, overhead, and other costs are absent unless you add them manually as extras.",
      "Reading the time estimate as measured labor. It divides the entered total stitches by the entered stitches per minute and assumes that rate remains constant; it does not time the project or model setup, finishing, corrections, or breaks.",
      "Reading the selling-price remainder as net profit or a pricing recommendation. It is only the entered selling price minus the entered material subtotal and does not subtract fees, taxes, overhead, or a labor charge.",
    ],
    projectExample: "Suppose you enter 3 skeins at $8 each and $6 of notions. The material subtotal is 3 × $8 + $6 = $30. If you also enter 12,000 stitches at 20 stitches per minute, the time estimate is 12,000 ÷ 20 ÷ 60 = 10 hours. With an entered selling price of $100, the displayed amount after materials is $100 − $30 = $70 and the effective hourly remainder is $70 ÷ 10 = $7 per hour. Neither figure includes fees, taxes, overhead, or a labor charge, and neither recommends a selling price.",
    useCases: [
      "Adding the entered skein quantities and per-skein prices to the entered notion or extra amounts.",
      "Estimating project time from an entered stitch count and personal stitches-per-minute assumption.",
      "Comparing an entered selling-price scenario with the entered material subtotal and estimated time, without treating the result as a recommended price or complete profit calculation.",
    ],
    introduction: {
      title: "What This Project Cost Calculator Totals",
      paragraphs: [
        "Enter each yarn quantity and price per skein, then add any notion or extra amounts you choose. The calculator multiplies and sums those entries into a material subtotal.",
        "The optional time section estimates hours from total stitches and an entered stitches-per-minute rate. If you enter a selling price, the calculator subtracts the material subtotal and divides the remainder by estimated hours. It does not add a labor charge or recommend a price.",
      ],
    },
    whatIs: {
      title: "What Does the Result Represent?",
      paragraphs: [
        "The displayed total is the sum of the yarn and notion or extra amounts entered in the form. It is a material subtotal, not a complete accounting of every expense and not materials plus labor.",
        "The optional selling-price outputs are scenario arithmetic. 'Selling price minus entered materials' is the remainder after the displayed material subtotal, and 'hourly remainder after entered materials' divides it by the displayed time estimate. The calculator has no cost-per-use, expected-use, target-rate, tax, fee, or overhead input.",
      ],
    },
    howCalculated: {
      title: "How Project Cost Is Calculated",
      paragraphs: [
        "Yarn subtotal = the sum of each entered skein quantity multiplied by its entered price per skein. Notion subtotal = the sum of the entered notion or extra prices. The displayed total adds those two subtotals.",
        "Estimated hours = entered total stitches ÷ entered stitches per minute ÷ 60. The visible time is labeled approximate and formatted to at most two decimals; the hourly remainder uses the unrounded time estimate. The model assumes one constant stitch rate and excludes work not represented by the stitch count.",
        "When both estimated hours and a selling price are present, amount after materials = selling price − material subtotal, and effective hourly remainder = amount after materials ÷ estimated hours. Those values are not labor cost, net profit, or a fair-price calculation.",
      ],
    },
    howToUse: {
      title: "How to Use the Project Cost Calculator",
      paragraphs: [
        "Enter the quantity and price per skein for each yarn line. Add any one-time notion or extra amounts you want included. The calculator does not decide which expenses belong to the project, so review the entries yourself.",
        "Optionally enter a total stitch count and your own stitches-per-minute assumption. Entering a selling price adds the after-materials and effective-hourly-remainder scenario; there is no hourly-rate, labor-cost, expected-use, or cost-per-use input."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Use the material subtotal to check the arithmetic for the entries currently in the form. Missing or estimated expenses remain missing or estimated; the calculator does not verify receipts, quantities, currency conversion, or whether the list is complete.",
        "Use the time and selling-price outputs only as sensitivity checks for your own inputs. Pricing, taxes, fees, legal requirements, overhead, demand, and compensation decisions are outside this calculator."
      ],
    },
    proTips: {
      title: "Input Checks",
      tips: [
        "Use the same currency for all entries. Selecting a currency changes the displayed symbol; it does not convert amounts or exchange rates.",
        "Enter shipping, taxes, fees, packaging, or other costs as extras only if you want them included in the material subtotal.",
        "Measure your own stitch rate for a representative section if you use the time estimate; setup, finishing, corrections, and breaks require separate treatment.",
        "Keep the entered selling price distinct from a recommended or accepted price. The calculator performs arithmetic on that scenario but does not evaluate the market or business obligations."
      ],
    },
  },

  "color-pooling-calculator": {
    designPrinciples: "The preview repeats the entered whole-stitch color sections continuously across a trial row width. A turned return row consumes the yarn in the same sequence but places its first worked stitch at the right edge; same-direction mode starts every row at the left. This is an idealized grid for comparing inputs, not a physical-yarn or fabric simulation.",
    patternVariations: [
      "Compare the measured repeat width with small positive or negative row adjustments, then test the most promising width in a physical swatch.",
      "Compare turned rows with same-direction rows only when those modes represent the construction you intend to work.",
      "Use the grid to identify sequence placement worth testing; do not label a preview as argyle, plaid, vertical, diagonal, or random until the real fabric demonstrates it."
    ],
    introduction: {
      title: "Why You Need a Color Pooling Calculator",
      paragraphs: [
        "A repeating variegated yarn can place colors differently when row width, tension, stitch, or working direction changes. Comparing an idealized sequence can narrow the widths you decide to swatch.",
        "The calculator does not find a guaranteed pooling count. It shows how your measured whole-stitch color sections would be placed under a bounded set of explicit assumptions.",
      ],
    },
    whatIs: {
      title: "What Is Color Pooling?",
      paragraphs: [
        "Planned pooling is the practice of adjusting stitch placement and tension to seek a deliberate arrangement from a repeating colorway. Real success depends on the actual yarn repeat, stitch construction, setup, turning method, and the worker's consistency.",
        "This preview treats each entered color section as a fixed whole number of stitches. Real color boundaries may land within a stitch or vary from repeat to repeat, so the model cannot establish the finished geometry.",
        "The tool can represent turned flat rows or rows all started from the same side. It does not model working in the round, joins, shaping, foundation or turning chains, or edge treatment.",
      ],
    },
    howCalculated: {
      title: "How Color Pooling Stitch Counts Are Calculated",
      paragraphs: [
        "Measure the intended stitch across a complete color repeat and enter each section's whole-stitch count in yarn order. The helper expands those sections into one bounded repeat of at most 400 worked stitches.",
        "Trial row width equals the measured repeat total plus the entered adjustment. It is not a foundation-chain count because the model consumes no yarn for setup chains, skipped chains, turning chains, joins, or edges.",
        "The helper carries the repeat phase continuously between rows and reverses display placement on turned return rows. It reports the row-to-row phase shift without classifying the resulting grid as a fabric pattern.",
      ],
    },
    howToUse: {
      title: "How to Use the Color Pooling Calculator",
      paragraphs: [
        "Work in the intended stitch, tool size, and tension; count the whole stitches covered by each color through several repeats when possible. Enter two to ten sections in their yarn order.",
        "Choose turned or same-direction rows, enter a row adjustment from minus 20 to plus 20, and preview two to 30 rows. Swatch the resulting worked-stitch width and revise from the real fabric."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The trial width is a count of worked stitches. The displayed phase shift is the remainder when that width is divided by the entered repeat total; row direction then determines visual placement in the grid.",
        "No result is marked as successful pooling or argyle. A physical swatch must show whether the yarn, tension, setup, and selected width produce a usable effect."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure with the exact yarn, stitch, tool, and tension intended for the project.",
        "Measure more than one repeat and record variation rather than forcing partial color boundaries into one integer.",
        "Match the preview's row-direction mode to the real construction and account separately for all setup and edge stitches.",
        "If the real sequence shifts, inspect tension, joins, repeat variation, and setup consumption before changing the trial width."
      ],
    },
    projectIdeas: {
      title: "Project Ideas Using Color Pooling",
      ideas: [
        "A small flat swatch comparing the measured repeat width with one-stitch adjustments.",
        "A turned-row sample that tests whether return-row placement resembles the idealized grid.",
        "A same-direction sample worked by cutting or otherwise restarting yarn only when that construction is appropriate and safely finished.",
        "A scarf or flat panel tested from a representative swatch before committing to full project dimensions."
      ],
    },
  },

  "thread-converter": {
    chartGuide: "This tool searches a bounded table containing DMC, Anchor, and Cosmo fields. It returns the values stored together on an included row for exact-code lookups and literal table-text searches. It does not include Sulky, calculate color distance, infer a nearest color, or prove that threads on one row are physical matches.",
    industryStandards: "Thread manufacturers maintain independent numbering systems. This site's table is an internal reference dataset and is not presented as an official, complete, current, or manufacturer-certified conversion standard. Verify codes, product lines, availability, and substitutions against the actual pattern and manufacturer or retailer information.",
    manufacturerNote: "Screen colors are orientation only and vary with display, lighting, dye lot, finish, and material. Compare physical threads before using a cross-brand row for color-critical work. Unknown and ambiguous codes remain unresolved instead of being guessed.",
    introduction: {
      title: "What This Included-Table Lookup Can Do",
      paragraphs: [
        "Use the tool to find exact codes or literal labels already present in its DMC, Anchor, and Cosmo table, save included rows to a temporary reference palette, or run a bounded batch of exact source-brand codes.",
        "The result is a table lookup, not a measured color match or shopping recommendation. Missing brands and missing rows are outside its coverage."
      ],
    },
    whatIs: {
      title: "A Bounded Cross-Reference Table",
      paragraphs: [
        "Each row stores one DMC field, one Anchor field, one Cosmo field, a table label, and an orientation-only screen swatch. A lookup exposes those stored fields without generating new equivalences.",
        "The same source code can appear on more than one row. In that case the tool marks the result ambiguous so the user can inspect the included rows rather than receiving an invented single answer."
      ],
    },
    howCalculated: {
      title: "How Lookup Results Are Determined",
      paragraphs: [
        "Single search filters the included fields by literal normalized text. Exact batch mode normalizes each input code for the chosen source brand and compares it with the corresponding stored field.",
        "A unique included row is marked found, multiple rows are marked ambiguous, a valid but absent code is marked unknown, and malformed input is marked invalid. No hue, saturation, spectral, or nearest-neighbor calculation is performed.",
        "Batch size and text length are capped before processing so pasted input cannot create an unbounded result."
      ],
    },
    howToUse: {
      title: "How to Use the Lookup",
      paragraphs: [
        "For exploration, search the included table and optionally restrict the field. For a project list, choose DMC, Anchor, or Cosmo as the source and paste exact codes separated by spaces, commas, semicolons, or new lines.",
        "Review every unknown or ambiguous result. The saved palette and copy action retain only included-row references in the current browser session; they do not verify or purchase thread."
      ],
    },
    understandingResults: {
      title: "How to Read a Cross-Reference Row",
      paragraphs: [
        "Values shown across a row mean only that the dataset stores them together. They are not claims of identical dye formula, appearance, product construction, current availability, or manufacturer approval.",
        "A screen swatch cannot establish real-world color. Compare physical samples under relevant lighting and confirm the exact product line before substituting."
      ],
    },
    proTips: {
      title: "Checks Before Substituting Thread",
      tips: [
        "Confirm that the pattern and the physical skein use the same brand and product line as the selected field.",
        "Treat ambiguous and unknown results as unresolved, not as permission to choose a nearby-looking code.",
        "Compare physical samples for large color areas, gradients, skin tones, repairs, or other color-critical work.",
        "Keep a record of the actual skein labels and dye lots used in the project."
      ],
    },
  },

  "wpi-calculator": {
    skillLevel: "Beginner",
    techniqueEffect: "Measuring wraps per inch reveals yarn thickness without requiring expensive tools or experience. The technique creates a standardized measurement that translates directly to the Craft Yarn Council's weight categories, giving mystery yarn a definitive identity. WPI measurement has limits, it measures apparent thickness, not construction or fiber character, but it eliminates the guesswork of needle and hook selection. Once you know a yarn's WPI category, you can reference standard gauge recommendations and select appropriate projects. The technique is non-destructive (you never remove yarn from the ball), quick (under one minute), and requires only a ruler and steady hands.",
    techniqueSteps: [
      "Place a ruler on a flat surface with inches clearly marked.",
      "Starting at the 1-inch mark, wrap the target yarn around the ruler for exactly one inch, keeping wraps side by side without overlapping or gaps.",
      "Count the number of complete wraps within the one-inch space.",
      "Cross-reference the wrap count against the Craft Yarn Council's WPI ranges (Lace 30+, Super Fine 14-30, Sport 12-18, DK 11-15, Worsted 9-12, Bulky 6-9, Super Bulky 5-6, Jumbo 1-4)."
    ],
    fiberNotes: "Wraps per inch measures physical thickness, which varies by fiber, construction, and processing. A tightly twisted wool yarn may have the same WPI as a loosely plied acrylic of different fiber content, the WPI alone does not tell you the full story. Wool tends to compress slightly when wrapped (reducing apparent thickness), while fluffier fibers like mohair appear thicker than their measured WPI. Superwash processing can slightly increase WPI compared to untreated wool. Single-ply yarn of the same WPI as a tightly twisted two-ply will have very different performance and drape once worked into fabric.",
    practiceProject: "Gather 5-10 mystery yarns or leftover skeins without labels. Measure the WPI of each using a ruler, record the results, then look up each in the CYC standard ranges. Create a small swatch with each yarn on a recommended needle size for its category. Compare how similarly (or differently) they knit despite having similar WPI, this reveals the limits of WPI as a sole identifier.",
    introduction: {
      title: "Why You Need a WPI Calculator",
      paragraphs: [
        "You have found a gorgeous skein at a yard sale, inherited a bag of unlabeled yarn from a fellow crafter, or peeled off a ball band only to lose it before starting your project. Now you are holding mystery yarn with no idea what weight it is. Wraps per inch (WPI) is the fastest and most reliable way to identify it.",
        "WPI measurement is a technique every fiber artist should have in their toolkit. It requires nothing more than a ruler and a few seconds of your time, yet it gives you the information you need to select the right needles, hooks, and patterns for any yarn in your stash. This calculator takes your WPI reading and instantly maps it to the Craft Yarn Council weight system with all the details you need to start crafting.",
      ],
    },
    whatIs: {
      title: "What Is Wraps Per Inch?",
      paragraphs: [
        "Wraps per inch is a standardized measurement of yarn thickness. You wrap the yarn around a ruler, dowel, or dedicated WPI tool for exactly one inch, keeping wraps snug and side by side without overlapping or stretching. The number of wraps that fit in that inch tells you the yarn's relative thickness.",
        "Thinner yarns produce more wraps per inch, lace weight yarn wraps 30 or more times in an inch, while jumbo yarn may only wrap 1 to 4 times. The Craft Yarn Council has established WPI ranges for each of the eight standard yarn weight categories (0 through 7), giving crafters a universal reference for identifying unlabeled yarn.",
        "It is important to understand that WPI ranges overlap between adjacent weight categories. A yarn that measures 12 WPI could be a tightly plied sport weight or a loosely spun worsted. This overlap is normal and reflects the natural variation in yarn construction. When your measurement falls in an overlap zone, the only definitive way to confirm the weight is to swatch and compare your stitch count against the standard gauge ranges.",
      ],
    },
    howCalculated: {
      title: "How the WPI Converter Works",
      paragraphs: [
        "The converter uses the Craft Yarn Council's official WPI ranges to map your measurement to one or more yarn weight categories. Each category has a defined WPI range: Lace is 30 and above, Super Fine is 14 to 30, Fine or Sport is 12 to 18, Light or DK is 11 to 15, Medium or Worsted is 9 to 12, Bulky is 6 to 9, Super Bulky is 5 to 6, and Jumbo is 1 to 4.",
        "When your WPI falls within a single category, the converter displays that weight with its corresponding needle sizes, hook sizes, gauge range, typical yardage per 100 grams, and suggested project types. When your WPI falls in an overlap zone, for example, 12 WPI matches both Fine/Sport and Medium/Worsted, the converter shows all matching categories and recommends swatching to confirm which weight best describes your yarn's behavior.",
        "The recommended needle and hook sizes come directly from the Craft Yarn Council's published standards. The yardage estimates are typical values across common fiber types, though actual yardage varies by fiber content, cotton is heavier per yard than wool, and silk is heavier than alpaca.",
      ],
    },
    howToUse: {
      title: "How to Use the WPI Calculator",
      paragraphs: [
        "Start by measuring your yarn. Hold a ruler horizontally and wrap the yarn around it without stretching, pulling, or overlapping. Each wrap should sit snugly against the last, touching but not compressed. Count the wraps in exactly one inch. For the most accurate reading, measure in the middle of the ruler where edge effects are minimal.",
        "For handspun or textured yarn, measure in two or three different spots along the skein and average the results. Handspun thickness can vary, and averaging gives a more representative WPI. For plied yarns, wrap the plied yarn as it comes, do not separate the plies.",
        "Enter your WPI count into the calculator. The tool displays your matching yarn weight category (or categories if you are in an overlap zone) along with recommended needle sizes in US and metric, hook sizes in US letter and metric, the standard gauge range in stitches per 4 inches, typical yardage per 100 grams, and project suggestions suited to that weight.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "If your WPI matches a single weight category, the results are straightforward, use the recommended needle or hook size as a starting point and swatch to confirm your gauge. If you see multiple categories, your yarn sits in an overlap zone and could work as either weight. Swatch with needles for both categories and decide which fabric you prefer.",
        "The yardage per 100 grams is an average across common fibers. Wool and acrylic yarns tend to fall near the typical value, while cotton and linen yarns yield fewer yards per 100 grams due to their higher density. Silk falls in between. Use the yardage estimate as a planning guide, not an exact figure.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Wrap on a smooth surface like a pencil, dowel, or knitting needle rather than a flat ruler, the wraps sit more naturally and give a more accurate count.",
        "Do not push wraps together or spread them apart. The natural resting position of the yarn is what you want to measure.",
        "If your WPI falls right on a boundary (like exactly 9 WPI between worsted and bulky), swatch with both the lighter and heavier weight needle suggestions. The fabric you prefer determines which category to treat the yarn as.",
        "Keep a WPI cheat card in your yarn stash for quick reference at fiber festivals and thrift stores. Knowing your WPI ranges lets you evaluate mystery yarn on the spot.",
      ],
    },
  },

  "c2c-calculator": {
    designPrinciples: "The planner treats a rectangular C2C panel as a grid of measured blocks. It derives block width and height separately from a representative swatch, rounds each requested axis to at least one whole block, and reports blocks wide plus blocks tall minus one diagonal rows. The result is nominal arithmetic and does not model a specific pattern's stitch construction or finishing.",
    patternVariations: [
      "Graphgan pixel art variation, plan a simple image (portrait, landscape, logo) on graph paper with one color per block, creating a digitized version of the desired design with precise visual control.",
      "Solid color with texture variation, crochet each block in the main color but vary the interior stitch pattern (all blocks could use different textures like popcorn stitch or bobbles), creating visual interest within color blocks.",
      "Gradient colorway variation, assign blocks a color based on their position in the grid, creating a smooth transition from one corner's color family through the center to the opposite corner's color family."
    ],
    introduction: {
      title: "Why You Need a C2C Calculator",
      paragraphs: [
        "C2C construction is planned in diagonal rows of blocks, so a rectangular target requires separate block counts on the two axes. A measured swatch is the input for those conversions.",
        "This calculator performs bounded nearest-block rounding and optional measured-yarn arithmetic. It does not guarantee finished size, fit a graph design, or determine a purchase quantity.",
      ],
    },
    whatIs: {
      title: "What Is Corner-to-Corner (C2C) Crochet?",
      paragraphs: [
        "C2C is a crochet technique where you work diagonally across the fabric. Each unit, called a block or tile, is typically a small cluster of chain stitches and double crochets. You start with one block in a corner, add one block per diagonal row on the increase side until you reach the maximum width, then decrease back down to a single block in the opposite corner.",
        "The technique is beloved for graphgan blankets (blankets with pixel-art images), because each block acts like a pixel. It also produces a beautiful texture with subtle diagonal lines. C2C works up quickly once you get the rhythm, and the small, repetitive blocks make it an excellent travel or TV project.",
        "C2C blocks need not measure the same on both axes. The planner therefore uses the entered swatch width for horizontal blocks and swatch height for vertical blocks instead of assuming a square.",
      ],
    },
    howCalculated: {
      title: "How the C2C Calculator Works",
      paragraphs: [
        "Enter whole block counts and the corresponding finished swatch width and height. The calculator divides each dimension by the block count measured on that axis.",
        "Next, it divides your desired blanket dimensions by the per-block measurements and rounds to the nearest whole number. This gives you the number of blocks wide and blocks tall. The total block count is simply blocks wide times blocks tall.",
        "The diagonal-row count equals blocks wide plus blocks tall minus one. If you provide measured inches of yarn per representative block, the calculator multiplies that amount by total blocks, converts to yards, and applies the allowance percentage you entered. The allowance is shown separately.",
      ],
    },
    howToUse: {
      title: "How to Use the C2C Calculator",
      paragraphs: [
        "Make and finish a representative swatch with the intended yarn, hook, stitch construction, tension, and care process. Enter the whole block counts and measured width and height.",
        "Enter the target width and height. The calculator shows nominal dimensions after nearest-block rounding; the real fabric can differ if the swatch is not representative or finishing changes the gauge.",
        "For yarn planning, measure yarn used by representative blocks from the same fabric, enter inches per block, and choose an allowance from zero to 100 percent. Leave yarn per block blank to omit the yarn calculation.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The layout shows a nominal grid of X blocks by Y blocks. Nearest-block rounding can place either nominal dimension above or below the request; review the displayed difference in the context of your pattern and swatch.",
        "The diagonal row count tells you how many rows you will work from start to finish. On the increase half, you add one block per row. On the decrease half, you remove one block per row. For rectangular blankets, there is also a middle section where you increase on one end and decrease on the other to maintain the row length.",
        "The optional yarn output scales only the per-block amount you entered and lists the chosen allowance separately. It does not infer color-by-color use, joins, borders, ends, or other construction-specific consumption.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "C2C blocks need not be square. Measure your swatch in both directions; do not assume a 2-inch-wide block is also 2 inches tall.",
        "Plan borders separately from the panel and confirm how the chosen border changes dimensions and yarn use.",
        "Use the counting and color-change methods specified by the pattern; this worksheet does not generate row instructions.",
        "For graph designs, verify the rounded block grid against the chart before beginning the panel.",
      ],
    },
    projectIdeas: {
      title: "Project Ideas for Corner-to-Corner Crochet",
      ideas: [
        "Graphgan pixel blanket, plan your block count first with the calculator, then use graph paper (or a pixel art program) to lay out a simple image like a mountain, heart, or initial using 2–3 colors.",
        "Baby blanket in pastel stripes, enter a 36x36 inch target and work diagonal rows in alternating soft colors for a modern, gender-neutral baby gift.",
        "Pillow cover, calculate a 16x16 inch block count and crochet two matching panels in a solid color or simple two-color design; join with single crochet along three sides.",
        "Lap throw in bulky yarn, use a 6mm or larger hook with bulky weight to create a quick 40x50 inch blanket where each diagonal row works up in 15–20 minutes.",
        "Colorblock wall hanging, work a small 12x12 inch C2C panel in high-contrast colors and mount on a wooden dowel for a graphic textile art piece.",
      ],
    },
  },

  "cast-on-calculator": {
    commonMistakes: [
      "Entering gauge as stitches per inch instead of stitches over 4 inches. The most common gauge is listed as '20 stitches over 4 inches' (5 stitches per inch), but crafters sometimes enter 20 directly, producing a cast-on five times too large.",
      "Forgetting to account for stitch pattern multiples. A sweater body looks correct until waist shaping reveals the stitch count doesn't accommodate the cable repeat, forcing a restart.",
      "Adding selvedge stitches on top of the calculator output when the multiple already includes edge adjustments. A '6 stitch repeat + 2 edge stitches' pattern means enter 6 as the multiple, adding extra edge stitches produces too many stitches.",
    ],
    projectExample: "A knitter wants a 40-inch-wide sweater body at a gauge of 5 stitches per inch. Base count: 200 stitches. Their cable pattern uses a 6-stitch repeat, so they enter 6 as the multiple. The calculator rounds up to 204 (the next multiple of 6), producing an actual width of 40.8 inches, close to the target with all cables fitting evenly.",
    useCases: [
      "Starting any fitted or patterned project confidently. The cast-on count is the most foundational number in knitting and crochet; getting it wrong wastes hours.",
      "Comparing cast-on counts across gauge options. Needle size 5 might give 200 stitches while size 6 gives 195, one may fit the stitch pattern multiple better.",
      "Planning exact finished width before casting on. Enter gauge and the calculator shows the actual width after stitch multiple rounding, preventing surprises.",
    ],
    introduction: {
      title: "Why You Need a Cast On Calculator",
      paragraphs: [
        "Every knitting and crochet project begins with a simple question: how many stitches do I start with? Cast on too few and your piece will be too narrow. Cast on too many and it will be too wide. The math itself is straightforward, multiply desired width by stitches per inch, but stitch pattern multiples, edge stitches, and gauge variation add complexity that catches even experienced knitters off guard.",
        "This calculator handles all of it. Enter your gauge, desired width, and optional stitch pattern multiple, and you get an exact cast-on count that works for your pattern. No more ripping back row one because you forgot to account for a cable repeat.",
      ],
    },
    whatIs: {
      title: "What Is a Cast On Count?",
      paragraphs: [
        "The cast-on count is the number of stitches you place on your needle (in knitting) or the number of foundation chains you create (in crochet) at the very start of a project. It determines the width of your finished piece. Getting this number right at the beginning saves hours of frogging and frustration later.",
        "For simple stockinette or single crochet, the math is a direct multiplication: desired width in inches times stitches per inch. But most projects use patterned stitches that repeat over a fixed number of stitches, a stitch multiple. A 2x2 rib repeats every 4 stitches. A honeycomb cable might repeat every 12. Your cast-on count must accommodate these multiples, or the pattern will not work out evenly across the row.",
        "Edge stitches add another consideration. Many knitters add one or two selvedge stitches on each side for cleaner seaming. These extra stitches sit outside the pattern repeat and need to be factored into the total. This calculator accounts for all of these variables in one step.",
      ],
    },
    howCalculated: {
      title: "How the Cast On Count Is Calculated",
      paragraphs: [
        "The core formula divides your gauge stitches by the gauge measurement to find stitches per inch, then multiplies by your desired width. For example, if your gauge is 20 stitches over 4 inches, that is 5 stitches per inch. For a 10-inch-wide scarf, the base count is 50 stitches.",
        "When you enter a stitch pattern multiple, the calculator rounds the base count up to the nearest multiple of that number. If your base count is 50 and your pattern repeats every 6 stitches, the calculator rounds up to 54 (the next multiple of 6). This ensures your pattern fits evenly across the row.",
        "The calculator also shows you the actual finished width after rounding, so you can see exactly how the rounding affects your dimensions. If the width difference is unacceptable, you can adjust your gauge by changing needle or hook size, or choose a pattern with a more accommodating multiple.",
      ],
    },
    howToUse: {
      title: "How to Use the Cast On Calculator",
      paragraphs: [
        "First, knit or crochet a gauge swatch and measure it. Enter the number of stitches and the width of your swatch, the default is stitches over 4 inches, the most common gauge format. Next, enter the desired width of your project in inches.",
        "If your pattern uses a stitch repeat, enter the multiple in the optional field. For example, if your pattern says 'multiple of 8 plus 2,' enter 8 as the multiple. The calculator rounds up to the nearest multiple and displays the adjusted count.",
        "Review the results. The calculator shows your cast-on count, the actual width that count produces, and a note about edge stitches. Many knitters add 2 selvedge stitches (one on each side) for seaming, adjust the total as needed for your project construction.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The primary output is your cast-on stitch count. If you entered a stitch multiple, this count has been rounded up to accommodate the pattern repeat. The actual width is recalculated from this rounded count so you can see exactly how wide your piece will be.",
        "The reference table below the calculator shows common project widths, scarves, cowls, blankets, dishcloths, so you can quickly sanity-check your number. If your count seems very different from what you expected, double-check your gauge swatch measurement. Even a small error in gauge has a big impact on the final count.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always swatch in the stitch pattern you plan to use, not just stockinette. Cable patterns pull in the width, so your stitches-per-inch in cables will be higher than in plain knitting.",
        "For pieces knit in the round, your gauge may differ from flat knitting. Many knitters purl more loosely than they knit, which changes the stitch width. Swatch in the round if that is how you will work the project.",
        "When a pattern says 'multiple of 6 plus 2,' the plus 2 are usually edge or balance stitches. Enter only the base multiple (6) into the calculator, the extra 2 are already part of the pattern instructions.",
        "Foundation chains in crochet tend to be tighter than the body of the fabric. Size up your hook for the chain row only, or use a foundation single crochet or chainless foundation for a more flexible edge.",
      ],
    },
  },

  "hat-calculator": {
    commonMistakes: [
      "Treating a preset ease percentage as a fit guarantee. Yarn, stitch pattern, finishing, and the wearer's preference can require another value.",
      "Using an unwashed or unrepresentative gauge swatch. The cast-on arithmetic is only as relevant as the measured fabric supplied to it.",
      "Using the eight-section K2tog reference for a different crown construction without checking the pattern's section count, decrease method, depth, and cadence.",
    ],
    projectExample: "For a 22-inch head, a selected 10 percent ease assumption gives 19.8 inches. At 4 measured stitches per inch, the raw count is 79.2 and the eight-section reference rounds to 80. The first modeled decrease round repeats K8, K2tog eight times, consuming all 80 stitches and leaving 72. Later decrease rounds remove eight at a time until eight remain.",
    useCases: [
      "Checking the arithmetic for a candidate bottom-up knitted hat cast-on that must divide into eight crown sections.",
      "Comparing the displayed result after changing a measured head circumference, gauge, or starting ease assumption.",
      "Generating a bounded K2tog reference for cast-ons from 16 through 2,048 stitches that are divisible by eight.",
    ],
    introduction: {
      title: "Why You Need a Hat Size Calculator",
      paragraphs: [
        "A candidate hat cast-on depends on measured head circumference, a chosen ease assumption, and a representative gauge. The construction also determines which multiples and crown schedule are usable.",
        "This calculator performs those limited calculations for one bottom-up knitted reference. It does not establish universal fit, finished dimensions, yarn quantity, or compatibility with another crown construction.",
      ],
    },
    whatIs: {
      title: "What Is Negative Ease in Hats?",
      paragraphs: [
        "Negative ease means choosing a target circumference smaller than the measured head. The appropriate amount is project-specific and depends on the actual fabric, construction, finishing, and desired fit.",
        "The stitch-type choices supply explicit starting percentages: 10 percent for stockinette, 15 percent for ribbing, and 5 percent for colorwork. They are planning assumptions, not measured stretch values or guarantees.",
        "The tool multiplies the head measurement by that selected factor and by measured stitches per inch, then rounds to a multiple of eight solely for this eight-section crown reference.",
      ],
    },
    howCalculated: {
      title: "How Hat Sizing Is Calculated",
      paragraphs: [
        "The calculator takes the entered or preset head circumference and multiplies it by the displayed ease factor: 0.90, 0.85, or 0.95. This produces a calculated target circumference, not a fit determination.",
        "Next, it multiplies the target circumference by measured stitches per inch to get a raw count. This reference rounds that count to the nearest multiple of eight because its modeled crown has eight sections.",
        "The crown decrease schedule is generated from the rounded count. Each decrease round removes 8 stitches (one per section), and a plain round is worked between each decrease round. This continues until 8 stitches remain, which are drawn together to close the top. The number of decrease rounds equals the stitches per section minus one.",
      ],
    },
    howToUse: {
      title: "How to Use the Hat Calculator",
      paragraphs: [
        "Enter a measured head circumference or choose a broad nominal preset. Presets are orientation only and do not replace measuring the intended wearer.",
        "Choose the displayed ease assumption and enter gauge stitches over the distance you actually measured on a representative, treated swatch.",
        "Review the rounded cast-on, calculated target circumference, nominal height range, and bounded K2tog schedule. Plan yarn, crown depth, fit checks, and finishing separately or follow a tested pattern.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The cast-on is a candidate starting count for the displayed bottom-up knitted construction. Do not automatically reverse the schedule for top-down work or substitute crochet decreases; those are different constructions.",
        "Each modeled decrease round consumes every current stitch once, removes one stitch from each of eight sections, and is followed by a plain round until the final decrease. Eight stitches remain for pattern-directed finishing.",
        "The displayed height range is a nominal reference. Desired coverage, crown depth, stitch pattern, treatment, and construction determine the actual length to work.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure the intended wearer when possible and document the desired fit rather than relying only on a nominal preset.",
        "Use a representative washed swatch; a change in tools, stitch pattern, yarn, or finishing can invalidate the entered gauge and ease assumption.",
        "Follow a tested pattern for when to begin the crown, how to pair or lean decreases, and how to finish the remaining stitches.",
        "Estimate yarn from a pattern-specific quantity or measured method; this calculator deliberately does not provide yardage."
      ],
    },
  },

  "sock-calculator": {
    commonMistakes: [
      "Treating the editable 10 percent ease default as a universal fit rule instead of using the assumption required by a tested pattern.",
      "Entering a flat or unblocked gauge that does not represent the intended sock fabric worked in the round.",
      "Using the rounded circumference checkpoint as if it also established heel, toe, length, construction, or pull-on fit.",
    ],
    projectExample: "For an 8-inch circumference, 10 percent entered negative ease, 32 stitches measured over 4 inches, and a multiple of 4, the unrounded count is 57.6. The checkpoint rounds to 56 stitches, which models 7 inches of circumference and 12.5 percent effective negative ease at that gauge.",
    useCases: [
      "Checking a pattern's circular stitch count against an entered foot circumference and measured gauge.",
      "Comparing the modeled circumference before and after rounding to a required rib or stitch-pattern multiple.",
      "Recording a half-round arithmetic checkpoint when the rounded total divides evenly into two whole-stitch halves.",
    ],
    introduction: {
      title: "What This Sock Checkpoint Does",
      paragraphs: [
        "This bounded worksheet converts the circumference, ease assumption, and measured stitch gauge you enter into one circular stitch-count checkpoint.",
        "It shows the effect of rounding to your entered stitch multiple. It does not select a sock construction or calculate a cuff, heel, gusset, toe, foot length, or pull-on fit.",
      ],
    },
    whatIs: {
      title: "What Is a Circumference Checkpoint?",
      paragraphs: [
        "A circumference checkpoint is the whole-stitch total obtained after applying the ease assumption and stitch multiple you explicitly enter.",
        "The displayed modeled circumference and effective ease expose how rounding changed the raw target. Those arithmetic results still require comparison with the selected pattern and a representative finished swatch.",
      ],
    },
    howCalculated: {
      title: "How the Stitch Count Is Calculated",
      paragraphs: [
        "The calculator divides entered gauge stitches by the entered gauge span to obtain stitches per inch. It multiplies circumference by one minus the entered ease percentage, then by stitches per inch.",
        "The raw count is rounded to the nearest entered multiple; exact halfway cases round upward. Modeled circumference is the rounded count divided by stitches per inch, and effective ease compares that circumference with the original foot circumference.",
      ],
    },
    howToUse: {
      title: "How to Use the Sock Calculator",
      paragraphs: [
        "Enter the relevant foot circumference, the negative-ease assumption specified by your pattern, and the stitch count and span from a representative circular swatch.",
        "Enter the whole-number multiple required by the intended rib or stitch pattern. Review both the rounded count and modeled circumference rather than copying the count alone.",
        "Take the checkpoint back to a tested sock pattern for construction, shaping, length, and fit decisions.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The raw count preserves the unrounded arithmetic. The adjusted count is a whole number compatible with the multiple you entered.",
        "Effective ease can differ from the entered assumption because whole-stitch rounding changes the modeled circumference. A half-round is shown only when it is a whole number and is not a shaping instruction.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use the ease assumption and circumference landmark named by the selected pattern rather than assuming one value works for every construction.",
        "Measure gauge in representative finished fabric worked the same way as the sock and after the intended treatment.",
        "If neighboring multiples give materially different effective ease, compare swatches and the pattern's fit guidance before choosing.",
        "Do not derive a heel, toe, length, or pull-on fit from this circumference-only result.",
      ],
    },
  },

  "granny-square-planner": {
    commonMistakes: [
      "Rounding to the nearest square count can leave a nominal grid smaller than the target. This planner rounds each positive axis up.",
      "Treating the square-size input as a finished blanket prediction. Joining tension, seam structure, borders, and later treatment can change the assembled dimensions.",
      "Converting seam distance directly into yarn yardage without measuring the chosen joining method on sample squares.",
      "Treating an equal division across colors as a purchasing quantity when the layout uses colors in different proportions.",
    ],
    projectExample: "A 50 by 60 inch target with measured 6-inch squares rounds up to a 9 by 10 grid, or 90 squares, with a nominal grid span of 54 by 60 inches before joining effects. Its unique internal seam topology contains (9 − 1) × 10 + (10 − 1) × 9 = 161 square-edge segments, or 966 inches of seam distance. If one representative square uses 18 yards, the squares use 1,620 measured-input yards before any user-chosen allowance; joining yarn is not inferred.",
    useCases: [
      "Finding a meet-or-exceed rectangular grid from target dimensions and a measured blocked square size.",
      "Counting total squares and the unique internal seam length without double-counting shared edges.",
      "Scaling yarn measured in one representative square to the planned square count.",
      "Viewing an equal-use per-color average as a planning reference, then replacing it with layout-specific proportions.",
    ],
    introduction: {
      title: "What the Granny Square Planner Calculates",
      paragraphs: [
        "The planner performs bounded grid arithmetic for a rectangular granny-square layout. It rounds each axis up from the entered target and measured square size so the nominal grid is not smaller than the target.",
        "The output separates four different quantities: square counts, nominal grid span, unique internal seam distance, and optional measured-input yarn for the squares. It does not predict assembled dimensions or convert seam distance into joining-yarn yardage.",
      ],
    },
    whatIs: {
      title: "Measure a Representative Square First",
      paragraphs: [
        "Use the blocked size of a square made with the intended yarn, hook, pattern, tension, and care process. A nominal pattern size is not a substitute for a measured sample.",
        "Mixed square patterns can have different edge structures even when their nominal sizes match. Test their measured edges and the intended join before relying on one grid calculation.",
      ],
    },
    howCalculated: {
      title: "Grid and Seam Formulas",
      paragraphs: [
        "Squares across equal ceiling(target width divided by measured square size), and squares tall use the same ceiling formula. Each positive target therefore produces at least one square per axis.",
        "Total squares equal squares across multiplied by squares tall. Nominal grid span equals the selected count on each axis multiplied by the measured square size.",
        "Unique internal seam segments equal ((across − 1) × tall) + ((tall − 1) × across). Multiplying that count by square size gives seam distance, not yarn consumption.",
        "When measured yarn per square is supplied, square yarn equals total squares multiplied by that measurement. The tool adds no hidden allowance and does not estimate borders, tails, or joining yarn.",
      ],
    },
    howToUse: {
      title: "How to Use the Plan",
      paragraphs: [
        "Enter target width and height, then the blocked measurement of one representative square. Enter a whole number of colors and, optionally, measured yards used by one square.",
        "Compare the nominal grid span with the target, test the intended joining method on sample squares, and measure how that join changes size and consumes yarn.",
        "Add project-specific allowances only after considering variation, rejected squares, tails, borders, layout proportions, and the selected joining method.",
      ],
    },
    understandingResults: {
      title: "What the Results Do Not Prove",
      paragraphs: [
        "A nominal grid span is arithmetic before joining effects. It is not a guarantee of finished blanket size.",
        "Internal seam length counts each shared square edge once. Joining-yarn use depends on the actual seam technique and must be measured.",
        "The per-color figure assumes equal use. It is a planning average, not evidence that a specific layout uses colors equally.",
      ],
    },
    proTips: {
      title: "Checks Before Scaling Up",
      tips: [
        "Join a small sample grid and measure it before making the full square count.",
        "Use the same square measurement and yarn-consumption method for every comparison.",
        "Track layout-specific color proportions rather than relying on the equal-share average.",
        "Record border and joining yarn separately after measuring the selected techniques.",
      ],
    },
  },

  "sleeve-calculator": {
    commonMistakes: [
      "Treating the model's two fixed one-inch exclusions as a universal construction rule. Use this arithmetic only when those exclusions match the measurement definitions and shaping zone in the selected pattern.",
      "Assuming the calculator forces both stitch counts to even numbers. It rounds each circumference-times-gauge result to the nearest whole stitch and refuses an odd difference because paired events cannot reach that displayed cuff count exactly.",
      "Using a row gauge from a different stitch pattern or treating a refused dense schedule as usable. The calculator will not create a zero-row interval when the number of paired-decrease events exceeds the available shaping rows.",
    ],
    projectExample: "A knitter enters a 12-inch upper arm, an 8-inch wrist, an 18-inch sleeve, 2 inches of cuff ribbing, 5 stitches per inch, and 6 rows per inch. The calculator rounds to 60 upper-arm stitches and 40 cuff stitches: 20 stitches must be removed in 10 paired-decrease events, because each event removes one stitch at each edge. The shaping zone is 18 − 1 − 2 − 1 = 14 inches, or 84 rows. Dividing 84 rows across 10 events gives six 8-row intervals and four 9-row intervals: 6 × 8 + 4 × 9 = 84, and 10 events × 2 stitches = 20 stitches removed, leaving 40.",
    useCases: [
      "Checking the whole-stitch and whole-row arithmetic for one straight, paired-decrease taper described by a selected pattern.",
      "Comparing pattern-supported measurement or gauge inputs while keeping the model's fixed exclusions and omitted construction details visible.",
      "Identifying inputs that this model cannot schedule, including an odd stitch-count difference or more decrease events than shaping rows.",
    ],
    introduction: {
      title: "Why You Need a Sleeve Shaping Calculator",
      paragraphs: [
        "A straight sleeve taper can require several linked calculations: converting two pattern-defined circumferences to whole stitches, finding the paired-decrease event count, and partitioning a defined shaping zone into whole-row intervals.",
        "This calculator checks that bounded arithmetic for one paired-decrease model. It does not choose ease, construction, landmarks, technique, or fit, so its output must be compared with the selected pattern and a representative sample.",
      ],
    },
    whatIs: {
      title: "What Is Sleeve Shaping?",
      paragraphs: [
        "Sleeve shaping changes stitch count over a section of a sleeve. This calculator covers only a straight taper whose modeled event removes two stitches, one at each edge; other constructions may use different counts, placement, or sequencing.",
        "The selected pattern must define the actual decrease or increase technique, lean, side, edge treatment, and row-count convention. The calculator supplies none of those instructions.",
        "For its shaping-zone arithmetic, the model subtracts the entered cuff length and two fixed one-inch exclusions from the entered sleeve length. Those exclusions are calculator assumptions, not general sleeve-design rules.",
      ],
    },
    howCalculated: {
      title: "How Sleeve Shaping Is Calculated",
      paragraphs: [
        "The calculator multiplies each entered circumference by the entered stitch gauge and rounds each result to the nearest whole stitch. It does not round the counts to even numbers. If their difference is odd, the paired-decrease model returns an unsupported result instead of changing either target.",
        "For an even difference, decrease events equal the stitch difference divided by 2. Shaping inches equal entered sleeve length minus entered cuff length minus two fixed inches; multiplying by row gauge and rounding gives a whole-number shaping-row count.",
        "If decrease events exceed shaping rows, the model refuses the schedule. Otherwise it uses the whole-number quotient and remainder to assign some events an N-row interval and the rest an N+1-row interval, with the displayed intervals totaling the modeled shaping rows.",
      ],
    },
    howToUse: {
      title: "How to Use the Sleeve Calculator",
      paragraphs: [
        "Enter the finished upper-arm and cuff circumferences and length landmarks defined by the selected pattern. The calculator does not add ease or determine where those measurements belong on the body or garment.",
        "Enter stitch and row gauge from a representative sample in the sleeve fabric, using the pattern's measuring and finishing instructions. Confirm that the model's cuff subtraction and two fixed one-inch exclusions match the pattern before using the result.",
        "For supported inputs, the output shows rounded stitch counts, stitches to remove, shaping rows, and a paired-decrease interval sequence. The pattern must still supply technique, placement, the first-event convention, construction, and fit checks.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A displayed instruction such as 'every 6 rows' is an interval summary for this model, not a complete pattern instruction. Confirm how the selected pattern counts the first event, decrease row, intervening rows, and any change between interval groups.",
        "An unsupported result is deliberate: an odd stitch difference cannot be removed exactly by two-stitch events, and more events than shaping rows would require a zero-row interval. Use a tested pattern or revise pattern-supported inputs rather than silently changing the target.",
        "The output does not model ease, sleeve caps, armholes, pickups, compound shaping, stitch-pattern constraints, construction, or fit.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use the selected pattern's decrease placement and method; moving an event can alter an edge, seam, motif, or visible line.",
        "Do not automatically reverse the output for bottom-up work. Confirm the pattern's increase method, placement, interval order, and row-count convention.",
        "Recheck gauge in representative sleeve fabric after the finishing treatment specified for the actual yarn and project.",
        "Compare the arithmetic with the pattern's construction and checkpoints; a valid interval calculation does not establish fit.",
      ],
    },
  },

  "raglan-calculator": {
    commonMistakes: [
      "Entering a body measurement without first deciding the intended finished circumference and ease with the selected pattern.",
      "Using an unblocked or unrepresentative gauge that does not match the intended body fabric.",
      "Treating a finished-body count as a neck cast-on, section allocation, yoke schedule, underarm split, or fit result.",
    ],
    projectExample: "For a 40-inch finished-body circumference, 20 stitches measured over 4 inches, and a required multiple of 4, the raw and rounded checkpoint is 200 body stitches with a modeled circumference of 40 inches.",
    useCases: [
      "Checking a pattern's finished-body stitch count against an entered circumference and measured gauge.",
      "Rounding one body checkpoint to the repeat required by the intended body stitch pattern.",
      "Comparing modeled circumference after whole-stitch rounding before returning to the pattern's shaping instructions.",
    ],
    introduction: {
      title: "What This Raglan Checkpoint Does",
      paragraphs: [
        "This bounded worksheet converts a finished-body circumference and measured stitch gauge into one whole-stitch body checkpoint.",
        "Those inputs are insufficient to design a raglan. The tool deliberately does not generate a neckline, section distribution, increase schedule, yoke depth, underarm split, or fit recommendation.",
      ],
    },
    whatIs: {
      title: "What Is a Finished-Body Checkpoint?",
      paragraphs: [
        "The checkpoint is the body circumference multiplied by stitches per inch, rounded to the whole stitch multiple you enter.",
        "It can be compared with a body count in a tested raglan pattern. It cannot establish how that count is reached through neckline and yoke shaping.",
      ],
    },
    howCalculated: {
      title: "How the Body Checkpoint Is Calculated",
      paragraphs: [
        "The calculator divides entered gauge stitches by the entered gauge span to obtain stitches per inch, then multiplies by the entered finished-body circumference.",
        "It rounds that raw count to the nearest entered whole-number multiple. The modeled circumference divides the rounded count by stitches per inch so the rounding effect remains visible.",
      ],
    },
    howToUse: {
      title: "How to Use the Raglan Body Checkpoint",
      paragraphs: [
        "Use the selected pattern and intended ease to determine the finished-body circumference, then enter the stitch count and span from a representative blocked body-fabric swatch.",
        "Enter the whole-number multiple required by the body stitch pattern. Compare the rounded count and modeled circumference with the pattern before continuing.",
        "Use the pattern or a validated garment-design method for every neckline, yoke, sleeve, underarm, shaping, and fit decision.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The raw body count preserves the unrounded arithmetic. The body checkpoint is the nearest supported whole-stitch multiple.",
        "Modeled body circumference shows what that rounded count represents at the entered gauge. None of these fields is a neck or yoke output.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Enter a finished circumference that already reflects the selected pattern's intended ease; the tool does not choose ease for you.",
        "Use a blocked swatch made in the intended body stitch pattern and yarn.",
        "Review the modeled circumference after rounding, especially when the stitch-pattern multiple is large.",
        "Do not reverse-engineer a neckline or yoke schedule from this body-only checkpoint.",
      ],
    },
  },

  "blocking-calculator": {
    skillLevel: "Beginner",
    techniqueEffect: "The calculator describes a requested dimension change as a signed percentage. It does not predict how a fabric will respond or select a finishing method.",
    techniqueSteps: [
      "Measure the current width, length, or both without stretching the item.",
      "Enter the matching requested dimensions in the same unit.",
      "Read the signed percentage as the requested change, not an achievable-growth or safety rating.",
      "Choose treatment from the pattern and product care instructions, then test it on a representative swatch."
    ],
    fiberNotes: "A fiber name alone cannot establish a safe method. Blends, yarn construction, dyes, finishes, stitch pattern, prior treatment, and manufacturer instructions can change how an item responds.",
    practiceProject: "Make a representative swatch, measure it, treat it exactly as the pattern and care instructions specify, let the treatment cycle finish, and measure again. Compare the observed swatch change with the requested project change.",
    introduction: {
      title: "Why Calculate a Requested Dimension Change?",
      paragraphs: [
        "Comparing current and requested measurements makes the size difference explicit before you treat a project.",
        "The percentage is useful for comparing with a representative swatch. It is not evidence that a treatment is safe or that the finished item can reach and retain the requested size.",
      ],
    },
    whatIs: {
      title: "What Does This Calculator Measure?",
      paragraphs: [
        "It measures the signed percentage difference between a current and requested dimension.",
        "A positive result is a requested increase, a negative result is a requested decrease, and zero means the two entries match.",
        "Width and length are independent, so you can calculate one axis without entering the other.",
      ],
    },
    howCalculated: {
      title: "How the Blocking Calculator Works",
      paragraphs: [
        "For each completed axis, subtract the current dimension from the requested dimension, divide by the current dimension, and multiply by 100.",
        "For example, 48 to 50 is a positive 4.2 percent requested change. Sixty to 57 is a negative 5.0 percent requested change.",
        "The calculator deliberately does not convert the result into a feasibility, safety, or fiber-treatment rating.",
      ],
    },
    howToUse: {
      title: "How to Use the Blocking Calculator",
      paragraphs: [
        "Enter both current and requested values for width, length, or both. Leave both fields for an unused axis blank.",
        "Use the same measurement unit within each pair. The percentage is unit-independent.",
        "Then compare the requested change with measurements from a representative swatch treated according to the pattern and product care instructions.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The magnitude shows how far the requested measurement is from the current one relative to the current size.",
        "It does not show what treatment will work, what is safe, or what change will remain after use or laundering.",
        "Use the actual after-treatment swatch measurement as project-specific evidence, and stop when product instructions conflict or the item is valuable.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Follow the project pattern and the yarn, fabric, or garment care instructions.",
        "Test the complete intended treatment and drying cycle on a representative swatch.",
        "Use steam or other heat only when the product and appliance instructions permit it.",
        "Get qualified textile-care guidance when instructions are missing or conflict, particularly for valuable items.",
      ],
    },
  },

  "stash-estimator": {
    commonMistakes: [
      "Weighing a damp or 'air-fluffed' partial skein instead of a consistently dry one. Yarn weight varies with humidity, throwing off the yardage estimate by 5–10%.",
      "Using reference yardage ranges (Mode 2) when the original ball band is available. Mode 1 using original skein weight and yardage is significantly more accurate than category averages.",
      "Forgetting to subtract the weight of the ball band or yarn label before weighing. A printed label adds 2–5 grams, inflating the estimate by 5–20 yards.",
    ],
    projectExample: "A crafter finds a partial skein of worsted weight yarn with its original band: 100g = 220 yards. Scale shows 42g remaining. Calculation: (42 ÷ 100) × 220 = 92.4 yards. That's enough for a small hat or cowl, but not a pair of socks. Paired with another partial of similar color, 92 yards becomes part of a coordinated set.",
    useCases: [
      "Organizing a yarn stash by weighing partial skeins so you always know what yardage is available for small projects.",
      "Determining whether leftover yarn from one project is enough for another without buying more.",
      "Evaluating mystery yarn at sales or from donations. Use WPI to determine weight, then Mode 2 to estimate yardage.",
    ],
    introduction: {
      title: "Why You Need a Yarn Stash Estimator",
      paragraphs: [
        "Every crafter accumulates partial skeins. They sit in bins, bags, and baskets, leftovers from finished projects, impulse purchases that lost their ball band, and skeins inherited from fellow crafters. The question is always the same: is there enough here for another project? Without a way to estimate the remaining yardage, those partial skeins stay in limbo, too much to throw away, too uncertain to use.",
        "This estimator solves the mystery. Weigh your partial skein on a kitchen scale, enter the original skein specs, and get an immediate yardage estimate. For completely unlabeled yarn, the reference table maps yarn weight categories to typical yardage per 100 grams so you can estimate what you have even without a ball band.",
      ],
    },
    whatIs: {
      title: "What Is Yarn Stash Estimation?",
      paragraphs: [
        "Yarn stash estimation is the process of determining how much usable yardage remains in your leftover yarn. The most reliable method is weight-based: if you know the original skein's full weight and yardage, you can calculate the remaining yardage by weighing what you have and applying a simple proportion.",
        "The formula is straightforward. If a full skein weighs 100 grams and contains 220 yards, and your partial skein weighs 40 grams, then you have approximately 88 yards remaining. This works because yarn density is consistent within a single skein, every gram contains the same amount of yardage.",
        "For yarn with no label information at all, you can estimate yardage using the Craft Yarn Council's typical yardage ranges by weight category. A 100-gram ball of worsted weight yarn typically contains about 200 yards, while the same weight of lace yarn might contain 800 yards or more. These are averages, actual yardage varies by fiber content and spin, but they give you a useful ballpark for planning.",
      ],
    },
    howCalculated: {
      title: "How the Stash Estimator Works",
      paragraphs: [
        "Mode 1 uses a direct proportion. Divide the partial skein weight by the full skein weight, then multiply by the full skein yardage. This gives you the estimated remaining yardage. The calculation assumes uniform density throughout the skein, which is true for commercially spun yarn.",
        "Mode 2 uses reference values from the Craft Yarn Council's weight categories. Each category has a typical yardage per 100 grams, for example, worsted weight averages about 200 yards per 100 grams. Multiply the partial skein weight (in grams) by the yardage per gram for that category to get an estimate.",
        "Both modes produce estimates, not exact measurements. Fiber content significantly affects the weight-to-yardage ratio. Cotton is denser than wool, so a 100-gram ball of cotton worsted contains fewer yards than a 100-gram ball of wool worsted. Silk and bamboo fall somewhere in between. The estimates are most accurate when the fiber content is consistent with typical values for the weight category.",
      ],
    },
    howToUse: {
      title: "How to Use the Stash Estimator",
      paragraphs: [
        "For Mode 1, you need three pieces of information from the original ball band: the full skein weight in grams, the full skein yardage, and the partial skein weight from your kitchen scale. Enter all three values and the calculator shows your estimated remaining yardage instantly.",
        "For Mode 2, identify your yarn weight category. If you are unsure, use the WPI (wraps per inch) method, wrap the yarn around a ruler for one inch and count the wraps. Enter the weight category and your partial skein weight in grams. The calculator multiplies by the typical yardage per 100 grams for that category.",
        "If you have no idea what the yarn weight or fiber is, start by measuring WPI to identify the weight, then use Mode 2 with that weight category. The reference table also shows the full range of typical yardages for each category, so you can see the possible spread and plan conservatively.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The estimated yardage is just that, an estimate. For Mode 1 with known skein specs, the estimate is quite accurate for commercial yarn. For Mode 2 with reference values, the actual yardage could be anywhere within the range shown for that weight category. Plan conservatively, if the typical value says 200 yards per 100 grams but the range is 180 to 240, assume the lower end if you cannot afford to run short.",
        "Fiber content is the biggest variable. Cotton is about 50 percent denser than wool, so a 50-gram ball of cotton DK weight might have 100 yards while a 50-gram ball of wool DK has 125 yards. Acrylic is similar in density to wool, while silk and bamboo are closer to cotton. If you know the fiber content, factor this into your planning.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Invest in an inexpensive kitchen scale that reads in grams. It pays for itself the first time it saves you from buying yarn you do not need.",
        "Weigh your project periodically as you work. Subtract the project weight from the starting skein weight to track how much yarn you have left without winding it off.",
        "When buying yarn for a project, weigh one skein to verify the label weight. Manufacturing tolerances mean some skeins may be slightly over or under the stated weight.",
        "For stash organization, weigh each partial skein and write the weight and original yardage on a tag attached to the yarn. This makes future project planning much faster.",
      ],
    },
  },
  "vintage-pattern-decoder": {
    answerCapsule: "Paste a pattern excerpt, choose Unknown, US, or UK source terms, and review a finite set of terminology mappings and possible source clues. Unknown and US modes preserve the text.",
    skillLevel: "beginner",
    introduction: {
      title: "Why the Source Convention Matters",
      paragraphs: [
        "UK and US crochet instructions can use the same stitch name or abbreviation for different techniques. UK double crochet corresponds to US single crochet, while double crochet in a US pattern remains US double crochet.",
        "Confirm the convention from the pattern key, publisher, or another reliable source before converting. A date, photograph, gauge line, or isolated term is not enough to establish it.",
      ],
    },
    whatIs: {
      title: "What Is the Vintage Pattern Term Review?",
      paragraphs: [
        "This is a text-only review tool with three explicit source settings. Unknown and US preserve the input exactly. UK maps only the finite set of terms supported by the tool and highlights those changes.",
        "It can also flag limited wording, numbered-size, and yarn-weight clues for manual research. Those clues do not determine the pattern's date, country, terminology system, needle diameter, or yardage.",
      ],
    },
    howCalculated: {
      title: "How Does the Term Review Work?",
      paragraphs: [
        "The input is limited to 20,000 characters and is processed locally in the page. The tool does not accept files or run a document parser.",
        "When UK is selected, supported terms are matched longest-first so a phrase such as 'double treble crochet' is handled before the shorter 'treble crochet.' Each source span is changed at most once, and all unsupported text remains unchanged.",
        "Unknown and US modes bypass the mapping step. This prevents valid US wording such as 'double crochet' from being silently rewritten.",
      ],
    },
    howToUse: {
      title: "How to Review Pattern Terms",
      paragraphs: [
        "Paste a short pattern excerpt and choose the source terminology. Leave Unknown selected unless the pattern key, publisher, or another reliable source establishes UK or US terms.",
        "Select Review Pattern Text. Unknown and US return the original text unchanged. Explicit UK mode highlights only supported UK-to-US mappings and lists each mapped term and count.",
        "Review possible source signals separately. Treat them as research prompts, not proof, and verify every highlighted change against the pattern's own definitions before working the project.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A highlight means the text matched one entry in the tool's finite UK map after UK was explicitly selected. It is not a validation of the surrounding instruction, stitch count, or technique.",
        "Possible source signals call attention to language or measurements that may need research. They do not establish a publication date, country, convention, or exact needle or hook size.",
        "Yarn listed in ounces gives mass, not modern yardage. Match construction and length per unit weight before substituting. For a bare numbered needle or hook, find the source sizing system and millimeter diameter.",
      ],
    },
    proTips: {
      title: "Safer Review Tips",
      tips: [
        "Use the source's own abbreviation key before a general reference.",
        "Keep Unknown selected when the convention is not established; the tool will preserve the text.",
        "Review one excerpt at a time and compare every UK-mode highlight with the original instructions.",
        "Verify bare needle and hook numbers in millimeters before choosing a tool.",
        "Make a gauge swatch with the intended yarn and tool before committing to the project.",
      ],
    },
    commonMistakes: [
      "Selecting UK based on one word instead of confirming the convention from the source.",
      "Treating highlighted mappings as validation of the complete instruction.",
      "Assuming a bare needle or hook number identifies a country-specific size.",
      "Treating yarn weight in ounces as enough information to choose a modern substitute.",
    ],
    useCases: [
      "Preserving an uncertain pattern excerpt while gathering source information",
      "Mapping supported terms after a pattern key confirms UK crochet terminology",
      "Reviewing possible size or yarn-weight clues that require a source-specific lookup",
      "Comparing an explicit UK term with common US wording",
    ],
    internalLinks: [
      { href: "/uk-to-us-converter", label: "UK to US Converter", description: "Compare the included UK and US crochet term pairs" },
      { href: "/abbreviation-glossary", label: "Abbreviation Glossary", description: "Search the included knitting and crochet abbreviation entries" },
      { href: "/needle-converter", label: "Needle Size Converter", description: "Look up included metric and US size-table entries" },
      { href: "/stitch-quick-reference", label: "Stitch Quick Reference", description: "Review selected common knitting and crochet stitch notes" },
    ],
  },
};
