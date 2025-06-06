'use client';

import dynamic from 'next/dynamic';

import LoadingFallback from '@/components/LoadingFallback';

const MoniteProviderClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.MoniteProvider,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const PayablesClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.Payables,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const ReceivablesClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.Receivables,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const CounterpartsClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.Counterparts,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const ProductsClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.Products,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const ApprovalPoliciesClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.ApprovalPolicies,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const TagsClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({ default: mod.Tags })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const UserRolesClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.UserRoles,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const RolesAndPoliciesClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.RolesAndPolicies,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const InvoiceDesignClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.InvoiceDesign,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

const OnboardingClient = dynamic(
  () =>
    import('./MoniteComponentsClient').then((mod) => ({
      default: mod.Onboarding,
    })),
  { ssr: false, loading: () => <LoadingFallback minimal /> }
);

export const MoniteProvider = MoniteProviderClient;
export const Payables = PayablesClient;
export const Receivables = ReceivablesClient;
export const Counterparts = CounterpartsClient;
export const Products = ProductsClient;
export const ApprovalPolicies = ApprovalPoliciesClient;
export const Tags = TagsClient;
export const UserRoles = UserRolesClient;
export const RolesAndPolicies = RolesAndPoliciesClient;
export const InvoiceDesign = InvoiceDesignClient;
export const Onboarding = OnboardingClient;
