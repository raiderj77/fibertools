"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Tool,
} from "@/lib/tools";

type DirectoryFilter = "all" | "materials" | "gauge" | "planning" | "reference";

const FILTERS: Array<{ value: DirectoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "materials", label: "Yarn & materials" },
  { value: "gauge", label: "Gauge, sizing & stitches" },
  { value: "planning", label: "Project planning" },
  { value: "reference", label: "References & specialty" },
];

const TOOL_FILTERS: Record<Exclude<DirectoryFilter, "all">, Set<string>> = {
  materials: new Set([
    "fabric-substitute",
    "project-cost-calculator",
    "spinning-ratio-calculator",
    "stash-estimator",
    "thread-converter",
    "weaving-sett-calculator",
    "wpi-calculator",
    "yarn-weight-chart",
  ]),
  gauge: new Set([
    "gauge-calculator",
    "increase-decrease-calculator",
    "needle-converter",
    "raglan-calculator",
    "sleeve-calculator",
    "stitch-counter",
    "stitch-pattern-calculator",
  ]),
  planning: new Set([
    "amigurumi-pattern-checker",
    "blocking-calculator",
    "c2c-calculator",
    "color-pooling-calculator",
    "cross-stitch-calculator",
    "granny-square-planner",
    "hat-calculator",
    "stripe-generator",
  ]),
  reference: new Set([
    "abbreviation-glossary",
    "needle-guide",
    "stitch-quick-reference",
    "uk-to-us-converter",
    "vintage-pattern-decoder",
  ]),
};

function matchesFilter(tool: Tool, filter: DirectoryFilter) {
  return filter === "all" || TOOL_FILTERS[filter].has(tool.slug);
}

function matchesSearch(tool: Tool, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [tool.name, tool.shortName, tool.description, ...tool.keywords]
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}

function DirectoryToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`} className="tool-card group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${CATEGORY_COLORS[tool.category]}`}
          >
            {CATEGORY_LABELS[tool.category]}
          </span>
        </div>
        <div>
          <h3 className="mb-1.5 text-lg font-semibold text-bark-700 transition-colors group-hover:text-plum-500 dark:text-cream-200">
            {tool.shortName}
          </h3>
          <p className="text-sm leading-relaxed text-bark-500 dark:text-bark-400">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function HomeToolDirectory({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<DirectoryFilter>("all");

  const visibleTools = useMemo(
    () => tools.filter((tool) => matchesFilter(tool, activeFilter) && matchesSearch(tool, query)),
    [activeFilter, query, tools],
  );

  return (
    <section id="all-tools" className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="tool-directory-heading">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-plum-500">Complete directory</p>
        <h2 id="tool-directory-heading" className="mt-2 text-3xl font-display font-bold text-bark-800 dark:text-cream-100">
          Find another calculator or reference
        </h2>
        <p className="mt-3 text-bark-500 dark:text-bark-400">
          Search the remaining free self-service tools by the project problem you need to solve.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-bark-700 dark:bg-bark-800 sm:p-6">
        <label htmlFor="home-tool-search" className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
          Search calculators and references
        </label>
        <input
          id="home-tool-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try yarn, gauge, sweater, weaving..."
          className="mt-2 min-h-11 w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-base text-bark-700 outline-none transition focus:border-plum-400 focus:ring-2 focus:ring-plum-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-200"
        />

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter the tool directory by project need">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                activeFilter === filter.value
                  ? "border-plum-500 bg-plum-500 text-white"
                  : "border-cream-300 bg-white text-bark-600 hover:border-plum-300 hover:text-plum-600 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-bark-500 dark:text-bark-400" aria-live="polite">
        Showing {visibleTools.length} {visibleTools.length === 1 ? "tool" : "tools"}
      </p>

      {visibleTools.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <DirectoryToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-cream-300 bg-white p-6 text-center dark:border-bark-700 dark:bg-bark-800">
          <p className="font-semibold text-bark-700 dark:text-cream-200">No matching tools found.</p>
          <p className="mt-1 text-sm text-bark-500 dark:text-bark-400">Try a broader search or choose All.</p>
        </div>
      )}
    </section>
  );
}
