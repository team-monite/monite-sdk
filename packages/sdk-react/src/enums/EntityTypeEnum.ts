import { components } from '@/api';

const schema: {
  [key in components['schemas']['EntityTypeEnum']]: key;
} = {
  individual: 'individual',
  organization: 'organization',
};

export const EntityTypeEnum = Object.values(schema);
