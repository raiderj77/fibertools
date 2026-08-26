import type { Metadata } from "next";
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/affiliate";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

export const metadata: Metadata = {
  title: "Best Yarn for Blankets (2026): Cozy & Durable",
  description:
    "Practical yarn options for knitting and crochet blankets in 2026, including soft, washable, and budget-minded choices for throw, baby, and chunky blankets.",
  keywords: [
    "best yarn for blankets",
    "blanket yarn",
    "crochet blanket yarn",
    "knitting blanket yarn",
    "bernat blanket yarn",
    "chunky blanket yarn",
    "baby blanket yarn",
  ],
  openGraph: {
    type: "article",
    title: "Best Yarn for Blankets (2026): Cozy & Durable",
    description:
      "Practical yarn options for knitting and crochet blankets in 2026, including soft, washable, and budget-minded choices for throw, baby, and chunky blankets.",
    url: "https://fibertools.app/best-yarn-for-blankets",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Yarn for Blankets, FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Yarn for Blankets (2026): Cozy & Durable",
    description:
      "Practical yarn options for knitting and crochet blankets in 2026, including soft, washable, and budget-minded choices for throw, baby, and chunky blankets.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/best-yarn-for-blankets" },
};

export default function BestYarnForBlanketsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Yarn for Blankets (2026): Cozy & Durable",
    description:
      "Practical yarn options for knitting and crochet blankets in 2026, including soft, washable, and budget-minded choices for throw, baby, and chunky blankets.",
    datePublished: "2026-03-11",
    dateModified: REVIEW_DATES.bestYarnForBlankets.iso,
    url: "https://fibertools.app/best-yarn-for-blankets",
    mainEntityOfPage: "https://fibertools.app/best-yarn-for-blankets",
    author: { "@type": "Person", name: "Jason Ramirez", jobTitle: "Founder of FiberTools", url: "https://fibertools.app/about" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: "best yarn for blankets, blanket yarn, crochet blanket yarn, knitting blanket yarn",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Best Yarn for Blankets" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many skeins do I need for a throw blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Skein count cannot be determined from blanket type alone because package yardage, dimensions, stitch pattern, gauge, and swatch consumption all matter. Use the Blanket Calculator for a planning estimate based on your measurements and swatch information.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best yarn for a beginner blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consider Bernat Blanket or Lion Brand Pound of Love when their current care instructions, price, and color availability fit the project. Bernat Blanket is a Super Bulky option, while Pound of Love lists 1,020 yards in a worsted-weight skein.",
        },
      },
      {
        "@type": "Question",
        name: "Is acrylic yarn good for blankets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many acrylic yarns are sold in broad color ranges and may offer easy-care instructions and lower prices. Check the specific yarn label for washability, durability, and intended use, especially for baby items.",
        },
      },
      {
        "@type": "Question",
        name: "What weight yarn is best for a chunky blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Super Bulky (CYC 6) and Jumbo (CYC 7) are categories to compare when a pattern calls for a thick fabric. Completion time, drape, weight, yardage, and tool size depend on the pattern, yarn label, gauge, and maker.",
        },
      },
      {
        "@type": "Question",
        name: "How do I avoid running out of yarn mid-blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When color consistency matters, buy the planned quantity from one dye lot and consider a buffer skein if the seller's return policy and your budget allow. Use the Blanket Calculator for a planning estimate before you start.",
        },
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        <span className="text-bark-600 dark:text-cream-400">Best Yarn for Blankets</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="mb-6 rounded-lg border border-cream-300 bg-cream-100 px-4 py-3 text-sm leading-relaxed text-bark-600 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300">
        <strong>Paid links:</strong> FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Best Yarn for Blankets (2026)
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        A practical blanket yarn balances softness, care requirements, weight, and yardage per skein. Bernat Blanket is a Super Bulky option for a faster workup, while Lion Brand Pound of Love is a worsted-weight option with 1,020 yards listed per skein. Compare current price, color availability, care instructions, and your swatch before choosing.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: {REVIEW_DATES.bestYarnForBlankets.label}</span>
        <span>&middot;</span>
        <span>Written by Jason Ramirez, founder of FiberTools</span>
      </div>

      <article className="prose-fiber">
        {/* What to Look for in Blanket Yarn */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What to Look for in Blanket Yarn
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Start with the recipient&apos;s intended use and laundering needs. If machine care matters, choose a yarn whose current manufacturer label explicitly supports the wash and dry method you expect to use; hand-wash yarn may still suit a decorative or carefully maintained blanket.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Feel</strong> is personal and can change after washing. Make and launder a representative swatch before committing to the full quantity, especially when the blanket will contact sensitive skin.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Yardage per skein</strong> affects the number of joins, but a larger skein is not automatically cheaper or less wasteful. Compare current price per yard, package size, required quantity, return policy, and the number of ends you are willing to weave in.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Surface wear</strong> varies with fiber, twist, stitch, use, and laundering; treat an anti-pilling label as a manufacturer claim, not a guarantee. When color consistency matters, compare dye-lot information and plan the required quantity before buying because batches can vary.
          </p>
        </section>

        {/* Best Worsted Weight Blanket Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Worsted Weight Blanket Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Worsted weight (CYC 4) is one option used by many blanket patterns. The resulting drape, warmth, and stitch definition depend on the exact yarn, stitch, gauge, and laundering. Check our{" "}
            <Link href="/yarn-weight-chart" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Weight Chart
            </Link>{" "}
            for recommended needle and hook sizes.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yarn Name</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Fiber</th>
                  <th className="px-4 py-3 font-semibold">Yardage/Skein</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Bernat Blanket</td>
                  <td className="px-4 py-3">Super Bulky (6)</td>
                  <td className="px-4 py-3">100% polyester</td>
                  <td className="px-4 py-3">220 yds (10.5 oz)</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("bernat blanket yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Lion Brand Pound of Love</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">1,020 yds (16 oz)</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("Lion Brand Pound of Love yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Caron One Pound</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">812 yds (16 oz)</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("caron one pound yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Best Chunky Blanket Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Chunky Blanket Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Chunky and super bulky yarns make larger stitches, but they do not guarantee a completion time. Compare the pattern&apos;s gauge and yardage with current price, package weight, finished-fabric weight, and the yarn&apos;s care label.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yarn Name</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Fiber</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Bernat Blanket Extra</td>
                  <td className="px-4 py-3">Super Bulky (6)</td>
                  <td className="px-4 py-3">100% polyester</td>
                  <td className="px-4 py-3">Super Bulky (6); verify current label gauge and care</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("bernat blanket extra yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Lion Brand Thick & Quick</td>
                  <td className="px-4 py-3">Bulky (5)</td>
                  <td className="px-4 py-3">80% acrylic / 20% wool</td>
                  <td className="px-4 py-3">Bulky (5) wool blend; verify sensitivities and care</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("lion brand thick quick")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Premier Yarns Anti-Pilling Everyday Chunky</td>
                  <td className="px-4 py-3">Bulky (5)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Marketed as anti-pilling; verify current label and care</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("premier yarns everyday chunky")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Best Baby Blanket Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Baby Blanket Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For a baby blanket, confirm the caregiver&apos;s laundering preference and check the exact manufacturer label for fiber content, care, shedding, sensitivities, and intended use. A retailer category or product name is not a safety certification; construction and finishing also require project-specific judgment.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yarn Name</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Fiber</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Lion Brand Baby Soft</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">60% acrylic / 40% nylon</td>
                  <td className="px-4 py-3">Light (3) blend; verify current label, feel, and care</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("lion brand baby soft yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Paintbox Simply DK</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Light (3) acrylic; compare current colors, price, and care</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("paintbox simply dk yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How Much Yarn Do You Need for a Blanket? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            How Much Yarn Do You Need for a Blanket?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Yarn requirements vary with dimensions, stitch pattern, gauge, swatch consumption, and package yardage. Blanket type alone is not enough to produce a reliable skein count; verify a calculator estimate against the pattern, label, and a representative swatch.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For a planning estimate based on your dimensions and swatch information, use our free{" "}
            <Link href="/blanket-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Blanket Calculator
            </Link>
            . You can also use the{" "}
            <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Calculator
            </Link>{" "}
            for planning estimates across its supported project types.
          </p>
        </section>

        {/* Common Buying Mistakes */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-4">
            Common Buying Mistakes
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Not checking dye-lot information.</strong> When color consistency matters, compare the label&apos;s dye-lot identifier and plan the required quantity before buying. Batch variation can occur, while some yarns are sold without dye-lot matching.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Skipping a swatch-based estimate.</strong> Use the pattern, label yardage, dimensions, gauge, and measured swatch consumption together. If you add a buffer, base it on the seller&apos;s return policy, your budget, and dye-lot availability rather than a universal skein rule.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Ignoring the care label.</strong> Match wash and dry instructions to the recipient&apos;s expected use and willingness to maintain the blanket. Do not infer machine washability from fiber type alone.</span>
            </li>
          </ul>
        </section>
      </article>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6 divide-y divide-cream-200 dark:divide-bark-700">
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How many skeins do I need for a throw blanket?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Skein count cannot be determined from blanket type alone because package yardage, dimensions, stitch pattern, gauge, and swatch consumption all matter. Use the Blanket Calculator for a planning estimate based on your measurements and swatch information.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What is the best yarn for a beginner blanket?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Consider Bernat Blanket or Lion Brand Pound of Love when their current care instructions, price, and color availability fit the project. Bernat Blanket is a Super Bulky option, while Pound of Love lists 1,020 yards in a worsted-weight skein.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Is acrylic yarn good for blankets?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Many acrylic yarns are sold in broad color ranges and may offer easy-care instructions and lower prices. Check the specific yarn label for washability, durability, and intended use, especially for baby items.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What weight yarn is best for a chunky blanket?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Super Bulky (CYC 6) and Jumbo (CYC 7) are categories to compare when a pattern calls for a thick fabric. Completion time, drape, weight, yardage, and tool size depend on the pattern, yarn label, gauge, and maker.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How do I avoid running out of yarn mid-blanket?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">When color consistency matters, buy the planned quantity from one dye lot and consider a buffer skein if the seller&apos;s return policy and your budget allow. Use the Blanket Calculator for a planning estimate before you start.</p></div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Estimate how much yarn your blanket may need
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Blanket Calculator, no login required, works offline.
        </p>
        <Link href="/blanket-calculator" className="btn-primary">
          Open Blanket Calculator
        </Link>
      </div>
    </div>
  );
}
