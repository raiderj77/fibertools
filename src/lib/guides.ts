export interface Guide {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  date: string;
  keywords: string[];
  sections: { heading: string; content: string }[];
}

export const guides: Guide[] = [
  {
    slug: "reading-yarn-labels",
    title: "The Complete Guide to Reading Yarn Labels (What Every Number Means)",
    description: "Learn how to read yarn labels like a pro! This comprehensive guide explains yarn weight symbols, washing care instructions, gauge information, and what every number on your yarn label actually means.",
    toolSlug: "yarn-calculator",
    date: "2026-02-23",
    keywords: ["how to read yarn labels", "yarn label symbols", "yarn weight chart", "yarn care instructions", "knitting yarn labels", "crochet yarn labels"],
    sections: [
      { 
        heading: "Why Yarn Labels Matter More Than You Think", 
        content: "Yarn labels aren't just decorative packaging—they're essential technical documents that contain critical information about project compatibility, care requirements, material composition, gauge information, and dye lot numbers. Ignoring these details can lead to disastrous results: sweaters that shrink in the wash, blankets that pill after one use, or projects that simply don't turn out as expected." 
      },
      { 
        heading: "Section 1: Yarn Weight and Thickness", 
        content: "The most prominent information on any yarn label is the weight category. According to the Craft Yarn Council's standardized system (used by most manufacturers worldwide), yarn weights range from 0 to 7. Weight 0 is Lace (1.5–2.25mm), Weight 1 is Super Fine/Fingering (2.25–3.25mm), Weight 2 is Fine/Sport (3.25–3.75mm), Weight 3 is Light/DK (3.75–4.5mm), Weight 4 is Medium/Worsted (4.5–5.5mm), Weight 5 is Bulky/Chunky (5.5–8mm), Weight 6 is Super Bulky (8–12.75mm), and Weight 7 is Jumbo (12.75mm+). Most patterns specify a yarn weight category. If your pattern calls for 'worsted weight' yarn, look for the number 4 on the label." 
      },
      { 
        heading: "Section 2: Fiber Content and Material Composition", 
        content: "The fiber content tells you what your yarn is made of—and this dramatically affects how your finished project will behave. Common fiber abbreviations include WOOL or W (natural sheep's wool), ALP or A (alpaca fiber), COT or C (cotton), ACR or AC (acrylic), NYL or N (nylon), SILK or S (silk), LIN or L (linen), and HEMP or H (hemp). Many yarns are blends (like 75% wool/25% nylon for sock yarns). The percentages matter: a yarn with 80% wool and 20% alpaca will behave differently than one with 20% wool and 80% alpaca." 
      },
      { 
        heading: "Section 3: Yardage and Weight", 
        content: "These numbers tell you how much yarn you're actually getting. Yardage/Meterage is the total length of yarn in the skein (e.g., '200 yards/183 meters'). Weight is the physical weight of the skein (e.g., '100 grams/3.5 ounces'). Different fibers have different densities. A 100-gram skein of lightweight cotton might have 400 yards, while a 100-gram skein of bulky wool might only have 100 yards. Always check yardage when substituting yarns in patterns." 
      },
      { 
        heading: "Section 4: Gauge Information", 
        content: "Gauge (or 'tension' in some countries) is arguably the most important—and most overlooked—information on a yarn label. It tells you the recommended needle/hook size, stitches per 4 inches/10 cm, and rows per 4 inches/10 cm. A typical gauge statement looks like: '18 sts x 24 rows = 4\" (10 cm) on US 8 (5 mm) needles'. Always make a gauge swatch! If your gauge doesn't match the label, your finished project won't match the pattern dimensions." 
      },
      { 
        heading: "Section 5: Care Symbols and Washing Instructions", 
        content: "Those tiny icons aren't just decorative—they're international care symbols that tell you exactly how to care for your finished item. Washing symbols include washtub with number (maximum water temperature), washtub with hand (hand wash only), washtub with X (do not wash). Drying symbols include square with circle (tumble dry), square with circle and X (do not tumble dry). Ironing symbols include iron with dots (iron temperature), iron with X (do not iron). Bleaching symbols include triangle (bleaching allowed), triangle with X (do not bleach). Dry cleaning symbols include circle (dry clean), circle with X (do not dry clean). Always follow care instructions!" 
      },
      { 
        heading: "Section 6: Dye Lot Numbers", 
        content: "That seemingly random number and letter combination (like 'LOT 12345A') is your dye lot number. Yarn is dyed in batches, and even with modern technology, slight color variations can occur between batches. Golden rule: Always buy enough yarn from the same dye lot for your entire project. If you need to buy more later, even if it's the same brand and color name, different dye lots might not match perfectly." 
      },
      { 
        heading: "Section 7: Recommended Needle/Hook Sizes", 
        content: "While gauge information includes recommended sizes, many labels also show this separately with icons: knitting needle icon with size (recommended knitting needle size) and crochet hook icon with size (recommended crochet hook size). These are suggestions, not rules. Your personal tension, the stitch pattern, and the desired fabric drape might require different sizes." 
      },
      { 
        heading: "Common Yarn Label Symbols Decoded", 
        content: "Beyond the standard care symbols, you might encounter specialized icons: Ball of yarn with knitting needles (suitable for knitting), ball of yarn with crochet hook (suitable for crochet), ball of yarn with both (suitable for both knitting and crochet), moth with X (moth-resistant treatment), flame with X (flame-retardant treatment), recycle symbol (contains recycled materials), OEKO-TEX® Standard 100 (certified free from harmful substances), GOTS (Global Organic Textile Standard) (certified organic fibers)." 
      },
      { 
        heading: "How to Use Yarn Label Information for Project Success", 
        content: "Now that you can read labels, here's how to apply this knowledge: 1. Pattern Matching: When choosing yarn for a pattern, compare weight category (should match exactly), gauge (should be similar), and fiber content. 2. Yarn Substitution: When substituting yarns, ensure same weight category, similar yardage per weight unit, compatible fiber properties, and similar care requirements. 3. Care Planning: Before starting a project, check care instructions. 4. Quantity Calculation: Use the yardage information to determine exactly how many skeins you need." 
      },
      { 
        heading: "Troubleshooting Common Yarn Label Issues", 
        content: "If the label doesn't show gauge for your needle size: Create a swatch with your preferred needles and measure. If the care symbols are faded/unreadable: Search online for the yarn brand and colorway—most manufacturers provide label information on their websites. If the yarn weight seems wrong for the category: Some artisanal or novelty yarns don't fit neatly into standard categories. Focus on gauge rather than weight number. If no dye lot number is listed: This usually means the yarn is space-dyed or has no dye variations (common with natural undyed yarns or some synthetics)." 
      },
      { 
        heading: "Expert Tips from Professional Fiber Artists", 
        content: "1. Save your labels—tape them into a notebook or take photos. You'll thank yourself when you need to make repairs or recreate a project. 2. Make notes—jot down needle size, modifications, and washing results on the label or in Ravelry. 3. Consider future care—if making a gift, choose yarns with easy care instructions (machine washable is always appreciated). 4. Test wash your swatch—this reveals how the yarn will behave after washing and whether it will shrink or bleed color." 
      },
      { 
        heading: "Frequently Asked Questions About Yarn Labels", 
        content: "Q: What does 'superwash' mean on a yarn label? A: Superwash wool has been treated to prevent felting, making it machine washable. It's ideal for items that will need frequent washing like socks, baby clothes, and everyday wear. Q: Why do some yarns have multiple weight categories listed? A: Some yarns fall between standard categories or have different recommended uses. A yarn might be labeled as '4-5' if it's between worsted and bulky. Always check the gauge rather than relying solely on the weight number. Q: What if my yarn has no label? A: You can often identify yarn by burn testing a small piece (safely!), examining the fiber under magnification, or comparing it to known samples. When in doubt, assume it needs gentle hand washing and flat drying. Q: Are all yarn labels standardized worldwide? A: Most follow the Craft Yarn Council standards, but there are regional variations. European labels might use different symbols or metric measurements exclusively. Japanese labels often include both metric and US measurements. Q: What does 'lot' or 'dye lot' mean? A: This refers to the specific batch in which the yarn was dyed. Always buy enough yarn from the same lot to ensure color consistency throughout your project. Q: Can I ignore the recommended needle/hook size? A: You can use different sizes, but it will affect your gauge and the finished fabric. Larger needles create looser, drapier fabric; smaller needles create tighter, denser fabric. Always swatch!" 
      },
      { 
        heading: "Conclusion: Your Yarn Label is Your Best Friend", 
        content: "Reading yarn labels might seem daunting at first, but with this guide, you now have the decoder ring for every symbol and number. Remember: your yarn label contains everything you need to know for project success—from choosing the right yarn to caring for your finished masterpiece. The next time you pick up a skein, take a moment to read the label thoroughly. Check the weight, fiber content, care instructions, and gauge. Your future self (and your finished projects) will thank you." 
      }
    ]
  },
  {
    slug: "knitting-gauge-guide",
    title: "Knitting Gauge: Why It Matters and How to Get It Right",
    description: "Learn what knitting gauge is, how to make and block a proper gauge swatch, and what to do when your tension doesn't match the pattern. Covers stitch gauge, row gauge, and resizing.",
    toolSlug: "gauge-calculator",
    date: "2026-03-06",
    keywords: ["knitting gauge", "gauge swatch", "stitch gauge", "row gauge", "knitting tension", "gauge calculator"],
    sections: [
      {
        heading: "What Gauge Is and What It Measures",
        content: "Gauge — sometimes called tension in British patterns — is a measurement of how many stitches and rows fit inside a fixed area of knitted fabric. Most patterns express gauge as a count per 4 inches (10 cm) square: for example, 20 stitches and 28 rows in stockinette on US 7 needles. That single specification controls every dimension of the finished piece.\n\nTwo knitters using the same yarn and the same needles can produce wildly different gauges. Hand tension, knitting style (English throw versus Continental pick), needle material (slippery metal versus grippy bamboo), and even posture all affect how tightly yarn wraps around the needle. This is why gauge matters: the pattern designer wrote their math around one specific fabric density, and if yours differs by even half a stitch per inch, the finished garment can be inches off in circumference.\n\nGauge isn't about right or wrong — it's about matching the fabric the designer intended. A looser gauge creates drapier fabric with more visible stitch definition. A tighter gauge creates a denser, stiffer cloth. Neither is incorrect on its own, but either one will sabotage fit if the pattern assumes the other."
      },
      {
        heading: "How to Make a Proper Gauge Swatch",
        content: "A gauge swatch needs to be large enough to measure accurately. Cast on enough stitches for at least 6 inches of width using the yarn, needles, and stitch pattern specified in the pattern. Work in that stitch pattern until the piece measures at least 6 inches tall. The extra fabric beyond the 4-inch measurement zone matters because edge stitches distort gauge — you always measure from the interior of the swatch.\n\nIf the pattern is worked in the round, flat swatches can lie. Stockinette worked flat alternates knit and purl rows, and many knitters tension those rows differently. For an accurate gauge on a circular project, either knit your swatch in the round on double-pointed needles or use the float method: knit every row from the right side, cutting the yarn at the end of each row and sliding the stitches back to the starting needle tip.\n\nBind off loosely when the swatch is tall enough. Don't rip it out immediately — you'll need it intact for blocking and measuring."
      },
      {
        heading: "How to Block Your Swatch Before Measuring",
        content: "Unblocked measurements are unreliable. Blocking relaxes the yarn, evens out stitches, and reveals the fabric's true dimensions. Wet-block your swatch the same way you would block the finished project: soak it in lukewarm water for 15–20 minutes, gently squeeze out excess water in a towel, then pin it flat to a blocking mat without stretching it. Let it dry completely.\n\nSome fibers change dramatically after blocking. Superwash merino tends to grow; cotton can relax and widen; linen softens and drapes more. Alpaca is notorious for lengthening. If you skip blocking, your gauge number may be a full stitch per inch off from what the finished garment will actually measure after its first wash.\n\nOnce the swatch is dry, lay it on a flat surface. Place a ruler or gauge tool horizontally across a row of stitches, away from the edges, and count how many stitches span exactly 4 inches. Then rotate the ruler vertically and count rows over 4 inches. Record both numbers."
      },
      {
        heading: "What to Do When Your Gauge Doesn't Match",
        content: "If you're getting more stitches per inch than the pattern specifies, your tension is tight. Switch to a needle one size larger and swatch again. If you're getting fewer stitches per inch, your tension is loose — go down a needle size. Repeat until your stitch count matches the pattern's gauge.\n\nSometimes you'll match stitch gauge but not row gauge, or vice versa. Stitch gauge is almost always more important, because most patterns provide length instructions in inches rather than row counts. If your row gauge is off but stitch gauge matches, you can usually compensate by knitting to the specified length measurement instead of the specified row count.\n\nDon't try to consciously knit tighter or looser to force a gauge match. Forced tension is inconsistent — you'll revert to your natural tension partway through the project, creating uneven fabric. Changing needle size is the correct adjustment."
      },
      {
        heading: "Stitch Gauge vs Row Gauge",
        content: "Stitch gauge measures the horizontal density of your fabric — how wide your knitting grows per stitch. Row gauge measures vertical density — how tall each row is. Most garment patterns prioritize stitch gauge because width determines fit around the body, and width is controlled entirely by stitch count.\n\nRow gauge becomes critical in specific situations: colorwork charts that must maintain proportions, short-row shaping that depends on exact row heights, and any pattern where shaping instructions are given as row counts rather than length measurements. Fair Isle yokes, for instance, depend on both gauges being correct — off row gauge means the yoke will be too deep or too shallow.\n\nIf a pattern provides both gauges, check both. When they conflict (you match one but not the other), prioritize stitch gauge and adjust row counts by measuring length as you knit."
      },
      {
        heading: "How to Resize a Pattern for Your Gauge",
        content: "Sometimes you love a yarn that simply won't match the pattern gauge at any needle size. In that case, you can resize the pattern math. Divide the desired finished width by your stitches-per-inch to get the number of stitches to cast on. Then recalculate shaping: if the pattern decreases 2 stitches every 4 rows over 40 rows, figure out how many inches that covers at the original gauge, then calculate how many rows that same distance takes at your gauge.\n\nThis gets complex quickly, especially for garments with set-in sleeves or shaped necklines. A gauge calculator can handle the arithmetic — plug in the pattern's original gauge, your gauge, and the stitch counts, and it will output adjusted numbers. The Gauge Calculator on fibertools.app does exactly this, and the Needle Converter helps if you're switching between metric and US sizing. The Inc/Dec Calculator can recalculate shaping intervals, and the Yarn Calculator ensures you buy enough yardage for the resized project.\n\nThe bottom line: never skip the swatch. Twenty minutes of swatching can save twenty hours of ripping back a garment that doesn't fit."
      }
    ]
  },
  {
    slug: "blanket-yarn-guide",
    title: "How Much Yarn Do You Need for a Blanket?",
    description: "Figure out exactly how much yarn to buy for any blanket size. Covers yardage by blanket type, how yarn weight and stitch pattern affect totals, and when to use a calculator.",
    toolSlug: "blanket-calculator",
    date: "2026-03-06",
    keywords: ["blanket yarn yardage", "how much yarn for a blanket", "blanket size chart", "yarn for baby blanket", "throw blanket yarn", "blanket calculator"],
    sections: [
      {
        heading: "Blanket Size Chart: Baby to King",
        content: "Blanket sizes vary, but standard dimensions give you a reliable starting point. A baby or receiving blanket typically measures 30 × 36 inches. A stroller blanket runs about 30 × 40 inches. A lap blanket is roughly 36 × 48 inches. A throw blanket — the most popular project size — measures around 50 × 60 inches. A twin bed blanket is approximately 66 × 90 inches. A queen comes in at 90 × 90 inches, and a king at 108 × 90 inches.\n\nThese are finished dimensions. If your stitch pattern has significant draw-in (cables, for instance, pull fabric narrower than stockinette), you'll need to cast on extra stitches to hit the target width. Blocking can also change dimensions — cotton and linen tend to grow, while wool can either shrink or bloom depending on the fiber preparation.\n\nChoose your size before calculating yardage. The jump from a throw to a queen blanket nearly triples the square footage, which has a massive impact on how much yarn you need to buy."
      },
      {
        heading: "How Yarn Weight Changes Yardage Dramatically",
        content: "Yarn weight is the single biggest factor in total yardage. A throw blanket in fingering-weight yarn might require 3,500–4,000 yards. The same throw in worsted weight drops to roughly 2,000–2,500 yards. In super bulky yarn, you might need only 800–1,200 yards. The fabric gets thicker and the stitches get larger, so fewer yards cover the same area.\n\nThis also affects cost and project time. Fingering-weight blankets take dramatically longer to knit or crochet, but they produce a lightweight, drapey fabric perfect for warm climates. Bulky blankets work up fast and feel cozy but can be heavy — a king-size super bulky blanket can weigh over 10 pounds.\n\nDon't assume heavier yarn is always cheaper per blanket. Super bulky yarn costs more per skein, and while you need fewer yards, the price per yard is higher. Mid-range weights like worsted and aran often hit the sweet spot of reasonable yardage, moderate cost, and manageable knitting time."
      },
      {
        heading: "Stitch Pattern Affects Yarn Usage",
        content: "A blanket worked entirely in garter stitch uses roughly 10–15% less yarn than stockinette at the same gauge, because garter fabric is thicker and squishier — it compresses vertically, meaning fewer rows per inch. Seed stitch and moss stitch fall somewhere in between. Cables, on the other hand, are yarn-hungry: a heavily cabled blanket can use 25–30% more yarn than a plain stockinette one because each cable crossing pulls extra yarn to the front of the fabric.\n\nCrochet stitches generally use more yarn than knit stitches for the same area. Single crochet produces a dense fabric and eats yarn; double crochet is more efficient. Granny squares are moderately efficient but generate waste yarn from frequent color changes and weaving in ends.\n\nIf you're designing your own blanket, swatch your chosen stitch pattern and weigh the swatch. Divide the swatch weight by its area to get grams per square inch, then multiply by your blanket's total square inches. This gives you the total grams needed, which you can convert to skeins."
      },
      {
        heading: "Why You Should Always Buy Extra",
        content: "The standard advice is to buy 10–15% more yarn than your calculated total. This buffer accounts for gauge variations across the project (your tension may shift over weeks of knitting), yarn lost to weaving in ends, and the occasional mistake that requires ripping back and re-knitting a section.\n\nDye lots matter here. If you need 12 skeins, buy 14 from the same dye lot. Running out mid-project and finding that your local shop only has a different dye lot is a common and frustrating problem. Even skeins labeled the same color name can show a visible stripe where the dye lot changes.\n\nMost yarn shops accept returns of unused skeins with intact labels. Ask about the return policy before buying — this makes it painless to purchase a few extra skeins as insurance. Leftover yarn is never wasted; it goes into the stash for future projects, swatches, or repairs."
      },
      {
        heading: "How to Calculate Yardage from a Pattern",
        content: "Published patterns list required yardage, but those numbers assume you match the designer's gauge exactly and make no modifications. If you're substituting yarn, compare the pattern's listed yardage against the yardage per skein of your substitute. Divide total yardage needed by yardage per skein, round up, and add your 10–15% buffer.\n\nFor patterns that list yarn by weight (grams) rather than yardage, you need to convert. Check the yards-per-gram ratio of both the original yarn and your substitute. If the original yarn yields 4 yards per gram and yours yields 3.5 yards per gram, you'll need proportionally more skeins of the substitute.\n\nWhen no pattern is involved — you're freestyling a blanket — you need to swatch, measure, and calculate from scratch. Knit a swatch of at least 6 × 6 inches, weigh it, calculate area, then scale up to your blanket dimensions."
      },
      {
        heading: "Using a Calculator vs Estimating",
        content: "Rough estimates work for casual projects where running out of yarn isn't catastrophic — you can always add a contrasting border or switch to stripes. But for single-color blankets or gifts with a deadline, precision matters. A blanket calculator removes the guesswork by taking your gauge, blanket dimensions, and yarn weight, then outputting total yardage and skein count.\n\nThe Blanket Calculator on fibertools.app handles this math instantly. Pair it with the Yarn Calculator to figure out how many skeins of a specific brand you need. If you're making a striped blanket, the Stripe Generator helps plan color distribution so you can buy the right amount of each color. And the Project Cost Calculator lets you estimate total material cost before you commit to buying.\n\nPlanning ahead saves money and frustration. A few minutes with a calculator before you shop means you buy the right amount, from the same dye lot, on the first trip."
      }
    ]
  },
  {
    slug: "needle-sizes-guide",
    title: "Knitting Needle Sizes: US, UK, and Metric Explained",
    description: "Understand the three knitting needle sizing systems — US, UK, and metric — their history, how to convert between them, and how to identify unlabeled needles.",
    toolSlug: "needle-converter",
    date: "2026-03-06",
    keywords: ["knitting needle sizes", "needle size chart", "US UK metric needles", "needle conversion", "knitting needle guide", "crochet hook sizes"],
    sections: [
      {
        heading: "Why There Are Three Sizing Systems",
        content: "Knitting needles are manufactured and sold worldwide, but three distinct sizing conventions survived into modern use: US numbers, old UK/Canadian numbers, and metric millimeters. Each system emerged from a different manufacturing tradition, and none of them agreed to unify — so pattern books, needle packaging, and online tutorials still mix all three.\n\nThe confusion compounds when you realize that US and UK systems both use plain numbers, but the numbers mean completely different sizes. A US size 8 needle is 5.0 mm. A UK size 8 needle is 4.0 mm — a full millimeter smaller. Grabbing the wrong one changes your gauge dramatically. This is why metric has become the de facto universal system: millimeters are unambiguous.\n\nModern patterns increasingly list metric sizes as the primary reference, with US or UK equivalents in parentheses. If you encounter an older pattern that only gives one system, a conversion chart — or a converter tool — is essential."
      },
      {
        heading: "The US Number System",
        content: "The US system assigns ascending numbers to ascending needle diameters. US 0 is 2.0 mm, US 1 is 2.25 mm, and the numbers climb from there: US 4 is 3.5 mm, US 7 is 4.5 mm, US 10 is 6.0 mm, and US 15 is 10.0 mm. Above US 15, sizes switch to direct millimeter labeling (US 17 is 12.75 mm, US 19 is 15.0 mm, and so on).\n\nThe progression isn't perfectly linear — the gaps between millimeter equivalents vary. Between US 5 (3.75 mm) and US 6 (4.0 mm) there's only a 0.25 mm difference, while between US 10 (6.0 mm) and US 10.5 (6.5 mm) the jump is 0.5 mm. This unevenness is a historical artifact; the US system was standardized around commonly manufactured wire gauges, not around even metric intervals.\n\nMost American knitting patterns published after 2000 list both the US number and the metric equivalent. If a pattern only says \"size 8 needles,\" assume US 8 (5.0 mm) unless the pattern is explicitly British."
      },
      {
        heading: "The Old UK Sizing System",
        content: "The UK system (also used historically in Canada and Australia) runs in reverse: higher numbers mean smaller needles. UK 14 is 2.0 mm, UK 12 is 2.75 mm, UK 8 is 4.0 mm, UK 4 is 6.0 mm, and UK 000 is 10.0 mm. The system originated from the Standard Wire Gauge used in British manufacturing, where higher gauge numbers indicated thinner wire.\n\nThis reverse ordering is the source of most conversion errors. A knitter accustomed to US sizing sees \"size 10\" in a vintage British pattern and reaches for a 6.0 mm needle (US 10), when the pattern actually calls for a 3.25 mm needle (UK 10). The difference is enormous — nearly double the diameter.\n\nThe UK system is largely obsolete in new publications. British patterns printed after the mid-1990s typically use metric sizing. But vintage pattern books, charity shop finds, and heirloom patterns passed down through families still use the old numbers. If you collect vintage patterns, keep a conversion reference handy."
      },
      {
        heading: "Metric as the Universal Standard",
        content: "Metric sizing expresses the needle diameter directly in millimeters. A 4.0 mm needle is exactly 4.0 mm across — no interpretation needed. This eliminates the ambiguity of numbered systems entirely. Metric sizes run in 0.25 mm increments through the common range (2.0 mm to about 6.0 mm), then in 0.5 mm or larger increments above that.\n\nJapanese knitting patterns use metric exclusively, as do most European patterns. Metric is also the standard used by interchangeable needle set manufacturers like Chiaogoo, Lykke, and KnitPro. If you invest in an interchangeable set, learning to think in millimeters will save you constant conversion lookups.\n\nWhen buying needles online from international sellers, always confirm the metric size. A listing that says \"size 6\" could mean US 6 (4.0 mm), UK 6 (5.0 mm), or Japanese 6 (3.9 mm, close to but not identical to US 6). Millimeters are the only measurement that means the same thing everywhere."
      },
      {
        heading: "How to Find Your Needle Size Without a Label",
        content: "Unlabeled needles are common — vintage sets, hand-me-downs, or needles whose size markings have worn off. The simplest tool is a needle gauge: a flat card or ruler with graduated holes. Slide the needle into holes until you find the one it fits snugly. The hole's label gives you the metric size.\n\nIf you don't have a needle gauge, a digital caliper from a hardware store measures the shaft diameter to the hundredth of a millimeter. This is the most precise method and works for any needle, including unusual sizes between standard increments.\n\nIn a pinch, you can compare the mystery needle against a labeled one from your collection. Hold them side by side and roll them together between your fingers — even small differences in diameter are detectable by touch. Once you identify the metric size, a converter tool translates it to US or UK numbers for pattern reference."
      },
      {
        heading: "Crochet Hook Sizing Differences",
        content: "Crochet hooks follow a similar multi-system pattern but with their own quirks. US crochet hooks use a letter-number combination: B/1 (2.25 mm), G/6 (4.0 mm), J/10 (6.0 mm), and so on. The letter system is unique to crochet — there's no knitting needle equivalent. UK crochet hooks historically used the same reverse-number system as knitting needles, adding another layer of confusion.\n\nSteel crochet hooks for thread crochet have their own separate numbering where higher numbers mean smaller hooks (US steel 7 is 1.65 mm, steel 1 is 2.75 mm). These numbers don't correspond to regular hook sizes at all. Steel hooks are used almost exclusively for lace and doily work with fine cotton thread.\n\nThe Needle Converter on fibertools.app handles both knitting needles and crochet hooks across all sizing systems. The Needle Guide provides visual references, the Gauge Calculator helps verify that your hook or needle choice produces the right fabric density, and the Yarn Weights chart shows recommended hook and needle ranges for each yarn weight category."
      }
    ]
  },
  {
    slug: "uk-us-crochet-terms-guide",
    title: "UK vs US Crochet Terms: A Complete Conversion Guide",
    description: "Understand why UK and US crochet terminology differs, learn the key conversions like double crochet and treble, and discover how to identify which system a pattern uses.",
    toolSlug: "uk-to-us-converter",
    date: "2026-03-06",
    keywords: ["UK US crochet terms", "crochet conversion", "double crochet UK US", "treble crochet", "crochet abbreviations", "crochet terminology"],
    sections: [
      {
        heading: "Why Two Systems Exist",
        content: "Crochet terminology split into two branches early in the craft's published history. When British and American publishers independently standardized stitch names in the 19th and early 20th centuries, they assigned different names to the same physical stitches. The root cause is a one-step offset: the US system names each stitch for the number of yarn-overs it uses, while the UK system names each stitch one level higher.\n\nThis means every UK stitch name corresponds to a different US stitch. A UK double crochet is a US single crochet. A UK treble is a US double crochet. The stitches themselves are identical — the hands do the same motions, the hook moves through the same loops — but the words on the page point to different actions depending on which side of the Atlantic wrote the pattern.\n\nThe two systems have coexisted for over a century with no sign of merging. Australian and some other Commonwealth patterns tend to follow UK conventions. Most online patterns from American designers and platforms like Ravelry default to US terms. Knowing both is a practical necessity for any crocheter who uses patterns from international sources."
      },
      {
        heading: "The Most Confusing Conversions",
        content: "Three stitch pairs cause the most errors. First: UK double crochet (dc) is US single crochet (sc). This is the most common crochet stitch — a simple pull-through with no yarn-over before insertion. If a UK pattern says \"dc across,\" an American crocheter who works a US double crochet (yarn over, insert, pull through, work off in pairs) will produce fabric twice as tall as intended.\n\nSecond: UK treble (tr) is US double crochet (dc). This stitch involves one yarn-over before inserting the hook. Since \"dc\" and \"tr\" are both common abbreviations, and both appear in both systems with different meanings, this is where most cross-system mistakes happen.\n\nThird: UK half treble (htr) is US half double crochet (hdc). The stitch uses one yarn-over but pulls through all three loops at once instead of working them off in pairs. The abbreviation shift from \"htr\" to \"hdc\" is a reliable clue about which system a pattern uses — if you see \"htr,\" the pattern is almost certainly UK."
      },
      {
        heading: "Full Conversion Chart",
        content: "Here is the complete stitch-by-stitch conversion. UK chain (ch) equals US chain (ch) — this one is the same in both systems. UK slip stitch (ss) equals US slip stitch (sl st). UK double crochet (dc) equals US single crochet (sc). UK half treble (htr) equals US half double crochet (hdc). UK treble (tr) equals US double crochet (dc). UK double treble (dtr) equals US treble crochet (tr). UK triple treble (ttr) equals US double treble crochet (dtr).\n\nThe pattern continues up the stitch heights — each UK name is one step above its US equivalent. UK quadruple treble equals US triple treble, and so on, though stitches taller than triple treble are rare in practice.\n\nNote the abbreviation overlaps: \"dc\" means double crochet in the US (yarn over, insert hook) but double crochet in the UK (no yarn over, insert hook) — two different stitches sharing one abbreviation. Similarly, \"tr\" means treble in the UK (one yarn-over) and treble in the US (two yarn-overs). Context is everything."
      },
      {
        heading: "Vintage UK Patterns Have Additional Quirks",
        content: "Patterns published before the 1970s — especially British ones — sometimes use terminology that doesn't map neatly to either modern system. You might encounter \"plain crochet\" (equivalent to modern UK double crochet / US single crochet), \"long treble\" (could mean UK double treble or an elongated stitch), or numbered stitch descriptions instead of standard abbreviations.\n\nVintage patterns also assume different tension standards. Hook sizes were described by steel wire gauge numbers, and the fabric density expected for a \"medium\" yarn was often tighter than what modern patterns specify. If you're working a vintage UK pattern, swatch generously and be prepared to adjust your hook size.\n\nSome mid-century patterns from Commonwealth countries — particularly Australia and South Africa — blended UK and local terminology. If a pattern seems internally inconsistent, check the publication origin and date. A reference like the UK/US Converter tool helps untangle these discrepancies quickly."
      },
      {
        heading: "How to Spot Which System a Pattern Uses",
        content: "Several clues reveal the system before you start crocheting. First, look for an explicit statement — many modern patterns say \"written in US terms\" or \"UK terminology\" at the top. Second, check the abbreviation list. If it includes \"sc\" (single crochet), it's US. If it includes \"dc\" as the shortest basic stitch, it's UK. The presence of \"htr\" (half treble) signals UK; \"hdc\" (half double crochet) signals US.\n\nThird, look at the turning chain counts. In US terms, single crochet uses chain 1 to turn, half double crochet uses chain 2, and double crochet uses chain 3. In UK terms, double crochet uses chain 1, half treble uses chain 2, and treble uses chain 3. If a pattern says \"ch 1, dc across\" and the resulting fabric is short and dense, the pattern is UK.\n\nFourth, consider the source. Patterns from Ravelry, Yarnspirations, and most American yarn companies use US terms. Patterns from Stylecraft, Sirdar, King Cole, and other British yarn brands use UK terms. When in doubt, crochet a small test swatch of the first row and compare the fabric height to what the pattern describes."
      },
      {
        heading: "Tips for Switching Between Systems",
        content: "If you primarily crochet in one system and encounter a pattern in the other, the fastest approach is to annotate the pattern before you start. Go through the instructions and write the equivalent stitch name from your preferred system above each abbreviation. This takes ten minutes and prevents errors throughout the entire project.\n\nAnother strategy is to think in terms of stitch height rather than names. Learn to recognize that the basic pull-through stitch (no preliminary yarn-over) is the shortest, the one-yarn-over stitch is the next tallest, and so on. Once you can identify a stitch by its physical structure rather than its name, the terminology becomes a translation exercise rather than a source of confusion.\n\nThe UK/US Converter on fibertools.app provides instant translation between the two systems. The Abbreviation Glossary covers both UK and US abbreviations with definitions. The Stitch Reference shows each stitch with visual descriptions so you can confirm the physical technique regardless of what the pattern calls it. And the Needle Converter handles any hook size discrepancies between UK and metric labeling."
      }
    ]
  },
  {
    slug: "wpi-guide",
    title: "What is WPI (Wraps Per Inch) and How to Measure It",
    description: "Learn what Wraps Per Inch measures, how to wrap yarn correctly, WPI ranges for every yarn weight, and how to use WPI for yarn substitution and handspun identification.",
    toolSlug: "yarn-weight-chart",
    date: "2026-03-06",
    keywords: ["wraps per inch", "WPI yarn", "yarn weight measurement", "how to measure WPI", "yarn substitution", "handspun yarn weight"],
    sections: [
      {
        heading: "What WPI Measures",
        content: "Wraps Per Inch (WPI) is a way to determine yarn thickness by counting how many times a strand of yarn wraps around a ruler, dowel, or WPI tool within one inch. It gives you a direct, physical measurement of a yarn's diameter — no label required. This makes it invaluable for mystery yarns from your stash, handspun skeins, and any situation where the ball band is missing or unreliable.\n\nWPI correlates directly with yarn weight categories. Thinner yarns produce more wraps per inch; thicker yarns produce fewer. Lace-weight yarn wraps about 30–40 times per inch. Worsted wraps about 9–12 times. Super bulky wraps only 5–6 times. These ranges overlap at the boundaries — yarn weight categories are bands, not hard lines.\n\nThe measurement is simple enough that it requires no specialized equipment, yet accurate enough to guide yarn substitution decisions. Combined with a knitted or crocheted gauge swatch, WPI gives you a reliable picture of how an unknown yarn will behave in a finished project."
      },
      {
        heading: "How to Wrap Yarn Correctly",
        content: "Wrap the yarn around a smooth, cylindrical object — a pencil, a thin dowel, or a dedicated WPI tool with a notch. Wrap in a single layer, with each wrap sitting snugly beside the previous one. The wraps should touch but not overlap, and the yarn should lie naturally without being stretched or compressed.\n\nConsistency is critical. If you pull the yarn taut, the wraps will pack tighter and give a falsely high WPI. If you leave slack, the wraps will be loose and the count will be too low. Use the same light tension you'd apply when winding a ball by hand. Wrap at least one full inch — two inches is better, then divide the total count by two for a more reliable average.\n\nTextured yarns — boucle, chenille, thick-and-thin — are harder to measure accurately because the surface isn't smooth. For these, wrap gently and accept that the WPI will be approximate. Focus on the thickest sections of a thick-and-thin yarn, since those sections dominate the fabric's gauge."
      },
      {
        heading: "WPI Ranges for Each Yarn Weight",
        content: "The Craft Yarn Council's weight categories map roughly to these WPI ranges. Lace (weight 0) measures 30–40+ WPI. Fingering or sock (weight 1) falls at 19–22 WPI. Sport (weight 2) is 15–18 WPI. DK or light worsted (weight 3) is 12–14 WPI. Worsted (weight 4) is 9–11 WPI. Bulky (weight 5) is 7–8 WPI. Super bulky (weight 6) is 5–6 WPI. Jumbo (weight 7) is 4 or fewer WPI.\n\nThese ranges are guidelines, not rigid boundaries. A firmly spun sport-weight yarn might register at 18 WPI, while a loosely spun one of the same weight category might only reach 15 WPI. Fiber content also affects WPI — a cotton yarn and a wool yarn of the same weight category may wrap differently because cotton is denser and less elastic.\n\nWhen your WPI lands between two categories, knit or crochet a gauge swatch at the recommended needle or hook size for both adjacent categories and see which fabric you prefer. The WPI gets you in the right neighborhood; the swatch confirms the address."
      },
      {
        heading: "How WPI Helps with Yarn Substitution",
        content: "Substituting yarn is one of the most common tasks in knitting and crochet, and WPI provides an objective comparison point. If your pattern calls for a specific yarn that's discontinued or unavailable, measure its WPI (if you have a remnant) or look it up in a yarn database. Then measure the WPI of your candidate substitute. If the two numbers are within 1–2 wraps of each other, the yarns are close enough in thickness to be viable substitutes.\n\nWPI alone doesn't guarantee a successful substitution — fiber content, drape, elasticity, and stitch definition all matter too. A cotton yarn and a wool yarn with identical WPI will produce very different fabrics. But WPI eliminates the most common substitution error: choosing a yarn that's simply the wrong thickness.\n\nFor best results, match WPI, then swatch the substitute yarn at the pattern's recommended gauge. If your gauge matches, proceed with confidence. If it's close but not exact, adjust your needle or hook size. The combination of WPI matching and gauge swatching gives you the highest probability of a successful substitution."
      },
      {
        heading: "Using WPI for Handspun Yarn",
        content: "Handspinners rely on WPI more than any other group of fiber artists. When you spin yarn by hand, there's no manufacturer's label to tell you the weight category. WPI is the primary tool for classifying what you've made and deciding how to use it.\n\nMeasure WPI at several points along the skein, because handspun yarn typically varies in thickness. Take readings at five or six different spots and average them. If the variation is large — say, some sections measure 10 WPI and others measure 14 WPI — the yarn is a thick-and-thin style. Use the average WPI for project planning, but expect gauge to be less consistent than with commercial yarn.\n\nWPI also helps spinners adjust their technique. If you're aiming for a DK-weight yarn (12–14 WPI) and your sample measures 16 WPI, you know to draft thicker or add less twist on the next bobbin. Measuring frequently during spinning keeps you on target and reduces wasted fiber."
      },
      {
        heading: "WPI vs Weight Categories: Which to Trust",
        content: "Yarn labels and weight category numbers are marketing-influenced. A yarn company might label something \"DK\" when it's closer to sport weight, or call a yarn \"worsted\" when it knits at a heavy worsted or even aran gauge. The weight number on the ball band reflects the manufacturer's suggested use, not a precise measurement.\n\nWPI, by contrast, is an objective physical measurement. It tells you what the yarn actually is, not what the label says it is. When the label and your WPI measurement disagree, trust the WPI — and then confirm with a gauge swatch. This three-step process (check label, measure WPI, swatch) catches mismatches before they become mid-project disasters.\n\nThe Yarn Weights tool on fibertools.app lists WPI ranges alongside recommended needle and hook sizes for each weight category. The Spinning Calculator can help handspinners plan fiber quantities for a target yarn weight. The Weaving Sett Calculator uses similar density logic for warp and weft planning. And the Yarn Calculator translates your weight-category identification into yardage estimates for specific projects."
      }
    ]
  },
  {
    slug: "pricing-handmade-guide",
    title: "How to Price Your Handmade Knitting and Crochet",
    description: "Learn how to price handmade knit and crochet items fairly. Covers materials cost, valuing your time, pricing for different markets, and common mistakes that lose money.",
    toolSlug: "project-cost-calculator",
    date: "2026-03-06",
    keywords: ["pricing handmade crochet", "how to price knitting", "handmade pricing formula", "crochet business pricing", "knitting commission price", "craft pricing guide"],
    sections: [
      {
        heading: "The Real Cost of Handmade vs Retail",
        content: "A hand-knit sweater takes 40–80 hours to complete. At even a modest hourly rate, that puts the labor cost alone at hundreds of dollars — before materials. This is why handmade items can never compete with mass-produced retail on price. Factory-made garments benefit from industrial-speed machines, bulk fiber purchasing, and labor markets with lower wages. Handmade operates in a completely different economy.\n\nUnderstanding this gap is the first step to pricing sanely. Many makers set prices by comparing to retail (\"a store sweater costs $60, so I'll charge $80\") and end up earning less than minimum wage for their time. The correct approach is to calculate costs from the ground up: materials plus labor plus overhead equals your minimum viable price.\n\nThis doesn't mean every handmade item needs to cost $500. It means you need to be realistic about which items are viable to sell, which make better gifts, and which are personal projects you make for the joy of the craft. Not everything needs to be monetized — but when you do sell, price it properly."
      },
      {
        heading: "How to Calculate Materials Cost",
        content: "Materials cost includes every physical input: yarn, buttons, zippers, stuffing, stitch markers consumed, and any supplies used up during the project (like blocking wires that eventually wear out). For yarn, multiply the number of skeins used by the price per skein. Include partial skeins — if you use three-quarters of a skein, count three-quarters of its cost.\n\nDon't forget shipping costs for online yarn purchases, sales tax, and any duties if you imported yarn internationally. These are real costs that eat into your margin if you ignore them. Keep receipts or a spreadsheet tracking what you paid for each yarn in your stash.\n\nIf you buy yarn on sale specifically for selling finished items, use the sale price. If you're using stash yarn you bought years ago at full price, use the replacement cost — what it would cost to buy that yarn today. This ensures your pricing stays consistent regardless of when you acquired materials."
      },
      {
        heading: "How to Value Your Time",
        content: "Choose an hourly rate that reflects both your skill level and your local market. Some makers use minimum wage as a floor; others set rates between $15 and $30 per hour depending on the complexity of the work and their experience. Track your time honestly — include not just active stitching but also swatching, pattern reading, assembly, blocking, weaving in ends, and any time spent communicating with the customer.\n\nA common formula is: (Materials cost) + (Hours × Hourly rate) + (10–20% overhead for tools, electricity, workspace) = Wholesale price. Double the wholesale price to get the retail price. This doubling accounts for selling costs: marketplace fees, packaging, shipping materials, payment processing, and the time spent listing, photographing, and marketing.\n\nIf the retail price feels uncomfortably high, resist the urge to lower your hourly rate. Instead, consider whether the item is the right product for your market. Small accessories — hats, cowls, dishcloths — take fewer hours and price more accessibly than sweaters or blankets. Many successful sellers focus on items with a high perceived value relative to their production time."
      },
      {
        heading: "Pricing for Gifts vs Commissions vs Selling",
        content: "Gifts have no pricing pressure — you spend what you want and donate your time freely. But it's still useful to calculate the full cost so you understand the value of what you're giving. This prevents resentment when someone asks you to \"just whip up\" a queen-size blanket.\n\nCommissions — custom orders from a specific person — should be priced at full retail or higher. Custom work involves back-and-forth communication, pattern modifications, color consultations, and the pressure of meeting someone else's expectations. Charge a 20–30% premium over your standard retail price for custom work, and require a non-refundable deposit (typically 50%) before starting.\n\nSelling through marketplaces like Etsy or at craft fairs introduces platform fees, transaction fees, and competition. Etsy takes roughly 10–12% between listing fees, transaction fees, and payment processing. Craft fair booth fees might run $50–$200 per event. Build these costs into your prices rather than absorbing them from your profit."
      },
      {
        heading: "Common Pricing Mistakes",
        content: "The biggest mistake is undercharging out of guilt or imposter syndrome. Many makers feel uncomfortable charging \"so much\" for something they enjoy doing. But enjoyment doesn't eliminate cost — a chef who loves cooking still charges for meals.\n\nAnother common error is failing to account for unsold inventory. If you make ten hats and sell seven, the three unsold hats represent lost materials and labor. Your pricing on the seven that sold needs to cover the full cost of all ten. Build a small margin for unsold stock into your per-item price.\n\nIgnoring overhead is a third pitfall. Needles, hooks, blocking mats, pattern purchases, yarn winder, swift, storage bins, electricity for lighting — these costs are real and ongoing. A flat 10–15% overhead markup on top of materials and labor is a reasonable way to account for them without tracking every small expense individually."
      },
      {
        heading: "Tools That Help You Calculate Before You Start",
        content: "Running the numbers before you buy yarn or cast on prevents surprises. Start with the Project Cost Calculator on fibertools.app — input your materials, estimated hours, and hourly rate to see the total cost and a suggested retail price. This tells you immediately whether a project is financially viable for selling or better suited as a personal make.\n\nThe Yarn Calculator helps estimate how many skeins a project needs, so you can calculate materials cost accurately before purchasing. The Blanket Calculator gives yardage estimates for blankets of any size — useful since blankets are one of the most commonly underpriced handmade items due to their enormous yarn requirements. The Gauge Calculator ensures your swatch matches the pattern, preventing wasted materials from a project that doesn't turn out.\n\nPricing handmade work fairly is an act of respect — for the craft, for the hours of skill development behind your hands, and for the customers who value what mass production cannot replicate. Calculate honestly, price confidently, and let the work speak for itself."
      }
    ]
  },
  {
    slug: "amigurumi-beginners-guide",
    title: "Beginner's Guide to Amigurumi: Shapes, Sizes, and Math",
    description: "Learn the fundamentals of amigurumi crochet: magic rings, sphere construction, increase and decrease rounds, joining shapes, and common beginner mistakes to avoid.",
    toolSlug: "amigurumi-shapes",
    date: "2026-03-06",
    keywords: ["amigurumi for beginners", "amigurumi crochet", "magic ring crochet", "amigurumi shapes", "crochet sphere", "amigurumi increase decrease"],
    sections: [
      {
        heading: "What Amigurumi Is",
        content: "Amigurumi is the Japanese art of crocheting (or sometimes knitting) small stuffed figures — animals, food, characters, and abstract shapes. The word combines the Japanese verbs \"amu\" (to knit or crochet) and \"kurumu\" (to wrap or bundle). The craft gained international popularity through online pattern sharing in the early 2000s and has become one of the most widely practiced forms of crochet worldwide.\n\nAmigurumi pieces are worked in continuous spiral rounds, not joined rounds. This means there's no slip stitch and chain at the end of each round — you simply keep crocheting in a spiral. The result is a seamless fabric with no visible row lines. A stitch marker placed in the first stitch of each round helps you track where rounds begin and end.\n\nThe standard stitch for amigurumi is single crochet (US terms), worked tightly with a hook one or two sizes smaller than the yarn label recommends. The tight fabric prevents stuffing from showing through gaps between stitches. Most amigurumi patterns use worsted or DK weight yarn with a 3.0–3.5 mm hook, though any weight works as long as the fabric is dense enough."
      },
      {
        heading: "The Magic Ring Start",
        content: "Nearly every amigurumi piece begins with a magic ring (also called a magic circle or adjustable ring). This technique creates a tight, closed center with no hole — unlike a chain ring, which leaves a small gap at the center. For stuffed pieces, that gap matters: stuffing pokes through even small openings.\n\nTo make a magic ring, wrap yarn around your index finger twice, insert the hook under both wraps, pull up a loop, chain one, then work the required number of single crochet stitches into the ring. Most patterns start with 6 single crochet in the magic ring. Pull the tail end to close the ring tightly, then continue into the first increase round.\n\nSome crocheters struggle with the magic ring at first because it feels unstable — the ring can loosen or unravel before you get enough stitches into it. Practice with a smooth, light-colored worsted yarn and a larger hook until the motion becomes automatic. Once comfortable, switch back to the tighter gauge needed for amigurumi. The magic ring is a foundational skill that appears in every amigurumi pattern, so investing time in learning it pays off immediately."
      },
      {
        heading: "How Sphere Size Is Determined by Stitch Count and Gauge",
        content: "An amigurumi sphere is built by increasing from a starting circle, working several even rounds at the maximum diameter, then decreasing symmetrically back to a small closing hole. The number of stitches at maximum diameter — combined with your gauge — determines the sphere's size.\n\nThe standard formula starts with 6 stitches in a magic ring, then increases by 6 stitches per round (12, 18, 24, 30, 36...) until you reach the desired circumference. Each increase round adds one more single crochet between increases: Round 2 is \"inc in every stitch\" (12 stitches), Round 3 is \"sc 1, inc\" repeated (18 stitches), Round 4 is \"sc 2, inc\" repeated (24 stitches), and so on. Work even rounds (no increases or decreases) for a number of rounds equal to the number of increase rounds minus one or two, then decrease in reverse order.\n\nGauge changes the resulting size dramatically. Six rounds of increases at a tight gauge with DK yarn might produce a 2-inch sphere. The same six rounds at a looser gauge with bulky yarn could produce a 4-inch sphere. This is why amigurumi patterns list a finished size — your result depends on matching the designer's gauge, or at least accepting a proportionally larger or smaller piece."
      },
      {
        heading: "Understanding Increase and Decrease Rounds",
        content: "Increases shape the fabric outward by adding stitches. In amigurumi, an increase means working two single crochet stitches into one stitch of the previous round. Evenly spacing increases around the round creates smooth, gradual shaping. Clustering increases in the same spots every round creates visible lines (which can be a design choice for hexagonal shapes, but is usually avoided for spheres).\n\nTo prevent visible increase lines on spheres, some designers stagger the increase placement. Instead of always placing the increase at the end of the repeat (\"sc 3, inc\"), they alternate: one round as \"sc 3, inc\" and the next as \"sc 1, inc, sc 2.\" This distributes the increases randomly across the surface for a smoother result.\n\nDecreases work in reverse — combine two stitches into one using an invisible decrease (insert hook into front loops of two consecutive stitches, yarn over, pull through both front loops, yarn over, pull through both loops on hook). The invisible decrease is strongly preferred over the standard decrease because it leaves a nearly undetectable join on the right side of the fabric. Stuff the piece firmly before closing the decrease rounds — it's much harder to add stuffing through a tiny opening."
      },
      {
        heading: "Connecting Shapes Cleanly",
        content: "Most amigurumi figures are assembled from separate pieces: a head sphere, a body oval, cylindrical limbs, and ears or other features. The joining method affects both appearance and durability. The most common approach is sewing pieces together with a yarn needle and matching yarn, using a whip stitch or mattress stitch through the outer loops of the stitches.\n\nFor strong, invisible joins, pin pieces in position before sewing. Use the same yarn as the piece being attached, and sew through both layers of fabric along the edge. Pull firmly enough to create a snug connection without puckering the fabric. Weave the tail through the body interior to hide it, then trim.\n\nSome shapes can be crocheted directly onto the body instead of sewn on separately. Ears, muzzles, and small bumps are often worked this way — pick up stitches from the surface of the body and crochet outward. This creates a seamless connection that's stronger than sewing and looks cleaner. It requires more experience to execute well, but it's worth learning for frequently used shapes like round ears and small limb nubs."
      },
      {
        heading: "Common Beginner Mistakes",
        content: "Using a hook that's too large is the most frequent beginner error. If you can see stuffing through the fabric, your hook is too big or your tension is too loose. Drop down one or two hook sizes until the fabric is opaque. The resulting stiffness is correct for amigurumi — it's supposed to be firm.\n\nLosing count of rounds is another common problem. Without a stitch marker, spiral rounds blend into each other and it's easy to work extra or fewer stitches. Place a removable stitch marker in the first stitch of every round and move it up as you go. Some crocheters also use a row counter or tally marks on paper.\n\nUnderstuffing produces limp, shapeless figures. Amigurumi should feel firm and hold its shape when squeezed. Use polyester fiberfill and stuff in small amounts, pushing it into corners and narrow areas with a chopstick or the eraser end of a pencil. Overstuffing is less common but also problematic — it distorts the fabric and makes the stitches gap open.\n\nThe Amigurumi Shapes tool on fibertools.app calculates stitch counts for spheres, cones, cylinders, and ovals based on your desired dimensions. The Circle Calculator helps plan flat circular pieces like eyes or patches. The Stitch Counter assists with tracking rounds during complex projects. And the Gauge Calculator ensures your hook and yarn combination produces the right fabric density for your chosen pattern."
      }
    ]
  }
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