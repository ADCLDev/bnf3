import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Edit, BarChart, Eye, Archive, ExternalLink } from 'lucide-react';

// Mock data for fonts
const ownFonts = [
  {
    id: 'FONT-001',
    name: 'Admin Sans',
    styles: ['Regular', 'Bold', 'Italic'],
    status: 'published',
    downloads: 245,
    revenue: '৳12,500',
    lastUpdated: '2024-12-10',
    preview: '/api/placeholder/400/200',
    description: 'A modern sans-serif typeface designed for optimal readability in Bengali text.',
    sampleText: 'The quick brown fox jumps over the lazy dog',
    metrics: {
      monthlyDownloads: 75,
      rating: 4.8,
      favorites: 120
    }
  },
  {
    id: 'FONT-002',
    name: 'Bengal Display',
    styles: ['Regular', 'Medium', 'Bold'],
    status: 'draft',
    downloads: 0,
    revenue: '৳0',
    lastUpdated: '2024-12-18',
    preview: '/api/placeholder/400/200',
    description: 'An elegant display typeface for Bengali headlines and titles.',
    sampleText: 'The quick brown fox jumps over the lazy dog',
    metrics: {
      monthlyDownloads: 0,
      rating: 0,
      favorites: 0
    }
  }
];

const contributorFonts = [
  {
    id: 'CONT-FONT-001',
    name: 'Modern Bengali',
    creator: {
      name: 'John Doe',
      email: 'john@example.com',
      contributorSince: '2024-01'
    },
    styles: ['Regular', 'Bold'],
    status: 'published',
    downloads: 189,
    revenue: '৳9,450',
    lastUpdated: '2024-12-15',
    preview: '/api/placeholder/400/200',
    description: 'A contemporary take on traditional Bengali typography.',
    sampleText: 'The quick brown fox jumps over the lazy dog',
    metrics: {
      monthlyDownloads: 45,
      rating: 4.5,
      favorites: 87
    },
    commissionRate: 70
  },
  {
    id: 'CONT-FONT-002',
    name: 'Classic Script',
    creator: {
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      contributorSince: '2024-02'
    },
    styles: ['Regular'],
    status: 'published',
    downloads: 134,
    revenue: '৳6,700',
    lastUpdated: '2024-12-12',
    preview: '/api/placeholder/400/200',
    description: 'An authentic Bengali script font with traditional calligraphic elements.',
    sampleText: 'The quick brown fox jumps over the lazy dog',
    metrics: {
      monthlyDownloads: 32,
      rating: 4.7,
      favorites: 65
    },
    commissionRate: 70
  }
];

const AdminFontsTabs = () => {
  const handleUploadFont = () => {
    console.log('Upload new font clicked');
  };

  const handleEdit = (fontId: string) => {
    console.log('Edit font:', fontId);
  };

  const handleViewAnalytics = (fontId: string) => {
    console.log('View analytics:', fontId);
  };

  const handlePreview = (fontId: string) => {
    console.log('Preview font:', fontId);
  };

  const handleArchive = (fontId: string) => {
    console.log('Archive font:', fontId);
  };

  const handleUpdateCommission = (fontId: string) => {
    console.log('Update commission rate:', fontId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Font Management</h2>
        <button 
          onClick={handleUploadFont}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Upload className="w-4 h-4" />
          Upload New Font
        </button>
      </div>

      <Tabs defaultValue="own" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="own">Own Fonts</TabsTrigger>
          <TabsTrigger value="contributor">Contributor Fonts</TabsTrigger>
        </TabsList>

        <TabsContent value="own" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownFonts.map(font => (
              <Card key={font.id} className={font.status === 'draft' ? 'border-dashed' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">{font.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {font.styles.join(', ')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-sm rounded ${
                    font.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {font.status.charAt(0).toUpperCase() + font.status.slice(1)}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img 
                      src={font.preview} 
                      alt={`${font.name} Preview`} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{font.description}</p>
                    <p className="font-mono text-sm">{font.sampleText}</p>
                    
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div>
                        <p className="text-sm text-gray-500">Downloads</p>
                        <p className="font-semibold">{font.downloads}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold">{font.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-semibold">{font.metrics.rating || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-500">
                        Updated: {font.lastUpdated}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(font.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          title="Edit Font"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewAnalytics(font.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                          title="View Analytics"
                        >
                          <BarChart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreview(font.id)}
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"
                          title="Preview Font"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(font.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Archive Font"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contributor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributorFonts.map(font => (
              <Card key={font.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl">{font.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      by {font.creator.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-sm rounded ${
                    font.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {font.status.charAt(0).toUpperCase() + font.status.slice(1)}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img 
                      src={font.preview} 
                      alt={`${font.name} Preview`} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{font.description}</p>
                    <p className="font-mono text-sm">{font.sampleText}</p>
                    
                    <div className="grid grid-cols-4 gap-4 py-2">
                      <div>
                        <p className="text-sm text-gray-500">Downloads</p>
                        <p className="font-semibold">{font.downloads}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold">{font.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-semibold">{font.metrics.rating}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Commission</p>
                        <p className="font-semibold">{font.commissionRate}%</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-gray-500">
                        <p>Contributor since: {font.creator.contributorSince}</p>
                        <p>Updated: {font.lastUpdated}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAnalytics(font.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                          title="View Analytics"
                        >
                          <BarChart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreview(font.id)}
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"
                          title="Preview Font"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateCommission(font.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          title="Update Commission Rate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(font.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Archive Font"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFontsTabs;