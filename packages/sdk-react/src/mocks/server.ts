import { setupServer, SetupServerApi } from 'msw/node';

import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
export const server: SetupServerApi = setupServer(...handlers);
