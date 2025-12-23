import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute for contact form

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Get client identifier (IP + User-Agent hash for better accuracy)
function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Simple hash for user agent
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return `${ip}-${hash}`;
}

// Check rate limit
function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up old entries occasionally
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetIn: RATE_LIMIT_WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetIn: record.resetTime - now,
  };
}

export function proxy(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = getClientIdentifier(request);
    const { allowed, remaining, resetIn } = checkRateLimit(identifier);

    // Add rate limit headers to response
    const response = allowed
      ? NextResponse.next()
      : NextResponse.json(
          {
            error: "Too many requests",
            message: "Por favor, aguarde antes de enviar outra mensagem.",
            retryAfter: Math.ceil(resetIn / 1000),
          },
          { status: 429 }
        );

    response.headers.set("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(resetIn / 1000).toString());

    if (!allowed) {
      response.headers.set("Retry-After", Math.ceil(resetIn / 1000).toString());
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to API routes only
    "/api/:path*",
  ],
};
