import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Free Stripe Pattern Generator Online | FiberTools",
  description: "Generate random or structured stripe patterns with per-color yardage estimates.",
};

export default function StripeGeneratorPage() {
  return (
    <ToolLayout slug="stripe-generator">
      <ComingSoon slug="stripe-generator" />
    </ToolLayout>
  );
}
