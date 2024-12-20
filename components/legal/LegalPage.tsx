'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Shield } from 'lucide-react';

interface LegalPageProps {
  slug: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ slug }) => {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Query the document by slug
        const docRef = doc(db, 'legal_documents', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().status === 'published') {
          setDocument(docSnap.data());
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Error loading document');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Document Not Found</h1>
          <p className="text-gray-600">The requested legal document could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">{document.pageName}</h1>
        <p className="text-gray-600">{document.description}</p>
      </div>

      <div className="space-y-8">
        {document.paragraphs.sort((a: any, b: any) => a.order - b.order).map((paragraph: any) => (
          <div key={paragraph.id} className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{paragraph.title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{paragraph.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalPage;