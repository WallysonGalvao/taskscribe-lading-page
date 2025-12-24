"use client";

import { CheckCircle2 } from "lucide-react";

interface SecurityFeatureProps {
  title: string;
  description: string;
}

export function SecurityFeature({ title, description }: SecurityFeatureProps) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0 mt-0.5 sm:mt-1" />
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
