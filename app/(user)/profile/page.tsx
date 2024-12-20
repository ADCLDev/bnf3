// app/(user)/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { User } from 'lucide-react';
import { LoadingPage } from '@/components/ui/loading-spinner';

interface UserProfile {
  email: string;
  createdAt: { seconds: number; nanoseconds: number };
  is_admin: boolean;
  is_contributor: boolean;
  is_subscriber: boolean;
  provider?: string;
  profile: {
    Bio?: string | null;
    Company?: string | null;
    firstName: string;
    lastName: string;
  };
  uid: string;
}

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    Company: '',
    Bio: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfileData(data);
          setFormData({
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
            Company: data.profile.Company || '',
            Bio: data.profile.Bio || '',
            email: data.email || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!user) return;

      const updateData: Partial<UserProfile> = {
        profile: {
          ...profileData?.profile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          Company: formData.Company || null,
          Bio: formData.Bio || null,
        },
      };

      if (profileData?.provider === 'email') {
        updateData.email = formData.email;
      }

      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      if (profileData) {
        setProfileData({
          ...profileData,
          ...updateData,
          profile: {
            ...profileData.profile,
            ...updateData.profile,
          }
        });
      }

      setSuccess('Profile updated successfully');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (!user) return;
      await updatePassword(user, passwordData.newPassword);
      setSuccess('Password updated successfully');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password');
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                      profileData?.provider !== 'email' ? 'bg-gray-100' : ''
                    }`}
                    readOnly={profileData?.provider !== 'email'}
                  />
                  {profileData?.provider !== 'email' && (
                    <p className="mt-1 text-sm text-gray-500">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={formData.Company}
                    onChange={(e) => setFormData({ ...formData, Company: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={formData.Bio}
                    onChange={(e) => setFormData({ ...formData, Bio: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Card - Only show for email users */}
          {profileData?.provider === 'email' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
              </div>
              <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}