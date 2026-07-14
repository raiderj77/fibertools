# FiberTools UI and UX Repair Log

This is an append-only record of interface reviews and repairs. Prioritize verified revenue and traffic paths before lower-value portfolio work.

## July 14, 2026 — highest-value journey repair

### Why FiberTools was first

FiberTools had the strongest verified portfolio evidence available: 260 Google Search Console clicks, 13,090 impressions, 212 Analytics sessions, active affiliate recommendations, and a live StitchProof demand experiment. Lower-value sites remain in maintenance mode until newer evidence changes the order.

### Audit scope

Rendered and inspected the homepage, Blanket Calculator, Amigurumi Shapes, Circle Calculator, and Amigurumi Pattern Checker at 390 × 844 and 1440 × 900. Checked navigation, landmarks, form labels, selection state, touch targets, consent controls, output actions, horizontal overflow, console errors, and page errors.

### Evidence before repair

- No tested page had horizontal overflow, duplicate H1 headings, empty links, unnamed buttons, console errors, or page errors.
- Calculator pages lacked a semantic `main` landmark even though the skip link targeted their container.
- The newsletter field and several high-traffic calculator controls had visible text labels that were not programmatically associated with the controls.
- Mobile menu, print, share, range, help, and copy controls included targets smaller than the intended accessible size.
- Selected blanket sizes, stitch types, and amigurumi shapes were communicated visually but not with `aria-pressed`.
- The Blanket Calculator's “grams per skein” field did not affect the recommendation.

### Repairs

- Added a focusable `main` landmark for the skip-link destination.
- Added Escape-key support, accurate open/close labels, control association, and larger targets to mobile navigation.
- Programmatically associated labels with the newsletter and high-traffic calculator inputs.
- Added fieldset or group semantics and `aria-pressed` state to visual choice controls.
- Enlarged range, copy, print, share, tooltip, and consent targets.
- Added polite status announcements for copy, share, newsletter success, and errors.
- Made both skein length and skein weight affect the Blanket Calculator result, using the higher requirement and explaining that behavior to the user.
- Added an automated UI foundation test to the pull-request quality gate.

### Deliberately deferred

- The long homepage tool catalog was not redesigned because the highest-traffic calculator journeys were the more valuable first repair and a homepage information-architecture change would be a separate experiment.
- Lower-value portfolio sites were not changed.
- Automated checks do not replace a periodic human screen-reader and keyboard review.
