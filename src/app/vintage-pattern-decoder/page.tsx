import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import VintagePatternDecoderTool from "./VintagePatternDecoderTool";

export const metadata: Metadata = {
  title: "Vintage Pattern Decoder, Translate Old Knitting & Crochet Patterns",
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
    title: "Vintage Pattern Decoder, Translate Old Knitting & Crochet Patterns",
    description:
      "Translate vintage knitting and crochet patterns into modern terms. Converts UK to US crochet stitches, old abbreviations, and era-specific terminology. Free, instant, no signup.",
    url: "https://fibertools.app/vintage-pattern-decoder",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Vintage Pattern Decoder, Translate Old Knitting & Crochet Patterns" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintage Pattern Decoder, Translate Old Knitting & Crochet Patterns",
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
          what="A pattern translator that converts vintage and UK knitting and crochet abbreviations into modern US terminology, including all UK-to-US stitch name conversions, archaic abbreviations like 'wl fwd' and 'psso,' and era detection."
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

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How should I handle vintage knitting pattern abbreviations that look unfamiliar or cryptic?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Vintage patterns often use shorthand that differs from today. Common abbreviations like &quot;sl st&quot; (slip stitch), &quot;inc&quot; (increase), &quot;dec&quot; (decrease), and &quot;yo&quot; (yarn over) are mostly consistent across eras, but patterns from the 1940s-1980s sometimes use single letters or incomplete words that are easy to misread. The key is to identify what abbreviation style the pattern uses and stay consistent throughout the entire project.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Start by reading the pattern abbreviations key at the front. Older patterns always list their abbreviations somewhere, though it might be under a different heading like &quot;Explanations&quot; or &quot;Terms Used.&quot; Circle or highlight abbreviations you do not recognize immediately. If the key is missing, look for context clues: a &quot;k&quot; that appears alone or before a number almost always means knit, and &quot;p&quot; means purl. In crochet patterns, &quot;ch&quot; is chain and &quot;dc&quot; can mean double crochet in US patterns or double treble in UK patterns (which is why pattern date and origin country matter).
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Some vintage abbreviations have fallen out of fashion but are still correct: &quot;tog&quot; means together, &quot;wyif&quot; or &quot;wl fwd&quot; means with yarn in front, and &quot;ssk&quot; (slip slip knit) was less common in very old patterns. Keep a written list of these beside you as you work rather than relying on memory. Many fiber artists photograph or photocopy the abbreviations page so they can refer to it without stopping the flow of their knitting.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What should I watch for when translating 1960s or 1970s crochet pattern translation into today&rsquo;s terms?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Mid-century crochet patterns are especially tricky because many were originally written in UK terminology even if they were published in the US. A stitch labeled simply &quot;dc&quot; could mean a US single crochet if the pattern came from an American source, but a UK double crochet (which equals US single crochet) if it came from a European magazine or pattern book. The best clue is the finished dimensions: if &quot;dc&quot; is meant to create a loose, lacy fabric, you likely need US single crochet; if it creates a denser fabric, check whether the stitch count suggests UK terms.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Always test your translation on a small swatch before committing to the entire project. Work 20 stitches and a few rows using the stitch you think is correct, measure it, and compare it to any schematic or gauge information in the pattern. Vintage patterns often omit gauge entirely, so this swatch is your safety check. If the swatch is looser or tighter than the pattern photo suggests, flip to the alternate stitch (UK vs. US) and try again.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Pay special attention to specialty stitches like &quot;treble&quot; or &quot;long treble&quot; because these changed names and heights over time. Modern patterns are usually clear about whether they mean US treble or UK treble, but vintage patterns often assume the reader already knows. Write these out on your swatch notes and take a photo so you have a record of your final decision. This becomes especially helpful if you set the project aside and return to it months later.
        </p>
      </section>
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
