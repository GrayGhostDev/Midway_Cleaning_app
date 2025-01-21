# Clerk Authentication Setup Guide

## Installation

Install Clerk's Next.js SDK:

```bash
npm install @clerk/nextjs@^5.0.0
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_... # Optional, for webhooks
```

## Middleware Configuration

The middleware (src/middleware.ts) handles:
- Public routes (no auth required)
- Protected routes (auth required)
- Admin routes (auth + admin role required)

## Role-Based Access Control

Roles are managed through Clerk's session claims:
- Admin access: requires 'admin' role
- Staff access: requires 'staff' role
- Client access: default role

## Protected Routes

- Public: '/', '/sign-in(.*)', '/sign-up(.*)', '/api/public(.*)'
- Admin only: '/admin(.*)', '/api/admin(.*)'
- Authenticated: all other routes

## Security Best Practices

1. Use environment variables for sensitive keys
2. Implement proper route protection
3. Use HTTPS in production
4. Regularly rotate API keys
5. Enable MFA for admin accounts

For more information, visit the [Clerk Documentation](https://clerk.com/docs).