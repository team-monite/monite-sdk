import { rest } from 'msw';

import {
  COUNTERPARTS_CONTACT_ENDPOINT,
  COUNTERPARTS_ENDPOINT,
} from '@team-monite/sdk-api';

import type {
  CounterpartContactResponse,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@team-monite/sdk-api';

import {
  counterpartContactFixture,
  counterpartContactListFixture,
} from './counterpartContactFixture';

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
    CounterpartContactResponse[]
  >(contactAccountPath, (req, res, ctx) => {
    return res(ctx.json(counterpartContactListFixture));
  }),

  // create
  rest.post<
    CreateCounterpartContactPayload,
    CreateCounterpartContactParams,
    CounterpartContactResponse
  >(contactAccountPath, (req, res, ctx) => {
    return res(ctx.json(counterpartContactFixture));
  }),

  // read
  rest.get<
    undefined,
    UpdateCounterpartContactParams,
    CounterpartContactResponse
  >(contactAccountIdPath, (req, res, ctx) => {
    return res(ctx.json(counterpartContactFixture));
  }),

  // update
  rest.patch<
    UpdateCounterpartContactPayload,
    UpdateCounterpartContactParams,
    CounterpartContactResponse
  >(contactAccountIdPath, (req, res, ctx) => {
    return res(ctx.json(counterpartContactFixture));
  }),

  // delete
  rest.delete<undefined, UpdateCounterpartContactParams, boolean>(
    contactAccountIdPath,
    (req, res, ctx) => {
      return res(ctx.json(true));
    }
  ),
];
