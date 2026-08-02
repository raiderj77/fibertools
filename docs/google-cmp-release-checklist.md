# FiberTools Google CMP and AdSense release checklist

Status: CMP-preview code prepared; account work and a supported AdSense CSP are
not complete; advertising remains disabled.

This checklist is a hard release gate. Do not enable ad inventory or Auto ads
until every required item is recorded with current evidence. The Google CMP
bootstrap and code-created ad inventory have separate build switches:

- `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` loads the Google publisher bootstrap
  that can display a published Privacy & messaging message.
- `NEXT_PUBLIC_ADSENSE_ENABLED=true` permits code-created ad units. The build
  rejects this setting unless the CMP switch is also enabled.
- Account-side Auto ads can operate independently of code-created units. Keep
  Auto ads off during CMP verification.

## 1. Verify the account before changing it

- [ ] Confirm `fibertools.app` is in the expected AdSense publisher account and
      record its current site status.
- [ ] Check Policy Center and record current issues. Historical workspace
      evidence said `Needs attention - Low value content`; treat that as stale
      until the live account confirms it, and do not resubmit unchanged content.
- [ ] Confirm `public/ads.txt`, the site metadata, and the AdSense account all use
      publisher `pub-7171402107622932`.
- [ ] Confirm Auto ads is off for FiberTools during verification.
- [ ] For strict prior consent, turn off Limited ads under ad-serving controls so
      a rejection cannot use local storage for limited-ad serving.

## 2. Configure Google Privacy & messaging

### European regulations

- [ ] In AdSense, open **Privacy & messaging > European regulations**.
- [ ] Select the exact `fibertools.app` site and set
      `https://fibertools.app/privacy` as the privacy policy URL.
- [ ] Use Google Privacy & messaging (Google-certified CMP ID 300) with IAB TCF
      v2.3. Do not substitute the FiberTools analytics banner for advertising
      consent.
- [ ] Configure the first layer with **Consent**, **Do not consent**, and
      **Manage options**. Keep the non-consent choice visible on the first layer.
- [ ] Select the supported languages and verify Google Advertising Products and
      all recipients/purposes are disclosed.
- [ ] Review legitimate-interest and consent-mode mappings. A missing or unknown
      value must fail closed.
- [ ] Confirm the published message itself explains IP-address use for ads
      measurement and personalization and displays the Google Business Data
      Responsibility link prominently.
- [ ] Retain evidence of the exact message text, choices, vendor list, version,
      publication date, and the timestamped affirmative-consent record format.
- [ ] Publish the message only after the content and site selection are reviewed.

### US state regulations

- [ ] Create Google&apos;s **US state regulations** message for `fibertools.app` and
      verify the current state coverage instead of relying on a hard-coded list.
- [ ] Keep Google&apos;s default **Do Not Sell or Share My Personal Information** link,
      or separately implement and test the documented custom-link override.
- [ ] Verify GPP signaling, restricted data processing, the initial opt-out state,
      a non-GPC opt-out, and Global Privacy Control for each supported message
      class, including the national and Florida variants.
- [ ] Publish the US-state message only after the site, wording, links, targeting,
      and opt-out flow are reviewed.

## 3. CMP-only technical verification

- [ ] Set `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` and keep
      `NEXT_PUBLIC_ADSENSE_ENABLED=false`.
- [ ] Keep Auto ads off. A Vercel preview can validate the bundle and CSP, but a
      hostname-bound Google message may require a short, owner-approved CMP-only
      production verification on `fibertools.app`.
- [ ] On a clean browser profile, open
      `/?fc=alwaysshow&fctype=gdpr` and confirm the published message appears.
- [ ] Confirm Accept, Do not consent, Manage options, and the footer Privacy and
      cookie settings/revocation flow all work.
- [ ] Confirm a new consent string is TCF v2.3 and exists before any ad request.
- [ ] Inspect the published CMP&apos;s cookies, local storage, TC string, and retention;
      update the public Cookie Policy with exact names and durations before ads.
- [ ] Test `?fc=alwaysshow&fctype=usnat`, `fctype=usfl`, and the supported US-state
      opt-out variants. Confirm Google&apos;s default Do Not Sell or Share link works.
- [ ] With `Sec-GPC: 1`, confirm the Google bootstrap, ad requests, ad frames, and
      optional analytics remain absent even after a prior grant.
- [ ] Direct-load `/privacy`, `/cookies`, `/do-not-sell`, and `/terms`; confirm
      they contain no AdSense/CMP tag or other script that requires consent.
- [ ] Inspect the browser console and Network panel. The existing enforced CSP
      must produce zero blocking violations required by the CMP. Google no longer
      supports domain-allowlist CSP for AdSense; if violations occur, leave ads
      disabled and treat nonce-based CSP as a separate performance/security
      decision. Do not remove CSP as an ad-launch shortcut.

## 4. Advertising activation

- [ ] Reconfirm that the site is eligible to serve and that Policy Center has no
      unresolved blocker.
- [ ] Resolve the known CSP blocker before any ad activation. The current
      domain-allowlist policy is not a supported AdSense launch state. Implement
      and verify Google&apos;s documented per-request nonce CSP, then explicitly
      accept the resulting Next.js dynamic-rendering, CDN-cache, latency, and cost
      trade-off; otherwise keep ads disabled.
- [ ] Confirm either that third-party ad serving beyond Google is disabled or that
      every enabled vendor/network is named and linked in the Privacy Policy.
- [ ] Choose one inventory model: account-side Auto ads or reviewed manual ad
      units with real slot IDs. The repository currently has no manual placements.
- [ ] Validate layout shift, mobile usability, Core Web Vitals, and placement
      policy without clicking or artificially inflating ads.
- [ ] Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` only after the CMP-only checks pass.
- [ ] Remove the current build-time activation block only in the reviewed nonce-CSP
      implementation; changing an environment value alone must never bypass it.
- [ ] Verify production serving, rejection, withdrawal, GPC, legal-page exclusion,
      and CSP again. Never click live ads during verification.
- [ ] Recheck CMP/Policy Center status after Google's processing window; issue
      indicators can lag the deployment.

## Rollback

Set both public switches to `false` and redeploy. Then verify that no AdSense,
Google Privacy & messaging, TCF, or ad-request resources load. Account-side Auto
ads must also remain off; the code switch cannot override that account setting.
