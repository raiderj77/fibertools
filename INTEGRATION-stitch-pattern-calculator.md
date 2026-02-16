# Stitch Pattern Calculator — Integration Guide

## Files Added

```
src/app/stitch-pattern-calculator/
  ├── page.tsx                           ← Page with SEO metadata
  └── StitchPatternCalculatorTool.tsx    ← Client component ("use client")

content/blog/
  └── stitch-multiples-sampler-blanket-guide.md  ← Companion blog post
```

## Add to `src/lib/tools.ts`

Add this entry to your `tools` array:

```typescript
{
  slug: "stitch-pattern-calculator",
  name: "Stitch Pattern Calculator",
  shortName: "Stitch Calculator",
  description: "Find compatible stitch counts for sampler blankets. Combine multiples, browse 50+ stitches, and plan rows.",
  category: "crochet",  // or "both" if you prefer
  icon: "🧮",
  tier: 2,
  ready: true,
},
```

## Deploy

```bash
cd ~/Projects/fiberforge
git add .
git commit -m "Add Stitch Pattern Calculator + blog post"
git push
```

Vercel auto-deploys. Live in ~60 seconds.

## What's Inside

### Tab 1: Multiple Calculator
- Add stitch patterns with multiple + plus values
- Set min/max stitch count range + edge stitches
- Calculates LCM and shows all compatible stitch counts
- Breakdown table showing repeats per pattern
- Copy results to clipboard

### Tab 2: Stitch Library
- 50+ stitch patterns: crochet, knitting, both
- Filterable by craft, category, max multiple, max row repeat
- Search by name
- One-click "Add" sends stitch to calculator tab

### Tab 3: Row Planner
- Plan sampler blanket sections
- Enter stitch name, row repeat, target rows
- Auto-rounds to complete repeats
- Visual bar chart of blanket proportions
- Summary table with adjustments noted
- Copy full plan to clipboard

### Blog Post
- ~2,000 words targeting "stitch multiples sampler blanket" keywords
- Step-by-step guide with examples
- 6 FAQ items with schema-ready structure
- Internal links to the tool page
