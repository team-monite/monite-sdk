import { createEntity } from '@/lib/monite-api/create-entity';
import { generateEntityAddress } from '@/lib/monite-api/demo-data-generator/generate-entity';
import { chooseRandomCountryForDataGeneration } from '@/lib/monite-api/demo-data-generator/seed-values';
import type { AccessToken } from '@/lib/monite-api/fetch-token';

type CreateOrganizationEntityParams = {
  /** Organization email */
  email: string;
  /** Organization name */
  legal_name: string;
};

/**
 * Creates a new Entity with the Clerk profile
 * Does not(!) update the Organization with the new `entity_id`
 *
 * @returns The created Entity
 */
export const createOrganizationEntity = (
  { email, legal_name }: CreateOrganizationEntityParams,
  token: AccessToken
) => {
  return createEntity(
    {
      email,
      type: 'organization',
      organization: {
        legal_name,
      },
      address: {
        country: chooseRandomCountryForDataGeneration(),
        ...generateEntityAddress(),
      },
    },
    token
  );
};
