import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { t } from "@/i18n/server";

export const runtime = "edge";

export const alt = "TaskScribe - AI Audio Transcription";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(request: NextRequest) {
  // Get locale from URL params or default to "pt"
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("lang");
  const locale = localeParam === "en" ? "en" : "pt";

  const tagline = t(locale, "seo.ogImage.tagline");
  const features = [
    t(locale, "seo.ogImage.features.privacy"),
    t(locale, "seo.ogImage.features.speakers"),
    t(locale, "seo.ogImage.features.gpu"),
  ];

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Soundwave decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: 0.1,
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: `${Math.sin(i * 0.3) * 80 + 100}px`,
              backgroundColor: "#F59E0B",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>

      {/* Logo/Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: "white",
          margin: "0 0 16px 0",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        Task
        <span style={{ color: "#F59E0B" }}>Scribe</span>
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: "28px",
          color: "rgba(255, 255, 255, 0.8)",
          margin: "0 0 32px 0",
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        {tagline}
      </p>

      {/* Features badges */}
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              padding: "8px 20px",
              color: "white",
              fontSize: "16px",
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #F59E0B 0%, #8B5CF6 50%, #06B6D4 100%)",
        }}
      />
    </div>,
    {
      ...size,
    }
  );
}
