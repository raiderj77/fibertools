"use client";

import { useEffect } from "react";
import { trackDesignerPreflightEvent } from "@/lib/designer-preflight-analytics";

export default function PaymentSuccessAnalytics({ verifiedPaid }: { verifiedPaid: boolean }) {
  useEffect(() => {
    if (!verifiedPaid) return;
    const key = "fibertools_preflight_payment_tracked";
    if (sessionStorage.getItem(key) !== "1") {
      const recorded = trackDesignerPreflightEvent("designer_preflight_payment_completed");
      if (recorded) {
        const paidCountKey = "fibertools_preflight_paid_count";
        const previousCount = Number(localStorage.getItem(paidCountKey) || "0");
        if (previousCount >= 1) trackDesignerPreflightEvent("designer_preflight_repeat_purchase");
        localStorage.setItem(paidCountKey, String(previousCount + 1));
        sessionStorage.setItem(key, "1");
      }
    }
    sessionStorage.removeItem("fibertools_preflight_request_id");
  }, [verifiedPaid]);
  return null;
}
