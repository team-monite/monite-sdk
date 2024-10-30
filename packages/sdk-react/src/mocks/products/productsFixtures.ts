import { ProductServiceTypeEnum } from '@/enums/ProductServiceTypeEnum';
import { entityIds } from '@/mocks/entities';
import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  getRandomItemFromArray,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import type { components } from '@monite/sdk-api/src/api';

import { measureUnitsListFixture } from '../measureUnits/measureUnitsFixture';

export const productsListFixture: Array<ProductServiceResponse> = new Array(130)
  .fill('_')
  .map((_, index) => {
    const product: ProductServiceResponse = {
      id: faker.string.nanoid(),
      name: faker.commerce.productName(),
      type: getRandomItemFromArray(ProductServiceTypeEnum),
      description:
        !index || faker.datatype.boolean()
          ? faker.commerce.productDescription()
          : undefined,
      measure_unit_id: getRandomItemFromArray(measureUnitsListFixture.data).id,
      smallest_amount:
        !index || faker.datatype.boolean()
          ? Number(faker.commerce.price({ min: 1, max: 10 }))
          : undefined,
      entity_id: entityIds[0],
      entity_user_id: getRandomProperty(entityUsers).id,
      created_at: faker.date.past().toString(),
      updated_at: faker.date.past().toString(),
      price: {
        currency: getRandomItemFromArray(['EUR', 'USD', 'GEL', 'KZT']),
        value: Number(faker.commerce.price({ min: 9, max: 9_999 })) * 100,
      },
    };

    return product;
  });

export const createProduct = (
  product: components['schemas']['ProductServiceRequest']
): ProductServiceResponse => ({
  id: faker.string.nanoid(),
  name: product.name,
  type: product.type,
  description: product.description,
  measure_unit_id: product.measure_unit_id,
  smallest_amount: product.smallest_amount,
  entity_id: entityIds[0],
  entity_user_id: getRandomProperty(entityUsers).id,
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  price: {
    currency: product.price?.currency as components['schemas']['CurrencyEnum'],
    value: product.price?.value as number,
  },
});

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
