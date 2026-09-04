# FiberTools Product and Publication Policy

Load this file for calculators, formulas, canonical data, public copy, SEO, metadata, structured data, links, content, or publication work. The root `AGENTS.md` remains controlling. Exact source, tests, datasets, and owner-approved publication records control bounded current facts.

## Product contract

FiberTools provides free, privacy-first, deterministic fiber-arts calculators and references.

Public self-service calculators must:

- require no account or email;
- process project inputs in the browser unless a separate server workflow is clearly disclosed;
- present results as planning aids, not guaranteed outcomes;
- remain free when optional paid products exist;
- state assumptions, units, rounding, bounds, and limitations;
- preserve labels, keyboard operation, visible focus, result announcements, and responsive reflow;
- keep calculator values and free-form text out of analytics, ads, affiliates, logs, and unrelated services.

The homepage supports three jobs:

1. Calculate yarn and materials.
2. Fix gauge, sizing, and stitch counts.
3. Plan a crochet or knitting project.

Featured order is Blanket, Yarn, Circle, Amigurumi Shapes, and Cast-on. Sock Calculator is secondary. Keep other ready tools available through the server-rendered directory.

Use US crochet terminology and Craft Yarn Council labels Lace (0) through Jumbo (7).

## Formulas and canonical data

- Keep formulas deterministic, documented, explainable, unit-aware, bounded, and regression tested.
- State units, conversions, assumptions, rounding, limits, and error behavior beside the result or in linked help.
- Validate empty, malformed, boundary, and extreme inputs.
- Keep displayed explanations consistent with executable logic.
- Treat source data under `src/data` and equivalent datasets as canonical only when its origin and transformation are verified.
- Never add model-generated, guessed, or unsourced facts to canonical data or public copy.
- Do not change a formula, constant, conversion, label, or dataset merely to make a test pass.
- When a formula or canonical dataset changes, test the logic, page output, accessibility, mobile behavior, and any structured data or explanatory copy that represents it.

## Publication freeze and quarantine

The publication freeze remains in force through November 20, 2026 unless an explicit owner-approved record authorizes the exact exception. The date alone does not lift it.

Before an explicit lift, do not add a new public calculator, general tool, article, guide, paid service, or major feature. Bug, security, legal, factual, accessibility, and broken-link repairs remain allowed.

Markdown under `content/published` is quarantined unless both the application allowlist and an explicit owner-approved publication record make the item public. A filename, folder, front-matter value, route, sitemap entry, or build output is not approval.

Do not create doorway pages, duplicate programmatic pages, generic AI articles, scraped content, link schemes, keyword-stuffed pages, unsourced claims, fake review dates, or fabricated editorial approval.

## Editorial truth and search output

Visible copy, metadata, JSON-LD, feeds, sitemaps, `robots.txt`, `llms.txt`, canonical URLs, redirects, and live behavior must agree.

- Preserve intentional canonical routes and redirects. `/blog/*` remains redirected to current tool or guide destinations. Quarantined Markdown is not a public blog.
- Keep quarantined content out of routes, navigation, feeds, sitemaps, search files, structured data, and internal links.
- Preserve approved public owner attribution. Personal-name publication is not categorically prohibited. Never expose private contact, identity, tax, payment, account, or provider data.
- Do not claim 30+ years of fiber-arts expertise, professional credentials, consensus, popularity, leadership, universal availability, exact outcomes, demand, customers, conversions, sales, revenue, provider approval, testimonials, or endorsements without direct evidence.
- Change a review date only after reviewing the represented content and destinations.
- Use current primary sources for material time-sensitive claims and record the source and review date where the repository pattern requires it.
- Verify external destinations and affiliate treatment before changing links.
- Do not add mandatory sister-site links or remove useful approved links merely to satisfy an obsolete portfolio rule.

## Required context and checks

Search the affected route, component, logic, data, tests, and references before editing. Read the exact publication record when one exists.

Use focused tests while iterating. Before promotion, run every applicable current script and the required workflow. Common checks include:

```bash
npm run test:publication-freeze
npm run lint:content
npm run lint:predeploy
npm run test:search-traffic
npm run test:review-dates
npm run test:focused-page-output
npm run test:ui-accessibility
npm run build
```

Formula work also runs the exact calculator or dataset suite and TypeScript checks when applicable. The current `package.json` and `.github/workflows/empire-check.yml` are the command authorities.
