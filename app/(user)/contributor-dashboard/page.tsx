'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Download, TypeIcon, TrendingUp, Clock, AlertCircle, LucideIcon, Edit, Trash2, ExternalLink, CreditCard, BriefcaseBusiness, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface EarningsData {
  month: string;
  amount: number;
}

interface ActivityData {
  type: 'download' | 'purchase' | 'review';
  font: string;
  time: string;
}

interface MockData {
  earnings: EarningsData[];
  recentActivity: ActivityData[];
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string | number;
}

interface FontData {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'archived';
  downloads: number;
  earnings: number;
  lastUpdated: string;
}

const ContributorDashboard = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | 'card' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockData: MockData = {
    earnings: [
      { month: 'Jan', amount: 2400 },
      { month: 'Feb', amount: 1398 },
      { month: 'Mar', amount: 3800 },
      { month: 'Apr', amount: 3908 },
      { month: 'May', amount: 4800 },
      { month: 'Jun', amount: 3800 },
    ],
    recentActivity: [
      { type: 'download', font: 'Elegance Sans', time: '2 hours ago' },
      { type: 'purchase', font: 'Modern Script', time: '4 hours ago' },
      { type: 'review', font: 'Bold Craft', time: '1 day ago' },
    ]
  };

  const publishedFonts: FontData[] = [
    { id: '1', name: 'Elegance Sans', status: 'active', downloads: 1234, earnings: 2500, lastUpdated: '2024-03-15' },
    { id: '2', name: 'Modern Script', status: 'active', downloads: 856, earnings: 1800, lastUpdated: '2024-03-10' },
    { id: '3', name: 'Bold Craft', status: 'pending', downloads: 432, earnings: 950, lastUpdated: '2024-03-05' },
  ];

  const AVAILABLE_BALANCE = 4850;
  const MIN_WITHDRAWAL = 50;

  const isValidAmount = () => {
    const amount = Number(withdrawAmount);
    return amount >= MIN_WITHDRAWAL && amount <= AVAILABLE_BALANCE;
  };

  const handleWithdraw = async () => {
    if (!isValidAmount() || !selectedPaymentMethod) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Here you would make your actual API call
      console.log(`Withdrawing $${withdrawAmount} via ${selectedPaymentMethod}`);
      
      // Reset form after successful withdrawal
      setWithdrawAmount('');
      setSelectedPaymentMethod(null);
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend }) => (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className="text-sm text-green-500 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{trend}% from last month
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section remains the same */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your font performance overview</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Upload New Font
            </button>
          </div>
        </div>

        {/* Stat cards section remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Total Earnings" value={`$${AVAILABLE_BALANCE}`} trend="12" />
          <StatCard icon={Download} title="Downloads" value="2,456" trend="8" />
          <StatCard icon={TypeIcon} title="Active Fonts" value="12" />
          <StatCard icon={TrendingUp} title="Conversion Rate" value="8.2%" trend="5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.earnings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{ background: 'white', border: '1px solid #E5E7EB' }}
                      formatter={(value) => [`$${value}`, 'Earnings']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Card */}
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Available balance: <span className="font-bold">${AVAILABLE_BALANCE.toLocaleString()}</span>
                  </AlertDescription>
                </Alert>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="withdrawal-amount">
                    Withdrawal Amount
                  </label>
                  <input
                    id="withdrawal-amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className={cn(
                      "w-full p-2 border rounded-md",
                      !isValidAmount() && withdrawAmount && "border-red-500"
                    )}
                    placeholder="Enter amount"
                    min={MIN_WITHDRAWAL}
                    max={AVAILABLE_BALANCE}
                    disabled={isLoading}
                  />
                  {withdrawAmount && !isValidAmount() && (
                    <p className="text-sm text-red-500 mt-1">
                      Amount must be between ${MIN_WITHDRAWAL} and ${AVAILABLE_BALANCE}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <button
                    onClick={() => setSelectedPaymentMethod('bank')}
                    disabled={isLoading}
                    className={cn(
                      "w-full p-3 border rounded-md mb-2 flex items-center transition-colors",
                      selectedPaymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : '',
                      isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <BriefcaseBusiness className="mr-2 h-5 w-5" /> Bank Transfer
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('card')}
                    disabled={isLoading}
                    className={cn(
                      "w-full p-3 border rounded-md flex items-center transition-colors",
                      selectedPaymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : '',
                      isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <CreditCard className="mr-2 h-5 w-5" /> Debit Card
                  </button>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || !selectedPaymentMethod || !isValidAmount() || isLoading}
                  className={cn(
                    "w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
                    "disabled:bg-gray-300 disabled:cursor-not-allowed",
                    "flex items-center justify-center"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Withdraw Funds'
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Published Fonts table section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Published Fonts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-gray-600">Font Name</th>
                    <th className="text-left p-4 text-gray-600">Status</th>
                    <th className="text-right p-4 text-gray-600">Downloads</th>
                    <th className="text-right p-4 text-gray-600">Earnings</th>
                    <th className="text-left p-4 text-gray-600">Last Updated</th>
                    <th className="text-right p-4 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedFonts.map((font) => (
                    <tr key={font.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{font.name}</div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          {
                            'bg-green-100 text-green-800': font.status === 'active',
                            'bg-yellow-100 text-yellow-800': font.status === 'pending',
                            'bg-gray-100 text-gray-800': font.status === 'archived'
                          }
                        )}>
                          {font.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">{font.downloads.toLocaleString()}</td>
                      <td className="p-4 text-right">${font.earnings.toLocaleString()}</td>
                      <td className="p-4">{font.lastUpdated}</td>
                      <td className="p-4">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Edit font"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="View font"
                          >
                            <ExternalLink className="h-4 w-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Delete font"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    {
                      'bg-blue-50': activity.type === 'download',
                      'bg-green-50': activity.type === 'purchase',
                      'bg-orange-50': activity.type === 'review'
                    }
                  )}>
                    {activity.type === 'download' && <Download className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'purchase' && <DollarSign className="h-4 w-4 text-green-500" />}
                    {activity.type === 'review' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.type === 'download' && 'New download'}
                      {activity.type === 'purchase' && 'New purchase'}
                      {activity.type === 'review' && 'New review'}
                    </p>
                    <p className="text-sm text-gray-500">{activity.font}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributorDashboard;