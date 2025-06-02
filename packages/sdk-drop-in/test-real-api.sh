#!/bin/bash

# E2E Testing with Real API Script
# This script helps you run E2E tests against the real Monite API

echo "🚀 Running E2E tests with real API..."
echo ""

# Check if real credentials are provided
if [ -z "$MONITE_E2E_APP_ADMIN_CONFIG_JSON" ]; then
    echo "❌ Error: MONITE_E2E_APP_ADMIN_CONFIG_JSON environment variable is not set"
    echo ""
    echo "Please set it with your real credentials:"
    echo ""
    echo "export MONITE_E2E_APP_ADMIN_CONFIG_JSON='{\"stand\":\"dev\",\"api_url\":\"https://api.dev.monite.com\",\"app_basename\":\"monite-iframe-app\",\"app_hostname\":\"localhost\",\"entity_user_id\":\"your_real_entity_user_id\",\"client_id\":\"your_real_client_id\",\"client_secret\":\"your_real_client_secret\"}'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Real API credentials detected"
echo "🌐 Tests will make real API calls to Monite"
echo ""

# Run the tests
yarn e2e

echo ""
echo "✅ E2E tests completed with real API" 