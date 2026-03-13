// Re-export from the unified auth module.
// This file exists for backwards compatibility with imports from '@/middleware/auth'.
export { withApiAuth as withAuth, type Role, AuthError } from '@/lib/auth';
