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

  /**
   * Describes, which entity vat ids should be used for receivables.
   * No default value, this option must be set explicitly
   */
  entityVats: Array<components['schemas']['EntityVatIDResponse']>;

  /**
   * Describes, which payment terms should be used for receivables.
   * No default value, this option must be set explicitly
   */
  paymentTerms: Array<components['schemas']['PaymentTermsResponse']>;
}

export class ReceivablesService extends GeneralService {
  private options: IReceivablesServiceOptions = {
    count: 15,
    type: 'invoice',
    products: [],
    counterparts: [],
    vatRates: [],
    entityVats: [],
    paymentTerms: [],
    currency: 'EUR',
  };

  public withOptions(options: Partial<IReceivablesServiceOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  private async issueReceivable(
    receivable: components['schemas']['ReceivableResponse']
  ) {
    const { data, error, response } = await this.request.POST(
      '/receivables/{receivable_id}/issue',
      {
        params: {
          path: {
            receivable_id: receivable.id,
          },
          header: {
            'x-monite-entity-id': this.entityId,
            'x-monite-version': getMoniteApiVersion(),
          },
        },
      }
    );

    if (error) {
      console.error(
        `❌ Failed to issue receivable for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Receivable issue failed: ${JSON.stringify(error)}`);
    }

    return data;
  }

  /**
   * Issue invoices for the entity
   * !!! Note !!!
   * This method works only for invoices in status `Draft`
   */
  public async issueReceivables(
    receivables: Array<components['schemas']['ReceivableResponse']>
  ) {
    this.logger?.({ message: 'Issuing receivables...' });

    const receivablesToIssue = receivables.filter((receivable, index) => {
      /**
       * Issue half of the receivables
       * We don't want to issue all of them
       */
      return index % 2 === 0;
    });

    for (let i = 0; i < receivablesToIssue.length; i++) {
      console.log(
        chalk.bgBlueBright(
          ` - Issuing receivable (${i + 1}/${receivablesToIssue.length})`
        )
      );

      /**
       * We have to wait for the response, otherwise our backend
       *  may reject us if we perform 10+ request simultaneously
       */
      await this.issueReceivable(receivablesToIssue[i]).catch(console.error);
    }

    this.logger?.({ message: '✅ Receivables issued' });
    console.log(chalk.black.bgGreenBright(`✅ Receivables issued`));
  }

  private async createReceivable(): Promise<
    components['schemas']['ReceivableResponse']
  > {
    const counterpart = getRandomItemFromArray(this.options.counterparts);
    if (!counterpart.default_billing_address_id)
      throw new Error(
        `Counterpart ${counterpart.id} does not have default billing address`
      );

    switch (this.options.type) {
      case 'invoice': {
        const payload = {
          type: this.options.type,
          currency: this.options.currency,
          counterpart_id: counterpart.id,
          counterpart_billing_address_id:
            counterpart.default_billing_address_id,
          line_items: this.options.products
            /**
             * Randomly take an item from `products`
             *  (approximately products.length / 2 items)
             */
            .sort(() => 0.5 - Math.random())
            .map((product) => {
              const result = {
                product_id: product.id,
                quantity: faker.number.int({ min: 1, max: 20 }),
              } as components['schemas']['LineItem'];
              result.vat_rate_id = getRandomItemFromArray(
                this.options.vatRates
              ).id;
              return result;
            }),
          entity_vat_id_id: getRandomItemFromArray(this.options.entityVats).id,
          payment_terms_id: getRandomItemFromArray(this.options.paymentTerms)
            .id,
        } as components['schemas']['ReceivableFacadeCreateInvoicePayload'];
        const { data, error, response } = await this.request.POST(
          `/receivables`,
          {
            params: {
              header: {
                'x-monite-entity-id': this.entityId,
                'x-monite-version': getMoniteApiVersion(),
              },
            },
            body: payload,
          }
        );

        if (error) {
          console.error(
            `❌ Failed to create receivable for the entity_id: "${this.entityId}"`,
            `x-request-id: ${response.headers.get('x-request-id')}`,
            `payload: ${JSON.stringify(payload)}`
          );

          throw new Error(`Receivable create failed: ${JSON.stringify(error)}`);
        }

        return data;
      }

      case 'quote': {
        const { data, error, response } = await this.request.POST(
          `/receivables`,
          {
            params: {
              header: {
                'x-monite-entity-id': this.entityId,
                'x-monite-version': getMoniteApiVersion(),
              },
            },
            body: {
              type: this.options.type,
              currency: this.options.currency,
              counterpart_id: counterpart.id,
              counterpart_billing_address_id:
                counterpart.default_billing_address_id,
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
                    vat_rate_id: getRandomItemFromArray(this.options.vatRates)
                      .id,
                  };
                }),
              entity_vat_id_id: getRandomItemFromArray(this.options.entityVats)
                .id,
            },
          }
        );

        if (error) {
          console.error(
            `❌ Failed to create receivable for the entity_id: "${this.entityId}"`,
            `x-request-id: ${response.headers.get('x-request-id')}`
          );

          throw new Error(`Receivable create failed: ${JSON.stringify(error)}`);
        }

        return data;
      }

      case 'credit_note': {
        throw new Error('Credit note is not supported yet');
      }
    }
  }

  public async create(): Promise<
    Array<components['schemas']['ReceivableResponse']>
  > {
    if (
      this.options.products.length === 0 ||
      this.options.counterparts.length === 0 ||
      this.options.vatRates.length === 0 ||
      this.options.entityVats.length === 0 ||
      this.options.paymentTerms.length === 0
    ) {
      console.error(
        chalk.black.bgRedBright(
          `❌ You must provide products, counterparts, entity vats, payment terms, and vat rates for receivables`
        )
      );
      throw new Error(
        'You must provide products, counterparts, and vat rates for receivables'
      );
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
        .catch(console.error);
    }

    if (receivables.length) {
      console.log(
        chalk.black.bgGreenBright(
          `✅ Receivables (${this.options.type}) created`
        )
      );
      this.logger?.({
        message: `✅ Receivables (${this.options.type}) created`,
      });
    } else {
      console.error(chalk.black.bgYellow(`❌ Receivables list is empty`));
    }

    return receivables;
  }
}
