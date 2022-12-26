import { OpenAPIConfig } from '../OpenAPI';
import { CancelablePromise } from '../CancelablePromise';
import { ReceivablesUnitListResponse } from '../models/ReceivablesUnitListResponse';
import { request as __request } from '../request';

export default class ProductsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Units
   * @returns ReceivablesUnitListResponse Successful Response
   * @throws ApiError
   */
  public getUnits(): CancelablePromise<ReceivablesUnitListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/measure_units',
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
