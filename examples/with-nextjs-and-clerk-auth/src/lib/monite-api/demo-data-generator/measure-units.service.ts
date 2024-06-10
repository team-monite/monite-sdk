import chalk from 'chalk';

import { GeneralService } from '@/lib/monite-api/demo-data-generator/general.service';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

export class MeasureUnitsService extends GeneralService {
  private measureUnitNames: Array<string> = ['kg', 'g', 'lbs', 'm', 'cm'];

  private async createMeasureUnit(
    measureUnitName: string
  ): Promise<components['schemas']['UnitResponse']> {
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
          name: measureUnitName,
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

    for (let i = 0; i < this.measureUnitNames.length; i++) {
      const message = ` - Creating measure unit (${i + 1}/${
        this.measureUnitNames.length
      })`;

      console.log(chalk.bgBlueBright(message));
      this.logger?.({
        message: message,
      });

      await this.createMeasureUnit(this.measureUnitNames[i])
        .then((measureUnit) => {
          measureUnits.push(measureUnit);
        })
        .catch((error) => {
          if (
            error instanceof Error &&
            error.message.includes('already exists')
          )
            return;
          console.error(error);
        });
    }

    if (measureUnits.length) {
      console.log(chalk.black.bgGreenBright(`✅ Measure units created`));
      this.logger?.({ message: '✅ Measure units created' });
    } else {
      console.error(
        chalk.black.bgYellow(`⚠️ Did not create any measure units`)
      );
    }

    return measureUnits;
  }

  public async getAll(): Promise<components['schemas']['UnitResponse'][]> {
    const { data, error, response } = await this.request.GET('/measure_units', {
      params: {
        header: {
          'x-monite-entity-id': this.entityId,
          'x-monite-version': getMoniteApiVersion(),
        },
      },
    });

    if (error)
      throw new Error(`Measure units fetch failed: ${JSON.stringify(error)}`);

    return data?.data ?? [];
  }
}
