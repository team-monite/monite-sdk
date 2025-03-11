import { components } from '@/api';
import {
  receivableListFixture,
  ReceivablesListFixture,
  receivableContactsFixture,
  receivablePreviewFixture,
} from '@/mocks';
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';
import * as yup from 'yup';

import { getMockPagination } from '../utils';
import {
  createEmailInvoiceContact,
  createEmailInvoicePreview,
} from './receivablesFixture';

const RECEIVABLES_ENDPOINT = 'receivables';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `*/${RECEIVABLES_ENDPOINT}/:id`;
const receivableIssuePath = `${receivableDetailPath}/issue`;
const receivableCancelPath = `${receivableDetailPath}/cancel`;
const receivableUncollectiblePath = `${receivableDetailPath}/mark_as_uncollectible`;
const receivableSendPath = `${receivableDetailPath}/send`;
const receivablePreviewPath = `${receivableDetailPath}/preview`;
const receivableContactsPath = `*/${RECEIVABLES_ENDPOINT}/:receivableId/contacts`;

const receivableContactsPath = `${receivableDetailPath}/contacts`;
const receivablePreviewEmailPath = `${receivableDetailPath}/preview_email`;

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

type Schemas = components['schemas'];
type ErrorResponse = Schemas['ErrorSchemaResponse'];
type LineItemsResponse = Schemas['LineItemsResponse'];
type ReceivableResponse = Schemas['ReceivableResponse'];

function createMissingIdError(id: string | undefined, idType: string) {
  if (!id) {
    return HttpResponse.json<ErrorResponse>(
      { error: { message: `Missing ${idType} ID` } },
      { status: 400 }
    );
  }
  return undefined;
}

function createNotFoundError(itemType: string, id: string) {
  return HttpResponse.json<ErrorResponse>(
    { error: { message: `There is no ${itemType} by provided id: ${id}` } },
    { status: 404 }
  );
}

/**
 * Utility function to find a receivable by ID across all types
 * @param id The receivable ID to find
 * @returns The found receivable or undefined
 */
function findReceivableById(id: string) {
  const quoteFixture = receivableListFixture.quote.find(
    (item) => item.id === id
  );
  const invoiceFixture = receivableListFixture.invoice.find(
    (item) => item.id === id
  );
  const creditNoteFixture = receivableListFixture.credit_note.find(
    (item) => item.id === id
  );
  return quoteFixture || invoiceFixture || creditNoteFixture;
}

export function createEmailInvoiceDetailsHandlers(
  status: Schemas['InvoiceResponsePayload']['status']
) {
  return [
    http.get<IReceivableByIdParams>(
      receivableContactsPath,
      async ({ params }) => {
        const missingIdError = createMissingIdError(params.id, 'receivable');
        if (missingIdError) return missingIdError;

        await delay();
        return HttpResponse.json({
          data: [createEmailInvoiceContact()],
        });
      }
    ),

    http.get<IReceivableByIdParams>(
      receivablePreviewEmailPath,
      async ({ params }) => {
        const missingIdError = createMissingIdError(params.id, 'receivable');
        if (missingIdError) return missingIdError;

        await delay();
        return HttpResponse.json(createEmailInvoicePreview());
      }
    ),

    http.get<{ id: string }>(receivableDetailPath, async ({ params }) => {
      const missingIdError = createMissingIdError(params.id, 'receivable');
      if (missingIdError) return missingIdError;

      const fixture = findReceivableById(params.id);
      if (!fixture) {
        await delay();
        return createNotFoundError('receivable', params.id);
      }

      const receivable = {
        ...fixture,
        status,
      };

      await delay();
      return HttpResponse.json(receivable);
    }),
  ];
}

export const receivableHandlers = [
  // read list
  http.get<
    {},
    undefined,
    Schemas['ReceivablePaginationResponse'] | Schemas['ErrorSchemaResponse']
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
    Schemas['ReceivableFacadeCreatePayload'],
    Schemas['ReceivableResponse'] | Schemas['ErrorSchemaResponse']
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
    Schemas['UpdateLineItems'],
    LineItemsResponse | ErrorResponse
  >(`${receivableDetailPath}/line_items`, async ({ params }) => {
    const missingIdError = createMissingIdError(params.id, 'receivable');
    if (missingIdError) return missingIdError;

    const invoiceLineItemsResponse = receivableListFixture.invoice.find(
      (invoice) => invoice.id === params.id
    );

    if (!invoiceLineItemsResponse) {
      await delay();
      return createNotFoundError('receivable', params.id!);
    }

    return HttpResponse.json<LineItemsResponse>({
      data: invoiceLineItemsResponse.line_items,
    });
  }),

  // update
  http.patch<
    { id: string },
    Schemas['ReceivableUpdatePayload'],
    Schemas['ReceivableResponse'] | Schemas['ErrorSchemaResponse']
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
    Schemas['ReceivableResponse'] | Schemas['ErrorSchemaResponse']
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
      return createNotFoundError('receivable', params.id);
    }

    return HttpResponse.json(fixture);
  }),

  /** Issue receivable */
  http.post<
    IReceivableByIdParams,
    undefined,
    ReceivableResponse | ErrorResponse
  >(receivableIssuePath, async ({ params }) => {
    const missingIdError = createMissingIdError(params.id, 'receivable');
    if (missingIdError) return missingIdError;

    const fixture = findReceivableById(params.id);

    if (!fixture) {
      await delay();
      return createNotFoundError('receivable', params.id);
    }

    const receivable = {
      ...(fixture as Schemas['InvoiceResponsePayload']),
      status: 'issued' as const,
    } as ReceivableResponse;

    await delay();
    return HttpResponse.json<ReceivableResponse>(receivable);
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
    Schemas['ReceivableResponse'] | Schemas['ErrorSchemaResponse']
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

    const receivable: Schemas['InvoiceResponsePayload'] = {
      ...(fixture as Schemas['InvoiceResponsePayload']),
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
    Schemas['ReceivableResponse'] | Schemas['ErrorSchemaResponse']
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
    Schemas['ReceivableFileUrl'] | Schemas['ErrorSchemaResponse']
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

  /** Preview email */
  http.post<
    { id: string },
    components['schemas']['ReceivablePreviewRequest'],
    | components['schemas']['ReceivablePreviewResponse']
    | components['schemas']['ErrorSchemaResponse']
  >(receivablePreviewPath, async ({ request, params }) => {
    const body = await request.json();
    if (!body.body_text || !body.subject_text) {
      await delay();

      return HttpResponse.json(
        { error: { message: 'Missing required fields.' } },
        { status: 400 }
      );
    }

    await delay();

    const preview = receivablePreviewFixture[params.id] || {
      body_preview: `<html><body>${body.body_text}</body></html>`,
      subject_preview: body.subject_text,
    };

    return HttpResponse.json(preview);
  }),

  /** Get receivable contacts */
  http.get<
    { receivableId: string },
    undefined,
    components['schemas']['CounterpartContactsResourceList']
  >(receivableContactsPath, async ({ params }) => {
    const { receivableId } = params;
    await delay();

    return HttpResponse.json({
      data: receivableContactsFixture[receivableId] || [],
    });
  }),
];
