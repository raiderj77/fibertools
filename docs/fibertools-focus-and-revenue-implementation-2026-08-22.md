# FiberTools Focus and Revenue Implementation — 2026-08-22

## What changed

- Reorganized the homepage around three visitor jobs, five featured calculators in the approved order, one secondary sock calculator, and a searchable server-rendered directory for every remaining ready tool.
- Simplified Blanket, Yarn, Circle, Amigurumi Shapes, Cast-on, and Sock pages to the requested answer, calculator, method, example, limitations, FAQ, and next-action sequence without broadly changing their titles or metadata.
- Added result-gated $17 planning-pack links to the full Blanket, Yarn, Gauge, and Project Cost calculators. Embedded calculators never render those links.
- Added three branded calculator embeds, a public partner page with copyable iframe snippets, and interest-only $149/year and $299/year future white-label pilot descriptions.
- Added a $17 Fiber Project Planning Pack sales page with a safe contact fallback, fixed consented analytics, personal-use terms, and no direct website link to the PDF artifact.
- Tightened Designer Pattern Preflight to a $39 limited pilot: one version of one crochet pattern, up to 10 pages, math and consistency review, and one written report. Checkout now fails closed to inquiry unless its explicit action mode and every provider prerequisite are present.
- Simplified primary navigation, expanded the ready-tool sitemap, removed embed routes from indexing, corrected one broken internal link, and added an automated literal internal-link check.
- Replaced query-bearing automatic page views with sanitized pathname-only page views. New offer, embed, pattern-checker, and Ravelry analytics use allowlisted fixed event/slug pairs only. Affiliate events now recheck live consent and Global Privacy Control before every send.
- Corrected the Gauge resize ratio with a regression test: a 120-stitch pattern at 18 stitches per 4 inches resizes to 133 stitches at an actual gauge of 20 stitches per 4 inches.
- Isolated embed framing headers, cookies, site chrome, analytics, affiliate behavior, saved units, and service-worker cache behavior without weakening normal-page `SAMEORIGIN` protection.

## What stayed unchanged

- All self-service calculators remain free; the paid offers are optional.
- Existing calculator algorithms and result contracts remain unchanged except for the verified Gauge resize-ratio defect described above.
- Existing useful routes, ready-tool registry entries, citations, formula sources, validation notes, affiliate recommendations, and historical experiment records remain in place.
- Ads remain disabled unless separately approved and configured. No ad, affiliate, newsletter, or unrelated promotional block was added to an embed or calculator result area.
- No Stripe, Supabase, checkout, Vercel, DNS, email, billing, white-label account, customer portal, upload system, or external provider configuration was changed.
- No historical revenue, StitchProof, distribution, or experiment outcome was rewritten or inferred.

## Tests run

Focused verification completed during implementation:

- Homepage focus and navigation: 5/5 passed.
- Embed, header, fixed-analytics, and accessibility slice: 29/29 passed before final integration.
- Planning-pack and preflight focused slice: 32/32 passed before final integration.
- `npm run test:focus-revenue`: 14/14 passed after shared integration.
- `npm run test:gpc-consent`: 7/7 passed after shared integration.
- `npm run test:security`: passed.
- `npx tsc --noEmit --incremental false`: passed.
- Planning-pack PDF QA: 12 pages; 285 form widgets; 0 missing appearance streams; title, author, creator, page size, and all rendered pages visually verified.
- Full CI-equivalent gate: affiliate check passed for 10 monetized tools; GPC 7/7; blanket gauge 7/7; IndexNow 3/3; pattern checker 8/8; fabric substitution 14/14; designer preflight 29/29; focus/revenue 14/14; revenue path 11/11; search traffic 31/31; StitchProof distribution 3/3; UI accessibility 8/8; quality, security, predeploy, and content checks passed.
- `npm run build`: passed; Next.js generated all 100 static/dynamic route entries including the three embed routes and both offer routes.
- Built-app HTTP verification: normal routes retained `X-Frame-Options: SAMEORIGIN`; each embed returned 200 with `X-Robots-Tag: noindex, nofollow`, HTTPS `frame-ancestors`, no `X-Frame-Options`, no `Set-Cookie`, and no rendered site header, footer, analytics, affiliate, or planning-pack promotion.
- Built-app link crawl: 81 sitemap routes and 86 rendered internal links resolved with zero failures.
- Browser QA at 1280×575 and 390×844: no horizontal overflow; keyboard mobile navigation and embed-code copy worked; planning-pack and preflight fallbacks rendered without forms or payment buttons; result-gated CTA appeared only after a synthetic calculator result; Gauge embed returned the corrected 133-stitch result; no console warnings or errors.

