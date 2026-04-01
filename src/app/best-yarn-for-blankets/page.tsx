import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Yarn for Blankets (2026): Cozy & Durable",
  description:
    "The best yarn for knitting and crochet blankets in 2026. Soft, washable, and budget-friendly options for throw, baby, and chunky blankets.",
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
      "The best yarn for knitting and crochet blankets in 2026. Soft, washable, and budget-friendly options for throw, baby, and chunky blankets.",
    url: "https://fibertools.app/best-yarn-for-blankets",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Yarn for Blankets — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Yarn for Blankets (2026): Cozy & Durable",
    description:
      "The best yarn for knitting and crochet blankets in 2026. Soft, washable, and budget-friendly options for throw, baby, and chunky blankets.",
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
      "The best yarn for knitting and crochet blankets in 2026. Soft, washable, and budget-friendly options for throw, baby, and chunky blankets.",
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
    url: "https://fibertools.app/best-yarn-for-blankets",
    mainEntityOfPage: "https://fibertools.app/best-yarn-for-blankets",
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
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
          text: "6–10 skeins of worsted weight yarn for a standard throw blanket. Use our Blanket Calculator for an accurate estimate based on your exact dimensions and yarn weight.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best yarn for a beginner blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bernat Blanket or Lion Brand Pound of Love — both are soft, machine washable, and widely available. Bernat Blanket works up fast in Super Bulky weight, while Pound of Love gives great yardage in worsted weight.",
        },
      },
      {
        "@type": "Question",
        name: "Is acrylic yarn good for blankets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — acrylic is machine washable, durable, affordable, and available in hundreds of colors. It is the most popular fiber choice for blankets, especially for everyday use and baby blankets.",
        },
      },
      {
        "@type": "Question",
        name: "What weight yarn is best for a chunky blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Super Bulky (CYC 6) or Jumbo (CYC 7) on large needles or hooks. These weights create thick, cozy blankets that work up quickly — a throw can be finished in a weekend.",
        },
      },
      {
        "@type": "Question",
        name: "How do I avoid running out of yarn mid-blanket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buy all your yarn at once from the same dye lot. Always buy one extra skein as insurance. Use our Blanket Calculator to get an accurate yardage estimate before you start.",
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
        <span className="text-bark-600 dark:text-cream-400">Best Yarn for Blankets</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="text-xs text-bark-400 dark:text-bark-500 bg-cream-100 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-lg px-4 py-2 mb-6">
        This page contains affiliate links. If you purchase through our links we may earn a small commission at no extra cost to you.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Best Yarn for Blankets (2026)
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        The best blanket yarn is soft, machine washable, and comes in large skeins to minimize joins. Bernat Blanket is the most popular choice for its softness and fast workup in Super Bulky weight. For worsted weight blankets, Lion Brand Pound of Love offers the best value at over 1,000 yards per skein.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: March 16, 2026</span>
        <span>&middot;</span>
        <span>Written by the FiberTools Team — fiber arts experts with 30+ years of combined experience</span>
      </div>

      <article className="prose-fiber">
        {/* What to Look for in Blanket Yarn */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What to Look for in Blanket Yarn
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            A great blanket yarn needs to survive regular use and washing. Machine washability is non-negotiable — blankets get used heavily and need frequent cleaning, especially baby blankets and throws. Look for yarns labeled machine wash and dry for the easiest care.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Softness</strong> matters more in blanket yarn than almost any other project. You will be wrapped in this fabric for hours. Test yarn against your cheek or inner wrist before committing to a full blanket quantity.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Yardage per skein</strong> saves you time and money. Blankets use a lot of yarn, and every join is a potential weak point and extra end to weave in. Large put-up skeins (500+ yards) mean fewer joins and less waste.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Pill resistance</strong> keeps your blanket looking new after dozens of washes. Anti-pilling acrylic yarns are specifically engineered to resist those annoying surface fuzz balls. <strong>Dye lot consistency</strong> is also critical — buy all your yarn at once from the same dye lot to avoid visible color shifts across your blanket.
          </p>
        </section>

        {/* Best Worsted Weight Blanket Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Worsted Weight Blanket Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Worsted weight (CYC 4) is the most versatile choice for blankets. It creates a fabric with good drape, works with a wide range of stitch patterns, and is available in the widest color selection. Check our{" "}
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
                    <a href="https://www.amazon.com/s?k=bernat+blanket+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Lion Brand Pound of Love</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">1,020 yds (16 oz)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/dp/B000XZS3AO?tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Caron One Pound</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">812 yds (16 oz)</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=caron+one+pound+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
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
            Chunky and super bulky yarns are the fastest way to finish a blanket. A throw-size blanket can be completed in a weekend with Super Bulky (CYC 6) yarn. The trade-off is higher yarn cost per project and a heavier finished blanket.
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
                  <td className="px-4 py-3">Works up fast, extra thick</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=bernat+blanket+extra+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Lion Brand Thick & Quick</td>
                  <td className="px-4 py-3">Bulky (5)</td>
                  <td className="px-4 py-3">80% acrylic / 20% wool</td>
                  <td className="px-4 py-3">Classic chunky blanket yarn</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=lion+brand+thick+quick&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Premier Yarns Anti-Pilling Everyday Chunky</td>
                  <td className="px-4 py-3">Bulky (5)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Pill-resistant, great for everyday use</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=premier+yarns+everyday+chunky&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
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
            Baby blanket yarn must be exceptionally soft against delicate skin, completely machine washable (new parents do not have time for hand washing), and safe — no loose fibers, no scratchy textures, and certified free of harmful substances when possible.
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
                  <td className="px-4 py-3">Very soft, gentle on skin</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=lion+brand+baby+soft+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Paintbox Simply DK</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">100% acrylic</td>
                  <td className="px-4 py-3">Clean colors, affordable</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=paintbox+simply+dk+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
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
            Yarn requirements vary by blanket size, stitch pattern, and yarn weight. As a general guide for worsted weight yarn: a baby blanket needs 900–1,400 yards, a throw blanket needs 1,200–2,000 yards, and a queen-size blanket needs 3,000–4,500 yards. Chunky yarns use fewer yards but more weight.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For an exact estimate based on your specific dimensions and yarn weight, use our free{" "}
            <Link href="/blanket-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Blanket Calculator
            </Link>
            . You can also use the{" "}
            <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Calculator
            </Link>{" "}
            for general yardage estimates across any project type.
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
              q: "How many skeins do I need for a throw blanket?",
              a: "6–10 skeins of worsted weight yarn for a standard throw blanket. Use our Blanket Calculator for an accurate estimate based on your exact dimensions and yarn weight.",
            },
            {
              q: "What is the best yarn for a beginner blanket?",
              a: "Bernat Blanket or Lion Brand Pound of Love — both are soft, machine washable, and widely available. Bernat Blanket works up fast in Super Bulky weight, while Pound of Love gives great yardage in worsted weight.",
            },
            {
              q: "Is acrylic yarn good for blankets?",
              a: "Yes — acrylic is machine washable, durable, affordable, and available in hundreds of colors. It is the most popular fiber choice for blankets, especially for everyday use and baby blankets.",
            },
            {
              q: "What weight yarn is best for a chunky blanket?",
              a: "Super Bulky (CYC 6) or Jumbo (CYC 7) on large needles or hooks. These weights create thick, cozy blankets that work up quickly — a throw can be finished in a weekend.",
            },
            {
              q: "How do I avoid running out of yarn mid-blanket?",
              a: "Buy all your yarn at once from the same dye lot. Always buy one extra skein as insurance. Use our Blanket Calculator to get an accurate yardage estimate before you start.",
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
          Calculate exactly how much yarn your blanket needs
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Use our free Blanket Calculator — no login required, works offline.
        </p>
        <Link href="/blanket-calculator" className="btn-primary">
          Open Blanket Calculator
        </Link>
      </div>
    </main>
  );
}
