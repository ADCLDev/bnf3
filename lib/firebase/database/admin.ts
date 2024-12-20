import { db } from '../config';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

export async function setupAdminDatabase() {
  try {
    // Create collections
    const collections = [
      'users',
      'subscriptions',
      'fonts',
      'activities',
      'gift_cards',
      'type_tools',
      'faqs',
      'legal_documents'
    ];

    for (const collectionName of collections) {
      await setDoc(
        doc(db, '_metadata', collectionName),
        {
          created: Timestamp.now(),
          type: 'collection_metadata'
        },
        { merge: true }
      );
    }

    // Create sample activity
    await setDoc(
      doc(db, 'activities', 'sample_activity'),
      {
        type: 'system_init',
        description: 'System initialized',
        timestamp: Timestamp.now(),
        metadata: {
          initialized_by: 'system'
        }
      }
    );

    console.log('Admin database structure initialized');
  } catch (error) {
    console.error('Error setting up admin database:', error);
    throw error;
  }
}

// Function to set a user as admin
export async function setUserAsAdmin(userId: string) {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        is_admin: true,
        adminSince: Timestamp.now()
      },
      { merge: true }
    );
    console.log('User set as admin successfully');
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
}

// Function to log admin activity
export async function logAdminActivity(
  type: string,
  description: string,
  userId: string,
  metadata?: Record<string, any>
) {
  try {
    await setDoc(doc(db, 'activities', `activity_${Date.now()}`), {
      type,
      description,
      userId,
      timestamp: Timestamp.now(),
      metadata: metadata || {}
    });
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
} 