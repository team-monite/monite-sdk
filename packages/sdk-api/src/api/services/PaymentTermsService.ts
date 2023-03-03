import { OpenAPIConfig } from '../OpenAPI';
import { CancelablePromise } from '../CancelablePromise';
import { PaymentTermsListResponse } from '../models/PaymentTermsListResponse';
import { request as __request } from '../request';

export default class ProductsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Items
   * @returns PaymentTermsListResponse Successful Response
   * @throws ApiError
   */
  public getPaymentTerms(): CancelablePromise<PaymentTermsListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/payment_terms',
        errors: {
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
