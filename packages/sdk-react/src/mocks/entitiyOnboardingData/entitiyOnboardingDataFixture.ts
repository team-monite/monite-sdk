import { components } from '@/api';
import { getRandomItemFromArray } from '@/utils/test-utils-random';
import { faker } from '@faker-js/faker';

export function getEntityOnboardingDataFixture(
  payload?: EntityOnboardingDataResponse
): EntityOnboardingDataResponse {
  return {
    business_profile: {
      mcc: `${getRandomItemFromArray([7623, 8931, 7311, 763, 4511])}`,
      url: faker.internet.url(),
    },
    tos_acceptance: {
      date: faker.date.past().toISOString(),
      ip: '',
    },
    ownership_declaration: {
      date: faker.date.past().toISOString(),
      ip: '',
    },
    ...payload,
  };
}

type EntityOnboardingDataResponse =
  components['schemas']['EntityOnboardingDataResponse'];
