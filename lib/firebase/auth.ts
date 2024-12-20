import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User,
  UserCredential,
  AuthError as FirebaseAuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { auth, db } from './config';

// Define a custom AuthError type
export interface AuthError {
  code: string;
  message: string;
}

// Define the profile structure
interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  company: string;
  website: string;
  image: string;
}

// Define the user data structure
interface UserData {
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

// Authentication service
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await this.createUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      const authError = error as FirebaseAuthError;
      throw {
        code: authError.code,
        message: authError.message,
      } as AuthError;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as FirebaseAuthError;
      throw {
        code: authError.code,
        message: authError.message,
      } as AuthError;
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await this.createOrUpdateUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      const authError = error as FirebaseAuthError;
      throw {
        code: authError.code,
        message: authError.message,
      } as AuthError;
    }
  },

  // Create new user document in Firestore
  async createUserDocument(user: User): Promise<void> {
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      is_admin: false,
      is_contributor: false,
      is_subscriber: false,
      profile: {
        firstName: '',
        lastName: '',
        bio: '',
        company: '',
        website: '',
        image: user.photoURL || '',
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);
  },

  // Create or update user document in Firestore
  async createOrUpdateUserDocument(user: User): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document
      await this.createUserDocument(user);
    } else {
      // Update existing user document, avoiding privileged fields
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
        profile: {
          ...userDoc.data().profile,
          image: user.photoURL || userDoc.data().profile.image,
        }
      }, { merge: true });
    }
  },

  // Get user document from Firestore
  async getUserDocument(uid: string) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as FirebaseAuthError;
      throw {
        code: authError.code,
        message: authError.message,
      } as AuthError;
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as FirebaseAuthError;
      throw {
        code: authError.code,
        message: authError.message,
      } as AuthError;
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth.onAuthStateChanged(callback);
  },
};

export default authService;