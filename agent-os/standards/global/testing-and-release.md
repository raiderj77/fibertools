# Testing and release

## Change discipline

- Work from current fetched `origin/main` in an isolated branch or worktree.
- Preserve unrelated owner changes.
- Keep scope narrow.
- Add focused regression coverage when behavior changes.
- Run the smallest relevant checks during implementation.
- Run release-appropriate TypeScript, security, quality, content, and production-build gates before promotion.
- Record exact commands and observed results.
- Never weaken a test, baseline, gate, or manifest to make a change pass unless the approved outcome explicitly requires and justifies it.

## Evidence stages

Track separately:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and required checks;
5. merge;
6. deployment tied to the expected SHA;
7. direct production verification.

One stage never proves a later stage.

## Review

Use independent review for significant work. Resolve P0 and P1 findings before promotion or record a block. A clean review does not replace tests. A passing build does not prove provider, payment, delivery, analytics, revenue, or customer behavior.
