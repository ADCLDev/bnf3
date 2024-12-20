// app/(user)/admin-dashboard/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, AlertCircle, Package, Type, Book, Shield, Settings, Users, DollarSign, FileText, Upload, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { AdminModel } from './models/AdminModel';
import { Overview } from './components/Overview';
import { logAdminActivity } from '@/lib/firebase/database/admin';
import SubscriberDashboard from '../admin-dashboard/components/SubscriptionDashboard';
import { GiftCardManagement } from './components/GiftCardManagement';
import { TypeToolManagement } from './components/TypeToolManagement';
import { FAQManagement } from './components/FAQManagement';
import LegalManagement from './components/LegakManagement';
import { ErrorBoundary } from './components/ErrorBoundary';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import FontReviewTabs from './components/FontReviewTabs';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminFontsTabs from './components/AdminFontTabs';

const AdminDashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState('overview');
  
  const stats = {
    totalRevenue: '৳125,750',
    totalUsers: '2,340',
    pendingFonts: '12',
    activeSubscriptions: '543'
  };

  const [subscriptionPackages] = useState([
    { id: 1, name: 'Basic', price: '৳499/mo', features: ['100 downloads/month', 'Basic type tools', 'Email support'] },
    { id: 2, name: 'Pro', price: '৳999/mo', features: ['Unlimited downloads', 'Advanced type tools', 'Priority support'] }
  ]);

  const [giftCardPackages] = useState([
    { id: 1, amount: '৳500', bonus: '৳50' },
    { id: 2, amount: '৳1000', bonus: '৳150' }
  ]);

  const [typeToolPackages] = useState([
    { id: 1, type: 'Anonymous', limits: { daily: 5, textLength: 50 } },
    { id: 2, type: 'Logged In', limits: { daily: 20, textLength: 200 } }
  ]);

  const [faqs] = useState([
    { id: 1, title: 'How to download fonts?', category: 'Usage', type: 'video', content: 'guide.mp4' },
    { id: 2, title: 'Licensing terms', category: 'Legal', type: 'text', content: 'Our licensing terms...' }
  ]);

  const [legalDocs] = useState({
    tos: { title: 'Terms of Service', content: '...' },
    privacy: { title: 'Privacy Policy', content: '...' },
    refund: { title: 'Refund Policy', content: '...' },
    license: { title: 'License Agreement', content: '...' },
    contributor: { title: 'Contributor Policy', content: '...' }
  });

  const [fontSubmissions] = useState([
    {
      id: 'SUB-001',
      name: 'Elegance Sans',
      creator: 'John Doe',
      submittedDate: '2024-12-14',
      status: 'pending',
      styles: ['Regular', 'Bold', 'Italic'],
      sampleText: 'The quick brown fox jumps over the lazy dog',
      technicalRequirements: true,
      characterSetComplete: true,
      licenseTermsValid: true,
      qualityStandards: false,
      preview: '/api/placeholder/400/200'
    },
    {
      id: 'SUB-002',
      name: 'Modern Script',
      creator: 'Jane Smith',
      submittedDate: '2024-12-13',
      status: 'pending',
      styles: ['Regular'],
      sampleText: 'The quick brown fox jumps over the lazy dog',
      technicalRequirements: true,
      characterSetComplete: false,
      licenseTermsValid: true,
      qualityStandards: true,
      preview: '/api/placeholder/400/200'
    }
  ]);

  const [ownFonts] = useState([
    {
      id: 'FONT-001',
      name: 'Admin Sans',
      styles: ['Regular', 'Bold'],
      status: 'published',
      downloads: 245,
      revenue: '৳12,500',
      lastUpdated: '2024-12-10'
    }
  ]);

  const handleAddPackage = () => {
    console.log('Add package clicked');
  };

  const handleEdit = (id: number) => {
    console.log('Edit clicked for id:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete clicked for id:', id);
  };

  const handleApprove = (submissionId: string) => {
    console.log('Approving submission:', submissionId);
  };

  const handleReject = (submissionId: string) => {
    console.log('Rejecting submission:', submissionId);
  };

  const handleAddFeedback = (submissionId: string) => {
    console.log('Adding feedback for:', submissionId);
  };

  const renderContent = () => {
    switch(selectedSection) {
      case 'overview':
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
                  <div className="text-2xl font-bold">{stats.totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">+10% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+82 this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Fonts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingFonts}</div>
                  <p className="text-xs text-muted-foreground">Needs review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">+23 new this month</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2"
                  onClick={() => setSelectedSection('subscriptions')}
                >
                  <Package className="h-5 w-5 text-blue-500" />
                  <span>Manage Subscriptions</span>
                </button>
                <button 
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-2"
                  onClick={() => setSelectedSection('typetools')}
                >
                  <Type className="h-5 w-5 text-purple-500" />
                  <span>Configure Type Tools</span>
                </button>
                <button 
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex items-center gap-2"
                  onClick={() => setSelectedSection('faq')}
                >
                  <Book className="h-5 w-5 text-green-500" />
                  <span>Update FAQs</span>
                </button>
                <button 
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-2"
                  onClick={() => setSelectedSection('legal')}
                >
                  <Shield className="h-5 w-5 text-orange-500" />
                  <span>Review Legal Docs</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>New font submission received</span>
                      </div>
                      <span className="text-sm text-gray-500">2 minutes ago</span>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>New subscription purchase</span>
                      </div>
                      <span className="text-sm text-gray-500">15 minutes ago</span>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Gift card redeemed</span>
                      </div>
                      <span className="text-sm text-gray-500">1 hour ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Type tool usage limit updated</span>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'fontReview':
        return <FontReviewTabs />;
        
      case 'ownFonts':
        return <AdminFontsTabs/>;

      case 'subscriptions':
        return <SubscriberDashboard />;

      case 'giftcards':
        return <GiftCardManagement />;

      case 'typetools':
        return <TypeToolManagement />;

      case 'faq':
        return <FAQManagement />;

      case 'legal':
        return <LegalManagement />;

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-2">
            <div className="bg-white rounded-lg p-4 space-y-2">
              <button
                onClick={() => setSelectedSection('overview')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'overview' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <BarChart className="h-4 w-4" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setSelectedSection('fontReview')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'fontReview' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Font Review</span>
              </button>
              <button
                onClick={() => setSelectedSection('ownFonts')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'ownFonts' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Own Fonts</span>
              </button>
              <button
                onClick={() => setSelectedSection('subscriptions')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'subscriptions' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Subscriptions</span>
              </button>
              <button
                onClick={() => setSelectedSection('giftcards')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'giftcards' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Gift Cards</span>
              </button>
              <button
                onClick={() => setSelectedSection('typetools')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'typetools' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Type className="h-4 w-4" />
                <span>Type Tools</span>
              </button>
              <button
                onClick={() => setSelectedSection('faq')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'faq' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Book className="h-4 w-4" />
                <span>FAQ</span>
              </button>
              <button
                onClick={() => setSelectedSection('legal')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  selectedSection === 'legal' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Legal</span>
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-10">
            <div className="bg-white rounded-lg p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;