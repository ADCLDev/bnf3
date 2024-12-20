import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  getDocs, 
  where, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  pendingFonts: number;
  activeSubscriptions: number;
  recentActivities: Activity[];
  userGrowth: number;
  subscriptionGrowth: number;
}

export interface Activity {
  id: string;
  type: 'font_submission' | 'subscription_purchase' | 'gift_card_redemption' | 'type_tool_update';
  description: string;
  timestamp: Timestamp;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AdminModel {
  static async getStats(): Promise<AdminStats> {
    try {
      // Get total users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      // Get users from last month for growth calculation
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthQuery = query(
        collection(db, 'users'),
        where('createdAt', '>', lastMonth)
      );
      const lastMonthSnapshot = await getDocs(lastMonthQuery);
      const userGrowth = (lastMonthSnapshot.size / totalUsers) * 100;

      // Get pending fonts
      const pendingFontsQuery = query(
        collection(db, 'fonts'),
        where('status', '==', 'pending')
      );
      const pendingFontsSnapshot = await getDocs(pendingFontsQuery);
      const pendingFonts = pendingFontsSnapshot.size;

      // Get active subscriptions
      const activeSubsQuery = query(
        collection(db, 'subscriptions'),
        where('status', '==', 'active')
      );
      const activeSubsSnapshot = await getDocs(activeSubsQuery);
      const activeSubscriptions = activeSubsSnapshot.size;

      // Calculate total revenue
      const subscriptionsSnapshot = await getDocs(collection(db, 'subscriptions'));
      let totalRevenue = 0;
      subscriptionsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalRevenue += data.amount || 0;
      });

      // Get recent activities
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('timestamp', '>', lastMonth)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const recentActivities = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];

      // Calculate subscription growth
      const lastMonthSubsQuery = query(
        collection(db, 'subscriptions'),
        where('createdAt', '>', lastMonth),
        where('status', '==', 'active')
      );
      const lastMonthSubsSnapshot = await getDocs(lastMonthSubsQuery);
      const subscriptionGrowth = (lastMonthSubsSnapshot.size / activeSubscriptions) * 100;

      return {
        totalRevenue,
        totalUsers,
        pendingFonts,
        activeSubscriptions,
        recentActivities,
        userGrowth,
        subscriptionGrowth
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDocs(
        query(
          collection(db, 'users'), 
          where('uid', '==', userId)
        )
      );
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        return userData.is_admin === true;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
} 