import { lazy } from 'react';

export const moniteIframeAppComponents = {
  payables: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Payables,
    }))
  ),
  receivables: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Receivables,
    }))
  ),
  counterparts: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Counterparts,
    }))
  ),
  products: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Products,
    }))
  ),
  'settings/tags': lazy(() =>
    import('@monite/sdk-react').then((module) => ({ default: module.Tags }))
  ),
  'settings/approval-policies': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.ApprovalPolicies,
    }))
  ),
  'settings/roles': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.UserRoles,
    }))
  ),
  onboarding: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Onboarding,
    }))
  ),
} as const;
