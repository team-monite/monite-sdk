import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import { paths } from './schema';


/**
 * Creates an Approval Policy for the entity
 *
 * @param entity_id Target Entity ID
 * @param policy Approval Policy Payload
 * @param token Access Token must be granted with `{grant_type: 'entity_user'}` permission
 */
export const createApprovalPolicy = async (
  {
    entity_id,
    policy,
  }: {
    entity_id: string;
    policy: ApprovalPolicyPayload;
  },
  token: AccessToken
) => {
  if (!entity_id) throw new Error('entity_id is empty');

  const { POST } = createMoniteClient(token);

  const { data, error, response } = await POST('/approval_policies', {
    params: {
      header: {
        'x-monite-version': getMoniteApiVersion(),
        'x-monite-entity-id': entity_id,
      },
    },
    body: policy,
  });

  if (error) {
    console.error(
      `Failed to create Approval Policy for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    if (error instanceof Error) throw error;
    throw new Error(`Entity User create failed: ${JSON.stringify(error)}`);
  }

  if (!data)
    throw new Error('Failed to create Approval Policy: no data returned');

  return data;
};

export type ApprovalPolicyPayload =
  paths['/approval_policies']['post']['requestBody']['content']['application/json'];
