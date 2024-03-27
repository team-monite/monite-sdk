import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  PAYABLE_ID_WITHOUT_FILE,
} from '@/mocks';
import { entityIds } from '@/mocks/entities';
import {
  CurrencyEnum,
  OrderEnum,
  PayableCursorFields,
  PayableOriginEnum,
  PayablePaginationResponse,
  PayableResponseSchema,
  PAYABLES_ENDPOINT,
  PayableStateEnum,
  PayableUpdateSchema,
  SourceOfPayableDataEnum,
  ErrorSchemaResponse,
  CreatePayableFromFileRequest,
  PayableUploadWithDataSchema,
  AttachFileToPayableRequest,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { tagListFixture } from '../tags';
import { delay, filterByPageAndLimit } from '../utils';
import {
  payableFixturePages,
  payableFixtureWithoutFile,
} from './payablesFixture';

type PayableParams = { payableId: string };

const payablePath = `*/${PAYABLES_ENDPOINT}`;
const payableIdPath = `${payablePath}/:payableId`;

let payable: PayableResponseSchema = payableFixturePages[0];

/** Returns a random value from provided enum */
function getRandomEnum<T extends { [s: string]: unknown }>(
  anEnum: T
): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex];
}

/**
 * Change document id for specific payable id
 *
 * @returns Updated document id
 */
export function changeDocumentIdByPayableId(payableId: string): string {
  const payable = payableFixturePages.find(
    (payable) => payable.id === payableId
  );

  if (!payable) {
    throw new Error(`Could not find payable by id: "${payableId}"`);
  }

  payable.document_id = 'new-document-id';

  return payable.document_id;
}

/**
 * Adds one item with some random status to payables list
 *  at the beginning of the list
 */
