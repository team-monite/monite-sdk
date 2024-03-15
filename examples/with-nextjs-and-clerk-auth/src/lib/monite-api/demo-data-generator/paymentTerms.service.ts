import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import { GeneralService } from '@/lib/monite-api/demo-data-generator/general.service';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

interface IPaymentTermsServiceOptions {
  /**
   * Describes, how many payment terms should be created.
   * By default, 5
   */
  count: number;
}

export class PaymentTermsService extends GeneralService {
  private options: IPaymentTermsServiceOptions = {
    count: 5,
  };

  public withOptions(options: Partial<IPaymentTermsServiceOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  private async createPaymentTerm(): Promise<
    components['schemas']['PaymentTermsResponse']
  > {
    const days = faker.number.int({ min: 2, max: 100 });
    const discount = faker.number.int({ min: 1, max: 100 });

    const { data, error, response } = await this.request.POST(
      '/payment_terms',
      {
        params: {
          header: {
            'x-monite-entity-id': this.entityId,
            'x-monite-version': getMoniteApiVersion(),
          },
        },
        body: {
          name: `${days} days`,
          description: faker.datatype.boolean()
            ? `${discount}% discount before day ${faker.number.int({
                min: 1,
                max: 20,
              })}`
            : undefined,
          term_final: {
            number_of_days: days,
          },
        },
      }
    );

    if (error) {
      console.error(
        `❌ Failed to create payment term for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Product create failed: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async create(): Promise<
    Array<components['schemas']['PaymentTermsResponse']>
  > {
    if (this.options.count === 0) {
      throw new Error('Count for payment terms should be greater than 0');
    }

    this.logger?.({ message: 'Creating payment terms...' });

    const paymentTerms: Array<components['schemas']['PaymentTermsResponse']> =
      [];

    for (let i = 0; i < this.options.count; i++) {
      console.log(
        chalk.bgBlueBright(
          ` - Creating payment term (${i + 1}/${this.options.count})`
        )
      );

      await this.createPaymentTerm()
        .then((paymentTerm) => paymentTerms.push(paymentTerm))
        .catch(console.error);
    }

    if (paymentTerms.length) {
      this.logger?.({ message: '✅ Payment terms created' });
      console.log(chalk.black.bgGreenBright(`✅ Payment terms created`));
    } else {
      console.log(chalk.black.bgYellow(`❌ Payment terms not created`));
    }

    return paymentTerms;
  }
}
