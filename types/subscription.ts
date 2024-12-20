import { Timestamp } from 'firebase/firestore';

// First, let's create common types
export type SubscriptionStatus = 'active' | 'pending' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type BillingCycle = 'monthly' | 'yearly' | 'one-time';
export type LibraryAccess = 'free' | 'entire';
export type LicenseType = 'private' | 'commercial' | 'both';
export type SubscriptionType = 'basic' | 'type_tool';

// Base subscription interface
export interface BaseSubscription {
  id: string;
  userId: string;
  name: string;
  price: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: SubscriptionType;
}

// Type Tool specific features
export interface TypeToolFeatures {
  dailyLimit: number;
  textLengthLimit: number;
  generationsUsedToday: number;
}

// Basic subscription specific features
export interface BasicSubscriptionFeatures {
  libraryAccess: LibraryAccess;
  licenseType: LicenseType;
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  billingCycle: BillingCycle;
}

// Combined subscription types
export interface TypeToolSubscription extends BaseSubscription, TypeToolFeatures {
  type: 'type_tool';
}

export interface BasicSubscription extends BaseSubscription, BasicSubscriptionFeatures {
  type: 'basic';
}

export type Subscription = TypeToolSubscription | BasicSubscription; 