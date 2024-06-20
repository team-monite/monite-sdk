import { type components, Services } from '@/api';
import { ApprovalRequestStatus } from '@/components/approvalRequests/types';
import { approvalRequestsListFixture } from '@/mocks/approvalRequests';

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
    const created_by = url.searchParams.get('created_by');

    let next_pagination_token = undefined;
    let prev_pagination_token = undefined;

    const filteredData = (() => {
      let filtered = approvalRequestsListFixture;
      const parsedLimit = Number(limit);

      if (status) {
        filtered = filterByStatus(status, approvalRequestsListFixture);
      }

      if (created_by) {
        filtered = filtered.filter(
          (approvalRequest) => approvalRequest.created_by === created_by
        );
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

  http.post<
    { id: string },
    undefined,
    components['schemas']['ApprovalRequestResourceWithMetadata']
  >(`${approvalRequestsPath}/:id/approve`, async ({ params }) => {
    const approvalRequest = approvalRequestsListFixture.find(
      (approvalRequest) => approvalRequest.id === params.id
    );

    await delay();

    return HttpResponse.json(approvalRequest);
  }),

  http.post<
    { id: string },
    undefined,
    components['schemas']['ApprovalRequestResourceWithMetadata']
  >(`${approvalRequestsPath}/:id/reject`, async ({ params }) => {
    const approvalRequest = approvalRequestsListFixture.find(
      (approvalRequest) => approvalRequest.id === params.id
    );

    await delay();

    return HttpResponse.json(approvalRequest);
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
