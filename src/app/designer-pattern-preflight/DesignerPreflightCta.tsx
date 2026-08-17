"use client";

import { trackDesignerPreflightEvent } from "@/lib/designer-preflight-analytics";

export default function DesignerPreflightCta() {
  return (
    <a
      href="#submit-pattern"
      className="btn-primary"
      onClick={() => trackDesignerPreflightEvent("designer_preflight_cta_clicked")}
    >
      Submit one pattern for $9
    </a>
  );
}
