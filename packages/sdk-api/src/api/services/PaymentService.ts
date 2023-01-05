import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import type { ReceivableResponse } from '../models/ReceivableResponse';
import { PaymentsPaymentMethodsEnum } from '../models/PaymentsPaymentMethodsEnum';
import type { PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse } from '../models/PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse';
import type { PaymentLinkPayResponse } from '../models/PaymentLinkPayResponse';
import type { InternalPaymentLinkResponse } from '../models/InternalPaymentLinkResponse';
import type { PaymentsPaymentMethodsCountriesResponse } from '../models/PaymentsPaymentMethodsCountriesResponse';
import type { PaymentsYapilyCountriesCoverageCodes } from '../models/PaymentsYapilyCountriesCoverageCodes';
import type { PaymentsPaymentsPaymentsPaymentsBanksResponse } from '../models/PaymentsPaymentsPaymentsPaymentsBanksResponse';
export default class PaymentService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }
  /**
   * Get Receivable Data by ID
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public getPaymentReceivableById(
    id: string
  ): CancelablePromise<ReceivableResponse> {
    return __request(
      {
        method: 'GET',
        url: `/payment_pages?receivable_id=${id}`,
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
      this.openapiConfig
    );
  }

  /**
   * Init Payment Link
   * Calculate fee for payment_method from payment_link
   * @param paymentMethod
   * @param requestBody
   * @returns PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse Successful Response
   * @throws ApiError
   */

  public getFeeByPaymentMethod(
    id: string,
    requestBody: any
  ): CancelablePromise<PaymentsPaymentMethodsCalculatePaymentsPaymentsFeeResponse> {
    return __request(
      {
        method: 'POST',
        url: `/payment_intents/${id}/calculate_fee`,
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
      this.openapiConfig
    );
  }

  /**
   * Pay Payment Link
   * @param paymentLinkId
   * @param requestBody
   * @returns PaymentLinkPayResponse Successful Response
   * @throws ApiError
   */
  public payByPaymentLinkId(
    paymentLinkId: string,
    requestBody: { payment_method: string }
  ): CancelablePromise<PaymentLinkPayResponse> {
    return __request(
      {
        method: 'POST',
        url: `/payment_links/${paymentLinkId}/pay`,
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
      this.openapiConfig
    );
  }

  /**
   * Get PaymentsPayment Link
   * @param paymentLinkId
   * @returns InternalPaymentLinkResponse Successful Response
   * @throws ApiError
   */
  public getPaymentLinkById(
    paymentLinkId: string
  ): CancelablePromise<InternalPaymentLinkResponse> {
    return __request(
      {
        method: 'GET',
        url: `/payment_links/${paymentLinkId}`,
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
      this.openapiConfig
    );
  }
  /**
   * Get PaymentsPayment Method Countries
   * Gets countries coverage by payment method.
   * @param paymentMethod
   * @returns PaymentsPaymentMethodsCountriesResponse Successful Response
   * @throws ApiError
   */
  public getPaymentMethodCountries(
    paymentMethod: 'sepa_credit'
  ): CancelablePromise<PaymentsPaymentMethodsCountriesResponse> {
    return __request(
      {
        method: 'GET',
        url: '/payment_methods/{payment_method}/countries',
        path: {
          payment_method: paymentMethod,
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
      this.openapiConfig
    );
  }

  /**
   * Get Institutions
   * @param paymentMethod
   * @param country
   * @returns PaymentsPaymentsPaymentsPaymentsBanksResponse Successful Response
   * @throws ApiError
   */
  public getInstitutions(
    paymentMethod: PaymentsPaymentMethodsEnum.SEPA_CREDIT,
    country?: PaymentsYapilyCountriesCoverageCodes
  ): CancelablePromise<PaymentsPaymentsPaymentsPaymentsBanksResponse> {
    return __request(
      {
        method: 'GET',
        url: '/payment_methods/{payment_method}/banks',
        path: {
          payment_method: paymentMethod,
        },
        query: {
          country: country,
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
      this.openapiConfig
    );
  }
}
