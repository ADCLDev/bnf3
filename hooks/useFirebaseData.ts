import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SubscriptionPackage, GiftCard, TypeTool } from '@/app/(user)/welcome/types';

interface FirebaseData {
  subscriptions: SubscriptionPackage[];
  giftCards: GiftCard[];
  typeTools: TypeTool[];
}

export function useFirebaseData() {
  console.log('useFirebaseData: Hook initializing');
  
  const [data, setData] = useState<FirebaseData>({
    subscriptions: [],
    giftCards: [],
    typeTools: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useFirebaseData: Starting data fetch');
    
    const fetchData = async () => {
      try {
        // Fetch subscriptions
        console.log('Fetching subscriptions...');
        const subsQuery = query(
          collection(db, 'subscription_packages'),
          orderBy('priority')
        );
        const subsSnapshot = await getDocs(subsQuery);
        const subscriptions = subsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionPackage))
          .filter(pkg => pkg.isActive);
        console.log('Subscriptions fetched:', subscriptions);

        // Fetch gift cards
        console.log('Fetching gift cards...');
        const cardsQuery = query(
          collection(db, 'gift_cards'),
          orderBy('amount')
        );
        const cardsSnapshot = await getDocs(cardsQuery);
        const giftCards = cardsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as GiftCard))
          .filter(card => card.isActive);
        console.log('Gift cards fetched:', giftCards);

        // Fetch type tools
        console.log('Fetching type tools...');
        const toolsQuery = query(collection(db, 'type_tools'));
        const toolsSnapshot = await getDocs(toolsQuery);
        const typeTools = toolsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as TypeTool))
          .filter(tool => tool.isActive && !tool.isDefault);
        console.log('Type tools fetched:', typeTools);

        setData({ subscriptions, giftCards, typeTools });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('useFirebaseData: Returning state', { data, loading, error });
  return { data, loading, error };
} 