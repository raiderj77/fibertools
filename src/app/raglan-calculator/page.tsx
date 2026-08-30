import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import ToolLayout from "@/components/ToolLayout";
import RaglanCalculatorTool from "./RaglanCalculatorTool";

export const metadata: Metadata = {
  title: "Raglan Finished-Body Stitch Checkpoint",
  description:
    "Calculate a bounded finished-body stitch checkpoint from circumference, measured gauge, and a required stitch multiple.",
  keywords: ["raglan body stitch count", "sweater gauge calculator", "raglan checkpoint"],
  alternates: { canonical: "/raglan-calculator" },
  openGraph: {
    title: "Raglan Finished-Body Stitch Checkpoint",
    description: "Calculate one rounded finished-body stitch checkpoint from measurements you enter.",
    url: "https://fibertools.app/raglan-calculator",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Raglan Finished-Body Stitch Checkpoint" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raglan Finished-Body Stitch Checkpoint",
    description: "Calculate one rounded finished-body stitch checkpoint from measurements you enter.",
    images: ["/og-image.png"],
  },
};

export default function RaglanCalculatorPage() {
  return (
    <ToolLayout slug="raglan-calculator" widgetFirst>
      <AnswerBlock
        what="A bounded worksheet that converts an entered finished-body circumference and measured stitch gauge into one rounded body stitch-count checkpoint."
        who="Knitters checking a body count against a tested raglan pattern and a representative blocked swatch."
        bottomLine="The available inputs cannot determine a neckline cast-on, section distribution, increase schedule, yoke depth, underarm split, or garment fit."
        lastUpdated="2026-08-29"
      />
      <RaglanCalculatorTool />
      <section className="mt-10">
        <h2 className="section-heading">Plan the shaped sections separately</h2>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Use a tested raglan pattern or garment-design method for neckline, yoke, underarm, sleeve, and fit decisions.
          After the pattern defines a sleeve start and target cuff count, the{" "}
          <Link href="/sleeve-calculator" className="text-sage-700 dark:text-sage-300 underline underline-offset-2">
            sleeve calculator
          </Link>{" "}
          can distribute entered taper decreases over the entered length.
        </p>
      </section>
    </ToolLayout>
  );
}