export function addNewItemToPayablesList(): PayableResponseSchema {
  const newItem: PayableResponseSchema = {
    id: (Math.random() + 1).toString(36).substring(2),
    entity_id: entityIds[0],
    marked_as_paid_with_comment: undefined,
    marked_as_paid_by_entity_user_id: undefined,
    status: getRandomEnum(PayableStateEnum),
    source_of_payable_data: SourceOfPayableDataEnum.USER_SPECIFIED,
    currency: getRandomEnum(CurrencyEnum),
    amount_due: Math.floor(Math.random() * 10_000 + 1),
    amount_paid: Math.floor(Math.random() * 10_000 + 1),
    amount_to_pay: Math.floor(Math.random() * 10_000 + 1),
    description: 'string',
    due_date: '2023-01-25',
    payment_terms: {
      name: 'test',
      description: 'test',
      term_final: {
        number_of_days: 10,
      },
      term_1: {
        number_of_days: 5,
        discount: 100,
      },
      term_2: undefined,
    },
    suggested_payment_term: {
      date: '2023-01-25',
      discount: 0,
    },
    issued_at: '2023-01-15',
    counterpart_id: undefined,
    payable_origin: PayableOriginEnum.UPLOAD,
    was_created_by_user_id: undefined,
    currency_exchange: undefined,
    file: {
      id: '124c26f2-0430-4bf3-87a1-5ff2b879c480',
      created_at: '2023-01-06T12:03:44.210318+00:00',
      file_type: 'payables',
      name: 'c3e3bf63-1a01-457d-a029-36de36279af5',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    other_extracted_data: undefined,
    document_id: (Math.random() + 1).toString(36).substring(7),
    subtotal: undefined,
    tax: undefined,
  };

  payableFixturePages.unshift(newItem);

  return newItem;
}

export const payableHandlers = [
  // read the list
  rest.get<undefined, {}, PayablePaginationResponse | ErrorSchemaResponse>(
    payablePath,
    ({ url, headers }, res, ctx) => {
      const entityId = headers.get('x-monite-entity-id');

      if (
        entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
        entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
      ) {
        return res(
          ctx.status(409),
          ctx.json({
            error: {
              message: 'Action read for payable not allowed',
            },
          })
        );
      }

      const limit = Number(url.searchParams.get('limit') ?? '10');

      const filteredPayableFixtures = (() => {
        let filtered: typeof payableFixturePages;

        // TODO add filtering by counterpart_name

        filtered = filterByStatus(
          url.searchParams.get('status') as PayableStateEnum,
          payableFixturePages
        );

        if (url.searchParams.get('sort') && url.searchParams.get('order')) {
          filtered = sortBy(filtered, {
            sort: url.searchParams.get('sort') as PayableCursorFields,
            order: url.searchParams.get('order') as OrderEnum,
          });
        }

        return filtered;
      })();

      const [payablesPaginatedFixtures, { prevPage, nextPage }] =
        filterByPageAndLimit<PayableResponseSchema>(
          {
            page: url.searchParams.get('pagination_token'),
            limit,
          },
          filteredPayableFixtures
        );

      return res(
        delay(),
        ctx.json({
          data: payablesPaginatedFixtures,
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
        })
      );
    }
  ),

  // create payable
  rest.post<
    PayableUploadWithDataSchema,
    PayableResponseSchema | ErrorSchemaResponse
  >(payablePath, async (req, res, ctx) => {
    const body = await req.json();

    const newPayable = {
      ...payableFixturePages[0],
      ...body,
      tags: body.tag_ids.map((tagId: string) => {
        return tagListFixture.find((tag) => tag.id === tagId);
      }),
      status: PayableStateEnum.NEW,
    };

    payableFixturePages.unshift(newPayable);

    return res(ctx.json(newPayable));
  }),

  // get payable by id
  rest.get<
    undefined,
    PayableParams,
    PayableResponseSchema | ErrorSchemaResponse
  >(payableIdPath, ({ params, headers }, res, ctx) => {
    const { payableId } = params;
    const entityId = headers.get('x-monite-entity-id');

    if (payableId === PAYABLE_ID_WITHOUT_FILE) {
      return res(delay(), ctx.json(payableFixtureWithoutFile));
    }

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Access restricted',
          },
        })
      );
    }

    if (
      Object.values(PayableStateEnum).find((status) => status === payableId)
    ) {
      return res(
        delay(),
        ctx.json({
          ...payableFixturePages[0],
          status: payableId as PayableStateEnum,
        })
      );
    } else {
      const payableById = payableFixturePages.find(
        (item) => item.id === payableId
      );

      if (payableById) {
        return res(
          delay(),
          ctx.json(payable ? { ...payable, ...payableById } : payableById)
        );
      } else {
        return res(
          delay(),
          ctx.status(400),
          ctx.json({
            error: {
              message: 'Payable not found',
            },
          })
        );
      }
    }
  }),

  // update (patch) payable by id
  rest.patch<
    PayableUpdateSchema,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(payableIdPath, async (req, res, ctx) => {
    const body = await req.json();

    payable = {
      ...payableFixturePages[0],
      ...body,
      tags: (body.tag_ids ?? []).map((tagId: string) => {
        return tagListFixture.find((tag) => tag.id === tagId);
      }),
      status: PayableStateEnum.NEW,
    };

    /** Handle an error when the authentication token is expired */
    if (req.params.payableId === 'expired-token') {
      return res(
        ctx.status(400),
        delay(),
        ctx.json({
          error: {
            message: 'The token has been revoked, expired or not found.',
          },
        })
      );
    }

    return res(ctx.json(payable));
  }),

  // submit payable by id
  rest.post<
    undefined,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/submit_for_approval`, async (req, res, ctx) => {
    payable = { ...payable, status: PayableStateEnum.APPROVE_IN_PROGRESS };

    return res(
      ctx.json(
        payable || {
          ...payableFixturePages[0],
        }
      )
    );
  }),

  // reject payable by id
  rest.post<
    undefined,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/reject`, async (req, res, ctx) => {
    payable.status = PayableStateEnum.REJECTED;

    return res(
      delay(),
      ctx.json(
        payable || {
          ...payableFixturePages[0],
        }
      )
    );
  }),

  // cancel payable by id
  rest.post<
    undefined,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/cancel`, async (req, res, ctx) => {
    payable.status = PayableStateEnum.CANCELED;

    return res(
      delay(),
      ctx.json(
        payable || {
          ...payableFixturePages[0],
        }
      )
    );
  }),

  // approve payable by id
  rest.post<
    undefined,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/approve_payment_operation`, async (req, res, ctx) => {
    payable.status = PayableStateEnum.WAITING_TO_BE_PAID;

    return res(
      delay(),
      ctx.json(
        payable || {
          ...payableFixturePages[0],
        }
      )
    );
  }),

  // pay payable by id
  rest.post<
    undefined,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/pay`, async (req, res, ctx) => {
    payable.status = PayableStateEnum.PAID;

    return res(
      delay(),
      ctx.json(
        payable || {
          ...payableFixturePages[0],
        }
      )
    );
  }),

  rest.post<
    CreatePayableFromFileRequest,
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payablePath}/upload_from_file`, async (req, res, ctx) => {
    const file = req.body.file; // todo::Upgrade MSW to use req.formData() method

    if (!file) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Bad Request: file field is missing',
          },
        })
      );
    }

    if (!(file instanceof File)) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Bad Request: file field should contain a file',
          },
        })
      );
    }

    const successfulResponse = addNewItemToPayablesList();

    return res(delay(), ctx.json(successfulResponse));
  }),

  rest.post<
    AttachFileToPayableRequest,
    { payableId: string },
    PayableResponseSchema | ErrorSchemaResponse
  >(`${payableIdPath}/attach_file`, async (req, res, ctx) => {
    const file = req.body.file; // todo::Upgrade MSW to use req.formData() method

    if (!file) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Bad Request: file field is missing',
          },
        })
      );
    }

    if (!(file instanceof File)) {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Bad Request: file field should contain a file',
          },
        })
      );
    }

    const successfulResponse = addNewItemToPayablesList();

    return res(
      delay(),
      ctx.json({
        ...payableFixturePages[0],
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
      })
    );
  }),
];

const filterByStatus = (
  status: PayableStateEnum | string,
  fixtures: typeof payableFixturePages
) => {
  if (!status) return fixtures;

  if (!Object.values(PayableStateEnum).includes(status as PayableStateEnum))
    throw new Error('Invalid status');

  return fixtures.filter((payable) => payable.status === status);
};

const sortBy = (
  fixtures: typeof payableFixturePages,
  { sort, order }: { sort: PayableCursorFields; order: OrderEnum }
) => {
  return [...fixtures].sort((a, b) => {
    if (sort in a && sort in b) {
      const aDate =
        sort === PayableCursorFields.CREATED_AT ? new Date(a[sort]) : a[sort];
      const bDate =
        sort === PayableCursorFields.CREATED_AT ? new Date(b[sort]) : b[sort];

      if (aDate < bDate) {
        return order === OrderEnum.ASC ? -1 : 1;
      }
      if (aDate > bDate) {
        return order === OrderEnum.ASC ? 1 : -1;
      }
    }
    return 0;
  });
};
