"use client"
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Type, AlertCircle, Monitor, Key, Library, Crown, BarChart3, History } from "lucide-react";
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import toast from 'react-hot-toast';
import { Subscription, BasicSubscription, TypeToolSubscription } from '@/types/subscription';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';

export default function SubscriptionDetails() {
  const [user] = useAuthState(auth);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'subscriptions'),
          where('userId', '==', user.uid),
          where('status', '==', 'active')
        );
        
        const querySnapshot = await getDocs(q);
        const subs = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Determine subscription type and map fields accordingly
          if (data.typeToolName) {
            return {
              id: doc.id,
              ...data,
              type: 'type_tool' as const,
              name: data.typeToolName,
              dailyLimit: data.textGenerationLimit,
              textLengthLimit: data.textLengthLimit,
              generationsUsedToday: 0, // You'll need to track this
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            } as TypeToolSubscription;
          } else {
            return {
              id: doc.id,
              ...data,
              type: 'basic' as const,
              name: data.packageName,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            } as BasicSubscription;
          }
        });
        
        setSubscriptions(subs);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        toast.error('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const renderSubscriptionCard = (subscription: Subscription) => {
    const endDate = new Date(subscription.endDate);
    const startDate = new Date(subscription.startDate);
    const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const subscriptionAge = formatDistanceToNow(startDate, { addSuffix: true });

    // Helper function to format billing cycle
    const getBillingText = (subscription: Subscription) => {
      if (subscription.type === 'basic') {
        const basicSub = subscription as BasicSubscription;
        return basicSub.billingCycle ? `per ${basicSub.billingCycle}` : 'subscription';
      }
      return 'one-time';
    };

    return (
      <Card key={subscription.id} className="p-6 space-y-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          {subscription.type === 'basic' ? (
            <Crown className="w-full h-full" />
          ) : (
            <Type className="w-full h-full" />
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start relative">
          <div>
            <h3 className="text-lg font-bold">{subscription.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-bold text-red-600">৳{subscription.price}</p>
              <span className="text-sm text-gray-500">
                {getBillingText(subscription)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Subscribed {subscriptionAge}
            </p>
          </div>
          {daysLeft <= 5 && (
            <div className="flex items-center text-amber-500 text-sm bg-amber-50 px-2 py-1 rounded">
              <AlertCircle className="h-4 w-4 mr-1" />
              Expires soon
            </div>
          )}
        </div>

        {/* Subscription Period */}
        <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Subscription Period</span>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
            </div>
            <div className="text-xs text-gray-500">
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {subscription.type === 'type_tool' ? (
            // Type Tool Features
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-500" />
                    <span>Daily Generations</span>
                  </div>
                  <span className="font-medium">
                    {(subscription as TypeToolSubscription).generationsUsedToday} / 
                    {(subscription as TypeToolSubscription).dailyLimit}
                  </span>
                </div>
                <Progress 
                  value={((subscription as TypeToolSubscription).generationsUsedToday / 
                         (subscription as TypeToolSubscription).dailyLimit) * 100} 
                  className="h-2" 
                />
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-gray-500" />
                  <span>Character Limit</span>
                </div>
                <span className="font-medium">
                  {(subscription as TypeToolSubscription).textLengthLimit} characters
                </span>
              </div>
            </>
          ) : (
            // Basic Subscription Features
            <div className="grid grid-cols-1 gap-3">
              {(subscription as BasicSubscription).typeToolAccess && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-gray-500" />
                      <span>Daily Generations</span>
                    </div>
                    <span className="font-medium">
                      0 / {(subscription as BasicSubscription).textGenerationLimit}
                    </span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Library className="h-4 w-4 text-gray-500" />
                  <span>Library Access</span>
                </div>
                <span className="font-medium">
                  {(subscription as BasicSubscription).libraryAccess === 'entire' 
                    ? 'Full Library' 
                    : 'Free Library Only'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gray-500" />
                  <span>License Type</span>
                </div>
                <span className="font-medium">
                  {(subscription as BasicSubscription).licenseType === 'both' 
                    ? 'Private & Commercial Use'
                    : `${(subscription as BasicSubscription).licenseType.charAt(0).toUpperCase() + 
                        (subscription as BasicSubscription).licenseType.slice(1)} Use`}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-gray-500" />
                  <span>Devices</span>
                </div>
                <span className="font-medium">
                  {(subscription as BasicSubscription).totalDevices} 
                  {(subscription as BasicSubscription).totalDevices === 1 ? ' Device' : ' Devices'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Analytics & History Links */}
        <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t">
          <Link 
            href={`/analytics/${subscription.type}/${subscription.id}`}
            className="flex items-center justify-center gap-2 text-sm p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link 
            href={`/history/${subscription.type}/${subscription.id}`}
            className="flex items-center justify-center gap-2 text-sm p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <History className="h-4 w-4" />
            <span>Usage History</span>
          </Link>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Crown className="h-6 w-6" />
        Your Active Subscriptions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.map(renderSubscriptionCard)}
      </div>
    </div>
  );
} 