'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';

const isBuildTime = () => {
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
