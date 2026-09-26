import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ThreadConverterTool from "./ThreadConverterTool";

export const metadata: Metadata = {
  title: { absolute: "DMC to Anchor Thread Converter: Archived Chart" },
  description:
    "Look up a limited sourced subset of an archived Anchor stranded-cotton conversion chart. Physical color and current availability require verification.",
  keywords: [
    "DMC to anchor conversion", "thread conversion chart", "embroidery floss converter",
    "DMC color chart", "anchor to DMC", "DMC 310 anchor cross-reference",
    "archived Anchor conversion chart", "embroidery thread brand comparison",
    "embroidery thread converter online", "cross stitch thread conversion",
    "DMC anchor chart",
  ],
  openGraph: {
    title: "DMC and Anchor Archived Thread Chart Lookup",
    description:
      "Look up a limited sourced subset of an archived Anchor stranded-cotton conversion chart. Physical color and current availability require verification.",
    url: "https://fibertools.app/thread-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "DMC and Anchor archived thread chart lookup" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMC and Anchor Archived Thread Chart Lookup",
    description:
      "Look up a limited sourced subset of an archived Anchor stranded-cotton conversion chart. Physical color and current availability require verification.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/thread-converter" },
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <AnswerBlock
        what="A limited DMC and Anchor lookup from an archived Anchor stranded-cotton chart. Cosmo mappings are not supplied."
        who="Cross stitchers and embroiderers checking thread substitution options."
        bottomLine="Chart pairings are historical suggestions, not exact color equivalents. Compare current physical shade cards before substituting."
        lastUpdated="2026-09-05"
      />
      <ThreadConverterTool />

    </ToolLayout>
  );
}
