export interface PackageAnalytics {
  id: string;
  name: string;
  price: number;
  features: string[];
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyRevenue: number;
  growthRate: number;
  usageMetrics: {
    downloads: number;
    textGeneration: number;
  };
} 