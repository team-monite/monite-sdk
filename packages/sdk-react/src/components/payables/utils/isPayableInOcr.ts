import { components } from '@/api';
import {
  OcrStatusEnum,
  PayableResponseSchema,
  SourceOfPayableDataEnum,
} from '@monite/sdk-api';

/** Returns true if the payable is in OCR processing.
 *
 * @param {PayableResponseSchema} payable - payable to check
 *
 * @returns {Boolean} - true if payable is in OCR processing
 */
export const isPayableInOCRProcessing = (
  payable: components['schemas']['PayableResponseSchema']
): boolean => {
  return (
    payable.source_of_payable_data === SourceOfPayableDataEnum.OCR &&
    payable.ocr_status === OcrStatusEnum.PROCESSING
  );
};
