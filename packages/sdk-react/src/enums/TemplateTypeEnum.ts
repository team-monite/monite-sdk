import { components } from '@/api';

const schema: {
  [key in components['schemas']['TemplateTypeEnum']]: key;
} = {
  block: 'block',
  source_object: 'source_object',
};

export const TemplateTypeEnum = Object.values(schema);
