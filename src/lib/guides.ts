export interface Guide {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  date: string;
  modifiedDate?: string;
  sources?: { title: string; url: string }[];
  keywords: string[];
  sections: { heading: string; content: string }[];
}

export const guides: Guide[] = [
  {
    slug: "reading-yarn-labels",
    title: "The Complete Guide to Reading Yarn Labels (What Every Number Means)",
    description: "Read the yarn identity, category, mass, length, gauge, and care information on a label, and recognize what it cannot establish about a project.",
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
    title: "Knitting Gauge: Why It Matters and How to Get It Right",
    description: "Learn what knitting gauge measures, how to prepare a representative swatch, and how to review stitch and row differences without treating one count as a full pattern regrade.",
    toolSlug: "gauge-calculator",
    date: "2026-03-06",
    modifiedDate: "2026-09-05",
    keywords: ["knitting gauge", "gauge swatch", "stitch gauge", "row gauge", "knitting tension", "gauge calculator"],
    sections: [
      {
        heading: "What Gauge Is and What It Measures",
        content: "Gauge, sometimes called tension, records how many stitches and rows fit inside a stated area of the selected fabric. A pattern might state separate stitch and row counts over 4 inches or 10 centimeters in a named stitch pattern. Those counts are inputs to the pattern's sizing and shaping, but their effect depends on the construction and instructions.\n\nSwatches made with the same yarn and tool size can still differ. Technique, tool material, the exact stitch pattern, working flat or in the round, and finishing can all contribute, so compare a representative swatch with the pattern's stated method.\n\nThe useful question is not whether a gauge is universally right or wrong. It is whether the measured fabric matches the pattern specification closely enough for each affected count, dimension, repeat, and shaping step."
      },
      {
        heading: "How to Make a Proper Gauge Swatch",
        content: "A gauge swatch needs to be large enough to measure accurately. Cast on enough stitches for at least 6 inches of width using the yarn, needles, and stitch pattern specified in the pattern. Work in that stitch pattern until the piece measures at least 6 inches tall. The extra fabric beyond the 4-inch measurement zone matters because edge stitches distort gauge, you always measure from the interior of the swatch.\n\nIf the pattern is worked in the round, flat swatches can lie. Stockinette worked flat alternates knit and purl rows, and many knitters tension those rows differently. For an accurate gauge on a circular project, either knit your swatch in the round on double-pointed needles or use the float method: knit every row from the right side, cutting the yarn at the end of each row and sliding the stitches back to the starting needle tip.\n\nBind off loosely when the swatch is tall enough. Don't rip it out immediately, you'll need it intact for blocking and measuring."
      },
      {
        heading: "How to Block Your Swatch Before Measuring",
        content: "Treat the swatch the same way the pattern and yarn care instructions say the finished item will be treated. Include the complete washing, drying, or cooling cycle before measuring; do not substitute a generic wet, spray, or steam method based only on the fiber name.\n\nRecord the swatch before and after treatment. That measured change is project-specific evidence, while a broad fiber category or universal growth percentage is not. A larger, heavier, seamed, or differently constructed item can still behave differently.\n\nAfter treatment, place the swatch as directed on a flat surface. Measure away from the edges and count stitches and rows across the pattern's stated measurement span. Record both numbers and the exact treatment used."
      },
      {
        heading: "What to Do When Your Gauge Doesn't Match",
        content: "If the measured stitch or row count differs, first confirm that the swatch used the stated yarn, stitch pattern, construction direction, measurement span, and treatment. Then follow any adjustment guidance supplied by the pattern or yarn maker and make another representative swatch. A different tool size often changes density, but the direction and fabric effect must be verified rather than assumed.\n\nWhen stitch and row gauge do not both match, inspect how the selected pattern uses each one. Some instructions rely on dimensions, others on exact row counts, charts, shaping intervals, or repeat geometry. There is no universal rule that one gauge can always be ignored.\n\nRecord the tool, method, and treated measurements for each trial. A calculator can compare counts, but only the selected pattern and a checked swatch establish whether a change is workable."
      },
      {
        heading: "Stitch Gauge vs Row Gauge",
        content: "Stitch gauge records horizontal stitch density, while row gauge records vertical row density. Finished width and height can also be affected by shaping, repeats, edge treatments, seams, construction direction, and finishing, so neither count acts alone in every project.\n\nRow gauge is especially visible when instructions use charts, short rows, fixed shaping intervals, or an exact number of rounds. Stitch gauge is especially visible in circumferences and widths built from fixed stitch counts. These are examples, not a universal priority rule.\n\nIf a pattern provides both gauges, check both and trace where each enters the instructions. When they conflict, use the designer's adjustment guidance or rework the plan explicitly rather than silently substituting a length instruction for a row-based one."
      },
      {
        heading: "How to Resize a Pattern for Your Gauge",
        content: "Sometimes you love a yarn that simply won't match the pattern gauge at any needle size. In that case, you can resize limited pattern math. Multiply the desired finished width by your measured stitches per inch to get an initial stitch count, then reconcile that count with the pattern repeat. For example, 20 inches at 5 stitches per inch gives 100 stitches before repeat adjustments. Shaping, necklines, sleeves, and construction may require a full pattern regrade rather than a single proportional adjustment.\n\nThe Gauge Calculator compares measured and target gauge and can scale a stated stitch or row count proportionally. The Needle Converter provides size references, and the Inc/Dec Calculator can distribute a supported one-stitch-at-a-time change across a fixed row or round count. None of these tools verifies fit, pattern-repeat compatibility, or a garment's yarn requirement. Use the designer's grading guidance or a comparable proven pattern for those decisions.\n\nThe practical safeguard is a representative, washed swatch and a check of every affected measurement before you commit to the project."
      }
    ]
  },
  {
    slug: "blanket-yarn-guide",
    title: "How Much Yarn Do You Need for a Blanket?",
    description: "Plan blanket yarn from representative measurements and understand how size, yarn, stitch pattern, and allowance affect an estimate; no calculator can guarantee a purchase quantity.",
    toolSlug: "blanket-calculator",
    date: "2026-03-06",
    modifiedDate: "2026-09-05",
    keywords: ["blanket yarn yardage", "how much yarn for a blanket", "blanket size chart", "yarn for baby blanket", "throw blanket yarn", "blanket calculator"],
    sections: [
      {
        heading: "Blanket Size Chart: Baby to King",
        content: "Blanket sizes vary, but common dimensions can provide a planning starting point. A baby or receiving blanket may be around 30 × 36 inches, a stroller blanket around 30 × 40, a lap blanket around 36 × 48, and a throw around 50 × 60. Bed-blanket dimensions depend on mattress size, desired coverage, and whether the plan includes overhang or tuck.\n\nTreat those as target dimensions, not guaranteed finished sizes. Stitch pattern, gauge, borders, joining, and the pattern- and care-instruction-approved finishing process can change the result. Measure a representative treated swatch instead of applying a generic fiber-growth rule.\n\nChoose and document the target before estimating. Larger dimensions increase fabric area quickly, so use a measured swatch-consumption method when purchase accuracy matters."
      },
      {
        heading: "How Yarn Weight Changes Yardage Dramatically",
        content: "Yarn weight is the single biggest factor in total yardage. A throw blanket in fingering-weight yarn might require 3,500–4,000 yards. The same throw in worsted weight drops to roughly 2,000–2,500 yards. In super bulky yarn, you might need only 800–1,200 yards. The fabric gets thicker and the stitches get larger, so fewer yards cover the same area.\n\nThis also affects cost and project time. Fingering-weight blankets take dramatically longer to knit or crochet, but they produce a lightweight, drapey fabric perfect for warm climates. Bulky blankets work up fast and feel cozy but can be heavy, a king-size super bulky blanket can weigh over 10 pounds.\n\nDon't assume heavier yarn is always cheaper per blanket. Super bulky yarn costs more per skein, and while you need fewer yards, the price per yard is higher. Mid-range weights like worsted and aran often hit the sweet spot of reasonable yardage, moderate cost, and manageable knitting time."
      },
      {
        heading: "Stitch Pattern Affects Yarn Usage",
        content: "Yarn use depends on the actual yarn, stitch pattern, gauge, construction, and finishing. A stitch name alone does not establish a fixed percentage increase or decrease in yarn consumption. Compare representative swatches rather than applying a universal garter, stockinette, cable, or crochet ratio.\n\nFor a flat rectangular blanket, weigh the yarn used by a representative swatch made in the intended stitch pattern and treated according to the care instructions. Divide that weight by the measured swatch area to get grams per square inch, then multiply by the planned blanket area in square inches. This gives a measured-input base estimate. Account separately for borders, joins, tails, sampling, and other project-specific allowance before converting to whole skeins from the same yarn label."
      },
      {
        heading: "Choose an Explicit Yarn Allowance",
        content: "Choose an allowance for the actual project and record what it covers: representative sampling, joins, tails, borders, gauge variation, or other expected waste. Check whether the pattern or calculator already includes an allowance so that it is not counted twice. There is no percentage that guarantees enough yarn for every blanket.\n\nIf color continuity matters, compare the available yarn and dye-lot information before buying. Check the actual seller's return policy, deadlines, and condition requirements rather than assuming unused skeins can be returned."
      },
      {
        heading: "How to Calculate Yardage from a Pattern",
        content: "Start with the pattern requirement for the selected size and the yarn used in that pattern. Review its gauge, construction, modifications, and any included allowance. Divide the planned length, including only the additional allowance you intend, by the actual substitute label length and round upward to whole skeins. A matching category alone does not prove that the substitute will use the same length.\n\nWhen a pattern specifies grams, use the original yarn label to estimate its length first. Convert that planned length to skeins using the substitute label, then verify the candidate yarn with a representative swatch. The length-per-gram ratio alone does not determine skein count without the substitute skein size.\n\nWithout a pattern requirement, make a representative swatch in the intended construction and permitted finishing treatment. Measure its finished area and yarn use, then scale that measurement to the planned flat rectangle. Budget borders and other distinct sections separately."
      },
      {
        heading: "Using a Calculator vs Estimating",
        content: "A generic chart cannot know your stitch pattern, tension, border, or finishing losses. For a flat rectangular blanket, a defensible estimate starts with a representative swatch: measure its finished area and the yarn it used, then scale that measured use to the target area.\n\nThe Yarn Calculator performs measured length scaling and converts the result to whole skeins from label length. The Blanket Calculator calculates stitch and row checkpoints from entered gauge. When you also enter a representative swatch's dimensions and grams plus label length and weight, it scales that measured use to the planned area with its displayed 10 percent buffer. The Stripe Generator can arrange a sequence, but it does not prove per-color yardage.\n\nTreat every result as a planning estimate. Borders, joins, pattern changes, and a nonrepresentative swatch can materially change the final quantity."
      }
    ]
  },
  {
    slug: "needle-sizes-guide",
    title: "Knitting Needle Sizes: US, UK, and Metric Explained",
    description: "Compare metric diameter with US, UK, and Japanese needle labels, and verify the exact product before matching gauge.",
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
    title: "UK vs US Crochet Terms: Key Conversion Guide",
    description: "Understand why UK and US crochet terminology differs, learn the key conversions like double crochet and treble, and discover how to identify which system a pattern uses.",
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
    title: "What is WPI (Wraps Per Inch) and How to Measure It",
    description: "Measure wraps per inch, interpret overlapping CYC guidance, and verify the actual yarn with a swatch.",
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
    title: "How to Price Your Handmade Knitting and Crochet",
    description: "Learn how to price handmade knit and crochet items fairly. Covers materials cost, valuing your time, pricing for different markets, and common mistakes that lose money.",
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
    title: "Beginner's Guide to Amigurumi: Shapes, Sizes, and Math",
    description: "Review common amigurumi construction choices, count schedules, joining considerations, and the limits of a basic arithmetic reference.",
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
    title: "How to Crochet a Flat Circle: Increases Explained",
    description: "Review common flat-circle increase heuristics, ways to respond to cupping or ruffling, and the calculator's bounded selected-preset round schedule.",
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
    title: "Sewing & Craft Needle Types: Complete Guide",
    description: "Learn the differences between tapestry, chenille, sharps, betweens, and other hand sewing needles, what each type is designed for and how to choose the right one.",
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
    title: "Hat Sizing Guide: Head Measurements & Crown Shaping",
    description: "Find the right hat size for any age group, head circumference charts, negative ease calculations, crown shaping methods, and how to use the hat calculator.",
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
    title: "Knitting Socks: Sizing, Fit & Construction Basics",
    description: "Review sock anatomy, measurements, construction options, and how to use the circumference checkpoint with a tested pattern.",
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
    description: "Learn how to calculate sleeve tapers, space decreases evenly, and understand sleeve cap shaping for set-in sleeves. Includes standard sleeve lengths by size.",
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
    title: "Top-Down Raglan Sweaters: Construction Guide",
    description: "Review common raglan construction decisions and use the calculator only as a finished-body stitch-count checkpoint alongside a tested pattern.",
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
    title: "How to Plan Blocking: Care Instructions and Swatch Tests",
    description: "Use product care instructions, a representative swatch, and measured dimension changes to plan finishing without assuming a method from fiber name alone.",
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
    title: "Yarn Stash Management: Estimating & Organizing",
    description: "Estimate a partial skein from its own label and measured weight, and keep practical records for future projects.",
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
        heading: "Start with the exact yarn",
        content: "Retain the yarn name, product line, color, dye lot when supplied, fiber content, care instructions, and label weight and length. A photograph of the original label is more useful than a guessed category-to-yardage conversion."
      },
      {
        heading: "Weigh the remaining yarn",
        content: "Use a scale with suitable resolution and weigh the yarn alone. Exclude cones, labels, needles, buttons, and packaging. Measure in a comparable dry condition and note that scale and label tolerances affect the result."
      },
      {
        heading: "Calculate a proportional estimate",
        content: "Remaining length = remaining weight / full label weight × full label length. Use the same mass unit for both weights. The method assumes approximately consistent length per gram within this yarn; uneven construction or a mix of yarns can break that assumption."
      },
      {
        heading: "Worked example",
        content: "A label states 220 yards per 100 grams. With 42 grams remaining, the estimate is 42 / 100 × 220 = 92.4 yards, or about 84.5 meters. This is an arithmetic example, not a claim that 92.4 yards is enough for a hat, cowl, or socks."
      },
      {
        heading: "When the label is missing",
        content: "Look up the exact product or establish a ratio by measuring a known length and weight. Yarn weight categories and WPI do not establish universal yards per gram. Do not turn a thickness estimate into a precise remaining-yardage claim."
      },
      {
        heading: "Plan the next project",
        content: "Compare the estimate with a representative swatch or the actual pattern requirement. Account separately for joins, tails, borders, finishing, and waste. Record which yarn and measurements produced the estimate so it can be checked later."
      }
    ],
    modifiedDate: "2026-09-05",
    sources: [
      {
        title: "Craft Yarn Council: Standard Yarn Weight System",
        url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
      },
      {
        title: "Craft Yarn Council: How to Measure Wraps Per Inch",
        url: "https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi"
      }
    ]
  },
  {
    slug: "c2c-crochet-guide",
    title: "Corner-to-Corner Crochet (C2C): Beginner Guide",
    description: "Learn how a common C2C tile construction works and how to turn a measured two-axis block swatch into a bounded nominal grid; the calculator does not generate graph art or row-by-row instructions.",
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
    title: "Granny Square Blankets: Measured Grid & Joining Plan",
    description: "Use a measured square, ceiling-based grid counts, unique internal seam length, and project-specific yarn measurements to plan a rectangular granny-square blanket.",
    toolSlug: "granny-square-planner",
    date: "2026-08-29",
    keywords: ["granny square blanket", "joining granny squares", "granny square layout", "how many granny squares", "granny square seam length", "crochet blanket planning"],
    sections: [
      {
        heading: "Start With a Representative Square",
        content: "Make a square with the intended pattern, yarn, hook, tension, and care process, then measure its blocked edge. Do not infer size from round count alone. Different square patterns can have different edge structures even when their nominal dimensions match.\n\nIf the blanket mixes motifs, compare the measured edge of each motif and test the intended join on a small group. The assembled size can change with seam structure, joining tension, borders, and later treatment, so a grid calculation is a plan rather than a finished-size promise."
      },
      {
        heading: "Use a Meet-or-Exceed Grid",
        content: "For each axis, divide the target by the measured square size and round up. Multiplying the two whole-number axis counts gives total squares. This ceiling rule avoids a nominal grid smaller than the entered target.\n\nExamples with measured 6-inch squares: a 30 by 36 inch target is 5 by 6, or 30 squares; a 50 by 60 inch target is 9 by 10, or 90 squares with a nominal 54 by 60 inch span; and a 66 by 90 inch target is 11 by 15, or 165 squares. Joining and borders are not included in those nominal spans.\n\nLay out the planned pieces before final assembly. If the meet-or-exceed span is too large, compare another measured square size or revise the target; do not round down without accepting a smaller nominal grid."
      },
      {
        heading: "Separate Seam Distance From Yarn Use",
        content: "Count every shared square edge once. For a grid that is W squares wide and H squares tall, unique internal seam segments equal ((W − 1) × H) + ((H − 1) × W). Multiply the segment count by measured square size to get seam distance.\n\nSeam distance is not joining-yarn yardage. Whip stitch, mattress stitch, slip stitch, single crochet, decorative joins, and join-as-you-go can consume different amounts of yarn per inch. Make a sample join, measure its yarn use, and scale that observation to the reported seam distance. Measure borders separately."
      },
      {
        heading: "Plan Square and Color Yarn From Measurements",
        content: "Unravel or otherwise measure the yarn used by one representative square, then multiply by total square count. Add an allowance only after considering variation, rejected pieces, tails, borders, and the selected construction.\n\nAn equal division across colors is only a planning average. A layout with unequal rounds, motifs, or color placement requires layout-specific proportions. Record the measured yarn used by each representative color arrangement when purchasing accuracy matters.\n\nFrequently asked: the planner reports a nominal grid and unique internal seam distance. It does not guarantee finished dimensions, choose a joining method, or infer joining-yarn quantity. Test the full material and construction system before scaling up."
      }
    ]
  },
  {
    slug: "cast-on-methods-guide",
    title: "Knitting Cast-On Methods: Which One to Use",
    description: "Compare the most common knitting cast-on methods, long-tail, cable, tubular, and more, with stretch levels, difficulty, and best use cases for each.",
    toolSlug: "cast-on-calculator",
    date: "2026-03-11",
    modifiedDate: "2026-09-05",
    keywords: ["knitting cast on methods", "long tail cast on", "cable cast on", "tubular cast on", "cast on comparison", "stretchy cast on knitting", "cast on for ribbing"],
    sections: [
      {
        heading: "Why Cast-On Method Matters",
        content: "The cast-on creates the foundation row of your knitting and determines three critical properties of the bottom edge: stretchiness, neatness, and durability. Choosing the wrong cast-on can mean a sweater hem that is too tight to pull over your head, a sock cuff that cuts into your ankle, or a blanket edge that looks sloppy.\n\nDifferent cast-on methods produce edges with dramatically different stretch. A long-tail cast-on is moderately stretchy, perfect for most garments. A cable cast-on is firmer, good for structured edges and buttonhole bands. A tubular cast-on is very stretchy, ideal for ribbed edges that need to expand significantly.\n\nThe visual appearance also varies. Some cast-ons produce a clean, finished edge that looks good as-is. Others create a simple functional edge that will be hidden by a hem or seam. Matching the cast-on to your project's requirements is a small decision that makes a big difference in the finished piece."
      },
      {
        heading: "Long-Tail Cast-On",
        content: "Long-tail cast-on is one common setup method, with several variations and project-specific results. Follow the selected pattern and test the real edge because yarn, needles, technique, and tension affect both appearance and stretch.\n\nTail-length rules of thumb are not reliable for every yarn or cast-on technique. Use the method specified by the pattern or a separate measured approach rather than expecting a stitch-count calculator to predict tail length.\n\nUse the Cast On Calculator to produce a rounded arithmetic stitch-count checkpoint from entered width, measured gauge, and an optional whole stitch multiple. Add any pattern offsets and edge stitches separately. It does not choose a cast-on method, model stretch, or estimate tail length."
      },
      {
        heading: "Cable Cast-On",
        content: "The cable cast-on uses two needles to create each new stitch by knitting between the last two stitches on the needle and placing the new stitch back on the left needle. This produces a firm, rope-like edge with less stretch than the long-tail.\n\nThe cable cast-on has two major advantages. First, it does not require estimating a tail length, you work directly from the ball. Second, it can be used mid-row to add stitches during a project. This makes it essential for techniques like buttonholes (cast on stitches to bridge a gap), thumb gussets in mittens, and steek reinforcement.\n\nThe firmness of the cable cast-on is ideal for edges that need structure: bottom edges of cardigans that will carry button weight, the top of a pocket, or the beginning of a scarf that should not stretch out. It is not ideal for sock cuffs, hat brims, or any edge that needs to stretch significantly over a body part.\n\nTo work a cable cast-on, make a slip knot, knit one stitch and place it on the left needle. Then insert the right needle between the two stitches on the left needle, wrap the yarn, pull through a new stitch, and place it on the left needle. Repeat for each stitch."
      },
      {
        heading: "Tubular Cast-On",
        content: "Tubular or Italian cast-ons are families of setup methods for ribbed edges. Their execution and resulting elasticity depend on the chosen variation, yarn, needles, tension, ribbing, and finishing, so follow the selected pattern and test the actual edge.\n\nThe FiberTools Cast On Calculator converts entered width and measured stitch gauge into a rounded stitch count. It can round a count to an entered whole stitch multiple. Add any pattern offsets and edge stitches separately; it does not model or compare cast-on-method stretch."
      },
      {
        heading: "Frequently Asked Questions",
        content: "What is the most common cast-on method?\nThe long-tail cast-on is the most widely used method, it is fast, creates a neat and moderately stretchy edge, and works for almost every project type. It is the default cast-on taught in most beginner knitting classes.\n\nWhich cast-on is best for ribbing?\nThe tubular cast-on creates the most professional, stretchy edge for 1×1 or 2×2 ribbing. For a simpler option, the long-tail cast-on worked onto a needle one size smaller than the ribbing needles also produces a clean, stretchy ribbed edge.\n\nHow do I cast on stitches in the middle of a project?\nUse the cable cast-on or backward loop cast-on for adding stitches mid-row. The cable cast-on is firmer and neater; the backward loop is faster but produces a looser edge. Both are used for buttonholes, thumb gussets, and sleeve cap shaping.\n\nDoes cast-on method affect my stitch count?\nNo, the cast-on produces the same number of stitches regardless of method. However, different methods produce different edge stretch, which can affect whether a finished piece fits as expected. A tight cable cast-on on a hat brim may prevent the hat from fitting, while a stretchy long-tail cast-on works fine."
      }
    ]
  },
  {
    slug: "crochet-stitch-reference-guide",
    title: "Crochet Stitch Reference: Visual Guide for Beginners",
    description: "A complete reference to basic crochet stitches, chain, slip stitch, single crochet through treble, with heights, abbreviations, and when to use each stitch.",
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
    title: "Yarn Stripe Patterns: Color Planning & Yarn Tips",
    description: "Plan stripe patterns for knitting and crochet, color sequences, carrying yarn vs cutting, weaving in ends, yardage planning, and using the stripe generator.",
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
    title: "How to Read and Decode Vintage Knitting Patterns",
    description: "Learn how to interpret vintage knitting patterns from the 1920s through 1970s. Covers outdated terminology, obsolete needle sizes, imperial measurements, and how to adapt vintage instructions to modern yarn weights and tools.",
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
    title: "Understanding Fiber Content: A Complete Guide to Yarn Fibers",
    description: "Learn how fiber content affects your knitting and crochet projects. Covers wool, cotton, acrylic, silk, alpaca, linen, and blends, with care instructions, substitution tips, and project recommendations for each fiber type.",
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
