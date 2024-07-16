import type { components } from '@/api';

export function isInvoice(
  receivable: components['schemas']['ReceivableResponse']
): receivable is components['schemas']['InvoiceResponsePayload'] {
  return receivable.type === 'invoice';
}

export function isQuote(
  receivable: components['schemas']['ReceivableResponse']
): receivable is components['schemas']['QuoteResponsePayload'] {
  return receivable.type === 'quote';
}

export function isCreditNote(
  receivable: components['schemas']['ReceivableResponse']
): receivable is components['schemas']['CreditNoteResponsePayload'] {
  return receivable.type === 'credit_note';
}
