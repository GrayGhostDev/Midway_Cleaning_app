import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/public(.*)',
    '/api/webhook(.*)',
  ],
  ignoredRoutes: [
    '/api/stripe-webhook(.*)',
    '/_next(.*)',
    '/favicon.ico',
    '/sitemap.xml',
    '/robots.txt',
  ],
  apiRoutes: ['/api/(.*)']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
