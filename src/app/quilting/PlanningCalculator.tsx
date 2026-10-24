"use client";
import { useMemo, useState } from "react";
import { calculateBacking, calculateBatting, calculateBinding, calculateBorder } from "@/lib/quilting-planning.mjs";

const number = (value: string) => value.trim() === "" ? Number.NaN : Number(value);
const field = "input";
export default function PlanningCalculator({ type }: { type: "backing" | "binding" | "border" | "batting" }) {
  const [width, setWidth] = useState(""); const [length, setLength] = useState("");
  const [extra, setExtra] = useState(type === "border" ? "" : type === "binding" ? "2.5" : "4");
  const [fabricWidth, setFabricWidth] = useState("44"); const [rollWidth, setRollWidth] = useState("");
  const [prices, setPrices] = useState<Record<number, string>>({ 44: "", 90: "", 108: "" });
  const result = useMemo(() => {
    const common = { width: number(width), length: number(length) };
    if (type === "backing") return calculateBacking({ ...common, overhang: number(extra), prices: Object.fromEntries(Object.entries(prices).map(([fabric, price]) => [fabric, number(price)])) });
    if (type === "binding") return calculateBinding({ ...common, stripWidth: number(extra), fabricWidth: number(fabricWidth) });
    if (type === "border") return calculateBorder({ ...common, borderWidth: number(extra), fabricWidth: number(fabricWidth) });
    return calculateBatting({ ...common, overhang: number(extra), rollWidth: rollWidth === "" ? null : number(rollWidth) });
  }, [width, length, extra, fabricWidth, rollWidth, prices, type]);
  const label = type === "border" ? "Border cut width, including seam allowance" : type === "binding" ? "Binding strip width" : "Overhang per side";
  const invalid = result.status === "invalid";
  const errorId = `${type}-input-error`;
  return <section className="mt-8 space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-cream-100 p-5">
      <div><label className="label" htmlFor={`${type}-width`}>Quilt width (inches)</label><input className={field} id={`${type}-width`} type="number" min="0.01" max="10000" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={width} onChange={e => setWidth(e.target.value)} /></div>
      <div><label className="label" htmlFor={`${type}-length`}>Quilt length (inches)</label><input className={field} id={`${type}-length`} type="number" min="0.01" max="10000" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={length} onChange={e => setLength(e.target.value)} /></div>
      <div><label className="label" htmlFor={`${type}-extra`}>{label} (inches)</label><input className={field} id={`${type}-extra`} type="number" min="0.01" max="10000" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={extra} onChange={e => setExtra(e.target.value)} /></div>
      {type === "backing" && [44, 90, 108].map((fabricWidth) => <div key={fabricWidth}><label className="label" htmlFor={`backing-price-${fabricWidth}`}>{fabricWidth}&quot; price per yard (optional, USD)</label><input className={field} id={`backing-price-${fabricWidth}`} type="number" min="0.01" max="10000" step="0.01" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={prices[fabricWidth]} onChange={e => setPrices({ ...prices, [fabricWidth]: e.target.value })} /></div>)}
      {type !== "batting" && <div><label className="label" htmlFor={`${type}-fabric`}>Fabric width (inches)</label><input className={field} id={`${type}-fabric`} type="number" min="2.01" max="10000" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={fabricWidth} onChange={e => setFabricWidth(e.target.value)} /></div>}
      {type === "batting" && <div><label className="label" htmlFor="batting-roll">Roll batting width (optional, inches)</label><input className={field} id="batting-roll" type="number" min="0.01" max="10000" aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} value={rollWidth} onChange={e => setRollWidth(e.target.value)} /></div>}
    </div>
    <div className="result-card" aria-live="polite" aria-atomic="true">
      {invalid ? <p id={errorId} role="alert">{result.message}</p> : <Results type={type} result={result} />}
    </div>
  </section>;
}
type PlanningResult = Exclude<ReturnType<typeof calculateBacking>, { status: "invalid" }>
  | Exclude<ReturnType<typeof calculateBinding>, { status: "invalid" }>
  | Exclude<ReturnType<typeof calculateBorder>, { status: "invalid" }>
  | Exclude<ReturnType<typeof calculateBatting>, { status: "invalid" }>;

function Results({ type, result }: { type: string; result: PlanningResult }) {
  if (type === "backing" && "options" in result) {
    const standard = result.options.find((option) => option.fabricWidth === 44);
    const wideback = result.options.find((option) => option.fabricWidth === 108);
    const costDifference = standard?.cost != null && wideback?.cost != null ? standard.cost - wideback.cost : null;
    const seamDifference = (standard?.panels ?? 1) - (wideback?.panels ?? 1);
    return <><h2 className="text-xl font-semibold">Backing: {result.backingWidth} x {result.backingLength} inches</h2><div className="overflow-x-auto"><table className="mt-3 w-full text-left"><caption className="sr-only">Backing fabric comparison</caption><thead><tr><th>Fabric width</th><th>Panels</th><th>Yardage</th><th>Total cost</th></tr></thead><tbody>{result.options.map((option) => <tr key={option.fabricWidth} className={result.cheapest?.fabricWidth === option.fabricWidth ? "font-semibold" : undefined}><td>{option.fabricWidth}&quot;{result.cheapest?.fabricWidth === option.fabricWidth ? " (lowest cost)" : ""}</td><td>{option.panels}</td><td>{option.yardage} yd</td><td>{option.cost === null ? "Enter price" : `$${option.cost.toFixed(2)}`}</td></tr>)}</tbody></table></div>{costDifference !== null && <p className="mt-3 text-sm">{costDifference >= 0 ? `108″ wideback saves $${costDifference.toFixed(2)}` : `108″ wideback costs $${Math.abs(costDifference).toFixed(2)} more`} and avoids {seamDifference} seam{seamDifference === 1 ? "" : "s"} vs 44&quot;.</p>}<p className="mt-3 text-sm">Batting suggestion: at least {result.backingWidth} x {result.backingLength} inches.</p></>;
  }
  if (type === "binding" && "bindingLength" in result) return <><h2 className="text-xl font-semibold">{result.yardage} yd of binding fabric</h2><p>{result.strips} strips; finished binding length: {result.bindingLength}&quot; (perimeter: {result.perimeter}&quot;).</p></>;
  if (type === "border" && "finishedWidth" in result) return <><h2 className="text-xl font-semibold">Finished quilt: {result.finishedWidth} x {result.finishedLength} inches</h2><p>Lengthwise: {result.lengthwise.yardage} yd ({result.lengthwise.cuts} cuts). Crosswise: {result.crosswise.yardage} yd ({result.crosswise.strips} strips).</p><p className="text-sm">Crosswise uses more seams, often less fabric.</p></>;
  if ("requiredWidth" in result) return <><h2 className="text-xl font-semibold">Required batting: {result.requiredWidth} x {result.requiredLength} inches</h2><p>Smallest common packaged size that fits: {result.packaged ? `${result.packaged.name} ${result.packaged.width} x ${result.packaged.length}` : "None of the listed sizes"}.</p>{result.rollYardage !== null && <p>Roll batting needed: {result.rollYardage} yd.</p>}</>;
  return null;
}
