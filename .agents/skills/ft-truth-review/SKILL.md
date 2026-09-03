---
name: ft-truth-review
description: Perform a rigorous FiberTools TRUTHMODE audit or double and triple check using independent evidence, adversarial review, and explicit uncertainty. Use when verification matters more than speed.
---

# FiberTools Truth Review

## Establish truth

1. Read `AGENTS.md` and `CLAUDE.md`.
2. Verify repository identity, current `origin/main`, branch, worktree, relevant commits, open pull requests, and applicable checks.
3. Define the claims or decisions under review.
4. Build an evidence table with:
   - claim;
   - source;
   - date or SHA;
   - direct fact, inference, or unknown;
   - confidence;
   - contradiction or missing evidence.

For current external facts, use current primary sources. For repository facts, prefer Git, source, tests, and provider evidence in that order. Never invent a citation or date.

## Independent passes

Use separate agents when the areas do not overlap:

- `ft_explorer` for source and history evidence;
- `ft_reviewer` for adversarial defect review;
- `ft_verifier` for acceptance criteria and commands.

Do not let one agent's conclusion validate itself. Resolve conflicts by checking the underlying evidence.

## Required output

- Verified findings
- Contradictions or stale assumptions
- P0 and P1 risks
- Unknowns and missing proof
- What was tested
- What was not tested
- Corrected recommendation
- Stop conditions
- Exact next action

A clean diff is not proof of correctness. A passing build is not proof of privacy, provider readiness, deployment, fulfillment, revenue, or customer outcomes.
