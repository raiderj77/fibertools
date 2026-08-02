"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface PolicyDocumentLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function PolicyDocumentLink({
  href,
  className,
  children,
}: PolicyDocumentLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        window.location.assign(href);
      }}
    >
      {children}
    </Link>
  );
}
