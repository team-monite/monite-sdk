#!/bin/sh

API_VERSION=$(node -p 'require("@monite/sdk-api/package.json").apiVersion')

STAND="dev"
OUTPUT_DIR="./src/api"
EXPORT_CORE="false"
EXPORT_SERVICES="false"

# write version to file
echo "// This file was generated automatically\n /** @deprecated **/ \n export const apiVersion = '$API_VERSION';" > $OUTPUT_DIR/apiVersion.ts

# Remove old models
rimraf $OUTPUT_DIR/models/*

# Generate new data with openapi
openapi -i "https://api.$STAND.monite.com/openapi.json?version=$API_VERSION&show_internal=true" \
        --exportCore $EXPORT_CORE \
        --exportServices $EXPORT_SERVICES \
        -o $OUTPUT_DIR

# Apply prettier for code formatting
prettier --write "$OUTPUT_DIR/**/*.ts"

