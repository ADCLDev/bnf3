'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ContributorSection = () => (
  <div className="text-center max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-sm">
    <h2 className="text-2xl font-bold mb-4">Become a Contributor</h2>
    <p className="text-gray-600 mb-6">
      Join our community of innovators and help shape the future of technology.
    </p>
    <Link href="/apply-for-contributor-access">
      <Button className="bg-blue-600 hover:bg-blue-700 mb-4">
        Submit Contributor Application
      </Button>
    </Link>
  </div>
); 