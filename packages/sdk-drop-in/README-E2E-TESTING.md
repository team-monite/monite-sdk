# E2E Testing Configuration

This document explains how to configure E2E tests to use either real API calls or development mocks.

## Overview

The E2E testing system supports both:
1. **Real API calls** for true end-to-end testing (CI and local)
2. **Development mocks** for fast local development

## Quick Start

### Option 1: Local Testing with Mocks (Default)
```bash
# Fast local testing with mocks
yarn e2e
```

### Option 2: Local Testing with Real API
```bash
# Set your real credentials
export MONITE_E2E_APP_ADMIN_CONFIG_JSON='{"stand":"dev","api_url":"https://api.dev.monite.com","app_basename":"monite-iframe-app","app_hostname":"localhost","entity_user_id":"your_real_entity_user_id","client_id":"your_real_client_id","client_secret":"your_real_client_secret"}'

# Run tests with real API
yarn e2e

# OR use the helper script
./test-real-api.sh
```

### Option 3: CI Testing (Automatic)
```bash
# In CI, automatically uses real API via secrets
yarn e2e  # Uses MONITE_E2E_APP_ADMIN_CONFIG_JSON secret
```

## How It Works

### 🔒 Mock Mode (Default Local)
**When**: No `MONITE_E2E_APP_ADMIN_CONFIG_JSON` environment variable set
**Behavior**:
- ✅ API calls are mocked (fast, offline)
- ✅ Uses mock layout with navigation buttons
- ✅ No dependency on real credentials
- ✅ Consistent test results

### 🌐 Real API Mode (CI + Local with Credentials)
**When**: `MONITE_E2E_APP_ADMIN_CONFIG_JSON` is set OR `process.env.CI` is true
**Behavior**:
- ✅ Real API calls to Monite endpoints
- ✅ Real authentication and data
- ✅ Tests actual iframe content
- ✅ True end-to-end validation

## Configuration Details

### Real Credentials Format
```json
{
  "stand": "dev",
  "api_url": "https://api.dev.monite.com",
  "app_basename": "monite-iframe-app", 
  "app_hostname": "localhost",
  "entity_user_id": "your_real_entity_user_id",
  "client_id": "your_real_client_id",
  "client_secret": "your_real_client_secret"
}
```

### Environment Detection Logic
```typescript
// API mocks are only applied when:
const shouldUseMocks = !process.env.CI && !process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON;

if (shouldUseMocks) {
  // Mock API endpoints
} else {
  // Allow real API calls
}
```

## Test Behavior Differences

### With Mocks 🔒
- Tests interact with mock layout buttons
- No network requests to external APIs
- Instant responses
- Consistent behavior

### With Real API 🌐  
- Tests interact with real iframe content
- Real API authentication flow
- Real data from Monite API
- Network-dependent timing

## CI Configuration

The CI environment automatically uses real API testing:

```yaml
# .github/workflows/monorepo-main-suite.yaml
- name: E2E Test
  run: yarn e2e
  env:
    MONITE_E2E_APP_ADMIN_CONFIG_JSON: ${{ secrets.MONITE_E2E_APP_ADMIN_CONFIG_JSON }}
```

## Debugging

### Check Which Mode Is Active
```bash
# Look for these log messages during test execution:
# 🔒 Using API mocks for local development
# 🌐 Using real API calls - no mocks applied
```

### Debug Real API Issues
```bash
# Run with browser to see network requests
yarn e2e --headed

# Check for authentication failures or API errors in console
```

### Debug Mock Issues  
```bash
# Ensure no real credentials are set
unset MONITE_E2E_APP_ADMIN_CONFIG_JSON
yarn e2e
```

## Benefits

| Mode | Speed | Reliability | API Coverage | Setup |
|------|-------|-------------|--------------|--------|
| **Mocks** 🔒 | ⚡ Fast | 🎯 Consistent | ❌ Limited | ✅ Easy |
| **Real API** 🌐 | 🐌 Slower | 🌐 Network-dependent | ✅ Complete | 🔧 Requires credentials |

## Migration Notes

- **Previous setup**: Always used mocks
- **New setup**: Conditional mocking based on environment
- **CI**: Now uses real API for true E2E validation
- **Local**: Can use either mode depending on needs 