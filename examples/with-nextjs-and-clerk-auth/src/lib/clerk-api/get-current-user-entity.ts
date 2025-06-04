'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';
import { isBuildTime } from '@/lib/utils/build-time-detection';

export const getCurrentUserEntity = async () => {
  if (isBuildTime()) {
    return {
      entity_id: 'mock_entity_id_for_build',
      entity_user_id: 'mock_entity_user_id_for_build',
    };
  }

  const { orgId } = await auth();
  const client = await clerkClient();

  const organization =
    orgId &&
    (await client.organizations.getOrganization({
      organizationId: orgId,
    }));

  const entity_id =
    organization && getOrganizationEntityData(organization)?.entity_id;

  if (!entity_id) {
    return {
      entity_id: null,
      entity_user_id: null,
    };
  }

  const user = await currentUser();
  const entityUserData = getEntityUserData(entity_id, user);
  const defaultEntityUserData = {
    entity_user_id: null,
  };

  return { entity_id, ...(entityUserData || defaultEntityUserData) };
};
