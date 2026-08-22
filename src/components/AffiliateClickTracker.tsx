"use client";

import { useEffect } from "react";
import { AMAZON_ASSOCIATE_TAG } from "@/lib/affiliate";
import { hasCurrentAnalyticsConsent } from "@/lib/fixed-analytics";

export default function AffiliateClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.dataset.affiliateTracked === "true") return;

      let destination: URL;
      try {
        destination = new URL(link.href);
      } catch {
        return;
      }

      if (
        destination.protocol !== "https:" ||
        destination.hostname !== "www.amazon.com" ||
        destination.searchParams.get("tag") !== AMAZON_ASSOCIATE_TAG
      ) {
        return;
      }

      if (hasCurrentAnalyticsConsent() && typeof window.gtag === "function") {
        window.gtag("event", "affiliate_click", {
          page_path: window.location.pathname,
          placement: link.dataset.affiliatePlacement || "editorial-product-link",
          content_type: window.location.pathname.includes("calculator") ? "calculator" : "article",
          merchant: "amazon",
          product_category: link.dataset.affiliateCategory || "editorial-product",
        });
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
