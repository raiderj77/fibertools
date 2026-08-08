# FiberTools SaaS opportunity - evidence-backed product decision

**Status:** discovery complete; paid infrastructure not authorized or justified yet  
**Recommended wedge:** Swatch-to-Finish Project Lab  
**Release boundary:** do not change the protected StitchProof experiment before the August 11 evidence review

## Decision

Do not build another generic row counter, PDF viewer, yarn-stash database, social network, or AI pattern generator. Those categories are already crowded, inexpensive, and often bundled together.

Build a narrow browser-first **Swatch-to-Finish Project Lab** that connects calculations makers currently perform in separate tools:

1. record pattern gauge and the maker's untreated and treated swatch;
2. predict likely post-treatment dimensions without claiming certainty;
3. translate target dimensions into stitch and row counts;
4. snap counts to a user-entered stitch or repeat multiple;
5. estimate yarn from the maker's swatch consumption and both yarn-label measures;
6. compare two yarn, gauge, size, or ease scenarios side by side;
7. explain which input changed the result and by how much;
8. export a portable project passport as PDF and human-readable JSON.

The differentiator is a chain of transparent project decisions, not another place to store patterns.

## What current users say is missing

- In a detailed [knitting-app feature discussion](https://www.reddit.com/r/knitting/comments/199oeti/), makers asked for persistent zoom, size highlighting, bookmarks, project notes, searchable pattern libraries, cross-device use, stash-to-project matching, and help transitioning between incompatible repeat counts. One participant explicitly said they would pay for repeat-transition help.
- A [yarn inventory and project documentation discussion](https://www.reddit.com/r/knitting/comments/144qcy4/) describes extensive spreadsheets that calculate incoming yarn, usage, leftovers, current inventory, allocated WIPs, and available project quantities.
- Another [project-management discussion](https://www.reddit.com/r/knitting/comments/ycrrhh/) shows that makers often combine Ravelry for databases with KnitCompanion for active pattern work, while some want portable, offline files because they do not want purchases trapped in a platform.
- Makers repeatedly describe gauge, overbuying, discontinued dye lots, impractical stashes, and treatment changes as expensive project failures; see the [beginner lessons discussion](https://www.reddit.com/r/crochet/comments/tz6oyt) and [stash discussion](https://www.reddit.com/r/crochet/comments/wuli8c).
- Makers are skeptical of opaque AI when verification takes longer than doing the work themselves; see this [crochet-app concept feedback](https://www.reddit.com/r/crocheting/comments/1g7dsj1/).

These are directional community signals, not a representative market survey. They justify a small demand test, not a full build.

## Competitive boundary

| Category | Current evidence | FiberTools decision |
| --- | --- | --- |
| Pattern viewing and row counting | [My Row Counter](https://apps.apple.com/us/app/my-row-counter-knit-crochet/id1342608792) imports PDFs, supports multiple counters, annotations, voice control, Ravelry access, and cross-device sync; premium is advertised around $9.99/year. [knitCompanion](https://www.knitcompanion.com/) has mature project and pattern workflows with a US base price around $30/year. | Do not compete head-on. Link out or support a portable project record that works beside these tools. |
| Yarn inventory | [YarnScope](https://www.yarnscope.com/) advertises free tracking up to 50 yarns and $3.99/month for OCR, matching, projects, and sync. Other entrants also advertise barcode scanning and Ravelry imports. | Defer barcode/OCR and full stash management. Accept only the yarn assigned to the current project in the first release. |
| Pattern writing | [StitchPad](https://www.mystitchpad.com/) offers a row editor, stitch counter, PDF export, sharing, and $4.99/month Pro. Voice-first and AI-first pattern studios are also emerging. | Do not generate or host patterns. Keep math deterministic and expose assumptions. |
| Pattern testing and services | [Yarnpond](https://www.yarnpond.com/) connects designers with testers and tech editors and charges designers through subscriptions or credits. | Preserve StitchProof as the higher-value designer path, but do not merge it with the hobbyist Lab until its protected experiment produces evidence. |

## Product shape

### Free, no-account layer

- one active project stored in the browser;
- before/after swatch record;
- gauge, size, repeat, and yarn-scenario comparison;
- uncertainty and limitation notes beside every output;
- printable one-page decision summary;
- manual export and import of a `.fiberproject.json` file;
- no uploaded pattern, public profile, feed, or ad interruption.

### Paid founding layer - hypothesis only

- unlimited local projects;
- compare and duplicate scenarios;
- richer PDF project passports;
- versioned decisions and a change-impact log;
- encrypted cross-device sync only after retention is proven.

Pricing hypothesis: **$19 one-time for the offline-first founding edition**, then optionally **$9/year for encrypted sync**. Do not publish pricing until demand and support-cost gates pass. The one-time edition distinguishes ownership from subscriptions, while the optional sync remains below common subscription competitors.

### Designer extension

Only after the StitchProof decision and paid hobbyist retention are separately verified:

- deterministic repeat and count checks;
- revision comparison;
- client-ready audit reports;
- team or shop workspaces;
- no AI-written patterns and no persistent pattern uploads by default.

## The unusual moat

The moat is a **project decision graph**. Each calculator result can become a named decision with its inputs, assumptions, source, date, and downstream effects. If the maker changes gauge or size, FiberTools identifies which yarn, count, fit, budget, and schedule decisions need review. Existing calculators become connected infrastructure instead of isolated SEO pages.

The portable project passport prevents lock-in. A maker can print it, save the PDF, or export plain JSON even if they never create an account. Privacy and portability are product features, not policy-page promises.

## Demand test before paid infrastructure

Create a public concept page only after the August 11 release gate. It may demonstrate the workflow but must not claim that accounts, sync, or paid features exist.

Proceed to an offline-first prototype only when a complete 28-day window records:

- at least 100 qualified concept-page visits;
- at least 25 completed scenario comparisons;
- at least 10 returning users;
- at least 5 explicit requests for saving, comparing, exporting, or syncing projects;
- at least 3 owner-independent statements of willingness to pay.

Proceed to accounts, billing, or storage only after the prototype records repeat use and a privacy threat model, retention policy, export/deletion test, authorization test, cost model, and support plan are approved.

## Measurement

Analytics may record only fixed events and categories after consent:

- `project_lab_started`
- `project_scenario_completed`
- `project_scenario_compared`
- `project_passport_exported`
- `project_lab_interest` with one fixed feature category

Never send pattern text, email addresses, project names, measurements, yarn labels, calculation inputs/results, uploaded files, or analytics identifiers into planning records.

## Next build decision

The next technical artifact should be a static, no-account concept prototype using fictional examples. It should reuse the current gauge and yarn math, provide a browser-only project schema, and test the project-decision-graph interaction without accounts, payments, or storage services.
