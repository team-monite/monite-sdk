import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { lineItemFixture, generateLineItem } from './lineItemsFixture';

export const lineItemsHandlers = [
  // list line items
  http.get<
    { payableId: string },
    undefined,
    LineItemPaginationResponse | ErrorSchemaResponse
  >(`*/payables/:payableId/line_items`, async ({ params }) => {
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
  }),
  // create line item
  http.post<{}, LineItemRequest, LineItemResponse>(
    `*/payables/:payableId/line_items`,
    async () => {
      await delay();

      return HttpResponse.json(lineItemFixture);
    }
  ),

  // update line item
  http.patch<{}, LineItemRequest, LineItemResponse>(
    `*/payables/:payableId/line_items/:lineItemId`,
    async () => {
      await delay();

      return HttpResponse.json(lineItemFixture);
    }
  ),

  // delete line item
  http.delete(`*/payables/:payableId/line_items/:lineItemId`, async () => {
    await delay();

    return new HttpResponse(undefined, {
      status: 204,
    });
  }),
];

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type LineItemPaginationResponse =
  components['schemas']['LineItemPaginationResponse'];
type LineItemRequest = components['schemas']['LineItemRequest'];
type LineItemResponse = components['schemas']['LineItemResponse'];
