import { NextMiddleware, NextResponse } from 'next/server';

import { authMiddleware as createAuthMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

if (
  process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE &&
  !process.env.CLERK_PROXY_URL
) {
  throw new Error('Clerk Proxy URL must be set when using Clerk Satellite');
}

const authMiddlewareBaseOptions = {
  publicRoutes: ['/api/in/clerk', '/api/healthcheck', '/public'],
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
};

const authMiddleware = createAuthMiddleware(
  // See Clerk's Satellite Domain documentation for more information
  // https://clerk.com/docs/advanced-usage/satellite-domains
  process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE && process.env.CLERK_PROXY_URL
    ? {
        ...authMiddlewareBaseOptions,
        isSatellite: true,
        proxyUrl: process.env.CLERK_PROXY_URL,
        signInUrl: process.env.APP_SIGN_IN_URL, // main domain SignIn URL, not satellite
      }
    : authMiddlewareBaseOptions
);

const authMiddlewareNo401Response: NextMiddleware = async (request, event) => {
  const response = await authMiddleware(request, event);

  if (
    response?.status === 401 &&
    process.env.UNSTABLE_CLERK_401_RESPONSE_FIX?.toLowerCase() === 'true'
  ) {
    return NextResponse.next({
      headers: response?.headers,
      status: 200,
      statusText: response?.statusText,
      request,
    });
  }

  return response;
};

export default authMiddlewareNo401Response;

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
