"use client";

interface SectionHeaderProps {
  title: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-10 sm:mb-16 px-2 sm:px-0`}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
        {title}
        {titleHighlight ? (
          <>
            {" "}
            <span className="text-accent">{titleHighlight}</span>
          </>
        ) : null}
        {titleSuffix ? ` ${titleSuffix}` : null}
      </h2>
      <p
        className={`text-base sm:text-lg text-muted-foreground ${centered ? "max-w-2xl mx-auto" : ""} text-pretty leading-relaxed`}
      >
        {subtitle}
      </p>
    </div>
  );
}