## Known limitations and verified blockers

- **Planning-pack checkout must remain closed.** `raiderj77/fibertools` is a public repository, and `output/pdf/fibertools-project-planning-pack.pdf` is present in public Git history (including commits `ca6dc05` and `9403338`). Omitting a website link or deleting the current file would not make that historical artifact private. A sellable revision must be newly generated and delivered from owner-approved private storage before checkout is enabled.
- The white-label embed prices are an interest test only. Billing, tenant management, unbranded builds, and customer provisioning were intentionally not built.
- Designer Pattern Preflight remains inquiry-only by default. Provider identity, production credentials, database migration state, webhook state, fulfillment capacity, and live purchase behavior still require owner/provider verification before checkout is enabled.
- No application or provider rate-limit/bot-protection evidence was verified for the preflight submission endpoint. The inquiry gate keeps it closed now; rate limiting and abuse protection are activation prerequisites before accepting live submissions.
- A returning visitor with the prior service worker may keep that worker until the browser installs `fibertools-v3`; the new worker bypasses both embed documents and their subresource cache reads/writes.

## Manual environment variables

Planning Pack:

- `PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED=true` and `PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED=true` — server-only confirmations. **Keep unset or false until the exact new revision is in approved private delivery storage and retrieval is verified.**
- `PLANNING_PACK_OWNER_APPROVAL_CONFIRMED=true`, `PLANNING_PACK_EDITION_ID`, and `PLANNING_PACK_PRIVATE_FILE_SHA256` — bind explicit approval to the exact manifest edition and artifact.
- `FIBERTOOLS_STRIPE_ACCOUNT_ID`, `PLANNING_PACK_STRIPE_PAYMENT_LINK_ID`, `PLANNING_PACK_STRIPE_PAYMENT_LINK_URL`, and `PLANNING_PACK_STRIPE_PRICE_ID` — server-only provider and offer bindings. The first-party checkout gate retrieves the account and exact active Payment Link before redirecting; it remains unavailable unless every manifest, artifact, delivery, activation, and owner-approval gate agrees.
- `PLANNING_PACK_STORAGE_BUCKET` and `PLANNING_PACK_STORAGE_OBJECT_PATH` — exact non-public Supabase object binding. Delivery rechecks the stored PDF byte size and SHA-256 after a paid session is verified.

Designer Pattern Preflight:

