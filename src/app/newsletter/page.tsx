import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BeehiivSignup from "@/components/BeehiivSignup";

export const metadata: Metadata = {
  title: "Swatch Signal - Free Fiber Math Newsletter",
  description:
    "Get one practical swatch experiment, fiber-math walkthrough, and project-rescue checkpoint most weeks, plus the free Yarn Crafters Survival Kit.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "Swatch Signal by FiberTools",
    description: "A useful fiber-math note for makers, not a generic craft-content roundup.",
    type: "website",
    url: "https://fibertools.app/newsletter",
  },
};

const issueFormat = [
  {
    label: "The swatch",
    title: "One real measurement",
    body: "A before-and-after treatment example that shows what changed and why it matters.",
  },
  {
    label: "The math",
    title: "One worked decision",
    body: "A transparent formula for size, gauge, yarn, repeats, or shaping - with assumptions visible.",
  },
  {
    label: "The rescue",
    title: "One mistake to prevent",
    body: "A short checkpoint to run before buying yarn, restarting, cutting, seaming, or finishing.",
  },
  {
    label: "The vote",
    title: "One choice for readers",
    body: "A fixed, privacy-safe vote on the next calculator, experiment, printable, or product problem.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-bark-950">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-plum-500">
            Free FiberTools newsletter
          </p>
          <h1 className="font-display text-4xl font-bold text-bark-800 dark:text-cream-100 sm:text-6xl">
            Swatch Signal
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-bark-600 dark:text-cream-300">
            One practical fiber-math note most weeks. Each issue starts with a real project decision,
            shows the calculation, and links to the free tool that helps you check it yourself.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-plum-200 bg-plum-50 p-6 shadow-sm dark:border-bark-700 dark:bg-bark-800 sm:p-8">
          <h2 className="text-center font-display text-2xl font-bold text-bark-800 dark:text-cream-100">
            Join free and get the Survival Kit now
          </h2>
          <p className="mx-auto mb-6 mt-2 max-w-lg text-center text-sm leading-6 text-bark-500 dark:text-bark-300">
            The seven-page fillable and printable kit includes sourced yarn weights, tool conversions,
            swatch-to-finish math, yarn planning, and a project-rescue record.
          </p>
          <p className="mb-6 text-center text-sm leading-6 text-bark-600 dark:text-cream-300">
            After signup succeeds, a download button appears here. Save the PDF to your device;
            you do not need to wait for an email to download the kit.
          </p>
          <BeehiivSignup source="newsletter_page" />
        </div>

        <section className="mt-16" aria-labelledby="gift-preview-heading">
          <h2 id="gift-preview-heading" className="text-center font-display text-3xl font-bold text-bark-800 dark:text-cream-100">Look inside the free Survival Kit</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-bark-600 dark:text-cream-300">
            These are pages 5 and 7 from the actual seven-page PDF: a gift preview, not a newsletter issue.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <figure className="rounded-2xl border border-cream-300 bg-white p-4 dark:border-bark-700 dark:bg-bark-900">
              <a href="/survival-kit.pdf#page=5" className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum-500">
                <Image src="/images/newsletter/survival-kit-page-5.png" width={928} height={1200} sizes="(max-width: 640px) 90vw, 450px" alt="Page 5: Swatch-to-finish calculation. Open the PDF to read the full page." className="h-auto w-full" />
              </a>
              <figcaption className="mt-4 text-sm leading-6 text-bark-600 dark:text-cream-300">
                <strong>Swatch-to-finish calculation.</strong> The worked example compares 4.25 inches after treatment with 4 inches before treatment: about 6.25% growth. The page explains how to use the ratio and why it is an estimate.
              </figcaption>
            </figure>
            <figure className="rounded-2xl border border-cream-300 bg-white p-4 dark:border-bark-700 dark:bg-bark-900">
              <a href="/survival-kit.pdf#page=7" className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum-500">
                <Image src="/images/newsletter/survival-kit-page-7.png" width={928} height={1200} sizes="(max-width: 640px) 90vw, 450px" alt="Page 7: Fillable project-rescue record. Open the PDF to read the full page." className="h-auto w-full" />
              </a>
              <figcaption className="mt-4 text-sm leading-6 text-bark-600 dark:text-cream-300">
                <strong>Project-rescue record.</strong> Keep yarn and dye-lot details, before-and-after swatch measurements, target size, and your next decision together. Save a fresh copy for each project or print the page.
              </figcaption>
            </figure>
          </div>
          <p className="mt-5 text-center text-sm text-bark-600 dark:text-cream-300">
            <a href="/survival-kit.pdf" className="font-semibold text-plum-500 underline">Open the complete free kit (7-page PDF)</a>. No signup is needed to view these pages.
          </p>
        </section>

        <section className="mt-20" aria-labelledby="issue-format-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="issue-format-heading" className="font-display text-3xl font-bold text-bark-800 dark:text-cream-100">
              Built to save a project, not fill an inbox
            </h2>
            <p className="mt-3 text-bark-600 dark:text-cream-300">
              Every issue follows the same useful four-part rhythm.
            </p>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {issueFormat.map((item) => (
              <article key={item.label} className="rounded-2xl border border-cream-300 bg-white p-6 dark:border-bark-700 dark:bg-bark-900">
                <p className="text-xs font-semibold uppercase tracking-widest text-plum-500">{item.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-bark-800 dark:text-cream-100">{item.title}</h3>
                <p className="mt-3 leading-7 text-bark-600 dark:text-cream-300">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-2xl bg-sage-50 p-7 dark:bg-bark-800 sm:p-9">
          <h2 className="font-display text-2xl font-bold text-bark-800 dark:text-cream-100">The inbox promise</h2>
          <ul className="mt-4 space-y-3 text-bark-600 dark:text-cream-300">
            <li>No affiliate links inside the email; product guidance stays on clearly disclosed website pages.</li>
            <li>No copied patterns, private project text, or calculator results in analytics.</li>
            <li>No daily content treadmill. We send when there is a calculation or experiment worth keeping.</li>
            <li>Every issue includes an unsubscribe link, and the free calculators remain available without an account.</li>
          </ul>
        </section>

        <p className="mt-10 text-center text-sm text-bark-500 dark:text-bark-400">
          Want to see the methodology first? Read the{" "}
          <Link href="/formula-library" className="font-semibold text-plum-500 underline hover:text-plum-600">
            FiberTools Formula Library
          </Link>.
        </p>
      </section>
    </div>
  );
}
