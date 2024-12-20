/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  getFirestore, 
  collection, 
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
/* eslint-enable @typescript-eslint/no-unused-vars */

// Define a more specific type for metadata
interface ActivityMetadata {
  fontId?: string;
  subscriptionId?: string;
  amount?: number;
  status?: string;
  reason?: string;
  [key: string]: string | number | undefined;
}

export interface AdminOverviewStats {
  revenue: {
    total: number;
    growth: number;
    lastUpdate: Date;
    breakdown: {
      subscriptions: number;
      oneTime: number;
      giftCards: number;
    };
  };
  users: {
    total: number;
    active: number;
    growth: number;
    breakdown: {
      subscribers: number;
      contributors: number;
      free: number;
    };
  };
  fonts: {
    total: number;
    pending: number;
    breakdown: {
      approved: number;
      rejected: number;
      inReview: number;
    };
  };
  subscriptions: {
    active: number;
    growth: number;
    breakdown: {
      basic: number;
      pro: number;
      enterprise: number;
    };
  };
}

export interface AdminActivity {
  id: string;
  type: 'font_submission' | 'subscription_purchase' | 'user_action' | 'system_event';
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: ActivityMetadata;
  severity: 'info' | 'warning' | 'error';
}

export class AdminModel {
  static async getOverviewStats(): Promise<AdminOverviewStats> {
    try {
      // Get revenue data
      const revenueData = await this.getRevenueStats();
      
      // Get user stats
      const userStats = await this.getUserStats();
      
      // Get font stats
      const fontStats = await this.getFontStats();
      
      // Get subscription stats
      const subscriptionStats = await this.getSubscriptionStats();

      return {
        revenue: revenueData,
        users: userStats,
        fonts: fontStats,
        subscriptions: subscriptionStats
      };
    } catch (error) {
      console.error('Error fetching admin overview stats:', error);
      throw error;
    }
  }

  private static async getRevenueStats() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const revenueQuery = query(
      collection(db, 'transactions'),
      where('timestamp', '>', lastMonth)
    );

    const snapshot = await getDocs(revenueQuery);
    const total = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.amount || 0);
    }, 0);

    const subscriptions = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return data.type === 'subscription' ? acc + (data.amount || 0) : acc;
    }, 0);

    const oneTime = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return data.type === 'one_time' ? acc + (data.amount || 0) : acc;
    }, 0);

    const giftCards = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return data.type === 'gift_card' ? acc + (data.amount || 0) : acc;
    }, 0);

    // Calculate growth
    const previousMonthQuery = query(
      collection(db, 'transactions'),
      where('timestamp', '<=', lastMonth)
    );
    const previousSnapshot = await getDocs(previousMonthQuery);
    const previousTotal = previousSnapshot.docs.reduce((acc, doc) => 
      acc + (doc.data().amount || 0), 0);

    const growth = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;

    return {
      total,
      growth,
      lastUpdate: new Date(),
      breakdown: {
        subscriptions,
        oneTime,
        giftCards
      }
    };
  }

  private static async getUserStats() {
    const usersQuery = query(collection(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    
    const total = snapshot.size;
    const stats = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (data.lastActive && data.lastActive.toDate() > thirtyDaysAgo) {
        acc.active++;
      }
      if (data.is_subscriber) acc.subscribers++;
      if (data.is_contributor) acc.contributors++;
      if (!data.is_subscriber && !data.is_contributor) acc.free++;

      return acc;
    }, { active: 0, subscribers: 0, contributors: 0, free: 0 });

    // Calculate growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthQuery = query(
      collection(db, 'users'),
      where('createdAt', '>', lastMonth)
    );
    const newUsersSnapshot = await getDocs(lastMonthQuery);
    const growth = (newUsersSnapshot.size / total) * 100;

    return {
      total,
      active: stats.active,
      growth,
      breakdown: {
        subscribers: stats.subscribers,
        contributors: stats.contributors,
        free: stats.free
      }
    };
  }

  private static async getFontStats() {
    const fontsQuery = query(collection(db, 'fonts'));
    const snapshot = await getDocs(fontsQuery);
    
    const total = snapshot.size;
    const stats = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      switch(data.status) {
        case 'approved': acc.approved++; break;
        case 'rejected': acc.rejected++; break;
        case 'pending': acc.inReview++; break;
      }
      return acc;
    }, { approved: 0, rejected: 0, inReview: 0 });

    return {
      total,
      pending: stats.inReview,
      breakdown: stats
    };
  }

  private static async getSubscriptionStats() {
    const subsQuery = query(
      collection(db, 'subscriptions'),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(subsQuery);
    
    const active = snapshot.size;
    const stats = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      switch(data.plan) {
        case 'basic': acc.basic++; break;
        case 'pro': acc.pro++; break;
        case 'enterprise': acc.enterprise++; break;
      }
      return acc;
    }, { basic: 0, pro: 0, enterprise: 0 });

    // Calculate growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthQuery = query(
      collection(db, 'subscriptions'),
      where('createdAt', '>', lastMonth),
      where('status', '==', 'active')
    );
    const newSubsSnapshot = await getDocs(lastMonthQuery);
    const growth = active > 0 ? (newSubsSnapshot.size / active) * 100 : 0;

    return {
      active,
      growth,
      breakdown: stats
    };
  }

  static async getRecentActivities(limitCount: number = 5): Promise<AdminActivity[]> {
    try {
      const activitiesQuery = query(
        collection(db, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(activitiesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as AdminActivity[];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }
} 