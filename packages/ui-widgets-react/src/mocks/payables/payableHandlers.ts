import { rest } from 'msw';

import {
  PAYABLES_ENDPOINT,
  PayableResponseSchema,
  PayableStateEnum,
  api__schemas__payables__schemas__PaginationResponse,
  PayableUpdateSchema,
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
const payableIdPath = `${payablePath}/:payableId`;

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

  // update (patch) payable by id
  rest.patch<PayableUpdateSchema, { payableId: string }, PayableResponseSchema>(
    payableIdPath,
    async (req, res, ctx) => {
      const body = await req.json();
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
          ...body,
        })
      );
    }
  ),

  // submit payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/submit_for_approval`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
        })
      );
    }
  ),

  // reject payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/reject`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
        })
      );
    }
  ),

  // reject payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/cancel`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
        })
      );
    }
  ),

  // approve payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/approve_payment_operation`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
        })
      );
    }
  ),

  // pay payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/pay`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          ...payableListFixtureFirstPage[0],
        })
      );
    }
  ),
];
