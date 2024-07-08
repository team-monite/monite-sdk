import { components } from '@/api';

const schema: {
  [key in components['schemas']['SourceOfPayableDataEnum']]: key;
} = {
  ocr: 'ocr',
  user_specified: 'user_specified',
};

export const SourceOfPayableDataEnum = Object.values(schema);
