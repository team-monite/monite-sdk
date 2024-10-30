import { receivableListFixture, ReceivablesListFixture } from '@/mocks';
import { faker } from '@faker-js/faker';
import { components } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';
import * as yup from 'yup';

import { getMockPagination } from '../utils';

const RECEIVABLES_ENDPOINT = 'receivables';

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
  http.get<
    {},
    undefined,
    | components['schemas']['ReceivablePaginationResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(receivablePath, async ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') as
      | keyof ReceivablesListFixture
      | null;

    const { prevPage, nextPage } = getMockPagination(
      url.searchParams.get('pagination_token')
    );

    const idIn = url.searchParams.getAll('id__in');

    await delay();

    if (idIn?.length) {
      await delay();

      return HttpResponse.json({
        data: Object.values(receivableListFixture)
          .flat()
          .filter(({ id }) => idIn.includes(id)),
        prev_pagination_token: prevPage,
        next_pagination_token: nextPage,
      });
    }
    if (!type || !receivableListFixture[type]) {
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

    return HttpResponse.json({
      data: receivableListFixture[type],
      prev_pagination_token: prevPage,
      next_pagination_token: nextPage,
    });
  }),

  // create
  http.post<
    {},
    components['schemas']['ReceivableFacadeCreatePayload'],
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
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

  // Update receivable line items
  http.put<
    { id: string },
    components['schemas']['UpdateLineItems'],
    | components['schemas']['LineItemsResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(`${receivableDetailPath}/line_items`, async ({ params }) => {
    const invoiceLineItemsResponse = receivableListFixture.invoice.find(
      (invoice) => invoice.id === params.id
    );

    if (!invoiceLineItemsResponse) {
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

    return HttpResponse.json({
      data: invoiceLineItemsResponse.line_items,
    });
  }),

  // update
  http.patch<
    { id: string },
    components['schemas']['ReceivableUpdatePayload'],
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(receivableDetailPath, async ({ request, params }) => {
    const jsonBody = await request.json();

    if ('invoice' in jsonBody) {
      const invoiceRequest = jsonBody.invoice;
      const invoiceResponse = receivableListFixture.invoice.find(
        (invoice) => invoice.id === params.id
      );

      if (!invoiceResponse) {
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

      return HttpResponse.json({
        ...invoiceRequest,
        ...invoiceResponse,
      });
    } else if ('quote' in jsonBody) {
      const quoteRequest = jsonBody.quote;
      const quoteResponse = receivableListFixture.quote.find(
        (quote) => quote.id === params.id
      );

      if (!quoteResponse) {
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

      return HttpResponse.json({
        ...quoteRequest,
        ...quoteResponse,
      });
    } else if ('credit_note' in jsonBody) {
      const creditNoteRequest = jsonBody.credit_note;
      const creditNoteResponse = receivableListFixture.credit_note.find(
        (creditNote) => creditNote.id === params.id
      );

      if (!creditNoteResponse) {
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

      return HttpResponse.json({
        ...creditNoteRequest,
        ...creditNoteResponse,
      });
    }

    await delay();

    return HttpResponse.json({
      error: {
        message: 'Invalid request',
      },
    });
  }),

  /**
   * Get receivable by id
   *
   * @see {@link https://docs.monite.com/reference/get_receivables_id} the same as in production
   */
  http.get<
    { id: string },
    undefined,
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(receivableDetailPath, async ({ params }) => {
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
  }),

  /** Issue receivable */
  http.post<
    IReceivableByIdParams,
    undefined,
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
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

    fixture.status = 'issued';

    const receivable: components['schemas']['InvoiceResponsePayload'] = {
      ...(fixture as components['schemas']['InvoiceResponsePayload']),
      status: 'issued',
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
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
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

    const receivable: components['schemas']['InvoiceResponsePayload'] = {
      ...(fixture as components['schemas']['InvoiceResponsePayload']),
      status: 'uncollectible',
      id: 'uncollectible',
    };

    await delay();

    return HttpResponse.json(receivable, { status: 200 });
  }),

  /** Send invoice via Email */
  http.post<
    IReceivableByIdParams,
    undefined,
    | components['schemas']['ReceivableResponse']
    | components['schemas']['ErrorSchemaResponse']
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

    fixture.status = 'issued';

    await delay();

    return HttpResponse.json(fixture, { status: 200 });
  }),

  /** Get invoice PDF via Email */
  http.get<
    IReceivableByIdParams,
    undefined,
    | components['schemas']['ReceivableFileUrl']
    | components['schemas']['ErrorSchemaResponse']
  >(`${receivableDetailPath}/pdf_link`, async () => {
    await delay();

    /**
     * Return File Url conditionally
     *  to simulate the real-world scenario
     *
     * ! Note !: It will break tests if we want to check if PDF is rendered,
     *  which is not the case in the current implementation
     */
    const shouldReturnFileUrl = faker.datatype.boolean({
      probability: 0.7,
    });

    if (shouldReturnFileUrl) {
      return HttpResponse.json(
        {
          file_url:
            'https://monite-file-saver-sandbox-eu-central-1.s3.eu-central-1.amazonaws.com/sandbox/receivables/6da994ff-c026-4502-a109-954ae5a696a7/89693d25-0902-4597-97a7-64183c13d463.pdf',
        },
        {
          status: 200,
        }
      );
    }

    return HttpResponse.json(
      /** Don't return a `file_url` to simulate real-word scenario */
      {},
      {
        status: 200,
      }
    );
  }),
];
