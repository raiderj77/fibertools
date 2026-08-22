import Link from "next/link";

export default function PlanningPackResultCta() {
  return (
    <aside className="mt-6 rounded-xl border border-sage-200 bg-sage-50 p-4 dark:border-sage-800 dark:bg-sage-950/20">
      <p className="text-sm font-semibold text-bark-700 dark:text-cream-200">
        Keep this result with the rest of your project plan
      </p>
      <p className="mt-1 text-sm leading-relaxed text-bark-500 dark:text-bark-400">
        The optional Fiber Project Planning Pack records gauge, yarn lots, costs, finishing tasks, and troubleshooting notes. All calculators remain free.
      </p>
      <Link
        href="/fiber-project-planning-pack"
        className="mt-3 inline-flex min-h-11 items-center font-semibold text-sage-700 underline underline-offset-2 dark:text-sage-300"
      >
        See the $17 planning pack
      </Link>
    </aside>
  );
}
