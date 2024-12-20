// components/pages/Home/Hero
'use client'
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import TypeToolPreview from './TypeTools';
import SubscriptionPlansPopup from './SubscriptionPopUp';
import GiftCardPopup from './GiftCardSelectionPopUp';
import TypeToolPopup from './TypeToolPopUp';
import React, { useState, useEffect, useRef, useCallback } from 'react';


interface Slide {
  title: string;
  bengaliText: string;
  subtitle: string;
}

const DEMO_SLIDES: Slide[] = [
  {
    title: "MAIDUL RETRO",
    bengaliText: "তুমি মিথ্যা",
    subtitle: "ENGLISH & BANGLA FONT"
  },
  {
    title: "MAIDUL MODERN",
    bengaliText: "আমার বাংলা",
    subtitle: "ENGLISH & BANGLA FONT"
  },
  {
    title: "MAIDUL CLASSIC",
    bengaliText: "স্বপ্ন দেখি",
    subtitle: "ENGLISH & BANGLA FONT"
  }
];

const SLIDE_DURATION = 5000; // 5 seconds

const HeroSection: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // const [animationKey, setAnimationKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetSlideTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
        // setAnimationKey(prev => prev + 1);
      }, SLIDE_DURATION);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetSlideTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, resetSlideTimer]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // setAnimationKey(prev => prev + 1);
    setIsPlaying(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Carousel Section */}
      <div className="lg:col-span-7">
        <div className="bg-purple-900 rounded-xl p-8 aspect-[4/3] relative overflow-hidden">
          {/* Slides */}
          {DEMO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex flex-col justify-start">
                <h1 className="text-4xl font-bold text-white">{slide.title}</h1>
                <div className="text-pink-500 text-6xl mt-4">{slide.bengaliText}</div>
                <div className="text-white text-xl mt-4">{slide.subtitle}</div>
              </div>
            </div>
          ))}

          {/* Progress bars */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {DEMO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative h-1 w-16 bg-white/30 overflow-hidden cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-red-500 transform-origin-left ${
                    index === currentSlide ? 'animate-progress' : 'w-0'
                  }`}
                  style={{
                    animationName: index === currentSlide ? 'progress' : 'none',
                    animationDuration: `${SLIDE_DURATION}ms`,
                    animationTimingFunction: 'linear'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Type Tool */}
      <div className="lg:col-span-5">

        {/* Try Type Tool */}
        <TypeToolPreview />
          
          {/* Type Tool Subscription */}
          <Card className="bg-gray-100 p-4 shadow-sm my-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">Type Tool Subscription</div>
                <div className="text-xl font-bold">৳ 4000 <span className="text-sm font-normal">Starting</span></div>
                <div className="text-sm text-gray-600">Commercial License • Lifetime Download</div>
              </div>
              <TypeToolPopup/>
            </div>
          </Card>
          
          {/* Subscription */}
          <Card className="bg-gray-100 p-4 shadow-sm mt-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">Subscription</div>
                <div className="text-xl font-bold">৳ 4000 <span className="text-sm font-normal">Starting</span></div>
                <div className="text-sm text-gray-600">Commercial License • Lifetime Download</div>
              </div>
              <SubscriptionPlansPopup/>
            </div>
          </Card>
          
          {/* Gift Card */}
          <Card className="bg-gray-100 p-4 shadow-sm mt-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">Gift Card</div>
                <div className="text-xl font-bold">৳ 1000 <span className="text-sm font-normal">Starting</span></div>
                <div className="text-sm text-gray-600">Commercial License • 10 Download</div>
              </div>
              
              <GiftCardPopup/>
            </div>
          </Card>

      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress ${SLIDE_DURATION}ms linear;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;