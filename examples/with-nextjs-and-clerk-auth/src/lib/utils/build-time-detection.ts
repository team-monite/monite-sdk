/**
 * Utility function to detect if we're in a build-time environment
 * This helps prevent runtime API calls during Next.js static page generation
 */
export const isBuildTime = () => {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

  if (isBuild) {
    return true;
  }

  const isCiBuild =
    process.env.NODE_ENV === 'production' &&
    typeof window === 'undefined' &&
    (!process.env.CLERK_SECRET_KEY || !process.env.MONITE_API_URL);

  if (isCiBuild) {
    return true;
  }

  return false;
};

/**
 * Get Clerk publishable key with build-time fallback
 */
export const getClerkPublishableKey = () => {
  if (isBuildTime()) {
    return 'pk_test_mock_key_for_build_time';
  }

  return process.env.CLERK_PUBLISHABLE_KEY;
};
