# Search Console acquisition baseline, August 5, 2026

Status: local measurement record only. No Search Console setting, indexing request, deployment, protected experiment, or owner-modified distribution file was changed.

## Measurement window

- Provider: Google Search Console performance aggregates for the `https://fibertools.app/` URL-prefix property.
- Search type: Web.
- Date range: July 7 through August 3, 2026 (latest complete 28-day report available during capture).
- Captured: August 5, 2026; the provider reported its data had last updated about six hours earlier.
- Privacy: aggregate query and page rows only. No visitor-level data, account identifiers, or searcher identities were recorded.
- Limitation: Search Console suppresses anonymized queries, so visible query rows do not sum to the page totals below.

## Site baseline

| Clicks | Impressions | CTR | Average position |
| ---: | ---: | ---: | ---: |
| 344 | 18,148 | 1.9% | 14.5 |

## Priority page baseline

| Canonical page | Clicks | Impressions | CTR | Average position | Read |
| --- | ---: | ---: | ---: | ---: | --- |
| `/blanket-calculator` | 78 | 5,877 | 1.3% | 7.2 | Highest-confidence CTR opportunity; already near page one with the largest impression base. |
| `/yarn-calculator` | 65 | 3,574 | 1.8% | 8.2 | High-impression page-one opportunity; calculator accuracy copy was contradictory before this local patch. |
| `/cast-on-calculator` | 14 | 765 | 1.8% | 8.8 | Exact how-many-stitches intent is near page one but under-clicked. |
| `/circle-calculator` | 46 | 643 | 7.2% | 7.5 | Primary query performs strongly; avoid broad title churn and clarify only the secondary increase-calculator intent. |
| `/sock-calculator` | 13 | 207 | 6.3% | 8.9 | Heel-flap and heel-turn terms are near page one; snippet can clarify coverage without claiming unsupported calculations. |
| `/` | 12 | 392 | 3.1% | 12.4 | Brand/query mix is ambiguous; preserve the existing homepage title pending a larger sample. |

## Query-to-canonical mapping

Metrics below are the query rows after filtering Search Console to the mapped canonical page. This is the before-state for later comparison.

| Query | Canonical page | Clicks | Impressions | CTR | Position | Local response |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `how many yards is a throw blanket` | `/blanket-calculator` | 0 | 23 | 0% | 9.7 | Put yards, skeins, and common sizes in the title, snippet, and answer block. |
| `how many yards of yarn for a queen size blanket` | `/blanket-calculator` | 0 | 11 | 0% | 8.8 | Mention queen and custom sizes without inventing a universal yardage number. |
| `throw blanket size in yards` | `/blanket-calculator` | 0 | 10 | 0% | 10.0 | Clarify measured-swatch method and whole-skein result. |
| `how many yards for a throw blanket` | `/blanket-calculator` | 0 | 9 | 0% | 4.4 | Same canonical answer; no duplicate page. |
| `how many yards in a throw blanket` | `/blanket-calculator` | 0 | 7 | 0% | 7.4 | Same canonical answer; no duplicate page. |
| `how many stitches to cast on calculator` | `/cast-on-calculator` | 1 | 21 | 4.8% | 8.8 | Put stitches and width in the title, with the exact how-many-stitches wording in the snippet and answer block. |
| `crochet circle calculator` | `/circle-calculator` | 5 | 23 | 21.7% | 3.8 | Preserve the strong title treatment. |
| `crochet circle increase calculator` | `/circle-calculator` | 2 | 68 | 2.9% | 6.9 | Preserve the page through the protected experiment checkpoint; reassess after the August 11 evidence review. |
| `heel flap and gusset calculator` | `/sock-calculator` | 3 | 29 | 10.3% | 5.3 | Preserve the proven title phrase. |
| `sock heel turn calculator` | `/sock-calculator` | 1 | 14 | 7.1% | 7.9 | Add accurate heel-turn guidance wording to the snippet and answer block. |
| `heel turn calculator` | `/sock-calculator` | 0 | 32 | 0% | 9.6 | Same canonical answer; do not create a thin duplicate page. |
| `how much yarn for a sweater calculator` | `/yarn-calculator` | 1 | 8 | 12.5% | 1.1 | Preserve the existing yardage title; fix the page's contradictory calculation explanation. |
| `fibertools` | `/` | 1 | 89 | 1.1% | 5.8 | Preserve the brand-first homepage title until more evidence identifies the cause. |
| `yarn calculator app` | `/` | 0 | 10 | 0% | 10.1 | Keep mapped to the tool hub; do not claim a native app. |

## Change hypothesis and measurement

The patch targets the largest defensible quick wins rather than changing every page:

1. Blanket title, description, answer block, and cast-on internal link align the largest near-page-one impression pool with the actual yards-and-skeins result.
2. Cast-on title, snippet, and answer block align with the under-clicked query while preserving the measured-gauge method.
3. Circle is left unchanged: its primary query already performs strongly and the page participates in the protected experiment funnel.
4. Sock keeps its proven heel-flap/gusset title and adds accurate heel-turn guidance wording to the snippet and answer block.
5. Yarn retains its current search framing while its contradictory worked example and purchase-weight result are corrected and regression-tested.

Primary outcomes for the next valid comparison window: qualified organic visits to these canonical pages and completed calculator runs. CTR and average position are diagnostic metrics, not success by themselves. Compare the same 28-day Search Console dimensions after enough post-release data accrues; annotate the actual release date before attributing any change.

## Sitemap and IndexNow verification

- Search Console read `/sitemap.xml` on August 5, 2026 and reported `Success`, with 54 discovered pages and no discovered videos.
- The local production build also renders 54 `<loc>` entries. A separate live crawl found 20 additional ready, self-canonical, indexable tool routes that are absent from the sitemap, so provider success confirms readability, not completeness.
- The local IndexNow mapper tests pass 3/3: changed static App Router pages map to public URLs, dynamic/private paths are excluded, and URLs are de-duplicated while retaining the homepage.
- The most recent IndexNow workflow for current `main` completed successfully on August 3, 2026. The workflow fails when the provider does not return an accepted response, but a successful submission is not proof that a participating engine indexed a URL.
- No sitemap submission, indexing request, IndexNow submission, or provider setting was changed during this work.

## Deferred, evidence-backed crawl finding

Several legacy `/blog/...` URLs still receive impressions near page one while redirecting to the generic `/guides` page. They need query-level review and one-to-one canonical replacements in a separate redirect patch. They were not changed here because this acquisition pass is deliberately limited to titles, snippets, answer blocks, internal links, and the already-started calculator correction.
