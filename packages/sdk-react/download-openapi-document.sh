#!/usr/bin/env sh

set -o errexit

API_VERSION="$(node -p 'require("@monite/sdk-react/package.json").apiVersion')"
API_STAND="${API_STAND:-sandbox}"

curl -o 'src/api/schema.json' "https://api.$API_STAND.monite.com/openapi.json?show_internal=true&version=$API_VERSION"
prettier --write src/api/schema.json
