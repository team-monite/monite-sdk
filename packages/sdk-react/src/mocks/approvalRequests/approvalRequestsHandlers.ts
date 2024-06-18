import { Services } from '@/api';
import { approvalRequestsListFixture } from '@/mocks/approvalRequests';
import { ApprovalRequestStatus } from '@monite/sdk-api';

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
    const status = url.searchParams.get('status');

    let next_pagination_token = undefined;
    let prev_pagination_token = undefined;

    const filteredData = (() => {
      let filtered = approvalRequestsListFixture;
      const parsedLimit = Number(limit);

      if (status) {
        filtered = filterByStatus(status, approvalRequestsListFixture);
      }

      if (pagination_token === '1') {
        next_pagination_token = undefined;
        prev_pagination_token = '-1';

        return filtered.slice(parsedLimit, parsedLimit * 2);
      }

      next_pagination_token = '1';
      prev_pagination_token = undefined;

      return filtered.slice(0, parsedLimit);
    })();

    await delay();

    return HttpResponse.json({
      data: filteredData,
      next_pagination_token,
      prev_pagination_token,
    });
  }),
];

const filterByStatus = (
  status: ApprovalRequestStatus | string,
  fixtures: typeof approvalRequestsListFixture
) => {
  if (!status) return fixtures;

  if (
    !Object.values(ApprovalRequestStatus).includes(
      status as ApprovalRequestStatus
    )
  )
    throw new Error('Invalid status');

  return fixtures.filter(
    (approvalRequest) => approvalRequest.status === status
  );
};
