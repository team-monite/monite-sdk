import {
  getLedgerAccountListResponseMock,
  getLedgerAccountResponseMock,
} from './ledgerAccountsFixture';
import { http, HttpResponse } from 'msw';

export const ledgerAccountsHandlers = [
  http.get('*/ledger_accounts', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const sort = url.searchParams.get('sort');

    console.log('Mock API: GET /ledger_accounts called with params:', {
      limit,
      sort,
    });

    const response = getLedgerAccountListResponseMock();

    if (sort === 'name') {
      response.data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      response.data = response.data.slice(0, limitNum);
    }

    return HttpResponse.json(response);
  }),

  http.get('*/ledger_accounts/:ledger_account_id', ({ params }) => {
    const { ledger_account_id } = params;

    console.log(
      'Mock API: GET /ledger_accounts/:id called with id:',
      ledger_account_id
    );

    try {
      const response = getLedgerAccountResponseMock(
        ledger_account_id as string
      );
      return HttpResponse.json(response);
    } catch (_error) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'GL Code Not Found',
      });
    }
  }),
];
