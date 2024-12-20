// components/reuseable/CheckoutDialog
'use client'
import React, { useState } from 'react';
import { CreditCard, Phone } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileBank {
  id: string;
  name: string;
  logo: string;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onCheckoutComplete: () => void;
}

const mobileBanks: MobileBank[] = [
  { id: 'bkash', name: 'bKash', logo: '৳' },
  { id: 'nagad', name: 'Nagad', logo: '৳' },
  { id: 'ucash', name: 'UCash', logo: '৳' }
];

type PaymentMethod = 'card' | 'mobile';

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ 
  open, 
  onOpenChange, 
  total, 
  onCheckoutComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [mobileBank, setMobileBank] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const validateMobileNumber = (number: string): boolean => {
    const regex = /^01[3-9]\d{8}$/;
    return regex.test(number);
  };

  const isMobileNumberValid = validateMobileNumber(mobileNumber);

  const [mounted, setMounted] = useState<boolean>(false);

  // Handle mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = (): void => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      onCheckoutComplete();
      
      // Reset form
      setPaymentMethod("card");
      setMobileBank("");
      setMobileNumber("");
      
      if (mounted) {
        window.location.href = '/payment/success';
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-medium mb-2">Select Payment Method</h3>
            <RadioGroup 
              defaultValue="card" 
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="flex items-center space-x-3 cursor-pointer">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span>Mobile Banking</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'mobile' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mobileBanking">Select Mobile Banking Service</Label>
                <Select 
                  value={mobileBank} 
                  onValueChange={setMobileBank}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileBanks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex items-center space-x-2">
                          <span>{bank.logo}</span>
                          <span>{bank.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {mobileBank && (
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input 
                    id="mobileNumber"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={mobileNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value)}
                    className={!isMobileNumberValid && mobileNumber ? "border-red-500" : ""}
                  />
                  {!isMobileNumberValid && mobileNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid Bangladeshi mobile number
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total Amount</span>
              <span className="font-medium">৳{total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={isProcessing || (paymentMethod === 'mobile' && (!mobileBank || !isMobileNumberValid))}
            >
              {isProcessing ? "Processing..." : `Pay ৳${total.toFixed(2)}`}
            </Button>

            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;