"use client";
import { useState } from "react";
import { lookupThreadCode, THREAD_CONVERSION_TABLE, THREAD_REFERENCE_METADATA } from "@/lib/thread-conversion.mjs";
export default function ThreadConverterTool() {
  const [brand,setBrand] = useState<"dmc" | "anchor">("dmc");
  const [code,setCode] = useState("");
  const result = code.trim() ? lookupThreadCode(brand,code) : null;
  const matches: Array<{dmc: string; anchor: string}> = result?.status === "found" ? [result.entry] : result?.status === "ambiguous" ? result.matches : [];
  return <section className="space-y-4" aria-label="Archived thread chart lookup">
    <h2 className="text-xl font-semibold">DMC and Anchor chart lookup</h2>
    <p>This limited reference includes {THREAD_CONVERSION_TABLE.length} pairings from an archived Anchor Stranded Cotton Art. 4635000 chart. It reports the chart, not an exact physical color match or current shade availability. Cosmo mappings are unavailable.</p>
    <label className="label" htmlFor="thread-source-brand">Source brand</label>
    <select id="thread-source-brand" className="input" value={brand} onChange={e=>setBrand(e.target.value as "dmc" | "anchor")}><option value="dmc">DMC</option><option value="anchor">Anchor</option></select>
    <label className="label" htmlFor="thread-source-code">Exact shade code</label>
    <input id="thread-source-code" className="input" value={code} maxLength={20} onChange={e=>setCode(e.target.value)} placeholder="e.g. 310" />
    <div aria-live="polite" aria-atomic="true">
      {result?.status === "unknown" && <p>Not included in this limited chart lookup. No substitute is inferred.</p>}
      {result?.status === "invalid" && <p role="alert">{result.message}</p>}
      {result?.status === "ambiguous" && <p>Multiple DMC shades share this Anchor code in the source. Do not choose one automatically.</p>}
      {matches.map(row=><p key={row.dmc} className="result-card">DMC {row.dmc} / Anchor {row.anchor} — archived chart pairing; compare physical thread before substituting.</p>)}
    </div>
    <details><summary className="cursor-pointer">Show all included pairings</summary><div className="overflow-x-auto"><table className="w-full"><caption>Archived Anchor chart subset</caption><thead><tr><th>DMC</th><th>Anchor</th></tr></thead><tbody>{THREAD_CONVERSION_TABLE.map(row=><tr key={row.dmc}><td>{row.dmc}</td><td>{row.anchor}</td></tr>)}</tbody></table></div></details>
    <p><a className="underline" href={THREAD_REFERENCE_METADATA.sourceUrl}>Source: archived Anchor conversion chart, page 2 (Quilters Store mirror)</a>. Publication date is not stated in the document. This is a historical reference, not a current manufacturer certification. Verify the product line and compare current physical shade cards before buying.</p>
  </section>;
}
