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
  tags: lazy(() =>
    import('@monite/sdk-react').then((module) => ({ default: module.Tags }))
  ),
  'approval-policies': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.ApprovalPolicies,
    }))
  ),
  roles: lazy(() =>
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