- `DESIGNER_PREFLIGHT_ACTION_MODE=inquiry` or `checkout`; any missing or invalid value fails closed to inquiry.
- `DESIGNER_PREFLIGHT_INQUIRY_URL` — optional HTTPS or `mailto:` inquiry destination.
- Checkout also requires matching `STRIPE_MODE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `NEXT_PUBLIC_SITE_URL` values.

## External actions still requiring owner approval

- Create a new private planning-pack revision and configure an owner-approved checkout/delivery provider.
- Set either offer's production environment variables in Vercel.
- Verify Stripe account/mode, Supabase migration and retention operations, webhook delivery, fulfillment capacity, rate limiting/bot protection, and live checkout before enabling Designer Pattern Preflight purchases.
- Create billing or contractual terms for any white-label embed pilot.
- Merge the pull request and deploy the release.

## Exact routes created or modified

Created:

- `/embeds`
- `/embed/blanket-calculator`
- `/embed/yarn-calculator`
- `/embed/gauge-calculator`
- `/fiber-project-planning-pack`

Materially modified:

- `/`
- `/blanket-calculator`
- `/yarn-calculator`
- `/circle-calculator`
- `/amigurumi-shapes`
- `/cast-on-calculator`
- `/sock-calculator`
- `/gauge-calculator`
- `/project-cost-calculator`
- `/amigurumi-pattern-checker`
- `/designer-pattern-preflight`
- `/designer-pattern-preflight/success`
- `/api/designer-preflight/submissions`
- `/crochet-tools`, `/knitting-tools`, and `/weaving-tools`
- `/about`, `/contact`, `/privacy`, and `/terms`
- `/sitemap.xml`

## Repository-documentation and production conflicts

- The requested `docs/organic-growth-baseline-2026-08-05.md` file is absent. The current repository evidence reviewed instead was `docs/search-console-acquisition-baseline-2026-08-05.md`; no missing results were invented.
- Historical planning-pack research mentions a $1.99 listing concept. The approved 2026-08-22 implementation contract supersedes that active offer price with $17, while historical text remains unchanged as history.
- Active $9 preflight copy was updated to $39. Historical ledger and SQL fixture values were not rewritten except where current contract tests require the live $39 amount.
- No final protected StitchProof experiment outcome was present in the reviewed evidence. Its historical gates and records remain unchanged.
- The planning-pack PDF is already in public repository history, which conflicts with treating that exact artifact as an undisclosed paid download. Checkout therefore remains technically gated and operationally blocked pending a new private revision.

## 2026-08-25 documentation and production reconciliation

This section appends current evidence without rewriting the implementation tests and historical records above.

### Verified repository and production state

- The canonical remote is `https://github.com/raiderj77/fibertools.git`; `main` is the default and production branch.
- PR #40, **Focus FiberTools traffic and revenue paths**, merged as `691f9dfd9453c68ae36d7e8780b8f1daa3b0771d`.
- PR #41, **fix: label project cost calculator controls**, merged as `791b10d1ca960695b03496831040e43ea6505974`.
- PR #42, **Fix stale Amazon product link and restore release build**, merged as `e67c27714f5353b14e6ae13f6b1291f677fdbaf3`.
- Vercel deployment `dpl_EbDxqPo6occUQtSYv4J9aQ1Qm174` was observed READY for production from #42 with the FiberTools production aliases. Direct checks returned 200 for the homepage and the two repaired buyer pages; the retired ASIN was absent and their replacement Amazon search destinations retained the FiberTools tag.
- The direct-main article commit before #42 failed the duplicate-slug content gate even while the live revenue monitor remained green against the earlier deployment. Live monitor health and current source deployability must therefore remain separate evidence.

### Stale operating documentation corrected

- Repository instructions now match the current intentional public author identity and prohibit invented credentials rather than all personal-name attribution.
- The obsolete 30+ years expertise claim, blanket `X-Frame-Options: DENY` policy, mandatory sister-site footer rule, single-variable deployment description, and create-next-app README directions were removed.
- The README now documents the three homepage paths, featured calculators, embed boundary, commercial states, validation commands, environment contract, and publication freeze.
- `.env.example` now uses fail-closed defaults and fake placeholders for every active application/offer variable. `tests/environment-docs.test.mjs` enforces parity with `docs/fibertools-deployment-environment.md`.
- Directly verified stale facts in `public/llms.txt` and `public/llms-full.txt` were corrected without changing buyer-page review dates or rewriting unreviewed content.

### Commercial state and remaining actions

- Fiber Project Planning Pack checkout remains **disabled** until a new sellable revision is privately stored, delivery and customer operations are verified, and the owner explicitly approves activation.
- Designer Pattern Preflight remains **inquiry-only** until provider identity/mode, migration, webhook, retention, abuse protection, fulfillment, and a separately authorized disposable live test are verified.
- White-label pricing remains **interest-only**. Checkout, subscriptions, tenant accounts, unbranded delivery, and customer provisioning do not exist.
- Main branch protection and required build/quality checks remain an owner-controlled repository action.
- Production Node/CI alignment and the non-blocking JavaScript module-type warnings remain release-hardening work.

