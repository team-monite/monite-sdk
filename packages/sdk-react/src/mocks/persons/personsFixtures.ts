import { components } from '@/api';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { getRandomItemFromArray } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

export const personFixture = (
  person?: Partial<PersonRequest>
): PersonResponse => {
  return {
    citizenship: getRandomItemFromArray(AllowedCountries),
    created_by_entity_user_id: faker.string.uuid(),
    address: {
      country: person?.address?.country ?? faker.location.countryCode(),
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postal_code: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
    },
    date_of_birth: faker.date.birthdate().toISOString(),
    first_name: person?.first_name ?? faker.person.firstName(),
    last_name: person?.last_name ?? faker.person.lastName(),
    email: person?.email ?? faker.internet.email(),
    phone: faker.phone.number(),
    relationship: {
      title: faker.person.jobTitle(),
      representative: person?.relationship?.representative ?? false,
      executive: person?.relationship?.executive ?? false,
      director: person?.relationship?.director ?? false,
      owner: person?.relationship?.owner ?? false,
      percent_ownership: faker.number.int({ min: 0, max: 100 }),
    },
    id_number: faker.number.int({ min: 0, max: 10 }).toString(),
    ssn_last_4: faker.number.int({ min: 1000, max: 9999 }).toString(),
    id: faker.string.uuid(),
    entity_id: faker.string.uuid(),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  };
};

type PersonRequest = components['schemas']['PersonRequest'];
type PersonResponse = components['schemas']['PersonResponse'];
