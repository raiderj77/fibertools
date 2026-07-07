import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import CrossStitchCalculatorTool from "./CrossStitchCalculatorTool";

export const metadata: Metadata = {
  title: "Cross Stitch Size & Thread Calculator, Free",
  description:
    "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
  keywords: [
    "cross stitch size calculator", "cross stitch fabric calculator", "aida cloth calculator",
    "how much fabric for cross stitch", "DMC thread calculator", "cross stitch dimensions by count",
    "aida 14 count how big", "cross stitch thread amount calculator", "how much floss do I need",
    "cross stitch finished size", "cross stitch fabric estimator",
  ],
  openGraph: {
    title: "Cross Stitch Size & Thread Calculator, Free",
    description:
      "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
    url: "https://fibertools.app/cross-stitch-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Cross Stitch Size & Thread Calculator, Free" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross Stitch Size & Thread Calculator, Free",
    description:
      "Calculate cross stitch dimensions for any Aida count. Estimate DMC thread amounts per color with framing margin. Free, instant results.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cross-stitch-calculator" },
};

export default function CrossStitchCalculatorPage() {
  return (
    <ToolLayout slug="cross-stitch-calculator">
      <AnswerBlock
        what="A calculator that determines finished dimensions and DMC thread amounts for cross stitch projects on any Aida count fabric with framing margins."
        who="Cross stitchers who need to know how much fabric and floss to buy before starting a pattern."
        bottomLine="Enter your pattern stitch count and fabric count to get exact dimensions and thread estimates."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Cross Stitch Size and Thread Calculator</h2>
        <h2>How to Calculate Cross Stitch Dimensions</h2>
        <h2>Cross Stitch Size Results and Thread Estimates</h2>
      </div>
      <CrossStitchCalculatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does Aida count really mean, and how does it change your finished piece?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Aida count is the number of squares per inch in your fabric, and it directly controls how big your finished design will be. A 14-count Aida has 14 holes per inch, while 18-count has 18 holes per inch in the same space. Higher count fabric means more stitches packed into the same inch, so your design ends up smaller and more detailed.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The Aida count you choose depends on your pattern stitch count and the final size you want. A pattern with 100 stitches across will measure 7 inches wide on 14-count fabric, but only about 5.5 inches on 18-count. The calculator handles this math for you, but understanding the relationship helps you choose fabric that matches your design and your eyesight.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Common Aida sizes range from 11-count (large and open, good for big designs) to 18-count (fine detail, smaller finished pieces). 14-count is the most popular for general cross stitch work because it offers a balance between working speed and finished detail without straining your eyes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do I know how much fabric to buy for my cross stitch project?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            You need your finished design dimensions plus extra fabric around the edges for framing, mounting, or finishing. The calculator tells you your exact finished size, then you add typically 2 to 3 inches on all sides to have room to work and secure the fabric in a frame or hoop.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Aida fabric is usually sold in increments of 1 inch width by whatever length you need. If your design finishes at 8 inches by 10 inches, and you want 2.5 inches of margin all around, you need at least 13 by 15 inches of fabric. Always round up and buy a little extra because you will lose a small amount to fraying at the edges, and fabric stretches slightly over time.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          For your first project, add the framing margin into the calculator or write it down before you shop. Cross stitchers often keep extra yardage on hand anyway because good fabric colors and Aida counts sell out, and having a spare quarter yard is better than hunting for a replacement later.
        </p>
      </section>
    </ToolLayout>
  );
}
