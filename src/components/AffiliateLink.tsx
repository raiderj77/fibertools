"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

interface AffiliateLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  href: string;
  page: string;
  placement: string;
  contentType: "calculator" | "article" | "guide";
  category: string;
  children: ReactNode;
}

export default function AffiliateLink({
  href,
  page,
  placement,
  contentType,
  category,
  children,
  ...props
}: AffiliateLinkProps) {
  function trackClick() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        page_path: page,
        placement,
        content_type: contentType,
        merchant: "amazon",
        product_category: category,
      });
    }
  }

  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={trackClick}
      data-affiliate-tracked="true"
      data-affiliate-placement={placement}
      data-affiliate-category={category}
    >
      {children}
    </a>
  );
}
