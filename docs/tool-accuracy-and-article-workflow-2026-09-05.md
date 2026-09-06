# FiberTools accuracy audit and article workflow

Audit date: September 5, 2026. Scope: all 34 directory tools and the standalone yarn-weight calculator (35 total). Base: `5e9208212ba7dd6be17e58fd77d2627ea98dc855` in the canonical `raiderj77/fibertools` repository.

## Decision

Keep the existing tools and article architecture. Repair incorrect arithmetic, unsupported reference mappings, invalid-input handling, and contradictory explanations. Begin drafting against the corrected tool contracts. Do not make another speculative SEO/GEO/AEO redesign.

A passing calculation is evidence for its stated mathematical model and tested bounds. It does not prove physical fit, finished shape, fiber identity, color matching, consumption, search rankings, AI citations, or revenue. New defects and source changes still warrant maintenance; a permanent no-change guarantee is not defensible.

## Material repairs

- Cast-on counts round the raw count upward to a complete requested multiple: 12.2 with multiple 6 produces 18, not 12. Modeled width exposes the consequence. Pattern offsets and edges remain explicit exclusions.
- Blanket dimensions and gauge-only use work with prefilled skein labels; partial optional groups and unsafe counts are declined. Floating-point square boundaries no longer add a spurious granny-square row/column.
- Project-cost currency multiplication and subtotal rounding use exact decimal arithmetic. 1.5 skeins at 6.85 produces 10.28. Invalid negative, excessive-precision, and out-of-range amounts cannot silently disappear into a plausible subtotal.
- Sock ease, sleeve counts, C2C optional yarn use, circle preset keys, blocking overflow, gauge optional inputs, and pattern starting counts have stricter validation. Tiny spinning ratios retain meaningful digits.
- Counter state is validated before restoration, safe integer bounds are enforced, and malformed saved state is not overwritten on mount.
- Japanese needle diameters follow Clover, including JP8=4.5 mm and JP15=6.6 mm. US17 is12.75 mm. Unsupported historical labels are left unresolved.
- WPI preserves decimals and overlapping categories; stockinette gauge is not presented as crochet gauge. Categories do not imply a universal length per100g.
- Stash length uses the actual same-yarn label ratio:42g /100g x220yd =92.4yd. Weaving sett requires measured WPI rather than an invented category midpoint.
- The thread lookup contains20 traceable archived DMC/Anchor pairs. Ambiguous reverse mappings remain visible, unknown codes are declined, and Cosmo mappings are not invented. Physical matching/current availability remain unverified.
- Crochet operation counts and glossary definitions were corrected. Existing guides and discovery copy now follow the tool models; actual guide modification dates feed the page and sitemap.

## Coverage and repeatable checks

`npm run test:tool-accuracy` is part of `npm run test:quality`, which is an existing required CI gate. The consolidated suite exercises every tool family, with browser checks for every public tool. Independent review separately checked published reference sources and decimal arithmetic. Browser checks used isolated Chrome at390px with the production CSP, not a development CSP bypass.

| Tool | Contract checked |
|---|---|
| Yarn calculator | Measured rectangle/swatch area ratio, allowance, whole skeins |
| Needle converter | Exact sourced diameters, search, unsupported entries |
| Gauge calculator | Swatch density, count scaling, width/multiple bounds |
| Yarn weight chart | Eight CYC rows, category comparison, swatch requirement |
| Fabric substitute | Bounded comparison/filtering without a compatibility guarantee |
| Stitch counter | Add/subtract, undo, restore, invalid state and integer bounds |
| Amigurumi pattern checker | Consumed/created stitches, totals, unsupported notation |
| Blanket calculator | Default/gauge-only UI, dimensions, repeats, measured swatch |
| Increase/decrease | Source conservation and exact target in flat/round schedules |
| Stripe generator | Row totals, bounded sequence/random choices, no yardage inference |
| Abbreviation glossary | Filtering and corrected stitch/decrease definitions |
| Spinning ratio | Drive/whorl ratio and finite meaningful display |
| Stitch pattern | Multiple-plus constraints, edge counts, range and row planning |
| Stitch quick reference | Written steps, yarn overs, pull-through counts |
| Cross stitch | Count/span dimensions and explicitly limited floss geometry |
| Weaving sett | Measured WPI, structure assumptions, reed and warp arithmetic |
| Project cost | Exact decimal material subtotal and optional time scenario |
| Color pooling | Repeating sequence, row direction, bounded stitch grid |
| Thread converter | Sourced20-pair subset, ambiguous reverse lookup, unknown codes |
| UK/US converter | One-pass crochet terms, original wording and unsupported scope |
| Circle calculator | Preset validation and round-count schedule |
| Needle guide | Manufacturer-specific families/sizes and searchable filters |
| Amigurumi shapes | Internally consistent bounded round schedules |
| WPI calculator | Decimal boundaries, category overlap, invalid measurements |
| C2C calculator | Rectangular block/diagonal counts and optional measured yarn |
| Cast-on calculator | Raw-count rounding, multiples, modeled width, bounds |
| Hat calculator | Eight-section counts and chosen ease model |
| Sock calculator | Circumference/gauge, explicit ease, repeat rounding |
| Granny planner | Whole-grid rounding, floating boundaries, seams and optional yarn |
| Sleeve calculator | Cuff/upper counts, event/row feasibility, zero-count rejection |
| Raglan calculator | Entered body circumference and gauge produce one bounded stitch checkpoint; no yoke allocation |
| Blocking calculator | Dimension ratios, direction, invalid/overflow handling |
| Stash estimator | Same-yarn mass-to-length ratio and overweight rejection |
| Vintage decoder | Explicit context, scoped annotations, ambiguous historic terms |
| Standalone yarn weight | Decimal WPI/stockinette ranges and overlapping results |

