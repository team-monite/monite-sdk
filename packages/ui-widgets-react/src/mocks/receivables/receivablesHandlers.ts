import { rest } from 'msw';

import {
  ReceivablePaginationResponse,
  RECEIVABLES_ENDPOINT,
  ReceivableResponse,
  PaymentTermsListResponse,
  UnitListResponse,
  VatRateListResponse,
  ProductServicePaginationResponse,
  ReceivableFacadeCreatePayload,
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
  rest.get<undefined, {}, ReceivablePaginationResponse>(
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
  rest.post<ReceivableFacadeCreatePayload, {}, ReceivableResponse>(
    receivablePath,
    (req, res, ctx) => {
      return res(ctx.json(receivableFixture));
    }
  ),

  rest.get<undefined, {}, PaymentTermsListResponse>(
    '*/payment_terms',
    (_, res, ctx) => {
      return res(ctx.json(paymentTermsListFixture));
    }
  ),

  rest.get<undefined, {}, UnitListResponse>(
    '*/measure_units',
    (_, res, ctx) => {
      return res(ctx.json(measureUnitsListFixture));
    }
  ),

  rest.get<undefined, {}, VatRateListResponse>('*/vat_rates', (_, res, ctx) => {
    return res(ctx.json(vatRatesByCounterpartId));
  }),

  rest.get<undefined, {}, ProductServicePaginationResponse>(
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
