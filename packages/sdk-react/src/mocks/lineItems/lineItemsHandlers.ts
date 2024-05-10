import {
  ErrorSchemaResponse,
  LINE_ITEMS_ENDPOINT,
  LineItemPaginationResponse,
  LineItemRequest,
  LineItemResponse,
  PAYABLES_ENDPOINT,
} from '@monite/sdk-api';

import { http, HttpResponse, delay } from 'msw';

import { lineItemFixture, generateLineItem } from './lineItemsFixture';

export const lineItemsHandlers = [
  // list line items
  http.get<
    { payableId: string },
    undefined,
    LineItemPaginationResponse | ErrorSchemaResponse
  >(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}`,
    async ({ params }) => {
      const payableId = params.payableId;

      await delay();

      return HttpResponse.json(
        {
          data: [generateLineItem(payableId), generateLineItem(payableId)],
          prev_pagination_token: undefined,
          next_pagination_token: undefined,
        },
        {
          status: 200,
        }
      );
    }
  ),
  // create line item
  http.post<{}, LineItemRequest, LineItemResponse>(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}`,
    async () => {
      await delay();

      return HttpResponse.json(lineItemFixture);
    }
  ),

  // update line item
  http.patch<{}, LineItemRequest, LineItemResponse>(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}/:lineItemId`,
    async () => {
      await delay();

      return HttpResponse.json(lineItemFixture);
    }
  ),

  // delete line item
  http.delete(
    `*/${PAYABLES_ENDPOINT}/:payableId/${LINE_ITEMS_ENDPOINT}/:lineItemId`,
    async () => {
      await delay();

      return new HttpResponse(undefined, {
        status: 204,
      });
    }
  ),
];
