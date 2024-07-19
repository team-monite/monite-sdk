import { apiVersion } from '@/api/api-version';
import { createAPIClient as createAPIClientBase } from '@/api/create-api-client';
import { Services } from '@/api/services';
import { packageVersion } from '@/packageVersion';
import {
  requestFn,
  mergeHeaders,
  HeadersOptions,
  QraftClientOptions,
} from '@openapi-qraft/react';

export type API = Services;

export interface CreateMoniteAPIClientResult {
  requestFn: typeof requestFn;
  api: API;
  version: string;
}

export interface CreateMoniteAPIClientOptions extends QraftClientOptions {
  /** Used in entity-specific endpoints **/
  entityId?: string;
}

export const createAPIClient = ({
  entityId,
  ...qraftClientOptions
}:
  | CreateMoniteAPIClientOptions
  | undefined = {}): CreateMoniteAPIClientResult => {
  const moniteRequestFn: typeof requestFn = (schema, requestInfo, options) => {
    const predefinedHeaders: HeadersOptions = {
      'x-monite-version': apiVersion,
      'x-monite-sdk-version': packageVersion,
    };

    if (isMoniteEntityIdPath(schema.url))
      predefinedHeaders['x-monite-entity-id'] = entityId;

    return requestFn(
      schema,
      {
        ...requestInfo,
        headers: mergeHeaders(predefinedHeaders, requestInfo.headers),
      },
      options
    );
  };

  return {
    api: createAPIClientBase(qraftClientOptions),
    requestFn: moniteRequestFn,
    version: apiVersion,
  };
};

// TODO the REgExp should contain endpoints entity_users/me & entity_users/my_role. They are skipped for now because of workaround that will be fixed in the task https://monite.atlassian.net/browse/DEV-11719
export const isMoniteEntityIdPath = (path: string) =>
  /^\/(?!auth|entities|entity_users\/my_entity|events|mail_templates|webhook_subscriptions|webhook_settings|receivables\/variables|settings|files|mailbox_domains|payable_purchase_orders|frontend\/bank_account_masks|frontend\/document_type_descriptions|frontend\/person_mask|frontend\/bank_accounts_currency_to_supported_countries|internal)\b/.test(
    path
  );
