import { UnitListResponse, UnitRequest, UnitResponse, UnitUpdate } from '../';
import { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const MEASURE_UNITS_ENDPOINT = 'measure_units';

/**
 * Measure Units Service.
 * A measure unit is the standard unit used to measure the quantity of a product.
 * Examples: meters, kilograms, pieces, hours.
 *
 * @see {@link https://docs.monite.com/docs/manage-products#manage-measure-units} for an API documentation
 *
 */

export class MeasureUnitsService extends CommonService {
  /**
   * Get Units
   *
   * @see {@link https://docs.monite.com/reference/get_measure_units} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#list-all-products} for additional documentation
   *
   * @returns ReceivablesUnitListResponse Successful Response
   * @throws ApiError
   */
  public getUnits(): CancelablePromise<UnitListResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${MEASURE_UNITS_ENDPOINT}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Create Unit
   *
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/post_measure_units} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#manage-measure-units} for additional documentation
   *
   * @returns UnitResponse Successful Response
   * @throws ApiError
   */
  public createMeasureUnit(
    requestBody: UnitRequest
  ): CancelablePromise<UnitResponse> {
    return __request<UnitResponse>(
      {
        method: 'POST',
        url: `/${MEASURE_UNITS_ENDPOINT}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get Unit By Id
   * @param {string} unitId Unit identifier
   *
   * @see {@link https://docs.monite.com/reference/get_measure_units_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#retrieve-a-measure-unit} for additional documentation
   *
   * @returns UnitResponse Successful Response
   * @throws ApiError
   */
  public getById(unitId: string): CancelablePromise<UnitResponse> {
    return __request<UnitResponse>(
      {
        method: 'GET',
        url: `/${MEASURE_UNITS_ENDPOINT}/${unitId}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Delete Unit By Id
   *
   * @param {string} unitId Unit identifier
   *
   * @see {@link https://docs.monite.com/reference/delete_measure_units_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#delete-a-measure-unit} for additional documentation
   *
   * @returns void
   * @throws ApiError
   */
  public deleteById(unitId: string): CancelablePromise<void> {
    return __request<void>(
      {
        method: 'DELETE',
        url: `/${MEASURE_UNITS_ENDPOINT}/${unitId}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Update Unit By Id
   *
   * @param {string} unitId Unit identifier
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/patch_measure_units_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#update-a-measure-unit} for additional documentation
   *
   * @returns UnitResponse Successful Response
   * @throws ApiError
   */
  public updateById(
    unitId: string,
    requestBody: UnitUpdate
  ): CancelablePromise<UnitResponse> {
    return __request<UnitResponse>(
      {
        method: 'PATCH',
        url: `/${MEASURE_UNITS_ENDPOINT}/${unitId}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
