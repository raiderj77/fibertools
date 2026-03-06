export interface ToolEducationalContent {
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
};
