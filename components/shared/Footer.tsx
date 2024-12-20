'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface LegalDocument {
  id: string;
  pageName: string;
}

const Footer = () => {
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([]);

  useEffect(() => {
    const fetchLegalDocs = async () => {
      try {
        const q = query(
          collection(db, 'legal_documents'),
          where('status', '==', 'published')
        );
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          pageName: doc.data().pageName
        }));
        setLegalDocs(docs);
      } catch (error) {
        console.error('Error fetching legal documents:', error);
      }
    };

    fetchLegalDocs();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="JiFont Fonts Logo"
                width={150}
                height={50}
                className="w-[100px] md:w-[150px] h-auto"
                priority
              />
            </Link>
            <p className="text-gray-400">Browse through our collection of custom fonts and designs.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contributors-panel">Our Contributors</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              {legalDocs.map(doc => (
                <li key={doc.id}>
                  <Link href={`/legal/${doc.id}`}>
                    {doc.pageName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest font releases and offers.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <button className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;