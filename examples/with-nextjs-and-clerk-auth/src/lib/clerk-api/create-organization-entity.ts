import type { Organization, User } from '@clerk/clerk-sdk-node';

import { createEntity } from '@/lib/monite-api/create-entity';
import { generateEntityAddress } from '@/lib/monite-api/demo-data-generator/generate-entity';
import type { AccessToken } from '@/lib/monite-api/fetch-token';

type CreateOrganizationEntityParams = {
  /** Clerk User who will be the owner of the new Entity */
  owner: Pick<User, 'emailAddresses'>;
  /** Clerk Organization that the new Entity will represent */
  organization: Pick<Organization, 'name'>;
};

/**
 * Creates a new Entity with the Clerk profile
 * Does not(!) update the Organization with the new `entity_id`
 *
 * @returns The created Entity
 */
export const createOrganizationEntity = (
  { owner, organization }: CreateOrganizationEntityParams,
  token: AccessToken
) => {
  return createEntity(
    {
      email: owner.emailAddresses.at(0)?.emailAddress ?? '',
      type: 'organization',
      organization: {
        legal_name: organization.name,
      },
      address: {
        country: 'DE', // We have to use EU country code, because the VAT IDs are used for the data generation
        ...generateEntityAddress(),
      },
    },
    token
  );
};
