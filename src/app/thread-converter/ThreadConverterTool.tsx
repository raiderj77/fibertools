"use client";

import { useMemo, useState } from "react";
import {
  THREAD_BATCH_LIMITS,
  THREAD_BRANDS,
  THREAD_CONVERSION_TABLE,
  THREAD_REFERENCE_METADATA,
  convertThreadBatch,
  lookupThreadCode,
  searchThreadTable,
} from "@/lib/thread-conversion.mjs";

type ViewMode = "search" | "palette" | "bulk";
type ThreadBrand = "dmc" | "anchor" | "cosmo";
type SearchBrand = ThreadBrand | "any";
type ThreadEntry = (typeof THREAD_CONVERSION_TABLE)[number];
type ThreadLookup = ReturnType<typeof lookupThreadCode>;
type ThreadBatchItem = { input: string; lookup: ThreadLookup };

const BRAND_LABELS: Record<ThreadBrand, string> = {
  dmc: "DMC",
  anchor: "Anchor",
  cosmo: "Cosmo",
};

const MODES: Array<{ id: ViewMode; label: string; description: string }> = [
  {
    id: "search",
    label: "Search table",
    description: "Browse partial code or name matches, but show only rows that are explicitly included in this table.",
  },
  {
    id: "palette",
    label: "Saved palette",
    description: "Keep selected included rows together for reference. This is not a purchasing list.",
  },
  {
    id: "bulk",
    label: "Exact batch lookup",
    description: "Look up a bounded list of exact codes from one selected source brand.",
  },
];

function lookupEntries(lookup: ThreadLookup): ThreadEntry[] {
  if (lookup.status === "found") return [lookup.entry];
  if (lookup.status === "ambiguous") return lookup.matches;
  return [];
}

function joinedCodes(entries: ThreadEntry[], brand: ThreadBrand) {
  if (entries.length === 0) return "—";
  return [...new Set(entries.map((entry) => entry[brand]))].join(" / ");
}

