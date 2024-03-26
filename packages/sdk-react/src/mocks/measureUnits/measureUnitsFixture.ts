import { faker } from '@faker-js/faker';
import { UnitListResponse } from '@monite/sdk-api';

export const measureUnitsListFixture = {
  data: new Array(10).fill('_').map((_) => ({
    id: faker.string.uuid(),
    name: faker.science.unit().name,
    description: faker.lorem.sentence(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
  })),
} as UnitListResponse;
