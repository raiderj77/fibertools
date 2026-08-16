This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Fabric Substitute Finder

`/fabric-substitute` is a local, deterministic MVP for comparing 30 garment fabrics. It supports two flows: ranked substitute compatibility and project suggestions for fabric already on hand. The score compares construction (30), stretch (20), weight (15), drape (15), structure (10), opacity (5), and recovery (5).

The canonical data is `src/data/fabrics.json`. Source methodology and update ownership are documented in `docs/fabric-data-sources.md`; technical, human-review, post-launch, and expansion gates are in `docs/fabric-substitution-validation.md`.

Fabric records are typed by `FabricRecord` in `src/lib/fabric-types.ts` and include identity, aliases, construction, fibers, GSM and stretch ranges, five comparison ratings, project uses, poor uses, handling guidance, substitute relationships, sources, and review date. The optional `FabricRetailerLink` structure exists for future approved destinations, but the current approved list is empty and the interface remains hidden.

The consent-aware validation events are `fabric_tool_viewed`, `fabric_flow_selected`, `fabric_selected`, `substitution_results_viewed`, `project_suggestions_viewed`, `result_expanded`, `result_helpful`, `result_not_helpful`, and `source_information_viewed`. They use known IDs and bands only. Raw search text is not sent. A retailer-click event must not be added until a real approved retailer link exists.

To add or update a fabric:

1. Collect non-retailer technical evidence and add every source to `docs/fabric-data-sources.md`.
2. Add or revise the complete JSON record, using honest ranges where products vary.
3. Update `lastReviewedDate` and explain what each source supports.
4. Add the expected ID and scenario coverage to `tests/fabric-substitution.test.mjs`.
5. Run type, lint, tests, and the production build, then complete the human-review gate.

Known limitations: these are broad fabric-family comparisons rather than lab tests; mill finish and fiber blend can move a real fabric outside the working range; no score guarantees a pattern outcome; the project flow provides categories rather than pattern alterations; and no approved retailer links exist in the MVP.

> **Do not expand the fabric database with unsourced AI-generated facts.**

Run the focused tests with:

```bash
npm run test:fabric-substitution
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
