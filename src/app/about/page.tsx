import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About Jason Ramirez — Your Friendly Developer",
  description:
    "The real story behind FiberTools. Built by Jason Ramirez, founder of FiberTools.",
  keywords: [
    "about FiberTools",
    "Your Friendly Developer",
    "Jason Ramirez",
    "fiber arts calculators",
    "knitting tools",
    "crochet tools",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "About Jason Ramirez — Your Friendly Developer",
    description:
      "The real story behind FiberTools. Built by Jason Ramirez, founder of FiberTools.",
    url: "https://fibertools.app/about",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FiberTools — Your Friendly Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Jason Ramirez — Your Friendly Developer",
    description:
      "The real story behind FiberTools. Built by Jason Ramirez, founder of FiberTools.",
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jason Ramirez",
  jobTitle: "Founder of FiberTools",
  sameAs: ["https://bsky.app/profile/friendlydeveloper.bsky.social"],
  worksFor: {
    "@type": "Organization",
    name: "Your Friendly Developer LLC",
  },
  url: "https://fibertools.app/about",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        About Your Friendly Developer
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Last updated: April 16, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <p>
          Hi. I&rsquo;m Jason Ramirez, the founder and only developer behind FiberTools.
        </p>

        <p>
          I built this site about a year ago for a simple reason: every fiber arts
          calculator I tried solved one problem and ignored the rest. I was constantly
          switching between five different tools &mdash; one for gauge, one for yardage,
          one for pattern conversion, one for stitch counts. So I built one tool that
          does all of it.
        </p>

        <p>
          FiberTools is a working maker&rsquo;s toolbox, not a content site with a
          calculator bolted on. I use it every day. The pages get updated when I find
          something missing.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            About FiberTools
          </h2>

          <p>
            Not every tool I build comes from personal crisis. Some just come
            from noticing a gap. FiberTools came from watching how scattered and
            inconsistent the information was for fiber artists trying to do basic
            calculations &mdash; yarn yardage, gauge conversions, needle sizes
            across international standards.
          </p>

          <p>
            I built this the same way I&rsquo;ve built everything: researching
            until I understood it well enough to make it useful for someone else.
            Every calculator is grounded in Craft Yarn Council (CYC) standards
            &mdash; the same classification system used by yarn manufacturers
            worldwide. The yarn weight system (0&ndash;7, Lace through Jumbo),
            recommended hook and needle sizes, and gauge ranges all follow CYC
            published specifications. The needle and hook conversion tables map
            US, metric, and UK sizing using manufacturer standards, not
            approximations.
          </p>

          <p>
            I verified every formula by hand before deploying it. Each calculator
            was tested against edge cases: extreme blanket dimensions, non-standard
            swatch sizes, stitch patterns that don&rsquo;t divide evenly into the
            target count. The increase/decrease calculator&rsquo;s distribution
            logic &mdash; spreading leftover stitches evenly so the spacing looks
            balanced rather than lumped at one end &mdash; took three rewrites to
            get right, because the naive approach produces results that experienced
            knitters immediately notice are wrong. The blocking calculator accounts
            for fiber-specific growth rates, because wool blocks differently than
            cotton, and a tool that ignores that distinction isn&rsquo;t actually
            useful.
          </p>

          <p>
            I&rsquo;m not a fiber artist. But I spent real time learning the craft
            well enough to build tools that fiber artists trust. That gap between
            &ldquo;technically correct math&rdquo; and &ldquo;actually useful for
            someone holding hooks and needles&rdquo; is where every design
            decision in this project lives. Every tool is free, ad-supported, and
            built to stay free.
          </p>

          <p>
            Built by a developer who respects the craft, even if I&rsquo;m not
            the one holding the needles.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mt-8 mb-3">
            Get in Touch
          </h2>
          <p>
            Have a suggestion, found a bug, or want to request a new tool?
            I&rsquo;d love to hear from you.
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
          <p>I read every message and do my best to respond within a few days.</p>
        </section>

        <hr className="border-bark-200 dark:border-bark-700 my-8" />

        <p className="text-sm text-bark-500 dark:text-cream-500">
          Jason Ramirez / Your Friendly Developer LLC
        </p>
      </div>
    </main>
  );
}
