# FiberTools owner activation checklist

Current review date: 2026-08-25. This is a decision checklist, not an authorization record. Leave an item unchecked unless the owner has directly verified it and recorded approval without copying credentials or customer data.

## 1. Repository identity and protected state

- [x] Canonical repository verified as `https://github.com/raiderj77/fibertools.git`.
- [x] Default and production branch verified as `main`.
- [x] Current completion base verified as `e67c27714f5353b14e6ae13f6b1291f677fdbaf3` after fetching `origin/main`.
- [x] The protected StitchProof file's Git blob matched working tree, index, local reference, and `origin/main` during the read-only audit without opening its contents.
- [x] Work started in a fresh isolated worktree based on fetched `origin/main` at `e67c27714f5353b14e6ae13f6b1291f677fdbaf3`.
- [x] Unrelated dirty files and owner work were identified and excluded from the change.

Stop if the remote, branch, base SHA, protected-state hash, or ownership of a dirty file is ambiguous.

## 2. Current production and release controls

- [x] PR #40 merged as `691f9dfd9453c68ae36d7e8780b8f1daa3b0771d`.
- [x] PR #41 merged as `791b10d1ca960695b03496831040e43ea6505974`.
- [x] PR #42 merged as `e67c27714f5353b14e6ae13f6b1291f677fdbaf3`.
- [x] Vercel deployment `dpl_EbDxqPo6occUQtSYv4J9aQ1Qm174` was observed READY for production from #42 with the FiberTools production aliases.
- [x] Direct checks returned 200 for the homepage and both #42 buyer pages; the retired ASIN was absent and the replacement Amazon destinations retained the FiberTools tag.
- [ ] Protect `main` and require the GitHub build/quality gate before merge.
- [ ] Align the production Node runtime with the CI runtime or record an explicit tested reason not to.

A green live watchdog can describe an older deployment while newer source is broken. Match production to the expected commit before calling a release complete.

## 3. Fiber Project Planning Pack activation

Current state: **checkout disabled**.

- [x] The tracked public-history PDF is documented as ineligible for private paid delivery.
- [x] Runtime fails closed unless the release manifest, exact edition/checksum, private upload and delivery, owner approval, enabled release states, and a non-placeholder HTTPS checkout destination all agree.
- [x] The server-only checkout and delivery foundation additionally fails closed unless the Stripe account, mode, active Payment Link, immediate card-only payment configuration, disabled adjustable quantity and promotion codes, redirect, release metadata, one-time Price, USD $17 base price, and exact private Supabase object all match; delivery rechecks the stored byte size and SHA-256 before returning the PDF.
- [x] Generated distinct edition `FT-PP-V2-2026-08-25` outside Git: 12 US Letter pages, 141 fillable fields, 141 appearance streams, synthetic fill/read-back passed, and all 12 pages rendered for visual review.
- [x] Bound the edition to the public release manifest with SHA-256 `e5407e856ce539b1e751f8e36388c3d66d3151a649e6e61a97036ce9cbdd89a6`; the historical public artifact has a different SHA-256.
- [x] Uploaded the exact revision to owner-approved private Supabase storage in a non-public bucket; the provider UI confirmed one PDF object with the expected name, MIME type, and size.
- [ ] Retrieve the exact object through the production delivery path and verify its checksum with non-customer test data.
- [ ] Verify the key resolves to the code-bound canonical FiberTools Stripe account, then configure the Payment Link ID, one-time Price ID, private bucket, and exact object path without copying keys or private-storage values into source or reports.
- [ ] Approve customer terms, support, refund handling, fulfillment ownership, and checkout provider.
- [ ] Record explicit owner activation approval.
- [ ] Only after every prior item: configure `PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED=true`, `PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED=true`, `PLANNING_PACK_OWNER_APPROVAL_CONFIRMED=true`, the exact edition/checksum bindings, and the exact server-only Stripe Payment Link ID, URL, Price ID, bucket, and object path without exposing credentials.
- [ ] Verify the exact production deployment and delivery path after an authorized release.

Do not treat a checkout URL, environment value, product page, or successful build as delivery readiness.

## 4. Designer Pattern Preflight activation

Current state: **inquiry-only**.

- [x] Public scope is bounded to one version of one crochet pattern, up to 10 pages, one written report, at $39.
- [x] Missing, invalid, or mode-mismatched configuration fails closed to inquiry before request data is read.
- [ ] Verify the correct Stripe account and intended mode without exposing keys.
- [ ] Verify the production Supabase project, required migration, owner-test isolation, deletion, and retention operation.
- [ ] Verify webhook endpoint configuration and relevant event delivery.
- [ ] Add and verify application/provider rate limiting and bot protection.
- [ ] Confirm fulfillment capacity, turnaround language, support, refund handling, and operational owner.
- [ ] Complete one separately authorized disposable owner purchase/refund only after every safety and provider gate passes; never use customer data.
- [ ] Record explicit owner activation approval.
- [ ] Only after every prior item: set exact `DESIGNER_PREFLIGHT_ACTION_MODE=checkout`, the verified migration/evidence variables, and production provider configuration.
- [ ] Match the resulting production behavior to the approved deployment SHA and retain inquiry fallback.

Configuration presence, prior account verification, or a provider dashboard view does not satisfy these operational checks by itself.

## 5. Embeds, white-label interest, ads, affiliates, and newsletter

- [x] Three branded calculator embeds are free and `noindex`; hydrated UI excludes site chrome, analytics, affiliate links, paid offers, and cookies. Embed documents and Cache Storage are bypassed, although an already-installed worker may mediate ordinary static resources from HTTP cache.
- [x] Standard pages use `SAMEORIGIN`; embed pages use their dedicated `frame-ancestors` policy instead of a blanket framing rule.
- [x] The $149/year and $299/year white-label descriptions are **interest-only**.
- [ ] Do not offer white-label checkout or availability until product scope, contracts, billing, tenant isolation, branding, support, and provisioning are owner-approved.
- [ ] Keep AdSense disabled until account approval, consent/CMP behavior, page density, and production configuration are separately verified and approved.
- [ ] For every affiliate change, verify usefulness, disclosure before the first paid link, `rel="nofollow sponsored"`, correct tag, untagged privacy notice, and live destination availability.
- [ ] Keep newsletter collection optional and separate from calculator access; verify provider configuration without reporting subscriber identity or form contents.

Interest clicks, affiliate clicks, newsletter events, and page views are qualified signals only when the corresponding privacy-safe aggregate evidence is actually available.

## 6. November 20 decision and release authorization

No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.

- [ ] On November 20, 2026, review verified qualified organic traffic, repeat usage, email-kit interest, consented offer events, affiliate outcomes, support load, provider readiness, privacy risk, and operating capacity.
- [ ] Record a dated owner decision to continue, narrow, or lift the freeze. The date alone does not lift it.
- [ ] For any exception before that date, record the exact owner-approved publication, its evidence, scope, release SHA, and rollback path.
- [ ] Run the documentation/environment parity test, affected focused suites, TypeScript, quality, security, content/predeploy checks, and production build.
- [ ] Review the pull request and required checks; do not push directly to `main`.
- [ ] After explicit merge/deploy authorization, verify READY deployment SHA, aliases, changed routes, mobile/desktop behavior, disclosures, and fail-closed commercial state.
- [ ] Report verified evidence, inferences, unknowns, owner approvals, and remaining blockers separately.

No unchecked commercial or release item is implicitly approved by completion of another section.
