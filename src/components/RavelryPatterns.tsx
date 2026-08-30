"use client";
import { useEffect, useState } from "react";
import { trackFixedEvent } from "@/lib/fixed-analytics";

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

// Ravelry's craft filter expects "knitting"/"crochet", not the calculator's "knit".
const RAV_CRAFT: Record<string, string> = { knit: "knitting", crochet: "crochet" };

type Pattern = {
  name?: string;
  url?: string;
  designer?: string;
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
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visible || !requested) return;
    const params = new URLSearchParams({ limit: "6" });
    const w = weight ? RAV_WEIGHT[weight] : "";
    if (w) params.set("weight", w);
    if (craft) params.set("craft", RAV_CRAFT[craft] || craft);
    if (query) params.set("q", query);

    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setPatterns([]);
    fetch(`/api/ravelry/patterns?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Ravelry request failed");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (!data || data.configured === false || data.error || !Array.isArray(data.patterns)) {
          throw new Error("Ravelry recommendations are unavailable");
        }
        const list: Pattern[] = Array.isArray(data.patterns) ? data.patterns : [];
        setPatterns(list);
        if (list.length > 0) {
          trackFixedEvent("ravelry_patterns_shown", { slug: "yarn-calculator" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPatterns([]);
          setFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [weight, craft, query, visible, requested]);

  if (!visible) return null;

  return (
    <section className="border-t border-cream-300 dark:border-bark-700 pt-8">
      <h2 className="text-lg font-display text-bark-800 dark:text-cream-100 mb-1">
        Make something with your yarn
      </h2>
      {!requested ? (
        <div className="rounded-xl border border-bark-200 bg-cream-50 p-4 dark:border-bark-700 dark:bg-bark-800">
          <p className="mb-3 text-sm leading-relaxed text-bark-500 dark:text-bark-400">
            Load optional Ravelry recommendations using only the selected yarn-weight category, craft, and project-type filter. Measured swatch values and calculated yarn amounts are not included.
          </p>
          <button
            type="button"
            className="btn-secondary min-h-11 text-sm"
            onClick={() => {
              setLoading(true);
              setRequested(true);
            }}
          >
            Load Ravelry recommendations
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
            Ravelry recommendations for the selected {craft ? `${craft} ` : ""}filters.
          </p>

          {loading ? (
            <p role="status" className="text-sm text-bark-400 dark:text-bark-500">Finding patterns…</p>
          ) : failed ? (
            <p role="alert" className="text-sm text-rose-600 dark:text-rose-300">Recommendations are unavailable right now.</p>
          ) : patterns.length === 0 ? (
            <p role="status" className="text-sm text-bark-400 dark:text-bark-500">No recommendations were returned for these filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {patterns.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="nofollow noopener"
                  onClick={() =>
                    trackFixedEvent("ravelry_pattern_click", { slug: "yarn-calculator" })
                  }
                  className="group block rounded-lg border border-cream-300 p-3 dark:border-bark-700 hover:border-sage-400 dark:hover:border-sage-500 transition-colors"
                >
                  <div>
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
        </>
      )}
    </section>
  );
}
