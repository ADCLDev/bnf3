import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  // Add other fields as needed
}

interface Subscription {
  id: string;
  packageId: string;
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: Timestamp;
  userId: string;
  // Add other subscription fields as needed
}

export const getSubscriptionPackages = async (): Promise<SubscriptionPackage[]> => {
  try {
    const packagesRef = collection(db, 'subscription_packages');
    const packagesSnapshot = await getDocs(packagesRef);
    return packagesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    })) as SubscriptionPackage[];
  } catch (error) {
    console.error('Error fetching subscription packages:', error);
    return [];
  }
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    })) as Subscription[];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}; 