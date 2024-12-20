import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CreditCard, Smartphone } from "lucide-react";
import { useRouter } from 'next/navigation';

interface PaymentPopupProps {
  onClose: () => void;
  amount: number;
  itemName: string;
  itemType: 'subscription' | 'gift' | 'tool';
}

const PaymentPopup = ({ onClose, amount, itemName, itemType }: PaymentPopupProps) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would integrate with your actual payment processing
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success page with relevant details
      router.push(`/payment/success`);
    } catch (error) {
      console.error('Payment error:', error);
      router.push(`/payment/failed`)
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Complete Payment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500">Item</div>
              <div className="font-medium">{itemName}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Amount</div>
              <div className="text-2xl font-bold">৳{amount}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                className="h-24 flex-col space-y-2"
                onClick={() => setPaymentMethod('mobile')}
              >
                <Smartphone className="h-6 w-6" />
                <span>Mobile Payment</span>
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="h-24 flex-col space-y-2"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-6 w-6" />
                <span>Card Payment</span>
              </Button>
            </div>

            {paymentMethod === 'mobile' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    required
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    We support bKash, Nagad, and Rocket
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </form>
            )}

            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Card Number</label>
                  <Input
                    required
                    type="text"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input
                      required
                      type="text"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVV</label>
                    <Input
                      required
                      type="text"
                      placeholder="123"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPopup;