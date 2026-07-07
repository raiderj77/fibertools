import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import ThreadConverterTool from "./ThreadConverterTool";

export const metadata: Metadata = {
  title: "Embroidery Thread Converter, DMC & Anchor",
  description:
    "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
  keywords: [
    "DMC to anchor conversion", "thread conversion chart", "embroidery floss converter",
    "DMC color chart", "anchor to DMC", "DMC 310 anchor equivalent",
    "convert DMC to Cosmo thread", "embroidery thread brand comparison",
    "embroidery thread converter online", "cross stitch thread conversion",
    "DMC anchor cosmo chart",
  ],
  openGraph: {
    title: "Embroidery Thread Converter, DMC & Anchor",
    description:
      "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
    url: "https://fibertools.app/thread-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Embroidery Thread Converter, DMC & Anchor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embroidery Thread Converter, DMC & Anchor",
    description:
      "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/thread-converter" },
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <AnswerBlock
        what="A converter that translates between DMC, Anchor, and Cosmo embroidery thread numbers with palette building and bulk conversion for shopping lists."
        who="Cross stitchers and embroiderers who need to substitute thread brands when their preferred brand is unavailable."
        bottomLine="Enter any DMC, Anchor, or Cosmo number to find the closest match in the other brands instantly."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Embroidery Thread Converter Tool</h2>
        <h2>How to Convert Thread Numbers</h2>
        <h2>Thread Conversion Results Across Brands</h2>
      </div>
      <ThreadConverterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          Why Do Different Embroidery Thread Brands Use Different Numbers?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Each embroidery thread brand assigns its own number codes to colors, and there is no universal system. DMC, Anchor, and Cosmo all number their threads independently, so a red shade might be DMC 321 but Anchor 47. The numbers tell you nothing about the actual color without knowing which brand made the thread.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Think of thread numbers the same way you think of clothing sizes from different companies. A size medium from one brand fits differently than a size medium from another, and the only way to know if they match is to compare them directly. Thread brands created their number systems decades apart, and none of them talk to each other. A brand might skip numbers, create gaps, or renumber colors entirely over time. The physical thread itself is the only truth.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          This is why embroidery thread converters exist. They hold samples or careful color data so you can swap brands without guessing. When your pattern calls for Anchor 47 but your local shop stocks only DMC, the converter finds the closest DMC match by looking at the actual color, not trying to make numbers line up. Using a conversion chart is much faster and more reliable than holding thread samples up to your computer screen.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How Close Is an Embroidery Thread Converter Match Really?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Most embroidery floss conversions are very close but not pixel-perfect matches. Brands dye thread slightly differently, use different fiber blends, and update their color lines over time. A converted color will look nearly identical from three feet away and excellent in a finished project, but a direct side-by-side comparison might show a subtle difference in tone.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The accuracy depends on how common the color is. Popular shades like black, white, red, and navy have many near-perfect matches across all brands because they are easier to dye consistently. Unusual colors, metallics, or very light pastels are harder to match perfectly because fewer choices exist and each brand might mix them slightly differently. If you are stitching a design where exact color matching matters a lot, it helps to work a test section on a scrap of fabric first.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The good news is that embroidery thread color matters less than precision in stitch placement. Even a slightly off shade will blend into the overall design once the piece is finished and viewed from a normal distance. Try using a conversion and trust the result. If you find you truly dislike the color once you start, you can always rip back those stitches and try the next closest option. Most stitchers find that their first conversion choice works beautifully.
        </p>
      </section>
    </ToolLayout>
  );
}
