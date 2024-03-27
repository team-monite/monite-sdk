import { delay } from '@/mocks/utils';
import {
  EntityResponse,
  ErrorSchemaResponse,
  MergedSettingsResponse,
  UpdateEntityRequest,
  EntityVatIDResourceList,
  OnboardingPaymentMethodsResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import {
  entityPaymentMethods,
  entitySettingsById,
  entityVatIdList,
  getCurrentEntity,
} from './entitiesFixture';

export const entitiesHandlers = [
  rest.get<
    undefined,
    { entityId: string },
    MergedSettingsResponse | ErrorSchemaResponse
  >('*/entities/:entityId/settings', (req, res, ctx) => {
    const { entityId } = req.params;

    const entitySettingsFixture = entitySettingsById[entityId];

    if (!entitySettingsFixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Entity not found',
          },
        })
      );
    }

    return res(delay(), ctx.status(200), ctx.json(entitySettingsFixture));
  }),

  rest.get<
    undefined,
    { entityId: string },
    OnboardingPaymentMethodsResponse | ErrorSchemaResponse
  >('*/entities/:entityId/payment_methods', (req, res, ctx) => {
    return res(delay(), ctx.status(200), ctx.json(entityPaymentMethods));
  }),

  rest.get<
    undefined,
    { entityId: string },
    EntityVatIDResourceList | ErrorSchemaResponse
  >('*/entities/:entityId/vat_ids', (req, res, ctx) => {
    const { entityId } = req.params;

    const entityVatIdListFixture = entityVatIdList[entityId];

    if (!entityVatIdListFixture) {
      return res(
        delay(),
        ctx.status(404),
        ctx.json({
          error: {
            message: 'Entity not found',
          },
        })
      );
    }

    return res(delay(2_000), ctx.status(200), ctx.json(entityVatIdListFixture));
  }),

  rest.get<undefined, {}, EntityResponse | ErrorSchemaResponse>(
    '*/entity_users/my_entity',
    (req, res, ctx) => {
      const entityFixture = getCurrentEntity();

      if (!entityFixture) {
        return res(
          delay(),
          ctx.status(404),
          ctx.json({
            error: {
              message: 'Entity not found',
            },
          })
        );
      }

      return res(delay(2_000), ctx.status(200), ctx.json(entityFixture));
    }
  ),

  rest.patch<
    UpdateEntityRequest,
    { entityId: string },
    EntityResponse | ErrorSchemaResponse
  >('*/entities/:entityId', async (req, res, ctx) => {
    const { entityId } = req.params;

    const data = await req.json<UpdateEntityRequest>();

    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        ...data,
        id: entityId,
      } as EntityResponse)
    );
  }),
];
