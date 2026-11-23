---
status: draft
slug: "increase-evenly-guide"
title: "How to Increase Evenly Across a Row: Spacing Math"
description: "Space increases and decreases evenly in knitting or crochet. Checked 84 to 96 and 84 to 72 examples for flat rows and rounds, with common mistakes."
toolSlug: "increase-decrease-calculator"
date: "SET AT PUBLICATION"
draftDate: "2026-11-22"
keywords: ["how to increase evenly across a row", "increase evenly calculator", "decrease evenly knitting", "evenly spaced increases", "distribute increases crochet", "increase 12 stitches evenly"]
editorialNote: "AI-assisted explanation prepared with Claude. Numerical examples are hypothetical and were worked by hand from the calculator's source code; no physical project or yarn product was tested. Published by FiberTools."
sources:
  - title: "FiberTools: Increase & Decrease Calculator inputs and model"
    url: "https://fibertools.app/increase-decrease-calculator"
---

<!-- Draft layout: each H2 below maps to one `sections[]` entry in src/lib/guides.ts with `markdown: true`. -->

## How do you increase evenly across a row?

Subtract your current stitch count from the target to find how many increases you need. Each increase worked into a stitch uses up one existing stitch, so subtract the number of increases from the current count to find the plain stitches you have left to share out. In a flat row, divide those plain stitches into one more gap than you have increases, so both edges get plain stitches. In a round, divide them into exactly as many gaps as increases, because a round has no edges.

For example, going from 84 to 96 stitches in the round means 12 increases with 6 plain stitches before each one: knit 6, then increase, 12 times. The free [Increase & Decrease Calculator](/increase-decrease-calculator) does this arithmetic for flat rows and rounds, in knitting and crochet, and writes out the instruction line for you.

## What do you need to know before you calculate?

You need four things, and all of them come from your pattern or your needles, not from the calculator:

- **Your current stitch count.** Count what is actually on the needle or in the last row, not what the pattern says you should have.
- **Your target count after one row or round.** This is the total you want to end with, not the number of stitches to add.
- **Flat row or in the round.** The edge handling is different, so the answer is different.
- **Increase or decrease.** The calculator models a knit-front-and-back (KFB) increase and a knit-two-together (K2tog) decrease for knitting, and 2 SC in the next stitch or SC2tog for crochet.

If your pattern names a specific increase or decrease, use that stitch. The calculator's job is to tell you where the changes go and to prove the counts add up.

## Worked example: increasing from 84 to 96 stitches in a flat row

These are illustrative numbers, not a pattern we have tested. The arithmetic matches what the calculator's source code does for these inputs.

| Step | Arithmetic | Result |
| --- | --- | --- |
| Increases needed | 96 − 84 | 12 increases |
| Stitches used by the increases | 12 × 1 | 12 stitches |
| Plain stitches left to share out | 84 − 12 | 72 plain stitches |
| Gaps in a flat row | 12 + 1 | 13 gaps |
| Even share per gap | 72 ÷ 13 | 5, remainder 7 |

A remainder of 7 means 7 of the 13 gaps get one extra stitch. Seven gaps of 6 plus six gaps of 5 is 42 + 30 = 72, so every plain stitch is placed. The calculator spreads the larger gaps through the row instead of bunching them at one end, which gives this sequence of gaps: 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 6.

Written out for knitting, that is:

> Across the flat row, work K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; finish K6. (96 sts)

Check the counts both ways. Stitches used: 72 plain + 12 used by increases = 84, which matches what was on the needle. Stitches made: 72 plain + (12 × 2) = 96, which matches the target. For crochet, the same placement reads SC 5, 2 SC in next st; SC 6, 2 SC in next st; and so on, finishing with SC 6.

## How does the same increase work in the round?

In a round there is no first or last edge, so the 72 plain stitches go into 12 gaps instead of 13. That is 72 ÷ 12 = 6 exactly, with no remainder:

> From the round marker, work \*K6, KFB\* repeat 12 times. (96 sts)

Check: each repeat uses 6 + 1 = 7 stitches, and 12 × 7 = 84. Each repeat makes 6 + 2 = 8 stitches, and 12 × 8 = 96. The crochet version is \*SC 6, 2 SC in next st\* repeat 12 times.

## How do you decrease evenly?

The method is the same, with one change: a K2tog or SC2tog uses up two stitches and makes one. Going from 84 to 72 stitches in the round:

| Step | Arithmetic | Result |
| --- | --- | --- |
| Decreases needed | 84 − 72 | 12 decreases |
| Stitches used by the decreases | 12 × 2 | 24 stitches |
| Plain stitches left | 84 − 24 | 60 plain stitches |
| Gaps in a round | 12 | 12 gaps |
| Share per gap | 60 ÷ 12 | 5 |

> From the round marker, work \*K5, K2tog\* repeat 12 times. (72 sts)

