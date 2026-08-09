import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const signupLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:signup",
  analytics: false,
});

// Fly sets Fly-Client-IP to the real client address. Fall back to the first
// X-Forwarded-For hop. "unknown" groups un-attributable requests into one bucket.
export function getClientIp(request: Request): string {
  const flyIp = request.headers.get("Fly-Client-IP");
  if (flyIp) return flyIp;

  const first = request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
  return first || "unknown";
}

export async function checkSignupRateLimit(request: Request): Promise<{ allowed: boolean }> {
  const { success } = await signupLimiter.limit(getClientIp(request));
  return { allowed: success };
}
