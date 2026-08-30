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
    answerCapsule: "Calculate exactly how much yarn you need for any knitting or crochet project. Enter your project type, dimensions, and yarn weight to get total yardage and skein count with a built-in safety buffer.",
    commonMistakes: [
      "Forgetting to account for weaving in ends and gauge variation. Many crafters subtract only the base yardage but forget that knitting in tails, blocking adjustments, and tension differences eat 100–200 extra yards on a large project like a sweater or throw blanket.",
      "Confusing yardage per skein with the stated skein weight. A 50g skein of fingering weight contains 200+ yards, while a 50g skein of bulky weight contains only 50–60 yards. Using the weight instead of yardage in your calculations results in buying far too little yarn.",
      "Calculating cable sweaters at stockinette consumption rates. Cable patterns use 15–20% more yarn than stockinette due to the twisted stitches consuming extra length. A cable pullover using the stockinette rate will run short by a full skein or more.",
    ],
    projectExample: "A crafter wants to make a 50 by 60 inch throw in worsted weight using stockinette and 220-yard skeins. In Quick Estimate mode, the calculator applies its built-in 1.3-yards-per-square-inch worsted factor: 3,000 square inches multiplied by 1.3 produces 3,900 base yards. The built-in 10% buffer raises the estimate to 4,290 yards, and rounding 4,290 divided by 220 up to a whole skein produces 20 skeins.",
    useCases: [
      "Planning a multi-pattern sweater where cable panels, ribbing, and stockinette sections consume yarn at different rates, enter each section separately and sum the totals.",
      "Buying yarn for a large project like a queen-size blanket where running short means hunting for a discontinued dye lot. The calculator's buffer prevents that mid-project panic.",
      "Converting between yarn brands with different yardage per skein specs. Enter the total yardage needed, then divide by your chosen yarn's yards-per-skein to find how many skeins to buy.",
    ],
    internalLinks: [
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Compare yarn weights and find substitution options" },
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Measure your gauge for more accurate yardage estimates" },
      { label: "Blanket Calculator", href: "/blanket-calculator", description: "Get precise yarn estimates for blankets of any size" },
    ],
    introduction: {
      title: "Why You Need a Yarn Yardage Calculator",
      paragraphs: [
        "Every knitter and crocheter has faced the same anxious question at the yarn shop: how many skeins do I actually need? Buying too few means a frantic search for the same dye lot later, and if it has been discontinued, your project may never match. This calculator removes the guesswork entirely.",
        "Whether you are planning a simple scarf or a complex cabled sweater, accurate yardage estimation saves both money and heartbreak. Running out of yarn mid-project is one of the most frustrating experiences in fiber arts, and it is completely preventable with the right numbers before you cast on.",
      ],
    },
    whatIs: {
      title: "What Is Yarn Yardage Estimation?",
      paragraphs: [
        "Yarn yardage estimation is the process of calculating how much yarn a project will consume based on its dimensions, yarn weight, and stitch pattern. Every stitch uses a measurable length of yarn, and different weights and textures consume yarn at different rates per square inch of finished fabric.",
        "The Craft Yarn Council publishes standard yardage ranges for each weight category, but real-world usage depends on your tension, needle size, and stitch pattern. Cables eat more yarn than stockinette; lace uses less. A good estimate accounts for these variables and adds a safety buffer.",
      ],
    },
    howCalculated: {
      title: "How Yarn Yardage Is Calculated",
      paragraphs: [
        "Quick Estimate mode multiplies the project area by the calculator's built-in yards-per-square-inch factor for the selected yarn weight, then applies the selected stitch-pattern multiplier and a 10% buffer. The default worsted-weight stockinette factor is 1.3 yards per square inch.",
        "For a 50 by 60 inch throw, the area is 3,000 square inches. Multiplying 3,000 by the default worsted factor of 1.3 produces 3,900 base yards. The 10% buffer raises the result to 4,290 yards; with 220-yard skeins, the calculator rounds 19.5 up to 20 skeins.",
        "The calculator then divides total yardage by the yards per skein to determine how many skeins to purchase, always rounding up because partial skeins are not sold. This final number is what you bring to the yarn shop with confidence.",
      ],
    },
    howToUse: {
      title: "How to Use the Yarn Yardage Calculator",
      paragraphs: [
        "Start by selecting your project type, sweater, blanket, scarf, hat, socks, or shawl. Each project type uses a different formula based on typical construction and stitch density. Next, choose your yarn weight from lace through super bulky. The calculator uses standard yardage-per-square-inch values for each weight, adjusted by the project type's typical stitch pattern.",
        "Enter your project dimensions in inches. For garments, this means chest circumference and body length. For blankets and scarves, enter width and length. The calculator outputs both total yardage needed and number of skeins based on the yardage per skein you specify.",
        "The skeins output rounds up to the nearest whole number because you cannot buy partial skeins. The yardage output is the raw estimate before rounding. Use the yardage number when comparing across yarn brands with different put-ups."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The calculator adds a 10-15% buffer to the base yardage estimate. This accounts for gauge variation, tension differences, weaving in ends, and the yarn lost to casting on and binding off. If you knit or crochet tightly, you may use slightly less than the estimate. Loose stitchers may use slightly more.",
        "Leftover yarn from your estimate is normal and expected. Fiber content affects actual yardage consumption, cotton and linen have no stretch and use more yardage per stitch than wool or acrylic, which have natural elasticity. Textured stitch patterns like cables or bobbles also consume more yarn than stockinette or single crochet."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always buy one extra skein from the same dye lot. Dye lots vary between production runs, and a color mismatch mid-project is visible in finished work.",
        "Knit or crochet a gauge swatch before running the calculator. Your actual gauge determines how much yarn each stitch consumes, and the calculator's estimates assume standard gauge for each weight.",
        "Yarn listed in stores may vary from online listings by 5-10 yards per skein. Check the actual yardage printed on the ball band, not the store listing.",
        "For colorwork projects, calculate each color separately. The calculator estimates total yardage, it does not split by color."
      ],
    },
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
    answerCapsule: "Gauge is the number of stitches and rows per inch in your knitted or crocheted fabric. Enter your swatch measurements to calculate stitches per inch, compare against your pattern's gauge, and resize stitch counts to match your actual tension.",
    commonMistakes: [
      "Measuring gauge on stockinette swatch edges instead of the center. The first and last few stitches distort due to edge tension and loose casting on, throwing off the gauge reading by a quarter to a half stitch per inch, compounding into a sweater 2–3 inches wrong in width.",
      "Swatching in a different stitch than the project. Many crafters swatch in stockinette for speed, then knit the project in cable or colorwork. These patterns pull in width dramatically, so the finished dimensions are completely off despite matching the stated pattern gauge.",
      "Measuring a swatch before the treatment the finished project will receive. Follow the pattern and product care instructions, complete the full treatment and drying cycle, and record the observed change instead of assuming a universal blocking percentage.",
    ],
    projectExample: "A knitter wants to knit a fitted pullover that calls for 5 stitches per inch. Their swatch shows 22 stitches over 4 inches, actual gauge 5.5 stitches per inch. The pattern requires 200 stitches across 40 inches at the correct gauge. At 5.5 stitches per inch, those same 200 stitches produce only 36.4 inches, 3.5 inches too narrow. Using resize mode, the calculator shows 220 stitches are needed to achieve the intended 40-inch width.",
    useCases: [
      "Adjusting a pattern's stitch count when your gauge differs from the designer's specification, essential for every fitted garment.",
      "Determining whether to go up or down a needle size to match a pattern gauge. The calculator shows exactly how far off you are (0.25 stitches per inch? Half a stitch?) to guide the decision.",
      "Checking a new yarn's gauge in a specific stitch pattern before committing 50+ hours to a project.",
    ],
    internalLinks: [
      { label: "Stitch Pattern Calculator", href: "/stitch-pattern-calculator", description: "Find compatible stitch counts for your gauge" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Check recommended gauge ranges for each yarn weight" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Adjust needle size to match your target gauge" },
    ],
    introduction: {
      title: "Why Gauge Matters in Knitting and Crochet",
      paragraphs: [
        "Gauge is the single most important measurement in fitted knitting and crochet. Even half a stitch per inch difference from the pattern specification can mean a sweater that is three sizes too large or impossibly tight. Incorrect gauge is one of the most commonly cited reasons for frogging (unraveling) finished garments in the knitting community.",
        "Professional designers spend significant time establishing gauge because every pattern instruction depends on it. Stitch counts, shaping calculations, and yarn estimates all derive from this foundational measurement. Getting gauge right before you begin saves significant time that would otherwise be spent ripping out and reworking later.",
      ],
    },
    whatIs: {
      title: "What Is Knitting and Crochet Gauge?",
      paragraphs: [
        "Gauge is the number of stitches and rows produced per unit of measurement, typically counted over a four-inch or ten-centimeter square of knitted or crocheted fabric. It reflects the combined effect of your yarn weight, needle or hook size, tension, and stitch pattern on the finished fabric density.",
        "Every knitter and crocheter produces slightly different gauge even with identical materials because hand tension is personal. This is why patterns specify a target gauge and recommend swatching before starting. The swatch tells you whether to adjust your needle size up or down to match.",
        "Stitch gauge (horizontal) usually matters more than row gauge (vertical) for garments, because width determines fit while length can often be adjusted by working more or fewer rows. However, both matter for shaped pieces like armholes, necklines, and set-in sleeves.",
      ],
    },
    howCalculated: {
      title: "How Gauge Is Calculated",
      paragraphs: [
        "To measure gauge, knit or crochet a swatch at least six inches square, then count stitches over a four-inch span in the center, avoiding edge stitches which tend to distort. Divide the stitch count by four to get stitches per inch. For example, 22 stitches over four inches equals 5.5 stitches per inch.",
        "Now compare to the pattern gauge. If a pattern calls for 5 stitches per inch across 40 inches, it expects 200 stitches wide. But at your gauge of 5.5 stitches per inch, those same 200 stitches produce only 36.4 inches, nearly four inches too narrow for the intended fit.",
        "The solution is to go up a needle size and swatch again until you match the pattern gauge, or use the calculator to determine the correct stitch count for your actual gauge. At 5.5 stitches per inch, you would need 220 stitches to achieve the 40-inch width.",
      ],
    },
    howToUse: {
      title: "How to Use the Gauge Calculator",
      paragraphs: [
        "The calculator operates in three modes. In swatch mode, enter the number of stitches and rows you counted in your swatch, along with the swatch dimensions in inches. The calculator returns your stitches per inch and rows per inch. In resize mode, enter the original pattern gauge and your actual gauge, and the calculator adjusts stitch and row counts for the entire pattern. In target width mode, enter your gauge and desired finished width, and the calculator returns the exact cast-on or starting chain count.",
        "For swatch mode, knit or crochet a swatch at least 6 inches square in the stitch pattern you plan to use. Measure the center 4 inches, edge stitches distort gauge readings. Count stitches and rows within that measured area and enter those numbers.",
        "For resize mode, you need both the pattern's stated gauge (printed at the top of most patterns) and your own measured gauge. The calculator multiplies every stitch and row count in the pattern by the ratio between these two gauges."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Stitches per inch controls the width of your finished piece. Rows per inch controls the length. For most flat projects, scarves, blankets, dishcloths, stitch gauge is critical because you cast on a fixed number of stitches, but you can knit to any length by adding or subtracting rows. Row gauge matters most when shaping is involved: raglan yokes, short rows, sock heels, and any section where you must hit a specific length at a specific row count.",
        "A difference of even half a stitch per inch compounds over the width of a garment. At 4.5 stitches per inch instead of 5, a 200-stitch sweater body comes out 44.4 inches wide instead of 40 inches, over 4 inches too large. This is why swatching is not optional for fitted garments."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "If your project is knit in the round, swatch in the round. Most knitters purl at a different tension than they knit, so flat gauge and circular gauge often differ by a quarter stitch per inch or more.",
        "Wash and block your swatch before measuring. Many fibers relax, bloom, or shrink after the first wash, and your gauge will shift accordingly.",
        "Measure in the center of your swatch, not near the edges. Edge stitches are distorted by the cast-on, bind-off, and selvedge, and they do not represent your working gauge.",
        "If you are between needle sizes for your target gauge, go with the size that gives you fabric you like. A slightly off gauge with good drape beats a perfect gauge number with stiff fabric."
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
    techniqueEffect: "Evenly spaced increases and decreases create smooth, gradual shaping that is visually invisible in the finished fabric. When distributed correctly, shaping appears as a subtle narrowing or widening that follows the contour of the body, creating garments that fit well without visible jogs or puckers. The technique affects fabric density, each decrease removes yarn from the row and can slightly compress adjacent stitches, while increases add yarn that may appear slightly looser than surrounding stitches if not worked tightly. The visual effect depends on stitch choice: paired decreases (like SSK and K2tog) in knitting create a visible decrease line on either side that emphasizes the shaping, while centered or invisible decreases create seamless tapering. Proper distribution prevents the catastrophic visual failure of bunched shaping: all decreases worked consecutively creates a dramatic jog and irregular fabric distortion.",
    techniqueSteps: [
      "Determine your starting stitch count (current stitches on needle) and target stitch count (desired final width).",
      "Calculate the difference between starting and target counts, this is the total number of stitches to increase or decrease.",
      "Divide the total stitches to change by the number of shaping rows or rounds to get the base interval (e.g., decrease every 6th row).",
      "If the division leaves a remainder, split the increases or decreases into two groups: some at the base interval and some at the interval plus one, distributing remainders evenly across the total rows."
    ],
    fiberNotes: "The appearance and durability of shaping depend on the actual yarn, stitch pattern, tension, change method, and treatment. Do not assign behavior from a broad fiber category. Work a representative swatch and follow the pattern and product care instructions.",
    practiceProject: "For a simple arithmetic check, start with 40 stitches and set a target of 30 stitches. The difference is 10 stitches, so distributing 10 single-stitch decreases leaves 30 stitches. Follow the selected pattern for the decrease method, placement, edge stitches, and whether changes are worked singly or in pairs.",
    introduction: {
      title: "Why You Need an Increase and Decrease Calculator",
      paragraphs: [
        "The pattern says \"increase 12 stitches evenly across the next row\", but how exactly do you space them so the fabric looks smooth and professional? Uneven distribution creates visible lumps and puckers that no amount of blocking will fix. The math is simple in theory but tricky to execute by hand.",
        "Even experienced knitters pause when they encounter evenly spaced shaping instructions. The division rarely comes out to a clean whole number, and distributing the remainders correctly requires careful planning. This calculator handles the arithmetic instantly so you can focus on the craft itself.",
      ],
    },
    whatIs: {
      title: "What Is Even Stitch Distribution?",
      paragraphs: [
        "Even stitch distribution is the mathematical process of spacing increases or decreases uniformly across a row or round so the shaping is invisible in the finished fabric. Rather than clumping all the changes in one area, you spread them at regular intervals to maintain consistent fabric tension and appearance.",
        "This technique appears constantly in pattern construction, transitioning from ribbing to body gauge, shaping sleeve caps, adjusting hat crown decreases, and forming waist shaping on garments. Mastering the distribution math is fundamental to professional-quality results in any shaped knitting or crochet project.",
        "The challenge is that the total stitch count rarely divides evenly by the number of increases or decreases. You need a strategy for distributing remainder stitches so the spacing looks uniform to the eye even when the intervals are not perfectly identical across every section.",
      ],
    },
    howCalculated: {
      title: "How Stitch Distribution Is Calculated",
      paragraphs: [
        "Start with the current stitch count and the target count. If you have 80 stitches and need to increase to 92, that means 12 increases to distribute. Divide the current count by the number of increases: 80 divided by 12 equals 6.67, which tells you the base interval is every 6 stitches with some left over.",
        "The remainder determines how many sections get an extra stitch. With 80 stitches and 12 increases, 12 times 6 is 72, leaving 8 remainder stitches. So 8 of your 12 sections will be 7 stitches long and the remaining 4 sections will be 6 stitches long, producing an almost invisible distribution.",
        "The calculator outputs the exact sequence, for example, work 7, increase, work 7, increase (repeat 7 more times), then work 6, increase, work 6, increase (repeat 3 more times). This row-by-row instruction eliminates counting errors and produces beautifully even shaping every time.",
      ],
    },
    howToUse: {
      title: "How to Use the Increase & Decrease Calculator",
      paragraphs: [
        "Enter your starting stitch count, the number of stitches currently on your needle or hook. Enter your target stitch count, the number you need after all increases or decreases are worked. Then enter the number of rows or rounds over which you want to distribute these changes. The calculator figures out whether you are increasing or decreasing based on which count is larger.",
        "The output gives you row-by-row instructions showing exactly where to work each increase or decrease across the row. If you need to go from 80 to 100 stitches over 10 rows, the calculator tells you which rows to increase on and how to space the increases within those rows.",
        "For single-row distribution (all changes in one row), set the row count to 1. The calculator will space the increases or decreases as evenly as possible across that row."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "\"Evenly spaced\" means the calculator distributes changes across the row so there is no bunching or clustering. If you are increasing 12 stitches across a row of 80, the increases land roughly every 6-7 stitches. When the number does not divide evenly, the calculator shows how to handle the remainder, typically by spacing the extra stitches at the beginning or end of the row.",
        "The row-by-row output assumes you work changes on the specified rows and work plain (no-change) rows in between. For knitting, increases and decreases are typically worked on right-side rows. The calculator accounts for this by distributing changes across the available shaping rows."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "For sleeve shaping, always work decreases at the same position, typically one stitch in from each edge, to create a tidy, visible decrease line along the seam.",
        "When shaping in the round, place increases at the same stitch marker position every time. This creates a consistent shaping line and makes it easy to count completed increases.",
        "Double-check your math by adding the number of increases to your starting count. The result should equal your target count exactly.",
        "If the calculator shows an awkward remainder (like one extra stitch at the end), place that extra change in the center of the row where it is least visible."
      ],
    },
  },

  "stripe-generator": {
    designPrinciples: "Stripe patterns rely on the principle of color repetition and visual rhythm. The width and sequence of colors create optical patterns that the human eye perceives as either balanced or dynamic depending on the ratio of color areas. Striping follows the mathematical concept of Fibonacci-inspired ratios, sequences like 1-2-3 or 2-3-5 create more visually interesting results than uniform widths because the eye expects variation. The alternation between warm and cool tones affects perceived width: light colors appear to expand, while dark colors appear to recede. Strategic color placement exploits these optical illusions to create depth and movement in flat fabric. Stripe patterns work because they leverage both mathematical harmony and color theory, allowing even a single yarn to become visually complex through deliberate sequencing.",
    patternVariations: [
      "Gradient fade variation, arrange colors from light to dark across the stripe sequence to create a subtle ombré effect where colors transition smoothly rather than appearing in distinct blocks, producing an elegant, high-fashion aesthetic.",
      "Bold colorblock variation, use alternating solid colors in equal-width stripes, moving from high-contrast color pairs (black and white, navy and cream) for maximum visual impact, ideal for modern blankets and bags.",
      "Random scrap variation, distribute colors with weighted probability based on leftover yardage amounts, ensuring all colors appear equally across the project while creating an organic, chaotic-looking finish that disguises the stash-busting origins."
    ],
    introduction: {
      title: "Why You Need a Stripe Pattern Generator",
      paragraphs: [
        "Planning stripes by hand means sketching color sequences, erasing, and hoping the proportions look right once you actually start knitting or crocheting. What seems balanced on paper often reads differently in yarn, and by the time you realize a stripe is too wide or too narrow, you have already committed rows of work.",
        "Stash-busting scrap yarn projects especially benefit from a generator that distributes colors with balanced randomness. Instead of agonizing over which leftover skein goes where, you enter your colors and yardage and let the algorithm handle the sequencing while you focus on the stitching.",
      ],
    },
    whatIs: {
      title: "What Is a Stripe Pattern Generator?",
      paragraphs: [
        "A stripe pattern generator is a tool that creates color sequences for striped knitting and crochet projects. It supports random, weighted, and structured sequence modes, producing a complete row-by-row plan with per-color yardage estimates so you know exactly how much of each color you need before casting on.",
        "Random mode distributes colors across the project with configurable minimum and maximum stripe widths, avoiding consecutive repeats of the same color. Weighted mode lets you assign a percentage to each color so that one shade dominates while others appear as accents.",
        "Structured mode generates repeating sequences like 2-4-2 or 1-3-5-3-1, giving you the visual rhythm of hand-planned stripes without the manual layout work. All modes output a visual preview strip alongside the numerical breakdown.",
      ],
    },
    howCalculated: {
      title: "How Stripe Sequences Are Generated",
      paragraphs: [
        "Consider a project with 3 colors in random mode, minimum stripe width of 2 rows, maximum stripe width of 6 rows, for a total of 200 rows. The generator picks a random width between 2 and 6 for each stripe, then assigns a color that differs from the previous stripe to prevent consecutive repeats.",
        "As stripes are assigned, the generator tracks the cumulative row count for each color. If color A has been used for 80 rows, color B for 70, and color C for 50, the algorithm weights the next assignment toward color C to keep the distribution roughly even, unless you have set custom weights.",
        "Per-color yardage is then calculated by multiplying each color\u2019s total row count by the estimated yards per row at your gauge and project width. For a 48-inch-wide blanket in worsted weight, each row uses approximately 4.5 yards, so 67 rows of one color would require about 302 yards.",
      ],
    },
    howToUse: {
      title: "How to Use the Stripe Pattern Generator",
      paragraphs: [
        "Enter the number of colors in your stripe sequence, anywhere from 2 to 10. Select a stripe width option: uniform (all stripes the same width), graduated (stripes that grow or shrink), or random. In random mode, the generator picks stripe widths within a range you define. You can also set structured repeating patterns like 2-4-2 or 1-3-5-3-1.",
        "The output shows the full color sequence as a visual stripe preview plus a row-by-row breakdown listing which color to use for each section. Per-color yardage estimates show how much of each color you need based on the stripe widths and your entered project dimensions."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Yardage estimates assume each stripe is worked at a consistent width. If you deviate from the generated widths, making some stripes wider or narrower as you go, the per-color proportions shift and the estimates will be off. Recalculate if you make changes.",
        "The color sequence in the output can be used exactly as shown or treated as a starting point. Many crafters use the generator for inspiration, then adjust individual stripe widths or swap colors based on what looks right once they start knitting."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "For stripes under 5 rows wide, carry the unused yarn loosely up the side of your work instead of cutting it. This eliminates dozens of ends to weave in.",
        "To prevent pooling artifacts in a long single-color stripe section, alternate two skeins of the same color every other row. Slight dye lot differences blend rather than creating a visible line.",
        "An odd number of stripe colors (3, 5, 7) generally creates more visual interest than an even number. Odd counts avoid the symmetrical ping-pong effect.",
        "For stash-busting, weigh your leftover yarn and enter the yardage for each color. The generator can work backward from your available yardage to determine stripe widths."
      ],
    },
    projectIdeas: {
      title: "Project Ideas for Striped Patterns",
      ideas: [
        "Stash-busting scrappy blanket, use random mode with 6–10 colors and all leftover DK or worsted weight to create a unique throw that uses up every partial skein.",
        "Baby blanket with 3-color pastel sequence, enter a 1-2-1 structured stripe for a clean, modern look that works in fingering or DK weight.",
        "Striped market bag, generate a 4-color sequence with narrow 2-row stripes for a bold candy-stripe tote in cotton yarn.",
        "Fair Isle-inspired color blocking, use graduated mode with one dominant neutral and two accent colors to create tonal stripes that mimic traditional colorwork.",
        "Dishcloth sampler set, run the generator 6 times with the same colors but different stripe widths to create a coordinated set where no two cloths are identical.",
        "Striped socks, enter a sock-height row count and 2–3 colors for a classic handknit look; the generator ensures you have enough of each color for both socks.",
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
    designPrinciples: "Stitch pattern compatibility relies on the least common multiple (LCM) mathematical principle, finding the smallest number divisible by all input multiples. Every stitch pattern repeats over a fixed number of stitches (the multiple) plus optional edge or balancing stitches (the offset). When combining patterns, the cast-on count must satisfy all patterns simultaneously, which means it must be divisible by the LCM of all the multiples. This prevents partial pattern repeats at edges, which appear unfinished and break the visual rhythm. The offset (the +1 or +2) accounts for stitches that sit outside the pattern repeat and ensure the pattern is optically centered or balanced. Understanding LCM allows crafters to mix any number of patterns in a single project without tedious manual calculation.",
    patternVariations: [
      "Modular panel variation, crochet or knit multiple rectangular panels using different stitch patterns that all share the same stitch multiple, then seam them together edge-to-edge with no transition rows needed.",
      "Border transition variation, use one stitch pattern for the main body and a different pattern for a border, calculating a stitch count where the body pattern divides evenly and the border pattern also divides evenly at the join line.",
      "Central motif variation, work a centered focal pattern (cable, lace, or colorwork) and surround it with a simple filler pattern (stockinette, garter, or single crochet) that can accommodate any stitch count."
    ],
    answerCapsule: "This calculator finds compatible stitch counts for sampler blankets and multi-pattern projects. Browse 50+ stitch patterns, enter their multiples, and get exact cast-on counts that work for every pattern section, no manual arithmetic needed.",
    internalLinks: [
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Calculate your stitches per inch to determine target width" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Check yarn weight compatibility for your project" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Find the right hook or needle size for your yarn" },
    ],
    introduction: {
      title: "Why You Need a Stitch Pattern Calculator",
      paragraphs: [
        "Planning a sampler blanket with shell stitch requiring a multiple of 6 plus 1 and waffle stitch requiring a multiple of 3, what cast-on count works for both panels? Finding a number that satisfies two or more stitch multiples by hand involves trial, error, and arithmetic that gets tedious fast.",
        "Any project combining different stitch patterns needs a compatible stitch count across all sections. Blanket panels, yoke transitions, and border-to-body joins all require this calculation. Getting it wrong means partial pattern repeats at the edges, which look unfinished and amateur regardless of your stitch quality.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch Pattern Calculator?",
      paragraphs: [
        "A stitch pattern calculator finds stitch counts that are compatible with one or more pattern repeats using the least common multiple (LCM). Every stitch pattern has a repeat, expressed as a multiple plus an offset, like \u201cmultiple of 6 + 1.\u201d The calculator finds counts that satisfy all entered repeats simultaneously.",
        "The offset accounts for edge or balancing stitches outside the repeating unit. Shell stitch might repeat over 6 stitches but need 1 extra stitch at the end to balance the last shell. The calculator incorporates these offsets so every pattern repeat is complete with no partial shells, cables, or lace motifs at the edges.",
        "When multiple patterns are entered, the calculator finds the LCM of their base multiples, then checks which offsets are compatible. It returns a list of valid stitch counts near your target width so you can choose the one closest to your desired dimensions.",
      ],
    },
    howCalculated: {
      title: "How Stitch Compatibility Is Calculated",
      paragraphs: [
        "The calculator uses the least common multiple of the base multiples. For shell stitch with a multiple of 6 and waffle stitch with a multiple of 3, the LCM of 6 and 3 is 6. This means every 6 stitches, both patterns complete a full repeat.",
        "Adding the offset, shell stitch needs multiples of 6 plus 1. So the compatible stitch counts are 7, 13, 19, 25, 31, and so on, each one a multiple of 6 with 1 added. The calculator checks that waffle stitch (multiple of 3 + 0) also works at these counts: 7 divided by 3 gives 2 remainder 1, so waffle needs adjustment. The tool flags conflicts and suggests the nearest counts that satisfy all patterns.",
        "For more complex combinations, say multiples of 8 + 2, 5 + 1, and 3 + 0, the LCM of 8, 5, and 3 is 120. The calculator then tests each offset combination against 120 to find valid totals, narrowing the list to counts near your target width at gauge.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch Pattern Calculator",
      paragraphs: [
        "Enter the stitch multiple for your pattern. A stitch multiple is written as a number plus a remainder, for example, \"multiple of 6 + 2\" means the pattern repeat requires 6 stitches, plus 2 extra edge stitches. Enter the base multiple (6) and the extra stitches (2) separately. Then enter your target cast-on count or desired width in inches with your gauge.",
        "The calculator returns the nearest compatible stitch counts above and below your target. If your target is 150 stitches and your pattern needs a multiple of 6 + 2, the calculator shows 146 (6 x 24 + 2) and 152 (6 x 25 + 2) as your options."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A stitch multiple of 6 + 2 means your total cast-on count must be a multiple of 6, plus 2 additional stitches. Those extra stitches are typically edge or balancing stitches that make the pattern symmetrical. The calculator's output gives you cast-on counts that satisfy this requirement, so every pattern repeat is complete with no partial repeats at the edges.",
        "If you are combining multiple stitch patterns in a sampler blanket, look for the lowest common multiple (LCM) of all your pattern multiples. The calculator can help you find a stitch count that works for all panels."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "For sampler blankets, choose stitch patterns that share a common multiple. Patterns with multiples of 2, 4, and 8 all divide evenly into a cast-on count based on 8.",
        "Seed stitch and garter stitch work at any stitch count. Use them as filler panels between patterned sections when your stitch multiples do not align.",
        "Always add selvedge stitches after calculating your pattern multiple, not before. Selvedge stitches sit outside the pattern repeat and are not part of the multiple.",
        "If a pattern lists its multiple as \"6 + 1\" and you want to add a border, calculate the border width in stitches and add it to the \"+1\" portion."
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
    chartGuide: "This converter maps UK crochet terminology to its US equivalent, showing the systematic one-step offset between the two systems. UK 'double crochet' (DC) equals US 'single crochet' (SC), UK 'half treble' (HTR) equals US 'half double crochet' (HDC), UK 'treble' (TR) equals US 'double crochet' (DC), and the pattern continues upward for taller stitches. You can enter individual terms for quick lookup or paste an entire pattern row instruction to convert all UK terms to US simultaneously, preserving numbers, punctuation, and non-stitch words. Search covers both abbreviated and full stitch names.",
    industryStandards: "The UK/US crochet terminology split originated in the early 20th century and reflects a difference in how the two countries named stitches. The US system names stitches based on yarn overs before hook insertion, single crochet has zero yarn overs before inserting. The UK system names stitches based on the number of loops created on the hook, double crochet creates two loops. This counting-system difference creates the systematic one-rung offset. Modern UK and US standards are maintained by respective craft organizations, and the terminology divide is internationally recognized. Nearly every UK pattern published since 1970 includes a note acknowledging the UK/US difference.",
    manufacturerNote: "Although the one-step offset is consistent and predictable, some vintage UK patterns (particularly 1940s–1960s) use terminology that differs even from modern UK usage, requiring guesswork about intent. Some non-English-speaking countries adopted UK terminology when standardizing their own crochet (Australia, India, South Africa) but occasionally made regional variations that don't map cleanly to either system. Yarn companies that import patterns sometimes create hybrid terminology, leaving ambiguity about whether a pattern was written for US or UK standards. The converter flags ambiguous vintage terminology where interpretations diverge.",
    introduction: {
      title: "Why You Need a UK to US Crochet Terms Converter",
      paragraphs: [
        "British crochet patterns use the same stitch abbreviations as American patterns but mean completely different stitches. A UK double crochet is actually a US single crochet, the names are shifted by one step. Getting this wrong does not just change the look of your project; it changes the size, drape, and stitch count entirely.",
        "If you have ever followed a UK pattern and ended up with fabric twice the height you expected, you have been bitten by this terminology gap. This converter remaps every UK crochet term to its US equivalent so you can follow any pattern from either side of the Atlantic without confusion.",
      ],
    },
    whatIs: {
      title: "What Is UK to US Crochet Term Conversion?",
      paragraphs: [
        "UK and US crochet use different names for the same stitches. The US system starts with single crochet as the shortest basic stitch. The UK system calls that same stitch double crochet. Every stitch name in the UK system is one step higher than its US equivalent, creating a systematic one-to-one offset.",
        "This converter automatically remaps UK abbreviations and full stitch names to their US counterparts, or vice versa. You can convert individual terms for quick reference or paste an entire pattern row and get the full US translation in one pass.",
      ],
    },
    howCalculated: {
      title: "How the Conversion Works",
      paragraphs: [
        "The conversion follows a consistent one-step offset between the two systems. UK double crochet (DC) equals US single crochet (SC). UK half treble (HTR) equals US half double crochet (HDC). UK treble (TR) equals US double crochet (DC). UK double treble (DTR) equals US treble (TR). The pattern continues for taller stitches.",
        "As a concrete example, a UK pattern instruction reading 3dc in next st converts to 3sc in next st in US terms. A row reading ch3, 2tr in next st, tr in each st across converts to ch3, 2dc in next st, dc in each st across. The stitch count stays the same, only the names change.",
        "The converter handles abbreviations, full stitch names, and vintage UK terminology, which sometimes differs from modern UK usage. It flags any term where vintage and modern interpretations diverge so you can check context in the original pattern.",
      ],
    },
    howToUse: {
      title: "How to Use the UK to US Crochet Terms Converter",
      paragraphs: [
        "Type a UK crochet term, abbreviated or full, and the converter returns the US equivalent. You can also paste an entire pattern row, and the converter will replace all UK terms with their US counterparts in one pass. Toggle the direction to convert from US to UK instead.",
        "The converter handles modern UK terminology, vintage UK terminology, and abbreviations. Vintage UK terms sometimes differ from modern UK terms for the same stitch, so the converter flags these cases and shows both the modern and vintage mappings."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Some vintage UK patterns use terminology that has since changed in modern UK usage. A term like \"double treble\" in a 1960s UK pattern may map to a different US stitch than the same term in a 2020 UK pattern. The converter flags any conversion where vintage and modern interpretations differ, so you can check context.",
        "For full-row conversions, the converter replaces only recognized stitch terms. Numbers, punctuation, and non-stitch words pass through unchanged. Review the converted row to confirm that the output reads correctly in context."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Print the conversion chart and keep it tucked inside any vintage pattern book. Having the reference on paper means no fumbling with a phone while working.",
        "UK \"double crochet\" = US \"single crochet.\" This is the single most common source of confusion between the two systems. Every stitch name is shifted up by one in UK terminology.",
        "Some UK patterns from the mid-20th century use terminology that differs even from modern UK usage. If the converter flags a term as ambiguous, check the original pattern's stitch count to determine the intended stitch.",
        "When converting full patterns, convert one row at a time and verify stitch counts match before moving to the next row."
      ],
    },
  },

  "circle-calculator": {
    designPrinciples: "Flat circles require precise increase mathematics based on stitch height and the geometry of circumference expansion. Every stitch has an inherent height-to-width ratio: single crochet is nearly square, half-double is taller-than-wide, and double crochet is significantly taller. To keep a circle flat as it grows outward, the number of increases per round must match this ratio. Single crochet needs six increases per round; half-double needs eight; double needs twelve. This is not arbitrary, it emerges from the mathematical relationship between the circumference growth and the stitch dimensions. Staggering increases (offsetting them each round so they do not stack) prevents the visible ridges and hexagonal points that arise when increases align vertically, distributing the expansion evenly around the full circumference.",
    patternVariations: [
      "Tightly cupped disk variation, use one hook size smaller than yarn weight recommends and work all planned rounds without modification, creating a fabric that naturally cups slightly; useful for hat crowns, basket bottoms, or decorative elements.",
      "Flat medallion variation, increase consistently round by round without ever beginning to decrease, creating a completely flat, growing circular disc that can reach any desired diameter; perfect for blanket centers or decorative wall hangings.",
      "Rippled edge variation, maintain the standard increase rate but switch to a stitch with more height (like treble) in the final few rounds, causing the edges to naturally ruffle and wave, creating a decorative scalloped appearance."
    ],
    introduction: {
      title: "Why You Need a Perfect Circle Calculator",
      paragraphs: [
        "Crocheting a flat circle that does not cup into a bowl or ruffle at the edges requires exactly the right number of increases per round. Too few increases and the fabric cups upward. Too many and the edges wave and ruffle. The correct number depends entirely on your stitch type.",
        "Whether you are making a hat crown, a basket bottom, a coaster, or a circular blanket, getting the increase rate right from round one saves you from frogging and reworking. This calculator generates the complete round-by-round pattern with staggered increases for a smooth, flat circle every time.",
      ],
    },
    whatIs: {
      title: "What Is a Crochet Circle Pattern?",
      paragraphs: [
        "A crochet circle pattern is a round-by-round set of instructions that produces a flat circular piece of fabric. It starts with a small center ring and expands outward by adding a fixed number of increases in each round. The increase count per round depends on the height-to-width ratio of the stitch being used.",
        "Staggered increases are the key to a smooth circle versus a hexagonal shape. If you place every increase directly above the increase from the previous round, the increases stack and create visible points, turning your circle into a hexagon. Staggering offsets the increase positions each round, distributing them evenly around the circumference.",
        "Single crochet circles use six increases per round because single crochet has a nearly one-to-one height-to-width ratio. Half double crochet needs eight increases per round. Double crochet, being taller, requires twelve increases per round to keep the fabric flat.",
      ],
    },
    howCalculated: {
      title: "How Circle Patterns Are Calculated",
      paragraphs: [
        "The math starts with the stitch ratio. Single crochet has a nearly square profile, its height roughly equals its width. This means each round adds one stitch-width of circumference, requiring six new stitches per round to maintain a flat circle (based on the geometric relationship between radius and circumference).",
        "For a single crochet circle: start with six single crochet in a magic ring. Round two: increase in every stitch for twelve total. Round three: alternate one single crochet and one increase around for eighteen total. Each subsequent round adds six stitches, with the increases staggered to avoid stacking.",
        "The calculator handles the staggering math automatically, which becomes increasingly complex in later rounds. By round ten, you are working eight single crochet between increases, and the offset pattern requires careful tracking. The generated pattern eliminates counting errors and ensures a perfectly round result.",
      ],
    },
    projectExample: "Choose single crochet and 6 rounds. The pattern starts with 6 stitches in round 1 and adds 6 stitches per round, so round 6 finishes with 36 stitches. Work the generated increase placement as written, then lay the piece flat and check it before continuing beyond the planned circle.",
    commonMistakes: [
      "The generated increase schedule is a starting plan, not a guarantee that every yarn, hook, and tension combination will lie perfectly flat.",
      "A circle that cups or ripples should be checked against the actual fabric before adding rounds; hook size, stitch height, and personal tension can require adjustment.",
      "The selected round count controls the written pattern length, not a fixed finished diameter. Measure the work at your own gauge.",
    ],
    howToUse: {
      title: "How to Use the Perfect Circle Calculator",
      paragraphs: [
        "Select your stitch type, single crochet, half double crochet, or double crochet. Each stitch height requires a different number of increases per round to keep the circle flat. Enter the number of rounds you want, and the calculator generates a complete round-by-round pattern with exact stitch counts and increase placement.",
        "The output uses staggered increases, meaning the position of each increase shifts from round to round. This prevents the visible points that appear when increases stack directly on top of each other, giving you a smooth circular edge instead of a hexagon or star shape."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The pattern output shows the stitch count for each round and marks exactly where to place increases. For single crochet circles, each round adds 6 increases. For half double crochet, 8 per round. For double crochet, 12 per round. These numbers match the mathematical requirement for a flat circle at each stitch height.",
        "The staggering pattern offsets increases so they do not align vertically across rounds. Without staggering, increases stack and create visible ridges that pull the circle into a polygon shape. The calculator's staggered placement distributes the increases around the full circumference of each round."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Place a stitch marker at the beginning of each round. Flat circles worked in a continuous spiral have no visible row break, and it is easy to lose your place without a marker.",
        "For large circles like basket bottoms or rug bases, go up one or two hook sizes from the yarn label recommendation to prevent the circle from cupping.",
        "If your circle cups upward instead of lying flat, your tension is too tight or you need fewer increases per round. Try a larger hook before modifying the pattern.",
        "For oval shapes, add a foundation chain between the starting increases. The calculator generates true circles, ovals require a different construction method."
      ],
    },
    projectIdeas: {
      title: "Project Ideas Using Crochet Circles",
      ideas: [
        "Coasters, a 5-round single crochet circle in cotton yarn makes a firm, absorbent coaster. Work 8–10 rounds for a placemat.",
        "Basket base, generate a 12-round double crochet circle for a sturdy basket bottom, then continue without increases for the sides.",
        "Circular bag base, a 15-round half double crochet circle in a sturdy cotton-linen blend creates a flat base for a market bag or bucket bag.",
        "Amigurumi sphere, combine two matching circles and decrease back down to the center for a perfectly round stuffed ball or head.",
        "Circular blanket, work a large-scale double crochet circle using bulky yarn and a 12mm hook for a lap blanket that grows from the center.",
        "Hat crown, generate a 7-round single crochet circle as the starting point for a top-down hat, then stop increases and continue even for the body.",
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
    designPrinciples: "Amigurumi shapes rely on sphere mathematics and controlled increase/decrease schedules to transform flat crochet into three-dimensional forms. A sphere requires exactly six increases per round to maintain flatness, this ratio emerges from the circumference-to-radius relationship in geometry. Each stitch height (single crochet, half-double crochet) has an inherent height-to-width ratio that determines how many increases are needed per round to keep the fabric lying flat rather than cupping or ruffling. Cones and cylinders use the same six-per-round increase rate but vary whether decreases are applied. The tight gauge and continuous spiral construction create dense, seamless fabric that holds stuffing without showing gaps. Understanding these geometric principles lets makers scale shapes up or down and adjust proportions without consulting patterns.",
    patternVariations: [
      "Tapered cone variation, increase consistently without ever decreasing, creating a smooth cone from tip to base; vary the number of rounds to control the slope steepness and final circumference.",
      "Pear shape variation, increase to a point, work several even rounds, then decrease slightly (but not back to the starting point), creating an asymmetrical bulge useful for bodies, heads with chins, or organic character shapes.",
      "Weighted ball variation, stuff firmly and evenly, then decrease more aggressively in the final rounds before closing, creating a dense, heavy ball that sits stably rather than rolling; useful for weighted bases and soles."
    ],
    introduction: {
      title: "Why You Need an Amigurumi Shapes Guide",
      paragraphs: [
        "Every amigurumi toy is built from basic geometric shapes, spheres for heads, cones for limbs, cylinders for bodies, and ovals for feet. Mastering these foundational shapes lets you design original characters without depending on someone else's pattern for every new project.",
        "Getting the increase and decrease rates right determines whether your sphere looks like a ball or a football, whether your cone tapers smoothly or steps awkwardly. This calculator generates precise round-by-round patterns for each shape so your amigurumi pieces come out clean and symmetrical every time.",
      ],
    },
    whatIs: {
      title: "What Are Amigurumi Shapes?",
      paragraphs: [
        "Amigurumi shapes are three-dimensional crochet forms created by strategically placing increases and decreases in a continuous spiral of single crochet. A sphere increases to a midpoint, works several even rounds, then decreases symmetrically. A cone increases gradually without decreasing. A cylinder increases to the target width and then works even rounds indefinitely.",
        "All amigurumi shapes use single crochet worked in a continuous spiral, no joining slip stitches, no turning chains. The tight, dense fabric this creates prevents stuffing from showing through. Using a hook one or two sizes smaller than the yarn label recommends produces the firm fabric that amigurumi requires.",
        "These shapes are the building blocks that combine into finished toys. A bear is two spheres (head and body), four cones (limbs), and two small ovals (ears). Understanding how each shape is constructed gives you the freedom to modify proportions and design your own characters from scratch.",
      ],
    },
    howCalculated: {
      title: "How Amigurumi Shape Patterns Are Calculated",
      paragraphs: [
        "Each shape follows a defined increase and decrease schedule. A sphere starts with six single crochet in a magic ring, then adds six stitches on each increase round. The generator uses half of the selected total, rounded down, for the buildup phase; that count includes the opening magic-ring round. It then works one center round for an even total or two center rounds for an odd total.",
        "The remaining numbered rounds decrease by six stitches at a time until six stitches remain. For a 12-round sphere, that is a six-round buildup consisting of one foundation round and five increase rounds, followed by one even round and five decrease rounds. Stuff before the opening becomes too small, then close the final six stitches with the yarn tail.",
        "A cone adds six stitches on alternating rounds for a gradual taper. A cylinder builds a flat base for the selected number of base rounds, then works even to the selected total. The oval starts around both sides of a foundation chain, so its control uses starting-chain length instead of total rounds.",
      ],
    },
    projectExample: "Choose Sphere / Ball and 12 total rounds. The generator works 1 foundation round and 5 increase rounds to reach 36 stitches, then 1 even round at 36 stitches and 5 decrease rounds, ending with 6 stitches on round 12 before the closing note.",
    commonMistakes: [
      "Total rounds controls the number of numbered instructions; it does not guarantee a particular finished diameter because yarn, hook size, and tension change gauge.",
      "Stuffing amount changes the finished shape. Add filling gradually and compare the piece from several angles before the opening becomes too small.",
      "The generated forms are basic starting shapes. Limbs, weighted bases, safety requirements, and child-safe finishing can require project-specific construction choices.",
    ],
    howToUse: {
      title: "How to Use the Amigurumi Shapes Guide",
      paragraphs: [
        "Select a sphere, cone, cylinder, or oval. Sphere, cone, and cylinder use the Total rounds control; a cylinder also asks how many of those rounds build the flat base. An oval uses the starting-chain length. The calculator generates single-crochet instructions for the selected control values.",
        "The output lists every numbered round and its stitch count. A sphere increases to its widest section and then decreases to close; a cone increases on alternating rounds; a cylinder works even after its base; and an oval works around both sides of the starting chain. Check the resulting fabric at your own gauge before treating it as a final size."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each round lists the total stitch count and the specific increase or decrease placement within that round. The final round count at the widest point determines the circumference of the shape. At a gauge of 5 single crochet per inch, a widest round of 30 stitches produces a shape approximately 6 inches in circumference, or about 2 inches in diameter.",
        "The continuous spiral construction means there is no slip stitch join and no turning chain between rounds. Place a locking stitch marker at the first stitch of each round and move it up as you work. Stuff the shape firmly before closing, understuffed amigurumi lose their shape over time."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use a hook one or two sizes smaller than the yarn label recommends. Amigurumi fabric must be tight enough that stuffing does not show through the stitches.",
        "Start every shape with a magic ring, not a chain ring. The magic ring closes completely with no center hole, which prevents stuffing from poking through.",
        "Place a locking stitch marker at round 1 before you start and move it up every round. Losing your place in a continuous spiral means frogging and restarting.",
        "Stuff shapes as you go, adding filling every few rounds. Trying to stuff a nearly-closed sphere through a tiny opening results in uneven, lumpy filling."
      ],
    },
    projectIdeas: {
      title: "Project Ideas Using Amigurumi Shapes",
      ideas: [
        "Simple stuffed ball, create a single sphere (one 10-round pattern) stuffed with fiberfill for a cat toy, rattle, or juggling ball; use DK or worsted weight for a ball 2-3 inches in diameter.",
        "Basic teddy bear character, combine two spheres (one for the head, one larger for the body), four cones (limbs), and two small spheres (ears) to create a simple bear; add embroidered or button eyes.",
        "Amigurumi mushroom, crochet one large sphere and one cone in contrasting colors, then seam the cone base to the top of the sphere; make multiple with different color combinations for a whimsical woodland scene.",
        "Keychain charm set, make five to six small amigurumi shapes (1-2 inches), stuff lightly, and attach keyring hardware; perfect for gift sets or personal collection.",
        "Amigurumi octopus toy, crochet one medium sphere for the head and eight long cones for tentacles, then seam all eight legs to the base of the sphere; add a curl by running the cone tip through embroidery thread.",
        "Weighted decorative pebbles, create small smooth spheres in various yarn colors, stuff very firmly, and display in a bowl; useful for sensory play or decorative scatter."
      ],
    },
  },

  "cross-stitch-calculator": {
    skillLevel: "Beginner",
    techniqueEffect: "Cross stitch's visual effect is determined almost entirely by fabric count, it controls the finished size, the apparent detail level, and the visual fidelity of the design. Higher counts (18, 22 Aida) produce smaller, finer stitches with photographic detail and smoother color transitions; lower counts (11, 14 Aida) produce larger stitches with blocky, pixelated detail. The technique is uniquely visual: the same pattern on different counts produces dramatically different aesthetic results without changing the design itself. Aida 14 might look cartoony and bold; the same design on Aida 22 appears refined and detailed. The fabric count also affects thread consumption, higher counts use proportionally more thread per stitch because stitches are smaller and more densely packed.",
    techniqueSteps: [
      "Determine your pattern dimensions in stitch count (width and height) from the pattern documentation.",
      "Select your fabric count based on desired finished size and detail level.",
      "Divide pattern width by fabric count to calculate finished width in inches; repeat for height.",
      "Add appropriate borders (3-4 inches for framing, 4-6 inches for hooping) and purchase fabric to those dimensions."
    ],
    fiberNotes: "Fabric content (Aida cotton versus linen versus hand-dyed aida) does not affect the size calculation, but it affects stitch appearance and experience. Cotton Aida is stiff, predictable, and easiest for beginners; linen is softer and more elegant but has subtle weave variation that requires more attention to keep stitches even. Hand-dyed fabrics add visual richness but require careful thread color selection to ensure contrast. Regardless of content, higher thread count fabrics (18 and above) demand finer thread, using thick thread on 18-count creates bunching and distorted stitches.",
    practiceProject: "Stitch a small test sampler (50 x 50 stitches) on 14-count Aida using a simple design (a small geometric or floral motif). This creates a finished piece about 3.5 x 3.5 inches, giving you experience with the medium without committing to a large project. Repeat the same design on 18-count Aida and compare how the higher count changes the appearance and finished size.",
    introduction: {
      title: "Why You Need a Cross Stitch Size Calculator",
      paragraphs: [
        "Your pattern is 150 by 200 stitches, but how big will it actually be when stitched on Aida 14 versus Aida 18? And once you know the finished size, how much fabric do you need to buy with enough margin for hooping and framing? These two questions stop more cross stitch projects before they start than any other.",
        "Fabric count changes everything about a cross stitch project, the finished dimensions, the level of detail visible to the eye, the number of strands to use, and the total thread consumption. A size calculator lets you compare counts side by side before committing to fabric and floss purchases.",
      ],
    },
    whatIs: {
      title: "What Is a Cross Stitch Size Calculator?",
      paragraphs: [
        "A cross stitch size calculator converts a pattern\u2019s stitch dimensions into physical finished dimensions based on your chosen fabric count. Fabric count is the number of stitchable squares per inch, Aida 14 has 14 squares per inch, Aida 18 has 18. Higher counts produce smaller, finer stitches and a smaller finished piece.",
        "Beyond finished size, the calculator estimates fabric yardage needed by adding a border margin on all sides for hooping, framing, or finishing. It can also estimate DMC thread consumption per color based on stitch coverage, helping you build an accurate shopping list before you start stitching.",
      ],
    },
    howCalculated: {
      title: "How Cross Stitch Dimensions Are Calculated",
      paragraphs: [
        "The formula divides the stitch count by the fabric count. For a 150 by 200 stitch pattern on Aida 14: 150 divided by 14 equals 10.7 inches wide, and 200 divided by 14 equals 14.3 inches tall. That is your finished design size before any border or framing allowance.",
        "To determine fabric purchase size, add a margin on each side, typically 3 inches for framing or 4 inches for scroll frame hooping. Using the example above: 10.7 plus 6 inches (3 per side) equals 16.7 inches wide, and 14.3 plus 6 equals 20.3 inches tall. Round up to the nearest available cut size.",
        "Thread estimation multiplies the stitch count for each color by an average thread length per stitch, which varies by fabric count and number of strands. On Aida 14 with two strands, each cross stitch uses approximately 1 inch of floss. A color covering 500 stitches needs about 500 inches, or roughly 14 yards, two standard skeins.",
      ],
    },
    howToUse: {
      title: "How to Use the Cross Stitch Size & Thread Calculator",
      paragraphs: [
        "Enter your fabric count, the number of squares per inch on your fabric. Standard Aida counts are 11, 14, 16, and 18. For evenweave and linen, enter the thread count divided by 2 (since you stitch over two threads). Then enter your design dimensions in stitch count, width and height, as listed in your pattern.",
        "The calculator returns the finished design dimensions in inches and centimeters, the total fabric size you need (with border allowance), and an estimated thread amount based on stitch coverage."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Fabric count directly determines the finished size of your design. A 140 x 200 stitch design on 14-count Aida finishes at 10 x 14.3 inches. The same design on 18-count finishes at 7.8 x 11.1 inches. Higher fabric count means smaller stitches and a smaller finished piece. Choose your count based on the level of detail you want and the finished size you need.",
        "Thread estimates are approximate and assume standard cross stitch coverage with no specialty stitches. Backstitching, French knots, and fractional stitches use additional thread that the basic estimate does not include. For a project with heavy backstitching, add 15-20% to the thread estimate for outline colors."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Add 3-4 inches of fabric border on all sides beyond your design dimensions. You need this margin for hooping, framing, and finishing.",
        "On 14-count Aida, two strands of DMC floss is standard for cross stitches. On 18-count, use one strand for a cleaner look. On 11-count, two or three strands depending on desired coverage.",
        "Backstitch outlines add thread consumption but dramatically increase visual impact and definition. Budget extra thread for any color used in outlining.",
        "Grid your fabric with washable thread or markers before starting large projects. Counting errors compound quickly, and gridding prevents having to rip out hundreds of stitches."
      ],
    },
  },

  "weaving-sett-calculator": {
    skillLevel: "Advanced",
    techniqueEffect: "Weaving sett directly controls fabric hand and durability. Correct sett creates cloth that is neither sleazy (threads shift and gaps appear) nor stiff (threads pack so tightly the fabric loses drape). The visual effect is profound: too-loose sett produces open fabric where warp and weft are clearly visible as separate systems; correct sett balances the two so they appear visually integrated; too-tight sett produces dense, stiff fabric suitable only for rugs or upholstery. Sett also affects shrinkage percentage and wet-finish behavior, tightly set fabric shrinks less (threads are already compressed and have less room to move), while loosely set fabric shrinks more. The technique determines whether your finished cloth drapes beautifully or stands away from the body stiffly.",
    techniqueSteps: [
      "Wrap the target yarn around a ruler for one inch, keeping wraps touching but not overlapping, and count the wraps per inch (WPI).",
      "Select your weave structure (plain weave, twill, satin, or lace) based on your project.",
      "Apply the structure-specific multiplier: plain weave = 50% of WPI, twill = 60% of WPI, satin = 70% of WPI, lace = 40% of WPI.",
      "Round the result to the nearest whole number for your ends per inch (EPI) sett recommendation."
    ],
    fiberNotes: "Different fibers behave dramatically differently at various setts. Wool accepts both tight and loose setts gracefully, producing beautiful cloth across a range. Cotton needs slightly tighter sett than wool for the same yarn weight, the lack of elasticity means loose sett produces obviously gappy fabric. Linen accepts very dense sett beautifully without becoming stiff because of its natural smoothness; linen cloth can be tightly set and still drape. Alpaca and mohair require careful consideration of sett, tight sett can compress the loft out of these fibers, while loose sett makes them appear fuzzy and uncontrolled. Blended fibers (wool/silk, cotton/linen) sett according to the dominant fiber's characteristics.",
    practiceProject: "On a rigid heddle loom (which has fixed sett teeth), measure the WPI of a worsted weight yarn, calculate what sett you would need for plain weave, and identify which heddle dent (8, 10, or 12) is closest. Warp the loom and weave a 12-inch sampler, noting how the fabric hand and appearance compares to your expectations based on the sett calculation.",
    introduction: {
      title: "Why You Need a Weaving Sett Calculator",
      paragraphs: [
        "Wrong sett in weaving creates fabric that is either sleazy, so open that warp threads shift and gaps appear, or stiff as a board because the threads are packed too tightly to interlace with any drape. Getting your ends per inch right before warping is the single most important decision in any weaving project.",
        "Sett depends on yarn thickness, weave structure, and intended fabric hand. A yarn that works beautifully in plain weave at 10 ends per inch might need 12 or 14 for twill. Calculating sett from your measured wraps per inch removes the guesswork and prevents the heartbreak of cutting a failed project off the loom.",
      ],
    },
    whatIs: {
      title: "What Is a Weaving Sett Calculator?",
      paragraphs: [
        "A weaving sett calculator determines the ideal ends per inch (EPI) for your warp based on your yarn\u2019s wraps per inch (WPI) and your chosen weave structure. Sett is the spacing of warp threads across the width of the loom, it controls how densely the threads pack and directly determines the fabric\u2019s weight, drape, and durability.",
        "Different weave structures require different sett densities because of how warp and weft interact. Plain weave, where every thread alternates over-under, needs the most open sett. Twill, where threads float over two or more before interlacing, allows a denser sett. Satin, with even longer floats, can be set denser still.",
        "The calculator also computes total warp ends and warp length. Multiply EPI by the weaving width to get total ends, then add loom waste and shrinkage allowance to the desired finished length to get the total warp length you need to measure and wind.",
      ],
    },
    howCalculated: {
      title: "How Weaving Sett Is Calculated",
      paragraphs: [
        "Start by measuring your yarn\u2019s wraps per inch: wrap the yarn around a ruler for one inch with wraps touching but not overlapping. If you count 16 wraps in one inch, your yarn is 16 WPI. This measurement is the foundation of all sett calculations.",
        "Plain weave uses approximately 50 percent of the WPI as the sett. So 16 WPI times 0.5 equals 8 EPI. Twill uses about 60 percent: 16 times 0.6 equals 9.6, which you round to 10 EPI. Satin uses about 70 percent. These percentages account for the space each weft pick needs to interlace between the warp threads.",
        "To find total warp ends, multiply the sett by the weaving width. For a 20-inch-wide scarf at 10 EPI, you need 200 warp ends. Add 2 floating selvedge threads (one on each side) for a total of 202 ends to wind. Then multiply the desired length plus loom waste (typically 18 to 24 inches) for total warp yardage.",
      ],
    },
    howToUse: {
      title: "How to Use the Weaving Sett Calculator",
      paragraphs: [
        "Enter your yarn's wraps per inch (WPI), the number of times the yarn wraps side by side in one inch without overlapping or leaving gaps. Select your weave structure: plain weave, twill, satin, or lace. The calculator returns the recommended sett in ends per inch (EPI) and can also calculate total warp ends and warp length based on your project dimensions.",
        "The relationship between WPI and sett depends on the weave structure. Plain weave typically sets at half the WPI. Twill sets denser because the float structure allows threads to pack more closely. Lace weave sets more openly to allow the pattern gaps to show."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "EPI (ends per inch) is the number of warp threads per inch across the width. PPI (picks per inch) is the number of weft passes per inch along the length. For a balanced weave, where warp and weft are equally visible, EPI and PPI should be roughly equal. If your EPI is higher than PPI, the warp dominates and you get a warp-faced fabric. Lower EPI relative to PPI creates a weft-faced fabric.",
        "Sett affects both the drape and structure of your finished cloth. A tighter sett (more EPI) produces a firmer, stiffer fabric suitable for bags, upholstery, and rugs. A looser sett creates drapey fabric for scarves and garments. The calculator's recommendation is a starting point, always weave a sample to confirm the hand of the fabric."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure WPI by wrapping your yarn around a ruler for one inch. Do not overlap wraps or leave visible gaps between them. The wraps should sit side by side, just touching.",
        "Wool shrinks 10-20% in wet finishing. Add that percentage to both your warp length and weft calculations. Cotton shrinks 3-5%. Linen shrinks minimally.",
        "For rigid heddle weaving, your sett is fixed by the heddle you own (typically 8, 10, or 12 dent). Check that your yarn's recommended sett is compatible with your heddle before warping.",
        "Tie on 6-8 extra warp inches beyond your project length for loom waste. The yarn between the breast beam and back beam cannot be woven."
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
    designPrinciples: "Color pooling operates on the principle of pattern intersection, the convergence of two patterns (the variegated yarn's color repeat and the stitch grid) to create emergent geometry. The yarn's color repeat is fixed; the stitch count is variable. When these align, colors stack vertically into stripes. A one-stitch shift per row creates diagonals. This exploits the mathematical relationship between circumference and row height. The phenomenon resembles Moiré patterns in textiles and digital displays, the interaction of two grids creates unexpected visual results. Unlike random variegation that reads as speckled, planned pooling demonstrates how precise control of stitch count transforms apparent chaos into order. The color repeat acts as a hidden measurement system that the knitter or crocheter makes visible through deliberate stitch placement.",
    patternVariations: [
      "Vertical argyle variation, choose a stitch count that is an exact multiple of the color repeat length, causing each color to stack directly above itself and creating crisp vertical stripes; use complementary colors in the yarn's sequence to maximize visual impact.",
      "Diagonal shift variation, set the stitch count one stitch wider or narrower than a clean multiple of the color repeat, forcing each color to shift position per row and creating a diagonal pooling effect; the shift direction depends on whether the count is higher or lower than the multiple.",
      "Random antipool variation, intentionally choose a stitch count that does not align with the color repeat, scrambling the color positions into a seemingly random speckled pattern that appears similar to how the yarn looks on a ball but was created through deliberate planning."
    ],
    introduction: {
      title: "Why You Need a Color Pooling Calculator",
      paragraphs: [
        "Variegated yarn creates random-looking color patches across your fabric, unless you control the stitch count to stack those colors into argyle or plaid patterns. Planned pooling turns apparent chaos into precise geometry, but the math has to be exact or the effect falls apart completely.",
        "Getting the right stitch count by trial and error means frogging and restarting dozens of times. This calculator does the math for you, finding the stitch counts that align your yarn's color repeat into clean vertical columns or diagonal lines on the very first try.",
      ],
    },
    whatIs: {
      title: "What Is Color Pooling?",
      paragraphs: [
        "Color pooling is a technique that manipulates stitch count to force variegated yarn colors into intentional geometric patterns. Instead of the random speckled look most variegated yarns produce, planned pooling creates argyle diamonds, vertical stripes, or diagonal plaid effects using a single strand of yarn.",
        "The technique works because variegated yarns repeat their color sequence at a fixed interval. If your row width matches that interval, or a precise multiple of it, each color lands in the same position every row, stacking into columns. Shifting by one stitch per row creates diagonals instead.",
        "Color pooling works in both knitting and crochet, though crochet is more common because single crochet produces a nearly square stitch that aligns colors more predictably. The key variable is matching your stitch count to the yarn's color repeat length.",
      ],
    },
    howCalculated: {
      title: "How Color Pooling Stitch Counts Are Calculated",
      paragraphs: [
        "Start by measuring your yarn's color repeat. Suppose your variegated yarn cycles through four colors over fifteen stitches, five stitches of blue, three of green, four of gold, and three of cream. That fifteen-stitch repeat is the foundation of every pooling calculation.",
        "Your foundation chain should equal fifteen stitches or a multiple of fifteen. At exactly fifteen stitches per row, each color stacks directly above itself, creating vertical stripes. Each row that shifts by one stitch, say sixteen stitches wide, creates a diagonal pooling effect instead.",
        "The calculator tests stitch counts near your target width and identifies which ones produce vertical alignment, which create diagonal shift, and which result in random pooling. This saves hours of swatching by narrowing the field to the two or three counts most likely to produce clean results.",
      ],
    },
    howToUse: {
      title: "How to Use the Color Pooling Calculator",
      paragraphs: [
        "Enter the color repeat length of your variegated yarn, the number of stitches it takes to complete one full cycle through all colors in the yarn. You can measure this by working a swatch in your target stitch and counting how many stitches it takes to return to the starting color. Then enter the target stitch count for your project width.",
        "The calculator finds stitch counts near your target that align with the yarn's color repeat to produce intentional argyle, plaid, or diagonal pooling effects. It shows which stitch counts create vertical alignment (argyle), which create diagonal shift, and which create random pooling."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Color pooling works when the stitch count per row aligns precisely with the color repeat length of the yarn. If your yarn changes color every 20 stitches and your row is exactly 20 stitches wide, each color lands in the same position every row, creating vertical stripes. At 21 stitches, each color shifts one stitch per row, creating a diagonal. At 22, the shift accelerates.",
        "The calculator marks stitch counts that produce argyle-style pooling, which requires the color repeat to span exactly two rows in a staggered alignment. Slight deviations, even one stitch off, disrupt the pattern. This is why swatching is non-negotiable for color pooling projects."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Swatch before casting on a full project. Even small gauge differences, a quarter stitch per inch, shift the color alignment enough to break the pooling pattern.",
        "Variegated yarns with 6-8 distinct color sections per repeat work best for pooling. Yarns with gradual color transitions or very short repeats produce muddy results.",
        "Use a simple stitch pattern, stockinette, moss stitch, or single crochet. Complex stitch patterns disrupt the consistent stitch width that pooling depends on.",
        "If pooling breaks partway through your project, your tension has shifted. Check your gauge and adjust hook or needle size before continuing."
      ],
    },
    projectIdeas: {
      title: "Project Ideas Using Color Pooling",
      ideas: [
        "Pooling socks, find a variegated fingering weight yarn with 8-12 distinct colors per repeat, calculate the perfect stitch count for vertical pooling, and create socks where the colors align into bold stripes.",
        "Argyle market bag, use a worsted-weight variegated yarn in a single-crochet rectangle with a stitch count that produces argyle-pattern pooling; the diamond geometry gives a sophisticated, deliberately designed appearance.",
        "Baby blanket with pooled diamonds, crochet a blanket where the main color is a carefully selected variegated yarn set to pooling, with a contrasting solid-color border that frames the intentional color patterns inside.",
        "Pooled sweater yoke, work the yoke in a simple stockinette stitch using a semi-variegated yarn whose color repeat length matches your yoke stitch count, allowing the colors to stack vertically and create invisible patterning.",
        "Diagonal-pooling throw blanket, choose a variegated yarn and a stitch count one stitch off from a multiple of the color repeat to create diagonal color shifts that move across the blanket as you work rows.",
        "Scarf with controlled color blocking, plan a long scarf where different sections use different stitch counts (all still supporting pooling), creating multiple distinct color effects in a single project."
      ],
    },
  },

  "thread-converter": {
    chartGuide: "This converter maps embroidery thread colors between the four major 6-strand floss brands, DMC (the industry standard), Anchor, Cosmo, and Sulky, by numerical codes unique to each brand. The converter displays the source thread number, its full color name (when available), and the closest-matching equivalent number in each target brand. For example, DMC 310 (Black) converts to Anchor 403. The converter accepts batch input, paste an entire project thread list separated by commas and receive full palette conversions in one pass. Toggle lets you convert from any brand to any other. Entries where no exact match exists show the two or three closest options so you can choose which direction to lean in hue, value, or saturation.",
    industryStandards: "The three major embroidery floss manufacturers, DMC, Anchor, and Cosmo, each maintain proprietary color palettes and numbering systems developed independently. DMC, a French manufacturer founded in 1746, is the market leader and reference standard against which other brands are compared; most commercial patterns use DMC numbers. Color conversion uses systematic measurement under controlled lighting, color samples are compared under standardized daylight illumination (typically D65 standard). Conversion databases are maintained by major thread retailers and craft organizations, updated when manufacturers discontinue colors or add new shades. No standard organization certifies conversions as 'official,' so slight variations between published conversion charts are normal.",
    manufacturerNote: "Thread conversions represent 'closest visual matches' rather than identical dye formulas, two brands may both produce a medium blue, but the DMC and Anchor versions will differ in hue, saturation, value, or undertone when compared directly. Fluorescent and LED lighting can mask subtle differences obvious in natural daylight. Some colors have no reasonable equivalent in a target brand and are marked 'approximate.' Slight dye lot variations between production runs of the same color number can create visible differences in large color areas even within the same brand. Silk blends and specialty floss types (metallic, iridescent, variegated) have different conversion logic than standard 6-strand floss. Color conversion reliability is highest for neutrals and primaries, lower for pastels and complex blends.",
    introduction: {
      title: "Why You Need an Embroidery Thread Converter",
      paragraphs: [
        "Your cross stitch pattern lists DMC thread numbers, but your local needlework shop only carries Anchor. You need exact equivalents, not guesswork, one shade off on a skin tone or sky gradient and the whole piece looks wrong. Converting between thread brands should not require a wall chart and a magnifying glass.",
        "Whether you are substituting brands by necessity or preference, accurate thread conversion preserves the designer's color intent. This converter maps between major embroidery floss brands so you can shop confidently and stitch without second-guessing every color choice.",
      ],
    },
    whatIs: {
      title: "What Is Embroidery Thread Conversion?",
      paragraphs: [
        "Embroidery thread conversion is the process of finding the closest color match between different floss brands. Each manufacturer uses its own numbering system, DMC 310 is black, but in Anchor that same black is number 403, and in Cosmo it is 600. The numbers are unrelated across brands.",
        "Conversion databases map these numbers by comparing actual thread colors under standardized lighting conditions. The matches represent the closest available equivalent, not an identical dye formula. Two brands may both produce a medium blue, but subtle differences in hue, saturation, or sheen will always exist between manufacturers.",
        "The most commonly converted brands are DMC, Anchor, and Cosmo for hand embroidery floss. DMC is the most widely referenced in published patterns, making it the de facto standard that other brands are mapped against.",
      ],
    },
    howCalculated: {
      title: "How Thread Conversions Are Determined",
      paragraphs: [
        "Thread conversion is not math-based, it relies on systematic color matching methodology. Each thread brand's full color range is compared against every other brand's range under controlled, natural-spectrum lighting. The closest visual match becomes the recommended conversion.",
        "For example, DMC 310 (Black) maps to Anchor 403 and Cosmo 600. DMC 321 (Christmas Red) maps to Anchor 9046 and Cosmo 241. These mappings are maintained by thread suppliers and independent cross-reference databases, updated when brands add or discontinue colors.",
        "Because conversions are closest matches rather than identical dyes, always compare converted threads side by side in natural light before committing to a full project. Fluorescent and LED lighting can mask subtle color differences that become obvious in daylight.",
      ],
    },
    howToUse: {
      title: "How to Use the Embroidery Thread Converter",
      paragraphs: [
        "Enter a thread number from any supported brand, DMC, Anchor, Cosmo, or Sulky, and the converter returns the closest equivalent in all other systems. This converter is specifically for 6-strand embroidery floss, not perle cotton, sewing thread, or machine embroidery thread.",
        "You can enter a single thread number for a quick lookup or enter a list of numbers separated by commas to convert an entire project palette at once. The results show the source color name (where available) and the nearest match in each target brand."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Thread conversions represent the closest available color match between brands, they are not exact dye matches. Two brands may both make a \"medium blue,\" but the DMC version and the Anchor version will differ in hue, saturation, or value when placed side by side. For small projects or scattered colors, these differences are invisible. For large projects with significant color areas, the difference may be noticeable.",
        "The converter uses industry-standard cross-reference tables maintained by thread suppliers. Some colors have no close equivalent in another brand and are marked as approximate. For these colors, the converter shows the two nearest options so you can choose which direction to lean."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "DMC is the most universally available brand and the most commonly referenced in patterns. Use it as your base system when planning projects, then convert to other brands if needed.",
        "Anchor thread colors tend to run slightly different in saturation compared to their DMC equivalents. Anchor blues are often cooler, and Anchor reds may lean slightly more orange.",
        "For Cosmo conversions, the nearest DMC match may not look identical in person. Buy a single skein of the Cosmo equivalent and compare it against your DMC thread under natural light before purchasing a full project's worth.",
        "Thread aging affects color accuracy. A 10-year-old skein of DMC 310 may look slightly different from a new one. When converting brands for an ongoing project, buy all thread from the same production batch."
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
    designPrinciples: "Corner-to-corner crochet operates on diagonal geometry, each small block unit sits at a 45-degree angle to the overall fabric grid. This diagonal construction means the blanket grows outward in all directions simultaneously from the starting corner, reaching maximum width at the midpoint, then decreasing symmetrically to the opposite corner. The blocks themselves are rarely perfectly square; the height-to-width ratio depends on hook size, yarn weight, and individual tension, making gauge swatching essential for accurate sizing. The pixel-like nature of each block makes C2C ideal for graphgan charting, each block represents one unit of a digital image. The mathematical elegance is that the block count can be easily calculated from dimensions without worrying about stitch repeats or gauge compensation.",
    patternVariations: [
      "Graphgan pixel art variation, plan a simple image (portrait, landscape, logo) on graph paper with one color per block, creating a digitized version of the desired design with precise visual control.",
      "Solid color with texture variation, crochet each block in the main color but vary the interior stitch pattern (all blocks could use different textures like popcorn stitch or bobbles), creating visual interest within color blocks.",
      "Gradient colorway variation, assign blocks a color based on their position in the grid, creating a smooth transition from one corner's color family through the center to the opposite corner's color family."
    ],
    introduction: {
      title: "Why You Need a C2C Calculator",
      paragraphs: [
        "Corner-to-corner crochet creates stunning blankets, but the diagonal construction makes sizing tricky. Unlike traditional row-by-row crochet where you simply count stitches for width, C2C builds block by block at an angle. Without a calculator, figuring out how many blocks you need, and how many diagonal rows that translates to, involves math that is easy to get wrong.",
        "This calculator takes the guesswork out of C2C planning. Enter your gauge swatch measurements and desired blanket dimensions, and it tells you exactly how many blocks wide and tall to work, how many diagonal rows from start to finish, and how much yarn you will need. Plan with confidence before you pick up your hook.",
      ],
    },
    whatIs: {
      title: "What Is Corner-to-Corner (C2C) Crochet?",
      paragraphs: [
        "C2C is a crochet technique where you work diagonally across the fabric. Each unit, called a block or tile, is typically a small cluster of chain stitches and double crochets. You start with one block in a corner, add one block per diagonal row on the increase side until you reach the maximum width, then decrease back down to a single block in the opposite corner.",
        "The technique is beloved for graphgan blankets (blankets with pixel-art images), because each block acts like a pixel. It also produces a beautiful texture with subtle diagonal lines. C2C works up quickly once you get the rhythm, and the small, repetitive blocks make it an excellent travel or TV project.",
        "Because C2C blocks are often not perfectly square, they tend to be slightly wider than they are tall, or vice versa depending on your yarn and tension, measuring a gauge swatch in both directions is essential for accurate sizing. This calculator accounts for that asymmetry automatically.",
      ],
    },
    howCalculated: {
      title: "How the C2C Calculator Works",
      paragraphs: [
        "The calculator starts with your gauge swatch. You crochet a small test piece (at least 5 by 5 blocks), measure its width and height in inches, and enter those along with the block counts. The calculator divides to find the width and height of each individual block.",
        "Next, it divides your desired blanket dimensions by the per-block measurements and rounds to the nearest whole number. This gives you the number of blocks wide and blocks tall. The total block count is simply blocks wide times blocks tall.",
        "The diagonal row count, how many rows you work from the first corner to the last, equals blocks wide plus blocks tall minus one. If you provided a yarn-per-block measurement, the calculator multiplies total blocks by that value, converts inches to yards, and adds a 10 percent buffer for tails and joining.",
      ],
    },
    howToUse: {
      title: "How to Use the C2C Calculator",
      paragraphs: [
        "Start by crocheting a gauge swatch of at least 5 by 5 blocks using your chosen yarn and hook. Measure the width and height of the swatch in inches. Enter the block counts and measurements into the gauge section of the calculator.",
        "Then enter your desired blanket width and height in inches. The calculator converts these to block counts and shows you the actual finished dimensions after rounding. If the actual size differs from your target by more than an inch or two, adjust your target or try a different hook size to change your block dimensions.",
        "For yardage estimation, crochet one complete block, unravel it, and measure the length of yarn in inches. Enter this in the optional yarn-per-block field. The calculator uses this to estimate total yardage with a 10 percent buffer for safety. If you skip this field, you will still get all the block and row counts, just not the yardage estimate.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The layout shows your blanket as X blocks wide by Y blocks tall. The actual finished dimensions may differ slightly from your target because block counts must be whole numbers. Review the actual dimensions shown in the results and decide if the rounding is acceptable.",
        "The diagonal row count tells you how many rows you will work from start to finish. On the increase half, you add one block per row. On the decrease half, you remove one block per row. For rectangular blankets, there is also a middle section where you increase on one end and decrease on the other to maintain the row length.",
        "The yardage estimate includes a 10 percent buffer for tails, color changes, and minor tension variations. If you are doing a multi-color graphgan, you will need to calculate yardage per color based on how many blocks each color occupies in your chart. The total yardage shown assumes a single color.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "C2C blocks are almost never perfectly square. Always measure your swatch in both directions, do not assume a 2-inch-wide block is also 2 inches tall.",
        "For graphgan blankets, subtract your planned border width from the target dimensions before calculating blocks. The border adds to the finished size.",
        "Use stitch markers to count blocks every 10 rows on long diagonal rows. It is easy to lose count on rows with 50 or more blocks.",
        "When changing colors frequently (as in a graphgan), carry unused colors along the top of the row rather than cutting and rejoining. This saves yarn and reduces the number of ends to weave in.",
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
      "Casting on for the head circumference instead of applying negative ease. A hat cast on at 22 inches for an actual 22-inch head will fit like a swimming cap once stretched over the head. Standard 10% negative ease produces a 19.8-inch circumference that stretches comfortably.",
      "Using stockinette ease (10%) for ribbed hats. Ribbing has much more stretch than stockinette and needs 15% negative ease instead. A ribbed hat with only 10% negative ease will be loose and slouchy.",
      "Forgetting to round the cast-on count to a multiple of 8 for symmetrical crown decreases. A count not divisible by 8 produces uneven decreases at the crown, with visible lumps in the hat point.",
    ],
    projectExample: "A crocheter making a beanie for an adult with a 22-inch head using worsted weight yarn at 4 stitches per inch applies 10% negative ease: 22 × 0.9 = 19.8 inches × 4 = 79.2 stitches, rounded to 80 (nearest multiple of 8). They work the hat in the round at 80 stitches, then work an 8-point crown decrease removing 8 stitches every other round until 8 remain, drawn together to close.",
    useCases: [
      "Designing a hat for any head size using your gauge, the calculator handles negative ease and crown rounding automatically.",
      "Switching yarn weights or stitch patterns mid-design. Ribbed versus stockinette construction needs different cast-on counts because ease requirements differ.",
      "Creating matching hats for family members with different head sizes, enter each circumference separately for perfectly fitting hats from one yarn.",
    ],
    introduction: {
      title: "Why You Need a Hat Size Calculator",
      paragraphs: [
        "Hats are one of the most popular knitting and crochet projects, fast to finish, endlessly customizable, and always appreciated as gifts. But getting the right fit requires more than picking a head size from a chart. The stitch pattern, yarn weight, and your personal tension all affect how the finished hat fits. A hat that is even half an inch too large will slide over the wearer's eyes; too small and it perches on top of the head.",
        "This calculator combines head circumference, negative ease for your chosen stitch type, and your gauge to produce an exact cast-on count rounded for a clean 8-point crown decrease. It takes the math out of hat design so you can focus on choosing colors and stitch patterns.",
      ],
    },
    whatIs: {
      title: "What Is Negative Ease in Hats?",
      paragraphs: [
        "Negative ease means making the hat slightly smaller than the actual head measurement. Knit and crochet fabrics stretch, and a hat must grip the head to stay in place. The amount of negative ease depends on the stitch pattern because different stitches have different amounts of stretch.",
        "Stockinette stitch has moderate stretch and uses 10 percent negative ease. Ribbing (1x1 or 2x2) has much more stretch and uses 15 percent negative ease, the hat starts smaller but expands to fit. Colorwork (stranded knitting) has very little stretch because the floats on the back limit the fabric's elasticity, so it uses only 5 percent negative ease.",
        "The calculator applies the appropriate ease based on your stitch type selection, then multiplies the resulting circumference by your stitch gauge to determine the cast-on count. This count is rounded to the nearest multiple of 8 to ensure a clean, symmetrical crown decrease.",
      ],
    },
    howCalculated: {
      title: "How Hat Sizing Is Calculated",
      paragraphs: [
        "The calculator takes your head circumference (from measurement or the size chart dropdown) and multiplies it by the ease factor: 0.90 for stockinette, 0.85 for ribbing, or 0.95 for colorwork. This produces the target circumference of the hat.",
        "Next, it multiplies the target circumference by your stitches per inch (gauge stitches divided by gauge measurement) to get the raw stitch count. This count is rounded to the nearest multiple of 8, because the standard 8-point crown decrease divides the hat into 8 equal sections.",
        "The crown decrease schedule is generated from the rounded count. Each decrease round removes 8 stitches (one per section), and a plain round is worked between each decrease round. This continues until 8 stitches remain, which are drawn together to close the top. The number of decrease rounds equals the stitches per section minus one.",
      ],
    },
    howToUse: {
      title: "How to Use the Hat Calculator",
      paragraphs: [
        "Start by entering the head circumference. You can type a custom measurement or select a standard size from the dropdown. The standard sizes use the midpoint of each range, for example, Average Adult uses 22 inches, the midpoint of the 21 to 23 inch range.",
        "Select your stitch type. This determines the negative ease: 10 percent for stockinette, 15 percent for ribbing, or 5 percent for colorwork. Then enter your gauge, how many stitches you get over 4 inches with your chosen yarn and needles or hook.",
        "The calculator outputs your cast-on count (rounded to the nearest multiple of 8), a complete crown decrease schedule showing what to do on each round, the recommended hat height for the selected size, and a yardage estimate. Review the cast-on count against your gauge to make sure it produces a circumference close to your target.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The cast-on count is your starting stitch count for a bottom-up hat worked in the round. If you are working a top-down hat (starting from the crown), reverse the decrease schedule into an increase schedule. If you are crocheting, the total stitch count at the widest point (the brim) is the same number.",
        "The crown decrease schedule shows every round from the first decrease to the last. It assumes you work decreases on odd-numbered rounds and knit plain on even-numbered rounds. The pattern uses K2tog decreases, for crochet, substitute SC2tog or DC2tog.",
        "The hat height range is a guideline based on the head size. Slouchy hats need additional length (add 2 to 4 inches). Beanies that sit above the ears need less height than the range shown. Adjust based on the style you want.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure the head at the widest point, across the forehead, above the ears, and around the back of the head. If you are making a gift, use the size chart as a guide.",
        "For ribbed brims on an otherwise stockinette hat, cast on using the stockinette ease (10 percent). The ribbing will stretch to fit, and the body will be the right circumference.",
        "Try on the hat before starting crown decreases. The body should reach from the cast-on edge to the top of the ears. If it does not, add or subtract rounds.",
        "Use a different needle size for the ribbed brim (one or two sizes smaller) to keep the brim snug and prevent it from flaring out.",
      ],
    },
  },

  "sock-calculator": {
    commonMistakes: [
      "Not applying 10% negative ease to the foot circumference. New sock knitters who cast on for the exact circumference get socks that sag around the foot. The 10% ease makes the sock grip properly without being uncomfortably tight.",
      "Measuring the foot circumference over the top of the foot (narrow dimension) instead of around the ball of the foot (widest part). This produces a cast-on too small, making the sock impossible to pull on or too tight across the instep.",
      "Miscalculating heel flap rows in top-down socks. The flap should have the same number of rows as stitches to create a square, but knitters who skip rows or pick up the wrong number of stitches along the edge create an asymmetrical gusset and a lumpy sock.",
    ],
    projectExample: "A knitter with an 8-inch foot circumference and 9-inch length, using fingering weight at 8 stitches per inch, applies 10% negative ease: 8 × 0.9 = 7.2 × 8 = 57.6 stitches, rounded to 56 (multiple of 4). For top-down, they cast on 56, work the cuff, use 28 stitches for a 28-row heel flap, pick up 14 stitches each side, work the gusset back to 56 stitches, work the foot tube, then start toe decreases.",
    useCases: [
      "Knitting both top-down and toe-up socks with the same fit, the calculator handles both constructions so you can choose your preferred method.",
      "Making socks in different yarn weights for different purposes, fingering for dress socks versus bulky for camp socks each require different cast-on counts.",
      "Designing custom socks for family members with different foot sizes, enter each person's measurements for perfectly fitting socks every time.",
    ],
    introduction: {
      title: "Why You Need a Sock Calculator",
      paragraphs: [
        "Sock knitting has a devoted following for good reason, handknit socks fit better, last longer, and feel luxurious compared to store-bought options. But socks involve more construction math than most other projects. You need to calculate stitch counts for the leg, heel, gusset, foot, and toe, and all of those numbers derive from just two measurements and your gauge.",
        "This calculator handles both top-down (cuff to toe) and toe-up construction methods. Enter your foot measurements and gauge, and it generates every number you need: cast-on count, heel flap rows, gusset pickup, short-row heel details, and toe shaping. No more scribbling math on scrap paper mid-project.",
      ],
    },
    whatIs: {
      title: "What Is Sock Construction?",
      paragraphs: [
        "A sock is a tube with a shaped heel pocket and a tapered toe. The two main construction methods, top-down and toe-up, build the sock in opposite directions but produce the same result. Top-down socks cast on at the cuff and work downward, shaping the heel with a heel flap and gusset. Toe-up socks start with a small number of stitches at the toe, increase to the full foot circumference, then shape the heel with short rows.",
        "Both methods use negative ease, making the sock 10 percent smaller than the actual foot circumference, so the knit fabric stretches to grip the foot. This prevents bunching, slipping, and premature wear. The calculator applies this 10 percent ease automatically.",
        "Socks are typically knit on small double-pointed needles or a long circular needle using the magic loop technique. The stitch count is rounded to a multiple of 4 for even distribution across needles and to accommodate common ribbing patterns (K2P2 or K1P1).",
      ],
    },
    howCalculated: {
      title: "How Sock Measurements Are Calculated",
      paragraphs: [
        "For top-down socks, the calculator applies 10 percent negative ease to your foot circumference, multiplies by your stitch gauge, and rounds to the nearest multiple of 4. This is your cast-on count. Half those stitches form the heel flap, the flap is worked back and forth over this half, with the same number of rows as stitches to create a square. Gusset pickup is half the heel flap rows on each side. Foot length is calculated by subtracting 2 inches (for the toe) from total foot length and converting to rows.",
        "For toe-up socks, the total stitch count is calculated the same way. The toe starts with approximately 15 percent of the total stitches per needle (rounded to an even number, minimum 8), then increases by 4 stitches every other round until reaching the full count. The short-row heel divides the heel stitches into thirds, the center third stays and the side thirds are shaped with short rows. Foot length is adjusted for heel depth.",
        "Both methods produce a sock with the same total stitch count and the same fit, the difference is purely in construction order and heel style. Many knitters prefer top-down for the heel flap's durability, while others prefer toe-up for the ability to try on as they go.",
      ],
    },
    howToUse: {
      title: "How to Use the Sock Calculator",
      paragraphs: [
        "Measure your foot: wrap a tape measure around the ball of your foot for circumference, and measure from heel to longest toe for length. Enter both measurements in inches. Then enter your gauge, stitches per 4 inches and rows per 4 inches from a gauge swatch knit in your sock yarn on your sock needles.",
        "Select the Top-Down or Toe-Up tab depending on your preferred construction method. The calculator generates all the numbers you need for that method, including heel and toe shaping details.",
        "Review the results and compare the cast-on count against your expected range. For fingering weight sock yarn at a typical 32 stitches per 4 inches gauge, most adult socks have 56 to 72 stitches. If your number is very different, double-check your gauge swatch.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The cast-on count (top-down) or total stitch count (toe-up) is the number of stitches around the full circumference of the sock. Divide this by 4 for the number of stitches per needle on double-pointed needles.",
        "For top-down socks, the heel flap rows and gusset pickup numbers work together. The flap creates a cup when turned, and the gusset stitches picked up along the flap edges taper back down to the original foot stitch count over several rounds of decreasing. For toe-up socks, the short-row heel creates the cup by working progressively shorter rows, no gusset picking up needed.",
        "The foot rows number tells you how many rounds to work the plain foot tube before starting the toe (top-down) or after finishing the toe (toe-up). This is based on your row gauge and accounts for the 2-inch toe or the heel depth respectively.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Knit both socks at once using magic loop or two circulars to avoid 'second sock syndrome', the dreaded loss of motivation to knit the matching sock after finishing the first.",
        "Reinforce heel and toe sections with a strand of reinforcing thread held alongside your sock yarn. This doubles the durability in the highest-wear areas.",
        "If your socks feel too tight across the instep, add 4 to 8 stitches to the cast-on count. High insteps often need extra ease that the standard 10 percent does not account for.",
        "For your first pair of socks, use a solid or semi-solid yarn so you can see the stitch construction clearly. Save variegated and self-striping yarns for after you are comfortable with the heel and toe techniques.",
      ],
    },
  },

  "granny-square-planner": {
    designPrinciples: "Granny squares exemplify modular design, individual units that combine into larger wholes without requiring structural planning during construction. The traditional four-round square (12-stitch clusters around the perimeter with chain spaces between) creates a unit that is approximately square when blocked, allowing infinite tiling possibilities. The mathematical elegance lies in the independent nature of each square: stitch counts, yarn requirements, and construction can be varied without affecting adjacent squares, as long as side lengths remain consistent at blocking. This modularity enables rapid iteration, scrap-busting, and collaborative projects. Granny squares also demonstrate color theory's power, the nested rounds create visual depth, and strategic color placement in different square positions can create secondary patterns (stripes, checkerboards, gradients) when squares are arranged in a grid.",
    patternVariations: [
      "Rainbow sampler variation, crochet each square in a different color combination, using the full spectrum to create a diagonal or random color flow across the blanket layout; arrange by color family or create completely random placement for visual interest.",
      "Monochrome ombré variation, use the same color family in multiple shades, arranging light, medium, and dark squares in a gradient from one corner to the opposite diagonal, creating a sophisticated tonal effect with subtle visual depth.",
      "Colorwork border variation, keep all squares in a single neutral base color but change the joining color or add a contrasting single-crochet border around each square after assembly, creating a uniform grid with bold outline definition."
    ],
    introduction: {
      title: "Why You Need a Granny Square Planner",
      paragraphs: [
        "Granny square blankets are a crochet tradition, colorful, customizable, and endlessly satisfying to make. But the planning stage trips up many crafters. How many squares do you actually need? How much yarn per color? And how much extra for joining? Without a plan, you end up either short on squares or drowning in leftover yarn.",
        "This planner does the math for you. Enter your target blanket dimensions and square size, and it calculates the exact number of squares, finished dimensions, per-color yardage, and joining yarn estimate. Plan your blanket once, then enjoy the meditative rhythm of crocheting squares without worrying about running short.",
      ],
    },
    whatIs: {
      title: "What Is a Granny Square Blanket?",
      paragraphs: [
        "A granny square blanket is made by crocheting individual squares and then joining them together into a larger fabric. The classic granny square uses clusters of double crochets separated by chain spaces, worked in rounds from the center outward. Each round adds another ring of clusters, and color changes between rounds create the traditional striped look.",
        "Granny square blankets are beloved for their versatility. You can make every square identical for a uniform look, use different colors in each square for a scrappy stash-busting project, or vary the center pattern for a sampler blanket. The modular construction means each square is a small, portable project, perfect for crafting on the go.",
        "Square sizes range from 4-inch mini squares to 12-inch or larger afghan squares. Smaller squares create more visual interest and use more colors, but require more joining. Larger squares work up faster and need less assembly, but show less variety. The most popular size is the classic 6-inch granny square, a good balance of detail, portability, and assembly time.",
      ],
    },
    howCalculated: {
      title: "How the Granny Square Planner Works",
      paragraphs: [
        "The planner divides your target blanket width and height by your chosen square size and rounds to the nearest whole number. Multiplying these two numbers gives the total square count. The actual finished dimensions are recalculated from the rounded block counts, so you can see exactly how close the finished blanket will be to your target.",
        "For yardage, the planner multiplies total squares by the yarn consumed per square (which you enter based on your own test square), then adds a 10 percent buffer for tails, tension variation, and inevitable frogging. If you are using multiple colors, total yardage is divided evenly among the colors as a starting estimate.",
        "The joining yardage estimate assumes approximately 1.5 times the perimeter of one square per join, multiplied by the total number of squares, converted from inches to yards, with a 10 percent buffer. Actual joining yarn varies by method, slip stitch joining uses more than whip stitch, and join-as-you-go uses less than any separate joining method.",
      ],
    },
    howToUse: {
      title: "How to Use the Granny Square Planner",
      paragraphs: [
        "Enter your desired blanket width and height in inches, then enter your square size. Common sizes are 4, 6, 8, or 12 inches. If you have not decided on a size yet, try 6 inches as a starting point, it is the most popular for good reason.",
        "For yardage estimates, crochet one complete square with your chosen yarn and hook, then unravel it and measure the total yarn length in yards. Enter this in the yarn-per-square field. If you are using multiple colors, enter the total number of colors. The planner divides yardage evenly, adjust manually if some colors appear more than others.",
        "Review the results. The planner shows your grid layout, total squares, actual finished dimensions, and yardage breakdown. If the actual dimensions are too far from your target, try a different square size or adjust your target dimensions to match the grid.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The grid layout tells you how many squares across and how many squares down. Total squares is the product of these two numbers. For a 50 by 60 inch throw with 6-inch squares, that is 8 across by 10 down, or 80 squares total.",
        "The yardage per color is an even split of the total yarn needed. In practice, if certain colors appear in more rounds or more squares, they will need proportionally more yarn. Use the per-color estimate as a minimum and buy one extra skein of any color that appears heavily.",
        "The joining yardage is separate from the square yardage. You will need this yarn in addition to the yarn for the squares themselves. Many crafters use a single color for all joining to create a cohesive frame around each square. Others match each join to the outer round of the adjacent square. Plan your joining color and include it in your yarn purchase.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure every square before joining. If the pattern and product care instructions call for pre-joining treatment, test it on a representative square and apply it consistently without forcing the fabric to a target size.",
        "Crochet a few extra squares as insurance. If one square has a tension problem or a color you decide you dislike, you can swap it out without interrupting the assembly.",
        "For stash-busting projects, weigh your leftover yarn and divide by the yarn-per-square amount to see how many squares each leftover can produce before you start.",
        "Consider your joining method before you start crocheting squares. Join-as-you-go integrates assembly into the last round of each square, saving time and producing a flat, seamless look.",
      ],
    },
    projectIdeas: {
      title: "Project Ideas for Granny Square Blankets",
      ideas: [
        "Classic rainbow throw, plan an 8x10 grid in DK weight with 7 color families, one per diagonal stripe across the layout for a vibrant, modern look.",
        "Scrap-busting mini-square blanket, use 3-inch squares with 10+ leftover colors to create a patchwork lap blanket with no two adjacent squares the same color.",
        "Monochrome texture blanket, choose a single neutral yarn in 3 shades (light, medium, dark) arranged in a gradient from one corner to the opposite.",
        "Baby blanket with border, plan a 5x7 grid for a 30x42 inch baby blanket, using the planner to calculate the single-color joining yarn that creates a frame between every square.",
        "Tote bag panels, plan two matching 4x6 panels (front and back) and join the sides for a structured carry bag; the planner tells you exactly how many squares and how much yarn each color needs.",
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
      "Miscalculating the neck cast-on by guessing instead of using the 30/30/15/15 ratio (back/front/sleeve/sleeve plus 4 raglan seam stitches). A wrong starting count produces a yoke that is too shallow or too deep for the body.",
      "Forgetting that yoke depth must match the actual body measurement from neck base to underarm. A calculated yoke of 6 inches that doesn't match the 8-inch body measurement produces shoulders that bunch or sleeves that start too far down the arm.",
      "Placing too many or too few increase rounds in the yoke. Increasing every other round forever creates a flared sweater; too-infrequent increases leave the yoke too small for the intended chest.",
    ],
    projectExample: "A knitter wants a 40-inch chest sweater with a 22-inch neck and 8-inch yoke depth at a gauge of 5 stitches per inch and 6 rows per inch. Chest: 200 stitches total. Using 30/30/15/15 ratio + 4 seam stitches = 188 cast-on. Difference: 12 stitches. At 8 stitches per increase round and 6 rows per inch × 8 inches = 48 yoke rows, the calculator distributes the increase rounds correctly to reach exactly 200 stitches at underarm depth.",
    useCases: [
      "Designing top-down raglan sweaters in any gauge, the calculator ensures the yoke expands to the right chest circumference at the right depth.",
      "Comparing stitch gauges to see how yoke depth changes. A looser gauge requires fewer increase rounds than a tighter gauge.",
      "Experimenting with the 30/30/15/15 ratio for specific fit preferences, broad shoulders or larger arms can use 35/35/15/15 or 30/30/20/20.",
    ],
    introduction: {
      title: "Why You Need a Raglan Calculator",
      paragraphs: [
        "Top-down raglan sweaters are one of the most popular garment constructions in knitting and crochet. You start at the neck and work outward, which means you can try on the sweater as you go and adjust the fit in real time. But the yoke math, distributing stitches between front, back, and sleeves, then calculating how many increase rounds to reach your chest circumference, requires careful arithmetic.",
        "This calculator does the stitch distribution for you using the standard 30/30/15/15 raglan ratio and computes exactly how many increase rounds you need. It gives you a complete starting framework so you can focus on the enjoyable parts: choosing yarn, picking stitch patterns, and watching the yoke grow round by round.",
      ],
    },
    whatIs: {
      title: "What Is a Top-Down Raglan?",
      paragraphs: [
        "A raglan sweater is characterized by four diagonal seam lines running from the neckline to the underarm. Unlike set-in sleeve construction, where the body and sleeves are knit separately and seamed together, a raglan is knit as one piece from the top down. The yoke forms a continuous circle of fabric that expands with every increase round.",
        "The standard construction increases at four points (the raglan lines) every other round, adding 8 stitches per increase round, 2 at each raglan point. As the yoke grows, the front, back, and sleeve sections all expand proportionally until the yoke is deep enough to reach the underarm. At that point, the sleeve stitches are placed on hold, the body sections are joined, and the body is worked downward as a tube.",
        "The standard stitch distribution is 30 percent for the back, 30 percent for the front, and 15 percent for each sleeve, plus 4 raglan seam stitches (one at each raglan line). This ratio produces balanced proportions for most body types, though experienced knitters may adjust the ratio for specific fit preferences.",
      ],
    },
    howCalculated: {
      title: "How the Raglan Calculator Works",
      paragraphs: [
        "The calculator starts with your desired chest circumference and converts it to total chest stitches using your stitch gauge. It then distributes the initial neck cast-on using the 30/30/15/15 ratio plus 4 raglan seam stitches.",
        "The difference between the total chest stitches and the neck cast-on is divided by 8 (since each increase round adds 8 stitches) to determine the number of increase rounds. The total yoke rows is twice the increase rounds because you work one plain round between each increase round. Dividing yoke rows by your row gauge gives the estimated yoke depth in inches.",
        "This yoke depth should roughly match the distance from the base of your neck to your underarm. If the calculated depth is significantly shorter or longer than your body measurement, you may need to adjust the neck cast-on, add or remove plain rounds between increases, or modify the chest circumference input to account for ease.",
      ],
    },
    howToUse: {
      title: "How to Use the Raglan Calculator",
      paragraphs: [
        "Enter your desired chest circumference in inches. This should include any ease you want, typically 2 to 4 inches of positive ease for a standard fit, or 4 to 8 inches for a relaxed fit. Enter your stitch gauge and row gauge, either per inch or per 4 inches.",
        "Review the stitch distribution. The calculator shows how many stitches to assign to the back, front, each sleeve, and the 4 raglan seam stitches. The total of all sections is your neck cast-on count.",
        "Check the yoke depth against your body. Measure from the base of your neck (where a crew neck would sit) straight down to your underarm. The calculated yoke depth should be close to this measurement. If it is off by more than an inch, consider adjusting your inputs or planning to add extra plain rounds in the yoke.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The neck cast-on is the total number of stitches you start with. For a crew neck, this is typically placed on a circular needle and joined for working in the round. For a V-neck or cardigan, you would work flat and adjust the front stitch count.",
        "The stitch distribution shows where to place markers. Cast on all stitches, then place 4 markers to separate the sections: front, raglan stitch, sleeve, raglan stitch, back, raglan stitch, sleeve, raglan stitch. Increase on each side of every marker on increase rounds.",
        "The note about separating body and sleeves at the underarm is critical. When the yoke is complete, place all sleeve stitches on waste yarn, cast on a few underarm stitches (typically 2 to 6) to bridge the gap between front and back, and continue the body downward. The sleeves are picked up and knit later.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Try the yoke on before separating body and sleeves. The raglan lines should end right at the underarm point. If they are too high, work more increase rounds. If too low, the sweater will have oversized sleeves.",
        "For a better neckline, add short rows across the back neck before starting raglan increases. This raises the back neck relative to the front, preventing the sweater from pulling backward.",
        "The 30/30/15/15 ratio is a starting point. Knitters with broader shoulders may want to increase the back and front percentages; those with larger arms may increase the sleeve percentages.",
        "When casting on underarm stitches, pick up a few extra stitches from the body on each side of the gap to prevent holes. Decrease back to the target body stitch count over the next few rounds.",
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
    answerCapsule: "Paste vintage or UK pattern text to get an instant decoded version with UK-to-US stitch substitutions, old abbreviation translations, era detection, and warnings about needle sizes or measurements that need conversion.",
    skillLevel: "beginner",
    introduction: {
      title: "Why Vintage Patterns Are Hard to Follow",
      paragraphs: [
        "Vintage knitting and crochet patterns are a treasure trove of beautiful designs, but their terminology can read like a foreign language. A pattern that calls for 'double crochet' may mean something entirely different from what you expect, 'tension' replaces the word you know as gauge, and abbreviations like 'wl fwd' or 'psso' appear without explanation.",
        "The Vintage Pattern Decoder translates all of this automatically so you can focus on making the project instead of deciphering the instructions.",
      ],
    },
    whatIs: {
      title: "What Is the Vintage Pattern Decoder?",
      paragraphs: [
        "The Vintage Pattern Decoder is a pattern translation tool that converts vintage and UK knitting and crochet terminology into modern US equivalents. It handles the most common source of confusion, the UK-to-US crochet stitch name offset, as well as archaic knitting abbreviations, era-specific measurement conventions, and needle sizing systems that predate current standards.",
        "The tool highlights every substitution in your decoded text and shows a table of every term it found, so nothing gets missed.",
      ],
    },
    howCalculated: {
      title: "How Does Pattern Translation Work?",
      paragraphs: [
        "The decoder uses a lookup table of over twenty-five term patterns, ordered from longest to shortest so that multi-word phrases like 'double treble crochet' are caught before the shorter 'treble crochet' or standalone 'treble.' This ordering matters because crochet stitch names nest inside each other, catching the wrong level would produce an incorrect translation.",
        "Once all matches are found, the tool uses a greedy non-overlapping selection algorithm: matches are sorted by their position in the text, and any match that overlaps a previously selected match is skipped. This ensures each part of your pattern is translated exactly once, with the most specific match winning.",
        "The tool also runs a separate era-detection pass over the input. Signals like 'wool over,' 'wl fwd,' UK needle numbering (No. 10, No. 12), and yarn listed in ounces all contribute to an era estimate that appears as a banner above your decoded text.",
      ],
    },
    howToUse: {
      title: "How to Use the Vintage Pattern Decoder",
      paragraphs: [
        "Paste your vintage pattern text, or just the section you are working on, into the text area. You do not need to paste the entire pattern at once; decoding a single row or round at a time works just as well.",
        "Click 'Decode Pattern.' The tool scans the text and highlights every substitution it made in amber so you can see exactly what changed at a glance. Review the Terms Found table for the original term, modern US equivalent, and a note explaining each conversion.",
        "Check the Warnings section if it appears. Warnings flag items that need manual attention, vintage needle sizes, yarn listed in ounces, and short abbreviations like 'dc' or 'tr' that are genuinely ambiguous without knowing the pattern's origin.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The era banner at the top of your results gives a best estimate of when and where the pattern originated based on the terminology it uses. Use this as context, not a guarantee: many patterns mixed conventions or were reprinted without updating the terminology.",
        "Highlighted terms in the decoded text are substitutions the decoder made with high confidence. The Terms Found table below lists every substitution with its original form, modern equivalent, and a brief explanatory note.",
        "Warnings appear when the decoder finds something it cannot automatically fix. The most common warnings are vintage needle sizes (UK needle numbering runs in the opposite direction from US sizes, a UK No. 12 is approximately a US size 1, not a size 12), yarn listed in ounces instead of yards, and the abbreviations 'dc' and 'tr' in ambiguous context.",
        "The quick reference card at the bottom of the tool shows the complete UK-to-US crochet stitch conversion table and the most common vintage abbreviations. Keep this visible when working through a long pattern.",
      ],
    },
    proTips: {
      title: "Pro Tips for Vintage Patterns",
      tips: [
        "Always check the publisher and publication date before you start. UK publishers like Patons, Sirdar, and Robin used UK terminology; American publishers like Coats and Clark used US terminology.",
        "When a pattern says 'tension' and gives a stitch count over 10 cm (not 4 inches), it was published under UK/metric conventions. Recalculate your gauge swatch to match the metric measurement exactly.",
        "Vintage needle sizes are especially tricky. UK steel crochet hook sizes run in reverse, a UK size 14 is tiny, not large. Always look up a conversion chart before choosing hooks.",
        "For patterns that list yarn in ounces, note the fiber content. A 2-ounce ball of wool has different yardage than a 2-ounce ball of cotton. Use a yardage estimation tool to get an approximate yard count before substituting yarn.",
        "If your decoded pattern still has confusing rows, try decoding just one row at a time. Shorter inputs make it easier to verify each substitution against the original before moving to the next row.",
        "Make a paper copy of the decoded pattern and mark up each row as you complete it. Vintage patterns rarely include the row markers that modern patterns use, so tracking your place manually prevents costly mistakes.",
      ],
    },
    commonMistakes: [
      "Assuming 'dc' means US double crochet in every pattern, in UK and vintage patterns 'dc' is a single crochet (US sc). Check for the word 'tension' as a UK signal.",
      "Skipping the tension/gauge swatch. Vintage patterns were written for yarns that no longer exist. Always swatch with your actual yarn before casting on.",
      "Using vintage needle size numbers as US sizes. UK needle numbers run in reverse, a UK No. 12 knitting needle is roughly a US size 1.",
      "Ignoring the era banner. Era detection gives context about other unlisted conventions that may be in use throughout the pattern.",
    ],
    useCases: [
      "Working from a grandmother's handwritten pattern or a photocopied vintage booklet",
      "Following a UK pattern bought on Etsy or Ravelry from a British designer",
      "Reproducing a mid-century style garment using an original magazine pattern",
      "Teaching a new crafter to understand why pattern books from different eras use different terms",
      "Adapting a vintage design to modern yarn weights and hook sizes",
    ],
    internalLinks: [
      { href: "/uk-to-us-converter", label: "UK to US Converter", description: "Full side-by-side stitch name reference for UK and US crochet terminology" },
      { href: "/abbreviation-glossary", label: "Abbreviation Glossary", description: "Every modern knitting and crochet abbreviation explained" },
      { href: "/needle-converter", label: "Needle Size Converter", description: "Convert between US, UK, metric, and vintage needle sizing systems" },
      { href: "/stitch-quick-reference", label: "Stitch Quick Reference", description: "Visual guide to common stitches for knitting and crochet" },
    ],
  },
};
