const TOOL_CONTEXT = {
  "yarn-calculator": "After estimating yarn, record the yarn, skein details, and project notes.",
  "gauge-calculator": "After checking gauge, record the measured stitches, rows, hook or needle, and project notes.",
  "blanket-calculator": "After estimating the blanket, record materials, target dimensions, row progress, and notes.",
  "stitch-counter": "For a longer-lived checkpoint, record the project and row progress separately from this counter.",
} as const;

type SupportedToolSlug = keyof typeof TOOL_CONTEXT;

function isSupportedTool(slug: string): slug is SupportedToolSlug {
  return Object.hasOwn(TOOL_CONTEXT, slug);
}

export default function MyCrochetKitCallout({ slug }: { slug: string }) {
  if (!isSupportedTool(slug)) return null;

  const plannerUrl = new URL("https://mycrochetkit.com/");
  plannerUrl.searchParams.set("utm_source", "fibertools");
  plannerUrl.searchParams.set("utm_medium", "referral");
  plannerUrl.searchParams.set("utm_campaign", "project_planner");
  plannerUrl.searchParams.set("utm_content", slug);
  plannerUrl.hash = "planner";

  return (
    <aside className="mt-8 rounded-2xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-950/20" aria-labelledby={`mycrochetkit-${slug}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-700 dark:text-sage-300">
        Companion tool from the same maker
      </p>
      <h2 id={`mycrochetkit-${slug}`} className="mt-2 font-display text-xl text-bark-800 dark:text-cream-100">
        Keep the project details together
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
        {TOOL_CONTEXT[slug]} MyCrochetKit is a separate, accountless planner that stores project details in this browser. Use it for yarn, hook, gauge, progress, and notes; export backups for projects you want to keep.
      </p>
      <a href={plannerUrl.toString()} className="btn-primary mt-4 inline-flex min-h-11 items-center">
        Open MyCrochetKit planner →
      </a>
    </aside>
  );
}
