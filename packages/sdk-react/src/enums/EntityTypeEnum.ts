import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['EntityTypeEnum']]: key;
} = {
  individual: 'individual',
  organization: 'organization',
};

export const EntityTypeEnum = Object.values(schema);
