#!/usr/bin/env sh

set -o errexit

yarn exec openapi-qraft src/api/schema.json --plugin tanstack-query-react --plugin openapi-typescript \
  --output-dir src/api --clean --filter-services '**,!/portal/**' \
  --operation-predefined-parameters \
    '/**,!/auth/**,!/entities/**,!/entity_users/me,!/entity_users/my_entity,!/entity_users/my_role,!/events/**,!/mail_templates/**,!/webhook_subscriptions/**,!/webhook_settings/**,!/receivables/variables,!/settings/**,!/files/**,!/mailbox_domains/**,!/payable_purchase_orders/**,!/frontend/**,!/internal/**:header.x-monite-entity-id' \
    '/**:header.x-monite-version' \
   && prettier --write src/api/**/**.ts
