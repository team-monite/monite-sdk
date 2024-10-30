import { generateValuesByFields } from '@/components/onboarding/transformers';
import {
  mapPersonToOnboarding,
  personsList as personsListFixture,
} from '@/mocks/onboarding';
import { components, paths } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';

import { personFixture } from './personsFixtures';

const personsPath: `*${Extract<keyof paths, '/persons'>}` = `*/persons`;

let onboardingPersonsList = personsListFixture;

export const personsHandlers = [
  http.get<{}, undefined, PersonsResponse>(personsPath, async () => {
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

  http.post<{}, PersonRequest, PersonResponse>(
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

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type PersonResponse = components['schemas']['PersonResponse'];
type PersonsResponse = components['schemas']['PersonsResponse'];
type PersonRequest = components['schemas']['PersonRequest'];
