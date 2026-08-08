# FiberTools traffic and income deep dive

**Evidence date:** August 7, 2026
**Protected boundary:** do not change StitchProof experiment inputs or the distribution kit before the August 11 evidence review.

## Verified current position

- Search Console, May 6 through August 5: **745 clicks, 40,303 impressions, 1.8% CTR, average position 18.7**.
- Highest-click pages include amigurumi shapes (117), blanket calculator (116), circle calculator (115), yarn calculator (81), sock calculator (45), color-pooling calculator (41), and sleeve calculator (38).
- The blanket calculator has **11,255 impressions and 116 clicks**, making it the clearest post-experiment title/snippet opportunity. Yarn and cast-on pages also have high impressions relative to clicks.
- GA4, July 9 through August 5: **106 users, 143 sessions, 211 pageviews, 653 events, and $0 total revenue**. `ravelry_patterns_shown` recorded 52 events from 21 users; `pattern_check_run` recorded 22 events from 3 users; `affiliate_click` recorded 2 events from 1 user.
- Search Console reports **1,168 external links**: 1,134 to the homepage, 33 to the yarn calculator and 1 to the WPI guide. Most come from unrelated sites in the owner's portfolio, not independent topical publishers.
- AdSense reports “Low value content” and a stale “ads.txt not found” status. The live `ads.txt` returns HTTP 200 with the correct publisher line. Ads remain code-gated pending approval.
- The public Etsy shop has four unrelated active digital products, 0 sales and no FiberTools product. The known Gumroad product is an unrelated UGC rate-card kit. No FiberTools storefront sale is verified.
- The current Amazon Associates session was not available. Historical account-level clicks and commission cannot be attributed to FiberTools. GA4's two affiliate-click events are not revenue evidence.

## How comparable sites make money

