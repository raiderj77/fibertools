import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Needle & Hook Size Converter Online | FiberTools",
  description: "Convert knitting needle and crochet hook sizes between US, UK, metric, and Japanese systems.",
};

export default function NeedleConverterPage() {
  return (
    <ToolLayout slug="needle-converter">
      <ComingSoon slug="needle-converter" />
    </ToolLayout>
  );
}
