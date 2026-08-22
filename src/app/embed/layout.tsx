import type { ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-cream-50 dark:bg-bark-900">{children}</div>;
}
