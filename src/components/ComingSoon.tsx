"use client";

import Link from "next/link";
import { getToolBySlug, getRelatedTools } from "@/lib/tools";

interface ComingSoonProps {
  slug: string;
}

export default function ComingSoon({ slug }: ComingSoonProps) {
  const tool = getToolBySlug(slug);
  const related = getRelatedTools(slug, 3).filter((t) => t.ready);

  return (
    <div className="text-center py-12">
      <span className="text-6xl mb-4 block">{tool?.icon || "🔧"}</span>
      <h2 className="text-xl font-display font-bold text-bark-700 dark:text-cream-200 mb-2">
        Coming Soon
      </h2>
      <p className="text-bark-500 dark:text-bark-400 max-w-md mx-auto mb-8">
        We&apos;re building {tool?.name || "this tool"} right now. Check back
        soon — or try one of our other tools:
      </p>
      {related.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {related.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="btn-secondary">
              {t.icon} {t.shortName}
            </Link>
          ))}
        </div>
      ) : (
        <Link href="/" className="btn-primary">
          ← Back to all tools
        </Link>
      )}
    </div>
  );
}
