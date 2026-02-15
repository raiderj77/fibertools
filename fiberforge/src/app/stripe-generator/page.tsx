import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StripeGeneratorTool from "./StripeGeneratorTool";

export const metadata: Metadata = {
  title: "Free Stripe Pattern Generator — Random & Weighted Stripes | FiberTools",
  description:
    "Generate random or structured stripe patterns for knitting and crochet. Customize colors, widths, and weights with a live visual preview and per-color yardage breakdown.",
  keywords: [
    "random stripe generator", "stripe pattern creator", "crochet stripe pattern",
    "knitting stripe pattern", "color stripe generator", "random stripe blanket pattern",
    "stripe sequence generator", "color order for striped blanket", "scrap yarn stripe pattern",
    "stash busting stripe generator", "stripe planner knitting",
  ],
};

export default function StripeGeneratorPage() {
  return (
    <ToolLayout slug="stripe-generator">
      <StripeGeneratorTool />
    </ToolLayout>
  );
}
