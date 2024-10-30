import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['OcrStatusEnum']]: key;
} = {
  processing: 'processing',
  error: 'error',
  success: 'success',
  canceled: 'canceled',
};

export const OcrStatusEnum = Object.values(schema);
