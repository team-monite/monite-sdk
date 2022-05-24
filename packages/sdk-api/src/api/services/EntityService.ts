import type { CancelablePromise } from '../CancelablePromise';
import { EntityOnboardingDataRequest } from '../models/EntityOnboardingDataRequest';
import { EntityOnboardingDataResponse } from '../models/EntityOnboardingDataResponse';
import { EntityResponse } from '../models/EntityResponse';
import { EntityVatIDResourceList } from '../models/EntityVatIDResourceList';
import { MergedSettingsResponse } from '../models/MergedSettingsResponse';
import { OnboardingLinksStripeData } from '../models/OnboardingLinksStripeData';
import { OnboardingLinksStripeDataResponse } from '../models/OnboardingLinksStripeDataResponse';
import { UpdateEntityRequest } from '../models/UpdateEntityRequest';
import { request as __request, request } from '../request';
import { CommonService } from './CommonService';

export const ENTITIES_ENDPOINT = 'entities';

export class EntityService extends CommonService {
  /**
   * Get Entity User by ID
   * Entity User from the connected entity.
   * @param   entityId A unique ID to specify the entity.
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getById(entityId: string): CancelablePromise<EntityResponse> {
    return request(
      {
        method: 'GET',
        url: `/${ENTITIES_ENDPOINT}/${entityId}`,
      },
      this.openApi
    );
  }

  /**
   * Update an entity by ID
   * @param entityId
   * @param body
   * @returns EntityResponse Successful Response
   * @throws ApiError
   */
  public update(
    entityId: string,
    body: UpdateEntityRequest
  ): CancelablePromise<EntityResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${ENTITIES_ENDPOINT}/${entityId}`,
        body,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }
  /**
   * Retrieve all settings for this entity by `id`.
   *
   * @see {@link https://docs.monite.com/reference/get_entities_id_settings} for API call
   *
   * @param entityId A unique ID to specify the entity.
   *
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getSettingsById(
    entityId: string
  ): CancelablePromise<MergedSettingsResponse> {
    return request(
      {
        method: 'GET',
        url: `/${ENTITIES_ENDPOINT}/${entityId}/settings`,
        errors: {
          400: `Bad Request`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get an entity's VAT IDs
   *
   * @see {@link https://docs.monite.com/reference/get_entities_id_vat_ids} for API call
   *
   * @param entityId A unique ID to specify the entity.
   *
   * @returns EntityVatIDResourceList Successful Response
   * @throws ApiError
   */
  public getTaxIds(
    entityId: string
  ): CancelablePromise<EntityVatIDResourceList> {
    return request(
      {
        method: 'GET',
        url: `/${ENTITIES_ENDPOINT}/${entityId}/vat_ids`,
        errors: {
          400: `Bad Request`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get entity onboarding data by ID
   *
   * @see {@link https://docs.monite.com/reference/get_entities_id_onboarding_data} for API call
   *
   * @param entityId A unique ID to specify the entity.
   *
   * @returns EntityOnboardingDataResponse Successful Response
   * @throws ApiError
   */
  public getOnboardingData(
    entityId: string
  ): CancelablePromise<OnboardingLinksStripeDataResponse> {
    return request(
      {
        method: 'GET',
        url: `/${ENTITIES_ENDPOINT}/{entity_id}/onboarding_data`,
        path: {
          entity_id: entityId,
        },
      },
      this.openApi
    );
  }

  /**
   * Update entity onboarding data by ID
   *
   * @see {@link https://docs.monite.com/reference/put_entities_id_onboarding_data} for API call
   *
   * @param entityId A unique ID to specify the entity.
   * @param onboardingData
   *
   * @returns EntityOnboardingDataResponse Successful Response
   * @throws ApiError
   */
  public putOnboardingData(
    entityId: string,
    onboardingData: OnboardingLinksStripeData
  ): CancelablePromise<OnboardingLinksStripeDataResponse> {
    return request(
      {
        method: 'PUT',
        url: `/${ENTITIES_ENDPOINT}/{entity_id}/onboarding_data`,
        path: {
          entity_id: entityId,
        },
        body: onboardingData,
      },
      this.openApi
    );
  }

  /**
   * Patch entity onboarding data
   * @param entityId
   * @param requestBody
   * @returns EntityOnboardingDataResponse Successful Response
   * @throws ApiError
   */
  public patchOnboardingData(
    entityId: string,
    requestBody: EntityOnboardingDataRequest
  ): CancelablePromise<EntityOnboardingDataResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/entities/${entityId}/onboarding_data`,
        body: requestBody,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }
}
