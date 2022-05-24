// import 'whatwg-fetch';
import { server } from './src/mocks/server';

// require('jest-fetch-mock').enableMocks();
require('jest-fetch-mock');

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
