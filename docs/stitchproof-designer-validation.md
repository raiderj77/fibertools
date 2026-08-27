# StitchProof Designer 30-Day Validation Dashboard

## Status and evidence boundary

- **Dashboard status:** NOT STARTED.
- **Observation window:** begins only after the owner-approved designer route is tied to a verified production deployment; ends 30 calendar days later.
- **Public route:** `/amigurumi-pattern-checker/designer`.
- **Offer state for this release:** report preview and browser-local exports only. The proposed $9 checkout is disabled. No StitchProof Stripe Product, Price, Payment Link, or payment code is part of this release.
- **Evidence rule:** `UNKNOWN` means the source was not available or the observation window has not begun. It must not be recorded as zero, failure, demand, or revenue.

This dashboard contains aggregate counts only. Do not add names, email addresses, pattern titles or text, instruction excerpts, notes, corrections, GA client identifiers, Stripe customer or session identifiers, mailbox excerpts, or provider payloads.

## Source verification before each review

1. Confirm the GA4 property and web stream are the ones serving `fibertools.app`; filter to the production hostname. Use consented aggregate event counts only.
2. Confirm Stripe is in the FiberTools account `acct_1U5HWnD2Of3MIt94` and record whether the view is live or test mode. Never use another Stripe account as FiberTools evidence.
3. Review only the owner-designated FiberTools mailbox for explicit StitchProof purchase commitments and Designer Pattern Preflight inquiries. Record aggregate classifications, not message text or sender identity.
4. Record the exact review time, observation-window dates, and source availability. A successful page response, analytics event, email, or Checkout start is not proof of payment.

## Kill-test dashboard

| Metric | Thirty-day threshold | Evidence source and counting rule | Current verified value | Status |
| --- | ---: | --- | ---: | --- |
| Designer-mode starts | 40 | GA4 `designer_mode_opened` event count on the production hostname after consent and GPC checks | UNKNOWN | NOT STARTED |
| Completed reports | 20 | GA4 `report_previewed` event count. Count a preview only after the local report was actually generated | UNKNOWN | NOT STARTED |
| Completed version comparisons | 10 | GA4 `version_comparison_completed` event count; starts alone do not qualify | UNKNOWN | NOT STARTED |
| Paid-report purchase attempts | 5 | Verified live Stripe Checkout attempts for the exact future StitchProof offer after checkout is separately approved and enabled. `paid_report_interest_submitted` and `checkout_started` analytics are intent signals, not provider evidence | UNKNOWN | BLOCKED BY DISABLED CHECKOUT |
| Paid reports or firm purchase commitments | 3 | Sum of settled, non-refunded live Stripe payments for the exact future offer plus separately reviewed mailbox messages that explicitly commit to buy the described report at the stated price. Never double-count one person across sources | UNKNOWN | NOT STARTED |
| Manual-preflight purchases or serious inquiries | 2 | Settled, non-refunded live $39 Designer Pattern Preflight payments plus mailbox messages that explicitly ask to purchase or confirm scope, price, or availability. General feedback does not qualify | UNKNOWN | NOT STARTED |

Supporting funnel events may be reviewed as context: `free_check_started`, `free_check_completed`, `unsupported_result_shown`, `version_comparison_started`, `correction_recorded`, `json_backup_downloaded`, `csv_downloaded`, `paid_report_interest_submitted`, `checkout_started`, `purchase_completed`, and `manual_preflight_clicked`. They do not replace the evidence definitions above. Started-minus-completed event counts may be reported as aggregate funnel abandonment; do not add a user-level journey table.

`paid_report_interest_submitted` is emitted only after a visitor explicitly presses the “Count my $9 report interest” control and consent/privacy gates allow the privacy-minimized analytics event. It does not contain an email address, pattern content, identity fields, or stitch values. Opening the separate email link is not a confirmed submission and does not emit this event.

## Mandatory exclusions

Exclude all of the following from every threshold and revenue statement:

- owner, developer, household, QA, accessibility, automation, synthetic, and protected delivery tests;
- localhost, Preview, branch, and non-production hostnames;
- Stripe test-mode objects and payments, test clocks, synthetic cards, and any live owner verification transaction;
- failed, declined, incomplete, duplicated, fully refunded, or disputed payments from paid-report counts;
- mailbox messages sent by the owner to test routing, automated provider notices, spam, vendor solicitations, outreach sent by FiberTools, and replies that do not express purchase intent;
- analytics events generated during known test windows or with a non-production hostname;
- activity for the Fiber Project Planning Pack or unrelated FiberTools offers.

If an owner production visit cannot be excluded from aggregate GA4 without inspecting user-level data, record that limitation. Do not inspect or export user-level analytics to force an exclusion.

## Privacy-safe evidence worksheet

Complete one aggregate row per review. Keep private provider screenshots or query exports outside Git.

| As of (UTC) | Window day | GA4 source verified | Stripe account/mode verified | Mailbox reviewed | Starts | Reports | Comparisons | Purchase attempts | Paid/firm commitments | Manual paid/serious inquiries | Refunds/disputes | Exclusions applied | Evidence gap or decision note |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Not started | 0 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Owner and sandbox exclusions required | Begin only after verified production deployment |

## Review cadence and decision

- Review weekly and once at the end of day 30. Use the same counting definitions throughout the window.
- Report Stripe payments separately from mailbox commitments and analytics intent. Revenue is recognized only from verified settled live payments, net of verified refunds; do not infer it from GA4 or email.
- Do not build accounts, subscriptions, knitting, garment support, public badges, or a marketplace before the threshold evidence is reviewed.
- At day 30, the owner decides whether to stop, revise, or separately authorize payment infrastructure. This document does not authorize checkout, Stripe object creation, deployment, or a broader publication-freeze exception.
