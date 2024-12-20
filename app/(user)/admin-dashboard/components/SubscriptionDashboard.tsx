import React, { useState, useEffect } from 'react';
import { Package, Users, ArrowDownRight, DollarSign, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AdminModel } from '../models/AdminModel';
import { formatCurrency } from '@/lib/utils';
import { SubscriptionPackageForm } from './SubscriptionPackageForm';
import { getSubscriptionPackages, getSubscriptions } from '../lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


interface PackageAnalytics {
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



interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  // Add other package fields as needed
}

const SubscriptionDashboard = () => {

  const [showForm, setShowForm] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  
  const [packageAnalytics, setPackageAnalytics] = useState<PackageAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageAnalytics | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription packages
      const packages = await getSubscriptionPackages();
      console.log('Fetched packages:', packages); // Debug log
      
      if (packages && packages.length > 0) {
        const packagesWithAnalytics = await Promise.all(packages.map(async (pkg: SubscriptionPackage) => {
          // Get subscribers for this package
          const subscriptions = await getSubscriptions();
          const packageSubscriptions = subscriptions.filter(sub => sub.packageId === pkg.id);
          
          return {
            id: pkg.id,
            name: pkg.name || 'Unnamed Package',
            price: pkg.price || 0,
            features: pkg.features || [],
            totalSubscribers: packageSubscriptions.length,
            activeSubscribers: packageSubscriptions.filter(sub => sub.status === 'active').length,
            monthlyRevenue: packageSubscriptions.length * (pkg.price || 0),
            growthRate: 0,
            usageMetrics: {
              downloads: 0,
              textGeneration: 0
            }
          };
        }));

        setPackageAnalytics(packagesWithAnalytics);
      }

      // Fetch admin stats
      const stats = await AdminModel.getStats();
      setAdminStats(stats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditPackage = async (pkg: PackageAnalytics) => {
    try {
      setSelectedPackage(pkg);
      setShowForm(true);
    } catch (error) {
      console.error('Error editing package:', error);
      toast({
        title: "Error",
        description: "Failed to edit package",
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      const packageRef = doc(db, 'subscription_packages', packageId);
      await deleteDoc(packageRef);
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(adminStats?.totalRevenue ?? 0)}</div>
                <p className="text-xs text-muted-foreground">
                  +{adminStats?.subscriptionGrowth?.toFixed(1) ?? '0.0'}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.activeSubscriptions ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{adminStats?.userGrowth?.toFixed(1) ?? '0.0'}% new users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Subscription Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(adminStats?.totalRevenue ?? 0 / adminStats?.activeSubscriptions ?? 0)}
                </div>
                <p className="text-xs text-muted-foreground">Per active subscription</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4%</div>
                <p className="text-xs text-muted-foreground">-0.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={packageAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="monthlyRevenue" 
                        stroke="#8884d8" 
                        name="Monthly Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={packageAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="activeSubscribers" 
                        fill="#82ca9d" 
                        name="Active Subscribers"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="packages">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageAnalytics.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-2xl font-bold">{formatCurrency(pkg.price || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Features</p>
                      <ul className="list-disc list-inside space-y-1">
                        {pkg.features?.map((feature: string, index: number) => (
                          <li key={index} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Statistics</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Active Subscribers</p>
                          <p className="text-sm font-medium">{pkg.activeSubscribers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                          <p className="text-sm font-medium">{formatCurrency(pkg.monthlyRevenue)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => handleEditPackage(pkg)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Add other TabsContent components here */}
      </Tabs>

      {showForm && (
        <SubscriptionPackageForm
          packageToEdit={selectedPackage}
          onClose={() => {
            setShowForm(false);
            setSelectedPackage(null);
            fetchData();
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedPackage(null);
            fetchData();
            toast({
              title: "Success",
              description: selectedPackage ? "Package updated successfully" : "Package created successfully",
            });
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionDashboard;