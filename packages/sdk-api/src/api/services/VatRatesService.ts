import { OpenAPIConfig } from '../OpenAPI';
import { CancelablePromise } from '../CancelablePromise';
import { ReceivablesVatRateListResponse } from '../models/ReceivablesVatRateListResponse';
import { request as __request } from '../request';

export default class ProductsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Vat Rates
   * @param counterpartId
   * @returns ReceivablesVatRateListResponse Successful Response
   * @throws ApiError
   */
  public getVatRates(
    counterpartId: string
  ): CancelablePromise<ReceivablesVatRateListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/vat_rates',
        query: {
          counterpart_id: counterpartId,
        },
        errors: {
          400: `Bad Request`,
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
