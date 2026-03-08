import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FiberTools",
  description:
    "Free crochet and knitting calculators built by a fiber arts maker. No signup, no fees, no data collected. New tools added regularly.",
  keywords: ["about FiberTools", "fiber arts calculators", "knitting tools", "crochet tools"],
  openGraph: {
    title: "About FiberTools",
    description:
      "Free crochet and knitting calculators built by a fiber arts maker. No signup, no fees, no data collected. New tools added regularly.",
    url: "https://fibertools.app/about",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "About FiberTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About FiberTools",
    description:
      "Free crochet and knitting calculators built by a fiber arts maker. No signup, no fees, no data collected. New tools added regularly.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/about" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://fibertools.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: "https://fibertools.app/about",
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-8">
        About FiberTools
      </h1>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Made by a Maker, for Makers
          </h2>
          <p>
            FiberTools started because I was frustrated. I picked up fiber arts
            a couple of months ago and quickly realized that the tools and
            references scattered across the internet were either clunky, buried
            in ads, or locked behind a signup wall. I wanted something
            better&mdash;fast, accurate calculators that work the way crafters
            actually think.
          </p>
          <p>So I built them myself.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What You&rsquo;ll Find Here
          </h2>
          <p>
            FiberTools is a growing collection of{" "}
            <strong>free calculators and references</strong> for crochet,
            knitting, weaving, spinning, and embroidery:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Yarn &amp; fiber</strong> &mdash; yarn weight, yardage
              estimates, fiber content
            </li>
            <li>
              <strong>Gauge &amp; sizing</strong> &mdash; gauge calculators,
              blanket sizing, hat sizing
            </li>
            <li>
              <strong>Needles &amp; hooks</strong> &mdash; size converters, hook
              guides, needle comparisons
            </li>
            <li>
              <strong>Specialty crafts</strong> &mdash; weaving sett, spinning
              ratios, tapestry planning
            </li>
            <li>
              <strong>Stitch tools</strong> &mdash; stitch counters,
              increase/decrease calculators
            </li>
          </ul>
          <p>
            New tools are added regularly, and I&rsquo;m always looking for
            ideas on what to build next.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How I Build
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Accuracy first.</strong> Fiber arts math matters. I
              double-check every formula and test with real-world values.
            </li>
            <li>
              <strong>No gatekeeping.</strong> No signup walls, no premium tiers,
              no email harvesting. Open the page, use the tool.
            </li>
            <li>
              <strong>Mobile-ready.</strong> Most of us reach for our phone
              mid-project. Every tool works on any screen size.
            </li>
            <li>
              <strong>Privacy by design.</strong> All calculations happen in your
              browser. I don&rsquo;t collect or store your project data.
            </li>
          </ul>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Get in Touch
          </h2>
          <p>
            Have a suggestion, found a bug, or want to request a new tool?
            I&rsquo;d love to hear from you. Your feedback is what makes
            FiberTools better for everyone.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>
          </p>
          <p>
            I read every message and do my best to respond within a few days.
          </p>
        </section>
      </div>
    </main>
  );
}
