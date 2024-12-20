// lib/firebase/admin.ts
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

// Verify required environment variables
function verifyEnvironmentVariables() {
  const required = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'FIREBASE_ADMIN_STORAGE_BUCKET'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Firebase Admin environment variables: ${missing.join(', ')}`);
  }
}

try {
  verifyEnvironmentVariables();
} catch (error) {
  console.error('Firebase Admin initialization failed:', error);
  throw error;
}

// Initialize Firebase Admin
const apps = getApps();

const adminApp: App = !apps.length
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET
    })
  : apps[0];

// Initialize Admin services with explicit naming to avoid conflicts
const adminAuth: Auth = getAuth(adminApp);
const adminDb: Firestore = getFirestore(adminApp);
const adminStorage: Storage = getStorage(adminApp);

// Export services with admin prefix
export { adminAuth, adminDb, adminStorage };

// Export the admin app instance if needed
export { adminApp };

// Export a type for the admin context if needed
export type FirebaseAdminApp = typeof adminApp;