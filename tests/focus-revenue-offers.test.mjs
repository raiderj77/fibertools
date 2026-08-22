import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeCheckoutUrl } from "../src/lib/offer-links.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("planning-pack checkout links fail closed unless they use HTTPS", () => {
  assert.equal(normalizeCheckoutUrl(undefined), null);
  assert.equal(normalizeCheckoutUrl(""), null);
  assert.equal(normalizeCheckoutUrl("not a url"), null);
  assert.equal(normalizeCheckoutUrl("http://checkout.example/pack"), null);
  assert.equal(normalizeCheckoutUrl("https://user:secret@checkout.example/pack"), null);
  assert.equal(normalizeCheckoutUrl("javascript:alert(1)"), null);
  assert.equal(
    normalizeCheckoutUrl(" https://checkout.example/pack "),
    "https://checkout.example/pack"
  );
});

test("planning-pack page presents the $17 product without exposing its tracked PDF", async () => {
  const page = await read("../src/app/fiber-project-planning-pack/page.tsx");
  const actions = await read("../src/app/fiber-project-planning-pack/PlanningPackActions.tsx");

  assert.match(page, /\$17 one-time purchase/);
  assert.match(page, /12-page/);
  for (const item of [
    "Project brief",
    "Swatch record",
    "Yarn-lot log",
    "Gauge worksheet",
    "Project-cost sheet",
    "Finishing checklist",
    "Troubleshooting notes",
  ]) {
    assert.match(page, new RegExp(item));
  }
  assert.doesNotMatch(page, /output\/pdf|fibertools-project-planning-pack\.pdf/i);
  assert.match(page, /NEXT_PUBLIC_PLANNING_PACK_CHECKOUT_URL/);
  assert.match(page, /PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED === "true"/);
  assert.match(page, /checkoutUrl[\s\S]*offers/);
  assert.match(actions, /planning_pack_page_view/);
  assert.match(actions, /planning_pack_purchase_click/);
  assert.match(actions, /planning_pack_interest_click/);
  assert.match(actions, /trackFixedEvent/);
  assert.doesNotMatch(actions, /email|name|query|amount|value/);
});

test("preflight defaults to inquiry and the API gates checkout before reading customer data", async () => {
  const availability = await read("../src/lib/designer-preflight-availability.ts");
  const route = await read("../src/app/api/designer-preflight/submissions/route.ts");
  const page = await read("../src/app/designer-pattern-preflight/page.tsx");
  const form = await read("../src/app/designer-pattern-preflight/DesignerPreflightForm.tsx");
  const cta = await read("../src/app/designer-pattern-preflight/DesignerPreflightCta.tsx");
  const service = await read("../src/lib/designer-preflight-service.mjs");
  const successAnalytics = await read("../src/app/designer-pattern-preflight/success/PaymentSuccessAnalytics.tsx");

  assert.match(availability, /import "server-only"/);
  assert.match(availability, /=== "checkout"/);
  assert.match(availability, /CHECKOUT_REQUIREMENTS\.every/);
  assert.match(availability, /keyMatchesMode/);
  assert.match(availability, /startsWith\("whsec_"\)/);
  assert.match(availability, /mode: "inquiry"/);
  assert.ok(route.indexOf("canAcceptDesignerPreflightCheckout()") < route.indexOf("request.json()"));
  assert.match(service, /PREFLIGHT_AMOUNT_CENTS = 3900/);
  assert.match(page, /one pattern, one version, up to 10 pages/i);
  assert.match(page, /one written report/i);
  assert.match(page, /ownership transfer/i);
  assert.match(page, /Clinical, legal, copyright, or business advice/);
  assert.match(form, /\$39 pilot scope/);
  assert.match(cta, /designer_preflight_inquiry_click/);
  assert.doesNotMatch([page, form, cta].join("\n"), /\$9\b/);
  assert.doesNotMatch(successAnalytics, /localStorage|repeat_purchase|paid_count/);
});

test("planning-pack promotion appears only after relevant full-calculator results", async () => {
  const cta = await read("../src/components/PlanningPackResultCta.tsx");
  const blanket = await read("../src/app/blanket-calculator/BlanketCalculatorTool.tsx");
  const yarn = await read("../src/app/yarn-calculator/YarnCalculatorTool.tsx");
  const gauge = await read("../src/app/gauge-calculator/GaugeCalculatorTool.tsx");
  const cost = await read("../src/app/project-cost-calculator/ProjectCostCalculatorTool.tsx");

  assert.match(cta, /href="\/fiber-project-planning-pack"/);
  assert.match(cta, /See the \$17 planning pack/);
  assert.match(blanket, /!embedded && result\.hasSwatchUsage \? <PlanningPackResultCta/);
  assert.match(yarn, /!embedded \? <PlanningPackResultCta/);
  assert.match(gauge, /!embedded && \([\s\S]*?tab === "swatch" && swatchResult[\s\S]*?<PlanningPackResultCta/);
  assert.match(cost, /result\.totalCost > 0 \? <PlanningPackResultCta/);
});

test("preflight operations and report template carry the bounded fulfillment scope", async () => {
  const operations = await read("../docs/designer-pattern-preflight-operations.md");
  const report = await read("../docs/designer-pattern-preflight-report-template.md");

  assert.match(operations, /\$39 one-time price/);
  assert.match(operations, /exactly one submitted version of one crochet pattern with no more than 10 pages/);
  assert.match(operations, /owner\/provider configuration action/);
  assert.match(report, /one submitted version of one crochet pattern up to 10 pages/);
  assert.match(report, /one written report/);
  assert.match(report, /No AI analysis, AI training, or AI-generated pattern content/);
});
