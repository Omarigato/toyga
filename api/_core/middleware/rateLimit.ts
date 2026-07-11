import { RateLimitError } from '../errors';

/**
 * In-memory rate limiter using a Map.
 *
 * Note: In serverless (Vercel), each cold start resets the map.
 * This provides "best effort" protection — sufficient for OTP abuse prevention
 * and brute-force mitigation. For stricter rate limiting, use a Redis-backed
 * solution (e.g., Upstash).
 *
 * The map auto-prunes expired entries every 60 seconds to prevent memory leaks.
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Auto-prune expired entries every 60 seconds
let pruneInterval: ReturnType<typeof setInterval> | null = null;

function ensurePruneInterval() {
  if (pruneInterval) return;
  pruneInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
    // If store is empty, stop the interval to allow GC
    if (store.size === 0 && pruneInterval) {
      clearInterval(pruneInterval);
      pruneInterval = null;
    }
  }, 60_000);

  // Don't block process exit
  if (pruneInterval && typeof pruneInterval === 'object' && 'unref' in pruneInterval) {
    pruneInterval.unref();
  }
}

/**
 * Check rate limit for a given key (usually IP address).
 * Throws RateLimitError if limit is exceeded.
 *
 * @param key - Unique identifier (IP, userId, phone)
 * @param windowMs - Time window in milliseconds
 * @param max - Maximum requests within the window
 *
 * @example
 * checkRateLimit(clientIp, 60_000, 5); // 5 requests per minute
 */
export function checkRateLimit(
  key: string,
  windowMs: number,
  max: number
): void {
  ensurePruneInterval();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // First request in window or window expired
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  entry.count++;

  if (entry.count > max) {
    throw new RateLimitError();
  }
}

/**
 * Reset rate limit store (for testing).
 */
export function resetRateLimitStore(): void {
  store.clear();
}
