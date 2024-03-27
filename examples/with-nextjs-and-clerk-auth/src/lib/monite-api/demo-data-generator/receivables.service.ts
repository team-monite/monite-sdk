import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

import { GeneralService, getRandomItemFromArray } from './general.service';

interface IReceivablesServiceOptions {
  /**
   * Describes, how many receivables should be created.
   * By default, 15
   */
  count: number;

  /**
   * Describes, which currency should be used for receivables.
   *
   * By default, `CurrencyEnum.EUR`
   * Note: Currency for the invoice must be the same as the currency
   *  for the `products` created before
   */
  currency: components['schemas']['CurrencyEnum'];

  /**
   * Describes, which type of receivables should be created.
   *
   * By default, `InvoiceResponsePayload.type.INVOICE`
   * Note: no other types are supported yet
   */
  type: components['schemas']['ReceivableResponse']['type'];

  /**
   * Describes, which products should be used for receivables.
   *
   * No default value, this option must be set explicitly
   */
  products: Array<components['schemas']['ProductServiceResponse']>;

  /**
   * Describes, which counterparts should be used for receivables.
   *
   * No default value, this option must be set explicitly
   */
  counterparts: Array<components['schemas']['CounterpartResponse']>;

  /**
   * Describes, which vat rate should be used for receivable line items.
   *
   * No default value, this option must be set explicitly
   */
  vatRates: Array<components['schemas']['VatRateResponse']>;
}

export class ReceivablesService extends GeneralService {
  private options: IReceivablesServiceOptions = {
    count: 15,
    type: 'invoice',
    products: [],
    counterparts: [],
    vatRates: [],
    currency: 'EUR',
  };

  public withOptions(options: Partial<IReceivablesServiceOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  private async createReceivable(): Promise<
    components['schemas']['ReceivableResponse']
  > {
    const { data, error, response } = await this.request.POST(`/receivables`, {
      params: {
        header: {
          'x-monite-entity-id': this.entityId,
          'x-monite-version': getMoniteApiVersion(),
        },
      },
      body: {
        type: 'invoice',
        currency: this.options.currency,
        counterpart_id: getRandomItemFromArray(this.options.counterparts).id,
        line_items: this.options.products
          /**
           * Randomly take an item from `products`
           *  (approximately products.length / 2 items)
           */
          .sort(() => 0.5 - Math.random())
          .map((product) => {
            return {
              product_id: product.id,
              quantity: faker.number.int({ min: 1, max: 20 }),
              vat_rate_id: getRandomItemFromArray(this.options.vatRates).id,
            };
          }),
      },
    });

    if (error) {
      console.error(
        `❌ Failed to create receivable for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Receivable create failed: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async create(): Promise<
    Array<components['schemas']['ReceivableResponse']>
  > {
    if (
      this.options.products.length === 0 ||
      this.options.counterparts.length === 0 ||
      this.options.vatRates.length === 0
    ) {
      console.error(
        chalk.black.bgRedBright(
          `❌ You must provide products, counterparts, and vat rates for receivables`
        )
      );
      throw new Error(
        'You must provide products, counterparts, and vat rates for receivables'
      );
    }

    if (this.options.type !== 'invoice') {
      throw new Error('Only invoices are supported for now');
    }

    this.logger?.({ message: 'Creating receivables...' });

    const receivables: Array<components['schemas']['ReceivableResponse']> = [];

    for (let i = 0; i < this.options.count; i++) {
      console.log(
        chalk.bgBlueBright(
          ` - Creating receivable (${i + 1}/${this.options.count})`
        )
      );

      await this.createReceivable()
        .then((receivable) => receivables.push(receivable))
        .catch((error) => {
          console.error(error);
        });
    }

    if (receivables.length) {
      console.log(chalk.black.bgGreenBright(`✅ Receivables created`));
      this.logger?.({ message: '✅ Receivables created' });
    } else {
      console.error(chalk.black.bgYellow(`❌ Receivables list is empty`));
    }

    return receivables;
  }
}
