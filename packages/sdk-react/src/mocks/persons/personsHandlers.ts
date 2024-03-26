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

import { rest } from 'msw';

import { delay } from '../utils';
import { personFixture } from './personsFixtures';

const personsPath = `*${PERSONS_ENDPOINT}`;

let onboardingPersonsList = personsListFixture;

export const personsHandlers = [
  rest.get<undefined, {}, PersonsResponse | ApiError>(
    personsPath,
    (_, res, ctx) => {
      return res(
        delay(),
        ctx.status(200),
        ctx.json({
          data: onboardingPersonsList.map((person) =>
            generateValuesByFields<PersonResponse>(person)
          ),
        })
      );
    }
  ),

  rest.post<PersonRequest, {}, PersonResponse | ApiError>(
    personsPath,
    async (req, res, ctx) => {
      const person = await req.json<PersonRequest>();

      const newPerson = mapPersonToOnboarding(person);
      onboardingPersonsList = [...onboardingPersonsList, newPerson];

      return res(
        delay(),
        ctx.status(200),
        ctx.json(
          personFixture({ ...person, id: newPerson.id } as PersonRequest)
        )
      );
    }
  ),

  rest.patch<
    OptionalPersonRequest,
    { personId: string },
    PersonResponse | ErrorSchemaResponse
  >(`${personsPath}/:personId`, async (req, res, ctx) => {
    const { personId } = req.params;
    const payload = await req.json<OptionalPersonRequest>();

    const person = onboardingPersonsList.find(
      (person) => person.id === personId
    );

    if (person) {
      return res(delay(), ctx.status(200), ctx.json(payload as PersonResponse));
    }

    return res(
      ctx.status(404),
      ctx.json({ error: { message: 'Person not found' } })
    );
  }),
];
