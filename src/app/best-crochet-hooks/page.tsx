import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Crochet Hooks (2026): Every Budget",
  description:
    "The best crochet hooks for beginners and experienced crocheters in 2026. Ergonomic, aluminum, and steel hook recommendations.",
  keywords: [
    "best crochet hooks",
    "ergonomic crochet hooks",
    "crochet hooks for beginners",
    "clover amour",
    "tulip etimo",
    "crochet hook set",
  ],
  openGraph: {
    type: "article",
    title: "Best Crochet Hooks (2026): Every Budget",
    description:
      "The best crochet hooks for beginners and experienced crocheters in 2026. Ergonomic, aluminum, and steel hook recommendations.",
    url: "https://fibertools.app/best-crochet-hooks",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Crochet Hooks — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Crochet Hooks (2026): Every Budget",
    description:
      "The best crochet hooks for beginners and experienced crocheters in 2026. Ergonomic, aluminum, and steel hook recommendations.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/best-crochet-hooks" },
};

export default function BestCrochetHooksPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Crochet Hooks (2026): Every Budget",
    description:
      "The best crochet hooks for beginners and experienced crocheters in 2026. Ergonomic, aluminum, and steel hook recommendations.",
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
    url: "https://fibertools.app/best-crochet-hooks",
    mainEntityOfPage: "https://fibertools.app/best-crochet-hooks",
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: "best crochet hooks, ergonomic crochet hooks, crochet hooks for beginners",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Best Crochet Hooks" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What size crochet hook should a beginner start with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "US H-8 (5mm) with medium worsted weight yarn is best. This size is comfortable to hold and works up quickly so you see progress fast.",
        },
      },
      {
        "@type": "Question",
        name: "Are ergonomic crochet hooks worth it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, especially for long sessions. Ergonomic hooks reduce wrist and hand fatigue significantly. If you crochet for more than 30 minutes at a time, an ergonomic hook is a worthwhile investment.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between inline and tapered crochet hooks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Inline hooks have the throat cut straight in line with the shaft, creating a more defined hook shape. Tapered hooks have a rounded, gradually narrowing head. Neither is objectively better — try both to see which feels more natural.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need different hooks for different yarn weights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Each yarn weight has a recommended hook size range. Using the wrong size affects gauge and fabric drape. Check the Needle Converter for size equivalents across US, metric, and UK systems.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use knitting needles for crochet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Crochet hooks have a specific hook shape that catches and pulls yarn through loops. Knitting needles are straight or circular without a hook, making them unsuitable for crochet stitches.",
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
        <span className="text-bark-600 dark:text-cream-400">Best Crochet Hooks</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="text-xs text-bark-400 dark:text-bark-500 bg-cream-100 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-lg px-4 py-2 mb-6">
        This page contains affiliate links. If you purchase through our links we may earn a small commission at no extra cost to you.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Best Crochet Hooks (2026): Every Budget
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        The best crochet hook for most crocheters is an ergonomic hook with a comfortable grip — the Clover Amour is the top all-around pick. Beginners should start with a US H-8 (5mm) hook and medium weight yarn. For budget options, a basic aluminum set from Boye or Susan Bates covers all common sizes for under $15.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: March 16, 2026</span>
        <span>&middot;</span>
        <span>Written by the FiberTools Team — fiber arts experts with 30+ years of combined experience</span>
      </div>

      <article className="prose-fiber">
        {/* Types of Crochet Hooks */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Types of Crochet Hooks
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Crochet hooks come in two main head styles: <strong>inline</strong> (also called Bates-style) and <strong>tapered</strong> (also called Boye-style). Inline hooks have the throat cut straight in line with the shaft, giving a more defined hook shape. Tapered hooks have a rounded, gradually narrowing head. Most crocheters develop a preference — neither is objectively better.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Handle styles</strong> fall into two categories: straight (traditional) and ergonomic (with a shaped rubber or silicone grip). Ergonomic handles reduce hand fatigue during long sessions and are especially helpful for crocheters with arthritis or carpal tunnel.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Materials</strong> include aluminum (lightweight, smooth, affordable), steel (small sizes for thread crochet), bamboo and wood (warm feel, slight grip on yarn), and plastic (lightweight, large sizes). Aluminum is the most versatile and popular choice.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Sizing</strong> uses both US letter/number and metric millimeter systems. A US H-8 is 5mm, a US G-6 is 4mm, and so on. The two systems do not always align neatly — use our{" "}
            <Link href="/needle-converter" className="text-sage-600 dark:text-sage-400 hover:underline">
              Hook Size Converter
            </Link>{" "}
            to translate between US, metric, and UK sizes.
          </p>
        </section>

        {/* Best Ergonomic Crochet Hooks */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Ergonomic Crochet Hooks
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Ergonomic hooks are the best upgrade most crocheters can make. A comfortable grip reduces hand and wrist fatigue, letting you crochet longer without pain. These are the top ergonomic hooks available in 2026.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hook</th>
                  <th className="px-4 py-3 font-semibold">Handle</th>
                  <th className="px-4 py-3 font-semibold">Sizes Available</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Clover Amour</td>
                  <td className="px-4 py-3">Rubber grip, inline head</td>
                  <td className="px-4 py-3">2mm–15mm (steel and standard)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=clover+amour+crochet+hook&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Tulip Etimo</td>
                  <td className="px-4 py-3">Teardrop cushion grip, tapered head</td>
                  <td className="px-4 py-3">1.8mm–10mm</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=tulip+etimo+crochet+hook&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Furls Streamline</td>
                  <td className="px-4 py-3">Handcrafted, multiple materials</td>
                  <td className="px-4 py-3">3.5mm–12mm</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=furls+crochet+hook&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The <strong>Clover Amour</strong> is the best overall pick for most crocheters. Its color-coded rubber grip is comfortable for hours of work, the inline hook head grabs yarn cleanly, and the full size range covers everything from thread crochet to bulky blankets. The <strong>Tulip Etimo</strong> is a premium Japanese-made hook with an exceptionally smooth shaft and a distinctive teardrop handle — favored by experienced crocheters who prefer a tapered head. The <strong>Furls Streamline</strong> is a handcrafted premium option available in resin, wood, and other materials, with a higher price point to match.
          </p>
        </section>

        {/* Best Budget Crochet Hooks */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Budget Crochet Hooks
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            You do not need to spend a lot to start crocheting. A basic aluminum hook set covers all the sizes most patterns call for. These budget-friendly options are tried and true.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hook</th>
                  <th className="px-4 py-3 font-semibold">Material</th>
                  <th className="px-4 py-3 font-semibold">Set or Single</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Boye Aluminum Set</td>
                  <td className="px-4 py-3">Aluminum</td>
                  <td className="px-4 py-3">Set (6–10 hooks)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=boye+aluminum+crochet+hook+set&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Susan Bates Silvalume Set</td>
                  <td className="px-4 py-3">Aluminum</td>
                  <td className="px-4 py-3">Set (6–8 hooks)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=susan+bates+silvalume+crochet+hook+set&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The <strong>Boye Aluminum Set</strong> is a classic straight-handle hook set that has been a craft store staple for decades. Widely available and affordable, it is a solid starting point for anyone learning to crochet. The <strong>Susan Bates Silvalume Set</strong> offers smooth aluminum hooks with an inline head style and good value — often available for under $15 for a full set of common sizes.
          </p>
        </section>

        {/* Best Hooks for Specific Projects */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Hooks for Specific Projects
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Different projects call for different hooks. The right hook size depends on your yarn weight, desired fabric drape, and the specific project you are making. Here is a quick reference for common project types.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project Type</th>
                  <th className="px-4 py-3 font-semibold">Recommended Hook</th>
                  <th className="px-4 py-3 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Amigurumi</td>
                  <td className="px-4 py-3">Steel or aluminum 3.5mm (US E-4)</td>
                  <td className="px-4 py-3">Tight gauge needed to prevent stuffing from showing</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Blankets</td>
                  <td className="px-4 py-3">Ergonomic 5–6mm (US H-8 to J-10)</td>
                  <td className="px-4 py-3">Reduces hand fatigue over many hours of work</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Fine thread work</td>
                  <td className="px-4 py-3">Steel hooks size 0–14</td>
                  <td className="px-4 py-3">Precision required for lace and doily patterns</td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Bulky yarn projects</td>
                  <td className="px-4 py-3">Large ergonomic 8–10mm (US L-11 to N-15)</td>
                  <td className="px-4 py-3">Comfort with thick yarn over extended sessions</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For amigurumi, you typically use a hook 1–2 sizes smaller than the yarn label recommends to create a tight, firm fabric. Learn more about{" "}
            <Link href="/amigurumi-shapes" className="text-sage-600 dark:text-sage-400 hover:underline">
              amigurumi shaping techniques
            </Link>{" "}
            in our dedicated guide. For any project, check the{" "}
            <Link href="/needle-converter" className="text-sage-600 dark:text-sage-400 hover:underline">
              Hook Size Converter
            </Link>{" "}
            to translate between sizing systems.
          </p>
        </section>

        {/* Inline vs Tapered Hook Heads */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Inline vs Tapered Hook Heads
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The debate between inline and tapered hook heads is one of the most common in crochet. <strong>Inline hooks</strong> (Bates-style) have the throat cut straight in line with the shaft. The hook is more defined, which some crocheters find grabs yarn more consistently. Susan Bates and Clover Amour are popular inline hooks.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Tapered hooks</strong> (Boye-style) have a rounded head that narrows gradually into the throat. The smoother transition can make it easier to pull yarn through tight stitches. Boye and Tulip Etimo are well-known tapered hooks.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Neither style is objectively better — it comes down to personal preference and how you hold your hook. Many crocheters try both and develop a clear favorite. If you are just starting out, pick whichever is available and affordable. You can always try the other style later.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-display font-bold text-bark-800 dark:text-cream-100 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 divide-y divide-cream-200 dark:divide-bark-700">
          {[
            {
              q: "What size crochet hook should a beginner start with?",
              a: "US H-8 (5mm) with medium worsted weight yarn is best. This size is comfortable to hold and works up quickly so you see progress fast.",
            },
            {
              q: "Are ergonomic crochet hooks worth it?",
              a: "Yes, especially for long sessions. Ergonomic hooks reduce wrist and hand fatigue significantly. If you crochet for more than 30 minutes at a time, an ergonomic hook is a worthwhile investment.",
            },
            {
              q: "What is the difference between inline and tapered crochet hooks?",
              a: "Inline hooks have the throat cut straight in line with the shaft, creating a more defined hook shape. Tapered hooks have a rounded, gradually narrowing head. Neither is objectively better — try both to see which feels more natural.",
            },
            {
              q: "Do I need different hooks for different yarn weights?",
              a: "Yes. Each yarn weight has a recommended hook size range. Using the wrong size affects gauge and fabric drape. Check the Needle Converter for size equivalents across US, metric, and UK systems.",
            },
            {
              q: "Can I use knitting needles for crochet?",
              a: "No. Crochet hooks have a specific hook shape that catches and pulls yarn through loops. Knitting needles are straight or circular without a hook, making them unsuitable for crochet stitches.",
            },
          ].map((faq, i) => (
            <div key={i} className="px-6 py-4">
              <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 mb-1">{faq.q}</h3>
              <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="text-lg font-semibold text-bark-700 dark:text-cream-200 mb-2">
          Convert hook sizes between US, metric, and UK systems
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Hook Size Converter — no login required, works offline.
        </p>
        <Link href="/needle-converter" className="btn-primary">
          Open Hook Size Converter
        </Link>
      </div>
    </main>
  );
}
