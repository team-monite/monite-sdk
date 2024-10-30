import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['TemplateTypeEnum']]: key;
} = {
  block: 'block',
  source_object: 'source_object',
};

export const TemplateTypeEnum = Object.values(schema);
