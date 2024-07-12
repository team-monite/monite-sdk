import { components } from '@/api';
import { isIndividualCounterpart } from '@/components/counterparts/helpers';
import { counterpartListFixture } from '@/mocks';
import {
  COUNTERPARTS_CONTACT_ENDPOINT,
  COUNTERPARTS_ENDPOINT,
  ErrorSchemaResponse,
} from '@monite/sdk-api';

import { http, HttpResponse, delay } from 'msw';

import { counterpartsContactsFixtures } from './counterpartContactFixture';

type CreateCounterpartContactParams = { counterpartId: string };
type UpdateCounterpartContactParams = CreateCounterpartContactParams & {
  contactAccountId: string;
};

const contactAccountPath = `*/${COUNTERPARTS_ENDPOINT}/:counterpartId/${COUNTERPARTS_CONTACT_ENDPOINT}`;
const contactAccountIdPath = `${contactAccountPath}/:contactAccountId`;

export const counterpartContactHandlers = [
  // read list
  http.get<
    CreateCounterpartContactParams,
    undefined,
    | components['schemas']['CounterpartContactsResourceList']
    | ErrorSchemaResponse
  >(contactAccountPath, async ({ params }) => {
    const { counterpartId } = params;

    const counterpartFixture = counterpartListFixture.find(
      (c) => c.id === counterpartId
    );

    if (!counterpartFixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Counterpart not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    if (isIndividualCounterpart(counterpartFixture)) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Individual counterparts do not have contacts',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json({
      data: counterpartsContactsFixtures[counterpartId],
    });
  }),

  // create
  http.post<
    CreateCounterpartContactParams,
    components['schemas']['CreateCounterpartContactPayload'],
    components['schemas']['CounterpartContactResponse']
  >(contactAccountPath, async ({ request, params }) => {
    const json = await request.json();
    const { counterpartId } = params;

    const response: components['schemas']['CounterpartContactResponse'] = {
      id: (Math.random() + 1).toString(36).substring(7),
      counterpart_id: counterpartId,
      is_default: false,
      ...json,
    };

    await delay();

    return HttpResponse.json(response);
  }),

  // read
  http.get<
    UpdateCounterpartContactParams,
    undefined,
    components['schemas']['CounterpartContactResponse'] | ErrorSchemaResponse
  >(contactAccountIdPath, async ({ params }) => {
    const { contactAccountId, counterpartId } = params;

    const fixtures = counterpartsContactsFixtures[counterpartId];
    const contact = fixtures.find((c) => c.id === contactAccountId);

    if (!contact) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    return HttpResponse.json(contact);
  }),

  // update
  http.patch<
    UpdateCounterpartContactParams,
    components['schemas']['UpdateCounterpartContactPayload'],
    components['schemas']['CounterpartContactResponse']
  >(contactAccountIdPath, async ({ params }) => {
    const { counterpartId } = params;

    const fixtures = counterpartsContactsFixtures[counterpartId];

    await delay();

    return HttpResponse.json(fixtures[0]);
  }),

  // delete
  http.delete<UpdateCounterpartContactParams, undefined, undefined>(
    contactAccountIdPath,
    async () => {
      await delay();

      return new HttpResponse();
    }
  ),
];
