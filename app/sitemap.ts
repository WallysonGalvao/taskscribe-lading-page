import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://taskscribe.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    // Main page
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "pt-BR": `${BASE_URL}?lang=pt`,
          "en-US": `${BASE_URL}?lang=en`,
        },
      },
    },
    // Section anchors for deep linking
    {
      url: `${BASE_URL}/#features`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/#pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/#how-it-works`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#security`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#use-cases`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // LLM-specific files for AI crawlers
    {
      url: `${BASE_URL}/llms.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/llms-full.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
