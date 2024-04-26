import { generateValuesByFields } from '@/components/onboarding/transformers';
import {
  mapPersonToOnboarding,
  personsList as personsListFixture,
} from '@/mocks/onboarding';
import {
  ErrorSchemaResponse,
  OptionalPersonRequest,
  PERSONS_ENDPOINT,
  PersonResponse,
  PersonsResponse,
  PersonRequest,
  ApiError,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import { delay } from '../utils';
import { personFixture } from './personsFixtures';

const personsPath = `*${PERSONS_ENDPOINT}`;

let onboardingPersonsList = personsListFixture;

export const personsHandlers = [
  http.get<{}, undefined, PersonsResponse | ApiError>(personsPath, async () => {
    await delay();

    return HttpResponse.json(
      {
        data: onboardingPersonsList.map((person) =>
          generateValuesByFields<PersonResponse>(person)
        ),
      },
      {
        status: 200,
      }
    );
  }),

  http.post<{}, PersonRequest, PersonResponse | ApiError>(
    personsPath,
    async ({ request }) => {
      const person = await request.json();

      const newPerson = mapPersonToOnboarding(person);
      onboardingPersonsList = [...onboardingPersonsList, newPerson];

      await delay();

      return HttpResponse.json(
        personFixture({ ...person, id: newPerson.id } as PersonRequest)
      );
    }
  ),

  http.patch<
    { personId: string },
    OptionalPersonRequest,
    PersonResponse | ErrorSchemaResponse
  >(`${personsPath}/:personId`, async ({ request, params }) => {
    const { personId } = params;
    const payload = await request.json();

    const person = onboardingPersonsList.find(
      (person) => person.id === personId
    );

    if (person) {
      await delay();

      return HttpResponse.json(payload as PersonResponse);
    }

    await delay();

    return HttpResponse.json(
      {
        error: { message: 'Person not found' },
      },
      {
        status: 404,
      }
    );
  }),
];
