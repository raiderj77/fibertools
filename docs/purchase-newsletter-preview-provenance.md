# Existing-page cleanup provenance

Local preparation based on `2f38539f262eec315ff73808f8d50b62cef5a24a`. No purchase, signup, email, private-storage retrieval or production delivery test was performed.

## Free signup gift

Source: the unchanged `public/survival-kit.pdf`, seven US Letter pages with AcroForms, 33,075 bytes. SHA-256: `e0f3db048c2f188009db6cc395230ace250ac73d4c1957ba6b2785d250af534f`. The tracked generator is `scripts/create-yarn-crafters-survival-kit.py`; the existing PDF, not a regenerated or invented replacement, was rendered for these previews.

`pdftoppm -f N -l N -singlefile -scale-to 1200 -png public/survival-kit.pdf public/images/newsletter/survival-kit-page-N` produced each 928 x 1200 image. No image edits or synthetic content were added. Both pages were visually inspected; text, fields, limitations and page numbers are intact. Poppler emitted missing Symbol/ArialUnicode display-font warnings; the inspected pages have no visible missing glyphs.

| Page | Content | PNG SHA-256 |
| --- | --- | --- |
| 5 | Swatch-to-finish calculation, worked examples and limitations | `d0e580d6eed6c4088126c2969272675e1225a7b9a4675f3a236f2d62a691d30b` |
| 7 | Blank fillable project-rescue record | `77b6a65d9f1c0e96b99a2b2ce945ad2131454956d52518416b8ef2e9e97b0fc5` |

The newsletter captions summarize those exact pages. They are explicitly gift previews, not examples of sent newsletter issues. Existing `BeehiivSignup` exposes the gift link after a successful server response; no new delivery mechanism is added.

## Pack and support

`src/lib/planning-pack-delivery.mjs` checks the paid session and approved bytes before returning an attachment named `FiberTools-Fiber-Project-Planning-Pack.pdf`. Its error text tells an already-paid purchaser not to buy again, to refresh the return page, to contact `hello@fibertools.app`, and not to share the download link. The revised product FAQ and help section describe those existing behaviors without implying an email attachment or a verified live purchase.

## Missing evidence and decisions

- The current paid edition is `FT-PP-V2-2026-08-25`, 134,356 bytes, SHA-256 `e5407e856ce539b1e751f8e36388c3d66d3151a649e6e61a97036ce9cbdd89a6` per the release manifest. It was generated outside Git. The tracked old PDF and five listing images are explicitly superseded; they are not suitable previews of this edition. A local copy matching this hash, or approved sample images demonstrably derived from it, is needed. Do not place the complete private paid PDF in Git or public assets.
- `docs/swatch-signal-launch-plan-2026-08-07.md` contains a plan and issue titles, not a completed issue. An existing issue's approved public text or URL is needed before showing a genuine newsletter example. No issue is fabricated.
- Current Planning Pack terms provide a support address and require Stripe confirmation of refunds, but establish neither eligibility nor a request window. Owner decision needed: **Which Planning Pack purchases are eligible for a refund, and within how many days of purchase must a request be made?** No eligibility, deadline, guarantee, or legal terms were changed.

All previews and help stay on existing pages; no new route is needed. Calculator behavior, free tools, checkout/provider gates and protected StitchProof records are unchanged.

## Local validation

The new focused checks first reproduced two failures (68 passed, 2 failed); after the edits all 70 passed. Independent verification included readiness tests: 75 passed. Production build passed, including 17 rendered-output tests, TypeScript and pre/postbuild gates. Publication freeze (27), search traffic (63), accessibility (12), offer readiness (12), and focus revenue (29) passed. Independent review and verification found no material issues; the verifier independently re-rendered the two PDF pages and matched both PNG hashes.

Headless local checks at 390px and 1440px passed for both edited pages: no horizontal overflow, preview images decode, and keyboard focus moves between both preview links. No external requests or submissions were permitted. Local checkout remained unavailable without production configuration, as expected; this is not a payment or delivery test. Poppler page images and page screenshots were visually inspected. No screen-reader or live provider verification is claimed.
