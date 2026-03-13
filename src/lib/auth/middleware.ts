// Re-export from the unified auth module for backwards compatibility.
// New code should import directly from '@/lib/auth'.
export { withApiAuth as withAuth, type Role, can, canAccess, hasRole } from '@/lib/auth';
