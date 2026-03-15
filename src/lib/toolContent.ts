export interface ToolEducationalContent {
  disclaimer?: string;
  answerCapsule?: string;
  internalLinks?: Array<{ label: string; href: string; description: string }>;
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
}

export const toolContent: Record<string, ToolEducationalContent> = {
  "yarn-calculator": {
    answerCapsule: "Calculate exactly how much yarn you need for any knitting or crochet project. Enter your project type, dimensions, and yarn weight to get total yardage and skein count with a built-in safety buffer.",
    internalLinks: [
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Compare yarn weights and find substitution options" },
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Measure your gauge for more accurate yardage estimates" },
      { label: "Blanket Calculator", href: "/blanket-calculator", description: "Get precise yarn estimates for blankets of any size" },
    ],
    introduction: {
      title: "Why You Need a Yarn Yardage Calculator",
      paragraphs: [
        "Every knitter and crocheter has faced the same anxious question at the yarn shop: how many skeins do I actually need? Buying too few means a frantic search for the same dye lot later — and if it has been discontinued, your project may never match. This calculator removes the guesswork entirely.",
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
        "The core formula multiplies the project area by a yards-per-square-inch factor for your chosen yarn weight. For example, worsted weight yarn in stockinette typically uses about 0.018 yards per square inch of finished fabric, a value derived from standard gauge and average stitch dimensions.",
        "Consider a worsted weight throw measuring 50 by 60 inches. The area is 3,000 square inches. Multiply by 0.018 to get 54 yards — but that factor already accounts for stitch density, so the real calculation yields approximately 2,160 yards. Adding a 10 percent buffer brings the total to about 2,376 yards.",
        "The calculator then divides total yardage by the yards per skein to determine how many skeins to purchase, always rounding up because partial skeins are not sold. This final number is what you bring to the yarn shop with confidence.",
      ],
    },
    howToUse: {
      title: "How to Use the Yarn Yardage Calculator",
      paragraphs: [
        "Start by selecting your project type — sweater, blanket, scarf, hat, socks, or shawl. Each project type uses a different formula based on typical construction and stitch density. Next, choose your yarn weight from lace through super bulky. The calculator uses standard yardage-per-square-inch values for each weight, adjusted by the project type's typical stitch pattern.",
        "Enter your project dimensions in inches. For garments, this means chest circumference and body length. For blankets and scarves, enter width and length. The calculator outputs both total yardage needed and number of skeins based on the yardage per skein you specify.",
        "The skeins output rounds up to the nearest whole number because you cannot buy partial skeins. The yardage output is the raw estimate before rounding. Use the yardage number when comparing across yarn brands with different put-ups."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The calculator adds a 10-15% buffer to the base yardage estimate. This accounts for gauge variation, tension differences, weaving in ends, and the yarn lost to casting on and binding off. If you knit or crochet tightly, you may use slightly less than the estimate. Loose stitchers may use slightly more.",
        "Leftover yarn from your estimate is normal and expected. Fiber content affects actual yardage consumption — cotton and linen have no stretch and use more yardage per stitch than wool or acrylic, which have natural elasticity. Textured stitch patterns like cables or bobbles also consume more yarn than stockinette or single crochet."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always buy one extra skein from the same dye lot. Dye lots vary between production runs, and a color mismatch mid-project is visible in finished work.",
        "Knit or crochet a gauge swatch before running the calculator. Your actual gauge determines how much yarn each stitch consumes, and the calculator's estimates assume standard gauge for each weight.",
        "Yarn listed in stores may vary from online listings by 5-10 yards per skein. Check the actual yardage printed on the ball band, not the store listing.",
        "For colorwork projects, calculate each color separately. The calculator estimates total yardage — it does not split by color."
      ],
    },
  },

  "needle-converter": {
    answerCapsule: "Crochet hook sizes vary by country. US sizes use letters and numbers, while metric sizes use millimeters. Use this converter to find the equivalent hook size for any international standard. It also covers all knitting needle sizes across US, UK, metric, and Japanese systems.",
    internalLinks: [
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "See recommended needle and hook sizes for each yarn weight" },
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Check your gauge after selecting your needle or hook size" },
    ],
    introduction: {
      title: "Why You Need a Knitting Needle Size Converter",
      paragraphs: [
        "You find a gorgeous Japanese pattern that calls for 8号 needles, or a vintage British pattern listing No. 6 — what needle do you actually grab from your case? Needle sizing systems vary dramatically by country, and using the wrong size can throw off your entire gauge and finished dimensions.",
        "With patterns now shared globally through Ravelry, YouTube, and social media, crafters regularly encounter unfamiliar sizing systems. A reliable converter eliminates confusion and ensures you start every project with exactly the right tool in hand, no matter where the pattern originated.",
      ],
    },
    whatIs: {
      title: "What Are Knitting Needle Sizing Systems?",
      paragraphs: [
        "Knitting needle sizes refer to the diameter of the needle shaft, which directly controls stitch size and fabric gauge. The metric system measures this diameter in millimeters and serves as the universal reference point. All other systems are country-specific naming conventions mapped to these millimeter values.",
        "The US system uses numbers that generally increase with size, the Japanese system uses a similar ascending numbered scale, and the old UK system uses numbers that run in reverse — a UK 14 is a tiny 2.0mm needle, while a US 14 is a hefty 10.0mm needle. This reversal catches many knitters off guard.",
        "Modern patterns increasingly list metric sizes alongside regional numbers, but older and vintage patterns often use only the local system. Understanding these mappings is essential for anyone working from international or historical pattern sources.",
      ],
    },
    howCalculated: {
      title: "How Needle Size Conversion Works",
      paragraphs: [
        "Needle conversion uses standardized lookup tables maintained by needle manufacturers and craft organizations. Each system maps its numbered or named sizes to specific millimeter diameters. For example, US 8 equals 5.0mm, which equals UK 6, which equals Japanese 棒針 8号.",
        "The critical detail to understand is that UK sizing runs backward compared to US and metric. UK 14 is 2.0mm while US 14 is 10.0mm — the exact opposite ends of the size spectrum. This reversal has caused countless gauge disasters for knitters working from British patterns with American needles.",
        "Some sizes do not have exact equivalents across all systems. For instance, US 11 is 8.0mm, but the nearest UK size jumps from 7.5mm to 8.0mm without a standard number. The converter flags these gaps so you can choose the closest available option.",
      ],
    },
    howToUse: {
      title: "How to Use the Needle & Hook Size Converter",
      paragraphs: [
        "Enter a needle or hook size in any system — US numbered, UK old-system numbered, or metric millimeters — and the converter returns the equivalent in all three systems instantly. US sizes run from 0 to 50 for knitting needles. UK sizes run in the opposite direction, with smaller numbers for larger needles. Metric sizes are measured in millimeters and range from 2.0mm through 25mm for standard needles.",
        "The converter also handles crochet hook sizes, including lettered US hooks (B through S) and their metric equivalents. Select the tool type — knitting needle or crochet hook — to see the correct conversion table for your needs."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Metric millimeter sizes are the universal standard across manufacturers worldwide. When a US size and metric size appear to conflict, trust the millimeter measurement. Some manufacturers round differently — a US 8 needle is technically 5.0mm, but you may encounter needles labeled US 8 that measure 5.1mm or 4.9mm with calipers.",
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
    internalLinks: [
      { label: "Stitch Pattern Calculator", href: "/stitch-pattern-calculator", description: "Find compatible stitch counts for your gauge" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Check recommended gauge ranges for each yarn weight" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Adjust needle size to match your target gauge" },
    ],
    introduction: {
      title: "Why Gauge Matters in Knitting and Crochet",
      paragraphs: [
        "Gauge is the single most important measurement in fitted knitting and crochet. Even half a stitch per inch difference from the pattern specification can mean a sweater that is three sizes too large or impossibly tight. Skipping the gauge swatch is the most common — and most costly — mistake crafters make.",
        "Professional designers spend significant time establishing gauge because every pattern instruction depends on it. Stitch counts, shaping calculations, and yarn estimates all derive from this foundational measurement. Getting gauge right before you begin saves hours of ripping out and reworking later.",
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
        "Now compare to the pattern gauge. If a pattern calls for 5 stitches per inch across 40 inches, it expects 200 stitches wide. But at your gauge of 5.5 stitches per inch, those same 200 stitches produce only 36.4 inches — nearly four inches too narrow for the intended fit.",
        "The solution is to go up a needle size and swatch again until you match the pattern gauge, or use the calculator to determine the correct stitch count for your actual gauge. At 5.5 stitches per inch, you would need 220 stitches to achieve the 40-inch width.",
      ],
    },
    howToUse: {
      title: "How to Use the Gauge Calculator",
      paragraphs: [
        "The calculator operates in three modes. In swatch mode, enter the number of stitches and rows you counted in your swatch, along with the swatch dimensions in inches. The calculator returns your stitches per inch and rows per inch. In resize mode, enter the original pattern gauge and your actual gauge, and the calculator adjusts stitch and row counts for the entire pattern. In target width mode, enter your gauge and desired finished width, and the calculator returns the exact cast-on or starting chain count.",
        "For swatch mode, knit or crochet a swatch at least 6 inches square in the stitch pattern you plan to use. Measure the center 4 inches — edge stitches distort gauge readings. Count stitches and rows within that measured area and enter those numbers.",
        "For resize mode, you need both the pattern's stated gauge (printed at the top of most patterns) and your own measured gauge. The calculator multiplies every stitch and row count in the pattern by the ratio between these two gauges."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Stitches per inch controls the width of your finished piece. Rows per inch controls the length. For most flat projects — scarves, blankets, dishcloths — stitch gauge is critical because you cast on a fixed number of stitches, but you can knit to any length by adding or subtracting rows. Row gauge matters most when shaping is involved: raglan yokes, short rows, sock heels, and any section where you must hit a specific length at a specific row count.",
        "A difference of even half a stitch per inch compounds over the width of a garment. At 4.5 stitches per inch instead of 5, a 200-stitch sweater body comes out 44.4 inches wide instead of 40 inches — over 4 inches too large. This is why swatching is not optional for fitted garments."
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
    disclaimer: "Yarn substitution recommendations are provided as guidance only. Fiber content, twist, and construction vary between brands. Always swatch to verify gauge before substituting yarns in a pattern.",
    answerCapsule: "This interactive chart compares all eight Craft Yarn Council yarn weight categories across US, UK, and Australian naming systems. Use it to identify yarn weights, check substitution compatibility, and find recommended needle and hook sizes for any weight category.",
    internalLinks: [
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Verify your gauge after substituting yarn" },
      { label: "Yarn Yardage Calculator", href: "/yarn-calculator", description: "Calculate how much substitute yarn you need" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Find the right needle or hook size for your yarn weight" },
    ],
    introduction: {
      title: "Why You Need a Yarn Weight Reference Chart",
      paragraphs: [
        "A pattern calls for DK weight yarn, but the label on your skein says 8-ply — are they the same thing? Different countries and manufacturers use different naming conventions for yarn thickness, and the confusion can lead to purchasing the wrong weight entirely and producing fabric with incorrect drape and gauge.",
        "Australian and British patterns use ply counts, North American patterns use category names, and European labels often list only recommended needle size in millimeters. A comprehensive reference chart bridges these systems so you can substitute yarns confidently across international patterns.",
      ],
    },
    whatIs: {
      title: "What Are Yarn Weight Categories?",
      paragraphs: [
        "The Craft Yarn Council established a standardized system of eight weight categories numbered 0 through 7, from lace weight at the finest end to jumbo at the heaviest. Each category defines a range of acceptable gauges, recommended needle or hook sizes, and common project applications.",
        "These categories provide a universal language for yarn thickness. Category 3, called DK or light worsted, is the same as 8-ply in Australian terminology and roughly corresponds to what many European brands label as suitable for 4.0mm needles. The chart maps all these naming systems together.",
        "Within each category there is still variation — a loosely spun DK and a tightly plied DK will behave differently despite sharing a label. The weight category is a starting point for selection, and swatching confirms whether a specific yarn performs as expected for your chosen pattern.",
      ],
    },
    howCalculated: {
      title: "How Yarn Weight Is Determined",
      paragraphs: [
        "The simplest hands-on method for identifying yarn weight is the wraps-per-inch test. Wrap your yarn snugly around a ruler for one inch without stretching or overlapping, then count the number of wraps. Each weight category corresponds to a specific WPI range that has been standardized through decades of textile measurement.",
        "For example, 11 wraps per inch identifies DK weight yarn. DK typically knits at 5.5 to 6 stitches per inch on US 5 through 7 needles, or 3.75 to 4.5mm. Worsted weight shows about 9 wraps per inch, while fingering weight shows 14 or more. The WPI test works even when labels are missing or unreadable.",
        "The calculator cross-references WPI ranges, standard gauge ranges, and recommended needle sizes for all eight CYC categories, giving you multiple ways to confirm your yarn weight classification before committing to a pattern or purchasing additional skeins.",
      ],
    },
    howToUse: {
      title: "How to Use the Yarn Weight & Substitution Guide",
      paragraphs: [
        "Browse the interactive chart to look up any standard yarn weight from lace (0) through jumbo (7). Each weight shows the Craft Yarn Council category number, typical gauge range, recommended needle and hook sizes, and common project types. The chart includes US, UK, and Australian naming conventions — what Americans call worsted, Australians call 10-ply, and the UK calls aran or DK depending on the specific weight.",
        "Use the substitution checker to compare two yarn weights side by side. Enter the yarn weight your pattern calls for and the weight you want to use. The checker tells you whether the substitution is compatible, borderline, or incompatible, and explains what adjustments to make if the substitution is borderline."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "A \"compatible\" result from the substitution checker means the two yarns are in the same thickness range and will produce similar gauge on the same needles. It does not mean the finished fabric will look or feel identical. Fiber content, ply structure, and spin direction all affect drape, stitch definition, and halo. A tightly plied merino worsted and a loosely spun single-ply worsted are the same weight but produce very different fabric.",
        "The \"borderline\" result means the substitution may work with a needle size adjustment. For example, a heavy DK yarn can sometimes work in place of a light worsted if you go up one needle size. Always swatch with the substitute yarn to confirm before starting the full project."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "When substituting yarn, match meters per 100 grams first, then check fiber content. Two yarns with the same m/100g will knit at nearly the same gauge regardless of what category name is on the label.",
        "Do not substitute acrylic for wool in stranded colorwork. Acrylic does not felt or bloom, so the floats will not lock together during blocking and the fabric will be loose and sloppy.",
        "Lace weight yarns vary wildly within their category. A cobweb-weight lace at 1,300 yards per 100g is not interchangeable with a heavy lace at 800 yards per 100g, even though both are labeled \"lace.\"",
        "Sport weight and DK weight overlap significantly. If a pattern calls for DK and you have sport weight, swatch on the recommended needles — it may work without changes."
      ],
    },
  },

  "stitch-counter": {
    introduction: {
      title: "Why You Need a Digital Stitch and Row Counter",
      paragraphs: [
        "Losing count on row 47 of a lace pattern means ripping back hours of careful work, stitch by stitch. Physical counters get lost between cushions, and mental counting fails the moment someone asks you a question. A reliable digital counter that stays right on your screen is essential for complex projects.",
        "Reliable stitch and row tracking is especially critical for patterns with repeating sequences — cables every eighth row, decreases every sixth row, or color changes at specific intervals. One missed count can cascade into visible errors that are impossible to fix without unraveling significant progress.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch and Row Counter?",
      paragraphs: [
        "A stitch and row counter is a tracking tool that records your current position within a knitting or crochet pattern. Unlike physical barrel counters that click one number at a time, a digital counter can track multiple counts simultaneously — total rows, pattern repeat position, and shaping intervals all at once.",
        "This digital counter persists in your browser, meaning your count survives closing the tab or shutting down your computer. It functions as a dedicated project notebook that is always accessible from any device, eliminating the need for pencil tick marks or separate tracking apps.",
      ],
    },
    howCalculated: {
      title: "How Stitch Counting Works",
      paragraphs: [
        "Unlike other calculators, the stitch counter is not a mathematical formula tool — it is a tracking and reminder system. The value comes from methodical position tracking within your pattern, ensuring you always know exactly where you are in a sequence of instructions.",
        "For example, suppose your pattern says work 12 rows even in stockinette, then decrease one stitch each side every other row for 8 rows. Set the counter to zero at the start of the section and note that row 12 triggers the first decrease. Rows 12, 14, 16, 18, 20, 22, 24, and 26 are all decrease rows.",
        "By recording these milestones before you begin, you transform a complicated set of written instructions into a simple numerical checklist. Each click of the counter tells you instantly whether the current row requires action or is a plain pass-through row.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch & Row Counter",
      paragraphs: [
        "Tap the plus button to add a new counter. You can run multiple counters simultaneously — one for row count, one for pattern repeat tracking, one for increase intervals, or any other count you need to track. Name each counter before you start so you can tell them at a glance. Tap the counter to increment by one, or use the minus button to correct mistakes.",
        "Set row reminders on any counter to get a notification at a specific count. This is useful for patterns that say \"increase every 6th row\" or \"change color at row 40.\" The counter works offline, so it stays active even when you lose signal or switch to airplane mode."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each counter displays a running total that persists until you reset it. If you are using multiple counters, each one tracks independently. A typical setup for a sweater might use three counters: one for total rows worked, one counting rows since the last increase, and one tracking pattern repeats within a row.",
        "The row reminder triggers at the exact count you set, then can be configured to repeat at the same interval. If you set a reminder at row 6, it can repeat at 12, 18, 24, and so on — matching the cadence of evenly spaced increases or color changes."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Name your counters descriptively before starting — \"Body Rows,\" \"Sleeve Inc,\" \"Cable Repeat\" — so you do not confuse them when you pick up your project after a break.",
        "Use a dedicated counter for stitch marker positions if you tend to lose track of which marker you are at in a complex pattern.",
        "The counter works offline and stores state locally, so you can use it at a craft fair, waiting room, or anywhere without cell signal.",
        "Reset counters to zero only after you have recorded the final count somewhere permanent. There is no undo for a reset."
      ],
    },
  },

  "blanket-calculator": {
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
        "The calculation starts with mattress dimensions and adds overhang and tuck allowances. For a queen bed measuring 60 by 80 inches with 10 inches of overhang on each side, the finished blanket needs to be 80 inches wide and 90 inches long — 60 plus 10 on each side for width, 80 plus 10 for the foot.",
        "Next, multiply by your gauge to get stitch and row counts. At a gauge of 4 stitches per inch, an 80-inch width requires 320 stitches to cast on. At 5 rows per inch, 90 inches of length means 450 rows of knitting. These numbers let you verify that your pattern repeat divides evenly into the stitch count.",
        "Finally, multiply the fabric area by your yarn weight consumption rate to estimate total yardage. An 80 by 90 inch blanket at worsted weight might need upward of 5,000 yards, translating to roughly 25 standard skeins. Knowing this upfront lets you budget and buy with confidence.",
      ],
    },
    howToUse: {
      title: "How to Use the Blanket Size Calculator",
      paragraphs: [
        "Select a standard blanket size preset — baby, throw, twin, full, queen, or king — or enter custom dimensions in inches. Next, enter your gauge: stitches per inch and rows per inch from your swatch. The calculator outputs the exact cast-on stitch count, total row count, and estimated yarn yardage for the finished blanket.",
        "The stitch count and row count are directly derived from your entered gauge multiplied by the blanket dimensions. If your gauge is 4 stitches per inch and the blanket is 50 inches wide, the calculator returns a 200-stitch cast-on. The yarn yardage estimate uses standard consumption rates for the yarn weight you select."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The stitch and row counts are only as accurate as your gauge input. If your actual working gauge differs from what you entered — even by a quarter stitch per inch — the finished blanket dimensions will be off. For a 60-inch-wide blanket, a 0.25 st/in error produces a blanket that is 3-4 inches wider or narrower than intended. Swatch accurately.",
        "The yarn yardage estimate includes a built-in buffer for weaving in ends and normal waste. If you are adding fringe, a border in a different stitch, or any embellishment, add that yardage separately. The estimate assumes a single consistent stitch pattern across the entire blanket."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Add 10-20% extra yarn beyond the estimate if you plan to add seams, fringe, tassels, or a crocheted border around a knit blanket.",
        "Baby blankets knit fastest in bulky or super-bulky yarn. A worsted-weight baby blanket is a 20+ hour project. A super-bulky version finishes in 6-8 hours.",
        "Queen and king size blankets in worsted weight require 2,000 to 4,000+ yards. Plan your budget and storage before committing — that is 15 to 30 skeins of yarn.",
        "For afghans made of joined squares, calculate yardage per square, then multiply by the number of squares plus 10% for joining."
      ],
    },
  },

  "increase-decrease-calculator": {
    introduction: {
      title: "Why You Need an Increase and Decrease Calculator",
      paragraphs: [
        "The pattern says \"increase 12 stitches evenly across the next row\" — but how exactly do you space them so the fabric looks smooth and professional? Uneven distribution creates visible lumps and puckers that no amount of blocking will fix. The math is simple in theory but tricky to execute by hand.",
        "Even experienced knitters pause when they encounter evenly spaced shaping instructions. The division rarely comes out to a clean whole number, and distributing the remainders correctly requires careful planning. This calculator handles the arithmetic instantly so you can focus on the craft itself.",
      ],
    },
    whatIs: {
      title: "What Is Even Stitch Distribution?",
      paragraphs: [
        "Even stitch distribution is the mathematical process of spacing increases or decreases uniformly across a row or round so the shaping is invisible in the finished fabric. Rather than clumping all the changes in one area, you spread them at regular intervals to maintain consistent fabric tension and appearance.",
        "This technique appears constantly in pattern construction — transitioning from ribbing to body gauge, shaping sleeve caps, adjusting hat crown decreases, and forming waist shaping on garments. Mastering the distribution math is fundamental to professional-quality results in any shaped knitting or crochet project.",
        "The challenge is that the total stitch count rarely divides evenly by the number of increases or decreases. You need a strategy for distributing remainder stitches so the spacing looks uniform to the eye even when the intervals are not perfectly identical across every section.",
      ],
    },
    howCalculated: {
      title: "How Stitch Distribution Is Calculated",
      paragraphs: [
        "Start with the current stitch count and the target count. If you have 80 stitches and need to increase to 92, that means 12 increases to distribute. Divide the current count by the number of increases: 80 divided by 12 equals 6.67, which tells you the base interval is every 6 stitches with some left over.",
        "The remainder determines how many sections get an extra stitch. With 80 stitches and 12 increases, 12 times 6 is 72, leaving 8 remainder stitches. So 8 of your 12 sections will be 7 stitches long and the remaining 4 sections will be 6 stitches long, producing an almost invisible distribution.",
        "The calculator outputs the exact sequence — for example, work 7, increase, work 7, increase (repeat 7 more times), then work 6, increase, work 6, increase (repeat 3 more times). This row-by-row instruction eliminates counting errors and produces beautifully even shaping every time.",
      ],
    },
    howToUse: {
      title: "How to Use the Increase & Decrease Calculator",
      paragraphs: [
        "Enter your starting stitch count — the number of stitches currently on your needle or hook. Enter your target stitch count — the number you need after all increases or decreases are worked. Then enter the number of rows or rounds over which you want to distribute these changes. The calculator figures out whether you are increasing or decreasing based on which count is larger.",
        "The output gives you row-by-row instructions showing exactly where to work each increase or decrease across the row. If you need to go from 80 to 100 stitches over 10 rows, the calculator tells you which rows to increase on and how to space the increases within those rows.",
        "For single-row distribution (all changes in one row), set the row count to 1. The calculator will space the increases or decreases as evenly as possible across that row."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "\"Evenly spaced\" means the calculator distributes changes across the row so there is no bunching or clustering. If you are increasing 12 stitches across a row of 80, the increases land roughly every 6-7 stitches. When the number does not divide evenly, the calculator shows how to handle the remainder — typically by spacing the extra stitches at the beginning or end of the row.",
        "The row-by-row output assumes you work changes on the specified rows and work plain (no-change) rows in between. For knitting, increases and decreases are typically worked on right-side rows. The calculator accounts for this by distributing changes across the available shaping rows."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "For sleeve shaping, always work decreases at the same position — typically one stitch in from each edge — to create a tidy, visible decrease line along the seam.",
        "When shaping in the round, place increases at the same stitch marker position every time. This creates a consistent shaping line and makes it easy to count completed increases.",
        "Double-check your math by adding the number of increases to your starting count. The result should equal your target count exactly.",
        "If the calculator shows an awkward remainder (like one extra stitch at the end), place that extra change in the center of the row where it is least visible."
      ],
    },
  },

  "stripe-generator": {
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
        "As stripes are assigned, the generator tracks the cumulative row count for each color. If color A has been used for 80 rows, color B for 70, and color C for 50, the algorithm weights the next assignment toward color C to keep the distribution roughly even \u2014 unless you have set custom weights.",
        "Per-color yardage is then calculated by multiplying each color\u2019s total row count by the estimated yards per row at your gauge and project width. For a 48-inch-wide blanket in worsted weight, each row uses approximately 4.5 yards, so 67 rows of one color would require about 302 yards.",
      ],
    },
    howToUse: {
      title: "How to Use the Stripe Pattern Generator",
      paragraphs: [
        "Enter the number of colors in your stripe sequence — anywhere from 2 to 10. Select a stripe width option: uniform (all stripes the same width), graduated (stripes that grow or shrink), or random. In random mode, the generator picks stripe widths within a range you define. You can also set structured repeating patterns like 2-4-2 or 1-3-5-3-1.",
        "The output shows the full color sequence as a visual stripe preview plus a row-by-row breakdown listing which color to use for each section. Per-color yardage estimates show how much of each color you need based on the stripe widths and your entered project dimensions."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Yardage estimates assume each stripe is worked at a consistent width. If you deviate from the generated widths — making some stripes wider or narrower as you go — the per-color proportions shift and the estimates will be off. Recalculate if you make changes.",
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
  },

  "abbreviation-glossary": {
    introduction: {
      title: "Why You Need an Abbreviation & Stitch Glossary",
      paragraphs: [
        "Halfway through a vintage pattern, you hit \u201csl1-k2tog-psso\u201d and freeze \u2014 what does that mean? Knitting and crochet patterns rely on over a hundred standard abbreviations, and designers sometimes invent their own. Without a reliable reference, one misread abbreviation can derail an entire project.",
        "The confusion doubles when you cross the Atlantic. UK and US crochet terminology uses the same words for completely different stitches, so a British pattern calling for double crochet produces a fundamentally different fabric than the American stitch of the same name. A searchable glossary with a US/UK toggle eliminates this guesswork entirely.",
      ],
    },
    whatIs: {
      title: "What Is an Abbreviation & Stitch Glossary?",
      paragraphs: [
        "An abbreviation glossary is a searchable database of knitting and crochet abbreviations paired with their full names, definitions, and step-by-step execution instructions. It covers standard abbreviations published by the Craft Yarn Council as well as widely used designer shorthand for cables, colorwork, and lace.",
        "The US/UK toggle switches the entire glossary between American and British terminology. Each entry shows the equivalent abbreviation in the other system when one exists, making it possible to work confidently from patterns published in either country.",
        "The pattern translator feature goes further \u2014 paste a full instruction line and the glossary expands every abbreviation into plain language. This is especially useful for complex stitch sequences where multiple abbreviations stack together in a single instruction.",
      ],
    },
    howCalculated: {
      title: "How UK/US Term Conversion Works",
      paragraphs: [
        "The UK/US conversion is not random \u2014 it follows a systematic offset. Every UK crochet term is one step higher than its US equivalent. UK double crochet equals US single crochet. UK treble equals US double crochet. UK double treble equals US treble. The entire naming ladder shifts by one rung.",
        "This offset exists because UK terminology counts the loops on the hook, while US terminology counts the yarn overs before insertion. A US single crochet has zero yarn overs before inserting; the UK calls it double crochet because there are two loops on the hook after pulling up. Understanding this logic makes the entire conversion table predictable rather than something to memorize.",
      ],
    },
    howToUse: {
      title: "How to Use the Abbreviation & Stitch Glossary",
      paragraphs: [
        "Type any abbreviation into the search field to find its full name, description, and step-by-step execution. The glossary covers both knitting and crochet abbreviations. Use the US/UK toggle to switch between American and British terminology — the glossary shows the equivalent abbreviation in the other system when one exists.",
        "Each entry includes a written description of how to work the stitch, the stitch symbol used in charts, and for common stitches, a step-by-step diagram. Browse by category (increases, decreases, basic stitches, cables, colorwork) or search directly."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The US/UK toggle shows the equivalent term in the other system. \"dc\" in US crochet means double crochet (yarn over, insert hook, pull up loop, yarn over, pull through two, yarn over, pull through two). \"dc\" in UK crochet means what Americans call single crochet — a completely different stitch. The toggle makes this distinction explicit so you can work from any pattern regardless of its country of origin.",
        "Some abbreviations have no direct equivalent in the other system and are flagged as such. Proprietary stitch abbreviations invented by individual designers are not included — those are defined within the pattern itself."
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
    introduction: {
      title: "Why You Need a Spinning Wheel Ratio Calculator",
      paragraphs: [
        "Spinning consistent yarn requires understanding the relationship between your drive wheel speed and the twist entering your fiber. Too much twist and your singles kink and snarl. Too little twist and the yarn drifts apart when you stop treadling. The ratio between wheel and whorl governs this balance entirely.",
        "Whether you are setting up a new wheel, switching whorls for a different yarn weight, or troubleshooting twist problems in your current project, knowing your exact drive ratio and resulting twist per inch removes the guesswork from handspinning and lets you reproduce results from one bobbin to the next.",
      ],
    },
    whatIs: {
      title: "What Is a Spinning Wheel Ratio?",
      paragraphs: [
        "The drive ratio is the number of times the flyer or spindle rotates for each full turn of the drive wheel. It is determined by dividing the drive wheel diameter by the whorl diameter. A higher ratio produces more twist per treadle cycle, suitable for fine yarns. A lower ratio produces less twist, better for bulky or art yarns.",
        "Twist per inch (TPI) measures how many times the fiber rotates within one inch of finished yarn. TPI directly affects the yarn\u2019s strength, softness, and drape. High TPI creates smooth, durable, tightly structured yarn. Low TPI creates soft, lofty yarn with more air trapped between fibers.",
        "Plying calculations reverse the twist direction and use a different ratio to balance the finished yarn. Two singles twisted clockwise are plied counterclockwise at roughly half the singles TPI to produce a balanced two-ply that hangs straight without twisting back on itself.",
      ],
    },
    howCalculated: {
      title: "How Spinning Ratios Are Calculated",
      paragraphs: [
        "The core formula divides the drive wheel diameter by the whorl diameter. For example, a drive wheel measuring 22 inches in diameter with a whorl of 2.5 inches gives a ratio of 22 divided by 2.5, which equals 8.8 to 1. Each full treadle cycle rotates the flyer 8.8 times.",
        "At a treadling speed of one full revolution per second, that 8.8-to-1 ratio delivers 8.8 twists per second into the drafting zone. If you are spinning worsted-weight singles at a target of 5 twists per inch, you need to draft the fiber at 8.8 divided by 5, or 1.76 inches per second, to hit that target TPI consistently.",
        "For plying, the calculator halves the singles TPI as a starting point. If your singles have 10 TPI, you ply at roughly 5 TPI in the opposite direction. The calculator then recommends a whorl size that delivers that plying TPI at your natural treadling speed.",
      ],
    },
    howToUse: {
      title: "How to Use the Spinning Wheel Ratio Calculator",
      paragraphs: [
        "Enter your drive whorl diameter and flyer whorl diameter (or select your wheel model if listed) to calculate the drive ratio. The calculator shows the resulting ratio and the twist per inch (TPI) you can expect at different treadling speeds. For plying, enter your singles TPI and the number of plies to get the recommended plying ratio.",
        "This calculator is designed for wheel spinning — double drive, scotch tension, and irish tension systems. Drop spindle ratios are determined by spindle weight and whorl diameter, which follow different physics. If you spin on a drop spindle, use the TPI measurement section independently."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The drive ratio tells you how many times the flyer rotates for each full turn of the drive wheel. A 6:1 ratio means 6 flyer rotations per treadle cycle. Higher ratios produce more twist per inch at the same treadling speed, which means finer, tighter singles. Lower ratios are better for bulky, low-twist yarns.",
        "Twist per inch (TPI) directly affects yarn character. High TPI (above 8) creates strong, durable, smooth yarn suitable for socks and hard-wearing garments. Low TPI (below 4) creates soft, lofty, fragile yarn best for shawls and garments worn against the skin. The sweet spot depends on fiber length and intended use."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Ply at roughly half the singles TPI for a balanced yarn. If your singles have 10 TPI, ply at approximately 5 TPI in the opposite direction.",
        "Ashford Traveller whorls give you ratios from 5:1 to 13:1. Know your wheel's full range and which whorl you need before starting a project.",
        "Spin a sample length and measure the TPI before committing to a full bobbin. Wrap the singles around a ruler for one inch and count the twists.",
        "For art yarns with intentional low twist, use your largest whorl (lowest ratio) and treadle slowly. Over-twist is the most common beginner mistake in art yarn spinning."
      ],
    },
  },

  "stitch-pattern-calculator": {
    answerCapsule: "This calculator finds compatible stitch counts for sampler blankets and multi-pattern projects. Browse 50+ stitch patterns, enter their multiples, and get exact cast-on counts that work for every pattern section — no manual arithmetic needed.",
    internalLinks: [
      { label: "Gauge Calculator", href: "/gauge-calculator", description: "Calculate your stitches per inch to determine target width" },
      { label: "Yarn Weight Chart", href: "/yarn-weight-chart", description: "Check yarn weight compatibility for your project" },
      { label: "Needle & Hook Converter", href: "/needle-converter", description: "Find the right hook or needle size for your yarn" },
    ],
    introduction: {
      title: "Why You Need a Stitch Pattern Calculator",
      paragraphs: [
        "Planning a sampler blanket with shell stitch requiring a multiple of 6 plus 1 and waffle stitch requiring a multiple of 3 \u2014 what cast-on count works for both panels? Finding a number that satisfies two or more stitch multiples by hand involves trial, error, and arithmetic that gets tedious fast.",
        "Any project combining different stitch patterns needs a compatible stitch count across all sections. Blanket panels, yoke transitions, and border-to-body joins all require this calculation. Getting it wrong means partial pattern repeats at the edges, which look unfinished and amateur regardless of your stitch quality.",
      ],
    },
    whatIs: {
      title: "What Is a Stitch Pattern Calculator?",
      paragraphs: [
        "A stitch pattern calculator finds stitch counts that are compatible with one or more pattern repeats using the least common multiple (LCM). Every stitch pattern has a repeat \u2014 expressed as a multiple plus an offset, like \u201cmultiple of 6 + 1.\u201d The calculator finds counts that satisfy all entered repeats simultaneously.",
        "The offset accounts for edge or balancing stitches outside the repeating unit. Shell stitch might repeat over 6 stitches but need 1 extra stitch at the end to balance the last shell. The calculator incorporates these offsets so every pattern repeat is complete with no partial shells, cables, or lace motifs at the edges.",
        "When multiple patterns are entered, the calculator finds the LCM of their base multiples, then checks which offsets are compatible. It returns a list of valid stitch counts near your target width so you can choose the one closest to your desired dimensions.",
      ],
    },
    howCalculated: {
      title: "How Stitch Compatibility Is Calculated",
      paragraphs: [
        "The calculator uses the least common multiple of the base multiples. For shell stitch with a multiple of 6 and waffle stitch with a multiple of 3, the LCM of 6 and 3 is 6. This means every 6 stitches, both patterns complete a full repeat.",
        "Adding the offset, shell stitch needs multiples of 6 plus 1. So the compatible stitch counts are 7, 13, 19, 25, 31, and so on \u2014 each one a multiple of 6 with 1 added. The calculator checks that waffle stitch (multiple of 3 + 0) also works at these counts: 7 divided by 3 gives 2 remainder 1, so waffle needs adjustment. The tool flags conflicts and suggests the nearest counts that satisfy all patterns.",
        "For more complex combinations \u2014 say multiples of 8 + 2, 5 + 1, and 3 + 0 \u2014 the LCM of 8, 5, and 3 is 120. The calculator then tests each offset combination against 120 to find valid totals, narrowing the list to counts near your target width at gauge.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch Pattern Calculator",
      paragraphs: [
        "Enter the stitch multiple for your pattern. A stitch multiple is written as a number plus a remainder — for example, \"multiple of 6 + 2\" means the pattern repeat requires 6 stitches, plus 2 extra edge stitches. Enter the base multiple (6) and the extra stitches (2) separately. Then enter your target cast-on count or desired width in inches with your gauge.",
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
  },

  "stitch-quick-reference": {
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
        "The reference covers foundation stitches, basic stitches from chain through treble, increases, decreases, and common specialty stitches. Each card is designed as a memory aid \u2014 compact enough to glance at mid-row without losing your place in the pattern.",
        "Stitch anatomy diagrams show where each part of the stitch sits: the post, the top loops, the back bump, and the turning chain. Understanding these components helps you identify where to insert your hook or needle for variations like back loop only, front post, or linked stitches.",
      ],
    },
    howCalculated: {
      title: "How Stitch Anatomy Is Determined",
      paragraphs: [
        "Stitch construction is not calculated mathematically \u2014 it is determined by the sequence of yarn overs and pull-throughs that define each stitch. Consider the double crochet: yarn over, insert hook, yarn over and pull up a loop (3 loops on hook), yarn over and pull through 2 (2 loops remain), yarn over and pull through 2 (stitch complete). That is 4 total yarn overs from start to finish.",
        "Each additional yarn over before insertion adds height to the stitch. Single crochet has zero yarn overs before inserting. Half double crochet has one. Double crochet has one. Treble crochet has two. This progression creates the predictable height ladder that determines turning chain counts and stitch gauge.",
      ],
    },
    howToUse: {
      title: "How to Use the Stitch Quick Reference",
      paragraphs: [
        "Browse stitch cards by category — basic stitches, increases, decreases, textured stitches, and specialty stitches. Each card shows a step-by-step visual breakdown of the stitch movement: where to insert, how to wrap, which loops to pull through, and the resulting loop count on your hook or needle after each step.",
        "The yarn over and loop count indicators on each card show exactly what should be on your needle or hook at each stage. This is especially helpful for complex stitches like the puff stitch, bobble, or cable cross, where keeping track of loops mid-stitch is critical."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each stitch card shows the mechanical movement sequence for one stitch execution. The cards are designed as a quick memory aid — enough to reconstruct a stitch you have done before but temporarily forgotten. They are not a substitute for learning the stitch from a video or instructor for the first time.",
        "The turning chain information on crochet stitch cards tells you how many chain stitches to work at the beginning of a row for that stitch height. Turning chain counts vary slightly between patterns — the reference shows the standard count, but your pattern may specify differently."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Bookmark the specific stitch card you are working with before starting a session. Mid-row is not the time to be scrolling through a full reference.",
        "Slip stitch in crochet is not the same movement as slip stitch in knitting. The reference distinguishes between them — make sure you are looking at the correct craft.",
        "For Tunisian crochet stitches, the forward pass and return pass are shown as separate steps. Work through the forward pass completely before starting the return.",
        "If a stitch card shows a movement you cannot replicate, check your hook or needle orientation. Left-handed and right-handed versions of the same stitch mirror each other."
      ],
    },
  },

  "uk-to-us-converter": {
    introduction: {
      title: "Why You Need a UK to US Crochet Terms Converter",
      paragraphs: [
        "British crochet patterns use the same stitch abbreviations as American patterns but mean completely different stitches. A UK double crochet is actually a US single crochet — the names are shifted by one step. Getting this wrong does not just change the look of your project; it changes the size, drape, and stitch count entirely.",
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
        "As a concrete example, a UK pattern instruction reading 3dc in next st converts to 3sc in next st in US terms. A row reading ch3, 2tr in next st, tr in each st across converts to ch3, 2dc in next st, dc in each st across. The stitch count stays the same — only the names change.",
        "The converter handles abbreviations, full stitch names, and vintage UK terminology, which sometimes differs from modern UK usage. It flags any term where vintage and modern interpretations diverge so you can check context in the original pattern.",
      ],
    },
    howToUse: {
      title: "How to Use the UK to US Crochet Terms Converter",
      paragraphs: [
        "Type a UK crochet term — abbreviated or full — and the converter returns the US equivalent. You can also paste an entire pattern row, and the converter will replace all UK terms with their US counterparts in one pass. Toggle the direction to convert from US to UK instead.",
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
        "Staggered increases are the key to a smooth circle versus a hexagonal shape. If you place every increase directly above the increase from the previous round, the increases stack and create visible points — turning your circle into a hexagon. Staggering offsets the increase positions each round, distributing them evenly around the circumference.",
        "Single crochet circles use six increases per round because single crochet has a nearly one-to-one height-to-width ratio. Half double crochet needs eight increases per round. Double crochet, being taller, requires twelve increases per round to keep the fabric flat.",
      ],
    },
    howCalculated: {
      title: "How Circle Patterns Are Calculated",
      paragraphs: [
        "The math starts with the stitch ratio. Single crochet has a nearly square profile — its height roughly equals its width. This means each round adds one stitch-width of circumference, requiring six new stitches per round to maintain a flat circle (based on the geometric relationship between radius and circumference).",
        "For a single crochet circle: start with six single crochet in a magic ring. Round two: increase in every stitch for twelve total. Round three: alternate one single crochet and one increase around for eighteen total. Each subsequent round adds six stitches, with the increases staggered to avoid stacking.",
        "The calculator handles the staggering math automatically, which becomes increasingly complex in later rounds. By round ten, you are working eight single crochet between increases, and the offset pattern requires careful tracking. The generated pattern eliminates counting errors and ensures a perfectly round result.",
      ],
    },
    howToUse: {
      title: "How to Use the Perfect Circle Calculator",
      paragraphs: [
        "Select your stitch type — single crochet, half double crochet, or double crochet. Each stitch height requires a different number of increases per round to keep the circle flat. Enter the number of rounds you want, and the calculator generates a complete round-by-round pattern with exact stitch counts and increase placement.",
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
        "For oval shapes, add a foundation chain between the starting increases. The calculator generates true circles — ovals require a different construction method."
      ],
    },
  },

  "needle-guide": {
    introduction: {
      title: "Why You Need a Sewing & Craft Needle Guide",
      paragraphs: [
        "You need to weave in ends on a chunky blanket, sew seed beads onto a doily, and finish a cross stitch piece — three projects sitting in your craft basket right now, and each one requires a completely different needle. Grabbing the wrong one means split yarn, broken beads, or damaged fabric.",
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
        "Needle selection is not math-based — it follows a decision tree based on your task and materials. The first question is whether you need to pierce the fabric or pass between existing stitches. Piercing requires a sharp tip. Passing between stitches requires a blunt tip to avoid splitting yarn.",
        "For example, weaving in yarn ends on a knitted or crocheted project calls for a tapestry needle — blunt tip, large eye. Piercing through woven fabric to attach an applique calls for a chenille needle — sharp tip, large eye. Stringing seed beads requires a beading needle — thin, flexible shaft with a tiny eye that fits through bead holes.",
        "Needle sizing runs counterintuitively: larger numbers mean smaller needles. A size 18 tapestry needle has a wider shaft and larger eye than a size 24. Match your needle size to your thread or yarn thickness — the eye should be large enough to thread easily but small enough that the needle does not leave visible holes in the fabric.",
      ],
    },
    howToUse: {
      title: "How to Use the Sewing & Craft Needle Guide",
      paragraphs: [
        "Browse needles by type — tapestry, chenille, embroidery (crewel), sharps, betweens, beading, darning, and specialty needles. Each needle card shows the tip profile (blunt, sharp, or ball-point), eye shape and size, recommended materials, and the tasks it is best suited for.",
        "Use the guide to find the right needle for your finishing task. The difference between a tapestry needle and a chenille needle is the tip — tapestry is blunt, chenille is sharp. Both have large eyes for thick thread or yarn, but you reach for one or the other depending on whether you are weaving through existing stitches or piercing fabric."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The guide organizes needles by what they are designed to do, not by brand or arbitrary numbering. Needle size numbers run in the opposite direction from what you might expect — larger numbers mean smaller needles, just like knitting needle UK sizing. A size 18 tapestry needle is larger than a size 24.",
        "Material recommendations indicate which needle types work best with specific fibers and fabrics. Wool yarn and knitted fabric call for blunt tapestry needles. Woven fabric and cotton thread call for sharps. Beadwork requires specialty beading needles thin enough to pass through seed bead holes."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Use tapestry needles (blunt tip) for weaving in ends on knitted and crocheted fabric. Sharp needles split the yarn and create a weak, messy join.",
        "Embroidery needles — also called crewel needles — have elongated eyes designed to hold multiple strands of floss. Use them for surface embroidery, not for weaving in yarn ends.",
        "Size up your needle eye before threading. Forcing thick thread through a too-small eye damages the thread fibers and weakens your stitching.",
        "Bent-tip tapestry needles are not a gimmick. They make weaving in ends on stockinette noticeably faster by following the curve of the stitch."
      ],
    },
  },

  "amigurumi-shapes": {
    introduction: {
      title: "Why You Need an Amigurumi Shapes Guide",
      paragraphs: [
        "Every amigurumi toy is built from basic geometric shapes — spheres for heads, cones for limbs, cylinders for bodies, and ovals for feet. Mastering these foundational shapes lets you design original characters without depending on someone else's pattern for every new project.",
        "Getting the increase and decrease rates right determines whether your sphere looks like a ball or a football, whether your cone tapers smoothly or steps awkwardly. This calculator generates precise round-by-round patterns for each shape so your amigurumi pieces come out clean and symmetrical every time.",
      ],
    },
    whatIs: {
      title: "What Are Amigurumi Shapes?",
      paragraphs: [
        "Amigurumi shapes are three-dimensional crochet forms created by strategically placing increases and decreases in a continuous spiral of single crochet. A sphere increases to a midpoint, works several even rounds, then decreases symmetrically. A cone increases gradually without decreasing. A cylinder increases to the target width and then works even rounds indefinitely.",
        "All amigurumi shapes use single crochet worked in a continuous spiral — no joining slip stitches, no turning chains. The tight, dense fabric this creates prevents stuffing from showing through. Using a hook one or two sizes smaller than the yarn label recommends produces the firm fabric that amigurumi requires.",
        "These shapes are the building blocks that combine into finished toys. A bear is two spheres (head and body), four cones (limbs), and two small ovals (ears). Understanding how each shape is constructed gives you the freedom to modify proportions and design your own characters from scratch.",
      ],
    },
    howCalculated: {
      title: "How Amigurumi Shape Patterns Are Calculated",
      paragraphs: [
        "Each shape follows a mathematical increase and decrease schedule. For a sphere starting with six single crochet in a magic ring: increase six stitches per round for six rounds, reaching forty-two stitches at the widest point. Work three even rounds at forty-two stitches to create the equator of the sphere.",
        "Then decrease six stitches per round for six rounds, working back down to six stitches. Stuff the sphere firmly before the opening gets too small — trying to stuff through a tiny hole creates lumpy, uneven filling. Close the final six stitches by threading yarn through all loops and pulling tight.",
        "Cones use the same six-per-round increase rate but skip the decrease phase entirely. A cylinder increases to the target circumference and then works even rounds — no increases, no decreases — for as many rounds as you need. The calculator handles the stitch placement math for all of these variations.",
      ],
    },
    howToUse: {
      title: "How to Use the Amigurumi Shapes Guide",
      paragraphs: [
        "Select a shape — sphere, cone, cylinder, or oval — and enter the maximum stitch count for the widest round. This determines the finished size at your gauge. The calculator generates a complete round-by-round pattern starting with a magic ring and ending with a decrease closure. All shapes use single crochet worked in a continuous spiral.",
        "The round-by-round output shows the stitch count for each round and marks where to place increases and decreases. For a sphere, the pattern increases symmetrically to the midpoint, then decreases symmetrically to close. For a cone, increases are worked at a steady rate with no decrease section."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Each round lists the total stitch count and the specific increase or decrease placement within that round. The final round count at the widest point determines the circumference of the shape. At a gauge of 5 single crochet per inch, a widest round of 30 stitches produces a shape approximately 6 inches in circumference, or about 2 inches in diameter.",
        "The continuous spiral construction means there is no slip stitch join and no turning chain between rounds. Place a locking stitch marker at the first stitch of each round and move it up as you work. Stuff the shape firmly before closing — understuffed amigurumi lose their shape over time."
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
  },

  "cross-stitch-calculator": {
    introduction: {
      title: "Why You Need a Cross Stitch Size Calculator",
      paragraphs: [
        "Your pattern is 150 by 200 stitches, but how big will it actually be when stitched on Aida 14 versus Aida 18? And once you know the finished size, how much fabric do you need to buy with enough margin for hooping and framing? These two questions stop more cross stitch projects before they start than any other.",
        "Fabric count changes everything about a cross stitch project \u2014 the finished dimensions, the level of detail visible to the eye, the number of strands to use, and the total thread consumption. A size calculator lets you compare counts side by side before committing to fabric and floss purchases.",
      ],
    },
    whatIs: {
      title: "What Is a Cross Stitch Size Calculator?",
      paragraphs: [
        "A cross stitch size calculator converts a pattern\u2019s stitch dimensions into physical finished dimensions based on your chosen fabric count. Fabric count is the number of stitchable squares per inch \u2014 Aida 14 has 14 squares per inch, Aida 18 has 18. Higher counts produce smaller, finer stitches and a smaller finished piece.",
        "Beyond finished size, the calculator estimates fabric yardage needed by adding a border margin on all sides for hooping, framing, or finishing. It can also estimate DMC thread consumption per color based on stitch coverage, helping you build an accurate shopping list before you start stitching.",
      ],
    },
    howCalculated: {
      title: "How Cross Stitch Dimensions Are Calculated",
      paragraphs: [
        "The formula divides the stitch count by the fabric count. For a 150 by 200 stitch pattern on Aida 14: 150 divided by 14 equals 10.7 inches wide, and 200 divided by 14 equals 14.3 inches tall. That is your finished design size before any border or framing allowance.",
        "To determine fabric purchase size, add a margin on each side \u2014 typically 3 inches for framing or 4 inches for scroll frame hooping. Using the example above: 10.7 plus 6 inches (3 per side) equals 16.7 inches wide, and 14.3 plus 6 equals 20.3 inches tall. Round up to the nearest available cut size.",
        "Thread estimation multiplies the stitch count for each color by an average thread length per stitch, which varies by fabric count and number of strands. On Aida 14 with two strands, each cross stitch uses approximately 1 inch of floss. A color covering 500 stitches needs about 500 inches, or roughly 14 yards \u2014 two standard skeins.",
      ],
    },
    howToUse: {
      title: "How to Use the Cross Stitch Size & Thread Calculator",
      paragraphs: [
        "Enter your fabric count — the number of squares per inch on your fabric. Standard Aida counts are 11, 14, 16, and 18. For evenweave and linen, enter the thread count divided by 2 (since you stitch over two threads). Then enter your design dimensions in stitch count — width and height — as listed in your pattern.",
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
    introduction: {
      title: "Why You Need a Weaving Sett Calculator",
      paragraphs: [
        "Wrong sett in weaving creates fabric that is either sleazy \u2014 so open that warp threads shift and gaps appear \u2014 or stiff as a board because the threads are packed too tightly to interlace with any drape. Getting your ends per inch right before warping is the single most important decision in any weaving project.",
        "Sett depends on yarn thickness, weave structure, and intended fabric hand. A yarn that works beautifully in plain weave at 10 ends per inch might need 12 or 14 for twill. Calculating sett from your measured wraps per inch removes the guesswork and prevents the heartbreak of cutting a failed project off the loom.",
      ],
    },
    whatIs: {
      title: "What Is a Weaving Sett Calculator?",
      paragraphs: [
        "A weaving sett calculator determines the ideal ends per inch (EPI) for your warp based on your yarn\u2019s wraps per inch (WPI) and your chosen weave structure. Sett is the spacing of warp threads across the width of the loom \u2014 it controls how densely the threads pack and directly determines the fabric\u2019s weight, drape, and durability.",
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
        "Enter your yarn's wraps per inch (WPI) — the number of times the yarn wraps side by side in one inch without overlapping or leaving gaps. Select your weave structure: plain weave, twill, satin, or lace. The calculator returns the recommended sett in ends per inch (EPI) and can also calculate total warp ends and warp length based on your project dimensions.",
        "The relationship between WPI and sett depends on the weave structure. Plain weave typically sets at half the WPI. Twill sets denser because the float structure allows threads to pack more closely. Lace weave sets more openly to allow the pattern gaps to show."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "EPI (ends per inch) is the number of warp threads per inch across the width. PPI (picks per inch) is the number of weft passes per inch along the length. For a balanced weave — where warp and weft are equally visible — EPI and PPI should be roughly equal. If your EPI is higher than PPI, the warp dominates and you get a warp-faced fabric. Lower EPI relative to PPI creates a weft-faced fabric.",
        "Sett affects both the drape and structure of your finished cloth. A tighter sett (more EPI) produces a firmer, stiffer fabric suitable for bags, upholstery, and rugs. A looser sett creates drapey fabric for scarves and garments. The calculator's recommendation is a starting point — always weave a sample to confirm the hand of the fabric."
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
    introduction: {
      title: "Why You Need a Project Cost Calculator",
      paragraphs: [
        "Someone asks how much you would charge for a hand-knit blanket, and you freeze. You know the yarn cost, maybe the notions, but what about the fifty-plus hours of skilled labor? Without real numbers, most makers drastically underprice their work or avoid selling altogether.",
        "Pricing handmade items fairly requires an honest accounting of every cost — materials, tools, and time. This calculator gives you a clear total so you can set prices that respect your craft, whether you are selling at a market, taking commissions, or simply understanding the true investment in a gift.",
      ],
    },
    whatIs: {
      title: "What Is Project Cost Estimation?",
      paragraphs: [
        "Project cost estimation is the process of calculating the total expense of a handmade fiber arts project, including yarn, notions, and the monetary value of your labor hours. It produces a single number that represents what the finished item actually costs to create from start to finish.",
        "Beyond the raw total, cost estimation also generates per-item and per-use pricing. If you knit ten pairs of socks from the same pattern, your per-pair cost drops because you amortize tools and pattern purchases. Cost-per-wear reframes expensive projects as long-term investments when the item gets heavy daily use.",
      ],
    },
    howCalculated: {
      title: "How Project Cost Is Calculated",
      paragraphs: [
        "The formula is straightforward: total materials plus total labor equals project cost. Consider a throw blanket requiring six skeins of worsted yarn at eight dollars each — that is forty-eight dollars in yarn. Add five dollars for notions like a tapestry needle and stitch markers, and your material cost is fifty-three dollars.",
        "Now add labor. A throw blanket in a simple stitch pattern takes roughly fifty hours for an experienced crocheter. At a target rate of fifteen dollars per hour, labor comes to seven hundred fifty dollars. Your true project cost is eight hundred three dollars. Selling that blanket at one hundred twenty dollars means an effective labor rate of just one dollar and thirty-four cents per hour.",
        "This math is not meant to discourage you — it is meant to inform your pricing decisions. Many makers choose to absorb some labor cost for gifts or personal projects, but commission and retail pricing should reflect the real numbers so you can make sustainable choices about your craft business.",
      ],
    },
    howToUse: {
      title: "How to Use the Project Cost Calculator",
      paragraphs: [
        "Enter the cost per skein and number of skeins for your yarn. Add notions costs — needles, hooks, buttons, zippers, stitch markers, blocking mats, or any other supplies you need for this project. Optionally enter your hourly rate and estimated project hours to see the time-value cost of the project.",
        "The calculator outputs the total material cost, total time cost, combined project cost, and a cost-per-use estimate if you enter expected lifetime uses. This last number is useful for justifying expensive projects — a $200 sweater worn 100 times costs $2 per wear."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Handmade items almost always cost more than their retail equivalents when you factor in labor. A hand-knit sweater in quality yarn typically runs $80-200 in materials and 40-80 hours in labor. At any reasonable hourly rate, the total cost exceeds what a comparable store-bought sweater costs. This is not a reason not to knit — it is context for understanding the real value of what you make.",
        "The cost-per-use metric reframes the conversation. Expensive projects that get heavy use — winter hats, everyday socks, blankets — have a low cost per use over their lifetime. Display pieces that sit in a closet have a high cost per use. Use this number when deciding whether a project is worth the investment."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Track your time honestly. A stockinette sweater in worsted takes 40-60 hours for an experienced knitter. A cabled or colorwork sweater takes 80-120 hours. At $20/hour, that is $800-2,400 in time alone.",
        "For commission pricing, charge at minimum your materials cost plus 50% of your time at a fair hourly rate. Most hand-knit commissions are underpriced because makers do not value their time.",
        "Include blocking supplies, project bags, and shipping costs in your notions total. These hidden costs add up across multiple projects.",
        "Compare yarn cost per yard, not per skein. A $12 skein with 220 yards costs $0.055 per yard. A $9 skein with 120 yards costs $0.075 per yard — the cheaper skein is more expensive."
      ],
    },
  },

  "color-pooling-calculator": {
    introduction: {
      title: "Why You Need a Color Pooling Calculator",
      paragraphs: [
        "Variegated yarn creates random-looking color patches across your fabric — unless you control the stitch count to stack those colors into argyle or plaid patterns. Planned pooling turns apparent chaos into precise geometry, but the math has to be exact or the effect falls apart completely.",
        "Getting the right stitch count by trial and error means frogging and restarting dozens of times. This calculator does the math for you, finding the stitch counts that align your yarn's color repeat into clean vertical columns or diagonal lines on the very first try.",
      ],
    },
    whatIs: {
      title: "What Is Color Pooling?",
      paragraphs: [
        "Color pooling is a technique that manipulates stitch count to force variegated yarn colors into intentional geometric patterns. Instead of the random speckled look most variegated yarns produce, planned pooling creates argyle diamonds, vertical stripes, or diagonal plaid effects using a single strand of yarn.",
        "The technique works because variegated yarns repeat their color sequence at a fixed interval. If your row width matches that interval — or a precise multiple of it — each color lands in the same position every row, stacking into columns. Shifting by one stitch per row creates diagonals instead.",
        "Color pooling works in both knitting and crochet, though crochet is more common because single crochet produces a nearly square stitch that aligns colors more predictably. The key variable is matching your stitch count to the yarn's color repeat length.",
      ],
    },
    howCalculated: {
      title: "How Color Pooling Stitch Counts Are Calculated",
      paragraphs: [
        "Start by measuring your yarn's color repeat. Suppose your variegated yarn cycles through four colors over fifteen stitches — five stitches of blue, three of green, four of gold, and three of cream. That fifteen-stitch repeat is the foundation of every pooling calculation.",
        "Your foundation chain should equal fifteen stitches or a multiple of fifteen. At exactly fifteen stitches per row, each color stacks directly above itself, creating vertical stripes. Each row that shifts by one stitch — say sixteen stitches wide — creates a diagonal pooling effect instead.",
        "The calculator tests stitch counts near your target width and identifies which ones produce vertical alignment, which create diagonal shift, and which result in random pooling. This saves hours of swatching by narrowing the field to the two or three counts most likely to produce clean results.",
      ],
    },
    howToUse: {
      title: "How to Use the Color Pooling Calculator",
      paragraphs: [
        "Enter the color repeat length of your variegated yarn — the number of stitches it takes to complete one full cycle through all colors in the yarn. You can measure this by working a swatch in your target stitch and counting how many stitches it takes to return to the starting color. Then enter the target stitch count for your project width.",
        "The calculator finds stitch counts near your target that align with the yarn's color repeat to produce intentional argyle, plaid, or diagonal pooling effects. It shows which stitch counts create vertical alignment (argyle), which create diagonal shift, and which create random pooling."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Color pooling works when the stitch count per row aligns precisely with the color repeat length of the yarn. If your yarn changes color every 20 stitches and your row is exactly 20 stitches wide, each color lands in the same position every row — creating vertical stripes. At 21 stitches, each color shifts one stitch per row, creating a diagonal. At 22, the shift accelerates.",
        "The calculator marks stitch counts that produce argyle-style pooling, which requires the color repeat to span exactly two rows in a staggered alignment. Slight deviations — even one stitch off — disrupt the pattern. This is why swatching is non-negotiable for color pooling projects."
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Swatch before casting on a full project. Even small gauge differences — a quarter stitch per inch — shift the color alignment enough to break the pooling pattern.",
        "Variegated yarns with 6-8 distinct color sections per repeat work best for pooling. Yarns with gradual color transitions or very short repeats produce muddy results.",
        "Use a simple stitch pattern — stockinette, moss stitch, or single crochet. Complex stitch patterns disrupt the consistent stitch width that pooling depends on.",
        "If pooling breaks partway through your project, your tension has shifted. Check your gauge and adjust hook or needle size before continuing."
      ],
    },
  },

  "thread-converter": {
    introduction: {
      title: "Why You Need an Embroidery Thread Converter",
      paragraphs: [
        "Your cross stitch pattern lists DMC thread numbers, but your local needlework shop only carries Anchor. You need exact equivalents, not guesswork — one shade off on a skin tone or sky gradient and the whole piece looks wrong. Converting between thread brands should not require a wall chart and a magnifying glass.",
        "Whether you are substituting brands by necessity or preference, accurate thread conversion preserves the designer's color intent. This converter maps between major embroidery floss brands so you can shop confidently and stitch without second-guessing every color choice.",
      ],
    },
    whatIs: {
      title: "What Is Embroidery Thread Conversion?",
      paragraphs: [
        "Embroidery thread conversion is the process of finding the closest color match between different floss brands. Each manufacturer uses its own numbering system — DMC 310 is black, but in Anchor that same black is number 403, and in Cosmo it is 600. The numbers are unrelated across brands.",
        "Conversion databases map these numbers by comparing actual thread colors under standardized lighting conditions. The matches represent the closest available equivalent, not an identical dye formula. Two brands may both produce a medium blue, but subtle differences in hue, saturation, or sheen will always exist between manufacturers.",
        "The most commonly converted brands are DMC, Anchor, and Cosmo for hand embroidery floss. DMC is the most widely referenced in published patterns, making it the de facto standard that other brands are mapped against.",
      ],
    },
    howCalculated: {
      title: "How Thread Conversions Are Determined",
      paragraphs: [
        "Thread conversion is not math-based — it relies on systematic color matching methodology. Each thread brand's full color range is compared against every other brand's range under controlled, natural-spectrum lighting. The closest visual match becomes the recommended conversion.",
        "For example, DMC 310 (Black) maps to Anchor 403 and Cosmo 600. DMC 321 (Christmas Red) maps to Anchor 9046 and Cosmo 241. These mappings are maintained by thread suppliers and independent cross-reference databases, updated when brands add or discontinue colors.",
        "Because conversions are closest matches rather than identical dyes, always compare converted threads side by side in natural light before committing to a full project. Fluorescent and LED lighting can mask subtle color differences that become obvious in daylight.",
      ],
    },
    howToUse: {
      title: "How to Use the Embroidery Thread Converter",
      paragraphs: [
        "Enter a thread number from any supported brand — DMC, Anchor, Cosmo, or Sulky — and the converter returns the closest equivalent in all other systems. This converter is specifically for 6-strand embroidery floss, not perle cotton, sewing thread, or machine embroidery thread.",
        "You can enter a single thread number for a quick lookup or enter a list of numbers separated by commas to convert an entire project palette at once. The results show the source color name (where available) and the nearest match in each target brand."
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "Thread conversions represent the closest available color match between brands — they are not exact dye matches. Two brands may both make a \"medium blue,\" but the DMC version and the Anchor version will differ in hue, saturation, or value when placed side by side. For small projects or scattered colors, these differences are invisible. For large projects with significant color areas, the difference may be noticeable.",
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
        "Thinner yarns produce more wraps per inch — lace weight yarn wraps 30 or more times in an inch, while jumbo yarn may only wrap 1 to 4 times. The Craft Yarn Council has established WPI ranges for each of the eight standard yarn weight categories (0 through 7), giving crafters a universal reference for identifying unlabeled yarn.",
        "It is important to understand that WPI ranges overlap between adjacent weight categories. A yarn that measures 12 WPI could be a tightly plied sport weight or a loosely spun worsted. This overlap is normal and reflects the natural variation in yarn construction. When your measurement falls in an overlap zone, the only definitive way to confirm the weight is to swatch and compare your stitch count against the standard gauge ranges.",
      ],
    },
    howCalculated: {
      title: "How the WPI Converter Works",
      paragraphs: [
        "The converter uses the Craft Yarn Council's official WPI ranges to map your measurement to one or more yarn weight categories. Each category has a defined WPI range: Lace is 30 and above, Super Fine is 14 to 30, Fine or Sport is 12 to 18, Light or DK is 11 to 15, Medium or Worsted is 9 to 12, Bulky is 6 to 9, Super Bulky is 5 to 6, and Jumbo is 1 to 4.",
        "When your WPI falls within a single category, the converter displays that weight with its corresponding needle sizes, hook sizes, gauge range, typical yardage per 100 grams, and suggested project types. When your WPI falls in an overlap zone — for example, 12 WPI matches both Fine/Sport and Medium/Worsted — the converter shows all matching categories and recommends swatching to confirm which weight best describes your yarn's behavior.",
        "The recommended needle and hook sizes come directly from the Craft Yarn Council's published standards. The yardage estimates are typical values across common fiber types, though actual yardage varies by fiber content — cotton is heavier per yard than wool, and silk is heavier than alpaca.",
      ],
    },
    howToUse: {
      title: "How to Use the WPI Calculator",
      paragraphs: [
        "Start by measuring your yarn. Hold a ruler horizontally and wrap the yarn around it without stretching, pulling, or overlapping. Each wrap should sit snugly against the last, touching but not compressed. Count the wraps in exactly one inch. For the most accurate reading, measure in the middle of the ruler where edge effects are minimal.",
        "For handspun or textured yarn, measure in two or three different spots along the skein and average the results. Handspun thickness can vary, and averaging gives a more representative WPI. For plied yarns, wrap the plied yarn as it comes — do not separate the plies.",
        "Enter your WPI count into the calculator. The tool displays your matching yarn weight category (or categories if you are in an overlap zone) along with recommended needle sizes in US and metric, hook sizes in US letter and metric, the standard gauge range in stitches per 4 inches, typical yardage per 100 grams, and project suggestions suited to that weight.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "If your WPI matches a single weight category, the results are straightforward — use the recommended needle or hook size as a starting point and swatch to confirm your gauge. If you see multiple categories, your yarn sits in an overlap zone and could work as either weight. Swatch with needles for both categories and decide which fabric you prefer.",
        "The yardage per 100 grams is an average across common fibers. Wool and acrylic yarns tend to fall near the typical value, while cotton and linen yarns yield fewer yards per 100 grams due to their higher density. Silk falls in between. Use the yardage estimate as a planning guide, not an exact figure.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Wrap on a smooth surface like a pencil, dowel, or knitting needle rather than a flat ruler — the wraps sit more naturally and give a more accurate count.",
        "Do not push wraps together or spread them apart. The natural resting position of the yarn is what you want to measure.",
        "If your WPI falls right on a boundary (like exactly 9 WPI between worsted and bulky), swatch with both the lighter and heavier weight needle suggestions. The fabric you prefer determines which category to treat the yarn as.",
        "Keep a WPI cheat card in your yarn stash for quick reference at fiber festivals and thrift stores. Knowing your WPI ranges lets you evaluate mystery yarn on the spot.",
      ],
    },
  },

  "c2c-calculator": {
    introduction: {
      title: "Why You Need a C2C Calculator",
      paragraphs: [
        "Corner-to-corner crochet creates stunning blankets, but the diagonal construction makes sizing tricky. Unlike traditional row-by-row crochet where you simply count stitches for width, C2C builds block by block at an angle. Without a calculator, figuring out how many blocks you need — and how many diagonal rows that translates to — involves math that is easy to get wrong.",
        "This calculator takes the guesswork out of C2C planning. Enter your gauge swatch measurements and desired blanket dimensions, and it tells you exactly how many blocks wide and tall to work, how many diagonal rows from start to finish, and how much yarn you will need. Plan with confidence before you pick up your hook.",
      ],
    },
    whatIs: {
      title: "What Is Corner-to-Corner (C2C) Crochet?",
      paragraphs: [
        "C2C is a crochet technique where you work diagonally across the fabric. Each unit — called a block or tile — is typically a small cluster of chain stitches and double crochets. You start with one block in a corner, add one block per diagonal row on the increase side until you reach the maximum width, then decrease back down to a single block in the opposite corner.",
        "The technique is beloved for graphgan blankets (blankets with pixel-art images), because each block acts like a pixel. It also produces a beautiful texture with subtle diagonal lines. C2C works up quickly once you get the rhythm, and the small, repetitive blocks make it an excellent travel or TV project.",
        "Because C2C blocks are often not perfectly square — they tend to be slightly wider than they are tall, or vice versa depending on your yarn and tension — measuring a gauge swatch in both directions is essential for accurate sizing. This calculator accounts for that asymmetry automatically.",
      ],
    },
    howCalculated: {
      title: "How the C2C Calculator Works",
      paragraphs: [
        "The calculator starts with your gauge swatch. You crochet a small test piece (at least 5 by 5 blocks), measure its width and height in inches, and enter those along with the block counts. The calculator divides to find the width and height of each individual block.",
        "Next, it divides your desired blanket dimensions by the per-block measurements and rounds to the nearest whole number. This gives you the number of blocks wide and blocks tall. The total block count is simply blocks wide times blocks tall.",
        "The diagonal row count — how many rows you work from the first corner to the last — equals blocks wide plus blocks tall minus one. If you provided a yarn-per-block measurement, the calculator multiplies total blocks by that value, converts inches to yards, and adds a 10 percent buffer for tails and joining.",
      ],
    },
    howToUse: {
      title: "How to Use the C2C Calculator",
      paragraphs: [
        "Start by crocheting a gauge swatch of at least 5 by 5 blocks using your chosen yarn and hook. Measure the width and height of the swatch in inches. Enter the block counts and measurements into the gauge section of the calculator.",
        "Then enter your desired blanket width and height in inches. The calculator converts these to block counts and shows you the actual finished dimensions after rounding. If the actual size differs from your target by more than an inch or two, adjust your target or try a different hook size to change your block dimensions.",
        "For yardage estimation, crochet one complete block, unravel it, and measure the length of yarn in inches. Enter this in the optional yarn-per-block field. The calculator uses this to estimate total yardage with a 10 percent buffer for safety. If you skip this field, you will still get all the block and row counts — just not the yardage estimate.",
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
        "C2C blocks are almost never perfectly square. Always measure your swatch in both directions — do not assume a 2-inch-wide block is also 2 inches tall.",
        "For graphgan blankets, subtract your planned border width from the target dimensions before calculating blocks. The border adds to the finished size.",
        "Use stitch markers to count blocks every 10 rows on long diagonal rows. It is easy to lose count on rows with 50 or more blocks.",
        "When changing colors frequently (as in a graphgan), carry unused colors along the top of the row rather than cutting and rejoining. This saves yarn and reduces the number of ends to weave in.",
      ],
    },
  },

  "cast-on-calculator": {
    introduction: {
      title: "Why You Need a Cast On Calculator",
      paragraphs: [
        "Every knitting and crochet project begins with a simple question: how many stitches do I start with? Cast on too few and your piece will be too narrow. Cast on too many and it will be too wide. The math itself is straightforward — multiply desired width by stitches per inch — but stitch pattern multiples, edge stitches, and gauge variation add complexity that catches even experienced knitters off guard.",
        "This calculator handles all of it. Enter your gauge, desired width, and optional stitch pattern multiple, and you get an exact cast-on count that works for your pattern. No more ripping back row one because you forgot to account for a cable repeat.",
      ],
    },
    whatIs: {
      title: "What Is a Cast On Count?",
      paragraphs: [
        "The cast-on count is the number of stitches you place on your needle (in knitting) or the number of foundation chains you create (in crochet) at the very start of a project. It determines the width of your finished piece. Getting this number right at the beginning saves hours of frogging and frustration later.",
        "For simple stockinette or single crochet, the math is a direct multiplication: desired width in inches times stitches per inch. But most projects use patterned stitches that repeat over a fixed number of stitches — a stitch multiple. A 2x2 rib repeats every 4 stitches. A honeycomb cable might repeat every 12. Your cast-on count must accommodate these multiples, or the pattern will not work out evenly across the row.",
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
        "First, knit or crochet a gauge swatch and measure it. Enter the number of stitches and the width of your swatch — the default is stitches over 4 inches, the most common gauge format. Next, enter the desired width of your project in inches.",
        "If your pattern uses a stitch repeat, enter the multiple in the optional field. For example, if your pattern says 'multiple of 8 plus 2,' enter 8 as the multiple. The calculator rounds up to the nearest multiple and displays the adjusted count.",
        "Review the results. The calculator shows your cast-on count, the actual width that count produces, and a note about edge stitches. Many knitters add 2 selvedge stitches (one on each side) for seaming — adjust the total as needed for your project construction.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The primary output is your cast-on stitch count. If you entered a stitch multiple, this count has been rounded up to accommodate the pattern repeat. The actual width is recalculated from this rounded count so you can see exactly how wide your piece will be.",
        "The reference table below the calculator shows common project widths — scarves, cowls, blankets, dishcloths — so you can quickly sanity-check your number. If your count seems very different from what you expected, double-check your gauge swatch measurement. Even a small error in gauge has a big impact on the final count.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always swatch in the stitch pattern you plan to use, not just stockinette. Cable patterns pull in the width, so your stitches-per-inch in cables will be higher than in plain knitting.",
        "For pieces knit in the round, your gauge may differ from flat knitting. Many knitters purl more loosely than they knit, which changes the stitch width. Swatch in the round if that is how you will work the project.",
        "When a pattern says 'multiple of 6 plus 2,' the plus 2 are usually edge or balance stitches. Enter only the base multiple (6) into the calculator — the extra 2 are already part of the pattern instructions.",
        "Foundation chains in crochet tend to be tighter than the body of the fabric. Size up your hook for the chain row only, or use a foundation single crochet or chainless foundation for a more flexible edge.",
      ],
    },
  },

  "hat-calculator": {
    introduction: {
      title: "Why You Need a Hat Size Calculator",
      paragraphs: [
        "Hats are one of the most popular knitting and crochet projects — fast to finish, endlessly customizable, and always appreciated as gifts. But getting the right fit requires more than picking a head size from a chart. The stitch pattern, yarn weight, and your personal tension all affect how the finished hat fits. A hat that is even half an inch too large will slide over the wearer's eyes; too small and it perches on top of the head.",
        "This calculator combines head circumference, negative ease for your chosen stitch type, and your gauge to produce an exact cast-on count rounded for a clean 8-point crown decrease. It takes the math out of hat design so you can focus on choosing colors and stitch patterns.",
      ],
    },
    whatIs: {
      title: "What Is Negative Ease in Hats?",
      paragraphs: [
        "Negative ease means making the hat slightly smaller than the actual head measurement. Knit and crochet fabrics stretch, and a hat must grip the head to stay in place. The amount of negative ease depends on the stitch pattern because different stitches have different amounts of stretch.",
        "Stockinette stitch has moderate stretch and uses 10 percent negative ease. Ribbing (1x1 or 2x2) has much more stretch and uses 15 percent negative ease — the hat starts smaller but expands to fit. Colorwork (stranded knitting) has very little stretch because the floats on the back limit the fabric's elasticity, so it uses only 5 percent negative ease.",
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
        "Start by entering the head circumference. You can type a custom measurement or select a standard size from the dropdown. The standard sizes use the midpoint of each range — for example, Average Adult uses 22 inches, the midpoint of the 21 to 23 inch range.",
        "Select your stitch type. This determines the negative ease: 10 percent for stockinette, 15 percent for ribbing, or 5 percent for colorwork. Then enter your gauge — how many stitches you get over 4 inches with your chosen yarn and needles or hook.",
        "The calculator outputs your cast-on count (rounded to the nearest multiple of 8), a complete crown decrease schedule showing what to do on each round, the recommended hat height for the selected size, and a yardage estimate. Review the cast-on count against your gauge to make sure it produces a circumference close to your target.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The cast-on count is your starting stitch count for a bottom-up hat worked in the round. If you are working a top-down hat (starting from the crown), reverse the decrease schedule into an increase schedule. If you are crocheting, the total stitch count at the widest point (the brim) is the same number.",
        "The crown decrease schedule shows every round from the first decrease to the last. It assumes you work decreases on odd-numbered rounds and knit plain on even-numbered rounds. The pattern uses K2tog decreases — for crochet, substitute SC2tog or DC2tog.",
        "The hat height range is a guideline based on the head size. Slouchy hats need additional length (add 2 to 4 inches). Beanies that sit above the ears need less height than the range shown. Adjust based on the style you want.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Measure the head at the widest point — across the forehead, above the ears, and around the back of the head. If you are making a gift, use the size chart as a guide.",
        "For ribbed brims on an otherwise stockinette hat, cast on using the stockinette ease (10 percent). The ribbing will stretch to fit, and the body will be the right circumference.",
        "Try on the hat before starting crown decreases. The body should reach from the cast-on edge to the top of the ears. If it does not, add or subtract rounds.",
        "Use a different needle size for the ribbed brim (one or two sizes smaller) to keep the brim snug and prevent it from flaring out.",
      ],
    },
  },

  "sock-calculator": {
    introduction: {
      title: "Why You Need a Sock Calculator",
      paragraphs: [
        "Sock knitting has a devoted following for good reason — handknit socks fit better, last longer, and feel luxurious compared to store-bought options. But socks involve more construction math than most other projects. You need to calculate stitch counts for the leg, heel, gusset, foot, and toe, and all of those numbers derive from just two measurements and your gauge.",
        "This calculator handles both top-down (cuff to toe) and toe-up construction methods. Enter your foot measurements and gauge, and it generates every number you need: cast-on count, heel flap rows, gusset pickup, short-row heel details, and toe shaping. No more scribbling math on scrap paper mid-project.",
      ],
    },
    whatIs: {
      title: "What Is Sock Construction?",
      paragraphs: [
        "A sock is a tube with a shaped heel pocket and a tapered toe. The two main construction methods — top-down and toe-up — build the sock in opposite directions but produce the same result. Top-down socks cast on at the cuff and work downward, shaping the heel with a heel flap and gusset. Toe-up socks start with a small number of stitches at the toe, increase to the full foot circumference, then shape the heel with short rows.",
        "Both methods use negative ease — making the sock 10 percent smaller than the actual foot circumference — so the knit fabric stretches to grip the foot. This prevents bunching, slipping, and premature wear. The calculator applies this 10 percent ease automatically.",
        "Socks are typically knit on small double-pointed needles or a long circular needle using the magic loop technique. The stitch count is rounded to a multiple of 4 for even distribution across needles and to accommodate common ribbing patterns (K2P2 or K1P1).",
      ],
    },
    howCalculated: {
      title: "How Sock Measurements Are Calculated",
      paragraphs: [
        "For top-down socks, the calculator applies 10 percent negative ease to your foot circumference, multiplies by your stitch gauge, and rounds to the nearest multiple of 4. This is your cast-on count. Half those stitches form the heel flap — the flap is worked back and forth over this half, with the same number of rows as stitches to create a square. Gusset pickup is half the heel flap rows on each side. Foot length is calculated by subtracting 2 inches (for the toe) from total foot length and converting to rows.",
        "For toe-up socks, the total stitch count is calculated the same way. The toe starts with approximately 15 percent of the total stitches per needle (rounded to an even number, minimum 8), then increases by 4 stitches every other round until reaching the full count. The short-row heel divides the heel stitches into thirds — the center third stays and the side thirds are shaped with short rows. Foot length is adjusted for heel depth.",
        "Both methods produce a sock with the same total stitch count and the same fit — the difference is purely in construction order and heel style. Many knitters prefer top-down for the heel flap's durability, while others prefer toe-up for the ability to try on as they go.",
      ],
    },
    howToUse: {
      title: "How to Use the Sock Calculator",
      paragraphs: [
        "Measure your foot: wrap a tape measure around the ball of your foot for circumference, and measure from heel to longest toe for length. Enter both measurements in inches. Then enter your gauge — stitches per 4 inches and rows per 4 inches from a gauge swatch knit in your sock yarn on your sock needles.",
        "Select the Top-Down or Toe-Up tab depending on your preferred construction method. The calculator generates all the numbers you need for that method, including heel and toe shaping details.",
        "Review the results and compare the cast-on count against your expected range. For fingering weight sock yarn at a typical 32 stitches per 4 inches gauge, most adult socks have 56 to 72 stitches. If your number is very different, double-check your gauge swatch.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The cast-on count (top-down) or total stitch count (toe-up) is the number of stitches around the full circumference of the sock. Divide this by 4 for the number of stitches per needle on double-pointed needles.",
        "For top-down socks, the heel flap rows and gusset pickup numbers work together. The flap creates a cup when turned, and the gusset stitches picked up along the flap edges taper back down to the original foot stitch count over several rounds of decreasing. For toe-up socks, the short-row heel creates the cup by working progressively shorter rows — no gusset picking up needed.",
        "The foot rows number tells you how many rounds to work the plain foot tube before starting the toe (top-down) or after finishing the toe (toe-up). This is based on your row gauge and accounts for the 2-inch toe or the heel depth respectively.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Knit both socks at once using magic loop or two circulars to avoid 'second sock syndrome' — the dreaded loss of motivation to knit the matching sock after finishing the first.",
        "Reinforce heel and toe sections with a strand of reinforcing thread held alongside your sock yarn. This doubles the durability in the highest-wear areas.",
        "If your socks feel too tight across the instep, add 4 to 8 stitches to the cast-on count. High insteps often need extra ease that the standard 10 percent does not account for.",
        "For your first pair of socks, use a solid or semi-solid yarn so you can see the stitch construction clearly. Save variegated and self-striping yarns for after you are comfortable with the heel and toe techniques.",
      ],
    },
  },

  "granny-square-planner": {
    introduction: {
      title: "Why You Need a Granny Square Planner",
      paragraphs: [
        "Granny square blankets are a crochet tradition — colorful, customizable, and endlessly satisfying to make. But the planning stage trips up many crafters. How many squares do you actually need? How much yarn per color? And how much extra for joining? Without a plan, you end up either short on squares or drowning in leftover yarn.",
        "This planner does the math for you. Enter your target blanket dimensions and square size, and it calculates the exact number of squares, finished dimensions, per-color yardage, and joining yarn estimate. Plan your blanket once, then enjoy the meditative rhythm of crocheting squares without worrying about running short.",
      ],
    },
    whatIs: {
      title: "What Is a Granny Square Blanket?",
      paragraphs: [
        "A granny square blanket is made by crocheting individual squares and then joining them together into a larger fabric. The classic granny square uses clusters of double crochets separated by chain spaces, worked in rounds from the center outward. Each round adds another ring of clusters, and color changes between rounds create the traditional striped look.",
        "Granny square blankets are beloved for their versatility. You can make every square identical for a uniform look, use different colors in each square for a scrappy stash-busting project, or vary the center pattern for a sampler blanket. The modular construction means each square is a small, portable project — perfect for crafting on the go.",
        "Square sizes range from 4-inch mini squares to 12-inch or larger afghan squares. Smaller squares create more visual interest and use more colors, but require more joining. Larger squares work up faster and need less assembly, but show less variety. The most popular size is the classic 6-inch granny square — a good balance of detail, portability, and assembly time.",
      ],
    },
    howCalculated: {
      title: "How the Granny Square Planner Works",
      paragraphs: [
        "The planner divides your target blanket width and height by your chosen square size and rounds to the nearest whole number. Multiplying these two numbers gives the total square count. The actual finished dimensions are recalculated from the rounded block counts, so you can see exactly how close the finished blanket will be to your target.",
        "For yardage, the planner multiplies total squares by the yarn consumed per square (which you enter based on your own test square), then adds a 10 percent buffer for tails, tension variation, and inevitable frogging. If you are using multiple colors, total yardage is divided evenly among the colors as a starting estimate.",
        "The joining yardage estimate assumes approximately 1.5 times the perimeter of one square per join, multiplied by the total number of squares, converted from inches to yards, with a 10 percent buffer. Actual joining yarn varies by method — slip stitch joining uses more than whip stitch, and join-as-you-go uses less than any separate joining method.",
      ],
    },
    howToUse: {
      title: "How to Use the Granny Square Planner",
      paragraphs: [
        "Enter your desired blanket width and height in inches, then enter your square size. Common sizes are 4, 6, 8, or 12 inches. If you have not decided on a size yet, try 6 inches as a starting point — it is the most popular for good reason.",
        "For yardage estimates, crochet one complete square with your chosen yarn and hook, then unravel it and measure the total yarn length in yards. Enter this in the yarn-per-square field. If you are using multiple colors, enter the total number of colors. The planner divides yardage evenly — adjust manually if some colors appear more than others.",
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
        "Block every square to the exact same dimensions before joining. Uneven squares make assembly frustrating and produce a wavy, unprofessional blanket.",
        "Crochet a few extra squares as insurance. If one square has a tension problem or a color you decide you dislike, you can swap it out without interrupting the assembly.",
        "For stash-busting projects, weigh your leftover yarn and divide by the yarn-per-square amount to see how many squares each leftover can produce before you start.",
        "Consider your joining method before you start crocheting squares. Join-as-you-go integrates assembly into the last round of each square, saving time and producing a flat, seamless look.",
      ],
    },
  },

  "sleeve-calculator": {
    introduction: {
      title: "Why You Need a Sleeve Shaping Calculator",
      paragraphs: [
        "Sleeves are where many sweater projects stall. The body is finished, the excitement is fading, and now you have to figure out how to taper from the wide upper arm to the narrow cuff with decreases spaced evenly over dozens of rows. Uneven shaping creates visible jogs and bumps in the fabric. Too many decreases too fast produces a cinched look; too few too slowly leaves a baggy sleeve.",
        "This calculator distributes your decreases mathematically across the available shaping rows. It accounts for the cuff ribbing, leaves buffer zones at each end, and handles the remainder when the rows do not divide evenly. The result is a smooth, professional taper with row-by-row instructions you can follow without thinking.",
      ],
    },
    whatIs: {
      title: "What Is Sleeve Shaping?",
      paragraphs: [
        "Sleeve shaping refers to the gradual narrowing (or widening, if working bottom-up) of a sleeve from the upper arm to the wrist. In a standard tapered sleeve, you start with the number of stitches needed for the upper arm circumference and decrease evenly until you reach the number of stitches needed for the wrist or cuff.",
        "Decreases are always worked in pairs — one at each end of the row — so that the shaping is symmetrical. In knitting, the standard technique is SSK at the beginning of the row (leans left) and K2tog at the end (leans right), creating mirrored decreases. In crochet, SC2tog or DC2tog is worked at each end.",
        "The shaping zone does not extend the full length of the sleeve. Typically, you leave a 1-inch buffer below the underarm seam for a smooth join and another 1-inch buffer above the cuff ribbing so the last decrease is not immediately next to the ribbing transition. The calculator accounts for both buffers and for the cuff ribbing length you specify.",
      ],
    },
    howCalculated: {
      title: "How Sleeve Shaping Is Calculated",
      paragraphs: [
        "The calculator converts your upper arm and wrist circumferences into stitch counts using your stitch gauge, rounding both to even numbers. The difference between these counts divided by 2 gives the number of decrease events needed, since each event removes 2 stitches (one at each end).",
        "The shaping zone in inches equals the sleeve length minus 1 inch (top buffer) minus the cuff ribbing length minus 1 inch (bottom buffer). This zone is converted to rows using your row gauge and rounded to an even number.",
        "The calculator then divides shaping rows by decrease events. If the division is exact, you decrease every N rows for the entire shaping zone. If there is a remainder, the decreases are split into two groups: some worked every N rows and the rest every N+1 rows. This two-rate approach distributes the shaping smoothly without bunching decreases at one end.",
      ],
    },
    howToUse: {
      title: "How to Use the Sleeve Calculator",
      paragraphs: [
        "Enter your upper arm circumference (measure the fullest part, about 1 inch below the armpit, and add 1 to 2 inches for ease) and your wrist or cuff circumference. Enter the total sleeve length from underarm to wrist, and the length of cuff ribbing you plan to work.",
        "Enter your stitch gauge (stitches per inch) and row gauge (rows per inch). These should come from a swatch worked in the same stitch pattern you plan to use for the sleeve body — not the ribbing.",
        "The calculator outputs the upper arm and cuff stitch counts, the total stitches to decrease, the shaping instruction (every N rows for X times, then every N+1 rows for Y times), and both knitting and crochet notation for the decrease technique.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The shaping instruction is the key output. A simple result like 'Decrease 1 st each end every 6 rows, 12 times' means you work 5 plain rows, then a decrease row, and repeat 12 times. A split result like 'every 6 rows 8 times, then every 7 rows 4 times' means you start at the faster rate and switch to the slower rate for the remaining decreases.",
        "The total shaping rows should fit within your sleeve length. If the calculator shows more shaping rows than available rows, your sleeve is too short for the amount of taper needed. Either lengthen the sleeve, reduce the upper arm ease, or increase the cuff width.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Work decreases 2 to 3 stitches in from each edge rather than right at the edge. This creates a visible decrease line (called fully-fashioned shaping) that looks professional and is easier to seam.",
        "If working the sleeve bottom-up (from cuff to upper arm), reverse the instructions — increase instead of decrease at the same intervals.",
        "Knit both sleeves at the same time on a long circular needle or from two balls of yarn on separate sections of one needle. This ensures both sleeves have identical shaping and length.",
        "Always try on or measure the sleeve against the body before binding off. The upper arm stitches should match the armhole depth of your garment body.",
      ],
    },
  },

  "raglan-calculator": {
    introduction: {
      title: "Why You Need a Raglan Calculator",
      paragraphs: [
        "Top-down raglan sweaters are one of the most popular garment constructions in knitting and crochet. You start at the neck and work outward, which means you can try on the sweater as you go and adjust the fit in real time. But the yoke math — distributing stitches between front, back, and sleeves, then calculating how many increase rounds to reach your chest circumference — requires careful arithmetic.",
        "This calculator does the stitch distribution for you using the standard 30/30/15/15 raglan ratio and computes exactly how many increase rounds you need. It gives you a complete starting framework so you can focus on the enjoyable parts: choosing yarn, picking stitch patterns, and watching the yoke grow round by round.",
      ],
    },
    whatIs: {
      title: "What Is a Top-Down Raglan?",
      paragraphs: [
        "A raglan sweater is characterized by four diagonal seam lines running from the neckline to the underarm. Unlike set-in sleeve construction, where the body and sleeves are knit separately and seamed together, a raglan is knit as one piece from the top down. The yoke forms a continuous circle of fabric that expands with every increase round.",
        "The standard construction increases at four points (the raglan lines) every other round, adding 8 stitches per increase round — 2 at each raglan point. As the yoke grows, the front, back, and sleeve sections all expand proportionally until the yoke is deep enough to reach the underarm. At that point, the sleeve stitches are placed on hold, the body sections are joined, and the body is worked downward as a tube.",
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
        "Enter your desired chest circumference in inches. This should include any ease you want — typically 2 to 4 inches of positive ease for a standard fit, or 4 to 8 inches for a relaxed fit. Enter your stitch gauge and row gauge, either per inch or per 4 inches.",
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
    introduction: {
      title: "Why You Need a Blocking Calculator",
      paragraphs: [
        "Blocking transforms handknit and crocheted pieces from homemade-looking to professional-quality. Unblocked fabric has uneven stitches, curling edges, and dimensions that may not match your pattern. Blocking evens everything out, opens up lace, relaxes cable crossings, and sets the finished shape. It is the single most impactful finishing step you can take.",
        "But blocking incorrectly can damage your work. Steaming acrylic permanently ruins the fibers. Hot water felts non-superwash wool. Aggressive stretching on delicate alpaca can cause permanent sagging. This calculator tells you the right method for your fiber type, shows you how much stretch is feasible, and gives step-by-step instructions so you block with confidence.",
      ],
    },
    whatIs: {
      title: "What Is Blocking?",
      paragraphs: [
        "Blocking is the process of setting your finished knit or crochet piece to its final dimensions using water, steam, or a combination of both. The fiber absorbs moisture, relaxes, and can be gently shaped to the desired measurements. When it dries in that position, the fibers remember the shape — at least until the next washing.",
        "There are three main blocking methods. Wet blocking involves fully submerging the piece in water with a wool wash, gently squeezing out excess moisture (never wringing), and pinning it to blocking mats at the target dimensions. Spray blocking pins the piece first, then sprays it with water until damp. Steam blocking pins the piece and holds a steam iron above it without touching the fabric.",
        "Different fibers respond differently to each method. Wool is the most blockable fiber — it can stretch dramatically when wet and holds its blocked shape beautifully. Cotton and linen respond well to wet blocking and steam. Acrylic must never be steamed, as heat permanently damages the synthetic fibers. The right method depends entirely on your fiber content.",
      ],
    },
    howCalculated: {
      title: "How the Blocking Calculator Works",
      paragraphs: [
        "The calculator compares your current piece dimensions to your target dimensions and computes the stretch percentage in each direction. The formula is straightforward: the target dimension minus the current dimension, divided by the current dimension, times 100.",
        "It then rates the feasibility of that stretch based on established fiber behavior. Less than 5 percent stretch is easy for virtually any fiber. Five to 15 percent is moderate — natural fibers handle it well, but synthetics are unlikely to hold. Fifteen to 30 percent is significant — achievable with wool lace but not with most other fibers. Over 30 percent is very aggressive and may not be achievable even with wool.",
        "The fiber lookup table maps each fiber type to its recommended blocking method and any critical warnings. For example, non-superwash wool should only be blocked with cool water to avoid felting, alpaca should be spray-blocked to prevent irreversible stretching, and acrylic should never be exposed to steam or high heat.",
      ],
    },
    howToUse: {
      title: "How to Use the Blocking Calculator",
      paragraphs: [
        "Select your fiber type from the dropdown. If your yarn is a blend, choose the fiber that requires the most gentle treatment — for an acrylic/wool blend, treat it as acrylic. If you are unsure of the fiber content, start with spray blocking, which is the safest method for unknown fibers.",
        "Enter the current width and length of your piece as it comes off the needles or hook, without stretching. Then enter your target width and length — the dimensions you want the finished piece to be.",
        "The calculator displays the recommended blocking method, any fiber-specific warnings, the stretch percentage in each direction, a feasibility rating, and step-by-step instructions for the recommended method. Follow the instructions carefully, especially the warnings about water temperature and steam.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The stretch percentages tell you how much the piece needs to grow in each direction. If both percentages are under 5 percent, blocking will be easy and low-risk. If either percentage is over 15 percent, pay close attention to the feasibility rating — you may need to adjust your expectations or accept that the piece cannot reach the target dimensions.",
        "The feasibility rating is based on general fiber behavior, not a guarantee. Your specific yarn, stitch pattern, and tension all affect how much stretch is achievable. Lace patterns stretch dramatically because the open stitches have room to expand. Dense stockinette or textured stitches have less room to move.",
        "If the calculator shows a warning about your fiber type, take it seriously. Felting non-superwash wool and killing acrylic are irreversible. When in doubt, test your blocking method on your gauge swatch before committing to the full piece.",
      ],
    },
    proTips: {
      title: "Pro Tips",
      tips: [
        "Always test your blocking method on your gauge swatch before blocking the finished piece. This is especially important for unknown fibers or blends.",
        "Use rustproof T-pins or dedicated blocking pins. Regular straight pins can rust and stain your work.",
        "For straight edges on shawls and blankets, invest in blocking wires. They create a smooth, even edge without the scalloped look that individual pins create.",
        "Never hang a wet blocked item to dry. The weight of the water will stretch the piece unevenly. Always dry flat on blocking mats or a towel.",
      ],
    },
  },

  "stash-estimator": {
    introduction: {
      title: "Why You Need a Yarn Stash Estimator",
      paragraphs: [
        "Every crafter accumulates partial skeins. They sit in bins, bags, and baskets — leftovers from finished projects, impulse purchases that lost their ball band, and skeins inherited from fellow crafters. The question is always the same: is there enough here for another project? Without a way to estimate the remaining yardage, those partial skeins stay in limbo — too much to throw away, too uncertain to use.",
        "This estimator solves the mystery. Weigh your partial skein on a kitchen scale, enter the original skein specs, and get an immediate yardage estimate. For completely unlabeled yarn, the reference table maps yarn weight categories to typical yardage per 100 grams so you can estimate what you have even without a ball band.",
      ],
    },
    whatIs: {
      title: "What Is Yarn Stash Estimation?",
      paragraphs: [
        "Yarn stash estimation is the process of determining how much usable yardage remains in your leftover yarn. The most reliable method is weight-based: if you know the original skein's full weight and yardage, you can calculate the remaining yardage by weighing what you have and applying a simple proportion.",
        "The formula is straightforward. If a full skein weighs 100 grams and contains 220 yards, and your partial skein weighs 40 grams, then you have approximately 88 yards remaining. This works because yarn density is consistent within a single skein — every gram contains the same amount of yardage.",
        "For yarn with no label information at all, you can estimate yardage using the Craft Yarn Council's typical yardage ranges by weight category. A 100-gram ball of worsted weight yarn typically contains about 200 yards, while the same weight of lace yarn might contain 800 yards or more. These are averages — actual yardage varies by fiber content and spin — but they give you a useful ballpark for planning.",
      ],
    },
    howCalculated: {
      title: "How the Stash Estimator Works",
      paragraphs: [
        "Mode 1 uses a direct proportion. Divide the partial skein weight by the full skein weight, then multiply by the full skein yardage. This gives you the estimated remaining yardage. The calculation assumes uniform density throughout the skein, which is true for commercially spun yarn.",
        "Mode 2 uses reference values from the Craft Yarn Council's weight categories. Each category has a typical yardage per 100 grams — for example, worsted weight averages about 200 yards per 100 grams. Multiply the partial skein weight (in grams) by the yardage per gram for that category to get an estimate.",
        "Both modes produce estimates, not exact measurements. Fiber content significantly affects the weight-to-yardage ratio. Cotton is denser than wool, so a 100-gram ball of cotton worsted contains fewer yards than a 100-gram ball of wool worsted. Silk and bamboo fall somewhere in between. The estimates are most accurate when the fiber content is consistent with typical values for the weight category.",
      ],
    },
    howToUse: {
      title: "How to Use the Stash Estimator",
      paragraphs: [
        "For Mode 1, you need three pieces of information from the original ball band: the full skein weight in grams, the full skein yardage, and the partial skein weight from your kitchen scale. Enter all three values and the calculator shows your estimated remaining yardage instantly.",
        "For Mode 2, identify your yarn weight category. If you are unsure, use the WPI (wraps per inch) method — wrap the yarn around a ruler for one inch and count the wraps. Enter the weight category and your partial skein weight in grams. The calculator multiplies by the typical yardage per 100 grams for that category.",
        "If you have no idea what the yarn weight or fiber is, start by measuring WPI to identify the weight, then use Mode 2 with that weight category. The reference table also shows the full range of typical yardages for each category, so you can see the possible spread and plan conservatively.",
      ],
    },
    understandingResults: {
      title: "Understanding Your Results",
      paragraphs: [
        "The estimated yardage is just that — an estimate. For Mode 1 with known skein specs, the estimate is quite accurate for commercial yarn. For Mode 2 with reference values, the actual yardage could be anywhere within the range shown for that weight category. Plan conservatively — if the typical value says 200 yards per 100 grams but the range is 180 to 240, assume the lower end if you cannot afford to run short.",
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
};
