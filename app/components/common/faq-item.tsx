"use client";

import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <Card className="p-4 sm:p-6 bg-card border-border">
      <button
        className="w-full text-left flex items-start justify-between gap-3 sm:gap-4"
        onClick={onToggle}
      >
        <h3 className="text-base sm:text-lg font-semibold text-foreground">{question}</h3>
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {answer}
        </p>
      ) : null}
    </Card>
  );
}
