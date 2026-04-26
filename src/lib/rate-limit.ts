/**
 * Simple in-memory rate limiter.
 * For production with multiple instances, replace with Redis-based solution.
 */

interface RateLimitOptions {
  interval: number;   // Window in ms
  maxRequests: number; // Max requests per window
}

interface Entry {
  count: number;
  resetAt: number;
}

export function rateLimit({ interval, maxRequests }: RateLimitOptions) {
  const store = new Map<string, Entry>();

  // Cleanup stale entries every 60s
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 60_000).unref?.();

  return {
    /** Returns true if the request is allowed, false if rate-limited */
    check(key: string): boolean {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + interval });
        return true;
      }

      if (entry.count >= maxRequests) {
        return false;
      }

      entry.count++;
      return true;
    },
  };
}
