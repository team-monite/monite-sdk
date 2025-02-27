import { components } from '@/api';

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

  http.post<{}, MeasureUnitRequestBody, UnitResponse | ErrorSchemaResponse>(
    measureUnitsPath,
    async ({ request }) => {
      const json = await request.json();

      if (!json.name) {
        return HttpResponse.json(
          {
            error: {
              message: 'Unit label is required',
            },
          },
          {
            status: 400,
          }
        );
      }

      const existingUnit = measureUnitsListFixture.data.find(
        (unit) => unit.name === json.name
      );

      if (existingUnit) {
        return HttpResponse.json(
          {
            error: {
              message: `Measure unit ${json.name} already exists.`,
            },
          },
          {
            status: 409, // Conflict
          }
        );
      }

      const newUnit = {
        id: `unit-${Math.random().toString(36).substr(2, 9)}`, // Generate a random ID
        name: json.name,
        description: json.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      measureUnitsListFixture.data.push(newUnit);

      await delay();

      return HttpResponse.json(newUnit, {
        status: 201,
      });
    }
  ),

  http.delete<{ unitId: string }, undefined, undefined | ErrorSchemaResponse>(
    measureUnitsDetailPath,
    async ({ params }) => {
      const { unitId } = params;

      const unitIndex = measureUnitsListFixture.data.findIndex(
        (fixture) => fixture.id === unitId
      );

      if (unitIndex === -1) {
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

      measureUnitsListFixture.data.splice(unitIndex, 1);

      await delay();

      return HttpResponse.json(undefined, {
        status: 204, // No Content
      });
    }
  ),

  http.patch<
    { unitId: string },
    MeasureUnitRequestBody,
    UnitResponse | ErrorSchemaResponse
  >(measureUnitsDetailPath, async ({ params, request }) => {
    const { unitId } = params;
    const json = await request.json();

    const unitIndex = measureUnitsListFixture.data.findIndex(
      (fixture) => fixture.id === unitId
    );

    if (unitIndex === -1) {
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

    measureUnitsListFixture.data[unitIndex] = {
      ...measureUnitsListFixture.data[unitIndex],
      ...json,
      updated_at: new Date().toISOString(),
    };

    await delay();

    return HttpResponse.json(measureUnitsListFixture.data[unitIndex], {
      status: 200,
    });
  }),
];

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type UnitListResponse = components['schemas']['UnitListResponse'];
type UnitResponse = components['schemas']['UnitResponse'];
type MeasureUnitRequestBody = {
  name: string;
  description?: string;
};
