'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

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

export interface TypeToolFormProps {
  toolToEdit?: TypeTool | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  dailyLimit: number;
  textLengthLimit: number;
  isActive: boolean;
  price: number;
}

export const TypeToolForm = ({ toolToEdit, onClose, onSuccess }: TypeToolFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: toolToEdit?.name || '',
    description: toolToEdit?.description || '',
    dailyLimit: toolToEdit?.dailyLimit || 10,
    textLengthLimit: toolToEdit?.textLengthLimit || 1000,
    isActive: toolToEdit?.isActive ?? true,
    price: toolToEdit?.price || 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const typeToolData = {
        ...formData,
        usageCount: toolToEdit?.usageCount || 0,
        updatedAt: Timestamp.now()
      };

      if (toolToEdit) {
        const toolRef = doc(db, 'type_tools', toolToEdit.id);
        await updateDoc(toolRef, typeToolData);
      } else {
        await addDoc(collection(db, 'type_tools'), {
          ...typeToolData,
          createdAt: Timestamp.now()
        });
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving type tool:', err);
      setError('Failed to save type tool');
      toast({
        title: "Error",
        description: "Failed to save type tool",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {toolToEdit ? 'Edit Type Tool' : 'Add Type Tool'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Daily Limit</label>
            <input
              type="number"
              name="dailyLimit"
              value={formData.dailyLimit}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Text Length Limit</label>
            <input
              type="number"
              name="textLengthLimit"
              value={formData.textLengthLimit}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="isActive" className="ml-2 text-sm">
              Tool is Active
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-4 mt-6">
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
              {loading ? 'Saving...' : toolToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};