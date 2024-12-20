import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  getDocs, 
  where, 
  Timestamp,
  DocumentSnapshot,
  orderBy,
  limit 
} from 'firebase/firestore';

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
  metadata?: Record<string, any>;
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
    let total = 0;
    let subscriptions = 0;
    let oneTime = 0;
    let giftCards = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.amount || 0;
      
      switch(data.type) {
        case 'subscription':
          subscriptions += data.amount || 0;
          break;
        case 'one_time':
          oneTime += data.amount || 0;
          break;
        case 'gift_card':
          giftCards += data.amount || 0;
          break;
      }
    });

    // Calculate growth
    const previousMonthQuery = query(
      collection(db, 'transactions'),
      where('timestamp', '<=', lastMonth)
    );
    const previousSnapshot = await getDocs(previousMonthQuery);
    let previousTotal = 0;
    previousSnapshot.forEach((doc) => {
      previousTotal += doc.data().amount || 0;
    });

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
    
    let total = snapshot.size;
    let subscribers = 0;
    let contributors = 0;
    let free = 0;
    let active = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.lastActive && data.lastActive.toDate() > thirtyDaysAgo) {
        active++;
      }
      if (data.is_subscriber) subscribers++;
      if (data.is_contributor) contributors++;
      if (!data.is_subscriber && !data.is_contributor) free++;
    });

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
      active,
      growth,
      breakdown: {
        subscribers,
        contributors,
        free
      }
    };
  }

  private static async getFontStats() {
    const fontsQuery = query(collection(db, 'fonts'));
    const snapshot = await getDocs(fontsQuery);
    
    let total = snapshot.size;
    let approved = 0;
    let rejected = 0;
    let inReview = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      switch(data.status) {
        case 'approved':
          approved++;
          break;
        case 'rejected':
          rejected++;
          break;
        case 'pending':
          inReview++;
          break;
      }
    });

    return {
      total,
      pending: inReview,
      breakdown: {
        approved,
        rejected,
        inReview
      }
    };
  }

  private static async getSubscriptionStats() {
    const subsQuery = query(
      collection(db, 'subscriptions'),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(subsQuery);
    
    let active = snapshot.size;
    let basic = 0;
    let pro = 0;
    let enterprise = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      switch(data.plan) {
        case 'basic':
          basic++;
          break;
        case 'pro':
          pro++;
          break;
        case 'enterprise':
          enterprise++;
          break;
      }
    });

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
      breakdown: {
        basic,
        pro,
        enterprise
      }
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