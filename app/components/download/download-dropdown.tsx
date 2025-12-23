"use client";

import { useState } from "react";

import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Platform } from "./platform-button";
import { PlatformButton } from "./platform-button";
import type { ReleaseAssets } from "./use-release-assets";
import { trackEvent } from "./use-release-assets";

import { Button } from "@/components/ui/button";

interface DownloadDropdownProps {
  releaseAssets: ReleaseAssets;
  variant?: "hero" | "header" | "cta";
  buttonLabel?: string;
}

const PLATFORMS: Platform[] = ["Windows", "Mac Intel", "Mac Apple Silicon", "Linux"];

export function DownloadDropdown({
  releaseAssets,
  variant = "hero",
  buttonLabel,
}: DownloadDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadClick = (platform: Platform) => {
    trackEvent("Download Click", { platform, variant });
    const url = releaseAssets[platform];
    if (url) {
      window.open(url, "_blank");
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    // Only use hover behavior on desktop
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only use hover behavior on desktop
    if (window.innerWidth >= 768) {
      setIsOpen(false);
    }
  };

  const label = buttonLabel || (variant === "cta" ? t("cta.download") : t("hero.cta"));

  const buttonClassName =
    variant === "header"
      ? ""
      : "bg-accent text-accent-foreground hover:bg-accent/90 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg";

  const dropdownPosition =
    variant === "header"
      ? "absolute right-0 mt-2 w-56"
      : "absolute left-1/2 -translate-x-1/2 mt-2 w-64 sm:w-72";

  return (
    <div
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant={variant === "header" ? "outline" : "default"}
        size={variant === "header" ? "sm" : "lg"}
        className={buttonClassName}
        onClick={toggleDropdown}
      >
        <Download
          className={variant === "header" ? "w-4 h-4 mr-2" : "w-4 h-4 sm:w-5 sm:h-5 mr-2"}
        />
        {variant === "header" ? t("header.download") : label}
      </Button>
      {isOpen ? (
        <div
          className={`${dropdownPosition} bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200`}
        >
          <div className="p-2">
            {PLATFORMS.map((platform) => (
              <PlatformButton
                key={platform}
                platform={platform}
                onClick={handleDownloadClick}
                iconSize={variant === "header" ? "sm" : "md"}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Backdrop for mobile to close dropdown on outside click */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
