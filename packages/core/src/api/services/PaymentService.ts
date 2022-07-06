import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class PaymentService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Receivable Pdf link by Id
   * @returns string Successful Response
   * @throws ApiError
   */
  public getReceivableByIdPdfLink(
    receivableId: string
  ): CancelablePromise<string> {
    return __request(
      {
        method: 'GET',
        url: `/receivables/${receivableId}/pdf_link`,
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
