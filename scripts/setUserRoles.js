const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setUserRoles() {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail('ultrotech1236@gmail.com');
    
    // Update user roles in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: 'ultrotech1236@gmail.com',
      is_admin: true,
      is_contributor: true,
      is_subscriber: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('Successfully updated user roles');
  } catch (error) {
    console.error('Error updating user roles:', error);
  }
  process.exit();
}

setUserRoles(); 