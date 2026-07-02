import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About Jason Ramirez — the maker behind FiberTools",
  description:
    "FiberTools is built by Jason Ramirez — a developer and counselor in recovery who took up crochet as a mindful hobby and makes accurate, free fiber-arts tools. The real, human story.",
  keywords: [
    "about FiberTools",
    "Jason Ramirez",
    "fiber arts calculators",
    "knitting tools",
    "crochet tools",
    "crochet for mental health",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "About Jason Ramirez — the maker behind FiberTools",
    description:
      "The real, human story behind FiberTools — built by Jason Ramirez, a developer and counselor in recovery who crochets.",
    url: "https://fibertools.app/about",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FiberTools — Jason Ramirez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Jason Ramirez — the maker behind FiberTools",
    description:
      "The real, human story behind FiberTools — built by Jason Ramirez, a developer and counselor in recovery who crochets.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/about" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://fibertools.app/about" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jason Ramirez",
  jobTitle: "Founder & Developer, FiberTools",
  description:
    "Developer and counselor in recovery who took up crochet as a mindful hobby and builds free, accurate fiber-arts tools.",
  knowsAbout: ["Crochet", "Knitting", "Fiber arts", "Web development"],
  sameAs: ["https://bsky.app/profile/friendlydeveloper.bsky.social"],
  worksFor: { "@type": "Organization", name: "Your Friendly Developer LLC" },
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
        About Jason Ramirez
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Last updated: June 30, 2026</p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <p>
          Hi. I&rsquo;m Jason Ramirez &mdash; the maker behind FiberTools. Not a faceless
          &ldquo;team,&rdquo; not a content farm. One person who builds these tools and
          uses them.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why I make things
          </h2>
          <p>
            I&rsquo;m a developer and a counselor, and I&rsquo;m in recovery. Crochet is
            one of the mindful hobbies &mdash; alongside photography, coding, and building
            tools like this one &mdash; that keeps my hands and my mind busy and keeps me
            grounded. I picked it up for exactly that reason.
          </p>
          <p>
            I&rsquo;m open about the recovery part on purpose. For me, recovery is about
            giving back what was so freely given to me. If you&rsquo;re reading this and
            you&rsquo;re struggling, please know you&rsquo;re not alone, and it&rsquo;s
            okay to reach out:
          </p>
          <ul>
            <li>
              <strong>988</strong> &mdash; Suicide &amp; Crisis Lifeline (call or text,
              24/7)
            </li>
            <li>
              <strong>SAMHSA National Helpline:</strong>{" "}
              <a href="tel:1-800-662-4357" className="text-sage-600 dark:text-sage-400 underline">
                1-800-662-4357
              </a>{" "}
              &mdash; free, confidential, 24/7 treatment referral and information
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why FiberTools exists
          </h2>
          <p>
            Every fiber-arts calculator I tried solved one problem and ignored the rest
            &mdash; one for gauge, one for yardage, one for pattern conversion, one for
            stitch counts. So I built one toolbox that does all of it, free and without a
            login. It&rsquo;s a working maker&rsquo;s toolbox, not a content site with a
            calculator bolted on. I use it every day, and the pages get updated when I find
            something missing.
          </p>
          <p>
            Every calculator is grounded in Craft Yarn Council (CYC) standards &mdash; the
            same classification system yarn manufacturers use worldwide. The yarn weight
            system (0&ndash;7, Lace through Jumbo), recommended hook and needle sizes, and
            gauge ranges all follow CYC published specifications. The needle and hook
            conversion tables map US, metric, and UK sizing using manufacturer standards,
            not approximations.
          </p>
          <p>
            I verified every formula by hand before deploying it, and tested each one
            against edge cases: extreme blanket dimensions, odd swatch sizes, stitch
            patterns that don&rsquo;t divide evenly. The increase/decrease
            calculator&rsquo;s even-distribution logic took three rewrites to get right,
            because the naive approach produces spacing that experienced crocheters and
            knitters immediately notice is wrong.
          </p>
          <p>
            And now that I crochet myself, I test these against real projects &mdash; my
            first lopsided granny squares, a gauge swatch that came out too tight, the
            skein I under-bought. That gap between &ldquo;technically correct math&rdquo;
            and &ldquo;actually useful when you&rsquo;re holding a hook&rdquo; is where
            every design decision in this project lives. I&rsquo;m a beginner at the craft,
            and honestly that helps: I remember exactly which parts are confusing. Every
            tool is free, ad-supported, and built to stay free.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mt-8 mb-3">
            Get in Touch
          </h2>
          <p>
            Have a suggestion, found a bug, or want to request a new tool? I&rsquo;d love
            to hear from you.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:hello@fibertools.app" className="text-sage-600 dark:text-sage-400 underline">
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
