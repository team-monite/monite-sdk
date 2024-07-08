import { components } from '@/api';
import { QConterpartResponse } from '@/core/queries';
import {
  ENTITY_ID_FOR_ABSENT_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
} from '@/mocks/entityUsers';
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

import { http, HttpResponse, delay } from 'msw';

import { getMockPagination } from '../../utils';
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
  http.get<
    {},
    QConterpartResponse,
    components['schemas']['CounterpartPaginationResponse'] | ErrorSchemaResponse
  >(counterpartPath, async ({ request }) => {
    const entityId = request.headers.get('x-monite-entity-id');

    if (
      entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS ||
      entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS
    ) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Action read for payable not allowed',
          },
        },
        {
          status: 409,
        }
      );
    }

    const url = new URL(request.url);
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

    await delay();

    return HttpResponse.json({
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
    });
  }),

  /**
   * Create new counterpart
   * We could create new `organization` or `individual` counterpart
   */
  http.post<
    CounterpartDetailParams,
    CounterpartCreatePayload,
    QConterpartResponse
  >(counterpartPath, async ({ request }) => {
    const json = await request.json();

    switch (json.type) {
      case CounterpartIndividualRootCreatePayload.type.INDIVIDUAL: {
        const individualResponse: components['schemas']['CounterpartIndividualRootResponse'] =
          {
            ...counterpartIndividualFixture,
            individual: json.individual,
          };

        return HttpResponse.json(individualResponse);
      }
      case CounterpartOrganizationRootCreatePayload.type.ORGANIZATION: {
        const organizationResponse: components['schemas']['CounterpartOrganizationRootResponse'] =
          {
            ...counterpartOrganizationFixture,
            organization: json.organization,
          };

        await delay();

        return HttpResponse.json(organizationResponse);
      }
    }
  }),

  // read
  http.get<CounterpartDetailParams>(
    counterpartDetailPath,
    async ({ params }) => {
      if (params.counterpartId) {
        const response = counterpartListFixture.find(
          (counterpart) => counterpart.id === params.counterpartId
        );

        if (response) {
          await delay();

          return HttpResponse.json(response, {
            status: 200,
          });
        } else {
          await delay();

          return new HttpResponse(null, {
            status: 404,
          });
        }
      }

      await delay();

      return new HttpResponse(null, {
        status: 404,
      });
    }
  ),

  // update
  http.patch<CounterpartDetailParams, CounterpartUpdatePayload>(
    counterpartDetailPath,
    async ({ params }) => {
      if (params.counterpartId) {
        const response = counterpartDetailsFixtures[params.counterpartId];

        if (response) {
          return HttpResponse.json(response);
        } else {
          return new HttpResponse(null, {
            status: 404,
          });
        }
      }

      return new HttpResponse(null, {
        status: 404,
      });
    }
  ),

  // delete
  http.delete<CounterpartDetailParams, undefined>(
    counterpartDetailPath,
    async () => {
      await delay();

      return new HttpResponse(null, {
        status: 204,
      });
    }
  ),
];
