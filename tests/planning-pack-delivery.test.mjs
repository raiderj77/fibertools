import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
  handlePlanningPackCheckoutRequest,
  handlePlanningPackDownloadRequest,
} from "../src/lib/planning-pack-delivery.mjs";

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), "utf8");
const NOW = new Date("2026-08-27T12:00:00.000Z");
const SESSION_ID = "cs_test_unitfixture123";
const PAYMENT_LINK_URL = "https://buy.stripe.com/test_unitfixture123";
const AFTER_COMPLETION_URL =
  "https://fibertools.app/api/planning-pack/download?session_id={CHECKOUT_SESSION_ID}";
const ARTIFACT_BYTES = Uint8Array.from(
  { length: 134356 },
  (_, index) => index % 251
);
const ARTIFACT_SHA256 = createHash("sha256").update(ARTIFACT_BYTES).digest("hex");

async function sourceManifest() {
  return JSON.parse(await read("../config/planning-pack-release-manifest.json"));
}

async function fulfillmentManifest() {
  const manifest = await sourceManifest();
  manifest.privateArtifact.sha256 = ARTIFACT_SHA256;
  manifest.privateArtifact.expectedSha256 = ARTIFACT_SHA256;
  manifest.privateArtifact.uploadStatus = "UPLOADED";
  manifest.privateUploadStatus = "UPLOADED";
  return manifest;
}

async function approvedManifest() {
  const manifest = await fulfillmentManifest();
  manifest.releaseStatus = "ENABLED";
  manifest.checkoutActivationStatus = "ENABLED";
  manifest.privateDeliveryStatus = "CONFIRMED";
  manifest.ownerVerificationStatus = "VERIFIED";
  manifest.ownerApproval = {
    status: "APPROVED",
    editionId: manifest.edition.id,
    artifactSha256: ARTIFACT_SHA256,
    recordedAt: "2026-08-25T20:00:00.000Z",
  };
  return manifest;
}

function readyEnvironment(manifest, overrides = {}) {
  return {
    PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED: "true",
    PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED: "true",
    PLANNING_PACK_OWNER_APPROVAL_CONFIRMED: "true",
    PLANNING_PACK_EDITION_ID: manifest.edition.id,
    PLANNING_PACK_PRIVATE_FILE_SHA256: manifest.privateArtifact.sha256,
    STRIPE_MODE: "test",
    STRIPE_SECRET_KEY: "sk_test_unitfixture",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
    PLANNING_PACK_STRIPE_PAYMENT_LINK_ID: "plink_unitfixture",
    PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: PAYMENT_LINK_URL,
    PLANNING_PACK_STRIPE_PRICE_ID: "price_unitfixture",
    NEXT_PUBLIC_SITE_URL: "https://fibertools.app",
    SUPABASE_URL: "https://unitfixture.supabase.co",
    SUPABASE_SECRET_KEY: "sb_secret_unitfixture",
    PLANNING_PACK_STORAGE_BUCKET: "planning-pack-private",
    PLANNING_PACK_STORAGE_OBJECT_PATH:
      "releases/FT-PP-V2-2026-08-25/fiber-project-planning-pack.pdf",
    ...overrides,
  };
}

function fulfillmentEnvironment(manifest, overrides = {}) {
  const env = readyEnvironment(manifest);
  delete env.PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED;
  delete env.PLANNING_PACK_OWNER_APPROVAL_CONFIRMED;
  return { ...env, ...overrides };
}

function offerMetadata(overrides = {}) {
  return {
    service: "fiber_project_planning_pack",
    edition_id: "FT-PP-V2-2026-08-25",
    artifact_sha256: ARTIFACT_SHA256,
    ...overrides,
  };
}

function price(overrides = {}) {
  return {
    id: "price_unitfixture",
    object: "price",
    currency: "usd",
    unit_amount: 1700,
    type: "one_time",
    recurring: null,
    ...overrides,
  };
}

