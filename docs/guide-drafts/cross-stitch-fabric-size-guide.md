---
status: draft
slug: "cross-stitch-fabric-size-guide"
title: "How Big Will My Cross Stitch Be? Fabric Count Guide"
description: "Work out finished cross stitch size from stitch count and fabric count, over one or over two, then add margins and plan floss. Checked 126 by 98 example."
toolSlug: "cross-stitch-calculator"
date: "SET AT PUBLICATION"
draftDate: "2026-11-22"
keywords: ["cross stitch size calculator", "how big will my cross stitch be", "cross stitch fabric count", "over two cross stitch size", "how much fabric for cross stitch", "cross stitch floss calculator"]
editorialNote: "AI-assisted explanation prepared with Claude. Numerical examples are hypothetical and were worked by hand from the calculator's source code; no physical project, fabric, or floss product was tested. Published by FiberTools."
sources:
  - title: "FiberTools: Cross Stitch Calculator inputs and model"
    url: "https://fibertools.app/cross-stitch-calculator"
---

<!-- Draft layout: each H2 below maps to one `sections[]` entry in src/lib/guides.ts with `markdown: true`. -->

## How big will my cross stitch be?

Divide the pattern's stitch count by your fabric's stitches per inch. A design 126 stitches wide on 14-count Aida is 126 ÷ 14 = 9 inches wide. If you stitch over two threads on evenweave or linen, halve the fabric count first, so 28-count fabric worked over two behaves like 14 stitches per inch. That gives the finished design size only; add your chosen margin to every side before cutting fabric.

The free [Cross Stitch Calculator](/cross-stitch-calculator) runs this for any stitch count and compares the same design across common fabric counts in one table.

## What does fabric count actually mean?

Fabric count is how many grid units fit in one inch. On Aida, that is stitchable squares per inch. On evenweave and linen, it is threads per inch. A full cross worked over one grid unit uses the count directly as stitches per inch. A full cross worked over two grid units uses half the count, because each stitch covers twice the distance.

So the number you divide by is:

- **Over one:** fabric count. 14-count Aida over one is 14 stitches per inch.
- **Over two:** fabric count ÷ 2. 28-count evenweave over two is 14 stitches per inch.

Pattern dimensions should be in full crosses, which most charts list as width by height in stitches.

## Worked example: a 126 by 98 stitch design

Suppose a chart lists a design as 126 stitches wide and 98 stitches high. These are illustrative numbers, not a specific published chart.

On 14-count Aida, stitched over one:

| Dimension | Arithmetic | Finished size |
| --- | --- | --- |
| Width | 126 ÷ 14 | 9 inches |
| Height | 98 ÷ 14 | 7 inches |
| Width in centimeters | 9 × 2.54 | 22.86 cm, shown as 22.9 cm |
| Height in centimeters | 7 × 2.54 | 17.78 cm, shown as 17.8 cm |

Here is the same design across other fabric choices. The calculator rounds displayed sizes to one decimal place, and this table follows that rounding.

| Fabric and stitch span | Stitches per inch | Width | Height |
| --- | --- | --- | --- |
| Aida 11, over one | 11 | 126 ÷ 11 = 11.5 in | 98 ÷ 11 = 8.9 in |
| Aida 14, over one | 14 | 9.0 in | 7.0 in |
| Aida 16, over one | 16 | 126 ÷ 16 = 7.9 in | 98 ÷ 16 = 6.1 in |
| Aida 18, over one | 18 | 126 ÷ 18 = 7.0 in | 98 ÷ 18 = 5.4 in |
| Evenweave 28, over two | 28 ÷ 2 = 14 | 9.0 in | 7.0 in |
| Evenweave 28, over one | 28 | 126 ÷ 28 = 4.5 in | 98 ÷ 28 = 3.5 in |

Two things stand out. Going from 11-count to 18-count shrinks the same chart from about 11.5 inches wide to 7 inches. And 28-count over two lands at exactly the same size as 14-count Aida over one, because both work out to 14 stitches per inch.

## How much fabric do you need to cut?

Add your margin to both sides of each dimension. Using a 3-inch margin on every side, which is the calculator's starting value and a choice for this example rather than a recommendation:

| Dimension | Arithmetic | Fabric cut |
| --- | --- | --- |
| Width | 9 + (2 × 3) | 15 inches |
| Height | 7 + (2 × 3) | 13 inches |

The right margin depends on your hoop or frame, how the piece will be finished, and what your framer or finishing method needs. The calculator does not pick one for you on purpose. Confirm the margin first, then round the cut up to whatever increments the fabric is sold in.

## How much floss will one color need?

The calculator's floss mode is a planning model for full crosses of a single color. It measures the two visible diagonals of each cross, then adds an allowance you choose for the back of the work, starts, stops, and tails. This example uses the tool's starting values for strands, allowance, and skein label, which are inputs to replace with your own, not measured rates.

Inputs: 5,000 full crosses of one color, 14-count Aida over one, 2 strands held together, a 40% allowance, and a skein labeled 8 meters with 6 strands in the bundle.

