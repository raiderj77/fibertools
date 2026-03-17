import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Yarn for Amigurumi (2026): Tight & Neat",
  description:
    "The best yarn for amigurumi in 2026. Cotton and acrylic picks for tight gauge, clean stitch definition, and vibrant colors.",
  keywords: [
    "best yarn for amigurumi",
    "amigurumi yarn",
    "cotton yarn for amigurumi",
    "acrylic yarn for amigurumi",
    "crochet toy yarn",
  ],
  openGraph: {
    type: "article",
    title: "Best Yarn for Amigurumi (2026): Tight & Neat",
    description:
      "The best yarn for amigurumi in 2026. Cotton and acrylic picks for tight gauge, clean stitch definition, and vibrant colors.",
    url: "https://fibertools.app/best-yarn-for-amigurumi",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Yarn for Amigurumi — FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Yarn for Amigurumi (2026): Tight & Neat",
    description:
      "The best yarn for amigurumi in 2026. Cotton and acrylic picks for tight gauge, clean stitch definition, and vibrant colors.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/best-yarn-for-amigurumi" },
};

export default function BestYarnForAmigurumiPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Yarn for Amigurumi (2026): Tight & Neat",
    description:
      "The best yarn for amigurumi in 2026. Cotton and acrylic picks for tight gauge, clean stitch definition, and vibrant colors.",
    datePublished: "2026-03-11",
    dateModified: "2026-03-11",
    url: "https://fibertools.app/best-yarn-for-amigurumi",
    mainEntityOfPage: "https://fibertools.app/best-yarn-for-amigurumi",
    author: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    keywords: "best yarn for amigurumi, amigurumi yarn, cotton yarn for amigurumi, acrylic yarn for amigurumi, crochet toy yarn",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Best Yarn for Amigurumi" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What weight yarn is best for amigurumi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Light (DK, CYC 3) and Medium (worsted, CYC 4) are both popular. DK produces smaller, more detailed figures. Worsted creates larger pieces faster. Check your pattern for the recommended weight.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use acrylic yarn for amigurumi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Smooth acrylic yarn is colorfast, machine washable, and available in hundreds of solid colors — ideal for character designs.",
        },
      },
      {
        "@type": "Question",
        name: "Why does stuffing show through my amigurumi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your gauge is too loose. Go down 1–2 hook sizes from the yarn label recommendation. The fabric should be firm enough that you cannot see through it when held up to a light.",
        },
      },
      {
        "@type": "Question",
        name: "Is cotton or acrylic better for amigurumi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both work well. Cotton has better stitch definition and is less stretchy, which helps maintain shape. Acrylic is more affordable with a wider color range. Many makers use both depending on the project.",
        },
      },
      {
        "@type": "Question",
        name: "How do I prevent color bleeding in amigurumi yarn?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose yarns labeled colorfast or superwash. Hand-wash and dry completed pieces before assembling to test for any bleeding.",
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
        <span className="text-bark-600 dark:text-cream-400">Best Yarn for Amigurumi</span>
      </nav>

      {/* Affiliate disclosure */}
      <p className="text-xs text-bark-400 dark:text-bark-500 bg-cream-100 dark:bg-bark-800 border border-cream-300 dark:border-bark-700 rounded-lg px-4 py-2 mb-6">
        This page contains affiliate links. If you purchase through our links we may earn a small commission at no extra cost to you.
      </p>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">
        Best Yarn for Amigurumi (2026)
      </h1>

      {/* Answer capsule */}
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-2">
        The best amigurumi yarn has a tight twist, smooth texture, and clean stitch definition. Paintbox Simply DK is the top choice for its 100+ solid colors and consistent tight spin. Cotton yarns like Lion Brand 24/7 Cotton offer excellent stitch definition for detailed work. Always use a hook 1–2 sizes smaller than the yarn label recommends to prevent stuffing from showing through.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-bark-400 dark:text-bark-500">
        <span>Last updated: March 16, 2026</span>
        <span>&middot;</span>
        <span>Written by the FiberTools Team — fiber arts experts with 30+ years of combined experience</span>
      </div>

      <article className="prose-fiber">
        {/* What Makes Good Amigurumi Yarn? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What Makes Good Amigurumi Yarn?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Amigurumi demands yarn that creates a tight, dense fabric. Stuffing should never peek through the stitches, so the yarn must have a firm twist that holds its shape under tension. Clean stitch definition is essential — each single crochet should be clearly visible so you can count stitches and place increases accurately.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Look for:</strong> tight twist, smooth texture, excellent stitch definition, colorfast dyes, solid colors (for crisp details), DK (CYC 3) or worsted (CYC 4) weight, non-splitty plied construction.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            <strong>Avoid:</strong> fuzzy or eyelash yarn (hides stitch definition), loosely spun singles (splits on the hook), novelty yarn of any kind, and highly textured yarns that make counting stitches difficult.
          </p>
        </section>

        {/* Best Cotton Amigurumi Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Cotton Amigurumi Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Cotton yarn produces exceptionally clean stitch definition and holds its shape without stretching. It is a popular choice for amigurumi that need to maintain crisp details over time.
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
                  <td className="px-4 py-3 font-medium">Paintbox Simply DK Cotton</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">100% cotton</td>
                  <td className="px-4 py-3">Excellent stitch definition, wide color range</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=paintbox+simply+dk+cotton&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Lion Brand 24/7 Cotton</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">100% cotton</td>
                  <td className="px-4 py-3">Very smooth, machine washable</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=lion+brand+24+7+cotton+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Drops Safran</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">100% cotton</td>
                  <td className="px-4 py-3">Affordable, great for detailed work</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=drops+safran+yarn&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Best Acrylic Amigurumi Yarns */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            Best Acrylic Amigurumi Yarns
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Acrylic yarn is the most popular choice for amigurumi worldwide. It is affordable, machine washable, available in hundreds of solid colors, and holds its shape well after stuffing.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700 rounded-xl overflow-hidden">
              <thead className="bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yarn Name</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="text-bark-600 dark:text-cream-300">
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Paintbox Simply DK</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">Tight twist, 100+ solid colors, top choice for amigurumi</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=paintbox+simply+dk&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700 bg-cream-50 dark:bg-bark-800/50">
                  <td className="px-4 py-3 font-medium">Scheepjes Catona</td>
                  <td className="px-4 py-3">Light (3)</td>
                  <td className="px-4 py-3">Tight spin, huge color range, popular in EU patterns</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=scheepjes+catona&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
                <tr className="border-t border-cream-200 dark:border-bark-700">
                  <td className="px-4 py-3 font-medium">Lion Brand Vanna&#39;s Choice</td>
                  <td className="px-4 py-3">Medium (4)</td>
                  <td className="px-4 py-3">Smooth, affordable, widely available</td>
                  <td className="px-4 py-3">
                    <a href="https://www.amazon.com/s?k=lion+brand+vannas+choice&tag=ytearnings-20" target="_blank" rel="nofollow sponsored" className="text-sage-600 dark:text-sage-400 hover:underline">Check price</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What Hook Size for Amigurumi? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            What Hook Size for Amigurumi?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            The key to amigurumi is using a hook 1–2 sizes smaller than the yarn label recommends. This creates a tighter fabric that prevents stuffing from showing through. For DK yarn that recommends a US G-6 (4mm) hook, use a US D-3 to E-4 (3–3.5mm) hook instead. For worsted yarn recommending a US H-8 (5mm), drop to a US F-5 to G-6 (3.75–4mm).
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Test your gauge by crocheting a small circle in single crochet. Hold the swatch up to a light — if you can see through it, go down another hook size. The finished fabric should feel firm but not so tight that your hook struggles to enter the stitches.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Generate a custom amigurumi shape with our{" "}
            <Link href="/amigurumi-shapes" className="text-sage-600 dark:text-sage-400 hover:underline">
              Amigurumi Shape Generator
            </Link>
            , or convert between hook sizes with the{" "}
            <Link href="/needle-converter" className="text-sage-600 dark:text-sage-400 hover:underline">
              Needle &amp; Hook Converter
            </Link>
            .
          </p>
        </section>

        {/* How Much Yarn Do You Need for Amigurumi? */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-3">
            How Much Yarn Do You Need for Amigurumi?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            Most small amigurumi figures use under 50 yards per color. The main body color uses the most yardage, while accent colors for features, clothing, or accessories need much less — often 5–15 yards each. A standard DK skein of 125–150 yards is enough for several small figures in the same color.
          </p>
          <p className="text-bark-600 dark:text-cream-300 leading-relaxed mb-4 text-[15px]">
            For larger amigurumi (12 inches or more), plan for 100–200 yards of the main color. Use our{" "}
            <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Yarn Calculator
            </Link>{" "}
            for project-specific estimates, or check how much yardage is left on a partial skein with the{" "}
            <Link href="/stash-estimator" className="text-sage-600 dark:text-sage-400 hover:underline">
              Stash Estimator
            </Link>
            .
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
              q: "What weight yarn is best for amigurumi?",
              a: "Light (DK, CYC 3) and Medium (worsted, CYC 4) are both popular. DK produces smaller, more detailed figures. Worsted creates larger pieces faster. Check your pattern for the recommended weight.",
            },
            {
              q: "Can I use acrylic yarn for amigurumi?",
              a: "Yes. Smooth acrylic yarn is colorfast, machine washable, and available in hundreds of solid colors — ideal for character designs.",
            },
            {
              q: "Why does stuffing show through my amigurumi?",
              a: "Your gauge is too loose. Go down 1–2 hook sizes from the yarn label recommendation. The fabric should be firm enough that you cannot see through it when held up to a light.",
            },
            {
              q: "Is cotton or acrylic better for amigurumi?",
              a: "Both work well. Cotton has better stitch definition and is less stretchy, which helps maintain shape. Acrylic is more affordable with a wider color range. Many makers use both depending on the project.",
            },
            {
              q: "How do I prevent color bleeding in amigurumi yarn?",
              a: "Choose yarns labeled colorfast or superwash. Hand-wash and dry completed pieces before assembling to test for any bleeding.",
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
          Generate the perfect amigurumi shape pattern with our free Amigurumi Shape Generator
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
          Spheres, cones, cylinders, and more — customized to your gauge.
        </p>
        <Link href="/amigurumi-shapes" className="btn-primary">
          Open Amigurumi Shape Generator &rarr;
        </Link>
        <p className="text-sm text-bark-500 dark:text-bark-400 mt-4">
          Not sure how much yarn you have left?{" "}
          <Link href="/stash-estimator" className="text-sage-600 dark:text-sage-400 hover:underline">
            Estimate yardage with our Stash Estimator &rarr;
          </Link>
        </p>
      </div>
    </main>
  );
}
