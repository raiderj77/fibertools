const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const packageJson = JSON.parse(read("package.json"));
const lockfile = read("package-lock.json");
const nextConfig = read("next.config.mjs");
const serviceWorker = read("public/sw.js");

assert(packageJson.dependencies.next === "15.5.20", "Next.js must stay pinned to the reviewed security patch");
assert(packageJson.dependencies.react === "19.2.7", "React must stay pinned to the reviewed security patch");
assert(packageJson.dependencies["react-dom"] === "19.2.7", "React DOM must match React");
assert(packageJson.engines.node === ">=18.18.0", "Node engine must satisfy Next.js 15 requirements");
assert(!packageJson.dependencies["next-pwa"], "The abandoned next-pwa package must not be restored");
assert(!lockfile.includes('"node_modules/next-pwa"'), "next-pwa must not remain in the lockfile");
assert(!lockfile.includes('"node_modules/workbox-build"'), "The vulnerable Workbox build chain must not remain");
assert(!nextConfig.includes("withPWA"), "Next config must not load next-pwa");

assert(serviceWorker.includes('request.method !== "GET"'), "Service worker must ignore non-GET requests");
assert(serviceWorker.includes('url.origin !== self.location.origin'), "Service worker must ignore cross-origin requests");
assert(serviceWorker.includes('url.pathname.startsWith("/api/")'), "Service worker must never intercept API requests");
assert(!serviceWorker.includes("importScripts"), "Service worker must not load third-party runtime code");

console.log("Security dependency and service-worker checks passed.");
