# Optional OmniRoute evaluation for Codex

OmniRoute is optional third-party infrastructure. FiberTools does not require it. Do not install or configure it as part of ordinary repository work.

As verified on 2026-09-03, the upstream project is `diegosouzapw/OmniRoute`, package `omniroute`, version `3.8.51`. Recheck the upstream repository, release, license, open issues, security posture, provider terms, quotas, and Codex compatibility before any later use. Avoid similarly named repositories.

## What it adds

OmniRoute exposes one OpenAI-compatible endpoint, generates Codex profiles, routes requests across configured providers, and supports fallback. Its current CLI includes:

```text
omniroute setup-codex
omniroute setup-codex --dry-run
omniroute launch-codex
omniroute run codex --dry-run --json
```

This convenience creates a new trust boundary. Promised provider counts, free tiers, quotas, model names, and token savings change over time and require direct verification.

## Evaluation boundary

Use it only after a separate review. Keep the first evaluation outside FiberTools and outside any sensitive repository.

Do not send:

- secrets or environment values;
- private repositories or proprietary source;
- health, payment, customer, or personal data;
- protected owner records;
- unpublished paid-product artifacts;
- regulated or legally sensitive content.

Do not use routed models as the final authority for security, privacy, payment, legal, claims, or release decisions.

## Safe evaluation sequence

1. Inspect the current upstream repository and selected release.
2. Review the license, dependency inventory, install scripts, network behavior, storage paths, telemetry, logs, and credential handling.
3. Review every selected provider's terms and data-use policy.
4. Install a pinned version only in an isolated test environment.
5. Start with no FiberTools checkout present.
6. Use a local synthetic repository with no secrets.
7. Run `setup-codex --dry-run` and inspect every proposed file.
8. Keep credentials in environment variables. Never commit them.
9. Prefer runtime injection with `run codex --dry-run --json` before allowing config writes.
10. Test one bounded, non-sensitive task.
11. Compare output, latency, failure handling, logs, and cost against direct Codex.
12. Require independent review by the strongest trusted OpenAI model before retaining any generated change.
13. Remove the test configuration and credentials when the evaluation ends.

## Machine-local configuration only

Project `.codex/config.toml` intentionally contains no provider settings. Any OmniRoute provider block, profile, endpoint, or credential belongs in the user's Codex home or temporary environment.

The credential variable name documented by OmniRoute is:

```text
OMNIROUTE_API_KEY
```

Set its value outside source control. Never paste the value into a command transcript, issue, pull request, test, or report.

## Recommended use

Allowed after review:

- read-only repository mapping on public code;
- formatting and boilerplate;
- generating candidate test cases;
- comparing approaches;
- low-risk overflow when direct model limits interrupt work.

Keep direct trusted-model control for:

- parent planning;
- file ownership and integration;
- calculations and public claims;
- privacy and analytics;
- security headers and secrets;
- payments and delivery;
- publication controls;
- final review;
- merge and release decisions.

## Stop conditions

Stop the evaluation if the router:

- writes outside the reviewed paths;
- logs prompts or credentials unexpectedly;
- routes to an unapproved provider;
- weakens sandbox or approval controls;
- changes Codex configuration without a reviewed diff;
- produces inconsistent model identity or tool behavior;
- hides rate, quota, or cost information;
- fails closed-loop independent verification.
