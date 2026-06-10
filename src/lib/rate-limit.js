const buckets = new Map();

export function checkRateLimit(key, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? [];
  const fresh = bucket.filter((timestamp) => timestamp > now - windowMs);
  if (fresh.length >= limit) {
    return { ok: false, retryAfter: Math.ceil((fresh[0] + windowMs - now) / 1000) };
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return { ok: true };
}
