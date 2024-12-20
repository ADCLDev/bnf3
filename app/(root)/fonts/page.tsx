'use client';

import { useState, useEffect } from 'react';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { Search } from 'lucide-react';
import FontCard from '@/components/fonts/FontCard';

// You can move this to a separate file if needed
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
    textColor: 'text-[#3498db]'
  },
  // Add more fonts as needed
];

export default function FontsPage() {
  const [isClient, setIsClient] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="relative mb-12">
        <input
          type="text"
          placeholder="Search font"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Font Categories */}
      <div className="flex gap-4 mb-8 overflow-x-auto py-2">
        {['All', 'Bangla', 'English', 'Display', 'Script'].map((category) => (
          <button
            key={category}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap hover:bg-gray-300"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Font Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleFonts
          .filter(font => 
            font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            font.type.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((font) => (
            <FontCard key={font.id} font={font} />
          ))}
      </div>
    </div>
  );
} 