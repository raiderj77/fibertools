# Quilting Section Plan

Status: Ready - the owner-approved run instruction, `RUN-QUILTING.md:10`, records the exact approval and publication-freeze exception for this scoped implementation.

## Governing Rules And Exception

Quoted repository rules:

- `CLAUDE.md:7-13`: verify the FiberTools worktree, canonical remote, fetched `origin/main`, and worktree state before changing files.
- `CLAUDE.md:17`: protected StitchProof records must not be opened, modified, staged, summarized, or reinterpreted without exact owner authorization.
- `CLAUDE.md:21-27`: calculators are free, browser-processed planning aids with accessible labels, keyboard operation, focus, responsive reflow, and clear limitations.
- `CLAUDE.md:39`: Amazon links may use only `ytearnings-20`, require disclosure before the first paid link, and use `rel="nofollow sponsored"`.
- `CLAUDE.md:48-52`: new public tools are frozen before November 20, 2026 without an exact owner-approved publication record.
- `AGENTS.md:8,19`: stop and report unresolved protected boundaries or approval; do not choose a less restrictive interpretation.
- `AGENTS.md:39`: this high-risk formula, public-copy, accessibility, affiliate, and publication work requires focused regression coverage, independent review, independent verification, and applicable checks.
- `AGENTS.md:53-58`: do not inspect protected records or `.env*`; do not deploy, publish, merge, or activate ads/providers; do not fabricate evidence.

The run instruction contains an owner exception dated 2026-10-23 for only `/quilting/`, the four named calculator routes, and additive sitemap/tools-registry entries. It explicitly excludes existing-page changes and navigation/footer links. `RUN-QUILTING.md:10` records the owner approval as `PLAN APPROVED, BUILD IT`, satisfying the Phase 1 gate in `codex-prompt-7-quilting-fibertools.md:6-11`.

## Recon Facts

- Command: `git fetch origin main`; `git rev-parse HEAD`; `git rev-parse origin/main`. Both resolve to `c8e5f20f5bc6c9644d955459a65cd57dc61a2907`.
- Command: `git remote -v`. The canonical origin is `https://github.com/raiderj77/fibertools.git`.
- Command: `git status --short --branch`. The branch is `quilting-section`; the only untracked files are run attachments: `LAUNCH-ATTACHED.cmd`, `RUN-QUILTING.md`, and `codex-prompt-7-quilting-fibertools.md`.
- Command: `node --version`; `npm --version`. Results: Node `v24.11.1`, npm `11.6.2`.
- Existing calculator pattern: `src/app/cross-stitch-calculator/page.tsx` supplies metadata, canonical URL, Open Graph image, `ToolLayout`, `AnswerBlock`, explanatory content, assumptions, and limitations. Its client component is `CrossStitchCalculatorTool.tsx`; pure, bounded arithmetic is in `src/lib/cross-stitch-planning.mjs`; regression and accessibility/copy contracts are in `tests/cross-stitch-planning.test.mjs`.
- `ToolLayout` supplies shared calculator layout and JSON-LD. Ready entries in `src/lib/tools.ts` are automatically included by `src/app/sitemap.ts:10-17`; the `/quilting` hub needs an approved explicit `staticPageConfig` sitemap entry.
- The existing Amazon tag is `ytearnings-20` in `src/lib/affiliate.ts:1`. Existing recommendations are Amazon-only (`src/components/AffiliateRecommendations.tsx:43`), so Fat Quarter Shop search URLs need a scoped, reviewed plain-link configuration instead of reuse of that Amazon-only renderer.

## Scope

Create these new routes and supporting source after approval:

1. `src/app/quilting/page.tsx` - hub with tool links, backing-calculator-derived wideback comparison explanation, required FTC disclosure, and metadata.
2. `src/app/quilting/backing-calculator/page.tsx`, `BackingCalculatorTool.tsx`, and a pure bounded backing calculation module.
3. `src/app/quilting/binding-calculator/page.tsx`, `BindingCalculatorTool.tsx`, and a pure bounded binding calculation module.
4. `src/app/quilting/border-calculator/page.tsx`, `BorderCalculatorTool.tsx`, and a pure bounded border calculation module.
5. `src/app/quilting/batting-calculator/page.tsx`, `BattingCalculatorTool.tsx`, and a pure bounded batting calculation module.
6. Focused tests for each pure module plus UI/copy/accessibility contracts and the four required worked examples.

