import type { Metadata } from "next";
import Link from "next/link";
import { amazonSearchUrl } from "@/lib/affiliate";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

const title = "Choosing Yarn for Amigurumi: Labels, Gauge and Fabric | FiberTools";
const headline = "Choosing Yarn for Amigurumi: Labels, Gauge and Fabric";
const description = "Compare exact yarn labels, test the hook and fabric against your pattern, and plan quantity and care without universal product rankings.";
const faqs = [
  {"question": "What weight yarn is best for amigurumi?", "answer": "Use the weight, gauge and fabric requirements in the pattern. A change in yarn or hook can alter the finished dimensions. Category names alone do not establish an interchangeable yarn or a predictable toy size."},
  {"question": "Can I use acrylic yarn for amigurumi?", "answer": "Acrylic can be an option when the pattern and intended use permit it. Check the exact label and test the resulting fabric; acrylic content alone does not guarantee washability, colorfastness or the behavior of a finished stuffed item."},
  {"question": "Why does stuffing show through my amigurumi?", "answer": "Check stitch spacing, joins, decreases and how firmly the sample is stuffed. Follow the pattern gauge and test a representative sample with the intended stuffing. Adjust the hook or tension and reswatch when needed; do not automatically subtract a fixed number of hook sizes."},
  {"question": "Is cotton or acrylic better for amigurumi?", "answer": "Neither fiber is a universal winner. Compare the exact yarn, stitch visibility, sample firmness, color requirements and care instructions against the pattern. This guide has no comparative product testing to rank their performance."},
  {"question": "How can I check for color bleeding?", "answer": "Follow the exact yarn care instructions and test the intended colors together on a sample before assembling the project. Superwash describes a treatment associated with wool care, not a colorfastness guarantee. Ask the manufacturer if the label leaves an important care question unanswered."},
];
const products = [
  {"name": "Paintbox Yarns Cotton DK", "query": "paintbox cotton dk", "check": "Check Cotton DK on the label; Simply DK is a different acrylic yarn."},
  {"name": "Lion Brand 24/7 Cotton", "query": "lion brand 24 7 cotton yarn", "check": "Check the exact 24/7 product variant and its weight and care label."},
  {"name": "DROPS Safran", "query": "drops safran yarn", "check": "Manufacturer describes sport/5-ply, not DK; compare the pattern gauge."},
  {"name": "Paintbox Yarns Simply DK", "query": "paintbox simply dk", "check": "Check the exact color and acrylic composition on the current label."},
  {"name": "Scheepjes Catona", "query": "scheepjes catona", "check": "The referenced Catona 50g is fingering, 100% mercerized cotton; verify ball size."},
  {"name": "Lion Brand Vanna’s Choice", "query": "lion brand vannas choice", "check": "Verify the exact shade, current composition, care and availability with the maker."},
];

export const metadata: Metadata = {
  title: { absolute: title }, description,
  openGraph: { type: "article", title, description, url: "https://fibertools.app/best-yarn-for-amigurumi",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: headline }] },
  twitter: { card: "summary_large_image", title, description, images: ["https://fibertools.app/og-image.png"] },
  alternates: { canonical: "/best-yarn-for-amigurumi" },
};

