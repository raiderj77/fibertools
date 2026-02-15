"use client";

import { useState, useMemo } from "react";

// ── DATA ──────────────────────────────────────────────────────────
// Common DMC → Anchor → Cosmo conversions (50 most-used colors)

interface ThreadEntry {
  dmc: string;
  anchor: string;
  cosmo: string;
  hex: string;
  name: string;
}

const THREADS: ThreadEntry[] = [
  { dmc: "blanc", anchor: "2", cosmo: "100", hex: "#FFFFFF", name: "White" },
  { dmc: "ecru", anchor: "387", cosmo: "371", hex: "#F0E6D0", name: "Ecru" },
  { dmc: "310", anchor: "403", cosmo: "600", hex: "#000000", name: "Black" },
  { dmc: "blanc", anchor: "1", cosmo: "100", hex: "#FFFFFF", name: "White bright" },
  { dmc: "321", anchor: "9046", cosmo: "346", hex: "#C91737", name: "Red" },
  { dmc: "304", anchor: "47", cosmo: "345", hex: "#AA1831", name: "Med Red" },
  { dmc: "498", anchor: "20", cosmo: "241", hex: "#871624", name: "Dk Red" },
  { dmc: "816", anchor: "44", cosmo: "243", hex: "#97132B", name: "Garnet" },
  { dmc: "666", anchor: "46", cosmo: "346A", hex: "#E31D42", name: "Bright Red" },
  { dmc: "815", anchor: "43", cosmo: "244", hex: "#7B1026", name: "Dk Garnet" },
  { dmc: "349", anchor: "13", cosmo: "346B", hex: "#D21035", name: "Dk Coral" },
  { dmc: "350", anchor: "11", cosmo: "347", hex: "#E04848", name: "Med Coral" },
  { dmc: "351", anchor: "10", cosmo: "348", hex: "#E96A67", name: "Coral" },
  { dmc: "352", anchor: "9", cosmo: "349", hex: "#F08E7F", name: "Lt Coral" },
  { dmc: "353", anchor: "8", cosmo: "350", hex: "#F8B0A0", name: "Peach" },
  { dmc: "817", anchor: "19", cosmo: "340", hex: "#BB0B25", name: "V Dk Coral Red" },
  { dmc: "3685", anchor: "69", cosmo: "234", hex: "#881533", name: "V Dk Mauve" },
  { dmc: "3687", anchor: "68", cosmo: "232", hex: "#C9546C", name: "Mauve" },
  { dmc: "3688", anchor: "66", cosmo: "231", hex: "#E18DA5", name: "Med Mauve" },
  { dmc: "3689", anchor: "49", cosmo: "230", hex: "#F0B8CA", name: "Lt Mauve" },
  { dmc: "718", anchor: "88", cosmo: "2284", hex: "#C62A72", name: "Plum" },
  { dmc: "553", anchor: "98", cosmo: "285", hex: "#9E5EB3", name: "Violet" },
  { dmc: "554", anchor: "96", cosmo: "284", hex: "#BE94D0", name: "Lt Violet" },
  { dmc: "550", anchor: "102", cosmo: "287", hex: "#5C2469", name: "V Dk Violet" },
  { dmc: "333", anchor: "119", cosmo: "286", hex: "#7A3B8F", name: "V Dk Blue Violet" },
  { dmc: "791", anchor: "178", cosmo: "665", hex: "#354788", name: "V Dk Cornflower Blue" },
  { dmc: "792", anchor: "177", cosmo: "664", hex: "#4E6BA7", name: "Dk Cornflower Blue" },
  { dmc: "793", anchor: "176", cosmo: "663", hex: "#7A96C4", name: "Med Cornflower Blue" },
  { dmc: "794", anchor: "175", cosmo: "662", hex: "#A8BFE0", name: "Lt Cornflower Blue" },
  { dmc: "796", anchor: "133", cosmo: "654", hex: "#0A2E7A", name: "Dk Royal Blue" },
  { dmc: "797", anchor: "132", cosmo: "653", hex: "#1D3D8F", name: "Royal Blue" },
  { dmc: "798", anchor: "131", cosmo: "652", hex: "#3B5EAB", name: "Dk Delft Blue" },
  { dmc: "799", anchor: "130", cosmo: "651", hex: "#6F8BC8", name: "Med Delft Blue" },
  { dmc: "800", anchor: "128", cosmo: "650", hex: "#C0D4EF", name: "Pale Delft Blue" },
  { dmc: "995", anchor: "410", cosmo: "730", hex: "#00A3D9", name: "Dk Electric Blue" },
  { dmc: "996", anchor: "433", cosmo: "731", hex: "#36C3E8", name: "Med Electric Blue" },
  { dmc: "699", anchor: "923", cosmo: "920", hex: "#0A6B2E", name: "Green" },
  { dmc: "700", anchor: "228", cosmo: "921", hex: "#0C7A34", name: "Bright Green" },
  { dmc: "701", anchor: "227", cosmo: "922", hex: "#3A9B57", name: "Lt Green" },
  { dmc: "702", anchor: "226", cosmo: "923", hex: "#56AD6A", name: "Kelly Green" },
  { dmc: "703", anchor: "238", cosmo: "924", hex: "#72BE7E", name: "Chartreuse" },
  { dmc: "704", anchor: "237", cosmo: "925", hex: "#92D18B", name: "Bright Chartreuse" },
  { dmc: "986", anchor: "246", cosmo: "840", hex: "#365D2B", name: "V Dk Forest Green" },
  { dmc: "987", anchor: "244", cosmo: "841", hex: "#4D7B39", name: "Dk Forest Green" },
  { dmc: "988", anchor: "243", cosmo: "842", hex: "#669B4A", name: "Med Forest Green" },
  { dmc: "989", anchor: "242", cosmo: "843", hex: "#7FB85C", name: "Forest Green" },
  { dmc: "720", anchor: "326", cosmo: "444", hex: "#C95017", name: "Dk Orange Spice" },
  { dmc: "721", anchor: "324", cosmo: "443", hex: "#E06E2C", name: "Med Orange Spice" },
  { dmc: "722", anchor: "323", cosmo: "442", hex: "#F09848", name: "Lt Orange Spice" },
  { dmc: "740", anchor: "316", cosmo: "450", hex: "#FF8400", name: "Tangerine" },
  { dmc: "741", anchor: "304", cosmo: "451", hex: "#FFA016", name: "Med Tangerine" },
  { dmc: "742", anchor: "303", cosmo: "452", hex: "#FFC14E", name: "Lt Tangerine" },
  { dmc: "743", anchor: "302", cosmo: "700", hex: "#FFD56C", name: "Med Yellow" },
  { dmc: "744", anchor: "301", cosmo: "701", hex: "#FFE38A", name: "Pale Yellow" },
  { dmc: "745", anchor: "300", cosmo: "702", hex: "#FFF0AA", name: "Lt Pale Yellow" },
  { dmc: "307", anchor: "289", cosmo: "703", hex: "#FFE521", name: "Lemon" },
  { dmc: "444", anchor: "290", cosmo: "704", hex: "#FFD300", name: "Dk Lemon" },
  { dmc: "729", anchor: "890", cosmo: "576", hex: "#C5A243", name: "Med Old Gold" },
  { dmc: "680", anchor: "901", cosmo: "575", hex: "#9A7B24", name: "Dk Old Gold" },
  { dmc: "676", anchor: "891", cosmo: "577", hex: "#DEC065", name: "Lt Old Gold" },
  { dmc: "677", anchor: "886", cosmo: "578", hex: "#F0DCA0", name: "V Lt Old Gold" },
  { dmc: "780", anchor: "309", cosmo: "570", hex: "#8B6914", name: "V Dk Topaz" },
  { dmc: "781", anchor: "308", cosmo: "571", hex: "#A37D1B", name: "Dk Topaz" },
  { dmc: "782", anchor: "307", cosmo: "572", hex: "#BB9329", name: "Med Topaz" },
  { dmc: "783", anchor: "306", cosmo: "573", hex: "#CCA93E", name: "Med Topaz" },
  { dmc: "434", anchor: "310", cosmo: "465", hex: "#8B5E2F", name: "Lt Brown" },
  { dmc: "435", anchor: "365", cosmo: "464", hex: "#9D6B37", name: "V Lt Brown" },
  { dmc: "436", anchor: "363", cosmo: "463", hex: "#BA8A4E", name: "Tan" },
  { dmc: "437", anchor: "362", cosmo: "462", hex: "#D0A76B", name: "Lt Tan" },
  { dmc: "838", anchor: "380", cosmo: "480", hex: "#3B2414", name: "V Dk Beige Brown" },
  { dmc: "839", anchor: "360", cosmo: "479", hex: "#4E3520", name: "Dk Beige Brown" },
  { dmc: "840", anchor: "379", cosmo: "478", hex: "#72563A", name: "Med Beige Brown" },
  { dmc: "841", anchor: "378", cosmo: "477", hex: "#9A8268", name: "Lt Beige Brown" },
  { dmc: "842", anchor: "376", cosmo: "476", hex: "#BCA88E", name: "V Lt Beige Brown" },
  { dmc: "318", anchor: "399", cosmo: "894", hex: "#8C8C8C", name: "Lt Steel Gray" },
  { dmc: "414", anchor: "400", cosmo: "895", hex: "#6E6E6E", name: "Dk Steel Gray" },
  { dmc: "317", anchor: "400", cosmo: "896", hex: "#575757", name: "Pewter Gray" },
  { dmc: "413", anchor: "401", cosmo: "897", hex: "#3C3C3C", name: "Dk Pewter Gray" },
  { dmc: "762", anchor: "397", cosmo: "893", hex: "#D5D5D5", name: "V Lt Pearl Gray" },
  { dmc: "415", anchor: "398", cosmo: "892", hex: "#B5B5B5", name: "Pearl Gray" },
];

