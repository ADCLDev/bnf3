// components/reuseable/FAQBanner
import React from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
const FAQBanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-700 to-purple-900 text-white rounded-2xl p-12 text-center mb-20 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Have any questions?
          </h2>
          <Link 
            href="/faqs" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Visit our FAQ Page
          </Link>
        </div>
  )
}

export default FAQBanner