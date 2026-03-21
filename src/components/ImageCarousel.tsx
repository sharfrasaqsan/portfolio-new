import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: (string | { url: string; alt: string })[];
}

export const ImageCarousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const getImgUrl = (img: any) => (typeof img === 'string' ? img : img.url);
  const getImgAlt = (img: any) => (typeof img === 'string' ? 'Blog Post Detail' : img.alt || 'Blog Post Detail');

  if (images.length === 1) {
    return (
      <div className="bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm aspect-video max-h-[600px] flex items-center justify-center">
        <img 
          src={getImgUrl(images[0])} 
          alt={getImgAlt(images[0])} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100 aspect-video max-h-[600px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={getImgUrl(images[currentIndex])}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover absolute inset-0"
          alt={getImgAlt(images[currentIndex])}
        />
      </AnimatePresence>

      <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10">
         <ChevronLeft className="w-6 h-6" />
      </button>

      <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10">
         <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full shadow-sm transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
};
