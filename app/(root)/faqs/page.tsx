// app/(root)/faqs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { FAQVideoCard } from '@/components/FAQVideoCard';
import { LoadingPage } from '@/components/ui/loading-spinner';

interface FAQ {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  bulletPoints: string[];
  softwareType: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : '';
  };

  // Function to get gradient background based on index
  const getGradientBackground = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-cyan-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-green-600'
    ];
    return gradients[index % gradients.length];
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const faqsQuery = query(
          collection(db, 'faqs'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(faqsQuery);
        const faqsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as FAQ[];
        setFaqs(faqsData);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <FAQVideoCard
            key={faq.id}
            title={faq.title}
            youtubeEmbedId={getYouTubeId(faq.videoUrl)}
            background={getGradientBackground(index)}
            icon="/api/placeholder/32/32"
            softwareType={faq.softwareType || 'Software'}
            description={faq.bulletPoints}
          />
        ))}
      </div>
    </div>
  );
}