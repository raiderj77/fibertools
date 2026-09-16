# Illustrated article integration - September 16, 2026

Scope: four substantive article updates at existing guide URLs; no new route, calculator change, quarantined blog release or provider change. Owner authorized publication after correctness and image checks in the September 16 FiberTools task. The separate Blanket Calculator work remains outside this release.

## Content and images

| Existing destination | Draft date | Original image pair |
| --- | --- | --- |
| /guides/blanket-yarn-guide | 2026-09-07 | blanket-yarn-example.svg / .png |
| /guides/cast-on-methods-guide | 2026-09-09 | cast-on-repeat-count.svg / .png |
| /guides/yarn-stash-management-guide | 2026-09-11 | remaining-yarn-ratio.svg / .png |
| /guides/knitting-gauge-guide | 2026-09-16 | gauge-width-comparison.svg / .png |

All assets are in `public/images/guides`. They are original code-authored diagrams from the editorial drafts, with no third-party image assets. SVG is displayed inline as an image; PNG is the matching raster rendering. These are hypothetical arithmetic illustrations, not photographs or evidence of physical testing. Each has descriptive alternative text, explicit dimensions and a visible explanatory caption. Following current Google image guidance, these text-bearing diagrams are not newly designated as preferred social or structured-data previews; existing site metadata defaults remain unchanged.

The implementer inspected all four PNG renders on September 16: blanket dimensions and arithmetic match; 18 cast-on symbols are arranged as three groups of six; remaining-yarn bar is 42 percent of the full bar; gauge bars represent 40 and 32 inches at equal scale. Text fits, units match the drafts, and no physical stitch structure is depicted.

## Primary-source review

Read September 16, 2026:
- https://media.craftyarncouncil.com/read_instructions.html - gauge swatching with specified yarn, tools and stitch pattern; changing needle/hook size and re-swatching. Its older yarn-category paragraph is not used.
- https://www.craftyarncouncil.com/standards/yarn-weight-system - categories and guideline gauge ranges, not specific yarn length per mass.

The articles link these sources near the claims. Arithmetic examples are expressly hypothetical; area scaling and same-yarn mass ratios are mathematical models with stated limitations. The calculator links document current input conventions and model boundaries. Owner approval is not represented as expert craft review. Revised guides use FiberTools organization attribution with visible AI-assisted drafting disclosure; unchanged guides retain their existing attribution. Original publication dates, all 23 titles and slugs remain unchanged. These four modification dates are September 16.

## Checked arithmetic

- Blanket: 50 x 60 / (4 x 4) x 20 = 3,750 yd; x 1.10 = 4,125 yd; / 220 = 18.75, rounded up to 19 skeins. 18 skeins leave 165 yd short; 19 leave 55 yd extra. 19-yd and 21-yd samples give 3,918.75 and 4,331.25 planned yd, requiring 18 and 20 whole skeins respectively.
- Cast-on: 18 / 4 = 4.5 stitches/in; 10 x 4.5 = 45, upward multiple of 6 = 48, modeled width 10.6667 in. Raw 12.2 at 1 stitch/in rounds to 12 without a multiple and up to 18 with multiple 6. A separately specified 6 x 3 + 2 = 20 is not handled by the pure-multiple field.
- Stash: 42 / 100 x 220 = 92.4 yd = 84.49056 m, displayed 84.5 m; 41 g gives 90.2 yd and 43 g gives 94.6 yd. Hypothetical additional 3 g would add 6.6 yd.
- Gauge: 200 / (20 / 4) = 40 in; 200 / (25 / 4) = 32 in. Density increases 25 percent while width decreases 20 percent. 120 / 6 = 20 in; 120 / 7 = 17.142857 in. Preserving 40 in at 6.25 stitches/in gives 250 stitches; preserving 20 in at 7 rows/in gives 140 rows.

## Verification at implementer handoff

- `node --test tests/illustrated-article-updates.test.mjs tests/correction-dates.test.mjs tests/publication-freeze.test.mjs`: 22 passed, zero failures.
- `npm run lint:content`: passed.
- `npx tsc --noEmit --incremental false`: passed.
- Five new regression tests render the actual async page with React server rendering and existing sanitized Markdown dependencies. They verify complete article examples, linked citations, tables, image files/alt/captions, canonical metadata, original and modified dates, attribution, no new text-diagram preferred preview, and exact four-route approval scope. Added to existing `test:search-traffic`.
- Initial focused failures exposed registry parser expectations for unquoted static slug keys and outdated test fixture dates. Kept the registry's static-key convention; updated test clocks to the new approval date while retaining future-date/expiry and quarantine rejection checks.
- Required independent review, broad build gates, merge, deployment and live output verification belong to the parent release procedure. No release is claimed by this implementation record.

## Parent verification before release

- Independent ft_reviewer and ft_verifier cleared the implementation; follow-up review cleared the updated editorial regression assertions and seller-policy reminder.
- `npm run test:quality`: 438 passed, zero failures. The first broad run found four assertions bound to retired headings/wording; tests now assert the revised explicit arithmetic, consumption-per-area assumption and no inferred/doubled edges. The original negative safeguards remain.
- `npm run test:search-traffic`: 53 passed, zero failures.
- `node --test tests/editorial-accuracy-repairs.test.mjs tests/illustrated-article-updates.test.mjs`: 13 passed, zero failures after the final content edit.
- `npm run test:ui-accessibility`: 12 passed. `npm run test:gpc-consent`: 15 passed.
- `npm run test:security`: passed. `npm run test:affiliate`: passed for 11 monetized tools.
- Local production-browser checks passed all four routes: loaded inline images, descriptive alt/captions, rendered tables and prose, original canonical URLs, September 16 modification dates, Organization attribution, no JavaScript errors or mobile horizontal overflow. Parent visually inspected all four rendered figures.
- No blanket component or calculator formula is part of this release. No new blog route, quarantine release, payment, provider or publication-freeze lift is included.

Rollback: revert the article-only commit if a release regression appears. No database or provider migration is involved. Search eligibility is supported; indexing, rankings and citations are not guaranteed. Merge/deployment/live verification remain separate evidence stages recorded by the parent after they occur.
`npm run build`: final production build, TypeScript, prebuild and postbuild checks passed after the last content correction.
