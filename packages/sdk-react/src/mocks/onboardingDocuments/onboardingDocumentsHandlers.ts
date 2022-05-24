import { delay } from '@/mocks/utils';
import {
  AllowedCountries,
  ApiError,
  type EntityOnboardingDocumentsPayload,
  type OnboardingDocumentsDescriptions,
  type PersonOnboardingDocumentsPayload,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { getOnboardingDocumentDescriptionByCountry } from './onboardingDocumentsFixtures';

export const onboardingDocumentsHandlers = [
  rest.post<EntityOnboardingDocumentsPayload, {}, undefined | ApiError>(
    '*/onboarding_documents',
    (_, res, ctx) => res(delay(), ctx.status(204))
  ),

  rest.post<PersonOnboardingDocumentsPayload, {}, undefined | ApiError>(
    '*/persons/:person_id/onboarding_documents',
    (_, res, ctx) => res(delay(), ctx.status(204))
  ),

  rest.get<
    { country: AllowedCountries },
    {},
    OnboardingDocumentsDescriptions | ApiError
  >('*/frontend/document_type_descriptions', ({ url }, res, ctx) => {
    const country = url.searchParams.get('country');

    if (!country) {
      return res(delay(), ctx.status(400));
    }

    return res(
      delay(),
      ctx.status(200),
      ctx.json(
        getOnboardingDocumentDescriptionByCountry(country as AllowedCountries)
      )
    );
  }),
];
