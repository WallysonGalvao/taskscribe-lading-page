"use client";

import { useState } from "react";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "../common";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { t, i18n } = useTranslation();
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");

  // Determine currency based on language
  const isPtBr = i18n.language === "pt" || i18n.language === "pt-BR";
  const currencySymbol = isPtBr ? "R$" : "$";
  const proMonthlyPrice = isPtBr ? "47" : "19";
  const proYearlyPrice = isPtBr ? "470" : "190";

  const freeFeatures = [
    "transcriptions",
    "duration",
    "local",
    "speakers",
    "models",
    "export",
  ];

  const proFeatures = [
    "everything",
    "unlimited",
    "customTasks",
    "advancedNlp",
    "grammarCheck",
    "premiumExtensions",
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-secondary/30 via-background to-secondary/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("pricing.title")}
          subtitle={t("pricing.subtitle")}
        />

        {/* Toggle mensal/anual com Switch */}
        <div className="flex items-center justify-center gap-4 mb-12 mt-8">
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-muted/50 border border-border/30 backdrop-blur-sm">
            <span
              className={cn(
                "transition-colors duration-200 text-sm sm:text-base",
                billingInterval === "month"
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("pricing.billing.monthly")}
            </span>
            <Switch
              checked={billingInterval === "year"}
              onCheckedChange={(checked) => setBillingInterval(checked ? "year" : "month")}
              className="data-[state=checked]:bg-accent"
            />
            <span
              className={cn(
                "transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base",
                billingInterval === "year"
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("pricing.billing.annual")}
              <Badge className="bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {t("pricing.billing.saveBadge")}
              </Badge>
            </span>
          </div>
        </div>

        {/* Cards de planos */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Plano Free */}
          <div
            className={cn(
              "group relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8 flex flex-col",
              "hover:bg-card hover:border-border/50 hover:shadow-xl",
              "transition-all duration-300 ease-out"
            )}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-muted/20 to-transparent" />

            <div className="relative flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted/80 flex items-center justify-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">{t("pricing.free.name")}</h3>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                {t("pricing.free.description")}
              </p>

              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  {currencySymbol} 0
                </span>
                <span className="text-muted-foreground ml-1">
                  /{t("pricing.billing.month")}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 mr-3 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t(`pricing.free.features.${feature}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Plano Pro */}
          <div
            className={cn(
              "group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col",
              "border-2 border-accent/50 shadow-lg shadow-accent/10",
              "hover:bg-card hover:border-accent/70 hover:shadow-xl hover:shadow-accent/20",
              "transition-all duration-300 ease-out hover:-translate-y-1"
            )}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-accent/10 via-transparent to-accent/5" />

            {/* Badge */}
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-accent to-accent/80 text-accent-foreground border-0 shadow-lg px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1" />
              {t("pricing.pro.badge")}
            </Badge>

            <div className="relative flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">{t("pricing.pro.name")}</h3>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                {t("pricing.pro.description")}
              </p>

              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-accent">
                  {currencySymbol} {billingInterval === "month" ? proMonthlyPrice : proYearlyPrice}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{billingInterval === "month" ? t("pricing.billing.month") : t("pricing.billing.year")}
                </span>
                {billingInterval === "year" && (
                  <div className="flex items-center gap-1 text-sm text-green-500 mt-2">
                    <Sparkles className="w-3 h-3" />
                    {t("pricing.pro.yearlyDiscount")}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {proFeatures.map((feature, index) => (
                  <li key={feature} className="flex items-start">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 mr-3 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </span>
                    <span className={cn(
                      "text-sm",
                      index === 0 ? "font-bold text-foreground" : "font-medium text-foreground"
                    )}>
                      {t(`pricing.pro.features.${feature}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          {t("pricing.footer")}
        </p>
      </div>
    </section>
  );
}
