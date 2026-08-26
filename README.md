# FiberTools

FiberTools is a privacy-first Next.js collection of free fiber-arts calculators, guides, and references. Self-service calculators require no account, keep project inputs in the browser, and present deterministic results as planning aids rather than guaranteed project outcomes.

- Live site: <https://fibertools.app>
- Repository: <https://github.com/raiderj77/fibertools>
- Production branch: `main`
- Application source: `src/app`
- Owner deployment and environment contract: [`docs/fibertools-deployment-environment.md`](docs/fibertools-deployment-environment.md)

## Three starting paths

The homepage routes visitors by the project problem they are solving:

1. **Calculate yarn and materials** — start at `/yarn-calculator`.
2. **Fix gauge, sizing, and stitch counts** — start at `/gauge-calculator`.
3. **Plan a crochet or knitting project** — start at `/blanket-calculator`.

The five featured calculators, in product order, are:

- `/blanket-calculator`
- `/yarn-calculator`
- `/circle-calculator`
- `/amigurumi-shapes`
- `/cast-on-calculator`

`/sock-calculator` is the secondary featured calculator. The homepage's server-rendered searchable directory exposes the remaining ready tools. Craft landing pages are available at `/crochet-tools`, `/knitting-tools`, and `/weaving-tools`.

## Embeds

`/embeds` provides copyable snippets for three free branded embeds:

- `/embed/blanket-calculator`
- `/embed/yarn-calculator`
- `/embed/gauge-calculator`

Embed pages are `noindex` and use a dedicated `frame-ancestors` policy. Their rendered, hydrated UI omits site navigation, analytics, affiliate destinations, paid-offer promotion, newsletter forms, and cookie writes. Embed documents and subresources bypass FiberTools Cache Storage, although an already-installed service worker may still mediate ordinary static-resource requests through the browser's HTTP cache. Standard pages retain `X-Frame-Options: SAMEORIGIN`.

The displayed $149/year and $299/year white-label tiers are interest tests only. There is no white-label checkout, subscription billing, tenant account, unbranded build, or customer provisioning.

## Optional offers: current status

All self-service calculators remain free.

### Fiber Project Planning Pack

`/fiber-project-planning-pack` describes a $17 workbook. Its source release is owner-approved and enabled in the release manifest after exact-edition private storage and protected non-customer delivery verification. The tracked historical PDF remains ineligible for paid private delivery. Edition `FT-PP-V2-2026-08-25` is a distinct 12-page fillable revision stored only in the gitignored owner-private workspace and bound to `config/planning-pack-release-manifest.json` by SHA-256. Public availability still requires every exact production environment, provider, artifact, and owner attestation to pass at request time.

The repository includes fail-closed server-only checkout and delivery gates for a Stripe Payment Link. Before checkout, FiberTools verifies the configured Stripe account and exact active Payment Link, immediate card-only payment configuration, fixed quantity, Price, release metadata, and return URL. After payment, it independently verifies the paid Checkout Session, downloads only the configured object from a non-public Supabase bucket, rechecks its exact byte size and SHA-256, and returns the PDF as an attachment. The enabled manifest does not bypass those runtime gates: any missing or mismatched production binding keeps the endpoint unavailable and the public Buy action hidden. No product file is stored or exposed by the repository.

### Designer Pattern Preflight

`/designer-pattern-preflight` describes a $39 bounded pilot for one version of one crochet pattern, up to 10 pages, with one written report. It defaults to inquiry-only. Checkout can appear only when the explicit action mode, mode-matched Stripe key, webhook secret, Supabase configuration, site URL, migration/schema attestations, exact webhook event list, notification delivery, durable abuse protection, and fulfillment capacity all pass one shared fail-closed server gate. Documented placeholders and reserved example destinations are rejected. These owner-controlled attestations record readiness evidence; they do not replace direct provider and live-path verification.

See [`docs/fibertools-owner-activation-checklist.md`](docs/fibertools-owner-activation-checklist.md) before changing either offer.

## Local development

Requirements:

- Node.js 20.9 or later; CI currently uses Node 20.
- npm.

Install and run:

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Pages live under `src/app`; shared components and deterministic logic live under `src/components` and `src/lib`.

Copy `.env.example` to an ignored local environment file only when a flow needs configuration. Every committed value is a fake placeholder or fail-closed default. Never commit or paste provider values into documentation, tests, issues, pull requests, or reports. The complete variable inventory and safe defaults are in [`docs/fibertools-deployment-environment.md`](docs/fibertools-deployment-environment.md).

## Validation

Run the focused documentation/environment contract directly:

```bash
node --test tests/environment-docs.test.mjs
```

Common application gates are:

```bash
npm run test:focus-revenue
npm run test:planning-pack-delivery
npm run test:designer-preflight
npm run test:affiliate
npm run test:gpc-consent
npm run test:security
npm run test:quality
npm run lint:content
npm run lint:predeploy
npx tsc --noEmit --incremental false
npm run build
```

Use the smallest relevant focused suite while iterating, then run the release-appropriate gates. A successful live-site monitor is not proof that a newer source commit builds, and a successful build is not proof that a provider or paid fulfillment path is ready.

## Content and publication controls

Current guide routes are implemented in application source. Markdown under `content/published` remains quarantined unless both the application allowlist and an explicit owner-approved publication record permit release. A filename or `status: published` value is not approval.

`docs/stitchproof-distribution-kit.md` and all StitchProof experiment state are protected owner records. Do not open, modify, stage, summarize, or reinterpret them without explicit authorization for that exact work.

No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.

## Release boundary

Use a clean isolated worktree based on fetched `origin/main`, preserve unrelated changes, and release through a narrowly scoped pull request. Keep local validation, pushed branch, pull request, merge, Vercel deployment, alias assignment, and direct production verification as separate evidence. Do not push directly to `main`, enable an offer, or infer customer or revenue outcomes from deployment health.

## Fabric Substitute Finder

`/fabric-substitute` is a local deterministic comparison tool. Canonical data is in `src/data/fabrics.json`; sourcing and human-review requirements are documented in `docs/fabric-data-sources.md` and `docs/fabric-substitution-validation.md`. Do not expand the fabric database with unsourced generated facts.

Focused validation:

```bash
npm run test:fabric-substitution
```
