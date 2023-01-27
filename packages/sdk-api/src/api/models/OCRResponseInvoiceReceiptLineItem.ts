/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OCRResponseInvoiceReceiptLineItem = {
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
     * VAT Percent minor units. Example: 12.5% is 1250.
     */
    vat_percentage?: number;
    /**
     * Total excl VAT
     */
    total_excl_vat?: number;
};

