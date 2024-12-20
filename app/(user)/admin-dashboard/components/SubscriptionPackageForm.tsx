import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';
import { PackageAnalytics } from '../types';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface PackageFormData {
  name: string;
  price: number;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  description: string;
  libraryAccess: LibraryAccess;
  licenseType: LicenseType;
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  priority: number;
  isActive: boolean;
}

interface SubscriptionPackageFormProps {
  packageToEdit?: PackageAnalytics | null;
  onClose: () => void;
  onSuccess: () => void;
}

type LibraryAccess = 'free' | 'entire';
type LicenseType = 'private' | 'commercial' | 'both';

export const SubscriptionPackageForm = ({ packageToEdit, onClose, onSuccess }: SubscriptionPackageFormProps) => {
  const [formData, setFormData] = useState<PackageFormData>({
    name: packageToEdit?.name || '',
    price: packageToEdit?.price || 0,
    features: packageToEdit?.features || [''],
    billingCycle: 'monthly',
    description: '',
    libraryAccess: 'free',
    licenseType: 'private',
    totalDevices: 1,
    typeToolAccess: false,
    textGenerationLimit: 0,
    priority: 0,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert formData to a plain object for Firestore
      const packageData = {
        name: formData.name,
        price: formData.price,
        features: formData.features,
        billingCycle: formData.billingCycle,
        description: formData.description,
        libraryAccess: formData.libraryAccess,
        licenseType: formData.licenseType,
        totalDevices: formData.totalDevices,
        typeToolAccess: formData.typeToolAccess,
        textGenerationLimit: formData.textGenerationLimit,
        priority: formData.priority,
        isActive: formData.isActive,
        updatedAt: Timestamp.now()
      };

      if (packageToEdit) {
        // Update existing package
        const packageRef = doc(db, 'subscription_packages', packageToEdit.id);
        await updateDoc(packageRef, packageData);
      } else {
        // Create new package
        await addDoc(collection(db, 'subscription_packages'), {
          ...packageData,
          createdAt: Timestamp.now()
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding subscription package:', err);
      setError('Failed to create subscription package');
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingOverlay />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Subscription Package</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price (BDT)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Library Access</label>
                <select
                  value={formData.libraryAccess}
                  onChange={(e) => setFormData({ ...formData, libraryAccess: e.target.value as LibraryAccess })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="free">Free Library Only</option>
                  <option value="entire">Entire Library</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">License Type</label>
                <select
                  value={formData.licenseType}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as LicenseType })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="private">Private Use Only</option>
                  <option value="commercial">Commercial Use Only</option>
                  <option value="both">Both Private & Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Devices</label>
                <input
                  type="number"
                  value={formData.totalDevices}
                  onChange={(e) => setFormData({ ...formData, totalDevices: parseInt(e.target.value) })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.typeToolAccess}
                  onChange={(e) => setFormData({ ...formData, typeToolAccess: e.target.checked })}
                  className="rounded border-gray-300"
                  id="typeToolAccess"
                />
                <label htmlFor="typeToolAccess" className="text-sm">
                  Include Type Tool Access
                </label>
              </div>

              {formData.typeToolAccess && (
                <div>
                  <label className="block text-sm font-medium mb-1">Daily Text Generation Limit</label>
                  <input
                    type="number"
                    value={formData.textGenerationLimit}
                    onChange={(e) => setFormData({ ...formData, textGenerationLimit: parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2"
                    required
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority Order</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                  id="isActive"
                />
                <label htmlFor="isActive" className="ml-2 text-sm">
                  Package is Active
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Package'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 