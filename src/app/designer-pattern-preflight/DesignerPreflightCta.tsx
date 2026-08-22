"use client";

import { trackDesignerPreflightEvent } from "@/lib/designer-preflight-analytics";
import { trackFixedEvent } from "@/lib/fixed-analytics";

export default function DesignerPreflightCta({
  mode,
  inquiryUrl,
}: {
  mode: "checkout" | "inquiry";
  inquiryUrl?: string;
}) {
  if (mode === "inquiry") {
    return (
      <a
        href={inquiryUrl}
        className="btn-primary"
        onClick={() =>
          trackFixedEvent("designer_preflight_inquiry_click", {
            slug: "designer-pattern-preflight",
          })
        }
      >
        Ask about the $39 pilot
      </a>
    );
  }

  return (
    <a
      href="#submit-pattern"
      className="btn-primary"
      onClick={() => trackDesignerPreflightEvent("designer_preflight_cta_clicked")}
    >
      Submit one pattern for $39
    </a>
  );
}
