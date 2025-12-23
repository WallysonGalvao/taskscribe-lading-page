"use client";

import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SecurityFeature } from "../cards";

const SECURITY_FEATURES = ["offline", "openSource", "gdpr", "noCloud"];

export function SecuritySection() {
  const { t } = useTranslation();

  return (
    <section id="security" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6 text-center text-balance">
            {t("security.title")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-8 sm:mb-12 text-pretty leading-relaxed px-2">
            {t("security.subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {SECURITY_FEATURES.map((feature) => (
              <SecurityFeature
                key={feature}
                title={t(`security.features.${feature}.title`)}
                description={t(`security.features.${feature}.description`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
