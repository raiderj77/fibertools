# Blanket repeat options — verification and release preparation, September 16, 2026

Verified against raiderj77/fibertools, base 7803173ab7e59060169c7faab1caf5fadad31bf2. Worktree: fibertools-blanket-options-2026-09-16; branch: codex/fibertools-blanket-options-2026-09-16. At the initial handoff this change was local only, with no push, pull request, merge, deployment or publication. The subsequent release authorization is recorded below.

## Files and behavior

- src/lib/blanket-gauge.mjs: adds a bounded raw-count ceiling and modeled-width helper; preserves both original count helpers and their deterministic formulas.
- src/app/blanket-calculator/BlanketCalculatorTool.tsx: shows modeled widths and narrower warning, offers a second choice only where needed, and shares the selected project text between screen, clipboard and print. Input edits reset to the nearest default, including A–B–A edits. Validates explicit multiples and orphan offsets; base dimensions must be positive before overhang.
- tests/blanket-gauge.test.mjs: helper boundary, precision, tie and limit coverage.
- tests/blanket-form.test.mjs: executes the actual component calculation callback for input validation, units, target modifiers, original yarn/skein and row calculations.
- tests/blanket-output.browser.cjs: production-browser coverage for selection, keyboard, copy/print, unit switching, reset, validation, mobile overflow and bounded privacy checks. Uses the workstation Playwright runtime; PLAYWRIGHT_MODULE can override its location. Start the production build on port 4031 before running, or set BLANKET_TEST_BASE to the explicitly authorized test origin.

The 40 × 60 inch example at 16 stitches and 20 rows per 4 inches, multiple 6 plus 2, defaults to 158 stitches (39.5 inches), offers 164 stitches (41 inches), and retains 300 rows. Exact-compatible and already-above results show one option. Offsets remain whole numbers from 0 through 1,000,000; multiples, when supplied, must be whole numbers from 1 through 1,000,000. At least one complete repeat is retained. No edges, chains, borders or ease are inferred.

## Compatibility detail

The existing calculation first rounds the raw stitch count to a whole stitch, then applies nearest-repeat rounding with upward ties. This can differ from directly minimizing distance to raw (for example raw 160.8 becomes 161, then 164 for multiple 6 plus 2). The owner explicitly required preservation of deterministic formulas and the existing default, so that staged behavior is retained and identified in project output. The new meets-or-exceeds calculation uses unrounded raw. Existing paired stitch-and-row gauge validation is also retained. With both gauge fields omitted, independent yarn planning remains available without a stitch recommendation.

## Commands and observed results

- Initial helper regression failed because planBlanketStitchWidths was missing, before implementation.
- node --test tests/blanket-gauge.test.mjs tests/blanket-form.test.mjs: 43 passed, 0 failed.
- npm run test:quality: quality gate passed; 469 tests passed, 0 failed.
- npm run test:ui-accessibility: 12 passed, 0 failed.
- npm run test:gpc-consent: 15 passed, 0 failed.
- npm run test:security: passed, including service-worker syntax.
- npx tsc --noEmit --incremental false: passed; final build also passed TypeScript checks.
- npm run build: final build, prebuild and postbuild checks passed (build-final.log).
- node tests/blanket-output.browser.cjs: passed against the final local production build. Evidence: blanket-browser-evidence.json and blanket-print.png. The initial run completed assertions but failed while serializing request metadata; corrected the test writer and reran successfully.
- git diff --check: passed.

Independent ft_reviewer and ft_verifier reviews are clear after fixing stale selection on A–B–A edits and resetting choice on yarn-category edits. Verifier additionally checked 185,120 independent raw-count ceiling cases.

Browser checks confirmed selected output text equals clipboard text, print uses that selection, metric equivalents are 100.33 cm and 104.14 cm, and the synthetic yarn result remains 3,630 yd / 1,650 g / 17 skeins for either choice. No new project storage key or non-GET interaction request occurred; synthetic inputs were absent from observed request URLs/payloads. This is bounded local-browser evidence, not an audit of every browser or provider configuration. No account or payment dependency was introduced.

No unresolved implementation question. The staged-rounding compatibility detail above is explicit. No production validation had been attempted at the initial local-only handoff. Rollback is removal of this isolated patch; the canonical checkout and its owner changes were preserved.

## Authorized release follow-up

The owner's subsequent "go ahead and complete this" authorizes completing the previously reported local fix through PR, merge and production verification. The branch was advanced without conflicts to current main 51a8a3bcfa4e226cdc21acc239280341edad46b5, retaining the completed article release. This release contains only the existing Blanket Calculator correction and its tests/evidence. It does not authorize unrelated publication, provider activation or paid services.

The nearest default and upward tie rule remain the original staged calculation. The added raw-count ceiling is an optional project-output choice. The browser QA script now accepts BLANKET_TEST_BASE for direct live verification after the production deployment succeeds. Release stages will be recorded separately; preparation is not a claim of deployment.

## Release-base validation

On base 51a8a3b: focused blanket tests 43/43; quality suite 469/469; accessibility 12/12; GPC/consent 15/15; security checks passed. Both independent release reviews cleared the code. The verifier requested that the Blanket page's visible and metadata modification dates reflect this material update: both are now September 16, with 2/2 correction-date tests passing and other tools' dates unchanged. The date regression failed against the prior September 5 date before the correction.

The first release build was stopped after the date edit so it could not be mistaken for a final build. The subsequent `npm run build` completed successfully with TypeScript, prebuild and postbuild checks (release-build-final.log). Local production browser acceptance passed again, including matching visible/metadata dates, selected copy/print, keyboard choices, unit equivalence, input validation, unchanged synthetic yarn/skeins, no horizontal overflow and no observed input-triggered POST or project-storage additions. Independent verifier cleared the date/report follow-up.

Additional release files: src/app/blanket-calculator/page.tsx and tests/correction-dates.test.mjs align the actual modification date; no other page date was refreshed. No application dependencies or provider settings changed. All evidence above is pre-release; merge and production remain separately verified stages.

## PR precision review correction

Automatic review identified a display contradiction for a high-precision target (41.0000000001 inches at 4 stitches/inch, multiple 6 plus 2): the real shortfall rounded to zero at four displayed decimals. The raw ceiling is intentionally unchanged. A dedicated formatter now explains tiny positive shortfalls as "less than 0.0001" in the selected units; screen and project output state that displayed dimensions are rounded. Ordinary shortfalls retain their existing precision.

The browser regression failed against the previous build before the warning correction. New imperial/metric helper coverage and all focused blanket tests pass 44/44. Both independent agents cleared the delta. The final production build passed with TypeScript and pre/postbuild gates, and fresh-build browser verification passed including the tiny-deficit warning in screen, clipboard and print media. All earlier acceptance cases remain covered.
