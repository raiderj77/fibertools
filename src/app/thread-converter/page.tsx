import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ThreadConverterTool from "./ThreadConverterTool";

export const metadata: Metadata = {
  title: "Embroidery Thread Converter — DMC & Anchor",
  description:
    "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
  keywords: [
    "DMC to anchor conversion", "thread conversion chart", "embroidery floss converter",
    "DMC color chart", "anchor to DMC", "DMC 310 anchor equivalent",
    "convert DMC to Cosmo thread", "embroidery thread brand comparison",
    "embroidery thread converter online", "cross stitch thread conversion",
    "DMC anchor cosmo chart",
  ],
  alternates: { canonical: "/thread-converter" },
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <ThreadConverterTool />
    </ToolLayout>
  );
}
