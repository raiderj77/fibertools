---
status: draft
slug: "what-weight-is-my-yarn-guide"
title: "What Weight Is My Yarn? Identify It From a Swatch"
description: "Identify an unlabeled yarn's possible CYC weight from a knitted swatch or wraps per inch, read overlaps and gaps honestly, and substitute by length."
toolSlug: "yarn-weight-calculator"
date: "SET AT PUBLICATION"
draftDate: "2026-11-22"
keywords: ["what weight is my yarn", "identify yarn weight", "yarn weight from gauge", "yarn weight calculator", "unlabeled yarn weight", "yarn substitution weight"]
editorialNote: "AI-assisted explanation prepared with Claude. Numerical examples are hypothetical and were worked by hand from the calculator's source code; no physical yarn or swatch was measured. Published by FiberTools."
sources:
  - title: "Craft Yarn Council: Standard Yarn Weight System"
    url: "https://www.craftyarncouncil.com/standards/yarn-weight-system"
  - title: "Craft Yarn Council: How to Measure Wraps Per Inch"
    url: "https://www.craftyarncouncil.com/standards/how-measure-wraps-inch-wpi"
  - title: "FiberTools: Yarn Weight Calculator inputs and model"
    url: "https://fibertools.app/yarn-weight-calculator"
---

<!-- Draft layout: each H2 below maps to one `sections[]` entry in src/lib/guides.ts with `markdown: true`. -->

## What weight is my yarn if it has no label?

Knit a stockinette swatch with the yarn, count how many stitches fit across 4 inches, and compare that number with the Craft Yarn Council knitting gauge ranges. For example, 18 stitches over 4 inches falls only in the Medium (4) range of 16 to 20 stitches, the category often labeled worsted or aran. If you do not knit, wrap the yarn around a ruler and count wraps per inch instead. Either way, the result is a possible category to test with a swatch, not proof of what the yarn is.

The free [Yarn Weight Calculator](/yarn-weight-calculator) takes either measurement and shows every category whose published range includes it, including when a number falls in an overlap or a gap.

## Which measurement should you use: gauge or wraps per inch?

The calculator has two modes, and they answer the question in different ways.

- **Stitch gauge** uses stockinette stitches per 4 inches. It reflects how the yarn behaves as fabric, which is what a pattern cares about. The ranges are for knitting in stockinette only, so a crochet swatch cannot be entered here.
- **Wraps per inch (WPI)** measures how many wraps of yarn sit side by side in one inch. It needs no knitting, which makes it the option for crocheters and for very small amounts of yarn. The ranges overlap a lot, so expect more than one possible answer. The [WPI guide](/guides/wpi-guide) covers how to wrap and count consistently.

If you can knit a swatch, start with gauge. It usually narrows the answer to one category; WPI often cannot.

## What are the gauge ranges the calculator uses?

These are the stockinette ranges in the calculator, from the Craft Yarn Council system, in stitches per 4 inches:

| CYC category | Common names | Stitches per 4 inches |
| --- | --- | --- |
| Lace (0) | Lace, cobweb | 33 to 40 |
| Super Fine (1) | Fingering, sock | 27 to 32 |
| Fine (2) | Sport | 23 to 26 |
| Light (3) | DK, light worsted | 21 to 24 |
| Medium (4) | Worsted, aran | 16 to 20 |
| Bulky (5) | Chunky | 12 to 15 |
| Super Bulky (6) | Super chunky | 7 to 11 |
| Jumbo (7) | Jumbo, roving | 6 or fewer |

Notice two things. Fine and Light share 23 and 24, so those values match both. And there are gaps: nothing covers values between 15 and 16, between 20 and 21, or between 26 and 27, for example. The calculator leaves a value in a gap unassigned instead of forcing it into a category.

## Worked example: identifying a mystery yarn from a swatch

These are illustrative measurements, not a yarn we swatched.

**Swatch A.** You knit a stockinette swatch and count 27 stitches across 6 inches of it. The calculator asks for stitches per 4 inches, so convert first:

| Step | Arithmetic | Result |
| --- | --- | --- |
| Stitches per inch | 27 ÷ 6 | 4.5 |
| Stitches per 4 inches | 4.5 × 4 | 18 |
| Matching ranges | 18 is within 16 to 20 only | Medium (4) |

One category matches. The calculator shows Medium (4) with needle suggestions of US 7 to 9 (4.5 to 5.5 mm).

**Swatch B.** A different yarn gives 41 stitches across 8 inches.

| Step | Arithmetic | Result |
| --- | --- | --- |
| Stitches per inch | 41 ÷ 8 | 5.125 |
| Stitches per 4 inches | 5.125 × 4 | 20.5 |
| Matching ranges | Medium ends at 20; Light starts at 21 | No match |

The calculator reports that no category matches. That is an honest answer, not an error. The yarn could be a heavy Light (3) knit loosely or a light Medium (4) knit firmly, and the swatch alone cannot say which. Try a second swatch on a different needle size and see where it lands.

**Swatch C.** A third yarn measures 23 stitches per 4 inches. That value sits in both Fine (2) and Light (3), so the calculator shows both and flags the overlap. Swatch with needles from each range before deciding.

