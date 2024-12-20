'use client';
import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { FAQItem } from '@/app/(user)/admin-dashboard/components/FAQForm';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          ...doc.data()
        })) as FAQItem[];
        setFaqs(faqsData);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about our services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {faq.title}
              </h2>
              
              <div className="space-y-4">
                <a
                  href={faq.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch Tutorial Video
                </a>

                <p className="text-gray-600">{faq.description}</p>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Key Points:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {faq.bulletPoints.map((point, index) => (
                      <li key={index} className="text-gray-600">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 