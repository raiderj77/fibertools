import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NeedleGuideTool from "./NeedleGuideTool";

export const metadata: Metadata = {
  title: "Sewing Needle Types & Sizes — Free Guide",
  description:
    "Visual guide to sewing needle types: tapestry, chenille, embroidery, sharps, beading, and more. Find the right needle instantly. Free.",
  keywords: [
    "sewing needle types",
    "tapestry needle vs chenille needle",
    "yarn needle",
    "embroidery needle",
    "needle types for crochet",
    "needle types for sewing",
    "darning needle",
    "beading needle",
    "quilting needle",
    "needle size chart",
    "which needle for weaving in ends",
    "craft needle guide",
    "sewing needle comparison",
    "chenille needle uses",
    "tapestry needle uses",
  ],
  openGraph: {
    title: "Sewing Needle Types & Sizes — Free Guide",
    description:
      "Visual guide to sewing needle types: tapestry, chenille, embroidery, sharps, beading, and more. Find the right needle instantly. Free.",
    url: "https://fibertools.app/needle-guide",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Sewing Needle Types & Sizes — Free Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sewing Needle Types & Sizes — Free Guide",
    description:
      "Visual guide to sewing needle types: tapestry, chenille, embroidery, sharps, beading, and more. Find the right needle instantly. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/needle-guide" },
};

export default function NeedleGuidePage() {
  return (
    <ToolLayout slug="needle-guide">
      <div className="sr-only">
        <h2>Sewing and Craft Needle Guide</h2>
        <h2>How to Choose the Right Needle</h2>
        <h2>Needle Types and Recommended Uses</h2>
      </div>
      <NeedleGuideTool />
    </ToolLayout>
  );
}
