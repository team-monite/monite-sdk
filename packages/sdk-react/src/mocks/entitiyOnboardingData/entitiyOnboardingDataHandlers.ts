import { delay } from '@/mocks/utils';
import {
  ErrorSchemaResponse,
  EntityOnboardingDataResponse,
  EntityOnboardingDataRequest,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { getEntityOnboardingDataFixture } from './entitiyOnboardingDataFixture';

const path = '*/entities/:entityId/onboarding_data';

export const entityOnboardingDataHandlers = [
  rest.get<
    undefined,
    { entityId: string },
    EntityOnboardingDataResponse | ErrorSchemaResponse
  >(path, (_, res, ctx) => {
    return res(
      delay(),
      ctx.status(200),
      ctx.json(getEntityOnboardingDataFixture())
    );
  }),

  rest.patch<
    EntityOnboardingDataRequest,
    { entityId: string },
    EntityOnboardingDataResponse | ErrorSchemaResponse
  >(path, async (req, res, ctx) => {
    const payload = await req.json();

    return res(
      delay(),
      ctx.status(200),
      ctx.json(getEntityOnboardingDataFixture(payload))
    );
  }),
];
