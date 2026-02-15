import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AbbreviationGlossaryTool from "./AbbreviationGlossaryTool";

export const metadata: Metadata = {
  title: "Free Knitting & Crochet Abbreviation Glossary — Searchable with UK/US Toggle | FiberTools",
  description:
    "Searchable glossary of 70+ knitting and crochet abbreviations with US/UK term toggle, category filters, and a pattern translator that explains any line of a pattern.",
  keywords: [
    "knitting abbreviations", "crochet abbreviations", "crochet stitch abbreviations chart",
    "knitting terms", "UK vs US crochet terms", "what does sk mean in crochet",
    "sc2tog meaning", "ssk knitting abbreviation", "UK dc vs US dc crochet",
    "list of knitting abbreviations", "crochet terms glossary", "knitting stitch glossary",
  ],
};

export default function AbbreviationGlossaryPage() {
  return (
    <ToolLayout slug="abbreviation-glossary">
      <AbbreviationGlossaryTool />
    </ToolLayout>
  );
}
