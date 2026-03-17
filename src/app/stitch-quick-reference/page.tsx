import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import StitchQuickReferenceTool from "./StitchQuickReferenceTool";

export const metadata: Metadata = {
  title: "Stitch Quick Reference — Crochet & Knitting",
  description:
    "Visual step-by-step guide for every basic crochet and knitting stitch. Yarn overs, pull-throughs, turning chains, and loop counts at a glance. Free.",
  keywords: [
    "crochet stitch diagram",
    "how to double crochet",
    "crochet stitch reference",
    "single crochet steps",
    "half double crochet tutorial",
    "treble crochet instructions",
    "crochet stitch height chart",
    "yarn over pull through count",
    "basic crochet stitches guide",
    "knit stitch steps",
    "purl stitch diagram",
    "crochet turning chain chart",
    "stitch quick reference card",
    "how many yarn overs double crochet",
    "crochet stitch comparison chart",
    "front post double crochet steps",
    "magic ring instructions",
    "crochet stitches for beginners",
  ],
  openGraph: {
    title: "Stitch Quick Reference — Crochet & Knitting",
    description:
      "Visual step-by-step guide for every basic crochet and knitting stitch. Yarn overs, pull-throughs, turning chains, and loop counts at a glance. Free.",
    url: "https://fibertools.app/stitch-quick-reference",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Stitch Quick Reference — Crochet & Knitting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch Quick Reference — Crochet & Knitting",
    description:
      "Visual step-by-step guide for every basic crochet and knitting stitch. Yarn overs, pull-throughs, turning chains, and loop counts at a glance. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/stitch-quick-reference" },
};

export default function StitchQuickReferencePage() {
  return (
    <ToolLayout slug="stitch-quick-reference">
      <div className="sr-only">
        <h2>Stitch Quick Reference Guide</h2>
        <h2>How to Use the Stitch Reference</h2>
        <h2>Step-by-Step Stitch Instructions and Diagrams</h2>
      </div>
      <StitchQuickReferenceTool />
    </ToolLayout>
  );
}
