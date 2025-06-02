# E2E Testing Modes: Local vs CI

## 🎯 Overview

The E2E testing system now supports **conditional API testing** that automatically switches between mocked and real API calls based on the environment and configuration.

## 🔄 How Mode Detection Works

```typescript
// In tests/iframe.test.ts
const shouldUseMocks = !process.env.CI && !process.env.MONITE_E2E_APP_ADMIN_CONFIG_JSON;

if (shouldUseMocks) {
  console.log('🔒 Using API mocks for local development');
  // Mock API endpoints
} else {
  console.log('🌐 Using real API calls - no mocks applied');
  // Let API calls pass through to real endpoints
}
```

## 📊 Testing Modes Comparison

| Environment | API Calls | Speed | Reliability | Setup Required |
|------------|-----------|-------|-------------|----------------|
| **Local Development** 🔒 | Mocked | ⚡ Fast | 🎯 Consistent | ✅ None |
| **Local with Real API** 🌐 | Real | 🐌 Slower | 🌐 Network-dependent | 🔧 Credentials |
| **CI Environment** 🌐 | Real | 🐌 Slower | 🌐 Network-dependent | ✅ Auto-configured |

## 🔒 Local Development Mode (Default)

**When**: Running `yarn e2e` without any special configuration

**Characteristics**:
- ✅ **Fast execution** (~27 seconds)
- ✅ **No network dependencies** 
- ✅ **Consistent results**
- ✅ **Works offline**
- ⚠️ **Limited API coverage** (mocked responses)

**What Gets Mocked**:
```bash
# These endpoints are intercepted:
**/auth/token → Returns mock access token
**/entity_users/my_entity → Returns mock entity data

# Config uses mocked credentials:
{
  "entity_user_id": "mocked_entity_id",
  "client_id": "mocked_client_id", 
  "client_secret": "mocked_client_secret"
}
```

**Expected Test Behavior**:
- Iframes load with mocked credentials
- Show "Access Restricted" errors (expected with invalid tokens)
- Tests pass by finding UI elements (headings, buttons)

## 🌐 Real API Mode

### Local Real API Testing

**Setup**:
```bash
# Set your real credentials
export MONITE_E2E_APP_ADMIN_CONFIG_JSON='{"stand":"dev","api_url":"https://api.dev.monite.com","app_basename":"monite-iframe-app","app_hostname":"localhost","entity_user_id":"your_real_entity_user_id","client_id":"your_real_client_id","client_secret":"your_real_client_secret"}'

# Run tests
yarn e2e

# Or use the helper script
./test-real-api.sh
```

**Characteristics**:
- ✅ **Real authentication flow**
- ✅ **Real data from Monite API**
- ✅ **True end-to-end validation**
- ✅ **Tests actual iframe content**
- ⚠️ **Requires valid credentials**
- ⚠️ **Network-dependent timing**

### CI Real API Testing

**Automatic Configuration**:
- Uses `MONITE_E2E_APP_ADMIN_CONFIG_JSON` secret
- No API mocking applied
- Real authentication and data flow

## 🔍 Debugging & Monitoring

### Check Which Mode Is Active

Look for these log messages during test execution:

```bash
# Mock Mode
🔒 Using API mocks for local development

# Real API Mode  
🌐 Using real API calls - no mocks applied
```

### Debug Real API Issues

```bash
# Run with browser to see network requests
yarn e2e --headed

# Check for:
# - 401/422 authentication errors
# - Network timeouts
# - Missing permissions
```

### Debug Mock Issues

```bash
# Ensure no real credentials interfere
unset MONITE_E2E_APP_ADMIN_CONFIG_JSON
yarn e2e
```

## 🚀 CI Configuration

**GitHub Actions Workflow**:
```yaml
# .github/workflows/monorepo-main-suite.yaml
e2e-testing:
  name: E2E Playwright Testing
  environment: common
  steps:
    - name: E2E Test
      run: yarn e2e
      env:
        MONITE_E2E_APP_ADMIN_CONFIG_JSON: ${{ secrets.MONITE_E2E_APP_ADMIN_CONFIG_JSON }}
```

**Secret Format**:
```json
{
  "stand": "dev",
  "api_url": "https://api.dev.monite.com", 
  "app_basename": "monite-iframe-app",
  "app_hostname": "localhost",
  "entity_user_id": "real_entity_user_id",
  "client_id": "real_client_id",
  "client_secret": "real_client_secret"
}
```

## 🔧 When to Use Which Mode

### Use Mock Mode 🔒 For:
- ✅ **Local development** and debugging
- ✅ **Quick validation** of UI changes
- ✅ **Testing navigation** and layout
- ✅ **Offline development**
- ✅ **Consistent CI checks** (if needed)

### Use Real API Mode 🌐 For:
- ✅ **True end-to-end testing**
- ✅ **Authentication flow validation**
- ✅ **Real data integration testing**
- ✅ **Production readiness checks**
- ✅ **API regression testing**

## ⚡ Performance Comparison

```bash
# Mock Mode (Default)
yarn e2e
# ✅ ~27 seconds, 7/7 tests pass

# Real API Mode (with valid credentials)  
MONITE_E2E_APP_ADMIN_CONFIG_JSON="..." yarn e2e
# ⏱️ ~45-60 seconds (network dependent), 7/7 tests pass
```

## 🔄 Migration Strategy

1. **Keep mock mode as default** for fast local development
2. **Use real API mode for critical testing** before releases
3. **CI automatically uses real API** for comprehensive validation
4. **Developers can choose mode** based on testing needs

This gives you the best of both worlds: fast local development with the option for comprehensive testing when needed. 