function paymentLink(overrides = {}) {
  return {
    id: "plink_unitfixture",
    object: "payment_link",
    active: true,
    livemode: false,
    url: PAYMENT_LINK_URL,
    currency: "usd",
    payment_method_types: ["card"],
    allow_promotion_codes: false,
    after_completion: {
      type: "redirect",
      redirect: { url: AFTER_COMPLETION_URL },
    },
    metadata: offerMetadata(),
    payment_intent_data: { metadata: offerMetadata() },
    optional_items: null,
    shipping_options: [],
    line_items: {
      object: "list",
      has_more: false,
      data: [{ quantity: 1, adjustable_quantity: null, price: price() }],
    },
    ...overrides,
  };
}

function paidSession(overrides = {}) {
  return {
    id: SESSION_ID,
    object: "checkout.session",
    status: "complete",
    payment_status: "paid",
    mode: "payment",
    livemode: false,
    payment_link: { id: "plink_unitfixture" },
    payment_method_types: ["card"],
    metadata: offerMetadata(),
    currency: "usd",
    amount_subtotal: 1700,
    amount_total: 1700,
    total_details: {
      amount_discount: 0,
      amount_shipping: 0,
      amount_tax: 0,
    },
    line_items: {
      object: "list",
      has_more: false,
      data: [
        {
          quantity: 1,
          currency: "usd",
          amount_subtotal: 1700,
          amount_discount: 0,
          amount_tax: 0,
          amount_total: 1700,
          price: price(),
        },
      ],
    },
    ...overrides,
  };
}

function request(sessionId = SESSION_ID) {
  return new Request(
    `https://fibertools.app/api/planning-pack/download?session_id=${encodeURIComponent(sessionId)}`
  );
}

function mockedDependencies({
  account = { id: CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID },
  link = paymentLink(),
  session = paidSession(),
  bytes = ARTIFACT_BYTES,
  accountError,
  linkError,
  sessionError,
  storageError,
} = {}) {
  const calls = [];
  const implementation = {
    async retrieveStripeAccount(configuration) {
      calls.push("account");
      if (accountError) throw accountError;
      assert.equal(
        configuration.stripeAccountId,
        CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID
      );
      return account;
    },
    async retrievePaymentLink(configuration) {
      calls.push("payment-link");
      if (linkError) throw linkError;
      assert.equal(configuration.paymentLinkId, "plink_unitfixture");
      return link;
    },
    async retrieveCheckoutSession(sessionId) {
      calls.push("session");
      if (sessionError) throw sessionError;
      assert.equal(sessionId, SESSION_ID);
      return session;
    },
    async downloadPrivateObject(configuration) {
      calls.push("private-object");
      if (storageError) throw storageError;
      assert.equal(configuration.storageBucket, "planning-pack-private");
      assert.equal(
        configuration.storageObjectPath,
        "releases/FT-PP-V2-2026-08-25/fiber-project-planning-pack.pdf"
      );
      return bytes;
    },
  };
  return { calls, implementation };
}

async function invokeDownload({ manifest, env, dependencies, sessionId = SESSION_ID }) {
  return handlePlanningPackDownloadRequest({
    request: request(sessionId),
    manifest,
    env,
    now: NOW,
    dependencies,
  });
}

async function invokeCheckout({ manifest, env, dependencies }) {
  return handlePlanningPackCheckoutRequest({
    manifest,
    env,
    now: NOW,
    dependencies,
  });
}

test("the committed activation still fails closed before provider calls when confirmations are absent", async () => {
  const manifest = await sourceManifest();

  const checkoutMocks = mockedDependencies();
  const checkoutResponse = await invokeCheckout({
    manifest,
    env: readyEnvironment(manifest, {
      PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED: "false",
    }),
    dependencies: checkoutMocks.implementation,
  });
  assert.equal(checkoutResponse.status, 404);
  assert.deepEqual(checkoutMocks.calls, []);
  assert.equal(checkoutResponse.headers.get("cache-control"), "no-store, max-age=0");

  const deliveryMocks = mockedDependencies();
  const downloadResponse = await invokeDownload({
    manifest,
    env: readyEnvironment(manifest, {
      PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED: "false",
    }),
    dependencies: deliveryMocks.implementation,
  });
  assert.equal(downloadResponse.status, 404);
  assert.deepEqual(deliveryMocks.calls, []);
  assert.equal(downloadResponse.headers.get("cache-control"), "no-store, max-age=0");
});

