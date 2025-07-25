import { components } from '@/api';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '../../validation';

/**
 * Invoice preview data structure that replaces the watch function
 * This makes the component independent of React Hook Form implementation
 */
export interface InvoicePreviewData {
  id?: string;
  document_id?: string;
  payment_terms_id?: string;
  line_items: CreateReceivablesFormBeforeValidationLineItemProps[];
  fulfillment_date?: string | Date | null;
  memo?: string;
  entity_bank_account_id?: string;
  vat_mode?: 'inclusive' | 'exclusive';
}

/**
 * Common props for invoice preview components
 */
export interface InvoicePreviewBaseProps {
  address?: components['schemas']['CounterpartAddress'];
  counterpart?: components['schemas']['CounterpartResponse'];
  counterpartVats?: components['schemas']['CounterpartVatIDResourceList'];
  currency?: components['schemas']['CurrencyEnum'];
  invoiceData: InvoicePreviewData;
  entityData?: components['schemas']['EntityResponse'];
  entityVatIds?: components['schemas']['EntityVatIDResourceList'];
  isNonVatSupported: boolean;
  paymentTerms?: components['schemas']['PaymentTermsListResponse'];
  templateName?: string;
  measureUnits?: components['schemas']['UnitResponse'][];
}
