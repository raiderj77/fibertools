import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getCrawlerRuleViolations } from "../scripts/crawler-rules.mjs";

const policy = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");

test("current intentional crawler policy passes", () => {
  assert.deepEqual(getCrawlerRuleViolations(policy), []);
});

test("blocked crawler name alone is not a blocking rule", () => {
  const changed = policy.replace(/(User-agent: Bytespider\s+)Disallow: \//, "$1Allow: /");
  assert.ok(getCrawlerRuleViolations(changed).some(message => message.includes("Bytespider")));
});

test("comment mentions cannot substitute for actual user-agent groups", () => {
  const changed = policy.replace("User-agent: Meta-ExternalAgent", "# Meta-ExternalAgent");
  assert.ok(getCrawlerRuleViolations(changed).some(message => message.includes("Meta-ExternalAgent")));
});

test("Bing delay must belong to Bing, not a later crawler", () => {
  const changed = policy.replace("Crawl-delay: 10", "").replace("User-agent: Amazonbot", "User-agent: Amazonbot\nCrawl-delay: 10");
  assert.ok(getCrawlerRuleViolations(changed).some(message => message.includes("Bingbot")));
});

test("allowed crawler must have its own allow rule and cannot also block root", () => {
  for (const replacement of ["Disallow: /", "Allow: /\nDisallow: /"]) {
    const changed = policy.replace(/(User-agent: GPTBot\s+)Allow: \//, `$1${replacement}`);
    assert.ok(getCrawlerRuleViolations(changed).some(message => message.includes("GPTBot")));
  }
});

test("sitemap must be the canonical directive, not an arbitrary mention", () => {
  for (const value of ["# sitemap.xml", "Sitemap: https://example.invalid/sitemap.xml"]) {
    assert.ok(getCrawlerRuleViolations(policy.replace("Sitemap: https://fibertools.app/sitemap.xml", value)).some(message => message.includes("Sitemap")));
  }
});

test("directive case, inline comments, CRLF and grouped user agents are accepted", () => {
  const grouped = policy.replace("User-agent: Googlebot\nAllow: /", "User-agent: Googlebot\nUser-agent: SyntheticBot\nAllow: /");
  assert.deepEqual(getCrawlerRuleViolations(grouped.replaceAll("User-agent:", "USER-AGENT:").replaceAll("Allow: /", "Allow: / # allowed").replaceAll("\n", "\r\n")), []);
});
