import { rest } from 'msw';

import { COUNTERPARTS_ENDPOINT } from '@team-monite/sdk-api';

import type {
  CounterpartResponse,
  CounterpartCreatePayload,
  CounterpartUpdatePayload,
} from '@team-monite/sdk-api';

import {
  counterpartOrganizationFixture,
  counterpartIndividualFixture,
} from './counterpartFixture';

type CounterpartParams = { counterpartId: string };

const counterpartPath = `*/${COUNTERPARTS_ENDPOINT}`;
const counterpartIdPath = `${counterpartPath}/:counterpartId`;

export const counterpartHandlers = [
  // read list
  // rest.get<
  //   CounterpartResponse,
  //   CreateCounterpartParams,
  //   Parameters<CounterpartsService['getList']>
  // >(counterpartPath, (req, res, ctx) => {
  //   return res(ctx.json([counterpartFixture]));
  // }),

  // create
  rest.post<CounterpartCreatePayload, CounterpartParams, CounterpartResponse>(
    counterpartPath,
    (req, res, ctx) => {
      switch (req.params.counterpartId) {
        case 'organization':
          return res(ctx.json(counterpartOrganizationFixture));
        case 'individual':
          return res(ctx.json(counterpartIndividualFixture));
      }

      return res(ctx.status(404));
    }
  ),

  // read
  rest.get<undefined, CounterpartParams, CounterpartResponse>(
    counterpartIdPath,
    (req, res, ctx) => {
      switch (req.params.counterpartId) {
        case 'organization':
          return res(ctx.json(counterpartOrganizationFixture));
        case 'individual':
          return res(ctx.json(counterpartIndividualFixture));
      }

      return res(ctx.status(404));
    }
  ),

  // update
  rest.patch<CounterpartUpdatePayload, CounterpartParams, CounterpartResponse>(
    counterpartIdPath,
    (req, res, ctx) => {
      switch (req.params.counterpartId) {
        case 'organization':
          return res(ctx.json(counterpartOrganizationFixture));
        case 'individual':
          return res(ctx.json(counterpartIndividualFixture));
      }

      return res(ctx.status(404));
    }
  ),

  // delete
  rest.delete<undefined, CounterpartParams, boolean>(
    counterpartIdPath,
    (req, res, ctx) => {
      return res(ctx.json(true));
    }
  ),
];
