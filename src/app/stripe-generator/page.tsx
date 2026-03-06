import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StripeGeneratorTool from "./StripeGeneratorTool";

export const metadata: Metadata = {
  title: "Stripe Pattern Generator — Free Online",
  description:
    "Generate random or custom stripe patterns with a live color preview. Control widths, color weights, and get per-color yardage estimates. Free, no login.",
  keywords: [
    "random stripe generator", "stripe pattern creator", "crochet stripe pattern",
    "knitting stripe pattern", "color stripe generator", "random stripe blanket pattern",
    "stripe sequence generator", "color order for striped blanket", "scrap yarn stripe pattern",
    "stash busting stripe generator", "stripe planner knitting",
  ],
  alternates: { canonical: "/stripe-generator" },
};

export default function StripeGeneratorPage() {
  return (
    <ToolLayout slug="stripe-generator">
      <StripeGeneratorTool />
    </ToolLayout>
  );
}