Approved additive existing-file modifications required for route discovery and sitemap coverage:

1. `src/lib/tools.ts` - add the four calculator registry entries and their related-tool mappings. Ready entries automatically supply four sitemap URLs.
2. `src/app/sitemap.ts` - add only `/quilting` to `staticPageConfig`.

No homepage, existing page title/meta/content, navigation, footer, ads.txt, analytics, existing affiliate wiring, protected records, environment files, deployment, publication action, push, merge, or pull request is in scope.

## Formula Plan

- Backing: add twice the overhang to each quilt dimension. For each 44, 90, and 108 inch fabric, subtract 2 inches usable width, round required panels up, calculate panels times backing length divided by 36, then round the yardage up to a quarter yard. Prices remain optional; when present calculate costs and identify the cheapest only from entered values. Batting suggestion equals the calculated backing dimensions.
- Binding: perimeter is twice width plus length. Add 10 inches for joins/overlap, divide by fabric width minus 2 inches and round strips up, then multiply by strip width, divide by 36, and round up to a quarter yard.
- Border: treat the entered border as cut width including seam allowance. Add twice it to each base dimension. For mitered borders, the side strips use finished length and end strips use finished width. Lengthwise cuts equal four strips times cut width divided by usable width, rounded up; multiply cuts by longest strip length and quarter-yard round. Crosswise strips equal finished perimeter divided by usable width, rounded up; multiply by cut width and quarter-yard round. State the crosswise seam tradeoff.
- Batting: add twice the overhang to each dimension. Before implementation, verify the standard packaged-size list against a current manufacturer size chart and cite the source in the required code comment; otherwise label the list as common packaged sizes. For roll batting, divide required length by 36 using a validated roll width that fits.

## Acceptance And Tests

1. Backing worked example: 84 by 96 with 4 inch overhang produces 92 by 104; 44 inch fabric produces 3 panels and 8.75 yards, while 108 inch fabric produces 1 panel and 3 yards.
2. Binding worked example: 84 by 96 produces 360 inch perimeter, 370 inch binding, 9 strips, and 0.75 yards at 2.5 inch strips on 44 inch fabric.
3. Border worked example: 60 by 72 with 6 inch border on 44 inch fabric produces 72 by 84 finished size; lengthwise is 2.5 yards and crosswise is 1.5 yards.
4. Batting worked examples: 84 by 96 with 4 inch overhang selects King because 92 by 104 does not fit Queen width; 60 by 72 with 4 inch overhang selects Twin for 68 by 80.
5. Each calculator rejects blank, malformed, non-finite, non-positive, out-of-range, and unsafe values; each visual result has labels, associated errors, live results, keyboard operation, responsive table handling, assumptions, limitations, and a planning-aid statement.
6. After approval, run focused tests; `npm run lint`; `npx tsc --noEmit --incremental false`; `npm run test:publication-freeze`; `npm run test:affiliate`; `npm run test:gpc-consent`; `npm run test:ui-accessibility`; `npm run test:security`; `npm run test:search-traffic`; `npm run build`; and every applicable `empire-check.yml` command. Obtain independent review and verification before any local commit.

## Risks And Rollback

- Formula, rounding, seam, unit, and invalid-input mistakes could cause purchase-planning errors. Mitigation: pure bounded modules, worked examples, and visible assumptions. Rollback: revert the local feature commit only after owner direction.
- The requested Fat Quarter Shop plain retailer links do not fit the existing Amazon-only affiliate renderer. Mitigation: define a narrow plain-link configuration after approval, keep the owner replacement comment, disclosure, safe `rel`, and no affiliate tracking; review the destination before use.
- Packaged batting sizes are time-sensitive external facts. Mitigation: verify a manufacturer chart on the implementation day or use the required qualified label.
- The publication exception is narrow. Mitigation: add no links to frozen navigation/footer and touch only the two approved existing files.

## Approval Gate

Approved to build by the owner record in `RUN-QUILTING.md:10`; this plan remains bounded by the listed exception and exclusions.
