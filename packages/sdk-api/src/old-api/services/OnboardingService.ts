import type { CancelablePromise } from '../CancelablePromise';
import { AllowedCountries } from '../models/AllowedCountries';
import { CurrencyEnum } from '../models/CurrencyEnum';
import { InternalOnboardingRequirementsResponse } from '../models/InternalOnboardingRequirementsResponse';
import { OnboardingBankAccountMask } from '../models/OnboardingBankAccountMask';
import { OnboardingLinkInternalResponse } from '../models/OnboardingLinkInternalResponse';
import { OnboardingLinksAirwallexComponentCodeRequest } from '../models/OnboardingLinksAirwallexComponentCodeRequest';
import { OnboardingLinksAirwallexComponentCodeResponse } from '../models/OnboardingLinksAirwallexComponentCodeResponse';
import { OnboardingLinksAirwallexComponentData } from '../models/OnboardingLinksAirwallexComponentData';
import { OnboardingLinksAirwallexComponentDataResponse } from '../models/OnboardingLinksAirwallexComponentDataResponse';
import { OnboardingPersonMask } from '../models/OnboardingPersonMask';
import { Relationship } from '../models/Relationship';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

const errors = {
  400: `Bad Request`,
  401: `Unauthorized`,
  403: `Forbidden`,
  404: `Not found`,
  405: `Method Not Allowed`,
  406: `Not Acceptable`,
  409: `Business logic error`,
  416: `Requested Range Not Satisfiable`,
  422: `Validation Error`,
  500: `Internal Server Error`,
};

export const ONBOARDING_ENDPOINT = 'internal/onboarding_links';

export type OnboardingBankAccountMaskResponse = Partial<
  Record<CurrencyEnum, OnboardingBankAccountMask>
>;

export class OnboardingService extends CommonService {
  /**
   * Get Onboarding Link
   * @param link_id
   * @returns OnboardingLink Successful Response
   * @throws ApiError
   */
  public getLinkId(
    link_id: string
  ): CancelablePromise<OnboardingLinkInternalResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ONBOARDING_ENDPOINT}/${link_id}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Onboarding data
   * @returns InternalOnboardingRequirementsResponse Successful Response
   * @throws ApiError
   */
  public getRequirements(): CancelablePromise<InternalOnboardingRequirementsResponse> {
    return __request(
      {
        method: 'GET',
        url: `/frontend/onboarding_requirements`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get person mask based on relationships
   * Get person mask based on relationships
   * @param relationships
   * @param country
   * @returns OnboardingPersonMask Successful Response
   * @throws ApiError
   */
  public getPersonMask(
    relationships: Array<Relationship>,
    country?: AllowedCountries
  ): CancelablePromise<OnboardingPersonMask> {
    return __request(
      {
        method: 'GET',
        url: '/frontend/person_mask',
        query: {
          relationships: relationships,
          country: country,
        },
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get bank account masks for supported currencies
   * Get bank account masks for supported currencies
   * @returns OnboardingBankAccountMask Successful Response
   * @throws ApiError
   */
  public getBankAccountMasks(): CancelablePromise<OnboardingBankAccountMaskResponse> {
    return __request(
      {
        method: 'GET',
        url: '/frontend/bank_account_masks',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get onboarding data for the Airwallex provider
   * This method assumes that the user decided to use Airwallex web components
   *
   * @link {@see https://www.airwallex.com/docs/global-treasury__kyc-and-onboarding__embedded-kyc-component#step-2:-initialize-the-components-web-sdk}
   *
   * @param link_id Onboarding link ID
   *
   * @returns OnboardingLinksDataResponse Successful Response
   * @throws ApiError
   */
  public getAirwallexComponentData(
    link_id: string
  ): CancelablePromise<OnboardingLinksAirwallexComponentDataResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ONBOARDING_ENDPOINT}/${link_id}/airwallex_component`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update onboarding data for the Airwallex provider
   * This method assumes that the user decided to use Airwallex web components
   *
   * @link {@see https://www.airwallex.com/docs/global-treasury__kyc-and-onboarding__embedded-kyc-component#step-2:-initialize-the-components-web-sdk}
   *
   * @param link_id Onboarding link ID
   * @param payload Onboarding request data
   *
   * @returns OnboardingLinksAirwallexComponentDataResponse Successful Response
   * @throws ApiError
   */
  public updateAirwallexComponentData(
    link_id: string,
    payload: OnboardingLinksAirwallexComponentData
  ): CancelablePromise<OnboardingLinksAirwallexComponentDataResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${ONBOARDING_ENDPOINT}/${link_id}/airwallex_component`,
        body: payload,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Generate authorization code for the Airwallex provider
   * This method assumes that the user decided to use Airwallex web components
   *
   * @link {@see https://www.airwallex.com/docs/global-treasury__kyc-and-onboarding__embedded-kyc-component#step-2:-initialize-the-components-web-sdk}
   *
   * @param link_id Onboarding link ID
   * @param payload Onboarding request data
   *
   * @returns OnboardingLinksAirwallexComponentDataResponse Successful Response
   * @throws ApiError
   */
  public generateAuthCodeForAirwallexComponent(
    link_id: string,
    payload: OnboardingLinksAirwallexComponentCodeRequest
  ): CancelablePromise<OnboardingLinksAirwallexComponentCodeResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${ONBOARDING_ENDPOINT}/${link_id}/airwallex_component/auth`,
        body: payload,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get bank account currency to supported countries
   *
   * @returns Record<string, AllowedCountries[]> Successful Response
   * @throws ApiError
   */
  public getBankAccountCurrencyToSupportedCountries(): CancelablePromise<
    Record<string, AllowedCountries[]>
  > {
    return __request(
      {
        method: 'GET',
        url: '/frontend/bank_accounts_currency_to_supported_countries',
        errors,
      },
      this.openApi
    );
  }
}