**A WPI check.** If you cannot knit, a yarn that measures 10 wraps per inch matches only Medium (4) in the calculator's WPI ranges (9 to 12). Many other WPI readings match two or three categories.

## How do you substitute a yarn once you know its weight?

Matching the category is only the first filter. Two yarns in the same category can knit to different gauges and contain very different lengths per ball.

1. **Compare gauge, not just the category.** Swatch the candidate yarn in the pattern's stitch and compare it with the pattern gauge in the [Gauge Calculator](/gauge-calculator).
2. **Compare the labels side by side.** The [Yarn Weight Chart](/yarn-weight-chart) includes a label comparison for two categories and their yards per gram. Matching numbers still do not prove matching fabric.
3. **Buy by length, not by ball count or grams.** Suppose a pattern calls for 5 balls of a yarn with 200 yards each. That is 5 × 200 = 1,000 yards. A substitute with 220 yards per ball needs 1,000 ÷ 220 = 4.55, so 5 balls. A substitute with 180 yards per ball needs 1,000 ÷ 180 = 5.56, so 6 balls. Same pattern, same category, one more ball.

The [reading yarn labels guide](/guides/reading-yarn-labels) explains where to find length, mass, and label gauge.

## What are the most common mistakes?

**Entering a crochet swatch in the gauge mode.** The gauge ranges are knitting stockinette ranges. Crochet fabric uses different stitch counts for the same yarn, so a crochet swatch will point to the wrong category. Use WPI instead, or compare against the crochet ranges in the [Yarn Weight Chart](/yarn-weight-chart).

**Measuring a short span and not scaling it.** Counting 9 stitches across 2 inches and entering 9 gives Super Bulky (6). Scaled properly, 9 ÷ 2 × 4 = 18 stitches per 4 inches, which is Medium (4). Always convert to stitches per 4 inches.

**Rounding a gap value into a category.** A reading of 20.5 is not "basically worsted." It is a signal to swatch again, ideally with a different needle.

**Treating the category as the yarn's identity.** A weight category says nothing about fiber content, care, or length per ball. For unknown fiber, see the [fiber content guide](/guides/fiber-content-guide), and keep care requirements unresolved until you can confirm them.

**Using the category to estimate yardage.** A category cannot tell you how many yards are in a partial ball. If you have the original label figures, the [Yarn Stash Estimator](/stash-estimator) estimates remaining length from weight.

## When is the calculator the right tool, and when is it not?

**It is the right tool when** you have unlabeled or mystery stash yarn, handspun you want to place in a category, or a label you want to sanity check against your own knitting.

**It is not the right tool when:**

- You need to know whether a yarn will match a specific pattern. Only a swatch at the pattern gauge answers that; use the [Gauge Calculator](/gauge-calculator).
- You need fiber content or safe care instructions. No weight measurement can supply those.
- You need yardage. Use the label, or the stash estimator with the original label ratio.
- You already have the label. Read the category printed on it, and use the calculator only if your knitting disagrees.

## Frequently asked questions

### How can I tell if my yarn is worsted or DK?

Knit a stockinette swatch and count stitches over 4 inches. Medium (4), which includes worsted, covers 16 to 20 stitches, and Light (3), which includes DK, covers 21 to 24. A value between 20 and 21 matches neither, so swatch again on a different needle.

### Can I use the calculator if I only crochet?

Yes, use the wraps per inch mode, which needs no swatch at all. The gauge mode is for knitting in stockinette only. WPI ranges overlap, so expect the calculator to suggest more than one category in many cases.

### Why does my yarn match two weights?

Some published ranges overlap, such as Fine (2) and Light (3) at 23 and 24 stitches per 4 inches. A value in an overlap genuinely fits both. Swatch with a needle from each range and keep the fabric you prefer.

### Is the yarn weight on the label always right?

The label is the manufacturer's category and the best starting point. Your own gauge can still differ because of needle size, stitch, and personal tension. If your swatch disagrees with the label, trust the swatch for matching a pattern.

<!--
SIGN-OFF (drafted 2026-11-22)
Article checklist ~/workspace/business-cases/article-checklist-2026-10-29.md was NOT readable in this sandbox (permission denied). Applied its known shape from the brief instead.
Applied: answer-first opening that answers the title question in liftable sentences; headings phrased as real questions; worked examples using the tool's actual range tables from src/app/yarn-weight-calculator/YarnWeightCalculatorTool.tsx:22-119 and its match rule (value >= min and value <= max), arithmetic shown step by step; yarn substitution section (brief's preferred intent family) with buy-by-length arithmetic; common mistakes; when the tool is and is not the right answer; FAQs of 2 to 3 sentences; clear internal link to the free tool in the first section; CYC labels Lace (0) through Jumbo (7); no em dashes; no search volumes; editorial note disclosing AI assistance, matching existing guide convention. Differentiated from the existing wpi-guide (which already uses a 12 WPI example) by leading with stockinette gauge mode and linking to it for WPI technique.
Dropped: paid-pack CTA (not genuinely relevant to identifying yarn weight); image/diagram (none created).
Verification: arithmetic hand-derived from source; content/drafts/guides/verify-guide-examples.mjs reproduces the range matches but could not be executed in this sandbox.
-->
