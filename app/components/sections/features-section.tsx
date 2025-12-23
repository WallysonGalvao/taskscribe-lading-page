"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FeatureCard } from "../cards";
import { SectionHeader } from "../common";

import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Cpu, key: "ai", image: "/features/advanced-ai.png" },
  {
    icon: Users,
    key: "speakers",
    image: "/features/identifier-participants.png",
  },
  { icon: CheckCircle2, key: "tasks", image: "/features/models.png" },
  { icon: FileText, key: "formats", image: "/features/multiples-formats.png" },
  {
    icon: Zap,
    key: "performance",
    image: "/features/optimazed-performance.png",
  },
  { icon: Globe, key: "multilingual", image: "/features/multi-lengague.png" },
];

const AUTO_PLAY_INTERVAL = 5000;
const GAP = 24;

// Hook para obter dimensões responsivas do carrossel
function useCarouselDimensions() {
  const [dimensions, setDimensions] = useState({
    cardWidth: 600,
    cardsPerPage: 3,
    totalPages: Math.ceil(FEATURES.length / 3),
  });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      let cardWidth: number;
      let cardsPerPage: number;

      if (width < 640) {
        // Mobile: 1 card por vez
        cardWidth = width - 48;
        cardsPerPage = 1;
      } else if (width < 768) {
        // Tablet pequeno: 1 card
        cardWidth = width - 80;
        cardsPerPage = 1;
      } else if (width < 1024) {
        // Tablet: 2 cards
        cardWidth = 500;
        cardsPerPage = 2;
      } else {
        // Desktop: 3 cards
        cardWidth = 600;
        cardsPerPage = 3;
      }

      setDimensions({
        cardWidth,
        cardsPerPage,
        totalPages: Math.ceil(FEATURES.length / cardsPerPage),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
}

export function FeaturesSection() {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { cardWidth, cardsPerPage, totalPages } = useCarouselDimensions();

  // Calculate scroll position for a page
  const getScrollPositionForPage = useCallback(
    (pageIndex: number): number => {
      const cardIndex = pageIndex * cardsPerPage;
      return cardIndex * (cardWidth + GAP);
    },
    [cardWidth, cardsPerPage]
  );

  // Go to a specific page using horizontal scroll only
  const goToPage = useCallback(
    (pageIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const scrollLeft = getScrollPositionForPage(pageIndex);
      carousel.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
      setCurrentPage(pageIndex);
    },
    [getScrollPositionForPage]
  );

  // Go to next page
  const goToNext = useCallback(() => {
    const nextPage = currentPage >= totalPages - 1 ? 0 : currentPage + 1;
    goToPage(nextPage);
  }, [currentPage, totalPages, goToPage]);

  // Go to previous page
  const goToPrevious = useCallback(() => {
    const prevPage = currentPage <= 0 ? totalPages - 1 : currentPage - 1;
    goToPage(prevPage);
  }, [currentPage, totalPages, goToPage]);

  // Stop auto-play on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      setCurrentPage((prev) => {
        const nextPage = prev >= totalPages - 1 ? 0 : prev + 1;
        const scrollLeft = nextPage * cardsPerPage * (cardWidth + GAP);

        carousel.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });

        return nextPage;
      });
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, totalPages, cardsPerPage, cardWidth]);

  // Detect current page based on scroll position
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const pageWidth = cardsPerPage * (cardWidth + GAP);
      const pageIndex = Math.round(scrollLeft / pageWidth);
      setCurrentPage(Math.min(pageIndex, totalPages - 1));
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [cardsPerPage, cardWidth, totalPages]);

  return (
    <section id="features" className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />
      </div>

      {/* Carousel container with controls */}
      <div className="relative">
        {/* Previous button - smaller on mobile */}
        <button
          onClick={() => {
            handleUserInteraction();
            goToPrevious();
          }}
          className="absolute left-2 sm:left-4 lg:left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/90 backdrop-blur border border-border hover:border-accent/50 hover:bg-card flex items-center justify-center transition-all shadow-lg"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </button>

        {/* Next button - smaller on mobile */}
        <button
          onClick={() => {
            handleUserInteraction();
            goToNext();
          }}
          className="absolute right-2 sm:right-4 lg:right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/90 backdrop-blur border border-border hover:border-accent/50 hover:bg-card flex items-center justify-center transition-all shadow-lg"
          aria-label="Next feature"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </button>

        {/* Carousel horizontal - adjusted padding for mobile */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none px-12 sm:px-16 lg:px-24 snap-x snap-mandatory"
          onMouseDown={handleUserInteraction}
          onTouchStart={handleUserInteraction}
        >
          {FEATURES.map((feature) => (
            <div key={feature.key} className="snap-center">
              <FeatureCard
                icon={feature.icon}
                title={t(`features.${feature.key}.title`)}
                description={t(`features.${feature.key}.description`)}
                imageSrc={feature.image}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div
        className="flex justify-center gap-2 mt-4 sm:mt-6"
        role="tablist"
        aria-label="Feature pages"
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              handleUserInteraction();
              goToPage(i);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === currentPage
                ? "bg-accent w-6 sm:w-8"
                : "bg-muted hover:bg-muted-foreground/30 w-2"
            )}
            role="tab"
            aria-selected={i === currentPage}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
