/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains information about a text block or line extracted from an uploaded document by OCR.
 */
export type Item = {
    /**
     * The text as recognized by OCR.
     */
    text: string;
    /**
     * OCR confidence score - the estimated accuracy percentage of character recognition of the extracted text, from 0 to 100%.
     */
    confidence: number;
    /**
     * If the `text` value is identified as a currency amount or a date, `processed_text` contains this value converted to a common format:
     *
     * * Currency amounts (such as the total, subtotal, tax/VAT, line item prices) are converted to numbers with the currency character removed. For example, "€1,125.00" becomes 1125.0.* Dates are converted to the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, `YYYY-MM-DDThh:mm:ss`. For example, "26/3/2021" becomes "2021-03-26T00:00:00".
     *
     * If `text` is not a currency amount or a date, `processed_text` is `null`.
     */
    processed_text?: (number | string);
};

