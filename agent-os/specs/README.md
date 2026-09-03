# FiberTools specifications

Use a saved specification for substantial, risky, multi-file, or unclear work.

Folder format:

```text
agent-os/specs/YYYY-MM-DD-HHMM-short-slug/
```

Each active folder contains:

- `spec.md`, outcome, scope, constraints, risks, acceptance criteria, and validation plan;
- `tasks.md`, bounded tasks, owners, file ownership, dependencies, and checks;
- `verification.md`, acceptance-criteria evidence and command results;
- `status.md`, current repository and release-stage evidence.

Use the templates under `agent-os/templates/spec/`.

## Lifecycle

1. Shape the work with `$ft-shape-spec`.
2. Save the spec before implementation.
3. Execute with `$ft-execute-spec`.
4. Update task and status evidence after integration points.
5. Run independent review and verification.
6. Mark `Status: Complete` only after the spec's local acceptance criteria are verified.
7. Record merge, deployment, and production evidence separately if those owner-controlled stages occur.
8. Keep completed specs as durable project history.

A completed implementation spec does not imply merge or deployment.
