import { components } from '@/api';

const schema: {
  [key in components['schemas']['OnboardingRequirement']]: key;
} = {
  entity: 'entity',
  business_profile: 'business_profile',
  representative: 'representative',
  owners: 'owners',
  directors: 'directors',
  executives: 'executives',
  persons: 'persons',
  bank_accounts: 'bank_accounts',
  entity_documents: 'entity_documents',
  ownership_declaration: 'ownership_declaration',
  persons_documents: 'persons_documents',
  tos_acceptance: 'tos_acceptance',
};

export const OnboardingRequirement = Object.values(schema);
