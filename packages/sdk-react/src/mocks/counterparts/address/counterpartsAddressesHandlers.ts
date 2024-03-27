import { delay } from '@/mocks/utils';
import {
  ADDRESSES_ENDPOINT,
  CounterpartAddress,
  CounterpartAddressResourceList,
  CounterpartAddressResponseWithCounterpartID,
  ErrorSchemaResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { counterpartsAddressesFixture } from './counterpartsAddressesFixture';

const counterpartsAddressesPath = `*/counterparts/:counterpartId/${ADDRESSES_ENDPOINT}`;
const counterpartAddressPath = `${counterpartsAddressesPath}/:addressId`;

export const counterpartsAddressesHandlers = [
  /** Get all counterpart addresses */
  rest.get<
    undefined,
    { counterpartId: string },
    CounterpartAddressResourceList | ErrorSchemaResponse
  >(counterpartsAddressesPath, ({ params }, res, ctx) => {
    const { counterpartId } = params;
    const address = counterpartsAddressesFixture.find((address) =>
      address.data.find((addr) => addr.counterpart_id === counterpartId)
    );

    if (!address) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'There is no address by provided ID',
          },
        })
      );
    }

    return res(delay(), ctx.json(address));
  }),

  /** Get counterpart address by id */
  rest.get<
    undefined,
    { counterpartId: string; addressId: string },
    CounterpartAddressResponseWithCounterpartID | ErrorSchemaResponse
  >(counterpartAddressPath, (req, res, ctx) => {
    const { counterpartId, addressId } = req.params;

    if (!counterpartId || !addressId) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Counterpart ID or Address ID is not provided',
          },
        })
      );
    }

    const fixture = counterpartsAddressesFixture.find((address) => {
      return address.data.find(
        (addr) => addr.counterpart_id === counterpartId && addr.id === addressId
      );
    });

    if (!fixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'There is no address by provided ID',
          },
        })
      );
    }

    return res(delay(), ctx.json(fixture.data[0]));
  }),

  rest.patch<
    CounterpartAddress,
    { counterpartId: string; addressId: string },
    CounterpartAddressResponseWithCounterpartID | ErrorSchemaResponse
  >(counterpartAddressPath, async (req, res, ctx) => {
    const payload = await req.json<CounterpartAddress>();
    const { counterpartId } = req.params;

    const address = counterpartsAddressesFixture.find((address) =>
      address.data.find((addr) => addr.counterpart_id === counterpartId)
    );

    if (!address) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'There is no address by provided ID',
          },
        })
      );
    }

    return res(delay(), ctx.json({ ...address.data[0], ...payload }));
  }),
];
