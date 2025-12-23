"use client";

import type { LucideIcon } from "lucide-react";
import { Expand } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  imageSrc?: string;
  variant?: "accent" | "destructive";
  onImageClick?: () => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  imageSrc,
  variant = "accent",
  onImageClick,
}: FeatureCardProps) {
  const { t } = useTranslation();
  const iconBgColor = variant === "destructive" ? "bg-destructive/10" : "bg-accent/10";
  const iconColor = variant === "destructive" ? "text-destructive" : "text-accent";
  const borderClass =
    variant === "destructive" ? "border-border hover:border-destructive/20" : "border-border hover:border-accent/50";

  return (
    <Card
      className={`p-4 sm:p-6 bg-card ${borderClass} transition-colors shrink-0 ${imageSrc ? "w-[calc(100vw-3rem)] sm:w-[calc(100vw-5rem)] md:w-[500px] lg:w-[600px]" : "w-full"}`}
    >
      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3
          className={`${variant === "destructive" ? "text-lg" : "text-xl"} font-semibold text-foreground`}
        >
          {title}
        </h3>
      </div>

      {/* Image - Clickable with hover effect */}
      {imageSrc ? (
        <button
          type="button"
          onClick={onImageClick}
          className="relative mb-4 rounded-lg overflow-hidden w-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
          aria-label={`View ${title} in fullscreen`}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={1552}
            height={987}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="flex items-center gap-2 text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <Expand className="w-4 h-4" />
              {t("features.lightbox.clickToExpand")}
            </span>
          </div>
        </button>
      ) : null}

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}