| Model | Current first-party evidence | Fit for FiberTools |
|---|---|---|
| Affiliate links plus ads | [Crochet Calc discloses product affiliate links and advertising on articles rather than calculators](https://crochetcalc.com/about.html). | Good fit when recommendations directly solve the calculator's next step and disclosures remain clear. Display ads should wait for quality approval and should not damage tool UX. |
| Freemium subscription | [Stitch Fiddle sells monthly and annual Premium plans](https://www.stitchfiddle.com/en/premium/pricing). | Proven category model, but premature at current traffic and conversion volume. Test willingness to pay before recurring billing. |
| Pattern marketplace commission | [Ribblr documents marketplace sale fees](https://ribblr.com/paymentspolicy) and optional premium features. | Large operational scope. A focused planner or pattern-checking product is a better near-term test than building a marketplace. |
| One-time premium unlock | [Woolwise sells a one-time Pro unlock](https://woolwise.cc/). | Strong fit if StitchProof or a planning workspace produces repeat value without ongoing service costs. |
| Low-cost annual subscription | [HoneyLoop sells an annual craft-management subscription](https://www.honeyloop.app/). | Possible later for saved projects, inventory or collaboration, but requires accounts, support, privacy and enough repeat usage. |
| Digital downloads | [Etsy permits seller-designed digital downloads](https://help.etsy.com/hc/en-us/articles/115015628347); [Gumroad charges direct-sale and Discover fees](https://gumroad.com/pricing). | Best immediate revenue test. A useful original project-planning pack can sell without changing free calculator access. |

## Recommended monetization ladder

1. **Original Fiber Project Planning Pack** — printable and fillable project brief, swatch record, yarn-lot log, size and gauge worksheet, project-cost sheet, finishing checklist and troubleshooting notes. No copied patterns or third-party graphics.
2. **Contextual Amazon links** — add only when a specific tool result creates a real purchasing decision. Keep the Associate disclosure near links, use Special Links, and never put affiliate links in offline PDFs or email.
3. **One-time premium pilot** — after the protected StitchProof decision, test a clear paid outcome rather than a broad subscription. Candidate: expanded pattern check, exportable report or project workspace.
4. **Display ads on editorial pages** — only after AdSense quality approval and UX measurement. Keep calculators fast, readable and uncluttered.
5. **Recurring product** — consider only after repeat use and paid demand are demonstrated. Saved projects, stash management and pattern workflows are plausible; traffic alone is not validation.

## Traffic plan

### Organic search and answer engines

- After the protected window, test title and description improvements for blanket, yarn and cast-on pages one cohort at a time; preserve page quality and measure Search Console CTR, not rankings alone.
- Maintain the formula library as a “show the work” reference with formulas, worked examples, limitations and official Craft Yarn Council sources.
- The active draft PR now connects the knitting hub, yarn, raglan, cast-on, and sock journeys with contextual links where the next calculation is genuinely useful. Keep this cluster focused rather than turning every page into repetitive SEO copy.
- Publish original measurements: controlled swatch comparisons, calculator validation examples, yarn-label field studies and transparent correction logs. These are more defensible and linkable than generic AI-written craft articles.
- Continue structured answer blocks, canonical metadata and citation hygiene. Do not mass-produce similar posts or claim unsupported audience, accuracy, savings or sales statistics.

### Ethical link acquisition

- Pitch the formula library and individual calculator references to knitting and crochet teachers, guild resource pages, pattern designers, yarn-store education pages, library craft guides, maker-space curricula and relevant open-source projects.
- Offer an embeddable plain-text formula citation and calculator link, not a paid link or reciprocal-link requirement.
- Government or `.edu` links must result from genuine relevance and editorial choice. Never buy, manufacture or disguise them.
- Prioritize deep links to blanket, circle, yarn, gauge and formula pages. Homepage links alone do little to establish topic depth.
- No outreach is authorized by this document. Owner approval is required for each recipient list and message before contact.

### Community and partnerships

- Continue useful, rules-compliant Ravelry participation only where tools are invited. Do not manufacture engagement or post duplicate promotions.
- Turn one calculator problem per week into a short visual demonstration for Pinterest, YouTube Shorts and Threads, with the tool as the natural next step.
- Invite pattern designers to supply a fictional or public example for a calculator walkthrough; obtain explicit permission for every pattern excerpt, image and attribution.
- Create a teacher/guild resource page after the formula library earns initial use, offering free classroom links and printable formula summaries without affiliate links.

## Conversion repairs

- The newsletter server action now validates the address, normalizes it and returns generic visitor-safe errors rather than provider bodies or configuration details.
- The newsletter success state now emits a generic source-only event only when current analytics consent is granted and GPC is inactive. It does not send the email address, craft choices, or provider response to analytics.
- Track tool completion, contextual affiliate click, paid-product CTA, checkout referral and verified storefront sale as separate facts.
- Preserve direct links and campaign parameters with a privacy-safe fixed taxonomy; never include pasted patterns or calculated results in analytics.

## 30-day measured loop after permitted releases

For every channel, record:

- qualified sessions to a specific tool or authority page;
- tool-completion rate;
- newsletter success rate, after consent;
- contextual affiliate click rate and separately verified Amazon orders/commission;
- paid-product CTA clicks and separately verified Etsy or Gumroad sales/refunds;
- independent topical referring domains and deep links;
- Search Console clicks, impressions, CTR and position by page/query.

Scale only channels that produce qualified visits and tool completions. Revenue must come from Amazon, Etsy, Gumroad, payment-provider or entitlement evidence; never infer it from GA4 events.

## Explicitly deferred

- Any StitchProof experiment, metadata or distribution change before the August 11 evidence review.
- AdSense reapplication, premium pricing, paid listing publication, Amazon account changes, paid ads, sponsor contact or outreach without its own owner approval.
- Subscription infrastructure before repeat use and willingness-to-pay evidence.
- A marketplace, community account system or saved-pattern product until privacy, support, moderation and cost models are approved.
