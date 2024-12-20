// app/(user)/subscription-dashboard/page.tsx
'use client'
import React, { useState } from 'react';
import { Download, Clock, Star, Package, Settings, BarChart, Search, Filter, FileText} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SubscriberDashboard = () => {
    const [activeTab, setActiveTab] = useState('downloads');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState('all');
    const [licenseType, setLicenseType] = useState('all');

  const userStats = {
    remainingDownloads: 12,
    subscriptionDays: 28,
    savedFonts: 15,
    recentDownloads: [
      { id: 1, name: 'Elegance Pro', date: '2024-12-13', style: 'Regular' },
      { id: 2, name: 'Modern Sans', date: '2024-12-12', style: 'Bold' },
      { id: 3, name: 'Vintage Serif', date: '2024-12-10', style: 'Regular' }
    ],
    favoriteStyles: [
      { id: 1, name: 'Sans Serif', usage: '45%' },
      { id: 2, name: 'Serif', usage: '30%' },
      { id: 3, name: 'Display', usage: '25%' }
    ]
  };

  const subscriptionDetails = {
    plan: 'Professional',
    nextBilling: '2025-01-14',
    price: '৳999/month',
    features: [
      'Download limit: 15 fonts/month',
      'Advanced type tool access',
      'Commercial license',
      'Priority support'
    ]
  };

  const downloadHistory = [
    {
      id: 1,
      fontName: 'Elegance Pro',
      style: 'Regular',
      downloadDate: '2024-12-13',
      license: 'Commercial',
      fileSize: '256 KB',
      foundry: 'Design Studio X',
      thumbnail: '/api/placeholder/48/48'
    },
    {
      id: 2,
      fontName: 'Modern Sans',
      style: 'Bold',
      downloadDate: '2024-12-12',
      license: 'Personal',
      fileSize: '180 KB',
      foundry: 'TypeLab',
      thumbnail: '/api/placeholder/48/48'
    },
    {
      id: 3,
      fontName: 'Vintage Serif',
      style: 'Regular',
      downloadDate: '2024-12-10',
      license: 'Commercial',
      fileSize: '320 KB',
      foundry: 'Classic Fonts',
      thumbnail: '/api/placeholder/48/48'
    },
    // Add more download history items...
  ];

  const renderDownloadHistory = () => {
    const filteredDownloads = downloadHistory.filter(download => {
      const matchesSearch = download.fontName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          download.foundry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLicense = licenseType === 'all' || download.license === licenseType;
      return matchesSearch && matchesLicense;
    });

    return (
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fonts or foundries..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Download All
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">License Type</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                  >
                    <option value="all">All Licenses</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Download History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-medium">Font</th>
                    <th className="text-left py-4 px-4 font-medium">Style</th>
                    <th className="text-left py-4 px-4 font-medium">Date</th>
                    <th className="text-left py-4 px-4 font-medium">License</th>
                    <th className="text-left py-4 px-4 font-medium">Size</th>
                    <th className="text-left py-4 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDownloads.map((download) => (
                    <tr key={download.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={download.thumbnail}
                            alt={download.fontName}
                            className="w-12 h-12 rounded"
                          />
                          <div>
                            <div className="font-medium">{download.fontName}</div>
                            <div className="text-sm text-gray-500">{download.foundry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{download.style}</td>
                      <td className="py-4 px-4 text-gray-600">{download.downloadDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          download.license === 'Commercial' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {download.license}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{download.fileSize}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download Again">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="View License">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDownloads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No downloads match your search criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Download Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{downloadHistory.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Downloads Left</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.remainingDownloads}</div>
            <p className="text-xs text-muted-foreground">Resets in {userStats.subscriptionDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Fonts</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.savedFonts}</div>
            <p className="text-xs text-muted-foreground">Across all collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionDetails.plan}</div>
            <p className="text-xs text-muted-foreground">{subscriptionDetails.price}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.subscriptionDays} days</div>
            <p className="text-xs text-muted-foreground">Auto-renewal enabled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.recentDownloads.map(font => (
                <div key={font.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{font.name}</h4>
                    <p className="text-sm text-gray-500">{font.style}</p>
                  </div>
                  <span className="text-sm text-gray-500">{font.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Font Style Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.favoriteStyles.map(style => (
                <div key={style.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{style.name}</span>
                    <span className="text-sm text-gray-500">{style.usage}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: style.usage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{subscriptionDetails.plan} Plan</h3>
            <p className="text-gray-600">{subscriptionDetails.price}</p>
            <p className="text-sm text-gray-500">Next billing date: {subscriptionDetails.nextBilling}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Features:</h4>
            <ul className="space-y-2">
              {subscriptionDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel Subscription
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-gray-600">Manage your fonts and subscription</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          {[
            { id: 'overview', icon: BarChart, label: 'Overview' },
            { id: 'downloads', icon: Download, label: 'Downloads' },
            { id: 'subscription', icon: Package, label: 'Subscription' },
            // { id: 'collections', icon: Palette, label: 'Collections' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'subscription' && renderSubscription()}
        {activeTab === 'downloads' && renderDownloadHistory()}
      </div>
    </div>
  );
};

export default SubscriberDashboard;