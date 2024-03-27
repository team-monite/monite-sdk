import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import { getRandomBoolean, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  CounterpartIndividualRootResponse,
  CounterpartOrganizationRootResponse,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

import { individualId, organizationId } from '../counterpart.mocks.types';

function createCounterpartOrganization(): CounterpartOrganizationRootResponse {
  const taxId = faker.datatype.boolean(0.9)
    ? faker.string.numeric(10)
    : undefined;

  return {
    id: faker.string.uuid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    type: CounterpartType.ORGANIZATION,
    tax_id: taxId,
    organization: {
      legal_name: faker.company.name(),
      is_vendor: getRandomBoolean(),
      is_customer: getRandomBoolean(),
      phone: faker.phone.number('+ ### ### ## ##'),
      email: faker.internet.email(),
    },
    created_by_entity_user_id: getRandomProperty(entityUsers).id,
  };
}

function createCounterpartIndividual(): CounterpartIndividualRootResponse {
  const taxId = faker.datatype.boolean(0.9)
    ? faker.string.numeric(10)
    : undefined;

  return {
    id: faker.string.uuid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    type: CounterpartType.INDIVIDUAL,
    tax_id: taxId,
    individual: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      is_vendor: getRandomBoolean(),
      is_customer: getRandomBoolean(),
      phone: faker.phone.number('+ ### ### ## ##'),
      email: faker.internet.email(),
    },
    created_by_entity_user_id: getRandomProperty(entityUsers).id,
  };
}

export const counterpartOrganizationFixture: CounterpartOrganizationRootResponse =
  {
    id: organizationId,
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    type: CounterpartType.ORGANIZATION,
    organization: {
      legal_name: faker.company.name(),
      is_vendor: true,
      is_customer: true,
      phone: faker.phone.number('+ ### ### ## ##'),
      email: faker.internet.email(),
    },
    created_by_entity_user_id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  };

export const counterpartIndividualFixture: CounterpartIndividualRootResponse = {
  id: individualId,
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  type: CounterpartType.INDIVIDUAL,
  individual: {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    is_vendor: true,
    is_customer: true,
    phone: faker.phone.number('+ ### ### ## ##'),
    email: faker.internet.email(),
  },
  created_by_entity_user_id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
};

export const counterpartDetailsFixtures: {
  [key: string]:
    | CounterpartOrganizationRootResponse
    | CounterpartIndividualRootResponse;
} = {
  [organizationId]: counterpartOrganizationFixture,
  [individualId]: counterpartIndividualFixture,
};

export const counterpartListFixture: CounterpartResponse[] = [
  counterpartOrganizationFixture,
  counterpartIndividualFixture,
  createCounterpartOrganization(),
  createCounterpartOrganization(),
  createCounterpartIndividual(),
  createCounterpartIndividual(),
  createCounterpartOrganization(),
  createCounterpartOrganization(),
  createCounterpartOrganization(),
  createCounterpartIndividual(),
  createCounterpartIndividual(),
  createCounterpartOrganization(),
  createCounterpartOrganization(),
  createCounterpartOrganization(),
  createCounterpartIndividual(),
  createCounterpartIndividual(),
  createCounterpartOrganization(),
];
