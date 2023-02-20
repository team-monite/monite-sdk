/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BusinessStructure } from '../models/BusinessStructure';
import type { BusinessType } from '../models/BusinessType';
import type { Country } from '../models/Country';
import type { DataPayload } from '../models/DataPayload';
import type { IndividualOnboarding } from '../models/IndividualOnboarding';
import type { PaymentMethod } from '../models/PaymentMethod';

import type { CancelablePromise } from '../../api/CancelablePromise';
import { request as __request } from '../../api/request';
import { OpenAPIConfig } from '../../api/OpenAPI';

export const ONBOARDING_ENDPOINT = 'onboarding';

export default class OnboardingService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Create Onboarding Requirements
   * @param linkId
   * @param country
   * @param businessType
   * @param paymentMethods
   * @param businessStructure
   * @returns IndividualOnboarding Successful Response
   * @throws ApiError
   */
  public createRequirements(
    linkId: string,
    country: Country,
    businessType: BusinessType,
    paymentMethods: Array<PaymentMethod>,
    businessStructure?: BusinessStructure
  ): CancelablePromise<IndividualOnboarding> {
    return __request(
      {
        method: 'GET',
        url: '/init',
        query: {
          link_id: linkId,
          country: country,
          business_type: businessType,
          payment_methods: paymentMethods,
          business_structure: businessStructure,
        },
        errors: {
          422: `Validation Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Get Onboarding Requirements
   * @param linkId
   * @returns IndividualOnboarding Successful Response
   * @throws ApiError
   */
  public getRequirements(
    linkId: string
  ): CancelablePromise<IndividualOnboarding> {
    return __request(
      {
        method: 'GET',
        url: '/onboarding',
        query: {
          link_id: linkId,
        },
        errors: {
          422: `Validation Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Update Onboarding Requirements
   * @param linkId
   * @param requestBody
   * @returns IndividualOnboarding Successful Response
   * @throws ApiError
   */
  public updateRequirements(
    linkId: string,
    requestBody: DataPayload
  ): CancelablePromise<IndividualOnboarding> {
    return __request(
      {
        method: 'PATCH',
        url: '/onboarding',
        query: {
          link_id: linkId,
        },
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          422: `Validation Error`,
        },
      },
      this.openapiConfig
    );
  }
}
