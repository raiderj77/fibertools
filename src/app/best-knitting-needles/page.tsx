import type { Metadata } from "next";
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/affiliate";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

const title = "Choosing Knitting Needles: Size, Construction and Gauge | FiberTools";
const headline = "Choosing Knitting Needles: Size, Construction and Gauge";
const description = "Compare needle construction, millimeter sizes and project requirements using manufacturer references and a representative swatch.";
const faqs = [
  {"question": "What size knitting needles should a beginner start with?", "answer": "Start with the pattern and yarn label, then make a swatch. For Medium (4) yarn, the Craft Yarn Council gives 4.5–5.5 mm (US 7–9) as a guideline, not a universal beginner requirement. Follow the gauge in your pattern."},
  {"question": "Are bamboo or metal needles better for beginners?", "answer": "Try the same yarn and stitch pattern on each material if possible. Compare stitch control, tip shape and how easily you move the stitches. This guide has no comparative testing that establishes one material as better for every beginner."},
  {"question": "What is the difference between straight and circular needles?", "answer": "Straight needles support flat back-and-forth work. Circular needles have tips joined by a cable and can be used flat or in the round. Choose the construction and working length required by the pattern; a garment name alone does not decide the needle type."},
  {"question": "Do I need double-pointed needles?", "answer": "They are one option for small circumferences worked in the round. Some patterns use long circulars with magic loop or another method. Check which technique the pattern teaches and choose compatible tools."},
  {"question": "How often should I replace knitting needles?", "answer": "Inspect tips, surfaces, cables and joins for damage or snagging. Stop using a damaged tool and consult its manufacturer about repair or replacement. No material guarantees an indefinite lifespan; avoid sanding or heating a tool without manufacturer guidance."},
];
const products = [
  {"name": "Clover Takumi Bamboo Straights", "query": "clover takumi bamboo knitting needles", "check": "Confirm the exact millimeter size and working length."},
  {"name": "Susan Bates Silvalume Straight", "query": "susan bates silvalume knitting needles", "check": "Check the size marking and whether the listing is one pair or a set."},
  {"name": "ChiaoGoo RED Lace fixed circulars", "query": "chiaogoo red lace circular needles", "check": "Match tip diameter and total circular length; fixed cables are not interchangeable parts."},
  {"name": "Addi Turbo circulars", "query": "addi turbo circular knitting needles", "check": "Check the exact model, finish and total length on the manufacturer label."},
  {"name": "Knitter’s Pride Dreamz circulars", "query": "knitters pride dreamz circular", "check": "Confirm the exact model and cable length rather than relying on a brand-wide specification."},
  {"name": "ChiaoGoo TWIST interchangeables", "query": "chiaogoo twist interchangeable", "check": "Check included tip sizes, tip lengths, cable sizes and connector compatibility."},
  {"name": "Knitter’s Pride Karbonz interchangeables", "query": "knitters pride karbonz interchangeable", "check": "Check exact set contents and compatible replacement parts."},
  {"name": "Addi Click interchangeables", "query": "addi click interchangeable needles", "check": "Check the connection instructions and exact set contents."},
];

export const metadata: Metadata = {
  title: { absolute: title }, description,
  openGraph: { type: "article", title, description, url: "https://fibertools.app/best-knitting-needles",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: headline }] },
  twitter: { card: "summary_large_image", title, description, images: ["https://fibertools.app/og-image.png"] },
  alternates: { canonical: "/best-knitting-needles" },
};

