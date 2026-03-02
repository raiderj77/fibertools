import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UKToUSConverterTool from "./UKToUSConverterTool";

export const metadata: Metadata = {
  title: "UK to US Crochet Term Converter",
  description:
    "Convert UK crochet patterns to US terms and back. Paste your pattern for automatic conversion of abbreviations, vintage terms, and stitch names.",
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
};

export default function UKToUSConverterPage() {
  return (
    <ToolLayout slug="uk-to-us-converter">
      <UKToUSConverterTool />
    </ToolLayout>
  );
}
