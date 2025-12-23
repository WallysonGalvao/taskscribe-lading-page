"use client";

import { useTranslation } from "react-i18next";

import type { ReleaseAssets } from "../download";
import { DownloadDropdown } from "../download";

import { Card } from "@/components/ui/card";

interface CtaSectionProps {
  releaseAssets: ReleaseAssets;
}

export function CtaSection({ releaseAssets }: CtaSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 md:p-12 bg-card border-accent/20">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              {t("cta.title")}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <DownloadDropdown
                releaseAssets={releaseAssets}
                variant="cta"
                buttonLabel={t("cta.download")}
              />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("cta.note")}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
