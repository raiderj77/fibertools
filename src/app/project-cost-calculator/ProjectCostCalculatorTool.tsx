"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";

// ── TYPES ─────────────────────────────────────────────────────────

interface YarnEntry {
  id: string;
  name: string;
  skeins: string;
  pricePerSkein: string;
}

interface NotionEntry {
  id: string;
  name: string;
  price: string;
}

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "\u20AC" },
  { code: "GBP", symbol: "\u00A3" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "\u00A5" },
];

function genId() { return Math.random().toString(36).substring(2, 8); }

// ── COMPONENT ─────────────────────────────────────────────────────

export default function ProjectCostCalculatorTool() {
  const [currency, setCurrency] = useState("USD");
  const [yarns, setYarns] = useState<YarnEntry[]>([
    { id: genId(), name: "Main color", skeins: "", pricePerSkein: "" },
  ]);
  const [notions, setNotions] = useState<NotionEntry[]>([]);

  // Time estimator
  const [totalStitches, setTotalStitches] = useState("");
  const [stitchesPerMin, setStitchesPerMin] = useState("25");
  const [sellingPrice, setSellingPrice] = useState("");

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol || "$";

  // Add/remove yarns
  const addYarn = () => {
    if (yarns.length >= 10) return;
    setYarns((prev) => [...prev, { id: genId(), name: `Color ${prev.length + 1}`, skeins: "", pricePerSkein: "" }]);
  };

  const removeYarn = (id: string) => {
    if (yarns.length <= 1) return;
    setYarns((prev) => prev.filter((y) => y.id !== id));
  };

  const updateYarn = (id: string, field: Partial<YarnEntry>) => {
    setYarns((prev) => prev.map((y) => y.id === id ? { ...y, ...field } : y));
  };

  // Add/remove notions
  const addNotion = () => {
    setNotions((prev) => [...prev, { id: genId(), name: "", price: "" }]);
  };

  const removeNotion = (id: string) => {
    setNotions((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNotion = (id: string, field: Partial<NotionEntry>) => {
    setNotions((prev) => prev.map((n) => n.id === id ? { ...n, ...field } : n));
  };

  // Results
  const result = useMemo(() => {
    const yarnCost = yarns.reduce((sum, y) => {
      const skeins = parseFloat(y.skeins) || 0;
      const price = parseFloat(y.pricePerSkein) || 0;
      return sum + skeins * price;
    }, 0);

    const notionCost = notions.reduce((sum, n) => sum + (parseFloat(n.price) || 0), 0);
    const totalCost = yarnCost + notionCost;

    // Time
    const stitches = parseInt(totalStitches) || 0;
    const spm = parseInt(stitchesPerMin) || 25;
    const minutes = stitches > 0 ? stitches / spm : 0;
    const hours = minutes / 60;

    // Hourly rate
    const sell = parseFloat(sellingPrice) || 0;
    const hourlyRate = hours > 0 && sell > 0 ? (sell - totalCost) / hours : 0;

    return {
      yarnCost: +yarnCost.toFixed(2),
      notionCost: +notionCost.toFixed(2),
      totalCost: +totalCost.toFixed(2),
      hours: +hours.toFixed(1),
      minutes: Math.round(minutes),
      hourlyRate: +hourlyRate.toFixed(2),
      sell,
      profit: +(sell - totalCost).toFixed(2),
    };
  }, [yarns, notions, totalStitches, stitchesPerMin, sellingPrice]);

  const stickySummary = result.totalCost > 0
    ? `${sym}${result.totalCost.toFixed(2)} total${result.hours > 0 ? ` • ${result.hours}h` : ""}`
    : "";

  return (
    <div className="space-y-8">
      {/* Currency */}
      <div className="flex items-center gap-3">
        <label className="label mb-0">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="select w-auto">
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: inputs */}
        <div className="space-y-6">
          {/* Yarn costs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label mb-0">Yarn</p>
              {yarns.length < 10 && (
                <button type="button" onClick={addYarn} className="text-sage-600 dark:text-sage-400 text-sm hover:underline">+ Add yarn</button>
              )}
            </div>
            <div className="space-y-3">
              {yarns.map((y) => (
                <div key={y.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input type="text" value={y.name} onChange={(e) => updateYarn(y.id, { name: e.target.value })}
                      placeholder="Color name" className="input text-sm" maxLength={20} />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-bark-400 dark:text-bark-500 block mb-1">Skeins</label>
                    <input type="number" value={y.skeins} onChange={(e) => updateYarn(y.id, { skeins: e.target.value })}
                      placeholder="3" className="input text-sm" min="0" inputMode="decimal" />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-bark-400 dark:text-bark-500 block mb-1">{sym}/skein</label>
                    <input type="number" value={y.pricePerSkein} onChange={(e) => updateYarn(y.id, { pricePerSkein: e.target.value })}
                      placeholder="8.99" className="input text-sm" min="0" step="0.01" inputMode="decimal" />
                  </div>
                  {yarns.length > 1 && (
                    <button type="button" onClick={() => removeYarn(y.id)} className="text-bark-400 hover:text-rose-500 pb-2">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label mb-0">
                Notions &amp; Extras
                <Tooltip text="Buttons, zippers, stitch markers, stuffing, pattern cost, etc." />
              </p>
              <button type="button" onClick={addNotion} className="text-sage-600 dark:text-sage-400 text-sm hover:underline">+ Add item</button>
            </div>
            {notions.length === 0 && (
              <p className="text-xs text-bark-400 dark:text-bark-500">No notions added. Click + to add buttons, zippers, patterns, etc.</p>
            )}
            <div className="space-y-2">
              {notions.map((n) => (
                <div key={n.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input type="text" value={n.name} onChange={(e) => updateNotion(n.id, { name: e.target.value })}
                      placeholder="e.g. Buttons" className="input text-sm" maxLength={30} />
                  </div>
                  <div className="w-24">
                    <input type="number" value={n.price} onChange={(e) => updateNotion(n.id, { price: e.target.value })}
                      placeholder={`${sym}0.00`} className="input text-sm" min="0" step="0.01" inputMode="decimal" />
                  </div>
                  <button type="button" onClick={() => removeNotion(n.id)} className="text-bark-400 hover:text-rose-500 pb-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Time estimator */}
          <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-bark-700 dark:text-cream-200">
              ⏱️ Time Estimator (optional)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Total stitches
                  <Tooltip text="From your yarn calculator or pattern. Leave blank to skip time estimate." />
                </label>
                <input type="number" value={totalStitches} onChange={(e) => setTotalStitches(e.target.value)}
                  placeholder="50000" className="input text-sm" min="0" inputMode="numeric" />
              </div>
              <div>
                <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Your speed (st/min)
                  <Tooltip text="Average stitches per minute. Beginners: 15-20. Intermediate: 25-35. Fast: 40+." />
                </label>
                <input type="number" value={stitchesPerMin} onChange={(e) => setStitchesPerMin(e.target.value)}
                  placeholder="25" className="input text-sm" min="1" inputMode="numeric" />
              </div>
            </div>

            <div>
              <label className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                Selling price ({sym}) — optional
                <Tooltip text="If you were to sell this item, what would you charge? We will calculate your effective hourly rate." />
              </label>
              <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00" className="input text-sm max-w-[160px]" min="0" step="0.01" inputMode="decimal" />
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div>
          <StickyResult summary={stickySummary} visible={result.totalCost > 0}>
            <div className="result-card space-y-5 sticky top-24">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                Project Cost
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-bark-600 dark:text-cream-300">
                  <span>Yarn</span>
                  <span className="font-medium">{sym}{result.yarnCost.toFixed(2)}</span>
                </div>
                {result.notionCost > 0 && (
                  <div className="flex justify-between text-bark-600 dark:text-cream-300">
                    <span>Notions</span>
                    <span className="font-medium">{sym}{result.notionCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-bark-800 dark:text-cream-100 border-t border-cream-300 dark:border-bark-600 pt-3">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">{sym}{result.totalCost.toFixed(2)}</span>
                </div>
              </div>

              {result.hours > 0 && (
                <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-2">
                  <div className="flex justify-between text-bark-600 dark:text-cream-300">
                    <span>Estimated time</span>
                    <span className="font-medium">{result.hours} hours</span>
                  </div>
                  {result.sell > 0 && (
                    <>
                      <div className="flex justify-between text-bark-600 dark:text-cream-300">
                        <span>Selling price</span>
                        <span className="font-medium">{sym}{result.sell.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-bark-600 dark:text-cream-300">
                        <span>Profit after materials</span>
                        <span className={`font-medium ${result.profit >= 0 ? "text-sage-600 dark:text-sage-400" : "text-rose-500"}`}>
                          {sym}{result.profit.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-bark-800 dark:text-cream-100 border-t border-cream-300 dark:border-bark-600 pt-2">
                        <span className="font-bold">Effective hourly rate</span>
                        <span className={`font-bold text-lg ${result.hourlyRate >= 0 ? "text-sage-600 dark:text-sage-400" : "text-rose-500"}`}>
                          {sym}{result.hourlyRate.toFixed(2)}/hr
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <button type="button" onClick={() => {
                const lines = [`Project cost: ${sym}${result.totalCost.toFixed(2)}`];
                yarns.forEach((y) => { if (y.skeins && y.pricePerSkein) lines.push(`  ${y.name}: ${y.skeins} skeins × ${sym}${y.pricePerSkein}`); });
                if (result.hours > 0) lines.push(`Est. time: ${result.hours} hours`);
                navigator.clipboard.writeText(lines.join("\n"));
              }} className="btn-secondary text-sm">
                📋 Copy breakdown
              </button>
            </div>
          </StickyResult>
        </div>
      </div>
    </div>
  );
}
