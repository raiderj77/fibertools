import assert from "node:assert/strict";

const baseUrl = (process.argv[2] || "http://127.0.0.1:3415").replace(/\/$/, "");

function extractNonce(policy) {
  const match = /script-src[^;]*'nonce-([^']+)'/.exec(policy || "");
  assert.ok(match, "report-only CSP must contain a script nonce");
  return match[1];
}

async function getDocument(pathname = "/", headers = {}, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: { accept: "text/html", ...headers },
    redirect: "manual",
  });
  assert.equal(
    response.status,
    expectedStatus,
    `${pathname} must return HTTP ${expectedStatus}`,
  );
  const html = await response.text();
  const reportOnly = response.headers.get("content-security-policy-report-only");
  const enforced = response.headers.get("content-security-policy");
  const nonce = extractNonce(reportOnly);

  assert.equal(
    response.headers.get("x-fibertools-nonce-csp"),
    "report-only",
  );
  assert.match(response.headers.get("cache-control") || "", /private/);
  assert.match(response.headers.get("cache-control") || "", /no-store/);
  assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  assert.equal(response.headers.get("vercel-cdn-cache-control"), "no-store");
  assert.match(enforced || "", /script-src 'self'/);
  assert.doesNotMatch(enforced || "", /'unsafe-eval'/);
  assert.equal(response.headers.get("x-nonce"), null);

  const scriptTags = html.match(/<script\b[^>]*>/gi) || [];
  assert.ok(scriptTags.length > 0, `${pathname} must render scripts`);
  for (const tag of scriptTags) {
    const nonceAttribute = /\bnonce=["']([^"']+)["']/i.exec(tag);
    assert.equal(
      nonceAttribute?.[1],
      nonce,
      `every rendered script must use the response nonce: ${tag}`,
    );
  }

  return {
    html,
    nonce,
    reportOnly,
    setCookie: response.headers.get("set-cookie") || "",
  };
}

const first = await getDocument("/", {
  "x-nonce": "attacker-controlled",
  "content-security-policy": "script-src 'none'",
});
const second = await getDocument("/");
assert.notEqual(first.nonce, "attacker-controlled");
assert.doesNotMatch(first.reportOnly, /script-src 'none'/);
assert.notEqual(first.nonce, second.nonce, "each document request needs a new nonce");

for (const [prefetchHeader, expectedStatus] of [
  [{ purpose: "prefetch" }, 200],
  [{ "next-router-prefetch": "1" }, 500],
]) {
  const prefetched = await getDocument(
    "/",
    {
      ...prefetchHeader,
      "x-nonce": "attacker-controlled",
      "content-security-policy": "script-src 'none'",
    },
    expectedStatus,
  );
  assert.notEqual(prefetched.nonce, "attacker-controlled");
  assert.doesNotMatch(prefetched.reportOnly, /script-src 'none'/);
}

const gpc = await getDocument("/", { "sec-gpc": "1" });
assert.match(gpc.setCookie, /empire_gpc=1/);
const clearedGpc = await getDocument("/", { cookie: "empire_gpc=1" });
assert.match(clearedGpc.setCookie, /empire_gpc=;/);

const routerState = encodeURIComponent(
  JSON.stringify([
    "",
    { children: ["__PAGE__", {}, null, null] },
    null,
    null,
    true,
  ]),
);
const rscResponse = await fetch(`${baseUrl}/about`, {
  headers: {
    accept: "text/x-component",
    rsc: "1",
    "next-url": "/",
    "next-router-state-tree": routerState,
  },
});
assert.equal(rscResponse.status, 200);
assert.match(rscResponse.headers.get("content-type") || "", /text\/x-component/);
assert.equal(rscResponse.headers.get("x-fibertools-nonce-csp"), "report-only");
assert.match(rscResponse.headers.get("cache-control") || "", /no-store/);
const rscPayload = await rscResponse.text();
assert.doesNotMatch(
  rscPayload,
  /application\/ld\+json/,
  "RSC navigation must not inject scripts carrying a new document nonce",
);

for (const pathname of ["/privacy", "/cookies", "/do-not-sell", "/terms"]) {
  const { html } = await getDocument(pathname);
  const externalScripts = html.match(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>/gi) || [];
  assert.doesNotMatch(
    externalScripts.join("\n"),
    /googlesyndication|googletagmanager|google-analytics/i,
    `${pathname} must not render Google script resources`,
  );
}

console.log("Strict nonce CSP runtime checks passed.");
