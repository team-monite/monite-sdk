import { components } from '@monite/sdk-api/src/api';

import { delay, http, HttpResponse } from 'msw';

import { authenticationTokenFixture } from './authenticationFixtures';

const tokenAuthPath = `*/auth/token`;

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

type AccessTokenResponse = components['schemas']['AccessTokenResponse'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type ObtainTokenPayload = components['schemas']['ObtainTokenPayload'];
