import { components } from '@/api';

const schema: {
  [key in components['schemas']['TokenSerializerTypeEnum']]: key;
} = {
  forgot_password: 'forgot_password',
  invitation: 'invitation',
};

export const TokenSerializerTypeEnum = Object.values(schema);
