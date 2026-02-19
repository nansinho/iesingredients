const rateLimitMap = new Map<
  string,
  { count: number; lastReset: number }
>();

/**
 * Simple in-memory rate limiter for API routes.
 * In production with multiple instances, use Redis instead.
 */
export function rateLimit({
  key,
  limit = 10,
  windowMs = 60_000,
}: {
  key: string;
  limit?: number;
  windowMs?: number;
}): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Periodically clean up old entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.lastReset > 300_000) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);
