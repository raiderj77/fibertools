import type { Metadata } from "next";
import Link from "next/link";
import { amazonProductUrl, amazonSearchUrl } from "@/lib/affiliate";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

export const metadata: Metadata = {
  title: { absolute: "Yarn for Beginners: A Selection Guide" },
  description:
    "Choose beginner yarn using source-checked weight and fiber details, stitch visibility, pattern requirements, and a hypothetical whole-skein example.",
  keywords: [
    "best yarn for beginners",
    "beginner knitting yarn",
    "beginner crochet yarn",
    "best yarn to learn knitting",
    "best yarn to learn crochet",
    "worsted weight yarn for beginners",
    "easy yarn for beginners",
  ],
  openGraph: {
    type: "article",
    title: "Yarn for Beginners: A Selection Guide",
    description:
      "Choose beginner yarn using source-checked weight and fiber details, stitch visibility, pattern requirements, and a hypothetical whole-skein example.",
    url: "https://fibertools.app/best-yarn-for-beginners",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Yarn for Beginners, FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn for Beginners: A Selection Guide",
    description:
      "Choose beginner yarn using source-checked weight and fiber details, stitch visibility, pattern requirements, and a hypothetical whole-skein example.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/best-yarn-for-beginners" },
};

export default function BestYarnForBeginnersPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Yarn for Beginners: A Selection Guide",
    description:
      "Choose beginner yarn using source-checked weight and fiber details, stitch visibility, pattern requirements, and a hypothetical whole-skein example.",
    datePublished: "2026-03-11",
    dateModified: REVIEW_DATES.bestYarnForBeginners.iso,
    url: "https://fibertools.app/best-yarn-for-beginners",
    mainEntityOfPage: "https://fibertools.app/best-yarn-for-beginners",
    author: { "@type": "Person", name: "Jason Ramirez", jobTitle: "Founder of FiberTools", url: "https://fibertools.app/about" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: "best yarn for beginners, beginner knitting yarn, beginner crochet yarn",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Best Yarn for Beginners" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best yarn weight for a beginner?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Medium weight (worsted, CYC 4) can be a practical starting point because its stitches are generally easier to see than very fine yarn. Follow the yarn weight specified by the pattern you choose.",
        },
      },
      {
        "@type": "Question",
        name: "Is acrylic yarn good for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A smooth acrylic can be suitable for learning when its feel and care instructions fit the project. Price, texture, splitting, and washability vary, so check the specific yarn rather than treating one fiber as universally best.",
        },
      },
      {
        "@type": "Question",
        name: "How much does beginner yarn cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prices and skein sizes vary by yarn, color, and seller. Check the current price per yard and the amount required by your chosen pattern; if color matching matters, plan for dye-lot availability before buying.",
        },
      },
      {
        "@type": "Question",
        name: "What yarn should beginners avoid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some learners find fuzzy yarn, very dark colors, slippery fibers, or loosely twisted yarn harder to inspect and undo. Choose the texture and color that let you see and control your own stitches.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use the same yarn for knitting and crochet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many yarns can be used for either knitting or crochet, but the pattern's yarn weight, gauge, fabric requirements, and care instructions determine whether a particular yarn is suitable.",
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
        <span className="text-bark-600 dark:text-cream-400">Best Yarn for Beginners</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="mb-6 rounded-lg border border-cream-300 bg-cream-100 px-4 py-3 text-sm leading-relaxed text-bark-600 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300">
        <strong>Paid links:</strong> FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Yarn for Beginners: A Selection Guide
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        Start with your pattern, then choose a yarn whose stitches you can see and handle comfortably. A smooth, light-colored Medium (4) yarn can be a useful learning option when the pattern permits it. Check the exact care label and required yardage before buying; one skein is not a universal first-project quantity.
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: {REVIEW_DATES.bestYarnForBeginners.label}</span>
        <span>&middot;</span>
        <span>Written by Jason Ramirez, founder of FiberTools</span>
      </div>

      <article className="prose-fiber">
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">How to use this guide</h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">This is selection guidance based on linked manufacturer specifications (and LoveCrafts for its own Paintbox brand), not hands-on testing or a ranked comparison. Product names in the tables link to specification sources checked October 14, 2026; paid shopping links are separate. Match the exact product, color, package size, care label, and pattern gauge before buying. A product page does not guarantee stock at a seller.</p>
        </section>

        {/* What Makes a Good Beginner Yarn? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What Makes a Good Beginner Yarn?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            A practical learning yarn has a texture and color that let you inspect each stitch, plus a thickness that feels manageable with the chosen hook or needles. Price may matter when a project involves practice or rework, so compare the current cost per yard as well as the skein price.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Consider:</strong> a smooth texture, a visible color, care instructions that suit the project, and current availability in enough yardage and one dye lot. Medium weight (worsted/CYC 4) is one approachable option when the pattern permits it.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Potentially harder to inspect:</strong> fuzzy textures, very dark colors, slippery yarns, and loosely twisted singles. These can obscure stitches or split more readily for some users, but the best learning material is the one you can see and control comfortably.
          </p>
        </section>

        {/* Beginner Yarn Options to Compare */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Beginner Yarn Options to Compare
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            These examples offer different package sizes and yarn weights to compare with your pattern. The linked product specifications support the weight and fiber details; they do not establish a best yarn for every learner. Availability and price vary by seller and color.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yarn Name</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Fiber</th>
                  <th className="px-4 py-3 font-semibold">Planning note</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium"><a href="https://www.lionbrand.com/products/pound-of-love-yarn" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">Lion Brand Pound of Love</a></td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Large put-up, 1,020 yards listed per skein</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("Lion Brand Pound of Love yarn")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium"><a href="https://www.yarnspirations.com/products/caron-simply-soft-yarn" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">Caron Simply Soft</a></td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Smooth-finish option; compare current colors and care label</td>
                  <td className="px-4 py-3">
                    <a href={amazonProductUrl("B00CB39PYQ")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium"><a href="https://www.yarnspirations.com/products/red-heart-super-saver-yarn" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">Red Heart Super Saver (solids)</a></td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Compare current price, yardage, colors, and care label</td>
                  <td className="px-4 py-3">
                    <a href={amazonProductUrl("B00114TCMQ")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium"><a href="https://www.lovecrafts.com/en-us/products/paintbox-yarns-simply-dk" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">Paintbox Simply DK</a></td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Light (3) option; compare label gauge, care, and current colors</td>
                  <td className="px-4 py-3">
                    <a href={amazonSearchUrl("paintbox simply dk")} target="_blank" rel="sponsored nofollow noopener" className="text-sage-600 dark:text-sage-400 hover:underline">View on Amazon (paid link)</a>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]"><strong>Historical reference:</strong> Lion Brand Comfy Cotton Blend is discontinued. Its <a href="https://www.lionbrand.com/products/comfy-cotton-blend-yarn" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 hover:underline">official product page</a> lists Light (3), 50% cotton / 50% polyester. It is included here only to identify existing stash, not as a current buying recommendation. No remaining stock is assumed.</p>

        {/* What Yarn Weight Should Beginners Start With? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What Yarn Weight Should Beginners Start With?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Medium weight yarn (worsted, CYC 4) can be an approachable starting point when the pattern permits it: its stitches are generally easier to inspect than those made with very fine yarn. Actual pace and visibility depend on the stitch, color, tools, and your tension.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Light weight (DK, CYC 3) is another option when the selected pattern calls for it. Very fine, fuzzy, or very bulky yarn may be harder for some learners to inspect or control, but there is no required progression: use the pattern specification and a small swatch to decide.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Not sure about yarn weights? Our{" "}
            <Link href="/yarn-weight-chart" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Weight Chart
            </Link>{" "}
            explains the listed CYC 0–7 categories and the label-guided needle and hook ranges associated with them.
          </p>
        </section>

        {/* How Much Yarn Do Beginners Need? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            How Much Yarn Do Beginners Need?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Yardage depends on the pattern, dimensions, stitch, gauge, and yarn. Use the selected pattern&apos;s stated requirement as the primary source, compare it with the yardage on the actual label, and consider dye-lot availability and the seller&apos;s return policy before adding a buffer.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Use our free{" "}
            <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Calculator
            </Link>{" "}
            to get a planning estimate for supported project types using the measurements and yarn information you provide.
          </p>
        </section>

        {/* Should Beginners Use Acrylic or Natural Fibers? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Should Beginners Use Acrylic or Natural Fibers?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            A smooth acrylic can be a practical learning option when its current price, texture, and care label fit the project. Acrylic yarns vary in softness, twist, washability, and price, so inspect the specific product rather than assuming the fiber name guarantees those traits.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Natural fibers are not inherently unsuitable for beginners. Wool, cotton, alpaca, and blends behave differently, and price, stretch, texture, allergies, and washing instructions vary by product. Swatch the actual yarn and follow its care label before committing to a larger project.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">From required yards to whole skeins</h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">Hypothetical example: suppose your pattern and swatch indicate 350 yards in total, including your chosen allowance for practice and finishing. At 200 yards per skein, 350 ÷ 200 = 1.75, so round up to 2 whole skeins. You buy 2 × 200 = 400 yards; planned unused yardage is 400 − 350 = 50 yards. This is arithmetic for invented inputs, not a project recommendation or a guarantee of leftovers.</p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">Make a separate swatch for each different yarn using the intended stitch and tools, then wash and measure it as the project requires. Do not carry the same yardage estimate across different yarns: gauge, fabric, and consumption can change even within one weight category. Recalculate before comparing total purchase cost or unused yardage.</p>
        </section>

        {/* Common Buying Mistakes */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-4">
            Common Buying Mistakes
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Buying without checking a project&apos;s requirements.</strong> If you plan to follow a pattern, compare its yarn weight, gauge, yardage, and fiber or care needs with the exact label before buying.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Ignoring stitch visibility.</strong> Very dark or fuzzy yarn can reduce stitch contrast in some lighting. Compare a small swatch under the lighting where you will work and choose the color and texture you can inspect comfortably.</span>
            </li>
            <li className="flex items-start gap-3 text-bark-600 dark:text-cream-300 text-[15px] leading-relaxed">
              <span className="text-amber-500 mt-1 flex-shrink-0 font-bold">!</span>
              <span><strong>Skipping price and care checks.</strong> Specialty and hand-dyed yarns can have different costs, handling, color behavior, and care needs. Compare the label, swatch behavior, required quantity, and return policy with your budget before choosing.</span>
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
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What is the best yarn weight for a beginner?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Medium weight (worsted, CYC 4) can be a practical starting point because its stitches are generally easier to see than very fine yarn. Follow the yarn weight specified by the pattern you choose.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Is acrylic yarn good for beginners?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">A smooth acrylic can be suitable for learning when its feel and care instructions fit the project. Price, texture, splitting, and washability vary, so check the specific yarn rather than treating one fiber as universally best.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">How much does beginner yarn cost?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Prices and skein sizes vary by yarn, color, and seller. Check the current price per yard and the amount required by your chosen pattern; if color matching matters, plan for dye-lot availability before buying.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">What yarn should beginners avoid?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Some learners find fuzzy yarn, very dark colors, slippery fibers, or loosely twisted yarn harder to inspect and undo. Choose the texture and color that let you see and control your own stitches.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">Can I use the same yarn for knitting and crochet?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">Many yarns can be used for either knitting or crochet, but the pattern&apos;s yarn weight, gauge, fabric requirements, and care instructions determine whether a particular yarn is suitable.</p></div>
          </details>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Estimate yarn for your first project
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Yarn Calculator, no login required, works offline.
        </p>
        <Link href="/yarn-calculator" className="btn-primary">
          🧶 Open Yarn Calculator
        </Link>
      </div>
    </div>
  );
}
