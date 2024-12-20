// components/reuseable/PaymentFailed
'use client'
import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface PaymentFailedProps {
  orderId: string;
  attemptDate: string;
  totalAmount: number;
  errorMessage: string;
  cartItems: Array<{
    id: string;
    name: string;
    style: string;
    price: number;
  }>;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({
  orderId = '',
  attemptDate = '',
  totalAmount = 0.0,
  errorMessage = '',
  cartItems = []
}) => {
  const handleRetryPayment = async () => {
    // Implement retry payment logic
    console.log('Retrying payment...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-lg">
            We were unable to process your payment. Please try again.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-6">
              <CardTitle className="text-xl">Payment Details</CardTitle>
              <CardDescription className="text-gray-500">
                Attempt #{orderId} • {attemptDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Amount</span>
                  <span className="text-xl font-semibold text-gray-900">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full text-sm">
                    Failed
                  </span>
                </div>
                <Alert className="bg-red-50 border-red-100 text-red-800 mt-4">
                  <AlertTitle className="text-red-900 font-semibold">Error Details</AlertTitle>
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-6">
              <CardTitle className="text-xl">Cart Summary</CardTitle>
              <CardDescription className="text-gray-500">
                Items in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.style}</p>
                  </div>
                  <span className="font-medium text-gray-700">৳{item.price.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-6">
              <div className="w-full flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-xl font-semibold text-gray-900">৳{totalAmount.toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleRetryPayment}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-200 hover:bg-gray-50"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-200 hover:bg-gray-50"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
            </Button>
          </div>

          <Alert className="bg-blue-50 border-blue-100 text-blue-800">
            <AlertTitle className="text-blue-900 font-semibold mb-2">
              Need Help?
            </AlertTitle>
            <AlertDescription className="text-blue-800">
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Check your payment method and try again</li>
                <li>Ensure you have sufficient funds</li>
                <li>Contact your bank if the problem persists</li>
                <li>Reach out to our support team for assistance</li>
                <li>Your cart items have been saved</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;