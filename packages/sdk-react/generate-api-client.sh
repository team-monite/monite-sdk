#!/usr/bin/env sh

yarn exec openapi-qraft src/api/schema.json --plugin tanstack-query-react --plugin openapi-typescript \
  --output-dir src/api --filter-services '**,!/internal/**' \
  --operation-predefined-parameters \
    '/**,!/auth/**,!/entities/**,!/entity_users/**,!/events/**,!/mail_templates/**,!/webhook_subscriptions/**,!/receivables/variables,!/settings/**,!/files/**,!/mailbox_domains/**,!/payable_purchase_orders/**:header.x-monite-entity-id' \
    '/**:header.x-monite-version' \
   && prettier --write src/api/**/**.ts
