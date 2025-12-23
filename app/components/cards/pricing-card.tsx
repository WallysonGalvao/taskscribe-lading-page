"use client";

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface PricingFeature {
  text: string;
  isBold?: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  badge?: string;
  isHighlighted?: boolean;
  yearlyNote?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  badge,
  isHighlighted = false,
  yearlyNote,
}: PricingCardProps) {
  return (
    <Card
      className={`p-5 sm:p-8 bg-card ${isHighlighted ? "border-accent" : "border-border"} relative`}
    >
      {badge ? (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground text-xs sm:text-sm">{badge}</Badge>
        </div>
      ) : null}

      <div className="mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span
            className={`text-3xl sm:text-4xl font-bold ${isHighlighted ? "text-accent" : "text-foreground"}`}
          >
            {price}
          </span>
          <span className="text-sm sm:text-base text-muted-foreground">{period}</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">{yearlyNote || description}</p>
      </div>

      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 sm:gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-foreground">
              {feature.isBold ? <strong>{feature.text}</strong> : feature.text}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
