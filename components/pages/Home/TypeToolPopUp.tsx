// components/pages/Home/TypeToolPopUp
"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Check, Type } from 'lucide-react';
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
  DocumentData, 
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ToolSubscription {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  dailyLimit: number;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  requiresAuth: boolean;
  textLength: number;
  textLengthLimit: number;
  trialDays: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  usageCount: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const TypeToolPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tools, setTools] = useState<ToolSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<ToolSubscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);

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

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const toolsRef = collection(db, 'type_tools');
        const toolsSnap = await getDocs(toolsRef);
        const toolsData = toolsSnap.docs
          .map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data()
          } as ToolSubscription))
          .filter(tool => tool.price > 0);
        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load type tool packages');
      }
    };
    fetchTools();
  }, []);

  const handleSubscription = async (tool: ToolSubscription) => {
    if (!user) {
      toast.error('Please sign in to continue');
      router.push('/login');
      return;
    }

    setSelectedTool(tool);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!selectedTool || !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      const subscriptionRef = await createSubscription(selectedTool, 'pending');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update subscription status
      await updateDoc(doc(db, 'subscriptions', subscriptionRef.id), {
        paymentStatus: 'completed',
        status: 'active',
        updatedAt: Timestamp.fromDate(new Date())
      });

      // Update user
      await updateDoc(doc(db, 'users', user!.uid), {
        is_subscriber: true,
        currentTypeToolSubscriptionId: subscriptionRef.id,
        updatedAt: Timestamp.fromDate(new Date())
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

  const createSubscription = async (tool: ToolSubscription, status: 'free' | 'pending' | 'active') => {
    try {
      const now = new Date();
      
      let durationInDays = 30; // default to 30 days
      if (tool.billingPeriod === 'monthly') {
        durationInDays = 30;
      } else if (tool.billingPeriod === 'yearly') {
        durationInDays = 365;
      }
      
      const endDate = new Date(now.getTime() + (durationInDays * 24 * 60 * 60 * 1000));

      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date calculated');
      }

      const subscriptionData = {
        userId: user!.uid,
        typeToolId: tool.id,
        typeToolName: tool.name,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        status,
        dailyLimit: tool.dailyLimit,
        textLengthLimit: tool.textLengthLimit,
        price: tool.price,
        billingPeriod: tool.billingPeriod,
        paymentStatus: status === 'free' ? 'completed' : 'pending',
        type: 'type_tool',
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);

      if (status === 'free') {
        const userRef = doc(db, 'users', user!.uid);
        await updateDoc(userRef, {
          is_subscriber: true,
          currentTypeToolSubscriptionId: subscriptionRef.id,
          updatedAt: Timestamp.fromDate(now)
        });
      }

      return subscriptionRef;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription. Please try again.');
    }
  };

  const getToolStyles = () => {
    return {
      card: 'bg-white border-gray-200 hover:border-gray-300',
      button: 'bg-red-500 hover:bg-red-600 text-white',
      badge: 'bg-red-100 text-red-800',
      icon: 'text-red-500'
    };
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
            <span>{selectedTool?.name}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Amount</span>
            <span className="font-semibold">${selectedTool?.price}</span>
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
        <DialogContent 
          className="w-[95vw] max-w-[1200px] h-[95vh] md:h-auto md:max-h-[90vh] p-0"
          aria-describedby="subscription-plans-description"
        >
          <div id="subscription-plans-description" className="sr-only">
            Choose from our available subscription plans for the Type Tool
          </div>
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="p-4 sm:p-6 flex-shrink-0 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Type className="h-6 w-6" />
                {showPayment ? 'Complete Payment' : 'Choose Your Type Tool Plan'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              {showPayment ? renderPaymentUI() : (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-4 max-w-5xl mx-auto">
                {tools.map((tool) => {
                      const styles = getToolStyles();
                  
                  return (
                    <Card 
                          key={tool.id} 
                      className={`relative p-6 lg:p-8 flex flex-col ${styles.card} border-2`}
                    >
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${styles.badge}`}>
                              {tool.name}
                        </span>
                      </div>
                      
                      <div className="text-center mb-6">
                        <div className="text-3xl lg:text-4xl font-bold mb-1">
                              ${tool.price}
                        </div>
                            <div className="text-gray-600 text-base lg:text-lg">per {tool.billingPeriod}</div>
                      </div>
                      
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center text-base lg:text-lg">
                          <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                              <span>{tool.dailyLimit} Generations per day</span>
                        </div>
                        <div className="flex items-center text-base lg:text-lg">
                          <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                              <span>Up to {tool.textLengthLimit} characters</span>
                        </div>
                        <div className="flex items-center text-base lg:text-lg">
                          <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                              <span>{tool.description}</span>
                        </div>
                            {tool.trialDays > 0 && (
                        <div className="flex items-center text-base lg:text-lg">
                          <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                                <span>{tool.trialDays} days trial</span>
                        </div>
                            )}
                      </div>
                      
                      <Button 
                        className={`w-full mt-6 py-6 text-base lg:text-lg font-semibold ${styles.button}`}
                            onClick={() => handleSubscription(tool)}
                            disabled={loading || !tool.isActive}
                      >
                            {loading ? 'Processing...' : `Select ${tool.name} Plan`}
                      </Button>
                    </Card>
                  );
                })}
              </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TypeToolPopup;