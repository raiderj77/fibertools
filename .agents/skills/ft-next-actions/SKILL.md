---
name: ft-next-actions
description: Rank the safest and highest-value next FiberTools actions from verified repository state, active specs, pull requests, constraints, and unresolved risk. Use after a report, review, merge, or planning session.
---

# FiberTools Next Actions

Read `AGENTS.md`, `CLAUDE.md`, active specs, recent commits, open pull requests, and available check evidence.

Generate a short ranked queue. Score each candidate on:

- user or business value;
- correctness, privacy, security, accessibility, or legal risk reduced;
- urgency;
- dependency value;
- effort;
- reversibility;
- evidence quality;
- conflict with open work;
- publication, payment, provider, deployment, or activation boundaries.

Prefer finishing safe in-progress work over starting unrelated work. Respect the publication freeze. Do not recommend fabricated growth, generic AI content, speculative offers, or activation before its documented gates.

For each recommended action include:

1. outcome;
2. why now;
3. evidence;
4. exact scope;
5. first command or file to inspect;
6. required checks;
7. approval boundary;
8. stop condition.

Label assumptions and unknowns. Limit the primary queue to five items.
