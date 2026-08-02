import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import test from "node:test";

const workerSource = fs.readFileSync("public/sw.js", "utf8");

function createWorker(mode) {
  const listeners = new Map();
  const stores = new Map();
  const fetchCalls = [];
  let fetchImplementation = async () => new Response("online", { status: 200 });

  function getStore(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name);
  }

  const caches = {
    async open(name) {
      const store = getStore(name);
      return {
        async addAll(urls) {
          for (const url of urls) store.set(url, new Response(`cached ${url}`));
        },
        async put(key, response) {
          store.set(typeof key === "string" ? key : key.url, response);
        },
        async match(key) {
          return store.get(typeof key === "string" ? key : key.url);
        },
        async delete(key) {
          return store.delete(typeof key === "string" ? key : key.url);
        },
      };
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
    async match(request) {
      const key = typeof request === "string" ? request : request.url;
      for (const store of stores.values()) {
        if (store.has(key)) return store.get(key);
      }
      return undefined;
    },
  };

  const self = {
    location: new URL(`https://fibertools.app/sw.js?mode=${mode}&v=2`),
    clients: { async claim() {} },
    async skipWaiting() {},
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
  };

  const context = {
    URL,
    Response,
    caches,
    self,
    fetch: async (request, options) => {
      fetchCalls.push({ request, options });
      return fetchImplementation(request, options);
    },
  };
  vm.runInNewContext(workerSource, context, { filename: "public/sw.js" });

  async function dispatchInstall() {
    let pending;
    listeners.get("install")({
      waitUntil(value) {
        pending = value;
      },
    });
    await pending;
  }

  async function dispatchFetch(pathname = "/calculator") {
    const request = {
      method: "GET",
      mode: "navigate",
      destination: "document",
      url: `https://fibertools.app${pathname}`,
    };
    let responsePromise;
    listeners.get("fetch")({
      request,
      respondWith(value) {
        responsePromise = value;
      },
    });
    return responsePromise;
  }

  return {
    dispatchFetch,
    dispatchInstall,
    fetchCalls,
    getStore,
    setFetchImplementation(value) {
      fetchImplementation = value;
    },
  };
}

test("static worker retains normal offline navigation caching", async () => {
  const worker = createWorker("static");
  await worker.dispatchInstall();

  const response = await worker.dispatchFetch("/calculator");
  assert.equal(await response.text(), "online");
  assert.ok(worker.getStore("fibertools-v2-static").has("/"));
  assert.ok(worker.getStore("fibertools-v2-static").has("/calculator"));
});

test("static worker deletes and never stores a nonce-bearing response", async () => {
  const worker = createWorker("static");
  await worker.dispatchInstall();
  worker.getStore("fibertools-v2-static").set(
    "/calculator",
    new Response("stale"),
  );
  worker.setFetchImplementation(async () =>
    new Response("nonce page", {
      headers: { "x-fibertools-nonce-csp": "report-only" },
    }),
  );

  const response = await worker.dispatchFetch("/calculator");
  assert.equal(await response.text(), "nonce page");
  assert.equal(worker.getStore("fibertools-v2-static").has("/calculator"), false);
});

test(
  "nonce worker is network-only and falls back only to static offline shell",
  async () => {
    const worker = createWorker("nonce");
    await worker.dispatchInstall();
    assert.equal(worker.getStore("fibertools-v2-nonce").has("/"), false);

    const online = await worker.dispatchFetch("/calculator");
    assert.equal(await online.text(), "online");
    assert.equal(worker.fetchCalls.at(-1).options.cache, "no-store");
    assert.equal(
      worker.getStore("fibertools-v2-nonce").has("/calculator"),
      false,
    );

    worker.setFetchImplementation(async () => {
      throw new Error("offline");
    });
    const offline = await worker.dispatchFetch("/calculator");
    assert.equal(await offline.text(), "cached /offline.html");
  },
);
