# FiberTools Codex, lean workflow

Codex always receives the small root `AGENTS.md`. Detailed rules load only when the task needs them.

## Normal use

For a clear small correction, describe the outcome and let Codex work directly.

For risky, unclear, or multi-file work:

```text
Use $ft-plan for: [outcome]
```

Review `.codex/TASK.md`, then run:

```text
Use $ft-run
```

For TRUTHMODE or final review:

```text
Use $ft-audit
```

## Token rules

- One agent by default.
- One reviewer only when risk warrants it.
- Search exact paths before opening broad files.
- Read only relevant sections of `CLAUDE.md`.
- Keep one temporary task file.
- Run focused tests during work and broad checks once after stabilization.
- Do not paste raw logs into the main chat.
- Remove `.codex/TASK.md` after the final evidence is recorded.

The resume hook is silent during normal startup. After resume or compaction, it points Codex to `.codex/TASK.md` only when the file exists.