export default function BestYarnForAmigurumiPage() {
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline, description,
    datePublished: "2026-03-11", dateModified: REVIEW_DATES.bestYarnForAmigurumi.iso,
    url: "https://fibertools.app/best-yarn-for-amigurumi", mainEntityOfPage: "https://fibertools.app/best-yarn-for-amigurumi",
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
        <span>Last updated: {REVIEW_DATES.bestYarnForAmigurumi.label}</span>
        <span>Written by Jason Ramirez, founder of FiberTools</span>
      </div>
      <article className="prose-fiber text-bark-600 dark:text-cream-300">
        <section className="mb-10" aria-labelledby="comparison-basis">
          <h2 id="comparison-basis">What this guide is based on</h2>
          <p>This is a specification-based selection guide, not a hands-on product test. Sources were checked on {REVIEW_DATES.bestYarnForAmigurumi.label}. Product examples illustrate label differences; they are not ranked for softness, durability, popularity or value.</p>
          <p>Start with the pattern&apos;s yarn, gauge, construction and intended use. Compare a sample before buying every color. A smooth sample may help you see stitches while learning, but textured yarn is not universally unsuitable; use a pattern designed for it and check whether you can identify the stitches reliably.</p>
        </section>
        <section className="mb-10" aria-labelledby="label-examples">
          <h2 id="label-examples">Read the exact product name and fiber label</h2>
          <ul>
            <li><a href="https://www.lovecrafts.com/en-us/products/paintbox-yarns-cotton-dk">Paintbox Cotton DK</a> is 100% cotton. <a href="https://www.lovecrafts.com/en-us/products/paintbox-yarns-simply-dk">Paintbox Simply DK</a> is a separate 100% acrylic product. Similar names do not make them the same yarn.</li>
            <li><a href="https://www.scheepjes.com/en/catona-50g-322/">Scheepjes Catona 50g</a> is described as fingering weight and 100% mercerized cotton. It does not belong in an acrylic-yarn comparison.</li>
            <li><a href="https://www.garnstudio.com/yarn.php?show=drops-safran&amp;cid=19">DROPS Safran</a> is 100% cotton, described by the maker as sport/5-ply. Keep the maker&apos;s category rather than relabeling it DK.</li>
            <li><a href="https://www.lionbrand.com/products/24-7-cotton">Lion Brand 24/7 Cotton</a> is 100% mercerized cotton, labeled Medium (4). Check the exact variant rather than assuming every product with a similar name has the same weight.</li>
          </ul>
          <p>These facts do not establish that one yarn substitutes directly for another. Compare the pattern, actual gauge, fabric and care requirements. For <a href="https://www.lionbrand.com/products/vannas-choice-yarn">Vanna&apos;s Choice</a> and any other yarn, consult the current maker&apos;s label for the exact shade and product.</p>
        </section>
        <section className="mb-10" aria-labelledby="hook-swatch">
          <h2 id="hook-swatch">Choose the hook by testing the fabric</h2>
          <p>The <a href="https://www.craftyarncouncil.com/standards/yarn-weight-system">Craft Yarn Council size ranges</a> are guidelines and direct makers to pattern gauge. An amigurumi pattern may specify a different hook from the ball band. There is no universal rule to reduce every label recommendation by a fixed number of sizes.</p>
          <ol>
            <li>Begin with the pattern&apos;s yarn and hook specification. Record the hook&apos;s millimeters, not just a letter or number.</li>
            <li>Make a representative sample in the same stitch and construction, including a join or decrease if that is where gaps occur.</li>
            <li>Test with the intended stuffing and pattern instructions. Look for visible filling, distorted stitches and gaps at joins; also check that you can insert the hook without forcing it.</li>
            <li>Change one thing, such as hook size or tension, and reswatch. Compare finished dimensions and fabric instead of assuming a smaller hook always solves the problem.</li>
          </ol>
          <p><strong>Hypothetical comparison:</strong> make two small samples in the same yarn with different hooks, record each diameter and compare them with the same amount of stuffing. The more suitable sample is the one that meets the pattern&apos;s dimensions and fabric requirements, not automatically the tighter one.</p>
          <p>Use the <Link href="/needle-converter">Needle &amp; Hook Converter</Link> for size references. The <Link href="/amigurumi-shapes">Amigurumi Shape Generator</Link> supplies supported shape plans; the <Link href="/amigurumi-pattern-checker">free StitchProof pattern checker</Link> checks supported written round math, not yarn suitability or finished-toy safety.</p>
        </section>
        <section className="mb-10" aria-labelledby="quantity-care">
          <h2 id="quantity-care">Plan quantity and care from evidence</h2>
          <p>Use the pattern&apos;s yarn quantities by color. If substituting, allow for differences in gauge, construction, finishing and waste. A toy&apos;s height alone cannot determine yardage, and one skein does not guarantee a fixed number of figures.</p>
          <p>The <Link href="/yarn-calculator">Measured Swatch Yarn Calculator</Link> models flat rectangular fabric, not three-dimensional stuffed toys. For yarn already in your stash, the <Link href="/stash-estimator">Stash Estimator</Link> can estimate remaining length from net yarn mass and the same yarn&apos;s label ratio.</p>
          <p>For example, a hypothetical 100 g ball labeled 200 m with 25 g of yarn remaining represents about 50 m if its length-to-mass ratio is consistent. That estimates what you have, not whether it will finish a particular toy.</p>
          <p>Read the <a href="https://www.craftyarncouncil.com/standards/care-symbols">complete care instructions</a> for yarn and all other components. Test intended colors together under the permitted treatment before assembly. A fiber name or superwash label does not guarantee colorfastness. When making an item for a child, use an appropriate pattern and component guidance; this yarn comparison does not establish toy safety.</p>
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
