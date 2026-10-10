import type { Metadata } from "next";
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/affiliate";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

const title = "Crochet Hook Selection Guide: Size, Grip & Gauge | FiberTools";
const description = "Compare hook sizes, handle styles and manufacturer specifications, then choose with a project swatch. Includes primary sources and limits of the comparison.";
const headline = "Choosing a Crochet Hook: Size, Grip and Gauge";
const faqs = [
  {
    question: "What size crochet hook should a beginner start with?",
    answer: "Start with the millimeter size specified by your pattern and yarn label. The Craft Yarn Council lists 5.5–6.5 mm as a guideline for Medium (4) yarn, not a rule for every project. Make a swatch and compare it with the pattern gauge before choosing your final hook size.",
  },
  {
    question: "Are ergonomic crochet hooks worth it?",
    answer: "A shaped or cushioned handle is an option to compare with a plain handle. The label ergonomic does not establish that a hook will suit your grip. This guide has no comparative comfort testing and does not establish medical benefits. If possible, try one hook before buying a set.",
  },
  {
    question: "How should I compare different hook heads?",
    answer: "Compare how each head enters a stitch and pulls a loop through using the same yarn and stitch pattern. Check whether the yarn catches or splits and whether there is enough usable shaft for your stitches. Use your swatch result instead of treating a head-style label as a quality ranking.",
  },
  {
    question: "Do I need different hooks for different yarn weights?",
    answer: "Hook-size ranges are starting points. The pattern gauge and the fabric you make determine whether a size works for a project. Check the millimeter marking when comparing hooks and use the Hook Size Converter for size-system references.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    type: "article", title, description,
    url: "https://fibertools.app/best-crochet-hooks",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Crochet hook selection guide, FiberTools" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["https://fibertools.app/og-image.png"] },
  alternates: { canonical: "/best-crochet-hooks" },
};

export default function BestCrochetHooksPage() {
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline, description,
    datePublished: "2026-03-11", dateModified: REVIEW_DATES.bestCrochetHooks.iso,
    url: "https://fibertools.app/best-crochet-hooks",
    mainEntityOfPage: "https://fibertools.app/best-crochet-hooks",
    author: { "@type": "Person", name: "Jason Ramirez", jobTitle: "Founder of FiberTools", url: "https://fibertools.app/about" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Crochet Hook Selection Guide" },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="flex flex-wrap gap-2 text-sm text-bark-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link><span aria-hidden="true">/</span><span>Crochet Hook Selection Guide</span>
      </nav>
      <p className="mb-6 rounded-lg border border-cream-300 bg-cream-100 px-4 py-3 text-sm leading-relaxed text-bark-600 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300">
        <strong>Paid links:</strong> FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">{headline}</h1>
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-4">
        Choose a hook by the size your project needs, how its handle fits your grip, and the fabric your swatch produces. A brand name or an ergonomic label cannot choose those things for you.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 text-sm text-bark-500 dark:text-cream-400">
        <span>Last updated: {REVIEW_DATES.bestCrochetHooks.label}</span>
        <span>Written by Jason Ramirez, founder of FiberTools</span>
      </div>
      <article className="prose-fiber text-bark-600 dark:text-cream-300">
        <section className="mb-10" aria-labelledby="comparison-basis">
          <h2 id="comparison-basis">What this guide is based on</h2>
          <p>This is a specification-based selection guide, not a hands-on product test. The examples below illustrate handle choices using manufacturer descriptions; they are not ranked winners. FiberTools has no comparative testing here to establish comfort, durability or superiority. Manufacturer descriptions are not evidence of pain relief or fatigue reduction.</p>
          <p>Sources were checked on {REVIEW_DATES.bestCrochetHooks.label}. Product specifications apply to the named example, not every hook sold under the same brand. Prices, stock and set contents can change; check the exact item before purchasing.</p>
        </section>
        <section className="mb-10" aria-labelledby="size-gauge">
          <h2 id="size-gauge">Start with size and gauge</h2>
          <p>The <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system">Craft Yarn Council yarn weight guidelines</a> list a 5.5–6.5 mm crochet-hook range for Medium (4) yarn. The Council explicitly treats these ranges as guidelines and directs readers to follow the pattern gauge. That range is a starting reference, not a universal beginner or blanket size.</p>
          <ol>
            <li>Read the pattern&apos;s yarn, hook and gauge requirements. Check the hook&apos;s millimeter marking before comparing letter or number labels.</li>
            <li>Make a swatch in the yarn and stitch pattern you intend to use, and finish it as the pattern directs before measuring.</li>
            <li>Compare stitch and row counts over the measurement given in the pattern. If they differ, adjust the hook and make another swatch rather than assuming a named size will give the same result for everyone.</li>
            <li>Check the resulting fabric as well as the count: does it have the openness or firmness your project calls for?</li>
          </ol>
          <p>For a blanket, judge the swatch against the pattern and the drape you want. For a stuffed toy, check the pattern&apos;s fabric requirements instead of automatically subtracting a fixed number of hook sizes. For thread work, check the specified millimeters: the Council notes that steel-hook numbers run in the opposite direction from regular hook sizing.</p>
          <p>Use the <Link href="/needle-converter">Hook Size Converter</Link> for size references and the <Link href="/gauge-calculator">Gauge Calculator</Link> to compare measured stitch and row counts.</p>
        </section>
        <section className="mb-10" aria-labelledby="handle-examples">
          <h2 id="handle-examples">Two cushioned-handle examples to compare</h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border border-cream-300 dark:border-bark-700">
              <caption className="text-left mb-3">Manufacturer specifications, not a performance ranking</caption>
              <thead><tr><th scope="col" className="p-3">Example</th><th scope="col" className="p-3">What the source establishes</th><th scope="col" className="p-3">What to check yourself</th></tr></thead>
              <tbody>
                <tr className="border-t border-cream-300 dark:border-bark-700">
                  <th scope="row" className="p-3">Clover Amour I (5.5 mm)</th>
                  <td className="p-3"><a href="https://clover-usa.com/products/amour-crochet-hook-i">Clover&apos;s product page</a> lists a 5.5 mm hook and aluminum and elastomer materials.</td>
                  <td className="p-3">Whether the grip shape and usable shaft suit the way you hold your hook.</td>
                </tr>
                <tr className="border-t border-cream-300 dark:border-bark-700">
                  <th scope="row" className="p-3">Tulip ETIMO Red</th>
                  <td className="p-3"><a href="https://en.tulip-japan.co.jp/knitting_needle/">Tulip&apos;s crochet-hook catalog</a> identifies a cushion grip and a matte red hook tip.</td>
                  <td className="p-3">The exact size offered by the listing and how the handle and tip work with your yarn.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>A plain-handled hook is also an option. Compare the cost of one hook in the size you need with a set, counting only sizes you expect to use. Buying a larger set does not establish better value for your particular project.</p>
          <p>If you want to compare seller listings, these existing searches may return different sizes, sets or product lines. Match the listing to the manufacturer specification; search results are not the evidence for this guide.</p>
          <ul>
            <li><a href={amazonSearchUrl("clover amour crochet hook")} target="_blank" rel="sponsored nofollow noopener">Search Clover Amour on Amazon (paid link)</a></li>
            <li><a href={amazonSearchUrl("tulip etimo crochet hook")} target="_blank" rel="sponsored nofollow noopener">Search Tulip Etimo on Amazon (paid link)</a></li>
          </ul>
        </section>
        <section className="mb-10" aria-labelledby="compare-swatch">
          <h2 id="compare-swatch">Compare with a small swatch before buying a set</h2>
          <p>If you can borrow or try a hook, keep the yarn, stitch pattern and nominal millimeter size the same when comparing it with another. Record the hook model and size, stitches and rows over the same measured area, and any catching or splitting you notice. Also note where your fingers rest and whether the handle leaves enough shaft for the loops you use.</p>
          <p>These are observations you can make for your own choice, not FiberTools test results. If a hook does not suit your grip or fabric, try a different handle or size. There is no measured score or universal winner in this guide.</p>
        </section>
      </article>
      <section className="mt-10" aria-labelledby="hook-faq">
        <h2 id="hook-faq" className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-4">Frequently Asked Questions</h2>
        <div className="divide-y divide-cream-300 dark:divide-bark-700">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="py-3">
              <summary className="cursor-pointer font-semibold text-bark-700 dark:text-cream-200">{question}</summary>
              <p className="pt-3 text-sm leading-relaxed text-bark-600 dark:text-cream-300">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="mt-12 p-6 bg-sage-50 dark:bg-sage-900/20 rounded-2xl border border-sage-200 dark:border-sage-800 text-center">
        <p className="mb-4 text-bark-700 dark:text-cream-200">Check hook-size references before comparing labels.</p>
        <Link href="/needle-converter" className="btn-primary">Open Hook Size Converter</Link>
      </div>
    </div>
  );
}
