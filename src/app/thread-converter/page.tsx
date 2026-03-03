import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ThreadConverterTool from "./ThreadConverterTool";

export const metadata: Metadata = {
  title: "Free Embroidery Thread Converter",
  description:
    "Instantly convert DMC, Anchor, and Cosmo embroidery thread numbers. Build color palettes and bulk-convert full shopping lists in one click.",
  keywords: [
    "DMC to anchor conversion", "thread conversion chart", "embroidery floss converter",
    "DMC color chart", "anchor to DMC", "DMC 310 anchor equivalent",
    "convert DMC to Cosmo thread", "embroidery thread brand comparison",
    "embroidery thread converter online", "cross stitch thread conversion",
    "DMC anchor cosmo chart",
  ],
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <ThreadConverterTool />
    </ToolLayout>
  );
}
