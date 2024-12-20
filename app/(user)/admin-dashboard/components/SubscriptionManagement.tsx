import { useState, useEffect } from 'react';
import { Package, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPackageForm } from './SubscriptionPackageForm';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { formatCurrency } from '@/lib/utils';

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  priority: number;
  isActive: boolean;
}

export const SubscriptionManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      const packagesQuery = query(
        collection(db, 'subscription_packages'),
        orderBy('priority')
      );
      const snapshot = await getDocs(packagesQuery);
      const packagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionPackage[];
      setPackages(packagesData);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load subscription packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deleteDoc(doc(db, 'subscription_packages', packageId));
        await fetchPackages();
      } catch (err) {
        console.error('Error deleting package:', err);
        setError('Failed to delete package');
      }
    }
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscription Packages</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={!pkg.isActive ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{pkg.name}</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="text-2xl font-bold">
                  {formatCurrency(pkg.price)}/{pkg.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </p>
                <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Library Access:</span>{' '}
                  {pkg.libraryAccess === 'entire' ? 'Entire Library' : 'Free Library Only'}
                </p>
                <p>
                  <span className="font-medium">License:</span>{' '}
                  {pkg.licenseType === 'both' 
                    ? 'Private & Commercial Use' 
                    : `${pkg.licenseType.charAt(0).toUpperCase() + pkg.licenseType.slice(1)} Use Only`}
                </p>
                <p>
                  <span className="font-medium">Devices:</span> {pkg.totalDevices}
                </p>
                {pkg.typeToolAccess && (
                  <p>
                    <span className="font-medium">Daily Text Generation:</span>{' '}
                    {pkg.textGenerationLimit} uses
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <SubscriptionPackageForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchPackages}
        />
      )}
    </div>
  );
}; 