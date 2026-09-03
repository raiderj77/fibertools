# FiberTools Codex workflow

This setup keeps routine context small and spends more reasoning and review only where mistakes matter.

## Default

A clear, low-risk correction uses one main agent, affected code, focused tests, and the short root `AGENTS.md`.

## Medium or unfamiliar work

```text
Use $ft-plan for: [outcome]
Use $ft-run
```

Codex reads the relevant `CLAUDE.md` sections and exact feature records. One read-only explorer or reviewer is available when it improves accuracy.

## Defects

```text
Use $ft-debug for: [observed behavior and reproduction details]
```

The workflow reproduces the problem, proves the root cause, adds regression evidence, applies the narrowest repair, and retests it.

## High-risk work

Formulas, canonical data, public claims, structured data, accessibility, privacy, analytics, security, publication, payments, providers, delivery, StitchProof, deployment, and production work require:

- all of `CLAUDE.md` plus exact feature and release records;
- a compact `.codex/TASK.md`;
- focused regression coverage;
- high-effort `ft_reviewer` and `ft_verifier` passes;
- every applicable required GitHub check;
- exact owner approval for release actions.

## TRUTHMODE and final review

```text
Use $ft-audit
```

## Efficiency rules

- One main agent for ordinary work.
- Up to two subagents only for exploration, review, or verification when complexity or risk warrants it.
- Search exact paths before broad reads.
- Keep one local task file and concise evidence.
- Run focused tests while editing and broad suites after stabilization.
- Never trade correctness, safety, or proof for a smaller prompt.

The resume hook stays silent during normal startup. After resume or compaction, it points Codex to `.codex/TASK.md` only when an active task exists.
