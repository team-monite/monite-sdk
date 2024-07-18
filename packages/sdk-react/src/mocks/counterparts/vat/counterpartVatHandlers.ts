import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import {
  counterpartVatFixture,
  counterpartVatsByCounterpartIdFixture,
} from './counterpartVatFixture';

type CreateCounterpartVatParams = { counterpartId: string };
type UpdateCounterpartVatParams = CreateCounterpartVatParams & {
  vatId: string;
};

const vatPath = `*/counterparts/:counterpartId/vat_ids`;
const vatIdPath = `${vatPath}/:vatId`;

export const counterpartVatHandlers = [
  // read list
  http.get<
    CreateCounterpartVatParams,
    undefined,
    CounterpartVatIDResourceList | ErrorSchemaResponse
  >(vatPath, async ({ params }) => {
    const { counterpartId } = params;

    const fixture = counterpartVatsByCounterpartIdFixture[counterpartId];

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Counterpart not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json({ data: fixture });
  }),

  // create
  http.post<
    CreateCounterpartVatParams,
    CounterpartVatID,
    CounterpartVatIDResponse
  >(vatPath, async ({ request }) => {
    const json = await request.json();

    const response: CounterpartVatIDResponse = {
      id: (Math.random() + 1).toString(36).substring(7),
      counterpart_id: counterpartVatFixture.counterpart_id,
      ...json,
      country: json.country ?? counterpartVatFixture.country,
      type: json.type as TaxIDTypeEnum,
      value: json.value ?? counterpartVatFixture.value,
    };

    await delay();

    return HttpResponse.json(response);
  }),

  // read
  http.get<
    UpdateCounterpartVatParams,
    undefined,
    CounterpartVatIDResponse | ErrorSchemaResponse
  >(vatIdPath, async ({ params }) => {
    const { vatId } = params;
    const flatVatList = Object.values(
      counterpartVatsByCounterpartIdFixture
    ).flatMap((vats) => vats);
    const vat = flatVatList.find((vat) => vat.id === vatId);

    if (!vat) {
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

    return HttpResponse.json(vat);
  }),

  // update
  http.patch<
    UpdateCounterpartVatParams,
    UpdateCounterpartContactPayload,
    CounterpartVatIDResponse | ErrorSchemaResponse
  >(vatIdPath, async ({ request, params }) => {
    const { counterpartId, vatId } = params;
    const json = await request.json();

    const vatsFixture = counterpartVatsByCounterpartIdFixture[counterpartId];
    const vatFixture = vatsFixture.find((vat) => vat.id === vatId);

    if (!vatFixture) {
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
    return HttpResponse.json({ ...vatFixture, ...json });
  }),

  // delete
  http.delete<UpdateCounterpartVatParams>(vatIdPath, async () => {
    await delay();

    return new HttpResponse(null, {
      status: 204,
    });
  }),
];

type TaxIDTypeEnum = components['schemas']['VatIDTypeEnum'];
type CounterpartVatIDResourceList =
  components['schemas']['CounterpartVatIDResourceList'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type CounterpartVatID = components['schemas']['CounterpartVatID'];
type CounterpartVatIDResponse =
  components['schemas']['CounterpartVatIDResponse'];
type UpdateCounterpartContactPayload =
  components['schemas']['UpdateCounterpartContactPayload'];
