"use client";

import { useMemo, useState } from "react";
import StickyResult from "@/components/StickyResult";
import { calculatePartialSkeinLength } from "@/lib/yarn-swatch-estimate.mjs";

export default function StashEstimatorTool() {
  const [partialWeight, setPartialWeight] = useState("");
  const [fullWeight, setFullWeight] = useState("");
  const [fullYardage, setFullYardage] = useState("");
  const result = useMemo(() => calculatePartialSkeinLength({
    partialWeight, fullWeight, fullLength: fullYardage, units: "imperial",
  }), [partialWeight, fullWeight, fullYardage]);
  const complete = [partialWeight, fullWeight, fullYardage].every((value) => value.trim() !== "");
  return (
    <div className="space-y-6">
      <p className="text-bark-600 dark:text-cream-300">Use the original label for this same yarn. Weigh only the remaining yarn, excluding labels, cones, needles, and other materials. Both weights below are grams; the label length is yards.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label htmlFor="stash-partial-weight" className="label">Remaining yarn (g)</label>
          <input id="stash-partial-weight" className="input" type="number" min="0" max="100000" step="any" value={partialWeight} onChange={(event) => setPartialWeight(event.target.value)} /></div>
        <div><label htmlFor="stash-full-weight" className="label">Full skein label weight (g)</label>
          <input id="stash-full-weight" className="input" type="number" min="0" max="100000" step="any" value={fullWeight} onChange={(event) => setFullWeight(event.target.value)} /></div>
        <div><label htmlFor="stash-label-yards" className="label">Full skein label length (yards)</label>
          <input id="stash-label-yards" className="input" type="number" min="0" max="1000000" step="any" value={fullYardage} onChange={(event) => setFullYardage(event.target.value)} /></div>
      </div>
      {complete && !result && <p role="alert" className="text-rose-700 dark:text-rose-300">Use positive finite values within the field limits. Remaining yarn cannot weigh more than the full labeled skein.</p>}
      <StickyResult visible={!!result} summary={result ? `About ${Number(result.yards.toFixed(1))} yards remaining` : ""}>
        {result && <div className="result-card" role="status" aria-live="polite">
          <h2 className="text-xl font-semibold">Estimated remaining yarn</h2>
          <p className="text-2xl">{Number(result.yards.toFixed(1))} yards / {Number(result.meters.toFixed(1))} meters</p>
          <p>{Number(result.percentRemaining.toFixed(1))}% of the labeled length by weight.</p>
          <p className="mt-3 text-sm">Remaining length = remaining weight / label weight × label length. The estimate assumes consistent length per gram within this yarn. Scale precision, moisture, label tolerances, and uneven yarn construction affect the result. Compare with your measured project requirement and allowance.</p>
        </div>}
      </StickyResult>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">If the label is missing</h2>
        <p>A yarn weight category describes a thickness range; it does not establish yards per gram. Look up the exact yarn or measure a known length and its weight to establish a ratio. Do not use a category average as a purchase or project-quantity calculation.</p>
        <p>Arithmetic example: a label stating 220 yards per 100 g and a remaining weight of 42 g gives 42 / 100 × 220 = 92.4 yards. This example is not a claim about all worsted-weight yarn or the amount needed for a particular project.</p>
      </section>
    </div>
  );
}
