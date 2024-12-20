"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  description: string;
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  priority: number;
  isActive: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const SubscriptionPlansPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [user] = useAuthState(auth);
  const router = useRouter();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: '💳'
    },
    {
      id: 'mobile',
      name: 'Mobile Banking',
      description: 'Pay using mobile banking',
      icon: '📱'
    }
  ];

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const plansQuery = query(
        collection(db, 'subscription_packages'),
        orderBy('priority')
      );
      const snapshot = await getDocs(plansQuery);
      const plansData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionPlan))
        .filter(plan => plan.isActive);
      
      setPlans(plansData);
    } catch (err) {
      const errorMessage = 'Failed to load subscription plans. Please try again.';
      console.error('Error fetching plans:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast.error('Please sign in to continue');
      router.push('/login');
      return;
    }

    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setLoading(true);

      // Calculate subscription duration based on billing cycle
      const now = new Date();
      const durationInDays = selectedPlan.billingCycle === 'monthly' ? 30 : 365;
      const endDate = new Date(now.getTime() + (durationInDays * 24 * 60 * 60 * 1000));

      // Create subscription
      const subscriptionData = {
        userId: user!.uid,
        packageId: selectedPlan.id,
        packageName: selectedPlan.name,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        billingCycle: selectedPlan.billingCycle,
        price: selectedPlan.price,
        libraryAccess: selectedPlan.libraryAccess,
        licenseType: selectedPlan.licenseType,
        totalDevices: selectedPlan.totalDevices,
        typeToolAccess: selectedPlan.typeToolAccess,
        textGenerationLimit: selectedPlan.textGenerationLimit,
        paymentStatus: 'completed',
        paymentMethod: paymentMethod,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);

      // Update user's subscription status
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, {
        is_subscriber: true,
        currentSubscriptionId: subscriptionRef.id,
        updatedAt: Timestamp.fromDate(now)
      });

      setIsOpen(false);
      router.push('/payment/successful');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      router.push('/payment/failed');
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  const renderPaymentUI = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      <div className="space-y-4">
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="gap-6"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex items-center gap-2">
                <span className="text-xl">{method.icon}</span>
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between mb-2">
            <span>Plan</span>
            <span>{selectedPlan?.name}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Amount</span>
            <span className="font-semibold">৳{selectedPlan?.price}</span>
          </div>
          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="icon"
        className="rounded-full bg-red-500 text-white hover:bg-red-600 hover:text-white text-2xl h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px] h-[95vh] md:h-auto md:max-h-[90vh] p-0">
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="p-4 sm:p-6 flex-shrink-0 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
                {showPayment ? 'Complete Payment' : 'Choose Your Subscription Plan'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              {showPayment ? renderPaymentUI() : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-4 max-w-5xl mx-auto">
                  {loading ? (
                    <div className="col-span-3 text-center py-12">
                      Loading plans...
                    </div>
                  ) : error ? (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button 
                        variant="outline" 
                        onClick={fetchPlans}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-500">No subscription plans available.</p>
                    </div>
                  ) : (
                    plans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={`relative p-6 lg:p-8 flex flex-col ${
                          plan.priority === 1 ? 'border-2 border-blue-500 shadow-lg' : ''
                        }`}
                      >
                        {plan.priority === 1 && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Recommended
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center mb-6">
                          <h3 className="text-xl lg:text-2xl font-bold mb-2">{plan.name}</h3>
                          <div className="text-3xl lg:text-4xl font-bold mb-1">
                            <span className="font-normal text-xl lg:text-2xl">৳</span> {plan.price}
                          </div>
                          <div className="text-gray-500 text-base lg:text-lg">
                            per {plan.billingCycle === 'monthly' ? 'month' : 'year'}
                          </div>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>
                              {plan.libraryAccess === 'entire' ? 'Full Library Access' : 'Free Library Only'}
                            </span>
                          </div>
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{plan.licenseType.charAt(0).toUpperCase() + plan.licenseType.slice(1)} License</span>
                          </div>
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{plan.totalDevices} {plan.totalDevices === 1 ? 'Device' : 'Devices'}</span>
                          </div>
                          {plan.typeToolAccess && (
                            <div className="flex items-center text-base lg:text-lg">
                              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span>{plan.textGenerationLimit} Daily Text Generations</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full mt-6 py-6 text-base lg:text-lg font-semibold"
                          variant={plan.priority === 1 ? "default" : "outline"}
                          onClick={() => handleSelectPlan(plan)}
                        >
                          Select Plan
                        </Button>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansPopup;