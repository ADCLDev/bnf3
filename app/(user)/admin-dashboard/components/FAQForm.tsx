import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';

interface FAQFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editData?: FAQItem;
}

export interface FAQItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  bulletPoints: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type FAQData = Omit<FAQItem, 'id' | 'createdAt'> & {
  createdAt?: Timestamp;
};

export const FAQForm = ({ onClose, onSuccess, editData }: FAQFormProps) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    videoUrl: editData?.videoUrl || '',
    bulletPoints: editData?.bulletPoints || ['']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulletPointChange = (index: number, value: string) => {
    const newBulletPoints = [...formData.bulletPoints];
    newBulletPoints[index] = value;
    setFormData({ ...formData, bulletPoints: newBulletPoints });
  };

  const addBulletPoint = () => {
    setFormData({
      ...formData,
      bulletPoints: [...formData.bulletPoints, '']
    });
  };

  const removeBulletPoint = (index: number) => {
    const newBulletPoints = formData.bulletPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, bulletPoints: newBulletPoints });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseData = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        bulletPoints: formData.bulletPoints.filter(point => point.trim() !== ''),
        updatedAt: Timestamp.now()
      };

      if (editData?.id) {
        // Update existing FAQ
        await updateDoc(doc(db, 'faqs', editData.id), baseData);
      } else {
        // Create new FAQ
        await addDoc(collection(db, 'faqs'), {
          ...baseData,
          createdAt: Timestamp.now()
        });
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editData ? 'Edit FAQ' : 'Add FAQ'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
              placeholder="FAQ title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              required
              placeholder="FAQ description..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Bullet Points</label>
              <button
                type="button"
                onClick={addBulletPoint}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Point
              </button>
            </div>
            {formData.bulletPoints.map((point, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleBulletPointChange(index, e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Bullet point..."
                  required
                />
                {formData.bulletPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBulletPoint(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
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
              {loading ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 