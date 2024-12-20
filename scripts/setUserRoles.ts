import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccount.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore();
const auth = getAuth();

async function setUserRoles() {
  try {
    const userRecord = await auth.getUserByEmail('ultrotech1236@gmail.com');
    
    await db.collection('users').doc(userRecord.uid).set({
      email: 'ultrotech1236@gmail.com',
      is_admin: true,
      is_contributor: true,
      is_subscriber: true,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('Successfully updated user roles');
  } catch (error) {
    console.error('Error updating user roles:', error);
  }
  process.exit();
}

setUserRoles(); 