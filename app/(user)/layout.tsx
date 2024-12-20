// src/app/(users)/layout.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: LayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only handle protected routes
    const isProtectedRoute = ['/welcome', '/profile', '/admin-dashboard'].some(prefix => 
      pathname.startsWith(prefix)
    );

    if (!loading && !user && isProtectedRoute) {
      console.log('No user, redirecting to login from:', pathname);
      router.replace('/login');
    }
  }, [user, loading, router, pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // For protected routes, don't render if not authenticated
  const isProtectedRoute = ['/welcome', '/profile', '/admin-dashboard'].some(prefix => 
    pathname.startsWith(prefix)
  );
  if (!user && isProtectedRoute) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
