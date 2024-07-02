import { counterpartListFixture } from '@/mocks';
import { approvalPolicyByIdFixtures } from '@/mocks/approvalPolicies';
import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  getRandomItemFromArray,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  CurrencyEnum,
  OcrStatusEnum,
  PayableOriginEnum,
  PayableResponseSchema,
  PayableStateEnum,
  SourceOfPayableDataEnum,
} from '@monite/sdk-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { deepmerge } from '@mui/utils';

export const PAYABLE_ID_WITHOUT_FILE = 'payable-without-file';

function generatePayable(
  payable?: Partial<PayableResponseSchema>
): PayableResponseSchema {
  const createdPayable: PayableResponseSchema = {
    id: faker.string.uuid(),
    entity_id: getRandomProperty(entityUsers).id,
    marked_as_paid_with_comment: undefined,
    marked_as_paid_by_entity_user_id: undefined,
    status: getRandomProperty(PayableStateEnum),
    source_of_payable_data: SourceOfPayableDataEnum.OCR,
    currency: getRandomProperty({
      euro: CurrencyEnum.EUR,
      usd: CurrencyEnum.USD,
      kzt: CurrencyEnum.KZT,
      gel: CurrencyEnum.GEL,
    }),
    amount_due: Number(faker.finance.amount()),
    amount_paid: Number(faker.finance.amount()),
    amount_to_pay: Number(faker.finance.amount()),
    approval_policy_id: getRandomItemFromArray(approvalPolicyByIdFixtures).id,
    description: faker.commerce.productDescription(),
    due_date: faker.date.soon().toString(),
    payment_terms: undefined,
    suggested_payment_term: undefined,
    issued_at: faker.date.past().toString(),
    counterpart_id: getRandomItemFromArray(counterpartListFixture).id,
    payable_origin: PayableOriginEnum.UPLOAD,
    was_created_by_user_id: '5b4daced-6b9a-4707-83c6-08193d999fab',
    currency_exchange: {
      default_currency_code: CurrencyEnum.USD,
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
    tags: [],
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    other_extracted_data: {
      total: 290400,
      currency: 'NGN',
      counterpart_name: 'Test IO',
      counterpart_address: undefined,
      counterpart_account_id: undefined,
      document_id: '0001',
      payment_terms: undefined,
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
    sender: undefined,
  };

  return deepmerge(createdPayable, payable ?? {});
}

export const payableFixturePages: PayableResponseSchema[] = [
  generatePayable({
    status: PayableStateEnum.WAITING_TO_BE_PAID,
    amount_to_pay: 9990,
    currency: CurrencyEnum.EUR,
    created_at: faker.date.soon().toString(),
  }),
  // payable in OCR processing
  generatePayable({
    document_id: '181023-01',
    created_at: faker.date.soon().toString(),
    source_of_payable_data: SourceOfPayableDataEnum.OCR,
    ocr_status: OcrStatusEnum.PROCESSING,
    amount_to_pay: undefined,
    status: PayableStateEnum.DRAFT,
  }),
  generatePayable({
    status: PayableStateEnum.DRAFT,
  }),
  generatePayable({
    id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
    status: PayableStateEnum.DRAFT,
  }),
  generatePayable({
    status: PayableStateEnum.NEW,
    ocr_status: OcrStatusEnum.ERROR,
  }),
  ...new Array(15).fill('_').map(() => generatePayable()),
];

export const payableFixtureWithoutFile: PayableResponseSchema = generatePayable(
  {
    id: PAYABLE_ID_WITHOUT_FILE,
    file: undefined,
  }
);
