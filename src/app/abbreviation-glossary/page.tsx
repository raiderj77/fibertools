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
  alternates: { canonical: "/abbreviation-glossary" },
};

export default function AbbreviationGlossaryPage() {
  return (
    <ToolLayout slug="abbreviation-glossary">
      <AbbreviationGlossaryTool />
    </ToolLayout>
  );
}
