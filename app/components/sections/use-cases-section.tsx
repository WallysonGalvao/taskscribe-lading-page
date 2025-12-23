"use client";

import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Mic,
  Scale,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FeatureCard } from "../cards";
import { SectionHeader } from "../common";

const USE_CASES = [
  { icon: Users, key: "meetings" },
  { icon: Mic, key: "podcasts" },
  { icon: GraduationCap, key: "education" },
  { icon: Briefcase, key: "interviews" },
  { icon: Scale, key: "legal" },
  { icon: HeartPulse, key: "healthcare" },
];

export function UseCasesSection() {
  const { t } = useTranslation();

  return (
    <section id="use-cases" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("useCases.title")}
          subtitle={t("useCases.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {USE_CASES.map((useCase) => (
            <FeatureCard
              key={useCase.key}
              icon={useCase.icon}
              title={t(`useCases.cases.${useCase.key}.title`)}
              description={t(`useCases.cases.${useCase.key}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
