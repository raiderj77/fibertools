"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isEmbedPath } from "@/lib/embed-policy.mjs";

export default function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isEmbedPath(pathname) ? null : children;
}
