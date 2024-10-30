import { components } from '@monite/sdk-api/src/api';

import { http, HttpResponse, delay } from 'msw';

import {
  entityPaymentMethods,
  entitySettingsById,
  entityVatIdList,
  getCurrentEntity,
} from './entitiesFixture';

export const entitiesHandlers = [
  http.get<
    { entityId: string },
    undefined,
    MergedSettingsResponse | ErrorSchemaResponse
  >('*/entities/:entityId/settings', async ({ params }) => {
    const { entityId } = params;

    const entitySettingsFixture = entitySettingsById[entityId];

    if (!entitySettingsFixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Entity not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json(entitySettingsFixture, {
      status: 200,
    });
  }),

  http.get<
    { entityId: string },
    undefined,
    OnboardingPaymentMethodsResponse | ErrorSchemaResponse
  >('*/entities/:entityId/payment_methods', async () => {
    await delay();

    return HttpResponse.json(entityPaymentMethods, {
      status: 200,
    });
  }),

  http.get<
    { entityId: string },
    undefined,
    EntityVatIDResourceList | ErrorSchemaResponse
  >('*/entities/:entityId/vat_ids', async ({ params }) => {
    const { entityId } = params;

    const entityVatIdListFixture = entityVatIdList[entityId];

    if (!entityVatIdListFixture) {
      await delay();

      return HttpResponse.json(
        {
          error: {
            message: 'Entity not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    await delay();

    return HttpResponse.json(entityVatIdListFixture, {
      status: 200,
    });
  }),

  http.get<{}, undefined, EntityResponse | ErrorSchemaResponse>(
    '*/entity_users/my_entity',
    async () => {
      const entityFixture = getCurrentEntity();

      if (!entityFixture) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: 'Entity not found',
            },
          },
          {
            status: 404,
          }
        );
      }

      await delay();

      return HttpResponse.json(entityFixture, {
        status: 200,
      });
    }
  ),

  http.patch<
    { entityId: string },
    UpdateEntityRequest,
    EntityResponse | ErrorSchemaResponse
  >('*/entities/:entityId', async ({ params, request }) => {
    const { entityId } = params;

    const data = await request.json();

    await delay();

    return HttpResponse.json(
      {
        ...data,
        id: entityId,
      } as EntityResponse,
      {
        status: 200,
      }
    );
  }),
];

type EntityResponse = components['schemas']['EntityResponse'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type MergedSettingsResponse = components['schemas']['SettingsResponse'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
type EntityVatIDResourceList = components['schemas']['EntityVatIDResourceList'];
type OnboardingPaymentMethodsResponse =
  components['schemas']['OnboardingPaymentMethodsResponse'];
