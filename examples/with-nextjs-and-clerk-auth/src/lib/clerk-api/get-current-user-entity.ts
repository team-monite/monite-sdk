'use server';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export const getCurrentUserEntity = async () => {
  const { orgId } = await auth();

  const client = await clerkClient();

  const organization =
    (orgId &&
      (await client.organizations.getOrganization({
        organizationId: orgId,
      }))) ||
    undefined;

  // @ts-ignore
  const { entity_id } = getOrganizationEntityData(organization);
  // @ts-ignore
  const entityUserData = getEntityUserData(entity_id, await currentUser());
  return { entity_id, ...entityUserData };
};
