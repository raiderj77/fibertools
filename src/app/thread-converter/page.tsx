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
  openGraph: {
    title: "Embroidery Thread Converter — DMC & Anchor",
    description:
      "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
    url: "https://fibertools.app/thread-converter",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Embroidery Thread Converter — DMC & Anchor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embroidery Thread Converter — DMC & Anchor",
    description:
      "Convert between DMC, Anchor, and Cosmo embroidery thread numbers instantly. Build palettes and bulk-convert for cross stitch shopping lists. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/thread-converter" },
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <div className="sr-only">
        <h2>Embroidery Thread Converter Tool</h2>
        <h2>How to Convert Thread Numbers</h2>
        <h2>Thread Conversion Results Across Brands</h2>
      </div>
      <ThreadConverterTool />
    </ToolLayout>
  );
}
