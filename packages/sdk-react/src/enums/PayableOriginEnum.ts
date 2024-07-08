import { components } from '@/api';

const schema: {
  [key in components['schemas']['PayableOriginEnum']]: key;
} = {
  upload: 'upload',
  email: 'email',
};

export const PayableOriginEnum = Object.values(schema);
