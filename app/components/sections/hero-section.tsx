"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EnergyGrid } from "../common";
import type { ReleaseAssets } from "../download";
import { DownloadDropdown } from "../download";

import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  releaseAssets: ReleaseAssets;
}

const PLATFORMS = [
  { name: "macOS", icon: CheckCircle2 },
  { name: "Windows", icon: CheckCircle2 },
  { name: "Linux", icon: CheckCircle2 },
];

export function HeroSection({ releaseAssets }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <EnergyGrid />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 relative">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-4 sm:mb-6 bg-accent/10 text-accent border-accent/20 animate-pulse text-xs sm:text-sm"
          >
            <Clock className="w-3 h-3 mr-1" />
            {t("hero.badge")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
            {t("hero.title")} <span className="text-accent">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty leading-relaxed px-2">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            <DownloadDropdown releaseAssets={releaseAssets} variant="hero" />
            <p className="text-xs sm:text-sm text-muted-foreground">{t("hero.note")}</p>
          </div>
          {/* Platform indicators - responsive layout */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-xs sm:text-sm text-muted-foreground">
            {PLATFORMS.map((platform) => (
              <div key={platform.name} className="flex items-center gap-1.5 sm:gap-2">
                <platform.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
