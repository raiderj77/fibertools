import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import UKToUSConverterTool from "./UKToUSConverterTool";

export const metadata: Metadata = {
  title: "UK to US Knitting & Crochet Terms Converter",
  description:
    "Convert UK to US knitting and crochet terms instantly. Paste any British pattern for automatic conversion of abbreviations and stitch names. Free.",
  keywords: [
    "uk to us crochet terms",
    "crochet term converter",
    "uk us crochet conversion",
    "convert uk crochet pattern to us",
    "british to american crochet terms",
    "crochet terminology converter",
    "uk double crochet to us",
    "treble crochet us equivalent",
    "crochet pattern translator",
    "uk crochet abbreviations",
    "us crochet abbreviations",
    "vintage crochet terms",
    "wool over yarn over",
    "crochet term differences",
    "uk vs us crochet stitches",
  ],
  openGraph: {
    title: "UK to US Knitting & Crochet Terms Converter",
    description:
      "Convert UK to US knitting and crochet terms instantly. Paste any British pattern for automatic conversion of abbreviations and stitch names. Free.",
    url: "https://fibertools.app/uk-to-us-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "UK to US Knitting & Crochet Terms Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK to US Knitting & Crochet Terms Converter",
    description:
      "Convert UK to US knitting and crochet terms instantly. Paste any British pattern for automatic conversion of abbreviations and stitch names. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/uk-to-us-converter" },
};

export default function UKToUSConverterPage() {
  return (
    <ToolLayout slug="uk-to-us-converter">
      <AnswerBlock
        what="A converter that translates UK knitting and crochet terminology to US terms, including automatic pattern text conversion."
        who="Crafters working from a British pattern who need to convert stitch names and abbreviations to their US equivalents."
        bottomLine="Paste any UK pattern text and get an instant US-terms translation — or use the reference table for individual terms."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>UK to US Crochet Terms Converter</h2>
        <h2>How to Convert Crochet Terminology</h2>
        <h2>Crochet Term Conversion Results and Reference</h2>
      </div>
      <UKToUSConverterTool />
    </ToolLayout>
  );
}
