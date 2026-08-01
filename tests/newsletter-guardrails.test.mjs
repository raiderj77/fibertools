import assert from "node:assert/strict";
import test from "node:test";

import {
  createAttemptLimiter,
  normalizeNewsletterEmail,
} from "../src/lib/newsletter-guardrails.mjs";

test("normalizes valid newsletter addresses and rejects invalid input", () => {
  assert.equal(normalizeNewsletterEmail("  Person@Example.COM "), "person@example.com");
  assert.equal(normalizeNewsletterEmail("not-an-email"), null);
  assert.equal(normalizeNewsletterEmail("a".repeat(250) + "@example.com"), null);
});

test("limits repeated attempts within a bounded window", () => {
  const allowAttempt = createAttemptLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(allowAttempt("key", 0), true);
  assert.equal(allowAttempt("key", 1), true);
  assert.equal(allowAttempt("key", 2), false);
  assert.equal(allowAttempt("key", 1000), true);
});

test("bounds limiter memory when callers rotate keys", () => {
  const allowAttempt = createAttemptLimiter({ limit: 1, windowMs: 10_000, maxEntries: 2 });
  assert.equal(allowAttempt("first", 0), true);
  assert.equal(allowAttempt("second", 1), true);
  assert.equal(allowAttempt("third", 2), true);
  assert.equal(allowAttempt("first", 3), true);
});
