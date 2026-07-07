import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import NeedleConverterTool from "./NeedleConverterTool";

export const metadata: Metadata = {
  title: "Knitting Needle & Hook Size Converter, Free",
  description:
    "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
  keywords: [
    "knitting needle size chart",
    "knitting needle conversion chart",
    "crochet hook size chart",
    "crochet hook conversion",
    "needle size converter",
    "mm to us knitting needle",
    "us 8 knitting needle in mm",
    "uk to us needle conversion",
    "japanese knitting needle sizes",
    "crochet hook letter to mm",
    "what size hook for worsted weight",
    "knitting needle sizes",
    "crochet hook sizes",
    "needle size chart printable",
    "hook size chart",
  ],
  openGraph: {
    title: "Knitting Needle & Hook Size Converter, Free",
    description:
      "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
    url: "https://fibertools.app/needle-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Knitting Needle & Hook Size Converter, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knitting Needle & Hook Size Converter, Free",
    description:
      "Convert knitting needle and crochet hook sizes between US, metric, UK, and Japanese systems. All 23 needle sizes and 24 hook sizes. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/needle-converter" },
};

export default function NeedleConverterPage() {
  return (
    <ToolLayout slug="needle-converter">
      <AnswerBlock
        what="A size converter for knitting needles and crochet hooks that translates between US, metric (mm), UK, and Japanese sizing systems instantly."
        who="Knitters and crocheters working from international patterns, or anyone whose pattern calls for a needle or hook size in an unfamiliar system."
        bottomLine="Select or type any needle or hook size and see the equivalent in every major sizing system, no more guessing whether a 4.0 mm hook is a US G/6."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Needle and Hook Size Converter</h2>
        <h2>How to Convert Needle Sizes</h2>
        <h2>Needle Size Conversion Results</h2>
      </div>
      <NeedleConverterTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I read a knitting needle conversion chart?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Conversion charts list needle sizes in one column and their metric equivalents in another. Most charts show US sizes, metric millimeters, UK sizes, and sometimes Japanese needle sizes all together. One US 8 needle is 5.0 mm, so you can match any size across systems instantly.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Knitting needles have been numbered differently in each country for over a century. The US system uses numbers like 1, 2, and 8. The metric system measures in millimeters from the needle shaft thickness. The UK system uses older numbers that do not match US numbers at all. Japan has its own sizing too. When you find a pattern from another country, the needle size listed will be in that country&rsquo;s system.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The good news is the actual needle thickness is the same no matter where it was made. A 5.0 mm needle knits the same whether you call it a US 8, a UK 6, or buy it from Japan. So if you look up the metric size, you can find the US equivalent in your hand. Keeping a conversion chart handy or bookmarking one online saves time every time you work with a new pattern.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is the difference between straight needles and circular needles for sizing?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Straight needles and circular needles use the exact same sizing systems. A US 6 straight needle is 4.0 mm thick, and a US 6 circular needle is also 4.0 mm thick. The shaft diameter is what the size refers to, not the needle length or cable style.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Many knitters think needle size only describes straight needles, but it actually describes the working end of any needle type. Circular needles connect two needle tips with a flexible cable. Interchangeable needles come as tips and cables you buy separately. Double-pointed needles are tiny straight needles in sets of 4 or 5. No matter the shape, the US, metric, UK, and Japanese size numbers all refer to how thick the needle shaft is.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          This matters because a pattern tells you the needle size but not always the type. If a pattern calls for US 6 needles, you can use US 6 straights, US 6 circulars, or US 6 double-pointed needles, and the gauge will be the same. The cable length on a circular needle does not change the size number. You choose the needle type for comfort and the stitch count, but the sizing conversion is identical across all needle styles.
        </p>
      </section>
    </ToolLayout>
  );
}
