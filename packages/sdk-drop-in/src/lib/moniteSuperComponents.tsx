import { ElementType, lazy } from 'react';

const Payables = lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Payables }))
);
const Receivables = lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.Receivables,
  }))
);
const Counterparts = lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.Counterparts,
  }))
);
const Products = lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Products }))
);
const Tags = lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Tags }))
);
const ApprovalPolicies = lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.ApprovalPolicies,
  }))
);
const Onboarding = lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Onboarding }))
);

export type MoniteSuperComponent =
  | 'payables'
  | 'receivables'
  | 'counterparts'
  | 'products'
  | 'tags'
  | 'onboarding'
  | 'approval-policies';

export const moniteSuperComponents: Record<MoniteSuperComponent, ElementType> =
  {
    payables: Payables,
    receivables: Receivables,
    counterparts: Counterparts,
    products: Products,
    tags: Tags,
    onboarding: Onboarding,
    'approval-policies': ApprovalPolicies,
  };
