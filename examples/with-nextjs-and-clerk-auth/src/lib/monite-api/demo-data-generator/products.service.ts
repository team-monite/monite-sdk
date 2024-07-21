import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

import { GeneralService, getRandomItemFromArray } from './general.service';

interface ProductsServiceOptions {
  /**
   * Describes, how many products should be created.
   * By default, 5
   */
  count: number;

  /**
   * Describes, which currency should be used for products.
   *
   * By default, EUR
   * Note: will create products with the same currency
   *  If you want to create products with different currencies,
   *  you should call `ProductsService` with different options
   */
  currency: components['schemas']['CurrencyEnum'];

  /**
   * Describes, which type of products should be created.
   * By default, 'all'
   */
  type: components['schemas']['ProductServiceTypeEnum'] | 'all';

  /**
   * Describes, which measure units should be used for products.
   *
   * No default value, this option must be set explicitly
   */
  measureUnits: Array<components['schemas']['UnitResponse']>;
}

export class ProductsService extends GeneralService {
  private options: ProductsServiceOptions = {
    count: 5,
    type: 'all',
    measureUnits: [],
    currency: 'EUR',
  };

  public withOptions(options: Partial<ProductsServiceOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  private async createProduct(): Promise<
    components['schemas']['ProductServiceResponse']
  > {
    const type = (() => {
      if (this.options.type === 'all') {
        return faker.datatype.boolean() ? 'product' : 'service';
      }

      return this.options.type;
    })();

    const { data, error, response } = await this.request.POST(`/products`, {
      params: {
        header: {
          'x-monite-entity-id': this.entityId,
          'x-monite-version': getMoniteApiVersion(),
        },
      },
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: {
          currency: this.options.currency,
          value: Number(faker.commerce.price({ min: 9, max: 9_999 })) * 100,
        },
        type,
        measure_unit_id: getRandomItemFromArray(this.options.measureUnits).id,
      },
    });

    if (error) {
      console.error(
        `❌ Failed to create Product for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Product create failed: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async create(): Promise<
    Array<components['schemas']['ProductServiceResponse']>
  > {
    if (this.options.measureUnits.length === 0) {
      throw new Error(
        'Measure units must be set explicitly before fetching products'
      );
    }

    this.logger?.({ message: 'Creating products...' });

    const products: Array<components['schemas']['ProductServiceResponse']> = [];

    for (let i = 0; i < this.options.count; i++) {
      console.log(
        chalk.bgBlueBright(
          ` - Creating product (${i + 1}/${this.options.count})`
        )
      );

      await this.createProduct()
        .then((product) => {
          products.push(product);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (products.length) {
      this.logger?.({ message: '✅ Products created' });
      console.log(chalk.black.bgGreenBright(`✅ Products created`));
    } else {
      console.error(chalk.black.bgYellow(`❌ Products list is empty`));
    }

    return products;
  }
}
