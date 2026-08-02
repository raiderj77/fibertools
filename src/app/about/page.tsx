import type { Metadata } from "next";
import { JsonLd } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "About FiberTools, free fiber arts calculators",
  description:
    "Learn why FiberTools exists, how its free fiber arts calculators are tested, and which published craft standards guide the formulas.",
  keywords: [
    "about FiberTools",
    "FiberTools editorial standards",
    "fiber arts calculators",
    "knitting tools",
    "crochet tools",
    "crochet for mental health",
  ],
  authors: [{ name: "FiberTools Editorial Team", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "About FiberTools",
    description:
      "Why FiberTools exists and how its free fiber arts calculators are built and tested.",
    url: "https://fibertools.app/about",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FiberTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About FiberTools",
    description:
      "Why FiberTools exists and how its free fiber arts calculators are built and tested.",
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

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FiberTools",
  description:
    "The team that maintains FiberTools calculators and references against published fiber arts standards.",
  knowsAbout: ["Crochet", "Knitting", "Fiber arts", "Web development"],
  parentOrganization: { "@type": "Organization", name: "Your Friendly Developer LLC" },
  url: "https://fibertools.app/about",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={aboutSchema} />

      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        About FiberTools
      </h1>
      <p className="text-sm text-gray-600 mt-1 mb-8">Last updated: June 30, 2026</p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <p>
          FiberTools is a focused collection of calculators and references for knitters,
          crocheters, weavers, spinners, embroiderers, and cross-stitchers. The goal is simple:
          make practical project math easier to understand and verify.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why these tools are maintained
          </h2>
          <p>
            FiberTools was started by a developer and crochet hobbyist who wanted reliable craft
            calculators in one place instead of scattered across unrelated websites.
          </p>
          <p>
            Making can also be a grounding activity. That perspective shapes the site: interfaces
            should be calm, instructions should be direct, and results should explain the math
            instead of asking visitors to trust a black box.
          </p>
          <p>
            If crafting is part of how you cope and you are struggling, you are not alone. It is
            okay to ask for help. These US resources are available at any time:
          </p>
          <ul>
            <li>
              <strong>988</strong> is the Suicide and Crisis Lifeline. You can call or
              text, any time, day or night.
            </li>
            <li>
              <strong>SAMHSA National Helpline:</strong>{" "}
              <a href="tel:1-800-662-4357" className="text-sage-600 dark:text-sage-400 underline">
                1-800-662-4357
              </a>
              . It is free and private. Someone is there all day and all night. They can
              help you find care.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why FiberTools exists
          </h2>
          <p>
            Many fiber arts calculators solve only one narrow problem. FiberTools brings gauge,
            yarn planning, size conversion, row tracking, and related references together. The
            tools are free to use and do not require an account.
          </p>
          <p>
            FiberTools is designed as a working toolbox for makers. Missing cases and confusing
            results are treated as product defects and repaired as they are found.
          </p>
          <p>
            Where an industry standard applies, FiberTools references Craft Yarn Council (CYC)
            yarn weights, needle sizes, hook sizes, and gauge ranges. Construction calculators
            explain their additional measurements and assumptions instead of presenting them as
            universal standards.
          </p>
          <p>
            Formulas are checked with ordinary and edge-case inputs, including large blankets,
            odd swatch sizes, and stitch counts that do not divide evenly. Automated checks guard
            the most important calculation, privacy, accessibility, and revenue paths.
          </p>
          <p>
            The tools are also reviewed against real project-planning mistakes, such as tight
            gauge, uneven motifs, and buying too little yarn. Every current calculator is free.
            Advertising may help cover the cost of keeping the site available.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mt-8 mb-3">
            Get in Touch
          </h2>
          <p>
            Have an idea, a bug report, or a request for a new tool? Send it to the address below.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:hello@fibertools.app" className="text-sage-600 dark:text-sage-400 underline">
              hello@fibertools.app
            </a>
          </p>
          <p>Messages are reviewed regularly, with a goal of replying within a few days.</p>
        </section>

        <hr className="border-bark-200 dark:border-bark-700 my-8" />

        <p className="text-sm text-bark-500 dark:text-cream-500">
          FiberTools is maintained by Your Friendly Developer LLC.
        </p>
      </div>
    </div>
  );
}
