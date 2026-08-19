# Fabric substitution data sources

Last reviewed: 2026-08-16

## Scope and method

The Fabric Substitute Finder compares 30 named fabric families. These records are decision support, not laboratory specifications. A fabric name can describe a construction, fiber, finish, or a broad commercial family. Fiber blend, yarn size, machine settings, finishing, washing, and supplier terminology can move an individual fabric outside the working ranges in `src/data/fabrics.json`.

GSM and stretch values are deliberately stored as broad ranges. Ratings use an ordinal 1–5 scale for comparison inside this tool. They must not be presented as certified test results. Construction and general behavior come primarily from textile-education references; sewing difficulty, handling, and project suitability are synthesized from established sewing references. Retail listings were not used as the sole authority for any record.

## Source registry

The `id` values below match each record's `sourceReferences` array.

| Source ID | Reference | Fields supported |
| --- | --- | --- |
| `cottonworks-knit-basics` | [CottonWorks: Knit Basics](https://cottonworks.com/learning-hub/knitting/knit-basics/) | Knit loop construction, general stretch, apparel behavior |
| `cottonworks-single-double-knits` | [CottonWorks: Single and Double Knits](https://cottonworks.com/learning-hub/knitting/single-and-double-knits/) | Jersey, rib, interlock, Ponte construction, stability, extensibility |
| `cottonworks-basic-woven-designs` | [CottonWorks: Basic Woven Fabric Designs](https://cottonworks.com/learning-hub/weaving/basic-woven-fabric-designs/) | Plain weave, twill, denim, gabardine, bottom-weight context |
| `cottonworks-complex-woven-designs` | [CottonWorks: Complex Woven Fabric Designs](https://cottonworks.com/learning-hub/weaving/complex-woven-fabric-designs/) | Corduroy cut pile and wale construction |
| `cottonworks-denim-construction` | [CottonWorks: Denim Construction](https://cottonworks.com/learning-hub/denim/denim-construction/) | Warp-faced twill and denim yarn arrangement |
| `cottonworks-denim-basics` | [CottonWorks: Denim Basics](https://cottonworks.com/learning-hub/denim/denim-basics/) | Denim performance and weight context |
| `seamwork-silk-guide` | [Seamwork: The Ultimate Guide to Sewing with Silk](https://www.seamwork.com/fabric-guides/the-ultimate-guide-to-sewing-with-silk) | Chiffon, georgette, organza, satin, charmeuse, and crepe behavior |
| `seamwork-lingerie-fabrics` | [Seamwork: Choosing the Right Lingerie Fabrics](https://www.seamwork.com/fabric-guides/choosing-the-right-lingerie-fabrics) | Delicate-woven behavior, opacity, common uses, handling |
| `seamwork-one-pattern-three-fabrics` | [Seamwork: One Pattern, Three Fabrics](https://www.seamwork.com/issues/2017/04/one-pattern-three-fabrics-2) | Cotton lawn, linen, rayon challis garment behavior |
| `seamwork-fabric-shopping` | [Seamwork: Let's Go Fabric Shopping](https://www.seamwork.com/fabric-guides/lets-go-fabric-shopping-3) | Rayon challis and double-gauze behavior and uses |
| `seamwork-needle-guide` | [Seamwork: Needle Guide (PDF)](https://www.seamwork.com/media/free/2022/needle-guide.pdf) | Broad lightweight and medium-weight handling groups |
| `threads-monthly-dress-fabrics` | [Threads Monthly: Dress Fabric Types](https://threadsmonthly.com/dress-fabric-types/) | Secondary cross-check for names, garment uses, and handling |
| `threads-monthly-fabric-names` | [Threads Monthly: Fabric Names](https://threadsmonthly.com/fabric-names/) | Secondary cross-check for terminology and project uses |

## Interpretation rules

- Construction is a hard compatibility signal. A woven-to-knit comparison receives no construction or stretch points.
- Stretch is represented as relaxed working ranges, not maximum destructive elongation.
- Weight bands are comparison bands. Equal GSM does not prove equal thickness, warmth, opacity, or drape.
- `recommendedSubstitutes` never adds score. It records editorially plausible relationships that still have to earn a property-based score.
- `poorSubstitutes` applies a penalty and score cap so a known contradiction cannot be ranked as a strong match.
- Common uses are project categories, not endorsements of a particular pattern or retailer.
- A washed swatch and the pattern designer's requirements override the database.

## Conflicts and variable fields

The reviewed references consistently distinguish woven and knit construction and broadly agree on relative drape, structure, opacity, and sewing behavior. They do not publish one universal GSM or stretch specification for a named family. Commercial terms also overlap: satin and crepe span several fibers and weights; linen, twill, flannel, fleece, and muslin range from light to heavy; stretch depends on construction and any elastane content. The stored GSM and stretch values are therefore wide editorial comparison bands synthesized from the reviewed construction and sewing references, not quoted product specifications. No single supplier value is treated as universal.

When a real sample falls outside a range, record the sample's manufacturer specification as evidence for review; do not silently widen the database from one listing. If multiple independent technical references support the wider boundary, update the range, note the conflict here, and refresh the record date.

## Editorial ownership

Data changes require a source URL, a short note identifying the supported field, and a new `lastReviewedDate`. Do not tighten a broad range from one store listing or one unverified fabric swatch. When sources conflict, retain the broader honest range, document the conflict, and ask for human review rather than manufacturing precision.
