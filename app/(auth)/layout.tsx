// src/app/(auth)/layout.tsx
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AuthNavbar from '@/components/shared/AuthNavbar';
import Footer from '@/components/shared/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/welcome');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
