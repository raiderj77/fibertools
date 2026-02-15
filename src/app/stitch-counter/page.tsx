import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Stitch & Row Counter Online | FiberTools",
  description: "Free online stitch and row counter with multiple counters and offline support.",
};

export default function StitchCounterPage() {
  return (
    <ToolLayout slug="stitch-counter">
      <ComingSoon slug="stitch-counter" />
    </ToolLayout>
  );
}
