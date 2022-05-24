import { rest } from 'msw';

import {
  AccessTokenResponse,
  ErrorSchemaResponse,
  ObtainTokenPayload,
} from '../../api';
import { AUTH_TOKEN_ENDPOINT } from '../../api/services';
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

      if (payload.entity_user_id === 'token_expired') {
        return res(
          ctx.status(400),
          ctx.json({
            error: {
              message: 'The token has been revoked, expired or not found.',
            },
          })
        );
      }

      if (payload.entity_user_id === 'random_error') {
        return res(
          ctx.status(400),
          ctx.json({
            error: {
              message: 'Some random error',
            },
          })
        );
      }

      return res(ctx.json(authenticationTokenFixture));
    }
  ),
];
