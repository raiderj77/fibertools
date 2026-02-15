import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Abbreviation & Stitch Glossary Online | FiberTools",
  description: "Searchable glossary of knitting and crochet abbreviations.",
};

export default function AbbreviationGlossaryPage() {
  return (
    <ToolLayout slug="abbreviation-glossary">
      <ComingSoon slug="abbreviation-glossary" />
    </ToolLayout>
  );
}
