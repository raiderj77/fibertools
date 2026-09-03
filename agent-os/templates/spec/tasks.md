# [Change name] tasks

Status legend: Pending, In progress, Blocked, Complete

## Task 1: Save and verify the specification

Status: Pending
Owner: Parent agent
Files:
- `agent-os/specs/[folder]/spec.md`
- `agent-os/specs/[folder]/tasks.md`
- `agent-os/specs/[folder]/verification.md`
- `agent-os/specs/[folder]/status.md`

Dependencies: None

Acceptance criteria:
- Scope, constraints, risks, acceptance criteria, and validation commands are explicit.
- Current `origin/main` SHA and overlapping work were reviewed.
- Protected and owner-controlled boundaries are explicit.

Checks:
- Manual spec review

## Task 2: [bounded task]

Assign explicit files with exclusive write ownership.

Status: Pending
Owner: `[parent or one named subagent]`
Files:
- `[exclusive write ownership]`

Dependencies:
- Task 1

Acceptance criteria:
- [criterion]

Checks:
- `[command]`

## Integration task

Status: Pending
Owner: Parent agent

Acceptance criteria:
- Integrated diff remains within scope.
- No overlapping agent changes were lost.
- `ft_reviewer` found no unresolved P0 or P1 defect.
- `ft_verifier` mapped every acceptance criterion to evidence.
