import { components } from '@/api';
import { faker } from '@faker-js/faker';
import { http, HttpResponse, delay } from 'msw';

import {
  purchaseOrderFixture,
  purchaseOrderListFixture,
} from './purchaseOrdersFixture';

type PurchaseOrderParams = { purchase_order_id: string };

const purchaseOrdersPath = `*/payable_purchase_orders`;
const purchaseOrderDetailPath = `${purchaseOrdersPath}/:purchase_order_id`;

export const purchaseOrdersHandlers = [
  http.get<
    {},
    undefined,
    | components['schemas']['PurchaseOrderPaginationResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(purchaseOrdersPath, async () => {
    await delay();

    return HttpResponse.json(purchaseOrderListFixture);
  }),

  http.post<
    {},
    components['schemas']['PurchaseOrderPayloadSchema'],
    | components['schemas']['PurchaseOrderResponseSchema']
    | components['schemas']['ErrorSchemaResponse']
  >(purchaseOrdersPath, async ({ request }) => {
    const body = await request.json();

    await delay();

    return HttpResponse.json({
      ...purchaseOrderFixture,
      ...body,
      id: faker.string.uuid(),
      document_id: `PO-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, '0')}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  http.get<
    PurchaseOrderParams,
    undefined,
    | components['schemas']['PurchaseOrderResponseSchema']
    | components['schemas']['ErrorSchemaResponse']
  >(purchaseOrderDetailPath, async ({ params }) => {
    await delay();

    if (!params.purchase_order_id) {
      return HttpResponse.json(
        {
          error: {
            message: 'Purchase order not found',
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      ...purchaseOrderFixture,
      id: params.purchase_order_id,
    });
  }),

  http.patch<
    PurchaseOrderParams,
    components['schemas']['UpdatePurchaseOrderPayloadSchema'],
    | components['schemas']['PurchaseOrderResponseSchema']
    | components['schemas']['ErrorSchemaResponse']
  >(purchaseOrderDetailPath, async ({ params, request }) => {
    const body = await request.json();

    await delay();

    return HttpResponse.json({
      ...purchaseOrderFixture,
      id: params.purchase_order_id,
      counterpart_id: body.counterpart_id ?? purchaseOrderFixture.counterpart_id,
      items: body.items ?? purchaseOrderFixture.items,
      message: body.message !== undefined ? body.message : purchaseOrderFixture.message,
      valid_for_days: body.valid_for_days ?? purchaseOrderFixture.valid_for_days,
      updated_at: new Date().toISOString(),
      counterpart_address_id: body.counterpart_address_id,
      project_id: body.project_id,
    });
  }),

  http.delete<PurchaseOrderParams>(purchaseOrderDetailPath, async () => {
    await delay();

    return new HttpResponse(null, { status: 204 });
  }),
];
