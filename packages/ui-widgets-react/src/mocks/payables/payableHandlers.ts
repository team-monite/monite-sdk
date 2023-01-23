import { rest } from 'msw';

import {
  PAYABLES_ENDPOINT,
  PayableResponseSchema,
  PayableStateEnum,
  api__schemas__payables__schemas__PaginationResponse,
} from '@team-monite/sdk-api';

import { geMockPagination } from '../utils';
import {
  payableListFixtureFirstPage,
  payableListFixtureSecondPage,
  payableListFixtureThirdPage,
} from './payablesFixture';

type PayableParams = { payableStatus: string };

const payablePath = `*/${PAYABLES_ENDPOINT}`;
const payableStatusPath = `${payablePath}/:payableStatus`;

const getPayableFixtureByPage = (prevPage?: string) => {
  switch (prevPage) {
    case '0':
      return payableListFixtureSecondPage;
    case '1':
      return payableListFixtureThirdPage;
    default:
      return payableListFixtureFirstPage;
  }
};
export const payableHandlers = [
  // read list
  rest.get<undefined, {}, api__schemas__payables__schemas__PaginationResponse>(
    payablePath,
    ({ url }, res, ctx) => {
      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );
      return res(
        ctx.json({
          data: getPayableFixtureByPage(prevPage),
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
        })
      );
    }
  ),

  // read payable by status (id)
  rest.get<undefined, PayableParams, PayableResponseSchema>(
    payableStatusPath,
    ({ params }, res, ctx) => {
      if (
        Object.values(PayableStateEnum).find(
          (status) => status === params.payableStatus
        )
      ) {
        return res(
          ctx.json({
            ...payableListFixtureFirstPage[0],
            status: params.payableStatus as PayableStateEnum,
          })
        );
      }

      return res(ctx.status(404));
    }
  ),
];
