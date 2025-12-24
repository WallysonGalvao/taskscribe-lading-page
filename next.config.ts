import type { NextConfig } from "next";

// Bundle analyzer for performance optimization
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

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
  // Security headers for all routes
  async headers() {
    return [
      {
        // HTML pages - allow back/forward cache with revalidation
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Don't apply CSP to Next.js static files but allow caching
        source: "/_next/:path*",
        headers: securityHeaders.filter(
          (header) => header.key !== "Content-Security-Policy"
        ),
      },
      {
        // Ensure JavaScript files are served with correct MIME type
        source: "/_next/static/:path*.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Ensure MJS files are served with correct MIME type
        source: "/_next/static/:path*.mjs",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
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

  // Compress output for better performance
  compress: true,

  // Generate etags for caching
  generateEtags: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withBundleAnalyzer(nextConfig);
