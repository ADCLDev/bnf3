// app/(root)/fonts/[id]/page.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';

interface SlideImage {
  url: string;
  alt_text: string;
}

interface Slide {
  image: SlideImage;
  title: string;
  bengaliText: string;
}

const DEMO_SLIDES: Slide[] = [
  {
    image: {
      url: "/api/placeholder/800/400",
      alt_text: "Mindai Retro Font Display"
    },
    title: "MINDAI RETRO",
    bengaliText: "তুমি মিথ্যা"
  },
  {
    image: {
      url: "/api/placeholder/800/400",
      alt_text: "Mindai Modern Font Display"
    },
    title: "MINDAI RETRO",
    bengaliText: "আমার বাংলা"
  },
  {
    image: {
      url: "/api/placeholder/800/400",
      alt_text: "Mindai Classic Font Display"
    },
    title: "MINDAI RETRO",
    bengaliText: "স্বপ্ন দেখি"
  }
];

const FontPreviewPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const startProgressBar = () => {
    // Reset any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    setProgress(0);
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / duration) * 100;
      
      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(progressInterval.current!);
        // Move to next slide
        setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
      } else {
        setProgress(newProgress);
      }
    }, 16); // Update roughly every frame
  };

  useEffect(() => {
    startProgressBar();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSlide]);

  const handleProgressBarClick = (index: number) => {
    setCurrentSlide(index);
  };

  const glyphs = {
    row1: ['ঠা', 'ঠি', 'ঋ', 'ড়ি', 'ঢা', 'ঢি', 'য়া', 'য়ি', 'ৃ', 'ৃং'],
    row2: ['০', 'অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ'],
    row3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    row4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    row5: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Carousel with Progress Bars */}
        <div className="bg-red-600 rounded-lg p-6 relative">
          <div className="aspect-[4/3] relative">
            {/* Slides */}
            {DEMO_SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative z-10 text-white flex flex-col justify-start">
                  <h2 className="text-3xl font-bold">{slide.title}</h2>
                  <div className="text-5xl mt-4">{slide.bengaliText}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {DEMO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => handleProgressBarClick(index)}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-200 ${
                    currentSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    width: `${currentSlide === index ? progress : 0}%`
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Font Details Card */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold">Mindai Retro Font Family</h1>
              <p className="text-gray-600">2 Styles, Single & License</p>
            </div>
            <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors">
              Purchase Font
            </button>
          </div>

          <div className="space-y-3 mt-6">
            <div className="grid grid-cols-[120px,1fr] gap-2">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">Stylish, Display</span>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-2">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium">English & Bangla</span>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-2">
              <span className="text-gray-600">Encoding:</span>
              <span className="font-medium">UNICODE</span>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-2">
              <span className="text-gray-600">Styles:</span>
              <span className="font-medium">2 Styles</span>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-2">
              <span className="text-gray-600">Designer:</span>
              <span className="font-medium">Thouhedul Islam Himel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Styles Section */}
      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Mindai Retro has 2 Styles</h2>
          <ChevronDown className="text-gray-400" />
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Style: Plain</span>
          </div>
          <div className="text-3xl" style={{ fontFamily: 'sans-serif' }}>
            INNER SENIOR DESIGN
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Style: Italic</span>
          </div>
          <div className="text-3xl italic" style={{ fontFamily: 'sans-serif' }}>
            Inner Senior Design
          </div>
        </div>
      </div>

      {/* Glyphs Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">Mridul Retro Glyphs</h2>
          <Minus className="text-gray-400 w-5 h-5" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-10 gap-4">
            {Object.values(glyphs).map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((glyph, index) => (
                  <div
                    key={`${rowIndex}-${index}`}
                    className="aspect-square flex items-center justify-center text-xl border rounded-lg"
                  >
                    {glyph}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* In Use Section (Collapsed) */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">Mridul Retro in Use</h2>
          <Plus className="text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">About Mridul Retro Font</h2>
          <Minus className="text-gray-400 w-5 h-5" />
        </div>
        <div className="p-4">
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-red-800 rounded-lg flex items-center justify-center p-4">
              <div className="text-center text-white">
                <div className="text-xl font-bold mb-2">MRIDUL RETRO</div>
                <div className="text-2xl mb-2">তুমি মিথ্যা</div>
                <div className="text-sm">ENGLISH & BANGLA FONT</div>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Mridul Retro is a stylish and versatile Bangla font that brings a touch of nostalgia with its retro-inspired design. Perfect for branding, headlines, and creative projects, Mridul Retro combines classic Bengali typography with modern aesthetics. Its bold curves and unique letterforms make it ideal for logos, posters, advertising, and print materials. Whether you&apos;re working on traditional designs or aiming for a contemporary yet vintage look, Mridul Retro provides a visually striking option for designers looking to stand out in the Bengali type design space. Download Mridul Retro Bangla font and enhance your creative projects with its timeless charm.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2">
                    <span className="text-gray-600">Styles: </span>
                    <span className="font-medium">2 Styles</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Category: </span>
                    <span className="font-medium">Stylish, Display</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-gray-600">Language Support: </span>
                    <span className="font-medium">English & Bangla</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Encoding: </span>
                    <span className="font-medium">UNICODE</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Designed By: </span>
                    <span className="font-medium">Thouhedul Islam Himel</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors">
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default FontPreviewPage;