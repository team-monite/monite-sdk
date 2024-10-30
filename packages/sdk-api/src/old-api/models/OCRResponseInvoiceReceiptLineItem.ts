/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OCRResponseInvoiceReceiptLineItem = {
  /**
   * OCR Id of line item
   */
  line_item_ocr_id?: string;
  /**
   * Human-readable line item description
   */
  description?: string;
  /**
   * Quanity
   */
  quantity?: number;
  /**
   * Price in  cents/eurocents
   */
  unit_price?: number;
  /**
   * Unit
   */
  unit?: string;
  /**
   * VAT Percent minor units. Example: 12.5% is 1250.
   */
  vat_percentage?: number;
  /**
   * Total excl VAT
   */
  total_excl_vat?: number;
};
