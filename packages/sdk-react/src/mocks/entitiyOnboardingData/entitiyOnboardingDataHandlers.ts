import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { getEntityOnboardingDataFixture } from './entitiyOnboardingDataFixture';

const path = '*/entities/:entityId/onboarding_data';

export const entityOnboardingDataHandlers = [
  http.get<
    { entityId: string },
    undefined,
    EntityOnboardingDataResponse | ErrorSchemaResponse
  >(path, async () => {
    await delay();

    return HttpResponse.json(getEntityOnboardingDataFixture());
  }),

  http.patch<
    { entityId: string },
    EntityOnboardingDataRequest,
    EntityOnboardingDataResponse | ErrorSchemaResponse
  >(path, async ({ request }) => {
    const payload = await request.json();

    await delay();

    return HttpResponse.json(getEntityOnboardingDataFixture(payload));
  }),
];

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type EntityOnboardingDataResponse =
  components['schemas']['EntityOnboardingDataResponse'];
type EntityOnboardingDataRequest =
  components['schemas']['EntityOnboardingDataRequest'];
