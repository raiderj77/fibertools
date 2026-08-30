import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import ToolLayout from "@/components/ToolLayout";
import SockCalculatorTool from "./SockCalculatorTool";

export const metadata: Metadata = {
  title: "Sock Circumference Stitch Calculator",
  description:
    "Calculate a bounded circular sock stitch-count checkpoint from foot circumference, entered ease, measured gauge, and a required stitch multiple.",
  keywords: ["sock circumference calculator", "sock stitch count", "sock gauge calculator"],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  alternates: { canonical: "/sock-calculator" },
  openGraph: {
    title: "Sock Circumference Stitch Calculator",
    description: "Calculate a rounded sock circumference stitch checkpoint from measurements you enter.",
    url: "https://fibertools.app/sock-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sock Circumference Stitch Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sock Circumference Stitch Calculator",
    description: "Calculate a rounded sock circumference stitch checkpoint from measurements you enter.",
    images: ["/og-image.png"],
  },
  other: { dateModified: "2026-08-29" },
};

export default function SockCalculatorPage() {
  return (
    <ToolLayout
      slug="sock-calculator"
      widgetFirst
      focused
      nextAction={{
        href: "/gauge-calculator",
        label: "Check your gauge",
        description: "Measure a representative circular swatch before entering its stitch count and span.",
      }}
    >
      <AnswerBlock
        what="A bounded worksheet that converts entered foot circumference, ease, and measured stitch gauge into a circular stitch-count checkpoint rounded to a multiple you choose."
        who="Sock knitters checking one circumference count against a tested pattern and a representative circular swatch."
        bottomLine="The result is not a complete sock blueprint and does not infer cuff, heel, gusset, toe, foot length, or pull-on fit."
        lastUpdated="2026-08-29"
      />
      <SockCalculatorTool />
      <section className="mt-10">
        <h2 className="section-heading">How to use this checkpoint</h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Enter the negative-ease assumption required by your selected pattern rather than treating the default as a
          universal fit rule. Compare the rounded count, modeled circumference, and effective ease with a blocked
          swatch. Use a tested sock pattern for construction, shaping, length, and fit.
        </p>
      </section>
      <section className="mt-10 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          General yarn and gauge ranges are published by the{" "}
          <Link href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            className="text-sage-600 dark:text-sage-400 underline" target="_blank" rel="nofollow noopener">
            Craft Yarn Council
          </Link>. Your pattern and finished swatch remain the source for project-specific construction and fit.
        </p>
      </section>
    </ToolLayout>
  );
}
