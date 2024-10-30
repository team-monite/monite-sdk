import { components } from '@monite/sdk-api/src/api';

const schema: {
  [key in components['schemas']['LogMethodEnum']]: key;
} = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const LogMethodEnum = Object.values(schema);
