import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Count Stitches and Rows in Knitting & Crochet | FiberTools",
  description:
    "Learn how to count stitches and rows accurately in knitting and crochet. Covers stitch markers, row counters, colorwork tracking, and the most common counting mistakes.",
  keywords: [
    "how to count stitches",
    "how to count rows in crochet",
    "how to count rows in knitting",
    "stitch counter",
    "row counter",
    "stitch markers",
    "colorwork tracking",
    "counting stitches crochet",
    "counting rows knitting",
  ],
  openGraph: {
    type: "article",
    title: "How to Count Stitches and Rows in Knitting & Crochet",
    description:
      "Learn how to count stitches and rows accurately in knitting and crochet. Covers stitch markers, row counters, colorwork tracking, and the most common counting mistakes.",
    url: "https://fibertools.app/blog/stitch-counter-guide",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "How to Count Stitches and Rows — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Count Stitches and Rows in Knitting & Crochet",
    description:
      "Learn how to count stitches and rows accurately in knitting and crochet. Covers stitch markers, row counters, colorwork tracking, and the most common counting mistakes.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blog/stitch-counter-guide" },
};

export default function StitchCounterGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Count Stitches and Rows in Knitting & Crochet",
    description:
      "Learn how to count stitches and rows accurately in knitting and crochet. Covers stitch markers, row counters, colorwork tracking, and the most common counting mistakes.",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    url: "https://fibertools.app/blog/stitch-counter-guide",
    mainEntityOfPage: "https://fibertools.app/blog/stitch-counter-guide",
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords:
      "how to count stitches, how to count rows in crochet, stitch counter, row counter, stitch markers",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://fibertools.app/blog" },
      { "@type": "ListItem", position: 3, name: "How to Count Stitches and Rows" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I count stitches in crochet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Count the V-shapes (or loops) across the top of your work. Each V is one stitch. For single crochet, count from right to left on the front of your work. Do not count the loop on the hook — that is your working loop, not a completed stitch.",
        },
      },
      {
        "@type": "Question",
        name: "How do I count rows in knitting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Turn your work to the side and count the horizontal ridges (garter stitch) or V-shaped columns (stockinette). Each ridge in garter equals two rows. In stockinette, each row of V's on the right side is one row.",
        },
      },
      {
        "@type": "Question",
        name: "What is a stitch marker and when should I use one?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A stitch marker is a small ring, clip, or loop you place on your needle or hook to mark important positions — the beginning of a round, increase/decrease points, or pattern repeats. Use them any time you need to track a specific stitch location without counting from the start every row.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best row counter for knitting and crochet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Digital clicker counters worn on a finger or the wrist are the most reliable — press once per row and never lose count. Kacha-Kacha ring counters are the classic choice. For hands-free counting, voice-activated apps like MyCrochetKit let you say 'next' to advance the count without putting down your hook.",
        },
      },
      {
        "@type": "Question",
        name: "How do I track multiple colors in colorwork?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a separate tally or sticky note column for each color. Update each count when you switch colors in a row. For Fair Isle or tapestry crochet, a printed chart with a magnetic line guide keeps your place in complex repeating patterns.",
        },
      },
      {
        "@type": "Question",
        name: "Why do I keep losing count of my stitches?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common causes: counting while distracted, miscounting turning chains (which may or may not count as a stitch depending on pattern), accidentally adding stitches at row ends, and skipping the stitch directly at the base of a turning chain. Place a stitch marker every 10 stitches as a checkpoint to reduce error.",
        },
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-bark-400 dark:text-bark-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Blog</Link>
        <span aria-hidden="true">/</span>
        <span className="text-bark-600 dark:text-cream-400">Stitch Counter Guide</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        How to Count Stitches and Rows in Knitting &amp; Crochet
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-4 p-4 bg-cream-50 dark:bg-bark-800 border-l-4 border-sage-400 rounded-r-xl">
        To count stitches in crochet, count the V-shapes along the top of your work — each V is one stitch. To count rows, use a physical clicker counter, a stitch marker at the start of each round, or a voice-activated row counter. The most common counting mistake is miscounting the turning chain.
      </p>

      {/* Author byline */}
      <div className="flex items-center gap-3 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>By <strong className="text-bark-600 dark:text-cream-400">The FiberTools Editorial Team</strong></span>
        <span>&middot;</span>
        <span>Fiber arts experts with 30+ years of experience</span>
        <span>&middot;</span>
        <span>Last reviewed: April 2026</span>
        <span>&middot;</span>
        <Link href="/about" className="text-sage-600 dark:text-sage-400 hover:underline">About us</Link>
      </div>

      {/* IN THIS GUIDE */}
      <nav className="bg-cream-50 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-2xl p-5 mb-8" aria-label="In this guide">
        <p className="text-xs font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 mb-3">In this guide</p>
        <ol className="space-y-1 list-decimal list-inside">
          {[
            ['#crochet-stitches', 'How to Count Stitches in Crochet'],
            ['#knitting-rows', 'How to Count Rows in Knitting'],
            ['#stitch-markers', 'Stitch Markers: Types and When to Use Them'],
            ['#row-counters', 'Row Counters: Which Type is Best?'],
            ['#colorwork', 'Tracking Colorwork: Stripes, Fair Isle, and Tapestry'],
            ['#mistakes', 'Common Counting Mistakes (and How to Fix Them)'],
            ['#pro-tips', 'Pro Tips for Accurate Counting'],
          ].map(([href, label]) => (
            <li key={href as string}>
              <a href={href as string} className="text-sm text-sage-600 dark:text-sage-400 hover:underline">{label as string}</a>
            </li>
          ))}
        </ol>
      </nav>

      <article>
        {/* How to Count Stitches in Crochet */}
        <section className="mb-10">
          <h2 id="crochet-stitches" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            How to Count Stitches in Crochet
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Every crochet stitch leaves a distinctive V-shape at the top of the fabric. This V is formed by the two legs of the stitch — the front loop and the back loop. When you look across the top of your work, you are looking at a row of V&apos;s. Count each V from right to left (or left to right — just be consistent), and that is your stitch count.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The loop currently on your hook is your <strong>working loop</strong> — do not count it. It is not a completed stitch. If you count it, your stitch count will always be one more than it should be.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For <strong>taller stitches</strong> (half double crochet, double crochet, treble), the principle is the same. Look for the V at the top of the stitch. Taller stitches have more post (vertical height), but the top two loops still form a clear V that is easy to count. If you find counting difficult, use a contrasting yarn scrap or a locking stitch marker to mark every 10th stitch — then you only need to count in groups of ten.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            When working in the <strong>round</strong> (amigurumi, hats, baskets), place a stitch marker in the first stitch of each round. When you complete a round, count every V to confirm you have the correct number before removing and replacing the marker. For amigurumi worked in a magic ring, this is essential — one missed increase or decrease can throw off the entire shape.
          </p>
        </section>

        {/* How to Count Rows in Knitting */}
        <section className="mb-10">
          <h2 id="knitting-rows" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            How to Count Rows in Knitting
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            In <strong>stockinette stitch</strong>, the right side of your work shows neat V-shaped columns. Each horizontal row of V&apos;s is one row. Count them from the cast-on edge up to the needle. Do not count the live stitches currently on the needle — those are the current row, not a completed row.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            In <strong>garter stitch</strong>, both sides look the same — ridged horizontal bumps. Each visible ridge equals <em>two rows</em> (one knit row creates the right-side smooth fabric; the next creates the bump). If you count garter ridges, multiply by two for the row count.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For projects with multiple stitch patterns (cables, lace, seed stitch borders), use a row counter from the start. Trying to back-count rows through complex stitch patterns is unreliable. A physical clicker counter or a digital row tracking app prevents the frustration of losing your place mid-pattern repeat.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            When knitting <strong>in the round</strong>, a round marker at the beginning of each round is non-negotiable. Rounds look identical in stockinette from every angle, and without a marker you cannot reliably tell where one round ends and the next begins. Use a unique marker (different color or style) to distinguish the BOR (beginning of round) marker from any stitch markers in the middle of your work.
          </p>
        </section>

        {/* Stitch Markers: Types and When to Use Them */}
        <section className="mb-10">
          <h2 id="stitch-markers" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Stitch Markers: Types and When to Use Them
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Stitch markers are small tools that save enormous amounts of time and frustration. The main types are:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Closed ring markers</td>
                  <td className="px-4 py-3">Knitting in the round</td>
                  <td className="px-4 py-3">Slip from needle to needle; cannot be placed mid-row</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Locking / split ring markers</td>
                  <td className="px-4 py-3">Crochet, marking individual stitches</td>
                  <td className="px-4 py-3">Open and close to attach to any stitch or loop</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Coil-less safety pins</td>
                  <td className="px-4 py-3">Budget option for both crafts</td>
                  <td className="px-4 py-3">Widely available; slightly harder to open quickly</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Yarn scraps (DIY)</td>
                  <td className="px-4 py-3">Emergency markers, colorwork</td>
                  <td className="px-4 py-3">Free; tie a contrasting color through any stitch</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Use stitch markers liberally. There is no rule against using too many. Mark the beginning of each round, pattern repeat boundaries, increase and decrease points, and the center stitch on a top-down raglan sweater. Every marker you place is a checkpoint that catches counting errors before they compound.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            In amigurumi specifically, place a locking marker in the first stitch of every round. Move it up each round. The moment your marker does not return to where you expect, you have caught a missed or extra stitch — and can fix it immediately instead of discovering the error 20 rounds later.
          </p>
        </section>

        {/* Row Counters: Which Type is Best? */}
        <section className="mb-10">
          <h2 id="row-counters" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Row Counters: Which Type is Best?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            A row counter does one job: records the current row number so you never have to count from the beginning. There are four main types, each with different trade-offs.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Analog barrel counters</strong> are the classic tool — a small cylinder that slides onto a knitting needle or sits next to your work. You turn a dial ring to advance the count after each row. They are durable, require no batteries, and hold counts up to 99 or 999. The downside is you have to put your work down briefly to turn the dial.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Kacha-Kacha clicker counters</strong> are worn on a finger and clicked with the thumb. One click per row, completely hands-free once you build the habit. Extremely reliable and quiet. The most popular choice for active crafters who do not want to interrupt their rhythm.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Phone apps</strong> offer the most features — multiple counters for tracking different sections, notes fields, project management, and automatic backups. The trade-off is that your phone must be within reach and unlocked, which some crafters find disruptive.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Voice-activated counters</strong> are the newest category. Apps like{" "}
            <a href="https://mycrochetkit.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">MyCrochetKit</a>
            {" "}let you say &quot;next&quot; to advance the row counter without putting down your hook or picking up your phone. This is especially useful for crochet, where both hands are occupied and breaking rhythm breaks tension.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Use the{" "}
            <Link href="/stitch-counter" className="text-sage-600 dark:text-sage-400 hover:underline">
              FiberTools Stitch Counter
            </Link>
            {" "}for a free in-browser option that tracks multiple counters simultaneously — useful when working a pattern with separate row counts for different sections.
          </p>
        </section>

        {/* Tracking Colorwork */}
        <section className="mb-10">
          <h2 id="colorwork" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Tracking Colorwork: Stripes, Fair Isle, and Tapestry Crochet
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Colorwork adds a second layer of tracking on top of stitch and row counts — now you also need to know which color comes next and how many rows of each you have completed.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For <strong>simple stripes</strong>, write the color sequence on an index card and check it off as you complete each stripe. A physical checklist is faster to update than a phone screen and never loses its place when a call interrupts your session.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For <strong>Fair Isle and stranded colorwork</strong> in knitting, use a printed chart. Place a magnetic line guide (a strip of magnetic material that slides down the chart) so the row you are currently working is always at eye level. You can also use sticky notes or a ruler held in place by your yarn cone. Mark each completed row with a highlighter directly on the chart.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For <strong>tapestry crochet</strong> and mosaic crochet, the color-change sequences often repeat over many rows. Mark the beginning of each color-change section with a locking stitch marker. Use two different counter tracks — one for the overall row count and one for your position within the current pattern repeat. The FiberTools Stitch Counter supports multiple simultaneous counters for exactly this use case.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            When working a long colorwork project across multiple sessions, photograph your work before putting it down. A quick photo shows your current row, the color in your hand, and any markers in place. The photo takes seconds and can save significant time re-orienting when you pick the work back up.
          </p>
        </section>

        {/* Common Counting Mistakes */}
        <section className="mb-10">
          <h2 id="mistakes" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Common Counting Mistakes (and How to Fix Them)
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Every crafter loses count at some point. The mistakes below account for the majority of stitch count errors, and most have a simple fix.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Miscounting the turning chain.</strong> In crochet, whether the turning chain counts as a stitch depends on the stitch type and the pattern. Double crochet patterns often count the turning chain-3 as the first stitch; single crochet patterns typically do not count the turning chain-1. Read your pattern carefully at the start. When in doubt, count the stitches in the first row to confirm.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Adding extra stitches at row ends.</strong> This happens when you accidentally work into the turning chain of the previous row. In double crochet especially, the turning chain-3 looks like a stitch and is easy to crochet into by mistake. Count your stitches at the end of the first few rows until the correct edge stitch becomes familiar.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Missing the first stitch in crochet.</strong> After a turning chain, the first stitch of the new row is worked into the same stitch as the last stitch of the previous row — not into the turning chain, and not skipping one stitch. Beginners frequently skip this stitch, losing one stitch per row and creating a trapezoid shape. Use a locking marker in the first and last stitch of each row when you are learning.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Counting while distracted.</strong> The single most common cause of miscounting is trying to count stitches while watching TV, listening to a podcast, or talking. If your stitch count matters, count in silence or mouth the numbers. Count multiple times if necessary. Check your count at the end of every row, not every ten rows — catching an error sooner means less frogging (ripping back).
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Forgetting to update the row counter.</strong> The best row counter is useless if you do not press it. Build the habit of clicking or tapping the moment you finish a row, not after you have started the next one. The moment between completing one row and turning the work is the easiest cue.
          </p>
        </section>

        {/* Pro Tips */}
        <section className="mb-10">
          <h2 id="pro-tips" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Pro Tips for Accurate Counting
          </h2>
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-plum-600 mb-4">
              From 30+ years of fiber arts experience
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                Place a stitch marker every 10 stitches on your cast-on row. Then you only need to count in groups of ten, which dramatically reduces errors in large projects.
              </li>
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                Use a different-colored marker for the beginning of round. If all your markers look the same, you will eventually lose track of which is the BOR marker.
              </li>
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                Count stitches from the back (the bump side) in single crochet — the back loops are easier to distinguish individually than the front V-shapes, especially in dark yarn.
              </li>
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                For dark or textured yarn, hold the fabric up toward a bright light source when counting. Stitches that are invisible in ambient lighting become clear when backlit.
              </li>
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                Never count while distracted. If you need to look up or answer a question mid-count, mark your position with a finger or a locking marker and restart from that known checkpoint.
              </li>
              <li className="flex items-start gap-3 text-bark-600 text-[15px] leading-relaxed">
                <span className="text-amber-500 mt-1 flex-shrink-0">&#10003;</span>
                Check your gauge swatch for accurate row height — knowing that your gauge is 20 rows = 4 inches lets you measure your work height as a double-check against your row counter.
              </li>
            </ul>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Related Tools
          </h2>
          <ul className="space-y-3">
            <li>
              <Link href="/stitch-counter" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">
                Stitch Counter
              </Link>
              {" — "}
              <span className="text-bark-500 text-sm">Free online counter that tracks multiple counters at once — great for colorwork and multi-section patterns.</span>
            </li>
            <li>
              <Link href="/gauge-calculator" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">
                Gauge Calculator
              </Link>
              {" — "}
              <span className="text-bark-500 text-sm">Convert your stitch and row counts to actual measurements, or figure out how many rows you need to reach a target length.</span>
            </li>
            <li>
              <Link href="/row-repeat-calculator" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">
                Row Repeat Calculator
              </Link>
              {" — "}
              <span className="text-bark-500 text-sm">Calculate how many pattern repeats fit your stitch count, and what adjustments to make.</span>
            </li>
            <li>
              <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 hover:underline font-medium">
                Yarn Calculator
              </Link>
              {" — "}
              <span className="text-bark-500 text-sm">Estimate how much yarn you need based on your gauge and project dimensions.</span>
            </li>
          </ul>
        </section>
      </article>

      {/* KEY TAKEAWAYS */}
      <div className="bg-cream-100 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-2xl p-6 mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-plum-400 mb-4">Key Takeaways</p>
        <ul className="space-y-2">
          {[
            'Count the V-shapes at the top of crochet stitches — each V is one stitch; do not count the working loop on the hook.',
            'In stockinette knitting, count horizontal rows of V\'s on the right side; in garter, each visible ridge equals two rows.',
            'Locking (split-ring) stitch markers are the most versatile — they attach to individual stitches and work for both knitting and crochet.',
            'Kacha-Kacha clicker counters are the most reliable row counters — worn on a finger, clicked once per row, no batteries needed.',
            'The most common counting mistake is miscounting the turning chain — check whether your pattern counts it as a stitch.',
            'Never count while distracted — mouth the numbers or count in silence; check your count at the end of every row.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-bark-600 dark:text-cream-300">
              <span className="text-sage-500 font-bold flex-shrink-0 mt-0.5">&#10003;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6 divide-y divide-cream-200 dark:divide-bark-700">
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How do I count stitches in crochet?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Count the V-shapes (or loops) across the top of your work. Each V is one stitch. For single crochet, count from right to left on the front of your work. Do not count the loop on the hook — that is your working loop, not a completed stitch.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How do I count rows in knitting?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Turn your work to the side and count the horizontal ridges (garter stitch) or V-shaped columns (stockinette). Each ridge in garter equals two rows. In stockinette, each row of V&apos;s on the right side is one row.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What is a stitch marker and when should I use one?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">A stitch marker is a small ring, clip, or loop you place on your needle or hook to mark important positions — the beginning of a round, increase/decrease points, or pattern repeats. Use them any time you need to track a specific stitch location without counting from the start every row.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What is the best row counter for knitting and crochet?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Digital clicker counters worn on a finger or the wrist are the most reliable — press once per row and never lose count. Kacha-Kacha ring counters are the classic choice. For hands-free counting, voice-activated apps like MyCrochetKit let you say &quot;next&quot; to advance the count without putting down your hook.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How do I track multiple colors in colorwork?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Use a separate tally or sticky note column for each color. Update each count when you switch colors in a row. For Fair Isle or tapestry crochet, a printed chart with a magnetic line guide keeps your place in complex repeating patterns.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Why do I keep losing count of my stitches?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Common causes: counting while distracted, miscounting turning chains (which may or may not count as a stitch depending on pattern), accidentally adding stitches at row ends, and skipping the stitch directly at the base of a turning chain. Place a stitch marker every 10 stitches as a checkpoint to reduce error.</p></div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Track your stitches and rows hands-free
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Stitch Counter — works in the browser, supports multiple counters.
        </p>
        <Link href="/stitch-counter" className="btn-primary">
          Open Stitch Counter &rarr;
        </Link>
      </div>
    </main>
  );
}
