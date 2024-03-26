import {
  ErrorSchemaResponse,
  MEASURE_UNITS_ENDPOINT,
  UnitListResponse,
  UnitResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { delay } from '../utils';
import { measureUnitsListFixture } from './measureUnitsFixture';

const measureUnitsPath = `*/${MEASURE_UNITS_ENDPOINT}`;
const measureUnitsDetailPath = `*/${MEASURE_UNITS_ENDPOINT}/:unitId`;

export const measureUnitsHandlers = [
  rest.get<undefined, {}, UnitListResponse>(measureUnitsPath, (_, res, ctx) => {
    return res(ctx.json(measureUnitsListFixture));
  }),

  rest.get<undefined, { unitId: string }, UnitResponse | ErrorSchemaResponse>(
    measureUnitsDetailPath,
    (req, res, ctx) => {
      const { unitId } = req.params;

      const unit = measureUnitsListFixture.data.find(
        (fixture) => fixture.id === unitId
      );

      if (!unit) {
        return res(
          delay(),
          ctx.status(404),
          ctx.json({
            error: {
              message: 'Not found',
            },
          })
        );
      }

      return res(delay(), ctx.json(unit));
    }
  ),
];
