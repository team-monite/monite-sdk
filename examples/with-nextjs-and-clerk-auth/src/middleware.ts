import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { getClerkPublishableKey } from '@/lib/utils/build-time-detection';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware#protect-all-routes for more information about configuring your middleware

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/in/clerk',
  '/api/healthcheck',
  '/public',
]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  },
  { publishableKey: getClerkPublishableKey() }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
