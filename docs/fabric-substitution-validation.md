# Fabric Substitute Finder validation gates

This document separates launch readiness from later business validation. Passing code checks does not prove that the recommendations are useful or that the page will earn traffic.

## Technical launch gate

All items must pass before a release is proposed:

- Exactly 30 unique fabric IDs and slugs exist; every substitution reference resolves to a real ID.
- Every record has a source reference and `lastReviewedDate`.
- Scoring is deterministic, remains within 0–100, excludes the selected fabric, and sorts ties consistently.
- Known poor pairs cannot be labeled reasonable or strong.
- Both flows work with mouse, touch, and keyboard at narrow mobile width.
- The combobox exposes a label, expanded state, listbox relationship, active option, and keyboard selection.
- Analytics is consent-aware and includes only known IDs, flow names, match bands, booleans, and source groups. Typed search text is never sent.
- Metadata, canonical URL, WebApplication, FAQ, and Breadcrumb schema are present.
- No retailer link or retailer-click event is rendered until an approved real destination exists.
- Type checking, content lint, project tests, focused scoring tests, and production build pass.

## Recommendation-quality gate

Human reviewers should test at least 20 scenarios before calling the data validated:

- 8 common same-construction substitutions, including a light woven, bottom-weight woven, single knit, and double knit.
- 4 deliberate woven-to-knit contradictions.
- 4 known poor pairs from the data file.
- 4 project-suggestion cases covering transparency, required stretch, structure, and advanced handling.

For each scenario record expected label, observed label, top explanation, missing caution, and reviewer confidence. A release candidate should have no unsafe contradiction and at least 85% reviewer agreement on the broad label. Disagreement about an adjacent label is acceptable only when the explanation clearly exposes the uncertainty.

## Post-launch validation

Review privacy-safe aggregates after enough qualified use, not after a handful of clicks:

- selected known fabric IDs and flow mix;
- completed comparisons;
- result-expansion rate;
- helpful/not-helpful rate;
- source-information views;
- Search Console impressions, clicks, query-to-page mapping, and average position for the canonical URL.

Do not infer revenue, recommendation correctness, or causal traffic lift from clicks alone. Do not expand beyond 30 fabrics until the declared go-or-kill targets can be assessed over a documented window. Investigate any fabric with five or more negative responses before adding breadth.

## Internal go-or-kill targets

These are FiberTools product gates, not textile-industry benchmarks. Measure them over a declared validation window and keep qualified use separate from bots, internal testing, and accidental visits.

- 500 qualified visitors.
- 150 completed searches.
- 40 legitimate retailer-link clicks, but only after reviewed real retailer links are approved and displayed.
- 5 verified affiliate purchases, with provider evidence rather than click-based inference.
- 15 returning users within 30 days, using the site's existing privacy-safe aggregate reporting.
- At least 75% helpful ratings.
- Fewer than 5% materially incorrect result reports after human review.

The retailer-click and affiliate-purchase gates are unavailable in the initial MVP because the approved retailer-link list is intentionally empty. Zero events during that period must be labeled “not yet measurable,” not failure and not zero demand. Do not create placeholder destinations to make the metric available.

## Expansion gate

Add a fabric only when it fills a repeated user or search need and has enough non-retailer evidence to populate every required field honestly. Add retailer links only after destination review, affiliate disclosure review, and owner approval. A larger database is not automatically a better database; unverified rows make every score look more precise while making the tool less trustworthy.

**Do not expand the fabric database with unsourced AI-generated facts.**
