import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import type { ReceivableResponse } from '../models/ReceivableResponse';

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
