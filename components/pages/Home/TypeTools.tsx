// components/pages/Home/TypeTools
'use client'
import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Type } from 'lucide-react';
import Link from 'next/link';

const TypeToolPreview: FC = () => {
  const [text, setText] = useState("");
  const fullText = "তুমি মিথ্যা • Type Something • আমি সত্যি";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex === fullText.length) {
      setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setText("");
          setCurrentIndex(0);
          setIsTyping(true);
        }, 1500);
      }, 1000);
      return;
    }

    const timeout = setTimeout(() => {
      setText(prev => prev + fullText[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, 150);

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, fullText]);

  return (
    <Card className="bg-red-700 text-white p-6 relative overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Type size={20} />
          Try Type Tool
        </h3>
        <Link href={`/type-tool`}>
          <Button 
            className="bg-white text-black hover:bg-gray-200 shadow-md"
            size="sm"
          >
            Open Type-Tool
          </Button>
        </Link>
      </div>
      
      <div className="relative">
        <div className="h-12 bg-red-600 rounded-lg flex items-center px-4 text-lg">
          {text}
          <span className="ml-1 w-0.5 h-6 bg-white animate-pulse"></span>
        </div>
        
        {/* Gradient overlays for text input */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-red-500 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-red-500 to-transparent"></div>
      </div>

      <div className="flex gap-3 mt-4">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>
    </Card>
  );
};

export default TypeToolPreview;