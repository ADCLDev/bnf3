"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentSuccessful() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Add any initialization logic here
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your Type Tool subscription has been activated successfully.
        </p>
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
} 