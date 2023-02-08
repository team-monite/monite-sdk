import { rest } from 'msw';
import {
  ADDRESSES_ENDPOINT,
  CounterpartAddressResourceList,
} from '@team-monite/sdk-api';

import { counterpartsAddressesFixture } from './counterpartsAddressesFixture';

const counterpartsAddressesPath = `*/counterparts/:counterpartId/${ADDRESSES_ENDPOINT}`;

export const counterpartsAddressesHandlers = [
  rest.get<
    undefined,
    { counterpartId: string },
    CounterpartAddressResourceList
  >(counterpartsAddressesPath, ({ params }, res, ctx) => {
    const { counterpartId } = params;

    return res(ctx.json(counterpartsAddressesFixture[counterpartId]));
  }),
];
