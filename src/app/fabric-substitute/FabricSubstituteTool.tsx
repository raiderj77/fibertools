"use client";

import { useEffect, useId, useMemo, useState } from "react";
import useToolCompletion from "@/lib/useToolCompletion";
import { fabrics } from "@/lib/fabric-data";
import { projectSuggestionsFor, rankFabricSubstitutes, searchFabrics } from "@/lib/fabric-matching";
import { trackFabricEvent } from "@/lib/fabric-analytics";
import type { FabricRecord } from "@/lib/fabric-types";

type Flow = "substitutes" | "projects";

const badgeStyles: Record<string, string> = {
  "Strong substitute": "bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-200",
  "Reasonable substitute": "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  "Possible substitute with adjustments": "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  "Poor substitute": "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
};

function expectedGarmentEffect(source: FabricRecord, candidate: FabricRecord): string {
  const effects: string[] = [];
  const sourceWeight = (source.weightGsmMin + source.weightGsmMax) / 2;
  const candidateWeight = (candidate.weightGsmMin + candidate.weightGsmMax) / 2;
  if (candidateWeight > sourceWeight * 1.25) effects.push("heavier and potentially bulkier");
  if (candidateWeight < sourceWeight * 0.75) effects.push("lighter and potentially less opaque");
  if (candidate.drapeRating > source.drapeRating) effects.push("softer and more fluid");
  if (candidate.drapeRating < source.drapeRating) effects.push("crisper with less fluid movement");
  if (candidate.structureRating > source.structureRating) effects.push("more structured and farther from the body");
  if (candidate.structureRating < source.structureRating) effects.push("less able to hold sharp shaping");
  if (!effects.length) return "The silhouette should remain broadly similar, but fiber and finish can still change the hand and wear.";
  return `Expect the finished garment to feel ${effects.slice(0, 2).join(" and ")} than the original recommendation.`;
}

function FabricCombobox({ value, onChange }: { value: FabricRecord; onChange: (fabric: FabricRecord) => void }) {
  const inputId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState(value.displayName);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const matches = useMemo(() => searchFabrics(query, fabrics).slice(0, 10), [query]);

  useEffect(() => setQuery(value.displayName), [value]);

  function select(fabric: FabricRecord) {
    setQuery(fabric.displayName);
    setOpen(false);
    setActiveIndex(0);
    onChange(fabric);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && matches[activeIndex]) {
      event.preventDefault();
      select(matches[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(value.displayName);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-bark-700 dark:text-cream-200">
        Choose a fabric
      </label>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && matches[activeIndex] ? `${listboxId}-${matches[activeIndex].id}` : undefined}
        autoComplete="off"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
        className="min-h-12 w-full rounded-xl border border-bark-300 bg-white px-4 py-3 text-base text-bark-800 shadow-sm outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-200 dark:border-bark-600 dark:bg-bark-800 dark:text-cream-100"
        placeholder="Search fabric names or aliases"
      />
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Matching fabrics"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-bark-200 bg-white p-1 shadow-xl dark:border-bark-700 dark:bg-bark-900"
        >
          {matches.length ? matches.map((fabric, index) => (
            <li
              key={fabric.id}
              id={`${listboxId}-${fabric.id}`}
              role="option"
              aria-selected={fabric.id === value.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(fabric)}
              className={`min-h-12 cursor-pointer rounded-lg px-3 py-2 ${index === activeIndex ? "bg-plum-50 dark:bg-plum-900/40" : "hover:bg-cream-100 dark:hover:bg-bark-800"}`}
            >
              <span className="block font-medium text-bark-800 dark:text-cream-100">{fabric.displayName}</span>
              <span className="block text-xs text-bark-500 dark:text-bark-400">{fabric.aliases.join(", ")}</span>
            </li>
          )) : (
            <li className="px-3 py-4 text-sm text-bark-500">No fabric found. Try a broader name such as jersey, satin, or twill.</li>
          )}
        </ul>
      ) : null}
      <p className="mt-2 text-xs text-bark-500">Searches names and common aliases. Use the arrow keys and Enter to select.</p>
    </div>
  );
}

