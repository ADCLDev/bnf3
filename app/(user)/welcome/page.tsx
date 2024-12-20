'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift } from "lucide-react";
import WelcomeSection from "@/components/reuseable/WelcomeSection";
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import TypeToolCards from './components/TypeToolCards';
import SubscriptionDetails from './components/SubscriptionDetails';

interface FirestoreData {
  id: string;
  isActive: boolean;
  allowAnonymous: boolean;
  allowSubscribers?: boolean;
  allowRegularUsers?: boolean;
  features?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface SubscriptionPackage extends FirestoreData {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  description: string;
  features: string[];
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  priority: number;
  allowSubscribers: boolean;
  allowRegularUsers: boolean;
}

interface GiftCard extends FirestoreData {
  name: string;
  amount: number;
  bonusAmount: number;
  validityDays: number;
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  description: string;
}

interface TypeTool extends FirestoreData {
  name: string;
  dailyLimit: number;
  textLength: number;
  description: string;
  requiresAuth: boolean;
  isDefault: boolean;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  trialDays: number;
}

export default function Page() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    packages: SubscriptionPackage[];
    giftCards: GiftCard[];
    typeTools: TypeTool[];
  }>({
    packages: [],
    giftCards: [],
    typeTools: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !userProfile) return;
      
      try {
        console.log('Fetching data for user:', userProfile.email);

        // Fetch subscription packages based on user type
        const packagesQuery = query(
          collection(db, 'subscription_packages'),
          orderBy('priority')
        );
        const packagesSnapshot = await getDocs(packagesQuery);
        const packages = packagesSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              features: data.features || [],
            } as SubscriptionPackage;
          })
          .filter(pkg => {
            // Filter out packages based on user type
            if (pkg.isActive) {
              // If user is anonymous, only show packages that allow anonymous users
              if (!user.email) {
                return pkg.allowAnonymous === true;
              }
              // If user is logged in, show appropriate packages
              if (userProfile.is_subscriber) {
                // Show only upgrade packages for subscribers
                return pkg.allowSubscribers === true;
              }
              // For regular logged-in users
              return pkg.allowRegularUsers !== false;
            }
            return false;
          });

        // Fetch gift cards - only for logged-in users
        let giftCards: GiftCard[] = [];
        if (user.email) {
          const cardsQuery = query(
            collection(db, 'gift_cards'),
            orderBy('amount')
          );
          const cardsSnapshot = await getDocs(cardsQuery);
          giftCards = cardsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as GiftCard))
            .filter(card => card.isActive);
        }

        // Fetch type tools based on user type
        const typeToolsQuery = query(collection(db, 'type_tools'));
        const typeToolsSnapshot = await getDocs(typeToolsQuery);
        const typeTools = typeToolsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as TypeTool))
          .filter(tool => {
            if (tool.isActive) {
              // If user is anonymous, only show free tools
              if (!user.email) {
                return tool.price === 0 && tool.allowAnonymous === true;
              }
              // If user is subscriber, show all tools except those restricted
              if (userProfile.is_subscriber) {
                return tool.allowSubscribers !== false;
              }
              // For regular logged-in users
              return tool.allowRegularUsers !== false;
            }
            return false;
          });

        setData({ packages, giftCards, typeTools });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, userProfile, authLoading]);

  const handlePurchase = (
    type: 'subscription' | 'gift' | 'tool', 
    item: SubscriptionPackage | GiftCard | TypeTool
  ) => {
    // Handle purchase logic
    console.log('Purchase:', { type, item });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Early return if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Please sign in to access this page
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <WelcomeSection 
          userName={user?.email ? 
            `${userProfile?.profile.firstName} ${userProfile?.profile.lastName}` :
            'Guest User'
          }
          userInitial={userProfile?.profile.firstName?.[0] || 'G'}
          subscriptionType={userProfile?.is_subscriber ? 'Premium' : 'Free'}
          downloadsAvailable={42}
          memberSince={userProfile?.profile.createdAt instanceof Date ? 
            userProfile.profile.createdAt.toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            }) : 
            'New Member'
          }
        />

        {/* Only show gift card section for logged-in users */}
        {user?.email && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <Gift className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-bold">Have a Gift Card?</h3>
                  <p className="text-sm text-gray-600">Enter your code to redeem</p>
                </div>
              </div>
              <Input placeholder="Enter gift card code" className="mb-4" />
              <Button className="w-full">Redeem Now</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Subscription Packages */}
      {data.packages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Subscription Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.packages.map((pkg) => (
              <Card key={pkg.id} className={pkg.priority === 1 ? 'border-2 border-blue-500 shadow-lg' : ''}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    ৳{pkg.price}
                    <span className="text-sm text-gray-600">/{pkg.billingCycle}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-6">
                    {(pkg.features || []).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchase('subscription', pkg)}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Gift Cards */}
      {data.giftCards.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Gift Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.giftCards.map((card) => (
              <Card key={card.id}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    ৳{card.amount}
                  </div>
                  {card.bonusAmount > 0 && (
                    <div className="text-green-600 text-sm mb-4">
                      +৳{card.bonusAmount} bonus value
                    </div>
                  )}
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="text-sm text-gray-600 mb-6">
                    Valid for {card.validityDays} days
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchase('gift', card)}
                  >
                    Purchase Gift Card
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Type Tools */}
      {data.typeTools.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Type Tools</h2>
          <TypeToolCards 
            typeTools={data.typeTools} 
            onPurchase={handlePurchase} 
          />
        </div>
      )}

      {/* Contributor Section */}
      <div className="mt-16 text-center max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Become a Contributor</h2>
        <p className="text-gray-600 mb-6">
          Join our community of innovators and help shape the future of technology. Share your expertise, collaborate on cutting-edge projects, and make a difference.
        </p>
        <Link href="/apply-for-contributor-access">
          <Button className="bg-blue-600 hover:bg-blue-700 mb-4">
            Submit Contributor Application
          </Button>
        </Link>
        
        <p className="text-sm text-gray-500">
          By submitting, you agree to our{" "}
          <Link 
            href="/legal/terms-of-service/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Contributor Terms
          </Link>
        </p>
      </div>

      {/* Add the subscription details component */}
      <SubscriptionDetails />
    </div>
  );
}