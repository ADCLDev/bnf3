import { Type } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TypeTool {
  id: string;
  name: string;
  dailyLimit: number;
  textLength: number;
  description: string;
  requiresAuth: boolean;
  isDefault: boolean;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  trialDays: number;
  isActive: boolean;
  allowAnonymous: boolean;
}

interface TypeToolCardsProps {
  typeTools: TypeTool[];
  onPurchase: (type: 'subscription' | 'gift' | 'tool', item: any) => void;
}

const TypeToolCards = ({ typeTools, onPurchase }: TypeToolCardsProps) => {
  // Filter to only show tools with price
  const paidTools = typeTools.filter(tool => tool.price && tool.price > 0);

  if (paidTools.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {paidTools.map((tool) => (
        <Card key={tool.id} className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              <Type className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">{tool.name}</h3>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">
                ৳{tool.price}
                <span className="text-sm text-gray-600">
                  {tool.billingPeriod === 'one-time' ? '' : 
                   `/${tool.billingPeriod === 'monthly' ? 'mo' : 'yr'}`}
                </span>
              </div>
              {tool.trialDays > 0 && (
                <div className="text-green-600 text-sm">
                  {tool.trialDays} days free trial
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-6">{tool.description}</p>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Daily Limit:</span>
                <span>{tool.dailyLimit} uses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Text Length:</span>
                <span>{tool.textLength} chars</span>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => onPurchase('tool', tool)}
            >
              {tool.trialDays > 0 ? 'Start Free Trial' : 'Purchase Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TypeToolCards;