function FabricProfile({ fabric }: { fabric: FabricRecord }) {
  return (
    <section id="fabric-profile" tabIndex={-1} className="scroll-mt-24 rounded-2xl border border-bark-200 bg-white p-5 dark:border-bark-700 dark:bg-bark-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-plum-600">Fabric profile</p>
          <h3 className="mt-1 text-xl font-semibold text-bark-800 dark:text-cream-100">{fabric.displayName}</h3>
        </div>
        <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-bark-700 dark:bg-bark-700 dark:text-cream-200">{fabric.construction} · {fabric.weightLabel}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300">{fabric.description}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Construction</dt><dd className="text-bark-500">{fabric.constructionSubtype}</dd></div>
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Typical working weight</dt><dd className="text-bark-500">{fabric.weightGsmMin}–{fabric.weightGsmMax} GSM</dd></div>
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Crosswise stretch</dt><dd className="text-bark-500">{fabric.horizontalStretchMin}–{fabric.horizontalStretchMax}%</dd></div>
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Lengthwise stretch</dt><dd className="text-bark-500">{fabric.verticalStretchMin}–{fabric.verticalStretchMax}%</dd></div>
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Common fibers</dt><dd className="text-bark-500">{fabric.commonFibers.join(", ")}</dd></div>
        <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Ratings (1–5)</dt><dd className="text-bark-500">Drape {fabric.drapeRating}, structure {fabric.structureRating}, opacity {fabric.opacityRating}, recovery {fabric.recoveryRating}</dd></div>
      </dl>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><h4 className="text-sm font-semibold text-bark-700 dark:text-cream-200">Beginner note</h4><p className="mt-1 text-sm text-bark-500">{fabric.beginnerNotes}</p></div>
        <div><h4 className="text-sm font-semibold text-bark-700 dark:text-cream-200">Handling note</h4><p className="mt-1 text-sm text-bark-500">{fabric.handlingNotes}</p></div>
      </div>
    </section>
  );
}

