"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  Users,
  Clock,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Header, Footer, useReleaseAssets } from "../../components";
import { SectionHeader } from "../../components/common";
import { EnergyGrid } from "../../components/common";

import { Badge } from "@/components/ui/badge";

// Lazy load ContactFormDialog
const ContactFormDialog = dynamic(
  () =>
    import("../../components/forms/contact-form-dialog").then((mod) => ({
      default: mod.ContactFormDialog,
    })),
  { ssr: false }
);

const BENEFITS = [
  { icon: Users, key: "speakerIdentification" },
  { icon: Clock, key: "timeEfficiency" },
  { icon: FileText, key: "actionableInsights" },
  { icon: Shield, key: "dataPrivacy" },
];

const FEATURES = [
  { icon: Sparkles, key: "aiTranscription" },
  { icon: Users, key: "multipleSpeakers" },
  { icon: CheckCircle2, key: "taskExtraction" },
  { icon: Zap, key: "realTimeProcessing" },
  { icon: FileText, key: "exportFormats" },
  { icon: Globe, key: "multiLanguage" },
];

const USE_CASES_EXAMPLES = [
  { key: "teamMeetings" },
  { key: "clientMeetings" },
  { key: "boardMeetings" },
  { key: "oneonone" },
];

const WORKFLOW_STEPS = [
  { number: 1, key: "record" },
  { number: 2, key: "upload" },
  { number: 3, key: "transcribe" },
  { number: 4, key: "review" },
  { number: 5, key: "share" },
];

export default function MeetingsUseCasePage() {
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const { releaseAssets } = useReleaseAssets();
  const { t } = useTranslation();

  const handleOpenContact = () => setContactFormOpen(true);
  const handleCloseContact = () => setContactFormOpen(false);

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
                {t("useCasesPages.meetings.badge")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
                {t("useCasesPages.meetings.title")}{" "}
                <span className="text-accent">
                  {t("useCasesPages.meetings.titleHighlight")}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-pretty leading-relaxed px-2">
                {t("useCasesPages.meetings.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("useCasesPages.meetings.benefits.title")}
              subtitle={t("useCasesPages.meetings.benefits.subtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.key}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all hover:shadow-lg"
                >
                  <benefit.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`useCasesPages.meetings.benefits.${benefit.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`useCasesPages.meetings.benefits.${benefit.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("useCasesPages.meetings.features.title")}
              subtitle={t("useCasesPages.meetings.features.subtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {FEATURES.map((feature) => (
                <div
                  key={feature.key}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all"
                >
                  <feature.icon className="w-8 h-8 text-accent mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {t(`useCasesPages.meetings.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`useCasesPages.meetings.features.${feature.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("useCasesPages.meetings.workflow.title")}
              subtitle={t("useCasesPages.meetings.workflow.subtitle")}
            />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-6">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.key} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center text-xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {t(`useCasesPages.meetings.workflow.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        `useCasesPages.meetings.workflow.steps.${step.key}.description`
                      )}
                    </p>
                  </div>
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Examples */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("useCasesPages.meetings.examples.title")}
              subtitle={t("useCasesPages.meetings.examples.subtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {USE_CASES_EXAMPLES.map((example) => (
                <div
                  key={example.key}
                  className="bg-card border border-border rounded-lg p-8 hover:border-accent/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t(`useCasesPages.meetings.examples.${example.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t(
                          `useCasesPages.meetings.examples.${example.key}.description`
                        )}
                      </p>
                      <p className="text-xs text-accent font-medium">
                        {t(`useCasesPages.meetings.examples.${example.key}.benefit`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-accent/10 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("useCasesPages.meetings.cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("useCasesPages.meetings.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-background bg-accent rounded-lg hover:bg-accent/90 transition-colors"
              >
                {t("useCasesPages.meetings.cta.downloadButton")}
              </a>
              <button
                onClick={handleOpenContact}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-card border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                {t("useCasesPages.meetings.cta.contactButton")}
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
