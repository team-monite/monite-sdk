/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Price } from './Price';
import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';
import type { UnitResponse } from './UnitResponse';
import type { VatRateResponse } from './VatRateResponse';

export type LineItemProduct = {
  /**
   * Unique ID of the product.
   */
  id: string;
  /**
   * Time at which the product was created. Timestamps follow the ISO 8601 standard.
   */
  created_at: string;
  /**
   * Time at which the product was last updated. Timestamps follow the ISO 8601 standard.
   */
  updated_at: string;
  /**
   * Description of the product.
   */
  description?: string;
  entity_id: string;
  entity_user_id?: string;
  ledger_account_id?: string;
  measure_unit: UnitResponse;
  /**
   * The unique ID reference of the unit used to measure the quantity of this product (e.g. items, meters, kilograms).
   */
  measure_unit_id: string;
  /**
   * Name of the product.
   */
  name: string;
  price?: Price;
  /**
   * The smallest amount allowed for this product.
   */
  smallest_amount?: number;
  /**
   * Specifies whether this offering is a product or service. This may affect the applicable tax rates.
   */
  type?: ProductServiceTypeEnum;
  vat_rate: VatRateResponse;
};
