import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import UKToUSConverterTool from "./UKToUSConverterTool";

export const metadata: Metadata = {
  title: "UK to US Crochet Terms Converter",
  description:
    "Replace listed UK and US crochet terms in one pass while preserving text that is not in the converter map.",
  keywords: [
    "uk to us crochet terms",
    "crochet term converter",
    "uk us crochet conversion",
    "convert uk crochet pattern to us",
    "british to american crochet terms",
    "crochet terminology converter",
    "uk double crochet to us",
    "treble crochet us equivalent",
    "crochet term replacement",
    "uk crochet abbreviations",
    "us crochet abbreviations",
    "vintage crochet terms",
    "wool over yarn over",
    "crochet term differences",
    "uk vs us crochet stitches",
  ],
  openGraph: {
    title: "UK to US Crochet Terms Converter",
    description:
      "Replace listed UK and US crochet terms in one pass while preserving text that is not in the converter map.",
    url: "https://fibertools.app/uk-to-us-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "UK to US Crochet Terms Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK to US Crochet Terms Converter",
    description:
      "Replace listed UK and US crochet terms in one pass while preserving text that is not in the converter map.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/uk-to-us-converter" },
};

export default function UKToUSConverterPage() {
  return (
    <ToolLayout slug="uk-to-us-converter">
      <AnswerBlock
        what="A one-pass replacer for the listed UK and US crochet terms and abbreviations. Text outside its term map stays unchanged."
        who="Crocheters who have already identified the terminology system used by their source and want help replacing known mapped terms."
        bottomLine="Use the output as a terminology aid, not as a complete pattern translation or validation; verify stitch counts, gauge, construction, and the source convention."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>UK to US Crochet Terms Converter</h2>
        <h2>How to Convert Crochet Terminology</h2>
        <h2>Crochet Term Conversion Results and Reference</h2>
      </div>
      <UKToUSConverterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does this crochet term converter change?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The converter finds only terms in its displayed mapping, chooses the longest matching term, and replaces each source match once. It does not feed generated output back through the map.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          That one-pass behavior matters because terms overlap. For example, a mapped phrase such as &ldquo;double treble crochet&rdquo; must be handled as one token before shorter phrases such as &ldquo;treble crochet.&rdquo; The replacement count reports matched terms, not changed words.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Punctuation, whitespace, numbers, and non-mapped text are preserved. Preservation does not mean the complete output is correct: the converter does not interpret charts, validate instructions, resolve ambiguous abbreviations, or infer whether an unlabeled pattern uses UK or US terms.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How should you verify the converted crochet terms?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Start with the terminology label supplied by the designer or publisher. Then compare the mapped terms with the pattern&rsquo;s abbreviation key and any stitch definitions.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          If the source does not identify its convention, publication location alone is not conclusive. Look for explicit stitch descriptions, charts, photos, gauge information, or a trusted edition rather than asking this text replacer to decide.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Before committing to a project, work the designer&rsquo;s gauge sample and confirm that the converted instructions preserve the stated counts and construction. Leave any unfamiliar or unsupported term unchanged until you can verify it from an authoritative reference.
        </p>
      </section>
    </ToolLayout>
  );
}
