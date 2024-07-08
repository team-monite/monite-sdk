#!/usr/bin/env sh

set -o errexit

API_VERSION="$(node -p 'require("./package.json").apiVersion')"
API_STAND="${API_STAND:-dev}"

curl -o src/lib/monite-api/schema.json "https://api.$API_STAND.monite.com/openapi.json?show_internal=true&version=$API_VERSION"
prettier --write src/lib/monite-api/schema.json
