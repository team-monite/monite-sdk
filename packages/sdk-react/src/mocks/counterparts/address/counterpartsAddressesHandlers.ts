import { components } from '@/api';
import { counterpartsAddressesFixture } from '@/mocks';

import { http, HttpResponse, delay } from 'msw';

const counterpartsAddressesPath = `*/counterparts/:counterpartId/addresses`;
const counterpartAddressPath = `${counterpartsAddressesPath}/:addressId`;

export const counterpartsAddressesHandlers = [
  /** Get all counterpart addresses */
  http.get<
    { counterpartId: string },
    undefined,
    | components['schemas']['CounterpartAddressResourceList']
    | components['schemas']['ErrorSchemaResponse']
  >(counterpartsAddressesPath, async ({ params }) => {
    const { counterpartId } = params;
    const address = counterpartsAddressesFixture.find((address) =>
      address.data.find((addr) => addr.counterpart_id === counterpartId)
    );
    // console.log(`/addresses: ${counterpartId}, ${address}`);

    if (!address) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'There is no address by provided ID',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json(address);
  }),

  /** Get counterpart address by id */
  http.get<
    { counterpartId: string; addressId: string },
    undefined,
    | components['schemas']['CounterpartAddressResponseWithCounterpartID']
    | components['schemas']['ErrorSchemaResponse']
  >(counterpartAddressPath, async ({ params }) => {
    const { counterpartId, addressId } = params;

    if (!counterpartId || !addressId) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Counterpart ID or Address ID is not provided',
          },
        },
        {
          status: 404,
        }
      );
    }

    const fixture = counterpartsAddressesFixture.find((address) => {
      return address.data.find(
        (addr) => addr.counterpart_id === counterpartId && addr.id === addressId
      );
    });

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'There is no address by provided ID',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json(fixture.data[0]);
  }),

  http.patch<
    { counterpartId: string; addressId: string },
    components['schemas']['CounterpartAddress'],
    | components['schemas']['CounterpartAddressResponseWithCounterpartID']
    | components['schemas']['ErrorSchemaResponse']
  >(counterpartAddressPath, async ({ request, params }) => {
    const payload = await request.json();
    const { counterpartId } = params;

    const address = counterpartsAddressesFixture.find((address) =>
      address.data.find((addr) => addr.counterpart_id === counterpartId)
    );

    if (!address) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'There is no address by provided ID',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();
    return HttpResponse.json({
      ...address.data[0],
      ...payload,
    });
  }),
];
