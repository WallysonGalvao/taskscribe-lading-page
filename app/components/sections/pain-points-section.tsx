"use client";

import { Cloud, CreditCard, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FeatureCard } from "../cards";
import { SectionHeader } from "../common";

const PAIN_POINTS = [
  { icon: Cloud, key: "cloud" },
  { icon: DollarSign, key: "cost" },
  { icon: CreditCard, key: "creditCard" },
];

export function PainPointsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("painPoints.title")}
          titleHighlight={t("painPoints.titleHighlight")}
          titleSuffix={t("painPoints.titleSuffix")}
          subtitle={t("painPoints.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {PAIN_POINTS.map((point) => (
            <FeatureCard
              key={point.key}
              icon={point.icon}
              title={t(`painPoints.${point.key}.title`)}
              description={t(`painPoints.${point.key}.description`)}
              variant="destructive"
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12 px-2">
          <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
            {t("painPoints.solution.title")}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("painPoints.solution.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
