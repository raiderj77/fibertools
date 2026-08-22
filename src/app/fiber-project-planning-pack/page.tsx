import type { Metadata } from "next";
import Link from "next/link";
import PlanningPackActions from "./PlanningPackActions";
import { normalizeCheckoutUrl } from "@/lib/offer-links.mjs";

export const metadata: Metadata = {
  title: "Fiber Project Planning Pack — $17 Digital Workbook",
  description:
    "A 12-page fillable and printable PDF workbook for planning yarn, gauge, costs, finishing, and troubleshooting across crochet and knitting projects.",
  alternates: { canonical: "/fiber-project-planning-pack" },
  openGraph: {
    title: "Fiber Project Planning Pack — $17",
    description: "Plan the practical details of a crochet or knitting project in one reusable 12-page PDF workbook.",
    url: "https://fibertools.app/fiber-project-planning-pack",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "FiberTools Fiber Project Planning Pack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiber Project Planning Pack — $17",
    description: "A fillable and printable project-planning workbook for crocheters and knitters.",
    images: ["https://fibertools.app/og-image.png"],
  },
};

const included = [
  ["Project brief", "Capture the pattern, recipient, timeline, and project purpose."],
  ["Swatch record", "Keep hook or needle, stitch, fiber, and measured swatch notes together."],
  ["Yarn-lot log", "Record yarn details and dye lots before labels get separated from the project."],
  ["Gauge worksheet", "Compare target and measured gauge and document the adjustment you choose."],
  ["Project-cost sheet", "Add yarn, notions, tools, and other planned costs without promising savings."],
  ["Finishing checklist", "Track assembly, ends, blocking, care notes, and final review."],
  ["Troubleshooting notes", "Document what happened, what you tried, and what you will test next."],
];

const faqs = [
  ["What do I receive?", "One 12-page PDF workbook with fillable fields that can also be printed and completed by hand."],
  ["Is this a pattern?", "No. It is a general planning workbook and does not contain instructions for making a specific project."],
  ["Can I reuse it?", "Yes, for your own personal project planning. Keep a clean copy and save or print a new working copy for each project."],
  ["Will it calculate yarn or gauge for me?", "No. The workbook helps you organize inputs and decisions. FiberTools calculators can help with estimates, but you remain responsible for checking project requirements."],
  ["How is it delivered?", "When checkout is enabled, the checkout provider supplies the digital-delivery instructions. FiberTools does not expose the product file through this page."],
];

export default function FiberProjectPlanningPackPage() {
  // A public checkout URL is not sufficient by itself: the paid revision must
  // first be moved to an owner-approved private delivery source.
  const checkoutUrl = process.env.PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED === "true"
    ? normalizeCheckoutUrl(process.env.NEXT_PUBLIC_PLANNING_PACK_CHECKOUT_URL)
    : null;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Fiber Project Planning Pack",
    description: "A 12-page fillable and printable PDF workbook for planning crochet and knitting projects.",
    brand: { "@type": "Brand", name: "FiberTools" },
    url: "https://fibertools.app/fiber-project-planning-pack",
    ...(checkoutUrl
      ? {
          offers: {
            "@type": "Offer",
            price: "17.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: checkoutUrl,
          },
        }
      : {}),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
      { "@type": "ListItem", position: 2, name: "Fiber Project Planning Pack" },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {[productSchema, faqSchema, breadcrumbSchema].map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <nav className="mb-5 flex items-center gap-2 text-sm text-bark-500" aria-label="Breadcrumb">
        <Link href="/" className="text-sage-600 underline">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Fiber Project Planning Pack</span>
      </nav>

      <section className="overflow-hidden rounded-3xl border border-sage-200 bg-gradient-to-br from-sage-50 via-white to-plum-50 px-5 py-10 dark:border-sage-800 dark:from-sage-950/30 dark:via-bark-900 dark:to-plum-950/20 sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-sage-700 dark:text-sage-300">Fillable and printable PDF</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-bark-800 dark:text-cream-100 sm:text-5xl">Fiber Project Planning Pack</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bark-700 dark:text-cream-300">
          A practical 12-page workbook for keeping yarn, gauge, costs, finishing tasks, and project decisions in one place before and during a crochet or knitting project.
        </p>
        <p className="mt-4 text-sm font-semibold text-bark-600 dark:text-bark-300">$17 one-time purchase. Digital PDF; no physical item is shipped.</p>
        <div className="mt-7"><PlanningPackActions checkoutUrl={checkoutUrl} trackPageView /></div>
      </section>

      <section className="mt-14">
        <h2 className="section-heading">What is inside</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-cream-300 bg-white p-5 dark:border-bark-700 dark:bg-bark-900">
              <h3 className="font-bold text-bark-800 dark:text-cream-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="section-heading">Designed for real project notes</h2>
          <ul className="mt-5 space-y-3 text-bark-600 dark:text-bark-400">
            <li>✓ Fill fields on a computer or tablet with a compatible PDF reader.</li>
            <li>✓ Print the pages you need and write on them by hand.</li>
            <li>✓ Use the workbook with crochet or knitting projects.</li>
            <li>✓ Keep decisions and troubleshooting notes with the project record.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/20">
          <h2 className="text-xl font-bold text-bark-800 dark:text-cream-100">What it does not do</h2>
          <p className="mt-3 text-sm leading-relaxed text-bark-700 dark:text-cream-300">
            The pack is an organizational aid, not a pattern, calculator, professional instruction, or guarantee of project results. It does not verify measurements, yarn needs, gauge, fit, safety, costs, or pattern accuracy. Check all project inputs and follow the yarn, pattern, and tool-maker guidance that applies to your project.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-heading">Frequently asked questions</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-xl border border-cream-300 bg-white p-5 dark:border-bark-700 dark:bg-bark-900">
              <summary className="cursor-pointer font-semibold text-bark-700 dark:text-cream-200">{question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-sage-200 bg-sage-50 p-6 text-center dark:border-sage-800 dark:bg-sage-950/20 sm:p-8">
        <h2 className="text-2xl font-bold text-bark-800 dark:text-cream-100">Plan the project before the details scatter</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-bark-600 dark:text-bark-400">One reusable workbook format for the information you want beside the project.</p>
        <div className="mt-6 flex justify-center"><PlanningPackActions checkoutUrl={checkoutUrl} /></div>
      </section>
    </div>
  );
}
