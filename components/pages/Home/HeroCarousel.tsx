// components/pages/Home/HeroCarousel
'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideImage {
  url: string;
  alt_text: string;
}

interface Slide {
  image: SlideImage;
  title: string;
  bengaliText: string;
  subtitle: string;
}

// Demo slides data
const DEMO_SLIDES: Slide[] = [
  {
    image: {
      url: "/api/placeholder/800/600",
      alt_text: "Maidul Retro Font Display"
    },
    title: "MAIDUL RETRO",
    bengaliText: "তুমি মিথ্যা",
    subtitle: "ENGLISH & BANGLA FONT"
  },
  {
    image: {
      url: "/api/placeholder/800/600",
      alt_text: "Maidul Modern Font Display"
    },
    title: "MAIDUL MODERN",
    bengaliText: "আমার বাংলা",
    subtitle: "ENGLISH & BANGLA FONT"
  },
  {
    image: {
      url: "/api/placeholder/800/600",
      alt_text: "Maidul Classic Font Display"
    },
    title: "MAIDUL CLASSIC",
    bengaliText: "স্বপ্ন দেখি",
    subtitle: "ENGLISH & BANGLA FONT"
  }
];

const CarouselDemo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);
  };

  return (
    <div className="lg:col-span-7 bg-purple-900 rounded-xl p-8 aspect-[4/3] relative overflow-hidden">
      {/* Slides */}
      {DEMO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Text Content - Always on top */}
          <div className="relative z-10 text-white flex flex-col justify-start">
            <h1 className="text-4xl font-bold">{slide.title}</h1>
            <div className="text-pink-500 text-6xl mt-4">{slide.bengaliText}</div>
            <div className="text-xl mt-4">{slide.subtitle}</div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all z-20"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {DEMO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselDemo;