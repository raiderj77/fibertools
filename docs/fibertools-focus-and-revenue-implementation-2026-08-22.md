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

- `PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED=true` — server-only owner confirmation. **Keep unset or false until a new sellable revision is in private delivery storage.**
- `NEXT_PUBLIC_PLANNING_PACK_CHECKOUT_URL=https://...` — HTTPS checkout destination with no embedded username or password. This is ignored unless private delivery is confirmed.

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
