"use client";

import { useState, useMemo } from "react";
import Tooltip from "@/components/Tooltip";
import StickyResult from "@/components/StickyResult";
import PlanningPackResultCta from "@/components/PlanningPackResultCta";
import { calculateProjectCostSummary } from "@/lib/project-cost.mjs";

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

function formatEstimatedTime(minutes: number) {
  const value = minutes < 60 ? minutes : minutes / 60;
  const rounded = Number(value.toFixed(2));
  const unit = minutes < 60
    ? (rounded === 1 ? "minute" : "minutes")
    : (rounded === 1 ? "hour" : "hours");
  return `${rounded} ${unit}`;
}

// ── COMPONENT ─────────────────────────────────────────────────────

export default function ProjectCostCalculatorTool() {
  const [currency, setCurrency] = useState("USD");
  const [yarns, setYarns] = useState<YarnEntry[]>([
    { id: genId(), name: "Main color", skeins: "", pricePerSkein: "" },
  ]);
  const [notions, setNotions] = useState<NotionEntry[]>([]);

  // Time estimator
  const [totalStitches, setTotalStitches] = useState("");
  const [stitchesPerMin, setStitchesPerMin] = useState("");
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
  const result = useMemo(
    () => calculateProjectCostSummary(
      yarns,
      notions,
      totalStitches,
      stitchesPerMin,
      sellingPrice,
    ),
    [yarns, notions, totalStitches, stitchesPerMin, sellingPrice],
  );
  const hasResult = result.totalCost > 0 || result.minutes > 0;
  const estimatedTime = result.minutes > 0 ? formatEstimatedTime(result.minutes) : "";

  const stickySummary = hasResult
    ? `${sym}${result.totalCost.toFixed(2)} entered materials${estimatedTime ? ` • ~${estimatedTime}` : ""}`
    : "";

  return (
    <div className="space-y-8">
      {/* Currency */}
      <div className="flex items-center gap-3">
        <label htmlFor="project-cost-currency" className="label mb-0">Currency</label>
        <select id="project-cost-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="select w-auto">
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
              {yarns.map((y, yarnIndex) => (
                <div key={y.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label htmlFor={`project-cost-yarn-${yarnIndex}-name`} className="sr-only">
                      Yarn {yarnIndex + 1} name
                    </label>
                    <input id={`project-cost-yarn-${yarnIndex}-name`} type="text" value={y.name} onChange={(e) => updateYarn(y.id, { name: e.target.value })}
                      placeholder="Color name" className="input text-sm" maxLength={20} />
                  </div>
                  <div className="w-20">
                    <label htmlFor={`project-cost-yarn-${yarnIndex}-skeins`} className="text-xs text-bark-400 dark:text-bark-500 block mb-1">
                      <span className="sr-only">Yarn {yarnIndex + 1} </span>Skeins
                    </label>
                    <input id={`project-cost-yarn-${yarnIndex}-skeins`} type="number" value={y.skeins} onChange={(e) => updateYarn(y.id, { skeins: e.target.value })}
                      placeholder="3" className="input text-sm" min="0" inputMode="decimal" />
                  </div>
                  <div className="w-24">
                    <label htmlFor={`project-cost-yarn-${yarnIndex}-price`} className="text-xs text-bark-400 dark:text-bark-500 block mb-1">
                      <span className="sr-only">Yarn {yarnIndex + 1} </span>{sym}/skein
                    </label>
                    <input id={`project-cost-yarn-${yarnIndex}-price`} type="number" value={y.pricePerSkein} onChange={(e) => updateYarn(y.id, { pricePerSkein: e.target.value })}
                      placeholder="8.99" className="input text-sm" min="0" step="0.01" inputMode="decimal" />
                  </div>
                  {yarns.length > 1 && (
                    <button type="button" onClick={() => removeYarn(y.id)} aria-label={`Remove yarn entry ${yarnIndex + 1}`} className="text-bark-400 hover:text-rose-500 pb-2">✕</button>
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
              {notions.map((n, notionIndex) => (
                <div key={n.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label htmlFor={`project-cost-notion-${notionIndex}-name`} className="sr-only">
                      Notion or extra {notionIndex + 1} name
                    </label>
                    <input id={`project-cost-notion-${notionIndex}-name`} type="text" value={n.name} onChange={(e) => updateNotion(n.id, { name: e.target.value })}
                      placeholder="e.g. Buttons" className="input text-sm" maxLength={30} />
                  </div>
                  <div className="w-24">
                    <label htmlFor={`project-cost-notion-${notionIndex}-price`} className="sr-only">
                      Notion or extra {notionIndex + 1} price in {currency}
                    </label>
                    <input id={`project-cost-notion-${notionIndex}-price`} type="number" value={n.price} onChange={(e) => updateNotion(n.id, { price: e.target.value })}
                      placeholder={`${sym}0.00`} className="input text-sm" min="0" step="0.01" inputMode="decimal" />
                  </div>
                  <button type="button" onClick={() => removeNotion(n.id)} aria-label={`Remove notion or extra ${notionIndex + 1}`} className="text-bark-400 hover:text-rose-500 pb-2">✕</button>
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
                <label htmlFor="project-cost-total-stitches" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Total stitches
                  <Tooltip text="From your yarn calculator or pattern. Leave blank to skip time estimate." />
                </label>
                <input id="project-cost-total-stitches" type="number" value={totalStitches} onChange={(e) => setTotalStitches(e.target.value)}
                  placeholder="50000" className="input text-sm" min="0" inputMode="numeric" />
              </div>
              <div>
                <label htmlFor="project-cost-stitches-per-minute" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                  Assumed stitch rate (st/min)
                  <Tooltip text="Enter a measured stitches-per-minute assumption for a representative section. One constant rate cannot include setup, finishing, corrections, or breaks." />
                </label>
                <input id="project-cost-stitches-per-minute" type="number" value={stitchesPerMin} onChange={(e) => setStitchesPerMin(e.target.value)}
                  placeholder="25" className="input text-sm" min="1" inputMode="numeric" />
              </div>
            </div>

            <div>
              <label htmlFor="project-cost-selling-price" className="text-xs text-bark-500 dark:text-bark-400 block mb-1">
                Selling price ({sym}), optional
                <Tooltip text="This optional scenario subtracts entered materials and divides the remainder by estimated stitching hours. It is not labor cost, net profit, or a price recommendation." />
              </label>
              <input id="project-cost-selling-price" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00" className="input text-sm max-w-[160px]" min="0" step="0.01" inputMode="decimal" />
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div>
          <StickyResult summary={stickySummary} visible={hasResult}>
            <div className="result-card space-y-5 sticky top-24">
              <h3 className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
                Entered Material Subtotal
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
                  <span className="font-bold text-lg">Entered materials total</span>
                  <span className="font-bold text-2xl">{sym}{result.totalCost.toFixed(2)}</span>
                </div>
              </div>

              {result.hours > 0 && (
                <div className="border-t border-cream-300 dark:border-bark-600 pt-4 space-y-2">
                  <div className="flex justify-between text-bark-600 dark:text-cream-300">
                    <span>Estimated time (approx.)</span>
                    <span className="font-medium">{estimatedTime}</span>
                  </div>
                  {result.sell > 0 && (
                    <>
                      <div className="flex justify-between text-bark-600 dark:text-cream-300">
                        <span>Selling price</span>
                        <span className="font-medium">{sym}{result.sell.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-bark-600 dark:text-cream-300">
                        <span>Selling price minus entered materials</span>
                        <span className={`font-medium ${result.remainder >= 0 ? "text-sage-600 dark:text-sage-400" : "text-rose-500"}`}>
                          {sym}{result.remainder.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-bark-800 dark:text-cream-100 border-t border-cream-300 dark:border-bark-600 pt-2">
                        <span className="font-bold">
                          Hourly remainder after entered materials
                          <span className="block text-xs font-normal">Uses the unrounded time estimate</span>
                        </span>
                        <span className={`font-bold text-lg ${result.hourlyRemainder >= 0 ? "text-sage-600 dark:text-sage-400" : "text-rose-500"}`}>
                          {sym}{result.hourlyRemainder.toFixed(2)}/hr
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <button type="button" onClick={() => {
                const lines = [`Entered material subtotal: ${sym}${result.totalCost.toFixed(2)}`];
                lines.push(`Yarn subtotal: ${sym}${result.yarnCost.toFixed(2)}`);
                if (result.notionCost > 0) lines.push(`Notions and extras subtotal: ${sym}${result.notionCost.toFixed(2)}`);
                if (estimatedTime) lines.push(`Estimated stitching time: ~${estimatedTime}`);
                navigator.clipboard.writeText(lines.join("\n"));
              }} className="btn-secondary text-sm">
                📋 Copy breakdown
              </button>
              {result.totalCost > 0 ? <PlanningPackResultCta /> : null}
            </div>
          </StickyResult>
        </div>
      </div>
    </div>
  );
}
