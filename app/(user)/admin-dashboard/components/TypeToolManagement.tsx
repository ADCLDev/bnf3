'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, DollarSign, Users, Package, ArrowUpRight, Type } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { TypeToolForm } from './TypeToolForm';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface TypeTool {
  id: string;
  name: string;
  description: string;
  dailyLimit: number;
  textLengthLimit: number;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  price: number;
}

interface TypeToolAnalytics {
  totalUsage: number;
  activeTools: number;
  averageUsage: number;
  totalRevenue: number;
}

interface TypeToolUser {
  id: string;
  userId: string;
  toolId: string;
  userName: string;
  email: string;
  lastUsed: Date;
  totalUsage: number;
  dailyUsage: number;
  status: 'active' | 'blocked';
}

interface User {
  name: string;
  email: string;
  // Add other user fields as needed
}

export const TypeToolManagement = () => {
  const [typeTools, setTypeTools] = useState<TypeTool[]>([]);
  const [analytics, setAnalytics] = useState<TypeToolAnalytics>({
    totalUsage: 0,
    activeTools: 0,
    averageUsage: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<TypeTool | null>(null);
  const [toolUsers, setToolUsers] = useState<TypeToolUser[]>([]);

  const fetchTypeTools = async () => {
    try {
      const toolsRef = collection(db, 'type_tools');
      const snapshot = await getDocs(toolsRef);
      const tools = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TypeTool[];
      setTypeTools(tools);

      // Calculate analytics
      const activeTools = tools.filter(tool => tool.isActive).length;
      const totalUsage = tools.reduce((sum, tool) => sum + tool.usageCount, 0);
      const totalRevenue = tools.reduce((sum, tool) => sum + (tool.price * tool.usageCount), 0);
      
      setAnalytics({
        totalUsage,
        activeTools,
        averageUsage: totalUsage / tools.length,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching type tools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch type tools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchToolUsers = async () => {
    try {
      const usersRef = collection(db, 'type_tool_users');
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
          toolId: data.toolId,
          userName: userData?.name || 'Unknown User',
          email: userData?.email || 'No Email',
          lastUsed: data.lastUsed.toDate(),
          totalUsage: data.totalUsage,
          dailyUsage: data.dailyUsage,
          status: data.status
        };
      }));
      setToolUsers(users);
    } catch (error) {
      console.error('Error fetching tool users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tool users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTypeTools();
    fetchToolUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this type tool?')) return;

    try {
      await deleteDoc(doc(db, 'type_tools', id));
      toast({
        title: "Success",
        description: "Type tool deleted successfully",
      });
      fetchTypeTools();
    } catch (error) {
      console.error('Error deleting type tool:', error);
      toast({
        title: "Error",
        description: "Failed to delete type tool",
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
        <h2 className="text-2xl font-bold">Type Tool Management</h2>
        <button
          onClick={() => {
            setSelectedTool(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Type Tool
        </button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <Type className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsage}</div>
                <p className="text-xs text-muted-foreground">Total tool uses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeTools}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageUsage.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Uses per tool</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">From tool usage</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={typeTools}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="usageCount" 
                        stroke="#8884d8" 
                        name="Usage Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tool Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeTools}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
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

        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeTools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm">{tool.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Limits</p>
                      <p className="text-sm">Daily: {tool.dailyLimit} uses</p>
                      <p className="text-sm">Text Length: {tool.textLengthLimit} characters</p>
                      <p className="text-sm">Total Usage: {tool.usageCount}</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => {
                          setSelectedTool(tool);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
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
                <CardTitle>Type Tool Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Tool</th>
                        <th className="px-6 py-3">Last Used</th>
                        <th className="px-6 py-3">Total Usage</th>
                        <th className="px-6 py-3">Daily Usage</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolUsers.map((user) => (
                        <tr key={user.id} className="bg-white border-b">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{user.userName}</div>
                              <div className="text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {typeTools.find(tool => tool.id === user.toolId)?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(user.lastUsed).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{user.totalUsage}</td>
                          <td className="px-6 py-4">{user.dailyUsage}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                // Add function to toggle user status
                                // toggleUserStatus(user.id, user.status === 'active' ? 'blocked' : 'active');
                              }}
                              className={`text-xs px-2 py-1 rounded ${
                                user.status === 'active' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {user.status === 'active' ? 'Block' : 'Unblock'}
                            </button>
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
        <TypeToolForm
          toolToEdit={selectedTool}
          onClose={() => {
            setShowForm(false);
            setSelectedTool(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedTool(null);
            fetchTypeTools();
            toast({
              title: "Success",
              description: selectedTool ? "Type tool updated successfully" : "Type tool created successfully",
            });
          }}
        />
      )}
    </div>
  );
};