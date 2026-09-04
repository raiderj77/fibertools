# FiberTools Codex workflow

`AGENTS.md` is the complete repository-wide Codex operating standard. Codex does not depend on another assistant's instruction file.

## Use

Clear low-risk work runs directly with one main agent.

Unclear, risky, multi-file, cross-cutting, or multi-session work:

```text
Use $ft-plan for: [outcome]
Use $ft-run
```

Defects without a proven cause:

```text
Use $ft-debug for: [observed behavior and reproduction]
```

TRUTHMODE, progress, or final review:

```text
Use $ft-audit
```

## Quality controls

- Medium-risk work reads every applicable exact feature and test record.
- High-risk work reads the complete `AGENTS.md` plus every applicable manifest, environment contract, release record, source path, test, and current primary source.
- Substantial medium-risk work receives independent review.
- High-risk and final release-sensitive work receives separate reviewer and verifier passes.
- A bug repair reproduces the problem and adds regression evidence before the repair when practical.
- GitHub workflow checks remain the remote authority.
- Merge, deployment, publication, providers, payments, delivery, DNS, production data, and user contact remain owner-controlled.

## Context controls

- Search exact paths before broad reads.
- Use one main agent for ordinary work.
- Use no more than two subagents for independent exploration, review, or verification.
- Keep one local `.codex/TASK.md` for long work.
- Keep raw logs out of the task file and main chat.
- Run focused tests while editing and broad suites after stabilization.
- Never trade correctness, safety, accessibility, or evidence for a smaller prompt.

The resume hook stays silent during normal startup. After resume or compaction, it points Codex to `.codex/TASK.md` only when an active task exists.
