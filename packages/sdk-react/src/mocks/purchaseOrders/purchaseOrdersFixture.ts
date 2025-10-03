import { components } from '@/api';
import { faker } from '@faker-js/faker';

const now = new Date();
const createdDate = faker.date.past({ refDate: now });
const updatedDate = faker.date.between({ from: createdDate, to: now });

const counterpartId = faker.string.uuid();
const entityId = faker.string.uuid();

export const purchaseOrderFixture: components['schemas']['PurchaseOrderResponseSchema'] =
  {
    id: faker.string.uuid(),
    document_id: 'PO-00001',
    status: 'draft',
    counterpart_id: counterpartId,
    counterpart: {
      id: counterpartId,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      type: 'organization',
      created_automatically: false,
      organization: {
        legal_name: 'Test Vendor Organization',
        is_vendor: true,
        is_customer: false,
      },
    },
    currency: 'USD',
    entity_id: entityId,
    entity: {
      id: entityId,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      address: {
        city: 'Test City',
        country: 'US',
        line1: '123 Test St',
        postal_code: '12345',
      },
      organization: {
        legal_name: 'Test Entity Organization',
      },
      status: 'active',
      email: 'entity@example.com',
    },
    items: [
      {
        name: 'Test Item',
        quantity: 1,
        unit: 'unit',
        price: 10000, // $100.00 in minor units
        currency: 'USD',
        vat_rate: 1000, // 10% in basis points
      },
    ],
    message: '',
    valid_for_days: 30,
    created_at: createdDate.toISOString(),
    updated_at: updatedDate.toISOString(),
    created_by_user_id: faker.string.uuid(),
  };

export const purchaseOrderListFixture: components['schemas']['PurchaseOrderPaginationResponse'] =
  {
    data: [purchaseOrderFixture],
    prev_pagination_token: undefined,
    next_pagination_token: undefined,
  };
