import { ChevronRight, Play, Pause } from 'lucide-react';
import { useState } from 'react';

export interface FAQVideoCard {
  title: string;
  youtubeEmbedId: string;
  background: string;
  icon: string;
  softwareType: string;
  description: string[];
}

export const FAQVideoCard = ({
  title,
  youtubeEmbedId,
  background,
  icon,
  softwareType,
  description
}: FAQVideoCard) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Video Section */}
      <div className={`aspect-video w-full relative ${background}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        {!isPlaying ? (
          <>
            {/* Video Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${youtubeEmbedId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to medium quality thumbnail if maxres doesn't exist
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeEmbedId}/mqdefault.jpg`;
              }}
            />
            {/* Play Button Overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors"
              onClick={handleVideoClick}
            >
              <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <Play className="w-8 h-8 text-red-500 ml-1" />
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeEmbedId}?autoplay=1&enablejsapi=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            />
            {/* Pause Button Overlay */}
            <div 
              className="absolute top-4 right-4 cursor-pointer z-10"
              onClick={handleVideoClick}
            >
              <div className="w-10 h-10 bg-black/70 hover:bg-black rounded-full flex items-center justify-center">
                <Pause className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <img src={icon} alt={softwareType} className="w-8 h-8" />
          <span className="text-white font-medium">Tutorial by Bengal Fonts</span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6">{title}</h3>
        <div className="space-y-4">
          {description.map((step, index) => (
            <div key={index} className="flex items-start gap-3 group">
              <ChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
              <p className="text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 