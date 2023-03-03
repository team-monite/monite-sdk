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
    ({ url }, res, { delay, json }) => {
      const linkId = JSON.parse(url.searchParams.get('link_id') || '');

      if (
        linkId &&
        OnboardingBusinessTypeFixture[
          linkId.type as OnboardingBusinessTypeFixture
        ]
      )
        return res(delay(), json(onboardingIndividualFixture(linkId)));
    }
  ),
  rest.patch<
    OnboardingDataPayload,
    OnboardingParams,
    OnboardingIndividualResponse
  >(path, ({ url, body }, res, { delay, json }) => {
    const linkId = JSON.parse(url.searchParams.get('link_id') || '');

    if (
      linkId &&
      OnboardingBusinessTypeFixture[
        linkId.type as OnboardingBusinessTypeFixture
      ]
    )
      return res(delay(), json(onboardingIndividualFixture(linkId, body)));
  }),
];
