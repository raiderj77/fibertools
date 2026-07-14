# FiberTools Revenue Experiment Ledger

This is an append-only record. Add corrections and outcomes as new dated entries; do not rewrite prior results.

## FT-REV-001 — Useful project-supply recommendations

- **Status:** Active
- **Started:** July 12, 2026
- **Decision date:** August 10, 2026, after 28 complete days
- **Site:** FiberTools
- **Revenue model:** Amazon Associates commissions
- **Change:** Show clearly disclosed, project-relevant Amazon recommendations on ten calculators. Track only consented, non-sensitive click metadata.
- **User benefit:** Visitors can move from calculating project requirements to comparing the yarn, hooks, needles, or tools needed to begin the project.
- **Primary outcome:** At least one verified Amazon Associates commission. Amazon Associates reporting is the source of truth.
- **Diagnostic outcome:** Consented `affiliate_click` events by page and product category in Google Analytics. This is directional because visitors who decline analytics are intentionally not counted.
- **Guardrails:** Revenue pages remain indexable and canonical; disclosure remains before affiliate links; every link keeps the approved Associate tag and `sponsored nofollow` relationship; calculator inputs and personal data never enter affiliate events.
- **Automated evidence:** The daily FiberTools Revenue Path workflow verifies all ten rendered production pages without visiting Amazon or collecting visitor data.
- **Search baseline:** Google Search Console, June 15–July 12, 2026: 260 clicks, 13,100 impressions, 2.0% CTR, average position 16.6.
- **Lead page baseline:** `/blanket-calculator`: 73 clicks and 5,250 impressions in the same period.
- **Other high-traffic monetized pages:** `/amigurumi-shapes` 51 clicks / 588 impressions; `/circle-calculator` 44 / 522; `/yarn-calculator` 25 / 1,351.
- **Control:** No reliable matched control exists for this initial monetization launch. Treat the outcome as observational and do not claim the recommendations caused changes in search traffic.
- **Failure rule:** Repair any technical or disclosure failure immediately. If there is no verified commission by August 10, keep the calculators free and test one placement or recommendation change on one high-traffic page at a time.
- **Expansion rule:** Do not add paid SEO or monitoring software for this experiment. Do not expand the system to another site until FiberTools records a verified monetization event or the experiment reaches its decision date.
- **Rollback:** Remove the affected recommendation set if it creates a policy, privacy, accessibility, or user-trust failure. A lack of revenue alone triggers a revised one-page test, not removal of the free calculator.

### Outcome entries

No outcome yet. Add the first result as a new dated entry on or before August 10, 2026.

## FT-PRODUCT-001 — StitchProof demand test

- **Status:** Active when the amigurumi pattern checker reaches production
- **Decision date:** August 10, 2026, after the first complete measurement window
- **Hypothesis:** FiberTools visitors will use a transparent, deterministic round-math checker and reveal enough demand to justify a paid complete-pattern audit.
- **Change:** Add one free, crawlable amigurumi pattern checker supporting up to 20 US-terminology rounds. Pattern text stays in the browser and is never stored or sent to a model.
- **Primary signal:** Distinct consenting sessions that run the checker, measured through the privacy-safe `pattern_check_run` event.
- **Secondary signals:** Search impressions and clicks to `/amigurumi-pattern-checker`; incorrect or unsupported result counts; internal visits to related planning tools.
- **Privacy boundary:** Analytics may receive only round and result-category counts after consent. It must never receive pattern text, stitch values, project names, filenames, or user identifiers.
- **Success gate:** At least 25 checker runs from non-owner traffic or at least 5 returning users during the first complete 28-day window. These are early demand signals, not proof of willingness to pay.
- **Paid-build gate:** Do not build accounts, subscriptions, uploads, or private storage until the free checker shows demand and at least 5 users explicitly request a complete audit or saved projects.
- **Failure rule:** If the checker receives search visibility but little use, improve the explanation or notation support one variable at a time. If it receives neither visibility nor use, pause StitchProof expansion and retain the free tool as a low-maintenance acquisition page.

### Readiness entries

#### July 13, 2026 — discovery and measurement verification

- Google Search Console initially reported `/amigurumi-pattern-checker` as unknown to Google. A standard URL-inspection indexing request was accepted and the page was added to Google's priority crawl queue.
- The existing sitemap had not been read since April 28, 2026. It was resubmitted without changing its URL; Search Console reported success on July 13 and discovered 54 intentionally listed URLs.
- Google Analytics Realtime received a consented `pattern_check_run` event from the production checker. This confirms the demand signal is reaching the correct FiberTools property. The single verification event is an owner test and must not count toward the non-owner demand gate.
- The IndexNow deployment job had submitted only the homepage. It was updated to include changed static App Router pages and to fail on rejected submissions; StitchProof was then submitted directly for Bing and other participating engines.
