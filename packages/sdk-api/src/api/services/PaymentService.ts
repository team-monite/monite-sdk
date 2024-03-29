import type { CancelablePromise } from '../CancelablePromise';
import type { AuthPaymentIntentPayload } from '../models/AuthPaymentIntentPayload';
import type { AuthPaymentIntentResponse } from '../models/AuthPaymentIntentResponse';
import type { BanksResponse } from '../models/BanksResponse';
import type { ConsentPayload } from '../models/ConsentPayload';
import { CreatePaymentLinkRequest } from '../models/CreatePaymentLinkRequest';
import type { InternalPaymentLinkResponse } from '../models/InternalPaymentLinkResponse';
import type { PaymentMethodsConfirmPaymentPayload } from '../models/PaymentMethodsConfirmPaymentPayload';
import type { PaymentMethodsConfirmResponse } from '../models/PaymentMethodsConfirmResponse';
import { PublicPaymentLinkResponse } from '../models/PublicPaymentLinkResponse';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const PAYMENT_LINK_ENDPOINT = '/payment_links';

export const INTERNAL_PAYMENT_LINK_ENDPOINT = '/internal/payment_links';

export const INTERNAL_PAYMENT_INTENT_ENDPOINT = '/internal/payment_intents';

export class PaymentService extends CommonService {
  /**
   * Creates a new payment link
   *
   * @see {@link https://docs.monite.com/reference/post_payment_links} for API call
   */
  public createLink(
    body: CreatePaymentLinkRequest
  ): CancelablePromise<PublicPaymentLinkResponse> {
    return __request(
      {
        method: 'POST',
        url: PAYMENT_LINK_ENDPOINT,
        body,
      },
      this.openApi
    );
  }

  /**
   * Get PaymentsPayment Link
   * @param paymentLinkId
   * @returns InternalPaymentLinkResponse Successful Response
   * @throws ApiError
   */
  public getInternalPaymentLinkById(
    paymentLinkId: string
  ): CancelablePromise<InternalPaymentLinkResponse> {
    return __request(
      {
        method: 'GET',
        url: `${INTERNAL_PAYMENT_LINK_ENDPOINT}/${paymentLinkId}`,
        path: {
          payment_link_id: paymentLinkId,
        },
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Biz logic error`,
          416: `Requested Range Not Satisfiable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /*
   * Get Institutions by Payment Intent
   * @param paymentLinkId
   * @returns InternalPaymentLinkResponse Successful Response
   * @throws ApiError
   */
  public getInternalInstitutions(
    intentId: string
  ): CancelablePromise<BanksResponse> {
    return __request(
      {
        method: 'GET',
        url: `${INTERNAL_PAYMENT_INTENT_ENDPOINT}/${intentId}/banks`,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Biz logic error`,
          416: `Requested Range Not Satisfiable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Authorize Payment Link
   * @param paymentIntentId
   * @param requestBody
   * @returns Successful Response
   * @throws ApiError
   */
  public authorizeInternalPaymentLink(
    paymentIntentId: string,
    requestBody: AuthPaymentIntentPayload
  ): CancelablePromise<AuthPaymentIntentResponse> {
    return __request(
      {
        method: 'POST',
        url: `${INTERNAL_PAYMENT_INTENT_ENDPOINT}/${paymentIntentId}/authorize`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Biz logic error`,
          416: `Requested Range Not Satisfiable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Confirm Payment
   * @param paymentIntentId
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public confirmInternalPayment(
    paymentIntentId: string,
    requestBody: PaymentMethodsConfirmPaymentPayload
  ): CancelablePromise<PaymentMethodsConfirmResponse> {
    return __request(
      {
        method: 'POST',
        url: `${INTERNAL_PAYMENT_INTENT_ENDPOINT}/{payment_intent_id}/confirm_payment`,
        path: {
          payment_intent_id: paymentIntentId,
        },
        body: requestBody,
        mediaType: 'application/json',
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

  /**
   * Create Yapily Payment
   * @param paymentIntentId
   * @param requestBody
   * @returns Successful Response
   * @throws ApiError
   */
  public createYapilyInternalPayment(
    paymentIntentId: string,
    requestBody: ConsentPayload
  ): CancelablePromise<AuthPaymentIntentResponse> {
    return __request(
      {
        method: 'POST',
        url: `${INTERNAL_PAYMENT_INTENT_ENDPOINT}/${paymentIntentId}/payments`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Biz logic error`,
          416: `Requested Range Not Satisfiable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
