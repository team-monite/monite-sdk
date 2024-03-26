import type { clerkClient as clerkClientType } from '@clerk/nextjs';

import { UserEntityData } from '@/lib/clerk-api/get-entity-user-data';

export const updateUserEntity = async (
  userId: string,
  {
    entity_id,
    entity_user_id,
    organization_id,
  }: UserEntityData & { entity_id: string | null | undefined },
  clerkClient: typeof clerkClientType
) => {
  if (!entity_id) throw new Error('entity_id is empty');

  const entityData: UserEntityData = {
    entity_user_id,
    organization_id,
  };

  // Avoid destructuring of `privateMetadata`, including nested objects,
  // as Clerk does not remove properties when set to `undefined`,
  // only when explicitly set to `null`.
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      entities: {
        [entity_id]: entityData,
      },
    },
  });
};
