import type { NextConfig } from "next";

const securityHeaders = [
  // Previne XSS attacks
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Previne clickjacking
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Previne MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controla informações do referrer
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Controla permissões do navegador
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Note: 'unsafe-inline' is needed for Next.js, but 'unsafe-eval' has been removed for security
      "script-src 'self' 'unsafe-inline' https://app.posthog.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://app.posthog.com https://api.github.com https://va.vercel-scripts.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  // Strict Transport Security (HSTS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Standalone output for Hostinger Node.js deployment
  output: "standalone",

  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Don't apply CSP to Next.js static files
        source: "/_next/:path*",
        headers: securityHeaders.filter(
          (header) => header.key !== "Content-Security-Policy"
        ),
      },
      {
        // Don't apply CSP to static assets
        source: "/static/:path*",
        headers: securityHeaders.filter(
          (header) => header.key !== "Content-Security-Policy"
        ),
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode for React
  reactStrictMode: true,
};

export default nextConfig;
