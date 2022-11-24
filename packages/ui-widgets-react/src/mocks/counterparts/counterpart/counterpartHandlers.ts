import { rest } from 'msw';

import {
  CounterpartPaginationResponse,
  COUNTERPARTS_ENDPOINT,
} from '@team-monite/sdk-api';

import type {
  CounterpartResponse,
  CounterpartCreatePayload,
  CounterpartUpdatePayload,
} from '@team-monite/sdk-api';

import {
  counterpartOrganizationFixture,
  counterpartIndividualFixture,
  counterpartListFixture,
} from './counterpartFixture';

import { geMockPagination } from '../../utils';

type CounterpartDetailParams = { counterpartId: string };

const counterpartPath = `*/${COUNTERPARTS_ENDPOINT}`;
const counterpartDetailPath = `${counterpartPath}/:counterpartId`;

export const counterpartHandlers = [
  // read list
  rest.get<CounterpartResponse, {}, CounterpartPaginationResponse>(
    counterpartPath,
    ({ url }, res, ctx) => {
      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );

      return res(
        ctx.json({
          data: counterpartListFixture,
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
        })
      );
    }
  ),

  // create
  rest.post<
    CounterpartCreatePayload,
    CounterpartDetailParams,
    CounterpartResponse
  >(counterpartPath, (req, res, ctx) => {
    switch (req.params.counterpartId) {
      case 'organization':
        return res(ctx.json(counterpartOrganizationFixture));
      case 'individual':
        return res(ctx.json(counterpartIndividualFixture));
    }

    return res(ctx.status(404));
  }),

  // read
  rest.get<undefined, CounterpartDetailParams, CounterpartResponse>(
    counterpartDetailPath,
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
  rest.patch<
    CounterpartUpdatePayload,
    CounterpartDetailParams,
    CounterpartResponse
  >(counterpartDetailPath, (req, res, ctx) => {
    switch (req.params.counterpartId) {
      case 'organization':
        return res(ctx.json(counterpartOrganizationFixture));
      case 'individual':
        return res(ctx.json(counterpartIndividualFixture));
    }

    return res(ctx.status(404));
  }),

  // delete
  rest.delete<undefined, CounterpartDetailParams, boolean>(
    counterpartDetailPath,
    (req, res, ctx) => {
      return res(ctx.json(true));
    }
  ),
];
