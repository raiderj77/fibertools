# FiberTools Google CMP and AdSense release checklist

Status: CMP-preview code and a default-off, report-only nonce-CSP compatibility
spike are prepared; account approval and enforced-CSP release work are not
complete; advertising remains disabled.

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

- [x] Confirm `fibertools.app` is in the expected AdSense publisher account and
      record its current site status. Read-only verification on 2026-08-01 found
      **Needs attention > Low value content**; the site detail said it was not
      ready to show ads and showed a Jul 23, 2026 update timestamp.
- [x] Check Policy Center and record current issues. Read-only verification on
      2026-08-01 showed **No current issues**. This does not supersede the
      separate site-approval rejection above, so do not resubmit unchanged
      content.
- [x] Confirm `public/ads.txt`, the site metadata, and the AdSense account all use
      publisher `pub-7171402107622932`. The public file returned HTTP 200 to a
      `Mediapartners-Google` user agent and contained the expected direct record.
      AdSense still displayed **Not found**, so treat the account indicator as
      lagging crawler state rather than changing a publicly accessible file.
- [ ] Confirm Auto ads is off for FiberTools during verification.
      On 2026-08-01 FiberTools had no row under **Ads > By site** because it was
      not approved; no FiberTools-specific Auto ads control was available there.
- [ ] For strict prior consent, turn off Limited ads under ad-serving controls so
      a rejection cannot use local storage for limited-ad serving.

## 2. Configure Google Privacy & messaging

### European regulations

Read-only evidence on 2026-08-01 showed nine active European-regulations
messages in the account and a FiberTools message marked **Published** (last
modified Feb 17, 2026; English plus 31 languages). The exact first-layer
choices, site selection, policy URL, and vendor disclosures were not verified,
so the release items below remain open.

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

Read-only evidence on 2026-08-01 showed **Create**, with no active FiberTools
US-state message. The settings view listed 326 active ad partners; that inventory
must be reviewed against the public disclosures before publication.

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

### Default-off nonce compatibility spike

`FIBERTOOLS_NONCE_CSP_MODE=report-only` is a server-only engineering flag. It
generates a fresh per-request nonce, forwards the nonce policy to Next.js, emits
the same policy to browsers as `Content-Security-Policy-Report-Only`, marks page
responses private/no-store, and prevents the service worker from caching
rendered HTML. It does **not** enable the CMP, ads, or an enforced launch policy.
The flag changes route rendering at build time and is bundled into the server
output. Changing only the start-time environment has no effect; rebuild to
change modes.

The normal unset/`off` build retains the existing enforced CSP, static
prerendering, CDN-cache behavior, and offline navigation cache. Verify both modes:

```powershell
npm run test:strict-csp
npm run build
npm run check:csp-build-mode

$env:FIBERTOOLS_NONCE_CSP_MODE = "report-only"
npm run build
npm run check:csp-build-mode
npm run start -- -p 3415
# In another terminal:
npm run check:strict-csp-runtime -- http://127.0.0.1:3415
```

- [ ] Record preview CSP reports and verify client navigation, analytics grant
      and rejection, the certified message, and PDF decoding in a browser.
- [ ] Benchmark static versus dynamic TTFB and hosting compute before accepting
      the architecture change. The
      [Next.js 15 CSP guide](https://nextjs.org/docs/15/app/guides/content-security-policy)
      documents that per-request nonces require dynamic rendering and disable
      ordinary static optimization, ISR, PPR, and CDN page caching. Google's
      [AdSense CSP guidance](https://support.google.com/adsense/answer/16283098?hl=en)
      documents the supported strict nonce policy used by this spike.
- [ ] Only after those results and an owner decision, design the separately
      reviewed enforced mode. Report-only success is not an activation gate.

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
