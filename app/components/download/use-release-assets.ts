"use client";

import * as React from "react";

const GITHUB_REPO = "WallysonGalvao/taskScribe";
const GITHUB_RELEASE_BASE = `https://github.com/${GITHUB_REPO}/releases`;

export interface ReleaseAssets {
  Windows: string;
  "Mac Intel": string;
  "Mac Apple Silicon": string;
  Linux: string;
}

export interface UseReleaseAssetsReturn {
  releaseAssets: ReleaseAssets;
  releaseVersion: string;
  isLoading: boolean;
  isPlatformAvailable: (platform: keyof ReleaseAssets) => boolean;
}

const DEFAULT_DOWNLOAD_URLS: ReleaseAssets = {
  Windows: `${GITHUB_RELEASE_BASE}/latest`,
  "Mac Intel": `${GITHUB_RELEASE_BASE}/latest`,
  "Mac Apple Silicon": `${GITHUB_RELEASE_BASE}/latest`,
  Linux: `${GITHUB_RELEASE_BASE}/latest`,
};

export function useReleaseAssets(): UseReleaseAssetsReturn {
  const [releaseAssets, setReleaseAssets] = React.useState<
    Partial<ReleaseAssets>
  >({});
  const [releaseVersion, setReleaseVersion] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
        );
        if (!response.ok) {
          console.warn("No published release found, using fallback URLs");
          return;
        }
        const data = await response.json();
        setReleaseVersion(data.tag_name || "");

        const assets: Partial<ReleaseAssets> = {};
        for (const asset of data.assets || []) {
          const name = asset.name.toLowerCase();
          if (
            name.includes("x64-setup.exe") ||
            name.includes("x64-setup.nsis")
          ) {
            assets["Windows"] = asset.browser_download_url;
          } else if (name.includes("x64.dmg")) {
            assets["Mac Intel"] = asset.browser_download_url;
          } else if (name.includes("aarch64.dmg")) {
            assets["Mac Apple Silicon"] = asset.browser_download_url;
          } else if (
            name.includes("appimage") ||
            name.includes("amd64.appimage")
          ) {
            assets["Linux"] = asset.browser_download_url;
          }
        }
        setReleaseAssets(assets);
      } catch (error) {
        console.warn("Failed to fetch release info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestRelease();
  }, []);

  const downloadUrls: ReleaseAssets = {
    Windows: releaseAssets["Windows"] || DEFAULT_DOWNLOAD_URLS["Windows"],
    "Mac Intel":
      releaseAssets["Mac Intel"] || DEFAULT_DOWNLOAD_URLS["Mac Intel"],
    "Mac Apple Silicon":
      releaseAssets["Mac Apple Silicon"] ||
      DEFAULT_DOWNLOAD_URLS["Mac Apple Silicon"],
    Linux: releaseAssets["Linux"] || DEFAULT_DOWNLOAD_URLS["Linux"],
  };

  const isPlatformAvailable = (platform: keyof ReleaseAssets): boolean => {
    if (Object.keys(releaseAssets).length > 0) {
      return !!releaseAssets[platform];
    }
    return platform === "Windows";
  };

  return {
    releaseAssets: downloadUrls,
    releaseVersion,
    isLoading,
    isPlatformAvailable,
  };
}

// Analytics tracking utility
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  if (
    typeof window !== "undefined" &&
    (
      window as unknown as {
        posthog?: {
          capture: (name: string, properties?: Record<string, unknown>) => void;
        };
      }
    ).posthog
  ) {
    (
      window as unknown as {
        posthog: {
          capture: (name: string, properties?: Record<string, unknown>) => void;
        };
      }
    ).posthog.capture(eventName, properties);
  }
};
