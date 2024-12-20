'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

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

interface GiftCardFormProps {
  cardToEdit?: GiftCard | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  amount: number;
  bonus: number;
  description: string;
  validityDays: number;
  isActive: boolean;
}

export const GiftCardForm = ({ cardToEdit, onClose, onSuccess }: GiftCardFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    amount: cardToEdit?.amount || 0,
    bonus: cardToEdit?.bonus || 0,
    description: cardToEdit?.description || '',
    validityDays: cardToEdit?.validityDays || 30,
    isActive: cardToEdit?.isActive ?? true,
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
      const giftCardData = {
        ...formData,
        usageCount: cardToEdit?.usageCount || 0,
        updatedAt: Timestamp.now()
      };

      if (cardToEdit) {
        const cardRef = doc(db, 'gift_cards', cardToEdit.id);
        await updateDoc(cardRef, giftCardData);
      } else {
        await addDoc(collection(db, 'gift_cards'), {
          ...giftCardData,
          createdAt: Timestamp.now()
        });
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving gift card:', err);
      setError('Failed to save gift card');
      toast({
        title: "Error",
        description: "Failed to save gift card",
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
            {cardToEdit ? 'Edit Gift Card' : 'Add Gift Card'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (BDT)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bonus Amount (BDT)</label>
            <input
              type="number"
              name="bonus"
              value={formData.bonus}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
              min="0"
              step="0.01"
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
            <label className="block text-sm font-medium mb-1">Validity (Days)</label>
            <input
              type="number"
              name="validityDays"
              value={formData.validityDays}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
              min="1"
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
              Gift Card is Active
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
              {loading ? 'Saving...' : cardToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 