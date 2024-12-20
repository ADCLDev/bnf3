// lib/firebase/config.ts
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "bengal-fonts-a19dd.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  console.log('Initializing Firebase');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Firebase already initialized');
  app = getApp();
}

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Firebase persistence enabled'))
  .catch((error) => console.error('Firebase persistence error:', error));

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };