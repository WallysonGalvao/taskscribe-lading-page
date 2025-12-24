import { type Locale, t, tArray } from "@/i18n/server";

interface JsonLdProps {
  locale?: Locale;
}

export function JsonLd({ locale = "pt" }: JsonLdProps) {
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://taskscribe.com.br";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t(locale, "seo.schema.organization.name"),
    url: BASE_URL,
    logo: `${BASE_URL}/logo-icon.svg`,
    sameAs: ["https://github.com/WallysonGalvao/taskScribe"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: t(locale, "seo.schema.organization.contactType"),
      availableLanguage: ["Portuguese", "English"],
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TaskScribe",
    applicationCategory: "BusinessApplication",
    operatingSystem: ["Windows 10+", "macOS 11+", "Linux"],
    description: t(locale, "seo.schema.software.description"),
    url: BASE_URL,
    downloadUrl: `${BASE_URL}/#download`,
    softwareVersion: "1.0.0",
    offers: [
      {
        "@type": "Offer",
        name: t(locale, "seo.schema.software.offers.free.name"),
        price: "0",
        priceCurrency: locale === "pt" ? "BRL" : "USD",
        description: t(locale, "seo.schema.software.offers.free.description"),
      },
      {
        "@type": "Offer",
        name: t(locale, "seo.schema.software.offers.pro.name"),
        price: locale === "pt" ? "47" : "19",
        priceCurrency: locale === "pt" ? "BRL" : "USD",
        priceValidUntil: "2025-12-31",
        description: t(locale, "seo.schema.software.offers.pro.description"),
      },
    ],
    featureList: tArray(locale, "seo.schema.software.features"),
    screenshot: `${BASE_URL}/opengraph-image`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "50",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // FAQ Schema - using translations from faq section
  const faqQuestions = [
    "internet",
    "requirements",
    "pricing",
    "storage",
    "formats",
    "languages",
    "gpu",
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqQuestions.map((key) => ({
      "@type": "Question",
      name: t(locale, `faq.questions.${key}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(locale, `faq.questions.${key}.a`),
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TaskScribe",
    url: BASE_URL,
    inLanguage: locale === "pt" ? "pt-BR" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
