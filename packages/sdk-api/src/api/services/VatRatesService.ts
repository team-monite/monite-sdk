import { OpenAPIConfig } from '../OpenAPI';
import { CancelablePromise } from '../CancelablePromise';
import { VatRateListResponse } from '../models/VatRateListResponse';
import { request as __request } from '../request';

export default class ProductsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Vat Rates
   * @param counterpartId
   * @returns VatRateListResponse Successful Response
   * @throws ApiError
   */
  public getVatRates(
    counterpartId: string
  ): CancelablePromise<VatRateListResponse> {
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
