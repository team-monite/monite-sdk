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

import { rest } from 'msw';
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
  rest.get<undefined, {}, ReceivablePaginationResponse>(
    receivablePath,
    ({ url }, res, ctx) => {
      const type = url.searchParams.get('type') as
        | keyof ReceivablesListFixture
        | null;

      const { prevPage, nextPage } = getMockPagination(
        url.searchParams.get('pagination_token')
      );

      if (!type || !receivableListFixture[type]) return res(ctx.status(404));

      return res(
        delay(),
        ctx.json({
          data: receivableListFixture[type] as ReceivableResponse[],
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
          test: url.searchParams.get('type'),
        })
      );
    }
  ),

  // create
  rest.post<
    ReceivableFacadeCreatePayload,
    {},
    ReceivableResponse | ErrorSchemaResponse
  >(receivablePath, async (req, res, ctx) => {
    const jsonBody = await req.json<ReceivableFacadeCreatePayload>();
    try {
      await createInvoiceValidationSchema.validate(jsonBody);

      return res(delay(), ctx.json(receivableListFixture[jsonBody.type][0]));
    } catch (e) {
      console.error(e);

      return res(
        delay(),
        ctx.status(400),
        ctx.json({ error: { message: 'See errors in the console' } })
      );
    }
  }),

  /**
   * Get receivable by id
   *
   * @see {@link https://docs.monite.com/reference/get_receivables_id} the same as in production
   */
  rest.get<undefined, { id: string }, ReceivableResponse | ErrorSchemaResponse>(
    receivableDetailPath,
    ({ params }, res, ctx) => {
      if (!params.id) return res(delay(), ctx.status(404));

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
        return res(
          delay(),
          ctx.status(400),
          ctx.json({
            error: {
              message: `There is no receivable by provided id: ${params.id}`,
            },
          })
        );
      }

      return res(ctx.json(fixture));
    }
  ),

  /** Issue receivable */
  rest.post<
    undefined,
    IReceivableByIdParams,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableIssuePath, (req, res, ctx) => {
    const params = req.params;
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
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        })
      );
    }

    fixture.status = ReceivablesStatusEnum.ISSUED;
    const receivable: InvoiceResponsePayload = {
      ...(fixture as InvoiceResponsePayload),
      status: ReceivablesStatusEnum.ISSUED,
    };

    return res(delay(), ctx.json(receivable));
  }),

  /** Delete receivable */
  rest.delete<
    undefined,
    IReceivableByIdParams,
    undefined | ErrorSchemaResponse
  >(receivableDetailPath, (req, res, ctx) => {
    const params = req.params;
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
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        })
      );
    }

    return res(delay(2_000), ctx.status(204), ctx.json(undefined));
  }),

  /** Cancel receivable */
  rest.post<undefined, IReceivableByIdParams, undefined>(
    receivableCancelPath,
    ({ params }, res, ctx) => {
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
        throw new Error(`There is no receivable by provided id: ${params.id}`);
      }

      return res(delay(), ctx.status(204), ctx.json(undefined));
    }
  ),

  /** Mark receivable as uncollectible */
  rest.post<
    undefined,
    IReceivableByIdParams,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableUncollectiblePath, ({ params }, res, ctx) => {
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
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        })
      );
    }

    const receivable: InvoiceResponsePayload = {
      ...(fixture as InvoiceResponsePayload),
      status: ReceivablesStatusEnum.UNCOLLECTIBLE,
      id: ReceivablesStatusEnum.UNCOLLECTIBLE,
    };

    return res(delay(), ctx.status(200), ctx.json(receivable));
  }),

  /** Send invoice via Email */
  rest.post<
    undefined,
    IReceivableByIdParams,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableSendPath, ({ params }, res, ctx) => {
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
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no receivable by provided id: ${params.id}`,
          },
        })
      );
    }

    fixture.status = ReceivablesStatusEnum.ISSUED;
    return res(delay(1_000), ctx.status(200), ctx.json(fixture));
  }),

  /** Get invoice PDF via Email */
  rest.get<
    undefined,
    IReceivableByIdParams,
    ReceivableFileUrl | ErrorSchemaResponse
  >(`${receivableDetailPath}/pdf_link`, ({ params }, res, ctx) => {
    return res(
      delay(1_000),
      ctx.status(200),
      ctx.json({
        file_url:
          'https://monite-file-saver-sandbox-eu-central-1.s3.eu-central-1.amazonaws.com/sandbox/receivables/6da994ff-c026-4502-a109-954ae5a696a7/89693d25-0902-4597-97a7-64183c13d463.pdf',
      })
    );
  }),
];