### Publication decision date

No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.

November 20, 2026 is the next review date, not an automatic release. The owner should use verified qualified traffic, repeat usage, privacy-safe offer events, affiliate outcomes, support load, provider readiness, privacy risk, and operating capacity to record a continue, narrow, or lift decision.

### 2026-08-25 final-completion branch evidence

This later subsection supersedes only the current-state statements above; it does not rewrite earlier implementation records.

- Work used isolated branch `codex/fibertools-final-completion-2026-08-25` from exact `e67c27714f5353b14e6ae13f6b1291f677fdbaf3`. The canonical dirty checkout and protected StitchProof state were excluded.
- A new owner-private edition, `FT-PP-V2-2026-08-25`, now exists outside Git. It is 12 US Letter pages with 141 fillable fields and 141 widget appearance streams. A synthetic fill/read-back passed, all 12 pages rendered for visual review, metadata identifies only FiberTools, and prohibited affiliate/customer/personal content checks passed.
- The private edition SHA-256 is `e5407e856ce539b1e751f8e36388c3d66d3151a649e6e61a97036ce9cbdd89a6`; the historical public artifact SHA-256 is `0304f184c8eb8a561439c862556e0e7eda8d318cfaade2baaf3541402ee226ed`.
- `config/planning-pack-release-manifest.json` records the edition and expected checksum while upload remains `NOT_UPLOADED`, owner verification remains `PENDING`, and checkout remains `DISABLED`. Both the verifier and the runtime page block until edition, checksum, upload, delivery, enabled release states, checkout URL, and owner attestations agree.
- Designer Preflight now binds exact checkout mode, provider formats, migration/database/retention/outbox attestations, the exact webhook event list, notification delivery, a confirmed supported durable-abuse provider, and confirmed fulfillment capacity into the same runtime contract used by its 20-check verifier. Documented placeholders and reserved example destinations fail closed; the public inquiry fallback remains active.
- A manifest-backed publication freeze now protects the current public-route, tool, guide, quarantined-article, and price-bearing-source baselines. Tests reproduce the removed blanket duplicate and block unapproved route growth, slug/title/canonical duplicate growth, freeze-dated articles, and scheduled content workflows capable of pushing to `main`.
- Homepage visible review text, WebApplication JSON-LD, CollectionPage JSON-LD, and sitemap now use the substantiated August 22 review date through a central registry. The unchanged FAQ retains April 16.
- Built-output tests verify all six focused pages render one answer/calculator/method/example/limitations/references/FAQ/next-action journey with contextual affiliate recommendations last. The gate found and prompted completion of missing Circle and Amigurumi examples and limitations.
- Live production remained on deployment `dpl_EbDxqPo6occUQtSYv4J9aQ1Qm174` from `e67c277`. All 13 requested routes returned 200 with self/canonical intent, zero console errors, and no 390-pixel overflow. No production deployment occurred from this branch.
- The live Amigurumi sphere reproduced an off-by-one defect: selected total 12 rendered through round 13. A regression now proves the generator ends on the selected total for even and odd values; the fix is branch-only until an authorized merge/deploy.
- Embed hydrated isolation, keyboard operation, noindex header, framing policy, cookie absence, mobile reflow, and zero Cache Storage responses passed. Raw Next RSC data still serializes non-hydrated footer strings, the root AdSense verification meta remains, and an installed worker may mediate static resources from HTTP cache; these qualifications are not represented as zero-footprint claims.
- `npm ci`, the complete requested existing/new suites, TypeScript, content/predeploy, production build with 100 generated route entries, both dependency audits, and `git diff --check` passed. `npm audit` and `npm audit --omit=dev` each reported zero vulnerabilities.
- Planning Pack and Designer Preflight readiness commands intentionally returned nonzero fail-closed results with no secrets printed. The next Planning Pack actions are exact artifact upload, non-customer delivery retrieval, owner approval/operations decisions, checkout URL configuration, merge/deploy authorization, and production verification.
