import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import type { ReceivableResponse } from '../models/ReceivableResponse';
import type { PaymentReceivableRequest } from '../models/PaymentReceivableRequest';

export default class PaymentService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = {
      ...config,
      //TODO: it is temporarily URL
      BASE: 'https://api-gateway.dev.monite.com/v1',
    };
  }

  /**
   * Get Stripe Client Secret Key
   * @returns string Successful Response
   * @throws ApiError
   */
  public getStripeClientSecret(
    request: PaymentReceivableRequest
  ): CancelablePromise<{ client_secret: string }> {
    return __request(
      {
        method: 'POST',
        url: '/payment_intents',
        body: request,
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
}
