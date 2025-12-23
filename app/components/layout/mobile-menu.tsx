"use client";

import { useState } from "react";

import { ChevronDown, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher, ThemeSwitcher } from "../common";
import { trackEvent } from "../download";
import type { ReleaseAssets } from "../download";
import type { Platform } from "../download/platform-button";
import { PlatformButton } from "../download/platform-button";

import { Button } from "@/components/ui/button";

interface NavLink {
  href: string;
  key: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
  releaseAssets?: ReleaseAssets;
}

const PLATFORMS: Platform[] = ["Windows", "Mac Intel", "Mac Apple Silicon", "Linux"];

export function MobileMenu({ isOpen, navLinks, onClose, releaseAssets }: MobileMenuProps) {
  const { t } = useTranslation();
  const [downloadOpen, setDownloadOpen] = useState(false);

  if (!isOpen) return null;

  const handleDownloadClick = (platform: Platform) => {
    trackEvent("Download Click - Mobile Menu", { platform });
    if (releaseAssets) {
      const url = releaseAssets[platform];
      if (url) {
        window.open(url, "_blank");
      }
    }
    onClose();
  };

  return (
    <div className="md:hidden border-t border-border/40 bg-background">
      <div className="px-4 py-4 space-y-3">
        {/* Navigation Links */}
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="block text-base py-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            {t(link.key)}
          </a>
        ))}

        {/* Divider */}
        <div className="border-t border-border/40 my-3" />

        {/* Download Section */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setDownloadOpen(!downloadOpen)}
          >
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              {t("header.download")}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${downloadOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {/* Download Options */}
          {downloadOpen && releaseAssets ? (
            <div className="bg-card border border-border rounded-lg p-2 space-y-1">
              {PLATFORMS.map((platform) => (
                <PlatformButton
                  key={platform}
                  platform={platform}
                  onClick={handleDownloadClick}
                  iconSize="sm"
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Settings Row */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1">
            <LanguageSwitcher />
          </div>
          <div className="flex-1">
            <ThemeSwitcher showLabel className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
