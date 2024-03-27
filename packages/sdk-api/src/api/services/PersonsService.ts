import { CancelablePromise } from '../CancelablePromise';
import type { OptionalPersonRequest } from '../models/OptionalPersonRequest';
import type { PersonRequest } from '../models/PersonRequest';
import type { PersonResponse } from '../models/PersonResponse';
import type { PersonsResponse } from '../models/PersonsResponse';
import { request } from '../request';
import { CommonService } from './CommonService';

export const PERSONS_ENDPOINT = 'persons';

export class PersonsService extends CommonService {
  /**
   * Get all persons
   *
   * @see {@link https://docs.monite.com/reference/get_persons} for API call
   *
   * @returns PersonsResponse Successful Response
   * @throws ApiError
   */
  public getAll(): CancelablePromise<PersonsResponse> {
    return request(
      {
        method: 'GET',
        url: `/${PERSONS_ENDPOINT}`,
      },
      this.openApi
    );
  }

  /**
   * Create a person
   *
   * @see {@link https://docs.monite.com/reference/post_persons} for API call
   *
   * @param requestBody
   * @returns PersonResponse Successful Response
   * @throws ApiError
   */
  public create(requestBody: PersonRequest): CancelablePromise<PersonResponse> {
    return request(
      {
        method: 'POST',
        url: `/${PERSONS_ENDPOINT}`,
        body: requestBody,
      },
      this.openApi
    );
  }

  /**
   * Get a person
   *
   * @see {@link https://docs.monite.com/reference/get_persons_id} for API call
   *
   * @param personId
   * @returns PersonResponse Successful Response
   * @throws ApiError
   */
  public getById(personId: string): CancelablePromise<PersonResponse> {
    return request(
      {
        method: 'GET',
        url: `/${PERSONS_ENDPOINT}/{person_id}`,
        path: {
          person_id: personId,
        },
      },
      this.openApi
    );
  }

  /**
   * Update a person
   *
   * @see {@link https://docs.monite.com/reference/patch_persons_id} for API call
   *
   * @param personId
   * @param requestBody
   * @returns PersonResponse Successful Response
   * @throws ApiError
   */
  public update(
    personId: string,
    requestBody: OptionalPersonRequest
  ): CancelablePromise<PersonResponse> {
    return request(
      {
        method: 'PATCH',
        url: `/${PERSONS_ENDPOINT}/{person_id}`,
        path: {
          person_id: personId,
        },
        body: requestBody,
      },
      this.openApi
    );
  }

  /**
   * Delete a person
   *
   * @see {@link https://docs.monite.com/reference/delete_persons_id} for API call
   *
   * @param personId
   * @returns void
   * @throws ApiError
   */
  public delete(personId: string): CancelablePromise<void> {
    return request(
      {
        method: 'DELETE',
        url: `/${PERSONS_ENDPOINT}/{person_id}`,
        path: {
          person_id: personId,
        },
      },
      this.openApi
    );
  }
}
