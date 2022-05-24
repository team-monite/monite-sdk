import { CancelablePromise } from '../CancelablePromise';
import { VatRateListResponse } from '../models/VatRateListResponse';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const VAT_RATES_ENDPOINT = 'vat_rates';

export interface VatRatesServiceGetVatRatesRequest {
  /**
   * Counterpart ID
   *
   * @description: format: uuid
   */
  counterpartId?: string;
  counterpartVatId?: string;
  entityVatId?: string;
  productType?: 'product' | 'service';
}

export class VatRatesService extends CommonService {
  /**
   * Get Vat Rates
   *
   * @see {@link https://docs.monite.com/reference/get_vat_rates} API reference
   *
   * @returns VatRateListResponse Successful Response
   * @throws ApiError
   */
  public getAll(
    params?: VatRatesServiceGetVatRatesRequest
  ): CancelablePromise<VatRateListResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${VAT_RATES_ENDPOINT}`,
        query: {
          counterpart_id: params?.counterpartId,
          counterpart_vat_id_id: params?.counterpartVatId,
          entity_vat_id_id: params?.entityVatId,
          product_type: params?.productType,
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
      this.openApi
    );
  }
}
