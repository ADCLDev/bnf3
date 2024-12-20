'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface UsageLog {
  id: string;
  date: string;
  action: string;
  details: string;
  status: 'success' | 'failed';
}

export default function UsageHistory() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const logsRef = collection(db, 'usage_logs');
        const q = query(
          logsRef,
          where('subscriptionId', '==', params.id),
          orderBy('date', 'desc'),
          limit(100)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UsageLog));

        setLogs(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load usage history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Usage History</h1>
      
      <div className="space-y-4">
        {logs.map(log => (
          <Card key={log.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{log.action}</h3>
                <p className="text-sm text-gray-500">{log.details}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm px-2 py-1 rounded ${
                  log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(log.date), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 