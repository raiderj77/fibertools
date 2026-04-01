import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import BlanketCalculatorTool from "./BlanketCalculatorTool";

export const metadata: Metadata = {
  title: "Blanket Yarn Calculator — How Much Do I Need?",
  description:
    "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
  keywords: [
    "blanket size chart", "crochet blanket sizes", "blanket size calculator",
    "how big should a blanket be", "baby blanket size crochet", "throw blanket dimensions",
    "king size blanket crochet stitches", "how many chains for a throw blanket",
    "crochet blanket yardage chart", "blanket dimensions chart",
    "blanket yarn calculator", "crochet blanket calculator",
    "knitting blanket size guide", "blanket stitch count",
  ],
  openGraph: {
    title: "Blanket Yarn Calculator — How Much Do I Need?",
    description:
      "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
    url: "https://fibertools.app/blanket-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Blanket Yarn Calculator — How Much Do I Need?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blanket Yarn Calculator — How Much Do I Need?",
    description:
      "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blanket-calculator" },
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator">
      <AnswerBlock
        what="A calculator that determines how much yarn you need for any blanket size, from baby to king, with stitch counts, row counts, and total yardage."
        who="Knitters and crocheters planning a blanket project who want to buy the right amount of yarn before starting."
        bottomLine="Select your blanket size and enter your gauge to get an accurate yarn estimate — always buy an extra skein as a buffer."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Blanket Size Calculator Tool</h2>
        <h2>How to Calculate Blanket Dimensions</h2>
        <h2>Blanket Size Results and Yarn Estimates</h2>
      </div>
      <BlanketCalculatorTool />
    </ToolLayout>
  );
}
