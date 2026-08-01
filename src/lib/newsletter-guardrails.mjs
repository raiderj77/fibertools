const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function createAttemptLimiter({
  limit = 5,
  windowMs = 10 * 60 * 1000,
  maxEntries = 5000,
} = {}) {
  const attempts = new Map();

  return function allowAttempt(key, now = Date.now()) {
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) {
      if (!current && attempts.size >= maxEntries) {
        for (const [storedKey, attempt] of attempts) {
          if (attempt.resetAt <= now) attempts.delete(storedKey);
        }
        while (attempts.size >= maxEntries) {
          const oldestKey = attempts.keys().next().value;
          if (oldestKey === undefined) break;
          attempts.delete(oldestKey);
        }
      }
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (current.count >= limit) return false;
    current.count += 1;
    return true;
  };
}
