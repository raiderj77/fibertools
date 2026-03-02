import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StripeGeneratorTool from "./StripeGeneratorTool";

export const metadata: Metadata = {
  title: "Stripe Pattern Generator",
  description:
    "Generate random or custom stripe patterns with a live preview. Set colors, widths, and weights with per-color yardage estimates for any project.",
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
