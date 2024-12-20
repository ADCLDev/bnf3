import { db } from './config'
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference
} from 'firebase/firestore'

// Type for the collection name
export type CollectionName = 'users' | 'posts' | 'comments' // add your collection names

// Generic type for database operations
export interface DatabaseOperations<T> {
  getAll: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  add: (data: Omit<T, 'id'>) => Promise<string>
  update: (id: string, data: Partial<T>) => Promise<void>
  delete: (id: string) => Promise<void>
}

// Helper function to convert Firestore document to type T
const convertDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  return { id: doc.id, ...doc.data() } as T
}

// Create database operations for a collection
export const createDatabaseOperations = <T extends { id: string }>(
  collectionName: CollectionName
): DatabaseOperations<T> => {
  const collectionRef = collection(db, collectionName) as CollectionReference<DocumentData>

  return {
    getAll: async () => {
      const snapshot = await getDocs(collectionRef)
      return snapshot.docs.map(doc => convertDoc<T>(doc))
    },

    getById: async (id: string) => {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null
    },

    add: async (data: Omit<T, 'id'>) => {
      const docRef = await addDoc(collectionRef, data)
      return docRef.id
    },

    update: async (id: string, data: Partial<T>) => {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, data as DocumentData)
    },

    delete: async (id: string) => {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    }
  }
} 