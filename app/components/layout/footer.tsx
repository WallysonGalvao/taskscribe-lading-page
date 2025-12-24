"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

interface FooterProps {
  onContactClick: () => void;
}

export function Footer({ onContactClick }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/40 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/logo-icon.svg" alt="TaskScribe Logo" width={32} height={32} loading="lazy" />
            </div>
            <span className="font-semibold text-foreground">TaskScribe</span>
          </div>

          {/* Copyright - center on mobile */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center order-last sm:order-none">
            {t("footer.copyright")}
          </p>

          {/* Support Link */}
          <div className="flex items-center">
            <button
              onClick={onContactClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4"
            >
              {t("footer.links.support")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
