"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  showLabel?: boolean;
  className?: string;
}

const LANGUAGES = [
  { code: "pt", label: "🇧🇷 Português" },
  { code: "en", label: "🇺🇸 English" },
];

export function LanguageSwitcher({
  showLabel = false,
  className = "",
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={showLabel ? "outline" : "ghost"}
          size="sm"
          className={className}
        >
          <Languages className={showLabel ? "w-4 h-4 mr-2" : "w-4 h-4"} />
          {showLabel ? t("header.language.label") : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
