import { http, HttpResponse } from 'msw';

import {
  AccessTokenResponse,
  ErrorSchemaResponse,
  ObtainTokenPayload,
} from '../../api';
import { AUTH_TOKEN_ENDPOINT } from '../../api/services';
import { authenticationTokenFixture } from './authenticationFixtures';

const tokenAuthPath = `*/${AUTH_TOKEN_ENDPOINT}`;

export const authenticationHandlers = [
  http.post<{}, ObtainTokenPayload, AccessTokenResponse | ErrorSchemaResponse>(
    tokenAuthPath,
    async ({ request }) => {
      const payload = await request.json();

      if (!payload.client_id || !payload.client_secret || !payload.grant_type) {
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

      if (payload.entity_user_id === 'token_expired') {
        return HttpResponse.json(
          {
            error: {
              message: 'The token has been revoked, expired or not found.',
            },
          },
          {
            status: 400,
          }
        );
      }

      if (payload.entity_user_id === 'random_error') {
        return HttpResponse.json(
          {
            error: {
              message: 'Some random error',
            },
          },
          {
            status: 400,
          }
        );
      }

      return HttpResponse.json(authenticationTokenFixture);
    }
  ),
];
