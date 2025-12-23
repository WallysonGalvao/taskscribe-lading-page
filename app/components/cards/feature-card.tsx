"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  imageSrc?: string;
  variant?: "accent" | "destructive";
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  imageSrc,
  variant = "accent",
}: FeatureCardProps) {
  const iconBgColor = variant === "destructive" ? "bg-destructive/10" : "bg-accent/10";
  const iconColor = variant === "destructive" ? "text-destructive" : "text-accent";
  const borderClass =
    variant === "destructive" ? "border-destructive/20" : "border-border hover:border-accent/50";

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

      {/* Image */}
      {imageSrc ? (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image src={imageSrc} alt={title} width={1552} height={987} className="w-full h-auto" />
        </div>
      ) : null}

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}
