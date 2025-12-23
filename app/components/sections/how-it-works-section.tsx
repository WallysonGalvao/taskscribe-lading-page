"use client";

import { useTranslation } from "react-i18next";

import { StepCard } from "../cards";
import { SectionHeader } from "../common";

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    { number: 1, key: "step1" },
    { number: 2, key: "step2" },
    { number: 3, key: "step3" },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("howItWorks.title")}
          subtitle={t("howItWorks.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              stepNumber={step.number}
              title={t(`howItWorks.${step.key}.title`)}
              description={t(`howItWorks.${step.key}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
