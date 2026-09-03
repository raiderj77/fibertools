# Security, privacy, and secrets

## Data boundaries

- Keep calculator inputs, form contents, email addresses, credentials, provider payloads, payment data, and free-form text out of analytics and reports.
- Collect only what the disclosed feature needs.
- Preserve documented retention and deletion behavior.
- Recheck consent and Global Privacy Control before analytics or affiliate sends.
- Keep standard-page and embed security-header behavior distinct.
- Treat uploads, payment paths, and provider calls as server-side, bounded, rate-limited, and fail-closed where the current design requires it.

## Secrets

- Never read, print, copy, commit, test with, or summarize `.env*` values or private credentials.
- Commit fake placeholders only.
- Keep Codex providers, profiles, API keys, and optional router credentials in the user's `CODEX_HOME` or environment, not project files.
- Do not paste credentials into issues, pull requests, test output, logs, or documentation.

## High-risk actions

Require exact owner authorization before enabling billing, checkout, ads, subscriptions, provider accounts, customer delivery, DNS, publication, merge, or deployment. Configuration presence is not activation evidence.
