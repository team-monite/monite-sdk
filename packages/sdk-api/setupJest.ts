// import 'whatwg-fetch';
// require('jest-fetch-mock').enableMocks();
import 'jest-fetch-mock';

import { server } from './src/mocks/server';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