Check: each repeat uses 5 + 2 = 7 stitches, so 12 × 7 = 84. Each repeat makes 5 + 1 = 6, so 12 × 6 = 72. In crochet that is \*SC 5, SC2tog\* repeat 12 times.

## What are the most common mistakes?

**Using the round answer on a flat row.** The quick shortcut, 84 ÷ 12 = 7, so "knit 6, increase" 12 times, uses exactly 84 stitches. In a round that is correct. In a flat row it puts the twelfth increase in the very last stitch, with no plain stitches after it. The calculator's flat-row result keeps plain stitches at both edges instead.

**Forgetting that a decrease uses two stitches.** Dividing 84 by 12 and writing "K7, K2tog" looks reasonable, but each repeat would need 7 + 2 = 9 stitches, and 12 × 9 = 108. You only have 84, so you would run out partway through the row. Subtract the stitches the decreases use first.

**Entering the number of increases as the target.** The calculator asks for the count you want to end with. If you need to add 12 stitches to 84, enter 96, not 12.

**Asking for too large a change in one row.** The calculator allows at most one increase per existing stitch and will not remove more than half the stitches with two-into-one decreases. Going from 40 to 90 stitches needs 50 increases, but you only have 40 stitches to work them into, so the tool reports the request as unsupported. Going from 40 to 15 needs 25 decreases, which would use 50 stitches. Patterns that make changes that large spread them over several rows.

**Assuming the modeled stitch is the one your pattern wants.** KFB and K2tog make the count arithmetic clear, but they have their own look and lean. If your pattern specifies a different increase or decrease, use it. If it specifies an increase that does not use up an existing stitch, the gap arithmetic changes, so follow the pattern's own placement.

## When is the calculator the right tool, and when is it not?

**It is the right tool when** a pattern tells you to "increase (or decrease) X stitches evenly" across one row or round of plain fabric and leaves the placement to you. It is also useful for checking a placement you worked out on paper, because it shows that the stitches used and the stitches made both add up.

**It is not the right tool when:**

- The fabric has a stitch pattern, cable, or lace repeat that the changes must respect. Even numeric spacing can break a repeat. The [Stitch Pattern Calculator](/stitch-pattern-calculator) helps find counts that fit a multiple.
- The shaping happens over many rows, such as a sleeve taper. Use the [Sleeve Shaping Calculator](/sleeve-calculator) or your pattern's schedule.
- You are working a flat crochet circle, where increases repeat round after round. The [Crochet Circle Round Planner](/circle-calculator) is built for that.
- Appearance matters more than spacing, such as visible paired decreases. Follow the designer's stated placement.

## Frequently asked questions

### How many stitches do I knit between increases?

Subtract the number of increases from your current count, then divide by the number of gaps: one more than the number of increases for a flat row, or equal to it for a round. If the division leaves a remainder, some gaps get one extra stitch. The [calculator](/increase-decrease-calculator) spreads those extra stitches through the row for you.

### Does the calculator work for crochet?

Yes. Every result includes a crochet line using 2 SC in the next stitch for an increase and SC2tog for a decrease. If your pattern uses a different stitch height, keep the same placement and swap in the stitch your pattern names.

### Why does the flat-row answer end with plain stitches?

A flat row has two edges, so the calculator places one gap before the first change and one after the last. When there are enough plain stitches to go around, that keeps every increase or decrease off the first and last stitches of the row. When the plain stitches run short, an edge gap can be zero, and then a change lands on the first or last stitch itself: increasing 40 stitches to 80 leaves no plain stitches at all, so every stitch, edges included, is worked as an increase. In a round there is no edge, so every gap sits before a change.

### What if I need to more than double my stitches?

The calculator only models one increase per existing stitch in a single row or round, so it will report anything larger as unsupported. Spread the change across two or more rows, or follow your pattern's shaping instructions. Running each row through the calculator separately can still help you check the counts.

<!--
SIGN-OFF (drafted 2026-11-22)
Article checklist ~/workspace/business-cases/article-checklist-2026-10-29.md was NOT readable in this sandbox (permission denied). Applied its known shape from the brief instead.
Applied: answer-first opening that answers the title question in liftable sentences; headings phrased as real questions; worked example with real numbers run through the tool's actual math (src/lib/stitch-distribution.mjs), arithmetic shown step by step and checked both directions; common mistakes; when the tool is and is not the right answer; FAQs of 2 to 3 sentences; clear internal link to the free tool in the first section and FAQ; US crochet terms (SC, SC2tog); no em dashes; no search volumes; no invented patterns or tested-project claims; editorial note disclosing AI assistance, matching the existing guide convention.
Dropped: paid-pack CTA (neither the $12 Planned Pooling Pack nor the $17 planning pack is genuinely relevant to stitch spacing); image/diagram (none created; existing guides use original SVGs that would need separate design work); external citation beyond the tool page (no external source was needed for pure arithmetic, and none was verified in this run).
Verification: arithmetic hand-derived from source; content/drafts/guides/verify-guide-examples.mjs reproduces it against the live functions but could not be executed in this sandbox.
-->
