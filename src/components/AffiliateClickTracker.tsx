"use client";

import { useEffect } from "react";

export default function AffiliateClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href*="amazon.com"]');
      if (!link || link.dataset.affiliateTracked === "true") return;

      if (typeof window.gtag === "function") {
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
