import type { User } from '@clerk/clerk-sdk-node';

export const getEntityUserData = (
  entity_id: string | null | undefined,
  user: User | null | undefined
): Partial<UserEntityData> => {
  const entities = getUserEntitiesData(user);

  return entity_id && entities[entity_id] ? entities[entity_id] : {};
};

export type UserEntityData = {
  entity_user_id: string | null;
  organization_id: string | null;
};

export const getUserEntitiesData = (
  user: User | null | undefined
): Record<string, UserEntityData> => {
  const userPrivateMetadata = user?.privateMetadata;

  const entities =
    (userPrivateMetadata &&
      'entities' in userPrivateMetadata &&
      (userPrivateMetadata?.entities as unknown)) ||
    undefined;

  if (!entities || typeof entities !== 'object') return {};

  return Object.fromEntries(
    Object.entries(entities).filter(([key, value]) => isEntityUserObject(value))
  );
};

const isEntityUserObject = (entity: unknown): entity is UserEntityData =>
  !!entity &&
  typeof entity === 'object' &&
  'entity_user_id' in entity &&
  (typeof entity.entity_user_id === 'string' || entity.entity_user_id === null);
