// lib/firebase/context.ts
import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore';

// Define the profile structure
export interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  company: string;
  website: string;
  image: string;
}

// Define the complete user data structure
export interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  is_admin: boolean;
  is_contributor: boolean;
  is_subscriber: boolean;
  profile: UserProfile;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

// Extend the Firebase User type with our custom properties
export interface FirebaseUser extends User {
  userData?: FirebaseUserData;
  is_admin?: boolean;
  is_contributor?: boolean;
  is_subscriber?: boolean;
}

// Define the FirebaseContextType
export interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isContributor: boolean;
  isSubscriber: boolean;
}

// Create the FirebaseContext with default values
export const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  userProfile: null,
  isAdmin: false,
  isContributor: false,
  isSubscriber: false,
});

// Custom hook to use the FirebaseContext with type safety
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Helper hooks for specific use cases
export const useIsAdmin = () => {
  const { isAdmin } = useFirebase();
  return isAdmin;
};

export const useIsContributor = () => {
  const { isContributor } = useFirebase();
  return isContributor;
};

export const useIsSubscriber = () => {
  const { isSubscriber } = useFirebase();
  return isSubscriber;
};

export const useUserProfile = () => {
  const { userProfile } = useFirebase();
  return userProfile;
};