type ViewMode = "search" | "palette" | "bulk";

// ── COMPONENT ─────────────────────────────────────────────────────

export default function ThreadConverterTool() {
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [search, setSearch] = useState("");
  const [searchBrand, setSearchBrand] = useState("any");
  const [palette, setPalette] = useState<string[]>([]);
  const [bulkInput, setBulkInput] = useState("");

  // Search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return THREADS.filter((t) => {
      if (searchBrand === "dmc") return t.dmc.toLowerCase().includes(q);
      if (searchBrand === "anchor") return t.anchor.toLowerCase().includes(q);
      if (searchBrand === "cosmo") return t.cosmo.toLowerCase().includes(q);
      return (
        t.dmc.toLowerCase().includes(q) ||
        t.anchor.toLowerCase().includes(q) ||
        t.cosmo.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    });
  }, [search, searchBrand]);

  // Palette entries
  const paletteEntries = useMemo(() => {
    return palette.map((dmc) => THREADS.find((t) => t.dmc === dmc)).filter(Boolean) as ThreadEntry[];
  }, [palette]);

  // Bulk convert
  const bulkResults = useMemo(() => {
    if (!bulkInput.trim()) return [];
    const numbers = bulkInput.split(/[\s,;]+/).filter(Boolean);
    return numbers.map((num) => {
      const match = THREADS.find((t) => t.dmc.toLowerCase() === num.toLowerCase());
      return { input: num, match };
    });
  }, [bulkInput]);

  const addToPalette = (dmc: string) => {
    if (!palette.includes(dmc)) {
      setPalette((prev) => [...prev, dmc]);
    }
  };

  const removeFromPalette = (dmc: string) => {
    setPalette((prev) => prev.filter((d) => d !== dmc));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1 flex-wrap">
        {([
          ["search", "🔍 Search"],
          ["palette", `🎨 Palette (${palette.length})`],
          ["bulk", "📋 Bulk Convert"],
        ] as [ViewMode, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setViewMode(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              viewMode === key ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm" : "text-bark-500 dark:text-bark-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── SEARCH MODE ────────────────────────────────────────── */}
      {viewMode === "search" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a thread number or color name…"
                className="input pl-10" />
            </div>
            <select value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)} className="select w-auto">
              <option value="any">All brands</option>
              <option value="dmc">DMC</option>
              <option value="anchor">Anchor</option>
              <option value="cosmo">Cosmo</option>
            </select>
          </div>

          {search.trim() && (
            <p className="text-xs text-bark-400 dark:text-bark-500">{searchResults.length} results</p>
          )}

          {searchResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="py-2 px-3 w-10"></th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">DMC</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Anchor</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Cosmo</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Color</th>
                    <th className="py-2 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {searchResults.slice(0, 30).map((t, i) => (
                    <tr key={i} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10">
                      <td className="py-2 px-3">
                        <div className="w-6 h-6 rounded border border-cream-300 dark:border-bark-600" style={{ backgroundColor: t.hex }} />
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-bark-800 dark:text-cream-100">{t.dmc}</td>
                      <td className="py-2 px-3 font-mono text-bark-600 dark:text-cream-300">{t.anchor}</td>
                      <td className="py-2 px-3 font-mono text-bark-600 dark:text-cream-300">{t.cosmo}</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">{t.name}</td>
                      <td className="py-2 px-3">
                        <button type="button" onClick={() => addToPalette(t.dmc)}
                          className="text-sage-600 dark:text-sage-400 text-xs hover:underline"
                          title="Add to palette">+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {search.trim() && searchResults.length === 0 && (
            <p className="text-sm text-bark-400 dark:text-bark-500">
              No matches found. This converter includes ~80 popular colors. Full 500-color database coming soon.
            </p>
          )}
        </div>
      )}

      {/* ── PALETTE MODE ───────────────────────────────────────── */}
      {viewMode === "palette" && (
        <div className="space-y-4">
          {paletteEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-bark-400 dark:text-bark-500">Your palette is empty.</p>
              <p className="text-sm text-bark-400 dark:text-bark-500 mt-1">Search for colors and click + to build your palette.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                {paletteEntries.map((t) => (
                  <div key={t.dmc} className="relative group">
                    <div className="w-10 h-10 rounded-lg border-2 border-cream-300 dark:border-bark-600" style={{ backgroundColor: t.hex }}
                      title={`DMC ${t.dmc} - ${t.name}`} />
                    <button type="button" onClick={() => removeFromPalette(t.dmc)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                      <th className="py-2 px-3 w-10"></th>
                      <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">DMC</th>
                      <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Anchor</th>
                      <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Cosmo</th>
                      <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                    {paletteEntries.map((t) => (
                      <tr key={t.dmc}>
                        <td className="py-2 px-3">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: t.hex }} />
                        </td>
                        <td className="py-2 px-3 font-mono font-bold">{t.dmc}</td>
                        <td className="py-2 px-3 font-mono">{t.anchor}</td>
                        <td className="py-2 px-3 font-mono">{t.cosmo}</td>
                        <td className="py-2 px-3 text-bark-500 dark:text-bark-400">{t.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => {
                  const lines = paletteEntries.map((t) => `DMC ${t.dmc} → Anchor ${t.anchor} → Cosmo ${t.cosmo} (${t.name})`);
                  navigator.clipboard.writeText(lines.join("\n"));
                }} className="btn-secondary text-sm">📋 Copy palette</button>
                <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── BULK MODE ──────────────────────────────────────────── */}
      {viewMode === "bulk" && (
        <div className="space-y-4">
          <p className="text-sm text-bark-400 dark:text-bark-500">
            Paste a list of DMC numbers (comma or space separated) to convert them all at once.
          </p>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="310, 321, 699, 792, 742, blanc"
            className="input min-h-[80px] resize-y"
          />

          {bulkResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cream-300 dark:border-bark-600">
                    <th className="py-2 px-3 w-10"></th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">DMC</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Anchor</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Cosmo</th>
                    <th className="text-left py-2 px-3 font-semibold text-bark-700 dark:text-cream-200">Color</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-bark-700">
                  {bulkResults.map((r, i) => (
                    <tr key={i} className={r.match ? "" : "bg-rose-50/50 dark:bg-rose-900/10"}>
                      <td className="py-2 px-3">
                        {r.match ? (
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: r.match.hex }} />
                        ) : (
                          <span className="text-rose-500 text-xs">?</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold">{r.input}</td>
                      <td className="py-2 px-3 font-mono">{r.match?.anchor || "—"}</td>
                      <td className="py-2 px-3 font-mono">{r.match?.cosmo || "—"}</td>
                      <td className="py-2 px-3 text-bark-500 dark:text-bark-400">
                        {r.match?.name || "Not found"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
