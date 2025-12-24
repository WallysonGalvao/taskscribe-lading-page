"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, X, Shield, DollarSign, Zap, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Header, Footer, useReleaseAssets } from "../../components";
import { SectionHeader } from "../../components/common";
import { EnergyGrid } from "../../components/common";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Lazy load ContactFormDialog
const ContactFormDialog = dynamic(
  () =>
    import("../../components/forms/contact-form-dialog").then((mod) => ({
      default: mod.ContactFormDialog,
    })),
  { ssr: false }
);

interface ComparisonFeature {
  feature: string;
  taskscribe: boolean | string;
  competitor: boolean | string;
  highlight?: boolean;
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    feature: "comparison.otter.features.localProcessing",
    taskscribe: true,
    competitor: false,
    highlight: true,
  },
  {
    feature: "comparison.otter.features.privacy",
    taskscribe: "comparison.otter.values.fullPrivacy",
    competitor: "comparison.otter.values.cloudBased",
    highlight: true,
  },
  {
    feature: "comparison.otter.features.pricing",
    taskscribe: "comparison.otter.values.freeUnlimited",
    competitor: "comparison.otter.values.paidPlans",
    highlight: true,
  },
  {
    feature: "comparison.otter.features.creditCard",
    taskscribe: false,
    competitor: true,
  },
  {
    feature: "comparison.otter.features.offline",
    taskscribe: true,
    competitor: false,
    highlight: true,
  },
  {
    feature: "comparison.otter.features.speakerIdentification",
    taskscribe: true,
    competitor: true,
  },
  {
    feature: "comparison.otter.features.multipleFormats",
    taskscribe: true,
    competitor: true,
  },
  {
    feature: "comparison.otter.features.aiSummary",
    taskscribe: true,
    competitor: true,
  },
  {
    feature: "comparison.otter.features.gpuAcceleration",
    taskscribe: true,
    competitor: false,
  },
  {
    feature: "comparison.otter.features.dataOwnership",
    taskscribe: "comparison.otter.values.fullControl",
    competitor: "comparison.otter.values.thirdParty",
    highlight: true,
  },
];

const PAIN_POINTS = [
  { icon: Shield, key: "privacy" },
  { icon: DollarSign, key: "cost" },
  { icon: Lock, key: "offline" },
  { icon: Zap, key: "performance" },
];

export default function OtterAiComparisonPage() {
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const { releaseAssets } = useReleaseAssets();
  const { t } = useTranslation();

  const handleOpenContact = () => setContactFormOpen(true);
  const handleCloseContact = () => setContactFormOpen(false);

  const renderCellValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm text-muted-foreground">{t(value)}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header releaseAssets={releaseAssets} />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <EnergyGrid />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
            <div className="text-center max-w-4xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-4 sm:mb-6 bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm"
              >
                {t("comparison.otter.badge")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
                {t("comparison.otter.title")}{" "}
                <span className="text-accent">
                  {t("comparison.otter.titleHighlight")}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-pretty leading-relaxed px-2">
                {t("comparison.otter.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("comparison.otter.painPoints.title")}
              subtitle={t("comparison.otter.painPoints.subtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {PAIN_POINTS.map((point) => (
                <div
                  key={point.key}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all"
                >
                  <point.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`comparison.otter.painPoints.${point.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`comparison.otter.painPoints.${point.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("comparison.otter.table.title")}
              subtitle={t("comparison.otter.table.subtitle")}
            />
            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      {t("comparison.otter.table.feature")}
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-accent">
                          TaskScribe
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("comparison.otter.table.ourSolution")}
                        </span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-foreground">
                          Otter.ai
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("comparison.otter.table.competitor")}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((item, index) => (
                    <tr
                      key={index}
                      className={cn(
                        "border-b border-border transition-colors",
                        item.highlight && "bg-accent/5"
                      )}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {t(item.feature)}
                          </span>
                          {item.highlight && (
                            <Badge
                              variant="outline"
                              className="text-xs border-accent/50 text-accent"
                            >
                              {t("comparison.otter.table.advantage")}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderCellValue(item.taskscribe)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderCellValue(item.competitor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-accent/10 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("comparison.otter.cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("comparison.otter.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-background bg-accent rounded-lg hover:bg-accent/90 transition-colors"
              >
                {t("comparison.otter.cta.downloadButton")}
              </a>
              <button
                onClick={handleOpenContact}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-card border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                {t("comparison.otter.cta.contactButton")}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onContactClick={handleOpenContact} />

      <ContactFormDialog
        isOpen={contactFormOpen}
        onClose={handleCloseContact}
      />
    </div>
  );
}
