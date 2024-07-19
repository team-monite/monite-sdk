import chalk from 'chalk';

import {
  ApprovalPolicyPayload,
  createApprovalPolicy,
} from '@/lib/monite-api/create-approval-policy';
import { Logger } from '@/lib/monite-api/demo-data-generator/general.service';
import { AccessToken } from '@/lib/monite-api/fetch-token';

/**
 * Generate Approval Policies
 *
 * @param entity_id Target Entity ID
 * @param entity_user_id Entity User ID to be used for approval policies
 * @param token Access Token must be granted with `{grant_type: 'entity_user'}` permission
 * @param logger Logger function
 */
export const generateApprovalPolicies = async (
  {
    entity_id,
    entity_user_id,
    token,
  }: { entity_id: string; entity_user_id: string; token: AccessToken },
  logger?: Logger
) => {
  const approvalPolicies: ApprovalPolicyPayload[] = [
    {
      name: 'Approval Policy for payables over 500 and less than 1000',
      description:
        'Approval of two users required for any payables over 500 worth and less than 1000',
      trigger: {
        all: [
          "{event_name == 'submitted_for_approval'}",
          '{invoice.amount >= 50000}',
          '{invoice.amount < 100000}',
        ],
      } as unknown as Record<string, never>,
      script: [
        {
          call: 'ApprovalRequests.request_approval_by_users',
          params: {
            user_ids: [entity_user_id],
            required_approval_count: 1,
          },
        } as unknown as Record<string, never>,
      ],
    },
    {
      name: 'Approval Policy for payables over 1000',
      description:
        'Approval of two users required for any payables over 1000 worth',
      trigger: {
        all: [
          "{event_name == 'submitted_for_approval'}",
          '{invoice.amount >= 100000}',
        ],
      } as unknown as Record<string, never>,
      script: [
        {
          call: 'ApprovalRequests.request_approval_by_users',
          params: {
            user_ids: [entity_user_id],
            required_approval_count: 1,
          },
        } as unknown as Record<string, never>,
      ],
    },
  ];

  console.log(
    chalk.green(`Creating Approval Policies for entity_id: "${entity_id}"`)
  );

  for (const policy of approvalPolicies) {
    logger?.({ message: `Creating Approval Policy: ${policy.name}` });
    console.log(chalk.green(`Creating Approval Policy: ${policy.name}`));
    const { id } = await createApprovalPolicy({ entity_id, policy }, token);
    console.log(chalk.gray(`✔︎ Created Approval Policy with ID "${id}"`));
  }
};
