'use client';

import { useState, useEffect } from 'react';
import { LoadingPage } from '@/components/ui/loading-spinner';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
} 