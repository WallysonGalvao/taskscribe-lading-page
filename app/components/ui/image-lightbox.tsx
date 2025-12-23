"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  title: string;
  icon?: LucideIcon;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Pan/drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  // Reset state when opening lightbox or changing image
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Reset position when zoom is toggled off
  useEffect(() => {
    if (!isZoomed) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomed]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (!isZoomed) goToPrevious();
          break;
        case "ArrowRight":
          if (!isZoomed) goToNext();
          break;
        case " ":
          e.preventDefault();
          setIsZoomed((z) => !z);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious, isZoomed]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Mouse drag handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPosition({
      x: positionStartRef.current.x + deltaX,
      y: positionStartRef.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomed || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    positionStartRef.current = { ...position };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isZoomed || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    setPosition({
      x: positionStartRef.current.x + deltaX,
      y: positionStartRef.current.y + deltaY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle click - only toggle zoom if not dragging
  const handleImageClick = () => {
    if (isDragging) return;
    setIsZoomed((z) => !z);
  };

  const goToIndex = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Backdrop com blur */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Container principal */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header com título e controles */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-linear-to-b from-background/80 to-transparent">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-muted-foreground font-medium">
              {currentIndex + 1} / {images.length}
            </span>

            {/* Icon + Title container */}
            <div className="hidden sm:flex items-center gap-3">
              {currentImage.icon && (
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <currentImage.icon className="w-5 h-5 text-accent" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground">
                {currentImage.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom toggle */}
            <button
              onClick={() => setIsZoomed((z) => !z)}
              className="p-2 rounded-full bg-card/50 hover:bg-card border border-border hover:border-accent/50 transition-all"
              aria-label={isZoomed ? t("features.lightbox.zoomOut") : t("features.lightbox.zoomIn")}
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5 text-foreground" />
              ) : (
                <ZoomIn className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-card/50 hover:bg-destructive/20 border border-border hover:border-destructive/50 transition-all"
              aria-label={t("features.lightbox.closeGallery")}
            >
              <X className="w-5 h-5 text-foreground hover:text-destructive" />
            </button>
          </div>
        </div>

        {/* Mobile title with icon */}
        <div className="flex items-center justify-center gap-2 sm:hidden px-4 -mt-2 mb-2">
          {currentImage.icon && (
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <currentImage.icon className="w-4 h-4 text-accent" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-foreground">
            {currentImage.title}
          </h3>
        </div>

        {/* Área da imagem */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center px-4 sm:px-16 lg:px-24">
          {/* Previous button - hide when zoomed */}
          {!isZoomed && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-card/80 backdrop-blur border border-border hover:border-accent/50 hover:bg-card flex items-center justify-center transition-all shadow-lg hover:scale-110"
              aria-label={t("features.lightbox.previousImage")}
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
            </button>
          )}

          {/* Image container with pan support */}
          <div
            className={cn(
              "relative w-full h-full max-w-6xl max-h-[70vh] flex items-center justify-center overflow-hidden",
              isZoomed && isDragging && "cursor-grabbing",
              isZoomed && !isDragging && "cursor-grab",
              !isZoomed && "cursor-zoom-in"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
          >
            <div
              className={cn(
                "relative w-full h-full transition-transform",
                !isDragging && "duration-300 ease-out"
              )}
              style={{
                transform: isZoomed
                  ? `scale(2) translate(${position.x / 2}px, ${position.y / 2}px)`
                  : "scale(1) translate(0, 0)",
              }}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.title}
                fill
                className={cn(
                  "object-contain transition-opacity duration-300 select-none pointer-events-none",
                  isAnimating && "opacity-50"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
                priority
                draggable={false}
              />
            </div>
          </div>

          {/* Next button - hide when zoomed */}
          {!isZoomed && (
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-card/80 backdrop-blur border border-border hover:border-accent/50 hover:bg-card flex items-center justify-center transition-all shadow-lg hover:scale-110"
              aria-label={t("features.lightbox.nextImage")}
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
            </button>
          )}
        </div>

        {/* Zoom hint quando está com zoom */}
        {isZoomed && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-sm text-muted-foreground bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-border">
            {t("features.lightbox.dragToMove", "Drag to move • Click to zoom out")}
          </div>
        )}

        {/* Thumbnail carousel - hide when zoomed */}
        {!isZoomed && (
          <div className="py-4 sm:py-6 bg-linear-to-t from-background/80 to-transparent">
            <div className="flex justify-center items-center gap-2 sm:gap-3 px-4 overflow-x-auto scrollbar-none">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    "relative shrink-0 w-16 h-12 sm:w-24 sm:h-16 lg:w-32 lg:h-20 rounded-lg overflow-hidden transition-all duration-300 border-2",
                    index === currentIndex
                      ? "border-accent ring-2 ring-accent/30 scale-105"
                      : "border-border hover:border-accent/50 opacity-60 hover:opacity-100"
                  )}
                  aria-label={`${t("features.lightbox.goTo")} ${image.title}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pagination dots para mobile - hide when zoomed */}
        {!isZoomed && (
          <div className="sm:hidden flex justify-center gap-2 pb-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-accent w-6"
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyboard hints (desktop only) - hide when zoomed */}
      {!isZoomed && (
        <div className="absolute bottom-4 left-4 hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-card border border-border rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-card border border-border rounded text-xs">→</kbd>
            <span>{t("features.lightbox.navigate")}</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-card border border-border rounded text-xs">Space</kbd>
            <span>{t("features.lightbox.zoom")}</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-card border border-border rounded text-xs">Esc</kbd>
            <span>{t("features.lightbox.close")}</span>
          </span>
        </div>
      )}
    </div>
  );
}

