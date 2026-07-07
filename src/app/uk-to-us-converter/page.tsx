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
        bottomLine="Paste any UK pattern text and get an instant US-terms translation, or use the reference table for individual terms."
        lastUpdated="2026-03-16"
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
          Why Do UK and US Crochet Abbreviations Mean Completely Different Stitches?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            The UK and US crochet terminology systems name the same stitch heights using different words, so a UK double crochet is actually a US single crochet. This happened because the two countries developed their stitch naming separately, and neither changed. The height of the stitch itself did not change, only what people called it.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Working from the wrong crochet terminology converter output will give you a finished piece in a completely different size and drape than the pattern intended. A blanket pattern that calls for UK double crochet will be very loose and floppy if you use a US double crochet instead, because you will have made a taller stitch. The density changes, and the project fails.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The easiest way to avoid errors is to look at the pattern source. Most modern patterns printed in the UK will note at the top whether they use UK or US terms. If you find a pattern online and are not sure which system it uses, check the stitch count against the finished dimensions. A pattern that seems tiny compared to the stitch count is probably using the UK terminology converter rules, and you will need to translate.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How Do I Know If a Pattern Uses British to American Crochet Terms?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Check if the pattern was published in the UK or sourced from a UK site, and look for labels like &quot;UK crochet abbreviations&quot; at the top of the pattern text. You can also test by working a small gauge swatch and comparing it to a listed finished dimension. If your swatch looks much looser than expected, you are likely using the wrong crochet terminology system.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Many vintage patterns and some modern British designs do not declare which system they use, expecting the reader to know. If you start a pattern and your stitch counts seem off compared to the measurements, pause and test your pattern translator theory with a practice swatch. A small double crochet swatch made with the pattern as written takes only a few minutes and will tell you if you need to convert the entire pattern before beginning.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Once you know which system a pattern uses, write it in the margin for future reference. This saves you from re-reading the pattern text next time you find the same source and keeps your pattern notebook consistent. Over time you will recognize common pattern conventions and need the converter less.
        </p>
      </section>
    </ToolLayout>
  );
}
