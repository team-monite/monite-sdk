import { rest } from 'msw';

import {
  PAYABLES_ENDPOINT,
  PayableResponseSchema,
  PayableStateEnum,
  PayablePaginationResponse,
  PayableUpdateSchema,
} from '@team-monite/sdk-api';

import { geMockPagination } from '../utils';
import {
  payableListFixtureFirstPage,
  payableListFixtureSecondPage,
  payableListFixtureThirdPage,
} from './payablesFixture';
import { tagListFixture } from '../tags/tagsFixture';

type PayableParams = { payableId: string };

const payablePath = `*/${PAYABLES_ENDPOINT}`;
const payableIdPath = `${payablePath}/:payableId`;

let payable: PayableResponseSchema = payableListFixtureFirstPage[0];

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
  rest.get<undefined, {}, PayablePaginationResponse>(
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

  // get payable by id
  rest.get<undefined, PayableParams, PayableResponseSchema>(
    payableIdPath,
    ({ params }, res, ctx) => {
      if (
        Object.values(PayableStateEnum).find(
          (status) => status === params.payableId
        )
      ) {
        return res(
          ctx.json({
            ...payableListFixtureFirstPage[0],
            status: params.payableId as PayableStateEnum,
          })
        );
      } else {
        const payableById = payableListFixtureFirstPage.find(
          (item) => item.id === params.payableId
        );

        if (payableById) {
          return res(
            ctx.json(payable ? { ...payableById, ...payable } : payableById)
          );
        }
      }

      return res(ctx.status(404));
    }
  ),

  // update (patch) payable by id
  rest.patch<PayableUpdateSchema, { payableId: string }, PayableResponseSchema>(
    payableIdPath,
    async (req, res, ctx) => {
      const body = await req.json();

      payable = {
        ...payableListFixtureFirstPage[0],
        ...body,
        tags: body.tag_ids.map((tagId: string) => {
          return tagListFixture.find((tag) => tag.id === tagId);
        }),
        status: PayableStateEnum.NEW,
      };

      return res(ctx.json(payable));
    }
  ),

  // submit payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/submit_for_approval`,
    async (req, res, ctx) => {
      payable = { ...payable, status: PayableStateEnum.APPROVE_IN_PROGRESS };

      return res(
        ctx.json(
          payable || {
            ...payableListFixtureFirstPage[0],
          }
        )
      );
    }
  ),

  // reject payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/reject`,
    async (req, res, ctx) => {
      payable.status = PayableStateEnum.REJECTED;

      return res(
        ctx.json(
          payable || {
            ...payableListFixtureFirstPage[0],
          }
        )
      );
    }
  ),

  // cancel payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/cancel`,
    async (req, res, ctx) => {
      payable.status = PayableStateEnum.CANCELED;

      return res(
        ctx.json(
          payable || {
            ...payableListFixtureFirstPage[0],
          }
        )
      );
    }
  ),

  // approve payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/approve_payment_operation`,
    async (req, res, ctx) => {
      payable.status = PayableStateEnum.WAITING_TO_BE_PAID;

      return res(
        ctx.json(
          payable || {
            ...payableListFixtureFirstPage[0],
          }
        )
      );
    }
  ),

  // pay payable by id
  rest.post<undefined, { payableId: string }, PayableResponseSchema>(
    `${payableIdPath}/pay`,
    async (req, res, ctx) => {
      payable.status = PayableStateEnum.PAID;

      return res(
        ctx.json(
          payable || {
            ...payableListFixtureFirstPage[0],
          }
        )
      );
    }
  ),
];
