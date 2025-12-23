"use client";

import { Apple, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

export type Platform = "Windows" | "Mac Intel" | "Mac Apple Silicon" | "Linux";

interface PlatformButtonProps {
  platform: Platform;
  onClick: (platform: Platform) => void;
  iconSize?: "sm" | "md";
}

const PLATFORM_CONFIG: Record<
  Platform,
  {
    icon: typeof Monitor | typeof Apple;
    titleKey: string;
    noteKey: string;
  }
> = {
  Windows: {
    icon: Monitor,
    titleKey: "hero.platforms.windows",
    noteKey: "hero.platforms.windowsNote",
  },
  "Mac Intel": {
    icon: Apple,
    titleKey: "hero.platforms.macIntel",
    noteKey: "hero.platforms.macIntelNote",
  },
  "Mac Apple Silicon": {
    icon: Apple,
    titleKey: "hero.platforms.macSilicon",
    noteKey: "hero.platforms.macSiliconNote",
  },
  Linux: {
    icon: Monitor,
    titleKey: "hero.platforms.linux",
    noteKey: "hero.platforms.linuxNote",
  },
};

export function PlatformButton({ platform, onClick, iconSize = "md" }: PlatformButtonProps) {
  const { t } = useTranslation();
  const config = PLATFORM_CONFIG[platform];
  const Icon = config.icon;
  const iconClassName = iconSize === "sm" ? "w-4 h-4" : "w-5 h-5";
  const paddingClassName = iconSize === "sm" ? "px-3 py-2" : "px-3 py-2.5";

  return (
    <button
      onClick={() => onClick(platform)}
      className={`flex items-center gap-3 ${paddingClassName} rounded-md hover:bg-accent/10 transition-colors w-full text-left`}
    >
      <Icon className={`${iconClassName} text-muted-foreground`} />
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{t(config.titleKey)}</div>
        <div className="text-xs text-muted-foreground">{t(config.noteKey)}</div>
      </div>
    </button>
  );
}
