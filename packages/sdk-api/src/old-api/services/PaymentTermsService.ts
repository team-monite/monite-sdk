import {
  PaymentTermsCreatePayload,
  PaymentTermsListResponse,
  PaymentTermsResponse,
  PaymentTermsUpdatePayload,
} from '../';
import { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const PAYMENT_TERMS_ENDPOINT = 'payment_terms';

/**
 * Payment terms define the amount of time one has to pay an invoice
 * (for example, 30 days from the invoice issue date).
 * The terms can optionally include discounts for early payments
 * to motivate the customers to pay sooner than the due date.
 *
 * @see {@link https://docs.monite.com/docs/payment-terms} for an API documentation
 */

export class PaymentTermsService extends CommonService {
  /**
   * Get All Items
   *
   * @see {@link https://docs.monite.com/reference/get_payment_terms} for API call
   * @see {@link https://docs.monite.com/docs/payment-terms#list-all-payment-terms-for-receivables} for additional documentation
   *
   * @returns PaymentTermsListResponse Successful Response
   * @throws ApiError
   */
  public getAll(): CancelablePromise<PaymentTermsListResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYMENT_TERMS_ENDPOINT}`,
        errors: {
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
   * Create Item
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/post_payment_terms} for API call
   * @see {@link https://docs.monite.com/docs/payment-terms#step-1-create-payment-terms} for additional documentation
   *
   * @returns PaymentTermsResponse Successful Response
   * @throws ApiError
   */
  public create(
    requestBody: PaymentTermsCreatePayload
  ): CancelablePromise<PaymentTermsResponse> {
    return __request<PaymentTermsResponse>(
      {
        method: 'POST',
        url: `/${PAYMENT_TERMS_ENDPOINT}`,
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
   * Get Item By Id
   *
   * @param {string} paymentTermsId Payment Terms identifier
   *
   * @see {@link https://docs.monite.com/reference/get_payment_terms_id} for API call
   *
   * @returns PaymentTermsResponse Successful Response
   * @throws ApiError
   */
  public getById(
    paymentTermsId: string
  ): CancelablePromise<PaymentTermsResponse> {
    return __request<PaymentTermsResponse>(
      {
        method: 'GET',
        url: `/${PAYMENT_TERMS_ENDPOINT}/${paymentTermsId}`,
        errors: {
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
   * Delete Item By Id
   *
   * @param {string} paymentTermsId Payment Terms identifier
   *
   * @see {@link https://docs.monite.com/reference/delete_payment_terms_id} for API call
   *
   * @returns void
   * @throws ApiError
   */
  public deleteById(paymentTermsId: string): CancelablePromise<void> {
    return __request<void>(
      {
        method: 'DELETE',
        url: `/${PAYMENT_TERMS_ENDPOINT}/${paymentTermsId}`,
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
   * Update Item By Id
   * @param {string} paymentTermsId Payment Terms identifier
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/patch_payment_terms_id} for API call
   *
   * @returns PaymentTermsResponse Successful Response
   * @throws ApiError
   */
  public updateById(
    paymentTermsId: string,
    requestBody: PaymentTermsUpdatePayload
  ): CancelablePromise<PaymentTermsResponse> {
    return __request<PaymentTermsResponse>(
      {
        method: 'PATCH',
        url: `/${PAYMENT_TERMS_ENDPOINT}/${paymentTermsId}`,
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
