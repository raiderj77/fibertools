"use client";
import { useEffect, useState } from "react";

// Map the calculator's yarn-weight keys -> Ravelry weight filter values.
const RAV_WEIGHT: Record<string, string> = {
  lace: "lace",
  fingering: "fingering",
  sport: "sport",
  dk: "dk",
  worsted: "worsted",
  bulky: "bulky",
  superbulky: "super bulky",
  jumbo: "jumbo",
};

type Pattern = {
  name?: string;
  url?: string;
  designer?: string;
  thumbnail?: string;
  free?: boolean;
};

interface Props {
  weight?: string; // calculator yarn-weight key
  craft?: "knit" | "crochet";
  query?: string; // project keyword (e.g. "blanket")
  visible?: boolean; // only fetch once there's a result
}

export default function RavelryPatterns({ weight, craft, query, visible }: Props) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const params = new URLSearchParams({ limit: "6" });
    const w = weight ? RAV_WEIGHT[weight] : "";
    if (w) params.set("weight", w);
    if (craft) params.set("craft", craft);
    if (query) params.set("q", query);

    let cancelled = false;
    setLoading(true);
    fetch(`/api/ravelry/patterns?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setPatterns(Array.isArray(data.patterns) ? data.patterns : []);
      })
      .catch(() => {
        if (!cancelled) setPatterns([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [weight, craft, query, visible]);

  // Stay invisible unless we actually have something useful to show.
  if (!visible) return null;
  if (!loading && patterns.length === 0) return null;

  return (
    <section className="border-t border-cream-300 dark:border-bark-700 pt-8">
      <h2 className="text-lg font-display text-bark-800 dark:text-cream-100 mb-1">
        Make something with your yarn
      </h2>
      <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
        Popular {craft ? `${craft} ` : ""}patterns for this yarn weight, from Ravelry.
      </p>

      {loading ? (
        <p className="text-sm text-bark-400 dark:text-bark-500">Finding patterns…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {patterns.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="nofollow noopener"
              className="group block rounded-lg border border-cream-300 dark:border-bark-700 overflow-hidden hover:border-sage-400 dark:hover:border-sage-500 transition-colors"
            >
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.thumbnail}
                  alt={p.name || "Ravelry pattern"}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-square bg-cream-200 dark:bg-bark-800" />
              )}
              <div className="p-2">
                <div className="text-sm font-medium text-bark-800 dark:text-cream-100 line-clamp-1 group-hover:text-sage-600 dark:group-hover:text-sage-400">
                  {p.name}
                </div>
                <div className="text-xs text-bark-400 dark:text-bark-500 line-clamp-1">
                  {p.designer}
                  {p.free ? " · Free" : ""}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-bark-400 dark:text-bark-500 mt-3">
        Patterns via{" "}
        <a
          href="https://www.ravelry.com"
          target="_blank"
          rel="nofollow noopener"
          className="underline hover:text-sage-600 dark:hover:text-sage-400"
        >
          Ravelry
        </a>
      </p>
    </section>
  );
}
