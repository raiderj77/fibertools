import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StripeGeneratorTool from "./StripeGeneratorTool";

export const metadata: Metadata = {
  title: "Stripe Row Pattern Generator",
  description:
    "Create a bounded stripe row sequence with fixed, ranged, or palette-order modes and a live color preview. Row shares do not estimate yarn use.",
  keywords: [
    "random stripe generator", "stripe pattern creator", "crochet stripe pattern",
    "knitting stripe pattern", "color stripe generator", "random stripe blanket pattern",
    "stripe sequence generator", "color order for striped blanket", "scrap yarn stripe pattern",
    "stash busting stripe generator", "stripe planner knitting",
  ],
  openGraph: {
    title: "Stripe Row Pattern Generator",
    description:
      "Create a bounded stripe row sequence with fixed, ranged, or palette-order modes and a live color preview. Row shares do not estimate yarn use.",
    url: "https://fibertools.app/stripe-generator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stripe Row Pattern Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stripe Row Pattern Generator",
    description:
      "Create a bounded stripe row sequence with fixed, ranged, or palette-order modes and a live color preview. Row shares do not estimate yarn use.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stripe-generator" },
};

export default function StripeGeneratorPage() {
  return (
    <ToolLayout slug="stripe-generator" widgetFirst>
      <AnswerBlock
        what="A bounded stripe-row planner that assigns palette colors and whole-number row counts using fixed, ranged, or palette-sequence rules."
        who="Knitters and crocheters comparing possible color orders and stripe widths before choosing a project plan."
        bottomLine="The output is a row sequence and row-share summary only. It does not estimate yarn use or tell you how much of each color to buy."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Stripe Pattern Generator Tool</h2>
        <h2>How to Generate Stripe Patterns</h2>
        <h2>Stripe Row Plan and Color Row Shares</h2>
      </div>
      <StripeGeneratorTool />
    </ToolLayout>
  );
}
