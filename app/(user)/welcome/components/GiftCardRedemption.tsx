'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift } from "lucide-react";

export const GiftCardRedemption = () => (
  <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
    <CardContent className="pt-6">
      <div className="flex items-center gap-4 mb-6">
        <Gift size={32} className="text-purple-600 flex-shrink-0" />
        <div>
          <div className="text-xl font-bold mb-1">Have a Gift Card?</div>
          <p className="text-gray-600 text-sm">
            Enter your gift card code below to redeem your subscription
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Input 
          placeholder="Enter gift card code" 
          className="text-center"
        />
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          Redeem Now
        </Button>
      </div>
      <p className="text-xs text-gray-600 mt-4">
        Gift cards are non-refundable and cannot be exchanged for cash
      </p>
    </CardContent>
  </Card>
); 