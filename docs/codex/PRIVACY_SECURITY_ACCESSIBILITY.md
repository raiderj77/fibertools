# FiberTools Privacy, Security, Analytics, and Accessibility Policy

Load this file for privacy, analytics, consent, cookies, logs, uploads, forms, secrets, headers, APIs, accessibility, or sensitive server-route work. The root `AGENTS.md` remains controlling. Exact source, tests, environment contracts, and owner-approved records control bounded current facts.

## Data and secrets

- Do not inspect or expose real `.env*` values. `.env.example` is fake-value inventory only.
- Every active application or offer environment reference must appear in both `.env.example` and `docs/fibertools-deployment-environment.md`, with fake placeholders in the example. Preserve `tests/environment-docs.test.mjs`.
- Never place credentials, environment values, calculator inputs, form contents, email addresses, payment data, provider payloads, recovery keys, purchase references, customer or personal data, private artifacts, or free-form text in source, documentation, tests, issues, pull requests, screenshots, reports, analytics, ads, affiliate events, or logs.
- Use synthetic data unless the owner authorizes a bounded production procedure.
- Collect only what a disclosed feature needs. Preserve documented retention, deletion, and user-control behavior.
- Keep server credentials and provider calls out of client bundles.
- Treat uploads and free-form text as untrusted and sensitive. Validate type, size, shape, and authorization at the boundary.

## Analytics, consent, and Global Privacy Control

- Analytics must use fixed allowlisted event names and non-sensitive values.
- Never send calculator values, form contents, emails, credentials, provider payloads, recovery data, payment data, or free-form text.
- Recheck consent and Global Privacy Control before analytics, affiliate, or advertising sends.
- Newsletter, inquiry, payment, delivery, and upload flows are separate disclosed server workflows. Do not describe every site interaction as browser-only or use one consent or disclosure to justify another.
- Do not weaken opt-out, consent, minimization, retention, or deletion behavior to improve measurement.
- Treat a configured analytics ID as configuration evidence only, not proof that events are correct or production traffic exists.

## Security boundaries

Preserve the standard-page and embed security-header split:

- Standard pages retain `X-Frame-Options: SAMEORIGIN` and the standard Content Security Policy.
- `/embed/*` omits `X-Frame-Options`, uses the dedicated `frame-ancestors` policy, and returns `X-Robots-Tag: noindex, nofollow`.

Do not replace this design with blanket `DENY`. Do not weaken either policy without focused regression tests.

Sensitive server routes must preserve, where applicable:

- server-only execution and secrets;
- exact identity and purchase binding;
- bounded and normalized inputs;
- same-origin controls;
- durable abuse protection and rate limits;
- payment or request idempotency;
- current provider-state verification;
- `Cache-Control: no-store`;
- `Referrer-Policy: no-referrer`;
- `X-Robots-Tag: noindex, nofollow`;
- generic public errors and detailed private diagnostics without sensitive values;
- no sensitive logging;
- fail-closed behavior when required evidence is missing, stale, ambiguous, or contradictory.

Never treat a return URL, local flag, client assertion, imported backup, guessed identifier, configured value, or successful build as authorization.

## Accessibility

Preserve or improve:

- programmatic labels and instructions;
- keyboard operation without traps;
- visible focus;
- logical heading and landmark order;
- accessible names for controls;
- field-linked errors and recovery instructions;
- result, status, and error announcements;
- responsive reflow and zoom;
- adequate target size and spacing;
- text alternatives for meaningful images;
- reduced-motion behavior;
- plain-language assumptions, limits, and failure states.

Do not rely on color alone. Do not hide essential instructions in placeholders. Keep calculator output available to assistive technology after updates. Verify affected flows at mobile width and with keyboard navigation. Use browser or accessibility tooling when practical, but do not claim screen-reader behavior from static inspection alone.

## Required context and checks

Read the affected client and server paths, middleware or configuration, analytics allowlists, consent logic, environment contract, and focused tests before editing.

Use focused tests while iterating. Before promotion, run every applicable current script and the required workflow. Common checks include:

```bash
npm run test:gpc-consent
npm run test:affiliate
npm run test:security
npm run test:ui-accessibility
npm run test:environment-docs
npx tsc --noEmit --incremental false
npm run build
```

Payment, upload, provider, or delivery work also loads `docs/codex/COMMERCIAL_RELEASE.md` and runs its exact suites. The current `package.json` and `.github/workflows/empire-check.yml` are the command authorities.
