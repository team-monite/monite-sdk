import { faker } from '@faker-js/faker';
import { components } from '@monite/sdk-api/src/api';

export const measureUnitsListFixture: components['schemas']['UnitListResponse'] =
  {
    data: new Array(10).fill('_').map((_) => ({
      id: faker.string.uuid(),
      name: faker.science.unit().name,
      description: faker.lorem.sentence(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.past().toISOString(),
    })),
  };
