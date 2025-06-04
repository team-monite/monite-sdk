'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';

const IS_BUILD_PROCESS = process.env.NEXT_PHASE === 'phase-production-build';

export const getCurrentUserEntity = async () => {
  if (IS_BUILD_PROCESS) {
    return {
      entity_id: 'mock_entity_id_for_build',
      entity_user_id: 'mock_entity_user_id_for_build',
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
  const defaultEntityUserData = {
    entity_user_id: null,
  };

  return { entity_id, ...(entityUserData || defaultEntityUserData) };
};
