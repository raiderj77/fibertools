# FiberTools technical context

`CLAUDE.md`, `README.md`, `package.json`, and the deployment environment documentation remain authoritative.

## Application

- Next.js App Router
- React
- TypeScript and JavaScript
- Tailwind CSS and repository styles
- npm
- Node.js 24.x
- Vercel deployment from `main`

## Code locations

- Routes: `src/app`
- Shared components: `src/components`
- Deterministic logic: `src/lib`
- Tests: `tests`
- Operational scripts: `scripts`
- Public assets: `public`

## Required architectural boundaries

- Public pages remain server-rendered or statically rendered where designed.
- Standard pages and `/embed/*` routes keep separate framing and security-header behavior.
- Calculator logic remains deterministic and testable.
- Secrets stay in owner-controlled environment configuration, never source.
- Analytics uses fixed allowlisted events and non-sensitive values.
- Payment and delivery paths remain server-side and fail closed.
- Provider configuration and Codex profiles stay outside the repository.

## Local validation

Start with the smallest relevant focused suite. Use the broader TypeScript, security, quality, content, and build gates listed in `CLAUDE.md` and `README.md` before release.
