// app/(root)/services/page.tsx
import React from 'react';
import Link from 'next/link';
import CustomFontCard from '@/components/reuseable/CustomFontCard';
import { 
  MessageCircle, 
  PenTool, 
  Edit, 
  FileCheck, 
  Palette, 
  Headphones,
  ArrowRight
} from 'lucide-react';

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string;
  icon: React.ElementType;
}) => (
  <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all group">
    <div className="flex flex-col h-full">
      <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
        <Icon className="w-6 h-6 text-purple-700" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href="#" className="inline-flex items-center text-purple-700 hover:text-purple-800">
          Learn more <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  </div>
);

const ServicesPage = () => {
  const services = [
    {
      title: "Custom Font Design",
      description: "Create personalized fonts that reflect your brand identity and stand out in the market.",
      icon: PenTool
    },
    {
      title: "Font Modification",
      description: "Modify existing fonts to better suit your brand's specific needs and requirements.",
      icon: Edit
    },
    {
      title: "Font Licensing",
      description: "Flexible licensing options to suit various project requirements and usage scenarios.",
      icon: FileCheck
    },
    {
      title: "Logo & Brand Identity",
      description: "Design unique logos and cohesive brand identities with our expert design team.",
      icon: Palette
    },
    {
      title: "Consultation Services",
      description: "Expert advice on choosing and using fonts for your projects and brand strategy.",
      icon: Headphones
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
            Everything from design to development.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore our collaborative services, crafting fonts that perfectly align with your brand&apos;s vision and style.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white rounded-2xl p-12 text-center mb-20 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Planning to create something unique?
          </h2>
          <Link 
            href="https://wa.me/+1234567890" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Let&apos;s Chat
          </Link>
        </div>

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
    </div>
  );
};

export default ServicesPage;