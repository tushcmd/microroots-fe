// Small in-memory sliding-window rate limiter.
//
// Good enough for a single Node.js server. For multi-instance deployments,
// swap the Map for a shared store (Redis, Upstash, etc.).

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  /** Milliseconds until the window resets (0 when ok). */
  retryAfterMs: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 }
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: existing.resetAt - now }
  }

  existing.count += 1
  return { ok: true, remaining: limit - existing.count, retryAfterMs: 0 }
}

/** Best-effort client identifier for rate limiting. */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local"
  return `${scope}:${ip}`
}

// Occasionally drop stale buckets so the map doesn't grow without bound.
export function sweepExpired(now = Date.now()): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

// Exposed for tests / manual cleanup.
export function _resetRateLimit(): void {
  buckets.clear()
}