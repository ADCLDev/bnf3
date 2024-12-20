// components/fonts/FontCard
'use client'
import { FC, useState } from 'react';
import { Heart, ShoppingCart, Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FontCardProps {
  font: {
    id: string;
    name: string;
    type: string;
    styles: number;
    price: number;
    originalPrice: number;
    discount: number;
    previewText: string;
    subText?: string;
    bgColor: string;
    textColor: string;
    tagLine?: string;
    isFree?: boolean;
  };
}

const FontCard: FC<FontCardProps> = ({ font }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden border-gray-950 shadow-lg hover:shadow-md transition-shadow">
      {/* Preview Image */}
      <Link href={`/fonts/${font.id}`}>
      <div className={cn("aspect-[4/3] p-6 relative flex flex-col justify-center items-center", font.bgColor)}>
        {/* Font Preview */}
        <div className={cn("text-center", font.textColor)}>
          {font.tagLine && (
            <div className="text-sm mb-2">{font.tagLine}</div>
          )}
          <div className="text-4xl font-bold">{font.previewText}</div>
          {font.subText && (
            <div className="text-lg mt-2">{font.subText}</div>
          )}
        </div>
      </div>
      </Link>
      

      {/* Card Content */}
      <div className="p-4">
        {/* Font Info Row */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{font.type}</p>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{font.name}</h3>
            <p className="text-sm text-gray-600">{font.styles} Styles</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Cart Button */}
          <button
            onClick={() => setIsInCart(!isInCart)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            title={isInCart ? "Remove from cart" : "Add to cart"}
          >
            {isInCart ? (
              <>
                <Check size={18} className="text-green-500" />
                <span className="text-sm">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span className="text-sm">Add to Cart</span>
              </>
            )}
          </button>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              size={18}
              className={cn(
                "transition-colors",
                isLiked ? "fill-red-500 text-red-500" : ""
              )}
            />
            <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
        </div>

        {/* Buy/Download Button */}
        {font.isFree ? (
          <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2">
            <Download size={20} />
            <span>Download Now</span>
          </button>
        ) : (
          <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2">
            <span>{font.price}৳</span>
            {font.discount > 0 && (
              <span className="text-sm">Save {font.discount}% {font.originalPrice}৳</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FontCard;