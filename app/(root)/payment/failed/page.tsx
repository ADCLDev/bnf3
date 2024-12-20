"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentFailed() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Add any initialization logic here
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t process your payment. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => router.push('/')}
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => router.push('/support')}
          >
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
} 