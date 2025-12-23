"use client";

import { useTranslation } from "react-i18next";

import type { PricingFeature } from "../cards";
import { PricingCard } from "../cards";
import { SectionHeader } from "../common";

export function PricingSection() {
  const { t } = useTranslation();

  const freeFeatures: PricingFeature[] = [
    { text: t("pricing.free.features.transcriptions") },
    { text: t("pricing.free.features.duration") },
    { text: t("pricing.free.features.local") },
    { text: t("pricing.free.features.speakers") },
    { text: t("pricing.free.features.models") },
    { text: t("pricing.free.features.export") },
  ];

  const proFeatures: PricingFeature[] = [
    { text: t("pricing.pro.features.everything"), isBold: true },
    { text: t("pricing.pro.features.unlimited") },
  ];

  return (
    <section id="pricing" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("pricing.title")}
          subtitle={t("pricing.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <PricingCard
            name={t("pricing.free.name")}
            price={t("pricing.free.price")}
            period={t("pricing.free.period")}
            description={t("pricing.free.description")}
            features={freeFeatures}
          />

          <PricingCard
            name={t("pricing.pro.name")}
            price={t("pricing.pro.price")}
            period={t("pricing.pro.period")}
            description={t("pricing.pro.description")}
            yearlyNote={t("pricing.pro.yearlyNote")}
            features={proFeatures}
            badge={t("pricing.pro.badge")}
            isHighlighted
          />
        </div>
      </div>
    </section>
  );
}
