'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface UsageData {
  date: string;
  generations: number;
  characters: number;
}

export default function SubscriptionAnalytics() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const usageRef = collection(db, 'usage_logs');
        const q = query(
          usageRef,
          where('subscriptionId', '==', params.id),
          orderBy('date', 'desc'),
          limit(30)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          date: doc.data().date,
          generations: doc.data().generations,
          characters: doc.data().characters
        }));

        setUsageData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Subscription Analytics</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Generations</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="generations" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Characters Generated</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="characters" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
} 