test("disabled public checkout makes no provider calls while an exact paid purchase fulfills", async () => {
  const manifest = await fulfillmentManifest();
  const env = fulfillmentEnvironment(manifest);

  const checkoutMocks = mockedDependencies();
  const checkoutResponse = await invokeCheckout({
    manifest,
    env,
    dependencies: checkoutMocks.implementation,
  });
  assert.equal(checkoutResponse.status, 404);
  assert.equal(checkoutResponse.headers.get("location"), null);
  assert.deepEqual(checkoutMocks.calls, []);

  const deliveryMocks = mockedDependencies();
  const downloadResponse = await invokeDownload({
    manifest,
    env,
    dependencies: deliveryMocks.implementation,
  });
  assert.equal(downloadResponse.status, 200);
  assert.deepEqual(deliveryMocks.calls, ["account", "session", "private-object"]);
  assert.deepEqual(new Uint8Array(await downloadResponse.arrayBuffer()), ARTIFACT_BYTES);
});

test("post-sale deactivation does not revoke an exact paid purchase", async () => {
  const manifest = await approvedManifest();
  manifest.releaseStatus = "DISABLED";
  manifest.checkoutActivationStatus = "DISABLED";
  manifest.privateDeliveryStatus = "PENDING";
  manifest.ownerVerificationStatus = "PENDING";
  manifest.ownerApproval = {
    status: "PENDING",
    editionId: manifest.edition.id,
    artifactSha256: "PENDING",
    recordedAt: null,
  };
  const env = fulfillmentEnvironment(manifest);

  const checkoutMocks = mockedDependencies();
  const checkoutResponse = await invokeCheckout({
    manifest,
    env,
    dependencies: checkoutMocks.implementation,
  });
  assert.equal(checkoutResponse.status, 404);
  assert.deepEqual(checkoutMocks.calls, []);

  const deliveryMocks = mockedDependencies();
  const downloadResponse = await invokeDownload({
    manifest,
    env,
    dependencies: deliveryMocks.implementation,
  });
  assert.equal(downloadResponse.status, 200);
  assert.deepEqual(deliveryMocks.calls, ["account", "session", "private-object"]);
});

test("fulfillment still requires exact manifest, artifact, and private-upload bindings", async (t) => {
  const cases = [
    ["edition", ({ manifest }) => { manifest.edition.id = "FT-PP-V2-wrong"; }],
    ["artifact checksum", ({ manifest }) => { manifest.privateArtifact.expectedSha256 = "0".repeat(64); }],
    ["artifact upload", ({ manifest }) => { manifest.privateArtifact.uploadStatus = "NOT_UPLOADED"; }],
    ["manifest upload", ({ manifest }) => { manifest.privateUploadStatus = "NOT_UPLOADED"; }],
    ["environment edition", ({ env }) => { env.PLANNING_PACK_EDITION_ID = "FT-PP-V2-wrong"; }],
    ["environment checksum", ({ env }) => { env.PLANNING_PACK_PRIVATE_FILE_SHA256 = "0".repeat(64); }],
    ["environment upload", ({ env }) => { env.PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED = "false"; }],
  ];

  for (const [name, mutate] of cases) {
    await t.test(name, async () => {
      const manifest = await fulfillmentManifest();
      const env = fulfillmentEnvironment(manifest);
      mutate({ manifest, env });
      const mocks = mockedDependencies();
      const response = await invokeDownload({
        manifest,
        env,
        dependencies: mocks.implementation,
      });
      assert.equal(response.status, 404);
      assert.deepEqual(mocks.calls, []);
    });
  }
});

test("checkout redirects only after verifying the FiberTools account and exact Payment Link", async () => {
  const manifest = await approvedManifest();
  const mocks = mockedDependencies();
  const response = await invokeCheckout({
    manifest,
    env: readyEnvironment(manifest),
    dependencies: mocks.implementation,
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), PAYMENT_LINK_URL);
  assert.deepEqual(mocks.calls, ["account", "payment-link"]);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
});

