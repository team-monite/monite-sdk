import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import { GeneralService } from '@/lib/monite-api/demo-data-generator/general.service';
import { reminderDaysBeforeTerm } from '@/lib/monite-api/demo-data-generator/payment-reminders';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

interface PaymentTermsServiceOptions {
  /**
   * Describes, how many payment terms should be created.
   * By default, 5
   */
  count: number;
}

export class PaymentTermsService extends GeneralService {
  private options: PaymentTermsServiceOptions = {
    count: 5,
  };

  public withOptions(options: Partial<PaymentTermsServiceOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  private async createPaymentTerm(): Promise<
    components['schemas']['PaymentTermsResponse']
  > {
    const term_1 = {
      discount: faker.number.int({ min: 10, max: 50 }),
      number_of_days: faker.number.int({
        min: reminderDaysBeforeTerm + 2,
        max: 20,
      }),
    };

    const term_2 = {
      discount: faker.number.int({ min: 1, max: term_1.discount }),
      number_of_days: faker.number.int({
        min: term_1.number_of_days + reminderDaysBeforeTerm + 2,
        max: term_1.number_of_days + 20,
      }),
    };

    const term_final = {
      number_of_days: faker.number.int({
        min: term_2.number_of_days + reminderDaysBeforeTerm + 2,
        max: term_2.number_of_days + 80,
      }),
    };

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
          term_1,
          term_2,
          term_final,
          name: `${term_final.number_of_days} days`,
          description: faker.datatype.boolean()
            ? `${term_1.discount}% discount before day ${term_1.number_of_days}`
            : undefined,
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
