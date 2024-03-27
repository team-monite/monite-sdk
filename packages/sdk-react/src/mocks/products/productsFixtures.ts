import { measureUnitsListFixture } from '@/mocks';
import { entityIds } from '@/mocks/entities';
import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  getRandomItemFromArray,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  CurrencyEnum,
  ProductServiceRequest,
  ProductServiceResponse,
  ProductServiceTypeEnum,
} from '@monite/sdk-api';

export const productsListFixture: Array<ProductServiceResponse> = new Array(130)
  .fill('_')
  .map((_) => {
    const product: ProductServiceResponse = {
      id: faker.string.nanoid(),
      name: faker.commerce.productName(),
      type: getRandomProperty(ProductServiceTypeEnum),
      description: faker.commerce.productDescription(),
      measure_unit_id: getRandomItemFromArray(measureUnitsListFixture.data).id,
      smallest_amount: Number(faker.commerce.price({ min: 1, max: 10 })),
      entity_id: entityIds[0],
      entity_user_id: getRandomProperty(entityUsers).id,
      created_at: faker.date.past().toString(),
      updated_at: faker.date.past().toString(),
      price: {
        currency: getRandomProperty({
          EUR: CurrencyEnum.EUR,
          USD: CurrencyEnum.USD,
          GEL: CurrencyEnum.GEL,
          KZT: CurrencyEnum.KZT,
        }),
        value: Number(faker.commerce.price({ min: 9, max: 9_999 })) * 100,
      },
    };

    return product;
  });

export const createProduct = (
  product: ProductServiceRequest
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
    currency: product.price?.currency as CurrencyEnum,
    value: product.price?.value as number,
  },
});
