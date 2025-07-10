import { currentUser } from '@clerk/nextjs/server';

export async function isAdmin() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return false;
    }

    // Check if user has admin role or specific email
    const isAdminUser = user.publicMetadata?.role === 'admin' || 
                       user.emailAddresses?.[0]?.emailAddress === 'admin@epicarcana.com' ||
                       user.emailAddresses?.[0]?.emailAddress === 'your-admin-email@example.com';

    return isAdminUser;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function requireAdmin() {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Admin access required');
  }
  return true;
}

export async function getUserPermissions() {
  const user = await currentUser();
  
  if (!user) {
    return { canRead: false, canWrite: false, canAdmin: false };
  }

  const isAdminUser = await isAdmin();
  
  // Future: Add paid membership check here
  const isPaidMember = user.publicMetadata?.membershipType === 'paid';
  
  return {
    canRead: true, // All authenticated users can read
    canWrite: isAdminUser || isPaidMember, // Admin or paid members can write
    canAdmin: isAdminUser, // Only admin can perform admin actions
    membershipType: user.publicMetadata?.membershipType || 'free'
  };
}