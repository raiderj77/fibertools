import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AbbreviationGlossaryTool from "./AbbreviationGlossaryTool";

export const metadata: Metadata = {
  title: "Crochet & Knitting Abbreviations — Free",
  description:
    "Search 70+ knitting and crochet abbreviations with US/UK toggle. Includes a pattern translator. Free, instant lookup — no signup required.",
  keywords: [
    "knitting abbreviations", "crochet abbreviations", "crochet stitch abbreviations chart",
    "knitting terms", "UK vs US crochet terms", "what does sk mean in crochet",
    "sc2tog meaning", "ssk knitting abbreviation", "UK dc vs US dc crochet",
    "list of knitting abbreviations", "crochet terms glossary", "knitting stitch glossary",
  ],
  openGraph: {
    title: "Crochet & Knitting Abbreviations — Free",
    description:
      "Search 70+ knitting and crochet abbreviations with US/UK toggle. Includes a pattern translator. Free, instant lookup — no signup required.",
    url: "https://fibertools.app/abbreviation-glossary",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Crochet & Knitting Abbreviations — Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crochet & Knitting Abbreviations — Free",
    description:
      "Search 70+ knitting and crochet abbreviations with US/UK toggle. Includes a pattern translator. Free, instant lookup — no signup required.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/abbreviation-glossary" },
};

export default function AbbreviationGlossaryPage() {
  return (
    <ToolLayout slug="abbreviation-glossary">
      <div className="sr-only">
        <h2>Abbreviation and Stitch Glossary</h2>
        <h2>How to Search Knitting Abbreviations</h2>
        <h2>Stitch Abbreviation Reference and Definitions</h2>
      </div>
      <AbbreviationGlossaryTool />
    </ToolLayout>
  );
}