test("every required Payment Link property fails closed", async (t) => {
  const manifest = await approvedManifest();
  const cases = [
    ["identity", { id: "plink_otherfixture" }],
    ["active state", { active: false }],
    ["mode", { livemode: true }],
    ["public URL", { url: "https://buy.stripe.com/otherfixture" }],
    ["currency", { currency: "cad" }],
    ["delayed payment method", { payment_method_types: ["us_bank_account"] }],
    ["promotion codes", { allow_promotion_codes: true }],
    ["return type", { after_completion: { type: "hosted_confirmation" } }],
    [
      "return URL",
      {
        after_completion: {
          type: "redirect",
          redirect: { url: "https://fibertools.app/thank-you" },
        },
      },
    ],
    ["release metadata", { metadata: offerMetadata({ edition_id: "wrong" }) }],
    [
      "payment metadata",
      { payment_intent_data: { metadata: offerMetadata({ artifact_sha256: "wrong" }) } },
    ],
    ["optional items", { optional_items: [{ price: "price_other", quantity: 1 }] }],
    ["shipping", { shipping_options: [{ shipping_amount: 100 }] }],
    ["complete item list", { line_items: { ...paymentLink().line_items, has_more: true } }],
    [
      "quantity",
      {
        line_items: {
          ...paymentLink().line_items,
          data: [{ ...paymentLink().line_items.data[0], quantity: 2 }],
        },
      },
    ],
    [
      "adjustable quantity",
      {
        line_items: {
          ...paymentLink().line_items,
          data: [
            {
              ...paymentLink().line_items.data[0],
              adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
            },
          ],
        },
      },
    ],
    [
      "price",
      {
        line_items: {
          ...paymentLink().line_items,
          data: [
            {
              ...paymentLink().line_items.data[0],
              price: price({ id: "price_otherfixture" }),
            },
          ],
        },
      },
    ],
  ];

  for (const [name, override] of cases) {
    await t.test(name, async () => {
      const mocks = mockedDependencies({ link: paymentLink(override) });
      const response = await invokeCheckout({
        manifest,
        env: readyEnvironment(manifest),
        dependencies: mocks.implementation,
      });
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("location"), null);
      assert.deepEqual(mocks.calls, ["account", "payment-link"]);
    });
  }
});

test("a verified purchase returns the checksum-matched private PDF directly", async () => {
  const manifest = await approvedManifest();
  const mocks = mockedDependencies();
  const response = await invokeDownload({
    manifest,
    env: readyEnvironment(manifest),
    dependencies: mocks.implementation,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(mocks.calls, ["account", "session", "private-object"]);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("content-length"), String(ARTIFACT_BYTES.byteLength));
  assert.equal(
    response.headers.get("content-disposition"),
    'attachment; filename="FiberTools-Fiber-Project-Planning-Pack.pdf"'
  );
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), ARTIFACT_BYTES);
});

test("verified applicable tax does not prevent delivery", async () => {
  const manifest = await approvedManifest();
  const taxedLineItem = {
    ...paidSession().line_items.data[0],
    amount_tax: 145,
    amount_total: 1845,
  };
  const mocks = mockedDependencies({
    session: paidSession({
      amount_total: 1845,
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 145,
      },
      line_items: { ...paidSession().line_items, data: [taxedLineItem] },
    }),
  });
  const response = await invokeDownload({
    manifest,
    env: readyEnvironment(manifest),
    dependencies: mocks.implementation,
  });

  assert.equal(response.status, 200);
});

test("Stripe account identity is verified before Payment Link or Checkout Session access", async () => {
  const manifest = await approvedManifest();
  for (const invoke of [invokeCheckout, invokeDownload]) {
    const mocks = mockedDependencies({ account: { id: "acct_wrongfixture" } });
    const response = await invoke({
      manifest,
      env: readyEnvironment(manifest),
      dependencies: mocks.implementation,
    });
    assert.equal(response.status, 403);
    assert.deepEqual(mocks.calls, ["account"]);
  }
});

