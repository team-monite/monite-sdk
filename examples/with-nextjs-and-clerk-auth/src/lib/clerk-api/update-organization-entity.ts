import type { clerkClient as clerkClientType } from '@clerk/nextjs/server';

import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';

type EntityData = Partial<
  Pick<
    ReturnType<typeof getOrganizationEntityData>,
    'entity_id' | 'default_roles'
  >
>;

type UpdateOrganizationEntityParams = {
  /** Clerk Organization that the new Entity will represent */
  organizationId: string;
  /** The new Entity data */
  entity: EntityData;
};

export const updateOrganizationEntity = async (
  { organizationId, entity }: UpdateOrganizationEntityParams,
  clerkClient: typeof clerkClientType
) => {
  const client = await clerkClient();

  return client.organizations.updateOrganizationMetadata(organizationId, {
    privateMetadata: entity,
  });
};
