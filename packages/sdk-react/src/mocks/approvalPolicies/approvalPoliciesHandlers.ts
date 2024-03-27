import { entityUser2 } from '@/mocks/entityUsers/entityUserByIdFixture';
import { delay } from '@/mocks/utils';
import {
  APPROVAL_POLICIES_ENDPOINT,
  ApprovalPolicyCreate,
  ApprovalPolicyResource,
  ApprovalPolicyResourceList,
  ApprovalPolicyStatus,
  ApprovalPolicyUpdate,
  ErrorSchemaResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import {
  approvalPoliciesSearchFixture,
  approvalPolicyByIdFixtures,
} from './approvalPoliciesFixture';

const approvalPoliciesPath = `*${APPROVAL_POLICIES_ENDPOINT}`;
const approvalPolicyPathById = `${approvalPoliciesPath}/:approvalPolicyId`;

let approvalPoliciesList = approvalPoliciesSearchFixture.data;

export const approvalPoliciesHandlers = [
  /**
   * Search all approval policies
   *
   * @link {@see https://api.dev.monite.com/docs?version=2023-03-14#/Approval%20policies/get_approval_policies}
   */
  rest.get<undefined, {}, ApprovalPolicyResourceList | ErrorSchemaResponse>(
    approvalPoliciesPath,
    (req, res, ctx) => {
      const searchParams = req.url.searchParams;
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

      return res(
        delay(),
        ctx.json({
          data: filteredByCreatedAt,
          next_pagination_token: undefined,
          prev_pagination_token: undefined,
        })
      );
    }
  ),

  /**
   * Get approval policy by id
   *
   */
  rest.get<
    undefined,
    { approvalPolicyId: string },
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPolicyPathById, (req, res, ctx) => {
    const { approvalPolicyId } = req.params;

    const fixture = approvalPolicyByIdFixtures.find(
      (policy) => policy.id === approvalPolicyId
    );

    if (!fixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no approval policy with the given id: ${approvalPolicyId}`,
          },
        })
      );
    }

    return res(delay(), ctx.json(fixture));
  }),

  /**
   * Create a new approval policy
   *
   */
  rest.post<
    ApprovalPolicyCreate,
    {},
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPoliciesPath, async (req, res, ctx) => {
    const { name, description, trigger, script } =
      await req.json<ApprovalPolicyCreate>();

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
      status: ApprovalPolicyStatus.ACTIVE,
    };

    return res(delay(), ctx.json(newApprovalPolicy));
  }),

  rest.patch<
    ApprovalPolicyUpdate,
    { approvalPolicyId: string },
    ApprovalPolicyResource | ErrorSchemaResponse
  >(approvalPolicyPathById, async (req, res, ctx) => {
    const { approvalPolicyId } = req.params;
    const { name, description, trigger, script } =
      await req.json<ApprovalPolicyUpdate>();

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
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: `There is no approval policy with the given id: ${approvalPolicyId}`,
          },
        })
      );
    }

    return res(delay(), ctx.json(updatedApprovalPolicy));
  }),
];
