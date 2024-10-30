import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['PayableOriginEnum']]: key;
} = {
  upload: 'upload',
  email: 'email',
};

export const PayableOriginEnum = Object.values(schema);
