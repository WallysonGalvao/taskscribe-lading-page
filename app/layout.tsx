import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";

import { JsonLd } from "./components/seo";

import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getTranslations, type Locale } from "@/i18n/server";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], display: "swap" });

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://taskscribe.com.br";

// Default locale for metadata
const defaultLocale: Locale = "pt";

export async function generateMetadata(): Promise<Metadata> {
  const t = getTranslations(defaultLocale);
  const tEn = getTranslations("en");

  return {
    // Base URL for resolving relative URLs
    metadataBase: new URL(BASE_URL),

    // Basic metadata - using translations
    title: {
      default: t.seo.metadata.title,
      template: t.seo.metadata.titleTemplate,
    },
    description: t.seo.metadata.description,
    applicationName: "TaskScribe",
    authors: [
      { name: "Wallyson Galvão", url: "https://github.com/WallysonGalvao" },
    ],
    creator: "Wallyson Galvão",
    publisher: "TaskScribe",

    // Keywords for search - combining both languages for better coverage
    keywords: [
      // Portuguese
      "transcrição de áudio",
      "transcrição de vídeo",
      "IA local",
      "privacidade",
      "identificação de falantes",
      "transcrição offline",
      "reuniões",
      "legendas",
      "LGPD",
      // English
      "audio transcription",
      "video transcription",
      "local AI",
      "privacy",
      "speaker identification",
      "speech to text",
      "offline transcription",
      "meeting transcription",
      "subtitles",
      "GDPR",
      // Common (both languages)
      "whisper",
      "faster-whisper",
      "SRT",
      "GPU acceleration",
      "CUDA",
    ],

    // Canonical URL
    alternates: {
      canonical: BASE_URL,
      languages: {
        "pt-BR": `${BASE_URL}?lang=pt`,
        "en-US": `${BASE_URL}?lang=en`,
      },
    },

    // Open Graph (Facebook, LinkedIn, etc.) - using translations
    openGraph: {
      type: "website",
      locale: "pt_BR",
      alternateLocale: ["en_US"],
      url: BASE_URL,
      siteName: "TaskScribe",
      title: t.seo.openGraph.title,
      description: t.seo.openGraph.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: t.seo.openGraph.imageAlt,
          type: "image/png",
        },
      ],
    },

    // Twitter Cards - using English translations for international audience
    twitter: {
      card: "summary_large_image",
      title: tEn.seo.twitter.title,
      description: tEn.seo.twitter.description,
      images: ["/twitter-image"],
      creator: "@WallysonGalvao",
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification (add your actual verification codes)
    verification: {
      google: "b0TqUAE_dQjCZUHkWcsT4UBWnPxBZBzb3Ot2sOR5J_M",
      // yandex: "your-yandex-verification-code",
      // yahoo: "your-yahoo-verification-code",
    },

    // App-specific
    category: "software",
    classification: "Business Software",

    // Other
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Schema.org JSON-LD - with locale support */}
        <JsonLd locale={defaultLocale} />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://api.github.com" />

        {/* LLMs.txt for AI crawlers (AEO - Answer Engine Optimization) */}
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLMs.txt"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title="LLMs Full Documentation"
        />

        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_API_KEY}',{api_host:'https://app.posthog.com'})
            `,
          }}
        />

        {/* Cache Buster - Detect stale cache and reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var currentBuildId = '${
                  process.env.NEXT_PUBLIC_BUILD_ID || Date.now()
                }';
                var storedBuildId = localStorage.getItem('taskscribe_build_id');
                
                // If build ID changed, clear storage and reload
                if (storedBuildId && storedBuildId !== currentBuildId) {
                  console.log('New build detected, clearing cache...');
                  localStorage.clear();
                  sessionStorage.clear();
                  localStorage.setItem('taskscribe_build_id', currentBuildId);
                  
                  // Force reload without cache
                  if (!window.location.search.includes('reloaded=1')) {
                    window.location.href = window.location.pathname + '?reloaded=1';
                  }
                } else {
                  localStorage.setItem('taskscribe_build_id', currentBuildId);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${sora.className} font-sans antialiased`}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
