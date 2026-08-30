import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import ToolLayout from "@/components/ToolLayout";
import VintagePatternDecoderTool from "./VintagePatternDecoderTool";

export const metadata: Metadata = {
  title: "Vintage Pattern Term Review, UK to US Reference",
  description:
    "Review pasted knitting or crochet pattern text. Preserve unknown and US wording, or map a supported set of UK terms to US wording after confirming the source convention.",
  keywords: [
    "vintage pattern terms",
    "UK to US crochet terms",
    "old knitting abbreviations",
    "pattern terminology review",
    "double crochet UK US",
    "treble crochet UK US",
  ],
  openGraph: {
    title: "Vintage Pattern Term Review, UK to US Reference",
    description:
      "Review pasted pattern text and map supported UK terms only after confirming the source convention.",
    url: "https://fibertools.app/vintage-pattern-decoder",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vintage Pattern Term Review",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintage Pattern Term Review, UK to US Reference",
    description:
      "Review pasted pattern text and map supported UK terms only after confirming the source convention.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/vintage-pattern-decoder" },
};

export default function VintagePatternDecoderPage() {
  return (
    <ToolLayout slug="vintage-pattern-decoder" widgetFirst>
      <AnswerBlock
        what="A text-only review tool for a bounded set of CYC-documented UK crochet terms and tension/gauge wording. Unknown and US modes preserve the text; explicit UK mode maps only the supported terms shown by the tool."
        who="Crafters who have a pattern excerpt and want a cautious terminology reference after checking the pattern key, publisher, or another reliable source."
        bottomLine="Paste an excerpt, choose the source convention, and review any mapped terms and possible clues. The result does not validate the pattern or determine its age, origin, sizing, or yarn requirements."
        lastUpdated="2026-08-29"
      />

      <VintagePatternDecoderTool />

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          Confirm the terminology convention before converting
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          UK and US crochet instructions can use the same word or abbreviation for different stitches. For example, UK double crochet corresponds to US single crochet, while US double crochet remains double crochet. A date, photograph, gauge line, or isolated word is not enough to settle the convention on its own.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Start with the pattern&apos;s own abbreviation key and publisher information. If those do not establish the convention, leave the tool on Unknown. That mode reports limited possible signals but deliberately makes no substitutions. US mode also preserves the text. Only select UK when you have established that the instructions use UK terms.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100">
          What the output does not establish
        </h2>
        <p className="mb-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          This tool applies a finite term map. It does not interpret custom stitch definitions, validate row math, convert needle or hook sizes, estimate modern yardage from ounces, or prove where or when a pattern was published. Unsupported text stays unchanged.
        </p>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          Check every highlighted change against the source key, then make a gauge swatch before starting the project. When a bare needle or hook number appears, verify its millimeter diameter with a source-specific chart instead of inferring the sizing system.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="vintage-references-heading">
        <h2
          id="vintage-references-heading"
          className="mb-3 text-xl font-semibold text-bark-800 dark:text-cream-100"
        >
          Reference
        </h2>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
          The crochet term pairs and tension/gauge wording used for substitutions
          come from the{" "}
          <a
            href="https://www.craftyarncouncil.com/standards/crochet-abbreviations"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-plum-700 underline decoration-plum-300 underline-offset-2 hover:text-plum-800 dark:text-plum-300 dark:hover:text-plum-200"
          >
            Craft Yarn Council Crochet Abbreviations Master List
          </a>
          . Older wording shown under Possible Source Signals stays unchanged and
          should be checked against the source pattern&apos;s own key.
        </p>
      </section>

      <p style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>
        For a dedicated crochet term table, use the{" "}
        <Link href="/uk-to-us-converter">UK to US Converter</Link>. For a
        broader reference, see the{" "}
        <Link href="/abbreviation-glossary">Abbreviation Glossary</Link> and
        verify each definition against the pattern&apos;s own key.
      </p>
    </ToolLayout>
  );
}
