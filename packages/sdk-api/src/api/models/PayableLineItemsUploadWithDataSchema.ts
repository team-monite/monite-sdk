/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PayableLineItemsUploadWithDataSchema = {
    /**
     * Name of the product.
     */
    name: string;
    /**
     * Description of the product.
     */
    description?: string;
    /**
     * The quantity of each of the goods, materials, or services listed in the payable.
     */
    quantity: number;
    /**
     * The actual price of the product.
     */
    price: number;
    /**
     * VAT rate in percent [minor units](https://docs.monite.com/docs/currencies#minor-units). Example: 12.5% is 1250.
     */
    vat: number;
    /**
     * The subtotal (excluding VAT), in [minor units](https://docs.monite.com/docs/currencies#minor-units).
     */
    subtotal: number;
};

