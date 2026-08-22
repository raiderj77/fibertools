import type { Metadata } from "next";
import Link from "next/link";
import DesignerPreflightCta from "./DesignerPreflightCta";
import DesignerPreflightForm from "./DesignerPreflightForm";
import { getDesignerPreflightAction } from "@/lib/designer-preflight-availability";

export const metadata: Metadata = {
  title: "Crochet Designer Pattern Preflight Review — $39 Pilot",
  description: "A manual $39 crochet pattern preflight for one version of one pattern up to 10 pages, delivered as one written review report.",
  alternates: { canonical: "/designer-pattern-preflight" },
  openGraph: {
    title: "Designer Pattern Preflight — $39 Manual Crochet Review",
    description: "Find possible pattern problems before testers or professional tech editing with a structured manual preflight report.",
    url: "https://fibertools.app/designer-pattern-preflight",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "FiberTools Designer Pattern Preflight" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Designer Pattern Preflight — $39 Pilot",
    description: "A structured manual preflight report for independent crochet pattern designers.",
    images: ["https://fibertools.app/og-image.png"],
  },
};

const included = [
  "One submitted crochet pattern, one version, up to 10 pages",
  "Supported stitch-count arithmetic and written totals",
  "Repeated or skipped row and round numbers",
  "Mixed US and UK terminology",
  "Undefined abbreviations and inconsistent stitch names",
  "Missing materials, gauge, finished measurements, assembly, or finishing information",
  "References to missing photos, charts, sections, or diagrams",
  "Possible formatting inconsistencies and instructions that require human review",
];

const excluded = [
  "Professional tech editing, certification, or a guarantee that the pattern is error-free",
  "Pattern rewriting, editing, grading, ownership transfer, or ongoing consultation and revision rounds",
  "Physical testing of fit, shape, assembly, gauge, yarn performance, or the finished item",
  "Verification of unsupported or ambiguous instructions when the pattern lacks enough information",
  "Clinical, legal, copyright, or business advice",
  "AI analysis, AI training, or AI-generated pattern content",
];

const faqs = [
  ["What is included for $39?", "One submitted crochet pattern, one version, up to 10 pages; a manual math and consistency review; and one written PDF report."],
  ["Is this professional tech editing?", "No. It is an affordable manual preflight designed to flag possible problems before pattern testing or professional tech editing."],
  ["Does the service rewrite my pattern?", "No. The report identifies findings and suggests what to review; it does not rewrite, edit, grade, transfer ownership of, or provide ongoing consultation for the pattern."],
  ["Are submitted patterns used to train AI?", "No. Submitted patterns are not used for AI training, public examples, marketing, or product development without separate written permission."],
  ["How is my pattern stored?", "The pilot accepts a customer-controlled private Google Drive, Dropbox, or OneDrive link. FiberTools stores the link and submission details in a private database; it does not copy your pattern into a public bucket."],
  ["When is my pattern deleted?", "FiberTools manually deletes the stored share link and customer submission details no later than 30 days after the report is delivered, except limited payment records that must be retained for accounting or legal purposes."],
  ["Which file types are accepted?", "Share a PDF, DOCX, or TXT file through a supported private share link. Direct uploads are not enabled during this pilot."],
  ["What if part of the pattern cannot be verified?", "The report labels it Human review required or Missing information instead of guessing or assigning a confidence score."],
  ["Does the review support US and UK crochet terms?", "Yes. You can identify the pattern as US, UK, mixed, or unsure, and the review looks for mixed or inconsistent terminology."],
  ["Will the service check finished sizing and fit?", "No. Sizing, fit, gauge accuracy, yarn performance, grading, assembly results, and the physical finished item are outside this pilot."],
  ["How long does the review take?", "The target is three business days after payment and working access to the complete pattern. Missing access or information can delay the start."],
];

