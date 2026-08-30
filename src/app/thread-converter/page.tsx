import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ThreadConverterTool from "./ThreadConverterTool";

export const metadata: Metadata = {
  title: "DMC, Anchor & Cosmo Thread Table Lookup",
  description:
    "Search 80 included DMC, Anchor, and Cosmo cross-reference rows, save a reference palette, or run bounded exact-code batch lookups.",
  keywords: [
    "DMC to anchor conversion", "thread conversion chart", "embroidery floss converter",
    "DMC color chart", "anchor to DMC", "DMC 310 anchor cross-reference",
    "convert DMC to Cosmo thread", "embroidery thread brand comparison",
    "embroidery thread converter online", "cross stitch thread conversion",
    "DMC anchor cosmo chart",
  ],
  openGraph: {
    title: "DMC, Anchor & Cosmo Thread Table Lookup",
    description:
      "Search 80 included DMC, Anchor, and Cosmo cross-reference rows or run bounded exact-code batch lookups.",
    url: "https://fibertools.app/thread-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "DMC, Anchor, and Cosmo thread table lookup" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMC, Anchor & Cosmo Thread Table Lookup",
    description:
      "Search 80 included DMC, Anchor, and Cosmo cross-reference rows or run bounded exact-code batch lookups.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/thread-converter" },
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <AnswerBlock
        what="A limited reference table with 80 included DMC, Anchor, and Cosmo cross-reference rows. Search browses the table; batch mode returns exact rows in the included table."
        who="Cross stitchers and embroiderers checking whether a known DMC, Anchor, or Cosmo code appears in this included table."
        bottomLine="Unknown codes stay unknown, and codes with multiple included rows show every recorded row for you to verify. Compare physical skeins when color is critical."
        lastUpdated="2026-08-29"
      />
      <div className="sr-only">
        <h2>Included DMC, Anchor, and Cosmo table</h2>
        <h2>Exact thread-code lookup</h2>
        <h2>Unknown and ambiguous thread codes</h2>
      </div>
      <ThreadConverterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What Does This Thread Table Support?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            This tool contains 80 cross-reference rows for DMC, Anchor, and Cosmo only. It does not include Sulky or other brands, and it does not calculate a nearest color from photos, swatches, or color measurements.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Search mode is for browsing the included table: it can find partial text or codes and show up to 30 rows. Exact batch lookup accepts no more than 100 codes and checks each complete code against the selected source-brand column. It does not turn a partial code into a substitution.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          A code absent from the table is reported as unknown. Some Anchor or Cosmo codes occur in more than one included row; batch lookup reports every such row instead of silently choosing one. The table makes no inference beyond its recorded entries.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How Should You Use an Included Cross-Reference Row?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A row means only that those codes are recorded together in this included reference table. It is not a guarantee that the threads are physically identical or suitable for every design.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          On-screen color chips are orientation aids only. Displays, lighting, dye lots, fiber, and finish can all change how a thread appears. For color-critical work, compare current manufacturer references and physical skeins under the lighting you expect to use.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          If a code produces multiple exact rows, check the pattern source and the current brand chart before selecting thread. If it produces no row, treat it as unsupported by this table rather than as a recommendation for another color.
        </p>
      </section>
    </ToolLayout>
  );
}
