'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionPackage } from '../types';

interface SubscriptionPlansProps {
  subscriptions: SubscriptionPackage[];
  onPurchase: (name: string, amount: number, type: 'subscription') => void;
}

export const SubscriptionPlans = ({ subscriptions, onPurchase }: SubscriptionPlansProps) => (
  <div className="mb-16 mt-8">
    <h2 className="text-2xl font-bold text-center mb-8">Subscription Plans</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {subscriptions.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.priority === 1 ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
          {/* Card content */}
        </Card>
      ))}
    </div>
  </div>
); 