function ThreadTable({
  entries,
  onAdd,
  savedCodes,
  caption,
}: {
  entries: ThreadEntry[];
  onAdd?: (dmc: string) => void;
  savedCodes?: string[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-cream-300 dark:border-bark-600">
            <th className="w-10 px-3 py-2"><span className="sr-only">Screen swatch</span></th>
            <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">DMC</th>
            <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Anchor</th>
            <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Cosmo</th>
            <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Table label</th>
            {onAdd && <th className="px-3 py-2"><span className="sr-only">Palette action</span></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
          {entries.map((entry) => {
            const key = `${entry.dmc}-${entry.anchor}-${entry.cosmo}`;
            const isSaved = savedCodes?.includes(entry.dmc) ?? false;
            return (
              <tr key={key} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10">
                <td className="px-3 py-2">
                  <div className="h-6 w-6 rounded border border-cream-300 dark:border-bark-600" style={{ backgroundColor: entry.hex }} aria-hidden="true" />
                </td>
                <td className="px-3 py-2 font-mono font-bold text-bark-800 dark:text-cream-100">{entry.dmc}</td>
                <td className="px-3 py-2 font-mono text-bark-600 dark:text-cream-300">{entry.anchor}</td>
                <td className="px-3 py-2 font-mono text-bark-600 dark:text-cream-300">{entry.cosmo}</td>
                <td className="px-3 py-2 text-bark-500 dark:text-bark-400">{entry.name}</td>
                {onAdd && (
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onAdd(entry.dmc)}
                      disabled={isSaved}
                      className="text-xs text-sage-600 hover:underline disabled:cursor-not-allowed disabled:text-bark-400 disabled:no-underline dark:text-sage-400"
                      aria-label={isSaved ? `DMC ${entry.dmc} is already in the palette` : `Add DMC ${entry.dmc} to palette`}
                    >
                      {isSaved ? "Saved" : "Add"}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ThreadConverterTool() {
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [search, setSearch] = useState("");
  const [searchBrand, setSearchBrand] = useState<SearchBrand>("any");
  const [palette, setPalette] = useState<string[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkBrand, setBulkBrand] = useState<ThreadBrand>("dmc");
  const [copyStatus, setCopyStatus] = useState("");

  const searchResults = useMemo(
    () => searchThreadTable(search, searchBrand, 30),
    [search, searchBrand],
  );

  const paletteEntries = useMemo(() => palette.flatMap((dmc) => {
    const lookup = lookupThreadCode("dmc", dmc);
    return lookup.status === "found" ? [lookup.entry] : [];
  }), [palette]);

  const batch = useMemo(
    () => convertThreadBatch({ input: bulkInput, sourceBrand: bulkBrand }),
    [bulkBrand, bulkInput],
  );

  const activeMode = MODES.find((mode) => mode.id === viewMode) ?? MODES[0];

  const addToPalette = (dmc: string) => {
    setPalette((previous) => (
      previous.includes(dmc) || previous.length >= THREAD_CONVERSION_TABLE.length
        ? previous
        : [...previous, dmc]
    ));
    setCopyStatus("");
  };

  const removeFromPalette = (dmc: string) => {
    setPalette((previous) => previous.filter((code) => code !== dmc));
    setCopyStatus("");
  };

  const copyPalette = async () => {
    const lines = paletteEntries.map((entry) => (
      `DMC ${entry.dmc} → Anchor ${entry.anchor} → Cosmo ${entry.cosmo} (${entry.name})`
    ));
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyStatus("Palette reference copied.");
    } catch {
      setCopyStatus("Copy failed. Select and copy the table manually.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Included-table lookup only</p>
        <p className="mt-1">
          This table contains {THREAD_CONVERSION_TABLE.length} rows for DMC, Anchor, and Cosmo.
          It does not support Sulky, calculate nearest colors, or claim that a listed cross-brand row is a physical color match.
          Screen swatches are orientation only.
        </p>
        <p className="mt-2 text-xs">
          Bundled legacy table, reviewed 2026-08-29 ({THREAD_REFERENCE_METADATA.version}); the original source was not
          recorded and the rows are not manufacturer-verified. Check current brand charts and physical thread before buying.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl bg-cream-200 p-1 dark:bg-bark-700" role="group" aria-label="Thread converter mode">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setViewMode(mode.id)}
            aria-pressed={viewMode === mode.id}
            className={`min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              viewMode === mode.id
                ? "bg-white text-bark-800 shadow-sm dark:bg-bark-600 dark:text-cream-100"
                : "text-bark-500 dark:text-bark-400"
            }`}
          >
            {mode.label}{mode.id === "palette" ? ` (${palette.length})` : ""}
          </button>
        ))}
      </div>
      <p className="text-xs text-bark-400 dark:text-bark-500">{activeMode.description}</p>

      {viewMode === "search" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div>
              <label htmlFor="thread-table-search" className="label text-sm">Search included table rows</label>
              <input
                id="thread-table-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Thread code or table label"
                className="input"
                maxLength={THREAD_BATCH_LIMITS.maximumSearchLength}
              />
            </div>
            <div>
              <label htmlFor="thread-search-brand" className="label text-sm">Search field</label>
              <select
                id="thread-search-brand"
                value={searchBrand}
                onChange={(event) => setSearchBrand(event.target.value as SearchBrand)}
                className="select"
              >
                <option value="any">All included fields</option>
                {THREAD_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{BRAND_LABELS[brand as ThreadBrand]}</option>
                ))}
              </select>
            </div>
          </div>

          {search.trim() && (
            <p className="text-xs text-bark-400 dark:text-bark-500">
              {searchResults.length} included table {searchResults.length === 1 ? "row" : "rows"} shown
            </p>
          )}

          {searchResults.length > 0 && (
            <ThreadTable
              entries={searchResults}
              onAdd={addToPalette}
              savedCodes={palette}
              caption="Included DMC, Anchor, and Cosmo thread cross-reference rows"
            />
          )}

          {search.trim() && searchResults.length === 0 && (
            <p className="text-sm text-bark-400 dark:text-bark-500">
              No included table row matched. The converter leaves this query unknown and does not infer a nearest color.
            </p>
          )}
        </div>
      )}

      {viewMode === "palette" && (
        <div className="space-y-4">
          {paletteEntries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-bark-400 dark:text-bark-500">Your reference palette is empty.</p>
              <p className="mt-1 text-sm text-bark-400 dark:text-bark-500">
                Search included rows and choose Add to save them here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3" role="list" aria-label="Saved thread reference palette">
                {paletteEntries.map((entry) => (
                  <div key={entry.dmc} className="flex items-center gap-1" role="listitem">
                    <div
                      className="h-10 w-10 rounded-lg border-2 border-cream-300 dark:border-bark-600"
                      style={{ backgroundColor: entry.hex }}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromPalette(entry.dmc)}
                      className="min-h-11 px-2 text-sm text-bark-500 hover:text-rose-500"
                      aria-label={`Remove DMC ${entry.dmc} from palette`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <ThreadTable entries={paletteEntries} caption="Saved thread reference palette rows" />

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void copyPalette()} className="btn-secondary text-sm">
                  Copy palette reference
                </button>
                <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">Print</button>
                <span className="self-center text-xs text-bark-500 dark:text-bark-400" role="status" aria-live="polite">
                  {copyStatus}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {viewMode === "bulk" && (
        <div className="space-y-4">
          <div className="max-w-xs">
            <label htmlFor="thread-bulk-brand" className="label text-sm">Source brand for every code</label>
            <select
              id="thread-bulk-brand"
              value={bulkBrand}
              onChange={(event) => setBulkBrand(event.target.value as ThreadBrand)}
              className="select"
            >
              {THREAD_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{BRAND_LABELS[brand as ThreadBrand]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="thread-bulk-input" className="label text-sm">
              Exact {BRAND_LABELS[bulkBrand]} codes
            </label>
            <p id="thread-bulk-help" className="mb-2 text-xs text-bark-400 dark:text-bark-500">
              Separate up to {THREAD_BATCH_LIMITS.maximumCodes} codes with spaces, commas, semicolons, or new lines.
              Partial and nearest-color matching are not used.
            </p>
            <textarea
              id="thread-bulk-input"
              value={bulkInput}
              onChange={(event) => setBulkInput(event.target.value)}
              placeholder={bulkBrand === "dmc" ? "310, 321, blanc, b5200" : "Enter exact source-brand codes"}
              className="input min-h-[96px] resize-y"
              maxLength={THREAD_BATCH_LIMITS.maximumCharacters}
              aria-describedby="thread-bulk-help"
            />
          </div>

          {batch.status === "invalid" && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">
              {batch.message}
            </div>
          )}

          {batch.status === "ready" && batch.results.length > 0 && (
            <div className="overflow-x-auto">
              <p className="sr-only" role="status" aria-live="polite">
                Exact lookup updated with {batch.results.length} result{batch.results.length === 1 ? "" : "s"}.
              </p>
              <table className="min-w-full text-sm">
                <caption className="sr-only">Exact included-table batch lookup results</caption>
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Input ({BRAND_LABELS[bulkBrand]})</th>
                    <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">DMC</th>
                    <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Anchor</th>
                    <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Cosmo</th>
                    <th className="px-3 py-2 text-left font-semibold text-bark-700 dark:text-cream-200">Lookup status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {batch.results.map((result: ThreadBatchItem, index: number) => {
                    const entries = lookupEntries(result.lookup);
                    const status = result.lookup.status === "found"
                      ? "Exact included row"
                      : result.lookup.status === "ambiguous"
                        ? "Multiple included rows—verify"
                        : result.lookup.status === "unknown"
                          ? "Unknown—not in included table"
                          : "Invalid code";
                    return (
                      <tr key={`${index}-${result.input}`} className={entries.length === 0 ? "bg-rose-50/50 dark:bg-rose-900/10" : ""}>
                        <td className="px-3 py-2 font-mono font-bold">{result.input}</td>
                        <td className="px-3 py-2 font-mono">{joinedCodes(entries, "dmc")}</td>
                        <td className="px-3 py-2 font-mono">{joinedCodes(entries, "anchor")}</td>
                        <td className="px-3 py-2 font-mono">{joinedCodes(entries, "cosmo")}</td>
                        <td className="px-3 py-2 text-bark-500 dark:text-bark-400">{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
