import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "../utils/seo";

interface CarouselProps {
  images: (string | { url: string; alt?: string })[];
  title?: string;
  className?: string;
}

export const ImageCarousel: React.FC<CarouselProps> = ({
  images,
  title = "Project",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = images ? images.length : 0;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!images || total === 0) return null;

  const getImgUrl = (img: any) => resolveImageUrl(img);

  const getImgAlt = (img: any, idx: number) => {
    if (typeof img === "object" && img.alt && img.alt.trim().length > 0) {
      return img.alt;
    }
    return `${title} — Screenshot ${idx + 1} of ${total}`;
  };

  if (total === 1) {
    return (
      <figure
        className={`overflow-hidden rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#F2F1EC] dark:bg-[#1B2228] ${className}`}
      >
        <img
          src={getImgUrl(images[0])}
          alt={getImgAlt(images[0], 0)}
          className="w-full h-auto object-cover max-h-[580px]"
          loading="eager"
        />
      </figure>
    );
  }

  return (
    <figure
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} image gallery`}
      className={`relative overflow-hidden rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#F2F1EC] dark:bg-[#1B2228] ${className}`}
    >
      <div className="relative aspect-video max-h-[580px] w-full flex items-center justify-center overflow-hidden">
        <img
          src={getImgUrl(images[currentIndex])}
          alt={getImgAlt(images[currentIndex], currentIndex)}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous image"
          className="pointer-events-auto p-2 rounded-md bg-[#FFFFFF]/90 dark:bg-[#1B2228]/90 text-[#171F24] dark:text-[#F1F4F6] border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#FFFFFF] dark:hover:bg-[#222B33] transition-colors shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next image"
          className="pointer-events-auto p-2 rounded-md bg-[#FFFFFF]/90 dark:bg-[#1B2228]/90 text-[#171F24] dark:text-[#F1F4F6] border border-[#E5E4DE] dark:border-[#27313A] hover:bg-[#FFFFFF] dark:hover:bg-[#222B33] transition-colors shadow-sm cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Caption & Counter Bar */}
      <figcaption className="flex items-center justify-between px-4 py-2.5 bg-[#FFFFFF]/95 dark:bg-[#1B2228]/95 border-t border-[#E5E4DE] dark:border-[#27313A] text-xs text-[#55626F] dark:text-[#97A3AF]">
        <span className="truncate pr-4 font-mono">
          {currentIndex + 1} / {total}
        </span>

        <div className="flex gap-1.5" role="tablist" aria-label="Slides">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-[#1F51D0] dark:bg-[#4F7FF7]"
                  : "w-2 bg-[#E5E4DE] dark:bg-[#27313A] hover:bg-[#55626F]"
              }`}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
};
