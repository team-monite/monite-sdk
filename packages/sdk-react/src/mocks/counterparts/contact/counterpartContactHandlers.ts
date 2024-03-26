import { isIndividualCounterpart } from '@/components/counterparts/helpers';
import { counterpartListFixture } from '@/mocks';
import { delay } from '@/mocks/utils';
import {
  CounterpartContactsResourceList,
  COUNTERPARTS_CONTACT_ENDPOINT,
  COUNTERPARTS_ENDPOINT,
  ErrorSchemaResponse,
} from '@monite/sdk-api';
import type {
  CounterpartContactResponse,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { counterpartsContactsFixtures } from './counterpartContactFixture';

type CreateCounterpartContactParams = { counterpartId: string };
type UpdateCounterpartContactParams = CreateCounterpartContactParams & {
  contactAccountId: string;
};

const contactAccountPath = `*/${COUNTERPARTS_ENDPOINT}/:counterpartId/${COUNTERPARTS_CONTACT_ENDPOINT}`;
const contactAccountIdPath = `${contactAccountPath}/:contactAccountId`;

export const counterpartContactHandlers = [
  // read list
  rest.get<
    undefined,
    CreateCounterpartContactParams,
    CounterpartContactsResourceList | ErrorSchemaResponse
  >(contactAccountPath, (req, res, ctx) => {
    const { counterpartId } = req.params;

    const counterpartFixture = counterpartListFixture.find(
      (c) => c.id === counterpartId
    );

    if (!counterpartFixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Counterpart not found',
          },
        })
      );
    }

    if (isIndividualCounterpart(counterpartFixture)) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Individual counterparts do not have contacts',
          },
        })
      );
    }

    return res(
      delay(2_000),
      ctx.json({ data: counterpartsContactsFixtures[counterpartId] })
    );
  }),

  // create
  rest.post<
    CreateCounterpartContactPayload,
    CreateCounterpartContactParams,
    CounterpartContactResponse
  >(contactAccountPath, async (req, res, ctx) => {
    const json = await req.json<CreateCounterpartContactPayload>();
    const { counterpartId } = req.params;

    const response: CounterpartContactResponse = {
      id: (Math.random() + 1).toString(36).substring(7),
      counterpart_id: counterpartId,
      is_default: false,
      ...json,
    };

    return res(delay(), ctx.json(response));
  }),

  // read
  rest.get<
    undefined,
    UpdateCounterpartContactParams,
    CounterpartContactResponse | ErrorSchemaResponse
  >(contactAccountIdPath, (req, res, ctx) => {
    const { contactAccountId, counterpartId } = req.params;

    const fixtures = counterpartsContactsFixtures[counterpartId];
    const contact = fixtures.find((c) => c.id === contactAccountId);

    if (!contact) {
      return res(
        ctx.status(404),
        delay(),
        ctx.json({
          error: {
            message: 'Not found',
          },
        })
      );
    }

    return res(ctx.json(contact));
  }),

  // update
  rest.patch<
    UpdateCounterpartContactPayload,
    UpdateCounterpartContactParams,
    CounterpartContactResponse
  >(contactAccountIdPath, (req, res, ctx) => {
    const { counterpartId } = req.params;

    const fixtures = counterpartsContactsFixtures[counterpartId];

    return res(delay(), ctx.json(fixtures[0]));
  }),

  // delete
  rest.delete<undefined, UpdateCounterpartContactParams, boolean>(
    contactAccountIdPath,
    (req, res, ctx) => {
      return res(delay(), ctx.json(true));
    }
  ),
];
