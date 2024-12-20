interface FirestoreData {
  id: string;
  isActive: boolean;
  allowAnonymous?: boolean;
  allowRegularUsers?: boolean;
  allowSubscribers?: boolean;
  [key: string]: any;
}

export interface SubscriptionPackage {
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

export interface GiftCard {
  id: string;
  name: string;
  amount: number;
  bonusAmount: number;
  validityDays: number;
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  isActive: boolean;
  description: string;
}

export interface TypeTool {
  id: string;
  name: string;
  dailyLimit: number;
  textLength: number;
  description: string;
  isActive: boolean;
  requiresAuth: boolean;
  isDefault: boolean;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  trialDays: number;
}

export interface PurchaseItem {
  name: string;
  amount: number;
  type: 'subscription' | 'gift' | 'tool';
} 