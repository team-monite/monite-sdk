import { rest } from 'msw';

import {
  ONBOARDING_ENDPOINT,
  OnboardingIndividualResponse,
  OnboardingDataPayload,
} from '@team-monite/sdk-api';

import {
  OnboardingBusinessTypeFixture,
  onboardingIndividualFixture,
} from './onboardingFixture';

const path = `*/${ONBOARDING_ENDPOINT}`;

type OnboardingParams = { link_id: string };

export const onboardingHandlers = [
  rest.get<undefined, OnboardingParams, OnboardingIndividualResponse>(
    path,
    ({ url }, res, ctx) => {
      const linkId = JSON.parse(url.searchParams.get('link_id') || '');

      if (
        linkId &&
        OnboardingBusinessTypeFixture[
          linkId.type as OnboardingBusinessTypeFixture
        ]
      )
        return res(ctx.json(onboardingIndividualFixture(linkId)));
    }
  ),
  rest.patch<
    OnboardingDataPayload,
    OnboardingParams,
    OnboardingIndividualResponse
  >(path, async ({ url, body }, res, ctx) => {
    const linkId = url.searchParams.get(
      'link_id'
    ) as OnboardingBusinessTypeFixture;

    localStorage.setItem('onboarding', JSON.stringify(body));

    return res(ctx.json(onboardingIndividualFixture(linkId, body)));
  }),
];
