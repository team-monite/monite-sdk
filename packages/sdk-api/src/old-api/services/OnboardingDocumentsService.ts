import type { CancelablePromise } from '../CancelablePromise';
import { AllowedCountries } from '../models/AllowedCountries';
import type { EntityOnboardingDocumentsPayload } from '../models/EntityOnboardingDocumentsPayload';
import type { OnboardingDocumentsDescriptions } from '../models/OnboardingDocumentsDescriptions';
import type { PersonOnboardingDocumentsPayload } from '../models/PersonOnboardingDocumentsPayload';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export class OnboardingDocumentsService extends CommonService {
  /**
   * Provide files for entity onboarding verification
   * Provide files for entity onboarding verification
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public createEntityDocuments(
    requestBody: EntityOnboardingDocumentsPayload
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'POST',
        url: '/onboarding_documents',
        body: requestBody,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }

  /**
   * Provide files for person onboarding verification
   * Provide files for person onboarding verification
   * @param personId
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public createPersonDocumentsById(
    personId: string,
    requestBody: PersonOnboardingDocumentsPayload
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'POST',
        url: '/persons/{person_id}/onboarding_documents',
        path: {
          person_id: personId,
        },
        body: requestBody,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }

  /**
   * Get descriptions of allowed verification documents by country
   * @param country
   * @returns OnboardingDocumentsDescriptions Successful Response
   * @throws ApiError
   */
  public getDocumentDescriptions(
    country: AllowedCountries
  ): CancelablePromise<OnboardingDocumentsDescriptions> {
    return __request(
      {
        method: 'GET',
        url: '/frontend/document_type_descriptions',
        query: {
          country,
        },
        errors: {
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
        },
      },
      this.openApi
    );
  }
}
