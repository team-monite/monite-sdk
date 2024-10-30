import { entityUser2 } from '@/mocks/entityUsers/entityUserByIdFixture';
import { components, paths } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';

import { approvalPoliciesListFixture } from './approvalPoliciesFixture';

const approvalPoliciesPath: `*${Extract<
  keyof paths,
  '/approval_policies'
>}` = `*/approval_policies`;
const approvalPolicyPathById = `${approvalPoliciesPath}/:approvalPolicyId`;

let approvalPoliciesList = approvalPoliciesListFixture.data;

export const approvalPoliciesHandlers = [
  /**
   * Search all approval policies
   *
   * @link {@see https://api.dev.monite.com/docs?version=2023-03-14#/Approval%20policies/get_approval_policies}
   */
  http.get<{}, {}, ApprovalPolicyResourceList | ErrorSchemaResponse>(
    approvalPoliciesPath,
    async ({ request }) => {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      const created_by = searchParams.get('created_by');
      const created_at = searchParams.get('created_at__gte')
        ? new Date(searchParams.get('created_at__gte')!)
        : null;
      if (created_at) {
        created_at.setDate(created_at.getDate() - 1);
      }
      const search_name = searchParams.get('name__ncontains');

      const filteredBySearchName = search_name
        ? approvalPoliciesList.filter((item) => {
            /** Make the search case insensetive */
            return item.name.toLowerCase().includes(search_name.toLowerCase());
          })
        : approvalPoliciesList;

      const filteredByCreatedBy = created_by
        ? filteredBySearchName.filter((item) => {
            return item.created_by === created_by;
          })
        : filteredBySearchName;

      const filteredByCreatedAt = created_at
        ? filteredByCreatedBy.filter((item) => {
            const itemCreatedAtDate = new Date(item.created_at);

            return itemCreatedAtDate.getDate() >= created_at.getDate();
          })
        : filteredByCreatedBy;

      await delay();
      return HttpResponse.json({
        data: filteredByCreatedAt,
        next_pagination_token: undefined,
        prev_pagination_token: undefined,
      });
    }
  ),

  /**
   * Get approval policy by id
   *
   */
  http.get<
    { approvalPolicyId: string },
    undefined,
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPolicyPathById, async ({ params }) => {
    const { approvalPolicyId } = params;

    const fixture = approvalPoliciesListFixture.data.find(
      (policy) => policy.id === approvalPolicyId
    );

    if (!fixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: `There is no approval policy with the given id: ${approvalPolicyId}`,
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();
    return HttpResponse.json(fixture);
  }),

  /**
   * Create a new approval policy
   *
   */
  http.post<
    {},
    ApprovalPolicyCreate,
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPoliciesPath, async ({ request }) => {
    const { name, description, trigger, script } = await request.json();

    const newApprovalPolicy: ApprovalPolicyResource = {
      id: 'new-id',
      name,
      description,
      trigger,
      script,
      created_at: new Date().toISOString(),
      created_by: entityUser2.id,
      updated_at: new Date().toISOString(),
      updated_by: entityUser2.id,
      status: 'active',
    };

    approvalPoliciesListFixture.data.push(newApprovalPolicy);

    await delay();
    return HttpResponse.json(newApprovalPolicy);
  }),

  http.patch<
    { approvalPolicyId: string },
    ApprovalPolicyUpdate,
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPolicyPathById, async ({ request, params }) => {
    const { approvalPolicyId } = params;
    const { name, description, trigger, script } = await request.json();

    approvalPoliciesList = approvalPoliciesList.map((policy) => {
      if (policy.id === approvalPolicyId) {
        return {
          ...policy,
          name: name || policy.name,
          description: description || policy.description,
          trigger,
          script: script || policy.script,
        };
      }

      return policy;
    }, []);

    const updatedApprovalPolicy: ApprovalPolicyResource =
      approvalPoliciesList.find((policy) => policy.id === approvalPolicyId)!;

    if (!updatedApprovalPolicy) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: `There is no approval policy with the given id: ${approvalPolicyId}`,
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();
    return HttpResponse.json(updatedApprovalPolicy);
  }),

  http.delete<{ approvalPolicyId: string }>(
    approvalPolicyPathById,
    async ({ params }) => {
      const approvalPolicyId = params.approvalPolicyId;

      approvalPoliciesList = approvalPoliciesList.filter(
        (approvalPolicy) => approvalPolicy.id !== approvalPolicyId
      );

      await delay();

      return new HttpResponse(null, {
        status: 204,
      });
    }
  ),
];

type ApprovalPolicyCreate = components['schemas']['ApprovalPolicyCreate'];
type ApprovalPolicyResource = components['schemas']['ApprovalPolicyResource'];
type ApprovalPolicyResourceList =
  components['schemas']['ApprovalPolicyResourceList'];
type ApprovalPolicyUpdate = components['schemas']['ApprovalPolicyUpdate'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
