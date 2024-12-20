// components/reuseable/WelcomeSection
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Crown, Download, Star } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  userInitial: string;
  subscriptionType?: string;
  downloadsAvailable?: number;
  memberSince?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName = 'Abdullah Al Rajin',
  userInitial = 'A',
  subscriptionType = 'Premium',
  downloadsAvailable = 42,
  memberSince = 'Oct 2023'
}) => {
  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border rounded-xl shadow-sm p-6">
      <CardHeader className="p-0 space-y-0 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userInitial}
            </div>
            {subscriptionType === 'Premium' && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1.5">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back,</h1>
              <div className="px-3 py-1 bg-red-50 rounded-full">
                <span className="text-sm font-medium text-red-600">Premium Member</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-500">{userName}</h2>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-6">
          <p className="text-gray-600 text-lg">
            Explore our exciting features, manage your subscriptions, and unlock new possibilities with our platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">{memberSince}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Downloads Left</p>
                <p className="font-medium text-gray-900">{downloadsAvailable} remaining</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;