export default function BestKnittingNeedlesPage() {
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline, description,
    datePublished: "2026-03-11", dateModified: REVIEW_DATES.bestKnittingNeedles.iso,
    url: "https://fibertools.app/best-knitting-needles", mainEntityOfPage: "https://fibertools.app/best-knitting-needles",
    author: { "@type": "Person", name: "Jason Ramirez", jobTitle: "Founder of FiberTools", url: "https://fibertools.app/about" },
    publisher: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: headline },
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
        <Link href="/" className="hover:underline">Home</Link><span aria-hidden="true">/</span><span>{headline}</span>
      </nav>
      <p className="mb-6 rounded-lg border border-cream-300 bg-cream-100 px-4 py-3 text-sm leading-relaxed text-bark-600 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300">
        <strong>Paid links:</strong> FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-bark-800 dark:text-cream-100 leading-tight mb-4">{headline}</h1>
      <p className="text-lg text-bark-600 dark:text-cream-300 leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 text-sm text-bark-500 dark:text-cream-400">
        <span>Last updated: {REVIEW_DATES.bestKnittingNeedles.label}</span>
        <span>Written by Jason Ramirez, founder of FiberTools</span>
      </div>
      <article className="prose-fiber text-bark-600 dark:text-cream-300">
        <section className="mb-10" aria-labelledby="comparison-basis">
          <h2 id="comparison-basis">What this guide is based on</h2>
          <p>This is a specification-based selection guide, not a hands-on product test. It does not rank comfort, speed or durability, and it establishes no medical benefit. Sources were checked on {REVIEW_DATES.bestKnittingNeedles.label}. The goal is to choose a tool for a specific pattern and compare it with your own swatch.</p>
        </section>
        <section className="mb-10" aria-labelledby="construction">
          <h2 id="construction">Choose construction before buying a set</h2>
          <p>Straight needles work flat pieces back and forth. Circular needles can work flat or in the round; the cable holds stitches between the two tips. Double-pointed needles provide another way to work small circumferences in the round. Hats, socks and sweaters can have different constructions, including flat pieces joined later, so read the pattern before choosing.</p>
          <p>For a circular, check both tip diameter and total working length. A cable that suits a broad flat panel may not suit a small round worked without magic loop. For interchangeable sets, check tip length, connection sizes and permitted combinations in the maker&apos;s instructions. Do not assume every cable fits every tip from the same brand.</p>
          <p><a href="https://www.chiaogoo.com/circular/">ChiaoGoo describes its fixed RED Lace circulars</a> as stainless steel with a nylon-coated steel cable. That is a product specification, not evidence that they outperform another needle. Its <a href="https://www.chiaogoo.com/interchangeable/">interchangeable ranges</a> are separate products: match the actual set and parts.</p>
        </section>
        <section className="mb-10" aria-labelledby="size-gauge">
          <h2 id="size-gauge">Use millimeters and a representative swatch</h2>
          <p>The <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system">Craft Yarn Council guidelines</a> give 4.5–5.5 mm (US 7–9) knitting needles for Medium (4) yarn. These are starting references; the Council directs makers to follow pattern gauge. Use the <Link href="/needle-converter">Needle Size Converter</Link> to compare size labels and the <Link href="/needle-guide">Needle Guide</Link> for category references.</p>
          <ol>
            <li>Read the pattern&apos;s needle size, stitch pattern, construction and gauge span.</li>
            <li>Swatch using the intended yarn and tool. Finish the sample as the pattern and yarn care instructions permit.</li>
            <li>Compare stitch and row gauge separately. Use the <Link href="/gauge-calculator">Gauge Calculator</Link> for the arithmetic, then reswatch if you change tools.</li>
            <li>Check stitch control and the fabric as well as the count. The same marked diameter does not guarantee the same result for every maker.</li>
          </ol>
          <p><strong>Hypothetical comparison:</strong> if a pattern calls for 20 stitches over 4 inches and your treated swatch has 22, the stitches are smaller than the target. Test an adjustment and measure again. This observation does not identify a universal replacement needle size or prove that a different brand will fix it.</p>
        </section>
        <section className="mb-10" aria-labelledby="compare-tools">
          <h2 id="compare-tools">Compare the tool you will actually use</h2>
          <p>Try one pair or fixed circular before committing to a large set. With the same yarn, check whether stitches catch at a join, split at the tip, slide off unexpectedly or need excessive effort to move. Note tip shape, usable tip length and cable behavior; a material name alone cannot predict comfort or knitting speed.</p>
          <p>Check the exact material and finish if you have a known sensitivity. Stop using damaged tips or cables and follow the manufacturer&apos;s repair guidance. Do not assume a tool lasts forever, or sand a coated surface or heat a cable without appropriate instructions.</p>
          <p>Compare the current cost of the sizes and lengths you need against a set&apos;s actual contents. Count any additional cables, adapters or replacement parts. There is no fixed number of purchases at which a set always becomes cheaper.</p>
        </section>
        <section className="mb-10" aria-labelledby="shopping-options">
          <h2 id="shopping-options">Product searches and checks before buying</h2>
          <p>These existing shopping options are not ranked winners. Search results may include different variants, bundles or sellers. Match the exact product, size and label before buying; availability and prices can change.</p>
          <div className="overflow-x-auto" tabIndex={0} aria-label="Product options and purchase checks">
            <table className="w-full text-sm text-left">
              <thead><tr><th scope="col">Product search</th><th scope="col">What to verify</th><th scope="col">Paid link</th></tr></thead>
              <tbody>{products.map((product) => (
                <tr key={product.query}>
                  <th scope="row">{product.name}</th><td>{product.check}</td>
                  <td><a href={amazonSearchUrl(product.query)} target="_blank" rel="sponsored nofollow noopener">View on Amazon (paid link)</a></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </article>
      <section className="mt-12" aria-labelledby="buying-faq">
        <h2 id="buying-faq" className="text-xl font-display font-bold mb-4">Frequently Asked Questions</h2>
        <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6 divide-y divide-cream-200 dark:divide-bark-700">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="py-3">
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="pt-3 text-sm leading-relaxed text-bark-600 dark:text-cream-300">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
