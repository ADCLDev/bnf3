import React, { useState, useEffect } from 'react';
import { Shield, Edit2, Eye, Trash2, Plus, Save, X, MoveUp, MoveDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { logAdminActivity } from '@/lib/firebase/database/admin';

interface Paragraph {
  id: string;
  title: string;
  details: string;
  order: number;
}

interface LegalDocument {
  id: string;
  pageName: string;
  description: string;
  paragraphs: Paragraph[];
  lastUpdated: any;
  status: 'published' | 'draft';
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'Never';
  if (timestamp?.toDate instanceof Function) {
    return timestamp.toDate().toLocaleDateString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString();
  }
  return 'Invalid date';
};

const LegalManagement: React.FC = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'legal_documents'));
      const docs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          pageName: data.pageName || '',
          description: data.description || '',
          paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : [],
          lastUpdated: data.lastUpdated || null,
          status: data.status || 'draft'
        } as LegalDocument;
      });
      setDocuments(docs);
    } catch (err) {
      setError('Failed to fetch legal documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDoc({
      id: '',
      pageName: '',
      description: '',
      paragraphs: [{
        id: `p_${Date.now()}`,
        title: '',
        details: '',
        order: 0
      }],
      lastUpdated: null,
      status: 'draft'
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingDoc) return;
    
    // Validation
    if (!editingDoc.pageName.trim()) {
      setError('Page name is required');
      return;
    }
    if (!editingDoc.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!editingDoc.paragraphs.length) {
      setError('At least one paragraph is required');
      return;
    }
    
    // Validate each paragraph
    for (const para of editingDoc.paragraphs) {
      if (!para.title.trim() || !para.details.trim()) {
        setError('All paragraphs must have both title and details');
        return;
      }
    }

    try {
      // Generate a new ID only if it's a new document
      const docId = editingDoc.id || `doc_${Date.now()}`;
      const docRef = doc(db, 'legal_documents', docId);

      // Prepare document data
      const docData = {
        pageName: editingDoc.pageName,
        description: editingDoc.description,
        paragraphs: editingDoc.paragraphs.map((p, index) => ({
          ...p,
          order: index
        })),
        status: editingDoc.status,
        lastUpdated: serverTimestamp()
      };

      // Save to Firestore
      await setDoc(docRef, docData, { merge: true });

      await logAdminActivity(
        'legal_document_update',
        `Updated legal document: ${editingDoc.pageName}`,
        'admin'
      );

      setSuccessMessage('Document saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsDialogOpen(false);
      
      // Update local state to prevent duplicate entries
      setDocuments(prevDocs => {
        const existingDocIndex = prevDocs.findIndex(d => d.id === docId);
        const updatedDoc = {
          ...docData,
          id: docId,
          lastUpdated: new Date() // Use current date for immediate UI update
        };
        
        if (existingDocIndex >= 0) {
          // Update existing document
          const newDocs = [...prevDocs];
          newDocs[existingDocIndex] = updatedDoc;
          return newDocs;
        } else {
          // Add new document
          return [...prevDocs, updatedDoc];
        }
      });
    } catch (err) {
      setError('Failed to save document');
      console.error(err);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDoc(doc(db, 'legal_documents', docId));
      await logAdminActivity(
        'legal_document_delete',
        `Deleted legal document ID: ${docId}`,
        'admin'
      );
      setDocuments(docs => docs.filter(d => d.id !== docId));
      setSuccessMessage('Document deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    }
  };

  const addParagraph = () => {
    if (!editingDoc) return;
    const newParagraph: Paragraph = {
      id: `p_${Date.now()}`,
      title: '',
      details: '',
      order: editingDoc.paragraphs.length
    };
    setEditingDoc({
      ...editingDoc,
      paragraphs: [...editingDoc.paragraphs, newParagraph]
    });
  };

  const removeParagraph = (paragraphId: string) => {
    if (!editingDoc) return;
    if (editingDoc.paragraphs.length <= 1) {
      setError('Cannot remove the last paragraph');
      return;
    }
    setEditingDoc({
      ...editingDoc,
      paragraphs: editingDoc.paragraphs
        .filter(p => p.id !== paragraphId)
        .map((p, idx) => ({ ...p, order: idx }))
    });
  };

  const updateParagraph = (paragraphId: string, field: 'title' | 'details', value: string) => {
    if (!editingDoc) return;
    setEditingDoc({
      ...editingDoc,
      paragraphs: editingDoc.paragraphs.map(p =>
        p.id === paragraphId ? { ...p, [field]: value } : p
      )
    });
  };

  const moveParagraph = (paragraphId: string, direction: 'up' | 'down') => {
    if (!editingDoc) return;
    const currentIndex = editingDoc.paragraphs.findIndex(p => p.id === paragraphId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === editingDoc.paragraphs.length - 1)
    ) {
      return;
    }

    const newParagraphs = [...editingDoc.paragraphs];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newParagraphs[currentIndex], newParagraphs[targetIndex]] = 
    [newParagraphs[targetIndex], newParagraphs[currentIndex]];

    setEditingDoc({
      ...editingDoc,
      paragraphs: newParagraphs.map((p, idx) => ({ ...p, order: idx }))
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 max-w-7xl">
      <div className="flex justify-between items-center sticky top-0 bg-white py-4 z-10">
        <h2 className="text-2xl font-bold">Legal Documents</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{doc.pageName}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  doc.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{doc.description}</p>
                <div className="text-sm text-gray-500">
                  Paragraphs: {doc.paragraphs.length}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Last updated: {formatDate(doc.lastUpdated)}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{editingDoc?.id ? 'Edit Document' : 'Add New Document'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-grow pr-2">
            <div>
              <label className="block text-sm font-medium mb-1">Page Name</label>
              <input
                type="text"
                value={editingDoc?.pageName || ''}
                onChange={(e) => setEditingDoc(prev => ({ ...prev!, pageName: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="Enter page name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editingDoc?.description || ''}
                onChange={(e) => setEditingDoc(prev => ({ ...prev!, description: e.target.value }))}
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Enter page description"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">Paragraphs</label>
                <button
                  onClick={addParagraph}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Paragraph
                </button>
              </div>
              
              {editingDoc?.paragraphs.map((paragraph, index) => (
                <div key={paragraph.id} className="border rounded p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Paragraph {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveParagraph(paragraph.id, 'up')}
                        disabled={index === 0}
                        className={`${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveParagraph(paragraph.id, 'down')}
                        disabled={index === editingDoc.paragraphs.length - 1}
                        className={`${index === editingDoc.paragraphs.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeParagraph(paragraph.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={paragraph.title}
                    onChange={(e) => updateParagraph(paragraph.id, 'title', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter paragraph title"
                  />
                  
                  <textarea
                    value={paragraph.details}
                    onChange={(e) => updateParagraph(paragraph.id, 'details', e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded"
                    placeholder="Enter paragraph details"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editingDoc?.status || 'draft'}
                onChange={(e) => setEditingDoc(prev => ({ ...prev!, status: e.target.value as 'published' | 'draft' }))}
                className="w-full p-2 border rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 sticky bottom-0 bg-white py-4 mt-4 border-t">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalManagement;