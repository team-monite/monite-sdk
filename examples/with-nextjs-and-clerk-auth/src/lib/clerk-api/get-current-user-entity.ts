'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';

// Check if we are in a build environment (this env var is set by Next.js during build)
const IS_BUILD_PROCESS = process.env.NEXT_PHASE === 'phase-production-build';

export const getCurrentUserEntity = async () => {
  if (IS_BUILD_PROCESS) {
    // Provide mock/default IDs for static export if the page needs to be built.
    // These should be valid string formats if your components expect strings.
    // IMPORTANT: These mock IDs should ideally allow the Onboarding component
    // to render in a basic or empty state without making actual API calls
    // that would fail without a real token.
    console.log('Build process: Using mock entity/user IDs for static export.');
    return {
      entity_id: 'mock_entity_id_for_build',
      entity_user_id: 'mock_entity_user_id_for_build',
      // Spread dummy values for other expected fields from entityUserData if necessary
      // e.g., first_name: 'Mock', last_name: 'User', etc. to match the structure.
      // This depends on what getEntityUserData normally returns and what MoniteProvider expects.
    };
  }

  const { orgId } = await auth();
  const client = await clerkClient();

  const organization =
    (orgId &&
      (await client.organizations.getOrganization({
        organizationId: orgId,
      }))) ||
    undefined;

  const { entity_id } = getOrganizationEntityData(organization);
  const user = await currentUser();
  const entityUserData = getEntityUserData(entity_id, user);
  // Ensure entityUserData is not null/undefined if it can be, and provide defaults
  // if its properties are directly spread and might be missing.
  const defaultEntityUserData = {
    entity_user_id: null, // Or some other default
    // ... other default fields that getEntityUserData might return
  };

  return { entity_id, ...(entityUserData || defaultEntityUserData) };
};
