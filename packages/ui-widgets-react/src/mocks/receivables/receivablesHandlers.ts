import { rest } from 'msw';

import {
  ReceivablesPaginationResponse,
  RECEIVABLES_ENDPOINT,
  ReceivableResponse,
} from '@team-monite/sdk-api';

import { geMockPagination } from '../utils';
import {
  receivableListFixture,
  receivableByIdFixture,
} from './receivablesFixture';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `${RECEIVABLES_ENDPOINT}/:id`;

export const receivableHandlers = [
  // read list
  rest.get<undefined, {}, ReceivablesPaginationResponse>(
    receivablePath,
    ({ url }, res, ctx) => {
      const type = url.searchParams.get('type');

      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );

      if (!type || !receivableListFixture[type]) return res(ctx.status(404));

      return res(
        ctx.json({
          data: receivableListFixture[type] as ReceivableResponse[],
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
          test: url.searchParams.get('type'),
        })
      );
    }
  ),

  // get by id
  rest.get<undefined, { id: string }, any>(
    receivableDetailPath,
    ({ params }, res, ctx) => {
      if (!params.id) return res(ctx.status(404));

      if (params.id === '1') {
        return res(ctx.json(receivableByIdFixture));
      }
    }
  ),
];
