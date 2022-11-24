import { rest } from 'msw';

import {
  ReceivablesPaginationResponse,
  RECEIVABLES_ENDPOINT,
} from '@team-monite/sdk-api';

import { geMockPagination } from '../utils';
import { receivableListFixture } from './receivablesFixture';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;

export const receivableHandlers = [
  // read list
  rest.get<undefined, {}, ReceivablesPaginationResponse>(
    receivablePath,
    ({ url }, res, ctx) => {
      const type = url.searchParams.get('type');

      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );

      if (!type) return res(ctx.status(404));

      return res(
        ctx.json({
          data: receivableListFixture[type],
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
          test: url.searchParams.get('type'),
        })
      );
    }
  ),
];
