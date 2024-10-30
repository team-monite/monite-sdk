import { components } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';

import { getOnboardingDocumentDescriptionByCountry } from './onboardingDocumentsFixtures';

export const onboardingDocumentsHandlers = [
  http.post<{}, EntityOnboardingDocumentsPayload>(
    '*/onboarding_documents',
    async () => {
      await delay();

      return new HttpResponse(undefined, {
        status: 204,
      });
    }
  ),

  http.post<{}, PersonOnboardingDocumentsPayload>(
    '*/persons/:person_id/onboarding_documents',
    async () => {
      await delay();

      return new HttpResponse(undefined, {
        status: 204,
      });
    }
  ),

  http.get<{ country: AllowedCountries }, {}>(
    '*/frontend/document_type_descriptions',
    async ({ request }) => {
      const url = new URL(request.url);
      const country = url.searchParams.get('country');

      if (!country) {
        await delay();

        return new HttpResponse(undefined, {
          status: 400,
        });
      }

      await delay();

      return HttpResponse.json(
        getOnboardingDocumentDescriptionByCountry(country as AllowedCountries),
        {
          status: 200,
        }
      );
    }
  ),
];

type EntityOnboardingDocumentsPayload =
  components['schemas']['EntityOnboardingDocumentsPayload'];
type PersonOnboardingDocumentsPayload =
  components['schemas']['PersonOnboardingDocumentsPayload'];
type AllowedCountries = components['schemas']['AllowedCountries'];
