'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import Cookies from 'js-cookie';

interface UserProfile {
  email: string
  is_admin: boolean
  is_contributor: boolean
  is_subscriber: boolean
  profile: {
    firstName: string
    lastName: string
    Company?: string
    Bio?: string
    createdAt: Date
  }
}

interface FirebaseContextType {
  user: User | null
  loading: boolean
  error: Error | undefined
  userProfile: UserProfile | null
  isAdmin: boolean
  isContributor: boolean
  isSubscriber: boolean
  refreshUserProfile: () => Promise<void>
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: undefined,
  userProfile: null,
  isAdmin: false,
  isContributor: false,
  isSubscriber: false,
  refreshUserProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, authLoading, authError] = useAuthState(auth)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    console.log('Auth State Changed:', {
      user: user?.email,
      authLoading,
      authError: authError?.message,
      isInitialized
    });
  }, [user, authLoading, authError, isInitialized]);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for:', userId);
    setProfileLoading(true)
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile
        console.log('User profile fetched:', userData);
        setUserProfile(userData)
        return userData
      } else {
        console.log('No user profile found for:', userId);
      }
      return null
    } catch (err) {
      console.error('Error fetching user profile:', err)
      return null
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      console.log('Refreshing user profile for:', user.email);
      await fetchUserProfile(user.uid)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth:', {
        authLoading,
        userEmail: user?.email,
        hasProfile: !!userProfile
      });

      if (!authLoading) {
        if (user) {
          console.log('User authenticated:', user.email)
          await fetchUserProfile(user.uid)
        } else {
          console.log('No user authenticated')
          setUserProfile(null)
        }
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [user, authLoading])

  useEffect(() => {
    console.log('Provider State:', {
      isAuthenticated: !!user,
      userEmail: user?.email,
      hasProfile: !!userProfile,
      loading: !isInitialized || authLoading || profileLoading
    });
  }, [user, userProfile, authLoading, profileLoading, isInitialized]);

  const loading = !isInitialized || authLoading || profileLoading

  useEffect(() => {
    const handleTokenManagement = async () => {
      if (user) {
        // Set token when user is authenticated
        const token = await user.getIdToken();
        Cookies.set('firebase-token', token);
      } else {
        // Remove token when user is not authenticated
        Cookies.remove('firebase-token');
      }
    };

    if (!authLoading) {
      handleTokenManagement();
    }
  }, [user, authLoading]);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        error: authError,
        userProfile,
        isAdmin: userProfile?.is_admin || false,
        isContributor: userProfile?.is_contributor || false,
        isSubscriber: userProfile?.is_subscriber || false,
        refreshUserProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 