import type { Metadata } from "next";
import Link from "next/link";

const description = "A printable planned pooling project pack with worksheets, three worked projects, a dye-lot checklist, and a troubleshooting grid. All calculators stay free.";
export const metadata: Metadata = {
  title: "Planned Pooling Project Pack — $12 Printable PDF",
  description,
  authors: [{ name: "FiberTools" }],
  alternates: { canonical: "/planned-pooling-project-pack" },
  openGraph: { title: "Planned Pooling Project Pack — $12", description, url: "https://fibertools.app/planned-pooling-project-pack", images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "FiberTools Planned Pooling Project Pack" }] },
  twitter: { card: "summary_large_image", title: "Planned Pooling Project Pack — $12", description, images: ["https://fibertools.app/og-image.png"] },
  other: { datePublished: "2026-10-31", dateModified: "2026-10-31" },
};

const faqs = [
  ["Why pay when the calculator is free?", "All FiberTools calculators stay free, including the pooling preview. The pack adds printable worksheets and worked projects to help you carry a trial width into a project record."],
  ["Is this a crochet pattern?", "No, it is a planning PDF rather than a pattern or a calculator. The three worked projects show modeled counts and yardage arithmetic, not complete making instructions."],
  ["Will my yarn make the pictured type of pooling?", "No pooling outcome is guaranteed by a project name or a stitch grid. Swatch your own yarn because tension, partial-stitch boundaries, joins, and repeat variation can change the fabric."],
  ["How is yardage estimated?", "Divide measured swatch yards by swatch rows, then multiply by planned rows and panels at the same worked width. Add your chosen allowance and round skein purchases up; chains, edges, and finishing need separate consideration."],
  ["How do I get the PDF?", "Checkout opens when the pack is ready and its payment link is configured. The delivery page is linked from the Stripe confirmation; keep the email and link because access is link-based with no account."],
  ["How is this different from the Fiber Project Planning Pack?", "This pack focuses on planned pooling trials, repeat counts, and worked pooling examples. The separate Fiber Project Planning Pack is a general fillable and printable workbook for yarn, gauge, costs, and finishing across crochet and knitting projects."],
];

function PackActions({ checkoutUrl }: { checkoutUrl: string | undefined }) {
  return <div className="mt-5 flex flex-col items-start gap-4">
    {checkoutUrl ? <a href={checkoutUrl} className="btn-primary">Buy the Planned Pooling Project Pack — $12</a> : <p className="font-semibold">Checkout opens soon — the pack is being prepared.</p>}
    <Link href="/color-pooling-calculator" className="underline text-sage-700 dark:text-sage-300">Try the free pooling calculator</Link>
  </div>;
}

export default function PlannedPoolingProjectPackPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_POOLING_PACK_URL?.trim();
  const productSchema = {
    "@context": "https://schema.org", "@type": "Product", name: "Planned Pooling Project Pack", description,
    brand: { "@type": "Brand", name: "FiberTools" }, url: "https://fibertools.app/planned-pooling-project-pack",
    ...(checkoutUrl ? { offers: { "@type": "Offer", price: "12.00", priceCurrency: "USD", url: checkoutUrl, availability: "https://schema.org/InStock" } } : {}),
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" }, { "@type": "ListItem", position: 2, name: "Planned Pooling Project Pack" }] };
  return <div className="mx-auto max-w-4xl px-4 py-12 text-bark-800 dark:text-cream-100 [&_section]:mt-10 [&_p]:mt-4 [&_p]:leading-relaxed [&_li]:mt-3">
    {[productSchema, faqSchema, breadcrumbSchema].map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    <nav aria-label="Breadcrumb" className="mb-5 text-sm"><Link href="/" className="underline">Home</Link> <span aria-hidden="true">/</span> Planned Pooling Project Pack</nav>
    <h1 className="text-4xl font-bold">Planned Pooling Project Pack</h1>
    <p className="text-sm">By <Link href="/about" className="underline">FiberTools</Link> · Published October 31, 2026 · Updated October 31, 2026</p>
    <p className="text-lg">A printable PDF for taking a planned pooling trial into a project: worksheets, 3 worked projects, a dye-lot checklist, and a troubleshooting grid. $12 one-time purchase; digital download, no physical item. All FiberTools calculators remain free.</p>
    <PackActions checkoutUrl={checkoutUrl} />
    <section><h2 className="section-heading">What is a planned pooling project pack?</h2>
      <p>It is a printable planning record for measured repeats, trial widths, yarn estimates, and swatch observations. It is not a calculator, not a pattern, and not a guarantee of a pooling outcome. Real fabric must be checked with your own yarn and tension.</p>
    </section>
    <section><h2 className="section-heading">What is inside</h2><ul className="list-disc pl-6">
      <li>Worksheets for repeat measurements, trial widths, swatches, and project yardage.</li>
      <li>Three worked projects: Argyle Drift Scarf, Plaid Columns Blanket Panel, and a third pooling example for comparing repeat shifts.</li>
      <li>A dye-lot checklist for recording labels, repeat variation, and skein transitions.</li>
      <li>A troubleshooting grid for recording a symptom, possible cause, and next swatch test.</li>
    </ul></section>
    <section><h2 className="section-heading">Methodology and assumptions</h2><ul className="list-disc pl-6">
      <li><strong>Stitch model:</strong> Worked examples use the same stitch model as the free calculator: row width = repeat + adjustment; shift per row = row width mod repeat. Color consumption continues across rows; turned return rows reverse display direction.</li>
      <li><strong>Measured yardage:</strong> Project yards = (swatch yards ÷ swatch rows) × project rows × panels, using the same worked width, stitch, and tension. With allowance = project yards × (1 + allowance percent ÷ 100); skeins = round up(with allowance ÷ yards per skein).</li>
      <li><strong>Assumptions:</strong> Whole stitches only, a representative repeating color sequence, and no chain consumption. Foundation and turning chains, joins, edges, finishing, and tension changes are not modeled; measure and allow for them separately.</li>
    </ul></section>
    <section><h2 className="section-heading">Worked example: Project 1 — Argyle Drift Scarf</h2>
      <p>This modeled example uses Fingering (CYC 1) yarn and crochet moss stitch. Deep Teal 6 + Coral 4 + Cream 6 + Plum 4 = 20 stitches per repeat. With adjustment +1, row width = 20 + 1 = 21; shift per row = 21 mod 20 = 1. The 12 preview row-start offsets are 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.</p>
      <p>At 220 project rows and 1 panel, 220 total rows × 21 stitches = 4620 stitches. The example swatch uses 6.5 yards over 10 rows: 0.65 yards per row × 220 rows = 143 yards. A 20% allowance gives 171.6 yards; at 231 yards per skein, round up to 1 skein. These are example measurements, not a promise for your yarn or an instruction to make an argyle pattern.</p>
      <PackActions checkoutUrl={checkoutUrl} />
    </section>
    <section><h2 className="section-heading">Best for / not for</h2><p>Best for makers with a repeating variegated yarn who want to record physical swatches, compare whole-stitch trials, and keep a printable project plan. Not for someone seeking a complete pattern, automatic yarn measurement, guaranteed argyle, or a substitute for testing inconsistent repeats.</p></section>
    <section><h2 className="section-heading">Compare the planning options</h2>
      <div className="overflow-x-auto"><table className="mt-5 w-full text-left [&_th]:p-3 [&_td]:p-3 [&_tr]:border-b"><caption className="text-left">Free preview and optional printable workbooks</caption><thead><tr><th scope="col">Feature</th><th scope="col">Free pooling calculator</th><th scope="col">Planned Pooling Project Pack</th><th scope="col">Fiber Project Planning Pack</th></tr></thead><tbody>
        <tr><th scope="row">Price</th><td>Free</td><td>$12 one-time</td><td>$17 one-time</td></tr>
        <tr><th scope="row">Format</th><td>Interactive browser preview</td><td>Printable PDF</td><td>12-page fillable and printable PDF</td></tr>
        <tr><th scope="row">Worksheets</th><td>No printable project workbook</td><td>Pooling measurements, trials, yardage</td><td>Project brief, swatch, gauge, cost, finishing</td></tr>
        <tr><th scope="row">Worked projects</th><td>Your entered trial</td><td>3 modeled projects</td><td>General blank planning records</td></tr>
        <tr><th scope="row">Scope</th><td>Idealized stitch placement</td><td>Pooling project planning</td><td>General crochet and knitting planning</td></tr>
      </tbody></table></div>
    </section>
    <section><h2 className="section-heading">How to choose</h2><p>Start with the <Link href="/color-pooling-calculator" className="underline">free pooling calculator</Link> to compare a measured repeat and trial width. Choose this pack when you want printed pooling worksheets and worked examples beside your swatch; choose the <Link href="/fiber-project-planning-pack" className="underline">Fiber Project Planning Pack</Link> for general yarn, gauge, costs, and finishing records.</p>
      <p>Why pay when the calculator is free? The calculators stay free; this pack is the printable, worked bridge from a preview to your project notes. You can keep using the preview and your own notebook without buying anything.</p>
    </section>
    <section><h2 className="section-heading">Frequently asked questions</h2><div className="mt-5 space-y-4">{faqs.map(([question, answer]) => <details key={question} className="rounded-xl border border-cream-300 p-5 dark:border-bark-700"><summary className="cursor-pointer font-semibold">{question}</summary><p>{answer}</p></details>)}</div></section>
    <section><h2 className="section-heading">Keep your next pooling trial together</h2><p>Record the repeat, test the worked width, and check your physical swatch before committing to the project.</p><PackActions checkoutUrl={checkoutUrl} /><p>Already purchased? Use the download link in your Stripe payment confirmation to get your PDF.</p></section>
  </div>;
}