test("malformed and wrong-mode Checkout Session IDs never reach Stripe", async () => {
  const manifest = await fulfillmentManifest();
  for (const sessionId of ["", "cs_live_unitfixture123", "pi_unitfixture", "cs_test_bad/value"]) {
    const mocks = mockedDependencies();
    const response = await invokeDownload({
      manifest,
      env: fulfillmentEnvironment(manifest),
      dependencies: mocks.implementation,
      sessionId,
    });
    assert.equal(response.status, 400);
    assert.deepEqual(mocks.calls, []);
  }
});

test("every required purchase property fails closed before private storage", async (t) => {
  const manifest = await fulfillmentManifest();
  const cases = [
    ["session identity", { id: "cs_test_otherfixture" }],
    ["completion", { status: "open" }],
    ["payment", { payment_status: "unpaid" }],
    ["one-time mode", { mode: "subscription" }],
    ["livemode", { livemode: true }],
    ["payment link", { payment_link: "plink_otherfixture" }],
    ["delayed payment method", { payment_method_types: ["us_bank_account"] }],
    ["release metadata", { metadata: offerMetadata({ edition_id: "wrong" }) }],
    ["session currency", { currency: "cad" }],
    ["session subtotal", { amount_subtotal: 1600 }],
    ["session total below base", { amount_total: 1600 }],
    [
      "discount",
      { total_details: { amount_discount: 100, amount_shipping: 0, amount_tax: 0 } },
    ],
    [
      "shipping",
      { total_details: { amount_discount: 0, amount_shipping: 100, amount_tax: 0 } },
    ],
    ["complete line-item list", { line_items: { ...paidSession().line_items, has_more: true } }],
    [
      "single line item",
      {
        line_items: {
          ...paidSession().line_items,
          data: [...paidSession().line_items.data, paidSession().line_items.data[0]],
        },
      },
    ],
    [
      "quantity",
      {
        line_items: {
          ...paidSession().line_items,
          data: [{ ...paidSession().line_items.data[0], quantity: 2 }],
        },
      },
    ],
    [
      "price",
      {
        line_items: {
          ...paidSession().line_items,
          data: [
            {
              ...paidSession().line_items.data[0],
              price: price({ id: "price_otherfixture" }),
            },
          ],
        },
      },
    ],
  ];

  for (const [name, override] of cases) {
    await t.test(name, async () => {
      const mocks = mockedDependencies({ session: paidSession(override) });
      const response = await invokeDownload({
        manifest,
        env: fulfillmentEnvironment(manifest),
        dependencies: mocks.implementation,
      });
      assert.equal(response.status, 403);
      assert.deepEqual(mocks.calls, ["account", "session"]);
    });
  }
});

test("wrong-size or wrong-checksum private bytes never reach the customer", async () => {
  const manifest = await fulfillmentManifest();
  for (const bytes of [ARTIFACT_BYTES.subarray(0, 100), new Uint8Array(ARTIFACT_BYTES.byteLength)]) {
    const mocks = mockedDependencies({ bytes });
    const response = await invokeDownload({
      manifest,
      env: fulfillmentEnvironment(manifest),
      dependencies: mocks.implementation,
    });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "Download unavailable.");
  }
});

test("fake or incomplete provider configuration fails before provider access", async () => {
  const manifest = await fulfillmentManifest();
  for (const override of [
    { FIBERTOOLS_STRIPE_ACCOUNT_ID: "acct_replace_me_server_only" },
    { PLANNING_PACK_STRIPE_PAYMENT_LINK_ID: "plink_replace_me_server_only" },
    { PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: "https://evil.com/pack" },
    { PLANNING_PACK_STRIPE_PRICE_ID: "price_replace_me_server_only" },
    { STRIPE_SECRET_KEY: "sk_live_unitfixture" },
    { NEXT_PUBLIC_SITE_URL: "https://preview.example.com" },
    { SUPABASE_URL: "https://example-project.supabase.co" },
    { SUPABASE_SECRET_KEY: "sb_secret_replace_me_server_only" },
    { PLANNING_PACK_STORAGE_BUCKET: "replace_me_private_bucket" },
    { PLANNING_PACK_STORAGE_OBJECT_PATH: "../private/product.pdf" },
  ]) {
    const mocks = mockedDependencies();
    const response = await invokeDownload({
      manifest,
      env: fulfillmentEnvironment(manifest, override),
      dependencies: mocks.implementation,
    });
    assert.equal(response.status, 404);
    assert.deepEqual(mocks.calls, []);
  }
});

