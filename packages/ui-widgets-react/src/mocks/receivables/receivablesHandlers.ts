import { rest } from 'msw';

import {
  ReceivablesPaginationResponse,
  RECEIVABLES_ENDPOINT,
  ReceivableResponse,
  ReceivablesReceivablesReceivablesPaymentTermsListResponse,
  ReceivablesUnitListResponse,
  ReceivablesVatRateListResponse,
  ProductServiceReceivablesPaginationResponse,
  ReceivablesReceivableFacadeCreatePayload,
} from '@team-monite/sdk-api';

import { geMockPagination } from '../utils';
import {
  receivableListFixture,
  receivableByIdFixture,
  paymentTermsListFixture,
  measureUnitsListFixture,
  vatRatesByCounterpartId,
  productsListFixture,
  receivableFixture,
} from './receivablesFixture';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `${RECEIVABLES_ENDPOINT}/:id`;

export const receivableHandlers = [
  // read list
  rest.get<undefined, {}, ReceivablesPaginationResponse>(
    receivablePath,
    ({ url }, res, ctx) => {
      const type = url.searchParams.get('type');

      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );

      if (!type || !receivableListFixture[type]) return res(ctx.status(404));

      return res(
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
  rest.post<ReceivablesReceivableFacadeCreatePayload, {}, ReceivableResponse>(
    receivablePath,
    (req, res, ctx) => {
      return res(ctx.json(receivableFixture));
    }
  ),

  rest.get<
    undefined,
    {},
    ReceivablesReceivablesReceivablesPaymentTermsListResponse
  >('*/payment_terms', (_, res, ctx) => {
    return res(ctx.json(paymentTermsListFixture));
  }),

  rest.get<undefined, {}, ReceivablesUnitListResponse>(
    '*/measure_units',
    (_, res, ctx) => {
      return res(ctx.json(measureUnitsListFixture));
    }
  ),

  rest.get<undefined, {}, ReceivablesVatRateListResponse>(
    '*/vat_rates',
    (_, res, ctx) => {
      return res(ctx.json(vatRatesByCounterpartId));
    }
  ),

  rest.get<undefined, {}, ProductServiceReceivablesPaginationResponse>(
    '*/products',
    ({ url }, res, ctx) => {
      const { prevPage, nextPage } = geMockPagination(
        url.searchParams.get('pagination_token')
      );

      return res(
        ctx.json({
          data: productsListFixture,
          prev_pagination_token: prevPage,
          next_pagination_token: nextPage,
        })
      );
    }
  ),

  // get by id
  rest.get<undefined, { id: string }, any>(
    receivableDetailPath,
    ({ params }, res, ctx) => {
      if (!params.id) return res(ctx.status(404));

      if (params.id === '1') {
        return res(ctx.json(receivableByIdFixture));
      }
    }
  ),
];
