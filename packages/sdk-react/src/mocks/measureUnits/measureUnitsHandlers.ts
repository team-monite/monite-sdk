import {
  ErrorSchemaResponse,
  MEASURE_UNITS_ENDPOINT,
  UnitListResponse,
  UnitResponse,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import { delay } from '../utils';
import { measureUnitsListFixture } from './measureUnitsFixture';

const measureUnitsPath = `*/${MEASURE_UNITS_ENDPOINT}`;
const measureUnitsDetailPath = `*/${MEASURE_UNITS_ENDPOINT}/:unitId`;

export const measureUnitsHandlers = [
  http.get<{}, undefined, UnitListResponse>(measureUnitsPath, async () => {
    await delay();

    return HttpResponse.json(measureUnitsListFixture);
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

      return HttpResponse.json(unit);
    }
  ),
];
