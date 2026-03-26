import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StripeGeneratorTool from "./StripeGeneratorTool";

export const metadata: Metadata = {
  title: "Stripe Pattern Generator — Free Online",
  description:
    "Generate random or custom stripe patterns with live color preview. Control widths, color weights, and get per-color yardage. Free, no login.",
  keywords: [
    "random stripe generator", "stripe pattern creator", "crochet stripe pattern",
    "knitting stripe pattern", "color stripe generator", "random stripe blanket pattern",
    "stripe sequence generator", "color order for striped blanket", "scrap yarn stripe pattern",
    "stash busting stripe generator", "stripe planner knitting",
  ],
  openGraph: {
    title: "Stripe Pattern Generator — Free Online",
    description:
      "Generate random or custom stripe patterns with live color preview. Control widths, color weights, and get per-color yardage. Free, no login.",
    url: "https://fibertools.app/stripe-generator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stripe Pattern Generator — Free Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stripe Pattern Generator — Free Online",
    description:
      "Generate random or custom stripe patterns with live color preview. Control widths, color weights, and get per-color yardage. Free, no login.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stripe-generator" },
};

export default function StripeGeneratorPage() {
  return (
    <ToolLayout slug="stripe-generator">
      <AnswerBlock
        what="A stripe pattern generator that creates random or custom color sequences with a live preview, adjustable widths, and per-color yardage estimates."
        who="Knitters and crocheters making striped projects who want to visualize color combinations before committing to a pattern."
        bottomLine="Add your colors, set your preferences, and generate stripe patterns until you find one you love — then get the yardage breakdown."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Stripe Pattern Generator Tool</h2>
        <h2>How to Generate Stripe Patterns</h2>
        <h2>Stripe Pattern Results and Yardage Estimates</h2>
      </div>
      <StripeGeneratorTool />
    </ToolLayout>
  );
}
