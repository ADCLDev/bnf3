// app/(root)/contributors-panel/page.tsx
import React from 'react';
import Image from 'next/image';
import { 
  Trophy,
  TrendingUp,
  Mail,
  FileText
} from 'lucide-react';
import ContributorStats from '@/components/reuseable/ContributorStats';
import Link from 'next/link';
interface Contributor {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: string;
  totalFonts: number;
  totalDownloads: number;
  totalLikes: number;
}

const ContributorCard: React.FC<{ contributor: Contributor }> = ({ contributor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      {/* Red Banner with Avatar */}
      <div className="bg-red-500 h-24 w-full relative">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
            <Image
              src={contributor.avatar}
              alt={contributor.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-6 pb-6">
        {/* Header Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-1">{contributor.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{contributor.role}</p>
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <Mail className="w-3 h-3 mr-1" />
            {contributor.email}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-red-500">{contributor.totalFonts}</div>
            <div className="text-gray-600 text-xs">Fonts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-500">{contributor.totalDownloads.toLocaleString()}</div>
            <div className="text-gray-600 text-xs">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-500">{contributor.totalLikes.toLocaleString()}</div>
            <div className="text-gray-600 text-xs">Likes</div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/contributors-panel/${contributor.id}`}>
        <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
          <FileText className="w-4 h-4 mr-2" />
          View Details
        </button>
        </Link>
      </div>
    </div>
  );
};

const ContributorShowcase: React.FC = () => {
  const contributors: Contributor[] = [
    {
      id: 1,
      name: "Aminul Islam",
      email: "aminul@bengalfonts.com",
      avatar: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?ga=GA1.1.724683099.1731423728&semt=ais_hybrid",
      role: "Senior Font Developer",
      totalFonts: 24,
      totalDownloads: 22300,
      totalLikes: 15800
    },
    // ... more contributors
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our Font Creators
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our talented contributors are the heart of Bengal Fonts, crafting unique and expressive typefaces that bring Bengali typography to life.
          </p>
        </div>

        {/* Stats Banner */}
        <ContributorStats/>

        {/* Contributors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contributors.map(contributor => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Join Our Community?</h2>
          <p className="text-gray-600 mb-8">
            Share your font creations with millions of users worldwide.
          </p>
          <button className="bg-red-500 text-white py-3 px-8 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Become a Contributor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributorShowcase;