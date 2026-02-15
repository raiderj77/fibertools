import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Embroidery Thread Converter Online | FiberTools",
  description: "Convert between DMC, Anchor, Cosmo, and Sulky thread numbers.",
};

export default function ThreadConverterPage() {
  return (
    <ToolLayout slug="thread-converter">
      <ComingSoon slug="thread-converter" />
    </ToolLayout>
  );
}
