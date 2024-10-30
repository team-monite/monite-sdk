import { components } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';

import { measureUnitsListFixture } from './measureUnitsFixture';

const measureUnitsPath = `*/measure_units`;
const measureUnitsDetailPath = `*/measure_units/:unitId`;

export const measureUnitsHandlers = [
  http.get<{}, undefined, UnitListResponse>(measureUnitsPath, async () => {
    await delay();

    return HttpResponse.json(measureUnitsListFixture, {
      status: 200,
    });
  }),

  http.get<{ unitId: string }, undefined, UnitResponse | ErrorSchemaResponse>(
    measureUnitsDetailPath,
    async ({ params }) => {
      const { unitId } = params;

      const unit = measureUnitsListFixture.data.find(
        (fixture) => fixture.id === unitId
      );

      if (!unit) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: 'Not found',
            },
          },
          {
            status: 404,
          }
        );
      }

      await delay();

      return HttpResponse.json(unit, {
        status: 200,
      });
    }
  ),
];

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type UnitListResponse = components['schemas']['UnitListResponse'];
type UnitResponse = components['schemas']['UnitResponse'];
