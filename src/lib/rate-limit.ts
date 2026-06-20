// Lightweight in-memory rate limiter (sliding fixed-window per key).
// Note: state lives in the server process, so it protects a single instance.
// For multi-instance/serverless deployments, back this with Redis/Upstash.

type Bucket = { count: number; reset: number }

const buckets = new Map<string, Bucket>()

/**
 * Returns true if the action is allowed, false if the limit is exceeded.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    // Opportunistic cleanup so the map can't grow unbounded.
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) {
        if (now > v.reset) buckets.delete(k)
      }
    }
    return true
  }

  if (bucket.count >= limit) return false

  bucket.count++
  return true
}

/** Best-effort client IP from common proxy headers; falls back to a constant. */
export function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'local'
}
