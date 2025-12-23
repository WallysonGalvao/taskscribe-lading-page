/**
 * Security utilities for the landing page
 */

/**
 * Sanitizes a string to prevent XSS attacks in HTML context
 * Escapes dangerous HTML characters
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Sanitizes an email address
 * Returns empty string if email is invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  // Remove any whitespace
  const trimmed = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    return "";
  }

  // Limit length (RFC 5321)
  if (trimmed.length > 254) {
    return "";
  }

  return trimmed;
}

/**
 * Validates honeypot field (should be empty if legitimate user)
 * Returns true if the submission appears to be from a bot
 */
export function isHoneypotTriggered(honeypotValue: string | undefined | null): boolean {
  // If honeypot field has any value, it's likely a bot
  return honeypotValue !== undefined && honeypotValue !== null && honeypotValue !== "";
}

/**
 * Validates timing-based honeypot
 * Legitimate users typically take at least 3 seconds to fill a form
 */
export function isSubmissionTooFast(submittedAt: number, formLoadedAt: number): boolean {
  const MIN_FORM_COMPLETION_TIME_MS = 3000; // 3 seconds
  const timeTaken = submittedAt - formLoadedAt;
  return timeTaken < MIN_FORM_COMPLETION_TIME_MS;
}

/**
 * Checks if input contains suspicious patterns
 * (SQL injection, script tags, etc.)
 */
export function containsSuspiciousPatterns(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers (onclick, onerror, etc.)
    /data:/gi, // Data URLs
    /vbscript:/gi, // VBScript protocol
    /expression\s*\(/gi, // CSS expressions
    /--/g, // SQL comment
    /;\s*DROP/gi, // SQL injection
    /UNION\s+SELECT/gi, // SQL injection
    /INSERT\s+INTO/gi, // SQL injection
    /DELETE\s+FROM/gi, // SQL injection
    /UPDATE\s+.*SET/gi, // SQL injection
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Rate limit check based on simple token bucket algorithm
 * Returns true if the request should be rate limited
 */
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function shouldRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now - record.timestamp > windowMs) {
    requestCounts.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

/**
 * Create a secure email template with sanitized inputs
 */
export function createSecureEmailHtml(name: string, email: string, message: string): string {
  const safeName = sanitizeHtml(name);
  const safeEmail = sanitizeHtml(email);
  const safeMessage = sanitizeHtml(message);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Novo Contato da Landing Page</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="white-space: pre-wrap;">${safeMessage}</p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Este email foi enviado automaticamente através do formulário de contato da landing page do TaskScribe.
      </p>
    </div>
  `;
}

/**
 * Create a secure plain text email with sanitized inputs
 */
export function createSecureEmailText(name: string, email: string, message: string): string {
  // For plain text, we just need to ensure no injection
  const safeName = name.replace(/[\r\n]/g, " ");
  const safeEmail = email.replace(/[\r\n]/g, " ");
  const safeMessage = message.replace(/[\r\n]{3,}/g, "\n\n"); // Limit consecutive newlines

  return `
Novo Contato da Landing Page

Nome: ${safeName}
Email: ${safeEmail}

Mensagem:
${safeMessage}

---
Este email foi enviado automaticamente através do formulário de contato da landing page do TaskScribe.
  `.trim();
}
