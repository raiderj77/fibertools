---
title: "Calculate Aida Size"
date: "2026-06-12"
slug: "calculate-aida-size"
description: ""
status: published
author: "Your Friendly Developer LLC"
---

# How to Calculate Aida Cloth Size for Cross Stitch Projects

Aida size calculation comes down to two numbers: your [stitch count and your fabric count](/blog/cross-stitch-size-chart/). Divide the design's width in stitches by the fabric count (stitches per inch), then add at least 3 inches of margin on each side. Do the same for height. That gives you the minimum fabric rectangle you need to cut or order.

---

## What exactly is "fabric count" and why does it matter?

Fabric count is [the number of holes (and therefore stitches) per inch](/blog/cross-stitch-count/). Common Aida counts are 11, 14, 16, 18, and 28. The higher the count, the smaller each stitch, and the smaller your finished design will be on the fabric.

If you stitch the same 140 x 140 stitch design on 14-count Aida, you get a 10 x 10 inch design. Stitch it on 18-count and the same design shrinks to roughly 7.8 x 7.8 inches. This single variable controls everything downstream, including how much fabric you buy.

[DMC's guide to Aida fabric](https://www.dmc.com/us/blog/how-to-choose-the-right-cross-stitch-fabric-for-your-project-n9000021901) explains count in plain terms if you want a second source to bookmark.

---

## How do I find the stitch count for my design?

The stitch count is listed on every commercial pattern, usually right on the cover page or in the materials section. It looks like "Stitch count: 120w x 98h" or similar. That means 120 stitches across the widest point and 98 stitches at the tallest point.

If you are charting your own design, count the filled squares on your grid from the leftmost occupied square to the rightmost, then top to bottom. Software like [PC Stitch](https://www.pcstitch.com/) or [KG Chart](https://www.kg-chart.com/) will report this automatically. If you are converting an image, the pixel dimensions of your chart grid equal your stitch count directly.

---

## What is the actual formula I should use?

Divide your stitch count by the fabric count to get the stitched area in inches, then add your margin. So a 140-stitch-wide design on 14-count gives you 10 inches of stitching, plus 8 inches total margin, equals 18 inches of fabric. I use 4 inches per side for anything going into a hoop.


Here it is, no fluff:

**Fabric width needed = (stitch width ÷ fabric count) + margin**

**Fabric height needed = (stitch height ÷ fabric count) + margin**

Standard margin is 3 to 6 inches per side. I personally use 4 inches per side (8 inches total per dimension) for anything going into a hoop or frame, because you need enough fabric to grip and you lose a little to fraying even with sealed edges.

**Worked example:**

- Design stitch count: 168w x 210h
- Fabric count: 14-count Aida
- Margin: 4 inches per side

Width: (168 ÷ 14) + 8 = 12 + 8 = **20 inches**
Height: (210 ÷ 14) + 8 = 15 + 8 = **23 inches**

So you need to cut or order a piece at least 20 x 23 inches. When I am buying off a bolt, I round up to the nearest half-yard to give myself a buffer.

---

## Does the fabric count change if I stitch over two threads?

Yes, and this trips people up constantly. When you stitch over two threads on evenweave or linen, your effective stitch count per inch is halved. A 28-count evenweave stitched over two threads gives you the same stitch size as 14-count Aida.

Aida is woven in blocks specifically so you stitch over one block at a time. You generally do not stitch over two on Aida, so this is mostly a concern when you are substituting evenweave for Aida or vice versa. If your pattern says "designed for 28-count over two," treat it exactly like 14-count in your size calculation.

---

## How do I calculate size for an irregularly shaped design?

Use the bounding box. Draw an imaginary rectangle around the outermost stitches in every direction, then measure that rectangle's stitch dimensions. You are calculating fabric size, not design coverage, so the empty space inside the bounding box does not matter.

A wreath design that is 200 stitches wide and 200 stitches tall but mostly hollow in the center still needs fabric calculated on 200 x 200. The fabric does not know your design has a gap in the middle.

---

## What if I want to center the design on my fabric?

Centering does not change your fabric size calculation, but it does affect how you mark your starting point. Once you have your fabric cut, fold it in half horizontally and then vertically. The fold intersection is the center. Most commercial patterns mark the center of the chart with arrows or a center symbol, and you match that point to your fabric center.

If you are stitching from a chart without a marked center, count the total stitches in each dimension, divide by two, and count outward from your fabric center to find where row 1, stitch 1 of the chart should land.

---

## Is there a quick reference for common stitch counts?

Yes, and the short version is that fabric count makes less difference than most beginners expect. A 100x100 design ranges from about 13.6 inches on 18-count to 17.1 inches on 11-count, all with 4 inches of margin per side added. The count matters most when your design is large or detail-heavy.


Here is a table I keep pinned above my stitching table. All numbers assume 4 inches margin per side (8 inches total added per dimension).

| Stitch Count | 11-count | 14-count | 18-count |
|---|---|---|---|
| 50 x 50 | 12.5 x 12.5 in | 11.6 x 11.6 in | 10.8 x 10.8 in |
| 100 x 100 | 17.1 x 17.1 in | 15.1 x 15.1 in | 13.6 x 13.6 in |
| 150 x 200 | 21.6 x 26.2 in | 18.7 x 22.3 in | 16.3 x 19.1 in |
| 200 x 250 | 26.2 x 30.7 in | 22.3 x 25.9 in | 19.1 x 21.9 in |

These are starting points. Measure your actual cut piece before you start stitching, and confirm the fabric count matches what the label says. Fabric count can occasionally vary by manufacturer even within the same nominal count, so a quick thread count on your specific piece saves a lot of frustration later.

---

## Any tools that do this math automatically?

[Stitchboard's fabric size calculator](https://www.stitchboard.com/tools/fabricsizecalculator) is free and does the division for you. You plug in stitch count, fabric count, and desired margin, and it spits out the fabric dimensions. Handy when you are ordering from a shop and want to confirm before checkout.

For those who prefer spreadsheets, a two-cell formula in Google Sheets handles it fine: `=(stitch_count/fabric_count)+margin_total`. One column for width, one for height, done.

The math is simple enough that you can do it in your head at the shop. Knowing the formula means you are never dependent on a tool being available when you are standing at a bolt of fabric trying to decide how much to cut.

## Frequently asked questions

### What is Aida cloth count and how does it affect my cross stitch project?
Aida count refers to the number of squares (or holes) per inch on Aida fabric, with common counts being 14, 16, 18, and 28. A higher count means smaller squares, resulting in finer, more detailed stitching. A lower count produces larger, bolder stitches and is easier for beginners. Choosing the right count determines your finished piece's size, so calculating it correctly before starting saves fabric and ensures your design fits as intended.

### How do I calculate how much Aida fabric I need for my design?
Divide your design's stitch width and height by the Aida count to get the stitched area in inches, then add at least 2–3 inches of border on each side. For example, a 140-stitch wide design on 14-count Aida produces a 10-inch wide stitched area. Adding a 3-inch border on each side means you need at least 16 inches of fabric width. A calculator tool like the one on fibertools.app handles this math instantly and accurately.

### Can I use the Aida size calculator for different fabric counts?
Yes, the Aida size calculator works for any fabric count, including 11, 14, 16, 18, 22, and 28-count Aida or evenweave fabrics. Simply enter your stitch count and select your desired fabric count to see the finished dimensions change in real time. This makes it easy to compare how the same design looks across multiple fabric counts before purchasing materials, helping you choose the best option for your skill level and desired detail.

### What is the difference between Aida and evenweave fabric for cross stitch?
Aida has a visible block weave that clearly defines each stitch square, making it ideal for beginners, while evenweave fabrics like linen or Jobelan have a smoother, uniform weave typically stitched over two threads. Both can be calculated using stitch count and thread count per inch, but evenweave is usually divided by half its count to get the same effective grid. The fibertools.app calculator supports both fabric types so you can plan your project accurately regardless of your material choice.

### Why does my finished cross stitch look smaller or larger than I expected?
The most common reason is a mismatch between the design's stitch count and the Aida fabric count used during planning. Stitching a 200-count design on 18-count Aida produces a noticeably smaller piece than the same design on 11-count Aida. Forgetting to account for border fabric or working from an incorrect stitch count can also cause surprises. Using an Aida size calculator before you begin ensures your fabric purchase and framing plans match your actual finished dimensions.


<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Aida cloth count and how does it affect my cross stitch project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aida count refers to the number of squares (or holes) per inch on Aida fabric, with common counts being 14, 16, 18, and 28. A higher count means smaller squares, resulting in finer, more detailed stitching. A lower count produces larger, bolder stitches and is easier for beginners. Choosing the right count determines your finished piece's size, so calculating it correctly before starting saves fabric and ensures your design fits as intended."
      }
    },
    {
      "@type": "Question",
      "name": "How do I calculate how much Aida fabric I need for my design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide your design's stitch width and height by the Aida count to get the stitched area in inches, then add at least 2\u20133 inches of border on each side. For example, a 140-stitch wide design on 14-count Aida produces a 10-inch wide stitched area. Adding a 3-inch border on each side means you need at least 16 inches of fabric width. A calculator tool like the one on fibertools.app handles this math instantly and accurately."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the Aida size calculator for different fabric counts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the Aida size calculator works for any fabric count, including 11, 14, 16, 18, 22, and 28-count Aida or evenweave fabrics. Simply enter your stitch count and select your desired fabric count to see the finished dimensions change in real time. This makes it easy to compare how the same design looks across multiple fabric counts before purchasing materials, helping you choose the best option for your skill level and desired detail."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Aida and evenweave fabric for cross stitch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aida has a visible block weave that clearly defines each stitch square, making it ideal for beginners, while evenweave fabrics like linen or Jobelan have a smoother, uniform weave typically stitched over two threads. Both can be calculated using stitch count and thread count per inch, but evenweave is usually divided by half its count to get the same effective grid. The fibertools.app calculator supports both fabric types so you can plan your project accurately regardless of your material choice."
      }
    },
    {
      "@type": "Question",
      "name": "Why does my finished cross stitch look smaller or larger than I expected?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most common reason is a mismatch between the design's stitch count and the Aida fabric count used during planning. Stitching a 200-count design on 18-count Aida produces a noticeably smaller piece than the same design on 11-count Aida. Forgetting to account for border fabric or working from an incorrect stitch count can also cause surprises. Using an Aida size calculator before you begin ensures your fabric purchase and framing plans match your actual finished dimensions."
      }
    }
  ]
}
</script>
