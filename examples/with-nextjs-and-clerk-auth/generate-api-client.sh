#!/usr/bin/env sh

set -o errexit

yarn exec openapi-qraft src/lib/monite-api/schema.json --plugin openapi-typescript \
  --output-dir src/lib/monite-api --clean --filter-services '**,!/portal/**' \
   && prettier --write src/lib/monite-api/schema.ts
