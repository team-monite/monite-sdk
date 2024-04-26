import { delay } from '@/mocks/utils';
import {
  AccessTokenResponse,
  AUTH_TOKEN_ENDPOINT,
  ErrorSchemaResponse,
  ObtainTokenPayload,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import { authenticationTokenFixture } from './authenticationFixtures';

const tokenAuthPath = `*/${AUTH_TOKEN_ENDPOINT}`;

export const authenticationHandlers = [
  http.post<{}, ObtainTokenPayload, AccessTokenResponse | ErrorSchemaResponse>(
    tokenAuthPath,
    async ({ request }) => {
      const payload = await request.json();

      if (!payload.client_id || !payload.client_secret || !payload.grant_type) {
        await delay();
        return HttpResponse.json(
          {
            error: {
              message: 'Invalid request',
            },
          },
          {
            status: 400,
          }
        );
      }

      await delay();
      return HttpResponse.json(authenticationTokenFixture);
    }
  ),
];
