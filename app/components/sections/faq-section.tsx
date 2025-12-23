"use client";

import * as React from "react";

import { useTranslation } from "react-i18next";

import { FaqItem, SectionHeader } from "../common";

import { Button } from "@/components/ui/button";

const FAQ_KEYS = [
  "internet",
  "requirements",
  "pricing",
  "storage",
  "formats",
  "languages",
  "diarization",
  "gpu",
];

interface FaqSectionProps {
  onContactClick: () => void;
}

export function FaqSection({ onContactClick }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("faq.title")} subtitle={t("faq.subtitle")} />

        <div className="space-y-3 sm:space-y-4">
          {FAQ_KEYS.map((key, idx) => (
            <FaqItem
              key={key}
              question={t(`faq.questions.${key}.q`)}
              answer={t(`faq.questions.${key}.a`)}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {t("faq.stillHaveQuestions")}
          </p>
          <Button
            variant="outline"
            onClick={onContactClick}
            className="w-full sm:w-auto"
          >
            {t("faq.contactUs")}
          </Button>
        </div>
      </div>
    </section>
  );
}
