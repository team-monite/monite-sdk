import { Services } from '@/api';
import { approvalRequestsListFixture } from '@/mocks/approvalRequests/approvalRequestsFixture';

import { delay, http, HttpResponse } from 'msw';

const approvalRequestsPath = `*/approval_requests`;

export const approvalRequestsHandlers = [
  http.get<
    {},
    undefined,
    Services['approvalRequests']['getApprovalRequests']['types']['data']
  >(approvalRequestsPath, async ({ request }) => {
    const url = new URL(request.url);

    const limit = url.searchParams.get('limit') || null;
    const pagination_token = url.searchParams.get('pagination_token') || null;

    let next_pagination_token = undefined;
    let prev_pagination_token = undefined;

    const filteredData = (() => {
      const parsedLimit = Number(limit);

      if (pagination_token === '1') {
        next_pagination_token = undefined;
        prev_pagination_token = '-1';

        return approvalRequestsListFixture.slice(parsedLimit, parsedLimit * 2);
      }

      next_pagination_token = '1';
      prev_pagination_token = undefined;

      return approvalRequestsListFixture.slice(0, parsedLimit);
    })();

    await delay();

    return HttpResponse.json({
      data: filteredData,
      next_pagination_token,
      prev_pagination_token,
    });
  }),
];
