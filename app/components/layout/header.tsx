"use client";

import * as React from "react";

import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher, ThemeSwitcher } from "../common";
import type { ReleaseAssets } from "../download";
import { DownloadDropdown } from "../download";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
  releaseAssets: ReleaseAssets;
}

const NAV_LINKS = [
  { href: "#features", key: "header.features" },
  { href: "#pricing", key: "header.pricing" },
  { href: "#how-it-works", key: "header.howItWorks" },
  { href: "#faq", key: "header.faq" },
];

export function Header({ releaseAssets }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo-icon.svg" alt="TaskScribe Logo" width={32} height={32} />
            <span className="text-xl font-bold text-foreground">{t("app.name")}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-[#F59E0B] group"
              >
                {t(link.key)}
                {/* Animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#F97316] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border/50">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            <DownloadDropdown releaseAssets={releaseAssets} variant="header" />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        navLinks={NAV_LINKS}
        onClose={() => setMobileMenuOpen(false)}
        releaseAssets={releaseAssets}
      />
    </header>
  );
}
