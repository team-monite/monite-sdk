import { delay } from '@/mocks/utils';
import {
  COUNTERPARTS_ENDPOINT,
  COUNTERPARTS_VAT_ENDPOINT,
  CounterpartVatIDResourceList,
  ErrorSchemaResponse,
  TaxIDTypeEnum,
} from '@monite/sdk-api';
import type {
  CounterpartVatIDResponse,
  CounterpartVatID,
  UpdateCounterpartContactPayload,
} from '@monite/sdk-api';

import { rest } from 'msw';

import {
  counterpartVatFixture,
  counterpartVatsByCounterpartIdFixture,
} from './counterpartVatFixture';

type CreateCounterpartVatParams = { counterpartId: string };
type UpdateCounterpartVatParams = CreateCounterpartVatParams & {
  vatId: string;
};

const vatPath = `*/${COUNTERPARTS_ENDPOINT}/:counterpartId/${COUNTERPARTS_VAT_ENDPOINT}`;
const vatIdPath = `${vatPath}/:vatId`;

export const counterpartVatHandlers = [
  // read list
  rest.get<
    undefined,
    CreateCounterpartVatParams,
    CounterpartVatIDResourceList | ErrorSchemaResponse
  >(vatPath, (req, res, ctx) => {
    const { counterpartId } = req.params;

    const fixture = counterpartVatsByCounterpartIdFixture[counterpartId];

    if (!fixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Counterpart not found',
          },
        })
      );
    }

    return res(delay(2_000), ctx.json({ data: fixture }));
  }),

  // create
  rest.post<
    CounterpartVatID,
    CreateCounterpartVatParams,
    CounterpartVatIDResponse
  >(vatPath, async (req, res, ctx) => {
    const json = await req.json<CounterpartVatID>();

    const response: CounterpartVatIDResponse = {
      id: (Math.random() + 1).toString(36).substring(7),
      counterpart_id: counterpartVatFixture.counterpart_id,
      ...json,
      country: json.country ?? counterpartVatFixture.country,
      type: json.type as TaxIDTypeEnum,
      value: json.value ?? counterpartVatFixture.value,
    };

    return res(delay(), ctx.json(response));
  }),

  // read
  rest.get<
    undefined,
    UpdateCounterpartVatParams,
    CounterpartVatIDResponse | ErrorSchemaResponse
  >(vatIdPath, (req, res, ctx) => {
    const { vatId } = req.params;
    const flatVatList = Object.values(
      counterpartVatsByCounterpartIdFixture
    ).flatMap((vats) => vats);
    const vat = flatVatList.find((vat) => vat.id === vatId);
    console.log('vat: ', vat);

    if (!vat) {
      return res(
        ctx.status(404),
        delay(),
        ctx.json({
          error: {
            message: 'Not found',
          },
        })
      );
    }

    return res(ctx.json(vat));
  }),

  // update
  rest.patch<
    UpdateCounterpartContactPayload,
    UpdateCounterpartVatParams,
    CounterpartVatIDResponse | ErrorSchemaResponse
  >(vatIdPath, async (req, res, ctx) => {
    const { counterpartId, vatId } = req.params;
    const json = await req.json<CounterpartVatIDResponse>();

    const vatsFixture = counterpartVatsByCounterpartIdFixture[counterpartId];
    const vatFixture = vatsFixture.find((vat) => vat.id === vatId);

    if (!vatFixture) {
      return res(
        ctx.status(404),
        delay(),
        ctx.json({
          error: {
            message: 'Not found',
          },
        })
      );
    }

    return res(delay(), ctx.json({ ...vatFixture, ...json }));
  }),

  // delete
  rest.delete<undefined, UpdateCounterpartVatParams, boolean>(
    vatIdPath,
    (req, res, ctx) => {
      return res(delay(), ctx.json(true));
    }
  ),
];
