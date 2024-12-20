import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FAQForm, FAQItem } from './FAQForm';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { seedFAQs } from '../utils/seedFAQs';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle } from 'lucide-react';

export const FAQManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    try {
      const faqsQuery = query(
        collection(db, 'faqs'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(faqsQuery);
      const faqsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FAQItem[];
      setFaqs(faqsData);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeFAQs = async () => {
      await seedFAQs(); // Seed default FAQs if none exist
      fetchFAQs();
    };

    initializeFAQs();
  }, []);

  const handleDelete = async (faqId: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await deleteDoc(doc(db, 'faqs', faqId));
        await fetchFAQs();
      } catch (err) {
        console.error('Error deleting FAQ:', err);
        setError('Failed to delete FAQ');
      }
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleSeedFAQs = async () => {
    try {
      await seedFAQs();
      await fetchFAQs(); // Refresh the FAQ list
      toast({
        title: "Success",
        description: "Default FAQs added successfully",
      });
    } catch (error) {
      console.error('Error seeding FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to add default FAQs",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSeedFAQs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Seed Default FAQs
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-medium">{faq.title}</CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                  title="Edit FAQ"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  title="Delete FAQ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <a
                  href={faq.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch Video
                </a>
                
                <p className="text-sm text-gray-600">{faq.description}</p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Details:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {faq.bulletPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <FAQForm
          onClose={() => {
            setShowForm(false);
            setEditingFaq(null);
          }}
          onSuccess={fetchFAQs}
          editData={editingFaq || undefined}
        />
      )}
    </div>
  );
}; 