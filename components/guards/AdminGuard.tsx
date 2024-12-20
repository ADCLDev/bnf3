'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../ui/loading-spinner';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        router.push('/');
      }
      setIsChecking(false);
    }
  }, [loading, isAdmin, router]);

  if (loading || isChecking) {
    return <LoadingPage />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
} 