"use client";

import { useState } from "react";
import {
  trackFixedEvent,
  type FixedAnalyticsSlug,
} from "@/lib/fixed-analytics";

type EmbedToolSlug = Extract<
  FixedAnalyticsSlug,
  "blanket-calculator" | "yarn-calculator" | "gauge-calculator"
>;

const EMBED_HEIGHTS: Readonly<Record<EmbedToolSlug, number>> = {
  "blanket-calculator": 1180,
  "yarn-calculator": 1180,
  "gauge-calculator": 1180,
};

export default function EmbedCodeCard({ name, slug }: { name: string; slug: EmbedToolSlug }) {
  const [status, setStatus] = useState("Copy embed code");
  const height = EMBED_HEIGHTS[slug];
  const snippet = `<iframe src="https://fibertools.app/embed/${slug}" title="${name} by FiberTools" width="100%" height="${height}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals" allow="clipboard-write" style="border:1px solid #d8d0c5;border-radius:12px;max-width:100%;"></iframe>`;

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setStatus("Embed code copied");
      trackFixedEvent("embed_code_copy", { slug });
    } catch {
      setStatus("Copy unavailable, select the code below");
    }
  }

  return (
    <article className="rounded-2xl border border-cream-300 bg-white p-5 dark:border-bark-700 dark:bg-bark-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-bark-800 dark:text-cream-100">{name}</h2>
          <p className="mt-1 text-sm text-bark-500 dark:text-bark-400">Free branded embed</p>
        </div>
        <button type="button" onClick={copySnippet} className="btn-primary min-h-11 text-sm">
          {status}
        </button>
      </div>
      <pre
        tabIndex={0}
        aria-label={`${name} iframe code`}
        className="mt-4 overflow-x-auto rounded-xl bg-bark-900 p-4 text-xs leading-relaxed text-cream-200"
      >
        <code>{snippet}</code>
      </pre>
      <p className="sr-only" aria-live="polite">{status}</p>
    </article>
  );
}

export function PartnerInterestLink() {
  return (
    <a
      href="mailto:hello@fibertools.app?subject=FiberTools%20embed%20pilot"
      className="btn-primary min-h-11"
      onClick={() => trackFixedEvent("partner_interest_click", { slug: "embed-program" })}
    >
      Contact FiberTools about the pilot
    </a>
  );
}
