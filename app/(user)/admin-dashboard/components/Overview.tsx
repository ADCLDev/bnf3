import { useEffect, useState } from 'react';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AdminModel, AdminOverviewStats, AdminActivity } from '@/lib/models/admin';

export const Overview = () => {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewStats, recentActivities] = await Promise.all([
          AdminModel.getOverviewStats(),
          AdminModel.getRecentActivities(4)
        ]);
        
        setStats(overviewStats);
        setActivities(recentActivities);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenue.growth > 0 ? '+' : ''}{stats.revenue.growth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.growth > 0 ? '+' : ''}{stats.users.growth.toFixed(1)}% growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Fonts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fonts.pending}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptions.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.subscriptions.growth > 0 ? '+' : ''}{stats.subscriptions.growth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.severity === 'error' ? 'bg-red-500' :
                      activity.severity === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span>{activity.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {activity.timestamp.toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 