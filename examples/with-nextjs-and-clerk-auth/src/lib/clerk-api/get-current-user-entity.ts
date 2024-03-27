import { auth, clerkClient, currentUser } from '@clerk/nextjs';

import { getEntityUserData } from '@/lib/clerk-api/get-entity-user-data';
import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';

export const getCurrentUserEntity = async () => {
  const { orgId } = auth();
  const organization =
    (orgId &&
      (await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      }))) ||
    undefined;

  const { entity_id } = getOrganizationEntityData(organization);
  const entityUserData = getEntityUserData(entity_id, await currentUser());
  return { entity_id, ...entityUserData };
};
