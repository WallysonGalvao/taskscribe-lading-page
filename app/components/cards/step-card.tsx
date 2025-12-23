"use client";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center mb-3 sm:mb-4 text-accent-foreground font-bold text-lg sm:text-xl">
          {stepNumber}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
