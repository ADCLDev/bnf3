// components/reuseable/CustomFontCard
import Image from 'next/image';

const CustomFontCard = ({ 
    logo, 
    fontName, 
    styles, 
    company 
  }: { 
    logo: string;
    fontName: string;
    styles: number;
    company: string;
  }) => (
    <div className="bg-white rounded-xl p-8 hover:shadow-lg shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-12 w-48 mb-8">
          <Image 
            src={logo}
            alt={`${company} logo`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="text-4xl font-bold mb-6">{fontName}</div>
        <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 mb-4">
          <span>{styles} STYLES</span>
          <span className="w-1 h-1 bg-purple-700 rounded-full"></span>
          <span>UNICODE</span>
        </div>
        <div className="text-gray-600">{company}</div>
      </div>
    </div>
  );

export default CustomFontCard