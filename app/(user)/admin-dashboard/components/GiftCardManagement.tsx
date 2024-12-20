'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, DollarSign, Users, Package, ArrowUpRight } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { GiftCardForm } from './GiftCardForm';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface GiftCard {
  id: string;
  amount: number;
  bonus: number;
  description: string;
  isActive: boolean;
  validityDays: number;
  usageCount: number;
  createdAt: Date;
}

interface GiftCardAnalytics {
  totalRevenue: number;
  activeCards: number;
  redemptionRate: number;
  averageSpend: number;
}

interface GiftCardUser {
  id: string;
  userId: string;
  cardId: string;
  userName: string;
  email: string;
  purchaseDate: Date;
  usageCount: number;
  remainingBalance: number;
  status: 'active' | 'expired' | 'used';
}

interface User {
  name: string;
  email: string;
  // Add other user fields as needed
}

export const GiftCardManagement = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [analytics, setAnalytics] = useState<GiftCardAnalytics>({
    totalRevenue: 0,
    activeCards: 0,
    redemptionRate: 0,
    averageSpend: 0
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [cardUsers, setCardUsers] = useState<GiftCardUser[]>([]);

  const fetchGiftCards = async () => {
    try {
      const cardsRef = collection(db, 'gift_cards');
      const snapshot = await getDocs(cardsRef);
      const cards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GiftCard[];
      setGiftCards(cards);

      // Calculate analytics
      const activeCards = cards.filter(card => card.isActive).length;
      const totalRevenue = cards.reduce((sum, card) => sum + (card.amount * card.usageCount), 0);
      const totalRedemptions = cards.reduce((sum, card) => sum + card.usageCount, 0);
      
      setAnalytics({
        totalRevenue,
        activeCards,
        redemptionRate: (totalRedemptions / cards.length) * 100,
        averageSpend: totalRedemptions > 0 ? totalRevenue / totalRedemptions : 0
      });

    } catch (error) {
      console.error('Error fetching gift cards:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gift cards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCardUsers = async () => {
    try {
      const usersRef = collection(db, 'gift_card_users');
      const snapshot = await getDocs(usersRef);
      const users = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        // Fetch user details
        const userDocRef = doc(db, 'users', data.userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data() as User | undefined;
        
        return {
          id: docSnapshot.id,
          userId: data.userId,
          cardId: data.cardId,
          userName: userData?.name || 'Unknown User',
          email: userData?.email || 'No Email',
          purchaseDate: data.purchaseDate.toDate(),
          usageCount: data.usageCount,
          remainingBalance: data.remainingBalance,
          status: data.status
        };
      }));
      setCardUsers(users);
    } catch (error) {
      console.error('Error fetching card users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch card users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGiftCards();
    fetchCardUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift card?')) return;

    try {
      await deleteDoc(doc(db, 'gift_cards', id));
      toast({
        title: "Success",
        description: "Gift card deleted successfully",
      });
      fetchGiftCards();
    } catch (error) {
      console.error('Error deleting gift card:', error);
      toast({
        title: "Error",
        description: "Failed to delete gift card",
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
        <h2 className="text-2xl font-bold">Gift Card Management</h2>
        <button
          onClick={() => {
            setSelectedCard(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Gift Card
        </button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">From gift card purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeCards}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.redemptionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Average redemption rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.averageSpend)}</div>
                <p className="text-xs text-muted-foreground">Per redemption</p>
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
                    <LineChart data={giftCards}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#8884d8" 
                        name="Card Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={giftCards}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="amount" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="usageCount" 
                        fill="#82ca9d" 
                        name="Usage Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>{formatCurrency(card.amount)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Bonus Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(card.bonus)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Details</p>
                      <p className="text-sm">{card.description}</p>
                      <p className="text-sm">Valid for {card.validityDays} days</p>
                      <p className="text-sm">Used {card.usageCount} times</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => {
                          setSelectedCard(card);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
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

        <TabsContent value="analytics">
          {/* Add detailed analytics content here */}
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Card</th>
                        <th className="px-6 py-3">Purchase Date</th>
                        <th className="px-6 py-3">Usage</th>
                        <th className="px-6 py-3">Balance</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardUsers.map((user) => (
                        <tr key={user.id} className="bg-white border-b">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{user.userName}</div>
                              <div className="text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {giftCards.find(card => card.id === user.cardId)?.amount || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(user.purchaseDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{user.usageCount}</td>
                          <td className="px-6 py-4">{formatCurrency(user.remainingBalance)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showForm && (
        <GiftCardForm
          cardToEdit={selectedCard}
          onClose={() => {
            setShowForm(false);
            setSelectedCard(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedCard(null);
            fetchGiftCards();
            toast({
              title: "Success",
              description: selectedCard ? "Gift card updated successfully" : "Gift card created successfully",
            });
          }}
        />
      )}
    </div>
  );
}; 