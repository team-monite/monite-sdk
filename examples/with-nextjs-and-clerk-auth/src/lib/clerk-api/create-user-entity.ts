import type { clerkClient as clerkClientType } from '@clerk/nextjs';

import { getOrganizationEntityData } from '@/lib/clerk-api/get-organization-entity';
import { updateUserEntity } from '@/lib/clerk-api/update-user-entity';
import { createEntityUser } from '@/lib/monite-api/create-entity-user';
import type { AccessToken } from '@/lib/monite-api/fetch-token';
import { getEntityUserByLogin } from '@/lib/monite-api/get-entity-user-by-login';

export const createUserEntity = async (
  {
    organizationId,
    userId,
    role,
    entity: { entity_id, default_roles },
  }: {
    organizationId: string;
    userId: string;
    role: keyof NonNullable<typeof default_roles>;
    entity: Pick<
      ReturnType<typeof getOrganizationEntityData>,
      'entity_id' | 'default_roles'
    >;
  },
  {
    token,
    clerkClient,
  }: { token: AccessToken; clerkClient: typeof clerkClientType }
) => {
  if (!entity_id) throw new Error('entity_id is empty');

  const role_id = default_roles?.[role as keyof typeof default_roles];
  if (!role_id) throw new Error(`role_id is not set for this role "${role}"`);

  const {
    id: login,
    firstName,
    emailAddresses,
    lastName,
    phoneNumbers,
  } = await clerkClient.users.getUser(userId);

  const entityUser =
    (await getEntityUserByLogin({ entity_id, login }, token)) ||
    (await createEntityUser(
      {
        entity_id,
        user: {
          login,
          role_id,
          first_name: firstName || emailAddresses.at(0)?.emailAddress || '',
          last_name: lastName ?? undefined,
          phone: phoneNumbers.at(0)?.phoneNumber ?? undefined,
        },
      },
      token
    ));

  await updateUserEntity(
    userId,
    {
      entity_id,
      entity_user_id: entityUser.id,
      organization_id: organizationId,
    },
    clerkClient
  );

  return entityUser;
};
