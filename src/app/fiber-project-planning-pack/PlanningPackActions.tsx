"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackFixedEvent } from "@/lib/fixed-analytics";

const OFFER_SLUG = "fiber-project-planning-pack" as const;

export default function PlanningPackActions({
  checkoutUrl,
  trackPageView = false,
}: {
  checkoutUrl: string | null;
  trackPageView?: boolean;
}) {
  useEffect(() => {
    if (trackPageView) {
      trackFixedEvent("planning_pack_page_view", { slug: OFFER_SLUG });
    }
  }, [trackPageView]);

  if (checkoutUrl) {
    return (
      <a
        href={checkoutUrl}
        className="btn-primary"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackFixedEvent("planning_pack_purchase_click", { slug: OFFER_SLUG })}
      >
        Buy the planning pack — $17
      </a>
    );
  }

  return (
    <div>
      <Link
        href="/contact"
        className="btn-primary"
        onClick={() => trackFixedEvent("planning_pack_interest_click", { slug: OFFER_SLUG })}
      >
        Tell me when checkout opens
      </Link>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-bark-500 dark:text-bark-400">
        Checkout is not open yet. The contact page is available, and no payment will be attempted.
      </p>
    </div>
  );
}
