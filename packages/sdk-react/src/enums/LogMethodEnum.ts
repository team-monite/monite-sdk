const schema: {
  [key in 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE']: key;
} = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const LogMethodEnum = Object.values(schema);
