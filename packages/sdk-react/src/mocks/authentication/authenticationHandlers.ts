import { delay } from '@/mocks/utils';
import {
  AccessTokenResponse,
  AUTH_TOKEN_ENDPOINT,
  ErrorSchemaResponse,
  ObtainTokenPayload,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { authenticationTokenFixture } from './authenticationFixtures';

const tokenAuthPath = `*/${AUTH_TOKEN_ENDPOINT}`;

export const authenticationHandlers = [
  rest.post<ObtainTokenPayload, {}, AccessTokenResponse | ErrorSchemaResponse>(
    tokenAuthPath,
    async (req, res, ctx) => {
      const payload = await req.json<ObtainTokenPayload>();

      if (!payload.client_id || !payload.client_secret || !payload.grant_type) {
        return res(
          ctx.status(400),
          ctx.json({
            error: {
              message: 'Invalid request',
            },
          })
        );
      }

      return res(delay(), ctx.json(authenticationTokenFixture));
    }
  ),
];
