# Locally bundled typography

The three existing families are self-hosted from pinned WOFF2 files under `public/fonts`. `src/app/fonts.css` preserves the successful pre-repair build's font-face declarations, Unicode ranges, weights, swap behavior and exact fallback metrics. The root variables remain `--font-display`, `--font-sans` and `--font-mono`; Tailwind typography is unchanged. The layout preloads only the same three Latin files with anonymous CORS.

## Provenance and licenses

`src/data/local-fonts.json` records each file's original Google Fonts CSS and gstatic URL, byte size and SHA-256, plus the pinned upstream license URL and hash. All 13 files were independently fetched and matched byte-for-byte against the successful local build of commit `3f458fbba54fa6bc70f73cac19823f600df2901b`, before replacing its Google loader. No font data was modified. The three SIL Open Font License 1.1 notices are distributed alongside the binaries. Upstream license snapshot: google/fonts commit `66928797f271fed5ee428544e7229685e2d90127`.

- DM Serif Display: 400; Latin and Latin extended.
- Nunito: 400, 500, 600, 700; Cyrillic extended, Cyrillic, Vietnamese, Latin extended and Latin.
- JetBrains Mono: 400, 500; Cyrillic extended, Cyrillic, Greek, Vietnamese, Latin extended and Latin.

The non-Latin files are retained because the previous loader downloaded and emitted them even though only Latin was selected for preload. License sha256 values retain the original upstream bytes; textSha256 values cover the bundled notice text with CRLF normalized to LF for cross-platform checkout verification. One trailing space in the upstream Nunito notice is removed; its wording is unchanged. Font binary checksums are exact bytes. The CSS SHA-256 pins the complete declarations, including Unicode ranges and fallback metric overrides. Source URLs are provenance only: no build or browser request uses them.

## Reason and maintenance

Next.js's Google font loader intermittently failed to parse a fetched font URL extension on main and PR77. Bundling the identical assets removes that remote build input without upgrading dependencies, mocking font responses, ignoring build errors or changing CI gates. Preserve the local CSS rather than generating new local-loader fallback metrics, which could change layout.

Any intentional font update must verify upstream provenance and licenses, asset hashes, glyph coverage and metrics; update the manifest only after reviewing the new files. Run `npm run build` and its bundled-font/output checks, compare desktop/mobile typography and reflow, and confirm the build works with Google font fetching blocked. Do not replace these files merely to make a checksum assertion pass.



## Repair validation

The clean production build passed with a Node guard that rejects requests to fonts.googleapis.com and fonts.gstatic.com; positive controls confirmed the guard rejects both HTTPS requests and fetch. The first sandbox attempt stopped on a filesystem EPERM; the clean host retry retained the guard and passed every pre/postbuild check.

Headless Chromium compared the prior build and local-font build at 1440x1000 (homepage and Formula Library) and 390x844 (homepage and Yarn Calculator). With identical animation-free capture settings, all four full-page PNGs were byte-identical. Computed typography, bounds and scroll widths matched for 478 sampled elements. This validates the sampled pages and viewport sizes; it is not a claim about every browser or language.

Independent review verified all 13 binary identities, 37 font-face rules, three variable values and three Latin preloads. The focused bundled-font regression is part of the existing postbuild output suite. The existing publication-freeze, affiliate, search-traffic, accessibility, security and revenue-path suites also passed. Production and exact-head CI remain separate release checks.
