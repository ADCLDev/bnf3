// app/(root)/page.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FontCard from '@/components/fonts/FontCard'
import HeroSection from '@/components/pages/Home/Hero';
import CustomFontCard from '@/components/reuseable/CustomFontCard';
import FAQBanner from '@/components/reuseable/FAQBanner';
import { LoadingPage } from '@/components/ui/loading-spinner';

const sampleFonts = [
  {
    id: '1',
    name: 'Matrabritto',
    type: 'Bangla Font',
    styles: 4,
    price: 115,
    originalPrice: 460,
    discount: 75,
    previewText: 'মাত্রাবৃত্ত',
    subText: 'বাংলা টাইপফেস',
    bgColor: 'bg-[#1a2942]',
    textColor: 'text-[#3498db]',
    tagLine: 'A Tribute to Satyajit Ray'
  },
  {
    id: '2',
    name: 'Bangabandhu',
    type: 'English & Bangla Font',
    styles: 12,
    price: 230,
    originalPrice: 920,
    discount: 75,
    previewText: 'বঙ্গবন্ধু',
    subText: 'বাংলা ও English ফন্ট',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-900'
  },
  {
    id: '3',
    name: 'Dighol 2.0',
    type: 'English & Bangla Font',
    styles: 2,
    price: 115,
    originalPrice: 460,
    discount: 75,
    previewText: 'DIGHOL ENGLISH',
    subText: 'TYPE FACE',
    bgColor: 'bg-pink-500',
    textColor: 'text-white'
  },
  {
    id: '4',
    name: 'Chilekotha',
    type: 'Bangla Font',
    styles: 2,
    price: 0,
    originalPrice: 0,
    discount: 0,
    previewText: 'চিলেকোঠা',
    subText: 'বাংলা টাইপফেস',
    bgColor: 'bg-gray-900',
    textColor: 'text-[#2ecc71]',
    isFree: true
  },
  {
    id: '5',
    name: 'Aporahno',
    type: 'Bangla Font',
    styles: 2,
    price: 115,
    originalPrice: 460,
    discount: 75,
    previewText: 'অপরাহ্ন',
    subText: 'ক্লাসিক বাংলা টাইপফেস',
    bgColor: 'bg-black',
    textColor: 'text-[#f1c40f]'
  },
  {
    id: '6',
    name: 'Shorot',
    type: 'Bangla Font',
    styles: 4,
    price: 115,
    originalPrice: 460,
    discount: 75,
    previewText: 'শরৎ',
    bgColor: 'bg-[#3498db]',
    textColor: 'text-white'
  }
];

const HomePage: FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <HeroSection/>
      <br/>
      {/* Font Categories */}
      <div className="flex gap-4 mb-8 overflow-x-auto py-2">
        {['Cursive', 'Round', 'Serif', 'Display', 'Cursive', 'Round'].map((category, index) => (
          <button
            key={index}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-300"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <input
          type="text"
          placeholder="Search font"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Font Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleFonts.map((font) => (
        <FontCard key={font.id} font={font} />
      ))}
    </div>
    <br></br>
      <FAQBanner />

      {/* Custom Fonts Section */}
      <div>
          <h2 className="text-4xl font-bold text-red-500 text-center mb-6">
            Custom Brand Fonts
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Explore our custom brand fonts, meticulously designed for select clients to elevate their brand identity and communication.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CustomFontCard 
              logo="/api/placeholder/120/40"
              fontName="বাংলা ফন্ট"
              styles={4}
              company="Oppo Bangla Sans | Oppo"
            />
            <CustomFontCard 
              logo="/api/placeholder/120/40"
              fontName="একুশ বাংলা"
              styles={5}
              company="IM Ekush | Inteligent Mechines"
            />
          </div>
        </div>
    </div>
  );
};

export default HomePage;