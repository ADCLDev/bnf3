import { setUserAsAdmin } from '../lib/firebase/database/admin';

// Replace with your user ID
const ADMIN_USER_ID = 'your_user_id_here';

async function makeUserAdmin() {
  try {
    await setUserAsAdmin(ADMIN_USER_ID);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

makeUserAdmin(); 