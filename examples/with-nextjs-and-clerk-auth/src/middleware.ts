import { NextMiddleware, NextResponse } from 'next/server';

import { authMiddleware as createAuthMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

const authMiddleware = createAuthMiddleware({
  publicRoutes: ['/api/in/clerk', '/api/healthcheck', '/public'],
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

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