## Article workflow that can stay stable

1. Choose one real question that a tool answers. Reuse the existing guide with that intent; check the23-guide inventory before proposing another URL.
2. Write a short direct answer, followed by an independently recomputed worked example with units, inputs, result, and assumptions. Link the matching tool beside the example.
3. Explain where the model stops and how a representative swatch or exact manufacturer/pattern instruction changes the decision. Do not invent expertise, test results, savings, or universal material properties.
4. Cite primary sources near reference claims. Record source title, URL, access date, and the exact claim supported. Separate standard reference facts from illustrative arithmetic and editorial suggestions.
5. Use truthful authorship and dates. Only set a modification date after substantive review. Keep canonical URL, title, visible answer, structured data, internal links, and sitemap consistent.
6. Run content/publication checks and the required quality/build gates. New article publication needs an exact owner-approved exception while the existing freeze is active; private drafting and existing factual repairs do not create that approval.
7. Revisit a published page when a measured issue, user report, source change, or review obligation warrants it. Do not rewrite dates or add pages merely to appear fresh.

First drafting briefs: improve `/guides/blanket-yarn-guide` with the50x60in measured-swatch example (4x4in consumes20yd:3750yd base,4125yd with10%,19 skeins at220yd); improve `/guides/cast-on-methods-guide` with raw versus rounded repeat counts and modeled width; improve `/guides/yarn-stash-management-guide` with the42g remnant example. These are existing intents, not authorization for three duplicate pages.

## Search and answer-engine evidence

Google states that ordinary Search foundations apply to AI features; no special AI file or special schema is required. Crawlability, an eligible response, clear visible text, truthful article metadata, and useful original work help establish eligibility, not guaranteed selection. [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [technical requirements](https://developers.google.com/search/docs/essentials/technical), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Article data](https://developers.google.com/search/docs/appearance/structured-data/article).

Do not sell FAQ markup as a current rich-result strategy: Google deprecated FAQ rich results in May2026. Useful visible FAQs can remain. [Google updates](https://developers.google.com/search/updates).

Measure conventional Search impressions/clicks separately from generative AI impressions and citations. Google's generative AI report reports impressions; Bing's AI Performance provides citation evidence. Neither establishes attributable sales. Current signed-in FiberTools report settings/results were not verified in this audit. [Google generative AI report](https://support.google.com/webmasters/answer/16984139?hl=en), [Google AI control](https://support.google.com/webmasters/answer/16908024), [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).

OpenAI distinguishes OAI-SearchBot search discovery from GPTBot training. IndexNow notifies participating engines of changes; it does not guarantee indexing. [OpenAI bots](https://developers.openai.com/api/docs/bots), [IndexNow FAQ](https://www.indexnow.org/faq).

## Reference provenance

- [CYC yarn weight system](https://www.craftyarncouncil.com/standards/yarn-weight-system): category/gauge/tool guideline rows.
- [CYC WPI measurement](https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi): WPI method and overlapping ranges.
- [CYC hook and needle sizes](https://media.craftyarncouncil.com/standards/hooks-and-needles): metric/US reference.
- [Clover Takumi specifications](https://www.clover.co.jp/recipe/takumikikakus.pdf): Japanese diameters.
- [CYC crochet abbreviations](https://craftyarncouncil.com/standards/crochet-abbreviations) and [knitting abbreviations](https://www.craftyarncouncil.com/standards/knitting-abbreviations): terminology.
- [John James needle guide](https://jjneedles.com/wp-content/uploads/2026/05/Needle-Guide.pdf): manufacturer needle families/sizes.
- [Archived Anchor chart, distributor copy](https://www.quiltersstore.com.au/userfiles/files/ConversionChart_Stranded_Cotton_finalversion.pdf):20 checked pairs; archive date unstated, not current stock/color verification.
- [CYC care symbols](https://www.craftyarncouncil.com/standards/care-symbols), [Woolmark drying guidance](https://www.woolmark.com/care/tumble-drying-wool/), [OEKO-TEX STANDARD100](https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100): limited label/care claims.

## Release boundary and rollback

The code, tests, pull request, merge, deployment SHA, and direct production verification are separate evidence stages. See the pull request for final command outcomes and release status. No payment, provider, customer, or revenue readiness is inferred. Roll back an authorized release by reverting its exact merge commit through the normal checked pull-request path; preserve user-owned counter data and the protected records.
