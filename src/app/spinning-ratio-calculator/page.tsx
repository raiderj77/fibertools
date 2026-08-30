import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import SpinningCalculatorTool from "./SpinningCalculatorTool";

const description = "Calculate the ideal geometric ratio between a spinning wheel's drive wheel and the pulley connected by its drive band.";

export const metadata: Metadata = {
  title: "Spinning Wheel Drive Ratio Calculator",
  description,
  keywords: [
    "spinning wheel ratio",
    "spinning wheel drive ratio",
    "spinning wheel pulley ratio",
    "spinning wheel whorl size calculator",
    "how to calculate drive ratio spinning wheel",
  ],
  openGraph: {
    title: "Spinning Wheel Drive Ratio Calculator",
    description,
    url: "https://fibertools.app/spinning-ratio-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Spinning Wheel Drive Ratio Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spinning Wheel Drive Ratio Calculator",
    description,
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/spinning-ratio-calculator" },
};

export default function SpinningCalculatorPage() {
  return (
    <ToolLayout slug="spinning-ratio-calculator" pageTitle="Spinning Wheel Drive Ratio Calculator">
      <AnswerBlock
        what="A pulley-ratio calculator that divides the effective drive-wheel band-path diameter by the connected pulley's effective band-path diameter."
        who="Handspinners documenting or comparing compatible pulley settings on a specific wheel."
        bottomLine="Prefer maker-documented ratios or effective diameters. The output is an approximation, not a prediction of twists per inch or finished yarn."
        lastUpdated="2026-08-29"
      />
      <SpinningCalculatorTool />

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What does a spinning-wheel drive ratio mean?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          This calculator divides the effective drive-wheel band-path diameter by the effective diameter of
          the connected pulley groove. Values of 22 and 2.5 produce an ideal geometric ratio of 8.8:1, meaning the driven
          component would rotate about 8.8 times during one full drive-wheel revolution in the simplified model.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Prefer the wheel maker&apos;s published ratio or effective diameters. Outside or flange diameters can
          be wrong for deep or multiple grooves. The driven component depends on the wheel design, and actual
          behavior can vary with drive-band condition, tension, slip, and setup.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How should I use the ratio?
        </h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Use it to record a wheel setup or compare pulley choices that the manufacturer says are compatible.
          A smaller driven pulley raises the ratio, while a larger driven pulley lowers it.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Do not map the ratio directly to a yarn weight or target twist. Finished twist also depends on how
          the wheel is operated and how much fiber is drafted while twist enters. Make a sample, record the
          full setup, finish it as intended, and evaluate that sample before scaling up.
        </p>
      </section>
    </ToolLayout>
  );
}