export default function FabricSubstituteTool() {
  const [flow, setFlow] = useState<Flow>("substitutes");
  const [selected, setSelected] = useState(fabrics[0]);
  const [profile, setProfile] = useState(fabrics[0]);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(null);

  const matches = useMemo(() => rankFabricSubstitutes(selected, fabrics), [selected]);
  const projects = useMemo(() => projectSuggestionsFor(selected), [selected]);
  useToolCompletion("fabric-substitute", `${flow}:${selected.id}`);

  useEffect(() => {
    trackFabricEvent("fabric_tool_viewed", { flow: "substitutes" });
    trackFabricEvent("substitution_results_viewed", { flow: "substitutes", fabric_id: fabrics[0].id });
  }, []);

  function chooseFabric(fabric: FabricRecord) {
    setSelected(fabric);
    setProfile(fabric);
    setExpandedResult(null);
    setHelpful(null);
    trackFabricEvent("fabric_selected", { flow, fabric_id: fabric.id });
    trackFabricEvent(flow === "substitutes" ? "substitution_results_viewed" : "project_suggestions_viewed", { flow, fabric_id: fabric.id });
  }

  function switchFlow(next: Flow) {
    setFlow(next);
    setHelpful(null);
    trackFabricEvent("fabric_flow_selected", { flow: next, fabric_id: selected.id });
    trackFabricEvent(next === "substitutes" ? "substitution_results_viewed" : "project_suggestions_viewed", { flow: next, fabric_id: selected.id });
  }

  return (
    <section aria-label="Fabric substitute finder" className="rounded-2xl border border-bark-200 bg-cream-50 p-4 shadow-sm sm:p-6 dark:border-bark-700 dark:bg-bark-950/30">
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose a fabric tool flow">
        <button
          type="button"
          aria-pressed={flow === "substitutes"}
          onClick={() => switchFlow("substitutes")}
          className={`min-h-12 rounded-xl border px-4 py-3 text-left font-semibold transition ${flow === "substitutes" ? "border-plum-500 bg-plum-50 text-plum-800 ring-2 ring-plum-100 dark:bg-plum-900/30 dark:text-plum-100" : "border-bark-200 bg-white text-bark-700 hover:border-plum-300 dark:border-bark-700 dark:bg-bark-900 dark:text-cream-200"}`}
        >
          Find substitutes <span className="mt-1 block text-xs font-normal opacity-75">Compare construction, stretch, weight, drape, and recovery.</span>
        </button>
        <button
          type="button"
          aria-pressed={flow === "projects"}
          onClick={() => switchFlow("projects")}
          className={`min-h-12 rounded-xl border px-4 py-3 text-left font-semibold transition ${flow === "projects" ? "border-plum-500 bg-plum-50 text-plum-800 ring-2 ring-plum-100 dark:bg-plum-900/30 dark:text-plum-100" : "border-bark-200 bg-white text-bark-700 hover:border-plum-300 dark:border-bark-700 dark:bg-bark-900 dark:text-cream-200"}`}
        >
          What can I make? <span className="mt-1 block text-xs font-normal opacity-75">See suitable projects, limitations, lining, and skill notes.</span>
        </button>
      </div>

      <div className="mt-6">
        <FabricCombobox value={selected} onChange={chooseFabric} />
      </div>

      <div aria-live="polite" className="mt-8">
        {flow === "substitutes" ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">Substitutes for {selected.displayName}</h2>
                <p className="mt-1 text-sm text-bark-500">Scores compare observable fabric properties. They do not guarantee an identical finished garment.</p>
              </div>
              <button type="button" onClick={() => setShowAll((current) => !current)} className="min-h-11 rounded-lg border border-bark-300 bg-white px-3 py-2 text-sm font-medium text-bark-700 hover:border-plum-400 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-200">
                {showAll ? "Show best 8" : "Show all 29"}
              </button>
            </div>

            <ol className="mt-5 space-y-4">
              {matches.slice(0, showAll ? matches.length : 8).map((match, index) => {
                const expanded = expandedResult === match.fabric.id;
                return (
                  <li key={match.fabric.id} className="rounded-2xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-900">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-cream-200 text-sm font-bold text-bark-700 dark:bg-bark-700 dark:text-cream-200">{index + 1}</span>
                        <div>
                          <h3 className="font-semibold text-bark-800 dark:text-cream-100">{match.fabric.displayName}</h3>
                          <p className="mt-1 text-xs text-bark-500">{match.fabric.constructionSubtype} · {match.fabric.weightGsmMin}–{match.fabric.weightGsmMax} GSM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold tabular-nums text-bark-800 dark:text-cream-100">{match.score}<span className="text-sm font-normal text-bark-400">/100</span></div>
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[match.label]}`}>{match.label}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300">{match.reasons[0] || match.cautions[0]}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => {
                          setExpandedResult(expanded ? null : match.fabric.id);
                          if (!expanded) trackFabricEvent("result_expanded", { flow, fabric_id: selected.id, result_fabric_id: match.fabric.id, result_rank: index + 1, score_band: match.label });
                        }}
                        className="min-h-11 rounded-lg bg-plum-600 px-3 py-2 text-sm font-semibold text-white hover:bg-plum-700"
                      >
                        {expanded ? "Hide score details" : "Why this score?"}
                      </button>
                      <a
                        href="#fabric-profile"
                        onClick={() => setProfile(match.fabric)}
                        className="inline-flex min-h-11 items-center rounded-lg border border-bark-300 px-3 py-2 text-sm font-semibold text-bark-700 hover:border-plum-400 dark:border-bark-600 dark:text-cream-200"
                      >
                        View fabric profile
                      </a>
                    </div>
                    {expanded ? (
                      <div className="mt-4 border-t border-bark-100 pt-4 dark:border-bark-700">
                        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                          {Object.entries(match.breakdown).map(([key, value]) => <div key={key} className="rounded-lg bg-cream-100 p-2 dark:bg-bark-800"><span className="block capitalize text-bark-500">{key}</span><strong className="text-bark-800 dark:text-cream-100">{value}</strong></div>)}
                        </div>
                        <div className="mt-4 rounded-xl border border-bark-200 p-3 dark:border-bark-700" role="group" aria-label={`${selected.displayName} and ${match.fabric.displayName} property comparison`}>
                          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 text-xs font-semibold text-bark-700 dark:text-cream-200"><span>Pattern: {selected.displayName}</span><span>Substitute: {match.fabric.displayName}</span></div>
                          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                            {[
                              ["Crosswise stretch", `${selected.horizontalStretchMin}–${selected.horizontalStretchMax}%`, `${match.fabric.horizontalStretchMin}–${match.fabric.horizontalStretchMax}%`],
                              ["Weight", `${selected.weightGsmMin}–${selected.weightGsmMax} GSM`, `${match.fabric.weightGsmMin}–${match.fabric.weightGsmMax} GSM`],
                              ["Drape (1–5)", selected.drapeRating, match.fabric.drapeRating],
                              ["Structure (1–5)", selected.structureRating, match.fabric.structureRating],
                              ["Opacity (1–5)", selected.opacityRating, match.fabric.opacityRating],
                              ["Sewing difficulty (1–5)", selected.sewingDifficultyRating, match.fabric.sewingDifficultyRating],
                            ].map(([label, sourceValue, candidateValue]) => (
                              <div key={String(label)} className="rounded-lg bg-cream-100 p-2 dark:bg-bark-800">
                                <dt className="font-semibold text-bark-700 dark:text-cream-200">{label}</dt>
                                <dd className="mt-1 grid grid-cols-2 gap-2 text-bark-500"><span>{sourceValue}</span><span>{candidateValue}</span></dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div><h4 className="text-sm font-semibold text-sage-700 dark:text-sage-300">Why it can work</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-bark-600 dark:text-bark-300">{match.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
                          <div><h4 className="text-sm font-semibold text-rose-700 dark:text-rose-300">What to check first</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-bark-600 dark:text-bark-300">{match.cautions.length ? match.cautions.map((caution) => <li key={caution}>{caution}</li>) : <li>No major property conflict was detected; still test a swatch.</li>}</ul></div>
                        </div>
                        <div className="mt-4 rounded-xl bg-cream-100 p-4 text-sm text-bark-700 dark:bg-bark-800 dark:text-cream-200">
                          <p><strong>Expected garment effect:</strong> {expectedGarmentEffect(selected, match.fabric)}</p>
                          <p className="mt-2"><strong>Suitable projects:</strong> {match.fabric.commonUses.slice(0, 5).join(", ")}.</p>
                          {match.label === "Poor substitute" ? <p className="mt-2 font-semibold text-rose-700 dark:text-rose-300">Major pattern changes are likely. Do not treat this as an equivalent fabric.</p> : match.label === "Possible substitute with adjustments" ? <p className="mt-2 font-semibold text-orange-700 dark:text-orange-300">Pattern or construction adjustments are likely; test before cutting full yardage.</p> : null}
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">Projects for {selected.displayName}</h2>
            <p className="mt-1 text-sm text-bark-500">These are project categories, not patterns. Check the actual pattern&apos;s stretch, weight, and opacity requirements.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article key={project.name} className="rounded-2xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-900">
                  <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-bark-800 dark:text-cream-100">{project.name}</h3><span className="rounded-full bg-sage-100 px-2 py-1 text-xs font-semibold text-sage-800 dark:bg-sage-900/40 dark:text-sage-200">{project.suitability}</span></div>
                  <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300">{project.why}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Limitations</dt><dd className="text-bark-500">{project.limitations}</dd></div>
                    <div><dt className="font-semibold text-bark-700 dark:text-cream-200">Handling</dt><dd className="text-bark-500">{project.beginnerDifficulty}. {project.behavior}</dd></div>
                    <div className="flex flex-wrap gap-2 pt-1"><span className="rounded bg-cream-200 px-2 py-1 text-xs text-bark-700 dark:bg-bark-700 dark:text-cream-200">Lining: {project.liningUseful ? "useful" : "usually optional"}</span><span className="rounded bg-cream-200 px-2 py-1 text-xs text-bark-700 dark:bg-bark-700 dark:text-cream-200">Stretch: {project.stretchImportant ? "important" : "pattern-dependent"}</span></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <FabricProfile fabric={profile} />
      </div>

      <div className="mt-6 rounded-xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-900">
        <button
          type="button"
          aria-expanded={sourceOpen}
          onClick={() => {
            setSourceOpen((current) => !current);
            if (!sourceOpen) trackFabricEvent("source_information_viewed", { source_group: "selected_fabric", fabric_id: selected.id, flow });
          }}
          className="min-h-11 w-full text-left text-sm font-semibold text-bark-700 dark:text-cream-200"
        >
          {sourceOpen ? "Hide" : "Show"} data notes for {selected.displayName}
        </button>
        {sourceOpen ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-bark-500">{selected.sourceReferences.map((source) => <li key={source.id}><strong>{source.id}</strong>: {source.note}</li>)}</ul> : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-cream-100 p-4 dark:bg-bark-800">
        <span className="text-sm font-medium text-bark-700 dark:text-cream-200">Was this result useful?</span>
        {[true, false].map((answer) => <button key={String(answer)} type="button" aria-pressed={helpful === answer} onClick={() => { setHelpful(answer); trackFabricEvent(answer ? "result_helpful" : "result_not_helpful", { flow, fabric_id: selected.id }); }} className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold ${helpful === answer ? "border-plum-500 bg-plum-50 text-plum-800 dark:bg-plum-900/30 dark:text-plum-100" : "border-bark-300 bg-white text-bark-700 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-200"}`}>{answer ? "Yes" : "Not yet"}</button>)}
        {helpful !== null ? <span className="text-sm text-bark-500">Thanks—recorded without fabric notes or free text.</span> : null}
      </div>
    </section>
  );
}
