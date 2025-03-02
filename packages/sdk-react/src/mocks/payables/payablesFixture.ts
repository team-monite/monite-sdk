import { components, paths } from '@/api';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { PayableStateEnum } from '@/enums/PayableStateEnum';
import { approvalPoliciesListFixture } from '@/mocks/approvalPolicies';
import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import { getSampleFromArray } from '@/utils/storybook-utils';
import {
  getRandomItemFromArray,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-extraneous-dependencies
import { deepmerge } from '@mui/utils';

import { tagListFixture } from '../tags';

export const PAYABLE_ID_WITHOUT_FILE = 'payable-without-file';

const generateTags = () => {
  const hasTags = Math.random() > 0.6;

  return hasTags ? getSampleFromArray(tagListFixture) : [];
};

function generatePayable(
  payable?: Partial<components['schemas']['PayableResponseSchema']>
): components['schemas']['PayableResponseSchema'] {
  const createdPayable: components['schemas']['PayableResponseSchema'] = {
    id: faker.string.uuid(),
    credit_notes: [],
    entity_id: getRandomProperty(entityUsers).id,
    marked_as_paid_with_comment: undefined,
    marked_as_paid_by_entity_user_id: undefined,
    status: getRandomItemFromArray(PayableStateEnum),
    source_of_payable_data: 'ocr',
    currency: getRandomItemFromArray(CurrencyEnum),
    amount_due: Number(faker.finance.amount()),
    amount_paid: Number(faker.finance.amount()),
    amount_to_pay: Number(faker.finance.amount()),
    approval_policy_id: getRandomItemFromArray(approvalPoliciesListFixture.data)
      .id,
    description: faker.commerce.productDescription(),
    due_date: faker.date.soon().toString(),
    payment_terms: undefined,
    suggested_payment_term: undefined,
    issued_at: faker.date.past().toString(),
    counterpart_raw_data: { name: 'test' },
    payable_origin: 'upload',
    was_created_by_user_id: '5b4daced-6b9a-4707-83c6-08193d999fab',
    currency_exchange: {
      default_currency_code: 'USD',
      rate: 1.1,
      total: 13475,
    },
    file: {
      id: '124c26f2-0430-4bf3-87a1-5ff2b879c480',
      created_at: '2023-01-06T12:03:44.210318+00:00',
      file_type: 'payables',
      name: 'test_invoice.pdf',
      region: 'eu-central-1',
      md5: '763317952a69be1122deb6699f794d53',
      mimetype: 'application/pdf',
      url: 'https://monite-file-saver-payables-eu-central-1-dev.s3.amazonaws.com/124c26f2-0430-4bf3-87a1-5ff2b879c480/feafa6df-b5fb-4b26-936f-f3e51ae50995.pdf',
      size: 17024,
      previews: [],
      pages: [
        {
          id: 'db236cd4-c3cf-4d6b-a5bb-a235615feb99',
          mimetype: 'image/png',
          size: 112510,
          number: 0,
          url: 'https://monite-file-saver-payables-eu-central-1-dev.s3.amazonaws.com/61ca15e2-912d-4699-a11b-bc17976abe83/2082ee5e-7e34-4d77-9061-761db13c2d60.png',
        },
      ],
    },
    tags: generateTags(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    other_extracted_data: {
      type: 'invoice',
      total: 290400,
      currency: 'NGN',
      total_paid_amount_raw: 290400,
      counterpart_name: 'Test IO',
      counterpart_address: undefined,
      counterpart_account_id: undefined,
      document_id: '0001',
      tax_payer_id: undefined,
      document_issued_at_date: '2023-02-17',
      document_due_date: '2023-03-19',
      counterpart_address_object: {
        country: undefined,
        original_country_name: undefined,
        city: 'Sydney',
        postal_code: undefined,
        state: undefined,
        line1: 'Sydney mr Street 123',
        line2: undefined,
      },
      line_items: [
        {
          description: 'price for product',
          quantity: 12,
          unit_price: 12000,
          unit: undefined,
          vat_percentage: undefined,
          total_excl_vat: 158400,
        },
        {
          description: 'Services , Products & Goods | Export',
          quantity: 120,
          unit_price: 1100,
          unit: undefined,
          vat_percentage: undefined,
          total_excl_vat: 132000,
        },
      ],
    },
    document_id: faker.string.nanoid(),
    subtotal: Number(faker.finance.amount()),
    tax: 1100,
    tax_amount: Number(faker.finance.amount()),
    total_amount: Number(faker.finance.amount()),
    sender: undefined,
  };

  return deepmerge(createdPayable, payable ?? {});
}

export const payableFixturePages: components['schemas']['PayableResponseSchema'][] =
  [
    generatePayable({
      status: 'waiting_to_be_paid',
      amount_to_pay: 9990,
      currency: 'EUR',
      created_at: faker.date.soon().toString(),
    }),
    // payable in OCR processing
    generatePayable({
      document_id: '181023-01',
      created_at: faker.date.soon().toString(),
      source_of_payable_data: 'ocr',
      ocr_status: 'processing',
      amount_to_pay: undefined,
      status: 'draft',
    }),
    generatePayable({
      status: 'draft',
    }),
    generatePayable({
      id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
      status: 'draft',
    }),
    generatePayable({
      status: 'new',
      ocr_status: 'error',
    }),
    ...new Array(15).fill('_').map(() => generatePayable()),
  ];

export const generateAggregatedPayables =
  (): paths['/payables/analytics']['get']['responses']['200']['content']['application/json'] => {
    const statuses: components['schemas']['PayableStateEnum'][] = [
      'draft',
      'new',
      'approve_in_progress',
      'waiting_to_be_paid',
      'partially_paid',
      'paid',
      'canceled',
      'rejected',
    ];

    const data = statuses.map((status) => ({
      status,
      count: faker.number.int({ min: 1, max: 5 }),
      sum_total_amount: faker.number.int({ min: 50, max: 200 }),
    }));

    const sum_total_amount = data.reduce(
      (acc, item) => acc + item.sum_total_amount,
      0
    );
    const count = data.length;

    return {
      data,
      count,
      sum_total_amount,
    };
  };

export const payableFixtureWithoutFile: components['schemas']['PayableResponseSchema'] =
  generatePayable({
    id: PAYABLE_ID_WITHOUT_FILE,
    file: undefined,
  });

export const payableValidationsFixture: components['schemas']['PayableValidationsResource'] =
  {
    required_fields: [],
  };
