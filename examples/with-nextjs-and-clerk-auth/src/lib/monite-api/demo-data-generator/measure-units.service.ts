import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import { GeneralService } from '@/lib/monite-api/demo-data-generator/general.service';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface IMeasureUnitsServiceOptions {
  /**
   * Describes, how many measure units should be created.
   * By default, 5
   */
  count: number;
}

export class MeasureUnitsService extends GeneralService {
  private options: IMeasureUnitsServiceOptions = {
    count: 5,
  };

  private async createMeasureUnit(): Promise<
    components['schemas']['UnitResponse']
  > {
    const { data, error, response } = await this.request.POST(
      `/measure_units`,
      {
        params: {
          header: {
            'x-monite-entity-id': this.entityId,
            'x-monite-version': getMoniteApiVersion(),
          },
        },
        body: {
          name:
            faker.science.unit().name + '-' + randomIntFromInterval(1, 1000),
        },
      }
    );

    if (error) {
      console.error(
        `❌ Failed to create "Measure Unit" for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Measure unit create failed: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async create(): Promise<Array<components['schemas']['UnitResponse']>> {
    this.logger?.({ message: 'Creating Measure units...' });

    const measureUnits: Array<components['schemas']['UnitResponse']> = [];

    for (let i = 0; i < this.options.count; i++) {
      const message = ` - Creating measure unit (${i + 1}/${
        this.options.count
      })`;

      console.log(chalk.bgBlueBright(message));
      this.logger?.({
        message: message,
      });

      await this.createMeasureUnit()
        .then((measureUnit) => {
          measureUnits.push(measureUnit);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (measureUnits.length) {
      console.log(chalk.black.bgGreenBright(`✅ Measure units created`));
      this.logger?.({ message: '✅ Measure units created' });
    } else {
      console.error(chalk.black.bgYellow(`❌ Measure units list is empty`));
    }

    return measureUnits;
  }
}