| Step | Arithmetic | Result |
| --- | --- | --- |
| Side of one stitch square | 1 ÷ 14 | 0.0714 in |
| Front path of one cross (two diagonals) | 2 × √2 ÷ 14 | 0.202 in |
| Front path for all crosses | 5,000 × 0.20203 | 1,010.15 in |
| Convert to meters | 1,010.15 × 0.0254 | 25.66 m |
| Add 40% allowance | 25.66 × 1.40 | 35.9 m of working thread |
| Two strands held together | 35.92 × 2 | 71.8 m of single strand |
| Single strand in one skein | 8 m × 6 strands | 48 m |
| Skeins | 71.84 ÷ 48 | 1.50, rounded up to 2 skeins |

Change only the strands to 3 and the single-strand total becomes 35.92 × 3 = 107.8 m. That is 107.76 ÷ 48 = 2.25 skeins, rounded up to 3. Holding one more strand changed the purchase by a whole skein, even though the design did not change.

Treat the result as a transparent scenario to compare against the floss list in your chart, not a promise. The model leaves out partial crosses, backstitch, French knots, beads, and the length you lose to cut ends.

## What are the most common mistakes?

**Forgetting to halve the count for over-two stitching.** Dividing 126 by 28 gives 4.5 inches. If you are stitching over two, the real width is 126 ÷ 14 = 9 inches, twice as wide. Cutting fabric for the smaller number leaves you with no margin at all.

**Adding the margin once instead of twice.** A 9-inch design with a 3-inch margin needs 9 + 3 + 3 = 15 inches of fabric, not 12. The margin goes on the left and the right, and on the top and the bottom.

**Counting the whole chart as one color in the floss mode.** The floss model works one color at a time. Run it once per color with that color's full-cross count, then round each color up to whole skeins separately.

**Treating the starting values as facts about your floss.** The 8-meter skein, 6-strand bundle, and 40% allowance are editable inputs. Check the label on the floss you are buying and decide your own allowance.

**Mixing units.** If you switch the calculator to metric, enter the margin in centimeters. A 3 entered as centimeters is a much smaller margin than 3 inches.

## When is the calculator the right tool, and when is it not?

**It is the right tool when** you know a chart's stitch dimensions and want to compare fabric counts before buying, work out a fabric cut from your own margin, or get a first estimate of floss for the full crosses of one color.

**It is not the right tool when:**

- You need floss for backstitch, partial crosses, or specialty stitches. Use the chart's own floss list.
- You need a brand-to-brand floss match. The [Embroidery Thread Converter](/thread-converter) looks up a limited set of archived DMC and Anchor pairings, and you should still compare the physical thread.
- You need to know what margin a particular frame or finishing method requires. Ask the framer or follow the finishing instructions.
- The chart lists dimensions in something other than full stitches. Convert to full crosses first.

## Frequently asked questions

### What size fabric do I need for cross stitch?

Take the finished design size and add your margin to every side: width plus two margins, height plus two margins. A 9 by 7 inch design with a 3-inch margin needs a 15 by 13 inch cut. Choose the margin based on how you plan to hoop, frame, or finish the piece.

### Is 28-count fabric over two the same size as 14-count Aida?

For finished size, yes. Over two halves the count, so 28-count worked over two is 14 stitches per inch, the same as 14-count Aida over one. The look and handling of the fabric are different, but the arithmetic gives the same dimensions.

### How do I make a cross stitch design bigger or smaller?

Change the fabric count. A lower count, such as 11, makes each stitch larger and the design bigger; a higher count, such as 18, makes it smaller. The [calculator's comparison table](/cross-stitch-calculator) shows the same chart across ten fabric options at once.

### Can I use centimeters?

Yes. Switch the calculator to metric and enter the margin in centimeters; finished sizes are shown in centimeters too. Fabric count stays a per-inch number, because the calculator's fabric options are defined that way.

<!--
SIGN-OFF (drafted 2026-11-22)
Article checklist ~/workspace/business-cases/article-checklist-2026-10-29.md was NOT readable in this sandbox (permission denied). Applied its known shape from the brief instead.
Applied: answer-first opening that answers the title question in liftable sentences; headings phrased as real questions; worked examples (size, comparison table, fabric cut, floss) using the tool's actual formulas from src/lib/cross-stitch-planning.mjs and its one-decimal display rounding from CrossStitchCalculatorTool.tsx, arithmetic shown step by step; common mistakes; when the tool is and is not the right answer; FAQs of 2 to 3 sentences; clear internal link to the free tool in the first section and FAQ; no em dashes; no search volumes; no claims about specific floss brands' skein lengths (the 8 m / 6 strand values are labeled as tool starting inputs); editorial note disclosing AI assistance, matching existing guide convention.
Dropped: paid-pack CTA (neither pack is genuinely relevant to cross stitch sizing); image/diagram (none created); external citations (none verified in this run; the tool page states the model).
Verification: arithmetic hand-derived from source; content/drafts/guides/verify-guide-examples.mjs reproduces it against the live functions but could not be executed in this sandbox.
-->
