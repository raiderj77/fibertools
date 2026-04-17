import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Knitting Needles (2026): All Types Reviewed",
  description:
    "The best knitting needles for beginners and experienced knitters in 2026. Straight, circular, and DPN recommendations for every budget.",
  keywords: [
    "best knitting needles",
    "knitting needles for beginners",
    "circular knitting needles",
    "interchangeable knitting needles",
    "bamboo knitting needles",
    "chiaogoo needles",
  ],
  openGraph: {
    type: "article",
    title: "Best Knitting Needles (2026): All Types Reviewed",
    description:
      "The best knitting needles for beginners and experienced knitters in 2026. Straight, circular, and DPN recommendations for every budget.",
    url: "https://fibertools.app/best-knitting-needles",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Knitting Needles — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Knitting Needles (2026): All Types Reviewed",
    description:
      "The best knitting needles for beginners and experienced knitters in 2026. Straight, circular, and DPN recommendations for every budget.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/best-knitting-needles" },
};

export default function BestKnittingNeedlesPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Knitting Needles (2026): All Types Reviewed",
    description:
      "The best knitting needles for beginners and experienced knitters in 2026. Straight, circular, and DPN recommendations for every budget.",
    datePublished: "2026-03-11",
    dateModified: "2026-04-16",
    url: "https://fibertools.app/best-knitting-needles",
    mainEntityOfPage: "https://fibertools.app/best-knitting-needles",
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: "best knitting needles, knitting needles for beginners, circular knitting needles, interchangeable knitting needles",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Best Knitting Needles" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What size knitting needles should a beginner start with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "US 7–9 (4.5–5.5mm) with medium worsted weight yarn is the easiest combination. Larger needle size makes stitches easier to see and manipulate.",
        },
      },
      {
        "@type": "Question",
        name: "Are bamboo or metal needles better for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bamboo — slight grip slows stitches and prevents them sliding off accidentally. Metal is faster but requires more control.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between straight and circular needles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Straights work flat pieces back and forth. Circulars work flat or in the round and are better for large projects because the cable holds the weight.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need double-pointed needles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only for small circumference in the round — socks, gloves, hat crowns. Magic loop with long circulars is a popular alternative.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I replace knitting needles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Quality metal and carbon fiber needles last indefinitely. Bamboo can develop rough spots — sand lightly with fine-grit sandpaper.",
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
        <span className="text-bark-600 dark:text-cream-400">Best Knitting Needles</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="text-xs text-bark-400 dark:text-bark-500 bg-cream-100 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-lg px-4 py-2 mb-6">
        This page contains affiliate links. If you purchase through our links we may earn a small commission at no extra cost to you.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Best Knitting Needles (2026): All Types Reviewed
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        The best knitting needles depend on your project type and experience level. Beginners should start with US 7–9 (4.5–5.5mm) bamboo straights for grip and control. Experienced knitters benefit from circular needles — ChiaoGoo Red Lace are the top choice for their memory-free cables and precise steel tips.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: April 16, 2026</span>
        <span>&middot;</span>
        <span>Written by the FiberTools Team — fiber arts experts with 30+ years of combined experience</span>
      </div>

      <article className="prose-fiber">
        {/* Types of Knitting Needles Explained */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Types of Knitting Needles Explained
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Straight needles</strong> are the classic pair — two rigid sticks with a point at one end and a stopper at the other. They work flat pieces back and forth and are the easiest type for beginners to learn on. Best for scarves, dishcloths, and small flat projects.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Circular needles</strong> are two short needle tips connected by a flexible cable. They can work flat (back and forth) or in the round (joined in a circle). Most experienced knitters use circulars for everything because the cable holds the weight of the project, reducing wrist strain.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Double-pointed needles (DPNs)</strong> have points at both ends and come in sets of 4 or 5. They are used for small-circumference knitting in the round — sock cuffs, glove fingers, and hat crowns. Many knitters now use the magic loop technique on long circulars instead.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Interchangeable needle sets</strong> include multiple tip sizes that screw or click onto various cable lengths. They replace an entire collection of fixed circulars and are the most cost-effective option for knitters who work many projects. Check our{" "}
            <Link href="/needle-converter" className="text-sage-600 dark:text-sage-400 hover:underline">
              Needle Size Converter
            </Link>{" "}
            to match US, metric, and UK needle sizes.
          </p>
        </section>

        {/* Best Needles for Beginners */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Needles for Beginners
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Beginners should start with straight needles in US 7–9 (4.5–5.5mm). Bamboo is ideal because the slight grip prevents stitches from sliding off while you learn tension control.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Needle</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Material</th>
                  <th className="px-4 py-3 font-semibold">Size Range</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Clover Takumi Bamboo Straights</td>
                  <td className="px-4 py-3">Straight</td>
                  <td className="px-4 py-3">Bamboo</td>
                  <td className="px-4 py-3">US 0–15</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=clover+takumi+bamboo+knitting+needles&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Susan Bates Silvalume Straight</td>
                  <td className="px-4 py-3">Straight</td>
                  <td className="px-4 py-3">Aluminum</td>
                  <td className="px-4 py-3">US 0–15</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=susan+bates+silvalume+knitting+needles&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The Clover Takumi is the most recommended beginner needle — the bamboo surface provides just enough grip to keep stitches from sliding off while you build muscle memory. The Susan Bates Silvalume is a budget-friendly aluminum alternative that offers smooth, fast knitting once you have basic control.
          </p>
        </section>

        {/* Best Circular Knitting Needles */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Circular Knitting Needles
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Circular needles are the most versatile type — they handle flat and in-the-round knitting, distribute weight across the cable, and come in every size. The cable quality matters as much as the tips: a stiff, kinky cable fights you on every row.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Needle</th>
                  <th className="px-4 py-3 font-semibold">Cable</th>
                  <th className="px-4 py-3 font-semibold">Material</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">ChiaoGoo Red Lace</td>
                  <td className="px-4 py-3">TWIST red cable, memory-free</td>
                  <td className="px-4 py-3">Stainless steel</td>
                  <td className="px-4 py-3">Best overall — lace to bulky</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=chiaogoo+red+lace+circular+needles&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Addi Turbos</td>
                  <td className="px-4 py-3">Satin-finish cord</td>
                  <td className="px-4 py-3">Nickel-plated brass</td>
                  <td className="px-4 py-3">Speed knitting, smooth join</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=addi+turbo+circular+knitting+needles&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Knitter&apos;s Pride Dreamz</td>
                  <td className="px-4 py-3">Flexible nylon</td>
                  <td className="px-4 py-3">Laminated birch</td>
                  <td className="px-4 py-3">Budget-friendly, colorful</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=knitters+pride+dreamz+circular&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The ChiaoGoo Red Lace is the gold standard for circular needles. The stainless steel tips are precise and pointy enough for lace work, and the TWIST red cable has zero memory — it lies flat without any need to soak or heat it. Addi Turbos are a premium alternative favored by continental and speed knitters for their seamless tip-to-cable join.
          </p>
        </section>

        {/* Best Interchangeable Needle Sets */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Interchangeable Needle Sets
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Interchangeable sets are the best long-term investment for active knitters. Instead of buying individual circulars for every size and cable length, you get a set of tips and cables that mix and match. Most sets pay for themselves after 4–5 individual circular purchases.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Set</th>
                  <th className="px-4 py-3 font-semibold">Tips Material</th>
                  <th className="px-4 py-3 font-semibold">Sizes Included</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">ChiaoGoo TWIST Red Lace</td>
                  <td className="px-4 py-3">Stainless steel</td>
                  <td className="px-4 py-3">US 2–15 (complete set)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=chiaogoo+twist+interchangeable&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Knitter&apos;s Pride Karbonz</td>
                  <td className="px-4 py-3">Carbon fiber</td>
                  <td className="px-4 py-3">US 2–11</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=knitters+pride+karbonz+interchangeable&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Addi Click</td>
                  <td className="px-4 py-3">Nickel-plated brass</td>
                  <td className="px-4 py-3">US 4–11</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=addi+click+interchangeable+needles&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The ChiaoGoo TWIST Red Lace set is the top pick for its secure screw-in connection, memory-free cables, and wide size range. Knitter&apos;s Pride Karbonz offer a warm-to-the-touch carbon fiber alternative that is exceptionally lightweight — great for long knitting sessions. The Addi Click uses a click-lock mechanism that some knitters prefer over screw-in connections.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Need help matching needle sizes to your yarn? Our{" "}
            <Link href="/needle-guide" className="text-sage-600 dark:text-sage-400 hover:underline">
              Needle Guide
            </Link>{" "}
            covers size recommendations for every yarn weight.
          </p>
        </section>

        {/* Knitting Needle Material Comparison */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Knitting Needle Material Comparison
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The material of your needles affects how yarn moves across the surface, how the needles feel in your hands, and how long they last. Here is how the most common materials compare.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Material</th>
                  <th className="px-4 py-3 font-semibold">Feel</th>
                  <th className="px-4 py-3 font-semibold">Speed</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Price Range</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Bamboo</td>
                  <td className="px-4 py-3">Warm, grippy</td>
                  <td className="px-4 py-3">Slower</td>
                  <td className="px-4 py-3">Beginners</td>
                  <td className="px-4 py-3">$</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Aluminum</td>
                  <td className="px-4 py-3">Cool, smooth</td>
                  <td className="px-4 py-3">Fast</td>
                  <td className="px-4 py-3">All levels</td>
                  <td className="px-4 py-3">$$</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Carbon Fiber</td>
                  <td className="px-4 py-3">Warm, smooth</td>
                  <td className="px-4 py-3">Fast</td>
                  <td className="px-4 py-3">Experienced knitters</td>
                  <td className="px-4 py-3">$$$</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Nickel-plated Brass</td>
                  <td className="px-4 py-3">Cool, very smooth</td>
                  <td className="px-4 py-3">Very fast</td>
                  <td className="px-4 py-3">Speed knitters</td>
                  <td className="px-4 py-3">$$$</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Plastic / Acrylic</td>
                  <td className="px-4 py-3">Lightweight, warm</td>
                  <td className="px-4 py-3">Moderate</td>
                  <td className="px-4 py-3">Large needles (US 11+)</td>
                  <td className="px-4 py-3">$</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What to Look For */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-4">
            What to Look For When Buying Knitting Needles
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-sage-500 mt-1 flex-shrink-0 font-bold">1.</span>
              <span><strong>Needle type (straight, circular, or DPN).</strong> Beginners typically start with straight needles for flat knitting. Circular needles are more versatile — they work for both flat and in-the-round projects and are mandatory for large items like sweater bodies. Double-pointed needles (DPNs) are for small circumference knitting (socks, sleeves) and have a steeper learning curve.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-sage-500 mt-1 flex-shrink-0 font-bold">2.</span>
              <span><strong>Material (metal, bamboo, wood, or plastic).</strong> Metal needles are the fastest and most durable — slippery tips move yarn efficiently. Bamboo and wood needles grip yarn slightly, reducing dropped stitches for beginners. Plastic needles are lightweight and good for large sizes but can flex uncomfortably under heavy yarn.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-sage-500 mt-1 flex-shrink-0 font-bold">3.</span>
              <span><strong>Cable quality for interchangeable sets.</strong> If buying an interchangeable circular set, check the join between needle tip and cable. A rough or raised join snags yarn and creates a frustrating knitting experience. Premium brands (ChiaoGoo, Lykke, Addi) have smooth, near-seamless joins. Budget sets often have visible ridges at the join.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-sage-500 mt-1 flex-shrink-0 font-bold">4.</span>
              <span><strong>Size range relative to your projects.</strong> Most knitters use US 1–8 (2.25mm–5.0mm) for standard yarn weights. If you primarily knit bulky or worsted weight, make sure the set includes US 9–15. Lace knitters need US 000–2 (1.5mm–2.75mm) — verify these sizes are included before purchasing a set.</span>
            </li>
          </ul>
        </section>

        {/* Common Buying Mistakes */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-4">
            Common Buying Mistakes
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Buying straight needles as your only type.</strong> Straight needles cannot knit in the round, so sweater bodies, hat crowns, and socks all require circulars or DPNs. Most knitters quickly outgrow straight needles as their project variety expands. Start with a short circular (16&quot;) for hats and a 32&quot; circular for everything else.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Buying a large interchangeable set before knowing your preferred tip style.</strong> Interchangeable sets are expensive investments. Before buying a full set, try a single fixed circular in the brand&apos;s tip style. Some knitters find pointed tips (ChiaoGoo) better for lace; others prefer blunter tips (Addi) for general knitting. The wrong tip style makes every project frustrating.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Ignoring cable memory in interchangeable sets.</strong> Stiff, kinky cables (common in budget interchangeable sets) fight against your hands as you knit and make magic loop technique nearly impossible. Nylon-coated steel cables (ChiaoGoo Red Lace) are memory-free from the moment you unpack them. This single feature alone justifies the price premium over budget cables.</span>
            </li>
          </ul>
        </section>
      </article>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          Frequently Asked Questions About Knitting Needles
        </h2>
        <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6 divide-y divide-cream-200 dark:divide-bark-700">
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What size knitting needles should a beginner start with?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">US 7–9 (4.5–5.5mm) with medium worsted weight yarn is the easiest combination. Larger needle size makes stitches easier to see and manipulate.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Are bamboo or metal needles better for beginners?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Bamboo — slight grip slows stitches and prevents them sliding off accidentally. Metal is faster but requires more control.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What is the difference between straight and circular needles?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Straights work flat pieces back and forth. Circulars work flat or in the round and are better for large projects because the cable holds the weight.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Do I need double-pointed needles?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Only for small circumference in the round — socks, gloves, hat crowns. Magic loop with long circulars is a popular alternative.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How often should I replace knitting needles?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Quality metal and carbon fiber needles last indefinitely. Bamboo can develop rough spots — sand lightly with fine-grit sandpaper.</p></div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Find the right needle size for your yarn
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Needle Size Converter — no login required, works offline.
        </p>
        <Link href="/needle-converter" className="btn-primary">
          Open Needle Size Converter
        </Link>
      </div>
    </main>
  );
}
