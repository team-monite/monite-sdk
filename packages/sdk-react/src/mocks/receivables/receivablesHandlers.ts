import {
  receivableListFixture,
  receivableFixture,
  ReceivablesListFixture,
} from '@/mocks';
import {
  ReceivablePaginationResponse,
  RECEIVABLES_ENDPOINT,
  ReceivableResponse,
  ReceivableFacadeCreatePayload,
  ReceivablesStatusEnum,
  ErrorSchemaResponse,
  InvoiceResponsePayload,
  ReceivableFileUrl,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';
import * as yup from 'yup';

import { delay, getMockPagination } from '../utils';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `*/${RECEIVABLES_ENDPOINT}/:id`;
const receivableIssuePath = `${receivableDetailPath}/issue`;
const receivableCancelPath = `${receivableDetailPath}/cancel`;
const receivableUncollectiblePath = `${receivableDetailPath}/mark_as_uncollectible`;
const receivableSendPath = `${receivableDetailPath}/send`;

const createInvoiceValidationSchema = yup.object({
  type: yup.string().required(),
  currency: yup.string().required(),
  line_items: yup
    .array()
    .of(
      yup.object({
        quantity: yup.number().required(),
        product_id: yup.string().required(),
        vat_rate_id: yup.string().required(),
      })
    )
    .required(),
  counterpart_id: yup.string().required(),
});

interface IReceivableByIdParams {
  /** Receivable id */
  id: string;
}

export const receivableHandlers = [
  // read list
  http.get<{}, undefined, ReceivablePaginationResponse | ErrorSchemaResponse>(
    receivablePath,
    async ({ request }) => {
      const url = new URL(request.url);
      const type = url.searchParams.get('type') as
        | keyof ReceivablesListFixture
        | null;

      const { prevPage, nextPage } = getMockPagination(
        url.searchParams.get('pagination_token')
      );

      if (!type || !receivableListFixture[type]) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: 'Receivable type not found',
            },
          },
          {
            status: 404,
          }
        );
      }

      await delay();

      return HttpResponse.json({
        data: receivableListFixture[type] as ReceivableResponse[],
        prev_pagination_token: prevPage,
        next_pagination_token: nextPage,
      });
    }
  ),

  // create
  http.post<
    {},
    ReceivableFacadeCreatePayload,
    ReceivableResponse | ErrorSchemaResponse
  >(receivablePath, async ({ request }) => {
    const jsonBody = await request.json();
    try {
      await createInvoiceValidationSchema.validate(jsonBody);

      await delay();

      return HttpResponse.json(receivableListFixture[jsonBody.type][0]);
    } catch (e) {
      console.error(e);

      await delay();

      return HttpResponse.json({
        error: {
          message: 'Validation error',
        },
      });
    }
  }),

  /**
   * Get receivable by id
   *
   * @see {@link https://docs.monite.com/reference/get_receivables_id} the same as in production
   */
  http.get<{ id: string }, undefined, ReceivableResponse | ErrorSchemaResponse>(
    receivableDetailPath,
    async ({ params }) => {
      if (!params.id) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: 'Receivable id is required',
            },
          },
          {
            status: 404,
          }
        );
      }

      const quoteFixture = receivableListFixture.quote.find(
        (item) => item.id === params.id
      );
      const invoiceFixture = receivableListFixture.invoice.find(
        (item) => item.id === params.id
      );
      const creditNoteFixture = receivableListFixture.credit_note.find(
        (item) => item.id === params.id
      );
      const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

      if (!fixture) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: `There is no receivable by provided id: ${params.id}`,
            },
          },
          {
            status: 404,
          }
        );
      }

      return HttpResponse.json(fixture);
    }
  ),

  /** Issue receivable */
  http.post<
    IReceivableByIdParams,
    undefined,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableIssuePath, async ({ params }) => {
    const quoteFixture = receivableListFixture.quote.find(
      (item) => item.id === params.id
    );
    const invoiceFixture = receivableListFixture.invoice.find(
      (item) => item.id === params.id
    );
    const creditNoteFixture = receivableListFixture.credit_note.find(
      (item) => item.id === params.id
    );
    const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        },
        {
          status: 404,
        }
      );
    }

    fixture.status = ReceivablesStatusEnum.ISSUED;
    const receivable: InvoiceResponsePayload = {
      ...(fixture as InvoiceResponsePayload),
      status: ReceivablesStatusEnum.ISSUED,
    };

    await delay();

    return HttpResponse.json(receivable);
  }),

  /** Delete receivable */
  http.delete<IReceivableByIdParams, undefined>(
    receivableDetailPath,
    async ({ params }) => {
      const quoteFixture = receivableListFixture.quote.find(
        (item) => item.id === params.id
      );
      const invoiceFixture = receivableListFixture.invoice.find(
        (item) => item.id === params.id
      );
      const creditNoteFixture = receivableListFixture.credit_note.find(
        (item) => item.id === params.id
      );
      const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

      if (!fixture) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: `There is no receivable by provided id: ${params.id}`,
            },
          },
          {
            status: 404,
          }
        );
      }

      await delay();

      return new HttpResponse(undefined, { status: 204 });
    }
  ),

  /** Cancel receivable */
  http.post<IReceivableByIdParams, undefined, undefined>(
    receivableCancelPath,
    async ({ params }) => {
      const quoteFixture = receivableListFixture.quote.find(
        (item) => item.id === params.id
      );
      const invoiceFixture = receivableListFixture.invoice.find(
        (item) => item.id === params.id
      );
      const creditNoteFixture = receivableListFixture.credit_note.find(
        (item) => item.id === params.id
      );
      const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

      if (!fixture) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: `There is no receivable by provided id: ${params.id}`,
            },
          },
          {
            status: 404,
          }
        );
      }

      await delay();

      return new HttpResponse(undefined, { status: 204 });
    }
  ),

  /** Mark receivable as uncollectible */
  http.post<
    IReceivableByIdParams,
    undefined,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableUncollectiblePath, async ({ params }) => {
    const quoteFixture = receivableListFixture.quote.find(
      (item) => item.id === params.id
    );
    const invoiceFixture = receivableListFixture.invoice.find(
      (item) => item.id === params.id
    );
    const creditNoteFixture = receivableListFixture.credit_note.find(
      (item) => item.id === params.id
    );
    const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        },
        {
          status: 404,
        }
      );
    }

    const receivable: InvoiceResponsePayload = {
      ...(fixture as InvoiceResponsePayload),
      status: ReceivablesStatusEnum.UNCOLLECTIBLE,
      id: ReceivablesStatusEnum.UNCOLLECTIBLE,
    };

    await delay();

    return HttpResponse.json(receivable, { status: 200 });
  }),

  /** Send invoice via Email */
  http.post<
    IReceivableByIdParams,
    undefined,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableSendPath, async ({ params }) => {
    const quoteFixture = receivableListFixture.quote.find(
      (item) => item.id === params.id
    );
    const invoiceFixture = receivableListFixture.invoice.find(
      (item) => item.id === params.id
    );
    const creditNoteFixture = receivableListFixture.credit_note.find(
      (item) => item.id === params.id
    );
    const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        },
        {
          status: 404,
        }
      );
    }

    fixture.status = ReceivablesStatusEnum.ISSUED;

    await delay();

    return HttpResponse.json(fixture, { status: 200 });
  }),

  /** Get invoice PDF via Email */
  http.get<
    IReceivableByIdParams,
    undefined,
    ReceivableFileUrl | ErrorSchemaResponse
  >(`${receivableDetailPath}/pdf_link`, async ({ params }) => {
    await delay();

    return HttpResponse.json(
      {
        file_url:
          'https://monite-file-saver-sandbox-eu-central-1.s3.eu-central-1.amazonaws.com/sandbox/receivables/6da994ff-c026-4502-a109-954ae5a696a7/89693d25-0902-4597-97a7-64183c13d463.pdf',
      },
      {
        status: 200,
      }
    );
  }),
];
