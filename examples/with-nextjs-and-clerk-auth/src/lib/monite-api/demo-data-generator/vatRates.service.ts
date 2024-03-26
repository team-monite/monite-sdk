import chalk from 'chalk';

import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

import { GeneralService } from './general.service';

export class VatRatesService extends GeneralService {
  public async getAll(): Promise<
    components['schemas']['VatRateListResponse']['data']
  > {
    this.logger?.({ message: 'Fetching entity VAT rates...' });

    const { data, error, response } = await this.request.GET(`/vat_rates`, {
      params: {
        header: {
          'x-monite-entity-id': this.entityId,
          'x-monite-version': getMoniteApiVersion(),
        },
      },
    });

    if (error) {
      console.error(
        `❌ Failed to fetch VAT rates for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`VAT rates fetch error: ${JSON.stringify(error)}`);
    }

    console.log(chalk.black.bgGreenBright(`✅ VAT rates fetched`));
    this.logger?.({ message: '✅ VAT rates fetched' });

    if (!data.data.length)
      console.log(chalk.black.bgYellow(`❌ VAT rates list is empty`));

    return data.data;
  }
}
