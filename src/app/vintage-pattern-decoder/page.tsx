import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import VintagePatternDecoderTool from "./VintagePatternDecoderTool";

export const metadata: Metadata = {
  title: "Vintage Pattern Decoder — Translate Old Knitting & Crochet Patterns",
  description:
    "Translate vintage knitting and crochet patterns into modern terms. Converts UK to US crochet stitches, old abbreviations, and era-specific terminology. Free, instant, no signup.",
  keywords: [
    "vintage pattern decoder",
    "translate old crochet pattern",
    "vintage knitting pattern translator",
    "UK to US crochet conversion",
    "old crochet abbreviations",
    "vintage pattern abbreviations",
    "decode vintage knitting pattern",
    "1960s crochet pattern translation",
    "double crochet to single crochet UK US",
    "treble crochet US conversion",
    "vintage wool pattern translator",
    "old knitting abbreviations explained",
    "crochet pattern translator UK",
    "vintage fiber arts patterns",
    "cast off bind off conversion",
  ],
  openGraph: {
    title: "Vintage Pattern Decoder — Translate Old Knitting & Crochet Patterns",
    description:
      "Translate vintage knitting and crochet patterns into modern terms. Converts UK to US crochet stitches, old abbreviations, and era-specific terminology. Free, instant, no signup.",
    url: "https://fibertools.app/vintage-pattern-decoder",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Vintage Pattern Decoder — Translate Old Knitting & Crochet Patterns" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintage Pattern Decoder — Translate Old Knitting & Crochet Patterns",
    description:
      "Translate vintage knitting and crochet patterns into modern terms. Converts UK to US crochet stitches, old abbreviations, and era-specific terminology. Free, instant, no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/vintage-pattern-decoder" },
};

export default function VintagePatternDecoderPage() {
  return (
    <>
      <ToolLayout slug="vintage-pattern-decoder" widgetFirst>
        <AnswerBlock
          what="A pattern translator that converts vintage and UK knitting and crochet abbreviations into modern US terminology — including all UK-to-US stitch name conversions, archaic abbreviations like 'wl fwd' and 'psso,' and era detection."
          who="Anyone working from a vintage pattern published before 1990, a UK pattern, or any pattern using terminology that does not match modern US conventions."
          bottomLine="Paste your vintage pattern text and get an instant decoded version with highlighted substitutions, a terms table, and warnings about needle sizes or measurements that need conversion."
          lastUpdated="2026-05-03"
        />
        <div className="sr-only">
          <h2>Vintage Pattern Decoder</h2>
          <h2>How to Translate Old Knitting and Crochet Patterns</h2>
          <h2>UK to US Crochet Stitch Conversion Reference</h2>
        </div>
        <VintagePatternDecoderTool />
        <p style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>
          Working on a vintage-inspired project?{" "}
          <Link href="/uk-to-us-converter">UK to US Converter</Link> has a
          full side-by-side stitch reference, and the{" "}
          <Link href="/abbreviation-glossary">Abbreviation Glossary</Link>{" "}
          covers every modern abbreviation you might encounter after translating.
        </p>
      </ToolLayout>
    </>
  );
}
