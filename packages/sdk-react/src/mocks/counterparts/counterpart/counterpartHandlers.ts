import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
} from '@/mocks/entityUsers';
import { faker } from '@faker-js/faker';
import type {
  CounterpartCreatePayload,
  CounterpartIndividualRootResponse,
  CounterpartOrganizationRootResponse,
  CounterpartResponse,
  CounterpartUpdatePayload,
} from '@monite/sdk-api';
import {
  CounterpartIndividualRootCreatePayload,
  CounterpartOrganizationRootCreatePayload,
  CounterpartPaginationResponse,
  COUNTERPARTS_ENDPOINT,
  ErrorSchemaResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { delay, getMockPagination } from '../../utils';
import {
  counterpartIndividualFixture,
  counterpartListFixture,
  counterpartOrganizationFixture,
  counterpartDetailsFixtures,
} from './counterpartFixture';
import { CounterpartMockBuilder, GetRequest } from './counterpartMock.builder';

type CounterpartDetailParams = { counterpartId: string };

const counterpartPath = `*/${COUNTERPARTS_ENDPOINT}`;
const counterpartDetailPath = `${counterpartPath}/:counterpartId`;

export const counterpartHandlers = [
  // read list
  rest.get<
    CounterpartResponse,
    {},
    CounterpartPaginationResponse | ErrorSchemaResponse
  >(counterpartPath, ({ url, headers }, res, ctx) => {
    const entityId = headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      return res(
        ctx.status(409),
        ctx.json({
          error: {
            message: 'Action read for payable not allowed',
          },
        })
      );
    }

    const page = Number.parseInt(
      (url.searchParams.get(
        'pagination_token'
      ) as GetRequest['pagination_token']) || '0'
    );
    const sort =
      (url.searchParams.get('sort') as GetRequest['sort']) || undefined;
    const type =
      (url.searchParams.get('type') as GetRequest['type']) || undefined;

    const subTypes = (() => {
      const isCustomer = url.searchParams.get('is_customer') === 'true';
      const isVendor = url.searchParams.get('is_vendor') === 'true';

      if (!isCustomer && !isVendor) {
        return {
          isCustomer: true,
          isVendor: true,
        };
      }

      return {
        isCustomer,
        isVendor,
      };
    })();

    const search =
      (url.searchParams.get(
        'counterpart_name__icontains'
      ) as GetRequest['counterpart_name__icontains']) || undefined;
    const order =
      (url.searchParams.get('order') as GetRequest['order']) || undefined;
    const paginationToken = url.searchParams.get('pagination_token') || '0';
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const { prevPage, nextPage } = getMockPagination(
      paginationToken,
      limit - 1
    );

    return res(
      delay(1_000),
      ctx.json({
        data: new CounterpartMockBuilder()
          .withPage(page)
          .withLimit(limit)
          .withOrder(order)
          .withSearch(search)
          .withType(type)
          .withSubType(subTypes.isVendor, subTypes.isCustomer)
          .withFilter()
          .withSort(sort)
          .build(),
        prev_pagination_token: prevPage,
        next_pagination_token: nextPage,
      })
    );
  }),

  /**
   * Create new counterpart
   * We could create new `organization` or `individual` counterpart
   */
  rest.post<
    CounterpartCreatePayload,
    CounterpartDetailParams,
    CounterpartResponse
  >(counterpartPath, async (req, res, ctx) => {
    const json = await req.json<CounterpartCreatePayload>();

    switch (json.type) {
      case CounterpartIndividualRootCreatePayload.type.INDIVIDUAL: {
        const individualResponse: CounterpartIndividualRootResponse = {
          ...counterpartIndividualFixture,
          individual: json.individual,
        };

        return res(ctx.json(individualResponse));
      }
      case CounterpartOrganizationRootCreatePayload.type.ORGANIZATION: {
        const organizationResponse: CounterpartOrganizationRootResponse = {
          ...counterpartOrganizationFixture,
          organization: json.organization,
        };

        return res(delay(), ctx.json(organizationResponse));
      }
    }
  }),

  // read
  rest.get<undefined, CounterpartDetailParams, CounterpartResponse>(
    counterpartDetailPath,
    (req, res, ctx) => {
      if (req.params.counterpartId) {
        const response = counterpartListFixture.find(
          (counterpart) => counterpart.id === req.params.counterpartId
        );

        if (response) {
          return res(
            delay(
              faker.number.int({
                min: 500,
                max: 2_000,
              })
            ),
            ctx.json(response)
          );
        } else {
          return res(delay(), ctx.status(404));
        }
      }

      return res(delay(), ctx.status(404));
    }
  ),

  // update
  rest.patch<
    CounterpartUpdatePayload,
    CounterpartDetailParams,
    CounterpartResponse
  >(counterpartDetailPath, (req, res, ctx) => {
    if (req.params.counterpartId) {
      const response = counterpartDetailsFixtures[req.params.counterpartId];

      if (response) {
        return res(ctx.json(response));
      } else {
        return res(ctx.status(404));
      }
    }

    return res(delay(), ctx.status(404));
  }),

  // delete
  rest.delete<undefined, CounterpartDetailParams, boolean>(
    counterpartDetailPath,
    (req, res, ctx) => {
      return res(delay(), ctx.json(true));
    }
  ),
];