export default function DesignerPatternPreflightPage() {
  const action = getDesignerPreflightAction();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Designer Pattern Preflight",
    description: "A manual crochet pattern preflight review that flags possible arithmetic issues, inconsistencies, missing information, and areas requiring human review.",
    url: "https://fibertools.app/designer-pattern-preflight",
    provider: { "@type": "Organization", name: "FiberTools", url: "https://fibertools.app" },
    ...(action.mode === "checkout"
      ? { offers: { "@type": "Offer", price: "39.00", priceCurrency: "USD", availability: "https://schema.org/InStock" } }
      : {}),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Designer Pattern Preflight" },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {[serviceSchema, faqSchema, breadcrumbSchema].map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <nav className="mb-5 flex items-center gap-2 text-sm text-bark-500" aria-label="Breadcrumb">
        <Link href="/" className="text-sage-600 underline">Home</Link><span aria-hidden="true">/</span><span>Designer Pattern Preflight</span>
      </nav>

      <section className="overflow-hidden rounded-3xl border border-plum-200 bg-gradient-to-br from-plum-50 via-white to-sage-50 px-5 py-10 dark:border-plum-800 dark:from-plum-950/30 dark:via-bark-900 dark:to-sage-950/20 sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-plum-600 dark:text-plum-300">Manual validation pilot</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-bark-800 dark:text-cream-100 sm:text-5xl">Designer Pattern Preflight</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bark-700 dark:text-cream-300">
          An affordable preflight review designed to flag possible errors, inconsistencies, and missing information before your crochet pattern reaches testers or a professional tech editor.
        </p>
        <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <DesignerPreflightCta mode={action.mode} inquiryUrl={action.mode === "inquiry" ? action.inquiryUrl : undefined} />
          <a href="#sample-report" className="btn-secondary">See a fictional sample report</a>
        </div>
        <p className="mt-4 text-sm text-bark-500 dark:text-bark-400"><strong>$39 for one pattern, one version, up to 10 pages, and one written report.</strong> Target delivery: three business days after payment and working pattern access.</p>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="section-heading">Who this pilot is for</h2>
          <p className="leading-relaxed text-bark-600 dark:text-bark-400">Independent crochet designers, Etsy and Ravelry pattern sellers, and designers preparing for pattern testing or professional tech editing.</p>
          <h2 className="section-heading mt-10">What gets reviewed</h2>
          <ul className="space-y-3 text-bark-600 dark:text-bark-400">{included.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-sage-600">✓</span><span>{item}</span></li>)}</ul>
        </section>
        <section className="rounded-2xl border border-cream-300 bg-white p-6 dark:border-bark-700 dark:bg-bark-900 sm:p-8">
          <h2 className="section-heading">What it does not review</h2>
          <ul className="space-y-3 text-bark-600 dark:text-bark-400">{excluded.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-rose-600">—</span><span>{item}</span></li>)}</ul>
          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-bark-700 dark:bg-amber-950/20 dark:text-cream-300">Findings are labeled <strong>Confirmed issue</strong>, <strong>Possible inconsistency</strong>, <strong>Missing information</strong>, or <strong>Human review required</strong>. If something cannot be supported from the pattern, the report says so instead of guessing.</p>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="section-heading">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-5">
          {(action.mode === "checkout"
            ? ["Share the pattern", "Pay the $39 pilot fee", "Receive confirmation", "Manual review", "Report by email"]
            : ["Ask about availability", "Receive pilot instructions", "Share only after acceptance", "Manual review", "Report by email"]
          ).map((step, index) => (
            <li key={step} className="rounded-xl border border-cream-300 bg-white p-4 dark:border-bark-700 dark:bg-bark-900"><span className="text-sm font-bold text-plum-600">{index + 1}</span><p className="mt-2 font-semibold text-bark-700 dark:text-cream-200">{step}</p></li>
          ))}
        </ol>
      </section>

      <section id="sample-report" className="mt-14 scroll-mt-20 rounded-2xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-950/20 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-sage-700 dark:text-sage-300">Fictional sample — not a customer pattern</p>
        <h2 className="mt-2 text-2xl font-bold text-bark-800 dark:text-cream-100">Northwind Cowl preflight excerpt</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-sage-200 bg-white dark:border-sage-800 dark:bg-bark-900" tabIndex={0} aria-label="Fictional sample report findings">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-sage-100 text-bark-700 dark:bg-sage-950/40 dark:text-cream-200"><tr><th className="p-3">Location</th><th className="p-3">Category</th><th className="p-3">What was found</th><th className="p-3">Why it matters / review next</th></tr></thead>
            <tbody className="divide-y divide-sage-100 text-bark-600 dark:divide-bark-700 dark:text-bark-400">
              <tr><td className="p-3">Round 8</td><td className="p-3 font-semibold">Confirmed issue</td><td className="p-3">Supported repeat math creates 72 stitches; the written total says 70.</td><td className="p-3">The next round may start from the wrong count. Check the repeat or written total.</td></tr>
              <tr><td className="p-3">Abbreviations</td><td className="p-3 font-semibold">Missing information</td><td className="p-3">“FPdc” is used but not defined.</td><td className="p-3">A tester may interpret it differently. Add the term to the abbreviation list.</td></tr>
              <tr><td className="p-3">Finishing</td><td className="p-3 font-semibold">Human review required</td><td className="p-3">The seam instruction does not identify which edges meet.</td><td className="p-3">Clarify the assembly orientation and consider a diagram. Professional tech editing is still recommended.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <h2 className="section-heading">Pilot price: $39</h2>
          <ul className="space-y-3 text-bark-600 dark:text-bark-400">
            <li>One submitted crochet pattern, one version, up to 10 pages</li><li>One written, structured report delivered as a PDF</li><li>Math and consistency findings supported by the submitted version</li><li>No rewriting, grading, ownership transfer, ongoing consultation, or professional certification</li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-bark-500 dark:text-bark-400">Prefer to check round math yourself first? Use the free <Link href="/amigurumi-pattern-checker" className="text-sage-600 underline">amigurumi pattern checker</Link>. It processes supported text locally in your browser.</p>
        </div>
        <div id={action.mode === "checkout" ? "submit-pattern" : "pilot-inquiry"} className="scroll-mt-20 rounded-2xl border border-plum-200 bg-plum-50 p-5 dark:border-plum-800 dark:bg-plum-950/20 sm:p-8">
          {action.mode === "checkout" ? (
            <>
              <h2 className="text-2xl font-bold text-bark-800 dark:text-cream-100">Submit a pattern</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">No account and no public upload. Your private share link and contact details are stored only for fulfillment and retention handling.</p>
              <DesignerPreflightForm />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-bark-800 dark:text-cream-100">Pilot inquiries are open</h2>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-bark-600 dark:text-bark-400">Online submission and payment are not open. Ask about availability without sending your pattern, private share link, or payment information.</p>
              <DesignerPreflightCta mode="inquiry" inquiryUrl={action.inquiryUrl} />
            </>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-heading">Frequently asked questions</h2>
        <div className="grid gap-4 lg:grid-cols-2">{faqs.map(([question, answer]) => <details key={question} className="rounded-xl border border-cream-300 bg-white p-5 dark:border-bark-700 dark:bg-bark-900"><summary className="cursor-pointer font-semibold text-bark-700 dark:text-cream-200">{question}</summary><p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-400">{answer}</p></details>)}</div>
      </section>
    </div>
  );
}
