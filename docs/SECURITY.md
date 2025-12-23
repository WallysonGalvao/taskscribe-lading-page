# 🔒 Security Implementation - Landing Page

## Overview

This document describes the security measures implemented in the TaskScribe landing page.

---

## 1. Security Headers (`next.config.ts`)

All pages are served with the following security headers:

| Header                      | Value                                          | Purpose                       |
| --------------------------- | ---------------------------------------------- | ----------------------------- |
| `X-XSS-Protection`          | `1; mode=block`                                | Prevents XSS attacks          |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | Prevents clickjacking         |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME type sniffing   |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Controls referrer information |
| `Permissions-Policy`        | Restrictive policy                             | Limits browser features       |
| `Content-Security-Policy`   | Strict CSP                                     | Controls resource loading     |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS                |

### CSP Details

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.posthog.com https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://app.posthog.com https://api.github.com https://va.vercel-scripts.com;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
```

---

## 2. Rate Limiting (`proxy.ts`)

The API routes are protected by rate limiting:

| Configuration | Value                |
| ------------- | -------------------- |
| Window        | 60 seconds           |
| Max Requests  | 5 per window         |
| Identifier    | IP + User-Agent hash |

### Response Headers

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Seconds until reset
- `Retry-After`: Seconds to wait (when limited)

### Rate Limit Response

```json
{
  "error": "Too many requests",
  "message": "Por favor, aguarde antes de enviar outra mensagem.",
  "retryAfter": 45
}
```

---

## 3. Anti-Bot Protection

### 3.1 Honeypot Field

An invisible `website` field is added to the contact form:

- Hidden using CSS positioning (not `display: none`)
- Attractive field name for bots
- Legitimate users don't see or fill it
- If filled, submission is silently rejected

### 3.2 Timing Validation

- Form tracks when it was loaded (`formLoadedAt`)
- Submissions faster than 2 seconds are flagged as bots
- Bot submissions receive fake "success" response to confuse them

---

## 4. Input Validation & Sanitization (`lib/security.ts`)

### 4.1 HTML Sanitization

All user inputs are sanitized before being used in email templates:

```typescript
const htmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};
```

### 4.2 Email Validation

- RFC 5321 compliant validation
- Maximum 254 characters
- Whitespace trimming
- Lowercase normalization

### 4.3 Length Limits

| Field   | Max Length      |
| ------- | --------------- |
| Name    | 100 characters  |
| Email   | 254 characters  |
| Message | 5000 characters |

### 4.4 Suspicious Pattern Detection

The following patterns are blocked:

- `<script>` tags
- `javascript:` protocol
- Event handlers (`onclick`, `onerror`, etc.)
- `data:` URLs
- SQL injection patterns (`DROP`, `UNION SELECT`, etc.)

---

## 5. Secure Email Templates

Both HTML and plain text email templates use sanitized inputs:

```typescript
createSecureEmailHtml(name, email, message);
createSecureEmailText(name, email, message);
```

---

## 6. Security Best Practices

### Already Implemented

- ✅ Environment variables for sensitive data (`.env.local`)
- ✅ `.gitignore` protects sensitive files
- ✅ Zod validation on frontend
- ✅ HTTPS enforced via HSTS
- ✅ No `x-powered-by` header

### Additional Recommendations

For production environments, consider:

1. **Redis for Rate Limiting**: Replace in-memory Map with Redis for persistence across serverless invocations
2. **CAPTCHA**: Add reCAPTCHA or hCaptcha for high-traffic scenarios
3. **WAF**: Use Vercel's or Cloudflare's Web Application Firewall
4. **Monitoring**: Set up alerts for rate limit triggers and suspicious activity
5. **CSP Report-Only**: Test CSP changes in report-only mode first

---

## Files Modified

| File                                           | Changes                                    |
| ---------------------------------------------- | ------------------------------------------ |
| `next.config.ts`                               | Security headers, poweredByHeader disabled |
| `proxy.ts`                                     | Rate limiting proxy                        |
| `lib/security.ts`                              | Security utilities                         |
| `app/api/contact/route.ts`                     | Input validation, sanitization, anti-bot   |
| `app/components/forms/contact-form-dialog.tsx` | Honeypot, timing check                     |

---

## Testing

### Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
  echo ""
done
```

### Test Honeypot

```bash
# This should be silently rejected
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@bot.com","message":"Spam","website":"http://spam.com"}'
```

### Test XSS Protection

```bash
# This should be sanitized
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","message":"Test"}'
```

---

_Last updated: December 2024_
