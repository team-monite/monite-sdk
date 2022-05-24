import { delay } from '@/mocks/utils';
import {
  ErrorSchemaResponse,
  LINE_ITEMS_ENDPOINT,
  LineItemPaginationResponse,
  LineItemRequest,
  LineItemResponse,
  PAYABLES_ENDPOINT,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { lineItemFixture, generateLineItem } from './lineItemsFixture';

export const lineItemsHandlers = [
  // list line items
  rest.get<
    undefined,
    { payableId: string },
    LineItemPaginationResponse | ErrorSchemaResponse
  >(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}`,
    async (req, res, ctx) => {
      const payableId = req.params.payableId;

      return res(
        delay(),
        ctx.json({
          data: [generateLineItem(payableId), generateLineItem(payableId)],
          prev_pagination_token: undefined,
          next_pagination_token: undefined,
        })
      );
    }
  ),
  // create line item
  rest.post<LineItemRequest, {}, LineItemResponse>(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}`,
    async (req, res, ctx) => {
      return res(delay(), ctx.json(lineItemFixture));
    }
  ),

  // update line item
  rest.patch<LineItemRequest, {}, LineItemResponse>(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}/:lineItemId`,
    async (req, res, ctx) => {
      return res(delay(), ctx.json(lineItemFixture));
    }
  ),

  // delete line item
  rest.delete(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}/:lineItemId`,
    async (req, res, ctx) => {
      return res(delay(), ctx.status(204));
    }
  ),
];
