# FiberTools Weekly Revenue Scoreboard

Use this once each Monday. Keep each dated result append-only in the experiment ledger; do not rewrite an earlier week when later data changes.

## Source of truth

- **Revenue:** Amazon Associates finalized commission reporting. An affiliate click is not revenue.
- **Search demand:** Google Search Console, with incomplete recent days excluded.
- **Traffic and actions:** Google Analytics, limited to visitors who consent to analytics.
- **StitchProof paid demand:** Sent interest emails. A mail-link click alone is only directional.
- **Technical health:** The production Revenue Path workflow and the repository quality gates.

## Weekly review

Record the date range and these values:

1. Finalized Amazon commissions and ordered items.
2. `affiliate_click` events, separated by page and product category.
3. Search clicks and impressions for the site.
4. Search clicks and impressions for `/amigurumi-pattern-checker`.
5. `pattern_check_run` key events, excluding known owner tests.
6. Sent StitchProof interest emails by request type and willingness to pay: yes, maybe, no, or unstated.
7. Active users, sessions, average engagement time, and traffic source.
8. Failed revenue-path, privacy, security, accessibility, build, or indexing checks.
9. Spending added during the week.
10. The single bottleneck selected for the next experiment.

## Decision rules

- Keep both experiments unchanged during the initial measurement window unless a technical, privacy, disclosure, accessibility, or trust failure requires an immediate repair.
- Do not treat traffic, clicks, or an email-link click as revenue.
- Do not build paid StitchProof accounts, uploads, subscriptions, or private storage before the paid-build gate in the experiment ledger is met.
- Do not add paid SEO or monitoring software while revenue remains $0 unless it repairs a verified security or reliability risk.
- Change one primary variable at a time. Record the exact change and date in Analytics annotations and the experiment ledger.
- Review the initial results on August 10, 2026. Keep, revise, or pause each experiment using the published gates rather than intuition.

## Privacy boundary

Record only aggregate counts and de-identified feedback categories. Do not place names, email addresses, private pattern text, message transcripts, analytics identifiers, or other personal data in this file, GitHub issues, or AI prompts.