test("provider failures return generic responses without reflected private data", async () => {
  const manifest = await approvedManifest();
  const sensitiveFixture = `${SESSION_ID} owner@example.invalid secret-unitfixture`;
  const mocks = mockedDependencies({ sessionError: new Error(sensitiveFixture) });
  const response = await invokeDownload({
    manifest,
    env: readyEnvironment(manifest),
    dependencies: mocks.implementation,
  });
  const body = await response.text();

  assert.equal(response.status, 503);
  assert.equal(body, "Download unavailable.");
  assert.doesNotMatch(body, /cs_test_|@|secret/i);
  assert.equal(response.headers.get("location"), null);
});

test("public product, privacy, and terms copy describe first-party private delivery", async () => {
  const [productPage, privacy, terms] = await Promise.all([
    read("../src/app/fiber-project-planning-pack/page.tsx"),
    read("../src/app/privacy/page.tsx"),
    read("../src/app/terms/page.tsx"),
  ]);

  assert.match(productPage, /FiberTools verifies the paid Checkout Session/);
  assert.match(productPage, /not stored in this page or a public bucket/);
  assert.match(privacy, /Last updated: August 27, 2026/);
  assert.match(privacy, /uses it only to provide the private PDF download/);
  assert.match(privacy, /does not put[\s\S]*Checkout Session ID[\s\S]*into analytics events/);
  assert.match(
    privacy,
    /Planning Pack[\s\S]*object is read server-side only after payment verification/
  );
  assert.match(terms, /Last updated: August 27, 2026/);
  assert.match(terms, /Stripe processes[\s\S]*checkout/);
  assert.match(terms, /FiberTools verifies the paid Checkout Session/);
  assert.match(terms, /refund must be confirmed through Stripe/);
  assert.doesNotMatch(privacy, /checkout provider may separately process purchase and delivery information/);
  assert.match(privacy, /Optional product and service information/);
});

test("routes are server-only and private storage is downloaded only after bucket verification", async () => {
  const [checkoutRoute, downloadRoute, service, serverAdapter, nextConfig] = await Promise.all([
    read("../src/app/api/planning-pack/checkout/route.ts"),
    read("../src/app/api/planning-pack/download/route.ts"),
    read("../src/lib/planning-pack-delivery.mjs"),
    read("../src/lib/planning-pack-delivery-server.ts"),
    read("../next.config.mjs"),
  ]);

  for (const route of [checkoutRoute, downloadRoute]) {
    assert.match(route, /import "server-only"/);
    assert.match(route, /runtime = "nodejs"/);
    assert.match(route, /dynamic = "force-dynamic"/);
  }
  assert.match(serverAdapter, /accounts\.retrieve\(null\)/);
  assert.match(serverAdapter, /paymentLinks\.retrieve/);
  assert.match(serverAdapter, /line_items\.data\.price/);
  assert.match(serverAdapter, /getBucket/);
  assert.match(serverAdapter, /bucket\.public !== false/);
  assert.match(serverAdapter, /\.download\(configuration\.storageObjectPath\)/);
  assert.doesNotMatch(serverAdapter, /createSignedUrl|getPublicUrl/);
  assert.match(service, /createHash\("sha256"\)/);
  assert.match(nextConfig, /source: '\/api\/planning-pack\/:path\*'/);
  assert.match(nextConfig, /value: 'no-referrer'/);
  assert.doesNotMatch(
    `${checkoutRoute}\n${downloadRoute}\n${service}\n${serverAdapter}`,
    /console\./
  );
  assert.doesNotMatch(
    `${checkoutRoute}\n${downloadRoute}\n${service}\n${serverAdapter}`,
    /customer|email/i
  );
});
